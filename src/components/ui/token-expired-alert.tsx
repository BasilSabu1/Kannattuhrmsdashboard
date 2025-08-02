import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, LogIn } from "lucide-react";

interface TokenExpiredAlertProps {
  isVisible: boolean;
  onClose: () => void;
}

const TokenExpiredAlert = ({ isVisible, onClose }: TokenExpiredAlertProps) => {
  const [countdown, setCountdown] = useState(60); // 60 seconds = 1 minute
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleLoginRedirect = () => {
    if (isRedirecting) return; // Prevent multiple redirects
    
    setIsRedirecting(true);
    
    // Clear all auth data
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    localStorage.removeItem("user_data");
    localStorage.removeItem("admin_data");
    localStorage.removeItem("hr_data");
    
    // Navigate to login page using window.location
    // This works regardless of router context
    window.location.href = "/login";
    onClose();
  };

  // Auto-redirect after 1 minute with countdown
  useEffect(() => {
    if (isVisible && !isRedirecting) {
      // Reset countdown when alert becomes visible
      setCountdown(60);
      setIsRedirecting(false);
      
      const countdownTimer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownTimer);
            handleLoginRedirect();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        clearInterval(countdownTimer);
      };
    }
  }, [isVisible]);

  // Reset state when alert is hidden
  useEffect(() => {
    if (!isVisible) {
      setCountdown(60);
      setIsRedirecting(false);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
            disabled={isRedirecting}
          >
            <LogIn className="h-4 w-4 mr-2" />
            {isRedirecting ? "Redirecting..." : "Sign In Again"}
          </Button>
          <Button 
            variant="outline" 
            onClick={onClose}
            className="flex-1"
            disabled={isRedirecting}
          >
            Close
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground mt-4 text-center">
          You will be automatically redirected in {formatTime(countdown)}...
        </p>
      </div>
    </div>
  );
};

export default TokenExpiredAlert; 