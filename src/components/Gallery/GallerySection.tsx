import React from 'react';
import Image from 'next/image';
import { portfolioPictures } from '@/data/portfolioPictures';

const GallerySection = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {portfolioPictures.slice(0, 4).map((picture, index) => (
        <div key={index} className="relative overflow-hidden group">
          <Image
            src={picture.src}
            alt={picture.description || ''}
            width={picture.width * 100}
            height={picture.height * 100}
            className="w-full h-64 object-cover transition-transform duration-300 transform group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black dark:bg-white bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center">
            <p className="text-white dark:text-black text-sm font-semibold p-4 text-center">
              {picture.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GallerySection;