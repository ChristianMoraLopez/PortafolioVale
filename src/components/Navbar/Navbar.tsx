import React, { useState, useEffect, FC } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Brush, Camera, User, Mail, Menu, X } from 'lucide-react';

// Define el tipo para los props de NavLink
interface NavLinkProps {
  href: string;
  text: string;
  icon: FC<React.SVGProps<SVGSVGElement>>; // Define el tipo del ícono como un componente funcional que acepta props SVG
}

const Navbar: FC = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { pathname } = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const NavLink: FC<NavLinkProps> = ({ href, text, icon: Icon }) => (
    <Link href={href} passHref>
      <span className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
        pathname === href
          ? 'text-pink-600 bg-pink-100'
          : 'text-gray-700 hover:text-pink-600 hover:bg-pink-50'
      } transition-colors duration-300`}>
        <Icon className="mr-2 h-5 w-5" />
        {text}
      </span>
    </Link>
  );

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ease-in-out ${
      isScrolled ? 'bg-white shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" passHref>
              <span className="flex-shrink-0 flex items-center">
                <Image className="h-8 w-auto" src="/public/images/images/logo.png" alt="Logo"
                width={32} height={32}

                />
                <span className="ml-2 text-xl font-semibold text-gray-800">Beauty & Lens</span>
              </span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink href="/makeup" text="Maquillaje" icon={Brush} />
              <NavLink href="/photography" text="Fotografía" icon={Camera} />
              <NavLink href="/portfolio" text="Portfolio" icon={User} />
              <NavLink href="/contact" text="Contacto" icon={Mail} />
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={toggleNav}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-pink-600 hover:bg-pink-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-pink-500"
            >
              <span className="sr-only">Abrir menú principal</span>
              {isNavOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isNavOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <NavLink href="/makeup" text="Maquillaje" icon={Brush} />
          <NavLink href="/photography" text="Fotografía" icon={Camera} />
          <NavLink href="/portfolio" text="Portfolio" icon={User} />
          <NavLink href="/contact" text="Contacto" icon={Mail} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
