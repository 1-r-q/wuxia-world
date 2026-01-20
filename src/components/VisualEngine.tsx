"use client";

import React, { useMemo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Faction } from '@/data/factions';

export interface VisualEngineProps {
    effectType: Faction['effectType'];
    particleCount?: number;
    color?: string;
    showCursor?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// � 개방 - 낙엽 (바람에 흩날리는 자유로운 낙엽)
// 떠돌이 거지방의 자유분방함을 표현
// ═══════════════════════════════════════════════════════════════════════════
const FallingLeaf = ({ color, size = 1, variant = 0, uniqueId }: { color: string; size?: number; variant?: number; uniqueId: string }) => {
    const leaves = [
        // 단풍잎 (넓은 형태)
        <svg key="maple" width={20 * size} height={22 * size} viewBox="0 0 60 66" style={{ filter: `drop-shadow(0 0 ${4 * size}px ${color}80)` }}>
            <defs>
                <linearGradient id={`${uniqueId}-leaf1`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={color} stopOpacity="0.9" />
                    <stop offset="50%" stopColor={color} stopOpacity="0.7" />
                    <stop offset="100%" stopColor={color} stopOpacity="0.5" />
                </linearGradient>
            </defs>
            <path d="M30 0 L35 15 L50 10 L40 25 L60 30 L40 35 L50 50 L35 45 L30 66 L25 45 L10 50 L20 35 L0 30 L20 25 L10 10 L25 15 Z" 
                  fill={`url(#${uniqueId}-leaf1)`} />
            <line x1="30" y1="20" x2="30" y2="60" stroke={color} strokeWidth="1.5" strokeOpacity="0.6" />
        </svg>,
        // 버드나무 잎 (가늘고 긴 형태)
        <svg key="willow" width={8 * size} height={28 * size} viewBox="0 0 24 84" style={{ filter: `drop-shadow(0 0 ${3 * size}px ${color}70)` }}>
            <defs>
                <linearGradient id={`${uniqueId}-leaf2`} x1="50%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stopColor={color} stopOpacity="0.8" />
                    <stop offset="100%" stopColor={color} stopOpacity="0.4" />
                </linearGradient>
            </defs>
            <path d="M12 0 Q22 42, 12 84 Q2 42, 12 0" fill={`url(#${uniqueId}-leaf2)`} />
            <line x1="12" y1="5" x2="12" y2="78" stroke={color} strokeWidth="1" strokeOpacity="0.5" />
        </svg>,
        // 은행잎 (부채 형태)
        <svg key="ginkgo" width={22 * size} height={20 * size} viewBox="0 0 66 60" style={{ filter: `drop-shadow(0 0 ${4 * size}px ${color}80)` }}>
            <defs>
                <radialGradient id={`${uniqueId}-leaf3`} cx="50%" cy="100%" r="100%">
                    <stop offset="0%" stopColor={color} stopOpacity="0.9" />
                    <stop offset="70%" stopColor={color} stopOpacity="0.6" />
                    <stop offset="100%" stopColor={color} stopOpacity="0.3" />
                </radialGradient>
            </defs>
            <path d="M33 60 Q10 40, 5 10 Q20 15, 33 5 Q46 15, 61 10 Q56 40, 33 60" fill={`url(#${uniqueId}-leaf3)`} />
            <path d="M33 55 L33 20" stroke={color} strokeWidth="1.5" strokeOpacity="0.5" />
        </svg>,
        // 참나무 잎 (물결 형태)
        <svg key="oak" width={16 * size} height={24 * size} viewBox="0 0 48 72" style={{ filter: `drop-shadow(0 0 ${3 * size}px ${color}70)` }}>
            <defs>
                <linearGradient id={`${uniqueId}-leaf4`} x1="0%" y1="50%" x2="100%" y2="50%">
                    <stop offset="0%" stopColor={color} stopOpacity="0.6" />
                    <stop offset="50%" stopColor={color} stopOpacity="0.85" />
                    <stop offset="100%" stopColor={color} stopOpacity="0.6" />
                </linearGradient>
            </defs>
            <path d="M24 0 Q35 8, 40 18 Q30 22, 42 32 Q32 36, 40 46 Q28 50, 32 60 Q24 65, 24 72 Q24 65, 16 60 Q20 50, 8 46 Q16 36, 6 32 Q18 22, 8 18 Q13 8, 24 0" 
                  fill={`url(#${uniqueId}-leaf4)`} />
            <line x1="24" y1="8" x2="24" y2="68" stroke={color} strokeWidth="1" strokeOpacity="0.4" />
        </svg>
    ];
    return leaves[variant % leaves.length];
};

// ═══════════════════════════════════════════════════════════════════════════
// �🌸 화산파 - 매화검법의 정수
// 매화가 겨울 눈 위에서 피어나듯, 살의를 품은 화려한 검초
// ═══════════════════════════════════════════════════════════════════════════
const MaehwaPetal = ({ color, size = 1, variant = 0 }: { color: string; size?: number; variant?: number }) => {
    // 다양한 매화 꽃잎 형태
    const petals = [
        // 활짝 핀 매화
        <svg key="full" width={18 * size} height={18 * size} viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 ${4 * size}px ${color})` }}>
            {[0, 72, 144, 216, 288].map((angle, i) => (
                <ellipse key={i} cx="50" cy="22" rx="14" ry="24" fill={color} fillOpacity={0.7} transform={`rotate(${angle} 50 50)`} />
            ))}
            <circle cx="50" cy="50" r="10" fill="#FFEFD5" fillOpacity="0.9" />
            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                <circle key={`stamen-${i}`} cx="50" cy="42" r="2" fill="#FFD700" transform={`rotate(${angle} 50 50)`} />
            ))}
        </svg>,
        // 흩날리는 꽃잎 하나
        <svg key="single" width={12 * size} height={14 * size} viewBox="0 0 50 60" style={{ filter: `drop-shadow(0 0 ${3 * size}px ${color}80)` }}>
            <ellipse cx="25" cy="30" rx="20" ry="28" fill={color} fillOpacity="0.65" />
            <ellipse cx="25" cy="30" rx="12" ry="18" fill={color} fillOpacity="0.4" />
        </svg>,
        // 봉오리
        <svg key="bud" width={10 * size} height={12 * size} viewBox="0 0 40 50" style={{ filter: `drop-shadow(0 0 ${2 * size}px ${color}60)` }}>
            <ellipse cx="20" cy="30" rx="15" ry="20" fill={color} fillOpacity="0.6" />
            <ellipse cx="20" cy="25" rx="8" ry="12" fill={color} fillOpacity="0.8" />
        </svg>,
        // 검기와 함께 흩날리는 꽃잎
        <svg key="slash" width={30 * size} height={8 * size} viewBox="0 0 100 25" style={{ filter: `drop-shadow(0 0 ${5 * size}px ${color})` }}>
            <defs>
                <linearGradient id="maehwa-slash" x1="0%" y1="50%" x2="100%" y2="50%">
                    <stop offset="0%" stopColor={color} stopOpacity="0" />
                    <stop offset="30%" stopColor={color} stopOpacity="0.8" />
                    <stop offset="70%" stopColor={color} stopOpacity="0.8" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <ellipse cx="50" cy="12" rx="48" ry="10" fill="url(#maehwa-slash)" />
        </svg>
    ];
    return petals[variant % petals.length];
};

// ═══════════════════════════════════════════════════════════════════════════
// ☯️ 무당파 - 태극검의 음양조화
// 부드러움으로 강함을 제압하고, 흐름을 타고 역이용하는 도가의 검
// ═══════════════════════════════════════════════════════════════════════════
const TaijiSymbol = ({ color, size = 1, id }: { color: string; size?: number; id: string }) => (
    <svg width={28 * size} height={28 * size} viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 ${6 * size}px ${color})` }}>
        <defs>
            <linearGradient id={`${id}-yin`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1a1a2e" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#2d2d44" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id={`${id}-yang`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={color} stopOpacity="0.9" />
                <stop offset="100%" stopColor={color} stopOpacity="0.6" />
            </linearGradient>
        </defs>
        {/* 외곽 원 */}
        <circle cx="50" cy="50" r="48" fill="none" stroke={color} strokeWidth="2" strokeOpacity="0.4" />
        {/* 양 (백) */}
        <path d="M50 2 A48 48 0 0 1 50 98 A24 24 0 0 1 50 50 A24 24 0 0 0 50 2" fill={`url(#${id}-yang)`} />
        {/* 음 (흑) */}
        <path d="M50 2 A48 48 0 0 0 50 98 A24 24 0 0 0 50 50 A24 24 0 0 1 50 2" fill={`url(#${id}-yin)`} />
        {/* 양 중의 음 */}
        <circle cx="50" cy="26" r="8" fill="#1a1a2e" fillOpacity="0.7" />
        {/* 음 중의 양 */}
        <circle cx="50" cy="74" r="8" fill={color} fillOpacity="0.8" />
        {/* 중심 기운 */}
        <circle cx="50" cy="50" r="3" fill={color} fillOpacity="0.5" />
    </svg>
);

// 무당 검기 - 유연하게 흐르는 기운
const TaijiStream = ({ color, size = 1, id }: { color: string; size?: number; id: string }) => (
    <svg width={50 * size} height={20 * size} viewBox="0 0 100 40" style={{ filter: `drop-shadow(0 0 ${4 * size}px ${color}60)` }}>
        <defs>
            <linearGradient id={`${id}-stream`} x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stopColor={color} stopOpacity="0" />
                <stop offset="20%" stopColor={color} stopOpacity="0.5" />
                <stop offset="50%" stopColor={color} stopOpacity="0.3" />
                <stop offset="80%" stopColor="#ECF0F1" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#ECF0F1" stopOpacity="0" />
            </linearGradient>
        </defs>
        <path d="M0 20 Q25 5, 50 20 T100 20" stroke={`url(#${id}-stream)`} strokeWidth="8" fill="none" strokeLinecap="round" />
    </svg>
);

// ═══════════════════════════════════════════════════════════════════════════
// 🏛️ 소림사 - 금강불괴와 여래신장
// 천년 고찰의 불심, 황금빛 기운과 범자가 어우러진 항마의 힘
// ═══════════════════════════════════════════════════════════════════════════
const BuddhaLight = ({ color, size = 1, id, variant = 0 }: { color: string; size?: number; id: string; variant?: number }) => {
    const variants = [
        // 원형 광륜
        <svg key="halo" width={30 * size} height={30 * size} viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 ${8 * size}px ${color})` }}>
            <defs>
                <radialGradient id={`${id}-halo`}>
                    <stop offset="0%" stopColor={color} stopOpacity="0.9" />
                    <stop offset="40%" stopColor={color} stopOpacity="0.5" />
                    <stop offset="80%" stopColor={color} stopOpacity="0.2" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="45" fill={`url(#${id}-halo)`} />
            <circle cx="50" cy="50" r="20" fill={color} fillOpacity="0.3" />
        </svg>,
        // 범자 卍
        <div key="mantra" style={{ 
            fontSize: `${24 * size}px`, 
            fontFamily: "serif", 
            color, 
            textShadow: `0 0 ${10 * size}px ${color}, 0 0 ${20 * size}px ${color}60, 0 0 ${30 * size}px ${color}30`, 
            opacity: 0.8,
            fontWeight: 'bold'
        }}>卍</div>,
        // 금강저
        <svg key="vajra" width={8 * size} height={35 * size} viewBox="0 0 20 80" style={{ filter: `drop-shadow(0 0 ${5 * size}px ${color})` }}>
            <defs>
                <linearGradient id={`${id}-vajra`} x1="50%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stopColor={color} stopOpacity="0.9" />
                    <stop offset="50%" stopColor={color} stopOpacity="1" />
                    <stop offset="100%" stopColor={color} stopOpacity="0.9" />
                </linearGradient>
            </defs>
            <path d="M10 0 L15 10 L12 10 L12 35 L15 35 L10 45 L5 35 L8 35 L8 10 L5 10 Z" fill={`url(#${id}-vajra)`} />
            <path d="M10 80 L15 70 L12 70 L12 45 L15 45 L10 35 L5 45 L8 45 L8 70 L5 70 Z" fill={`url(#${id}-vajra)`} />
        </svg>,
        // 연꽃
        <svg key="lotus" width={22 * size} height={15 * size} viewBox="0 0 80 50" style={{ filter: `drop-shadow(0 0 ${4 * size}px ${color}80)` }}>
            {[-40, -25, -10, 10, 25, 40].map((angle, i) => (
                <ellipse key={i} cx="40" cy="45" rx="8" ry="20" fill={color} fillOpacity={0.6 - Math.abs(angle) * 0.005} transform={`rotate(${angle} 40 45)`} />
            ))}
            <ellipse cx="40" cy="42" rx="6" ry="8" fill={color} fillOpacity="0.9" />
        </svg>
    ];
    return variants[variant % variants.length];
};

// ═══════════════════════════════════════════════════════════════════════════
// ⚡ 곤륜파 - 운룡뇌전
// 구름 위의 용이 내리치는 천둥번개, 설산의 신선 검법
// ═══════════════════════════════════════════════════════════════════════════
const LightningBolt = ({ color, size = 1, variant = 0 }: { color: string; size?: number; variant?: number }) => {
    const bolts = [
        // 큰 번개
        <svg key="main" width={25 * size} height={70 * size} viewBox="0 0 50 140" style={{ filter: `drop-shadow(0 0 ${10 * size}px ${color}) drop-shadow(0 0 ${20 * size}px ${color}80)` }}>
            <path d="M30 0 L25 35 L38 35 L20 75 L28 75 L8 140 L18 80 L10 80 L28 45 L18 45 Z" fill={color} fillOpacity="0.95" />
            <path d="M28 5 L24 32 L34 32 L22 68 L28 68 L15 120" stroke="#fff" strokeWidth="2" fill="none" strokeOpacity="0.6" />
        </svg>,
        // 갈라지는 번개
        <svg key="branch" width={35 * size} height={60 * size} viewBox="0 0 70 120" style={{ filter: `drop-shadow(0 0 ${8 * size}px ${color})` }}>
            <path d="M35 0 L30 30 L40 30 L25 60 L35 60 L20 120" fill={color} fillOpacity="0.9" stroke={color} strokeWidth="3" />
            <path d="M25 60 L10 90" stroke={color} strokeWidth="2" strokeOpacity="0.7" />
            <path d="M25 60 L45 100" stroke={color} strokeWidth="2" strokeOpacity="0.7" />
        </svg>,
        // 전기 스파크
        <svg key="spark" width={15 * size} height={15 * size} viewBox="0 0 30 30" style={{ filter: `drop-shadow(0 0 ${6 * size}px ${color})` }}>
            <path d="M15 0 L17 12 L30 15 L17 18 L15 30 L13 18 L0 15 L13 12 Z" fill={color} fillOpacity="0.85" />
            <circle cx="15" cy="15" r="3" fill="#fff" fillOpacity="0.9" />
        </svg>
    ];
    return bolts[variant % bolts.length];
};

// 용 형상의 기운
const DragonQi = ({ color, size = 1, id }: { color: string; size?: number; id: string }) => (
    <svg width={60 * size} height={25 * size} viewBox="0 0 120 50" style={{ filter: `drop-shadow(0 0 ${5 * size}px ${color})` }}>
        <defs>
            <linearGradient id={`${id}-dragon`} x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stopColor={color} stopOpacity="0" />
                <stop offset="20%" stopColor={color} stopOpacity="0.6" />
                <stop offset="80%" stopColor={color} stopOpacity="0.6" />
                <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
        </defs>
        <path d="M0 25 Q20 10, 40 25 T80 25 T120 25" stroke={`url(#${id}-dragon)`} strokeWidth="6" fill="none" />
        <path d="M0 25 Q20 40, 40 25 T80 25 T120 25" stroke={`url(#${id}-dragon)`} strokeWidth="4" fill="none" strokeOpacity="0.5" />
    </svg>
);

// ═══════════════════════════════════════════════════════════════════════════
// ⚔️ 점창파 - 사일검 (蛇逸劍)
// 뱀처럼 유연하게 파고드는 빠른 검, 찰나의 순간 급소를 관통
// ═══════════════════════════════════════════════════════════════════════════
const SnakeSwordAura = ({ color, size = 1, id, variant = 0 }: { color: string; size?: number; id: string; variant?: number }) => {
    const auras = [
        // 빠르게 찌르는 검기
        <svg key="thrust" width={6 * size} height={80 * size} viewBox="0 0 15 160" style={{ filter: `drop-shadow(0 0 ${8 * size}px ${color})` }}>
            <defs>
                <linearGradient id={`${id}-thrust`} x1="50%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
                    <stop offset="20%" stopColor={color} stopOpacity="1" />
                    <stop offset="90%" stopColor={color} stopOpacity="0.8" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d="M7.5 0 L10 8 L9 160 L6 160 L5 8 Z" fill={`url(#${id}-thrust)`} />
        </svg>,
        // 뱀처럼 휘어지는 검기
        <svg key="snake" width={40 * size} height={60 * size} viewBox="0 0 80 120" style={{ filter: `drop-shadow(0 0 ${6 * size}px ${color})` }}>
            <defs>
                <linearGradient id={`${id}-snake`} x1="50%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stopColor={color} stopOpacity="0.9" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d="M10 0 Q50 30, 30 60 Q10 90, 40 120" stroke={`url(#${id}-snake)`} strokeWidth="4" fill="none" strokeLinecap="round" />
        </svg>,
        // 연속 찌르기 잔상
        <svg key="multi" width={20 * size} height={70 * size} viewBox="0 0 40 140" style={{ filter: `drop-shadow(0 0 ${5 * size}px ${color})` }}>
            {[0, 8, 16, 24, 32].map((x, i) => (
                <line key={i} x1={x + 4} y1="0" x2={x + 4} y2={130 - i * 15} stroke={color} strokeWidth="2" strokeOpacity={0.9 - i * 0.15} />
            ))}
        </svg>
    ];
    return auras[variant % auras.length];
};

// ═══════════════════════════════════════════════════════════════════════════
// 🗡️ 종남파 - 천하대검
// 기교 없이 압도적인 무게감으로 공간을 짓누르는 중검
// ═══════════════════════════════════════════════════════════════════════════
const HeavySwordAura = ({ color, size = 1, id }: { color: string; size?: number; id: string }) => (
    <svg width={12 * size} height={90 * size} viewBox="0 0 30 180" style={{ filter: `drop-shadow(0 0 ${10 * size}px ${color}) drop-shadow(0 0 ${20 * size}px ${color}50)` }}>
        <defs>
            <linearGradient id={`${id}-heavy`} x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor={color} stopOpacity="0" />
                <stop offset="10%" stopColor={color} stopOpacity="0.95" />
                <stop offset="50%" stopColor={color} stopOpacity="1" />
                <stop offset="90%" stopColor={color} stopOpacity="0.95" />
                <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
        </defs>
        <rect x="8" y="0" width="14" height="180" fill={`url(#${id}-heavy)`} rx="2" />
        <rect x="10" y="5" width="10" height="170" fill={color} fillOpacity="0.3" rx="1" />
    </svg>
);

// 검압 (검의 기운이 공기를 누르는 효과)
const SwordPressure = ({ color, size = 1, id }: { color: string; size?: number; id: string }) => (
    <svg width={50 * size} height={30 * size} viewBox="0 0 100 60" style={{ filter: `drop-shadow(0 0 ${6 * size}px ${color}60)` }}>
        <defs>
            <linearGradient id={`${id}-pressure`} x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor={color} stopOpacity="0.6" />
                <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
        </defs>
        <ellipse cx="50" cy="10" rx="45" ry="8" fill={`url(#${id}-pressure)`} />
        <ellipse cx="50" cy="30" rx="35" ry="6" fill={`url(#${id}-pressure)`} fillOpacity="0.5" />
        <ellipse cx="50" cy="50" rx="25" ry="4" fill={`url(#${id}-pressure)`} fillOpacity="0.3" />
    </svg>
);

// ═══════════════════════════════════════════════════════════════════════════
// 👑 남궁세가 - 제왕검
// 왕도를 걷는 검, 하늘을 가르는 창천의 검기
// ═══════════════════════════════════════════════════════════════════════════
const ImperialSwordAura = ({ color, size = 1, id }: { color: string; size?: number; id: string }) => (
    <svg width={8 * size} height={100 * size} viewBox="0 0 20 200" style={{ filter: `drop-shadow(0 0 ${12 * size}px ${color}) drop-shadow(0 0 ${25 * size}px ${color}60)` }}>
        <defs>
            <linearGradient id={`${id}-imperial`} x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="#F4F6F7" stopOpacity="1" />
                <stop offset="10%" stopColor={color} stopOpacity="1" />
                <stop offset="50%" stopColor={color} stopOpacity="0.9" />
                <stop offset="90%" stopColor={color} stopOpacity="0.8" />
                <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
        </defs>
        <rect x="6" y="0" width="8" height="200" fill={`url(#${id}-imperial)`} rx="4" />
        <path d="M10 0 L14 15 L10 10 L6 15 Z" fill="#F4F6F7" fillOpacity="0.9" />
    </svg>
);

// ═══════════════════════════════════════════════════════════════════════════
// 💜 아미파 - 멸절검과 명왕빛
// 자비로운 보살의 마음과 악을 베는 명왕의 검
// ═══════════════════════════════════════════════════════════════════════════
const MercyLight = ({ color, size = 1, variant = 0 }: { color: string; size?: number; variant?: number }) => {
    const lights = [
        // 팔방 빛살
        <svg key="star" width={22 * size} height={22 * size} viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 ${8 * size}px ${color})` }}>
            <path d="M50 5 L54 42 L90 50 L54 58 L50 95 L46 58 L10 50 L46 42 Z" fill={color} fillOpacity="0.7" />
            <path d="M50 15 L52 45 L80 50 L52 55 L50 85 L48 55 L20 50 L48 45 Z" fill={color} fillOpacity="0.9" />
            <circle cx="50" cy="50" r="5" fill="#fff" fillOpacity="0.8" />
        </svg>,
        // 보살의 광륜
        <svg key="halo" width={25 * size} height={25 * size} viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 ${6 * size}px ${color}80)` }}>
            <defs>
                <radialGradient id="mercy-halo">
                    <stop offset="30%" stopColor={color} stopOpacity="0.8" />
                    <stop offset="60%" stopColor={color} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="45" fill="url(#mercy-halo)" />
            <circle cx="50" cy="50" r="15" fill={color} fillOpacity="0.5" />
        </svg>,
        // 멸절의 검기
        <svg key="slash" width={35 * size} height={10 * size} viewBox="0 0 100 30" style={{ filter: `drop-shadow(0 0 ${5 * size}px ${color})` }}>
            <defs>
                <linearGradient id="mercy-slash" x1="0%" y1="50%" x2="100%" y2="50%">
                    <stop offset="0%" stopColor={color} stopOpacity="0" />
                    <stop offset="20%" stopColor={color} stopOpacity="0.9" />
                    <stop offset="80%" stopColor={color} stopOpacity="0.9" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <ellipse cx="50" cy="15" rx="48" ry="12" fill="url(#mercy-slash)" />
        </svg>
    ];
    return lights[variant % lights.length];
};

