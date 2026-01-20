"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { InitialStatus, StatusCondition } from "@/data/scenarioData";

interface StatusPanelProps {
  status: InitialStatus;
  isOpen?: boolean;
  onToggle?: () => void;
}

// 붓글씨 나타나는 효과
const brushReveal = {
  hidden: { 
    opacity: 0, 
    x: -20,
    filter: "blur(4px)"
  },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: {
      delay: i * 0.05,
      duration: 0.4,
      ease: "easeOut" as const,
    },
  }),
};

// 상태 이상 깜빡임
const blinkAnimation = {
  animate: {
    opacity: [1, 0.3, 1],
    textShadow: [
      "0 0 4px rgba(239, 68, 68, 0.5)",
      "0 0 12px rgba(239, 68, 68, 0.8)",
      "0 0 4px rgba(239, 68, 68, 0.5)",
    ],
  },
  transition: {
    duration: 1.5,
    repeat: Infinity,
    ease: "easeInOut" as const,
  },
};

// 기혈/내공 게이지 컴포넌트
function VitalityGauge({ 
  label, 
  value, 
  maxValue = 100,
  color = "emerald" 
}: { 
  label: string; 
  value: number; 
  maxValue?: number;
  color?: "emerald" | "indigo" | "amber";
}) {
  const percentage = Math.min((value / maxValue) * 100, 100);
  
  const colorClasses = {
    emerald: "from-emerald-700 to-emerald-500",
    indigo: "from-indigo-700 to-indigo-500",
    amber: "from-amber-700 to-amber-500",
  };

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-stone-400 font-serif">{label}</span>
        <span className="text-stone-300">{value}/{maxValue}</span>
      </div>
      <div className="h-3 bg-stone-800 rounded-sm overflow-hidden border border-stone-700 relative">
        {/* 붓터치 느낌의 게이지 */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full bg-gradient-to-r ${colorClasses[color]} relative`}
        >
          {/* 붓 질감 효과 */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `repeating-linear-gradient(
                90deg,
                transparent,
                transparent 2px,
                rgba(0,0,0,0.3) 2px,
                rgba(0,0,0,0.3) 4px
              )`,
            }}
          />
          {/* 끝부분 번짐 효과 */}
          <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-transparent to-white/10" />
        </motion.div>
      </div>
    </div>
  );
}

// 상태 이상 태그
function ConditionTag({ condition, index }: { condition: StatusCondition; index: number }) {
  const severityStyles = {
    normal: "text-stone-300 border-stone-600",
    warning: "text-amber-400 border-amber-700",
    critical: "text-red-400 border-red-700",
  };

  const isCritical = condition.severity === "critical";
  const isWarning = condition.severity === "warning";

  return (
    <motion.span
      custom={index + 10}
      variants={brushReveal}
      initial="hidden"
      animate="visible"
      className={`
        inline-block px-2 py-0.5 text-xs font-serif
        border rounded-sm bg-stone-900/50
        ${severityStyles[condition.severity]}
      `}
    >
      {(isCritical || isWarning) ? (
        <motion.span
          animate={blinkAnimation.animate}
          transition={blinkAnimation.transition}
        >
          {condition.name}
        </motion.span>
      ) : (
        condition.name
      )}
    </motion.span>
  );
}

// 정보 행 컴포넌트
function InfoRow({ 
  label, 
  value, 
  index,
  valueClassName = ""
}: { 
  label: string; 
  value: string; 
  index: number;
  valueClassName?: string;
}) {
  return (
    <motion.div
      custom={index}
      variants={brushReveal}
      initial="hidden"
      animate="visible"
      className="flex justify-between items-center py-1 border-b border-stone-800/50"
    >
      <span className="text-stone-500 text-sm font-serif">{label}</span>
      <span className={`text-stone-200 text-sm ${valueClassName}`}>{value}</span>
    </motion.div>
  );
}

export default function StatusPanel({ status, isOpen = true, onToggle }: StatusPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="
            w-72 h-fit max-h-[calc(100vh-4rem)]
            bg-stone-900/95 backdrop-blur-sm
            border border-stone-700
            rounded-lg overflow-hidden
            shadow-2xl shadow-black/50
            font-serif
          "
          style={{
            // 한지 질감 테두리 효과
            backgroundImage: `
              linear-gradient(to bottom, rgba(28, 25, 23, 0.98), rgba(28, 25, 23, 0.95)),
              url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E")
            `,
          }}
        >
          {/* 헤더 - 장식적 테두리 */}
          <div className="px-4 py-3 border-b border-stone-700 bg-stone-800/50">
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-lg text-stone-200 tracking-widest"
              style={{ fontFamily: "serif" }}
            >
              ─ 강호상태창 ─
            </motion.h2>
          </div>

          {/* 메인 컨텐츠 */}
          <div className="p-4 space-y-4 overflow-y-auto max-h-[70vh] scrollbar-thin scrollbar-thumb-stone-700">
            
            {/* 신분 정보 */}
            <section>
              <motion.h3
                custom={0}
                variants={brushReveal}
                initial="hidden"
                animate="visible"
                className="text-xs text-stone-500 mb-2 tracking-wider"
              >
                【신상】
              </motion.h3>
              <InfoRow label="신분" value={status.identity} index={1} />
              <InfoRow label="별호" value={status.alias} index={2} />
              <InfoRow label="경지" value={status.realm} index={3} />
            </section>

            {/* 기혈/내공 게이지 */}
            <section className="space-y-3">
              <motion.h3
                custom={4}
                variants={brushReveal}
                initial="hidden"
                animate="visible"
                className="text-xs text-stone-500 tracking-wider"
              >
                【기력】
              </motion.h3>
              <VitalityGauge label="기혈(氣血)" value={status.vitality} color="emerald" />
              <VitalityGauge label="내공(內功)" value={status.innerPower} color="indigo" />
            </section>

            {/* 상태 이상 */}
            {status.conditions.length > 0 && (
              <section>
                <motion.h3
                  custom={7}
                  variants={brushReveal}
                  initial="hidden"
                  animate="visible"
                  className="text-xs text-stone-500 mb-2 tracking-wider"
                >
                  【상태】
                </motion.h3>
                <div className="flex flex-wrap gap-2">
                  {status.conditions.map((condition, i) => (
                    <ConditionTag key={condition.name} condition={condition} index={i} />
                  ))}
                </div>
              </section>
            )}

            {/* 무학 */}
            <section>
              <motion.h3
                custom={12}
                variants={brushReveal}
                initial="hidden"
                animate="visible"
                className="text-xs text-stone-500 mb-2 tracking-wider"
              >
                【무학】
              </motion.h3>
              <InfoRow label="심법" value={status.cultivation.innerArt} index={13} />
              <InfoRow label="무공" value={status.cultivation.martialArt} index={14} />
              <InfoRow label="보법" value={status.cultivation.movement} index={15} />
            </section>

            {/* 행낭 */}
            <section>
              <motion.h3
                custom={16}
                variants={brushReveal}
                initial="hidden"
                animate="visible"
                className="text-xs text-stone-500 mb-2 tracking-wider"
              >
                【행낭】
              </motion.h3>
              <InfoRow 
                label="무구" 
                value={status.inventory.weapon} 
                index={17}
                valueClassName={status.inventory.weapon === '없음' ? 'text-stone-500' : ''}
              />
              <motion.div
                custom={18}
                variants={brushReveal}
                initial="hidden"
                animate="visible"
                className="mt-2"
              >
                <span className="text-stone-500 text-sm">소지품:</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {status.inventory.items.map((item, i) => (
                    <motion.span
                      key={item}
                      custom={19 + i}
                      variants={brushReveal}
                      initial="hidden"
                      animate="visible"
                      className="text-xs px-2 py-0.5 bg-stone-800 text-stone-300 rounded border border-stone-700"
                    >
                      {item}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </section>
          </div>

          {/* 푸터 장식 */}
          <div className="px-4 py-2 border-t border-stone-700 bg-stone-800/30">
            <div className="h-px bg-gradient-to-r from-transparent via-stone-600 to-transparent" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// 모바일용 토글 버튼
export function StatusPanelToggle({ 
  isOpen, 
  onToggle 
}: { 
  isOpen: boolean; 
  onToggle: () => void;
}) {
  return (
    <motion.button
      onClick={onToggle}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="
        fixed left-4 top-4 z-50
        w-12 h-12 rounded-full
        bg-stone-900/90 border border-stone-700
        flex items-center justify-center
        text-stone-300 hover:text-stone-100
        shadow-lg backdrop-blur-sm
        md:hidden
      "
    >
      <motion.span
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.3 }}
        className="text-xl"
      >
        {isOpen ? "✕" : "☰"}
      </motion.span>
    </motion.button>
  );
}
