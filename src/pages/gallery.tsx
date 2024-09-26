import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, Loader } from "lucide-react";
import Navbar from "@components/Navbar/Navbar";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import useCombinedContentfulData from "@/hooks/useCombinedContentfulData";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ContentItem } from "@/types/PortfolioContentFulTypes";


const GalleryPage = () => {
  const { theme } = useTheme();
  const [currentImage, setCurrentImage] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { combinedData, loading, error } = useCombinedContentfulData();
  const [isClosing, setIsClosing] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const isVideo = (url: string) => {
    return url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.ogg');
  };

  const openLightbox = (index: number) => setCurrentImage(index);
  
  const closeLightbox = () => {
    setIsClosing(true);
    setTimeout(() => {
      setCurrentImage(null);
      setIsClosing(false);
    }, 500);
  };

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
    new Set(combinedData.map((img: ContentItem) => img.category))
  );

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
    <div className={`min-h-screen ${theme === "dark" ? "bg-gradient-to-b from-gray-900 to-gray-800" : "bg-gradient-to-b from-gray-50 to-white"} text-gray-900 dark:text-white`}>
      <Navbar />
      <div className="container mx-auto px-4 py-20">
        <motion.h1
          className="text-6xl font-extrabold mb-12 text-center tracking-tight leading-none"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Galería de Maquillaje
        </motion.h1>

        <motion.div
          className={`flex justify-center mb-8 flex-wrap sticky top-0 z-10 py-6 ${
            isScrolled ? "bg-opacity-95 backdrop-blur-lg shadow-xl" : ""
          } ${theme === "dark" ? "bg-gray-900" : "bg-white"} transition-all duration-300`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <button
            className={`mx-2 px-8 py-4 rounded-full mb-2 font-bold transition-all duration-300 ${
              !activeCategory
                ? `${theme === "dark" ? "bg-white text-gray-900" : "bg-gray-900 text-white"} shadow-lg hover:shadow-2xl transform hover:-translate-y-1`
                : theme === "dark"
                ? "bg-gray-800 text-white hover:bg-gray-700"
                : "bg-gray-200 text-gray-900 hover:bg-gray-300"
            }`}
            onClick={() => setActiveCategory(null)}
          >
            Todas
          </button>
          {categories.map((category) => (
            <button
              key={category}
              className={`mx-2 px-8 py-4 rounded-full mb-2 font-bold transition-all duration-300 ${
                activeCategory === category
                  ? `${theme === "dark" ? "bg-white text-gray-900" : "bg-gray-900 text-white"} shadow-lg hover:shadow-2xl transform hover:-translate-y-1`
                  : theme === "dark"
                  ? "bg-gray-800 text-white hover:bg-gray-700"
                  : "bg-gray-200 text-gray-900 hover:bg-gray-300"
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
                theme === "dark" ? "border-white" : "border-gray-900"
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
                    className={`text-4xl font-bold mb-8 mt-16 ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    } border-b-2 ${theme === "dark" ? "border-gray-700" : "border-gray-300"} pb-4`}
                  >
                    {category}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {combinedData
                      .filter((item: ContentItem) => item.category === category)
                      .map((item: ContentItem, index: number) => {
                        const url = item.fields?.file?.url ? `https:${item.fields.file.url}` : "";
                        return (
                          <motion.div
                            key={index}
                            className="relative overflow-hidden rounded-2xl shadow-2xl cursor-pointer h-[70vh] group"
                            whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => openLightbox(combinedData.findIndex((img: ContentItem) => img === item))}
                          >
                            {isVideo(url) ? (
                              <video
                                src={url}
                                className="w-full h-full object-cover"
                                controls={false}
                                muted
                                loop
                                playsInline
                              />
                            ) : (
                              <Image
                                src={url}
                                alt={item.fields?.description?.toString() || "Image description"}
                                layout="fill"
                                objectFit="cover"
                                className="transition-transform duration-500 group-hover:scale-110"
                              />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-300" />
                            <div className="absolute bottom-6 left-6 right-6 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                              <p className="text-2xl font-bold mb-2 truncate">
                                {typeof item.fields?.title === "string"
                                  ? item.fields.title
                                  : "Untitled"}
                              </p>
                              <p className="text-lg truncate">
                                {typeof item.fields?.description === "string"
                                  ? item.fields.description
                                  : "No description"}
                              </p>
                            </div>
                          </motion.div>
                        );
                      })}
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
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center"
            >
              <motion.button
                onClick={closeLightbox}
                className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors duration-300"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={36} />
              </motion.button>
              <motion.button
                onClick={prevImage}
                className="absolute left-6 text-white hover:text-gray-300 transition-colors duration-300"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft size={56} />
              </motion.button>
              <motion.button
                onClick={nextImage}
                className="absolute right-6 text-white hover:text-gray-300 transition-colors duration-300"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronRight size={56} />
              </motion.button>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="relative w-[90vw] h-[90vh]"
              >
                {isClosing ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader className="w-16 h-16 text-white animate-spin" />
                  </div>
                ) : (
                  <>
                    {isVideo(combinedData[currentImage].fields?.file?.url || "") ? (
                      <video
                        src={`https:${combinedData[currentImage].fields?.file?.url}`}
                        className="w-full h-full object-contain"
                        controls
                        autoPlay
                        loop
                      />
                    ) : (
                      <Image
                        src={`https:${combinedData[currentImage].fields?.file?.url}`}
                        alt={combinedData[currentImage].fields?.description?.toString() || "Default image description"}
                        layout="fill"
                        objectFit="contain"
                      />
                    )}
                  </>
                )}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="absolute bottom-6 left-6 right-6 bg-black bg-opacity-70 text-white p-6 rounded-xl backdrop-blur-sm"
                >
                  <h3 className="text-2xl font-bold mb-3">
                    {typeof combinedData[currentImage].fields?.title === "string"
                      ? combinedData[currentImage].fields.title
                      : "Untitled"}
                  </h3>
                  <p className="text-lg">
                    {typeof combinedData[currentImage].fields?.description === "string"
                      ? combinedData[currentImage].fields.description
                      : "No description available"}
                  </p>
                </motion.div>
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