// ═══════════════════════════════════════════════════════════════════════════
// 🔥 천마신교 - 흑염장 (黑炎掌)
// 검은 불꽃으로 세상을 태우는 마교의 절대 무공
// ═══════════════════════════════════════════════════════════════════════════
const DarkFlame = ({ color, size = 1, id, variant = 0 }: { color: string; size?: number; id: string; variant?: number }) => {
    const flames = [
        // 솟구치는 흑염
        <svg key="main" width={20 * size} height={35 * size} viewBox="0 0 50 90" style={{ filter: `drop-shadow(0 0 ${8 * size}px ${color}) drop-shadow(0 0 ${15 * size}px #000)` }}>
            <defs>
                <linearGradient id={`${id}-flame1`} x1="50%" y1="100%" x2="50%" y2="0%">
                    <stop offset="0%" stopColor={color} stopOpacity="0.95" />
                    <stop offset="40%" stopColor={color} stopOpacity="0.7" />
                    <stop offset="70%" stopColor="#1B1B1B" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#1B1B1B" stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d="M25 0 Q35 20 30 35 Q40 25 42 40 Q38 60 25 90 Q12 60 8 40 Q10 25 20 35 Q15 20 25 0" fill={`url(#${id}-flame1)`} />
            <path d="M25 10 Q32 25 28 40 Q25 50 25 70" stroke={color} strokeWidth="2" fill="none" strokeOpacity="0.6" />
        </svg>,
        // 흩어지는 마기
        <svg key="scatter" width={25 * size} height={25 * size} viewBox="0 0 50 50" style={{ filter: `drop-shadow(0 0 ${6 * size}px ${color})` }}>
            <defs>
                <radialGradient id={`${id}-scatter`}>
                    <stop offset="0%" stopColor={color} stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#1B1B1B" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#1B1B1B" stopOpacity="0" />
                </radialGradient>
            </defs>
            <circle cx="25" cy="25" r="22" fill={`url(#${id}-scatter)`} />
        </svg>,
        // 마공 파동
        <svg key="wave" width={40 * size} height={15 * size} viewBox="0 0 80 30" style={{ filter: `drop-shadow(0 0 ${5 * size}px ${color})` }}>
            <defs>
                <linearGradient id={`${id}-wave`} x1="0%" y1="50%" x2="100%" y2="50%">
                    <stop offset="0%" stopColor="#1B1B1B" stopOpacity="0" />
                    <stop offset="30%" stopColor={color} stopOpacity="0.7" />
                    <stop offset="70%" stopColor={color} stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#1B1B1B" stopOpacity="0" />
                </linearGradient>
            </defs>
            <ellipse cx="40" cy="15" rx="38" ry="12" fill={`url(#${id}-wave)`} />
        </svg>
    ];
    return flames[variant % flames.length];
};

