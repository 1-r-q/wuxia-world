// 캐릭터 데이터 - 캐릭터 설정집 기반
// 경지: 현경 > 화경 > 초절정 > 절정 > 1류 > 2류 > 3류

export type Realm = "현경" | "화경" | "초절정" | "절정" | "1류" | "2류" | "3류";
export type FactionCategory = "orthodox" | "unorthodox" | "demonic" | "outer" | "hidden" | "imperial";

export interface Character {
  id: string;
  name: string;
  title: string;
  factionId: string;        // factions.ts의 id와 연결
  factionCategory: FactionCategory;
  position: string;         // 방장, 장문인, 가주, 교주 등
  realm: Realm;
  rank: "S" | "A" | "B" | "C" | "D";
  image?: string;
  gallery?: string[];       // 갤러리 이미지 배열 (추가 이미지들)
  appearance: string;       // 외형 설명
  story: string;           // 서사/배경
  combatStyle: string;     // 무공 유도/전투 스타일
  stats: {
    martial: number;       // 무공 (0-100)
    internal: number;      // 내공 (0-100)
    agility: number;       // 경공 (0-100)
    intelligence: number;  // 지력 (0-100)
  };
  skills: string[];        // 주요 무공/기술
}

// 경지별 기본 스탯 범위
const REALM_STATS: Record<Realm, { min: number; max: number }> = {
  "현경": { min: 95, max: 100 },
  "화경": { min: 88, max: 96 },
  "초절정": { min: 78, max: 90 },
  "절정": { min: 65, max: 80 },
  "1류": { min: 50, max: 68 },
  "2류": { min: 35, max: 52 },
  "3류": { min: 20, max: 38 },
};

// 경지별 등급 매핑
const REALM_TO_RANK: Record<Realm, Character["rank"]> = {
  "현경": "S",
  "화경": "S",
  "초절정": "A",
  "절정": "B",
  "1류": "C",
  "2류": "D",
  "3류": "D",
};

// 표정/상태 라벨 (1~29번)
export const EXPRESSION_LABELS: string[] = [
  "기본", "미소", "폭소", "흥미", "자신감",
  "피로", "부끄러움", "당황", "설렘", "유혹",
  "장난", "질투", "의심", "경멸", "짜증",
  "분노", "위협", "전투 태세", "놀람", "공포",
  "고통", "슬픔", "오열", "절망", "복종", "안기",
  "절기", "오의", "극의"
];

// 갤러리 이미지 배열 생성 헬퍼 함수
const generateGallery = (prefix: string, count: number = 29): string[] => {
  return Array.from({ length: count }, (_, i) => `/images/characters/${prefix}_${i + 1}.png`);
};

// ==================== 1. 구파일방 (정파) ====================

// [A] 소림사
export const SHAOLIN_CHARACTERS: Character[] = [
  {
    id: "myoyeon",
    name: "묘연",
    title: "자비의 명왕",
    factionId: "shaolin",
    factionCategory: "orthodox",
    position: "방장",
    realm: "화경",
    rank: "S",
    image: "/images/characters/A1_1.png",
    gallery: generateGallery("A1"),
    appearance: "깨달음을 얻어 육체의 시간을 되돌린, 성스러운 소녀 외모의 고승. 낡았지만 티끌 하나 없는 회색 승복과 목에 건 거대한 강철 염주가 특징. 눈을 감고 있어도 모든 것을 꿰뚫어 보는 듯한 '심안(心眼)'의 소유자.",
    story: "과거 정마대전 당시 홀로 마교의 선봉대를 막아낸 전설적인 인물. 겉으로는 자비롭고 온화해 보이나, 불도를 어지럽히는 존재에게는 명왕(明王)의 분노를 보인다. 그녀의 자비는 '고통 없는 죽음'으로 구현되기도 한다.",
    combatStyle: "황금빛 압력으로 형상화되는 내공. 손바닥을 내미는 것만으로 공간이 찌그러지는 듯한 중압감. 직접적인 타격보다는 거대한 부처의 손바닥이 덮치거나, 염주알 하나하나가 포탄처럼 쏟아지는 묵직하고 절대적인 '여래(如來)'의 힘.",
    stats: { martial: 94, internal: 98, agility: 85, intelligence: 96 },
    skills: ["나한복마진", "여래신장", "금강불괴체", "염주살"]
  },
  {
    id: "beopjeong",
    name: "법정",
    title: "철벽계율",
    factionId: "shaolin",
    factionCategory: "orthodox",
    position: "계율원 수좌",
    realm: "초절정",
    rank: "A",
    image: "/images/characters/A2_1.png",
    gallery: generateGallery("A2"),
    appearance: "머리를 삭발하고 근육질의 탄탄한 몸을 가진 무승. 쇠로 만든 무거운 지팡이(항마곤)를 한 손으로 가볍게 돌린다. 항상 미간을 찌푸린 엄격한 표정.",
    story: "소림의 규율을 담당하는 '살아있는 법전'. 타협을 모르며, 사파의 무리에게 극도의 혐오감을 드러낸다. '불심으로 널 교화하겠다'라고 말하며 뼈를 부러뜨리는 물리적 교화 방식을 선호한다.",
    combatStyle: "금강(金剛)의 단단함이 핵심. 어떤 공격을 받아도 쇳소리가 나며 튕겨 나가는 신체 능력. 단순하지만 파괴적인 곤봉술, 땅을 부수고 충격파를 일으키는 물리적 파괴력.",
    stats: { martial: 88, internal: 85, agility: 72, intelligence: 70 },
    skills: ["금강불괴", "항마곤법", "대력금강장", "천근추"]
  },
];

// [B] 무당파
export const WUDANG_CHARACTERS: Character[] = [
  {
    id: "cheongso",
    name: "청소",
    title: "태극진인",
    factionId: "wudang",
    factionCategory: "orthodox",
    position: "장문인",
    realm: "화경",
    rank: "S",
    image: "/images/characters/B1_1.png",
    gallery: generateGallery("B1"),
    appearance: "백발을 곱게 빗어 넘긴 도사. 흑백이 조화된 도복 소매는 바람이 없어도 일렁인다. 손에는 부드러운 먼지떨이(불진)를 들고 있다.",
    story: "속세의 욕망을 초월한 신선 같은 존재. 싸움보다는 차 한 잔의 여유를 즐기지만, 강호의 균형이 무너지는 것을 막기 위해 움직인다. 그녀의 말은 선문답처럼 알쏭달쏭하지만, 그 속에 날카로운 통찰이 담겨 있다.",
    combatStyle: "흐름과 역이용. 상대의 강한 힘을 부드럽게 감싸서 엉뚱한 방향으로 흘려보내거나, 되돌려주는 '유능제강(柔能制剛)'. 물, 구름, 태극의 이미지.",
    stats: { martial: 90, internal: 96, agility: 92, intelligence: 95 },
    skills: ["태극검법", "양의검법", "사량발천근", "순수무애"]
  },
  {
    id: "soyul",
    name: "소율",
    title: "서릿발 검녀",
    factionId: "wudang",
    factionCategory: "orthodox",
    position: "장로",
    realm: "초절정",
    rank: "A",
    image: "/images/characters/B2_1.png",
    gallery: generateGallery("B2"),
    appearance: "차가운 인상의 젊은 도녀. 흐트러짐 없는 자세와 서릿발 같은 눈빛. 푸른빛이 감도는 검을 애용한다.",
    story: "장문인의 자유분방함과 달리 규칙과 원칙을 중시한다. 감정을 배제하고 임무를 수행하는 것을 미덕으로 여긴다. 그녀의 주변 온도는 항상 낮으며, 말수가 적고 필요한 말만 한다.",
    combatStyle: "절제된 원(圓)과 냉기. 검으로 원을 그려 절대적인 방어막을 형성하거나, 빈틈을 파고드는 예리한 찌르기. 검기가 지나간 자리에 서리가 내리는 냉기 표현.",
    stats: { martial: 85, internal: 88, agility: 82, intelligence: 78 },
    skills: ["무당검법", "진무진기", "빙심결", "태극순환검"]
  },
];

// [C] 화산파
export const HWASAN_CHARACTERS: Character[] = [
  {
    id: "maehwa",
    name: "매화",
    title: "매화여제",
    factionId: "hwasan",
    factionCategory: "orthodox",
    position: "장문인",
    realm: "화경",
    rank: "S",
    image: "/images/characters/C1_1.png",
    gallery: generateGallery("C1"),
    appearance: "붉은 매화가 수놓아진 화려한 장포를 걸친 여제(女帝) 스타일. 우아한 미소 뒤에 오만함이 숨어 있다. 긴 머리에는 매화 가지 모양의 비녀를 꽂았다.",
    story: "몰락해가던 화산을 다시 중원 제일 검문으로 일으켜 세운 입지전적인 인물. 화산의 자존심 그 자체이며, 화산을 무시하는 자는 그 누구도 살려두지 않는다. 아름다움 속에 가려진 잔혹함이 그녀의 본질.",
    combatStyle: "화려한 환영과 개화(開花). 검을 휘두르면 시야가 붉은 매화 꽃잎으로 가득 차며, 그 꽃잎 하나하나가 칼날이 되어 베고 지나가는 환상적인 검무.",
    stats: { martial: 95, internal: 90, agility: 93, intelligence: 88 },
    skills: ["매화검법", "낙영신검", "만화분분", "매화이십사수"]
  },
  {
    id: "baekryeon",
    name: "백련",
    title: "자하대협",
    factionId: "hwasan",
    factionCategory: "orthodox",
    position: "대협",
    realm: "초절정",
    rank: "A",
    image: "/images/characters/C2_1.png",
    gallery: generateGallery("C2"),
    appearance: "활동적인 무복에 머리를 높게 묶은 열혈 검사. 눈빛이 살아있고 호탕하게 웃는다. 정의감에 불타는 전형적인 협객의 모습.",
    story: "세상의 부조리를 참지 못해 뛰쳐나온 화산의 검. 복잡한 정치 싸움보다는 눈앞의 악을 베는 것을 선호한다. 강한 상대를 만나면 오히려 투지를 불태우며 성장하는 타입.",
    combatStyle: "직선적인 돌파와 자줏빛 기운. 복잡한 기교보다는 정면 승부를 선호하며, 검 끝에 보랏빛 서기(자하신공)를 맺혀 단단한 것도 베어버리는 쾌검과 중검의 조화.",
    stats: { martial: 86, internal: 82, agility: 85, intelligence: 72 },
    skills: ["자하신공", "화산검법", "자하비검", "낙영검"]
  },
];

