"use client";

import {
  useEffect,
  useMemo,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

type Game = {
  title: string;
  publisher: string;
  type: "파티" | "전략" | "협력" | "추리" | "가족" | "2인";
  weight: "가볍게" | "적당히" | "깊게";
  players: string;
  time: string;
  status: "콘 신작" | "현장 공개" | "대표작";
  description: string;
  audience: string;
  video: string;
  videoId?: string;
  image?: string;
  imageCrop?: { position: string; size: string };
  source?: string;
  sourceLabel?: string;
};

type WishlistItem = {
  id: string;
  title: string;
  publisher: string;
  priority: number;
  addedAt: number;
};

const WISHLIST_STORAGE_KEY = "bgc26-wishlist-v1";
const gameId = (game: Pick<Game, "title" | "publisher">) =>
  `${game.publisher}::${game.title}`;

const sheetGame = (
  title: string,
  publisher: string,
  description: string,
  status: Game["status"] = "콘 신작",
  type: Game["type"] = "가족",
  weight: Game["weight"] = "가볍게",
  source?: string,
): Game => ({
  title,
  publisher,
  description,
  status,
  type,
  weight,
  players: "현장 안내",
  time: "현장 안내",
  audience: "공유 시트의 공개 라인업을 확인하려는 방문객",
  video: `${title} 보드게임`,
  source,
});

const mandooSource =
  "https://www.instagram.com/p/Daui3XXE4IF/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==";
const kbgSource =
  "https://www.koreaboardgames.com/magazine/menuDetail?boardCd=news&postNo=874";
const asmodeeSource =
  "https://boardlife.co.kr/bbs_detail.php?tb=board_community&bbs_num=78895&view=new";
const asmodeeScheduleSource =
  "https://boardlife.co.kr/bbs_detail.php?tb=board_community&bbs_num=78896&view=new";
const boardMEventSource =
  "https://boardlife.co.kr/bbs_detail.php?tb=board_community&bbs_num=78922&view=new&pg=3";
const mandooBoardlifeEventSource =
  "https://boardlife.co.kr/bbs_detail.php?tb=board_community&bbs_num=78921&view=new&pg=3";
const mtsEventSource =
  "https://boardlife.co.kr/bbs_detail.php?tb=board_community&bbs_num=78924&view=new&pg=3";
const plateEventSource =
  "https://boardlife.co.kr/bbs_detail.php?tb=board_community&bbs_num=78954&view=new&pg=2";
const latestBoardlifeSource =
  "https://boardlife.co.kr/bbs_detail.php?tb=board_community&bbs_num=78950";

const games: Game[] = [
  {
    title: "컴파일",
    publisher: "만두게임즈",
    type: "2인",
    weight: "적당히",
    players: "2인",
    time: "20–30분",
    status: "대표작",
    description:
      "AI 테마 덱으로 세 전선을 두고 겨루는 카드 전략전. 높은 카드는 인장, 낮은 카드는 능력으로 쓰는 선택이 핵심입니다.",
    audience: "짧고 치열한 2인전을 찾는 사람",
    video: "컴파일 보드게임",
    image: "/covers/compile-release.png",
    source: mandooSource,
  },
  {
    title: "카르디아",
    publisher: "만두게임즈",
    type: "2인",
    weight: "적당히",
    players: "2인",
    time: "20분",
    status: "대표작",
    description:
      "동시 공개한 카드의 높낮이에 따라 인장 획득과 카드 능력이 갈리는 심리전입니다.",
    audience: "블러핑과 심리전을 좋아하는 2인",
    video: "카르디아 보드게임",
    image: "/covers/cardia.png",
    source: mandooSource,
  },
  {
    title: "꼬치의 달인",
    publisher: "만두게임즈",
    type: "파티",
    weight: "가볍게",
    players: "2–4인",
    time: "10분",
    status: "대표작",
    description:
      "주문 카드와 같은 꼬치를 먼저 완성하는 실시간 순발력 게임입니다.",
    audience: "바로 꺼내 웃을 수 있는 게임을 찾는 모임",
    video: "꼬치의 달인 보드게임",
  },
  {
    title: "두냐자드의 모험",
    publisher: "코리아보드게임즈",
    type: "협력",
    weight: "가볍게",
    players: "2–5인",
    time: "15분",
    status: "콘 신작",
    description:
      "천일야화를 완성하는 실시간 협력 게임. 공식 Pick 2 체험작으로 소개됐습니다.",
    audience: "가족·입문자 협력 플레이",
    video: "두냐자드의 모험 보드게임",
    image: "/covers/kbg-dunyazad.png",
    source: kbgSource,
  },
  {
    title: "새우깡 보드게임",
    publisher: "코리아보드게임즈",
    type: "가족",
    weight: "가볍게",
    players: "2–4인",
    time: "10분",
    status: "콘 신작",
    description:
      "농심과 함께 선보이는 새우깡 테마 카드게임. 공식 Pick 4 체험작입니다.",
    audience: "어린이와 가볍게 즐길 가족",
    video: "새우깡 보드게임",
    image: "/covers/kbg-shrimp-cracker.png",
    source: kbgSource,
  },
  {
    title: "블러핏",
    publisher: "코리아보드게임즈",
    type: "파티",
    weight: "가볍게",
    players: "3–6인",
    time: "15분",
    status: "콘 신작",
    description:
      "카드 10장으로 즐기는 심리전과 베팅, 배짱 승부. 공식 Pick 3 체험작입니다.",
    audience: "상대 표정을 읽는 파티 게임 팬",
    video: "블러핏 보드게임",
    image: "/covers/kbg-blurfit.png",
    source: kbgSource,
  },
  {
    title: "데스 스테이션",
    publisher: "코리아보드게임즈",
    type: "추리",
    weight: "적당히",
    players: "2–4인",
    time: "30분",
    status: "콘 신작",
    description:
      "목숨을 건 리얼리티 퍼즐 쇼에 도전하는 게임. 공식 Pick 1 체험작입니다.",
    audience: "추리와 공간 퍼즐을 함께 좋아하는 사람",
    video: "데스 스테이션 보드게임",
    image: "/covers/kbg-death-station.png",
    source: kbgSource,
  },
  {
    title: "세티 확장: 우주기관",
    publisher: "보드피아",
    type: "전략",
    weight: "깊게",
    players: "1–4인",
    time: "90–150분",
    status: "콘 신작",
    description:
      "비대칭 우주기관 11개와 외계종족 3종, 새 프로젝트를 더하는 《세티》 확장입니다.",
    audience: "세티를 깊게 즐긴 전략 게이머",
    video: "세티 우주기관 보드게임",
    image: "/covers/seti-release.png",
    source:
      "https://boardlife.co.kr/bbs_detail.php?tb=board_news&bbs_num=16258",
  },
  {
    title: "엠버하트",
    publisher: "보드피아",
    type: "전략",
    weight: "적당히",
    players: "1–4인",
    time: "45–75분",
    status: "콘 신작",
    description:
      "일꾼을 배치해 드래곤을 구조·훈련하고 밀렵꾼과 맞서는 판타지 전략게임입니다.",
    audience: "테마 있는 일꾼 놓기 입문자",
    video: "엠버하트 보드게임",
    image: "/covers/emberheart-release.png",
    source:
      "https://boardlife.co.kr/bbs_detail.php?tb=board_news&bbs_num=16270",
  },
  {
    title: "죄악의 카니발",
    publisher: "보드피아",
    type: "파티",
    weight: "가볍게",
    players: "3–6인",
    time: "20분",
    status: "콘 신작",
    description:
      "일곱 죄악 카드를 비밀리에 고르고 주사위를 가져오며 상대를 방해하는 블러핑 게임입니다.",
    audience: "가벼운 견제와 심리전을 원하는 모임",
    video: "죄악의 카니발 보드게임",
    image: "/covers/carnival-release.png",
    source:
      "https://boardlife.co.kr/bbs_detail.php?tb=board_news&bbs_num=16270",
  },
  {
    title: "태그 팀: 아서왕 전설",
    publisher: "아스모디",
    type: "2인",
    weight: "적당히",
    players: "2인",
    time: "20–30분",
    status: "콘 신작",
    description:
      "미리 구성한 카드 순서가 자동 전투를 벌이는 2인 덱빌딩 오토배틀러. 독립 플레이가 가능합니다.",
    audience: "전투 덱빌딩을 간결하게 즐기고 싶은 2인",
    video: "태그 팀 아서왕 전설 보드게임",
    image: "/covers/asmodee-lineup-a.png",
    imageCrop: { position: "100% 20%", size: "310% auto" },
    source: asmodeeSource,
  },
  {
    title: "플라워즈",
    publisher: "보드엠",
    type: "가족",
    weight: "가볍게",
    players: "2–4인",
    time: "20분",
    status: "콘 신작",
    description:
      "숫자 카드의 등장 빈도와 배치 조건으로 꽃밭을 완성하는 카드 퍼즐입니다.",
    audience: "예쁜 테이블 게임을 원하는 가족",
    video: "플라워즈 보드게임",
    image: "/covers/flowers-release.png",
    source:
      "https://boardlife.co.kr/bbs_detail.php?tb=board_news&bbs_num=16271",
  },
  {
    title: "P.I.",
    publisher: "보드엠",
    type: "추리",
    weight: "적당히",
    players: "2–5인",
    time: "45분",
    status: "콘 신작",
    description:
      "경쟁자보다 먼저 자신의 사건을 해결해야 하는 경쟁형 추리게임입니다.",
    audience: "단서 조합과 추론을 좋아하는 사람",
    video: "P.I. 보드게임",
    image: "/covers/pi-release.png",
    source:
      "https://boardlife.co.kr/bbs_detail.php?tb=board_news&bbs_num=16271",
  },
  {
    title: "테이크 타임",
    publisher: "보드엠",
    type: "협력",
    weight: "적당히",
    players: "2–4인",
    time: "20분",
    status: "콘 신작",
    description:
      "제한된 의사소통만으로 숫자 카드를 시계 둘레에 배치하는 협력 퍼즐입니다.",
    audience: "말 없이 호흡을 맞추는 협력을 좋아하는 팀",
    video: "테이크 타임 보드게임",
    image: "/covers/taketime-release.png",
    source:
      "https://boardlife.co.kr/bbs_detail.php?tb=board_news&bbs_num=16271",
  },
  {
    title: "북타워",
    publisher: "보드엠",
    type: "협력",
    weight: "가볍게",
    players: "1–4인",
    time: "15분",
    status: "콘 신작",
    description:
      "고양이와 책을 떨어뜨리지 않도록 함께 쌓는 협력 덱스터리티입니다.",
    audience: "아이와 함께할 손기술 게임",
    video: "북타워 보드게임",
    image: "/covers/booktower-release.png",
    source:
      "https://boardlife.co.kr/bbs_detail.php?tb=board_news&bbs_num=16271",
  },
  {
    title: "원드러스 크리처",
    publisher: "MTS",
    type: "전략",
    weight: "적당히",
    players: "1–4인",
    time: "60–90분",
    status: "대표작",
    description:
      "일꾼과 생물 능력을 연계해 자신만의 엔진을 만드는 판타지 전략게임입니다.",
    audience: "생물 수집과 엔진 빌딩 팬",
    video: "원드러스 크리처 보드게임",
  },
  {
    title: "에이전트 애비뉴",
    publisher: "MTS",
    type: "2인",
    weight: "가볍게",
    players: "2인",
    time: "15분",
    status: "대표작",
    description:
      "카드 숫자와 이동을 읽어 상대 요원을 추적하는 빠른 심리전입니다.",
    audience: "짧은 2인 심리전을 찾는 사람",
    video: "에이전트 애비뉴 보드게임",
  },
  {
    title: "카르누타",
    publisher: "MTS",
    type: "전략",
    weight: "적당히",
    players: "2–4인",
    time: "60분",
    status: "대표작",
    description: "주술과 동물을 소재로 선택을 쌓아 가는 전략게임입니다.",
    audience: "테마형 중급 전략을 선호하는 사람",
    video: "카르누타 보드게임",
  },
  {
    title: "데바데 빅박스",
    publisher: "데블다이스",
    type: "전략",
    weight: "적당히",
    players: "2–4인",
    time: "—",
    status: "현장 공개",
    description:
      "데드 바이 데이라이트 보드게임 본판·확장을 정리하는 대형 수납 제품입니다.",
    audience: "데바데 보드게임 컬렉터",
    video: "데바데 보드게임 빅박스",
  },
  {
    title: "펜쏠로지",
    publisher: "게임올로지",
    type: "전략",
    weight: "가볍게",
    players: "2–4인",
    time: "20분",
    status: "현장 공개",
    description: "울타리 타일로 구역을 닫고 차지하는 영역 구성게임입니다.",
    audience: "공간 퍼즐을 깔끔하게 즐기는 사람",
    video: "펜쏠로지 보드게임",
  },
  {
    title: "네뷸라 컬러스",
    publisher: "게임올로지",
    type: "2인",
    weight: "가볍게",
    players: "2인",
    time: "15분",
    status: "현장 공개",
    description: "별 조각으로 세트와 연속 숫자를 만드는 2인 카드게임입니다.",
    audience: "작고 예쁜 2인 카드게임을 찾는 사람",
    video: "네뷸라 컬러스 보드게임",
  },
  {
    title: "다이스택",
    publisher: "보드붐",
    type: "파티",
    weight: "가볍게",
    players: "2–4인",
    time: "10분",
    status: "대표작",
    description: "주사위를 조건에 맞춰 빠르게 쌓는 손기술 게임입니다.",
    audience: "짧은 라운드의 손맛을 원하는 가족",
    video: "다이스택 보드게임",
  },
  {
    title: "점핑다이스",
    publisher: "보드붐",
    type: "파티",
    weight: "가볍게",
    players: "2–4인",
    time: "10분",
    status: "대표작",
    description: "주사위의 색과 숫자 조건을 빠르게 판단하는 순발력 게임입니다.",
    audience: "아이부터 어른까지 즐길 반응 게임",
    video: "점핑다이스 보드게임",
  },
  {
    title: "오목체스",
    publisher: "매직빈게임즈",
    type: "전략",
    weight: "적당히",
    players: "2인",
    time: "30분",
    status: "대표작",
    description:
      "군사와 기사를 움직여 먼저 오목 두 개를 완성하는 추상 전략 게임입니다. 영상 14:11 소개 장면을 반영했습니다.",
    audience: "체스와 오목 모두 좋아하는 2인",
    video: "오목체스 보드게임",
    image: "/video-stills/omok-chess-youtube.jpg",
    source: "https://youtu.be/om8G4KPQgso?si=ds66eY3VSwImR_gU&t=851",
    sourceLabel: "14:11 영상 소개 · 설명 출처 보기 ↗",
  },
  {
    title: "식스틴",
    publisher: "매직빈게임즈",
    type: "전략",
    weight: "가볍게",
    players: "2–4인",
    time: "20분",
    status: "대표작",
    description: "숫자 타일을 배치·조합하며 점수를 만드는 추상전략입니다.",
    audience: "규칙은 짧고 생각할 거리는 있는 게임 팬",
    video: "식스틴 보드게임",
  },
  {
    title: "포켓알까기",
    publisher: "조엔",
    type: "가족",
    weight: "가볍게",
    players: "2–4인",
    time: "10분",
    status: "대표작",
    description:
      "손가락으로 말을 튕겨 상대 말을 떨어뜨리는 휴대용 덱스터리티입니다.",
    audience: "어디서든 바로 꺼낼 게임을 찾는 가족",
    video: "포켓알까기 보드게임",
  },
  {
    title: "루미큐브",
    publisher: "놀이속의세상",
    type: "가족",
    weight: "가볍게",
    players: "2–4인",
    time: "30–60분",
    status: "대표작",
    description:
      "숫자 타일을 같은 숫자 그룹이나 연속 숫자 묶음으로 내려놓는 클래식입니다.",
    audience: "세대가 함께 앉는 가족 테이블",
    video: "루미큐브 보드게임",
  },
  {
    title: "어스",
    publisher: "옐로우스타게임즈",
    type: "전략",
    weight: "적당히",
    players: "1–5인",
    time: "45–90분",
    status: "대표작",
    description: "식물과 서식지 카드로 생태계 엔진을 구축하는 전략게임입니다.",
    audience: "카드 콤보를 키워 가는 엔진빌딩 팬",
    video: "어스 보드게임",
  },
  {
    title: "터미너스",
    publisher: "옐로우스타게임즈",
    type: "전략",
    weight: "적당히",
    players: "1–5인",
    time: "60–90분",
    status: "대표작",
    description: "지하철 노선을 건설하고 승객을 운송하는 전략게임입니다.",
    audience: "노선 연결과 운영 퍼즐을 좋아하는 사람",
    video: "터미너스 보드게임",
  },
  // Google 공유 시트(7월 보드게임 콘 정보)의 업체별 신작·대표작 전체 반영
  sheetGame(
    "치킨vs핫도그",
    "만두게임즈",
    "공식 부스 포스터의 ‘텐션 UP! 요즘 핫한 파티 게임’ 체험작입니다.",
    "콘 신작",
    "파티",
    "가볍게",
    mandooSource,
  ),
  sheetGame(
    "태플",
    "만두게임즈",
    "공식 부스 포스터의 ‘텐션 UP! 요즘 핫한 파티 게임’ 체험작입니다.",
    "콘 신작",
    "파티",
    "가볍게",
    mandooSource,
  ),
  sheetGame(
    "타코 쿠션 고트 치즈 피자",
    "만두게임즈",
    "공식 부스 포스터의 ‘텐션 UP! 요즘 핫한 파티 게임’ 체험작입니다.",
    "콘 신작",
    "파티",
    "가볍게",
    mandooSource,
  ),
  sheetGame(
    "루쿠스",
    "만두게임즈",
    "공식 부스 포스터의 ‘텐션 UP! 요즘 핫한 파티 게임’ 체험작입니다.",
    "현장 공개",
    "파티",
    "가볍게",
    mandooSource,
  ),
  sheetGame(
    "빙뱅붐",
    "만두게임즈",
    "공식 부스 포스터의 ‘텐션 UP! 요즘 핫한 파티 게임’ 체험작입니다.",
    "콘 신작",
    "파티",
    "가볍게",
    mandooSource,
  ),
  sheetGame(
    "고양이를 조심해!",
    "만두게임즈",
    "공식 부스 포스터의 ‘간단한데 재밌다! 캐주얼 게임’ 체험작입니다.",
    "현장 공개",
    "가족",
    "가볍게",
    mandooSource,
  ),
  sheetGame(
    "고빅",
    "만두게임즈",
    "공식 부스 포스터의 ‘간단한데 재밌다! 캐주얼 게임’ 체험작입니다.",
    "콘 신작",
    "가족",
    "가볍게",
    mandooSource,
  ),
  sheetGame(
    "냠냠냠",
    "만두게임즈",
    "공식 부스 포스터의 ‘간단한데 재밌다! 캐주얼 게임’ 체험작입니다.",
    "현장 공개",
    "가족",
    "가볍게",
    mandooSource,
  ),
  sheetGame(
    "아브라냥다브라",
    "만두게임즈",
    "공식 부스 포스터의 ‘간단한데 재밌다! 캐주얼 게임’ 체험작입니다.",
    "현장 공개",
    "가족",
    "가볍게",
    mandooSource,
  ),
  sheetGame(
    "보츠와나",
    "만두게임즈",
    "공식 부스 포스터의 ‘간단한데 재밌다! 캐주얼 게임’ 체험작입니다.",
    "현장 공개",
    "가족",
    "가볍게",
    mandooSource,
  ),
  sheetGame(
    "사그라다",
    "만두게임즈",
    "공식 부스 포스터의 ‘퀄리티 갑! 명작 게임’ 체험작입니다.",
    "대표작",
    "전략",
    "적당히",
    mandooSource,
  ),
  sheetGame(
    "17 다이스 벳",
    "만두게임즈",
    "공식 부스 포스터의 ‘퀄리티 갑! 명작 게임’ 체험작입니다. 현장 운영 게임은 상황에 따라 달라질 수 있습니다.",
    "현장 공개",
    "전략",
    "적당히",
    mandooSource,
  ),
  {
    ...sheetGame(
      "판다판다",
      "코리아보드게임즈",
      "작은 박스에 담은 큰 재미를 내세운 공식 Pick 5 체험작입니다.",
      "콘 신작",
      "가족",
      "가볍게",
      kbgSource,
    ),
    image: "/covers/kbg-small-box-lineup.png",
  },
  {
    ...sheetGame(
      "소다러브",
      "코리아보드게임즈",
      "작은 박스에 담은 큰 재미를 내세운 공식 Pick 5 체험작입니다.",
      "콘 신작",
      "가족",
      "가볍게",
      kbgSource,
    ),
    image: "/covers/kbg-small-box-lineup.png",
  },
  {
    ...sheetGame(
      "멍상블",
      "코리아보드게임즈",
      "작은 박스에 담은 큰 재미를 내세운 공식 Pick 5 체험작입니다.",
      "콘 신작",
      "가족",
      "가볍게",
      kbgSource,
    ),
    image: "/covers/kbg-small-box-lineup.png",
  },
  {
    ...sheetGame(
      "골프",
      "코리아보드게임즈",
      "고전 게임을 더 쉽고 편하게 즐기는 공식 Pick 6 체험작입니다.",
      "콘 신작",
      "가족",
      "가볍게",
      kbgSource,
    ),
    image: "/covers/kbg-golf.png",
  },
  sheetGame(
    "커피 러시",
    "코리아보드게임즈",
    "7월 15일 종합 정리에서 2인 이상 현장 추천 체험작으로 안내됐습니다.",
    "현장 공개",
    "전략",
    "적당히",
    latestBoardlifeSource,
  ),
  sheetGame(
    "캡슐 컬렉터",
    "코리아보드게임즈",
    "7월 15일 종합 정리에서 2인 이상 현장 추천 체험작으로 안내됐습니다.",
    "현장 공개",
    "가족",
    "가볍게",
    latestBoardlifeSource,
  ),
  sheetGame(
    "브러시우드",
    "코리아보드게임즈",
    "7월 15일 종합 정리에서 2인 이상 현장 추천 체험작으로 안내됐습니다.",
    "현장 공개",
    "가족",
    "가볍게",
    latestBoardlifeSource,
  ),
  sheetGame(
    "알았다오",
    "코리아보드게임즈",
    "7월 15일 종합 정리에서 2인 이상 현장 추천 체험작으로 안내됐습니다.",
    "현장 공개",
    "가족",
    "가볍게",
    latestBoardlifeSource,
  ),
  sheetGame(
    "내주세요",
    "코리아보드게임즈",
    "7월 15일 종합 정리에서 3인 이상 현장 추천 체험작으로 안내됐습니다.",
    "현장 공개",
    "파티",
    "가볍게",
    latestBoardlifeSource,
  ),
  sheetGame(
    "아브라카 후",
    "코리아보드게임즈",
    "7월 15일 종합 정리에서 3인 이상 현장 추천 체험작으로 안내됐습니다.",
    "현장 공개",
    "파티",
    "가볍게",
    latestBoardlifeSource,
  ),
  sheetGame(
    "바다숲",
    "코리아보드게임즈",
    "7월 19일 토너먼트와 함께 3인 이상 현장 추천 체험작으로 안내됐습니다.",
    "현장 공개",
    "가족",
    "가볍게",
    latestBoardlifeSource,
  ),
  sheetGame(
    "다이스 챌린저",
    "코리아보드게임즈",
    "7월 15일 종합 정리에서 3인 이상 현장 추천 체험작으로 안내됐습니다.",
    "현장 공개",
    "파티",
    "가볍게",
    latestBoardlifeSource,
  ),
  sheetGame(
    "딱 네 취향",
    "코리아보드게임즈",
    "7월 15일 종합 정리에서 4인 이상 현장 추천 체험작으로 안내됐습니다.",
    "현장 공개",
    "파티",
    "가볍게",
    latestBoardlifeSource,
  ),
  sheetGame(
    "모두 모여 포켓몬",
    "코리아보드게임즈",
    "7월 15일 종합 정리에서 4인 이상 현장 추천 체험작으로 안내됐습니다.",
    "현장 공개",
    "가족",
    "가볍게",
    latestBoardlifeSource,
  ),
  sheetGame(
    "색감과 직감",
    "코리아보드게임즈",
    "7월 15일 종합 정리에서 4인 이상 현장 추천 체험작으로 안내됐습니다.",
    "현장 공개",
    "가족",
    "가볍게",
    latestBoardlifeSource,
  ),
  {
    ...sheetGame(
      "덱커스",
      "보드피아",
      "사이버펑크 테마의 1인용 덱빌딩 게임입니다.",
      "콘 신작",
      "전략",
      "적당히",
    ),
    image: "/covers/deckers.png",
    source:
      "https://boardlife.co.kr/bbs_detail.php?tb=board_news&bbs_num=16270",
  },
  sheetGame(
    "스타워즈 언리미티드",
    "하비게임몰",
    "스타워즈 테마의 TCG입니다.",
    "대표작",
    "2인",
    "적당히",
  ),
  sheetGame(
    "건담 카드게임",
    "하비게임몰",
    "건담 테마의 TCG입니다.",
    "대표작",
    "2인",
    "적당히",
  ),
  sheetGame(
    "데바데 컬렉터스 에디션",
    "데블다이스",
    "데드 바이 데이라이트 보드게임 컬렉터스 에디션입니다.",
    "현장 공개",
    "전략",
    "적당히",
  ),
  sheetGame(
    "리스타트",
    "매직빈게임즈",
    "《식스틴》의 유럽 버전입니다.",
    "대표작",
    "전략",
  ),
  sheetGame(
    "프로마쥬",
    "옐로우스타게임즈",
    "치즈를 놓는 미들웨이트 게임으로, 치즈 모양의 특성을 시스템에 녹였습니다.",
    "대표작",
    "전략",
    "적당히",
  ),
  sheetGame(
    "스위트랜드",
    "옐로우스타게임즈",
    "비대칭 엔진빌딩·일꾼 놓기 방식의 헤비 전략게임입니다.",
    "대표작",
    "전략",
    "깊게",
  ),
  sheetGame(
    "헥서스",
    "조엔",
    "공간지각력이 필요한 게임입니다.",
    "콘 신작",
    "전략",
  ),
  sheetGame(
    "원드러스 크리처 윈터폴 확장",
    "MTS",
    "생물을 모으고 보호구역을 가꾸는 일꾼 놓기·세트 컬렉션 게임의 확장입니다.",
    "콘 신작",
    "전략",
    "적당히",
  ),
  sheetGame(
    "팜핸드",
    "MTS",
    "간단하게 즐기는 트릭테이킹 게임입니다.",
    "콘 신작",
    "2인",
  ),
  sheetGame(
    "미스터리 파티 Wave 5",
    "MTS",
    "여럿이 함께 즐기는 머더 미스터리 게임입니다.",
    "콘 신작",
    "추리",
    "적당히",
  ),
  sheetGame(
    "킵더히 확장",
    "MTS",
    "비대칭 협동 던전 디펜스·덱빌딩 게임의 확장입니다.",
    "콘 신작",
    "협력",
    "적당히",
  ),
  sheetGame(
    "스타일마스터",
    "보드엠",
    "패턴을 맞추는 게임입니다.",
    "콘 신작",
    "가족",
  ),
  sheetGame(
    "스누피 장기자랑",
    "보드엠",
    "간단한 덱빌딩과 트릭테이킹을 결합한 게임입니다.",
    "콘 신작",
    "전략",
  ),
  sheetGame(
    "헬라스 · 케이스96",
    "플레이트",
    "보드게임콘 신작으로 소개됐으며, 두 게임은 한정 수량으로 안내됩니다.",
    "콘 신작",
    "전략",
    "적당히",
    plateEventSource,
  ),
  sheetGame(
    "포테이토맨",
    "플레이트",
    "셀렉트 컨테이너 채우기 이벤트에 포함된 현장 판매 게임입니다.",
    "현장 공개",
    "파티",
    "가볍게",
    latestBoardlifeSource,
  ),
  sheetGame(
    "실버마인",
    "플레이트",
    "셀렉트 컨테이너 채우기 이벤트에 포함된 현장 판매 게임입니다.",
    "현장 공개",
    "전략",
    "가볍게",
    latestBoardlifeSource,
  ),
  sheetGame(
    "피자의 사탑",
    "플레이트",
    "셀렉트 컨테이너 채우기 이벤트에서 새로 소개된 현장 판매 게임입니다.",
    "현장 공개",
    "가족",
    "가볍게",
    latestBoardlifeSource,
  ),
  sheetGame(
    "다다다",
    "행복한 바오밥",
    "언어를 만들어 가는 협력 파티게임입니다.",
    "콘 신작",
    "협력",
  ),
  sheetGame(
    "해녀 미니 확장",
    "행복한 바오밥",
    "라이트 게임 《해녀》에 새 이벤트 카드를 더하는 확장입니다.",
    "콘 신작",
  ),
  sheetGame(
    "탑텐 TV 시트콤",
    "행복한 바오밥",
    "다섯 질문이 하나의 에피소드로 이어지는 《탑텐 TV》 게임입니다.",
    "콘 신작",
    "파티",
  ),
  sheetGame(
    "플레이 제주",
    "행복한 바오밥",
    "제주도 테마와 만칼라 형식을 결합한 게임입니다.",
    "콘 신작",
    "가족",
  ),
  sheetGame(
    "이레이저",
    "행복한 바오밥",
    "힌트가 점점 지워지는 추리 게임입니다.",
    "콘 신작",
    "추리",
  ),
  sheetGame(
    "매치매치",
    "행복한 바오밥",
    "짝을 맞추는 협력 게임입니다.",
    "콘 신작",
    "협력",
  ),
  sheetGame(
    "컬러로",
    "행복한 바오밥",
    "타일을 가져오며 펼치는 추상전략 게임입니다.",
    "콘 신작",
    "전략",
  ),
  sheetGame(
    "커버넌트",
    "아스모디",
    "제한된 액션에서 최적의 선택을 찾는 일꾼 놓기 게임입니다.",
    "콘 신작",
    "전략",
    "적당히",
  ),
  {
    ...sheetGame(
      "킹덤 크로싱",
      "아스모디",
      "쾨니히스베르크의 다리 문제를 풀어낸 전략 게임입니다.",
      "콘 신작",
      "전략",
      "적당히",
      asmodeeSource,
    ),
    image: "/covers/asmodee-lineup-a.png",
    imageCrop: { position: "0% 18%", size: "310% auto" },
  },
  {
    ...sheetGame(
      "내셔널 이코노미",
      "아스모디",
      "수요와 공급을 일꾼 놓기 방식으로 풀어낸 게임입니다.",
      "콘 신작",
      "전략",
      "적당히",
      asmodeeSource,
    ),
    image: "/covers/asmodee-lineup-a.png",
    imageCrop: { position: "50% 18%", size: "310% auto" },
  },
  {
    ...sheetGame(
      "패스 더 워드",
      "아스모디",
      "《텔레스트레이션》과 《저스트 원》의 감각을 결합한 파티게임입니다.",
      "콘 신작",
      "파티",
      "가볍게",
      asmodeeSource,
    ),
    image: "/covers/asmodee-lineup-a.png",
    imageCrop: { position: "0% 84%", size: "310% auto" },
  },
  {
    ...sheetGame(
      "코스모",
      "아스모디",
      "서로 다른 덱을 골라 즐기는 홀덤 게임으로, 비딩으로 운을 극복할 수 있습니다.",
      "콘 신작",
      "파티",
      "적당히",
      asmodeeSource,
    ),
    image: "/covers/asmodee-lineup-a.png",
    imageCrop: { position: "50% 84%", size: "310% auto" },
  },
  {
    ...sheetGame(
      "타카마치",
      "아스모디",
      "주사위로 패턴을 찾는 보드게임입니다.",
      "콘 신작",
      "가족",
      "가볍게",
      asmodeeSource,
    ),
    image: "/covers/asmodee-lineup-a.png",
    imageCrop: { position: "100% 84%", size: "310% auto" },
  },
  {
    ...sheetGame(
      "언매치드: 닌자 거북이",
      "아스모디",
      "《언매치드》에 닌자 거북이 IP를 더한 확장입니다.",
      "콘 신작",
      "2인",
      "적당히",
      asmodeeSource,
    ),
    image: "/covers/asmodee-lineup-b.png",
    imageCrop: { position: "0% 18%", size: "285% auto" },
  },
  {
    ...sheetGame(
      "암바르",
      "아스모디",
      "푸시 유어 럭과 추상전략을 결합한 게임입니다.",
      "콘 신작",
      "전략",
      "가볍게",
      asmodeeSource,
    ),
    image: "/covers/asmodee-lineup-b.png",
    imageCrop: { position: "100% 18%", size: "285% auto" },
  },
  {
    ...sheetGame(
      "캐치 스케치: 롤&메스",
      "아스모디",
      "주사위로 그림 그리기 규칙을 더하는 확장입니다.",
      "콘 신작",
      "파티",
      "가볍게",
      asmodeeSource,
    ),
    image: "/covers/asmodee-lineup-b.png",
    imageCrop: { position: "50% 100%", size: "285% auto" },
  },
  sheetGame(
    "우리들의 여름방학 · 퍼퓨머리 · 웬디, 어른이 되렴",
    "언더독게임즈",
    "일본 게임 위주의 머더 미스터리 대표작 라인업입니다.",
    "대표작",
    "추리",
    "적당히",
  ),
  sheetGame(
    "옵시디언 프로토콜",
    "라쿤펀치",
    "미니어처 게임 대표작입니다.",
    "대표작",
    "전략",
    "적당히",
  ),
  sheetGame(
    "미니와일드 시리즈 · 체이싱 앨리스",
    "피스크래프트",
    "공유 시트에 공개된 대표작 라인업입니다.",
    "대표작",
  ),
  sheetGame(
    "원카드 배틀 · 플립던전",
    "드로우",
    "공유 시트에 공개된 대표작 라인업입니다.",
    "대표작",
    "가족",
  ),
  sheetGame(
    "플랜비 · 비틀레이싱",
    "업앤업",
    "환경 교육과 보드게임을 결합한 대표작 라인업입니다.",
    "대표작",
    "가족",
  ),
  sheetGame(
    "쿡팟! · 인체인",
    "디미디움",
    "공유 시트에 공개된 대표작 라인업입니다.",
    "대표작",
    "가족",
  ),
  sheetGame(
    "멍탐정 푸들 · 미스터리 맨션 0719 · 북부대공을 암살하는 법",
    "미스터리 게임즈",
    "추리·머더 미스터리 대표작 라인업입니다.",
    "대표작",
    "추리",
    "적당히",
  ),
  sheetGame(
    "미스터리 스퀘어 시즌 3",
    "서월",
    "현장 체험형 추리 이벤트와 함께 소개되는 대표작입니다.",
    "대표작",
    "추리",
  ),
  sheetGame(
    "에이전트 블랙 로테이션",
    "올린스튜디오",
    "공유 시트에 공개된 대표작입니다.",
    "대표작",
    "전략",
  ),
  sheetGame(
    "레드 룸 · 라스트캠프",
    "보드마카브라더스",
    "공유 시트에 공개된 대표작 라인업입니다.",
    "대표작",
    "추리",
  ),
  sheetGame(
    "한강 에볼루션 · 푸드체인",
    "초이스",
    "공유 시트에 공개된 대표작 라인업입니다.",
    "대표작",
    "전략",
    "적당히",
  ),
  sheetGame(
    "평화주의 레이드",
    "문라이트 게임즈",
    "공유 시트에 공개된 대표작입니다.",
    "대표작",
    "협력",
  ),
  sheetGame(
    "점핑다이스 컬러",
    "보드붐",
    "색과 숫자 조건을 빠르게 판단하는 점핑다이스 라인업의 현장 소개작입니다.",
    "현장 공개",
    "파티",
    "가볍게",
    latestBoardlifeSource,
  ),
  sheetGame(
    "미스터리 로얄",
    "보드팝",
    "보드게임·굿즈 기획 기업의 대표작입니다.",
    "대표작",
    "추리",
  ),
  sheetGame(
    "부릉부릉 쿼카 · 도리도리 미어",
    "실버건게임즈",
    "공유 시트에 공개된 대표작 라인업입니다.",
    "대표작",
    "가족",
  ),
  sheetGame(
    "메이즐링",
    "메이즐링",
    "접는 미로를 활용한 대표작입니다.",
    "대표작",
    "가족",
  ),
  sheetGame(
    "난 오타쿠가 아니야!!",
    "오타메이커",
    "공유 시트에 공개된 대표작입니다.",
    "대표작",
    "파티",
  ),
  sheetGame(
    "문학가의 집 · 그날 그밤 · 속의 살인마",
    "유메카라",
    "공유 시트에 공개된 추리·머더 미스터리 대표작 라인업입니다.",
    "대표작",
    "추리",
    "적당히",
  ),
  sheetGame(
    "매직넘버일레븐 · 프레지던트메이커 · 항로개척자",
    "플루토게임즈",
    "공유 시트에 공개된 대표작 라인업입니다.",
    "대표작",
    "전략",
    "적당히",
  ),
];

const vendorTabs = [
  "전체",
  ...Array.from(new Set(games.map((game) => game.publisher))),
];
const vendorNotes: Record<string, string> = {
  전체: "공유 시트와 7월 15일 Boardlife 종합 정리 기준의 참가 업체·공개 신작·대표작을 한곳에서 살펴보세요.",
  만두게임즈:
    "치킨 VS 핫도그·태플·타코 쿠션 고트 치즈 피자 챌린지와 구매 수량별 증정품을 진행합니다. 카르디아 대회는 7월 18일입니다.",
  코리아보드게임즈:
    "250종 이상 쇼핑과 신작 체험 테이블 33개를 운영합니다. 17~19일 피칭데이, 18일 스플렌더 예선, 19일 바다숲 토너먼트도 확인하세요.",
  보드피아:
    "세티: 우주 기관·엠버하트·죄악의 카니발을 보드게임콘 출시작으로 소개합니다.",
  아스모디:
    "온라인콘 신작 3개 이상 구매 시 개당 1,000원 중첩 할인과 드제코 챌린지를 진행합니다. 현장 신작과 온라인콘 신작은 구분해 표기했습니다.",
  보드엠:
    "신작 할인·게임 체험·챌린지·뽑기 이벤트와 7월 19일 파러웨이 챔피언십을 진행합니다. 7월 넷째 주 온라인 보드게임콘도 예고됐습니다.",
  MTS: "체험 게임당 코인 1개(최대 4개)로 아케이드 뽑기에 참여할 수 있고, 구매 금액별 사은품·에이전트 애비뉴 및 카르누타 본선도 운영합니다.",
  플레이트:
    "《헬라스》·《케이스96》와 함께 포테이토맨·실버마인·피자의 사탑을 셀렉트 컨테이너 채우기 이벤트에서 만날 수 있습니다.",
  데블다이스:
    "데드 바이 데이라이트 빅박스를 현장에서 첫 공개합니다. 할인·금액별 사은품·탠트릭스 스피드 챌린지·럭키드로우를 진행합니다.",
  게임올로지:
    "펜쏠로지와 네뷸라 컬러스를 포함한 공간 퍼즐·2인 게임 라인업입니다.",
  보드붐:
    "전 제품 35% 할인과 점핑다이스·점핑다이스 컬러 현장 소개가 안내돼 있습니다. 《스퀘어 메이커》는 아직 판매 확정 전입니다.",
  매직빈게임즈:
    "7월 18일 첫 공식 오목체스 대회와 대회 연계 50% 할인, 신·구작 현장 할인이 진행됩니다.",
  조엔: "휴대하기 좋은 손기술 가족 게임을 소개합니다.",
  놀이속의세상:
    "7월 19일 루미큐브 초등부·일반부 대회가 안내돼 있으며, 두 부문 모두 접수 마감 상태입니다.",
  옐로우스타게임즈:
    "엔진빌딩과 노선 운영 전략게임을 확인하세요. 온라인 행사 공개작과 현장 라인업은 구분해 확인이 필요합니다.",
  "미스터리 게임즈":
    "무료 체험 작품 1개를 완료해 인증하면 UZU 350코인을 받을 수 있습니다. 제작 중 신작은 일반 판매작과 구분해 안내합니다.",
  "행복한 바오밥":
    "공개 7종의 단품·구매 단계별 할인과 플레이 제주 일러스트레이터 사인회(토·일 14:30–16:30)를 진행합니다.",
};
const vendorLinks: Record<string, { label: string; url: string }> = {
  만두게임즈: { label: "공식 부스 소개 ↗", url: mandooSource },
  코리아보드게임즈: { label: "공식 부스 소개 ↗", url: kbgSource },
  보드피아: {
    label: "신작 공개 자료 ↗",
    url: "https://boardlife.co.kr/bbs_detail.php?tb=board_news&bbs_num=16270",
  },
  보드엠: {
    label: "신작 공개 자료 ↗",
    url: "https://boardlife.co.kr/bbs_detail.php?tb=board_news&bbs_num=16271",
  },
  플레이트: { label: "보드게임콘 신작 공지 ↗", url: plateEventSource },
  아스모디: {
    label: "신작 공개 자료 ↗",
    url: "https://boardlife.co.kr/bbs_detail.php?tb=board_news&bbs_num=16288",
  },
  MTS: { label: "최신 종합 정리 ↗", url: latestBoardlifeSource },
  "행복한 바오밥": {
    label: "공유 시트 라인업 ↗",
    url: "https://docs.google.com/spreadsheets/d/1GO008TzPSP_DikyHO8XppqErtj1Zz74K2glS7N4UhLM/edit?gid=1521344712#gid=1521344712",
  },
};
const vendorFeatures: Record<
  string,
  { image: string; title: string; description: string; source: string }
> = {
  만두게임즈: {
    image: "/covers/mandoo-booth-lineup-2026.jpg",
    title: "공식 신작 체험 라인업",
    description:
      "도파민 폭발 신작부터 베스트셀러 파티 게임까지. 공식 게시물에 표시된 14종의 체험 게임을 분류별로 확인하세요.",
    source: mandooSource,
  },
};
const vendorEvents: Record<
  string,
  {
    image: string;
    date: string;
    title: string;
    location: string;
    description: string;
    source: string;
  }
> = {
  아스모디: {
    image: "/covers/asmodee-djeco-schedule.jpg",
    date: "07.18 SAT · 13:00–17:00",
    title: "아스모 플레이 · DJECO 챌린지",
    location: "COEX 3F · 컨퍼런스룸 318호",
    description:
      "미스테릭스 · 룰고기 친구들 · 출동 로켓 구조대의 3종 미션. 참여만 해도 할인 쿠폰을 받고, 2개 이상 성공하면 보드게임을 받을 수 있습니다.",
    source: asmodeeScheduleSource,
  },
};
type BoothPoster = {
  image: string;
  title: string;
  description: string;
  source: string;
};
const mandooEventSource =
  "https://www.instagram.com/p/Daui3XXE4IF/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==";
const boothPosters: Record<string, BoothPoster[]> = {
  만두게임즈: [
    {
      image: "/booth-posters/image12.jpg",
      title: "체험 도전 · 랜덤 선물",
      description:
        "치킨 vs 핫도그 대결, 태플 챌린지, 타코 쿠션 고트 치즈 피자 테이블 1등에게 현장 선물을 안내합니다.",
      source: mandooEventSource,
    },
    {
      image: "/booth-posters/image15.jpg",
      title: "콘 특가 · 구매 사은품",
      description:
        "보드게임 200여 종 특가와 구매 금액·제품별 증정품을 확인할 수 있습니다.",
      source: mandooEventSource,
    },
    {
      image: "/booth-events/mandoo-event-01.jpg",
      title: "구매 수량별 증정",
      description: "현장에서 게임 구매 수량에 따라 제공되는 증정품 안내입니다.",
      source: mandooBoardlifeEventSource,
    },
    {
      image: "/booth-events/mandoo-event-02.jpg",
      title: "구매 금액별 증정",
      description: "현장 구매 금액 구간별로 받을 수 있는 증정품을 안내합니다.",
      source: mandooBoardlifeEventSource,
    },
    {
      image: "/booth-events/mandoo-event-03.jpg",
      title: "챌린지 대결 · 신작 체험",
      description:
        "참여형 챌린지와 신작 체험 이벤트를 한 장으로 확인할 수 있습니다.",
      source: mandooBoardlifeEventSource,
    },
  ],
  코리아보드게임즈: [
    {
      image: "/booth-posters/image8.jpg",
      title: "신작 체험 리뷰 이벤트",
      description:
        "현장 신작 체험 후 네이버 블로그 또는 인스타그램 리뷰를 남기면 추첨으로 선물을 제공합니다. 기준일은 7월 26일입니다.",
      source: kbgSource,
    },
    {
      image: "/booth-posters/image13.jpg",
      title: "인원별 체험 게임",
      description:
        "2·3·4인 이상 인원별 추천 체험 게임을 현장 상황에 따라 운영합니다.",
      source: kbgSource,
    },
    {
      image: "/booth-posters/image34.jpg",
      title: "스플렌더 · 바다숲 대회",
      description:
        "7월 18일 13시 스플렌더 그랑프리 보드게임콘 예선, 7월 19일 14시 바다숲 토너먼트가 COEX 3층 컨퍼런스룸(남) 318호에서 열립니다.",
      source: kbgSource,
    },
  ],
  보드피아: [
    {
      image: "/booth-posters/image17.jpg",
      title: "세티 확장: 우주 기관",
      description:
        "공유 시트에는 세티 확장과 메탈 코인, 본판 재입고가 2026 보드게임콘 출시 항목으로 소개돼 있습니다.",
      source: "https://www.instagram.com/p/DaRsk7tExoy/",
    },
    {
      image: "/booth-posters/image24.jpg",
      title: "엠버하트 · 죄악의 카니발",
      description:
        "두 신작의 실물 패키지 이미지를 게임 목록 위에서 확인할 수 있습니다.",
      source: "https://www.instagram.com/p/DaRsk7tExoy/",
    },
  ],
  데블다이스: [
    {
      image: "/booth-posters/image35.jpg",
      title: "구매 혜택 이벤트",
      description:
        "게임 구매 시 데블다이스 보드카페 이용권을 제공하고, 결제 금액별 캐주얼·전략 게임 혜택을 안내합니다.",
      source: "https://www.instagram.com/p/DakeJ0FE-pD/",
    },
    {
      image: "/booth-posters/image16.jpg",
      title: "추가 프로모션",
      description:
        "마녀들의 경주·페이퍼 던전 구매 프로모션과 5만 원 이상 무료 택배 서비스를 안내합니다.",
      source: "https://www.instagram.com/p/DakeJ0FE-pD/",
    },
    {
      image: "/booth-posters/image37.jpg",
      title: "TANTRIX 스피드 챌린지",
      description:
        "퍼즐을 완성하는 현장 스피드 챌린지입니다. 1등은 데드 바이 데이라이트 컬렉터스·확장 풀세트, 참여 선물도 안내돼 있습니다.",
      source: "https://www.instagram.com/p/DakeJ0FE-pD/",
    },
  ],
  매직빈게임즈: [
    {
      image: "/booth-posters/image33.jpg",
      title: "오목체스 반값 할인 · 대회",
      description:
        "오목과 체스를 결합한 오목체스의 반값 할인과 대회 신청을 안내합니다.",
      source: "https://www.instagram.com/p/DZo-JK6R4QI/",
    },
    {
      image: "/booth-posters/image18.jpg",
      title: "첫 오목체스 챔피언십",
      description:
        "7월 18일 16:00–17:50, COEX 3층 남 308호에서 32강 1대1 방식으로 진행됩니다. 선착순 모집입니다.",
      source: "https://www.instagram.com/p/DZo-JK6R4QI/",
    },
  ],
  MTS: [
    {
      image: "/booth-posters/image25.jpg",
      title: "체험 아케이드 뽑기",
      description:
        "MTS 게임을 체험해 코인을 모으고 뽑기를 즐기는 이벤트입니다. 게임당 코인 1개, 최대 4개까지 안내돼 있습니다.",
      source: "https://www.instagram.com/p/DawbJVkEhwo/",
    },
    {
      image: "/booth-posters/image30.jpg",
      title: "날짜별 아케이드 상품",
      description:
        "16~19일 날짜별 1·2등 게임 상품과 MTS 머니 상품권을 안내합니다.",
      source: "https://www.instagram.com/p/DawbJVkEhwo/",
    },
    {
      image: "/booth-posters/image23.jpg",
      title: "구매 금액별 사은품",
      description: "5만·10만·15만 원 구매 구간별 사은품을 선택할 수 있습니다.",
      source: "https://www.instagram.com/p/DawbJVkEhwo/",
    },
    {
      image: "/booth-posters/image26.jpg",
      title: "7월 입고 예정 게임",
      description:
        "원드러스 크리처 윈터폴 확장, 팜핸드, 미스터리 파티 Wave 5, 킵 더 히어로즈 아웃 지하시장·불장난 확장을 보드게임콘에서 만날 수 있다고 안내합니다.",
      source: "https://www.instagram.com/p/DawbJVkEhwo/",
    },
    {
      image: "/booth-events/mts-event-01.jpg",
      title: "현장 이벤트 안내 ①",
      description:
        "신작 또는 이벤트 제품 구매 뒤 다른 게임을 추가 구매할 때 적용되는 할인 안내입니다.",
      source: mtsEventSource,
    },
    {
      image: "/booth-events/mts-event-02.jpg",
      title: "현장 이벤트 안내 ②",
      description:
        "구매 금액별 증정품과 현장 혜택을 이미지로 확인할 수 있습니다.",
      source: mtsEventSource,
    },
    {
      image: "/booth-events/mts-event-03.jpg",
      title: "현장 이벤트 안내 ③",
      description: "MTS게임즈 부스에서 운영하는 구매·체험 혜택 안내입니다.",
      source: mtsEventSource,
    },
    {
      image: "/booth-events/mts-event-04.jpg",
      title: "현장 이벤트 안내 ④",
      description: "꽝 없는 아케이드 뽑기 참여 정보를 확인하세요.",
      source: mtsEventSource,
    },
    {
      image: "/booth-events/mts-event-05.jpg",
      title: "현장 이벤트 안내 ⑤",
      description: "MTS게임즈의 보드게임콘 현장 이벤트 전체 안내 이미지입니다.",
      source: mtsEventSource,
    },
  ],
  보드엠: [
    {
      image: "/booth-posters/image32.jpg",
      title: "파러웨이 챔피언십",
      description:
        "7월 19일 11:00–14:00, COEX 3층 컨퍼런스룸(남) 318호에서 64명 선착순으로 진행됩니다. 참가자 전원 부스 5,000원 쿠폰이 안내돼 있습니다.",
      source:
        "https://boardm.co.kr/article/%EA%B3%B5%EC%A7%80%EC%82%AC%ED%95%AD%EC%86%8C%EC%8B%9D%EC%A7%80/1/71363/",
    },
    {
      image: "/booth-events/boardm-event-01.jpg",
      title: "현장 구매 이벤트",
      description:
        "보드게임콘 부스의 현장 구매 관련 혜택을 확인할 수 있습니다.",
      source: boardMEventSource,
    },
    {
      image: "/booth-events/boardm-event-02.jpg",
      title: "작가 사인회",
      description: "부스에서 진행되는 작가 사인회 안내입니다.",
      source: boardMEventSource,
    },
    {
      image: "/booth-events/boardm-event-03.jpg",
      title: "현장 인증 이벤트",
      description: "행사 현장 인증 참여 방법과 혜택을 안내합니다.",
      source: boardMEventSource,
    },
    {
      image: "/booth-events/boardm-event-04.jpg",
      title: "후기 이벤트",
      description: "행사 후기를 남기고 참여할 수 있는 이벤트 안내입니다.",
      source: boardMEventSource,
    },
  ],
  "행복한 바오밥": [
    {
      image: "/booth-posters/image28.jpg",
      title: "수량별 할인",
      description:
        "1개 30%, 3개 35%, 5개 40%, 7개 45% 할인으로 구성된 현장 할인표를 안내합니다.",
      source: "https://www.instagram.com/p/DaSNZ5riZLd/",
    },
    {
      image: "/booth-posters/image36.jpg",
      title: "대회 · 사인회 · 구매 혜택",
      description:
        "정고 토너먼트, 플레이 제주 일러스트레이터 사인회와 일부 게임 구매 증정·선주문 안내가 함께 게시돼 있습니다.",
      source: "https://www.instagram.com/p/DaSNZ5riZLd/",
    },
  ],
  아스모디: [
    {
      image: "/booth-posters/image21.jpg",
      title: "머핀타임 체험 이벤트",
      description:
        "방문 선물, 구매 사은품, 나만의 기발한 카드를 만드는 카드 콘테스트를 안내합니다.",
      source: asmodeeSource,
    },
    {
      image: "/booth-posters/image27.jpg",
      title: "한정 럭키 박스",
      description:
        "파티·전략·올인원 패키지의 구성, 수량, 가격과 구매 제한을 확인할 수 있습니다.",
      source: asmodeeSource,
    },
    {
      image: "/booth-posters/image38.jpg",
      title: "드제코 할인 · 증정",
      description:
        "드제코 신작 2종 이상 구매 시 미스테릭스 미니 보드게임 증정 이벤트를 안내합니다. 재고 소진 시 조기 마감될 수 있습니다.",
      source: asmodeeSource,
    },
    {
      image: "/booth-events/asmodee-event-01.jpg",
      title: "럭키박스 · 현장 혜택",
      description: "보드게임콘에서 운영하는 아스모디 현장 혜택을 확인하세요.",
      source: asmodeeSource,
    },
    {
      image: "/booth-events/asmodee-event-02.jpg",
      title: "구매 개수별 추가 할인",
      description: "구매 수량에 따라 달라지는 현장 추가 할인 안내입니다.",
      source: asmodeeSource,
    },
    {
      image: "/booth-events/asmodee-event-03.jpg",
      title: "구매 사은품",
      description:
        "구매 조건에 따른 현장 증정품을 이미지로 확인할 수 있습니다.",
      source: asmodeeSource,
    },
    {
      image: "/booth-events/asmodee-event-04.jpg",
      title: "현장 이벤트 안내",
      description:
        "아스모디코리아 부스 이벤트를 한 장으로 정리한 안내 이미지입니다.",
      source: asmodeeSource,
    },
  ],
  플레이트: [
    {
      image: "/booth-events/plate-event-01.jpg",
      title: "보드게임콘 신작 소개 ①",
      description: "플레이트가 공개한 보드게임콘 신작 안내 이미지입니다.",
      source: plateEventSource,
    },
    {
      image: "/booth-events/plate-event-02.jpg",
      title: "보드게임콘 신작 소개 ②",
      description: "현장에서 확인할 수 있는 플레이트 신작 라인업입니다.",
      source: plateEventSource,
    },
    {
      image: "/booth-events/plate-event-03.jpg",
      title: "보드게임콘 신작 소개 ③",
      description: "《헬라스》·《케이스96》을 포함한 신작 소개 이미지입니다.",
      source: plateEventSource,
    },
    {
      image: "/booth-events/plate-event-04.jpg",
      title: "한정 수량 신작",
      description:
        "게시글 기준 《헬라스》와 《케이스96》은 한정 수량으로 안내됩니다.",
      source: plateEventSource,
    },
  ],
};
const mapBooths = [
  ["만두게임즈", "map-mandoo"],
  ["코리아보드게임즈", "map-kbg"],
  ["언더독게임즈", "map-underdog"],
  ["보드피아", "map-boardpia"],
  ["하비게임몰", "map-hobby"],
  ["데블다이스", "map-devil"],
  ["게임올로지", "map-gameology"],
  ["놀이속의세상", "map-nori"],
  ["매직빈게임즈", "map-magicbean"],
  ["옐로우스타게임즈", "map-yellowstar"],
  ["MTS", "map-mts"],
  ["보드엠", "map-boardm"],
  ["행복한 바오밥", "map-baobab"],
  ["아스모디", "map-asmodee"],
  ["보드붐", "map-boardboom"],
  ["조엔", "map-joen"],
] as const;

export default function Home() {
  const [filter, setFilter] = useState("전체");
  const [query, setQuery] = useState("");
  const [selectedVendor, setSelectedVendor] = useState("전체");
  const [vendorMenuOpen, setVendorMenuOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState(games[0]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [wishlistSort, setWishlistSort] = useState<"priority" | "vendor">(
    "priority",
  );
  const [draggingWishlistId, setDraggingWishlistId] = useState<string | null>(
    null,
  );
  const [dragTargetWishlistId, setDragTargetWishlistId] = useState<
    string | null
  >(null);
  const [wishlistLoaded, setWishlistLoaded] = useState(false);
  const filtered = useMemo(
    () =>
      games.filter(
        (game) =>
          (filter === "전체" || game.type === filter) &&
          (selectedVendor === "전체" || game.publisher === selectedVendor) &&
          `${game.title} ${game.publisher}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [filter, query, selectedVendor],
  );
  const wishlistIds = useMemo(
    () => new Set(wishlist.map((item) => item.id)),
    [wishlist],
  );
  const wishlistGroups = useMemo(() => {
    const sorted = [...wishlist].sort((a, b) =>
      wishlistSort === "priority"
        ? a.priority - b.priority || a.addedAt - b.addedAt
        : a.publisher.localeCompare(b.publisher, "ko") ||
          a.priority - b.priority,
    );
    return sorted.reduce<Record<string, WishlistItem[]>>((groups, item) => {
      (groups[item.publisher] ??= []).push(item);
      return groups;
    }, {});
  }, [wishlist, wishlistSort]);
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed))
          setWishlist(
            parsed.filter((item): item is WishlistItem =>
              Boolean(
                item &&
                  typeof item === "object" &&
                  "id" in item &&
                  "title" in item &&
                  "publisher" in item &&
                  "priority" in item &&
                  "addedAt" in item,
              ),
            ),
          );
      }
    } catch {
      window.localStorage.removeItem(WISHLIST_STORAGE_KEY);
    }
    setWishlistLoaded(true);
  }, []);
  useEffect(() => {
    if (wishlistLoaded)
      window.localStorage.setItem(
        WISHLIST_STORAGE_KEY,
        JSON.stringify(wishlist),
      );
  }, [wishlist, wishlistLoaded]);
  useEffect(() => {
    if (!wishlistOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setWishlistOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [wishlistOpen]);
  const selectVendor = (vendor: string) => {
    setSelectedVendor(vendor);
    setFilter("전체");
    setVendorMenuOpen(false);
    const first = games.find(
      (game) => vendor === "전체" || game.publisher === vendor,
    );
    if (first) setSelectedGame(first);
    document
      .querySelector("#vendors")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const addToWishlist = (game: Game) => {
    const id = gameId(game);
    if (wishlistIds.has(id)) {
      setWishlistOpen(true);
      return;
    }
    setWishlist((items) => [
      ...items,
      {
        id,
        title: game.title,
        publisher: game.publisher,
        priority: items.length
          ? Math.max(...items.map((item) => item.priority)) + 1
          : 1,
        addedAt: Date.now(),
      },
    ]);
  };
  const reorderWishlist = (sourceId: string, targetId: string) => {
    if (sourceId === targetId) return;
    setWishlist((items) => {
      const sorted = [...items].sort(
        (a, b) => a.priority - b.priority || a.addedAt - b.addedAt,
      );
      const sourceIndex = sorted.findIndex((item) => item.id === sourceId);
      const targetIndex = sorted.findIndex((item) => item.id === targetId);
      if (sourceIndex < 0 || targetIndex < 0) return items;
      const [moved] = sorted.splice(sourceIndex, 1);
      sorted.splice(targetIndex, 0, moved);
      return sorted.map((item, index) => ({ ...item, priority: index + 1 }));
    });
  };
  const finishWishlistDrag = (sourceId: string) => {
    if (dragTargetWishlistId) {
      reorderWishlist(sourceId, dragTargetWishlistId);
    }
    setDraggingWishlistId(null);
    setDragTargetWishlistId(null);
  };
  const updatePointerDragTarget = (
    sourceId: string,
    clientX: number,
    clientY: number,
  ) => {
    const targetId = document
      .elementFromPoint(clientX, clientY)
      ?.closest<HTMLElement>("[data-wishlist-id]")?.dataset.wishlistId;
    if (targetId && targetId !== sourceId) {
      setDragTargetWishlistId(targetId);
    }
  };
  const removeFromWishlist = (id: string) =>
    setWishlist((items) => items.filter((item) => item.id !== id));

  return (
    <main>
      <header className="nav">
        <a className="brand" href="#top">
          BGC<span>26</span>
        </a>
        <nav>
          <a href="#map">MAP</a>
          <a href="#events">주요 이벤트</a>
          <div className={`vendor-menu ${vendorMenuOpen ? "open" : ""}`}>
            <button
              className="vendor-menu-trigger"
              type="button"
              aria-expanded={vendorMenuOpen}
              aria-controls="vendor-menu-panel"
              onClick={() => setVendorMenuOpen((open) => !open)}
            >
              참가 업체 <span>↓</span>
            </button>
            <div className="vendor-menu-panel" id="vendor-menu-panel">
              <button
                className="vendor-menu-all"
                onClick={() => selectVendor("전체")}
              >
                전체 업체<small>{vendorTabs.length - 1} VENDORS</small>
              </button>
              {vendorTabs
                .filter((vendor) => vendor !== "전체")
                .map((vendor) => (
                  <button key={vendor} onClick={() => selectVendor(vendor)}>
                    {vendor}
                    <small>
                      {games.filter((game) => game.publisher === vendor).length}{" "}
                      GAMES
                    </small>
                  </button>
                ))}
            </div>
          </div>
        </nav>
        <a
          className="nav-link"
          href="https://www.boardgamecon.com/"
          target="_blank"
          rel="noreferrer"
        >
          OFFICIAL ↗
        </a>
      </header>
      {wishlistOpen && (
        <div
          className="wishlist-layer"
          role="presentation"
          onMouseDown={() => setWishlistOpen(false)}
        >
          <aside
            className="wishlist-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="구매희망 게임"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header>
              <div>
                <span className="mono">LOCAL WISHLIST</span>
                <h2>
                  구매희망 게임 <em>{wishlist.length}</em>
                </h2>
              </div>
              <button
                className="wishlist-close"
                type="button"
                onClick={() => setWishlistOpen(false)}
                aria-label="구매희망 목록 닫기"
              >
                ×
              </button>
            </header>
            <div className="wishlist-toolbar">
              <p>우선순위 정렬에서 ⠿ 핸들을 드래그해 순서를 바꿔보세요.</p>
              <label>
                정렬{" "}
                <select
                  value={wishlistSort}
                  onChange={(event) =>
                    setWishlistSort(event.target.value as "priority" | "vendor")
                  }
                >
                  <option value="priority">구매희망 순위</option>
                  <option value="vendor">업체명</option>
                </select>
              </label>
            </div>
            {wishlist.length === 0 ? (
              <div className="wishlist-empty">
                <strong>아직 담은 게임이 없습니다.</strong>
                <p>
                  게임 카드 제목 옆 장바구니 아이콘으로 목록을 만들어 보세요.
                </p>
              </div>
            ) : (
              <div className="wishlist-groups">
                {Object.entries(wishlistGroups).map(([publisher, items]) => (
                  <section key={publisher}>
                    <h3>
                      {publisher}
                      <span>{items.length} GAMES</span>
                    </h3>
                    <ul>
                      {items.map((item) => (
                        <li
                          key={item.id}
                          data-wishlist-id={item.id}
                          draggable={wishlistSort === "priority"}
                          className={`${draggingWishlistId === item.id ? "dragging" : ""} ${dragTargetWishlistId === item.id ? "drag-target" : ""}`}
                          onDragStart={() => {
                            setWishlistSort("priority");
                            setDraggingWishlistId(item.id);
                            setDragTargetWishlistId(null);
                          }}
                          onDragOver={(event) => {
                            event.preventDefault();
                            if (draggingWishlistId !== item.id) {
                              setDragTargetWishlistId(item.id);
                            }
                          }}
                          onDrop={(event) => {
                            event.preventDefault();
                            if (draggingWishlistId) {
                              reorderWishlist(draggingWishlistId, item.id);
                            }
                            setDraggingWishlistId(null);
                            setDragTargetWishlistId(null);
                          }}
                          onDragEnd={() => {
                            setDraggingWishlistId(null);
                            setDragTargetWishlistId(null);
                          }}
                        >
                          <button
                            className="wishlist-drag-handle"
                            type="button"
                            aria-label={`${item.title} 구매희망 순위 드래그`}
                            onPointerDown={(
                              event: ReactPointerEvent<HTMLButtonElement>,
                            ) => {
                              event.preventDefault();
                              setWishlistSort("priority");
                              setDraggingWishlistId(item.id);
                              setDragTargetWishlistId(null);
                              event.currentTarget.setPointerCapture(
                                event.pointerId,
                              );
                            }}
                            onPointerMove={(
                              event: ReactPointerEvent<HTMLButtonElement>,
                            ) =>
                              updatePointerDragTarget(
                                item.id,
                                event.clientX,
                                event.clientY,
                              )}
                            onPointerUp={(
                              event: ReactPointerEvent<HTMLButtonElement>,
                            ) => {
                              if (
                                event.currentTarget.hasPointerCapture(
                                  event.pointerId,
                                )
                              ) {
                                event.currentTarget.releasePointerCapture(
                                  event.pointerId,
                                );
                              }
                              finishWishlistDrag(item.id);
                            }}
                          >
                            ⠿
                          </button>
                          <div>
                            <b>{item.title}</b>
                            <span>드래그하여 구매희망 순위 변경</span>
                          </div>
                          <button
                            className="wishlist-remove"
                            type="button"
                            onClick={() => removeFromWishlist(item.id)}
                            aria-label={`${item.title} 목록에서 삭제`}
                          >
                            삭제
                          </button>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            )}
          </aside>
        </div>
      )}
      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="mono">2026 BOARDGAMECON / SEOUL</p>
          <h1>
            올해의 판을
            <br />
            고르세요<span className="dot">.</span>
          </h1>
          <p className="hero-description">
            한눈에 보는 부스, 신작, 그리고
            <br />
            테이블 위에서 시작될 이야기.
          </p>
          <div className="hero-meta mono">
            <span>07.16 — 07.19</span>
            <span>10:00 — 18:00</span>
            <span>COEX B1 · SEOUL</span>
          </div>
        </div>
        <div className="hero-number" aria-hidden="true">
          26
        </div>
      </section>
      <section className="info-strip">
        <span className="mono">FREE ADMISSION</span>
        <span>전 연령 · 전시 & 체험 · 대회 · 작가존</span>
        <a href="http://www.boardgamecon.com/" target="_blank" rel="noreferrer">
          행사 정보 ↗
        </a>
      </section>
      <section className="map-section" id="map">
        <div className="map-panel">
          <div className="map-label mono">
            COEX EXHIBITION HALL B1 / SHEET VERIFIED BOOTH MAP
          </div>
          <div className="hall">
            <div className="hall-note mono">← WEST HALL</div>
            <div className="entrance">ENTRANCE →</div>
            {mapBooths.map(([vendor, position]) => (
              <button
                className={`booth ${position}`}
                onClick={() => selectVendor(vendor)}
                key={vendor}
                aria-label={`${vendor} 탭 보기`}
              >
                {vendor === "코리아보드게임즈" ? (
                  <>
                    코리아
                    <br />
                    보드게임즈
                  </>
                ) : (
                  vendor
                )}
              </button>
            ))}
            <div className="booth map-mimi">미미월드</div>
            <div className="booth map-raccoon">
              라쿤펀치
              <br />
              피스크래프트
            </div>
            <div className="booth map-boardboom-side">보드붐</div>
            <div className="booth map-creators">
              작가존 · 캐릭터 라이선싱 페어
            </div>
            <div className="map-legend">
              <i></i> 클릭: 업체 탭 이동 <span>·</span> <b></b> 도면상 동반 부스
            </div>
          </div>
          <div className="map-note">
            <p>
              공유 시트와 현장 도면 기준으로 재배치했습니다.{" "}
              <strong>파란 블록</strong>을 클릭하면 해당 업체 게임을 바로 볼 수
              있습니다.
            </p>
            <button onClick={() => selectVendor("전체")}>
              전체 라인업 보기 <span>↓</span>
            </button>
          </div>
        </div>
      </section>
      <section
        className="vendor-info-index"
        id="events"
        aria-label="전체 행사 정보"
      >
        <p className="mono">BOOTH EVENT NOTES / BOARDLIFE CURATED</p>
        <div className="event-swiper">
          {Object.entries(vendorNotes)
            .filter(([vendor]) => vendor !== "전체")
            .map(([vendor, note]) => (
              <article key={vendor}>
                <h2>{vendor}</h2>
                <p>{note}</p>
                <button onClick={() => selectVendor(vendor)}>
                  게임 보기 ↗
                </button>
              </article>
            ))}
        </div>
      </section>
      <section className="vendors-section" id="vendors">
        <div className="vendor-content">
          <div className="vendor-return-tabs" aria-label="참가 업체 보기">
            <button
              className={selectedVendor === "전체" ? "active" : ""}
              onClick={() => selectVendor("전체")}
            >
              전체 업체
            </button>
            {selectedVendor !== "전체" && (
              <button onClick={() => setVendorMenuOpen(true)}>
                참가 업체 목록 <span>↓</span>
              </button>
            )}
          </div>
          <div className="game-tools">
            <div className="filter-row">
              {["전체", "파티", "가족", "협력", "추리", "2인", "전략"].map(
                (item) => (
                  <button
                    className={filter === item ? "active" : ""}
                    onClick={() => setFilter(item)}
                    key={item}
                  >
                    {item}
                  </button>
                ),
              )}
            </div>
            <label className="search">
              <span>⌕</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={`${selectedVendor} 게임명 검색`}
                aria-label="게임명 검색"
              />
            </label>
          </div>
          <div className="selection-row">
            <p className="selection-label">
              <span className="mono">NOW VIEWING</span> {selectedVendor}{" "}
              <em>{filtered.length} GAMES</em>
            </p>
            {vendorLinks[selectedVendor] && (
              <a
                className="vendor-source"
                href={vendorLinks[selectedVendor].url}
                target="_blank"
                rel="noreferrer"
              >
                {vendorLinks[selectedVendor].label}
              </a>
            )}
          </div>
          {vendorFeatures[selectedVendor] && (
            <aside className="vendor-feature">
              <a
                href={vendorFeatures[selectedVendor].source}
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src={vendorFeatures[selectedVendor].image}
                  alt={`${selectedVendor} ${vendorFeatures[selectedVendor].title} 포스터`}
                />
              </a>
              <div>
                <span className="mono">OFFICIAL BOOTH POST</span>
                <h2>{vendorFeatures[selectedVendor].title}</h2>
                <p>{vendorFeatures[selectedVendor].description}</p>
                <a
                  href={vendorFeatures[selectedVendor].source}
                  target="_blank"
                  rel="noreferrer"
                >
                  만두게임즈 원문 보기 ↗
                </a>
              </div>
            </aside>
          )}
          {vendorEvents[selectedVendor] && (
            <aside className="vendor-event">
              <a
                href={vendorEvents[selectedVendor].source}
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src={vendorEvents[selectedVendor].image}
                  alt={`${selectedVendor} ${vendorEvents[selectedVendor].title} 일정`}
                />
              </a>
              <div>
                <span className="mono">EVENT SCHEDULE</span>
                <p className="event-date">
                  {vendorEvents[selectedVendor].date}
                </p>
                <h2>{vendorEvents[selectedVendor].title}</h2>
                <b>{vendorEvents[selectedVendor].location}</b>
                <p>{vendorEvents[selectedVendor].description}</p>
                <a
                  href={vendorEvents[selectedVendor].source}
                  target="_blank"
                  rel="noreferrer"
                >
                  현장 이벤트 원문 보기 ↗
                </a>
              </div>
            </aside>
          )}
          {boothPosters[selectedVendor] && (
            <section
              className="booth-posters"
              aria-label={`${selectedVendor} 행사 및 대회 소식`}
            >
              <div className="booth-posters-heading">
                <span className="mono">
                  SHEET EVENT · TOURNAMENT · BOOTH VISUALS
                </span>
                <p>
                  공유 시트에 첨부된 행사 이미지와 안내를 게임 목록 전에
                  정리했습니다.
                </p>
              </div>
              <div className="booth-poster-grid">
                {boothPosters[selectedVendor].map((poster) => (
                  <article key={poster.image}>
                    <a href={poster.source} target="_blank" rel="noreferrer">
                      <img
                        src={poster.image}
                        alt={`${selectedVendor} ${poster.title} 안내 이미지`}
                      />
                    </a>
                    <div>
                      <h2>{poster.title}</h2>
                      <p>{poster.description}</p>
                      <a href={poster.source} target="_blank" rel="noreferrer">
                        원문 · 이미지 출처 ↗
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
          <div className="game-cards">
            {filtered.map((game) => (
              <article
                className={`game-card ${selectedGame.title === game.title ? "selected" : ""}`}
                key={`${game.publisher}-${game.title}`}
              >
                {game.image && (
                  <button
                    className="game-cover"
                    onClick={() => setSelectedGame(game)}
                    aria-label={`${game.title} 상세 보기`}
                  >
                    {game.imageCrop ? (
                      <span
                        className="game-cover-crop"
                        style={{
                          backgroundImage: `url(${game.image})`,
                          backgroundPosition: game.imageCrop.position,
                          backgroundSize: game.imageCrop.size,
                        }}
                        aria-hidden="true"
                      />
                    ) : (
                      <img src={game.image} alt={`${game.title} 출시 이미지`} />
                    )}
                  </button>
                )}
                <div className="game-card-main">
                  <button
                    className="game-card-detail"
                    onClick={() => setSelectedGame(game)}
                    aria-label={`${game.title} 상세 보기`}
                  >
                    <span className="mono">{game.status}</span>
                    <h3>{game.title}</h3>
                    <p>{game.description}</p>
                    <div>
                      <b>{game.type}</b>
                      <b>{game.weight}</b>
                      <span>
                        {game.players} · {game.time}
                      </span>
                    </div>
                  </button>
                  <button
                    className={`wishlist-icon ${wishlistIds.has(gameId(game)) ? "saved" : ""}`}
                    type="button"
                    onClick={() => addToWishlist(game)}
                    aria-pressed={wishlistIds.has(gameId(game))}
                    aria-label={wishlistIds.has(gameId(game)) ? `${game.title} 구매희망 목록 보기` : `${game.title} 구매희망에 담기`}
                    title={wishlistIds.has(gameId(game)) ? "구매희망 목록 보기" : "구매희망에 담기"}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.4L21 7H6" />
                      <circle cx="10" cy="20" r="1" />
                      <circle cx="18" cy="20" r="1" />
                    </svg>
                  </button>
                </div>
                {game.source && (
                  <a href={game.source} target="_blank" rel="noreferrer">
                    사진·출시 공지 보기 ↗
                  </a>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>
      <footer>
        <a className="brand" href="#top">
          BGC<span>26</span>
        </a>
        <p>
          업체·신작 정보는 Google 공유 시트와 2026.07.15 Boardlife 최신 종합
          정리를 기준으로 업데이트했습니다.
          <br />
          방문 전 공식 홈페이지에서 최신 공지를 확인하세요.
        </p>
        <div>
          <a
            href="https://docs.google.com/spreadsheets/d/1GO008TzPSP_DikyHO8XppqErtj1Zz74K2glS7N4UhLM/edit?gid=1521344712#gid=1521344712"
            target="_blank"
            rel="noreferrer"
          >
            GOOGLE SHEET ↗
          </a>
          <a href={latestBoardlifeSource} target="_blank" rel="noreferrer">
            LATEST BOARDLIFE ↗
          </a>
          <a
            href="https://www.boardgamecon.com/"
            target="_blank"
            rel="noreferrer"
          >
            OFFICIAL ↗
          </a>
        </div>
      </footer>
    </main>
  );
}
