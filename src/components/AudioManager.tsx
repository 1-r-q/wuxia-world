"use client";

import React, { useEffect, useState, createContext, useContext, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { Howl, Howler } from 'howler';

// =====================================
// Web Audio API 기반 프로시저럴 사운드 엔진
// 실제 오디오 파일 없이도 무협 분위기의 사운드 생성
// =====================================

interface AudioContextType {
    playHover: () => void;
    playClick: () => void;
    playWhoosh: () => void;
    playImpact: () => void;
    playAmbient: (type: 'wind' | 'rain' | 'night' | 'temple') => void;
    stopAmbient: () => void;
    toggleMute: () => void;
    isMuted: boolean;
    isAudioEnabled: boolean;
    enableAudio: () => void;
    
    // BGM 관련
    bgmVolume: number;
    setBgmVolume: (vol: number) => void;
    isBgmPlaying: boolean;
    toggleBgm: () => void;
}

const AudioContext = createContext<AudioContextType>({
    playHover: () => {},
    playClick: () => {},
    playWhoosh: () => {},
    playImpact: () => {},
    playAmbient: () => {},
    stopAmbient: () => {},
    toggleMute: () => {},
    isMuted: false,
    isAudioEnabled: false,
    enableAudio: () => {},
    
    // BGM 초기값
    bgmVolume: 0.3,
    setBgmVolume: () => {},
    isBgmPlaying: false,
    toggleBgm: () => {},
});

export const useAudio = () => useContext(AudioContext);

// 사운드 생성 클래스
class ProceduralSoundEngine {
    private audioCtx: AudioContext | null = null;
    private masterGain: GainNode | null = null;
    private ambientNodes: OscillatorNode[] = [];
    private ambientGains: GainNode[] = [];
    
    constructor() {
        if (typeof window !== 'undefined') {
            this.initAudio();
        }
    }
    
    initAudio() {
        if (this.audioCtx) return;
        try {
            this.audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
            this.masterGain = this.audioCtx.createGain();
            this.masterGain.connect(this.audioCtx.destination);
            this.masterGain.gain.value = 0.3;
        } catch (e) {
            console.warn('Web Audio API not supported');
        }
    }
    
    resume() {
        if (this.audioCtx?.state === 'suspended') {
            this.audioCtx.resume();
        }
    }
    
    setMute(muted: boolean) {
        if (this.masterGain) {
            this.masterGain.gain.value = muted ? 0 : 0.3;
        }
    }
    
    // 호버 효과음 - 부드러운 종소리 같은 톤
    playHover() {
        if (!this.audioCtx || !this.masterGain) return;
        
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        const filter = this.audioCtx.createBiquadFilter();
        
        osc.type = 'sine';
        osc.frequency.value = 800 + Math.random() * 200;
        
        filter.type = 'highpass';
        filter.frequency.value = 500;
        
        gain.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.1);
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        
        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.15);
    }
    
    // 클릭 효과음 - 목탁 소리 같은 임팩트
    playClick() {
        if (!this.audioCtx || !this.masterGain) return;
        
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, this.audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, this.audioCtx.currentTime + 0.05);
        
        gain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.1);
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        
        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.15);
    }
    
    // 휘파람/바람 소리 - 검 휘두르는 효과
    playWhoosh() {
        if (!this.audioCtx || !this.masterGain) return;
        
        const noise = this.createNoise();
        const filter = this.audioCtx.createBiquadFilter();
        const gain = this.audioCtx.createGain();
        
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1000, this.audioCtx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(3000, this.audioCtx.currentTime + 0.1);
        filter.frequency.exponentialRampToValueAtTime(500, this.audioCtx.currentTime + 0.3);
        filter.Q.value = 1;
        
        gain.gain.setValueAtTime(0, this.audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.2, this.audioCtx.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.3);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        
        noise.start();
        noise.stop(this.audioCtx.currentTime + 0.35);
    }
    
    // 충격음 - 둔탁한 타격
    playImpact() {
        if (!this.audioCtx || !this.masterGain) return;
        
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, this.audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, this.audioCtx.currentTime + 0.1);
        
        gain.gain.setValueAtTime(0.4, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.15);
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        
        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.2);
    }
    
    // 노이즈 생성기
    private createNoise(): AudioBufferSourceNode {
        if (!this.audioCtx) throw new Error('AudioContext not initialized');
        
        const bufferSize = this.audioCtx.sampleRate * 0.5;
        const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        const source = this.audioCtx.createBufferSource();
        source.buffer = buffer;
        return source;
    }
    
    // 앰비언트 사운드
    playAmbient(type: 'wind' | 'rain' | 'night' | 'temple') {
        this.stopAmbient();
        if (!this.audioCtx || !this.masterGain) return;
        
        // 타입별 주파수 설정
        const settings = {
            wind: { freqs: [80, 120, 200], volume: 0.05 },
            rain: { freqs: [1000, 2000, 4000], volume: 0.03 },
            night: { freqs: [200, 400, 600], volume: 0.02 },
            temple: { freqs: [300, 600, 900], volume: 0.03 },
        };
        
        const { freqs, volume } = settings[type];
        
        freqs.forEach(freq => {
            const osc = this.audioCtx!.createOscillator();
            const gain = this.audioCtx!.createGain();
            const lfo = this.audioCtx!.createOscillator();
            const lfoGain = this.audioCtx!.createGain();
            
            osc.type = type === 'rain' ? 'sawtooth' : 'sine';
            osc.frequency.value = freq;
            
            lfo.type = 'sine';
            lfo.frequency.value = 0.1 + Math.random() * 0.2;
            lfoGain.gain.value = freq * 0.1;
            
            lfo.connect(lfoGain);
            lfoGain.connect(osc.frequency);
            
            gain.gain.value = volume;
            
            osc.connect(gain);
            gain.connect(this.masterGain!);
            
            osc.start();
            lfo.start();
            
            this.ambientNodes.push(osc, lfo);
            this.ambientGains.push(gain);
        });
    }
    
    stopAmbient() {
        this.ambientNodes.forEach(node => {
            try { node.stop(); } catch {}
        });
        this.ambientNodes = [];
        this.ambientGains = [];
    }

    // 리소스 정리 메서드 추가
    dispose() {
        this.stopAmbient();
        if (this.audioCtx && this.audioCtx.state !== 'closed') {
            try { this.audioCtx.close(); } catch {}
        }
        this.audioCtx = null;
        this.masterGain = null;
    }
}

