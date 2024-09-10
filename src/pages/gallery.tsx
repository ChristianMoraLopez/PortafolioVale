import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { portfolioPictures } from '@/data/portfolioPictures';

const GalleryPage = () => {
  const [currentImage, setCurrentImage] = useState<number | null>(null); // Ajuste aquí

  const openLightbox = (index: number) => setCurrentImage(index);
  const closeLightbox = () => setCurrentImage(null);
  const nextImage = () => setCurrentImage((prev) => (prev! + 1) % portfolioPictures.length);
  const prevImage = () => setCurrentImage((prev) => (prev! - 1 + portfolioPictures.length) % portfolioPictures.length);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Galería de Maquillaje</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {portfolioPictures.map((picture, index) => (
          <motion.div
            key={index}
            className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openLightbox(index)}
          >
            <Image
              src={picture.src}
              alt={picture.description!}
              width={picture.width * 100}  // Ajustar el ancho
              height={picture.height * 100} // Ajustar la altura
              className="w-full h-64 object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
              <p className="text-sm font-semibold">{picture.description}</p>
              <p className="text-xs">{picture.date}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {currentImage !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white"
            aria-label="Cerrar"
          >
            <X size={24} />
          </button>
          <button
            onClick={prevImage}
            className="absolute left-4 text-white"
            aria-label="Imagen anterior"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 text-white"
            aria-label="Imagen siguiente"
          >
            <ChevronRight size={24} />
          </button>
          <Image
            src={portfolioPictures[currentImage!].src}  // Use '!' para afirmar que no es null
            alt={portfolioPictures[currentImage!].description!}
            width={portfolioPictures[currentImage!].width * 100}
            height={portfolioPictures[currentImage!].height * 100}
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />
          <div className="absolute bottom-4 left-4 right-4 text-white text-center">
            <p className="text-lg font-semibold">{portfolioPictures[currentImage!].description}</p>
            <p className="text-sm">{portfolioPictures[currentImage!].date} - {portfolioPictures[currentImage!].location}</p>
            <p className="text-xs mt-2">
              {portfolioPictures[currentImage!].camera} | {portfolioPictures[currentImage!].model} | Técnica: {portfolioPictures[currentImage!].tecnic}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default GalleryPage;
