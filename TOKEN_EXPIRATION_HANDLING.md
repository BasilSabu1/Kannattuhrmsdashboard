# Token Expiration Handling

This document explains how token expiration is handled in the application.

## Overview

When a user's access token expires, the application automatically detects this and shows a centered alert box that redirects the user to the login page.

## Components

### 1. TokenExpiredAlert Component (`src/components/ui/token-expired-alert.tsx`)

A responsive, centered alert box that:
- Shows when token is expired
- Displays a clear message about session expiration
- Provides buttons to sign in again or close the alert
- Auto-redirects to login page after 5 seconds
- Clears all authentication data from localStorage

### 2. Enhanced Axios Configuration (`src/components/apiconfig/axios.js`)

The axios instance now includes:
- **Request Interceptor**: Automatically adds the Bearer token to all requests
- **Response Interceptor**: Detects 401 errors and checks for token expiration messages
- **Token Expiration Detection**: Identifies expired tokens based on specific error messages:
  - `"Given token not valid for any token type"`
  - `"token_not_valid"`
  - Messages containing "token", "expired", or "invalid"

### 3. Updated Auth Hook (`src/hooks/use-auth.tsx`)

The auth hook now:
- Listens for `tokenExpired` custom events
- Manages the `showTokenExpiredAlert` state
- Automatically clears user data when token expires
- Provides the alert state to the App component

### 4. App Integration (`src/App.tsx`)

The App component:
- Includes the TokenExpiredAlert component
- Manages the alert visibility through the auth hook
- Ensures the alert appears above all other content

## How It Works

1. **Detection**: When any API call returns a 401 error with token expiration messages, the axios interceptor detects it
2. **Cleanup**: All authentication data is cleared from localStorage
3. **Event Dispatch**: A custom `tokenExpired` event is dispatched
4. **Alert Display**: The auth hook receives the event and shows the alert
5. **User Action**: User can either click "Sign In Again" or wait for auto-redirect
6. **Redirect**: User is automatically redirected to the login page

## Error Messages Handled

The system detects token expiration from these API error responses:
- `detail: "Given token not valid for any token type"`
- `code: "token_not_valid"`
- Any message containing "token", "expired", or "invalid"

## Benefits

- **Centralized Handling**: All token expiration is handled in one place
- **User-Friendly**: Clear, responsive alert with auto-redirect
- **Automatic Cleanup**: All auth data is properly cleared
- **Non-Intrusive**: Doesn't affect other application functionality
- **Consistent**: Works across all components that use axios

## Usage

No additional code is needed in components. The token expiration handling is automatic and works with any API call that uses the configured axios instance. 