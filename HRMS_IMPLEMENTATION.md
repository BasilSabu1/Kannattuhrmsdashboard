# HRMS Dashboard Implementation

## Overview

This implementation provides a complete HRMS (Human Resource Management System) with role-based authentication and separate dashboards for Admin and HR users.

## Features Implemented

### 1. Authentication System
- **Login Page**: Clean, modern login form with email and password fields
- **API Integration**: Uses `axiosInstance.API_URLS.POST_LOGIN` for authentication
- **Token Storage**: Access tokens stored in localStorage
- **Role-based Response Handling**: Supports Admin and HR specific data in API responses

### 2. Role-based Routing
- **Admin Dashboard**: `/admin-dashboard` - Full access to onboarding management
- **HR Dashboard**: `/hr-dashboard` - HR-specific features and employee management
- **Protected Routes**: Authentication and role-based access control

### 3. Dashboard Features

#### Admin Dashboard
- **Sidebar Navigation**: Onboarding, Employees, Departments, Reports, Calendar, Settings
- **Onboarding Management**: Full access to the OnboardingDashboard component
- **Responsive Design**: Mobile-friendly with collapsible sidebar
- **Logout Functionality**: Secure logout with token cleanup

#### HR Dashboard
- **Overview Section**: Employee statistics and recent activity
- **Employee Management**: View and manage employee information
- **HR-specific Features**: Onboarding, Attendance, Leave Management
- **Modern UI**: Clean, professional interface with status badges

### 4. Authentication Flow

```typescript
// Login Response Structure
interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    role: 'admin' | 'hr';
    name?: string;
  };
  admin_data?: {
    permissions: string[];
    department_access: string[];
  };
  hr_data?: {
    employee_count: number;
    department: string;
  };
}
```

### 5. Route Protection

- **ProtectedRoute Component**: Handles authentication and role-based access
- **Automatic Redirects**: Users redirected to appropriate dashboard based on role
- **Loading States**: Smooth loading experience during authentication checks

## File Structure

```
src/
├── components/
│   ├── auth/
│   │   └── ProtectedRoute.tsx
│   ├── dashboard/
│   │   ├── AdminDashboard.tsx
│   │   ├── HRDashboard.tsx
│   │   └── OnboardingDashboard.tsx
│   ├── login/
│   │   └── Login.tsx
│   └── apiconfig/
│       ├── axios.js
│       └── api_urls.js
├── hooks/
│   └── use-auth.tsx
├── pages/
│   ├── LoginPage.tsx
│   ├── AdminDashboardPage.tsx
│   └── HRDashboardPage.tsx
└── App.tsx
```

## Usage

### Login
1. Navigate to `/login`
2. Enter email and password
3. System automatically redirects to appropriate dashboard based on role

### Admin Access
- Full access to onboarding management
- Employee and department management
- Reports and analytics
- System settings

### HR Access
- Employee overview and management
- Onboarding tracking
- Attendance and leave management
- HR-specific reports

## API Integration

The system expects the login API to return:
- `access_token`: JWT or similar authentication token
- `user`: User object with role information
- Role-specific data (`admin_data` or `hr_data`)

## Security Features

- **Token-based Authentication**: Secure token storage and management
- **Role-based Access Control**: Users can only access appropriate dashboards
- **Automatic Logout**: Token cleanup on logout
- **Protected Routes**: Unauthorized access prevention

## Responsive Design

- **Mobile-friendly**: Collapsible sidebars for mobile devices
- **Modern UI**: Clean, professional interface using shadcn/ui components
- **Consistent Styling**: Unified design language across all components

## Future Enhancements

- Session management and token refresh
- Advanced role permissions
- Real-time notifications
- Data export functionality
- Advanced reporting features 