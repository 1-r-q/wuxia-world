// 세력 카테고리 타입
export type FactionCategory = 'orthodox' | 'unorthodox' | 'demonic' | 'outer' | 'hidden' | 'imperial';

// 세력 관계 타입 (무협소설 스타일로 확장)
export type RelationType = 
    | '동맹'      // 정식 동맹 관계
    | '적대'      // 명확한 적대 관계
    | '중립'      // 중립적 관계
    | '혈맹'      // 피로 맺은 동맹, 동맹보다 강함
    | '우호'      // 동맹보다 느슨한 우호 관계
    | '혼인'      // 정략결혼으로 맺어진 관계
    | '숙적'      // 대대로 이어지는 원수 관계
    | '경쟁'      // 라이벌/경쟁 관계 (적대까지는 아님)
    | '암투'      // 표면상 중립이나 암중 대립
    | '협력'      // 특정 목적을 위한 임시 협력
    | '종속'      // 상하 종속 관계
    | '보호'      // 보호-피보호 관계
    | '원한'      // 과거의 원한이 있는 관계
    | '사제'      // 사제간 관계 (분파 등)
    | '밀약';     // 비밀 협정 관계

// 관계 강도 (UI 표시용)
export type RelationIntensity = 'strong' | 'normal' | 'weak';

export interface FactionRelation {
    targetId: string;
    type: RelationType;
    description: string;
    intensity?: RelationIntensity;  // 관계 강도
    history?: string;               // 관계의 역사적 배경
    since?: string;                 // 언제부터의 관계인지
}

export interface FactionLocation {
    name: string;
    hanja: string;
    x: number;  // 지도 좌표 (0-100)
    y: number;
    type: '본산' | '거점' | '영역';
}

export interface Faction {
    id: string;
    code: string; // A, B, C...
    name: string;
    hanja: string;
    desc: string;
    category: FactionCategory;
    colors: {
        primary: string;
        secondary: string;
        accent: string;
    };
    effectType: '꽃잎' | '수묵' | '번개' | '화염' | '빙설' | '독기' | '금광' | '물결' | '바람' | '낙엽' | '혈기' | '암영' | '안개' | '성진' | '음파' | '제왕검기' | '명왕빛' | '운룡뇌전' | '사일검' | '중검' | '태극' | '항룡장기' | '야수기' | '녹림기' | '초월기' | '황권' | '흑염';
    particleCount: number;
    // 확장 정보
    philosophy?: string;        // 세력 이념/철학
    signature_skills?: string[]; // 대표 무공
    leader?: string;            // 현재 수장 ID (characters.ts 연동)
    locations?: FactionLocation[];
    relations?: FactionRelation[];
    history?: string;           // 세력 역사
    images?: string[];          // 세력 관련 이미지 (갤러리용)
}

