import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import useContentfulData from "@/hooks/useCombinedContentfulData";
import Navbar from "@components/Navbar/Navbar";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useRouter } from 'next/router';
import { useInView } from 'react-intersection-observer';

const HomePage: React.FC = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const { portfolioData, loading, error } = useContentfulData();
  const services = [
    { name: "Maquillaje Artístico", key: "artistic" },
    { name: "Maquillaje Social", key: "social" },
    { name: "Bodypaint", key: "bodypaint" },
    { name: "Maquillaje Editorial", key: "editorial" }
  ];

  const mainSliderRef = useRef<Slider>(null);
  const thumbnailSliderRef = useRef<Slider>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [ref] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (current: number) => setCurrentSlide(current),
    adaptiveHeight: false,
    vertical: false,
    verticalSwiping: false,
    swipeToSlide: true,
    focusOnSelect: false,
    centerMode: false,
    centerPadding: "0px",
    arrows: true,
    prevArrow: <button className="slick-prev">Previous</button>,
    nextArrow: <button className="slick-next">Next</button>,
    cssEase: "linear",
    waitForAnimate: true,
    useTransform: false,
  };

  const thumbnailSettings = {
    ...settings,
    vertical: true,
    slidesToShow: 4,
    focusOnSelect: false,
    adaptiveHeight: false,
    verticalSwiping: true,
    swipeToSlide: true,
    arrows: false,
    cssEase: "linear",
    waitForAnimate: true,
    useTransform: false,
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % services.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [services.length]);

  useEffect(() => {
    if (mainSliderRef.current && thumbnailSliderRef.current) {
      mainSliderRef.current.slickGoTo(currentSlide, false);
      thumbnailSliderRef.current.slickGoTo(currentSlide, false);
    }
  }, [currentSlide]);

  useEffect(() => {
    if (mainSliderRef.current && thumbnailSliderRef.current) {
      mainSliderRef.current.slickGoTo(0, false);
      thumbnailSliderRef.current.slickGoTo(0, false);
    }
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    },
    hover: {
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    },
    hover: {
      scale: 1.05,
      y: -2,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10
      }
    },
    tap: {
      scale: 0.95,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -5 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    },
    hover: {
      scale: 1.02,
      rotate: 2,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-gray-900 dark:border-white" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gradient-to-b from-black via-blue-950 to-gray-900" : "bg-gradient-to-b from-gray-50 to-white"} text-gray-900 dark:text-gray-100 transition-colors duration-500`}>
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 md:pt-24">
        {/* Background Video */}
        {portfolioData.initialPortfolio.backgroundVideo && (
          <motion.div
            className="absolute inset-0 z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src={portfolioData.initialPortfolio.backgroundVideo.fields.file.url} type="video/mp4" />
            </video>
            <motion.div 
              className="absolute inset-0 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, delay: 0.5 }}
            />
          </motion.div>
        )}

        <div className="container mx-auto px-4 z-10 mt-16 md:mt-24">
          <motion.div 
            className="flex flex-col md:flex-row items-center gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Text Content - Left Side */}
            <motion.div
              className="md:w-2/3 text-center md:text-left mt-8 md:mt-0"
              variants={textVariants}
            >
                 <motion.h1
                className="text-4xl md:text-6xl font-bold mb-6"
                variants={textVariants}
                whileHover="hover"
              >
                Transformando Belleza en Arte
              </motion.h1>
<motion.div
  className="space-y-6 text-lg md:text-xl mb-8"
  variants={textVariants}
>
  <motion.p 
    className="text-xl md:text-2xl font-medium text-gray-100"
    variants={textVariants}
  >
    Hola! Soy <span className="text-pink-300 font-bold">Valentina Gómez</span>, 
    maquilladora profesional artística.
  </motion.p>
  
  <motion.p 
    className="text-lg md:text-xl leading-relaxed"
    variants={textVariants}
  >
    Transformo tu belleza en arte, combinando creatividad, técnica y una visión única 
    que resalta lo mejor de ti.
  </motion.p>
  
  <motion.p 
    className="text-base md:text-lg text-gray-200"
    variants={textVariants}
  >
    Ya sea para una producción, una sesión de fotos, un evento especial o una 
    transformación completa, mi objetivo es que vivas una experiencia inolvidable 
    desde el primer pincelazo.
  </motion.p>
  
  <motion.blockquote 
    className="border-l-4 border-pink-400 pl-6 py-4 bg-black/20 rounded-r-lg"
    variants={textVariants}
  >
    <p className="text-lg md:text-xl italic text-pink-200">
      &ldquo;Con cada maquillaje creo algo más que un look: creo impacto, estilo y emoción.
      Porque cuando el arte se encuentra con la piel, nace la magia.&ldquo;
    </p>
  </motion.blockquote>
  
  <motion.p 
    className="text-sm md:text-base text-gray-300"
    variants={textVariants}
  >
    Me formé en LCI Bogotá, y he participado en pasarelas, eventos sociales y 
    sesiones fotográficas, donde he tenido la oportunidad de crear diseños propios 
    que reflejan mi sello artístico y profesional.
  </motion.p>
</motion.div>

              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <button 
                  className="bg-gray-800 text-white px-10 py-4 rounded-full hover:bg-gray-700 transition-colors text-xl font-bold shadow-lg hover:shadow-xl"
                  onClick={() => router.push('/gallery')}
                >
                  Ver Portafolio
                </button>
              </motion.div>
            </motion.div>

            {/* Hero Image - Right Side */}
            {portfolioData.initialPortfolio.heroImage && (
              <motion.div
                className="md:w-1/2 mt-8 md:mt-0"
                variants={imageVariants}
                whileHover="hover"
              >
                <div className="relative w-[300px] md:w-[400px] h-[300px] md:h-[400px] mx-auto overflow-hidden rounded-full border-4 border-gray-800 shadow-2xl">
                  <Image
                    src={portfolioData.initialPortfolio.heroImage.fields.file.url}
                    alt={portfolioData.initialPortfolio.heroImage.fields.title}
                    fill
                    className="object-cover object-[center_top]"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Portfolio Carousel Section */}
      <motion.section 
        className="py-20 bg-background"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Portafolio
          </motion.h2>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Thumbnails */}
            <motion.div 
              className="md:w-1/4 h-[600px] overflow-hidden"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Slider
                {...thumbnailSettings}
                ref={thumbnailSliderRef}
                className="h-full"
                asNavFor={mainSliderRef.current || undefined}
              >
                {portfolioData.gallery.map((item, index) => (
                  <motion.div 
                    key={item.sys.id} 
                    className="px-2"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer transition-opacity duration-300 ${
                      currentSlide === index ? 'opacity-100' : 'opacity-50'
                    }`}>
                      {item.type === 'image' ? (
                        <Image
                          src={item.fields.file.url}
                          alt={item.fields.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <video
                          src={item.fields.file.url}
                          className="w-full h-full object-cover"
                          muted
                          loop
                          playsInline
                        />
                      )}
                    </div>
                  </motion.div>
                ))}
              </Slider>
            </motion.div>

            {/* Main Carousel */}
            <motion.div 
              className="md:w-3/4 relative"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Slider
                {...settings}
                ref={mainSliderRef}
                asNavFor={thumbnailSliderRef.current || undefined}
              >
                {portfolioData.gallery.map((item) => (
                  <motion.div 
                    key={item.sys.id} 
                    className="relative aspect-video"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {item.type === 'image' ? (
                      <Image
                        src={item.fields.file.url}
                        alt={item.fields.title}
                        fill
                        className="object-cover rounded-lg"
                      />
                    ) : (
                      <video
                        src={item.fields.file.url}
                        className="w-full h-full object-cover rounded-lg"
                        controls
                        muted
                        loop
                        playsInline
                      />
                    )}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <motion.div 
                        className="absolute bottom-6 left-6 text-white"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <h3 className="text-2xl font-bold mb-2">{item.fields.title}</h3>
                        <p className="text-lg">{item.fields.description}</p>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                ))}
              </Slider>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Services Section */}
      <motion.section
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-16 px-4"
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Nuestros Servicios
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {portfolioData.serviceCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {category.thumbnail && (
                  <motion.div 
                    className="relative h-64"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Image
                      src={category.thumbnail.fields.file.url}
                      alt={category.title}
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                )}
                <motion.div 
                  className="p-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <motion.button
                    onClick={() => router.push(`/gallery?category=${category.id}`)}
                    className="w-full bg-gray-800 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors text-lg font-semibold shadow-lg hover:shadow-xl"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Ver Galería
                  </motion.button>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
};

const HomeWithThemeProvider: React.FC = () => (
  <ThemeProvider>
    <HomePage />
  </ThemeProvider>
);

export default HomeWithThemeProvider;