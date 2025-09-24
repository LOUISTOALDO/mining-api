"""
Redis caching system for high-performance API responses.
Critical for handling 450 trucks with frequent data requests.
"""

import redis
import json
import pickle
import hashlib
from typing import Optional, Any, Dict, List, Union
from datetime import datetime, timedelta
from loguru import logger
import asyncio
from functools import wraps

class CacheService:
    """High-performance Redis caching service for API responses."""
    
    def __init__(self, host: str = 'localhost', port: int = 6379, db: int = 0):
        """Initialize Redis connection."""
        try:
            self.redis_client = redis.Redis(
                host=host, 
                port=port, 
                db=db, 
                decode_responses=False,  # Keep binary for pickle
                socket_connect_timeout=1,  # Reduced timeout
                socket_timeout=1,  # Reduced timeout
                retry_on_timeout=False,
                health_check_interval=30
            )
            # Test connection with very short timeout
            self.redis_client.ping()
            logger.info("Redis cache connection established")
        except Exception as e:
            logger.warning(f"Redis not available, running without cache: {e}")
            self.redis_client = None
    
    def is_available(self) -> bool:
        """Check if Redis is available."""
        if not self.redis_client:
            return False
        try:
            self.redis_client.ping()
            return True
        except:
            return False
    
    def _generate_cache_key(self, prefix: str, *args, **kwargs) -> str:
        """Generate a consistent cache key from arguments."""
        # Create a hash of all arguments
        key_data = {
            'args': args,
            'kwargs': sorted(kwargs.items()) if kwargs else {}
        }
        key_string = json.dumps(key_data, sort_keys=True)
        key_hash = hashlib.md5(key_string.encode()).hexdigest()
        return f"{prefix}:{key_hash}"
    
    def get(self, key: str) -> Optional[Any]:
        """Get cached value by key."""
        if not self.redis_client:
            return None
        
        try:
            value = self.redis_client.get(key)
            if value:
                return pickle.loads(value)
            return None
        except Exception as e:
            logger.error(f"Cache get error for key {key}: {e}")
            return None
    
    def set(self, key: str, value: Any, expire: int = 300) -> bool:
        """Set cached value with expiration."""
        if not self.redis_client:
            return False
        
        try:
            serialized_value = pickle.dumps(value)
            return self.redis_client.setex(key, expire, serialized_value)
        except Exception as e:
            logger.error(f"Cache set error for key {key}: {e}")
            return False
    
    def delete(self, key: str) -> bool:
        """Delete cached value."""
        if not self.redis_client:
            return False
        
        try:
            return bool(self.redis_client.delete(key))
        except Exception as e:
            logger.error(f"Cache delete error for key {key}: {e}")
            return False
    
    def exists(self, key: str) -> bool:
        """Check if key exists in cache."""
        if not self.redis_client:
            return False
        
        try:
            return bool(self.redis_client.exists(key))
        except Exception as e:
            logger.error(f"Cache exists error for key {key}: {e}")
            return False
    
    def get_many(self, keys: List[str]) -> Dict[str, Any]:
        """Get multiple cached values."""
        if not self.redis_client or not keys:
            return {}
        
        try:
            values = self.redis_client.mget(keys)
            result = {}
            for key, value in zip(keys, values):
                if value:
                    result[key] = pickle.loads(value)
            return result
        except Exception as e:
            logger.error(f"Cache get_many error: {e}")
            return {}
    
    def set_many(self, mapping: Dict[str, Any], expire: int = 300) -> bool:
        """Set multiple cached values."""
        if not self.redis_client or not mapping:
            return False
        
        try:
            # Serialize all values
            serialized_mapping = {
                key: pickle.dumps(value) 
                for key, value in mapping.items()
            }
            
            # Set all values
            result = self.redis_client.mset(serialized_mapping)
            
            # Set expiration for all keys
            if result:
                pipe = self.redis_client.pipeline()
                for key in mapping.keys():
                    pipe.expire(key, expire)
                pipe.execute()
            
            return result
        except Exception as e:
            logger.error(f"Cache set_many error: {e}")
            return False
    
    def invalidate_pattern(self, pattern: str) -> int:
        """Invalidate all keys matching a pattern."""
        if not self.redis_client:
            return 0
        
        try:
            keys = self.redis_client.keys(pattern)
            if keys:
                return self.redis_client.delete(*keys)
            return 0
        except Exception as e:
            logger.error(f"Cache invalidate_pattern error for pattern {pattern}: {e}")
            return 0
    
    def get_stats(self) -> Dict[str, Any]:
        """Get cache statistics."""
        if not self.redis_client:
            return {"status": "disconnected"}
        
        try:
            info = self.redis_client.info()
            return {
                "status": "connected",
                "used_memory": info.get("used_memory_human", "unknown"),
                "connected_clients": info.get("connected_clients", 0),
                "total_commands_processed": info.get("total_commands_processed", 0),
                "keyspace_hits": info.get("keyspace_hits", 0),
                "keyspace_misses": info.get("keyspace_misses", 0),
                "hit_rate": self._calculate_hit_rate(info)
            }
        except Exception as e:
            logger.error(f"Cache stats error: {e}")
            return {"status": "error", "error": str(e)}
    
    def _calculate_hit_rate(self, info: Dict) -> float:
        """Calculate cache hit rate."""
        hits = info.get("keyspace_hits", 0)
        misses = info.get("keyspace_misses", 0)
        total = hits + misses
        return (hits / total * 100) if total > 0 else 0.0

