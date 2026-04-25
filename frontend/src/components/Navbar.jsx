import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../store/useAuthStore';
import {
  Heart,
  Menu,
  X,
  Home,
  Calendar,
  Brain,
  Baby,
  Utensils,
  Shield,
  FileText,
  MessageCircle,
  User,
  LogOut,
  ChevronDown,
  Sparkles,
  Globe
} from 'lucide-react';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const profileRef = useRef(null);
  const featuresRef = useRef(null);

  const navigation = [
    { name: t('dashboard'), href: '/dashboard', icon: Home },
    { name: t('cycle_tracker'), href: '/cycles', icon: Calendar },
    { name: t('fitness'), href: '/fitness', icon: Utensils },
    { name: t('mental'), href: '/mental', icon: Brain },
    { name: t('pregnancy'), href: '/pregnancy', icon: Baby },
    { name: t('schemes'), href: '/schemes', icon: Shield },
    { name: t('reports'), href: '/reports', icon: FileText },
    { name: t('ai_chat'), href: '/ai-chat', icon: MessageCircle },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
      if (featuresRef.current && !featuresRef.current.contains(event.target)) {
        setIsFeaturesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
    setIsFeaturesOpen(false);
  }, [location.pathname]);

  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  const handleLogout = () => {
    logout();
    setIsProfileDropdownOpen(false);
  };

  const isActive = (href) => {
    if (href === '/dashboard' && location.pathname === '/') return true;
    return location.pathname === href;
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-lg border-b border-rose-100/50'
          : 'bg-white border-b border-gray-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <Heart className="w-8 h-8 text-rose-500 group-hover:scale-110 transition-transform duration-300" />
                <Sparkles className="w-3 h-3 text-amber-400 absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
                EmpowerHer
              </span>
            </Link>
          </div>

          {/* Desktop Navigation - Center */}
          {token && (
            <div className="hidden lg:flex items-center space-x-1">
              <Link
                to="/dashboard"
                className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-1.5 group ${
                  isActive('/dashboard')
                    ? 'text-rose-600 bg-rose-50'
                    : 'text-gray-600 hover:text-rose-600 hover:bg-rose-50/50'
                }`}
              >
                <Home className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${isActive('/dashboard') ? 'text-rose-500' : ''}`} />
                <span>{t('dashboard')}</span>
                {isActive('/dashboard') && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-0.5 bg-gradient-to-r from-rose-400 to-purple-400 rounded-full" />
                )}
              </Link>

              {/* Features Dropdown */}
              <div className="relative" ref={featuresRef}>
                <button
                  onClick={() => setIsFeaturesOpen(!isFeaturesOpen)}
                  className="relative px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-rose-600 hover:bg-rose-50/50 transition-all duration-200 flex items-center space-x-1.5"
                >
                  <span>Features</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isFeaturesOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu (Mega Menu) */}
                <div className={`absolute left-1/2 -translate-x-1/2 mt-2 w-[600px] transition-all duration-200 z-50 ${isFeaturesOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 grid grid-cols-2 gap-4">
                    {navigation.filter(item => item.href !== '/dashboard').map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item.href);
                      return (
                        <Link
                          key={item.href}
                          to={item.href}
                          className={`flex items-start space-x-3 p-3 rounded-xl transition-colors duration-200 ${
                            active ? 'bg-rose-50' : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className={`p-2 rounded-lg ${active ? 'bg-rose-100 text-rose-600' : 'bg-gray-100 text-gray-600'}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className={`text-sm font-semibold ${active ? 'text-rose-600' : 'text-gray-900'}`}>
                              {item.name}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Right side items */}
          <div className="flex items-center space-x-3">
            {/* Language Selector */}
            <div className="relative hidden sm:flex items-center">
              <Globe className="w-4 h-4 text-gray-400 absolute left-2.5 pointer-events-none" />
              <select
                value={i18n.language}
                onChange={handleLanguageChange}
                className="appearance-none pl-8 pr-6 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-300 cursor-pointer transition-all hover:bg-gray-100"
              >
                <option value="en">EN</option>
                <option value="hi">हि</option>
                <option value="kn">ಕ</option>
                <option value="ta">த</option>
                <option value="te">తె</option>
              </select>
            </div>

            {/* Auth buttons or Profile dropdown */}
            {!token ? (
              <div className="hidden md:flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-rose-600 font-medium transition-colors text-sm"
                >
                  {t('login')}
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-rose-500 to-rose-600 text-white px-5 py-2 rounded-lg hover:from-rose-600 hover:to-rose-700 transition-all duration-300 font-medium text-sm shadow-md shadow-rose-200 hover:shadow-lg hover:shadow-rose-300 hover:-translate-y-0.5"
                >
                  {t('register')}
                </Link>
              </div>
            ) : (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none rounded-lg px-2 py-1.5 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-rose-400 to-purple-500 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white text-sm font-semibold">
                      {user?.first_name?.[0] || user?.username?.[0] || 'U'}
                    </span>
                  </div>
                  <span className="hidden md:inline text-sm font-medium">{user?.first_name || user?.username}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{user?.first_name} {user?.last_name}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email || user?.username}</p>
                    </div>
                    <Link
                      to="/onboarding"
                      className="flex items-center space-x-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span>{t('profile')}</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t('logout')}</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 py-3 animate-in slide-in-from-top duration-200">
            {token && (
              <div className="space-y-1 mb-3">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        isActive(item.href)
                          ? 'bg-rose-50 text-rose-600'
                          : 'text-gray-600 hover:text-rose-600 hover:bg-rose-50/50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Mobile language selector */}
            <div className="px-4 py-2 border-t border-gray-100 sm:hidden">
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-gray-400" />
                <select
                  value={i18n.language}
                  onChange={handleLanguageChange}
                  className="flex-1 px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                >
                  <option value="en">English</option>
                  <option value="hi">हिंदी</option>
                  <option value="kn">ಕನ್ನಡ</option>
                  <option value="ta">தமிழ்</option>
                  <option value="te">తెలుగు</option>
                </select>
              </div>
            </div>

            {/* Mobile auth buttons */}
            {!token && (
              <div className="px-4 pt-3 space-y-2 border-t border-gray-100 md:hidden">
                <Link
                  to="/login"
                  className="block text-center py-2.5 text-gray-700 hover:text-rose-600 font-medium rounded-lg border border-gray-200 transition-colors"
                >
                  {t('login')}
                </Link>
                <Link
                  to="/register"
                  className="block text-center py-2.5 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-medium rounded-lg hover:from-rose-600 hover:to-rose-700 transition-all"
                >
                  {t('register')}
                </Link>
              </div>
            )}

            {token && (
              <div className="px-4 pt-3 space-y-1 border-t border-gray-100">
                <Link
                  to="/onboarding"
                  className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  <User className="w-5 h-5" />
                  <span>{t('profile')}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <LogOut className="w-5 h-5" />
                  <span>{t('logout')}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
