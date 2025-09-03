# 🏗️ Clarity Application - Clean Architecture Documentation

## 📋 **Overview**

The Clarity application is a modern, AI-powered goal tracking system built with a clean, modular architecture following SOLID principles. The system supports both guest users (with trial limitations) and authenticated users via Google OAuth.

## 🏛️ **Architecture Principles**

- **Separation of Concerns**: Clear boundaries between API, services, schemas, and business logic
- **Dependency Inversion**: High-level modules don't depend on low-level modules
- **Single Responsibility**: Each module has one clear purpose
- **Open/Closed**: Open for extension, closed for modification
- **Interface Segregation**: Clients only depend on interfaces they use

## 🗂️ **Project Structure**

```
progress_tracker/
├── 📁 server/                    # Backend FastAPI application
│   ├── 📁 app/
│   │   ├── 📁 api/v1/           # API version 1
│   │   │   ├── api.py           # Main API router
│   │   │   └── 📁 endpoints/    # API endpoint modules
│   │   │       ├── goals.py     # Goals CRUD operations
│   │   │       └── auth.py      # Authentication endpoints
│   │   ├── 📁 core/             # Core configuration & utilities
│   │   │   ├── config.py        # Environment configuration
│   │   │   ├── constants.py     # Centralized constants
│   │   │   ├── prompts.py       # AI prompt templates
│   │   │   ├── database.py      # Database configuration
│   │   │   └── logging.py       # Logging configuration
│   │   ├── 📁 schemas/          # Pydantic data models
│   │   │   ├── goals.py         # Goal data models
│   │   │   └── auth.py          # Authentication models
│   │   └── 📁 services/         # Business logic services
│   │       ├── goals.py         # Goal management service
│   │       ├── auth.py          # Authentication service
│   │       ├── google_auth.py   # Google OAuth service
│   │       └── ai_service.py    # AI goal extraction service
│   ├── requirements.txt          # Python dependencies
│   ├── Dockerfile               # Container configuration
│   └── 📁 alembic/              # Database migrations
├── 📁 client/                    # Frontend React application
│   ├── 📁 src/
│   │   ├── 📁 components/       # Reusable UI components
│   │   │   ├── 📁 goals/        # Goal-specific components
│   │   │   │   ├── GoalExtractionForm.tsx
│   │   │   │   ├── ExtractedGoalsList.tsx
│   │   │   │   ├── GoalManagement.tsx
│   │   │   │   ├── GoalExtractionLoader.tsx
│   │   │   │   ├── UserGoalsList.tsx
│   │   │   │   ├── GoalSkeleton.tsx
│   │   │   │   └── GoalEditForm.tsx
│   │   │   ├── 📁 auth/         # Authentication components
│   │   │   │   ├── GoogleSignInButton.tsx
│   │   │   │   ├── UserProfile.tsx
│   │   │   │   └── ProtectedRoute.tsx
│   │   │   ├── 📁 ui/           # Generic UI components
│   │   │   │   ├── ToastContainer.tsx
│   │   │   │   ├── Toast.tsx
│   │   │   │   ├── ConfirmationModal.tsx
│   │   │   │   ├── LoadingSpinner.tsx
│   │   │   │   └── Toaster.tsx
│   │   │   ├── Layout.tsx        # Main layout component
│   │   │   └── Sidebar.tsx       # Navigation sidebar
│   │   ├── 📁 pages/            # Page components
│   │   │   ├── Goals.tsx         # Main goals page
│   │   │   ├── Dashboard.tsx     # User dashboard
│   │   │   ├── Analytics.tsx     # Progress analytics
│   │   │   ├── Auth.tsx          # Authentication page
│   │   │   └── GoogleAuthCallback.tsx # OAuth callback
│   │   ├── 📁 hooks/            # Custom React hooks
│   │   │   ├── useAuth.tsx       # Authentication state
│   │   │   ├── useGuestMode.ts   # Guest mode management
│   │   │   └── useToast.tsx      # Toast notifications
│   │   ├── 📁 types/            # TypeScript type definitions
│   │   │   └── index.ts          # All type definitions
│   │   ├── 📁 config/           # Configuration constants
│   │   │   └── constants.ts      # Centralized configuration
│   │   ├── 📁 test/             # Test configuration
│   │   │   └── setup.ts          # Test setup
│   │   ├── App.tsx               # Main application component
│   │   ├── main.tsx              # Application entry point
│   │   └── index.css             # Global styles
│   ├── package.json              # Node.js dependencies
│   ├── vite.config.ts            # Build configuration
│   ├── tailwind.config.js        # CSS framework config
│   └── tsconfig.json             # TypeScript configuration
├── 📁 tests/                     # Test suites
│   └── 📁 regression/           # Regression tests
│       └── features.test.ts      # Feature regression tests
├── .env                          # Environment variables
├── .gitignore                    # Git ignore rules
├── docker-compose.yml            # Development environment
├── README.md                     # Project overview
├── CONTRIBUTING.md               # Contribution guidelines
├── DEVELOPMENT_STATUS.md         # Development progress
├── DATA_MODEL_ARCHITECTURE.md    # Data model documentation
└── version-3-manifest.md         # Project specifications
```

