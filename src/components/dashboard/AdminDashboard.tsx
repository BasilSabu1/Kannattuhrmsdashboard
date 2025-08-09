// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent } from '@/components/ui/card';
// import { Separator } from '@/components/ui/separator';
// import { useAuth } from '@/hooks/use-auth';
// import { Users, LogOut, Menu, User, Shield } from 'lucide-react';
// import { OnboardingDashboard } from './OnboardingDashboard';
// import { OffboardingDashboard } from './OffBoardingDashboard';
// import HRManagement from './HRManagement';
// import ExitRequest from './ExitRequest';

// interface SidebarItem {
//   id: string;
//   label: string;
//   icon: React.ComponentType<{ className?: string }>;
//   active?: boolean;
// }

// const AdminDashboard = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [activeSection, setActiveSection] = useState('onboarding');
//   const navigate = useNavigate();
//   const { logout } = useAuth();

//   const sidebarItems: SidebarItem[] = [
//     { id: 'onboarding', label: 'Onboarding', icon: Users },
//     { id: 'hr-management', label: 'HR Management', icon: User },
//     { id: 'offboarding', label: 'Offboarding', icon: LogOut },
//     { id: 'exit-request', label: 'Exit Requests', icon: LogOut },
//   ];

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   const renderContent = () => {
//     switch (activeSection) {
//       case 'onboarding':
//         return <OnboardingDashboard />;
//       case 'hr-management':
//         return <HRManagement />;
//       case 'offboarding':
//         return <OffboardingDashboard />;
//         case 'exit-request':
//           return <ExitRequest role='admin'/>;
//       default:
//         return <OnboardingDashboard />;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Mobile Sidebar Overlay */}
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black/50 z-40 lg:hidden"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <div
//         className={`
//         fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-200 ease-in-out
//         ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
//       `}
//       >
//         <div className="flex flex-col h-full">
//           {/* Header */}
//           <div className="p-6 border-b">
//             <div className="flex items-center gap-3">
//               <Shield className="h-8 w-8 text-primary" />
//               <div>
//                 <h1 className="text-xl font-bold">HRMS Admin</h1>
//                 <p className="text-sm text-muted-foreground">
//                   Administrator Panel
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Navigation */}
//           <nav className="flex-1 p-4">
//             <ul className="space-y-2">
//               {sidebarItems.map(item => {
//                 const Icon = item.icon;
//                 return (
//                   <li key={item.id}>
//                     <Button
//                       variant={
//                         activeSection === item.id ? 'secondary' : 'ghost'
//                       }
//                       className="w-full justify-start gap-3"
//                       onClick={() => {
//                         setActiveSection(item.id);
//                         setSidebarOpen(false);
//                       }}
//                     >
//                       <Icon className="h-4 w-4" />
//                       {item.label}
//                     </Button>
//                   </li>
//                 );
//               })}
//             </ul>
//           </nav>

//           {/* Footer */}
//           <div className="p-4 border-t">
//             <Button
//               variant="ghost"
//               className="w-full justify-start gap-3 text-destructive hover:text-destructive"
//               onClick={handleLogout}
//             >
//               <LogOut className="h-4 w-4" />
//               Logout
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="lg:ml-64">
//         {/* Top Bar */}
//         <header className="bg-card border-b px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 className="lg:hidden"
//                 onClick={() => setSidebarOpen(true)}
//               >
//                 <Menu className="h-5 w-5" />
//               </Button>
//               <h2 className="text-xl font-semibold">
//                 {sidebarItems.find(item => item.id === activeSection)?.label ||
//                   'Dashboard'}
//               </h2>
//             </div>
//             <div className="flex items-center gap-4">
//               <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
//                 <User className="h-4 w-4" />
//                 <span>Admin User</span>
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Page Content */}
//         <main className="min-h-[calc(100vh-4rem)]">{renderContent()}</main>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/use-auth';
import { Users, LogOut, Menu, User, Shield } from 'lucide-react';
import { OnboardingDashboard } from './OnboardingDashboard';
import { OffboardingDashboard } from './OffBoardingDashboard';
import HRManagement from './HRManagement';
import ExitRequest from './ExitRequest';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active?: boolean;
}

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('onboarding');
  const navigate = useNavigate();
  const { logout } = useAuth();

  const sidebarItems: SidebarItem[] = [
    { id: 'onboarding', label: 'Onboarding', icon: Users },
    { id: 'hr-management', label: 'HR Management', icon: User },
    { id: 'offboarding', label: 'Offboarding', icon: LogOut },
    { id: 'exit-request', label: 'Exit Requests', icon: LogOut },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'onboarding':
        return <OnboardingDashboard />;
      case 'hr-management':
        return <HRManagement />;
      case 'offboarding':
        return (
          <OffboardingDashboard
            onViewMoreClick={() => setActiveSection('exit-request')}
          />
        );
      case 'exit-request':
        return <ExitRequest role="admin" />;
      default:
        return <OnboardingDashboard />;
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
                return (
                  <li key={item.id}>
                    <Button
                      variant={
                        activeSection === item.id ? 'secondary' : 'ghost'
                      }
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
