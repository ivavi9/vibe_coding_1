# 🚀 **CLARITY - AI-Powered Goal Tracking Application**

> **A modern, test-driven goal management system with AI-powered goal extraction and progress tracking.**

## 📚 **📖 START HERE: PROJECT ENTRY POINT**

**Before starting any development work, please read:**
- **[PROJECT_ENTRY_POINT.md](./documentation/PROJECT_ENTRY_POINT.md)** - Complete project overview and quick start
- **[TEST_COVERAGE_SUMMARY.md](./documentation/TEST_COVERAGE_SUMMARY.md)** - Current test status and coverage
- **[DEVELOPMENT_WORKFLOW.md](./documentation/DEVELOPMENT_WORKFLOW.md)** - Mandatory development process

## 📖 **COMPLETE DOCUMENTATION**

**All project documentation is organized in the `./documentation/` folder:**

- **[PROJECT_ENTRY_POINT.md](./documentation/PROJECT_ENTRY_POINT.md)** - Complete project overview and quick start
- **[ARCHITECTURE.md](./documentation/ARCHITECTURE.md)** - System architecture and design patterns
- **[DATA_MODEL_ARCHITECTURE.md](./documentation/DATA_MODEL_ARCHITECTURE.md)** - Database and data model design
- **[DEVELOPMENT_WORKFLOW.md](./documentation/DEVELOPMENT_WORKFLOW.md)** - Mandatory development process and rules
- **[DEVELOPMENT_STATUS.md](./documentation/DEVELOPMENT_STATUS.md)** - Current development progress and status
- **[TEST_COVERAGE_SUMMARY.md](./documentation/TEST_COVERAGE_SUMMARY.md)** - Test coverage and testing strategy
- **[CONTRIBUTING.md](./documentation/CONTRIBUTING.md)** - How to contribute to the project
- **[GOOGLE_AUTH_SETUP.md](./documentation/GOOGLE_AUTH_SETUP.md)** - Google OAuth configuration guide
- **[version-3-manifest.md](./documentation/version-3-manifest.md)** - Version 3 feature manifest and roadmap

## 🧪 **QUICK START (MANDATORY)**

```bash
# 🚫 NEVER start servers manually - always use the test-driven workflow!

# Run tests only (recommended for development)
./utils/scripts/run-tests.sh

# Full workflow: tests + start servers (recommended for feature testing)
./utils/scripts/test-and-start.sh

# Stop development servers
./utils/scripts/stop-servers.sh
```

## 🏗️ **ARCHITECTURE OVERVIEW**

- **Backend**: FastAPI with modular service architecture
- **Frontend**: React + TypeScript with centralized configuration
- **Testing**: Comprehensive test suite (Backend: 100%, Frontend: 100%)
- **Workflow**: Test-driven development with mandatory test compliance

## 🎯 **CURRENT STATUS**

- ✅ **Backend**: 14/14 tests passing (100% coverage)
- ✅ **Frontend**: 2/2 tests passing (100% coverage)
- ⚠️ **Integration**: Temporarily disabled (path resolution fix needed)
- 🚀 **Ready for development** with proper test coverage

## 📋 **NEXT STEPS**

1. **Read [PROJECT_ENTRY_POINT.md](./documentation/PROJECT_ENTRY_POINT.md)** for complete understanding
2. **Follow the test-driven workflow** - tests must pass before servers start
3. **Implement next priority features** as outlined in the entry point document

## 📊 **PROGRESS TRACKING REQUIREMENTS**

### **After Every Feature Implementation**
- ✅ **Update test coverage** in [TEST_COVERAGE_SUMMARY.md](./documentation/TEST_COVERAGE_SUMMARY.md)
- ✅ **Document new features** in [DEVELOPMENT_STATUS.md](./documentation/DEVELOPMENT_STATUS.md)
- ✅ **Update architecture docs** if new patterns are introduced
- ✅ **Verify all tests pass** before committing changes

### **Progress Tracker Updates**
- **Test Coverage**: Update backend, frontend, and integration test counts
- **Feature Status**: Mark completed features and add new pending items
- **Architecture Changes**: Document any new components, services, or patterns
- **Known Issues**: Track any bugs or technical debt discovered

## 🔒 **DEVELOPMENT RULES**

- ❌ **NEVER start servers manually**
- ✅ **ALWAYS run tests first**
- 🔄 **Every feature change must pass regression tests**
- 📚 **Refer to entry point documentation before starting**

## 🧪 **TESTING REQUIREMENTS (MANDATORY)**

### **Test Organization Structure**
The project has **3 distinct test layers** that work together:

#### **1. 🧩 Component Tests (Client-Level)**
- **Location**: `client/src/**/__tests__/`
- **Purpose**: Test individual React components, hooks, and utilities
- **Command**: `cd client && npm test`
- **Coverage Target**: 80% of all frontend components
- **Examples**: Goals.test.tsx, Dashboard.test.tsx, useAuth.test.tsx

#### **2. 🔗 Integration Tests (Root-Level)**
- **Location**: `tests/` (root directory)
- **Purpose**: Test cross-component integration, user journeys, and end-to-end flows
- **Command**: `cd client && npm test -- ../tests/`
- **Coverage Target**: 100% of user workflows
- **Examples**: goals-user-journeys.test.ts, features.test.ts

