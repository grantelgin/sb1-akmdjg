import React, { useState } from 'react';
import { ChevronDown, Menu, X, Home, Building2, Users, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  subItems?: { label: string; href: string }[];
}

const navItems: NavItem[] = [
  {
    label: 'Homeowners',
    href: '/',
    icon: <Home className="w-5 h-5" />
  },
  {
    label: 'Business Owners',
    href: '/',
    icon: <Building2 className="w-5 h-5" />
  },
  {
    label: 'Restoration Professionals',
    href: '/professionals',
    icon: <Users className="w-5 h-5" />
  },
  {
    label: 'About RRN',
    href: '#',
    icon: <Info className="w-5 h-5" />,
    subItems: [
      { label: 'FAQ', href: '/faq' },
      { label: 'Careers', href: '/careers' }
    ],
  },
];

export default function Navigation() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileOpenDropdown, setMobileOpenDropdown] = useState<string | null>(null);

  const handleDropdownClick = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  const handleMobileDropdownClick = (label: string) => {
    setMobileOpenDropdown(mobileOpenDropdown === label ? null : label);
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Home className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Restoration Response Network</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <div key={item.label} className="relative inline-flex items-center">
                  {item.subItems ? (
                    <button
                      onClick={() => handleDropdownClick(item.label)}
                      className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-blue-600"
                    >
                      {item.label}
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </button>
                  ) : (
                    <Link
                      to={item.href}
                      className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-blue-600"
                    >
                      {item.label}
                    </Link>
                  )}

                  {/* Desktop Dropdown */}
                  {item.subItems && openDropdown === item.label && (
                    <div className="absolute z-10 top-full left-0 w-56 mt-1 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                      <div className="py-1" role="menu">
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.label}
                            to={subItem.href}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            role="menuitem"
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`sm:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="pt-2 pb-3 space-y-1">
          {navItems.map((item) => (
            <div key={item.label}>
              {item.subItems ? (
                <button
                  onClick={() => handleMobileDropdownClick(item.label)}
                  className="w-full flex items-center justify-between px-4 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  <div className="flex items-center">
                    {item.icon}
                    <span className="ml-3">{item.label}</span>
                  </div>
                  <ChevronDown className={`ml-2 h-5 w-5 transform transition-transform ${
                    mobileOpenDropdown === item.label ? 'rotate-180' : ''
                  }`} />
                </button>
              ) : (
                <Link
                  to={item.href}
                  className="w-full flex items-center px-4 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  <div className="flex items-center">
                    {item.icon}
                    <span className="ml-3">{item.label}</span>
                  </div>
                </Link>
              )}

              {/* Mobile Dropdown */}
              {item.subItems && mobileOpenDropdown === item.label && (
                <div className="bg-gray-50">
                  {item.subItems.map((subItem) => (
                    <Link
                      key={subItem.label}
                      to={subItem.href}
                      className="block pl-12 pr-4 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    >
                      {subItem.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}