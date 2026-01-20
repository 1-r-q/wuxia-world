"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FACTION_SCENARIOS, 
  type FactionKey, 
  type Scenario,
  type InitialStatus 
} from "@/data/scenarioData";

// 컴포넌트 임포트
import BackgroundEffect from "@/components/BackgroundEffect";
import VisualEngine from "@/components/VisualEngine";
import StatusPanel, { StatusPanelToggle } from "./StatusPanel";
import NarrativeTerminal, { 
  type LogMessage, 
  type StateUpdateEvent 
} from "./NarrativeTerminal";

interface GameLayoutProps {
  faction: FactionKey;
  onExit?: () => void;
}

// Overlay 타입 매핑
function getOverlayConfig(overlayType: string) {
  switch (overlayType) {
    case 'rain':
      return {
        videoSrc: '/videos/rain-overlay.mp4',
        blendMode: 'overlay' as const,
        opacity: 0.4,
      };
    case 'fog':
      return {
        videoSrc: '/videos/fog-overlay.mp4',
        blendMode: 'screen' as const,
        opacity: 0.3,
      };
    case 'noise':
    default:
      return {
        videoSrc: null,
        blendMode: 'overlay' as const,
        opacity: 0.15,
      };
  }
}

// VisualEngine effectType 매핑
function getEffectType(particle: string): '꽃잎' | '화염' | '빙설' | '낙엽' | '수묵' {
  switch (particle) {
    case 'petals':
      return '꽃잎';
    case 'embers':
      return '화염';
    case 'snow':
      return '빙설';
    case 'ink':
      return '수묵';
    default:
      return '꽃잎';
  }
}

// 텍스처 오버레이 컴포넌트
function TextureOverlay({ 
  type, 
  opacity = 0.2 
}: { 
  type: 'rain' | 'fog' | 'noise';
  opacity?: number;
}) {
  const config = getOverlayConfig(type);

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* 노이즈 필터 (항상 적용) */}
      <div 
        className="absolute inset-0"
        style={{
          opacity: config.opacity,
          mixBlendMode: config.blendMode,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* 비디오 오버레이 (rain/fog일 때) */}
      {config.videoSrc && (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: config.opacity,
            mixBlendMode: config.blendMode,
          }}
        >
          <source src={config.videoSrc} type="video/mp4" />
        </video>
      )}

      {/* 비 효과 (CSS 애니메이션 폴백) */}
      {type === 'rain' && !config.videoSrc && (
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 bg-gradient-to-b from-white/30 to-transparent"
              style={{
                left: `${Math.random() * 100}%`,
                height: `${20 + Math.random() * 30}px`,
              }}
              animate={{
                y: ["0vh", "100vh"],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: 0.5 + Math.random() * 0.5,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "linear",
              }}
            />
          ))}
        </div>
      )}

      {/* 안개 효과 (CSS 폴백) */}
      {type === 'fog' && !config.videoSrc && (
        <motion.div
          className="absolute inset-0"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          }}
          style={{
            background: `
              radial-gradient(ellipse at 20% 30%, rgba(255,255,255,0.1) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 70%, rgba(255,255,255,0.08) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.05) 0%, transparent 70%)
            `,
          }}
        />
      )}
    </div>
  );
}

