"use client";

import { useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";

const MainMenu = dynamic(() => import("@/components/MainMenu"), {
  ssr: false,
  loading: () => null
});

const IntroSelection = dynamic(() => import("@/components/IntroSelection"), {
  ssr: false,
  loading: () => null
});

const OrthodoxSelection = dynamic(() => import("@/components/OrthodoxSelection"), {
  ssr: false
});

const MainLobby = dynamic(() => import("@/components/MainLobby"), {
  ssr: false
});

const RealmsPage = dynamic(() => import("@/components/RealmsPage"), {
  ssr: false
});

// 화면 상태 타입
type ScreenState = 
  | { screen: 'landing' }
  | { screen: 'main-menu' }
  | { screen: 'intro' }
  | { screen: 'orthodox-selection' }
  | { screen: 'lobby'; group: string; subGroup?: string }
  | { screen: 'realms' };

// URL 파라미터를 읽어서 초기 화면 상태를 결정하는 훅
function useInitialScreen(
  setScreenState: (state: ScreenState) => void,
  setSkipIntro: (skip: boolean) => void,
  setHasSeenLanding: (seen: boolean) => void
) {
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const seen = localStorage.getItem('introSeen') === 'true';
    setHasSeenLanding(seen);
    
    // URL 쿼리 파라미터로 초기 화면 설정 (faction 상세에서 돌아올 때)
    const screenParam = searchParams.get('screen');
    const groupParam = searchParams.get('group');
    const subGroupParam = searchParams.get('subGroup');
    
    if (screenParam === 'lobby' && groupParam) {
      setSkipIntro(true);
      setScreenState({ 
        screen: 'lobby', 
        group: groupParam,
        subGroup: subGroupParam || undefined
      });
    } else if (screenParam === 'orthodox-selection') {
      setSkipIntro(true);
      setScreenState({ screen: 'orthodox-selection' });
    } else if (seen) {
      setScreenState({ screen: 'main-menu' });
    }
  }, [searchParams, setScreenState, setSkipIntro, setHasSeenLanding]);
}

// useSearchParams를 사용하는 내부 컴포넌트
function HomeContent() {
  const [screenState, setScreenState] = useState<ScreenState>({ screen: 'landing' });
  const [skipIntro, setSkipIntro] = useState(false);
  const [hasSeenLanding, setHasSeenLanding] = useState(false);
  
  // Suspense 내부에서 useSearchParams 사용
  useInitialScreen(setScreenState, setSkipIntro, setHasSeenLanding);

  // 랜딩 인트로 완료 시 (IntroSelection의 입장 버튼)
  const handleLandingEnter = () => {
    setHasSeenLanding(true);
    setScreenState({ screen: 'main-menu' });
  };

  // 메인 메뉴에서 세력 또는 경지 선택
  const handleNavigate = (destination: 'factions' | 'realms') => {
    if (destination === 'factions') {
      setScreenState({ screen: 'intro' });
    } else if (destination === 'realms') {
      setScreenState({ screen: 'realms' });
    }
  };

  // IntroSelection에서 세력 선택
  const handleSelectGroup = (group: string) => {
    if (group === 'orthodox') {
      // 정파 선택 시 구파일방/오대세가 선택 화면으로
      setScreenState({ screen: 'orthodox-selection' });
    } else {
      // 다른 세력은 바로 로비로
      setScreenState({ screen: 'lobby', group });
    }
  };

  // OrthodoxSelection에서 서브그룹 선택
  const handleSelectOrthodoxSubGroup = (subGroup: 'gupaeilbang' | 'odaesega') => {
    setScreenState({ screen: 'lobby', group: 'orthodox', subGroup });
  };

  // OrthodoxSelection에서 뒤로가기
  const handleBackFromOrthodox = () => {
    setSkipIntro(true);
    setScreenState({ screen: 'intro' });
  };

  // MainLobby에서 뒤로가기
  const handleBackFromLobby = () => {
    if (screenState.screen === 'lobby' && screenState.group === 'orthodox') {
      // 정파 로비에서는 구파일방/오대세가 선택으로 돌아감
      setScreenState({ screen: 'orthodox-selection' });
    } else {
      // 다른 세력 로비에서는 인트로 선택으로 돌아감
      setSkipIntro(true);
      setScreenState({ screen: 'intro' });
    }
  };

  // 경지 페이지에서 뒤로가기
  const handleBackFromRealms = () => {
    setScreenState({ screen: 'main-menu' });
  };

  // IntroSelection에서 홈버튼 클릭 시 (메인 메뉴로)
  const handleBackToMainMenu = () => {
    setScreenState({ screen: 'main-menu' });
  };

  return (
    <main className="relative w-full min-h-screen min-h-[100dvh] overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        {screenState.screen === 'landing' && !hasSeenLanding && (
          <IntroSelection
            key="landing"
            onSelectGroup={() => {}} // 랜딩 모드에서는 사용 안함
            isLandingMode={true}
            onLandingEnter={handleLandingEnter}
          />
        )}
        {screenState.screen === 'main-menu' && (
          <MainMenu
            key="main-menu"
            onNavigate={handleNavigate}
          />
        )}
        {screenState.screen === 'intro' && (
          <IntroSelection 
            key="intro" 
            onSelectGroup={handleSelectGroup} 
            skipIntro={skipIntro}
            onBackToMain={handleBackToMainMenu}
          />
        )}
        {screenState.screen === 'orthodox-selection' && (
          <OrthodoxSelection
            key="orthodox-selection"
            onSelectSubGroup={handleSelectOrthodoxSubGroup}
            onBack={handleBackFromOrthodox}
          />
        )}
        {screenState.screen === 'lobby' && (
          <MainLobby 
            key="lobby" 
            group={screenState.group} 
            subGroup={screenState.subGroup}
            onBack={handleBackFromLobby} 
          />
        )}
        {screenState.screen === 'realms' && (
          <RealmsPage
            key="realms"
            onBack={handleBackFromRealms}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

// 메인 컴포넌트 - Suspense로 감싸기
export default function Home() {
  return (
    <Suspense fallback={<div className="w-full h-screen bg-black" />}>
      <HomeContent />
    </Suspense>
  );
}