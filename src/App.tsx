import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import HRDashboardPage from "./pages/HRDashboardPage";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import TokenExpiredAlert from "./components/ui/token-expired-alert";
import { AuthProvider, useAuth } from "./hooks/use-auth";

const queryClient = new QueryClient();

const AppContent = () => {
  const { showTokenExpiredAlert, setShowTokenExpiredAlert } = useAuth();

  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <TokenExpiredAlert 
          isVisible={showTokenExpiredAlert} 
          onClose={() => setShowTokenExpiredAlert(false)} 
        />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/admin-dashboard" 
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/hr-dashboard" 
            element={
              <ProtectedRoute allowedRoles={["hr"]}>
                <HRDashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
