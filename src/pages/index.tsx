import React from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar/Navbar';
import GallerySection from '@components/Gallery/GallerySection';
import { ThemeProvider } from '@/context/ThemeContext';

const Home = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
        <Navbar />
        <main className="flex-grow relative pt-20">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white dark:to-black opacity-70 z-10" />
          <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-4 font-playfair">
              Arte en Piel
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl text-center mb-8 font-lato">
              Maquillaje Profesional
            </p>
            <p className="text-lg sm:text-xl md:text-2xl text-center max-w-2xl font-lato mb-12">
              Transforma tu belleza con un toque único y artístico.
            </p>
            <GallerySection />
            <Link
              href="/gallery"
              className="mt-8 px-6 py-3 bg-black dark:bg-white text-white dark:text-black text-lg font-semibold rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors duration-300"
            >
              Ver más
            </Link>
          </div>
        </main>
        <footer className="py-3 text-center text-xs font-light text-gray-500 dark:text-gray-400 bg-transparent">
          <p>
            Diseñado por{' '}
            <a 
              href="https://www.linkedin.com/in/christian-moral" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-300"
            >
              Christian Mora
            </a>
          </p>
        </footer>
      </div>
    </ThemeProvider>
  );
};

export default Home;