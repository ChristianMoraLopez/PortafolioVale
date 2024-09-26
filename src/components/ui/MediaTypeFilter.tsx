import React from "react";
import { motion } from "framer-motion";

interface MediaTypeFilterProps {
  activeMediaType: "all" | "images" | "videos";
  setActiveMediaType: (type: "all" | "images" | "videos") => void;
  theme: string;
}

const MediaTypeFilter: React.FC<MediaTypeFilterProps> = ({
  activeMediaType,
  setActiveMediaType,
  theme,
}) => {
  return (
    <motion.div
      className="flex justify-center mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      {["all", "images", "videos"].map((type) => (
        <button
          key={type}
          className={`mx-2 px-8 py-4 rounded-full mb-2 font-bold transition-all duration-300 ${
            activeMediaType === type
              ? `${theme === "dark" ? "bg-white text-gray-900" : "bg-gray-900 text-white"} shadow-lg hover:shadow-2xl transform hover:-translate-y-1`
              : theme === "dark"
              ? "bg-gray-800 text-white hover:bg-gray-700"
              : "bg-gray-200 text-gray-900 hover:bg-gray-300"
          }`}
          onClick={() => setActiveMediaType(type as "all" | "images" | "videos")}
        >
          {type === "all" ? "Todos" : type === "images" ? "Imágenes" : "Videos"}
        </button>
      ))}
    </motion.div>
  );
};

export default MediaTypeFilter;