// ═══════════════════════════════════════════════════════════════════════════
// 🩸 혈교 - 혈요공 (血妖功)
// 피를 조종하고 시체를 부리는 금단의 마공
// ═══════════════════════════════════════════════════════════════════════════
const BloodMist = ({ color, size = 1, id, variant = 0 }: { color: string; size?: number; id: string; variant?: number }) => {
    const effects = [
        // 퍼지는 혈무
        <svg key="mist" width={40 * size} height={40 * size} viewBox="0 0 80 80" style={{ filter: `drop-shadow(0 0 ${6 * size}px ${color})` }}>
            <defs>
                <radialGradient id={`${id}-mist`}>
                    <stop offset="0%" stopColor={color} stopOpacity="0.7" />
                    <stop offset="40%" stopColor={color} stopOpacity="0.4" />
                    <stop offset="70%" stopColor={color} stopOpacity="0.15" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </radialGradient>
            </defs>
            <ellipse cx="40" cy="40" rx="38" ry="35" fill={`url(#${id}-mist)`} />
        </svg>,
        // 혈기 (솟구치는 피)
        <svg key="rise" width={15 * size} height={50 * size} viewBox="0 0 30 100" style={{ filter: `drop-shadow(0 0 ${5 * size}px ${color})` }}>
            <defs>
                <linearGradient id={`${id}-rise`} x1="50%" y1="100%" x2="50%" y2="0%">
                    <stop offset="0%" stopColor={color} stopOpacity="0.9" />
                    <stop offset="60%" stopColor={color} stopOpacity="0.5" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d="M15 100 Q20 70, 15 50 Q10 30, 15 0" stroke={`url(#${id}-rise)`} strokeWidth="8" fill="none" strokeLinecap="round" />
        </svg>,
        // 피방울
        <svg key="drop" width={12 * size} height={16 * size} viewBox="0 0 24 32" style={{ filter: `drop-shadow(0 0 ${4 * size}px ${color})` }}>
            <path d="M12 0 Q18 12, 18 20 A6 6 0 0 1 6 20 Q6 12, 12 0" fill={color} fillOpacity="0.8" />
            <ellipse cx="10" cy="18" rx="2" ry="3" fill="#fff" fillOpacity="0.3" />
        </svg>
    ];
    return effects[variant % effects.length];
};

// ═══════════════════════════════════════════════════════════════════════════
// 🧪 당가/청성 - 독기 (毒氣)
// 만천화우의 아름다운 독, 치명적인 녹색 안개
// ═══════════════════════════════════════════════════════════════════════════
const PoisonCloud = ({ color, size = 1, id, variant = 0 }: { color: string; size?: number; id: string; variant?: number }) => {
    const clouds = [
        // 퍼지는 독운
        <svg key="cloud" width={45 * size} height={30 * size} viewBox="0 0 90 60" style={{ filter: `drop-shadow(0 0 ${5 * size}px ${color}80)` }}>
            <defs>
                <radialGradient id={`${id}-cloud`} cx="50%" cy="60%">
                    <stop offset="0%" stopColor={color} stopOpacity="0.5" />
                    <stop offset="50%" stopColor={color} stopOpacity="0.25" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </radialGradient>
            </defs>
            <ellipse cx="45" cy="35" rx="42" ry="22" fill={`url(#${id}-cloud)`} />
            <ellipse cx="30" cy="30" rx="25" ry="15" fill={`url(#${id}-cloud)`} />
            <ellipse cx="60" cy="28" rx="22" ry="14" fill={`url(#${id}-cloud)`} />
        </svg>,
        // 암기 (비도)
        <svg key="needle" width={4 * size} height={35 * size} viewBox="0 0 10 70" style={{ filter: `drop-shadow(0 0 ${3 * size}px ${color})` }}>
            <defs>
                <linearGradient id={`${id}-needle`} x1="50%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stopColor="#aaa" stopOpacity="0.9" />
                    <stop offset="70%" stopColor={color} stopOpacity="0.8" />
                    <stop offset="100%" stopColor={color} stopOpacity="0.5" />
                </linearGradient>
            </defs>
            <path d="M5 0 L7 8 L6 70 L4 70 L3 8 Z" fill={`url(#${id}-needle)`} />
        </svg>,
        // 독 파문
        <svg key="ripple" width={30 * size} height={30 * size} viewBox="0 0 60 60" style={{ filter: `drop-shadow(0 0 ${4 * size}px ${color})` }}>
            <circle cx="30" cy="30" r="25" fill="none" stroke={color} strokeWidth="2" strokeOpacity="0.4" />
            <circle cx="30" cy="30" r="18" fill="none" stroke={color} strokeWidth="2" strokeOpacity="0.5" />
            <circle cx="30" cy="30" r="10" fill="none" stroke={color} strokeWidth="2" strokeOpacity="0.6" />
            <circle cx="30" cy="30" r="4" fill={color} fillOpacity="0.7" />
        </svg>
    ];
    return clouds[variant % clouds.length];
};

// ═══════════════════════════════════════════════════════════════════════════
// 🍂 개방 - 항룡십팔장
// 가장 낮은 곳에서 피어난 의기, 용의 형상으로 폭발
// ═══════════════════════════════════════════════════════════════════════════
const FallenLeaf = ({ color, size = 1, variant = 0 }: { color: string; size?: number; variant?: number }) => {
    const leaves = [
        // 마른 낙엽
        <svg key="dry" width={16 * size} height={20 * size} viewBox="0 0 40 50" style={{ filter: `drop-shadow(0 0 ${2 * size}px ${color}60)` }}>
            <path d="M20 0 Q32 10 32 28 Q28 42 20 50 Q12 42 8 28 Q8 10 20 0" fill={color} fillOpacity="0.7" />
            <path d="M20 5 Q22 15, 20 25 Q18 35, 20 48" stroke={color} strokeWidth="1" fill="none" strokeOpacity="0.8" />
            <path d="M12 15 Q16 20, 20 22" stroke={color} strokeWidth="0.8" fill="none" strokeOpacity="0.5" />
            <path d="M28 15 Q24 20, 20 22" stroke={color} strokeWidth="0.8" fill="none" strokeOpacity="0.5" />
        </svg>,
        // 항룡장 기운
        <svg key="dragon" width={35 * size} height={20 * size} viewBox="0 0 70 40" style={{ filter: `drop-shadow(0 0 ${4 * size}px ${color})` }}>
            <defs>
                <linearGradient id="dragon-qi" x1="0%" y1="50%" x2="100%" y2="50%">
                    <stop offset="0%" stopColor={color} stopOpacity="0" />
                    <stop offset="30%" stopColor={color} stopOpacity="0.6" />
                    <stop offset="70%" stopColor={color} stopOpacity="0.6" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d="M0 20 Q15 5, 35 20 Q55 35, 70 20" stroke="url(#dragon-qi)" strokeWidth="8" fill="none" strokeLinecap="round" />
        </svg>,
        // 먼지/흙
        <svg key="dust" width={20 * size} height={20 * size} viewBox="0 0 40 40" style={{ filter: `drop-shadow(0 0 ${2 * size}px ${color}40)` }}>
            <defs>
                <radialGradient id="dust-grad">
                    <stop offset="0%" stopColor={color} stopOpacity="0.5" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </radialGradient>
            </defs>
            <circle cx="20" cy="20" r="18" fill="url(#dust-grad)" />
        </svg>
    ];
    return leaves[variant % leaves.length];
};