// [D] 아미파
export const AMI_CHARACTERS: Character[] = [
  {
    id: "myeoljeol",
    name: "멸절",
    title: "의천검모",
    factionId: "ami",
    factionCategory: "orthodox",
    position: "장문인",
    realm: "초절정",
    rank: "A",
    image: "/images/characters/D1_1.png",
    gallery: generateGallery("D1"),
    appearance: "세월조차 비켜간, 얼음처럼 차갑고 도도한 냉미녀. 회색 승복을 입었지만 살기는 장군보다 더하다. 전설의 보검 '의천검'을 들고 있다.",
    story: "과거 정인에게 배신당한 후 극단적인 남성 혐오증을 갖게 되었다. 그녀에게 사내란 베어내야 할 번뇌이자 악이다. 제자들에게도 감정을 죽일 것을 강요하며, 목적을 위해서라면 수단과 방법을 가리지 않는다.",
    combatStyle: "소멸과 절단. 의천검의 특성을 살려, 닿는 모든 것(무기, 갑옷, 내공)을 두부 자르듯 베어버리는 절대적인 절삭력. 자비나 망설임 없이 급소를 노리는 파괴적인 검로.",
    stats: { martial: 89, internal: 80, agility: 78, intelligence: 82 },
    skills: ["멸절검법", "의천검결", "금정옥쇄", "불심참마"]
  },
  {
    id: "jiseon",
    name: "지선",
    title: "보살의선",
    factionId: "ami",
    factionCategory: "orthodox",
    position: "장로",
    realm: "절정",
    rank: "B",
    image: "/images/characters/D2_1.png",
    gallery: generateGallery("D2"),
    appearance: "선녀처럼 고운 외모와 부드러운 미소를 가진 여인. 치료 도구와 침통을 항상 휴대한다.",
    story: "멸절 사태의 폭주를 중재하는 유일한 인물. 겉으로는 치유를 담당하는 성녀 같지만, 사실 인체 구조를 누구보다 잘 알기에 가장 고통스럽게 죽이는 법도 알고 있다. '아프지 않게 해줄게'라는 말은 안락사를 의미하기도 한다.",
    combatStyle: "부드러움 속의 가시. 솜처럼 부드러운 장법(면장)으로 내부 장기를 파열시키거나, 치료용 금침을 암기처럼 날려 혈도를 제압하는 정교한 기술.",
    stats: { martial: 70, internal: 78, agility: 72, intelligence: 85 },
    skills: ["구양신공", "면장", "금침술", "혈도제압"]
  },
];

// [E] 곤륜파
export const KUNLUN_CHARACTERS: Character[] = [
  {
    id: "unhui",
    name: "운희",
    title: "뇌룡여왕",
    factionId: "kunlun",
    factionCategory: "orthodox",
    position: "장문인",
    realm: "화경",
    rank: "S",
    image: "/images/characters/E1_1.png",
    gallery: generateGallery("E1"),
    appearance: "높은 깃의 도복과 화려한 장신구로 치장한 여왕. 내려다보는 시선이 자연스럽다.",
    story: "중원과 떨어진 곤륜산맥의 고고함을 대변한다. 중원 무림인들을 '속물'이라 부르며 무시한다. 자신이 하늘(신선)에 가장 가까운 존재라 믿으며, 그 오만함을 뒷받침하는 압도적인 무력을 지녔다.",
    combatStyle: "뇌전과 용의 형상. 검이나 소매에서 번개를 부르거나, 기운이 용처럼 휘감아 치솟는 거대하고 압도적인 스케일의 무공. 하늘에서 내려찍는 듯한 상하 수직적인 공격.",
    stats: { martial: 92, internal: 94, agility: 88, intelligence: 86 },
    skills: ["곤륜검법", "뇌룡십이식", "뇌전검", "천룡강림"]
  },
  {
    id: "wola",
    name: "월아",
    title: "월영자객",
    factionId: "kunlun",
    factionCategory: "orthodox",
    position: "장로",
    realm: "초절정",
    rank: "A",
    image: "/images/characters/E2_1.png",
    gallery: generateGallery("E2"),
    appearance: "검은 복면과 야행복을 입은 자객 스타일. 존재감이 희미하고 발소리가 나지 않는다. 차가운 단검 두 자루를 쓴다.",
    story: "곤륜의 어두운 일을 처리하는 그림자. 감정이 거의 거세되어 있으며, 임무 완수를 최우선으로 한다. 달이 뜨는 밤에 더욱 강해진다는 소문이 있다.",
    combatStyle: "은신과 기습. 정면 대결보다는 그림자 속으로 사라졌다가 사각지대에서 나타나는 신출귀몰한 움직임, 소리 없이 목을 긋는 간결하고 치명적인 암살 기술.",
    stats: { martial: 82, internal: 75, agility: 92, intelligence: 78 },
    skills: ["월영암살술", "쌍단검", "월영보", "야하술"]
  },
];

// [F] 점창파
export const JEOMCHANG_CHARACTERS: Character[] = [
  {
    id: "geumhwa",
    name: "금화",
    title: "취선검",
    factionId: "jeomchang",
    factionCategory: "orthodox",
    position: "장문인",
    realm: "초절정",
    rank: "A",
    image: "/images/characters/F1_1.png",
    gallery: generateGallery("F1"),
    appearance: "항상 술병을 끼고 사는 취객. 풀어헤친 옷깃과 붉게 상기된 얼굴, 헝클어진 머리가 특징.",
    story: "'취하면 세상이 더 잘 보인다'라고 주장하는 괴짜. 격식을 싫어하고 호탕하지만, 술이 깨면 금단증상으로 손을 떤다. 전투 중에도 술을 마시며, 예측할 수 없는 행동으로 상대를 당황하게 한다.",
    combatStyle: "비틀거림 속의 예리함. 몸을 가누지 못하는 척하다가 갑자기 찌르고 들어오는 변칙적인 궤도(취검). 검 끝이 수십 개로 갈라져 보이거나 흔들리는 듯한 환각적인 쾌검.",
    stats: { martial: 85, internal: 78, agility: 88, intelligence: 75 },
    skills: ["취검", "점창일검법", "몽롱검법", "취팔선"]
  },
  {
    id: "sinhye",
    name: "신혜",
    title: "계산검녀",
    factionId: "jeomchang",
    factionCategory: "orthodox",
    position: "장로",
    realm: "절정",
    rank: "B",
    image: "/images/characters/F2_1.png",
    gallery: generateGallery("F2"),
    appearance: "안경을 쓰고 주판이나 장부를 들고 다니는 지적인 여인. 차갑고 계산적인 눈빛.",
    story: "금화가 저지른 사고를 수습하고 점창파의 살림을 책임지는 실질적인 운영자. 모든 것을 수치와 이득으로 계산하며, 싸움조차 확률 싸움으로 접근한다.",
    combatStyle: "예측과 궤적 계산. '3초 후 너의 오른쪽 어깨가 빈다'는 식으로 상대를 분석하고, 미리 그 위치에 공격(철선이나 붓)을 갖다 대는 지능적인 전투 방식.",
    stats: { martial: 68, internal: 72, agility: 70, intelligence: 92 },
    skills: ["철선비술", "계산검법", "예측보법", "점혈술"]
  },
];

// [G] 공동파
export const KONGDONG_CHARACTERS: Character[] = [
  {
    id: "yuseong",
    name: "유성",
    title: "철권왕",
    factionId: "kongdong",
    factionCategory: "orthodox",
    position: "장문인",
    realm: "초절정",
    rank: "A",
    image: "/images/characters/G1_1.png",
    gallery: generateGallery("G1"),
    appearance: "구릿빛 피부에 단단한 근육질의 무인. 양손에 묵직한 청동 권갑을 끼고 있다.",
    story: "'무인이 쇠붙이에 의지하다니 부끄러운 줄 알아라.' 오직 단련된 육체만이 진정한 무기라 믿는 권왕(拳王). 공동파의 칠상권을 극한까지 수련하여 바위도 가루로 만든다.",
    combatStyle: "칠상권(七傷拳). 주먹을 내지를 때마다 공기가 찢어지는 파열음과 함께, 맞은 부위가 아니라 그 내부의 장기가 뒤틀리는 내부 파괴.",
    stats: { martial: 88, internal: 82, agility: 78, intelligence: 70 },
    skills: ["칠상권", "청동권갑술", "붕산쇄석", "내장파열권"]
  },
  {
    id: "yeona",
    name: "연아",
    title: "소나기권녀",
    factionId: "kongdong",
    factionCategory: "orthodox",
    position: "장로",
    realm: "절정",
    rank: "B",
    image: "/images/characters/G2_1.png",
    gallery: generateGallery("G2"),
    appearance: "화려한 짧은 개량 한복과 양갈래 머리. 하얀 비단으로 만든 백화수갑을 낀 작고 귀여운 소녀. 윙크가 습관이다.",
    story: "'내 주먹 맛 좀 볼래?♡' 귀여운 외모로 방심을 유도한 뒤, 명치나 인중 같은 급소만 골라 때리는 소악마. 타격 리듬을 타며 춤추듯 싸운다.",
    combatStyle: "리듬과 연타. 마치 춤을 추듯 가볍고 변칙적인 스텝으로 상대의 품속을 파고드는 초근접 속도전. 눈에 보이지 않을 정도로 빠르게 쏟아붓는 소나기 펀치.",
    stats: { martial: 75, internal: 70, agility: 85, intelligence: 68 },
    skills: ["소나기연타", "백화수갑술", "급소타격", "무영난무"]
  },
];

