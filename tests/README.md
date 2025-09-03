# 🧪 Unified Test Structure

This directory contains **ALL** tests for the Progress Tracker application, centralized in one location for better organization and maintainability.

## 📁 Directory Structure

```
tests/
├── README.md                           # This file
├── run-all-tests.sh                    # Unified test runner script
├── vitest.config.ts                    # Frontend test configuration
├── setup.ts                            # Frontend test setup
├── frontend/                           # Frontend component tests
│   ├── components/                     # Component tests
│   │   └── Layout.test.tsx
│   ├── pages/                          # Page tests
│   │   ├── Dashboard.test.tsx
│   │   └── Goals.test.tsx
│   ├── hooks/                          # Hook tests
│   │   └── useAuth.test.tsx
│   └── contexts/                       # Context tests
├── backend/                            # Backend tests
│   ├── unit/                           # Unit tests
│   │   └── test_goals.py
│   └── integration/                    # Integration tests
├── functional/                         # Functional integration tests
│   ├── basic-integration.test.ts
│   ├── goals-user-journeys.test.ts
│   └── user-journeys.test.ts
└── regression/                         # Regression tests
    └── features.test.ts
```

## 🎯 Test Categories

### **Frontend Tests** (`tests/frontend/`)
- **Component Tests**: Individual React component testing
- **Page Tests**: Full page component testing
- **Hook Tests**: Custom React hook testing
- **Context Tests**: React context testing

### **Backend Tests** (`tests/backend/`)
- **Unit Tests**: Individual function/class testing
- **Integration Tests**: API endpoint and service testing

### **Integration Tests** (`tests/functional/` + `tests/regression/`)
- **Functional Tests**: End-to-end user journey testing
- **Regression Tests**: Feature stability testing

## 🚀 Running Tests

### **Run All Tests**
```bash
./tests/run-all-tests.sh
```

### **Run Tests Before Starting Servers**
```bash
./utils/scripts/test-and-start.sh
```

### **Run Tests Only**
```bash
./utils/scripts/run-tests.sh
```

## 📊 Test Coverage

| Test Layer | Location | Count | Status |
|------------|----------|-------|---------|
| **Frontend Components** | `tests/frontend/` | 54 | ✅ Active |
| **Backend** | `tests/backend/` | 14 | ✅ Active |
| **Integration** | `tests/functional/` + `tests/regression/` | 23 | ✅ Active |
| **Total** | **All in `tests/`** | **91** | ✅ **All Reachable** |

## 🔧 Adding New Tests

### **Frontend Tests**
1. Create test file in appropriate `tests/frontend/` subdirectory
2. Follow naming convention: `ComponentName.test.tsx`
3. Use Vitest and React Testing Library
4. Test will be automatically discovered and run

### **Backend Tests**
1. Create test file in appropriate `tests/backend/` subdirectory
2. Follow naming convention: `test_module.py`
3. Use Pytest
4. Test will be automatically discovered and run

### **Integration Tests**
1. Create test file in `tests/functional/` or `tests/regression/`
2. Follow naming convention: `feature-name.test.ts`
3. Use Vitest with browser simulation
4. Test will be automatically discovered and run

## ✅ Test Execution Order

1. **Backend Tests** - Fast unit and integration tests
2. **Frontend Tests** - Component and hook tests
3. **Integration Tests** - End-to-end functionality tests

## 🎯 Benefits of Unified Structure

- **Single Source of Truth**: All tests in one location
- **Consistent Execution**: Same test runner for all test types
- **Better Coverage**: No tests are missed or skipped
- **Easier Maintenance**: Centralized test configuration
- **Faster Development**: Clear test organization and discovery

## 🚨 Important Notes

- **ALL tests must pass** before servers start
- **No tests are skipped** in the startup workflow
- **Test coverage is enforced** at every startup
- **Unified configuration** ensures consistent test execution

## 🔍 Test Discovery

Tests are automatically discovered based on:
- **Frontend**: `tests/frontend/**/*.test.{ts,tsx}`
- **Backend**: `tests/backend/**/test_*.py`
- **Integration**: `tests/functional/**/*.test.ts` + `tests/regression/**/*.test.ts`
