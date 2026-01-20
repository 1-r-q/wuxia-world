"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Faction } from '@/data/factions';

export default function ClientAnimations({ faction }: { faction: Faction }) {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    return (
        <>
            {/* Ink Wipe Transition Effect on Mount */}
            <motion.div
                initial={{ scaleY: 1 }}
                animate={{ scaleY: 0 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                style={{ originY: 0 }}
                className="fixed inset-0 z-50 bg-black pointer-events-none"
            />
            
            {/* Title Animation */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                className="relative"
            >
                {/* Glowing Aura behind title */}
                <div 
                    className="absolute inset-0 blur-[100px] opacity-30 animate-pulse" 
                    style={{ backgroundColor: faction.colors.secondary }} 
                />
                
                <h1 className="text-6xl md:text-9xl font-myeongjo text-white mb-6 relative z-10 drop-shadow-2xl">
                    {faction.name}
                </h1>
                
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1, delay: 1 }}
                    className="h-1 mx-auto mt-8"
                    style={{ backgroundColor: faction.colors.accent, maxWidth: '200px' }}
                />
            </motion.div>
        </>
    );
}
