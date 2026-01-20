"use client";

import React, { useEffect, useState } from 'react';
import { useAudio } from './AudioManager';

export function BgmController() {
    const { 
        isAudioEnabled, 
        enableAudio,
        bgmVolume, 
        setBgmVolume, 
        isBgmPlaying, 
        toggleBgm,
    } = useAudio();

    const [isExpanded, setIsExpanded] = useState(false);

    // 모바일에서 외부 클릭 시 슬라이더 닫기
    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest('[data-bgm-controller]')) {
                setIsExpanded(false);
            }
        };
        
        document.addEventListener('click', handleOutsideClick);
        document.addEventListener('touchstart', handleOutsideClick);
        
        return () => {
            document.removeEventListener('click', handleOutsideClick);
            document.removeEventListener('touchstart', handleOutsideClick);
        };
    }, []);

    // 페이지 진입 시 첫 클릭/터치로 오디오 자동 활성화
    useEffect(() => {
        const handleFirstInteraction = () => {
            if (!isAudioEnabled) {
                enableAudio();
            }
            document.removeEventListener('click', handleFirstInteraction);
            document.removeEventListener('touchstart', handleFirstInteraction);
            document.removeEventListener('keydown', handleFirstInteraction);
        };

        document.addEventListener('click', handleFirstInteraction);
        document.addEventListener('touchstart', handleFirstInteraction);
        document.addEventListener('keydown', handleFirstInteraction);

        return () => {
            document.removeEventListener('click', handleFirstInteraction);
            document.removeEventListener('touchstart', handleFirstInteraction);
            document.removeEventListener('keydown', handleFirstInteraction);
        };
    }, [isAudioEnabled, enableAudio]);
    
    const handlePlayToggle = () => {
        if (!isAudioEnabled) {
            enableAudio();
        } else {
            toggleBgm();
        }
    };

    return (
        <div 
            data-bgm-controller
            style={{
                position: 'fixed',
                bottom: '16px',
                left: '70px',
                zIndex: 9999,
            }}
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
            onClick={(e) => e.stopPropagation()}
        >
            {/* 미니멀 컨테이너 */}
            <div 
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 10px',
                    background: 'rgba(12, 10, 9, 0.85)',
                    borderRadius: '4px',
                    border: '1px solid rgba(120, 53, 15, 0.4)',
                    backdropFilter: 'blur(8px)',
                    transition: 'all 0.2s ease',
                    opacity: isExpanded ? 1 : 0.6,
                }}
            >
                {/* 재생/정지 버튼 */}
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        // 모바일: 터치하면 슬라이더 토글
                        if ('ontouchstart' in window) {
                            setIsExpanded(!isExpanded);
                        }
                        handlePlayToggle();
                    }}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        border: 'none',
                        background: isBgmPlaying ? 'rgba(217, 119, 6, 0.3)' : 'rgba(168, 162, 158, 0.2)',
                        color: isBgmPlaying ? '#fbbf24' : '#a8a29e',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                    }}
                >
                    {isBgmPlaying ? (
                        <div style={{ display: 'flex', gap: '2px' }}>
                            <div style={{ width: '2px', height: '10px', background: 'currentColor', borderRadius: '1px' }} />
                            <div style={{ width: '2px', height: '10px', background: 'currentColor', borderRadius: '1px' }} />
                        </div>
                    ) : (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: '2px' }}>
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    )}
                </button>

                {/* 볼륨 슬라이더 (호버/터치 시 확장) */}
                <div 
                    style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px',
                        overflow: 'hidden',
                        width: isExpanded ? '80px' : '0px',
                        opacity: isExpanded ? 1 : 0,
                        transition: 'all 0.2s ease',
                    }}
                >
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={bgmVolume}
                        onChange={(e) => setBgmVolume(parseFloat(e.target.value))}
                        style={{
                            width: '60px',
                            height: '3px',
                            cursor: 'pointer',
                            accentColor: '#d97706',
                        }}
                    />
                    <span style={{ 
                        fontSize: '10px', 
                        color: '#a8a29e',
                        minWidth: '24px',
                    }}>
                        {Math.round(bgmVolume * 100)}
                    </span>
                </div>

                {/* 음표 아이콘 (확장 아닐 때만) */}
                {!isExpanded && (
                    <span style={{ fontSize: '10px', color: '#78350f' }}>♪</span>
                )}
            </div>
        </div>
    );
}