// ═══════════════════════════════════════════════════════════════════════════
// 🌊 모용세가/수로채 - 물결
// 이피지도, 상대의 힘을 반사하는 유연한 수류
// ═══════════════════════════════════════════════════════════════════════════
const WaterRipple = ({ color, size = 1, id }: { color: string; size?: number; id: string }) => (
    <svg width={40 * size} height={25 * size} viewBox="0 0 80 50" style={{ filter: `drop-shadow(0 0 ${4 * size}px ${color}60)` }}>
        <defs>
            <linearGradient id={`${id}-water`} x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stopColor={color} stopOpacity="0" />
                <stop offset="30%" stopColor={color} stopOpacity="0.5" />
                <stop offset="70%" stopColor={color} stopOpacity="0.5" />
                <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
        </defs>
        <path d="M0 25 Q10 15, 20 25 Q30 35, 40 25 Q50 15, 60 25 Q70 35, 80 25" stroke={`url(#${id}-water)`} strokeWidth="4" fill="none" />
        <path d="M0 35 Q10 25, 20 35 Q30 45, 40 35 Q50 25, 60 35 Q70 45, 80 35" stroke={`url(#${id}-water)`} strokeWidth="3" fill="none" strokeOpacity="0.6" />
    </svg>
);

// ═══════════════════════════════════════════════════════════════════════════
// 🌟 공동파/제갈세가 - 성진 (星陣)
// 팔괘의 진법, 천기를 누설하는 지략가들의 힘
// ═══════════════════════════════════════════════════════════════════════════
const StarFormation = ({ color, size = 1, variant = 0 }: { color: string; size?: number; variant?: number }) => {
    const formations = [
        // 별빛
        <svg key="star" width={18 * size} height={18 * size} viewBox="0 0 40 40" style={{ filter: `drop-shadow(0 0 ${5 * size}px ${color})` }}>
            <path d="M20 2 L22 16 L36 20 L22 24 L20 38 L18 24 L4 20 L18 16 Z" fill={color} fillOpacity="0.8" />
            <circle cx="20" cy="20" r="3" fill="#fff" fillOpacity="0.9" />
        </svg>,
        // 팔괘 심볼
        <svg key="bagua" width={22 * size} height={22 * size} viewBox="0 0 50 50" style={{ filter: `drop-shadow(0 0 ${4 * size}px ${color}80)` }}>
            <circle cx="25" cy="25" r="22" fill="none" stroke={color} strokeWidth="1.5" strokeOpacity="0.5" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                <line key={i} x1="25" y1="25" x2={25 + 20 * Math.cos(angle * Math.PI / 180)} y2={25 + 20 * Math.sin(angle * Math.PI / 180)} stroke={color} strokeWidth="2" strokeOpacity="0.6" />
            ))}
            <circle cx="25" cy="25" r="5" fill={color} fillOpacity="0.7" />
        </svg>,
        // 진법 파문
        <svg key="array" width={30 * size} height={30 * size} viewBox="0 0 60 60" style={{ filter: `drop-shadow(0 0 ${3 * size}px ${color})` }}>
            <circle cx="30" cy="30" r="25" fill="none" stroke={color} strokeWidth="1" strokeOpacity="0.3" strokeDasharray="4,4" />
            <circle cx="30" cy="30" r="18" fill="none" stroke={color} strokeWidth="1" strokeOpacity="0.5" />
            <circle cx="30" cy="30" r="10" fill="none" stroke={color} strokeWidth="1.5" strokeOpacity="0.7" />
            <circle cx="30" cy="30" r="3" fill={color} fillOpacity="0.8" />
        </svg>
    ];
    return formations[variant % formations.length];
};

// ═══════════════════════════════════════════════════════════════════════════
// 🌬️ 사파연합 - 바람/녹림
// 거친 야성의 바람, 산과 숲을 지배하는 녹림호걸
// ═══════════════════════════════════════════════════════════════════════════
const WindStream = ({ color, size = 1, id }: { color: string; size?: number; id: string }) => (
    <svg width={55 * size} height={20 * size} viewBox="0 0 110 40" style={{ filter: `drop-shadow(0 0 ${3 * size}px ${color}50)` }}>
        <defs>
            <linearGradient id={`${id}-wind`} x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stopColor={color} stopOpacity="0" />
                <stop offset="20%" stopColor={color} stopOpacity="0.4" />
                <stop offset="50%" stopColor={color} stopOpacity="0.5" />
                <stop offset="80%" stopColor={color} stopOpacity="0.4" />
                <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
        </defs>
        <path d="M0 20 Q20 10, 40 20 T80 20 T110 20" stroke={`url(#${id}-wind)`} strokeWidth="5" fill="none" />
        <path d="M10 30 Q30 20, 50 30 T90 30" stroke={`url(#${id}-wind)`} strokeWidth="3" fill="none" strokeOpacity="0.6" />
    </svg>
);

// ═══════════════════════════════════════════════════════════════════════════
// 🌫️ 하오문 - 안개
// 정보의 암흑, 뒷골목을 지배하는 은밀한 힘
// ═══════════════════════════════════════════════════════════════════════════
const MistCloud = ({ color, size = 1, id }: { color: string; size?: number; id: string }) => (
    <svg width={50 * size} height={35 * size} viewBox="0 0 100 70" style={{ filter: `drop-shadow(0 0 ${4 * size}px ${color}40)` }}>
        <defs>
            <radialGradient id={`${id}-mist`} cx="50%" cy="50%">
                <stop offset="0%" stopColor={color} stopOpacity="0.35" />
                <stop offset="50%" stopColor={color} stopOpacity="0.15" />
                <stop offset="100%" stopColor={color} stopOpacity="0" />
            </radialGradient>
        </defs>
        <ellipse cx="50" cy="40" rx="48" ry="28" fill={`url(#${id}-mist)`} />
        <ellipse cx="35" cy="35" rx="30" ry="18" fill={`url(#${id}-mist)`} />
        <ellipse cx="65" cy="32" rx="28" ry="16" fill={`url(#${id}-mist)`} />
    </svg>
);

// ═══════════════════════════════════════════════════════════════════════════
// 🗡️ 살수막 - 암영
// 그림자 속의 죽음, 소리 없이 다가오는 암살자
// ═══════════════════════════════════════════════════════════════════════════
const ShadowBlade = ({ color, size = 1, id, variant = 0 }: { color: string; size?: number; id: string; variant?: number }) => {
    const shadows = [
        // 암영
        <svg key="shadow" width={18 * size} height={18 * size} viewBox="0 0 40 40" style={{ filter: `drop-shadow(0 0 ${3 * size}px ${color})` }}>
            <defs>
                <radialGradient id={`${id}-shadow`}>
                    <stop offset="0%" stopColor={color} stopOpacity="0.7" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </radialGradient>
            </defs>
            <polygon points="20,2 38,20 20,38 2,20" fill={`url(#${id}-shadow)`} />
        </svg>,
        // 비수
        <svg key="dagger" width={5 * size} height={30 * size} viewBox="0 0 12 60" style={{ filter: `drop-shadow(0 0 ${4 * size}px ${color})` }}>
            <path d="M6 0 L9 10 L8 55 L6 60 L4 55 L3 10 Z" fill={color} fillOpacity="0.8" />
            <path d="M6 2 L6 55" stroke="#888" strokeWidth="1" strokeOpacity="0.5" />
        </svg>,
        // 사라지는 잔상
        <svg key="fade" width={15 * size} height={25 * size} viewBox="0 0 30 50" style={{ filter: `drop-shadow(0 0 ${2 * size}px ${color})` }}>
            <defs>
                <linearGradient id={`${id}-fade`} x1="50%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stopColor={color} stopOpacity="0.6" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <ellipse cx="15" cy="25" rx="12" ry="24" fill={`url(#${id}-fade)`} />
        </svg>
    ];
    return shadows[variant % shadows.length];
};

// ═══════════════════════════════════════════════════════════════════════════
// 🔥 하북팽가 - 오호단문도
// 호랑이의 포효, 화염처럼 맹렬한 도법
// ═══════════════════════════════════════════════════════════════════════════
const TigerFlame = ({ color, size = 1, id }: { color: string; size?: number; id: string }) => (
    <svg width={22 * size} height={32 * size} viewBox="0 0 50 80" style={{ filter: `drop-shadow(0 0 ${7 * size}px ${color})` }}>
        <defs>
            <linearGradient id={`${id}-tiger`} x1="50%" y1="100%" x2="50%" y2="0%">
                <stop offset="0%" stopColor={color} stopOpacity="0.95" />
                <stop offset="50%" stopColor={color} stopOpacity="0.7" />
                <stop offset="100%" stopColor="#FF6B35" stopOpacity="0" />
            </linearGradient>
        </defs>
        <path d="M25 0 Q38 15 35 30 Q45 22 45 38 Q42 55 25 80 Q8 55 5 38 Q5 22 15 30 Q12 15 25 0" fill={`url(#${id}-tiger)`} />
        <path d="M25 5 Q32 18 28 35 Q25 50 25 70" stroke="#FFD93D" strokeWidth="2" fill="none" strokeOpacity="0.5" />
    </svg>
);