## 🔄 **Data Flow Architecture**

### **Frontend → Backend Flow:**
```
User Action → React Component → Custom Hook → API Call → FastAPI Endpoint → Service Layer → Response
```

### **Backend → Frontend Flow:**
```
Database/External API → Service Layer → FastAPI Endpoint → JSON Response → React Component → UI Update
```

## 🔐 **Authentication Architecture**

### **Guest Mode:**
- **Duration**: 24-hour trial period
- **Features**: Unlimited goal extraction, no permanent storage
- **Storage**: Local storage for trial tracking
- **Limitations**: Cannot save goals, track progress, or manage goals

### **Authenticated Mode:**
- **Provider**: Google OAuth 2.0
- **Features**: Full access to all features
- **Storage**: Persistent data storage (future database integration)
- **Security**: JWT tokens with configurable expiration

## 🎯 **Core Features Architecture**

### **1. Goal Management**
- **Extraction**: AI-powered goal extraction from text/documents
- **Creation**: Goal creation with validation
- **Management**: CRUD operations for goals
- **Status Tracking**: Active, completed, paused, cancelled states

### **2. AI Service**
- **Primary**: Gemini API integration for goal extraction
- **Fallback**: Keyword-based extraction when AI fails
- **Prompts**: Centralized prompt templates
- **Error Handling**: Graceful degradation

### **3. Progress Tracking**
- **Metrics**: Numeric, boolean, percentage tracking
- **History**: Progress entry management
- **Analytics**: Performance visualization (future)

## 🌐 **API Architecture**

### **RESTful Endpoints:**
```
/api/v1/
├── /goals/           # Goal CRUD operations
├── /goals/extract    # AI goal extraction
├── /auth/google/callback  # Google OAuth callback
├── /auth/validate    # Token validation
├── /auth/logout      # User logout
└── /health           # Health check
```

### **Response Format:**
```json
{
  "success": true,
  "data": {...},
  "message": "Operation completed successfully"
}
```

## ⚙️ **Configuration Management**

### **Frontend Configuration:**
- **Environment Variables**: Vite-based configuration
- **API URLs**: Centralized in `constants.ts`
- **Feature Flags**: Configurable feature toggles
- **Validation Rules**: Centralized validation constants

### **Backend Configuration:**
- **Environment Variables**: Pydantic settings
- **Constants**: Centralized in `constants.py`
- **Database**: Configurable database connections
- **Security**: Configurable JWT and OAuth settings

## 🧪 **Testing Architecture**

### **Test Types:**
- **Regression Tests**: Ensure features continue working
- **Unit Tests**: Individual component testing
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Full user journey testing (future)

### **Test Coverage:**
- **Frontend**: React component testing
- **Backend**: Service and endpoint testing
- **Configuration**: Environment and constant validation
- **Features**: Core functionality validation

## 🚀 **Development Workflow**

### **Local Development:**
1. **Backend**: `cd server && source venv/bin/activate && python -m uvicorn app.main:app --port 8001`
2. **Frontend**: `cd client && npm run dev`
3. **Database**: SQLite for development (PostgreSQL for production)

### **Code Quality:**
- **Linting**: ESLint for frontend, flake8 for backend
- **Formatting**: Prettier for frontend, black for backend
- **Type Checking**: TypeScript for frontend, mypy for backend
- **Testing**: Vitest for frontend, pytest for backend

## 📊 **Performance & Scalability**

### **Current State:**
- **Storage**: In-memory storage (development)
- **Caching**: No caching layer
- **Load Balancing**: Single server instance

### **Future Improvements:**
- **Database**: PostgreSQL with connection pooling
- **Caching**: Redis for session and data caching
- **CDN**: Static asset optimization
- **Microservices**: Service decomposition

## 🔒 **Security Architecture**

### **Authentication:**
- **OAuth 2.0**: Google authentication
- **JWT Tokens**: Secure token-based sessions
- **CORS**: Configurable cross-origin policies

### **Data Protection:**
- **Input Validation**: Pydantic schema validation
- **SQL Injection**: Parameterized queries (future)
- **XSS Protection**: React built-in protection
- **CSRF Protection**: Token-based protection (future)

## 📈 **Monitoring & Observability**

### **Logging:**
- **Structured Logging**: JSON-formatted logs
- **Log Levels**: Configurable logging levels
- **Request Tracking**: Request/response logging

### **Metrics:**
- **Health Checks**: `/health` endpoint
- **Performance**: Response time tracking
- **Errors**: Error rate monitoring

## 🎯 **Next Development Phases**

### **Phase 1: Database Integration** (Current)
- [ ] PostgreSQL database setup
- [ ] SQLAlchemy ORM integration
- [ ] User data persistence
- [ ] Migration system

### **Phase 2: Enhanced Features**
- [ ] Goal editing before creation
- [ ] Progress tracking improvements
- [ ] Analytics dashboard
- [ ] Document processing

### **Phase 3: Production Readiness**
- [ ] Docker containerization
- [ ] CI/CD pipeline
- [ ] Monitoring and alerting
- [ ] Performance optimization

---

*This architecture document is maintained as part of the Clarity application development process.*
