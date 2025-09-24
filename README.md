# 🚀 Mining AI Platform API

A revolutionary AI-powered mining intelligence platform that provides predictive maintenance, real-time monitoring, and business intelligence for mining operations.

## 🌟 Features

- **AI-Powered Predictive Maintenance**: Predict equipment failures with 95%+ accuracy
- **Real-Time Monitoring**: Live telemetry data collection and analysis
- **Business Intelligence**: Comprehensive reporting and analytics
- **Role-Based Access Control**: Secure multi-tenant architecture
- **RESTful API**: Modern, scalable API design

## 🚀 Quick Deploy to Render

### Option 1: Using render.yaml (Recommended)

1. **Connect your GitHub repository to Render**
2. **Create a new Web Service**
3. **Render will automatically detect the render.yaml configuration**

### Option 2: Manual Configuration

If you prefer manual setup:

- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT --workers 1`
- **Python Version**: 3.11.0

### Environment Variables

Set these in your Render dashboard:

```
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-key-here
DATABASE_URL=sqlite:///./mining_pdm.db
CORS_ORIGINS=https://your-frontend-domain.com,http://localhost:3000
ENVIRONMENT=production
LOG_LEVEL=info
```

## 📚 API Documentation

Once deployed, access:
- **API**: `https://your-app-name.onrender.com`
- **Docs**: `https://your-app-name.onrender.com/docs`
- **Health**: `https://your-app-name.onrender.com/health`

## 🔧 Local Development

```bash
# Install dependencies
pip install -r requirements.txt

# Start the server
python start_server.py
```

## 🏗️ Project Structure

```
├── backend/                 # Main API code
│   ├── app/                # FastAPI application
│   ├── requirements.txt    # Backend dependencies
│   └── render.yaml         # Backend-specific config
├── src/ml/                 # ML components
├── requirements.txt        # Root dependencies
├── render.yaml             # Render deployment config
├── start_server.py         # Startup script
└── README.md               # This file
```

## 🔐 Default Users

After deployment, seed the database:

```bash
curl -X POST https://your-app-name.onrender.com/seed
```

Default credentials:
- **Admin**: admin@mining-pdm.com / Admin123!
- **Operator**: operator@mining-pdm.com / Operator123!
- **Viewer**: viewer@mining-pdm.com / Viewer123!

## 📊 API Endpoints

### Authentication
- `POST /token` - Get access token
- `GET /auth/me` - Get current user info

### Predictions
- `POST /predict` - Predict health score
- `POST /test-predict` - Test prediction endpoint

### Data Management
- `POST /ingest` - Ingest telemetry data
- `GET /machines` - Get machine list

### Health & Monitoring
- `GET /health` - Basic health check
- `GET /health/comprehensive` - Detailed health report
- `GET /metrics` - Prometheus metrics

## 🚀 Deployment Checklist

- [ ] Repository connected to Render
- [ ] Environment variables configured
- [ ] Build command: `pip install -r requirements.txt`
- [ ] Start command: `uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT --workers 1`
- [ ] Python version: 3.11.0
- [ ] Database seeded with `/seed` endpoint

## 📞 Support

For deployment issues or questions:
- Check Render logs in the dashboard
- Verify environment variables are set correctly
- Ensure all dependencies are in requirements.txt

---

**Ready to revolutionize mining operations with AI! 🚀**