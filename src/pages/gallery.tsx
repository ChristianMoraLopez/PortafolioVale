import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { portfolioPictures } from '@/data/portfolioPictures';
import Navbar from '@components/Navbar/Navbar';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';

// Agrupar las imágenes por técnica
const categorizedPictures = portfolioPictures.reduce((acc, picture) => {
  if (!acc[picture.tecnic!]) {
    acc[picture.tecnic!] = [];
  }
  acc[picture.tecnic!].push(picture);
  return acc;
}, {} as Record<string, typeof portfolioPictures>);

const GalleryPage = () => {
  const [currentImage, setCurrentImage] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const openLightbox = (index: number) => setCurrentImage(index);
  const closeLightbox = () => setCurrentImage(null);
  const nextImage = () => setCurrentImage((prev) => (prev! + 1) % portfolioPictures.length);
  const prevImage = () => setCurrentImage((prev) => (prev! - 1 + portfolioPictures.length) % portfolioPictures.length);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <Navbar />
      <div className="container mx-auto px-4 py-20">
        <h1 className={`text-4xl font-bold mb-12 text-center ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
          Galería de Maquillaje
        </h1>
        
        {/* Pestañas de categorías */}
        <div className="flex justify-center mb-8">
          <button
            className={`mx-2 px-4 py-2 rounded-full ${!activeCategory 
              ? 'bg-gold text-white' 
              : theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}
            onClick={() => setActiveCategory(null)}
          >
            Todas
          </button>
          {Object.keys(categorizedPictures).map((category) => (
            <button
              key={category}
              className={`mx-2 px-4 py-2 rounded-full ${activeCategory === category 
                ? 'bg-gold text-white' 
                : theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className={`animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 ${theme === 'dark' ? 'border-white' : 'border-gray-900'}`}></div>
          </div>
        ) : (
          Object.entries(categorizedPictures).map(([category, pictures]) => (
            (!activeCategory || activeCategory === category) && (
              <motion.div key={category}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className={`text-2xl font-bold mb-4 mt-8 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {pictures.map((picture, index) => (
                    <motion.div
                      key={index}
                      className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer h-[70vh]"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => openLightbox(portfolioPictures.indexOf(picture))}
                    >
                      <Image
                        src={picture.src}
                        alt={picture.description!}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-300 hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                        <h3 className="text-white text-xl font-bold">{picture.description}</h3>
                        <p className="text-white text-sm">{picture.date}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )
          ))
        )}

        <AnimatePresence>
          {currentImage !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
            >
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 text-white hover:text-gold transition-colors duration-300"
                aria-label="Cerrar"
              >
                <X size={32} />
              </button>
              <button
                onClick={prevImage}
                className="absolute left-4 text-white hover:text-gold transition-colors duration-300"
                aria-label="Imagen anterior"
              >
                <ChevronLeft size={48} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 text-white hover:text-gold transition-colors duration-300"
                aria-label="Imagen siguiente"
              >
                <ChevronRight size={48} />
              </button>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="relative w-[90vw] h-[90vh]"
              >
                <Image
                  src={portfolioPictures[currentImage!].src}
                  alt={portfolioPictures[currentImage!].description!}
                  layout="fill"
                  objectFit="contain"
                />
              </motion.div>
              <motion.div 
                className="absolute bottom-4 left-4 right-4 text-white text-center bg-black bg-opacity-50 p-4 rounded-lg"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-2xl font-bold mb-2">{portfolioPictures[currentImage!].description}</h3>
                <p className="text-lg">{portfolioPictures[currentImage!].date} - {portfolioPictures[currentImage!].location}</p>
                <p className="text-sm mt-2">
                  {portfolioPictures[currentImage!].camera} | {portfolioPictures[currentImage!].model} | Técnica: {portfolioPictures[currentImage!].tecnic}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const GalleryPageWithTheme = () => (
  <ThemeProvider>
    <GalleryPage />
  </ThemeProvider>
);

export default GalleryPageWithTheme;