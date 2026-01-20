"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { isValidFaction, getFactionName, type FactionKey } from "@/data/scenarioData";
import GameLayout from "@/components/game/GameLayout";

export default function GamePage() {
  const router = useRouter();
  const params = useParams();
  const faction = params?.faction as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isValidated, setIsValidated] = useState(false);

  // Faction 유효성 검사
  useEffect(() => {
    if (!faction || !isValidFaction(faction)) {
      // 유효하지 않은 faction이면 메인으로 리다이렉트
      router.replace("/");
      return;
    }
    setIsValidated(true);
  }, [faction, router]);

  // 로딩 완료 후 암전 해제
  useEffect(() => {
    if (isValidated) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500); // 짧은 딜레이 후 페이드인
      return () => clearTimeout(timer);
    }
  }, [isValidated]);

  // 나가기 핸들러
  const handleExit = () => {
    setIsLoading(true);
    setTimeout(() => {
      router.push("/");
    }, 500);
  };

  // 유효성 검사 전이면 아무것도 렌더링 안함
  if (!isValidated) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-stone-500 font-serif"
        >
          잠시만 기다려주십시오...
        </motion.div>
      </div>
    );
  }

  const validFaction = faction as FactionKey;

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* 게임 레이아웃 */}
      <GameLayout 
        faction={validFaction} 
        onExit={handleExit}
      />

      {/* 암전 → 밝아지는 전환 효과 */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="
              fixed inset-0 z-50
              bg-black
              flex flex-col items-center justify-center
              pointer-events-none
            "
          >
            {/* 세력 로고/텍스트 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              {/* 세력 아이콘 */}
              <motion.div
                animate={{ 
                  textShadow: [
                    "0 0 20px rgba(255,255,255,0.2)",
                    "0 0 40px rgba(255,255,255,0.4)",
                    "0 0 20px rgba(255,255,255,0.2)",
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-6xl mb-4"
              >
                {validFaction === 'orthodox' && '⚔️'}
                {validFaction === 'unorthodox' && '🗡️'}
                {validFaction === 'demonic' && '🩸'}
                {validFaction === 'outer' && '❄️'}
              </motion.div>
              
              {/* 세력명 */}
              <h1 className="text-3xl font-serif text-stone-300 tracking-[0.3em] mb-2">
                {getFactionName(validFaction)}
              </h1>
              
              {/* 로딩 텍스트 */}
              <motion.p
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-stone-500 text-sm font-serif"
              >
                운명의 서막이 열립니다...
              </motion.p>
            </motion.div>

            {/* 장식적 라인 */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="absolute bottom-1/3 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-stone-600 to-transparent"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 나가기 시 암전 효과 */}
      <AnimatePresence>
        {isLoading && isValidated && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 bg-black pointer-events-none"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
