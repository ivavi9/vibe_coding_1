# 🚀 **CLARITY PROJECT - COMPREHENSIVE ENTRY POINT**

> **This document serves as the single source of truth for all project information, architecture, and workflows.**
> **Always refer to this document before starting any development work.**

## 📋 **QUICK START COMMANDS**

### **🧪 Test-Driven Development (MANDATORY)**
```bash
# Run tests only (recommended for development)
./scripts/run-tests.sh

# Full workflow: tests + start servers (recommended for feature testing)
./scripts/test-and-start.sh

# Stop development servers
./scripts/stop-servers.sh
```

### **🚫 IMPORTANT: NEVER Start Servers Manually**
- ❌ **DON'T**: `cd server && python -m uvicorn app.main:app --port 8001`
- ❌ **DON'T**: `cd client && npm run dev`
- ✅ **DO**: Use the automated workflow scripts above

---

## 🏗️ **CURRENT ARCHITECTURE OVERVIEW**

### **Backend Structure**
```
server/
├── app/
│   ├── api/v1/endpoints/     # API endpoints (goals, auth, etc.)
│   ├── core/                 # Configuration & constants
│   ├── services/             # Business logic (goals, AI, etc.)
│   └── schemas/              # Pydantic models
├── tests/                    # Backend tests (pytest)
└── venv/                     # Python virtual environment
```

### **Frontend Structure**
```
client/
├── src/
│   ├── components/           # React components
│   ├── pages/                # Page components
│   ├── hooks/                # Custom React hooks
│   ├── config/               # Configuration constants
│   └── test/                 # Test setup & utilities
├── tests/                    # Frontend tests (Vitest)
└── node_modules/             # Dependencies
```

### **Integration Tests**
```
tests/
├── functional/               # End-to-end user journey tests
└── regression/               # Feature regression tests
```

---

## 🔧 **CURRENT IMPLEMENTATION STATUS**

### **✅ COMPLETED FEATURES**
1. **Modular Backend Architecture**
   - Service layer with in-memory storage
   - API endpoints for goals CRUD
   - Centralized configuration management
   - Comprehensive test suite

2. **Frontend Infrastructure**
   - React + TypeScript setup
   - Centralized API configuration
   - Authentication hooks and context
   - Responsive UI components

3. **Test-Driven Development**
   - Backend tests (14/14 passing)
   - Frontend tests (2/2 passing)
   - Functional regression tests
   - Automated test scripts

4. **Goal Management System**
   - Goal creation, reading, updating, deletion
   - AI-powered goal extraction
   - Guest mode with trial period
   - Google OAuth integration (configured)

### **🔄 IN PROGRESS**
1. **Frontend-Backend Integration**
   - Goals display and management
   - Real-time goal updates
   - Error handling and user feedback

### **📋 PENDING FEATURES**
1. **Database Integration**
   - PostgreSQL setup
   - SQLAlchemy ORM
   - User data persistence

2. **Enhanced UI/UX**
   - Goal editing before creation
   - Loading animations
   - Custom confirmation modals
   - Goal status management

---

## 🧪 **TESTING STRATEGY**

### **Test Coverage Requirements**
- **Backend**: 80% minimum (currently 100% for goals service)
- **Frontend**: 70% minimum (currently 100% for existing components)
- **Integration**: 100% user journey coverage

### **Test Types**
1. **Unit Tests**: Individual service/component logic
2. **Integration Tests**: API endpoint functionality
3. **Functional Tests**: Complete user workflows
4. **Regression Tests**: Ensure existing features work

### **Running Tests**
```bash
# Backend only
cd server && source venv/bin/activate && python -m pytest tests/ -v

# Frontend only
cd client && npm test -- --run

# All tests (recommended)
./scripts/run-tests.sh
```

---

## 🌐 **API ENDPOINTS**

### **Base URL**: `http://localhost:8001`

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|---------|
| `/api/v1/goals/` | GET | Retrieve all goals | ✅ Working |
| `/api/v1/goals/` | POST | Create new goal | ✅ Working |
| `/api/v1/goals/{id}` | GET | Get specific goal | ✅ Working |
| `/api/v1/goals/{id}` | PUT | Update goal | ✅ Working |
| `/api/v1/goals/extract` | POST | AI goal extraction | ✅ Working |
| `/api/v1/auth/google/callback` | POST | Google OAuth | 🔧 Configured |
| `/api/v1/auth/validate` | GET | Token validation | 🔧 Configured |
| `/api/v1/auth/logout` | POST | User logout | 🔧 Configured |

---

## 🔐 **AUTHENTICATION SYSTEM**

### **Current Implementation**
- **Guest Mode**: 24-hour trial with unlimited goal extraction
- **Google OAuth**: Configured but not fully implemented
- **JWT Tokens**: Framework in place

### **User Types**
1. **Guest Users**
   - Can extract goals from text/documents
   - Cannot save goals permanently
   - Trial period: 24 hours

2. **Authenticated Users**
   - Full access to all features
   - Goal persistence
   - Progress tracking

---

## 📊 **DATA FLOW ARCHITECTURE**