// [H] 청성파
export const CHEONGSEONG_CHARACTERS: Character[] = [
  {
    id: "cheongya",
    name: "청야",
    title: "청운검선",
    factionId: "cheongseong",
    factionCategory: "orthodox",
    position: "장문인",
    realm: "초절정",
    rank: "A",
    image: "/images/characters/H1_1.png",
    gallery: generateGallery("H1"),
    appearance: "푸른 도포를 입은 고고한 도녀. 하지만 눈빛에는 감출 수 없는 탐욕이 서려 있다. 청강검을 들고 있다.",
    story: "겉으로는 정파의 도리를 논하지만, 뒤로는 각종 이권에 개입하는 위선자. 청성파의 쾌검(快劍)은 빠르기로 유명하지만, 그녀의 검에는 비열한 암수가 섞여 있다.",
    combatStyle: "청운검법(靑雲劍法). 푸른 구름처럼 우아하게 검을 휘두르다, 상대의 사각지대에서 독사처럼 찔러 들어오는 변칙적인 쾌검.",
    stats: { martial: 82, internal: 80, agility: 85, intelligence: 88 },
    skills: ["청운검법", "쾌검술", "암수변검", "이권장악"]
  },
  {
    id: "unseo",
    name: "운서",
    title: "독톱검녀",
    factionId: "cheongseong",
    factionCategory: "orthodox",
    position: "장로",
    realm: "절정",
    rank: "B",
    image: "/images/characters/H2_1.png",
    gallery: generateGallery("H2"),
    appearance: "핏기 없는 창백한 피부에 다크서클이 내려온 병약하고 퇴폐적인 미녀. 혀를 내밀고 있으며, 톱니처럼 날이 선 독검을 질질 끌고 다닌다. 녹색 독액이 뚝뚝 떨어진다.",
    story: "'아프지? 더 비명 질러봐, 예쁘게.' 고통을 주는 것을 사랑한다. 채찍 대신 톱날 같은 검으로 상대를 천천히 썰어버리는 것을 즐긴다.",
    combatStyle: "톱질과 부식. 검을 휘두르는 것이 아니라, 상대의 살에 박아 넣고 톱질하듯 당기는 잔혹한 동작. 상처 부위가 녹색으로 변하며 거품이 일고, 살이 녹아내리는 맹독의 부식 효과.",
    stats: { martial: 72, internal: 75, agility: 70, intelligence: 78 },
    skills: ["톱날독검술", "맹독부식", "고통연장", "천천히썰기"]
  },
];

// [I] 종남파
export const JONGNAM_CHARACTERS: Character[] = [
  {
    id: "jinsan",
    name: "진산",
    title: "천하대검",
    factionId: "jongnam",
    factionCategory: "orthodox",
    position: "장문인",
    realm: "초절정",
    rank: "A",
    image: "/images/characters/I1_1.png",
    gallery: generateGallery("I1"),
    appearance: "여인이라 믿기 힘들 정도의 거구와 근육질 몸매. 자신의 키만 한 거대한 대검(Great Sword)을 등 뒤에 메고 있다. 표정은 바위처럼 단단하고 무뚝뚝하다.",
    story: "'기교는 힘을 이길 수 없다'는 신념의 화신. 종남의 잃어버린 영광을 되찾기 위해, 화려함(화산파)을 배격하고 묵직한 정공법을 택했다. 그녀가 서 있는 자리는 성벽과도 같아서, 그 누구도 그녀를 밀어낼 수 없다.",
    combatStyle: "압도적인 질량과 파괴. 검을 휘두른다기보다, '공간을 짓누른다'는 느낌. 단순한 내려치기 한 방에 대지가 갈라지고 충격파가 발생하는 묵직한 중량감.",
    stats: { martial: 90, internal: 85, agility: 60, intelligence: 65 },
    skills: ["천하대검술", "중검술", "붕산열지", "철벽진"]
  },
  {
    id: "seolhwa",
    name: "설화",
    title: "연검시녀",
    factionId: "jongnam",
    factionCategory: "orthodox",
    position: "장로",
    realm: "절정",
    rank: "B",
    image: "/images/characters/I2_1.png",
    gallery: generateGallery("I2"),
    appearance: "보호 본능을 자극하는 가녀린 문학소녀. 안경을 쓰고 책을 읽고 있지만, 소매 속에는 뱀처럼 휘어지는 연검이 숨겨져 있다.",
    story: "'검은 시(詩)와 같아요. 흐름이 중요하죠.' 얌전해 보이지만, 검을 잡으면 춤추듯 우아하게 사람을 벤다. 종남의 '천하삼십육검'을 가장 아름답게 펼친다.",
    combatStyle: "곡선의 미학. 검이 뼈가 없는 것처럼 휘어져 상대의 칼을 감아버리거나, 방패 뒤의 사각지대를 파고드는 예측 불가능한 궤적. 마치 구름이나 안개(운해)가 피어오르듯 부드럽지만, 벗어날 수 없는 포위망.",
    stats: { martial: 72, internal: 76, agility: 82, intelligence: 88 },
    skills: ["연검술", "연사검", "운운무영", "착사검"]
  },
];

// [J] 개방
export const GAEBANG_CHARACTERS: Character[] = [
  {
    id: "hongryeon",
    name: "홍련",
    title: "거지여왕",
    factionId: "gaebang",
    factionCategory: "orthodox",
    position: "방주",
    realm: "화경",
    rank: "S",
    image: "/images/characters/J1_1.png",
    gallery: generateGallery("J1"),
    appearance: "넝마를 걸쳤으나 그 안에 감춰진 기세는 왕보다 당당한 '거지 여왕'. 헝클어진 머리에 붉은 술기운이 도는 얼굴, 호탕한 웃음소리가 트레이드마크. 항상 허리춤에 호리병을 차고 있다.",
    story: "강호의 모든 거지를 자매로 여기는 의리의 화신. 격식과 위선을 혐오하며, 배가 고프면 뺏어 먹고 배가 부르면 노래를 부른다. 맨손으로 용을 때려잡는다는 소문이 돌 만큼 무식하게 강하다.",
    combatStyle: "용의 형상과 폭발. 장풍을 내지르면 황금색 용의 형상이 튀어나와 적을 삼키는 장엄한 연출(항룡십팔장). 타구봉을 쓸 때는 취한 듯 비틀거리면서도 정수리를 정확히 가격하는 반전 매력.",
    stats: { martial: 92, internal: 90, agility: 85, intelligence: 78 },
    skills: ["항룡십팔장", "타구봉법", "천하무적취권", "용형장"]
  },
  {
    id: "soso",
    name: "소소",
    title: "정보여정",
    factionId: "gaebang",
    factionCategory: "orthodox",
    position: "장로",
    realm: "초절정",
    rank: "A",
    image: "/images/characters/J2_1.png",
    gallery: generateGallery("J2"),
    appearance: "볼에 묻은 검댕이조차 매력 포인트인, 귀여운 톰보이(여동생) 스타일. 품속에는 온갖 잡동사니와 훔친 물건들이 들어있다. 돈 냄새를 기가 막히게 맡는다.",
    story: "개방의 정보망을 총괄하는 실세. 돈만 주면 황제의 속옷 색깔도 알아온다는 정보상이다. 어리고 약해 보이지만, 생존 본능과 잔머리는 타의 추종을 불허한다.",
    combatStyle: "비열함과 도구 활용. 정정당당한 무공보다는 눈에 흙 뿌리기, 정강이 차기, 돌멩이 던지기(만천화우) 등을 사용. 작고 빠른 몸집을 이용해 적의 다리 사이로 빠져나가거나 옷을 잡아당겨 넘어뜨리는 식의 교란 전법.",
    stats: { martial: 65, internal: 60, agility: 92, intelligence: 95 },
    skills: ["만천화우", "도주술", "정보수집", "소소암기"]
  },
];

// ==================== 2. 오대세가 ====================

// [K] 남궁세가
export const NAMGUNG_CHARACTERS: Character[] = [
  {
    id: "namgunghyeon",
    name: "남궁현",
    title: "패왕검존",
    factionId: "namgung",
    factionCategory: "orthodox",
    position: "가주",
    realm: "현경",
    rank: "S",
    image: "/images/characters/K1_1.png",
    gallery: generateGallery("K1"),
    appearance: "황금색 갑옷과 화려한 비단옷을 입은 여황제. 턱을 치켜들고 상대를 내려다보는 오만한 눈빛. 그녀의 주변에는 항상 정전기가 인다.",
    story: "'천하의 중심은 남궁이다.' 태어날 때부터 지배자로 키워졌다. 자신의 권위에 도전하는 자는 가문 단위로 멸망시킨다. 그녀의 검은 왕의 권위를 상징하며, 절대적인 복종을 요구한다.",
    combatStyle: "뇌전(번개)과 제왕의 기세. 검을 뽑는 순간 하늘에서 마른번개가 치거나, 대기가 짓눌려 숨을 쉬기 힘든 패왕색(覇王色). 기술 하나하나가 화려하고 거대하며, 적을 '베는' 게 아니라 '징벌'하는 느낌.",
    stats: { martial: 96, internal: 94, agility: 88, intelligence: 90 },
    skills: ["패왕검법", "창궁무애검", "뇌전검결", "천자강림"]
  },
  {
    id: "namgungrin",
    name: "남궁린",
    title: "빙심검녀",
    factionId: "namgung",
    factionCategory: "orthodox",
    position: "장로",
    realm: "초절정",
    rank: "A",
    image: "/images/characters/K2_1.png",
    gallery: generateGallery("K2"),
    appearance: "안경을 쓴 차가운 지성미의 여인. 푸른색 정장을 연상케 하는 단정한 무복. 표정 변화가 거의 없다.",
    story: "가문의 살림과 전략을 담당하는 냉철한 참모. 감정을 불필요한 소모품으로 여긴다. 그녀의 계산 속에서 적은 이미 죽어있는 상태다. 언니인 남궁현을 보좌하지만, 때로는 그녀보다 더 무서운 존재.",
    combatStyle: "냉기와 이기어검. 손을 대지 않고 검을 허공에 띄워 조종하거나(심검), 검기가 닿는 모든 것을 얼려버리는 빙공(氷功). 빠르고 효율적이며 군더더기 없는 살상력.",
    stats: { martial: 86, internal: 88, agility: 82, intelligence: 95 },
    skills: ["이기어검", "빙심검법", "심검술", "냉기결계"]
  },
  {
    id: "namgungmi",
    name: "남궁미",
    title: "금수아가",
    factionId: "namgung",
    factionCategory: "orthodox",
    position: "애기씨",
    realm: "1류",
    rank: "C",
    image: "/images/characters/K3_1.png",
    gallery: generateGallery("K3"),
    appearance: "온몸을 명품과 보석으로 치장한 철부지 아가씨. 핑크색 검집에 담긴 검을 패션 아이템처럼 들고 다닌다.",
    story: "'우리 엄마가 누군지 알아?!'를 입에 달고 사는 철없는 사고뭉치. 실력은 평범하지만 가문의 위세와 좋은 명검(보구의 위력)으로 밀어붙인다. 자존심이 상하면 울면서 난동을 부린다.",
    combatStyle: "화려함과 낭비. 내공을 비효율적으로 쏟아부어 겉보기엔 번쩍거리고 요란하지만, 실속은 부족한 검격. 기술을 쓸 때마다 기술 이름을 아주 길고 거창하게 외친다.",
    stats: { martial: 55, internal: 52, agility: 60, intelligence: 45 },
    skills: ["황금검법", "찬란한빛검무", "명검위력"]
  },
];

