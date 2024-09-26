import React from "react";
import { motion } from "framer-motion";

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string | null;
  setActiveCategory: (category: string | null) => void;
  isScrolled: boolean;
  theme: string;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  activeCategory,
  setActiveCategory,
  isScrolled,
  theme,
}) => {
  return (
    <motion.div
      className={`flex justify-center mb-8 flex-wrap sticky top-0 z-10 py-6 ${
        isScrolled ? "backdrop-blur-lg shadow-xl" : ""
      } transition-all duration-300`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <button
        className={`mx-2 px-8 py-4 rounded-full mb-2 font-bold transition-all duration-300 ${
          !activeCategory
            ? `${theme === "dark" ? "bg-white text-gray-900" : "bg-gray-900 text-white"} shadow-lg hover:shadow-2xl transform hover:-translate-y-1`
            : theme === "dark"
            ? "text-white hover:bg-gray-700"
            : "text-gray-900 hover:bg-gray-300"
        }`}
        onClick={() => setActiveCategory(null)}
      >
        Todas las Categorías
      </button>
      {categories.map((category) => (
        <button
          key={category}
          className={`mx-2 px-8 py-4 rounded-full mb-2 font-bold transition-all duration-300 ${
            activeCategory === category
              ? `${theme === "dark" ? "bg-white text-gray-900" : "bg-gray-900 text-white"} shadow-lg hover:shadow-2xl transform hover:-translate-y-1`
              : theme === "dark"
              ? "text-white hover:bg-gray-700"
              : "text-gray-900 hover:bg-gray-300"
          }`}
          onClick={() => setActiveCategory(category)}
        >
          {category}
        </button>
      ))}
    </motion.div>
  );
};

export default CategoryFilter;