### **Goal Creation Flow**
```
User Input → Frontend Validation → API Call → Service Layer → In-Memory Storage → Response
```

### **Goal Retrieval Flow**
```
Frontend Request → API Endpoint → Service Layer → In-Memory Storage → Response → UI Update
```

### **AI Extraction Flow**
```
Text Input → API Call → AI Service → Goal Parsing → Response → Frontend Display
```

---

## 🚨 **KNOWN ISSUES & SOLUTIONS**

### **Issue: "No Goals Found" Message**
- **Cause**: Frontend expecting `data.data` but backend returns direct array
- **Solution**: ✅ Fixed in `client/src/pages/Goals.tsx`

### **Issue: Goal Persistence Across Requests**
- **Cause**: Each service instance had separate storage
- **Solution**: ✅ Implemented shared global variables in `GoalService`

### **Issue: Pydantic Deprecation Warnings**
- **Cause**: Using deprecated `.dict()` method
- **Solution**: ✅ Updated to `.model_dump()` in goals service

---

## 🔄 **DEVELOPMENT WORKFLOW**

### **Phase 1: Development**
1. Make code changes
2. Run tests: `./scripts/run-tests.sh`
3. Fix any failing tests
4. Repeat until all tests pass

### **Phase 2: Testing & Validation**
1. Run full workflow: `./scripts/test-and-start.sh`
2. Verify feature works in browser
3. Run tests again to ensure no regressions
4. Commit working code

### **Phase 3: Feature Complete**
1. All tests pass
2. Feature works as expected
3. No regressions introduced
4. Ready for next feature

---

## 📚 **KEY DOCUMENTS REFERENCE**

### **Architecture & Design**
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Detailed system architecture
- [DATA_MODEL_ARCHITECTURE.md](./DATA_MODEL_ARCHITECTURE.md) - Data structure design
- [DEVELOPMENT_WORKFLOW.md](./DEVELOPMENT_WORKFLOW.md) - Development process

### **Development Status**
- [DEVELOPMENT_STATUS.md](./DEVELOPMENT_STATUS.md) - Current implementation status
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Contribution guidelines

### **Configuration Files**
- `server/app/core/constants.py` - Backend configuration
- `client/src/config/constants.ts` - Frontend configuration
- `scripts/` - Development automation scripts

---

## 🎯 **NEXT DEVELOPMENT PRIORITIES**

### **Immediate (Next 1-2 Sessions)**
1. **Fix Frontend Goals Display**
   - Ensure goals are properly fetched and displayed
   - Test goal creation from frontend
   - Verify goal updates and deletions

2. **Database Integration Planning**
   - Design database schema
   - Plan migration from in-memory storage
   - Set up PostgreSQL environment

### **Short Term (Next 3-5 Sessions)**
1. **Enhanced Goal Management**
   - Goal editing before creation
   - Status management (active, completed, paused)
   - Progress tracking

2. **UI/UX Improvements**
   - Loading animations
   - Custom confirmation modals
   - Better error handling

### **Medium Term (Next 5-10 Sessions)**
1. **Full Authentication System**
   - Complete Google OAuth implementation
   - User data isolation
   - Session management

2. **Advanced Features**
   - Goal templates
   - Progress analytics
   - Social features

---

## 🔧 **TROUBLESHOOTING GUIDE**

### **Tests Won't Run**
```bash
# Check script permissions
chmod +x scripts/*.sh

# Verify directory structure
ls -la client/package.json server/requirements.txt
```

### **Backend Tests Fail**
```bash
cd server
source venv/bin/activate
python -m pytest tests/ -v
```

### **Frontend Tests Fail**
```bash
cd client
npm test -- --run
```

### **Servers Won't Start**
```bash
# Check if tests pass first
./scripts/run-tests.sh

# Check port availability
lsof -i :8001  # Backend
lsof -i :3000  # Frontend
```

---

## 📞 **GETTING HELP**

### **When You're Stuck**
1. **Check this document first** - Most answers are here
2. **Run the test suite** - Identify specific failures
3. **Check recent changes** - Look at git history
4. **Review architecture docs** - Understand the system design

### **Common Patterns**
- **Frontend issues**: Check browser console, network tab
- **Backend issues**: Check server logs, API responses
- **Test issues**: Run individual test suites, check imports
- **Integration issues**: Verify API endpoints, data formats

---

## 🎉 **SUCCESS METRICS**

### **Code Quality**
- ✅ All tests passing
- ✅ No linting errors
- ✅ Consistent code style
- ✅ Proper error handling

### **Functionality**
- ✅ Goals CRUD operations work
- ✅ AI extraction functional
- ✅ Frontend-backend communication
- ✅ User authentication framework

### **Performance**
- ✅ Fast test execution
- ✅ Responsive UI
- ✅ Efficient API calls
- ✅ Minimal memory usage

---

## 🚀 **REMEMBER: TESTS FIRST, SERVERS SECOND**

**The golden rule**: Your code is only ready for development when all tests pass. This workflow ensures quality, prevents regressions, and maintains a stable development environment.

**Happy coding! 🧪✨**