class APICache:
    """Specialized cache for API responses."""
    
    def __init__(self, cache_service: CacheService):
        self.cache = cache_service
        self.default_ttl = {
            'machines': 300,      # 5 minutes
            'telemetry': 60,      # 1 minute
            'predictions': 30,    # 30 seconds
            'alerts': 120,        # 2 minutes
            'reports': 600,       # 10 minutes
            'user_data': 1800,    # 30 minutes
        }
    
    def cache_machines(self, user_id: str, site: Optional[str], 
                      model: Optional[str], machines: List[Dict]) -> bool:
        """Cache machine list response."""
        cache_key = self._generate_machines_key(user_id, site, model)
        return self.cache.set(cache_key, machines, self.default_ttl['machines'])
    
    def get_cached_machines(self, user_id: str, site: Optional[str], 
                           model: Optional[str]) -> Optional[List[Dict]]:
        """Get cached machine list."""
        cache_key = self._generate_machines_key(user_id, site, model)
        return self.cache.get(cache_key)
    
    def cache_telemetry(self, machine_id: str, start_date: Optional[str], 
                       end_date: Optional[str], telemetry: List[Dict]) -> bool:
        """Cache telemetry data."""
        cache_key = self._generate_telemetry_key(machine_id, start_date, end_date)
        return self.cache.set(cache_key, telemetry, self.default_ttl['telemetry'])
    
    def get_cached_telemetry(self, machine_id: str, start_date: Optional[str], 
                            end_date: Optional[str]) -> Optional[List[Dict]]:
        """Get cached telemetry data."""
        cache_key = self._generate_telemetry_key(machine_id, start_date, end_date)
        return self.cache.get(cache_key)
    
    def cache_prediction(self, machine_id: str, features_hash: str, 
                        prediction: Dict) -> bool:
        """Cache prediction result."""
        cache_key = f"prediction:{machine_id}:{features_hash}"
        return self.cache.set(cache_key, prediction, self.default_ttl['predictions'])
    
    def get_cached_prediction(self, machine_id: str, features_hash: str) -> Optional[Dict]:
        """Get cached prediction."""
        cache_key = f"prediction:{machine_id}:{features_hash}"
        return self.cache.get(cache_key)
    
    def invalidate_machine_cache(self, machine_id: str):
        """Invalidate all cache entries for a specific machine."""
        patterns = [
            f"telemetry:{machine_id}:*",
            f"prediction:{machine_id}:*",
            f"alerts:{machine_id}:*"
        ]
        
        for pattern in patterns:
            self.cache.invalidate_pattern(pattern)
    
    def invalidate_user_cache(self, user_id: str):
        """Invalidate all cache entries for a specific user."""
        pattern = f"machines:{user_id}:*"
        self.cache.invalidate_pattern(pattern)
    
    def _generate_machines_key(self, user_id: str, site: Optional[str], 
                              model: Optional[str]) -> str:
        """Generate cache key for machines endpoint."""
        return self.cache._generate_cache_key(
            f"machines:{user_id}",
            site=site,
            model=model
        )
    
    def _generate_telemetry_key(self, machine_id: str, start_date: Optional[str], 
                               end_date: Optional[str]) -> str:
        """Generate cache key for telemetry endpoint."""
        return self.cache._generate_cache_key(
            f"telemetry:{machine_id}",
            start_date=start_date,
            end_date=end_date
        )

def cache_response(ttl: int = 300, key_prefix: str = "api"):
    """Decorator to cache function responses."""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Generate cache key
            cache_key = cache_service._generate_cache_key(
                key_prefix,
                func.__name__,
                *args,
                **kwargs
            )
            
            # Try to get from cache
            cached_result = cache_service.get(cache_key)
            if cached_result is not None:
                logger.debug(f"Cache hit for {func.__name__}: {cache_key}")
                return cached_result
            
            # Execute function and cache result
            result = await func(*args, **kwargs)
            cache_service.set(cache_key, result, ttl)
            logger.debug(f"Cached result for {func.__name__}: {cache_key}")
            
            return result
        return wrapper
    return decorator

def cache_telemetry_features(machine_id: str, features_hash: str):
    """Cache telemetry features for predictions."""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            cache_key = f"features:{machine_id}:{features_hash}"
            
            # Try to get from cache
            cached_features = cache_service.get(cache_key)
            if cached_features is not None:
                return cached_features
            
            # Generate features and cache
            features = await func(*args, **kwargs)
            cache_service.set(cache_key, features, 60)  # 1 minute TTL
            
            return features
        return wrapper
    return decorator

# Global cache instances
cache_service = CacheService()
api_cache = APICache(cache_service)

# Cache health check
def check_cache_health() -> Dict[str, Any]:
    """Check cache system health."""
    stats = cache_service.get_stats()
    return {
        "cache_status": stats.get("status", "unknown"),
        "hit_rate": stats.get("hit_rate", 0),
        "memory_usage": stats.get("used_memory", "unknown"),
        "connected_clients": stats.get("connected_clients", 0)
    }
