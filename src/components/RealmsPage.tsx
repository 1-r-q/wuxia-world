"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudio } from "./AudioManager";

// 경지 데이터
const REALMS = [
  {
    id: "samryu",
    level: 1,
    title: "삼류",
    hanja: "三流",
    shortDesc: "무학의 첫 발을 디딘 자",
    fullDesc: "내공이 없거나 미미한 수준. 오로지 근력과 단순한 기술에 의존하여 싸운다. 일반인보다 약간 나은 정도로, 진정한 무인이라 부르기 어렵다.",
    characteristics: ["내공 부재", "근력 의존", "기본기 수준"],
    color: "#8B7355"
  },
  {
    id: "iryu",
    level: 2,
    title: "이류",
    hanja: "二流",
    shortDesc: "기를 느끼기 시작한 자",
    fullDesc: "내공에 입문하여 기의 흐름을 느낄 수 있게 되었다. 그러나 아직 병기에 기를 실어 공격하지는 못한다. 소문파의 일반 제자 수준.",
    characteristics: ["내공 입문", "기 감각 각성", "운기 불가"],
    color: "#7B8B6F"
  },
  {
    id: "ilryu",
    level: 3,
    title: "일류",
    hanja: "一流",
    shortDesc: "검기를 발현한 무인",
    fullDesc: "검기(劍氣)를 발현하여 바위를 가를 수 있는 경지. 병기에 내공을 실어 강력한 공격이 가능하며, 강기로 몸을 보호할 수 있다.",
    characteristics: ["검기 발현", "호신강기", "내공 10~30년"],
    color: "#5B8A72"
  },
  {
    id: "jeoljeong",
    level: 4,
    title: "절정",
    hanja: "絶頂",
    shortDesc: "검강을 이룬 일대종사",
    fullDesc: "검강(劍罡)을 형성하여 기를 검 밖으로 뻗어낼 수 있는 경지. 일대종사(一代宗師)로 불리며, 구파일방의 장로급 실력자.",
    characteristics: ["검강 형성", "일대종사", "내공 30~50년"],
    color: "#4A7B9D"
  },
  {
    id: "chojeoljeong",
    level: 5,
    title: "초절정",
    hanja: "超絶頂",
    shortDesc: "이기어검의 경지",
    fullDesc: "이기어검(以氣馭劍), 기로써 검을 부리는 경지. 심검(心劍)의 경지에 이르러 마음으로 검을 움직이며, 허공섭물이 가능하다.",
    characteristics: ["이기어검", "심검 경지", "내공 50~80년"],
    color: "#6B5B95"
  },
  {
    id: "hwagyeong",
    level: 6,
    title: "화경",
    hanja: "化境",
    shortDesc: "자연과 하나 된 초인",
    fullDesc: "반로환동(返老還童)하여 젊음을 되찾고, 자연과 동화되어 천지의 기운을 자유자재로 운용한다. 인간의 한계를 초월한 경지.",
    characteristics: ["반로환동", "천지합일", "한계 초월"],
    color: "#C06C4D"
  },
  {
    id: "hyeongyeong",
    level: 7,
    title: "현경",
    hanja: "玄境",
    shortDesc: "신의 영역에 닿은 자",
    fullDesc: "입신(入神)의 경지. 세상의 법칙조차 무시할 수 있는 신에 가까운 존재. 우화등선(羽化登仙)의 전설이 전해지는 궁극의 경지.",
    characteristics: ["입신 경지", "법칙 초월", "우화등선"],
    color: "#C9A84C"
  }
];

interface RealmsPageProps {
  onBack: () => void;
}

