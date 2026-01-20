"use client";

import React, { useState, useMemo, useEffect, useCallback, memo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useAudio } from "@/components/AudioManager";
import { 
  CHARACTERS, 
  Character, 
  Realm, 
  FactionCategory,
  EXPRESSION_LABELS 
} from "@/data/characters";
import { getFactionById } from "@/data/factions";

// 드래그 스크롤 훅
function useDragScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    setIsDragging(true);
    setStartX(e.pageX - ref.current.offsetLeft);
    setScrollLeft(ref.current.scrollLeft);
    ref.current.style.cursor = 'grabbing';
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !ref.current) return;
    e.preventDefault();
    const x = e.pageX - ref.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    ref.current.scrollLeft = scrollLeft - walk;
  }, [isDragging, startX, scrollLeft]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    if (ref.current) {
      ref.current.style.cursor = 'grab';
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
    if (ref.current) {
      ref.current.style.cursor = 'grab';
    }
  }, []);

  // 터치 지원
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!ref.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - ref.current.offsetLeft);
    setScrollLeft(ref.current.scrollLeft);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || !ref.current) return;
    const x = e.touches[0].pageX - ref.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    ref.current.scrollLeft = scrollLeft - walk;
  }, [isDragging, startX, scrollLeft]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  return {
    ref,
    isDragging,
    handlers: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseLeave,
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    }
  };
}

// ============================================
// 정통무협 스타일 인물록 페이지
// 此武林無桃源 - 이 무림에 낙원은 없다
// ============================================

// 필터 옵션
const REALM_OPTIONS: Realm[] = ["현경", "화경", "초절정", "절정", "1류", "2류", "3류"];
const CATEGORY_OPTIONS: { id: FactionCategory; name: string; hanja: string }[] = [
  { id: "orthodox", name: "정파", hanja: "正" },
  { id: "unorthodox", name: "사파", hanja: "邪" },
  { id: "demonic", name: "마교", hanja: "魔" },
  { id: "outer", name: "세외", hanja: "外" },
  { id: "hidden", name: "은거", hanja: "隱" },
  { id: "imperial", name: "관부", hanja: "官" },
];

// 경지별 한자
const REALM_HANJA: Record<Realm, string> = {
  "현경": "玄境",
  "화경": "化境", 
  "초절정": "超絶頂",
  "절정": "絶頂",
  "1류": "一流",
  "2류": "二流",
  "3류": "三流",
};

// 경지별 스타일
const REALM_STYLES: Record<Realm, { color: string; bg: string }> = {
  "현경": { color: "#fbbf24", bg: "rgba(251, 191, 36, 0.15)" },
  "화경": { color: "#f97316", bg: "rgba(249, 115, 22, 0.15)" },
  "초절정": { color: "#a855f7", bg: "rgba(168, 85, 247, 0.15)" },
  "절정": { color: "#3b82f6", bg: "rgba(59, 130, 246, 0.15)" },
  "1류": { color: "#22c55e", bg: "rgba(34, 197, 94, 0.15)" },
  "2류": { color: "#9ca3af", bg: "rgba(156, 163, 175, 0.15)" },
  "3류": { color: "#a8a29e", bg: "rgba(168, 162, 158, 0.15)" },
};

// ============================================
// 수묵화 배경 컴포넌트
// ============================================
function InkBackground() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      pointerEvents: 'none',
      zIndex: 0,
      overflow: 'hidden'
    }}>
      {/* 수묵 그라데이션 */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `
          radial-gradient(ellipse at 15% 15%, rgba(139, 90, 43, 0.08) 0%, transparent 50%),
          radial-gradient(ellipse at 85% 85%, rgba(139, 90, 43, 0.05) 0%, transparent 50%),
          radial-gradient(ellipse at 50% 50%, rgba(0, 0, 0, 0.3) 0%, transparent 70%)
        `
      }} />
      
      {/* 한지 텍스처 노이즈 */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.03,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
      }} />

      {/* 먹물 번짐 효과 */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        left: '-10%',
        width: '50%',
        height: '50%',
        background: 'radial-gradient(ellipse, rgba(20, 15, 10, 0.4) 0%, transparent 70%)',
        filter: 'blur(60px)'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-20%',
        right: '-10%',
        width: '60%',
        height: '60%',
        background: 'radial-gradient(ellipse, rgba(20, 15, 10, 0.3) 0%, transparent 70%)',
        filter: 'blur(80px)'
      }} />
    </div>
  );
}

// ============================================
// 세로 장식 텍스트
// ============================================
function VerticalDecoration({ text, side }: { text: string; side: 'left' | 'right' }) {
  return (
    <div style={{
      position: 'fixed',
      [side]: 'clamp(10px, 2vw, 30px)',
      top: '50%',
      transform: 'translateY(-50%)',
      writingMode: 'vertical-rl',
      textOrientation: 'upright',
      fontSize: 'clamp(0.7rem, 1.2vw, 1rem)',
      color: 'rgba(139, 90, 43, 0.15)',
      letterSpacing: '0.5em',
      fontFamily: '"Nanum Myeongjo", serif',
      zIndex: 1,
      userSelect: 'none'
    }} className="hidden lg:block">
      {text}
    </div>
  );
}

// ============================================
// 두루마리 프레임 장식
// ============================================
function ScrollDecorations() {
  return (
    <>
      {/* 상단 두루마리 장식 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'min(90%, 800px)',
        height: '8px',
        background: 'linear-gradient(180deg, rgba(139, 90, 43, 0.4) 0%, rgba(139, 90, 43, 0.1) 100%)',
        borderRadius: '0 0 50% 50%',
        boxShadow: '0 4px 20px rgba(139, 90, 43, 0.2)'
      }} />
      
      {/* 상단 중앙 옥패 장식 */}
      <div style={{
        position: 'absolute',
        top: '-12px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '60px',
        height: '24px',
        background: 'linear-gradient(180deg, rgba(180, 130, 70, 0.6) 0%, rgba(139, 90, 43, 0.4) 100%)',
        borderRadius: '4px 4px 12px 12px',
        border: '1px solid rgba(180, 130, 70, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.65rem',
        color: 'rgba(254, 243, 199, 0.9)',
        fontFamily: '"Nanum Myeongjo", serif',
        letterSpacing: '0.2em',
        zIndex: 5
      }}>
        人物
      </div>
    </>
  );
}

