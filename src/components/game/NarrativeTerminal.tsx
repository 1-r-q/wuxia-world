"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// 상태 업데이트 이벤트 타입
export interface StateUpdateEvent {
  type: 'status' | 'combat' | 'item' | 'location';
  data: Record<string, unknown>;
}

// 로그 메시지 타입
export interface LogMessage {
  id: string;
  type: 'narration' | 'dialogue' | 'system' | 'player';
  speaker?: string;
  content: string;
  timestamp: number;
}

interface NarrativeTerminalProps {
  initialMessages?: LogMessage[];
  onPlayerInput?: (input: string) => void;
  onStateUpdate?: (event: StateUpdateEvent) => void;
  isProcessing?: boolean;
}

// 상태 패턴 파서
function parseStateUpdates(text: string): { cleanText: string; updates: StateUpdateEvent[] } {
  const updates: StateUpdateEvent[] = [];
  // [@id=state|key:value,key:value] 패턴 감지
  const statePattern = /\[@id=(\w+)\|([^\]]+)\]/g;
  
  const cleanText = text.replace(statePattern, (match, type, data) => {
    try {
      const parsedData: Record<string, unknown> = {};
      data.split(',').forEach((pair: string) => {
        const [key, value] = pair.split(':').map((s: string) => s.trim());
        if (key && value) {
          // 숫자인 경우 변환
          parsedData[key] = isNaN(Number(value)) ? value : Number(value);
        }
      });
      updates.push({ type, data: parsedData });
    } catch (e) {
      console.error('State parse error:', e);
    }
    return ''; // 화면에서는 제거
  });

  return { cleanText: cleanText.trim(), updates };
}

// 텍스트 타입별 스타일 분석
function analyzeTextType(text: string): { type: LogMessage['type']; speaker?: string; content: string } {
  // 【Ω:서술】 패턴
  if (text.startsWith('【Ω:') || text.includes('【Ω:서술】')) {
    return { 
      type: 'narration', 
      content: text.replace(/【Ω:[^】]*】\s*/g, '') 
    };
  }
  
  // 【話:캐릭터】 패턴
  const dialogueMatch = text.match(/【話:([^】]+)】\s*(.*)/);
  if (dialogueMatch) {
    return {
      type: 'dialogue',
      speaker: dialogueMatch[1],
      content: dialogueMatch[2],
    };
  }

  // 시스템 메시지
  if (text.startsWith('[시스템]') || text.startsWith('※')) {
    return {
      type: 'system',
      content: text.replace(/^\[시스템\]\s*/, '').replace(/^※\s*/, ''),
    };
  }

  // 기본은 서술
  return { type: 'narration', content: text };
}

// 개별 메시지 컴포넌트
function MessageLine({ message, index }: { message: LogMessage; index: number }) {
  const typeStyles = {
    narration: "text-stone-300 leading-relaxed",
    dialogue: "text-amber-200 pl-4 border-l-2 border-amber-700/50",
    system: "text-cyan-400 text-sm italic",
    player: "text-emerald-300 pl-4 border-l-2 border-emerald-600/50",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.02,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className={`py-1 ${typeStyles[message.type]}`}
    >
      {message.type === 'dialogue' && message.speaker && (
        <span className="text-amber-400 font-bold mr-2">
          [{message.speaker}]
        </span>
      )}
      {message.type === 'player' && (
        <span className="text-emerald-500 mr-2">▶</span>
      )}
      <span className="font-serif">{message.content}</span>
    </motion.div>
  );
}

