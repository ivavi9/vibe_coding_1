# Data Model Architecture - Clarity Progress Tracker

## 🏗️ **Current Architecture (In-Memory)**

### **Data Flow:**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Data Store    │
│                 │    │                 │    │                 │
│ Analytics.tsx   │───▶│ Goals Service   │───▶│ In-Memory      │
│ (Empty States)  │    │ (Empty Arrays)  │    │ (No Persist)   │
│                 │    │                 │    │                 │
│ Goals.tsx       │───▶│ Progress Svc    │───▶│ Global State    │
│ (User Context)  │    │ (User Context)  │    │ (No Users)     │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📊 **Current Data Models**

### **1. Goal Model**
```python
class Goal(BaseModel):
    id: str
    user_id: str  # ⚠️ NOT IMPLEMENTED - No user isolation
    title: str
    description: str
    metric_type: str
    current_progress: float
    target_progress: float
    status: str
    created_at: str
    updated_at: str
```

### **2. Progress Model**
```python
class Progress(BaseModel):
    id: str
    goal_id: str  # ⚠️ NO user_id - Can't isolate by user
    description: str
    progress_value: float
    timestamp: float
    type: str
```

### **3. User Model (Missing)**
```python
# ❌ NOT IMPLEMENTED
class User(BaseModel):
    id: str
    email: str
    name: str
    picture: Optional[str]
    created_at: datetime
    updated_at: datetime
```

## 🚨 **Current Issues**

### **1. No User Data Isolation**
- **Goals**: All goals are stored globally, not per user
- **Progress**: Progress entries are not tied to specific users
- **Analytics**: Shows global data instead of user-specific data

### **2. In-Memory Storage**
- **Data Loss**: All data is lost on server restart
- **No Persistence**: No database integration
- **Scalability**: Can't handle multiple users or large datasets

### **3. Hardcoded Demo Data**
- **Backend Services**: Return fake data instead of real user data
- **Frontend Components**: Show placeholder numbers and fake goals
- **User Experience**: Confusing for real users

## 🎯 **Target Architecture (Database-Driven)**

### **Data Flow:**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│                 │    │                 │    │                 │
│ Analytics.tsx   │───▶│ Goals Service   │───▶│ PostgreSQL     │
│ (User Context)  │    │ (User Context)  │    │ (User Tables)  │
│                 │    │                 │    │                 │
│ Goals.tsx       │───▶│ Progress Svc    │───▶│ Foreign Keys    │
│ (User Context)  │    │ (User Context)  │    │ (User Isolation)│
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🗄️ **Target Database Schema**

### **1. Users Table**
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    picture_url TEXT,
    google_id VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### **2. Goals Table**
```sql
CREATE TABLE goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    metric_type VARCHAR(50) NOT NULL,
    current_progress DECIMAL(10,2) DEFAULT 0,
    target_progress DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    target_date DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### **3. Progress Table**
```sql
CREATE TABLE progress_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    progress_value DECIMAL(10,2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

## 🔧 **Implementation Steps**

### **Phase 1: Remove Demo Data ✅**
- [x] Remove hardcoded goals from backend services
- [x] Remove hardcoded progress from backend services  
- [x] Update frontend to show empty states
- [x] Fix duplicate login buttons

### **Phase 2: Database Integration**
- [ ] Create database models with SQLAlchemy
- [ ] Implement database migrations
- [ ] Replace in-memory repositories with database repositories
- [ ] Add user context to all API endpoints

### **Phase 3: User Authentication Integration**
- [ ] Connect Google OAuth to user creation
- [ ] Implement JWT token validation in all endpoints
- [ ] Add user_id filtering to all data queries
- [ ] Implement user-specific analytics

### **Phase 4: Data Persistence**
- [ ] Replace in-memory storage with PostgreSQL
- [ ] Implement proper error handling for database operations
- [ ] Add data validation and constraints
- [ ] Implement soft delete for goals and progress

## 🔐 **Security Considerations**

### **1. User Data Isolation**
- **Foreign Key Constraints**: Ensure all data is properly linked to users
- **API Authorization**: Validate user ownership before any data operation
- **Row-Level Security**: Consider PostgreSQL RLS for additional security

### **2. Authentication & Authorization**
- **JWT Validation**: Validate tokens on every protected endpoint
- **User Context**: Pass user_id from JWT to all database queries
- **Session Management**: Implement proper token refresh and logout

### **3. Data Validation**
- **Input Sanitization**: Validate all user inputs
- **SQL Injection Prevention**: Use parameterized queries
- **Rate Limiting**: Prevent abuse of API endpoints

## 📈 **Performance Considerations**

### **1. Database Indexing**
```sql
-- Users table
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_google_id ON users(google_id);

-- Goals table  
CREATE INDEX idx_goals_user_id ON goals(user_id);
CREATE INDEX idx_goals_status ON goals(status);

-- Progress table
CREATE INDEX idx_progress_goal_id ON progress_entries(goal_id);
CREATE INDEX idx_progress_user_id ON progress_entries(user_id);
CREATE INDEX idx_progress_created_at ON progress_entries(created_at);
```

### **2. Query Optimization**
- **Eager Loading**: Load related data in single queries
- **Pagination**: Implement cursor-based pagination for large datasets
- **Caching**: Consider Redis for frequently accessed data

## 🧪 **Testing Strategy**

### **1. Unit Tests**
- **Repository Tests**: Test data access layer
- **Service Tests**: Test business logic
- **Schema Tests**: Test data validation

### **2. Integration Tests**
- **API Tests**: Test complete request/response cycles
- **Database Tests**: Test database operations
- **Authentication Tests**: Test user context and permissions

### **3. End-to-End Tests**
- **User Flows**: Test complete user journeys
- **Data Persistence**: Test data creation, updates, and deletion
- **Cross-User Isolation**: Ensure users can't access each other's data

## 🚀 **Next Steps**

1. **Immediate**: Test current fixes (remove demo data, fix duplicate buttons)
2. **Short-term**: Implement database models and migrations
3. **Medium-term**: Replace in-memory storage with PostgreSQL
4. **Long-term**: Add advanced features (analytics, reporting, sharing)

---

*This document will be updated as the architecture evolves.*
