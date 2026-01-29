'use client';

import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Award, 
  Settings, 
  LogOut, 
  User, 
  BarChart3,
  GraduationCap,
  Handshake,
  X,
  Menu,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface NavItem {
  name: string;
  href: string;
  icon: any;
}

interface SidebarProps {
  role: 'learner' | 'facilitator' | 'partner_admin' | 'system_admin';
  userName?: string;
}

const navItems: Record<string, NavItem[]> = {
  learner: [
    { name: 'Dashboard', href: '/learner/dashboard', icon: LayoutDashboard },
    { name: 'My Courses', href: '/learner/courses', icon: BookOpen },
    { name: 'Certificates', href: '/learner/certificates', icon: Award },
    { name: 'Profile', href: '/learner/profile', icon: User },
  ],
  facilitator: [
    { name: 'Dashboard', href: '/facilitator/dashboard', icon: LayoutDashboard },
    { name: 'My Courses', href: '/facilitator/courses', icon: BookOpen },
    { name: 'Students', href: '/facilitator/students', icon: Users },
    { name: 'Analytics', href: '/facilitator/analytics', icon: BarChart3 },
    { name: 'Profile', href: '/facilitator/profile', icon: User },
  ],
  partner_admin: [
    { name: 'Dashboard', href: '/partner/dashboard', icon: LayoutDashboard },
    { name: 'Programs', href: '/partner/programs', icon: GraduationCap },
    { name: 'Learners', href: '/partner/learners', icon: Users },
    { name: 'Analytics', href: '/partner/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/partner/settings', icon: Settings },
  ],
  system_admin: [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Courses', href: '/admin/courses', icon: BookOpen },
    { name: 'Partners', href: '/admin/partners', icon: Handshake },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ],
};

export default function Sidebar({ role, userName }: SidebarProps) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const items = navItems[role] || navItems.learner;

  // Load collapsed state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    if (saved !== null) {
      setIsCollapsed(saved === 'true');
    }
  }, []);

  // Save collapsed state to localStorage
  const toggleCollapsed = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', String(newState));
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className={`p-6 border-b border-gray-200 ${isCollapsed ? 'px-3' : ''}`}>
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
            <img 
              src="https://res.cloudinary.com/dwa3soopc/image/upload/v1741594460/8_zziqf2.png" 
              alt="Qraft Academy" 
              className="w-8 h-8 object-contain"
            />
          </div>
          {!isCollapsed && (
            <span className="text-xl font-bold text-gray-900 whitespace-nowrap">Qraft Academy</span>
          )}
        </Link>
      </div>

      {/* User Info */}
      {userName && (
        <div className={`p-6 border-b border-gray-200 ${isCollapsed ? 'px-3' : ''}`}>
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-primary-600" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
                <p className="text-xs text-gray-500 capitalize">{role.replace('_', ' ')}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              title={isCollapsed ? item.name : ''}
              className={`flex items-center ${isCollapsed ? 'justify-center px-3' : 'space-x-3 px-3'} py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-100 text-primary-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleSignOut}
          title={isCollapsed ? 'Sign Out' : ''}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center px-3' : 'space-x-3 px-3'} py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors`}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        {isMobileOpen ? (
          <X className="w-6 h-6 text-gray-700" />
        ) : (
          <Menu className="w-6 h-6 text-gray-700" />
        )}
      </button>

      {/* Desktop Toggle Button */}
      <button
        onClick={toggleCollapsed}
        className="hidden lg:block fixed top-4 z-50 p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-all"
        style={{ left: isCollapsed ? '76px' : '244px' }}
      >
        {isCollapsed ? (
          <ChevronRight className="w-5 h-5 text-gray-700" />
        ) : (
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar - Desktop */}
      <aside className={`hidden lg:flex lg:flex-col fixed inset-y-0 left-0 bg-white border-r border-gray-200 z-30 transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}>
        <SidebarContent />
      </aside>

      {/* Sidebar - Mobile */}
      <aside
        className={`lg:hidden flex flex-col fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-200 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