// 커스텀 입력창 (contenteditable)
function CustomInput({ 
  onSubmit, 
  isDisabled 
}: { 
  onSubmit: (text: string) => void;
  isDisabled: boolean;
}) {
  const inputRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const text = inputRef.current?.innerText?.trim();
      if (text && !isDisabled) {
        onSubmit(text);
        if (inputRef.current) {
          inputRef.current.innerText = '';
          setIsEmpty(true);
        }
      }
    }
  };

  const handleInput = () => {
    const text = inputRef.current?.innerText?.trim();
    setIsEmpty(!text);
  };

  return (
    <div className="relative">
      {/* Placeholder */}
      <AnimatePresence>
        {isEmpty && !isFocused && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 pointer-events-none font-serif"
          >
            행동을 입력하시오...
          </motion.span>
        )}
      </AnimatePresence>

      {/* 입력 영역 */}
      <div
        ref={inputRef}
        contentEditable={!isDisabled}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`
          min-h-[48px] max-h-32 overflow-y-auto
          px-4 py-3 
          bg-stone-900/80 backdrop-blur-sm
          border rounded-lg
          text-stone-200 font-serif
          outline-none
          transition-all duration-300
          ${isFocused 
            ? 'border-amber-600/50 shadow-lg shadow-amber-900/20' 
            : 'border-stone-700 hover:border-stone-600'
          }
          ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        style={{
          // 붓글씨 커서 효과
          caretColor: '#d97706',
        }}
      />

      {/* 전송 버튼 */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          const text = inputRef.current?.innerText?.trim();
          if (text && !isDisabled) {
            onSubmit(text);
            if (inputRef.current) {
              inputRef.current.innerText = '';
              setIsEmpty(true);
            }
          }
        }}
        disabled={isDisabled || isEmpty}
        className={`
          absolute right-2 top-1/2 -translate-y-1/2
          w-10 h-10 rounded-full
          flex items-center justify-center
          transition-all duration-300
          ${isEmpty || isDisabled
            ? 'bg-stone-800 text-stone-600'
            : 'bg-amber-700 text-amber-100 hover:bg-amber-600'
          }
        `}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </motion.button>
    </div>
  );
}

// 타이핑 인디케이터
function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center gap-1 text-stone-500 py-2"
    >
      <span className="text-sm font-serif">서술 중</span>
      <motion.span
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        ···
      </motion.span>
    </motion.div>
  );
}

export default function NarrativeTerminal({
  initialMessages = [],
  onPlayerInput,
  onStateUpdate,
  isProcessing = false,
}: NarrativeTerminalProps) {
  const [messages, setMessages] = useState<LogMessage[]>(initialMessages);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // 메시지 추가 함수
  const addMessage = useCallback((rawText: string, type: LogMessage['type'] = 'narration') => {
    // 상태 업데이트 파싱
    const { cleanText, updates } = parseStateUpdates(rawText);
    
    // 상태 업데이트가 있으면 콜백 호출
    if (updates.length > 0 && onStateUpdate) {
      updates.forEach(update => onStateUpdate(update));
    }

    // 빈 텍스트면 메시지 추가 안함
    if (!cleanText) return;

    // 텍스트 타입 분석
    const analyzed = analyzeTextType(cleanText);

    const newMessage: LogMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      type: type === 'player' ? 'player' : analyzed.type,
      speaker: analyzed.speaker,
      content: analyzed.content,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, newMessage]);
  }, [onStateUpdate]);

  // 여러 줄 한번에 추가 (오프닝용)
  const addMessages = useCallback((lines: string[]) => {
    lines.forEach((line, i) => {
      setTimeout(() => {
        addMessage(line);
      }, i * 100); // 줄마다 약간의 딜레이
    });
  }, [addMessage]);

  // 초기 메시지 설정
  useEffect(() => {
    if (initialMessages.length > 0) {
      setMessages(initialMessages);
    }
  }, [initialMessages]);

  // 자동 스크롤
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 플레이어 입력 처리
  const handlePlayerInput = (input: string) => {
    // 플레이어 메시지 추가
    addMessage(input, 'player');
    // 부모에게 전달
    onPlayerInput?.(input);
  };

  // 외부에서 메시지 추가할 수 있도록 ref로 노출
  React.useImperativeHandle(
    React.useRef({ addMessage, addMessages }),
    () => ({ addMessage, addMessages })
  );

  return (
    <div className="flex flex-col h-full">
      {/* 텍스트 로그 영역 */}
      <div 
        ref={scrollRef}
        className="
          flex-1 overflow-y-auto
          px-6 py-4
          scrollbar-thin scrollbar-thumb-stone-700 scrollbar-track-transparent
        "
        style={{
          // 가독성을 위한 그라디언트 오버레이
          background: `
            linear-gradient(to bottom, 
              rgba(0,0,0,0.7) 0%, 
              rgba(0,0,0,0.5) 20%,
              rgba(0,0,0,0.5) 80%,
              rgba(0,0,0,0.7) 100%
            )
          `,
        }}
      >
        <AnimatePresence mode="popLayout">
          {messages.map((msg, i) => (
            <MessageLine key={msg.id} message={msg} index={i} />
          ))}
        </AnimatePresence>
        
        {/* 타이핑 인디케이터 */}
        <AnimatePresence>
          {isProcessing && <TypingIndicator />}
        </AnimatePresence>
        
        {/* 스크롤 앵커 */}
        <div ref={bottomRef} />
      </div>

      {/* 입력창 영역 */}
      <div className="
        px-4 py-4
        bg-gradient-to-t from-black/90 to-transparent
        border-t border-stone-800/50
      ">
        <CustomInput 
          onSubmit={handlePlayerInput}
          isDisabled={isProcessing}
        />
        
        {/* 힌트 텍스트 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          className="text-center text-xs text-stone-600 mt-2 font-serif"
        >
          Enter 키로 전송 · 자유롭게 행동을 서술하세요
        </motion.p>
      </div>
    </div>
  );
}

// 메시지 추가를 위한 Ref 타입
export interface NarrativeTerminalRef {
  addMessage: (text: string, type?: LogMessage['type']) => void;
  addMessages: (lines: string[]) => void;
}
