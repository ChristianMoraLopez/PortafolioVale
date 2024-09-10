import React from 'react';
import Navbar from '@/components/Navbar/Navbar';

const Home = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="relative h-screen">
        
        <div className="absolute inset-0 bg-black bg-opacity-40 z-10" />
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white text-center mb-4 font-playfair">
            Beauty & Lens
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl text-white text-center mb-8 font-lato">
            Maquillaje Profesional y Fotografía
          </p>
          <p className="text-lg sm:text-xl md:text-2xl text-white text-center max-w-2xl font-lato">
            Transforma tu belleza con un toque único y artístico.
          </p>
          <button className="mt-8 px-6 py-3 bg-pink-500 text-white text-lg font-semibold rounded-full hover:bg-pink-600 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110">
            Reserva tu sesión
          </button>
        </div>
      </main>
    </div>
  );
};

export default Home;