// ============================================
// 메인 페이지 컴포넌트
// ============================================
export default function CharactersPage() {
  const [selectedCategory, setSelectedCategory] = useState<FactionCategory | "all">("all");
  const [selectedRealm, setSelectedRealm] = useState<Realm | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "scroll">("grid");
  const [isLoaded, setIsLoaded] = useState(false);
  const { playHover, playClick } = useAudio();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // 필터링된 캐릭터
  const filteredCharacters = useMemo(() => {
    let result = [...CHARACTERS];

    if (selectedCategory !== "all") {
      result = result.filter(c => c.factionCategory === selectedCategory);
    }
    if (selectedRealm !== "all") {
      result = result.filter(c => c.realm === selectedRealm);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(c => 
        c.name.toLowerCase().includes(query)
      );
    }

    return result;
  }, [selectedCategory, selectedRealm, searchQuery]);

  // 통계 - 경지별로 변경
  const stats = useMemo(() => ({
    total: CHARACTERS.length,
    byRealm: {
      "현경": CHARACTERS.filter(c => c.realm === "현경").length,
      "화경": CHARACTERS.filter(c => c.realm === "화경").length,
      "초절정": CHARACTERS.filter(c => c.realm === "초절정").length,
      "절정": CHARACTERS.filter(c => c.realm === "절정").length,
      "1류": CHARACTERS.filter(c => c.realm === "1류").length,
      "2류": CHARACTERS.filter(c => c.realm === "2류").length,
      "3류": CHARACTERS.filter(c => c.realm === "3류").length,
    },
  }), []);

  return (
    <div style={{
      minHeight: '100dvh',
      width: '100%',
      background: 'linear-gradient(180deg, #0d0906 0%, #1a1410 50%, #0d0906 100%)',
      color: '#e8e0d5',
      position: 'relative',
      overflow: 'visible'
    }}>
      <InkBackground />
      <VerticalDecoration text="人物錄" side="left" />
      <VerticalDecoration text="武林群英" side="right" />

      {/* ========== 헤더 영역 ========== */}
      <motion.header
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : -30 }}
        transition={{ duration: 0.8 }}
        style={{
          position: 'relative',
          zIndex: 10,
          borderBottom: '1px solid rgba(139, 90, 43, 0.2)',
          background: 'linear-gradient(180deg, rgba(26, 20, 16, 0.95) 0%, transparent 100%)'
        }}
      >
        <ScrollDecorations />
        
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: 'clamp(32px, 5vh, 56px) clamp(16px, 4vw, 48px) clamp(24px, 4vh, 40px)'
        }}>
          {/* 상단 네비게이션 */}
          <Link 
            href="/" 
            onClick={playClick}
            onMouseEnter={() => {
              playHover();
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: 'rgba(180, 130, 70, 0.6)',
              fontSize: 'clamp(0.75rem, 1.2vw, 0.9rem)',
              textDecoration: 'none',
              marginBottom: '20px',
              transition: 'color 0.3s',
              fontFamily: '"Nanum Myeongjo", serif'
            }}
          >
            <span style={{ fontSize: '1.1em' }}>←</span>
            이 무림에 낙원은 없다
          </Link>

          {/* 타이틀 영역 */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
            <div>
              {/* 메인 타이틀 */}
              <h1 style={{
                fontSize: 'clamp(2.2rem, 6vw, 4rem)',
                fontFamily: '"Nanum Myeongjo", serif',
                fontWeight: 700,
                color: '#fef3c7',
                letterSpacing: '0.08em',
                margin: 0,
                lineHeight: 1.2,
                textShadow: '0 0 60px rgba(180, 130, 70, 0.3)',
                position: 'relative'
              }}>
                인물록
                <span style={{
                  fontSize: 'clamp(1rem, 2.5vw, 1.6rem)',
                  color: 'rgba(180, 130, 70, 0.4)',
                  marginLeft: '16px',
                  fontWeight: 400,
                  letterSpacing: '0.15em'
                }}>
                  人物錄
                </span>
              </h1>
              
              {/* 서브 타이틀 */}
              <p style={{
                color: 'rgba(180, 160, 140, 0.5)',
                fontSize: 'clamp(0.8rem, 1.3vw, 1rem)',
                marginTop: '12px',
                fontFamily: '"Nanum Myeongjo", serif',
                letterSpacing: '0.05em'
              }}>
                강호의 영웅호걸들을 만나보세요. 총 <span style={{ color: 'rgba(251, 191, 36, 0.8)' }}>{stats.total}명</span>의 무림인이 기록되어 있습니다.
              </p>
            </div>

            {/* 경지별 통계 - 옥패 스타일 */}
            <div style={{
              display: 'flex',
              gap: '4px',
              padding: '12px 16px',
              background: 'linear-gradient(180deg, rgba(26, 20, 16, 0.9) 0%, rgba(13, 9, 6, 0.95) 100%)',
              border: '1px solid rgba(139, 90, 43, 0.3)',
              borderRadius: '8px',
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.03)',
              flexShrink: 0
            }}>
              {Object.entries(stats.byRealm).map(([realm, count], index, arr) => (
                <div key={realm} style={{ 
                  textAlign: 'center', 
                  padding: '0 clamp(6px, 1vw, 12px)',
                  borderRight: index !== arr.length - 1 ? '1px solid rgba(139, 90, 43, 0.15)' : 'none'
                }}>
                  <div style={{
                    fontSize: 'clamp(1rem, 1.8vw, 1.4rem)',
                    fontWeight: 700,
                    color: REALM_STYLES[realm as Realm].color,
                    fontFamily: '"Nanum Myeongjo", serif'
                  }}>
                    {count}
                  </div>
                  <div style={{
                    fontSize: '0.6rem',
                    color: 'rgba(180, 160, 140, 0.5)',
                    letterSpacing: '0.05em',
                    marginTop: '2px',
                    whiteSpace: 'nowrap'
                  }}>
                    {realm}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.header>

      {/* ========== 필터 영역 ========== */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 20,
        background: 'rgba(13, 9, 6, 0.97)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(139, 90, 43, 0.15)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: 'clamp(14px, 2.5vh, 22px) clamp(16px, 4vw, 48px)'
        }}>
          {/* 카테고리 탭 - 문파 옥패 스타일 */}
          <div style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '16px',
            flexWrap: 'wrap'
          }}>
            <CategoryTab 
              active={selectedCategory === "all"} 
              onClick={() => setSelectedCategory("all")}
              hanja="全"
              name="전체"
            />
            {CATEGORY_OPTIONS.map(opt => (
              <CategoryTab
                key={opt.id}
                active={selectedCategory === opt.id}
                onClick={() => setSelectedCategory(opt.id)}
                hanja={opt.hanja}
                name={opt.name}
              />
            ))}
          </div>

          {/* 검색 및 필터 */}
          <div style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'nowrap',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            {/* 좌측: 검색창 */}
            <div style={{
              flex: '0 1 250px',
              minWidth: '150px',
              position: 'relative'
            }}>
              <input
                type="text"
                placeholder="이름으로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(139, 90, 43, 0.3)',
                  borderRadius: '6px',
                  padding: '10px 36px 10px 14px',
                  fontSize: 'clamp(0.8rem, 1.2vw, 0.9rem)',
                  color: '#e8e0d5',
                  fontFamily: '"Nanum Myeongjo", serif',
                  outline: 'none',
                  transition: 'border-color 0.3s, box-shadow 0.3s'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(180, 130, 70, 0.6)';
                  e.target.style.boxShadow = '0 0 20px rgba(180, 130, 70, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(139, 90, 43, 0.3)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'rgba(180, 160, 140, 0.5)',
                    cursor: 'pointer',
                    fontSize: '1.3rem',
                    padding: '4px'
                  }}
                >
                  ×
                </button>
              )}
            </div>

            {/* 우측: 필터들 */}
            <div style={{
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
              flexShrink: 0
            }}>
              {/* 경지 필터 */}
              <FilterSelect
              value={selectedRealm}
              onChange={(v) => setSelectedRealm(v as Realm | "all")}
              options={[
                { value: "all", label: "전체 경지" },
                ...REALM_OPTIONS.map(r => ({ value: r, label: `${r} (${REALM_HANJA[r]})` }))
              ]}
            />

              {/* 뷰 모드 토글 */}
              <div style={{
                display: 'flex',
                border: '1px solid rgba(139, 90, 43, 0.3)',
                borderRadius: '6px',
                overflow: 'hidden',
                background: 'rgba(0, 0, 0, 0.3)',
                flexShrink: 0
              }}>
                <ViewToggle active={viewMode === "grid"} onClick={() => setViewMode("grid")}>田</ViewToggle>
                <ViewToggle active={viewMode === "scroll"} onClick={() => setViewMode("scroll")}>冊</ViewToggle>
              </div>
            </div>
          </div>

          {/* 검색 결과 */}
          <div style={{
            marginTop: '14px',
            fontSize: 'clamp(0.75rem, 1.1vw, 0.85rem)',
            color: 'rgba(180, 160, 140, 0.5)',
            fontFamily: '"Nanum Myeongjo", serif'
          }}>
            <span style={{ color: 'rgba(251, 191, 36, 0.7)' }}>{filteredCharacters.length}명</span>의 무림인 발견
          </div>
        </div>
      </div>

      {/* ========== 캐릭터 목록 ========== */}
      <main style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: 'clamp(28px, 5vh, 56px) clamp(16px, 4vw, 48px)',
        position: 'relative',
        zIndex: 5
      }}>
        {viewMode === "grid" ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(180px, 45vw), 1fr))',
              gap: 'clamp(14px, 2.5vw, 24px)'
            }}
          >
            {filteredCharacters.map((character) => (
              <CharacterCard
                key={`grid-${character.id}`}
                character={character}
                onClick={() => setSelectedCharacter(character)}
              />
            ))}
          </div>
        ) : (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
          >
            {filteredCharacters.map((character) => (
              <CharacterRow
                key={`row-${character.id}`}
                character={character}
                onClick={() => setSelectedCharacter(character)}
              />
            ))}
          </div>
        )}

        {/* 결과 없음 */}
        {filteredCharacters.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '100px 20px',
            color: 'rgba(180, 160, 140, 0.4)'
          }}>
            <div style={{ 
              fontSize: '5rem', 
              marginBottom: '20px',
              opacity: 0.2,
              fontFamily: '"Nanum Myeongjo", serif'
            }}>
              無
            </div>
            <p style={{ 
              fontFamily: '"Nanum Myeongjo", serif',
              fontSize: 'clamp(0.9rem, 1.3vw, 1.1rem)'
            }}>
              조건에 맞는 무림인을 찾을 수 없습니다.
            </p>
          </div>
        )}
      </main>

      {/* ========== 캐릭터 상세 모달 ========== */}
      <AnimatePresence>
        {selectedCharacter && (
          <CharacterModal 
            character={selectedCharacter} 
            onClose={() => setSelectedCharacter(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// 카테고리 탭 컴포넌트 (문파 옥패 스타일)
// ============================================
function CategoryTab({ 
  active, 
  onClick, 
  hanja, 
  name 
}: { 
  active: boolean; 
  onClick: () => void; 
  hanja: string; 
  name: string;
}) {
  const { playHover, playClick } = useAudio();
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => { playClick(); onClick(); }}
      onMouseEnter={playHover}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '9px 18px',
        background: active 
          ? 'linear-gradient(180deg, rgba(180, 130, 70, 0.25) 0%, rgba(139, 90, 43, 0.15) 100%)'
          : 'rgba(0, 0, 0, 0.3)',
        border: `1px solid ${active ? 'rgba(180, 130, 70, 0.5)' : 'rgba(139, 90, 43, 0.2)'}`,
        borderRadius: '6px',
        color: active ? '#fef3c7' : 'rgba(180, 160, 140, 0.6)',
        cursor: 'pointer',
        transition: 'all 0.3s',
        fontFamily: '"Nanum Myeongjo", serif',
        fontSize: 'clamp(0.75rem, 1.1vw, 0.85rem)',
        boxShadow: active ? '0 4px 15px rgba(139, 90, 43, 0.2)' : 'none'
      }}
    >
      <span style={{ 
        fontSize: '1.15em',
        opacity: active ? 1 : 0.5,
        transition: 'opacity 0.3s'
      }}>
        {hanja}
      </span>
      <span>{name}</span>
    </motion.button>
  );
}