// [L] 사천당가
export const SACHEON_CHARACTERS: Character[] = [
  {
    id: "dangbi",
    name: "당비",
    title: "독화요희",
    factionId: "sacheon",
    factionCategory: "orthodox",
    position: "가주",
    realm: "초절정",
    rank: "A",
    image: "/images/characters/L1_1.png",
    gallery: generateGallery("L1"),
    appearance: "치명적인 매력을 풍기는 팜므파탈. 녹색과 보라색이 섞인 드레스, 그리고 길게 기른 날카로운 손톱이 특징.",
    story: "'아름다운 꽃엔 독이 있는 법.' 독을 예술의 경지로 승격시켰다고 자부한다. 그녀의 손길이 닿은 사람은 황홀경 속에서 녹아내린다. 사람을 실험 재료로 보며, 새로운 독을 만드는 것에 집착한다.",
    combatStyle: "광역 살포와 부식. 소매를 떨치면 색색의 독안개가 피어오르거나, 수천 개의 바늘이 비처럼 쏟아지는(만천화우) 장관. 닿는 순간 피부가 끓어오르거나 뼈가 검게 변하는 독의 효과.",
    stats: { martial: 78, internal: 85, agility: 80, intelligence: 92 },
    skills: ["만천화우", "독화술", "부식독공", "천독백해"]
  },
  {
    id: "dangyu",
    name: "당유",
    title: "무영살수",
    factionId: "sacheon",
    factionCategory: "orthodox",
    position: "장로",
    realm: "절정",
    rank: "B",
    image: "/images/characters/L2_1.png",
    gallery: generateGallery("L2"),
    appearance: "존재감이 희미한, 가면을 쓴 암살자. 짙은 녹색의 야행복을 입고 있으며 그림자와 구분되지 않는다.",
    story: "당가의 어둠. 가문의 적을 소리 소문 없이 제거하는 유령. 말을 거의 하지 않으며, 그녀가 모습을 드러내는 건 상대가 죽기 직전뿐이다.",
    combatStyle: "무형과 궤적의 휨. 던진 비도가 허공에서 갑자기 사라지거나, 물리적으로 불가능한 각도로 휘어지는(유도탄) 기술. 정면보다는 항상 등 뒤나 사각지대에서 나타나는 공포감.",
    stats: { martial: 75, internal: 70, agility: 88, intelligence: 80 },
    skills: ["유도비도", "은신술", "암살술", "무음보"]
  },
  {
    id: "danga",
    name: "당아",
    title: "폭발광녀",
    factionId: "sacheon",
    factionCategory: "orthodox",
    position: "소가주",
    realm: "1류",
    rank: "C",
    image: "/images/characters/L3_1.png",
    gallery: generateGallery("L3"),
    appearance: "펑퍼짐한 작업복에 고글을 쓴 매드 사이언티스트 소녀. 머리는 항상 헝클어져 있고, 손에는 정체불명의 액체가 든 병을 들고 낄낄거린다.",
    story: "전통적인 독보다는 폭약과 화학약품에 미쳐있는 괴짜. '폭발은 예술이야!'라고 외치며 가문의 건물을 몇 번이나 날려 먹었다. 그녀의 주머니는 걸어 다니는 화약고다.",
    combatStyle: "폭발과 화학 반응. 독병을 던져 연쇄 폭발을 일으키거나, 바닥에 산성 용액을 뿌려 녹이는 등 테러리스트에 가까운 전투 방식. 예측 불가능한 도구(연막탄, 섬광탄) 활용.",
    stats: { martial: 50, internal: 55, agility: 65, intelligence: 88 },
    skills: ["폭발술", "연쇄폭발", "화학병기", "연막탄"]
  },
];

// [M] 하북팽가
export const HABUK_CHARACTERS: Character[] = [
  {
    id: "paengwol",
    name: "팽월",
    title: "패도여장부",
    factionId: "habuk",
    factionCategory: "orthodox",
    position: "가주",
    realm: "화경",
    rank: "S",
    image: "/images/characters/M1_1.png",
    gallery: generateGallery("M1"),
    appearance: "일반 남성보다 머리 하나는 더 큰 거구의 여장부. 호랑이 가죽을 어깨에 걸치고, 거대한 청룡언월도를 한 손으로 든다. 근육이 갑옷처럼 단단하다.",
    story: "'팽가의 여자는 눈물 대신 피를 흘린다.' 힘의 논리를 숭상하며, 복잡한 계략을 혐오한다. 호탕하고 단순하지만, 아군에게는 든든한 큰언니. 식사량이 어마어마하다.",
    combatStyle: "회전과 분쇄. 언월도를 풍차처럼 돌려 다가오는 화살이나 적을 갈아버리거나, 도끼질하듯 내려찍어 투구째로 쪼개버리는 괴력. 기술명도 '호랑이', '분쇄', '파괴' 같은 직관적인 단어.",
    stats: { martial: 94, internal: 88, agility: 75, intelligence: 65 },
    skills: ["청룡언월도법", "호랑이분쇄격", "회전참", "대지분쇄"]
  },
  {
    id: "paengyeon",
    name: "팽연",
    title: "쌍도여장",
    factionId: "habuk",
    factionCategory: "orthodox",
    position: "장로",
    realm: "초절정",
    rank: "A",
    image: "/images/characters/M2_1.png",
    gallery: generateGallery("M2"),
    appearance: "온몸에 흉터가 가득한 실전형 군인. 쌍도(Dual Sabers)를 사용하며, 눈매가 매섭다.",
    story: "전장에서 잔뼈가 굵은 돌격대장. 공격이 최선의 방어라 믿으며, 물러서는 법을 모른다. 그녀의 흉터는 훈장이자 자부심이다.",
    combatStyle: "속도와 난무. 두 개의 도가 폭풍우처럼 몰아치며 쉴 새 없이 몰아붙이는 연타 공격(오호단문도). 맹수(호랑이)가 표효하고 발톱으로 할퀴는 듯한 야성적인 기세.",
    stats: { martial: 85, internal: 78, agility: 88, intelligence: 68 },
    skills: ["오호단문도", "쌍도난무", "맹호출림", "돌살돌격"]
  },
  {
    id: "paengsun",
    name: "팽순",
    title: "천연괴력",
    factionId: "habuk",
    factionCategory: "orthodox",
    position: "하인",
    realm: "3류",
    rank: "D",
    image: "/images/characters/M3_1.png",
    gallery: generateGallery("M3"),
    appearance: "순박하게 생긴 시골 처녀 같지만, 쌀가마니 10개를 한 번에 드는 괴력의 소유자. 맹하고 착하다.",
    story: "자신이 얼마나 센지 모른다. '어머, 문고리가 부서졌네?'가 일상. 팽가의 가주조차 그녀의 잠재력을 무서워한다. 싸울 생각은 없지만, 그녀가 휘두른 빗자루에 고수들이 날아간다.",
    combatStyle: "비무장 괴력. 무공 초식 없이 주변의 기둥을 뽑아 던지거나, 곰처럼 껴안아 허리를 으스러뜨리는(본의 아닌) 상황.",
    stats: { martial: 95, internal: 20, agility: 30, intelligence: 25 },
    skills: ["천연괴력", "무식한힘", "빗자루휘두르기"]
  },
];

// [N] 모용세가
export const MOYONG_CHARACTERS: Character[] = [
  {
    id: "moyonghui",
    name: "모용희",
    title: "반사태후",
    factionId: "moyong",
    factionCategory: "orthodox",
    position: "가주",
    realm: "화경",
    rank: "S",
    image: "/images/characters/N1_1.png",
    gallery: generateGallery("N1"),
    appearance: "귀족적인 우아함이 흐르는 미중년 여성. 항상 부채로 입을 가리고 있으며, 눈웃음을 치지만 속을 알 수 없다.",
    story: "몰락한 왕족의 후예라는 자부심(허영심)이 강하다. 남의 힘을 이용해 이득을 취하는 데 도가 텄다. 겉으로는 칭찬하지만, 돌아서면 비웃는 위선적인 성격.",
    combatStyle: "반사와 역류. 적의 강력한 공격을 부채나 손짓 한 번으로 궤도를 틀어, 적이 자신의 공격에 맞게 만드는(두전성이) 신기. 우아하게 춤추듯 적의 힘을 농락한다.",
    stats: { martial: 88, internal: 92, agility: 85, intelligence: 94 },
    skills: ["두전성이", "이피지이환이피", "반사공", "역류장"]
  },
  {
    id: "moyongseol",
    name: "모용설",
    title: "만권서생",
    factionId: "moyong",
    factionCategory: "orthodox",
    position: "장로",
    realm: "초절정",
    rank: "A",
    image: "/images/characters/N2_1.png",
    gallery: generateGallery("N2"),
    appearance: "학자풍의 안경 쓴 여성. 손에는 항상 붓(판관필)과 책이 들려 있다.",
    story: "'세상의 모든 무공은 파해 가능하다.' 걸어 다니는 무공 백과사전. 싸우기 전에 상대를 분석하고, 약점이 발견되면 가차 없이 찌른다.",
    combatStyle: "분석과 점혈. 붓을 이용해 상대의 혈도를 정확히 짚어 마비시키거나, 손가락에서 기운을 쏘아(참합지) 원거리에서 급소를 꿰뚫는 지능적인 전투.",
    stats: { martial: 80, internal: 82, agility: 75, intelligence: 98 },
    skills: ["참합지", "판관필법", "약점분석", "만권독파"]
  },
  {
    id: "moyongjin",
    name: "모용진",
    title: "경화수월",
    factionId: "moyong",
    factionCategory: "orthodox",
    position: "소가주",
    realm: "절정",
    rank: "B",
    image: "/images/characters/N3_1.png",
    gallery: generateGallery("N3"),
    appearance: "화려한 자색 비단옷을 입은 귀공녀. 부채를 들고 오만하게 웃고 있다.",
    story: "자신이 세상의 중심이라 믿는 나르시시스트. 남의 무공을 보고 똑같이 흉내 내어 상대를 조롱하는 것을 즐긴다.",
    combatStyle: "피피검법(皮皮劍法). 상대의 검로를 완벽하게 읽고, 부채나 검으로 상대의 힘을 흘려내거나 되돌려주는(반사) 기교.",
    stats: { martial: 72, internal: 75, agility: 78, intelligence: 80 },
    skills: ["피피검법", "이피지이환이피", "기술모방", "조롱반격"]
  },
];