// ═══════════════════════════════════════════════════════════════════════════
// ❄️ 빙궁 (새외세력) - 빙설
// 얼음 꽃잎처럼 날카로운 한기
// ═══════════════════════════════════════════════════════════════════════════
const IceCrystal = ({ color, size = 1, variant = 0 }: { color: string; size?: number; variant?: number }) => {
    const crystals = [
        // 육각 눈꽃
        <svg key="snow" width={18 * size} height={18 * size} viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 ${4 * size}px ${color})` }}>
            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                <g key={i} transform={`rotate(${angle} 50 50)`}>
                    <line x1="50" y1="50" x2="50" y2="8" stroke={color} strokeWidth="3" strokeOpacity="0.85" />
                    <line x1="50" y1="22" x2="38" y2="12" stroke={color} strokeWidth="2" strokeOpacity="0.65" />
                    <line x1="50" y1="22" x2="62" y2="12" stroke={color} strokeWidth="2" strokeOpacity="0.65" />
                    <line x1="50" y1="35" x2="42" y2="28" stroke={color} strokeWidth="1.5" strokeOpacity="0.5" />
                    <line x1="50" y1="35" x2="58" y2="28" stroke={color} strokeWidth="1.5" strokeOpacity="0.5" />
                </g>
            ))}
            <circle cx="50" cy="50" r="6" fill={color} fillOpacity="0.6" />
        </svg>,
        // 얼음 조각
        <svg key="shard" width={10 * size} height={20 * size} viewBox="0 0 25 50" style={{ filter: `drop-shadow(0 0 ${3 * size}px ${color})` }}>
            <polygon points="12.5,0 22,15 20,45 5,45 3,15" fill={color} fillOpacity="0.7" />
            <polygon points="12.5,5 18,15 16,40 8,40 6,15" fill="#fff" fillOpacity="0.3" />
        </svg>,
        // 서리
        <svg key="frost" width={15 * size} height={15 * size} viewBox="0 0 30 30" style={{ filter: `drop-shadow(0 0 ${2 * size}px ${color}80)` }}>
            <defs>
                <radialGradient id="frost-grad">
                    <stop offset="0%" stopColor="#fff" stopOpacity="0.8" />
                    <stop offset="50%" stopColor={color} stopOpacity="0.5" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </radialGradient>
            </defs>
            <circle cx="15" cy="15" r="13" fill="url(#frost-grad)" />
        </svg>
    ];
    return crystals[variant % crystals.length];
};

// ═══════════════════════════════════════════════════════════════════════════
// 유틸리티
// ═══════════════════════════════════════════════════════════════════════════
const seededRandom = (seed: number): number => {
    const x = Math.sin(seed * 9999) * 10000;
    return x - Math.floor(x);
};

// ═══════════════════════════════════════════════════════════════════════════
// 개별 파티클 컴포넌트
// ═══════════════════════════════════════════════════════════════════════════
interface ParticleProps {
    id: number;
    effectType: string;
    color: string;
}

const Particle = React.memo(({ id, effectType, color }: ParticleProps) => {
    const uniqueId = `p-${effectType}-${id}`;
    
    const { seed1, seed2, seed3, seed4, seed5, seed6, spreadLeft, size, variant, staggerDelay } = useMemo(() => {
        const seed1 = seededRandom(id + 1);
        const seed2 = seededRandom(id * 2 + 7);
        const seed3 = seededRandom(id * 3 + 13);
        const seed4 = seededRandom(id * 5 + 19);
        const seed5 = seededRandom(id * 7 + 23);
        const seed6 = seededRandom(id * 11 + 29);
        
        const spreadLeft = seed1 * 100;
        const size = 0.5 + seed2 * 0.7;
        const variant = Math.floor(seed6 * 10);
        
        // 파티클별 시작 지연 시간 (불규칙하게 분산)
        // id와 여러 seed를 조합해서 0~8초 사이에 분산
        const staggerDelay = (seed1 * 3) + (seed4 * 2.5) + ((id % 10) * 0.3);
        
        return { seed1, seed2, seed3, seed4, seed5, seed6, spreadLeft, size, variant, staggerDelay };
    }, [id]);
    
    const { Component, style, animate, transition } = useMemo(() => {
        let Component: React.ReactNode;
        let style: React.CSSProperties = {};
        let animate: Record<string, unknown> = {};
        let transition: Record<string, unknown> = {};
    
    switch (effectType) {
        // ═══════════════════════════════════════════════════════════════
        // 🌸 화산파 - 매화검법
        // 처절하고 화려한 매화 검초, 검기와 함께 흩날리는 꽃잎
        // ═══════════════════════════════════════════════════════════════
        case '꽃잎': {
            const duration = 5 + seed1 * 3.5;
            const swayAmount = 70 + seed2 * 100;
            const rotationSpeed = seed3 > 0.5 ? 480 : -480;
            // 화면 상단에서 시작 (-5% ~ -15%)
            const startY = -(seed5 * 10 + 5);
            
            style = { left: `${spreadLeft}%`, top: `${startY}%`, zIndex: 14 };
            animate = {
                y: ['0%', '125vh'],
                x: [0, swayAmount * 0.35 * (seed3 > 0.5 ? 1 : -1), -swayAmount * 0.25, swayAmount * 0.15 * (seed3 > 0.5 ? 1 : -1)],
                rotate: [seed3 * 180, seed3 * 180 + rotationSpeed],
                opacity: [0, 0.6, 0.55, 0.4, 0],
                scale: [size * 0.7, size * 1, size * 0.9, size * 0.65],
            };
            transition = {
                duration,
                repeat: Infinity,
                ease: "linear",
                delay: seed1 * 0.8 + seed2 * 0.5,
                repeatDelay: 0.5 + seed4 * 1.5,
            };
            Component = <MaehwaPetal color={color} size={size} variant={variant} />;
            break;
        }
        
        // ═══════════════════════════════════════════════════════════════
        // ☯️ 무당파 - 태극검
        // 음양의 조화, 부드럽게 흘러가는 검기
        // ═══════════════════════════════════════════════════════════════
        case '태극': {
            const isSymbol = seed1 > 0.55;
            const duration = 7 + seed2 * 4;
            const floatRange = 20 + seed3 * 35;
            // 다양한 seed 조합으로 화면 전체에 균등 분산
            const startTop = 8 + ((seed2 + seed4) % 1) * 78;
            const startLeft = 5 + ((seed1 + seed3 + seed5) % 1) * 90;
            
            style = { left: `${startLeft}%`, top: `${startTop}%`, zIndex: 12 };
            
            if (isSymbol) {
                animate = {
                    y: [0, -floatRange, 0, floatRange * 0.4, 0],
                    x: [0, floatRange * 0.2, 0, -floatRange * 0.15, 0],
                    rotate: [0, 360],
                    scale: [size * 0.4, size * 0.7, size * 0.6, size * 0.75, size * 0.4],
                    opacity: [0, 0.45, 0.4, 0.45, 0],
                };
            } else {
                animate = {
                    x: [0, 50 + seed4 * 40],
                    y: [0, (seed5 - 0.5) * 35],
                    opacity: [0, 0.5, 0.45, 0],
                    scale: [0.8, 1.1, 0.9],
                };
            }
            transition = {
                duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: seed1 * 0.5 + seed6 * 0.3,
                repeatDelay: 0.8 + seed3 * 1.5,
            };
            Component = isSymbol ? 
                <TaijiSymbol color={color} size={size * 0.7} id={uniqueId} /> : 
                <TaijiStream color={color} size={size * 0.85} id={uniqueId} />;
            break;
        }
        
        // ═══════════════════════════════════════════════════════════════
        // 🏛️ 소림사 - 금강불괴
        // 황금빛 불심, 범자와 광륜이 어우러진 항마의 힘
        // ═══════════════════════════════════════════════════════════════
        case '금광': {
            const startTop = 5 + seed2 * 85;
            const duration = 3 + seed3 * 2;
            const driftX = (seed4 - 0.5) * 50;
            const driftY = (seed5 - 0.5) * 50;
            
            style = { left: `${spreadLeft}%`, top: `${startTop}%` };
            animate = {
                x: [0, driftX * 0.5, driftX],
                y: [0, driftY * 0.5, driftY],
                scale: [0, size * 0.9, size, 0],
                opacity: [0, 0.55, 0.5, 0],
                rotate: variant === 1 ? [0, 0] : [0, 15, -15, 0],
            };
            transition = {
                duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: seed1 * 0.5 + seed2 * 0.3,
                repeatDelay: 0.5 + seed4 * 1,
            };
            Component = <BuddhaLight color={color} size={size * 0.9} id={uniqueId} variant={variant} />;
            break;
        }

        // ═══════════════════════════════════════════════════════════════
        // ⚡ 곤륜파 - 운룡뇌전
        // 용이 내리치는 천둥번개, 설산의 강렬한 기운
        // ═══════════════════════════════════════════════════════════════
        case '운룡뇌전':
        case '번개': {
            // 3가지 타입: 번개(25%), 용기운(45%), 전기스파크(30%)
            const effectVariant = seed1 < 0.25 ? 'lightning' : (seed1 < 0.7 ? 'dragon' : 'spark');
            // 화면 전체에 균등 분산 (0~100%)
            const fullSpreadLeft = ((seed1 + seed2 + seed3) % 1) * 100;
            
            if (effectVariant === 'lightning') {
                // 강렬한 번개 - 화면 위에서 아래로
                const duration = 0.4 + seed2 * 0.25;
                style = { left: `${fullSpreadLeft}%`, top: '-5%', zIndex: 20 };
                animate = {
                    y: ['0%', '75vh'],
                    opacity: [0, 1, 0.9, 0],
                    scaleY: [0.3, 1.5, 1.2, 0.4],
                    scaleX: [0.7 + seed2 * 0.3, 1.2, 1, 0.5],
                };
                transition = {
                    duration,
                    repeat: Infinity,
                    ease: "easeIn",
                    delay: seed1 * 3 + seed4 * 2,
                    repeatDelay: 2 + seed3 * 4,
                };
                Component = <LightningBolt color={color} size={size * 1.3} variant={variant % 3} />;
            } else if (effectVariant === 'dragon') {
                // 용의 기운 - 화면 전체에서 움직임
                const duration = 3 + seed2 * 2;
                const startTop = 10 + seed2 * 70;
                const dragonLeft = ((seed2 + seed4) % 1) * 90 + 5;
                style = { left: `${dragonLeft}%`, top: `${startTop}%`, zIndex: 15 };
                animate = {
                    x: [0, 100 + seed3 * 80],
                    y: [0, (seed4 - 0.5) * 45, (seed5 - 0.5) * 25],
                    opacity: [0, 0.6, 0.55, 0.35, 0],
                    scaleX: [0.9, 1.35, 1.15, 0.8],
                    scaleY: [1, 1.1, 1, 0.9],
                };
                transition = {
                    duration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: seed2 * 3 + seed5 * 2,
                    repeatDelay: 1.2 + seed5 * 2,
                };
                Component = <DragonQi color={color} size={size * 1.1} id={uniqueId} />;
            } else {
                // 전기 스파크 - 화면 곳곳에서 반짝 (전체 분산)
                const duration = 0.5 + seed2 * 0.35;
                const startTop = 10 + seed2 * 75;
                const sparkLeft = ((seed3 + seed5) % 1) * 95 + 2.5;
                style = { left: `${sparkLeft}%`, top: `${startTop}%`, zIndex: 17 };
                animate = {
                    scale: [0, size * 1.25, size * 0.85, size * 1.1, 0],
                    opacity: [0, 0.9, 0.75, 0.85, 0],
                    rotate: [0, 45, -30, 20, 0],
                };
                transition = {
                    duration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: seed3 * 4 + seed6 * 2,
                    repeatDelay: 0.8 + seed4 * 2.5,
                };
                Component = <LightningBolt color={color} size={size * 0.9} variant={2} />;
            }
            break;
        }
        
        // ═══════════════════════════════════════════════════════════════
        // ⚔️ 점창파 - 사일검
        // 뱀처럼 유연하게 찌르는 빠른 검법
        // ═══════════════════════════════════════════════════════════════
        case '사일검': {
            // 점창파: 뱀처럼 빠르고 날카롭게 찌르는 검
            const duration = 0.6 + seed1 * 0.4;
            const angle = (seed2 - 0.5) * 25;
            const startTop = 70 + seed5 * 25;
            
            style = { 
                left: `${spreadLeft}%`, 
                top: `${startTop}%`,
                zIndex: 16,
            };
            animate = {
                y: ['0%', '-85vh'],
                rotate: [angle, angle + (seed3 - 0.5) * 8],
                opacity: [0, 0.95, 0.9, 0.6, 0],
                scale: [0.3, 1.2, 1, 0.4],
            };
            transition = {
                duration,
                repeat: Infinity,
                ease: [0.1, 0, 0.2, 1],
                delay: seed1 * 0.3 + seed4 * 0.2,
                repeatDelay: 0.15 + seed3 * 0.4,
            };
            Component = <SnakeSwordAura color={color} size={size * 1.2} id={uniqueId} variant={variant % 3} />;
            break;
        }
        
        // ═══════════════════════════════════════════════════════════════
        // 🗡️ 종남파 - 천하대검
        // 압도적인 무게감의 중검
        // ═══════════════════════════════════════════════════════════════
        case '중검': {
            // 종남파: 압도적인 무게감의 중검, 천천히 하지만 묵직하게
            const isAura = seed1 > 0.4;
            const duration = isAura ? (1.8 + seed1 * 1) : (2.5 + seed1 * 1);
            const angle = (seed2 - 0.5) * 5;
            const startTop = 65 + seed5 * 30;
            
            style = { 
                left: `${spreadLeft}%`, 
                top: `${startTop}%`,
                zIndex: 16,
            };
            
            if (isAura) {
                animate = {
                    y: ['0%', '-80vh'],
                    rotate: [angle, angle],
                    opacity: [0, 0.9, 0.85, 0.6, 0],
                    scale: [0.4, 1.4, 1.2, 0.5],
                };
            } else {
                animate = {
                    y: ['0%', '-60vh'],
                    opacity: [0, 0.7, 0.65, 0],
                    scale: [0.8, 1.3, 1.1],
                };
            }
            transition = {
                duration,
                repeat: Infinity,
                ease: isAura ? [0.4, 0, 0.2, 1] : "easeOut",
                delay: seed1 * 0.3 + seed4 * 0.2,
                repeatDelay: isAura ? (0.3 + seed3 * 0.6) : (0.4 + seed4 * 0.8),
            };
            Component = isAura ? 
                <HeavySwordAura color={color} size={size * 1.3} id={uniqueId} /> :
                <SwordPressure color={color} size={size * 1.2} id={uniqueId} />;
            break;
        }
        
        // ═══════════════════════════════════════════════════════════════
        // 👑 남궁세가 - 제왕검
        // 왕도의 검, 하늘을 찌르는 창천의 검기
        // ═══════════════════════════════════════════════════════════════
        case '제왕검기': {
            // 남궁세가: 제왕의 위엄, 하늘을 찌르는 창천의 검기
            const duration = 0.5 + seed1 * 0.3;
            const angle = (seed2 - 0.5) * 12;
            const startTop = 60 + seed5 * 35;
            
            style = { 
                left: `${spreadLeft}%`, 
                top: `${startTop}%`,
                zIndex: 17,
            };
            animate = {
                y: ['0%', '-100vh'],
                rotate: [angle, angle],
                opacity: [0, 0.95, 0.9, 0.6, 0],
                scale: [0.2, 1.5, 1.2, 0.3],
            };
            transition = {
                duration,
                repeat: Infinity,
                ease: [0.1, 0, 0.2, 1],
                delay: seed1 * 0.4 + seed4 * 0.3,
                repeatDelay: 0.2 + seed3 * 0.5,
            };
            Component = <ImperialSwordAura color={color} size={size * 1.2} id={uniqueId} />;
            break;
        }
        
        // ═══════════════════════════════════════════════════════════════
        // 💜 아미파 - 멸절검
        // 자비와 멸절의 빛
        // ═══════════════════════════════════════════════════════════════
        case '명왕빛': {
            const startTop = 8 + seed2 * 78;
            const duration = 2.8 + seed1 * 1.8;
            const driftX = (seed3 - 0.5) * 70;
            const driftY = (seed4 - 0.5) * 70;
            
            style = { left: `${spreadLeft}%`, top: `${startTop}%`, zIndex: 13 };
            animate = {
                x: [0, driftX * 0.5, driftX],
                y: [0, driftY * 0.5, driftY],
                scale: [0, size * 1, size * 0.4],
                opacity: [0, 0.6, 0],
                rotate: [0, 80],
            };
            transition = {
                duration,
                repeat: Infinity,
                ease: "easeOut",
                delay: seed1 * 0.5 + seed5 * 0.3,
                repeatDelay: 0.4 + seed5 * 0.8,
            };
            Component = <MercyLight color={color} size={size * 0.9} variant={variant % 3} />;
            break;
        }

        // ═══════════════════════════════════════════════════════════════
        // 🔥 천마신교/하북팽가 - 흑염/화염
        // 검은 불꽃 또는 맹렬한 호염
        // ═══════════════════════════════════════════════════════════════
        case '화염': {
            const isTiger = color.includes('D35400') || color.includes('E74C3C');
            const duration = 3.5 + seed1 * 2.5;
            const sway = 18 + seed2 * 30;
            // 화면 하단에서 시작 (85%~98%)
            const startTop = 88 + seed5 * 10;
            
            style = { left: `${spreadLeft}%`, top: `${startTop}%`, zIndex: 14 };
            animate = {
                y: ['0%', '-70vh'],
                x: [0, sway * (seed3 > 0.5 ? 1 : -1), -sway * 0.4 * (seed3 > 0.5 ? 1 : -1)],
                scale: [size * 0.3, size * 1.1, size * 0.15],
                opacity: [0, 0.6, 0.45, 0],
            };
            transition = {
                duration,
                repeat: Infinity,
                ease: "easeOut",
                delay: seed1 * 0.5 + seed4 * 0.3,
                repeatDelay: 0.3 + seed4 * 0.6,
            };
            Component = isTiger ? 
                <TigerFlame color={color} size={size * 0.9} id={uniqueId} /> :
                <DarkFlame color={color} size={size * 0.9} id={uniqueId} variant={variant % 3} />;
            break;
        }
        
        // ═══════════════════════════════════════════════════════════════
        // 🩸 혈교 - 혈요공
        // 피의 안개, 솟구치는 혈기
        // ═══════════════════════════════════════════════════════════════
        case '혈기': {
            const duration = 4 + seed1 * 3;
            const drift = 20 + seed2 * 35;
            // 화면 하단에서 시작 (85%~96%)
            const startTop = 88 + seed5 * 8;
            
            style = { left: `${spreadLeft}%`, top: `${startTop}%`, zIndex: 14 };
            animate = {
                y: ['0%', '-75vh'],
                x: [0, (seed3 - 0.5) * drift, (seed4 - 0.5) * drift * 1.05],
                scale: [size * 0.3, size * 1.2, size * 1.5],
                opacity: [0, 0.5, 0.3, 0],
            };
            transition = {
                duration,
                repeat: Infinity,
                ease: "easeOut",
                delay: seed1 * 0.5 + seed3 * 0.3,
                repeatDelay: 0.5 + seed5 * 1,
            };
            Component = <BloodMist color={color} size={size} id={uniqueId} variant={variant % 3} />;
            break;
        }
        
        // ═══════════════════════════════════════════════════════════════
        // 🧪 당가/청성 - 독기
        // 치명적인 녹색 독안개와 암기
        // ═══════════════════════════════════════════════════════════════
        case '독기': {
            // 청성파/당가: 음험하고 치명적인 독기
            const isNeedle = seed1 > 0.85;
            const duration = isNeedle ? (0.6 + seed2 * 0.3) : (3 + seed1 * 1.5);
            const startTop = isNeedle ? (70 + seed5 * 25) : (70 + seed5 * 25);
            
            if (isNeedle) {
                const angle = (seed2 - 0.5) * 35;
                style = { left: `${spreadLeft}%`, top: `${startTop}%`, zIndex: 15 };
                animate = {
                    y: ['0%', '-75vh'],
                    rotate: [angle, angle],
                    opacity: [0, 0.85, 0.75, 0],
                    scale: [0.5, 1.2, 0.8],
                };
            } else {
                const spread = 28 + seed2 * 40;
                style = { left: `${spreadLeft}%`, top: `${startTop}%`, zIndex: 14 };
                animate = {
                    y: ['0%', '-55vh'],
                    x: [0, (seed3 - 0.5) * spread, (seed4 - 0.5) * spread * 1.05],
                    scale: [0.3, 1, 1.4],
                    opacity: [0, 0.55, 0.4, 0],
                };
            }
            transition = {
                duration,
                repeat: Infinity,
                ease: "easeOut",
                delay: seed1 * 0.3 + seed2 * 0.2,
                repeatDelay: isNeedle ? (0.3 + seed5 * 0.5) : (0.4 + seed5 * 0.6),
            };
            Component = <PoisonCloud color={color} size={size} id={uniqueId} variant={isNeedle ? 1 : variant % 3} />;
            break;
        }
        
        // ═══════════════════════════════════════════════════════════════
        // 🍂 개방 - 항룡십팔장
        // 낙엽과 용의 장력
        // ═══════════════════════════════════════════════════════════════
        case '낙엽': {
            // 낙엽: 바람에 흩날리는 낙엽
            const duration = 4 + seed1 * 2.5;
            const sway = 50 + seed2 * 80;
            const startTop = -5 + seed5 * 10;
            
            style = { left: `${spreadLeft}%`, top: `${startTop}%`, zIndex: 14 };
            animate = {
                y: ['0%', '115vh'],
                x: [0, sway * 0.35 * (seed3 > 0.5 ? 1 : -1), -sway * 0.2 * (seed3 > 0.5 ? 1 : -1), sway * 0.15],
                rotate: [seed3 * 40, seed3 * 40 + (seed2 > 0.5 ? 320 : -320)],
                opacity: [0, 0.7, 0.65, 0.5, 0],
                scale: [0.7, 1.1, 1, 0.8],
            };
            transition = {
                duration,
                repeat: Infinity,
                ease: "linear",
                delay: seed1 * 0.6 + seed2 * 0.4,
                repeatDelay: 0.5 + seed4 * 1,
            };
            Component = <FallenLeaf color={color} size={size} variant={variant % 3} />;
            break;
        }
        
        // ═══════════════════════════════════════════════════════════════
        // 🌊 모용세가/수로채 - 물결
        // 이피지도, 유연한 수류
        // ═══════════════════════════════════════════════════════════════
        case '물결': {
            // 모용세가/수로채: 유연한 물결, 이피지도
            const duration = 3 + seed1 * 2;
            const drift = 80 + seed2 * 60;
            const startTop = 10 + seed2 * 70;
            
            style = { left: `${spreadLeft}%`, top: `${startTop}%`, zIndex: 12 };
            animate = {
                x: [0, drift],
                y: [0, (seed3 - 0.5) * 40, (seed4 - 0.5) * 30],
                opacity: [0, 0.55, 0.5, 0],
                scale: [0.6, 1.2, 1],
            };
            transition = {
                duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: seed1 * 0.5 + seed5 * 0.3,
                repeatDelay: 0.4 + seed5 * 0.8,
            };
            Component = <WaterRipple color={color} size={size * 0.9} id={uniqueId} />;
            break;
        }
        
        // ═══════════════════════════════════════════════════════════════
        // 🌟 공동파/제갈세가 - 성진
        // 팔괘 진법의 별빛
        // ═══════════════════════════════════════════════════════════════
        case '성진': {
            // 공동파/제갈세가: 별빛 진법
            const duration = 1.5 + seed1 * 1;
            const startTop = 8 + seed2 * 80;
            
            style = { left: `${spreadLeft}%`, top: `${startTop}%`, zIndex: 13 };
            animate = {
                scale: [0, size * 1, size * 0.8, size * 1.1, 0],
                opacity: [0, 0.75, 0.65, 0.7, 0],
                rotate: [0, 30 + seed3 * 20],
            };
            transition = {
                duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: seed1 * 0.4 + seed4 * 0.3,
                repeatDelay: 0.4 + seed3 * 0.8,
            };
            Component = <StarFormation color={color} size={size * 0.9} variant={variant % 3} />;
            break;
        }
        
        // ═══════════════════════════════════════════════════════════════
        // 🌬️ 사파연합 - 바람
        // 녹림의 거친 바람
        // ═══════════════════════════════════════════════════════════════
        case '바람': {
            // 바람: 빠르게 휴슬지나가는 바람
            const duration = 1.5 + seed1 * 1;
            const yDrift = 10 + seed2 * 20;
            const startTop = 5 + seed2 * 85;
            
            style = { left: '-10%', top: `${startTop}%`, zIndex: 12 };
            animate = {
                x: ['0%', '115vw'],
                y: [0, (seed3 - 0.5) * yDrift, (seed4 - 0.5) * yDrift],
                opacity: [0, 0.6, 0.55, 0],
                scale: [0.8, 1.2, 1],
            };
            transition = {
                duration,
                repeat: Infinity,
                ease: "linear",
                delay: seed1 * 0.4 + seed3 * 0.3,
                repeatDelay: 0.3 + seed5 * 0.6,
            };
            Component = <WindStream color={color} size={size * 0.95} id={uniqueId} />;
            break;
        }
        
        // ═══════════════════════════════════════════════════════════════
        // 🌫️ 하오문 - 안개
        // 정보의 안개
        // ═══════════════════════════════════════════════════════════════
        case '안개': {
            // 하오문: 은밀한 정보의 안개
            const duration = 4 + seed1 * 2.5;
            const drift = 50 + seed2 * 70;
            const startTop = 12 + seed2 * 65;
            
            style = { left: `${spreadLeft}%`, top: `${startTop}%`, zIndex: 11 };
            animate = {
                x: [0, drift * 0.5, drift],
                y: [0, (seed3 - 0.5) * 30, (seed4 - 0.5) * 45],
                scale: [0, size * 1.1, size * 1.7],
                opacity: [0, 0.4, 0.2, 0],
            };
            transition = {
                duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: seed1 * 0.5 + seed3 * 0.4,
                repeatDelay: 0.5 + seed5 * 1,
            };
            Component = <MistCloud color={color} size={size * 0.9} id={uniqueId} />;
            break;
        }
        
        // ═══════════════════════════════════════════════════════════════
        // 🗡️ 살수막 - 암영
        // 그림자 속의 암살
        // ═══════════════════════════════════════════════════════════════
        case '암영': {
            // 살수막: 그림자 속의 기습
            const duration = 1.2 + seed1 * 0.7;
            const startTop = 10 + seed2 * 78;
            
            style = { left: `${spreadLeft}%`, top: `${startTop}%`, zIndex: 12 };
            animate = {
                scale: [0, size * 1, size * 1.2, 0],
                opacity: [0, 0.65, 0.55, 0],
                rotate: [35, 35 + 60],
                x: [0, (seed3 - 0.5) * 20],
                y: [0, (seed4 - 0.5) * 20],
            };
            transition = {
                duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: seed1 * 0.5 + seed5 * 0.3,
                repeatDelay: 0.4 + seed5 * 0.8,
            };
            Component = <ShadowBlade color={color} size={size * 0.9} id={uniqueId} variant={variant % 3} />;
            break;
        }
        
        // ═══════════════════════════════════════════════════════════════
        // ❄️ 빙궁 - 빙설
        // 얼음 결정과 눈꽃
        // ═══════════════════════════════════════════════════════════════
        case '빙설': {
            // 빙궁: 차가운 눈꽃과 얼음 결정
            const duration = 4 + seed1 * 2.5;
            const sway = 40 + seed2 * 60;
            const startTop = -5 + seed5 * 10;
            
            style = { left: `${spreadLeft}%`, top: `${startTop}%`, zIndex: 13 };
            animate = {
                y: ['0%', '120vh'],
                x: [0, -sway * 0.35, -sway * 0.65, -sway * 0.95],
                rotate: [0, 200 * (seed3 > 0.5 ? 1 : -1)],
                opacity: [0, 0.7, 0.65, 0.5, 0],
                scale: [0.6, 1.1, 1, 0.8],
            };
            transition = {
                duration,
                repeat: Infinity,
                ease: "linear",
                delay: seed1 * 0.5 + seed3 * 0.4,
                repeatDelay: 0.5 + seed4 * 1,
            };
            Component = <IceCrystal color={color} size={size * 0.9} variant={variant % 3} />;
            break;
        }
        
        // ═══════════════════════════════════════════════════════════════
        // 🍂 개방 - 낙엽 (화산파 스타일)
        // 떠돌이 거지방의 자유로움, 바람에 흩날리는 낙엽처럼
        // ═══════════════════════════════════════════════════════════════
        case '항룡장기': {
            // 개방: 용의 기운이 담긴 낙엽
            const duration = 4 + seed1 * 3;
            const swayAmount = 90 + seed2 * 130;
            const rotationSpeed = seed3 > 0.5 ? 600 : -600;
            const startY = -(seed5 * 10 + 5);
            
            style = { left: `${spreadLeft}%`, top: `${startY}%`, zIndex: 14 };
            animate = {
                y: ['0%', '125vh'],
                x: [0, swayAmount * 0.45 * (seed3 > 0.5 ? 1 : -1), -swayAmount * 0.35, swayAmount * 0.25 * (seed3 > 0.5 ? 1 : -1)],
                rotate: [seed3 * 180, seed3 * 180 + rotationSpeed],
                opacity: [0, 0.8, 0.75, 0.55, 0],
                scale: [0.5, 1.2, 1.1, 0.6],
            };
            transition = {
                duration,
                repeat: Infinity,
                ease: "linear",
                delay: seed1 * 0.6 + seed2 * 0.4,
                repeatDelay: 0.4 + seed4 * 1,
            };
            Component = <FallingLeaf color={color} size={size} variant={variant} uniqueId={uniqueId} />;
            break;
        }
        
        // ═══════════════════════════════════════════════════════════════
        // 🐅 남만야수궁 - 야수의 기운
        // 야수의 눈, 발톱, 포효
        // ═══════════════════════════════════════════════════════════════
        case '야수기': {
            // 남만야수궁: 야수의 포효와 발톱
            const duration = 3 + seed1 * 2;
            const swayX = 45 + seed2 * 70;
            const startTop = 85 + seed5 * 12;
            
            style = { left: `${spreadLeft}%`, top: `${startTop}%`, zIndex: 15 };
            animate = {
                y: ['0%', '-110vh'],
                x: [0, swayX * (seed3 > 0.5 ? 1 : -1) * 0.8],
                opacity: [0, 0.9, 0.85, 0.55, 0],
                scale: [0.4, 1.3, 1, 0.35],
            };
            transition = {
                duration,
                repeat: Infinity,
                ease: [0.2, 0.8, 0.4, 1],
                delay: seed1 * 0.5 + seed2 * 0.3,
                repeatDelay: 0.4 + seed4 * 0.8,
            };
            Component = (
                <svg width={22 * size} height={18 * size} viewBox="0 0 44 36" style={{ filter: `drop-shadow(0 0 ${6 * size}px ${color})` }}>
                    {variant % 3 === 0 ? (
                        // 야수의 눈
                        <>
                            <defs>
                                <radialGradient id={`${uniqueId}-eye`} cx="50%" cy="50%" r="50%">
                                    <stop offset="0%" stopColor="#FFD700" stopOpacity="1" />
                                    <stop offset="30%" stopColor={color} stopOpacity="0.9" />
                                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                                </radialGradient>
                            </defs>
                            <ellipse cx="22" cy="18" rx="20" ry="14" fill={`url(#${uniqueId}-eye)`} />
                            <ellipse cx="22" cy="18" rx="4" ry="12" fill="#000" fillOpacity="0.8" />
                        </>
                    ) : variant % 3 === 1 ? (
                        // 발톱 자국
                        <>
                            <line x1="10" y1="0" x2="12" y2="36" stroke={color} strokeWidth="3" strokeOpacity="0.8" />
                            <line x1="22" y1="3" x2="22" y2="33" stroke={color} strokeWidth="3" strokeOpacity="0.7" />
                            <line x1="34" y1="0" x2="32" y2="36" stroke={color} strokeWidth="3" strokeOpacity="0.8" />
                        </>
                    ) : (
                        // 포효 파동
                        <>
                            <circle cx="22" cy="18" r="6" fill={color} fillOpacity="0.6" />
                            <circle cx="22" cy="18" r="12" fill="none" stroke={color} strokeWidth="2" strokeOpacity="0.4" />
                            <circle cx="22" cy="18" r="18" fill="none" stroke={color} strokeWidth="1.5" strokeOpacity="0.2" />
                        </>
                    )}
                </svg>
            );
            break;
        }
        
        // ═══════════════════════════════════════════════════════════════
        // 🌲 사파연합 - 녹림의 기세
        // 산적들의 거친 기운
        // ═══════════════════════════════════════════════════════════════
        case '녹림기': {
            // 사파연합: 녹림의 거친 기운
            const duration = 4.5 + seed1 * 3;
            const swayX = 60 + seed2 * 90;
            const startTop = -5 + seed5 * 10;
            
            style = { left: `${spreadLeft}%`, top: `${startTop}%`, zIndex: 13 };
            animate = {
                y: ['0%', '120vh'],
                x: [0, swayX * 0.35 * (seed3 > 0.5 ? 1 : -1), swayX * 0.65, swayX * 0.45],
                rotate: [0, 400 * (seed4 > 0.5 ? 1 : -1)],
                opacity: [0, 0.8, 0.7, 0.5, 0],
                scale: [0.7, 1.1, 1, 0.8],
            };
            transition = {
                duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: seed1 * 0.6 + seed3 * 0.4,
                repeatDelay: 0.5 + seed5 * 1,
            };
            Component = (
                <svg width={15 * size} height={20 * size} viewBox="0 0 30 40" style={{ filter: `drop-shadow(0 0 ${3 * size}px ${color}80)` }}>
                    {variant % 2 === 0 ? (
                        // 나뭇잎 (녹림)
                        <>
                            <path d="M15 0 Q25 15, 15 40 Q5 15, 15 0" fill={color} fillOpacity="0.7" />
                            <path d="M15 5 L15 35" stroke={color} strokeWidth="1" strokeOpacity="0.9" />
                        </>
                    ) : (
                        // 먼지
                        <>
                            <defs>
                                <radialGradient id={`${uniqueId}-dust`}>
                                    <stop offset="0%" stopColor={color} stopOpacity="0.5" />
                                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                                </radialGradient>
                            </defs>
                            <ellipse cx="15" cy="20" rx="14" ry="18" fill={`url(#${uniqueId}-dust)`} />
                        </>
                    )}
                </svg>
            );
            break;
        }
        
        // ═══════════════════════════════════════════════════════════════
        // 👤 은거기인 - 초월적 기운
        // 속세를 벗어난 신비로운 존재
        // ═══════════════════════════════════════════════════════════════
        case '초월기': {
            // 은거기인: 속세를 벗어난 신비로운 기운
            const duration = 5 + seed1 * 3;
            const centerX = 30 + seed1 * 40;
            const centerY = 20 + seed2 * 60;
            
            style = { left: `${centerX}%`, top: `${centerY}%`, zIndex: 12 };
            animate = {
                scale: [0, size * 1.3, size * 0.9],
                opacity: [0, 0.8, 0],
                rotate: [0, 200],
            };
            transition = {
                duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: seed3 * 0.8,
                repeatDelay: 0.8 + seed4 * 1.5,
            };
            Component = (
                <svg width={30 * size} height={30 * size} viewBox="0 0 60 60" style={{ filter: `drop-shadow(0 0 ${8 * size}px ${color})` }}>
                    {variant % 3 === 0 ? (
                        // 도(道)의 기운
                        <>
                            <defs>
                                <radialGradient id={`${uniqueId}-dao`} cx="50%" cy="50%" r="50%">
                                    <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
                                    <stop offset="50%" stopColor={color} stopOpacity="0.6" />
                                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                                </radialGradient>
                            </defs>
                            <circle cx="30" cy="30" r="28" fill={`url(#${uniqueId}-dao)`} />
                        </>
                    ) : variant % 3 === 1 ? (
                        // 기(氣)의 흐름
                        <>
                            <defs>
                                <linearGradient id={`${uniqueId}-qi`} x1="0%" y1="50%" x2="100%" y2="50%">
                                    <stop offset="0%" stopColor={color} stopOpacity="0" />
                                    <stop offset="50%" stopColor={color} stopOpacity="0.7" />
                                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <path d="M0 30 Q15 15, 30 30 T60 30" stroke={`url(#${uniqueId}-qi)`} strokeWidth="4" fill="none" />
                        </>
                    ) : (
                        // 선계(仙界)의 별
                        <>
                            <path d="M30 5 L32 25 L52 30 L32 35 L30 55 L28 35 L8 30 L28 25 Z" fill={color} fillOpacity="0.8" />
                            <circle cx="30" cy="30" r="5" fill="#fff" fillOpacity="0.9" />
                        </>
                    )}
                </svg>
            );
            break;
        }
        
        // ═══════════════════════════════════════════════════════════════
        // ⚖️ 관부 - 황권의 위엄
        // 황제의 권위와 금빛 광휘
        // ═══════════════════════════════════════════════════════════════
        case '황권': {
            // 관부: 황제의 권위와 금빛 광휘
            const duration = 5 + seed1 * 3;
            const startTop = 90 + seed5 * 8;
            
            style = { left: `${spreadLeft}%`, top: `${startTop}%`, zIndex: 14 };
            animate = {
                y: ['0%', '-105vh'],
                opacity: [0, 0.9, 0.85, 0.55, 0],
                scale: [0.3, 1.1, 0.9],
            };
            transition = {
                duration,
                repeat: Infinity,
                ease: "easeOut",
                delay: seed1 * 0.6 + seed2 * 0.4,
                repeatDelay: 0.6 + seed4 * 1.2,
            };
            Component = (
                <svg width={25 * size} height={30 * size} viewBox="0 0 50 60" style={{ filter: `drop-shadow(0 0 ${10 * size}px ${color})` }}>
                    {variant % 3 === 0 ? (
                        // 황룡 비늘
                        <>
                            <defs>
                                <linearGradient id={`${uniqueId}-scale`} x1="50%" y1="0%" x2="50%" y2="100%">
                                    <stop offset="0%" stopColor="#FFF" stopOpacity="0.8" />
                                    <stop offset="50%" stopColor={color} stopOpacity="0.9" />
                                    <stop offset="100%" stopColor="#B8860B" stopOpacity="0.7" />
                                </linearGradient>
                            </defs>
                            <path d="M25 0 L48 30 L25 60 L2 30 Z" fill={`url(#${uniqueId}-scale)`} />
                        </>
                    ) : variant % 3 === 1 ? (
                        // 옥새 형상
                        <>
                            <rect x="8" y="8" width="34" height="44" fill={color} fillOpacity="0.7" rx="4" />
                            <rect x="14" y="14" width="22" height="32" fill="none" stroke="#fff" strokeWidth="2" strokeOpacity="0.6" />
                        </>
                    ) : (
                        // 황제의 광휘
                        <>
                            <defs>
                                <radialGradient id={`${uniqueId}-radiance`} cx="50%" cy="50%" r="50%">
                                    <stop offset="0%" stopColor="#FFF" stopOpacity="0.9" />
                                    <stop offset="40%" stopColor={color} stopOpacity="0.7" />
                                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                                </radialGradient>
                            </defs>
                            <circle cx="25" cy="30" r="25" fill={`url(#${uniqueId}-radiance)`} />
                        </>
                    )}
                </svg>
            );
            break;
        }
        
        // ═══════════════════════════════════════════════════════════════
        // 🔥 천마신교 - 흑염
        // 마교의 검은 불꽃 (화염과 다른 색상)
        // ═══════════════════════════════════════════════════════════════
        case '흑염': {
            // 천마신교: 마교의 검은 불꽃
            const duration = 2.5 + seed1 * 1.5;
            const flickerX = 25 + seed2 * 40;
            const startTop = 90 + seed5 * 8;
            
            style = { left: `${spreadLeft}%`, top: `${startTop}%`, zIndex: 15 };
            animate = {
                y: ['0%', '-95vh'],
                x: [0, flickerX * 0.45 * (seed3 > 0.5 ? 1 : -1), flickerX * -0.35, flickerX * 0.25],
                scale: [0.4, 1.2, 0.9, 0.3],
                opacity: [0, 0.85, 0.75, 0.4, 0],
            };
            transition = {
                duration,
                repeat: Infinity,
                ease: "easeOut",
                delay: seed1 * 0.4 + seed4 * 0.3,
                repeatDelay: 0.3 + seed5 * 0.6,
            };
            Component = <DarkFlame color={color} size={size} id={uniqueId} variant={variant % 3} />;
            break;
        }
        
        // ═══════════════════════════════════════════════════════════════
        // 🎵 기타 - 수묵/음파
        // ═══════════════════════════════════════════════════════════════
        case '수묵':
        case '음파': {
            const duration = 5 + seed1 * 3;
            const drift = 60 + seed2 * 80;
            const startTop = 15 + seed2 * 65;
            
            style = { left: `${spreadLeft}%`, top: `${startTop}%` };
            animate = {
                x: [0, drift * 0.5, drift],
                y: [0, (seed3 - 0.5) * 30, (seed4 - 0.5) * 45],
                scale: [0, size * 1, size * 1.6],
                opacity: [0, 0.28, 0.12, 0],
                rotate: [0, seed5 * 25 - 12],
            };
            transition = {
                duration,
                repeat: Infinity,
                ease: "easeInOut",
                repeatDelay: 1 + seed5 * 2.5,
            };
            Component = <WaterRipple color={color} size={size * 0.8} id={uniqueId} />;
            break;
        }
        
        // ═══════════════════════════════════════════════════════════════
        // 기본
        // ═══════════════════════════════════════════════════════════════
        default: {
            const duration = 4 + seed1 * 2;
            const startTop = 15 + seed2 * 65;
            
            style = { left: `${spreadLeft}%`, top: `${startTop}%` };
            animate = {
                scale: [0, size * 0.85, size * 1.1],
                opacity: [0, 0.35, 0],
                x: [0, (seed3 - 0.5) * 30],
            };
            transition = {
                duration,
                repeat: Infinity,
                ease: "easeInOut",
                repeatDelay: 1 + seed4 * 2,
            };
            Component = <StarFormation color={color} size={size * 0.7} variant={0} />;
        }
    }
    
        // 모든 파티클에 staggerDelay를 추가하여 시작 시 불규칙하게 생성
        const existingDelay = typeof transition.delay === 'number' ? transition.delay : 0;
        const finalTransition = {
            ...transition,
            delay: existingDelay + staggerDelay,
        };
    
        return { Component, style, animate, transition: finalTransition };
    }, [effectType, color, seed1, seed2, seed3, seed4, seed5, seed6, spreadLeft, size, variant, uniqueId, staggerDelay]);
    
    // animate에 scale이 없으면 기본값 1 추가
    const finalAnimate = useMemo(() => {
        if (animate && !('scale' in animate)) {
            return { ...animate, scale: 1 };
        }
        return animate;
    }, [animate]);
    
    return (
        <motion.div
            style={{ position: 'absolute', ...style }}
            initial={{ opacity: 0, scale: 0 }}
            animate={finalAnimate as never}
            transition={transition as never}
        >
            {Component}
        </motion.div>
    );
});