export const FACTIONS: Faction[] = [
    // 1. 구파일방 (정파의 기둥)
    {
        id: 'shaolin',
        code: 'A',
        name: '소림사 (少林)',
        hanja: '少林',
        category: 'orthodox',
        desc: '천하무공출소림. 황금빛 여래의 힘으로 세상을 정화하는 정파의 태두.',
        colors: { primary: '#C9A227', secondary: '#5C4033', accent: '#F4D03F' },
        effectType: '금광',
        particleCount: 60,
        philosophy: '불심(佛心). 자비로운 마음과 악을 물리치는 명왕의 분노를 함께 품는다.',
        signature_skills: ['여래신장', '항마곤', '금강불괴', '천수여래장'],
        leader: 'myoyeon',
        locations: [
            { name: '소림사', hanja: '少林寺', x: 55, y: 42, type: '본산' }
        ],
        relations: [
            { targetId: 'wudang', type: '혈맹', description: '무림 양대산맥, 정마대전의 주축', intensity: 'strong', since: '300년 전', history: '표면은 혈맹이나 무림맹주 자리 암투' },
            { targetId: 'cheonma', type: '숙적', description: '정마대전의 불구대천 원수', intensity: 'strong', history: '수차례의 정마대전으로 수많은 희생자 발생' },
            { targetId: 'hwasan', type: '동맹', description: '구파일방 맹주파', intensity: 'normal', history: '표면 동맹, 실제 화산의 독자 행동 견제' },
            { targetId: 'ami', type: '사제', description: '불문의 동근동종', intensity: 'normal', history: '아미파 개조가 소림에서 수학' },
            { targetId: 'gaebang', type: '협력', description: '무림맹 상임 이사방', intensity: 'normal', history: '개방 정보력 이용, 실제로는 하대' },
            { targetId: 'blood_sect', type: '적대', description: '척결 대상 사교', intensity: 'strong', history: '무림 공적으로 규정' },
            { targetId: 'namgung', type: '암투', description: '표면 우호, 실제 세가 세력 견제', intensity: 'normal', history: '세가의 단독 행동 경계' },
            { targetId: 'kunlun', type: '경쟁', description: '도불 종주권 다투', intensity: 'weak', history: '종교적 정통성 암투' }
        ],
        history: '천년의 역사를 지닌 무림의 성지. 수많은 정마대전에서 정파를 이끌어온 정신적 지주.'
    },
    {
        id: 'wudang',
        code: 'B',
        name: '무당파 (武當)',
        hanja: '武當',
        category: 'orthodox',
        desc: '유능제강. 부드러움으로 강함을 제압하며 태극의 이치로 흐름을 다스린다.',
        colors: { primary: '#2C3E50', secondary: '#ECF0F1', accent: '#5D6D7E' },
        effectType: '태극',
        particleCount: 80,
        philosophy: '도법자연(道法自然). 흐름을 거스르지 않고 역이용하여 상대를 제압한다.',
        signature_skills: ['태극검법', '양의검법', '순양무극공', '제운종'],
        leader: 'cheongso',
        locations: [
            { name: '무당산', hanja: '武當山', x: 52, y: 48, type: '본산' }
        ],
        relations: [
            { targetId: 'shaolin', type: '혈맹', description: '무림 양대산맥, 정사의 기둥', intensity: 'strong', since: '300년 전', history: '표면 혈맹이나 무림맹주 자리 두고 암투' },
            { targetId: 'hwasan', type: '동맹', description: '검문 교류, 검리(劑理) 공유', intensity: 'normal', history: '표면 동맹, 내심 검도 정통성 경쟁' },
            { targetId: 'kunlun', type: '사제', description: '도문의 형제 문파', intensity: 'normal', history: '같은 도교 계통이나 종주권 다투' },
            { targetId: 'cheongseong', type: '암투', description: '표면 우호, 실제 도가 종주권 경쟁', intensity: 'normal', history: '음험한 청성파를 내심 경계' },
            { targetId: 'cheonma', type: '적대', description: '정마대전 주력', intensity: 'strong' },
            { targetId: 'jongnam', type: '숙적', description: '검도 정통성 논쟁, 구파 내 숙적', intensity: 'normal', history: '순양검 vs 대검의 우열 논쟁이 감정 싸움으로' },
            { targetId: 'namgung', type: '암투', description: '표면 협력, 실제 검문 수좌 다투', intensity: 'normal', history: '세가의 오만함에 불만' },
            { targetId: 'blood_sect', type: '적대', description: '사교 척결 대상', intensity: 'strong' }
        ],
        history: '도교의 성지. 태극의 이치로 무림의 균형을 수호하는 대문파.'
    },
    {
        id: 'hwasan',
        code: 'C',
        name: '화산파 (華山)',
        hanja: '華山',
        category: 'orthodox',
        desc: '매화만개. 척박한 비탈에서 피어나는 매화처럼, 화려하고도 처절한 검끝의 미학.',
        colors: { primary: '#E8B4C8', secondary: '#7B2D5B', accent: '#D4A5B9' },
        effectType: '꽃잎',
        particleCount: 300,
        philosophy: '매화만개(梅花萬開). 혹한 속에서도 피어나는 매화처럼 고고하고 화려하다.',
        signature_skills: ['매화검법', '암향소사검', '자하신공', '이십사수매화검법'],
        leader: 'maehwa',
        locations: [
            { name: '화산', hanja: '華山', x: 48, y: 40, type: '본산' }
        ],
        relations: [
            { targetId: 'jongnam', type: '숙적', description: '섬서 패권 분쟁, 대대로 이어진 앙숙', intensity: 'strong', since: '150년 전', history: '매화검 vs 종남대검의 정통성 논쟁' },
            { targetId: 'wudang', type: '동맹', description: '검리 교류, 상호 검결 전수', intensity: 'normal', history: '표면 동맹이나 검도 정통성 암투' },
            { targetId: 'kongdong', type: '협력', description: '섬서 지역 공동 방위', intensity: 'normal', history: '실제로는 공동파 하대' },
            { targetId: 'namgung', type: '암투', description: '검문 제일 다투', intensity: 'normal', history: '천하제일검 칭호 놓고 암묵적 경쟁' },
            { targetId: 'shaolin', type: '우호', description: '무림맹 핵심파', intensity: 'normal', history: '표면 우호, 내심 소림 독주 불만' },
            { targetId: 'moyong', type: '원한', description: '과거 검보 도난 의혹', intensity: 'weak', history: '100년 전 검보 실종 사건' },
            { targetId: 'cheonma', type: '적대', description: '정마대전 선봉', intensity: 'strong' }
        ],
        history: '검의 화려함과 날카로움을 극한까지 추구하는 중원 제일의 검문.'
    },
    {
        id: 'ami',
        code: 'D',
        name: '아미파 (峨嵋)',
        hanja: '峨嵋',
        category: 'orthodox',
        desc: '멸절과 구원. 자비로운 보살의 마음과 악을 베는 명왕의 검을 동시에 지녔다.',
        colors: { primary: '#B8A9C9', secondary: '#4A235A', accent: '#8E44AD' },
        effectType: '명왕빛',
        particleCount: 80,
        philosophy: '멸절과 구원. 악을 멸하는 것이 곧 중생을 구원하는 길이다.',
        signature_skills: ['멸절검', '아미검법', '금정신공', '포대공'],
        leader: 'myeoljeol',
        locations: [
            { name: '아미산', hanja: '峨嵋山', x: 38, y: 55, type: '본산' }
        ],
        relations: [
            { targetId: 'shaolin', type: '사제', description: '불가 동근, 멸절과 자비의 이원화', intensity: 'normal', history: '개조가 소림 출신' },
            { targetId: 'cheongseong', type: '숙적', description: '파촉(巴蜀) 패권 다툼', intensity: 'strong', since: '80년 전', history: '영역 분쟁으로 수차례 충돌' },
            { targetId: 'sacheon', type: '암투', description: '표면상 중립, 독공 기밀 경쟁', intensity: 'normal', history: '비전 독공 유출 의혹' },
            { targetId: 'jeomchang', type: '협력', description: '서남 정파 연대', intensity: 'normal' },
            { targetId: 'hwasan', type: '우호', description: '여협(女俠) 교류', intensity: 'weak' },
            { targetId: 'gaebang', type: '협력', description: '정보 공유 협정', intensity: 'weak' }
        ],
        history: '여승들로 이루어진 문파이나 그 검은 그 누구보다 매섭고 단호하다.'
    },
    {
        id: 'kunlun',
        code: 'E',
        name: '곤륜파 (崑崙)',
        hanja: '崑崙',
        category: 'orthodox',
        desc: '운룡대팔식. 하늘과 가장 가까운 곳에서 용과 뇌전을 부리는 신선들의 문파.',
        colors: { primary: '#D5E8F7', secondary: '#3498DB', accent: '#F1C40F' },
        effectType: '운룡뇌전',
        particleCount: 100,
        philosophy: '운룡구천(雲龍九天). 구름 위를 노니는 용처럼, 천지의 기운을 부린다.',
        signature_skills: ['운룡대팔식', '태허도룡검', '뇌전장', '건곤대나이'],
        leader: 'unhui',
        locations: [
            { name: '곤륜산', hanja: '崑崙山', x: 25, y: 30, type: '본산' }
        ],
        relations: [
            { targetId: 'wudang', type: '사제', description: '도문의 형제, 운룡검법 교류', intensity: 'normal', history: '같은 도교 계통' },
            { targetId: 'cheonma', type: '적대', description: '마교 척결 선봉', intensity: 'strong' },
            { targetId: 'north_ice', type: '밀약', description: '새외 세력과의 비밀 협정', intensity: 'weak', history: '서역 정보 교환' },
            { targetId: 'shaolin', type: '협력', description: '무림맹 참여', intensity: 'normal' },
            { targetId: 'jegal', type: '우호', description: '진법 교류', intensity: 'weak', history: '팔진도와 건곤진의 합진 연구' }
        ],
        history: '신선이 산다는 곤륜산에서 독자적인 도술과 무공을 발전시켰다.'
    },
    {
        id: 'jeomchang',
        code: 'F',
        name: '점창파 (點蒼)',
        hanja: '點蒼',
        category: 'orthodox',
        desc: '사일검. 흐트러진 듯 보이나 그 끝은 찰나의 순간에 급소를 꿰뚫는다.',
        colors: { primary: '#1E3D32', secondary: '#8B5A2B', accent: '#45B39D' },
        effectType: '사일검',
        particleCount: 80,
        philosophy: '사일관지(蛇逸貫指). 뱀처럼 유연하게 파고들어 필살의 일격을 가한다.',
        signature_skills: ['사일검법', '분광검법', '회풍무류검', '점창십이검'],
        leader: 'geumhwa',
        locations: [
            { name: '점창산', hanja: '點蒼山', x: 32, y: 62, type: '본산' }
        ],
        relations: [
            { targetId: 'ami', type: '협력', description: '서남 정파 연대', intensity: 'normal' },
            { targetId: 'sacheon', type: '경쟁', description: '서남 독문 암투', intensity: 'normal', history: '독공 비급 경쟁' },
            { targetId: 'kunlun', type: '우호', description: '서역 정보 교류', intensity: 'weak' },
            { targetId: 'sapa_union', type: '적대', description: '운남 녹림 소탕', intensity: 'normal' },
            { targetId: 'gaebang', type: '협력', description: '서남 정보망 공유', intensity: 'weak' }
        ],
        history: '검법의 변화무쌍함이 으뜸이며, 쾌검으로는 천하제일을 다툰다.'
    },
    {
        id: 'kongdong',
        code: 'G',
        name: '공동파 (崆峒)',
        hanja: '崆峒',
        category: 'orthodox',
        desc: '복마검. 다채롭고 변칙적인 무공으로 예측할 수 없는 죽음을 선사한다.',
        colors: { primary: '#9B59B6', secondary: '#6C3483', accent: '#E74C8C' },
        effectType: '성진',
        particleCount: 200,
        philosophy: '복마항마(伏魔降魔). 마를 제압하기 위해 수단과 방법을 가리지 않는다.',
        signature_skills: ['복마검법', '소양신공', '칠상권', '비파행'],
        leader: 'yuseong',
        locations: [
            { name: '공동산', hanja: '崆峒山', x: 45, y: 35, type: '본산' }
        ],
        relations: [
            { targetId: 'hwasan', type: '협력', description: '섬서 지역 연대', intensity: 'normal' },
            { targetId: 'jongnam', type: '경쟁', description: '섬서 영향력 경쟁', intensity: 'weak' },
            { targetId: 'shaolin', type: '우호', description: '무림맹 참여', intensity: 'normal' },
            { targetId: 'cheonma', type: '적대', description: '마교 토벌', intensity: 'strong' },
            { targetId: 'jegal', type: '협력', description: '진법 합동 연구', intensity: 'weak', history: '성진과 팔진도의 결합 실험' }
        ],
        history: '도호가 섞인 기이한 무공을 사용하며, 원거리 무공에 능하다.'
    },
    {
        id: 'cheongseong',
        code: 'H',
        name: '청성파 (靑城)',
        hanja: '靑城',
        category: 'orthodox',
        desc: '청운적하. 푸른 검기 속에 붉은 독을 숨긴, 가장 은밀하고 치명적인 검.',
        colors: { primary: '#0E4D45', secondary: '#922B21', accent: '#1ABC9C' },
        effectType: '독기',
        particleCount: 150,
        philosophy: '이독제독(以毒制毒). 독으로 세상을 정화하고, 검으로 베어낸다.',
        signature_skills: ['청운적하검', '최심장', '벽사검법', '청성십구파'],
        leader: 'cheongya',
        locations: [
            { name: '청성산', hanja: '靑城山', x: 40, y: 52, type: '본산' }
        ],
        relations: [
            { targetId: 'ami', type: '숙적', description: '파촉(巴蜀) 패권 대립', intensity: 'strong', since: '80년 전' },
            { targetId: 'sacheon', type: '숙적', description: '독문(毒門) 정통성 분쟁', intensity: 'strong', history: '독왕 칭호를 두고 대대로 충돌' },
            { targetId: 'hwasan', type: '암투', description: '표면상 중립, 실제 견제', intensity: 'weak' },
            { targetId: 'haomun', type: '밀약', description: '정보 거래', intensity: 'weak', history: '뒷골목 정보 교환' },
            { targetId: 'salsu', type: '협력', description: '독과 암살의 연계', intensity: 'weak', history: '독 공급 거래' }
        ],
        history: '도가 무공에 독공을 접목시켜 음험하고도 날카로운 무공을 구사한다.'
    },
    {
        id: 'jongnam',
        code: 'I',
        name: '종남파 (終南)',
        hanja: '終南',
        category: 'orthodox',
        desc: '천하대검. 기교를 배격하고 압도적인 중량감으로 공간을 짓누른다.',
        colors: { primary: '#4A4A4A', secondary: '#1C1C1C', accent: '#7F8C8D' },
        effectType: '중검',
        particleCount: 60,
        philosophy: '대도무문(大道無門). 큰 길에는 문이 없다. 오직 압도적인 힘으로 길을 연다.',
        signature_skills: ['천하대검', '운상행', '유운검법', '태을신공'],
        leader: 'jinsan',
        locations: [
            { name: '종남산', hanja: '終南山', x: 50, y: 40, type: '본산' }
        ],
        relations: [
            { targetId: 'hwasan', type: '숙적', description: '섬서 패권의 백년 원수', intensity: 'strong', since: '150년 전', history: '매화검법과 천하대검의 우열 논쟁에서 시작' },
            { targetId: 'wudang', type: '경쟁', description: '검도 정통성 논쟁', intensity: 'weak' },
            { targetId: 'kongdong', type: '경쟁', description: '섬서 영향력 다툼', intensity: 'weak' },
            { targetId: 'namgung', type: '협력', description: '검문 교류', intensity: 'normal', history: '대검과 제왕검의 합벽 연구' },
            { targetId: 'shaolin', type: '우호', description: '무림맹 참여', intensity: 'normal' }
        ],
        history: '화산파와 함께 섬서의 패권을 다투며, 묵직하고 정순한 검을 추구한다.'
    },
    {
        id: 'gaebang',
        code: 'J',
        name: '개방 (丐幇)',
        hanja: '丐幇',
        category: 'orthodox',
        desc: '항룡십팔장. 가장 낮은 곳에서 피어난 의기, 용의 형상으로 폭발한다.',
        colors: { primary: '#6D4C2E', secondary: '#C9A86C', accent: '#DAA520' },
        effectType: '항룡장기',
        particleCount: 150,
        philosophy: '협의무쌍(俠義無雙). 가진 것 없어도 의협심 하나로 천하를 논한다.',
        signature_skills: ['항룡십팔장', '타구봉법', '취권', '연화락'],
        leader: 'hongryeon',
        locations: [
            { name: '총타', hanja: '總舵', x: 60, y: 50, type: '본산' }
        ],
        relations: [
            { targetId: 'haomun', type: '숙적', description: '천하 정보망 패권 다툼', intensity: 'strong', history: '거지와 왈패의 숙명적 대립' },
            { targetId: 'shaolin', type: '협력', description: '무림맹 상임 이사방', intensity: 'normal', history: '소림의 정보 도구로 이용당함' },
            { targetId: 'sapa_union', type: '적대', description: '녹림도 토벌 선봉', intensity: 'normal' },
            { targetId: 'salsu', type: '적대', description: '암살단 추적', intensity: 'normal' },
            { targetId: 'ami', type: '협력', description: '정보 공유', intensity: 'weak' },
            { targetId: 'wudang', type: '우호', description: '의협 교류', intensity: 'weak' },
            { targetId: 'imperial', type: '암투', description: '표면 협력, 실제 감시', intensity: 'normal', history: '관부의 감시를 경계' },
            { targetId: 'namgung', type: '우호', description: '표면 정보 제공', intensity: 'weak', history: '세가에게 하대받음' },
            { targetId: 'habuk', type: '협력', description: '정보 교환', intensity: 'weak', history: '팥가에게 하수 취급' }
        ],
        history: '거지들의 집단이나 그 정보력과 단결력은 천하제일이다.'
    },
    
    // 2. 오대세가 (혈통의 힘)
    {
        id: 'namgung',
        code: 'K',
        name: '남궁세가 (南宮)',
        hanja: '南宮',
        category: 'orthodox',
        desc: '창궁무애. 제왕의 검이 향하는 곳에 오직 복종만이 있을 뿐이다.',
        colors: { primary: '#2471A3', secondary: '#D4AC0D', accent: '#F4F6F7' },
        effectType: '제왕검기',
        particleCount: 100,
        philosophy: '왕도패업(王道覇業). 검으로 다스리고 힘으로 굴복시킨다.',
        signature_skills: ['제왕검형', '창궁무애검', '천뢰검공', '대자연검'],
        leader: 'namgung_hyeon',
        locations: [
            { name: '안휘성', hanja: '安徽省', x: 62, y: 48, type: '본산' }
        ],
        relations: [
            { targetId: 'moyong', type: '숙적', description: '오대세가 수좌 자리 쟁탈', intensity: 'strong', since: '200년 전', history: '무림맹주 자리를 두고 대대로 경쟁' },
            { targetId: 'habuk', type: '혼인', description: '삼대에 걸친 정략결혼', intensity: 'strong', history: '팽가 여식이 대대로 남궁가로 출가' },
            { targetId: 'jegal', type: '혈맹', description: '전략적 군사 동맹', intensity: 'strong', history: '검과 지략의 결합' },
            { targetId: 'hwasan', type: '경쟁', description: '천하제일검 다툼', intensity: 'normal' },
            { targetId: 'sacheon', type: '암투', description: '강호 영향력 경쟁', intensity: 'weak' },
            { targetId: 'shaolin', type: '우호', description: '무림맹 후원', intensity: 'normal' },
            { targetId: 'jongnam', type: '협력', description: '대검 교류', intensity: 'weak' },
            { targetId: 'cheonma', type: '적대', description: '정마대전 선봉', intensity: 'strong' }
        ],
        history: '오대세가의 수좌. 검에 살고 검에 죽는 명실상부한 검의 명가.'
    },
    {
        id: 'sacheon',
        code: 'L',
        name: '사천당가 (唐門)',
        hanja: '唐門',
        category: 'orthodox',
        desc: '만천화우. 아름다운 꽃비 뒤에 숨겨진 치명적인 맹독의 향연.',
        colors: { primary: '#1D8348', secondary: '#6C3483', accent: '#82E0AA' },
        effectType: '독기',
        particleCount: 400,
        philosophy: '미와 죽음은 한 끗 차이. 독도 예술이 될 수 있다.',
        signature_skills: ['만천화우', '비도술', '독사지옥', '천라지망'],
        leader: 'dang_bi',
        locations: [
            { name: '사천성', hanja: '四川省', x: 38, y: 55, type: '본산' }
        ],
        relations: [
            { targetId: 'cheongseong', type: '숙적', description: '사천 독왕 칭호 분쟁', intensity: 'strong', history: '독공 정통성을 두고 백년 대립' },
            { targetId: 'ami', type: '암투', description: '파촉 영향력 경쟁', intensity: 'normal' },
            { targetId: 'jeomchang', type: '경쟁', description: '서남 독문 경쟁', intensity: 'normal' },
            { targetId: 'salsu', type: '밀약', description: '독약 공급 계약', intensity: 'weak', history: '비밀리에 맹독 거래' },
            { targetId: 'moyong', type: '원한', description: '독공 비급 유출 의혹', intensity: 'weak', history: '50년 전 만천화우 비급 도난 사건' },
            { targetId: 'namgung', type: '암투', description: '세가 영향력 경쟁', intensity: 'weak' },
            { targetId: 'blood_sect', type: '적대', description: '독혈공 도용 응징', intensity: 'strong', history: '혈교가 당가 독공을 왜곡 사용' }
        ],
        history: '암기와 독을 다루는 무림의 공포 대상. 여인들이 주축이 되어 이끈다.'
    },
    {
        id: 'habuk',
        code: 'M',
        name: '하북팽가 (彭家)',
        hanja: '彭家',
        category: 'orthodox',
        desc: '오호단문도. 맹수의 포효와 함께 모든 걸 부숴버리는 패도의 도법.',
        colors: { primary: '#D35400', secondary: '#6E2C00', accent: '#E74C3C' },
        effectType: '화염',
        particleCount: 100,
        philosophy: '힘이 곧 정의다. 압도적인 무력 앞에 기교는 무의미하다.',
        signature_skills: ['오호단문도', '혼원벽', '파산도', '광풍도법'],
        leader: 'paeng_wol',
        locations: [
            { name: '하북성', hanja: '河北省', x: 58, y: 35, type: '본산' }
        ],
        relations: [
            { targetId: 'namgung', type: '혼인', description: '삼대 정략결혼, 혈연 동맹', intensity: 'strong', history: '대대로 여식이 남궁세가로 출가. 실제로는 남궁의 하수 취급.' },
            { targetId: 'moyong', type: '경쟁', description: '북방 패권 경쟁', intensity: 'normal', history: '모용의 음험함 경계' },
            { targetId: 'jegal', type: '협력', description: '오대세가 연합', intensity: 'normal', history: '제갈의 지략 덕분에 위기 탈출' },
            { targetId: 'shaolin', type: '우호', description: '표면 우호, 실제 문파 하대', intensity: 'weak', history: '세가는 문파를 하수로 본다' },
            { targetId: 'cheonma', type: '적대', description: '북방 마교 저지선', intensity: 'strong' },
            { targetId: 'north_ice', type: '적대', description: '북방 영토 분쟁', intensity: 'strong', history: '빙궁의 영지 침탈 시도 격퇴' },
            { targetId: 'gaebang', type: '협력', description: '정보 제공', intensity: 'weak', history: '개방 거지를 이용하나 대등하게 보지 않음' }
        ],
        history: '도법의 명가. 호탕하고 거친 가풍으로 유명하다.'
    },
    {
        id: 'moyong',
        code: 'N',
        name: '모용세가 (慕容)',
        hanja: '慕容',
        category: 'orthodox',
        desc: '이피지도 환시피신. 너의 힘은 곧 나의 힘, 우아한 반사의 미학.',
        colors: { primary: '#5B2C6F', secondary: '#D7BDE2', accent: '#BDC3C7' },
        effectType: '물결',
        particleCount: 120,
        philosophy: '이피지도(以彼之道). 상대의 수법으로 상대를 제압한다.',
        signature_skills: ['두전성이', '참합지', '모용검법', '수류검'],
        leader: 'moyong_hui',
        locations: [
            { name: '요녕성', hanja: '遼寧省', x: 72, y: 52, type: '본산' }
        ],
        relations: [
            { targetId: 'namgung', type: '숙적', description: '오대세가 수좌 쟁탈, 천년 라이벌', intensity: 'strong', since: '200년 전', history: '이피지도로 남궁검법 복제 시도' },
            { targetId: 'hwasan', type: '원한', description: '검보 도난', intensity: 'normal', history: '100년 전 화산검보 실종 연루설 사실' },
            { targetId: 'sacheon', type: '원한', description: '비급 유출', intensity: 'normal', history: '만천화우 비급 습득 의혹 사실' },
            { targetId: 'habuk', type: '경쟁', description: '북방 세가 영향력', intensity: 'normal', history: '클박한 팥가를 내심 멸시' },
            { targetId: 'jegal', type: '숙적', description: '지략 대결', intensity: 'strong', history: '수차례 모략전에서 패배' },
            { targetId: 'imperial', type: '종속', description: '황실 앨잡이', intensity: 'normal', history: '관부와의 비밀 협정, 무림 정보 제공' },
            { targetId: 'cheonma', type: '적대', description: '마교 토벌', intensity: 'normal', history: '실제로는 마교와도 밀약' },
            { targetId: 'north_ice', type: '적대', description: '영지 침탈', intensity: 'normal', history: '북방 영지 수비 중' }
        ],
        history: '몰락한 왕족의 후예. 우아함 속에 날카로운 비수를 감추고 있다.'
    },
    {
        id: 'jegal',
        code: 'O',
        name: '제갈세가 (諸葛)',
        hanja: '諸葛',
        category: 'orthodox',
        desc: '천기누설. 보이지 않는 진법과 함정으로 전장을 지배하는 지략가들.',
        colors: { primary: '#F5EEE0', secondary: '#7D6608', accent: '#C4B896' },
        effectType: '성진',
        particleCount: 150,
        philosophy: '지략이 무력을 이긴다. 싸우지 않고 이기는 것이 최선이다.',
        signature_skills: ['팔진도', '기문둔갑', '천기누설', '백단선'],
        leader: 'jegal_rin',
        locations: [
            { name: '호북성', hanja: '湖北省', x: 55, y: 58, type: '본산' }
        ],
        relations: [
            { targetId: 'namgung', type: '혈맹', description: '검과 지략의 결합, 최강 동맹', intensity: 'strong', history: '대대로 군사(軍師) 역할. 실제로는 남궁에 종속.' },
            { targetId: 'habuk', type: '협력', description: '오대세가 연합', intensity: 'normal', history: '팽가의 단순함을 이용' },
            { targetId: 'kunlun', type: '우호', description: '진법 교류', intensity: 'weak', history: '팔진도와 건곤진의 합진 연구' },
            { targetId: 'kongdong', type: '협력', description: '성진 합동 연구', intensity: 'weak' },
            { targetId: 'moyong', type: '숙적', description: '두뇌 싸움의 라이벌', intensity: 'strong', history: '모략전에서 수차례 승리' },
            { targetId: 'shaolin', type: '우호', description: '표면 우호, 무림맹 참모단', intensity: 'normal', history: '실제로는 남궁의 눈치 살피는 처지' },
            { targetId: 'cheonma', type: '적대', description: '정마대전 전략 수립', intensity: 'strong' },
            { targetId: 'imperial', type: '암투', description: '표면 협력, 실제 경계', intensity: 'weak', history: '관부 눈치 살피는 중' }
        ],
        history: '무림의 머리. 두뇌 싸움과 기관진식의 대가들.'
    },

    // 3. 사파 & 마교 & 혈교
    {
        id: 'sapa_union',
        code: 'P',
        name: '녹림 (綠林)',
        hanja: '綠林',
        category: 'unorthodox',
        desc: '약육강식. 산과 물, 뒷골목을 지배하는 거친 야성의 법칙.',
        colors: { primary: '#3D5C45', secondary: '#5D4037', accent: '#8D6E63' },
        effectType: '녹림기',
        particleCount: 160,
        philosophy: '약육강식. 강한 자가 모든 것을 갖는다. 의리? 이익 앞에선 무의미.',
        signature_skills: ['녹림도법', '선풍도', '야전술', '투망술'],
        leader: 'dokgopyo',
        locations: [
            { name: '태산', hanja: '泰山', x: 48, y: 52, type: '본산' }
        ],
        relations: [
            { targetId: 'imperial', type: '숙적', description: '관부의 영원한 토벌 대상', intensity: 'strong', history: '수백 년간 끊임없는 토벌전' },
            { targetId: 'suro', type: '협력', description: '산적과 해적의 동맹', intensity: 'normal', history: '육지와 물길의 분할 지배. 언제든 배신 가능.' },
            { targetId: 'haomun', type: '암투', description: '뒷세계 패권 다투', intensity: 'normal', history: '협력하면서도 서로 기회 노림' },
            { targetId: 'gaebang', type: '적대', description: '정보전 대립', intensity: 'normal' },
            { targetId: 'jeomchang', type: '적대', description: '운남 지역 충돌', intensity: 'normal' },
            { targetId: 'cheonma', type: '종속', description: '마교 휘하 편입', intensity: 'normal', history: '녹림 일부 산채가 마교에 복속' },
            { targetId: 'salsu', type: '협력', description: '암살 의뢰 관계', intensity: 'weak', history: '서로 이용하는 관계' },
            { targetId: 'namgung', type: '적대', description: '세가 상단 습격', intensity: 'strong', history: '남궁세가 토벌대에 대항' },
            { targetId: 'blood_sect', type: '밀약', description: '사교와도 거래', intensity: 'weak', history: '이익이면 사교와도 손잡는다' }
        ],
        history: '산적들의 연합체. 거칠고 투박하지만 그들만의 의리가 있다.'
    },
    {
        id: 'suro',
        code: 'Q',
        name: '수로채 (水路)',
        hanja: '水路',
        category: 'unorthodox',
        desc: '장강의 주인. 깊은 물속으로 끌고 들어가는 질식의 공포.',
        colors: { primary: '#1A5276', secondary: '#154360', accent: '#48C9B0' },
        effectType: '물결',
        particleCount: 300,
        philosophy: '수류무정. 물은 자비가 없다.',
        signature_skills: ['삼지창술', '잠영공', '격랑권', '수룡탄'],
        leader: 'suryeon',
        locations: [
            { name: '장강', hanja: '長江', x: 60, y: 55, type: '본산' }
        ],
        relations: [
            { targetId: 'sapa_union', type: '협력', description: '녹림의 형제, 육해 분할 동맹', intensity: 'normal', history: '산적은 산, 해적은 강. 이익 따라 배신 가능.' },
            { targetId: 'haomun', type: '협력', description: '수로 정보 공유', intensity: 'normal', history: '서로 이용하는 관계' },
            { targetId: 'namgung', type: '적대', description: '장강 통행료 분쟁', intensity: 'strong', history: '남궁세가 상단 습격 사건' },
            { targetId: 'imperial', type: '숙적', description: '수군 토벌 대상', intensity: 'strong', history: '관부 수군과 수십 년 전쟁' },
            { targetId: 'cheonma', type: '밀약', description: '마교 물자 운송', intensity: 'weak', history: '비밀 운송로 제공. 언제든 배신 가능.' },
            { targetId: 'blood_sect', type: '밀약', description: '혈교 물자 운송', intensity: 'weak', history: '돈이면 사교도 태운다' },
            { targetId: 'jeomchang', type: '적대', description: '운남 하운 충돌', intensity: 'normal', history: '점창 하운 습격' }
        ],
        history: '장강 수로를 지배하는 해적단. 물 위에서는 천하무적.'
    },
    {
        id: 'haomun',
        code: 'R',
        name: '하오문 (下汚)',
        hanja: '下汚',
        category: 'unorthodox',
        desc: '이목구비. 세상의 가장 더러운 곳에서 핀 정보의 꽃.',
        colors: { primary: '#4A235A', secondary: '#1C1C1C', accent: '#AF7AC5' },
        effectType: '안개',
        particleCount: 400,
        philosophy: '정보가 곧 힘이다. 세상에 비밀은 없다.',
        signature_skills: ['매혹술', '독연', '은신술', '소매치기'],
        leader: 'honglu',
        locations: [
            { name: '낙양 뒷골목', hanja: '洛陽', x: 55, y: 50, type: '본산' }
        ],
        relations: [
            { targetId: 'gaebang', type: '숙적', description: '천하 정보망 패권 대결', intensity: 'strong', history: '밑바닥 정보전의 영원한 라이벌' },
            { targetId: 'sapa_union', type: '협력', description: '뒷세계 연대', intensity: 'normal' },
            { targetId: 'suro', type: '협력', description: '수로 정보 거래', intensity: 'normal' },
            { targetId: 'cheongseong', type: '밀약', description: '독과 정보 교환', intensity: 'weak' },
            { targetId: 'salsu', type: '협력', description: '표적 정보 제공', intensity: 'normal', history: '암살 대상 정보 거래' },
            { targetId: 'moyong', type: '밀약', description: '첩보 거래', intensity: 'weak', history: '모용세가에 정보 판매' },
            { targetId: 'imperial', type: '밀약', description: '이중 첩자', intensity: 'weak', history: '관부 밀정 의혹' }
        ],
        history: '기녀, 점소이, 왈패 등 밑바닥 인생들의 조직. 정보력이 무기다.'
    },
    {
        id: 'salsu',
        code: 'S',
        name: '살수막 (殺手)',
        hanja: '殺手',
        category: 'unorthodox',
        desc: '무영무종. 그림자 속에서 찾아오는 소리 없는 죽음.',
        colors: { primary: '#17202A', secondary: '#2E4053', accent: '#C0392B' },
        effectType: '암영',
        particleCount: 50,
        philosophy: '의뢰 완수. 감정을 지우고 오직 목표만을 제거한다.',
        signature_skills: ['무영암살술', '비도술', '은형법', '살수검'],
        leader: 'mumyeong',
        locations: [
            { name: '불명', hanja: '不明', x: 45, y: 45, type: '본산' }
        ],
        relations: [
            { targetId: 'imperial', type: '숙적', description: '관부 척살 순위 1위', intensity: 'strong', history: '수많은 관료 암살' },
            { targetId: 'sacheon', type: '밀약', description: '맹독 공급 계약', intensity: 'normal', history: '당가 독약 비밀 구매' },
            { targetId: 'cheongseong', type: '협력', description: '독과 암살의 연계', intensity: 'weak' },
            { targetId: 'haomun', type: '협력', description: '정보 제공 대가', intensity: 'normal' },
            { targetId: 'cheonma', type: '종속', description: '마교 암살단 역할', intensity: 'weak', history: '마교 하청 암살' },
            { targetId: 'sapa_union', type: '협력', description: '암살 의뢰', intensity: 'weak' },
            { targetId: 'gaebang', type: '적대', description: '추적 대상', intensity: 'normal' },
            { targetId: 'blood_sect', type: '협력', description: '암흑 거래', intensity: 'weak', history: '특수 임무 협력' }
        ],
        history: '돈을 받고 사람을 죽이는 암살 집단. 그 실체는 베일에 싸여 있다.'
    },
    {
        id: 'cheonma',
        code: 'T',
        name: '천마신교 (天魔)',
        hanja: '天魔',
        category: 'demonic',
        desc: '천상천하 유아독존. 검은 불꽃(黑炎)으로 세상을 태우는 절대자.',
        colors: { primary: '#1B1B1B', secondary: '#B71C1C', accent: '#E53935' },
        effectType: '흑염',
        particleCount: 200,
        philosophy: '힘이 곧 진리. 약자는 강자에게 복종해야 한다.',
        signature_skills: ['천마신공', '흑염장', '흡성대법', '천마군림보'],
        leader: 'cheonma',
        locations: [
            { name: '천마신궁', hanja: '天魔神宮', x: 30, y: 35, type: '본산' }
        ],
        relations: [
            { targetId: 'shaolin', type: '숙적', description: '정마대전의 불구대천 원수', intensity: 'strong', history: '수차례 정마대전의 주적' },
            { targetId: 'wudang', type: '적대', description: '정마대전 주력', intensity: 'strong' },
            { targetId: 'blood_sect', type: '숙적', description: '마도(魔道) 정통성 분쟁', intensity: 'strong', history: '흡혈사교와 천마숭배의 노선 대립' },
            { targetId: 'sapa_union', type: '종속', description: '사파 세력 흡수', intensity: 'normal', history: '녹림 일부 산채 복속' },
            { targetId: 'suro', type: '밀약', description: '비밀 운송', intensity: 'weak' },
            { targetId: 'salsu', type: '종속', description: '암살단 휘하 편입', intensity: 'normal', history: '살수막 일부 마교 소속' },
            { targetId: 'namgung', type: '적대', description: '중원 침공 저지선', intensity: 'strong' },
            { targetId: 'kunlun', type: '적대', description: '서역 세력권 충돌', intensity: 'normal' },
            { targetId: 'imperial', type: '적대', description: '황권 도전', intensity: 'strong' },
            { targetId: 'north_ice', type: '밀약', description: '새외 세력 협정', intensity: 'weak', history: '중원 분할 밀약설' }
        ],
        history: '천마를 신격화하는 광신 집단. 절대 복종과 힘의 숭배가 교리이다.'
    },
    {
        id: 'blood_sect',
        code: 'U',
        name: '혈교 (血敎)',
        hanja: '血敎',
        category: 'demonic',
        desc: '혈해만리. 피를 탐하고 육신을 조작하는 금단의 마공.',
        colors: { primary: '#641E16', secondary: '#1A1A1A', accent: '#E74C3C' },
        effectType: '혈기',
        particleCount: 500,
        philosophy: '피는 생명의 근원. 피를 통해 영생과 힘을 얻는다.',
        signature_skills: ['혈요공', '혈수공', '시해술', '혈조'],
        leader: 'hyeolma',
        locations: [
            { name: '혈굴', hanja: '血窟', x: 35, y: 30, type: '본산' }
        ],
        relations: [
            { targetId: 'shaolin', type: '적대', description: '무림 공적 1호', intensity: 'strong', history: '사교(邪敎)로 규정' },
            { targetId: 'cheonma', type: '숙적', description: '마도 정통성 분쟁', intensity: 'strong', history: '흡혈술과 천마공의 노선 대립, 혈교도 척살 사건' },
            { targetId: 'sacheon', type: '적대', description: '독혈공 도용 앙갚음', intensity: 'strong' },
            { targetId: 'salsu', type: '협력', description: '암흑 거래', intensity: 'normal', history: '혈교 암살 의뢰' },
            { targetId: 'imperial', type: '적대', description: '황실 척결 대상', intensity: 'strong' },
            { targetId: 'gaebang', type: '적대', description: '정파 토벌 대상', intensity: 'normal' },
            { targetId: 'beast_palace', type: '밀약', description: '사혈술 연구 교류', intensity: 'normal', history: '야수의 피를 이용한 혈공 연구' },
            { targetId: 'wudang', type: '적대', description: '도가의 척결 대상', intensity: 'strong' },
            { targetId: 'namgung', type: '적대', description: '세가 토벌대', intensity: 'normal' }
        ],
        history: '피를 탐하고 인체를 개조하는 사교. 천마신교와는 마도 정통성을 두고 대립한다.'
    },
    {
        id: 'imperial',
        code: 'V',
        name: '관부 (官府)',
        hanja: '官府',
        category: 'imperial',
        desc: '황법무친. 황제의 명을 받들어 무림을 감시하고 심판한다.',
        colors: { primary: '#D4AC0D', secondary: '#7B241C', accent: '#1C2833' },
        effectType: '황권',
        particleCount: 100,
        philosophy: '황권지상. 무림인은 모두 잠재적 역적이다. 고수는 통제하거나 말살한다.',
        signature_skills: ['규화보전', '창룡출두', '포박술', '금의위검'],
        leader: 'wichung',
        locations: [
            { name: '자금성', hanja: '紫禁城', x: 65, y: 30, type: '본산' }
        ],
        relations: [
            { targetId: 'sapa_union', type: '숙적', description: '녹림 영구 토벌', intensity: 'strong', history: '산적은 역적, 발본색원' },
            { targetId: 'salsu', type: '숙적', description: '암살단 척살 1순위', intensity: 'strong', history: '관료 암살 다수로 현상금 최고' },
            { targetId: 'cheonma', type: '숙적', description: '황권에 대한 도전', intensity: 'strong', history: '마교 토벌 칙령 발동' },
            { targetId: 'blood_sect', type: '숙적', description: '사교 척결', intensity: 'strong', history: '인륜을 어지럽히는 사교로 규정' },
            { targetId: 'suro', type: '적대', description: '해적 토벌', intensity: 'strong', history: '수군 동원 소탕전' },
            { targetId: 'gaebang', type: '암투', description: '정보 통제 vs 민간 정보망', intensity: 'normal', history: '개방 정보원 회유/색출' },
            { targetId: 'haomun', type: '종속', description: '밀정 조직으로 활용', intensity: 'normal', history: '하오문 간부 다수가 관부 밀정' },
            { targetId: 'moyong', type: '밀약', description: '황실 밀착 세가', intensity: 'normal', history: '모용세가 황실 복고 야망 이용' },
            { targetId: 'shaolin', type: '암투', description: '표면 협력, 실제 감시', intensity: 'normal', history: '무림맹 동향 감시' },
            { targetId: 'namgung', type: '암투', description: '세가 세력 견제', intensity: 'weak', history: '지나친 무력 집중 경계' },
            { targetId: 'hidden_masters', type: '적대', description: '은거 고수 색출', intensity: 'normal', history: '관부 관할 밖 고수 사냥' }
        ],
        history: '황제의 칼. 무림인을 잠재적 역적으로 보며 고수를 통제하거나 제거한다.'
    },

    // 5. 새외 & 기인
    {
        id: 'north_ice',
        code: 'W',
        name: '북해빙궁 (北海)',
        hanja: '北海',
        category: 'outer',
        desc: '빙설천하. 모든 것을 얼려 영원히 보존하는 절대 영도의 세계.',
        colors: { primary: '#D6EAF8', secondary: '#F4F6F7', accent: '#5DADE2' },
        effectType: '빙설',
        particleCount: 500,
        philosophy: '빙한천하(氷寒天下). 중원은 따뜻하고 약하다. 얼려서 지배한다.',
        signature_skills: ['빙백신공', '한빙장', '백색창', '빙결계'],
        leader: 'bingyeo',
        locations: [
            { name: '북해빙궁', hanja: '北海氷宮', x: 55, y: 15, type: '본산' }
        ],
        relations: [
            { targetId: 'beast_palace', type: '숙적', description: '빙염상극, 천년 원수', intensity: 'strong', history: '얼음과 불의 상극 관계' },
            { targetId: 'habuk', type: '적대', description: '북방 영토 침공', intensity: 'strong', history: '하북팥가 영지 침탈 시도' },
            { targetId: 'kunlun', type: '밀약', description: '서역 정보 교환', intensity: 'weak', history: '중원 침공 정보 수집' },
            { targetId: 'cheonma', type: '동맹', description: '중원 분할 밀약', intensity: 'normal', history: '마교와 중원 양분 논의' },
            { targetId: 'moyong', type: '적대', description: '북방 세가 침탈', intensity: 'normal', history: '모용세가 영지 약탈 시도' },
            { targetId: 'shaolin', type: '적대', description: '중원 정파와 경계', intensity: 'normal', history: '빙궁 세력 확장 견제' },
            { targetId: 'namgung', type: '적대', description: '세가 영지 침범', intensity: 'normal', history: '남궁세가 북방 상단 습격' },
            { targetId: 'hidden_masters', type: '협력', description: '은둔 고수와 교류', intensity: 'weak' }
        ],
        history: '북방의 얼음 궁전. 중원과는 다른 독자적인 무공 체계를 가졌다.'
    },
    {
        id: 'beast_palace',
        code: 'X',
        name: '남만야수궁 (野獸)',
        hanja: '野獸',
        category: 'outer',
        desc: '약육강식. 짐승의 본능으로 적을 사냥하고 찢어발긴다.',
        colors: { primary: '#A04000', secondary: '#6E2C00', accent: '#873600' },
        effectType: '야수기',
        particleCount: 180,
        philosophy: '야수의 법칙. 약한 자는 먹이다. 중원인은 사냥감일 뿐.',
        signature_skills: ['백수권', '야수변신', '조련술', '비스트'],
        leader: 'mengho',
        locations: [
            { name: '남만', hanja: '南蠻', x: 40, y: 75, type: '본산' }
        ],
        relations: [
            { targetId: 'north_ice', type: '숙적', description: '빙염상극, 불구대천', intensity: 'strong', history: '얼음과 불의 상극, 천년 전쟁' },
            { targetId: 'blood_sect', type: '협력', description: '사혈술 연구', intensity: 'normal', history: '야수의 피를 이용한 혈공 연구' },
            { targetId: 'sapa_union', type: '협력', description: '남방 약탈 공조', intensity: 'normal', history: '녹림과 남방 약탈품 분배' },
            { targetId: 'shaolin', type: '적대', description: '중원 침공', intensity: 'normal', history: '중원 남부 약탈 사건' },
            { targetId: 'ami', type: '적대', description: '서남 영역 충돌', intensity: 'normal', history: '아미파 영역 침범' },
            { targetId: 'sacheon', type: '적대', description: '남방 세가 침탈', intensity: 'normal', history: '당가 상단 습격' },
            { targetId: 'hidden_masters', type: '협력', description: '야생 은둔자 교류', intensity: 'weak' },
            { targetId: 'cheonma', type: '밀약', description: '중원 남북 양면 공격 논의', intensity: 'weak', history: '마교와 중원 남북 동시 침공 모의' }
        ],
        history: '맹수와 교감하며 야생의 힘을 사용하는 남만의 전사들.'
    },
    {
        id: 'hidden_masters',
        code: 'Y',
        name: '은거기인 (奇人)',
        hanja: '奇人',
        category: 'hidden',
        desc: '낭중지추. 숨어 있어도 그 비범함은 감출 수 없다.',
        colors: { primary: '#626567', secondary: '#BDC3C7', accent: '#ECF0F1' },
        effectType: '초월기',
        particleCount: 80,
        philosophy: '자유와 파격. 형식에 구애받지 않는 나만의 길을 간다.',
        signature_skills: ['전전긍긍', '비전무공', '잡기', '기문둔갑'],
        leader: 'baekun',
        locations: [
            { name: '무명봉', hanja: '無名', x: 42, y: 40, type: '본산' }
        ],
        relations: [
            { targetId: 'shaolin', type: '우호', description: '은둔 고승과 교류', intensity: 'weak' },
            { targetId: 'wudang', type: '우호', description: '은거 도인과 교류', intensity: 'weak' },
            { targetId: 'north_ice', type: '협력', description: '새외 은둔자 교류', intensity: 'weak' },
            { targetId: 'beast_palace', type: '협력', description: '야생 은둔자 교류', intensity: 'weak' },
            { targetId: 'jegal', type: '원한', description: '과거 인연', intensity: 'weak', history: '제갈세가 출신 은거기인과의 악연' }
        ],
        history: '강호에 숨어 사는 기인들. 그들의 힘은 측정할 수 없다.'
    }
];

export const getFactionById = (id: string) => FACTIONS.find(f => f.id === id);

export const getFactionsByCategory = (category: FactionCategory) => 
    FACTIONS.filter(f => f.category === category);

export const getOrthodoxFactions = () => getFactionsByCategory('orthodox');
export const getUnorthodoxFactions = () => getFactionsByCategory('unorthodox');
export const getDemonicFactions = () => getFactionsByCategory('demonic');
export const getOuterFactions = () => getFactionsByCategory('outer');
export const getHiddenFactions = () => getFactionsByCategory('hidden');
export const getImperialFactions = () => getFactionsByCategory('imperial');

export const getFactionRelations = (factionId: string) => {
    const faction = getFactionById(factionId);
    return faction?.relations || [];
};

export const getAllLocations = () => {
    return FACTIONS.flatMap(faction => 
        (faction.locations || []).map(loc => ({
            ...loc,
            factionId: faction.id,
            factionName: faction.name
        }))
    );
};

export const getHeadquarters = () => {
    return getAllLocations().filter(loc => loc.type === '본산');
};