// [O] 제갈세가
export const JEGAL_CHARACTERS: Character[] = [
  {
    id: "jegalrin",
    name: "제갈린",
    title: "천기선녀",
    factionId: "jegal",
    factionCategory: "orthodox",
    position: "가주",
    realm: "절정",
    rank: "B",
    image: "/images/characters/O1_1.png",
    gallery: generateGallery("O1"),
    appearance: "창백한 피부에 병약해 보이는 미녀. 깃털 부채(학우선)를 들고 휠체어나 가마를 타고 다닌다. 눈을 감고 예언하듯 말한다.",
    story: "천기(天機)를 읽는 능력이 있어 미래를 단편적으로 본다. 그 대가로 몸이 약하다. 그녀의 머릿속에는 수만 가지의 수가 그려져 있다. 직접 싸우기보다 함정과 진법으로 적을 가둔다.",
    combatStyle: "진법과 환술. 돌맹이 몇 개를 던져 주변 풍경을 미로로 바꾸거나(팔진도), 적끼리 서로 싸우게 만드는 환각을 건다. 그녀의 부채질 한 번에 전황이 뒤집히는 지략.",
    stats: { martial: 45, internal: 70, agility: 35, intelligence: 100 },
    skills: ["팔진도", "천기술", "지략", "기문둔갑"]
  },
  {
    id: "jegalseo",
    name: "제갈서",
    title: "군기참모",
    factionId: "jegal",
    factionCategory: "orthodox",
    position: "장로",
    realm: "초절정",
    rank: "A",
    image: "/images/characters/O2_1.png",
    gallery: generateGallery("O2"),
    appearance: "깐깐한 가정교사 스타일. 지휘봉을 들고 있으며, 목소리가 날카롭다.",
    story: "제갈세가의 군기반장. 전장을 거대한 장기판으로, 아군과 적을 말(馬)로 본다. 감정 없는 지휘로 승리를 이끈다.",
    combatStyle: "지휘와 버프. 아군의 진형을 짜주어 공격력을 극대화하거나, 소매 속에서 비수를 날려 적의 흐름을 끊는 서포트 능력.",
    stats: { martial: 72, internal: 75, agility: 70, intelligence: 95 },
    skills: ["지휘술", "진형강화", "비수술", "전술분석"]
  },
  {
    id: "jegalryeong",
    name: "제갈령",
    title: "기관괴녀",
    factionId: "jegal",
    factionCategory: "orthodox",
    position: "소가주",
    realm: "1류",
    rank: "C",
    image: "/images/characters/O3_1.png",
    gallery: generateGallery("O3"),
    appearance: "기름때 묻은 작업복을 입은 천재 공학 소녀. 등에는 거대한 기계 팔이나 도구 가방을 메고 있다.",
    story: "무공보다는 기계 장치(기관)에 관심이 많다. 나무로 만든 자동 인형이나 폭탄을 만들어낸다. 장난기가 심해 아군도 종종 피해를 본다.",
    combatStyle: "기계 장치와 트랩. 태엽으로 움직이는 나무 인형(목우유마)을 조종해 싸우거나, 땅에 묻어둔 지뢰를 터뜨리는 공학적인 전투 방식.",
    stats: { martial: 40, internal: 45, agility: 55, intelligence: 92 },
    skills: ["목우유마", "기관술", "트랩설치", "자동인형"]
  },
];

// ==================== 3. 사파 & 마교 ====================

// [P] 녹림
export const NOKRIM_CHARACTERS: Character[] = [
  {
    id: "dokgopyo",
    name: "독고표",
    title: "녹림여왕",
    factionId: "sapa_union",
    factionCategory: "unorthodox",
    position: "녹림왕",
    realm: "초절정",
    rank: "A",
    image: "/images/characters/P1_1.png",
    gallery: generateGallery("P1"),
    appearance: "호피 가죽을 두르고 한쪽 눈에 흉터가 있는 거친 야성미의 여인. 거대한 구환도(고리 달린 칼)를 어깨에 걸치고 있다.",
    story: "'산의 주인은 나다.' 산적들을 힘으로 찍어 누른 여왕. 약탈한 재물로 온몸을 치장하는 것을 즐긴다. 단순하고 무식하지만, 의리 하나는 끝내준다.",
    combatStyle: "선풍(회전)과 파괴. 구환도를 풍차처럼 돌려 주변의 나무와 적을 동시에 베어버리는 광역기. 회전할 때마다 고리들이 부딪히는 쇳소리가 적의 정신을 혼미하게 만든다.",
    stats: { martial: 85, internal: 78, agility: 80, intelligence: 60 },
    skills: ["구환도법", "녹림선풍참", "광폭회전", "산적왕의일효"]
  },
  {
    id: "imsan",
    name: "임산",
    title: "녹림장군",
    factionId: "sapa_union",
    factionCategory: "unorthodox",
    position: "녹림장군",
    realm: "절정",
    rank: "B",
    image: "/images/characters/P2_1.png",
    gallery: generateGallery("P2"),
    appearance: "갑옷 대신 근육으로 무장한 여전사. 양손에 든 쌍도끼가 그녀의 분신이다.",
    story: "독고표의 오른팔. 말보다 도끼가 먼저 나가는 다혈질. 복잡한 작전보다는 '다 죽이면 해결된다'는 주의.",
    combatStyle: "도약과 찍기. 높이 뛰어올라 중력을 실어 내리찍는 단순하지만 방어 불가능한 공격. 땅이 파이고 바위가 쪼개지는 물리적 충격.",
    stats: { martial: 78, internal: 70, agility: 75, intelligence: 45 },
    skills: ["쌍도끼술", "천근찍기", "도약참", "분쇄격"]
  },
];

// [Q] 수로채
export const SURO_CHARACTERS: Character[] = [
  {
    id: "suryeon",
    name: "수련",
    title: "해적여제",
    factionId: "suro",
    factionCategory: "unorthodox",
    position: "수로채주",
    realm: "초절정",
    rank: "A",
    image: "/images/characters/Q1_1.png",
    gallery: generateGallery("Q1"),
    appearance: "검은 안대와 푸른색 제복을 입은 해적 선장. 물에 젖은 듯한 머릿결과 차가운 미소. 삼지창을 쓴다.",
    story: "장강의 물길을 지배하는 수로채의 주인. 물 위에서는 천하제일인도 장담 못 한다고 자부한다. 배신자는 산 채로 수장시키는 잔혹한 규율을 가지고 있다.",
    combatStyle: "수류(물살)와 질식. 삼지창을 휘둘러 강물을 끌어올려 용처럼 쏘아 보내거나, 내공으로 주변의 수분을 조작해 적을 질식시키는 기술.",
    stats: { martial: 84, internal: 86, agility: 82, intelligence: 78 },
    skills: ["수룡술", "삼지창법", "질식장법", "수류참"]
  },
  {
    id: "hahu",
    name: "하후",
    title: "경도광녀",
    factionId: "suro",
    factionCategory: "unorthodox",
    position: "행동대장",
    realm: "절정",
    rank: "B",
    image: "/images/characters/Q2_1.png",
    gallery: generateGallery("Q2"),
    appearance: "멍한 표정에 침을 흘리는 거구의 여성. 거대한 고래 잡는 칼(경도)을 질질 끌고 다닌다.",
    story: "지능은 어린아이 수준이지만 힘은 괴물이다. 수련이 시키는 대로만 움직인다. '생선 준다'는 말에 목숨 걸고 싸운다.",
    combatStyle: "단순함과 무게. 기술명도 없이 그저 휘두르지만, 그 범위가 너무 넓어 피할 수 없는 공포.",
    stats: { martial: 82, internal: 60, agility: 55, intelligence: 20 },
    skills: ["경도난무", "무식한휘두르기", "거인의힘"]
  },
  {
    id: "yupa",
    name: "유파",
    title: "풍류낭인",
    factionId: "suro",
    factionCategory: "unorthodox",
    position: "낭인",
    realm: "1류",
    rank: "C",
    image: "/images/characters/Q3_1.png",
    gallery: generateGallery("Q3"),
    appearance: "삿갓을 쓰고 나뭇잎을 입에 문 자유로운 영혼. 낡은 도포 자락이 바람에 날린다.",
    story: "조직에 얽매이지 않고 바람 따라 떠도는 낭인. 수로채에 잠시 머물고 있지만 언제 떠날지 모른다. 낭만과 자유를 노래한다.",
    combatStyle: "바람과 쾌검. 바람을 타고 미끄러지듯 이동하며, 춤추듯 검을 휘두르는 경쾌한 검술.",
    stats: { martial: 65, internal: 60, agility: 78, intelligence: 70 },
    skills: ["풍류검", "자유보법", "바람타기", "낭인검무"]
  },
];

// [R] 하오문
export const HAOMUN_CHARACTERS: Character[] = [
  {
    id: "hongru",
    name: "홍루",
    title: "정보여왕",
    factionId: "haomun",
    factionCategory: "unorthodox",
    position: "문주",
    realm: "절정",
    rank: "B",
    image: "/images/characters/R1_1.png",
    gallery: generateGallery("R1"),
    appearance: "화려한 기녀복과 짙은 화장을 한 절세미녀. 긴 곰방대를 손에서 놓지 않는다.",
    story: "중원 모든 유흥가의 주인. 웃음과 술을 팔지만, 뒤로는 가장 은밀한 정보를 거래한다. 그녀의 정보력은 황실보다 빠르다.",
    combatStyle: "매혹과 독연. 곰방대에서 뿜어지는 보라색 연기로 환각을 걸고, 춤추듯 다가와 비녀로 급소를 찌르는 암살술.",
    stats: { martial: 68, internal: 72, agility: 75, intelligence: 95 },
    skills: ["독연술", "비녀암살", "정보망", "매혹술"]
  },
  {
    id: "heukseo",
    name: "흑서",
    title: "암흑밀탐",
    factionId: "haomun",
    factionCategory: "unorthodox",
    position: "밀탐",
    realm: "1류",
    rank: "C",
    image: "/images/characters/R2_1.png",
    gallery: generateGallery("R2"),
    appearance: "다크한 화장을 한, 퇴폐미 넘치는 병약 미녀. 항상 그늘에 숨어 있어 눈이 잘 보이지 않는다.",
    story: "하수구와 뒷골목의 지배자. 돈만 주면 어떤 더러운 일도 처리한다. 의심이 많아 누구도 믿지 않는다.",
    combatStyle: "기습과 도주. 정면 승부를 피하고, 독이 발린 단검으로 스치고 지나가거나 연막탄을 터뜨리고 사라지는 얍삽한 전투.",
    stats: { martial: 55, internal: 50, agility: 85, intelligence: 80 },
    skills: ["은신술", "독단검", "연막도주", "밀탐술"]
  },
  {
    id: "samsu",
    name: "삼수",
    title: "소악마도적",
    factionId: "haomun",
    factionCategory: "unorthodox",
    position: "악동",
    realm: "2류",
    rank: "D",
    image: "/images/characters/R3_1.png",
    gallery: generateGallery("R3"),
    appearance: "장난기 가득한 표정이 사랑스러운 소악마 스타일. 혀를 내밀고 '메~롱' 하는 표정이 기본값. 몸집이 매우 작다.",
    story: "하오문의 골칫덩어리이자 마스코트. 소매치기의 달인이며, 고수들의 물건을 훔치고 도망치는 스릴을 즐긴다. 상대를 약 올리는 데 천부적인 재능이 있다.",
    combatStyle: "초고속 경공과 조롱. 잡힐 듯 말 듯 요리조리 피하며, 상대의 바지를 벗기거나 무기를 뺏어 달아나는 식의 '정신적 데미지'를 주는 기술.",
    stats: { martial: 35, internal: 30, agility: 92, intelligence: 75 },
    skills: ["소매치기", "도주술", "조롱", "회피기동"]
  },
];

