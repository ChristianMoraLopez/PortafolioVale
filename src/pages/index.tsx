import React from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar/Navbar';
import GallerySection from '@components/Gallery/GallerySection';
import { ThemeProvider } from '@/context/ThemeContext';

const Home = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
        <Navbar />
        <main className="relative h-screen">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white dark:to-black opacity-70 z-10" />
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-4 font-playfair">
              Beauty & Lens
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl text-center mb-8 font-lato">
              Maquillaje Profesional y Fotografía
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
      </div>
    </ThemeProvider>
  );
};

export default Home;