Particle.displayName = 'Particle';

// ═══════════════════════════════════════════════════════════════════════════
// 메인 컴포넌트
// ═══════════════════════════════════════════════════════════════════════════

// effectType별 적정 파티클 수 (큰 파티클은 적게, 작은 파티클은 많게)
const getOptimalParticleCount = (effectType: string, requestedCount: number): number => {
    const limits: Record<string, number> = {
        // 작은 파티클 - 많아도 OK (꽃잎, 낙엽, 눈 등)
        '꽃잎': Math.min(requestedCount, 80),
        '항룡장기': Math.min(requestedCount, 60),
        '낙엽': Math.min(requestedCount, 60),
        '빙설': Math.min(requestedCount, 50),
        '녹림기': Math.min(requestedCount, 50),
        
        // 중간 크기 파티클
        '태극': Math.min(requestedCount, 40),
        '금광': Math.min(requestedCount, 35),
        '성진': Math.min(requestedCount, 35),
        '독기': Math.min(requestedCount, 40),
        '안개': Math.min(requestedCount, 30),
        '물결': Math.min(requestedCount, 35),
        '바람': Math.min(requestedCount, 30),
        '암영': Math.min(requestedCount, 25),
        '초월기': Math.min(requestedCount, 20),
        
        // 큰 파티클 - 적게 (검기, 화염 등)
        '사일검': Math.min(requestedCount, 30),
        '중검': Math.min(requestedCount, 25),
        '제왕검기': Math.min(requestedCount, 25),
        '명왕빛': Math.min(requestedCount, 30),
        '화염': Math.min(requestedCount, 35),
        '흑염': Math.min(requestedCount, 30),
        '혈기': Math.min(requestedCount, 30),
        '야수기': Math.min(requestedCount, 25),
        '황권': Math.min(requestedCount, 25),
        '운룡뇌전': Math.min(requestedCount, 30),
        '번개': Math.min(requestedCount, 30),
    };
    
    return limits[effectType] || Math.min(requestedCount, 40);
};

export default function VisualEngine({ effectType, particleCount = 50, color = "#fff" }: VisualEngineProps) {
    const [isMounted, setIsMounted] = useState(false);
    
    useEffect(() => {
        setIsMounted(true);
    }, []);
    
    // effectType에 따라 적정 파티클 수 계산
    const actualParticleCount = useMemo(() => {
        return getOptimalParticleCount(effectType, particleCount);
    }, [effectType, particleCount]);
    
    const particles = useMemo(() => {
        return Array.from({ length: actualParticleCount }, (_, i) => i);
    }, [actualParticleCount]);
    
    if (!isMounted) return null;
    
    return (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 10 }}>
            {particles.map((i) => (
                <Particle
                    key={`${effectType}-${i}`}
                    id={i}
                    effectType={effectType}
                    color={color}
                />
            ))}
        </div>
    );
}