#### **3. ⚙️ Backend Tests (Server-Level)**
- **Location**: `server/tests/`
- **Purpose**: Test backend services, API endpoints, and business logic
- **Command**: `cd server && python -m pytest tests/`
- **Coverage Target**: 100% of backend functionality

### **Feature Testing Rules**
- ✅ **Every new feature MUST have functional tests** that mimic real-life user behavior
- ✅ **Test data flow between frontend and backend** for all API interactions
- ✅ **Cover both functional and non-functional aspects** (performance, error handling)
- ✅ **Test complete user journeys** from start to finish
- ✅ **Regression tests must pass** before any new feature development

### **Test Coverage Requirements**
- **Frontend Components**: Test user interactions, state changes, API calls
- **Backend Services**: Test business logic, data validation, error handling
- **API Endpoints**: Test request/response formats, status codes, edge cases
- **Integration**: Test frontend-backend communication, data consistency
- **User Flows**: Test complete feature workflows (e.g., goal creation → progress tracking → completion)

### **Before Git Commit**
- 🚫 **NEVER commit features without tests**
- ✅ **All tests must pass** (backend + frontend + integration)
- ✅ **Test coverage must be maintained or improved**
- ✅ **Update progress tracker** with new test coverage information
- ✅ **Document any new testing patterns** for future reference

### **Test Quality Standards**
- **Realistic Scenarios**: Tests should mimic actual user behavior
- **Edge Cases**: Cover error conditions, invalid inputs, network failures
- **Performance**: Test response times, memory usage, scalability
- **Accessibility**: Test keyboard navigation, screen readers, mobile responsiveness

### **Running All Tests**
```bash
# 🚀 Run ALL tests (recommended workflow)
./utils/scripts/run-tests.sh

# 🧩 Run only component tests
cd client && npm test

# 🔗 Run only integration tests  
cd client && npm test -- ../tests/

# ⚙️ Run only backend tests
cd server && python -m pytest tests/

# 📊 Run tests with coverage
cd client && npm run test:coverage
```

### **Test Execution Order**
1. **Backend Tests** - Validate server functionality
2. **Component Tests** - Validate individual UI components  
3. **Integration Tests** - Validate cross-component workflows
4. **All tests must pass** before starting development servers

### **Test Organization Diagram**
```
progress_tracker/
├── 🧩 client/src/**/__tests__/     # Component Tests
│   ├── pages/__tests__/
│   │   ├── Goals.test.tsx          # Goals page component
│   │   ├── Dashboard.test.tsx      # Dashboard page component
│   │   └── Analytics.test.tsx      # Analytics page component
│   ├── components/__tests__/
│   │   ├── Layout.test.tsx         # Layout component
│   │   └── ui/__tests__/           # UI component tests
│   └── hooks/__tests__/
│       └── useAuth.test.tsx        # Authentication hook
├── 🔗 tests/                       # Integration Tests (Root)
│   ├── functional/                 # User workflow tests
│   │   ├── goals-user-journeys.test.ts
│   │   ├── user-journeys.test.ts
│   │   └── basic-integration.test.ts
│   └── regression/                 # Regression tests
│       └── features.test.ts
└── ⚙️ server/tests/                # Backend Tests
    ├── test_goals.py               # Goal service tests
    ├── unit/                       # Unit tests
    └── integration/                # Backend integration tests
```

### **Test Relationship**
- **Component Tests** → Test individual pieces in isolation
- **Integration Tests** → Test how components work together
- **Backend Tests** → Test server-side functionality
- **All Together** → Ensure complete system works correctly

## 🧩 **MODULARIZATION GUIDELINES**

### **File Size Limits**
- **Maximum file size**: 200 lines
- **Target file size**: 100-150 lines
- **If file exceeds limit**: Break into smaller components/hooks

### **SOLID Principles**
- **Single Responsibility**: Each file should have one clear purpose
- **Open/Closed**: Extend functionality through composition, not modification
- **Liskov Substitution**: Components should be interchangeable
- **Interface Segregation**: Keep interfaces focused and minimal
- **Dependency Inversion**: Depend on abstractions, not concretions

### **Component Structure**
```
src/
├── components/
│   ├── goals/
│   │   ├── GoalStateManager.tsx      # Custom hook for goal state
│   │   ├── GoalExtractionManager.tsx # Custom hook for extraction
│   │   ├── AuthenticationBanners.tsx # UI component for auth banners
│   │   └── index.ts                  # Export all components
│   └── ui/                           # Reusable UI components
├── hooks/                            # Custom React hooks
├── pages/                            # Page components (keep minimal)
└── config/                           # Centralized configuration
```

### **When to Create New Files**
- ✅ **New feature**: Create new component/hook file
- ✅ **File > 200 lines**: Break into smaller files
- ✅ **Multiple responsibilities**: Split into focused files
- ✅ **Reusable logic**: Extract into custom hooks
- ❌ **Minor updates**: Modify existing file if < 200 lines

### **Naming Conventions**
- **Components**: PascalCase (e.g., `GoalStateManager.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useGoalState.ts`)
- **Utilities**: camelCase (e.g., `buildApiUrl.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS`)

---

**Happy coding! Remember: Tests First, Servers Second, Modularity Always! 🧪✨**
