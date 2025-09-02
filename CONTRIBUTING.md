# Contributing to Clarity

Thank you for your interest in contributing to Clarity! This document outlines the development process, coding standards, and guidelines for contributors.

## Development Process

### Branch Strategy (GitFlow)

We follow the GitFlow branching model:

- **main**: Production-ready code
- **develop**: Integration branch for features
- **feature/***: New features and enhancements
- **bugfix/***: Bug fixes
- **hotfix/***: Critical production fixes
- **release/***: Release preparation

### Workflow

1. **Create Feature Branch**: `git checkout -b feature/your-feature-name`
2. **Develop**: Make your changes following coding standards
3. **Test**: Ensure all tests pass locally
4. **Commit**: Use conventional commit messages
5. **Push**: `git push origin feature/your-feature-name`
6. **Pull Request**: Create PR to `develop` branch
7. **Review**: Address feedback from code review
8. **Merge**: PR is merged after approval

## Coding Standards

### Backend (Python)

- **Python Version**: 3.11+
- **Style Guide**: PEP 8 with Black formatter
- **Type Hints**: Required for all function parameters and return values
- **Documentation**: Docstrings for all public functions and classes
- **Testing**: Minimum 90% test coverage required

```python
from typing import List, Optional
from pydantic import BaseModel

class GoalCreate(BaseModel):
    """Schema for creating a new goal."""
    title: str
    description: Optional[str] = None
    metric_type: str
    target_progress: int

def create_goal(goal_data: GoalCreate) -> Goal:
    """Create a new goal in the database.
    
    Args:
        goal_data: The goal data to create
        
    Returns:
        The created goal object
        
    Raises:
        ValidationError: If goal data is invalid
    """
    # Implementation here
    pass
```

### Frontend (TypeScript/React)

- **TypeScript**: Strict mode enabled
- **Components**: Functional components with hooks
- **State Management**: TanStack Query for server state, React state for UI
- **Styling**: Tailwind CSS with consistent spacing (4px grid system)
- **Testing**: Vitest + React Testing Library

```typescript
import { useState } from 'react';
import { useGoals } from '@/hooks/useGoals';

interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (goalId: string) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({ 
  goal, 
  onEdit, 
  onDelete 
}) => {
  const { updateGoal } = useGoals();
  
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6">
      {/* Component content */}
    </div>
  );
};
```

## Testing Requirements

### Backend Testing

- **Unit Tests**: Mock all external dependencies
- **Integration Tests**: Use live test database
- **Coverage**: Minimum 90%
- **Framework**: pytest

### Frontend Testing

- **Component Tests**: Test rendering, props, events
- **Integration Tests**: Test feature-level logic
- **E2E Tests**: Playwright for critical user journeys
- **Framework**: Vitest + React Testing Library

## Code Quality

### Linting & Formatting

- **Backend**: Black, isort, flake8
- **Frontend**: ESLint, Prettier
- **Pre-commit**: Hooks for automatic formatting

### Code Review Checklist

- [ ] Tests pass locally
- [ ] Code follows style guidelines
- [ ] Type hints included (Python)
- [ ] Documentation updated
- [ ] No console.log statements (frontend)
- [ ] Error handling implemented
- [ ] Accessibility considerations

## Environment Setup

### Prerequisites

- Python 3.11+
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 15+

### Local Development

1. **Clone Repository**:
   ```bash
   git clone <repository-url>
   cd clarity
   ```

2. **Start Services**:
   ```bash
   docker-compose up -d
   ```

3. **Install Dependencies**:
   ```bash
   # Backend
   cd server
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   
   # Frontend
   cd ../client
   npm install
   ```

4. **Run Tests**:
   ```bash
   # Backend
   cd server
   pytest
   
   # Frontend
   cd ../client
   npm test
   ```

## API Development

### Endpoint Design

- **RESTful**: Follow REST principles
- **Versioning**: Use URL versioning (`/api/v1/`)
- **Error Handling**: Consistent error response format
- **Validation**: Pydantic models for request/response validation

### Authentication

- **JWT**: Short-lived access tokens (15 min)
- **Refresh Tokens**: Long-lived (7 days)
- **Security**: httpOnly cookies, HTTPS only

## Database

### Migrations

- **Tool**: Alembic
- **Strategy**: Forward-only migrations
- **Testing**: Separate test database

### Schema Changes

- **Backward Compatibility**: Maintain API compatibility
- **Migration Scripts**: Required for all schema changes
- **Rollback Plan**: Document rollback procedures

## Deployment

### CI/CD Pipeline

- **Provider**: GitHub Actions
- **Triggers**: PR and main branch
- **Checks**: Tests, linting, security scanning
- **Deployment**: Automated to staging/production

### Environment Management

- **Secrets**: Use GitHub Secrets
- **Configuration**: Environment-specific configs
- **Monitoring**: Health checks and logging

## Getting Help

- **Issues**: Create GitHub issues for bugs/features
- **Discussions**: Use GitHub Discussions for questions
- **Documentation**: Check inline code documentation
- **Team**: Reach out to maintainers

## License

By contributing to Clarity, you agree that your contributions will be licensed under the MIT License.
