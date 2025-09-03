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

## 🔒 **DEVELOPMENT RULES**

- ❌ **NEVER start servers manually**
- ✅ **ALWAYS run tests first**
- 🔄 **Every feature change must pass regression tests**
- 📚 **Refer to entry point documentation before starting**

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
