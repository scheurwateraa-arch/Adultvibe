import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame } from "lucide-react";

export default function Splashscreen({ onComplete }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onComplete, 500); // Wait for fade out
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full h-full flex items-center justify-center p-8"
          >
            {/* Full Screen Logo with Neon Glow */}
            <motion.div
              animate={{ 
                filter: [
                  "drop-shadow(0 0 30px rgba(139, 92, 246, 0.6)) drop-shadow(0 0 60px rgba(236, 72, 153, 0.5))",
                  "drop-shadow(0 0 50px rgba(139, 92, 246, 0.8)) drop-shadow(0 0 80px rgba(236, 72, 153, 0.7))",
                  "drop-shadow(0 0 30px rgba(139, 92, 246, 0.6)) drop-shadow(0 0 60px rgba(236, 72, 153, 0.5))"
                ]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-full max-w-2xl"
            >
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69736b5125820d43340383f6/bbf345def_image.png"
                alt="AdultVibe Logo"
                className="w-full h-auto object-contain"
                style={{
                  maxHeight: '80vh',
                  filter: 'brightness(1.1) contrast(1.2)'
                }}
              />
            </motion.div>

            {/* Loading indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex justify-center gap-3"
            >
              <motion.span
                animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                style={{ boxShadow: '0 0 20px rgba(34, 211, 238, 0.6)' }}
              />
              <motion.span
                animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                style={{ boxShadow: '0 0 20px rgba(168, 85, 247, 0.6)' }}
              />
              <motion.span
                animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                className="w-3 h-3 rounded-full bg-gradient-to-r from-pink-500 to-orange-500"
                style={{ boxShadow: '0 0 20px rgba(236, 72, 153, 0.6)' }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}