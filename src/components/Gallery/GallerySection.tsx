import React from 'react';
import Image from 'next/image';
import useContentfulData from '@/hooks/usePortfolioPictures';

const GallerySection = () => {
  const { data, loading, error } = useContentfulData('6quQLXK8Se7CxKz9JLJde5'); 

  console.log('GallerySection Data:', data);
  console.log('Loading:', loading);
  console.log('Error:', error);

  if (data) {
    console.log('Entry:', data.fields);
  }

  // Manejo de carga y error
  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {JSON.stringify(error)}</p>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {data?.fields.images.map((image, index) => {
        // Accede a los campos de la imagen directamente
        const imageFields = image.fields;
        
        // Asegúrate de que el asset tiene los campos necesarios
        if (!imageFields) {
          console.warn('Asset no resuelto', image);
          return null; // Maneja esto de otra manera si es necesario
        }

        const imageUrl = `https:${imageFields.file.url}`; // Asegúrate de que esto es correcto
        const imageAlt = imageFields.description || 'Descripción de la imagen';

        return (
          <div key={index} className="relative overflow-hidden group">
            <Image
              src={imageUrl}
              alt={imageAlt}
              width={500} // Ajusta según sea necesario
              height={500} // Ajusta según sea necesario
              className="w-full h-64 object-cover transition-transform duration-300 transform group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black dark:bg-white bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center">
              <p className="text-white dark:text-black text-sm font-semibold p-4 text-center">
                {imageAlt}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GallerySection;
