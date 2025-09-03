# 🚀 Development Workflow - Test-Driven Development

This document outlines the **mandatory test-driven development workflow** for the Clarity application. **All new features must pass tests before servers can start.**

## 🔒 **Mandatory Workflow**

### **Rule: Tests Must Pass Before Development**
- ❌ **NEVER start servers manually** without running tests first
- ✅ **ALWAYS use the automated workflow** that ensures test compliance
- 🔄 **Every feature change** must pass regression tests

## 📋 **Available Commands**

### **1. 🧪 Run Tests Only**
```bash
./scripts/run-tests.sh
```
- Installs dependencies
- Runs backend tests (pytest)
- Runs frontend tests (Vitest)
- Runs integration tests
- **Does NOT start servers**

### **2. 🚀 Full Development Workflow (Recommended)**
```bash
./scripts/test-and-start.sh
```
- ✅ Runs ALL tests first
- 🚫 **Fails if any test fails**
- 🚀 Starts servers only after tests pass
- 🔄 Monitors server health
- 🛑 Graceful shutdown on Ctrl+C

### **3. 🛑 Stop Development Servers**
```bash
./scripts/stop-servers.sh
```
- Stops backend server (port 8001)
- Stops frontend server (port 3000)
- Cleans up process IDs
- Clears ports

## 🔄 **Development Cycle**

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

## 🧪 **Test Structure**

### **Backend Tests (`server/tests/`)**
- **Unit Tests**: Individual service/function tests
- **Integration Tests**: API endpoint tests
- **Schema Tests**: Pydantic model validation
- **Service Tests**: Business logic validation

### **Frontend Tests (`client/src/`)**
- **Component Tests**: React component rendering
- **Hook Tests**: Custom React hooks
- **Utility Tests**: Helper functions
- **Integration Tests**: API integration

### **Functional Tests (`tests/functional/`)**
- **User Journey Tests**: Complete user workflows
- **Regression Tests**: Ensure existing features work
- **Cross-Platform Tests**: Frontend + Backend integration

## 🚨 **What Happens If Tests Fail**

### **Test Failure = No Servers**
```bash
./scripts/test-and-start.sh
# ❌ Tests failed - servers will NOT start
# 🔧 Fix the failing tests first
```

### **Common Test Failure Scenarios**
1. **Backend Tests Fail**: Check service logic, schemas, API endpoints
2. **Frontend Tests Fail**: Check component logic, hooks, API calls
3. **Integration Tests Fail**: Check frontend-backend communication
4. **Dependency Issues**: Check package versions, virtual environments

## 🔧 **Troubleshooting**

### **Tests Won't Run**
```bash
# Check if scripts are executable
ls -la scripts/

# Make executable if needed
chmod +x scripts/*.sh

# Check if in correct directory
pwd  # Should be in project root
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

### **Integration Tests Fail**
```bash
cd tests
npm test -- tests/functional/ --run
```

## 📊 **Test Coverage Requirements**

### **Minimum Coverage**
- **Backend**: 80% code coverage
- **Frontend**: 70% code coverage
- **Integration**: 100% user journey coverage

### **Coverage Reports**
```bash
# Backend coverage
cd server
python -m pytest --cov=app tests/

# Frontend coverage
cd client
npm run test:coverage
```

## 🎯 **Best Practices**

### **Writing Tests**
1. **Test First**: Write tests before implementing features
2. **Meaningful Names**: Test names should describe the scenario
3. **Isolation**: Each test should be independent
4. **Coverage**: Test both success and failure cases

### **Running Tests**
1. **Frequently**: Run tests after every code change
2. **Locally**: Always test locally before pushing
3. **Complete Suite**: Run full test suite before major changes
4. **Debug Mode**: Use verbose output for debugging

### **Maintaining Tests**
1. **Update Tests**: Modify tests when features change
2. **Remove Obsolete**: Delete tests for removed features
3. **Performance**: Keep tests fast and efficient
4. **Documentation**: Document complex test scenarios

## 🚫 **What NOT to Do**

### **❌ Manual Server Management**
```bash
# DON'T do this:
cd server && python -m uvicorn app.main:app --port 8001
cd client && npm run dev

# DO this instead:
./scripts/test-and-start.sh
```

### **❌ Skipping Tests**
```bash
# DON'T skip tests:
./scripts/test-and-start.sh --skip-tests  # This flag doesn't exist!

# Tests are MANDATORY - no exceptions
```

### **❌ Ignoring Test Failures**
```bash
# DON'T ignore red test output
# DON'T comment out failing tests
# DON'T push code with failing tests

# FIX the tests, then proceed
```

## 🔄 **Continuous Integration**

### **Pre-commit Hooks**
- Tests run automatically before each commit
- Prevents committing code with failing tests
- Ensures code quality at every step

### **CI/CD Pipeline**
- Tests run on every pull request
- Build fails if tests fail
- Production deployment requires passing tests

## 📚 **Additional Resources**

### **Test Documentation**
- [Backend Testing Guide](server/tests/README.md)
- [Frontend Testing Guide](client/src/test/README.md)
- [Integration Testing Guide](tests/README.md)

### **Testing Tools**
- **Backend**: pytest, pytest-asyncio
- **Frontend**: Vitest, React Testing Library
- **Integration**: Vitest with MSW
- **Coverage**: pytest-cov, Vitest coverage

### **Getting Help**
1. Check test output for specific error messages
2. Review test logs and coverage reports
3. Consult test documentation
4. Ask team members for guidance

---

## 🎯 **Remember: Tests First, Servers Second**

**The golden rule**: Your code is only ready for testing when all tests pass. This workflow ensures quality, prevents regressions, and maintains a stable development environment.

**Happy testing! 🧪✨**
