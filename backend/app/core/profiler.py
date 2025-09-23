"""
Performance profiling system for identifying bottlenecks and optimizing code.
Essential for maintaining high performance with 450 trucks sending data.
"""

import cProfile
import pstats
import io
import time
import threading
import psutil
import os
from typing import Dict, Any, List, Optional, Callable
from functools import wraps
from datetime import datetime, timedelta
from collections import defaultdict, deque
from dataclasses import dataclass
from loguru import logger
import asyncio

@dataclass
class PerformanceProfile:
    """Represents a performance profile result."""
    function_name: str
    total_time: float
    cumulative_time: float
    calls: int
    avg_time_per_call: float
    percentage: float
    timestamp: datetime

@dataclass
class SystemMetrics:
    """System performance metrics."""
    cpu_percent: float
    memory_percent: float
    memory_used_mb: float
    memory_available_mb: float
    disk_usage_percent: float
    timestamp: datetime

class PerformanceProfiler:
    """Comprehensive performance profiling system."""
    
    def __init__(self, max_profiles: int = 100):
        self.profiles: deque = deque(maxlen=max_profiles)
        self.function_times: Dict[str, List[float]] = defaultdict(list)
        self.system_metrics: deque = deque(maxlen=1000)
        self._lock = threading.Lock()
        self._profiling_enabled = True
        
        # Start system metrics collection
        self._start_system_monitoring()
    
    def profile_function(self, func: Callable) -> Callable:
        """Decorator to profile function performance."""
        @wraps(func)
        def sync_wrapper(*args, **kwargs):
            if not self._profiling_enabled:
                return func(*args, **kwargs)
            
            start_time = time.time()
            profiler = cProfile.Profile()
            
            try:
                profiler.enable()
                result = func(*args, **kwargs)
                profiler.disable()
                
                end_time = time.time()
                execution_time = end_time - start_time
                
                # Store timing data
                with self._lock:
                    self.function_times[func.__name__].append(execution_time)
                
                # Generate profile
                self._generate_profile(func.__name__, profiler, execution_time)
                
                return result
                
            except Exception as e:
                profiler.disable()
                logger.error(f"Error profiling function {func.__name__}: {e}")
                raise e
        
        @wraps(func)
        async def async_wrapper(*args, **kwargs):
            if not self._profiling_enabled:
                return await func(*args, **kwargs)
            
            start_time = time.time()
            
            try:
                result = await func(*args, **kwargs)
                end_time = time.time()
                execution_time = end_time - start_time
                
                # Store timing data
                with self._lock:
                    self.function_times[func.__name__].append(execution_time)
                
                return result
                
            except Exception as e:
                logger.error(f"Error profiling async function {func.__name__}: {e}")
                raise e
        
        return async_wrapper if asyncio.iscoroutinefunction(func) else sync_wrapper
    
    def _generate_profile(self, function_name: str, profiler: cProfile.Profile, execution_time: float):
        """Generate and store performance profile."""
        try:
            # Get profile statistics
            s = io.StringIO()
            ps = pstats.Stats(profiler, stream=s).sort_stats('cumulative')
            ps.print_stats(10)  # Top 10 functions
            
            profile_data = s.getvalue()
            
            # Parse profile data to extract key metrics
            lines = profile_data.split('\n')
            total_calls = 0
            cumulative_time = 0.0
            
            for line in lines:
                if 'function calls' in line and 'primitive calls' in line:
                    # Extract total calls
                    parts = line.split()
                    if len(parts) > 0:
                        total_calls = int(parts[0])
                elif line.strip() and not line.startswith(' ') and 'function' not in line:
                    # Parse function line
                    parts = line.split()
                    if len(parts) >= 4:
                        try:
                            calls = int(parts[0])
                            cumulative = float(parts[3])
                            cumulative_time = max(cumulative_time, cumulative)
                        except (ValueError, IndexError):
                            continue
            
            # Create profile record
            profile = PerformanceProfile(
                function_name=function_name,
                total_time=execution_time,
                cumulative_time=cumulative_time,
                calls=total_calls,
                avg_time_per_call=execution_time / max(total_calls, 1),
                percentage=100.0,  # Will be calculated relative to other functions
                timestamp=datetime.now()
            )
            
            with self._lock:
                self.profiles.append(profile)
            
            logger.debug(f"Profiled {function_name}: {execution_time:.4f}s, {total_calls} calls")
            
        except Exception as e:
            logger.error(f"Error generating profile for {function_name}: {e}")
    
    def _start_system_monitoring(self):
        """Start background system metrics collection."""
        def collect_metrics():
            while True:
                try:
                    # CPU usage
                    cpu_percent = psutil.cpu_percent(interval=1)
                    
                    # Memory usage
                    memory = psutil.virtual_memory()
                    memory_percent = memory.percent
                    memory_used_mb = memory.used / (1024 * 1024)
                    memory_available_mb = memory.available / (1024 * 1024)
                    
                    # Disk usage
                    disk = psutil.disk_usage('/')
                    disk_usage_percent = (disk.used / disk.total) * 100
                    
                    metrics = SystemMetrics(
                        cpu_percent=cpu_percent,
                        memory_percent=memory_percent,
                        memory_used_mb=memory_used_mb,
                        memory_available_mb=memory_available_mb,
                        disk_usage_percent=disk_usage_percent,
                        timestamp=datetime.now()
                    )
                    
                    with self._lock:
                        self.system_metrics.append(metrics)
                    
                    time.sleep(30)  # Collect every 30 seconds
                    
                except Exception as e:
                    logger.error(f"Error collecting system metrics: {e}")
                    time.sleep(60)  # Wait longer on error
        
        # Start monitoring thread
        monitor_thread = threading.Thread(target=collect_metrics, daemon=True)
        monitor_thread.start()
    
    def get_function_stats(self, function_name: str) -> Dict[str, Any]:
        """Get performance statistics for a specific function."""
        with self._lock:
            times = self.function_times.get(function_name, [])
        
        if not times:
            return {
                'function_name': function_name,
                'call_count': 0,
                'avg_time': 0,
                'min_time': 0,
                'max_time': 0,
                'total_time': 0
            }
        
        return {
            'function_name': function_name,
            'call_count': len(times),
            'avg_time': sum(times) / len(times),
            'min_time': min(times),
            'max_time': max(times),
            'total_time': sum(times),
            'recent_times': times[-10:]  # Last 10 calls
        }
    
    def get_slowest_functions(self, limit: int = 10) -> List[Dict[str, Any]]:
        """Get the slowest functions by average execution time."""
        function_stats = []
        
        with self._lock:
            for func_name, times in self.function_times.items():
                if times:
                    avg_time = sum(times) / len(times)
                    function_stats.append({
                        'function_name': func_name,
                        'avg_time': avg_time,
                        'call_count': len(times),
                        'total_time': sum(times)
                    })
        
        # Sort by average time (descending)
        function_stats.sort(key=lambda x: x['avg_time'], reverse=True)
        
        return function_stats[:limit]
    
    def get_system_metrics_summary(self) -> Dict[str, Any]:
        """Get system metrics summary."""
        with self._lock:
            if not self.system_metrics:
                return {'error': 'No system metrics available'}
            
            recent_metrics = list(self.system_metrics)[-10:]  # Last 10 measurements
        
        # Calculate averages
        avg_cpu = sum(m.cpu_percent for m in recent_metrics) / len(recent_metrics)
        avg_memory = sum(m.memory_percent for m in recent_metrics) / len(recent_metrics)
        avg_disk = sum(m.disk_usage_percent for m in recent_metrics) / len(recent_metrics)
        
        # Get current values
        current = recent_metrics[-1]
        
        return {
            'current': {
                'cpu_percent': current.cpu_percent,
                'memory_percent': current.memory_percent,
                'memory_used_mb': current.memory_used_mb,
                'memory_available_mb': current.memory_available_mb,
                'disk_usage_percent': current.disk_usage_percent
            },
            'averages': {
                'cpu_percent': round(avg_cpu, 2),
                'memory_percent': round(avg_memory, 2),
                'disk_usage_percent': round(avg_disk, 2)
            },
            'timestamp': current.timestamp.isoformat()
        }
    
    def get_performance_report(self) -> Dict[str, Any]:
        """Get comprehensive performance report."""
        with self._lock:
            total_profiles = len(self.profiles)
            total_functions = len(self.function_times)
        
        # Get slowest functions
        slowest_functions = self.get_slowest_functions(10)
        
        # Get system metrics
        system_metrics = self.get_system_metrics_summary()
        
        # Calculate performance trends
        performance_trends = self._calculate_performance_trends()
        
        return {
            'summary': {
                'total_profiles': total_profiles,
                'total_functions_monitored': total_functions,
                'profiling_enabled': self._profiling_enabled
            },
            'slowest_functions': slowest_functions,
            'system_metrics': system_metrics,
            'performance_trends': performance_trends,
            'timestamp': datetime.now().isoformat()
        }
    
    def _calculate_performance_trends(self) -> Dict[str, Any]:
        """Calculate performance trends over time."""
        with self._lock:
            recent_profiles = list(self.profiles)[-20:]  # Last 20 profiles
        
        if len(recent_profiles) < 2:
            return {'trend': 'insufficient_data'}
        
        # Calculate trend for total execution time
        recent_times = [p.total_time for p in recent_profiles]
        older_times = recent_times[:len(recent_times)//2]
        newer_times = recent_times[len(recent_times)//2:]
        
        if older_times and newer_times:
            avg_older = sum(older_times) / len(older_times)
            avg_newer = sum(newer_times) / len(newer_times)
            
            if avg_newer > avg_older * 1.1:
                trend = 'degrading'
            elif avg_newer < avg_older * 0.9:
                trend = 'improving'
            else:
                trend = 'stable'
        else:
            trend = 'stable'
        
        return {
            'trend': trend,
            'recent_avg_time': sum(recent_times) / len(recent_times),
            'samples_analyzed': len(recent_profiles)
        }
    
    def enable_profiling(self):
        """Enable performance profiling."""
        self._profiling_enabled = True
        logger.info("Performance profiling enabled")
    
    def disable_profiling(self):
        """Disable performance profiling."""
        self._profiling_enabled = False
        logger.info("Performance profiling disabled")
    
    def clear_profiles(self):
        """Clear all stored profiles."""
        with self._lock:
            self.profiles.clear()
            self.function_times.clear()
        logger.info("Performance profiles cleared")

class FeatureEngineeringProfiler:
    """Specialized profiler for feature engineering operations."""
    
    def __init__(self, profiler: PerformanceProfiler):
        self.profiler = profiler
        self.feature_times: Dict[str, List[float]] = defaultdict(list)
    
    def profile_feature_engineering(self, func: Callable) -> Callable:
        """Profile feature engineering functions."""
        @wraps(func)
        def wrapper(*args, **kwargs):
            start_time = time.time()
            
            try:
                result = func(*args, **kwargs)
                end_time = time.time()
                execution_time = end_time - start_time
                
                # Store feature engineering specific metrics
                self.feature_times[func.__name__].append(execution_time)
                
                # Log feature engineering completion
                logger.info(f"Feature engineering {func.__name__} completed in {execution_time:.4f}s")
                
                return result
                
            except Exception as e:
                logger.error(f"Feature engineering {func.__name__} failed: {e}")
                raise e
        
        return wrapper
    
    def get_feature_engineering_stats(self) -> Dict[str, Any]:
        """Get feature engineering performance statistics."""
        stats = {}
        
        for func_name, times in self.feature_times.items():
            if times:
                stats[func_name] = {
                    'call_count': len(times),
                    'avg_time': sum(times) / len(times),
                    'min_time': min(times),
                    'max_time': max(times),
                    'total_time': sum(times)
                }
        
        return stats

# Global profiler instances
performance_profiler = PerformanceProfiler()
feature_profiler = FeatureEngineeringProfiler(performance_profiler)

# Utility decorators
def profile_performance(func: Callable) -> Callable:
    """Decorator to profile function performance."""
    return performance_profiler.profile_function(func)

def profile_feature_engineering(func: Callable) -> Callable:
    """Decorator to profile feature engineering functions."""
    return feature_profiler.profile_feature_engineering(func)

# Utility functions
def get_performance_summary() -> Dict[str, Any]:
    """Get performance summary."""
    return performance_profiler.get_performance_report()

def get_slowest_functions(limit: int = 5) -> List[Dict[str, Any]]:
    """Get slowest functions."""
    return performance_profiler.get_slowest_functions(limit)

def get_system_metrics() -> Dict[str, Any]:
    """Get system metrics."""
    return performance_profiler.get_system_metrics_summary()

def enable_profiling():
    """Enable performance profiling."""
    performance_profiler.enable_profiling()

def disable_profiling():
    """Disable performance profiling."""
    performance_profiler.disable_profiling()