export default function RealmsPage({ onBack }: RealmsPageProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const { playHover, playClick } = useAudio();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const hoveredRealm = REALMS.find(r => r.id === hoveredId);

  return (
    <motion.div
      className="fixed inset-0 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      style={{
        width: '100vw',
        height: '100vh',
        background: '#0a0908',
        overflow: 'hidden'
      }}
    >
      {/* 배경 텍스처 - 한지 느낌 */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `
          radial-gradient(ellipse 120% 60% at 50% 0%, rgba(60, 50, 40, 0.15) 0%, transparent 50%),
          radial-gradient(ellipse 80% 40% at 50% 100%, rgba(40, 35, 30, 0.1) 0%, transparent 40%)
        `,
        pointerEvents: 'none'
      }} />

      {/* 비네팅 */}
      <div style={{
        position: 'absolute',
        inset: 0,
        boxShadow: 'inset 0 0 250px 100px rgba(0,0,0,0.9)',
        pointerEvents: 'none'
      }} />

      {/* 뒤로가기 버튼 */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        onClick={() => {
          playClick();
          onBack();
        }}
        onMouseEnter={playHover}
        whileHover={{ x: -3 }}
        style={{
          position: 'absolute',
          top: '20px',
          left: '25px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          background: 'transparent',
          border: '1px solid rgba(180, 150, 120, 0.25)',
          color: 'rgba(180, 150, 120, 0.7)',
          fontSize: '0.85rem',
          fontFamily: '"Nanum Myeongjo", serif',
          letterSpacing: '0.1em',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          zIndex: 100
        }}
      >
        <span>←</span>
        <span>돌아가기</span>
      </motion.button>

      {/* 메인 레이아웃 */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '60px 30px 40px'
      }}>

        {/* ===== 상단: 제목/설명 영역 (고정 높이) ===== */}
        <div style={{
          width: '100%',
          maxWidth: '900px',
          height: '220px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <AnimatePresence mode="wait">
            {hoveredRealm ? (
              /* 호버 시: 설명 표시 */
              <motion.div
                key={hoveredRealm.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ 
                  textAlign: 'center',
                  width: '100%',
                  padding: '0 20px'
                }}
              >
                {/* 레벨 표시 */}
                <p style={{
                  fontSize: '0.75rem',
                  color: 'rgba(180, 150, 120, 0.5)',
                  fontFamily: '"Nanum Myeongjo", serif',
                  letterSpacing: '0.3em',
                  marginBottom: '8px'
                }}>
                  第 {hoveredRealm.level} 境
                </p>

                {/* 경지명 */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '20px',
                  marginBottom: '15px'
                }}>
                  <div style={{ 
                    width: '60px', 
                    height: '1px', 
                    background: `linear-gradient(to right, transparent, ${hoveredRealm.color})` 
                  }} />
                  <h2 style={{
                    fontSize: 'clamp(2rem, 4vw, 2.8rem)',
                    color: '#fef3c7',
                    fontFamily: '"Nanum Myeongjo", serif',
                    fontWeight: 700,
                    margin: 0,
                    letterSpacing: '0.15em'
                  }}>
                    {hoveredRealm.title}
                  </h2>
                  <span style={{
                    fontSize: 'clamp(1rem, 1.5vw, 1.2rem)',
                    color: hoveredRealm.color,
                    fontFamily: '"Nanum Myeongjo", serif',
                    letterSpacing: '0.2em'
                  }}>
                    {hoveredRealm.hanja}
                  </span>
                  <div style={{ 
                    width: '60px', 
                    height: '1px', 
                    background: `linear-gradient(to left, transparent, ${hoveredRealm.color})` 
                  }} />
                </div>

                {/* 짧은 설명 */}
                <p style={{
                  fontSize: 'clamp(1rem, 1.5vw, 1.15rem)',
                  color: hoveredRealm.color,
                  fontFamily: '"Nanum Myeongjo", serif',
                  marginBottom: '12px'
                }}>
                  「 {hoveredRealm.shortDesc} 」
                </p>

                {/* 상세 설명 */}
                <p style={{
                  fontSize: 'clamp(0.85rem, 1.2vw, 0.95rem)',
                  color: 'rgba(220, 200, 180, 0.85)',
                  fontFamily: '"Nanum Myeongjo", serif',
                  lineHeight: 1.9,
                  maxWidth: '650px',
                  margin: '0 auto 15px'
                }}>
                  {hoveredRealm.fullDesc}
                </p>

                {/* 특징 태그 */}
                <div style={{
                  display: 'flex',
                  gap: '15px',
                  justifyContent: 'center'
                }}>
                  {hoveredRealm.characteristics.map((char, i) => (
                    <span
                      key={i}
                      style={{
                        padding: '4px 14px',
                        border: `1px solid ${hoveredRealm.color}50`,
                        fontSize: '0.8rem',
                        color: hoveredRealm.color,
                        fontFamily: '"Nanum Myeongjo", serif',
                        letterSpacing: '0.05em'
                      }}
                    >
                      {char}
                    </span>
                  ))}
                </div>
              </motion.div>
            ) : (
              /* 기본: 제목 표시 */
              <motion.div
                key="title"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ textAlign: 'center' }}
              >
                {/* 장식 */}
                <p style={{
                  fontSize: '0.85rem',
                  color: 'rgba(180, 150, 120, 0.5)',
                  fontFamily: '"Nanum Myeongjo", serif',
                  letterSpacing: '0.5em',
                  marginBottom: '15px'
                }}>
                  武 學 之 道
                </p>
                
                {/* 메인 타이틀 */}
                <h1 style={{
                  fontSize: 'clamp(3rem, 6vw, 4.5rem)',
                  color: '#fef3c7',
                  fontFamily: '"Nanum Myeongjo", serif',
                  fontWeight: 900,
                  letterSpacing: '0.3em',
                  margin: 0,
                  marginBottom: '20px'
                }}>
                  경지
                </h1>
                
                {/* 장식선 */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '20px',
                  marginBottom: '20px'
                }}>
                  <div style={{ 
                    width: '80px', 
                    height: '1px', 
                    background: 'linear-gradient(to right, transparent, rgba(180, 150, 120, 0.5))' 
                  }} />
                  <div style={{ 
                    width: '8px', 
                    height: '8px', 
                    border: '1px solid rgba(180, 150, 120, 0.5)',
                    transform: 'rotate(45deg)'
                  }} />
                  <div style={{ 
                    width: '80px', 
                    height: '1px', 
                    background: 'linear-gradient(to left, transparent, rgba(180, 150, 120, 0.5))' 
                  }} />
                </div>

                {/* 안내 문구 */}
                <p style={{
                  fontSize: '0.9rem',
                  color: 'rgba(150, 130, 110, 0.6)',
                  fontFamily: '"Nanum Myeongjo", serif',
                  fontStyle: 'italic'
                }}>
                  경지에 마우스를 올려 상세 내용을 확인하시오
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ===== 하단: 경지 카드들 ===== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{
            display: 'flex',
            gap: 'clamp(8px, 1.5vw, 16px)',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'nowrap',
            width: '100%',
            maxWidth: '1100px'
          }}
        >
          {REALMS.map((realm, index) => {
            const isHovered = hoveredId === realm.id;
            
            return (
              <motion.div
                key={realm.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.06 }}
                onMouseEnter={() => {
                  setHoveredId(realm.id);
                  playHover();
                }}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  position: 'relative',
                  width: 'clamp(90px, 11vw, 115px)',
                  height: 'clamp(170px, 24vh, 210px)',
                  background: isHovered 
                    ? 'linear-gradient(180deg, rgba(30, 25, 20, 0.95) 0%, rgba(20, 18, 15, 0.98) 100%)'
                    : 'linear-gradient(180deg, rgba(20, 18, 15, 0.7) 0%, rgba(15, 13, 10, 0.8) 100%)',
                  border: `1px solid ${isHovered ? realm.color : 'rgba(120, 100, 80, 0.2)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.35s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '15px 8px',
                  boxShadow: isHovered 
                    ? `0 0 30px ${realm.color}30, inset 0 0 20px ${realm.color}15`
                    : 'none',
                  transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
                  flexShrink: 0
                }}
              >
                {/* 상단 장식선 */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: isHovered ? '40px' : '25px',
                  height: '1px',
                  background: isHovered ? realm.color : 'rgba(150, 130, 110, 0.3)',
                  transition: 'all 0.3s ease'
                }} />

                {/* 레벨 */}
                <span style={{
                  fontSize: '0.65rem',
                  color: isHovered ? realm.color : 'rgba(150, 130, 110, 0.4)',
                  fontFamily: '"Nanum Myeongjo", serif',
                  letterSpacing: '0.1em',
                  marginBottom: '6px',
                  height: '14px',
                  lineHeight: '14px',
                  transition: 'color 0.3s ease'
                }}>
                  第{realm.level}境
                </span>

                {/* 한자 */}
                <p style={{
                  fontSize: '0.75rem',
                  color: isHovered ? realm.color : 'rgba(150, 130, 110, 0.5)',
                  fontFamily: '"Nanum Myeongjo", serif',
                  letterSpacing: '0.2em',
                  marginBottom: '8px',
                  height: '16px',
                  lineHeight: '16px',
                  transition: 'color 0.3s ease'
                }}>
                  {realm.hanja}
                </p>

                {/* 세로 타이틀 */}
                <div style={{
                  writingMode: 'vertical-rl',
                  textOrientation: 'upright',
                  fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
                  color: isHovered ? '#fef3c7' : 'rgba(220, 200, 180, 0.7)',
                  fontFamily: '"Nanum Myeongjo", serif',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  transition: 'all 0.3s ease',
                  textShadow: isHovered ? `0 0 15px ${realm.color}80` : 'none'
                }}>
                  {realm.title}
                </div>

                {/* 하단 장식선 */}
                <div style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: isHovered ? '40px' : '25px',
                  height: '1px',
                  background: isHovered ? realm.color : 'rgba(150, 130, 110, 0.3)',
                  transition: 'all 0.3s ease'
                }} />
              </motion.div>
            );
          })}
        </motion.div>

        {/* 하단 장식 문구 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          style={{
            paddingTop: '20px',
            textAlign: 'center'
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px'
          }}>
            <div style={{ 
              width: '50px', 
              height: '1px', 
              background: 'linear-gradient(to right, transparent, rgba(150, 130, 110, 0.3))' 
            }} />
            <p style={{
              fontSize: '0.8rem',
              color: 'rgba(150, 130, 110, 0.45)',
              fontFamily: '"Nanum Myeongjo", serif',
              letterSpacing: '0.2em'
            }}>
              경지의 높낮이는 있으나 진정한 무인은 마음에서 완성된다
            </p>
            <div style={{ 
              width: '50px', 
              height: '1px', 
              background: 'linear-gradient(to left, transparent, rgba(150, 130, 110, 0.3))' 
            }} />
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
