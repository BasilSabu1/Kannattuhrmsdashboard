import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Building2, Users, FileText, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleGetStarted = () => {
    window.open('https://onboarding.kannattu.pixelsoft.online/', '_blank');
  };

  const handleOnboarding = () => {
    window.open('https://onboarding.kannattu.pixelsoft.online/', '_blank');
  };

  const handleOffboarding = () => {
    window.open('https://offboarding.kannattu.pixelsoft.online/', '_blank');
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Navigation */}
      <nav className="absolute top-0 w-full z-50 py-4 sm:py-6">
        <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Kannattu HRMS
            </span>
          </div>
          <Button
            onClick={handleLogin}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-3 sm:px-4 py-2 text-sm sm:text-base"
          >
            Sign In
            <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto w-full">
          {/* Main Heading */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight px-2">
              <span className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 bg-clip-text text-transparent">
                Seamless Onboarding &
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Effortless Offboarding
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
              Streamline your HR processes with our comprehensive onboarding and offboarding management system.
            </p>
          </div>

          {/* Feature Icons */}
          <div className="flex justify-center items-center space-x-4 sm:space-x-6 md:space-x-8 mb-8 sm:mb-12">
            <div className="group cursor-pointer">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg flex items-center justify-center group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                <Users className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-blue-600" />
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mt-2 font-medium">People</p>
            </div>
            <div className="group cursor-pointer">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg flex items-center justify-center group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                <FileText className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-purple-600" />
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mt-2 font-medium">Documents</p>
            </div>
            <div className="group cursor-pointer">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg flex items-center justify-center group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                <Shield className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-pink-600" />
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mt-2 font-medium">Security</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-4">
            <Button
              size="lg"
              onClick={handleOnboarding}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 sm:px-10 md:px-12 py-3 sm:py-4 text-base sm:text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto min-w-[180px]"
            >
              Onboarding
              <ArrowRight className="ml-2 sm:ml-3 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button
              size="lg"
              onClick={handleOffboarding}
              className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-8 sm:px-10 md:px-12 py-3 sm:py-4 text-base sm:text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto min-w-[180px]"
            >
              Offboarding
              <ArrowRight className="ml-2 sm:ml-3 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>

        {/* Floating Cards - Hidden on mobile and small tablets */}
        {/* Floating Cards - Hidden on mobile and small tablets */}
        <div className="absolute bottom-12 left-4 sm:left-8 md:left-12 hidden md:block">
          <Card className="p-4 sm:p-6 bg-white/80 backdrop-blur-sm shadow-xl border-0 transform rotate-3 hover:rotate-0 transition-all duration-500">
            <div className="text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-gray-700">Easy Secure and Fast</p>
            </div>
          </Card>
        </div>

        <div className="absolute top-24 sm:top-28 md:top-32 right-4 sm:right-8 md:right-12 hidden md:block">
          <Card className="p-4 sm:p-6 bg-white/80 backdrop-blur-sm shadow-xl border-0 transform -rotate-3 hover:rotate-0 transition-all duration-500">
            <div className="text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-gray-700">Hassle-Free HR Management</p>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      {/* <footer className="relative z-10 py-8">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Building2 className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Kannattu HRMS
            </span>
          </div>
          <p className="text-sm text-gray-500">
            © 2024 Kannattu HRMS. All rights reserved.
          </p>
        </div>
      </footer> */}
    </div>
  );
};

export default Index;