// [S] 살수막
export const SALSU_CHARACTERS: Character[] = [
  {
    id: "mumyeong",
    name: "무명",
    title: "죽음의그림자",
    factionId: "salsu",
    factionCategory: "unorthodox",
    position: "살수왕",
    realm: "화경",
    rank: "S",
    image: "/images/characters/S1_1.png",
    gallery: generateGallery("S1"),
    appearance: "존재감이 전혀 없는 검은 옷의 여인. 눈동자에 빛이 없어 마주치면 심연을 보는 듯하다.",
    story: "이름도, 과거도, 감정도 없다. 오직 '의뢰'와 '완수'만 존재한다. 그녀가 움직이면 반드시 누군가 죽는다.",
    combatStyle: "무형(無形)과 공간 절단. 무기 없이 손짓만으로 공간이 갈라지거나, 보이지 않는 실(Thread)이 목을 조여오는 공포. 소리도 살기도 없는 죽음 그 자체.",
    stats: { martial: 95, internal: 90, agility: 98, intelligence: 85 },
    skills: ["무형참", "공간절단", "암살술", "무음무영"]
  },
  {
    id: "yacha",
    name: "야차",
    title: "쾌락살인마",
    factionId: "salsu",
    factionCategory: "unorthodox",
    position: "광녀",
    realm: "초절정",
    rank: "A",
    image: "/images/characters/S2_1.png",
    gallery: generateGallery("S2"),
    appearance: "피 묻은 붕대를 감고 미친 듯이 웃는 광녀. 양손에 긴 쇠손톱(Claw)을 끼고 있다.",
    story: "살인을 즐기는 쾌락 살인마. 피 냄새를 맡으면 흥분하여 피아 식별이 불가능해진다. 비명을 듣는 것을 좋아한다.",
    combatStyle: "난무와 출혈. 짐승처럼 네 발로 뛰며 무차별적으로 할퀴는 공격. 붉은 손톱 자국이 허공에 남으며, 닿는 곳마다 살점이 뜯겨 나가는 잔혹함.",
    stats: { martial: 88, internal: 72, agility: 90, intelligence: 35 },
    skills: ["광녀쇠손톱", "피의광기", "야수술", "난무할퀴기"]
  },
  {
    id: "yeonbi",
    name: "연비",
    title: "냉혈살수",
    factionId: "salsu",
    factionCategory: "unorthodox",
    position: "상급살수",
    realm: "절정",
    rank: "B",
    image: "/images/characters/S3_1.png",
    gallery: generateGallery("S3"),
    appearance: "깔끔하게 묶은 머리에 안경을 쓴 사무적인 인상의 여인. 검은 정장풍 무복.",
    story: "살인을 철저한 청부업으로 생각한다. '추가 의뢰금은 주시나요?'라고 묻는 철저한 직업의식. 감정 없이 효율적으로 죽인다.",
    combatStyle: "정확도와 암기. 계산된 각도로 수십 개의 비침(바늘)을 던져, 단 한 번의 오차 없이 급소에 꽂아 넣는 정밀함.",
    stats: { martial: 75, internal: 70, agility: 82, intelligence: 88 },
    skills: ["정밀암기", "비침술", "효율암살술", "계약이행"]
  },
];

// [T] 천마신교
export const CHEONMA_CHARACTERS: Character[] = [
  {
    id: "cheonma",
    name: "천마",
    title: "절대마존",
    factionId: "cheonma",
    factionCategory: "demonic",
    position: "교주",
    realm: "현경",
    rank: "S",
    image: "/images/characters/T1_1.png",
    gallery: generateGallery("T1"),
    appearance: "칠흑 같은 흑의에 붉은 용이 수놓아진 의복. 발이 땅에 닿지 않는 공중부양 상태. 절대적인 미모와 오만함.",
    story: "'천상천하 유아독존.' 자신이 곧 신이라 믿으며, 실제로 신에 가까운 힘을 가졌다. 그녀 앞에서 고개를 드는 것은 죽음을 의미한다.",
    combatStyle: "흑염과 중력. 검은 불꽃으로 모든 것을 소멸시키거나, 손가락 하나로 엄청난 중력을 발생시켜 적을 짓이겨버리는(천마군림) 압도적이고 재앙 같은 권능.",
    stats: { martial: 100, internal: 100, agility: 95, intelligence: 92 },
    skills: ["천마신공", "흑염멸세", "천마군림", "만마귀종"]
  },
  {
    id: "biseol",
    name: "비설",
    title: "빙백호법",
    factionId: "cheonma",
    factionCategory: "demonic",
    position: "호법",
    realm: "화경",
    rank: "S",
    image: "/images/characters/T2_1.png",
    gallery: generateGallery("T2"),
    appearance: "머리부터 발끝까지 하얀 백발의 냉미녀. 얼음처럼 투명한 검(빙백검)을 쓴다.",
    story: "천마의 그림자. 천마를 제외한 세상 모든 것에 무관심하다. 그녀가 지나간 자리는 한여름에도 눈이 내린다.",
    combatStyle: "절대 영도. 검을 뽑는 순간 대기 중의 수분이 얼어붙어 적의 움직임을 봉쇄하고, 날카로운 얼음 가시로 관통하는 기술.",
    stats: { martial: 92, internal: 95, agility: 88, intelligence: 82 },
    skills: ["빙백검법", "절대영도", "빙설무한", "동파지옥"]
  },
  {
    id: "yeompa",
    name: "염파",
    title: "아수라호법",
    factionId: "cheonma",
    factionCategory: "demonic",
    position: "아수라",
    realm: "화경",
    rank: "S",
    image: "/images/characters/T3_1.png",
    gallery: generateGallery("T3"),
    appearance: "붉은 도복을 입은 열혈 무투가. 양손에 붉은 붕대를 감고 있으며, 주변에 아지랑이가 피어오른다.",
    story: "'다 태워버려!' 천마신교의 선봉장. 내공을 불처럼 뜨겁게 운용하는 순양지기(純陽之氣)의 고수. 마법이 아니라 무공으로 불을 일으킨다.",
    combatStyle: "수라패황권. 주먹에 붉은 기운(내공)을 실어 타격하면, 닿는 순간 폭발과 함께 상대를 잿더미로 만드는 파괴적인 권법.",
    stats: { martial: 92, internal: 90, agility: 85, intelligence: 60 },
    skills: ["수라패황권", "순양지기", "염화폭발장", "아수라노도"]
  },
  {
    id: "hwanhui",
    name: "환희",
    title: "환마요희",
    factionId: "cheonma",
    factionCategory: "demonic",
    position: "환마",
    realm: "초절정",
    rank: "A",
    image: "/images/characters/T4_1.png",
    gallery: generateGallery("T4"),
    appearance: "속이 비치는 얇은 비단옷을 입은 절세의 요녀. 눈을 마주치는 것만으로 혼을 뺀다.",
    story: "인간의 욕망을 조종한다. 그녀의 눈을 본 자는 스스로 그녀의 노예가 되어 동료를 찌른다.",
    combatStyle: "섭혼술과 환각. 분홍색 안개 속에서 춤을 추며, 상대가 가장 사랑하는 사람의 모습으로 변하거나 악몽을 보여주어 정신을 붕괴시키는 심리전.",
    stats: { martial: 75, internal: 88, agility: 82, intelligence: 90 },
    skills: ["섭혼대법", "환영술", "요희무", "정신붕괴"]
  },
];

// ==================== 4. 혈교 & 관부 ====================