export default function AudioManager({ children }: { children: React.ReactNode }) {
    const [isMuted, setIsMuted] = useState(false);
    const [isAudioEnabled, setIsAudioEnabled] = useState(false);
    
    // BGM 상태 - 기본 볼륨 20%로 설정
    const [bgmVolume, setBgmVolumeState] = useState(0.2);
    const [isBgmPlaying, setIsBgmPlaying] = useState(false);
    const bgmRef = useRef<Howl | null>(null);
    
    // SFX 상태
    const hoverSfxRef = useRef<Howl | null>(null);
    const clickSfxRef = useRef<Howl | null>(null);

    const soundEngine = useRef<ProceduralSoundEngine | null>(null);
    const pathname = usePathname();

    // 사운드 엔진 초기화
    useEffect(() => {
        soundEngine.current = new ProceduralSoundEngine();
        
        // Howler 전역 설정
        Howler.autoUnlock = true;

        // BGM 로드 (이전 인스턴스 정리를 통해 안전성 확보)
        if (bgmRef.current) {
            bgmRef.current.unload();
        }

        // Web Audio API 사용으로 HTML5 Audio Pool 제한 회피
        bgmRef.current = new Howl({
            src: ['/audio/bgm/BGM.mp3'], // public 폴더 경로
            html5: false, 
            loop: true,
            volume: 0, // 페이드인을 위해 0으로 시작
            autoplay: false,
            onloaderror: (id, err) => console.error('BGM Load Error:', err)
        });
        
        // SFX 로드 - hover
        hoverSfxRef.current = new Howl({
            src: ['/audio/sfx/hover.mp3'],
            html5: false,
            volume: 0.25,
            preload: true,
        });
        
        // SFX 로드 - click
        clickSfxRef.current = new Howl({
            src: ['/audio/sfx/click.wav'],
            html5: false,
            volume: 0.15,
            preload: true,
        });
        
        return () => {
            soundEngine.current?.dispose();
            bgmRef.current?.unload();
            hoverSfxRef.current?.unload();
            clickSfxRef.current?.unload();
        };
    }, []);

    // 페이지 변경 시 앰비언트 사운드 변경 (비활성화 - 오실레이터 사운드가 불쾌함)
    // useEffect(() => {
    //     if (!isAudioEnabled || isMuted) return;
    //     
    //     if (pathname.includes('/factions/')) {
    //         soundEngine.current?.playAmbient('temple');
    //     } else if (pathname === '/') {
    //         soundEngine.current?.playAmbient('wind');
    //     } else if (pathname.includes('/characters')) {
    //         soundEngine.current?.playAmbient('night');
    //     }
    //     
    //     return () => {
    //         soundEngine.current?.stopAmbient();
    //     };
    // }, [pathname, isAudioEnabled, isMuted]);

    // 오디오 활성화 시 BGM 재생
    useEffect(() => {
        if (isAudioEnabled && !isMuted && bgmRef.current) {
            if (!bgmRef.current.playing()) {
                bgmRef.current.play();
                bgmRef.current.fade(0, bgmVolume, 2000);
                setIsBgmPlaying(true);
            }
        }
    }, [isAudioEnabled]); // isMuted는 아래 별도 이펙트에서 처리

    // 전체 음소거 처리
    useEffect(() => {
        Howler.mute(isMuted);
    }, [isMuted]);

    // BGM 볼륨 조절
    const setBgmVolume = useCallback((vol: number) => {
        setBgmVolumeState(vol);
        if (bgmRef.current) {
            bgmRef.current.volume(vol);
        }
    }, []);

    // BGM 토글
    const toggleBgm = useCallback(() => {
        if (!bgmRef.current) return;
        
        if (isBgmPlaying) {
            bgmRef.current.pause();
            setIsBgmPlaying(false);
        } else {
            bgmRef.current.play();
            bgmRef.current.fade(0, bgmVolume, 500);
            setIsBgmPlaying(true);
        }
    }, [isBgmPlaying, bgmVolume]);

    const enableAudio = useCallback(() => {
        if (!isAudioEnabled) {
            // SoundEngine Context Resume
            soundEngine.current?.initAudio();
            soundEngine.current?.resume();
            
            // Howler Context Resume (if suspended)
            if (Howler.ctx && Howler.ctx.state === 'suspended') {
                Howler.ctx.resume();
            }

            setIsAudioEnabled(true);
        }
    }, [isAudioEnabled]);

    const toggleMute = useCallback(() => {
        setIsMuted(prev => {
            const next = !prev;
            soundEngine.current?.setMute(next);
            if (next) {
                soundEngine.current?.stopAmbient();
            }
            return next;
        });
    }, []);

    const playHover = useCallback(() => {
        if (!isMuted && isAudioEnabled && hoverSfxRef.current) {
            hoverSfxRef.current.play();
        }
    }, [isMuted, isAudioEnabled]);

    const playClick = useCallback(() => {
        if (!isMuted && isAudioEnabled && clickSfxRef.current) {
            clickSfxRef.current.play();
        }
    }, [isMuted, isAudioEnabled]);

    const playWhoosh = useCallback(() => {
        if (!isMuted && isAudioEnabled) {
            soundEngine.current?.playWhoosh();
        }
    }, [isMuted, isAudioEnabled]);

    const playImpact = useCallback(() => {
        if (!isMuted && isAudioEnabled) {
            soundEngine.current?.playImpact();
        }
    }, [isMuted, isAudioEnabled]);

    const playAmbient = useCallback((type: 'wind' | 'rain' | 'night' | 'temple') => {
        if (!isMuted && isAudioEnabled) {
            soundEngine.current?.playAmbient(type);
        }
    }, [isMuted, isAudioEnabled]);

    const stopAmbient = useCallback(() => {
        soundEngine.current?.stopAmbient();
    }, []);

    return (
        <AudioContext.Provider value={{ 
            playHover, 
            playClick, 
            playWhoosh,
            playImpact,
            playAmbient,
            stopAmbient,
            toggleMute, 
            isMuted,
            isAudioEnabled,
            enableAudio,
            // BGM 값 전달
            bgmVolume,
            setBgmVolume,
            isBgmPlaying,
            toggleBgm
        }}>
            {children}
            
            {/* 오디오 활성화 프롬프트 (첫 인터랙션 필요) */}
            {!isAudioEnabled && (
                <button 
                    onClick={enableAudio}
                    className="fixed bottom-8 right-8 z-50 px-4 py-3 rounded-lg bg-black/70 border border-white/20 text-white hover:bg-white/10 transition-colors backdrop-blur-md text-sm flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                    음향 활성화
                </button>
            )}
            
            {/* 음소거 토글 버튼 */}
            {isAudioEnabled && (
                <button 
                    onClick={toggleMute}
                    className="fixed bottom-8 right-8 z-50 p-4 rounded-full bg-black/50 border border-white/20 text-white hover:bg-white/10 transition-colors backdrop-blur-md"
                    title={isMuted ? '소리 켜기' : '소리 끄기'}
                >
                    {isMuted ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        </svg>
                    )}
                </button>
            )}
        </AudioContext.Provider>
    );
}
