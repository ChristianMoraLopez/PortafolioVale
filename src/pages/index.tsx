import React from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar/Navbar';
import GallerySection from '@components/Gallery/GallerySection';
import { ThemeProvider } from '@/context/ThemeContext';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <ThemeProvider>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-black text-gray-800 dark:text-gray-200 transition-all duration-500 ease-in-out"
      >
        <Navbar />
        <main className="flex-grow relative pt-36 sm:pt-32 md:pt-40 px-6 sm:px-10 lg:px-16">
          <div className="relative z-20 max-w-7xl mx-auto">
            <GallerySection />
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mt-16 sm:mt-24 md:mt-32"
            >
              <Link
                href="/gallery"
                className="block w-max mx-auto px-10 sm:px-12 md:px-16 py-5 sm:py-6 md:py-7 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 text-base sm:text-lg md:text-xl font-bold rounded-full hover:bg-gray-700 dark:hover:bg-gray-300 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl relative overflow-hidden group"
              >
                <span className="relative z-10">Explorar Colección</span>
                <motion.span 
                  className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-300 dark:to-gray-100 opacity-0 group-hover:opacity-50 transition-opacity duration-300"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.5 }}
                />
              </Link>
            </motion.div>
          </div>
        </main>
        <footer className="py-10 sm:py-12 text-center  text-sm sm:text-base font-medium text-gray-600 dark:text-gray-400 bg-gradient-to-t from-gray-200 to-transparent dark:from-gray-800 dark:to-transparent mt-auto">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="max-w-2xl mx-auto px-6"
          >
            Diseñado con pasión por{' '}
            <a
              href="https://www.linkedin.com/in/christian-moral"
              target="_blank"
              rel="noopener noreferrer"
              className="relative inline-block group"
            >
              <span className="relative z-10 font-bold">Christian Mora</span>
              <motion.span 
                className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-gray-600 to-gray-800 dark:from-gray-400 dark:to-gray-200"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </a>
          </motion.p>
        </footer>
      </motion.div>
    </ThemeProvider>
  );
};

export default Home;