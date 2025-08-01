import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, LogIn } from "lucide-react";

interface TokenExpiredAlertProps {
  isVisible: boolean;
  onClose: () => void;
}

const TokenExpiredAlert = ({ isVisible, onClose }: TokenExpiredAlertProps) => {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    // Clear all auth data
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    localStorage.removeItem("user_data");
    localStorage.removeItem("admin_data");
    localStorage.removeItem("hr_data");
    
    // Navigate to login page
    navigate("/login", { replace: true });
    onClose();
  };

  // Auto-redirect after 5 seconds
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        handleLoginRedirect();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-lg max-w-md w-full p-6 border">
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-800 font-semibold">
            Session Expired
          </AlertTitle>
          <AlertDescription className="text-red-700 mt-2">
            Your login session has expired. Please sign in again to continue.
          </AlertDescription>
        </Alert>
        
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={handleLoginRedirect}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
          >
            <LogIn className="h-4 w-4 mr-2" />
            Sign In Again
          </Button>
          <Button 
            variant="outline" 
            onClick={onClose}
            className="flex-1"
          >
            Close
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground mt-4 text-center">
          You will be automatically redirected in 5 seconds...
        </p>
      </div>
    </div>
  );
};

export default TokenExpiredAlert; 