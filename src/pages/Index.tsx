import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Building2, Users, FileText, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Navigation */}
      <nav className="absolute top-0 w-full z-50 py-6">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Kannattu HRMS
            </span>
          </div>
          <Button 
            onClick={handleLogin}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Sign In
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          {/* Main Heading */}
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 bg-clip-text text-transparent">
                Modern HR
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Simplified
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Streamline your human resources with our intuitive, cloud-based management platform
            </p>
          </div>

          {/* Feature Icons */}
          <div className="flex justify-center items-center space-x-8 mb-12">
            <div className="group cursor-pointer">
              <div className="w-16 h-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg flex items-center justify-center group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-sm text-gray-600 mt-2 font-medium">People</p>
            </div>
            <div className="group cursor-pointer">
              <div className="w-16 h-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg flex items-center justify-center group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                <FileText className="h-8 w-8 text-purple-600" />
              </div>
              <p className="text-sm text-gray-600 mt-2 font-medium">Documents</p>
            </div>
            <div className="group cursor-pointer">
              <div className="w-16 h-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg flex items-center justify-center group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                <Shield className="h-8 w-8 text-pink-600" />
              </div>
              <p className="text-sm text-gray-600 mt-2 font-medium">Security</p>
            </div>
          </div>

          {/* CTA Button */}
          <Button 
            size="lg"
            onClick={handleLogin}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Get Started
            <ArrowRight className="ml-3 h-5 w-5" />
          </Button>
        </div>

        {/* Floating Cards */}
        <div className="absolute bottom-12 left-12 hidden lg:block">
          <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-xl border-0 transform rotate-3 hover:rotate-0 transition-all duration-500">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold text-lg">✓</span>
              </div>
              <p className="text-sm font-semibold text-gray-700">Secure & Compliant</p>
            </div>
          </Card>
        </div>

        <div className="absolute top-32 right-12 hidden lg:block">
          <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-xl border-0 transform -rotate-3 hover:rotate-0 transition-all duration-500">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold text-lg">⚡</span>
              </div>
              <p className="text-sm font-semibold text-gray-700">Lightning Fast</p>
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