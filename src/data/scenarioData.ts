// 세력별 오프닝 시나리오 데이터

export type FactionKey = 'orthodox' | 'unorthodox' | 'demonic' | 'outer';
export type ParticleType = 'petals' | 'embers' | 'snow' | 'ink';
export type OverlayType = 'rain' | 'fog' | 'noise';

export interface StatusCondition {
  name: string;
  severity: 'normal' | 'warning' | 'critical';
}

export interface InitialStatus {
  identity: string;        // 신분
  alias: string;           // 별호
  realm: string;           // 경지
  conditions: StatusCondition[];  // 상태이상
  cultivation: {
    innerArt: string;      // 심법
    martialArt: string;    // 무공
    movement: string;      // 보법
  };
  inventory: {
    weapon: string;        // 무구
    items: string[];       // 소지품
  };
  vitality: number;        // 기혈 (0-100)
  innerPower: number;      // 내공 (0-100)
}

export interface VisualTheme {
  particle: ParticleType;
  bgImage: string;
  overlayType: OverlayType;
  ambientColor: string;    // 분위기 색상
}

export interface Scenario {
  title: string;
  location: string;
  description: string;
  initialStatus: InitialStatus;
  visualTheme: VisualTheme;
  openingLines: string[];  // 오프닝 대사/서술
}