// ============================================
// 필터 셀렉트 컴포넌트
// ============================================
function FilterSelect({
  value,
  onChange,
  options
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  const { playClick } = useAudio();
  return (
    <select
      value={value}
      onChange={(e) => { playClick(); onChange(e.target.value); }}
      style={{
        background: 'rgba(0, 0, 0, 0.4)',
        border: '1px solid rgba(139, 90, 43, 0.3)',
        borderRadius: '6px',
        padding: '10px 36px 10px 14px',
        fontSize: 'clamp(0.8rem, 1.2vw, 0.9rem)',
        color: '#e8e0d5',
        fontFamily: '"Nanum Myeongjo", serif',
        cursor: 'pointer',
        outline: 'none',
        appearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23b4825a' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 12px center',
        transition: 'border-color 0.3s'
      }}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value} style={{ background: '#1a1410', padding: '8px' }}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

// ============================================
// 뷰 토글 버튼
// ============================================
function ViewToggle({ 
  active, 
  onClick, 
  children 
}: { 
  active: boolean; 
  onClick: () => void; 
  children: React.ReactNode;
}) {
  const { playHover, playClick } = useAudio();
  return (
    <button
      onClick={() => { playClick(); onClick(); }}
      onMouseEnter={playHover}
      style={{
        padding: '9px 16px',
        background: active ? 'rgba(180, 130, 70, 0.3)' : 'transparent',
        border: 'none',
        color: active ? '#fef3c7' : 'rgba(180, 160, 140, 0.4)',
        cursor: 'pointer',
        fontFamily: '"Nanum Myeongjo", serif',
        fontSize: '1.1rem',
        transition: 'all 0.3s'
      }}
    >
      {children}
    </button>
  );
}

// ============================================
// 캐릭터 카드 컴포넌트 (그리드 뷰) - 초상화 족자 스타일
// ============================================
const CharacterCard = memo(function CharacterCard({ 
  character, 
  onClick 
}: { 
  character: Character; 
  onClick: () => void;
}) {
  const faction = getFactionById(character.factionId);
  const realmStyle = REALM_STYLES[character.realm];
  const [imageError, setImageError] = useState(false);
  const { playHover, playClick } = useAudio();

  return (
    <div
      onClick={() => { playClick(); onClick(); }}
      style={{
        position: 'relative',
        background: 'linear-gradient(180deg, rgba(30, 24, 18, 0.95) 0%, rgba(13, 9, 6, 0.98) 100%)',
        border: '1px solid rgba(139, 90, 43, 0.25)',
        borderRadius: '10px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.25s ease',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
      }}
      onMouseEnter={(e) => {
        playHover();
        e.currentTarget.style.borderColor = faction?.colors.accent || 'rgba(180, 130, 70, 0.5)';
        e.currentTarget.style.boxShadow = `0 12px 40px rgba(0, 0, 0, 0.5), 0 0 30px ${faction?.colors.accent || '#b4825a'}15`;
        e.currentTarget.style.transform = 'translateY(-8px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(139, 90, 43, 0.25)';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* 상단 악센트 라인 (문파 색상) */}
      <div style={{
        height: '3px',
        background: `linear-gradient(90deg, transparent, ${faction?.colors.accent || '#b4825a'}, transparent)`
      }} />

      {/* 이미지 영역 - 초상화 스타일 */}
      <div style={{
        aspectRatio: '3 / 4',
        position: 'relative',
        background: `linear-gradient(180deg, ${faction?.colors.primary || '#1a1410'}15 0%, transparent 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        {character.image && !imageError ? (
          <Image
            src={character.image}
            alt={character.name}
            fill
            priority
            style={{ 
              objectFit: 'cover', 
              objectPosition: 'top'
            }}
            onError={() => setImageError(true)}
            sizes="(max-width: 640px) 45vw, 180px"
          />
        ) : (
          // 이미지 없을 때 한자 이니셜
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{
              fontSize: 'clamp(3.5rem, 10vw, 5rem)',
              fontFamily: '"Nanum Myeongjo", serif',
              color: `${faction?.colors.accent || '#b4825a'}25`,
              fontWeight: 700,
              lineHeight: 1
            }}>
              {character.name.charAt(0)}
            </span>
          </div>
        )}
        
        {/* 하단 그라데이션 오버레이 */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '65%',
          background: 'linear-gradient(transparent, rgba(13, 9, 6, 0.97))',
          pointerEvents: 'none'
        }} />
      </div>

      {/* 정보 영역 */}
      <div style={{ padding: '14px 16px 18px' }}>
        {/* 이름 */}
        <h3 style={{
          fontSize: 'clamp(0.95rem, 1.4vw, 1.1rem)',
          fontFamily: '"Nanum Myeongjo", serif',
          color: '#fef3c7',
          margin: 0,
          marginBottom: '5px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          letterSpacing: '0.03em'
        }}>
          {character.name}
        </h3>
        
        {/* 칭호 */}
        <p style={{
          fontSize: 'clamp(0.7rem, 1vw, 0.8rem)',
          color: 'rgba(180, 160, 140, 0.55)',
          margin: 0,
          marginBottom: '12px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          fontFamily: '"Nanum Myeongjo", serif'
        }}>
          {character.title}
        </p>

        {/* 경지 & 문파 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px'
        }}>
          <span style={{
            padding: '4px 10px',
            background: realmStyle.bg,
            borderRadius: '4px',
            color: realmStyle.color,
            fontSize: '0.68rem',
            fontFamily: '"Nanum Myeongjo", serif',
            letterSpacing: '0.05em'
          }}>
            {character.realm}
          </span>
          <span style={{
            fontSize: '0.68rem',
            color: 'rgba(180, 160, 140, 0.4)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontFamily: '"Nanum Myeongjo", serif'
          }}>
            {faction?.name.split('(')[0].trim()}
          </span>
        </div>
      </div>

      {/* 하단 장식 라인 */}
      <div style={{
        height: '2px',
        background: `linear-gradient(90deg, transparent, ${faction?.colors.accent || '#b4825a'}40, transparent)`
      }} />
    </div>
  );
});

// ============================================
// 캐릭터 행 컴포넌트 (리스트 뷰) - 명부 스타일
// ============================================
const CharacterRow = memo(function CharacterRow({ 
  character, 
  onClick 
}: { 
  character: Character; 
  onClick: () => void;
}) {
  const faction = getFactionById(character.factionId);
  const realmStyle = REALM_STYLES[character.realm];
  const [imageError, setImageError] = useState(false);
  const { playHover, playClick } = useAudio();

  return (
    <div
      onClick={() => { playClick(); onClick(); }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        padding: '12px 20px',
        background: 'linear-gradient(90deg, rgba(26, 20, 16, 0.7) 0%, rgba(26, 20, 16, 0.5) 100%)',
        border: '1px solid rgba(139, 90, 43, 0.2)',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.3s',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={(e) => {
        playHover();
        e.currentTarget.style.background = 'linear-gradient(90deg, rgba(30, 24, 18, 0.9) 0%, rgba(26, 20, 16, 0.7) 100%)';
        e.currentTarget.style.borderColor = 'rgba(180, 130, 70, 0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'linear-gradient(90deg, rgba(26, 20, 16, 0.7) 0%, rgba(26, 20, 16, 0.5) 100%)';
        e.currentTarget.style.borderColor = 'rgba(139, 90, 43, 0.2)';
      }}
    >
      {/* 좌측 악센트 */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: '20%',
        bottom: '20%',
        width: '3px',
        background: faction?.colors.accent || '#b4825a',
        borderRadius: '0 2px 2px 0',
        opacity: 0.6
      }} />

      {/* 썸네일 이미지 */}
      <div style={{
        width: '50px',
        height: '60px',
        borderRadius: '6px',
        overflow: 'hidden',
        flexShrink: 0,
        position: 'relative',
        background: 'rgba(0, 0, 0, 0.3)',
        border: '1px solid rgba(139, 90, 43, 0.2)'
      }}>
        {character.image && !imageError ? (
          <Image
            src={character.image}
            alt={character.name}
            fill
            style={{ objectFit: 'cover', objectPosition: 'top' }}
            onError={() => setImageError(true)}
            sizes="50px"
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: `${faction?.colors.accent || '#b4825a'}40`,
            fontSize: '1.5rem',
            fontFamily: '"Nanum Myeongjo", serif'
          }}>
            {character.name.charAt(0)}
          </div>
        )}
      </div>

      {/* 이름 & 칭호 */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <h3 style={{
            fontSize: 'clamp(1rem, 1.5vw, 1.15rem)',
            fontFamily: '"Nanum Myeongjo", serif',
            color: '#fef3c7',
            margin: 0,
            letterSpacing: '0.03em'
          }}>
            {character.name}
          </h3>
          <span style={{
            fontSize: 'clamp(0.8rem, 1.15vw, 0.9rem)',
            color: 'rgba(180, 160, 140, 0.5)',
            fontFamily: '"Nanum Myeongjo", serif'
          }}>
            {character.title}
          </span>
        </div>
        <p style={{
          fontSize: 'clamp(0.75rem, 1.05vw, 0.85rem)',
          color: 'rgba(180, 160, 140, 0.4)',
          margin: '5px 0 0 0',
          fontFamily: '"Nanum Myeongjo", serif'
        }}>
          {faction?.name.split('(')[0].trim()} · {character.position}
        </p>
      </div>

      {/* 경지 */}
      <span style={{
        padding: '6px 14px',
        background: realmStyle.bg,
        borderRadius: '6px',
        color: realmStyle.color,
        fontSize: '0.8rem',
        fontFamily: '"Nanum Myeongjo", serif',
        flexShrink: 0,
        letterSpacing: '0.05em'
      }}>
        {character.realm}
      </span>

      {/* 스탯 바 (데스크탑 전용) */}
      <div style={{
        display: 'none',
        gap: '6px',
        width: '180px'
      }} className="lg:!flex">
        <MiniStatBar label="武" value={character.stats.martial} color="#dc2626" />
        <MiniStatBar label="內" value={character.stats.internal} color="#2563eb" />
        <MiniStatBar label="輕" value={character.stats.agility} color="#16a34a" />
        <MiniStatBar label="智" value={character.stats.intelligence} color="#d97706" />
      </div>

      {/* 화살표 */}
      <span style={{ 
        color: 'rgba(180, 130, 70, 0.3)', 
        fontSize: '1.3rem',
        transition: 'color 0.3s, transform 0.3s'
      }}>
        →
      </span>
    </div>
  );
});

// ============================================
// 미니 스탯 바
// ============================================
function MiniStatBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ flex: 1 }}>
      <div style={{
        fontSize: '0.65rem',
        color: 'rgba(180, 160, 140, 0.4)',
        textAlign: 'center',
        marginBottom: '4px',
        fontFamily: '"Nanum Myeongjo", serif'
      }}>
        {label}
      </div>
      <div style={{
        height: '5px',
        background: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '3px',
        overflow: 'hidden'
      }}>
        <div style={{
          height: '100%',
          width: `${value}%`,
          background: `linear-gradient(90deg, ${color}80, ${color})`,
          borderRadius: '3px'
        }} />
      </div>
    </div>
  );
}

// ============================================
// 캐릭터 상세 모달 - 두루마리 족자 스타일
// ============================================
function CharacterModal({ 
  character, 
  onClose 
}: { 
  character: Character; 
  onClose: () => void;
}) {
  const faction = getFactionById(character.factionId);
  const realmStyle = REALM_STYLES[character.realm];
  const [imageError, setImageError] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const dragScroll = useDragScroll();
  const { playHover, playClick } = useAudio();

  // 확대 이미지 드래그 상태
  const [imageDrag, setImageDrag] = useState({ isDragging: false, startX: 0, startY: 0, offsetX: 0, offsetY: 0 });

  // 갤러리 이미지 배열 생성 (gallery가 있으면 gallery만 사용, 없으면 image 사용)
  const galleryImages = useMemo(() => {
    if (character.gallery && character.gallery.length > 0) {
      return character.gallery;
    }
    return character.image ? [character.image] : [];
  }, [character.image, character.gallery]);

  // 이미지 변경 시 드래그 위치 리셋
  useEffect(() => {
    setImageDrag(prev => ({ ...prev, offsetX: 0, offsetY: 0 }));
  }, [selectedImageIndex]);

  // 모달이 열렸을 때 body 스크롤 방지
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      {/* 백드롭 */}
      <motion.div 
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.88)',
          backdropFilter: 'blur(10px)'
        }}
        onClick={onClose}
      />

      {/* 모달 본체 - 두루마리 프레임 */}
      <motion.div
        initial={{ scale: 0.9, y: 60, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 60, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '720px',
          maxHeight: '90vh',
          background: 'linear-gradient(180deg, #211a14 0%, #0d0906 100%)',
          border: '2px solid rgba(139, 90, 43, 0.4)',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 30px 100px rgba(0, 0, 0, 0.7), 0 0 60px rgba(139, 90, 43, 0.1)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* 닫기 버튼 - 고정 */}
        <button
          onClick={() => { playClick(); onClose(); }}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(139, 90, 43, 0.3)',
            borderRadius: '50%',
            color: 'rgba(180, 160, 140, 0.6)',
            cursor: 'pointer',
            fontSize: '1.4rem',
            transition: 'all 0.3s',
            zIndex: 10
          }}
          onMouseEnter={(e) => {
            playHover();
            e.currentTarget.style.background = 'rgba(139, 90, 43, 0.3)';
            e.currentTarget.style.color = '#fef3c7';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.5)';
            e.currentTarget.style.color = 'rgba(180, 160, 140, 0.6)';
          }}
        >
          ×
        </button>

        {/* 스크롤 영역 - 헤더와 컨텐츠 함께 */}
        <div 
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            overscrollBehavior: 'contain'
          }}
        >
          {/* 상단 두루마리 장식 */}
          <div style={{
            height: '6px',
            background: `linear-gradient(90deg, transparent, ${faction?.colors.accent || '#b4825a'}, transparent)`,
            boxShadow: `0 0 20px ${faction?.colors.accent || '#b4825a'}40`
          }} />

          {/* 갤러리 영역 */}
          {galleryImages.length > 0 && !imageError && (
            <div style={{
              position: 'relative',
              background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.3) 100%)',
              borderBottom: '1px solid rgba(139, 90, 43, 0.2)'
            }}>
              {/* 메인 이미지 */}
              <div 
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '3/4',
                  maxHeight: '400px',
                  cursor: 'pointer',
                  overflow: 'hidden'
                }}
                onClick={() => setIsImageExpanded(true)}
              >
                <Image
                  src={galleryImages[selectedImageIndex]}
                  alt={character.name}
                  fill
                  style={{ 
                    objectFit: 'contain',
                    objectPosition: 'center'
                  }}
                  onError={() => setImageError(true)}
                />
                {/* 현재 표정 라벨 */}
                <div style={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '12px',
                  padding: '6px 12px',
                  background: 'rgba(0, 0, 0, 0.6)',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  color: 'rgba(180, 160, 140, 0.7)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span>🎭</span> {selectedImageIndex < EXPRESSION_LABELS.length ? EXPRESSION_LABELS[selectedImageIndex] : `이미지 ${selectedImageIndex + 1}`}
                </div>
              </div>

              {/* 썸네일 네비게이션 (이미지가 2개 이상일 때만) - 드래그 스크롤 */}
              {galleryImages.length > 1 && (
                <div 
                  ref={dragScroll.ref}
                  {...dragScroll.handlers}
                  style={{
                    display: 'flex',
                    gap: '8px',
                    padding: '12px',
                    background: 'rgba(0, 0, 0, 0.4)',
                    overflowX: 'auto',
                    maxWidth: '100%',
                    scrollbarWidth: 'thin',
                    scrollbarColor: 'rgba(139, 90, 43, 0.5) transparent',
                    cursor: 'grab',
                    userSelect: 'none',
                    WebkitOverflowScrolling: 'touch'
                  }}
                >
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => { if (!dragScroll.isDragging) { playClick(); setSelectedImageIndex(idx); } }}
                      onMouseEnter={() => { if (!dragScroll.isDragging) playHover(); }}
                      style={{
                        minWidth: '50px',
                        width: '50px',
                        height: '70px',
                        borderRadius: '6px',
                        border: selectedImageIndex === idx 
                          ? `2px solid ${faction?.colors.accent || '#b4825a'}` 
                          : '2px solid rgba(139, 90, 43, 0.3)',
                        padding: 0,
                        cursor: 'pointer',
                        overflow: 'hidden',
                        opacity: selectedImageIndex === idx ? 1 : 0.6,
                        transition: 'all 0.2s',
                        display: 'flex',
                        flexDirection: 'column',
                        background: 'rgba(0,0,0,0.5)'
                      }}
                    >
                      <div style={{ position: 'relative', width: '100%', height: '45px' }}>
                        <Image
                          src={img}
                          alt={`${character.name} ${idx + 1}`}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <span style={{
                        fontSize: '8px',
                        color: selectedImageIndex === idx 
                          ? (faction?.colors.accent || '#b4825a') 
                          : 'rgba(255,255,255,0.7)',
                        padding: '2px',
                        textAlign: 'center',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {idx < EXPRESSION_LABELS.length ? EXPRESSION_LABELS[idx] : `${idx + 1}`}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 헤더 영역 */}
          <div style={{
            position: 'relative',
            padding: 'clamp(24px, 5vh, 40px) clamp(20px, 4vw, 32px)',
            background: `linear-gradient(135deg, ${faction?.colors.primary || '#1a1410'}35 0%, transparent 60%)`,
            borderBottom: '1px solid rgba(139, 90, 43, 0.2)'
          }}>
            {/* 캐릭터 정보 */}
            <div style={{ marginTop: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '10px', flexWrap: 'wrap' }}>
                <span style={{
                  padding: '5px 12px',
                  background: realmStyle.bg,
                  borderRadius: '6px',
                  color: realmStyle.color,
                  fontSize: '0.85rem',
                  fontFamily: '"Nanum Myeongjo", serif',
                letterSpacing: '0.05em'
              }}>
                {character.realm} ({REALM_HANJA[character.realm]})
              </span>
              <span style={{
                color: 'rgba(180, 160, 140, 0.5)',
                fontSize: '0.9rem',
                fontFamily: '"Nanum Myeongjo", serif'
              }}>
                {character.position}
              </span>
            </div>

            <h2 style={{
              fontSize: 'clamp(2rem, 5vw, 2.8rem)',
              fontFamily: '"Nanum Myeongjo", serif',
              color: '#fef3c7',
              margin: 0,
              marginBottom: '8px',
              letterSpacing: '0.08em',
              textShadow: '0 0 40px rgba(180, 130, 70, 0.2)'
            }}>
              {character.name}
            </h2>

            <p style={{
              fontSize: 'clamp(1.1rem, 2.2vw, 1.35rem)',
              color: 'rgba(180, 130, 70, 0.7)',
              margin: 0,
              fontFamily: '"Nanum Myeongjo", serif',
              letterSpacing: '0.05em'
            }}>
              {character.title}
            </p>
            </div>
          </div>

          {/* 컨텐츠 영역 */}
          <div style={{
            padding: 'clamp(24px, 4vh, 36px) clamp(20px, 4vw, 32px)'
          }}>
          {/* 스탯 영역 - 능력치 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 'clamp(12px, 2vw, 20px)',
            marginBottom: '32px',
            padding: '24px',
            background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.2) 100%)',
            borderRadius: '12px',
            border: '1px solid rgba(139, 90, 43, 0.2)'
          }}>
            <StatDisplay label="무공" hanja="武" value={character.stats.martial} color="#dc2626" />
            <StatDisplay label="내공" hanja="內" value={character.stats.internal} color="#2563eb" />
            <StatDisplay label="경공" hanja="輕" value={character.stats.agility} color="#16a34a" />
            <StatDisplay label="지력" hanja="智" value={character.stats.intelligence} color="#d97706" />
          </div>

          {/* 외형 */}
          <ModalSection title="외형" hanja="容">
            <p style={{
              color: 'rgba(200, 190, 180, 0.8)',
              lineHeight: 1.9,
              fontFamily: '"Nanum Myeongjo", serif',
              fontSize: 'clamp(0.88rem, 1.25vw, 1rem)'
            }}>
              {character.appearance}
            </p>
          </ModalSection>

          {/* 서사 */}
          <ModalSection title="서사" hanja="史">
            <p style={{
              color: 'rgba(200, 190, 180, 0.8)',
              lineHeight: 1.9,
              fontFamily: '"Nanum Myeongjo", serif',
              fontSize: 'clamp(0.88rem, 1.25vw, 1rem)'
            }}>
              {character.story}
            </p>
          </ModalSection>

          {/* 전투 스타일 */}
          <ModalSection title="전투" hanja="鬪">
            <p style={{
              color: 'rgba(200, 190, 180, 0.8)',
              lineHeight: 1.9,
              fontFamily: '"Nanum Myeongjo", serif',
              fontSize: 'clamp(0.88rem, 1.25vw, 1rem)'
            }}>
              {character.combatStyle}
            </p>
          </ModalSection>

          {/* 무공 */}
          <ModalSection title="무공" hanja="功">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {character.skills.map((skill, i) => (
                <span
                  key={i}
                  style={{
                    padding: '10px 18px',
                    background: `${faction?.colors.accent || '#b4825a'}12`,
                    border: `1px solid ${faction?.colors.accent || '#b4825a'}35`,
                    borderRadius: '8px',
                    color: faction?.colors.accent || '#b4825a',
                    fontSize: 'clamp(0.82rem, 1.15vw, 0.95rem)',
                    fontFamily: '"Nanum Myeongjo", serif',
                    letterSpacing: '0.03em'
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </ModalSection>

          {/* 소속 */}
          <ModalSection title="소속" hanja="門">
            <Link
              href={`/factions/${character.factionId}`}
              onClick={playClick}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '14px',
                padding: '14px 24px',
                background: 'linear-gradient(90deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.2) 100%)',
                border: '1px solid rgba(139, 90, 43, 0.3)',
                borderRadius: '8px',
                textDecoration: 'none',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                playHover();
                e.currentTarget.style.background = 'linear-gradient(90deg, rgba(139, 90, 43, 0.2) 0%, rgba(0, 0, 0, 0.3) 100%)';
                e.currentTarget.style.borderColor = 'rgba(180, 130, 70, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(90deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.2) 100%)';
                e.currentTarget.style.borderColor = 'rgba(139, 90, 43, 0.3)';
              }}
            >
              <span style={{
                color: faction?.colors.accent || '#b4825a',
                fontSize: 'clamp(1rem, 1.4vw, 1.15rem)',
                fontFamily: '"Nanum Myeongjo", serif',
                letterSpacing: '0.03em'
              }}>
                {faction?.name}
              </span>
              <span style={{ color: 'rgba(180, 130, 70, 0.4)', fontSize: '1.2rem' }}>→</span>
            </Link>
          </ModalSection>

          {/* 하단 장식 */}
          <div style={{
            height: '4px',
            marginTop: '20px',
            background: `linear-gradient(90deg, transparent, ${faction?.colors.accent || '#b4825a'}50, transparent)`
          }} />
          </div>
        </div>
      </motion.div>

      {/* 이미지 확대 뷰 */}
      <AnimatePresence>
        {isImageExpanded && galleryImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 200,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0, 0, 0, 0.95)',
              cursor: 'zoom-out',
              overscrollBehavior: 'contain',
              touchAction: 'none'
            }}
            onClick={() => setIsImageExpanded(false)}
            onWheel={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            {/* 닫기 버튼 */}
            <button
              onClick={() => { playClick(); setIsImageExpanded(false); }}
              onMouseEnter={playHover}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                width: '44px',
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0, 0, 0, 0.6)',
                border: '1px solid rgba(139, 90, 43, 0.4)',
                borderRadius: '50%',
                color: '#fef3c7',
                cursor: 'pointer',
                fontSize: '1.6rem',
                zIndex: 10
              }}
            >
              ×
            </button>

            {/* 이전 버튼 */}
            {galleryImages.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playClick();
                  setSelectedImageIndex(prev => 
                    prev === 0 ? galleryImages.length - 1 : prev - 1
                  );
                }}
                onMouseEnter={playHover}
                style={{
                  position: 'absolute',
                  left: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '50px',
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(0, 0, 0, 0.6)',
                  border: '1px solid rgba(139, 90, 43, 0.4)',
                  borderRadius: '50%',
                  color: '#fef3c7',
                  cursor: 'pointer',
                  fontSize: '1.4rem',
                  zIndex: 10
                }}
              >
                ‹
              </button>
            )}

            {/* 확대 이미지 - 드래그 가능 */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, x: imageDrag.offsetX, y: imageDrag.offsetY }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ x: { duration: 0 }, y: { duration: 0 } }}
              style={{
                position: 'relative',
                width: '90vw',
                height: '90vh',
                maxWidth: '800px',
                cursor: imageDrag.isDragging ? 'grabbing' : 'grab'
              }}
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => {
                e.preventDefault();
                setImageDrag(prev => ({
                  ...prev,
                  isDragging: true,
                  startX: e.clientX - prev.offsetX,
                  startY: e.clientY - prev.offsetY
                }));
              }}
              onMouseMove={(e) => {
                if (imageDrag.isDragging) {
                  setImageDrag(prev => ({
                    ...prev,
                    offsetX: e.clientX - prev.startX,
                    offsetY: e.clientY - prev.startY
                  }));
                }
              }}
              onMouseUp={() => setImageDrag(prev => ({ ...prev, isDragging: false }))}
              onMouseLeave={() => setImageDrag(prev => ({ ...prev, isDragging: false }))}
              onTouchStart={(e) => {
                const touch = e.touches[0];
                setImageDrag(prev => ({
                  ...prev,
                  isDragging: true,
                  startX: touch.clientX - prev.offsetX,
                  startY: touch.clientY - prev.offsetY
                }));
              }}
              onTouchMove={(e) => {
                if (imageDrag.isDragging) {
                  const touch = e.touches[0];
                  setImageDrag(prev => ({
                    ...prev,
                    offsetX: touch.clientX - prev.startX,
                    offsetY: touch.clientY - prev.startY
                  }));
                }
              }}
              onTouchEnd={() => setImageDrag(prev => ({ ...prev, isDragging: false }))}
            >
              <Image
                src={galleryImages[selectedImageIndex]}
                alt={character.name}
                fill
                style={{ 
                  objectFit: 'contain',
                  pointerEvents: 'none'
                }}
                priority
                draggable={false}
              />
            </motion.div>

            {/* 다음 버튼 */}
            {galleryImages.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playClick();
                  setSelectedImageIndex(prev => 
                    prev === galleryImages.length - 1 ? 0 : prev + 1
                  );
                }}
                onMouseEnter={playHover}
                style={{
                  position: 'absolute',
                  right: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '50px',
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(0, 0, 0, 0.6)',
                  border: '1px solid rgba(139, 90, 43, 0.4)',
                  borderRadius: '50%',
                  color: '#fef3c7',
                  cursor: 'pointer',
                  fontSize: '1.4rem',
                  zIndex: 10
                }}
              >
                ›
              </button>
            )}

            {/* 이미지 카운터 및 표정 라벨 - 무협 스타일 */}
            {galleryImages.length > 1 && (
              <div style={{
                position: 'absolute',
                bottom: '30px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px'
              }}>
                {/* 표정 이름 - 두루마리 스타일 */}
                <div style={{
                  position: 'relative',
                  padding: '16px 40px',
                  background: 'linear-gradient(180deg, rgba(26, 20, 16, 0.95) 0%, rgba(13, 9, 6, 0.98) 100%)',
                  border: '2px solid rgba(180, 130, 70, 0.6)',
                  borderRadius: '4px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                }}>
                  {/* 상단 장식 */}
                  <div style={{
                    position: 'absolute',
                    top: '-1px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '60%',
                    height: '3px',
                    background: 'linear-gradient(90deg, transparent, rgba(180, 130, 70, 0.8), transparent)'
                  }} />
                  {/* 하단 장식 */}
                  <div style={{
                    position: 'absolute',
                    bottom: '-1px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '60%',
                    height: '3px',
                    background: 'linear-gradient(90deg, transparent, rgba(180, 130, 70, 0.8), transparent)'
                  }} />
                  <div style={{
                    fontSize: 'clamp(1.4rem, 4vw, 2rem)',
                    fontFamily: '"Nanum Myeongjo", serif',
                    fontWeight: 700,
                    color: '#fef3c7',
                    textShadow: '0 2px 8px rgba(0, 0, 0, 0.8), 0 0 20px rgba(180, 130, 70, 0.3)',
                    letterSpacing: '0.15em',
                    textAlign: 'center'
                  }}>
                    {selectedImageIndex < EXPRESSION_LABELS.length 
                      ? EXPRESSION_LABELS[selectedImageIndex] 
                      : `제 ${selectedImageIndex + 1} 식`}
                  </div>
                </div>
                {/* 이미지 카운터 */}
                <div style={{
                  padding: '8px 20px',
                  background: 'rgba(0, 0, 0, 0.7)',
                  border: '1px solid rgba(139, 90, 43, 0.4)',
                  borderRadius: '4px',
                  color: 'rgba(180, 160, 140, 0.9)',
                  fontSize: 'clamp(0.85rem, 1.5vw, 1rem)',
                  fontFamily: '"Nanum Myeongjo", serif',
                  letterSpacing: '0.1em'
                }}>
                  {selectedImageIndex + 1} / {galleryImages.length}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ============================================
// 스탯 디스플레이 (모달용)
// ============================================
function StatDisplay({ 
  label, 
  hanja, 
  value, 
  color 
}: { 
  label: string; 
  hanja: string;
  value: number; 
  color: string;
}) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        marginBottom: '10px'
      }}>
        <span style={{
          fontSize: '1.2rem',
          color: color,
          fontFamily: '"Nanum Myeongjo", serif',
          opacity: 0.85
        }}>
          {hanja}
        </span>
        <span style={{
          fontSize: '0.72rem',
          color: 'rgba(180, 160, 140, 0.5)',
          fontFamily: '"Nanum Myeongjo", serif'
        }}>
          {label}
        </span>
      </div>
      
      <div style={{
        height: '7px',
        background: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '4px',
        overflow: 'hidden',
        marginBottom: '8px'
      }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          style={{
            height: '100%',
            background: `linear-gradient(90deg, ${color}90, ${color})`,
            borderRadius: '4px',
            boxShadow: `0 0 10px ${color}40`
          }}
        />
      </div>
      
      <div style={{
        fontSize: 'clamp(1.1rem, 1.6vw, 1.3rem)',
        fontWeight: 700,
        color: color,
        fontFamily: '"Nanum Myeongjo", serif'
      }}>
        {value}
      </div>
    </div>
  );
}

// ============================================
// 모달 섹션 컴포넌트
// ============================================
function ModalSection({ 
  title, 
  hanja,
  children 
}: { 
  title: string; 
  hanja: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: '28px' }}>
      <h3 style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: 'clamp(1.05rem, 1.5vw, 1.2rem)',
        fontFamily: '"Nanum Myeongjo", serif',
        color: '#fef3c7',
        marginBottom: '14px'
      }}>
        <span style={{
          width: '32px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(180, 130, 70, 0.12)',
          border: '1px solid rgba(180, 130, 70, 0.25)',
          borderRadius: '6px',
          color: 'rgba(180, 130, 70, 0.8)',
          fontSize: '1rem',
          fontFamily: '"Nanum Myeongjo", serif'
        }}>
          {hanja}
        </span>
        {title}
      </h3>
      {children}
    </div>
  );
}