// [U] 혈교
export const BLOOD_SECT_CHARACTERS: Character[] = [
  {
    id: "hyeolma",
    name: "혈마",
    title: "피의여왕",
    factionId: "blood_sect",
    factionCategory: "demonic",
    position: "교주",
    realm: "현경",
    rank: "S",
    image: "/images/characters/U1_1.png",
    gallery: generateGallery("U1"),
    appearance: "창백하다 못해 투명한 피부, 핏빛 눈동자를 가진 뱀파이어 퀸. 고풍스러운 붉은 드레스.",
    story: "수백 년을 살아온 괴물. 젊음과 미모를 유지하기 위해 젊은 고수의 피를 갈구한다. 우아한 말투 뒤에 식인(食人)의 본능이 숨어있다.",
    combatStyle: "혈액 조작. 손짓으로 상대의 상처에서 피를 강제로 뽑아내거나, 공중에 흩뿌려진 피를 굳혀 칼날로 만들어 쏘아내는(혈수공) 기괴한 마공.",
    stats: { martial: 98, internal: 100, agility: 92, intelligence: 95 },
    skills: ["혈수공", "흡혈마공", "혈액조작", "불사의몸"]
  },
  {
    id: "jeokgwi",
    name: "적귀",
    title: "인육도살자",
    factionId: "blood_sect",
    factionCategory: "demonic",
    position: "도살자",
    realm: "화경",
    rank: "S",
    image: "/images/characters/U2_1.png",
    gallery: generateGallery("U2"),
    appearance: "피에 쩐 앞치마를 두른 광기 어린 여인. 식칼 형태의 거대한 도(刀)를 든다.",
    story: "사람을 고기처럼 다룬다. '어느 부위가 맛있을까?'라며 해부학적인 지식을 읊조린다. 혈교 내에서도 기피 대상 1호.",
    combatStyle: "해체와 절단. 무식한 힘으로 내려치면서도, 뼈와 근육의 결을 따라 정교하게 잘라내는 소름 끼치는 도법.",
    stats: { martial: 90, internal: 85, agility: 78, intelligence: 70 },
    skills: ["해체도법", "인육절단", "광기의도", "도살술"]
  },
  {
    id: "hongju",
    name: "홍주",
    title: "인형사",
    factionId: "blood_sect",
    factionCategory: "demonic",
    position: "인형사",
    realm: "초절정",
    rank: "A",
    image: "/images/characters/U3_1.png",
    gallery: generateGallery("U3"),
    appearance: "무표정한 얼굴의 소녀. 손가락에 붉은 실(Red Thread)이 엉켜있다.",
    story: "사람을 산 채로 인형으로 만든다. 그녀의 컬렉션이 되는 것은 죽음보다 끔찍하다. 외로움을 타서 항상 '친구'를 만든다고 주장한다.",
    combatStyle: "실과 조종. 보이지 않는 붉은 실을 쏘아 상대를 포박하거나, 실을 당겨 신체를 절단하는 기술. 혹은 시체를 조종해 대신 싸우게 한다.",
    stats: { martial: 80, internal: 85, agility: 78, intelligence: 88 },
    skills: ["혈사술", "인형조종", "실로절단", "시체괴뢰"]
  },
  {
    id: "hyeolyeong",
    name: "혈영",
    title: "인간병기",
    factionId: "blood_sect",
    factionCategory: "demonic",
    position: "살수",
    realm: "초절정",
    rank: "A",
    image: "/images/characters/U4_1.png",
    gallery: generateGallery("U4"),
    appearance: "핏기 하나 없이 창백한 피부에 감정이 거세된 붉은 눈동자(적안). 칠흑 같은 타이트한 무복 위에 붉은색 쇠사슬을 온몸에 칭칭 감고 있다. 목과 손목에는 제어용 주술이 새겨진 구속구가 채워져 있다.",
    story: "혈교가 갓난아기 때부터 납치해 감정과 자아를 지우고 오직 '명령'에만 따르도록 세뇌한 인간 병기. 평소에는 인형처럼 가만히 있다가, 특정 명령 코드('구속 해제')가 입력되면 눈빛이 변하며 목표를 말살한다.",
    combatStyle: "혈쇄(血鎖)의 춤. 전신에 감긴 쇠사슬이 붉은 기운(혈기)을 머금고 살아있는 뱀처럼 사방으로 뻗어 나간다. 사슬이 적의 사지를 결박하여 으스러뜨리거나, 사슬 끝에 달린 예리한 비수가 예측 불가능한 궤도로 급소를 관통.",
    stats: { martial: 85, internal: 82, agility: 88, intelligence: 45 },
    skills: ["혈쇄술", "사슬결박", "비수난무", "무감정살수"]
  },
  {
    id: "mirang",
    name: "미랑",
    title: "실험체",
    factionId: "blood_sect",
    factionCategory: "demonic",
    position: "실험체",
    realm: "1류",
    rank: "C",
    image: "/images/characters/U5_1.png",
    gallery: generateGallery("U5"),
    appearance: "오드아이(양 눈 색이 다름)에 온몸에 붕대를 감은 소녀. 한쪽 팔이 괴물처럼 변형되어 있다.",
    story: "혈교의 금지된 실험으로 태어난 비극적 존재. 평소엔 울보지만, 생명의 위협을 느끼면 폭주하여 모든 것을 죽인다. '죽여줘...'라고 애원하며 공격한다.",
    combatStyle: "폭주와 변형. 괴물로 변한 팔이 늘어나거나 거대해져 적을 으깨버리는 육체 변형 기술.",
    stats: { martial: 75, internal: 60, agility: 65, intelligence: 50 },
    skills: ["폭주형태", "괴물팔", "육체변형", "광폭"]
  },
];

// [V] 관부
export const IMPERIAL_CHARACTERS: Character[] = [
  {
    id: "wichung",
    name: "위충",
    title: "음사상궁",
    factionId: "imperial",
    factionCategory: "imperial",
    position: "동창수장",
    realm: "화경",
    rank: "S",
    image: "/images/characters/V1_1.png",
    gallery: generateGallery("V1"),
    appearance: "하얗게 분칠한 얼굴, 붉은 입술, 높은 관모를 쓴 여성 환관(상궁) 스타일. 손톱이 매우 길다.",
    story: "동창(비밀경찰)의 수장. 황제를 조종하며 무림을 발아래 두려 한다. 음침하고 교활하며, 웃음소리가 소름 끼친다.",
    combatStyle: "규화보전. 잔상이 보일 정도의 초고속 이동과, 손가락 튕기기로 바늘을 날려 바위를 뚫는 파괴력. 붉은 실과 바늘을 이용한 기괴한 무공.",
    stats: { martial: 90, internal: 92, agility: 95, intelligence: 98 },
    skills: ["규화보전", "음사신공", "실과바늘", "암살지술"]
  },
  {
    id: "seorin",
    name: "서린",
    title: "금의여장군",
    factionId: "imperial",
    factionCategory: "imperial",
    position: "금의위장",
    realm: "초절정",
    rank: "A",
    image: "/images/characters/V2_1.png",
    gallery: generateGallery("V2"),
    appearance: "황금 갑옷과 붉은 망토를 두른 여장군. 긴 창을 든 모습이 위풍당당하다.",
    story: "황명에 절대복종하는 군인. 무림인들을 '법을 어기는 범죄자'로 규정하고 멸시한다. 타협은 없다. 오직 집행뿐.",
    combatStyle: "직선 돌파와 창술. 군더더기 없는 정석적인 창술로 적의 심장을 꿰뚫거나, 기를 모아 일직선으로 쏘아내는(창룡출두) 군대식 무공.",
    stats: { martial: 85, internal: 80, agility: 82, intelligence: 75 },
    skills: ["금의창법", "창룡출두", "황명집행", "진형돌파"]
  },
  {
    id: "jina",
    name: "진아",
    title: "철면판관",
    factionId: "imperial",
    factionCategory: "imperial",
    position: "판관",
    realm: "절정",
    rank: "B",
    image: "/images/characters/V3_1.png",
    gallery: generateGallery("V3"),
    appearance: "한쪽 눈에 확대경(단안경)을 낀 지적인 수사관. 붓과 장부를 들고 있다.",
    story: "한번 물면 놓지 않는 명탐정. '범인은 이 안에 있어.' 증거를 수집하고 약점을 파악해 법적으로, 그리고 물리적으로 심판한다.",
    combatStyle: "점혈과 제압. 붓으로 상대의 혈도를 정확히 짚어 마비시키거나, 죄목을 읊으며 심리적으로 압박하는 기술.",
    stats: { martial: 68, internal: 72, agility: 70, intelligence: 95 },
    skills: ["판관필법", "점혈술", "수사술", "심리압박"]
  },
  {
    id: "muyeong",
    name: "무영",
    title: "그림자호위",
    factionId: "imperial",
    factionCategory: "imperial",
    position: "그림자",
    realm: "초절정",
    rank: "A",
    image: "/images/characters/V4_1.png",
    gallery: generateGallery("V4"),
    appearance: "얼굴 없는 가면을 쓴 투명한 존재. 윤곽이 흐릿하다.",
    story: "황제의 그림자 호위. 말이 없고 기척도 없다. 그녀가 모습을 드러낸다는 건 황제의 명이 떨어졌다는 뜻이다.",
    combatStyle: "완전 은신. 빛과 그림자를 조작해 시야에서 사라진 뒤, 적의 그림자 속에서 솟아나 단검을 꽂는 암살술.",
    stats: { martial: 82, internal: 85, agility: 95, intelligence: 78 },
    skills: ["그림자잠입", "암살술", "은신", "그림자도약"]
  },
];

// ==================== 5. 새외 & 기인 ====================

// [W] 북해빙궁
export const NORTH_ICE_CHARACTERS: Character[] = [
  {
    id: "bingyeo",
    name: "빙여",
    title: "빙궁여제",
    factionId: "north_ice",
    factionCategory: "outer",
    position: "궁주",
    realm: "화경",
    rank: "S",
    image: "/images/characters/W1_1.png",
    gallery: generateGallery("W1"),
    appearance: "얼음 수정으로 만든 왕관을 쓴 차가운 여왕. 피부가 창백하고 주변 공기가 언다.",
    story: "북해를 다스리는 절대자. 세상 모든 것을 아름다운 얼음 조각상으로 박제하고 싶어 한다. 감정이 결여되어 있다.",
    combatStyle: "빙결 필드. 손을 들어 올리면 눈보라(Blizzard)가 몰아치고, 적의 발을 얼려 움직임을 봉쇄한 뒤 거대한 고드름을 떨어뜨리는 마법 같은 무공.",
    stats: { martial: 88, internal: 95, agility: 82, intelligence: 85 },
    skills: ["빙한신공", "빙결장", "설보라", "얼음조각"]
  },
  {
    id: "hanso",
    name: "한소",
    title: "곰가죽소녀",
    factionId: "north_ice",
    factionCategory: "outer",
    position: "장로",
    realm: "초절정",
    rank: "A",
    image: "/images/characters/W2_1.png",
    gallery: generateGallery("W2"),
    appearance: "곰 가죽을 귀엽게 소화하는, 괴력을 가진 소녀 장사. 주먹이 솥뚜껑만 하다.",
    story: "북해의 야생 곰을 맨손으로 때려잡는 괴력의 소유자. '요즘 것들은 약해 빠졌어!'라며 주먹을 휘두른다.",
    combatStyle: "백곰의 권. 기술 따위 필요 없이, 압도적인 힘과 맷집으로 밀고 들어가 주먹으로 내려찍는(웅권) 투박하고 강력한 타격.",
    stats: { martial: 88, internal: 82, agility: 65, intelligence: 55 },
    skills: ["웅권", "백곰포옹", "빙한맷집", "주먹내리찍기"]
  },
];

