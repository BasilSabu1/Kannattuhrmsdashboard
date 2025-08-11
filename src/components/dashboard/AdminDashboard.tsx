import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import {
  Users,
  LogOut,
  Menu,
  User,
  Shield,
  UserX,
  ClipboardList,
} from 'lucide-react';
import { OnboardingDashboard } from './OnboardingDashboard';
import { OffboardingDashboard } from './OffBoardingDashboard';
import HRManagement from './HRManagement';
import ExitRequest from './ExitRequest';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const validSections = ['onboarding', 'hr-management', 'offboarding', 'exit-request'];

// Helper function to get saved section from localStorage
const getSavedSection = (): string => {
  if (typeof window === 'undefined') return 'onboarding';
  
  try {
    const saved = window.localStorage.getItem('adminDashboard_activeSection');
    console.log('[AdminDashboard] Reading from localStorage:', saved);
    
    if (saved && validSections.includes(saved)) {
      console.log('[AdminDashboard] Using saved section:', saved);
      return saved;
    }
  } catch (error) {
    console.error('[AdminDashboard] Error reading localStorage:', error);
  }
  
  console.log('[AdminDashboard] Using default section: onboarding');
  return 'onboarding';
};

// Helper function to save section to localStorage
const setSavedSection = (section: string): void => {
  if (typeof window === 'undefined') return;
  
  try {
    window.localStorage.setItem('adminDashboard_activeSection', section);
    console.log('[AdminDashboard] Saved to localStorage:', section);
  } catch (error) {
    console.error('[AdminDashboard] Error saving to localStorage:', error);
  }
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Initialize state with saved section
  const [activeSection, setActiveSection] = useState<string>(getSavedSection);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Save to localStorage whenever activeSection changes
  useEffect(() => {
    setSavedSection(activeSection);
  }, [activeSection]);

  const sidebarItems: SidebarItem[] = [
    { id: 'onboarding', label: 'Onboarding', icon: Users },
    { id: 'hr-management', label: 'HR Management', icon: User },
    { id: 'offboarding', label: 'Offboarding', icon: UserX },
    { id: 'exit-request', label: 'Exit Requests', icon: ClipboardList },
  ];

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('adminDashboard_activeSection');
        console.log('[AdminDashboard] Cleared localStorage on logout');
      } catch (error) {
        console.error('[AdminDashboard] Error clearing localStorage:', error);
      }
    }
    logout();
    navigate('/login');
  };

  const handleSectionChange = (sectionId: string) => {
    console.log('[AdminDashboard] Changing section to:', sectionId);
    setActiveSection(sectionId);
    setSidebarOpen(false);
  };

  const renderContent = () => {
    console.log('[AdminDashboard] Rendering content for section:', activeSection);
    
    switch (activeSection) {
      case 'onboarding':
        return <OnboardingDashboard />;
      case 'hr-management':
        return <HRManagement />;
      case 'offboarding':
        return (
          <OffboardingDashboard
            onViewMoreClick={() => handleSectionChange('exit-request')}
          />
        );
      case 'exit-request':
        return <ExitRequest role="admin" />;
      default:
        console.warn('[AdminDashboard] Unknown section, defaulting to onboarding:', activeSection);
        return <OnboardingDashboard />;
    }
  };

  console.log('[AdminDashboard] Current activeSection:', activeSection);

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
      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-200 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold">HRMS Admin</h1>
                <p className="text-sm text-muted-foreground">
                  Administrator Panel
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {sidebarItems.map(item => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <li key={item.id}>
                    <Button
                      variant={isActive ? 'secondary' : 'ghost'}
                      className="w-full justify-start gap-3"
                      onClick={() => handleSectionChange(item.id)}
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
                {sidebarItems.find(item => item.id === activeSection)?.label ||
                  'Dashboard'}
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="min-h-[calc(100vh-4rem)]">{renderContent()}</main>
      </div>
    </div>
  );
};

export default AdminDashboard;