export default function GameLayout({ faction, onExit }: GameLayoutProps) {
  const scenario = FACTION_SCENARIOS[faction];
  const [status, setStatus] = useState<InitialStatus>(scenario.initialStatus);
  const [isStatusOpen, setIsStatusOpen] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [initialMessages, setInitialMessages] = useState<LogMessage[]>([]);
  const hasInitialized = useRef(false);

  // 오프닝 텍스트 자동 출력
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    // 오프닝 메시지 생성
    const openingMessages: LogMessage[] = [];
    
    // 장소 안내
    openingMessages.push({
      id: 'loc-0',
      type: 'system',
      content: `📍 ${scenario.location}`,
      timestamp: Date.now(),
    });

    // 오프닝 라인들
    scenario.openingLines.forEach((line, i) => {
      if (line.trim() === '') {
        // 빈 줄은 무시
        return;
      }
      
      let type: LogMessage['type'] = 'narration';
      let speaker: string | undefined;
      let content = line;

      // 대화 패턴 분석
      if (line.includes('【話:')) {
        const match = line.match(/【話:([^】]+)】\s*(.*)/);
        if (match) {
          type = 'dialogue';
          speaker = match[1];
          content = match[2];
        }
      } else if (line.includes('【Ω:')) {
        content = line.replace(/【Ω:[^】]*】\s*/g, '');
      }

      openingMessages.push({
        id: `opening-${i}`,
        type,
        speaker,
        content,
        timestamp: Date.now() + i,
      });
    });

    setInitialMessages(openingMessages);
  }, [scenario]);

  // 상태 업데이트 핸들러
  const handleStateUpdate = useCallback((event: StateUpdateEvent) => {
    if (event.type === 'status') {
      setStatus(prev => ({
        ...prev,
        ...event.data,
      }));
    }
  }, []);

  // 플레이어 입력 핸들러
  const handlePlayerInput = useCallback((input: string) => {
    setIsProcessing(true);
    
    // TODO: AI API 연동
    // 현재는 데모용 딜레이
    setTimeout(() => {
      setIsProcessing(false);
    }, 1500);
  }, []);

  // 모바일 상태창 토글
  const toggleStatus = useCallback(() => {
    setIsStatusOpen(prev => !prev);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* === Z-0: 배경 레이어 === */}
      <BackgroundEffect 
        imageUrl={scenario.visualTheme.bgImage} 
        alt={`${faction} background`}
      />

      {/* === Z-10: 효과 레이어 === */}
      <TextureOverlay 
        type={scenario.visualTheme.overlayType} 
        opacity={0.3}
      />
      
      {/* 파티클 엔진 */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <VisualEngine 
          effectType={getEffectType(scenario.visualTheme.particle)}
          particleCount={30}
          color={scenario.visualTheme.ambientColor}
        />
      </div>

      {/* 분위기 색상 오버레이 */}
      <div 
        className="absolute inset-0 pointer-events-none z-10 opacity-20"
        style={{
          background: `radial-gradient(ellipse at center, transparent 0%, ${scenario.visualTheme.ambientColor} 100%)`,
        }}
      />

      {/* === Z-20: UI 레이어 === */}
      <div className="relative z-20 flex h-full">
        
        {/* 좌측: 상태 패널 */}
        <aside className="hidden md:block p-4 flex-shrink-0">
          <StatusPanel 
            status={status}
            isOpen={isStatusOpen}
          />
        </aside>

        {/* 모바일 상태 패널 (오버레이) */}
        <div className="md:hidden">
          <StatusPanelToggle isOpen={isStatusOpen} onToggle={toggleStatus} />
          <AnimatePresence>
            {isStatusOpen && (
              <motion.div
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                className="fixed left-0 top-0 h-full z-40 p-4"
              >
                <StatusPanel status={status} isOpen={true} />
              </motion.div>
            )}
          </AnimatePresence>
          {/* 배경 딤 */}
          <AnimatePresence>
            {isStatusOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={toggleStatus}
                className="fixed inset-0 bg-black/50 z-30 md:hidden"
              />
            )}
          </AnimatePresence>
        </div>

        {/* 중앙/우측: 내러티브 터미널 */}
        <main className="flex-1 flex flex-col h-full">
          {/* 헤더 */}
          <header className="flex items-center justify-between px-6 py-3 bg-gradient-to-b from-black/80 to-transparent">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl font-serif text-stone-300 tracking-wider"
            >
              {scenario.title}
            </motion.h1>
            
            {onExit && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onExit}
                className="
                  px-4 py-1.5 rounded
                  bg-stone-800/50 border border-stone-700
                  text-stone-400 hover:text-stone-200
                  text-sm font-serif
                  transition-colors
                "
              >
                나가기
              </motion.button>
            )}
          </header>

          {/* 터미널 영역 */}
          <div className="flex-1 overflow-hidden">
            <NarrativeTerminal
              initialMessages={initialMessages}
              onPlayerInput={handlePlayerInput}
              onStateUpdate={handleStateUpdate}
              isProcessing={isProcessing}
            />
          </div>
        </main>
      </div>

      {/* 비네트 효과 */}
      <div 
        className="absolute inset-0 pointer-events-none z-30"
        style={{
          background: `radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)`,
        }}
      />
    </div>
  );
}