// [X] 남만야수궁
export const BEAST_PALACE_CHARACTERS: Character[] = [
  {
    id: "maengho",
    name: "맹호",
    title: "야수여왕",
    factionId: "beast_palace",
    factionCategory: "outer",
    position: "궁주",
    realm: "화경",
    rank: "S",
    image: "/images/characters/X1_1.png",
    gallery: generateGallery("X1"),
    appearance: "호피 비키니 아머를 입은 야성적인 미녀. 근육질 몸매와 날카로운 송곳니.",
    story: "인간보다 짐승과 더 가깝다. 정글의 법칙을 따르며, 강한 수컷(또는 강자)을 보면 사냥하려 든다. 포효 한 번으로 맹수들을 부린다.",
    combatStyle: "야수화. 싸움이 시작되면 손톱이 길어지고 눈이 붉게 변하며, 호랑이나 표범처럼 사족보행으로 빠르게 이동해 물어뜯는 야수적인 전투.",
    stats: { martial: 92, internal: 85, agility: 95, intelligence: 50 },
    skills: ["야수화", "맹수통솔", "호랑이발톱", "야성포효"]
  },
  {
    id: "aru",
    name: "아루",
    title: "맹수조련사",
    factionId: "beast_palace",
    factionCategory: "outer",
    position: "조련사",
    realm: "초절정",
    rank: "A",
    image: "/images/characters/X2_1.png",
    gallery: generateGallery("X2"),
    appearance: "가죽 채찍을 든 도도한 여왕님 스타일.",
    story: "맹수뿐만 아니라 사람도 조련한다. 그녀의 채찍 앞에서는 누구나 굴복한다. '앉아, 굴러!'",
    combatStyle: "채찍과 소환. 채찍으로 상대를 휘감아 내동댕이치거나, 휘파람을 불어 거대한 늑대나 독수리를 소환해 협공하는 기술.",
    stats: { martial: 78, internal: 75, agility: 85, intelligence: 80 },
    skills: ["조련술", "채찍술", "맹수소환", "복종명령"]
  },
];

// [Y] 은거기인
export const HIDDEN_MASTERS_CHARACTERS: Character[] = [
  {
    id: "baekun",
    name: "백운",
    title: "바둑신선",
    factionId: "hidden_masters",
    factionCategory: "hidden",
    position: "기인",
    realm: "현경",
    rank: "S",
    image: "/images/characters/Y1_1.png",
    gallery: generateGallery("Y1"),
    appearance: "수백 년을 살았으나 외모는 10대 소녀인 신비로운 신선. 바둑판을 옆구리에 끼고 있다.",
    story: "속세를 떠나 신선놀음하는 절대 고수. 세상을 바둑판으로, 사람을 바둑돌로 본다. 훈수 두는 것을 좋아한다.",
    combatStyle: "공간 왜곡. 바둑돌(흑돌/백돌)을 던져 공간을 뒤틀거나, 기의 흐름을 끊어 상대의 무공을 무효화하는 초월적인 능력.",
    stats: { martial: 95, internal: 100, agility: 90, intelligence: 100 },
    skills: ["바둑공간술", "기류차단", "천기조작", "초월훈수"]
  },
  {
    id: "woryeong",
    name: "월영",
    title: "국자여사",
    factionId: "hidden_masters",
    factionCategory: "hidden",
    position: "객잔주인",
    realm: "화경",
    rank: "S",
    image: "/images/characters/Y2_1.png",
    gallery: generateGallery("Y2"),
    appearance: "한때 강호를 주름잡았던, 여전히 아름답고 활기찬 미모의 여사장님. 하지만 손에는 무쇠 국자가 들려있다.",
    story: "과거 전설적인 고수였으나 은퇴하고 국밥을 판다. '돈 안 내면 국물도 없다!' 행패 부리는 고수들을 국자로 두들겨 패 쫓아낸다.",
    combatStyle: "생활 무공. 국자, 젓가락, 접시 등 주방기구를 무기로 사용하며, 등짝 스매싱 같은 동작으로 절정 고수를 날려버리는 코믹하지만 강력한 모습.",
    stats: { martial: 90, internal: 88, agility: 75, intelligence: 85 },
    skills: ["국자술", "생활무공", "등짝스매싱", "주방용점혈"]
  },
  {
    id: "cheonga",
    name: "청아",
    title: "비가악사",
    factionId: "hidden_masters",
    factionCategory: "hidden",
    position: "가객",
    realm: "초절정",
    rank: "A",
    image: "/images/characters/Y3_1.png",
    gallery: generateGallery("Y3"),
    appearance: "슬픈 눈을 가진 가녀린 악사. 거문고(가야금)를 뜯으며 노래한다.",
    story: "그녀의 연주를 들으면 누구나 눈물을 흘리며 전의를 상실한다. 슬픈 과거를 가진 복수귀.",
    combatStyle: "음공(Sound Wave). 현을 튕겨 보이지 않는 칼날(음파)을 날려 베거나, 슬픈 곡조로 내공을 교란시켜 피를 토하게 만드는 광역 공격.",
    stats: { martial: 78, internal: 88, agility: 72, intelligence: 85 },
    skills: ["음공", "비가술", "음파참", "정신교란"]
  },
  {
    id: "yakseon",
    name: "약선",
    title: "의사의선",
    factionId: "hidden_masters",
    factionCategory: "hidden",
    position: "의선",
    realm: "현경",
    rank: "S",
    image: "/images/characters/Y4_1.png",
    gallery: generateGallery("Y4"),
    appearance: "하얀 의원복을 입은 성녀. 온화한 미소 뒤에 생사를 주관하는 권능이 있다.",
    story: "죽은 사람도 살린다는 전설의 의원. 하지만 '살리는 손은 죽일 수도 있다'는 것을 보여준다. 생명의 점혈을 찌르면 치유, 사혈을 찌르면 즉사다.",
    combatStyle: "활인검. 가느다란 침 하나로 상대의 움직임을 멈추거나, 혈도를 조작해 고통 없이 잠재우는 신비로운 기술.",
    stats: { martial: 85, internal: 98, agility: 80, intelligence: 100 },
    skills: ["활인침법", "의사술", "치유술", "즉사점혈"]
  },
  {
    id: "geumhui",
    name: "금희",
    title: "황금재벌",
    factionId: "hidden_masters",
    factionCategory: "hidden",
    position: "대상인",
    realm: "절정",
    rank: "B",
    image: "/images/characters/Y5_1.png",
    gallery: generateGallery("Y5"),
    appearance: "온몸을 금으로 치장한 재벌 여인. 부채 대신 금괴를 들고 부채질한다.",
    story: "'얼마면 돼?' 강호의 경제를 쥐락펴락한다. 돈으로 고용된 호위 무사들이 그녀를 지키지만, 본인도 돈을 던져 사람을 죽일 수 있다.",
    combatStyle: "전전긍긍(돈 던지기). 금화나 은자를 암기처럼 던지는데, 그 위력이 폭탄급. 돈을 뿌려 용병을 소환하거나 매수하는 기술도 사용.",
    stats: { martial: 65, internal: 70, agility: 60, intelligence: 95 },
    skills: ["금화발사", "용병소환", "매수술", "황금방어"]
  },
];

// ==================== 전체 캐릭터 배열 ====================

export const ALL_CHARACTERS: Character[] = [
  // 구파일방
  ...SHAOLIN_CHARACTERS,
  ...WUDANG_CHARACTERS,
  ...HWASAN_CHARACTERS,
  ...AMI_CHARACTERS,
  ...KUNLUN_CHARACTERS,
  ...JEOMCHANG_CHARACTERS,
  ...KONGDONG_CHARACTERS,
  ...CHEONGSEONG_CHARACTERS,
  ...JONGNAM_CHARACTERS,
  ...GAEBANG_CHARACTERS,
  // 오대세가
  ...NAMGUNG_CHARACTERS,
  ...SACHEON_CHARACTERS,
  ...HABUK_CHARACTERS,
  ...MOYONG_CHARACTERS,
  ...JEGAL_CHARACTERS,
  // 사파
  ...NOKRIM_CHARACTERS,
  ...SURO_CHARACTERS,
  ...HAOMUN_CHARACTERS,
  ...SALSU_CHARACTERS,
  // 마교
  ...CHEONMA_CHARACTERS,
  // 혈교
  ...BLOOD_SECT_CHARACTERS,
  // 관부
  ...IMPERIAL_CHARACTERS,
  // 새외
  ...NORTH_ICE_CHARACTERS,
  ...BEAST_PALACE_CHARACTERS,
  // 은거기인
  ...HIDDEN_MASTERS_CHARACTERS,
];

// 유틸리티 함수들
export const getCharacterById = (id: string): Character | undefined => 
  ALL_CHARACTERS.find(c => c.id === id);

export const getCharactersByFaction = (factionId: string): Character[] =>
  ALL_CHARACTERS.filter(c => c.factionId === factionId);

export const getCharactersByRank = (rank: Character["rank"]): Character[] =>
  ALL_CHARACTERS.filter(c => c.rank === rank);

export const getCharactersByRealm = (realm: Realm): Character[] =>
  ALL_CHARACTERS.filter(c => c.realm === realm);

export const getCharactersByCategory = (category: FactionCategory): Character[] =>
  ALL_CHARACTERS.filter(c => c.factionCategory === category);

// 통합 export (CHARACTERS 별칭)
export const CHARACTERS = ALL_CHARACTERS;

// 세력 카테고리별 분류
export const ORTHODOX_CHARACTERS = ALL_CHARACTERS.filter(c => c.factionCategory === "orthodox");
export const UNORTHODOX_CHARACTERS = ALL_CHARACTERS.filter(c => c.factionCategory === "unorthodox");
export const DEMONIC_CHARACTERS = ALL_CHARACTERS.filter(c => c.factionCategory === "demonic");
export const OUTER_CHARACTERS = ALL_CHARACTERS.filter(c => c.factionCategory === "outer");
export const HIDDEN_CHARACTERS = ALL_CHARACTERS.filter(c => c.factionCategory === "hidden");
export const IMPERIAL_ALL_CHARACTERS = ALL_CHARACTERS.filter(c => c.factionCategory === "imperial");

// 등급별 분류
export const S_RANK_CHARACTERS = ALL_CHARACTERS.filter(c => c.rank === "S");
export const A_RANK_CHARACTERS = ALL_CHARACTERS.filter(c => c.rank === "A");
export const B_RANK_CHARACTERS = ALL_CHARACTERS.filter(c => c.rank === "B");
export const C_RANK_CHARACTERS = ALL_CHARACTERS.filter(c => c.rank === "C");
export const D_RANK_CHARACTERS = ALL_CHARACTERS.filter(c => c.rank === "D");
