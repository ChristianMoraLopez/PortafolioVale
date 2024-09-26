import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Navbar from "@components/Navbar/Navbar";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import useCombinedContentfulData from "@/hooks/useCombinedContentfulData";
import { Alert, AlertDescription } from "@/components/ui/alert";

const GalleryPage = () => {
  const { theme } = useTheme();
  const [currentImage, setCurrentImage] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { combinedData, loading, error } = useCombinedContentfulData();

  const openLightbox = (index: number) => setCurrentImage(index);
  const closeLightbox = () => setCurrentImage(null);
  const nextImage = () => {
    setCurrentImage((prev) => {
      const currentIndex = prev === null ? 0 : prev;
      return (currentIndex + 1) % combinedData.length;
    });
  };

  const prevImage = () => {
    setCurrentImage((prev) => {
      const currentIndex = prev === null ? 0 : prev;
      return (currentIndex - 1 + combinedData.length) % combinedData.length;
    });
  };

  const categories = Array.from(
    new Set(combinedData.map((img) => img.category))
  );

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Error: {error.message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <Navbar />
      <div className="container mx-auto px-4 py-20">
        <motion.h1
          className={`text-5xl font-extrabold mb-12 text-center ${
            theme === "dark" ? "text-white" : "text-gray-900"
          } tracking-tight`}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Galería de Maquillaje
        </motion.h1>

        <motion.div
          className={`flex justify-center mb-8 flex-wrap sticky top-0 z-10 py-4 ${
            isScrolled ? "bg-opacity-90 backdrop-blur-md" : ""
          } ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <button
            className={`mx-2 px-6 py-3 rounded-full mb-2 font-semibold transition-all duration-300 ${
              !activeCategory
                ? "bg-black text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                : theme === "dark"
                ? "bg-gray-700 text-white hover:bg-gray-600"
                : "bg-gray-200 text-black hover:bg-gray-300"
            }`}
            onClick={() => setActiveCategory(null)}
          >
            Todas
          </button>
          {categories.map((category) => (
            <button
              key={category}
              className={`mx-2 px-6 py-3 rounded-full mb-2 font-semibold transition-all duration-300 ${
                activeCategory === category
                  ? "bg-black text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  : theme === "dark"
                  ? "bg-gray-700 text-white hover:bg-gray-600"
                  : "bg-gray-200 text-black hover:bg-gray-300"
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <motion.div
              className={`rounded-full h-32 w-32 border-t-4 border-b-4 ${
                theme === "dark" ? "border-white" : "border-black"
              }`}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        ) : (
          categories.map(
            (category) =>
              (!activeCategory || activeCategory === category) && (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mb-16"
                >
                  <h2
                    className={`text-3xl font-bold mb-6 mt-12 ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    } border-b-2 border-gray-300 pb-2`}
                  >
                    {category}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {combinedData
                      .filter((img) => img.category === category)
                      .map((image, index) => (
                        <motion.div
                          key={index}
                          className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer h-[70vh] group"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() =>
                            openLightbox(
                              combinedData.findIndex((img) => img === image)
                            )
                          }
                        >
                          <Image
                            src={
                              image.fields?.file?.url
                                ? `https:${image.fields.file.url}`
                                : ""
                            }
                            alt={
                              image.fields?.description?.toString() ||
                              "Image description"
                            }
                            layout="fill"
                            objectFit="cover"
                            className="transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-300" />
                          <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <p className="text-lg font-semibold truncate">
                              {typeof image.fields?.title === "string"
                                ? image.fields.title
                                : "Untitled"}
                            </p>
                            <p className="text-sm truncate">
                              {typeof image.fields?.description === "string"
                                ? image.fields.description
                                : "No description"}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </motion.div>
              )
          )
        )}

        {/* Lightbox */}
        <AnimatePresence>
          {currentImage !== null && combinedData[currentImage] && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
            >
              <motion.button
                onClick={closeLightbox}
                className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={32} />
              </motion.button>
              <motion.button
                onClick={prevImage}
                className="absolute left-4 text-white hover:text-gray-300 transition-colors duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft size={48} />
              </motion.button>
              <motion.button
                onClick={nextImage}
                className="absolute right-4 text-white hover:text-gray-300 transition-colors duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronRight size={48} />
              </motion.button>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="relative w-[90vw] h-[90vh]"
              >
                <Image
                  src={
                    combinedData[currentImage].fields?.file?.url
                      ? `https:${combinedData[currentImage].fields.file.url}`
                      : ""
                  }
                  alt={
                    combinedData[currentImage].fields?.description?.toString() ||
                    "Default image description"
                  }
                  layout="fill"
                  objectFit="contain"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 text-white p-4 rounded-lg">
                  <h3 className="text-xl font-bold mb-2">
                    {typeof combinedData[currentImage].fields?.title === "string"
                      ? combinedData[currentImage].fields.title
                      : "Untitled"}
                  </h3>
                  <p>
                    {typeof combinedData[currentImage].fields?.description === "string"
                      ? combinedData[currentImage].fields.description
                      : "No description available"}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const GalleryWithThemeProvider = () => (
  <ThemeProvider>
    <GalleryPage />
  </ThemeProvider>
);

export default GalleryWithThemeProvider;