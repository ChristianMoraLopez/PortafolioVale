import React, { useState, useEffect } from 'react';
import Icon from '@/components/Icon';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Brush, Camera, User, Mail, Menu, X, LucideIcon } from 'lucide-react';

interface NavLinkProps {
  href: string;
  text: string;
  icon: LucideIcon;
}

const Navbar: React.FC = () => {
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

  const NavLink: React.FC<NavLinkProps> = ({ href, text, icon }) => (
    <Link href={href} passHref>
      <span className={`group flex flex-col items-center px-4 py-2 text-sm font-light tracking-wider ${
        pathname === href
          ? 'text-gold'
          : 'text-white hover:text-gold'
      } transition-colors duration-300`}>
        <Icon icon={icon} className="h-5 w-5 mb-1 group-hover:scale-110 transition-transform duration-300" />
        <span className="uppercase">{text}</span>
        <span className={`block h-0.5 w-0 group-hover:w-full transition-all duration-300 ${pathname === href ? 'bg-gold' : 'bg-white'}`}></span>
      </span>
    </Link>
  );

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ease-in-out ${
      isScrolled ? 'bg-black bg-opacity-80 backdrop-blur-md' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" passHref>
            <span className="flex-shrink-0 flex items-center">
              <Image className="h-12 w-auto" src="" alt="Logo" width={48} height={48} />
              <span className="ml-2 text-2xl font-thin tracking-widest text-white">BEAUTY <span className="text-gold">&</span> LENS</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <NavLink href="/makeup" text="Maquillaje" icon={Brush} />
            <NavLink href="/photography" text="Fotografía" icon={Camera} />
            <NavLink href="/portfolio" text="Portfolio" icon={User} />
            <NavLink href="/contact" text="Contacto" icon={Mail} />
          </div>
          <div className="md:hidden">
            <button
              onClick={toggleNav}
              className="inline-flex items-center justify-center p-2 rounded-full border border-white text-white hover:text-gold hover:border-gold focus:outline-none transition-colors duration-300"
            >
              <span className="sr-only">Abrir menú principal</span>
              <Icon icon={isNavOpen ? X : Menu} className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${isNavOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black bg-opacity-90 backdrop-blur-md">
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