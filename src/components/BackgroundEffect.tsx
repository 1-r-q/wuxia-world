"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  imageUrl: string;
  alt?: string;
}

export default function BackgroundEffect({ imageUrl, alt = "Background" }: Props) {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-black -z-50">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={imageUrl}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ 
            scale: 1.2, 
            opacity: 1,
            x: ["0%", "2%", "-2%", "0%"], // Long slow pan
            y: ["0%", "-2%", "2%", "0%"]
          }}
          exit={{ opacity: 0 }}
          transition={{ 
            scale: { duration: 20, ease: "linear" }, // Ken Burns Zoom
            opacity: { duration: 1.5 }, // Cross-fade
            x: { duration: 30, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" },
            y: { duration: 25, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }
          }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Using simple img or div background */}
          <div 
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
        </motion.div>
      </AnimatePresence>
      
      {/* Dark Overlay to ensure text readability */}
      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
}