export const FACTION_SCENARIOS: Record<FactionKey, Scenario> = {
  orthodox: {
    title: '위선의 단죄',
    location: '화산 북쪽 절벽',
    description: `하늘이 뚫린 듯 쏟아지는 폭우가 온 세상을 짓누르고 있었다. 
번개가 작렬하자, 칠흑 같은 어둠 속에 도열한 백의무복의 그림자들이 허옇게 드러났다. 
명문정파의 제자였던 그대는 사문의 어둠을 담은 장부 하나를 손에 쥔 채, 
스승과 형제들에게 역적으로 몰려 천 길 낭떠러지 앞에 서 있다.`,
    initialStatus: {
      identity: '파문 제자',
      alias: '무명(無名)',
      realm: '후천 초기',
      conditions: [
        { name: '단전파괴(丹田破壞)', severity: 'critical' },
        { name: '독 침투', severity: 'warning' },
      ],
      cultivation: {
        innerArt: '파손됨',
        martialArt: '기본검술',
        movement: '미숙',
      },
      inventory: {
        weapon: '이 빠진 철검',
        items: ['피 묻은 장부', '찢어진 의복'],
      },
      vitality: 25,
      innerPower: 5,
    },
    visualTheme: {
      particle: 'petals',
      bgImage: '/images/bg_orthodox.jpg',
      overlayType: 'rain',
      ambientColor: '#1a365d',
    },
    openingLines: [
      '우르릉, 쾅.',
      '고막을 찢는 뇌성과 함께 섬광이 작렬했다.',
      '빗물에 섞여 흐르는 것은 비릿한 핏물.',
      '단전이 산산조각 났다. 사문의 장로가 친히 하사했던 영약, 그 껍질을 뒤집어쓴 극독이 혈맥을 타고 번져나가고 있었다.',
      '',
      '【Ω:서술】 등 뒤에는 천 길 낭떠러지가 입을 벌리고 있다. 앞에는 한때 형제라 불렀던 자들의 살기가 서려 있다.',
      '',
      '【話:대사형】 "순순히 장부를 내놓고 자결하게. 그것이 자네가 사문을 위해 할 수 있는 마지막 속죄일세."',
    ],
  },

  unorthodox: {
    title: '토사구팽',
    location: '흑풍산채 폐허',
    description: `비는 축복처럼 내리지 않았다. 그것은 징벌이었다.
부서진 목책과 피로 물든 천막들 사이, 한때 의형제라 불렀던 자들이 굶주린 짐승처럼 번뜩이는 눈으로 둘러서 있다.
사파 연맹의 비서(秘書)를 손에 넣은 순간부터 그대는 먹잇감이 되었다.
이곳에서 약자는 뜯어 먹히고, 배신조차 생존의 증명이 된다.`,
    initialStatus: {
      identity: '산채 막내',
      alias: '무명(無名)',
      realm: '후천 초기',
      conditions: [
        { name: '탁기오염(濁氣汚染)', severity: 'warning' },
        { name: '기혈불안', severity: 'warning' },
      ],
      cultivation: {
        innerArt: '불순함',
        martialArt: '거친 도법',
        movement: '야생',
      },
      inventory: {
        weapon: '핏빛 비도',
        items: ['사파 혈서', '술병 조각'],
      },
      vitality: 40,
      innerPower: 30,
    },
    visualTheme: {
      particle: 'embers',
      bgImage: '/images/bg_unorthodox.jpg',
      overlayType: 'noise',
      ambientColor: '#742a2a',
    },
    openingLines: [
      '타닥, 타다닥.',
      '불타는 산채의 잔해에서 불씨가 튄다.',
      '진흙탕 위에 쓰러진 육신들은 이미 수차례 밟혀 형체를 알아보기 어렵다.',
      '',
      '【Ω:서술】 품속의 혈서는 축축하게 젖어 있으나, 손끝에 닿는 감각은 이상할 정도로 또렷했다. 종이 사이사이 스며든 핏자국이 아직도 미지근하다.',
      '',
      '【話:산채두목】 "하, 역시 네가 들고 튈 줄 알았다. 욕심이 크면 목숨이 짧아지는 법이지."',
      '',
      '【話:산채두목】 "순순히 내놔라. 그러면 시체는 온전히 남겨주지. 거절하면… 음, 네 팔다리가 먼저 흩어질 게다."',
    ],
  },

  demonic: {
    title: '혈마의 세례',
    location: '만마동 지하 제단',
    description: `단전이 끓었다. 강제로 주입된 혈기(血氣)가 경맥을 타고 역류하며 내장을 뒤틀었다.
제단 아래 수십 구의 육신이 쇠사슬에 묶여 늘어서 있고, 머릿속에서는 제물이 된 자들의 원념(怨念)이 혈기와 뒤섞여 의식 속으로 파고든다.
인간으로 남으려는 자는 제물이 되고, 괴물이 되기를 받아들인 자만이 살아남는 곳.
이것이 혈교(血敎)다.`,
    initialStatus: {
      identity: '혈교 수련생',
      alias: '무명(無名)',
      realm: '후천 초기',
      conditions: [
        { name: '혈기침식(血氣侵蝕)', severity: 'critical' },
        { name: '원념간섭', severity: 'warning' },
      ],
      cultivation: {
        innerArt: '혈마심법(미완)',
        martialArt: '불명',
        movement: '불명',
      },
      inventory: {
        weapon: '없음',
        items: ['쇠사슬 조각', '핏빛 가사 파편'],
      },
      vitality: 50,
      innerPower: 60,
    },
    visualTheme: {
      particle: 'embers',
      bgImage: '/images/bg_demonic.jpg',
      overlayType: 'fog',
      ambientColor: '#4a1a1a',
    },
    openingLines: [
      '쿵... 쿵... 쿵...',
      '심장 소리인지, 제단의 고동인지 분간이 되지 않는다.',
      '천장에서 핏방울이 뚝뚝 떨어진다. 제단 위 혈지에서 기포가 터지며 부글거리는 소리가 났다.',
      '',
      '【Ω:서술】 제단 위, 핏빛 가사를 두른 여인이 천천히 고개를 들었다. 눈동자가 없었다. 안구 전체가 검붉게 물들어, 두 개의 혈지를 박아 넣은 듯했다.',
      '',
      '【話:혈마】 "견디고 있구나. 흥미롭다."',
      '',
      '【話:혈마】 "네 안에 아직 \'사람\'이 남아 있어. 그것이 문제지. 혈교도가 되려면, 먼저 그것을 죽여야 한다."',
    ],
  },

  outer: {
    title: '빙원의 시련',
    location: '북해빙궁 외곽',
    description: `손끝이 얼어붙었다. 아니, 이미 감각이 없었다.
쇠사슬에 묶인 채 눈보라 속에 방치된 지 사흘째, 입술은 갈라졌고 피부는 새파랗게 질렸다.
중원에서 끌려온 포로들 사이에서, 새하얀 털가죽을 두른 북해빙궁의 전사들이 사냥감을 보는 눈빛으로 다가온다.
이곳에서 살아남으려면, 얼음보다 차가운 의지가 필요하다.`,
    initialStatus: {
      identity: '중원 포로',
      alias: '무명(無名)',
      realm: '후천 초기',
      conditions: [
        { name: '동상(凍傷)', severity: 'warning' },
        { name: '기력고갈', severity: 'warning' },
      ],
      cultivation: {
        innerArt: '잔존',
        martialArt: '기억 속에',
        movement: '둔화',
      },
      inventory: {
        weapon: '없음',
        items: ['쇠사슬', '찢어진 옷'],
      },
      vitality: 30,
      innerPower: 15,
    },
    visualTheme: {
      particle: 'snow',
      bgImage: '/images/bg_outer.jpg',
      overlayType: 'fog',
      ambientColor: '#1e3a5f',
    },
    openingLines: [
      '휘이이잉—',
      '날카로운 눈보라가 살갗을 바늘처럼 찔러댄다.',
      '주변에는 열 명 남짓한 포로들이 함께 묶여 있다. 어떤 이는 이미 숨이 끊겼고, 어떤 이는 헛소리를 중얼거린다.',
      '',
      '【Ω:서술】 멀리서 말발굽 소리가 들렸다. 새하얀 털가죽을 두른 거구의 사내들. 북해빙궁의 전사들이다. 그들의 눈빛은 차갑고 무자비했다.',
      '',
      '【話:빙여】 "아직 살아 있는 놈이 있구나."',
      '',
      '【話:빙여】 "중원의 개돼지들. 너희는 두 가지 선택이 있다. 빙궁의 노예가 되어 평생 얼음 광산을 파든가, 아니면 지금 여기서 얼어 죽든가."',
    ],
  },
};

// 유틸리티 함수
export function isValidFaction(faction: string): faction is FactionKey {
  return ['orthodox', 'unorthodox', 'demonic', 'outer'].includes(faction);
}

export function getFactionName(faction: FactionKey): string {
  const names: Record<FactionKey, string> = {
    orthodox: '정파',
    unorthodox: '사파',
    demonic: '마교',
    outer: '세외',
  };
  return names[faction];
}
