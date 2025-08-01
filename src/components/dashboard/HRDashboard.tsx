import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { 
  Users, 
  FileText, 
  Settings, 
  BarChart3, 
  LogOut, 
  Menu,
  User,
  Building,
  Calendar,
  UserCheck,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Search,
  Filter
} from "lucide-react";

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active?: boolean;
}

interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  status: 'active' | 'pending' | 'on-leave';
  joinDate: string;
  documents: number;
}

const HRDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const navigate = useNavigate();
  const { logout } = useAuth();

  const sidebarItems: SidebarItem[] = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "employees", label: "Employees", icon: Users },
    { id: "onboarding", label: "Onboarding", icon: UserCheck },
    { id: "attendance", label: "Attendance", icon: Clock },
    { id: "leave", label: "Leave Management", icon: Calendar },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  // Mock data for HR dashboard
  const mockEmployees: Employee[] = [
    { id: "EMP001", name: "John Doe", email: "john.doe@company.com", department: "Engineering", position: "Software Developer", status: "active", joinDate: "2024-01-15", documents: 8 },
    { id: "EMP002", name: "Jane Smith", email: "jane.smith@company.com", department: "Marketing", position: "Marketing Specialist", status: "pending", joinDate: "2024-01-20", documents: 7 },
    { id: "EMP003", name: "Mike Johnson", email: "mike.johnson@company.com", department: "Finance", position: "Financial Analyst", status: "active", joinDate: "2024-01-18", documents: 8 },
    { id: "EMP004", name: "Sarah Wilson", email: "sarah.wilson@company.com", department: "HR", position: "HR Coordinator", status: "on-leave", joinDate: "2024-01-12", documents: 6 },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "default",
      pending: "secondary",
      "on-leave": "outline"
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status.replace("-", " ").toUpperCase()}
      </Badge>
    );
  };

  const renderOverview = () => (
    <div className="p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Employees</p>
                <p className="text-3xl font-bold">{mockEmployees.length}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-500">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Employees</p>
                <p className="text-3xl font-bold">{mockEmployees.filter(emp => emp.status === 'active').length}</p>
              </div>
              <div className="p-3 rounded-full bg-green-500">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Onboarding</p>
                <p className="text-3xl font-bold">{mockEmployees.filter(emp => emp.status === 'pending').length}</p>
              </div>
              <div className="p-3 rounded-full bg-yellow-500">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">On Leave</p>
                <p className="text-3xl font-bold">{mockEmployees.filter(emp => emp.status === 'on-leave').length}</p>
              </div>
              <div className="p-3 rounded-full bg-orange-500">
                <AlertCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Employees */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Employees</CardTitle>
          <CardDescription>Latest employee additions and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockEmployees.slice(0, 5).map((employee) => (
              <div key={employee.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{employee.name}</p>
                    <p className="text-sm text-muted-foreground">{employee.position} • {employee.department}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {getStatusBadge(employee.status)}
                  <span className="text-sm text-muted-foreground">{employee.joinDate}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderEmployees = () => (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Employee Management</h2>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Employee
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Employees</CardTitle>
              <CardDescription>Manage employee information and status</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  placeholder="Search employees..."
                  className="pl-10 pr-4 py-2 border rounded-md"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockEmployees.map((employee) => (
              <div key={employee.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{employee.name}</p>
                    <p className="text-sm text-muted-foreground">{employee.email}</p>
                    <p className="text-sm text-muted-foreground">{employee.position} • {employee.department}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Documents</p>
                    <p className="font-medium">{employee.documents}/8</p>
                  </div>
                  {getStatusBadge(employee.status)}
                  <Button variant="outline" size="sm">View</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return renderOverview();
      case "employees":
        return renderEmployees();
      case "onboarding":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Onboarding Management</h2>
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">Onboarding management features coming soon...</p>
              </CardContent>
            </Card>
          </div>
        );
      case "attendance":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Attendance Management</h2>
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">Attendance management features coming soon...</p>
              </CardContent>
            </Card>
          </div>
        );
      case "leave":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Leave Management</h2>
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">Leave management features coming soon...</p>
              </CardContent>
            </Card>
          </div>
        );
      case "reports":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Reports & Analytics</h2>
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">Reports and analytics features coming soon...</p>
              </CardContent>
            </Card>
          </div>
        );
      case "settings":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Settings</h2>
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">Settings features coming soon...</p>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold">HRMS HR</h1>
                <p className="text-sm text-muted-foreground">HR Management Panel</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <Button
                      variant={activeSection === item.id ? "secondary" : "ghost"}
                      className="w-full justify-start gap-3"
                      onClick={() => {
                        setActiveSection(item.id);
                        setSidebarOpen(false);
                      }}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-destructive hover:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar */}
        <header className="bg-card border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h2 className="text-xl font-semibold">
                {sidebarItems.find(item => item.id === activeSection)?.label || "Dashboard"}
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>HR User</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="min-h-[calc(100vh-4rem)]">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default HRDashboard; 