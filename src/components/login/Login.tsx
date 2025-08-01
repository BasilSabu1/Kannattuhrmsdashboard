import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Eye, EyeOff, Lock, Mail, Users } from "lucide-react";
import axiosInstance from "@/components/apiconfig/axios";
import { API_URLS } from "@/components/apiconfig/api_urls";

interface LoginResponse {
    // Flexible token field names to handle different API responses
    access?: string;
    access_token?: string;
    token?: string;
    refresh?: string;
    refresh_token?: string;
         user?: {
         id?: number;
         email?: string;
         role: string | number; // Handle both string and number roles
         hr?: number;
         name?: string;
         contact?: string;
         address?: string;
         status?: string;
         created_date?: string;
         created_by?: string;
         password_display?: string;
     };
     user_data?: {
         id?: number;
         email?: string;
         role: string | number; // Handle both string and number roles
         hr?: number;
         name?: string;
         contact?: string;
         address?: string;
         status?: string;
         created_date?: string;
         created_by?: string;
         password_display?: string;
     };
    // Admin specific data
    admin_data?: {
        permissions: string[];
        department_access: string[];
    };
    // HR specific data
    hr_data?: {
        employee_count: number;
        department: string;
    };
}

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    const navigate = useNavigate();
    const location = useLocation();
    const { toast } = useToast();
    const { login } = useAuth();

    // Get the intended destination from location state
    const from = location.state?.from?.pathname || "/";

    // Email validation
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Form validation
    const validateForm = (): boolean => {
        const newErrors: { email?: string; password?: string } = {};

        if (!email.trim()) {
            newErrors.email = "Email is required";
        } else if (!validateEmail(email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (!password.trim()) {
            newErrors.password = "Password is required";
        } else if (password.length < 4) {
            newErrors.password = "Password must be at least 4 characters long";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Helper function to normalize role
    const normalizeRole = (role: string | number): 'admin' | 'hr' => {
        if (typeof role === 'number') {
            // Based on your API response: 2 = hr
            return role === 2 ? 'hr' : 'admin';
        }
        
        // Handle string roles - convert to lowercase for comparison
        const roleStr = String(role).toLowerCase();
        console.log("Normalizing role:", role, "to lowercase:", roleStr);
        
        if (roleStr === 'hr' || roleStr === 'h.r' || roleStr === 'human resources') {
            return 'hr';
        }
        // Default to admin for any other string value (including 'admin', 'Admin', 'ADMIN', etc.)
        return 'admin';
    };

    // Helper function to get dashboard route based on role
    const getDashboardRoute = (role: string | number): string => {
        const normalizedRole = normalizeRole(role);
        return normalizedRole === 'hr' ? '/hr-dashboard' : '/admin-dashboard';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Clear previous errors
        setErrors({});

        // Validate form
        if (!validateForm()) {
            toast({
                title: "Validation Error",
                description: "Please fix the errors below and try again",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        try {
            const payload = {
                email: email.trim(),
                password: password,
            };

            console.log("Sending login request with payload:", payload);
            console.log("API URL:", API_URLS.LOGIN.POST_LOGIN);
            console.log("Full URL:", `${axiosInstance.defaults.baseURL}${API_URLS.LOGIN.POST_LOGIN}`);

            const response = await axiosInstance.post<LoginResponse>(
                API_URLS.LOGIN.POST_LOGIN,
                payload
            );
            
            console.log("Full response:", response);
            console.log("Response data:", response.data);
            console.log("Response status:", response.status);

            // Safely extract data from response with fallbacks
            const responseData = response.data;
            console.log("Full response data:", responseData);
            
            // Try different possible field names for tokens
            const access = responseData.access || responseData.access_token || responseData.token;
            const refresh = responseData.refresh || responseData.refresh_token;
            const user = responseData.user || responseData.user_data;
            
            console.log("Extracted access token:", access);
            console.log("Extracted refresh token:", refresh);
            console.log("Extracted user data:", user);
            console.log("User object keys:", user ? Object.keys(user) : 'No user object');
            console.log("User id:", user?.id);
            console.log("User email:", user?.email);
            console.log("User role (raw):", user?.role);
            console.log("User name:", user?.name);
            
            // Validate that we have the required data
            if (!access) {
                throw new Error("Access token not found in response");
            }
            if (!user) {
                throw new Error("User data not found in response");
            }
            if (user.role === undefined || user.role === null) {
                throw new Error("User role not found in response");
            }
            
            // Normalize the role
            const normalizedRole = normalizeRole(user.role);
            console.log("Normalized role:", normalizedRole);
            
            // Store tokens in localStorage
            localStorage.setItem("access_token", access);
            if (refresh) {
                localStorage.setItem("refresh_token", refresh);
            }
console.log(responseData);

            // Store role-specific data in localStorage
            if (responseData.admin_data) {
                localStorage.setItem("admin_data", JSON.stringify(responseData.admin_data));
            }
            if (responseData.hr_data) {
                localStorage.setItem("hr_data", JSON.stringify(responseData.hr_data));
            }

            // Store complete user data with normalized role
            const normalizedUserData = {
                ...user,
                role: normalizedRole
            };
            localStorage.setItem("user_data", JSON.stringify(normalizedUserData));
            // Also store in the key that useAuth expects
            localStorage.setItem("user", JSON.stringify({
                id: user.id?.toString() || '0',
                email: user.email || '',
                role: normalizedRole,
                name: user.name || user.email || 'User'
            }));

            // Use the auth hook to login
            login(access, {
                id: user.id?.toString() || '0',
                email: user.email || '',
                role: normalizedRole,
                name: user.name || user.email || 'User'
            });

            toast({
                title: "Login Successful",
                description: `Welcome back!`,
            });

            // Get the appropriate dashboard route
            const dashboardRoute = getDashboardRoute(user.role);
            console.log("User role for navigation:", user.role);
            console.log("Normalized role for navigation:", normalizedRole);
            console.log("Dashboard route:", dashboardRoute);
            
            // Navigate to the appropriate dashboard
            console.log("About to navigate to:", dashboardRoute);
            navigate(dashboardRoute);
            console.log("Navigation called successfully");

        } catch (error: any) {
            console.error("Login error:", error);
            console.error("Error type:", typeof error);
            console.error("Error message:", error.message);
            console.error("Error response:", error.response);
            console.error("Error request:", error.request);

            let errorMessage = "An unexpected error occurred. Please try again.";
            let errorTitle = "Login Failed";

            if (error.response) {
                // Server responded with error status
                const { status, data } = error.response;

                switch (status) {
                    case 400:
                        errorTitle = "Invalid Request";
                        errorMessage = data?.message || "Please check your email and password";
                        break;
                    case 401:
                        errorTitle = "Authentication Failed";
                        errorMessage = data?.message || "Invalid email or password";
                        break;
                    case 403:
                        errorTitle = "Access Denied";
                        errorMessage = data?.message || "Your account does not have permission to access this system";
                        break;
                    case 404:
                        errorTitle = "Account Not Found";
                        errorMessage = data?.message || "No account found with this email address";
                        break;
                    case 422:
                        errorTitle = "Validation Error";
                        errorMessage = data?.message || "Please check your input and try again";
                        break;
                    case 429:
                        errorTitle = "Too Many Attempts";
                        errorMessage = data?.message || "Too many login attempts. Please try again later";
                        break;
                    case 500:
                        errorTitle = "Server Error";
                        errorMessage = data?.message || "Server is experiencing issues. Please try again later";
                        break;
                    default:
                        errorMessage = data?.message || errorMessage;
                }
            } else if (error.request) {
                // Network error
                errorTitle = "Connection Error";
                errorMessage = "Unable to connect to the server. Please check your internet connection";
            }

            toast({
                title: errorTitle,
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Clear field errors on input change
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        if (errors.email) {
            setErrors(prev => ({ ...prev, email: undefined }));
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        if (errors.password) {
            setErrors(prev => ({ ...prev, password: undefined }));
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
                    <CardDescription>
                        Sign in to your HRMS account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={handleEmailChange}
                                    className={`pl-10 ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                                    required
                                />
                            </div>
                            {errors.email && (
                                <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    className={`pl-10 pr-10 ${errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                                    required
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                            {errors.password && (
                                <p className="text-sm text-red-500 mt-1">{errors.password}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default Login;