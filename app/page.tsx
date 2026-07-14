"use client";

import { useMemo, useState } from "react";

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
};

const sheetGame = (
  title: string,
  publisher: string,
  description: string,
  status: Game["status"] = "콘 신작",
  type: Game["type"] = "가족",
  weight: Game["weight"] = "가볍게",
  source?: string,
) : Game => ({ title, publisher, description, status, type, weight, players: "현장 안내", time: "현장 안내", audience: "공유 시트의 공개 라인업을 확인하려는 방문객", video: `${title} 보드게임`, source });

const mandooSource = "https://www.instagram.com/p/Daui3XXE4IF/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==";
const kbgSource = "https://www.koreaboardgames.com/magazine/menuDetail?boardCd=news&postNo=874";
const asmodeeSource = "https://boardlife.co.kr/bbs_detail.php?tb=board_community&bbs_num=78895&view=new";
const asmodeeScheduleSource = "https://boardlife.co.kr/bbs_detail.php?tb=board_community&bbs_num=78896&view=new";

const games: Game[] = [
  { title: "컴파일", publisher: "만두게임즈", type: "2인", weight: "적당히", players: "2인", time: "20–30분", status: "대표작", description: "AI 테마 덱으로 세 전선을 두고 겨루는 카드 전략전. 높은 카드는 인장, 낮은 카드는 능력으로 쓰는 선택이 핵심입니다.", audience: "짧고 치열한 2인전을 찾는 사람", video: "컴파일 보드게임", image: "/covers/compile-release.png", source: mandooSource },
  { title: "카르디아", publisher: "만두게임즈", type: "2인", weight: "적당히", players: "2인", time: "20분", status: "대표작", description: "동시 공개한 카드의 높낮이에 따라 인장 획득과 카드 능력이 갈리는 심리전입니다.", audience: "블러핑과 심리전을 좋아하는 2인", video: "카르디아 보드게임", image: "/covers/cardia.png", source: mandooSource },
  { title: "꼬치의 달인", publisher: "만두게임즈", type: "파티", weight: "가볍게", players: "2–4인", time: "10분", status: "대표작", description: "주문 카드와 같은 꼬치를 먼저 완성하는 실시간 순발력 게임입니다.", audience: "바로 꺼내 웃을 수 있는 게임을 찾는 모임", video: "꼬치의 달인 보드게임" },
  { title: "두냐자드의 모험", publisher: "코리아보드게임즈", type: "협력", weight: "가볍게", players: "2–5인", time: "15분", status: "콘 신작", description: "천일야화를 완성하는 실시간 협력 게임. 공식 Pick 2 체험작으로 소개됐습니다.", audience: "가족·입문자 협력 플레이", video: "두냐자드의 모험 보드게임", image: "/covers/kbg-dunyazad.png", source: kbgSource },
  { title: "새우깡 보드게임", publisher: "코리아보드게임즈", type: "가족", weight: "가볍게", players: "2–4인", time: "10분", status: "콘 신작", description: "농심과 함께 선보이는 새우깡 테마 카드게임. 공식 Pick 4 체험작입니다.", audience: "어린이와 가볍게 즐길 가족", video: "새우깡 보드게임", image: "/covers/kbg-shrimp-cracker.png", source: kbgSource },
  { title: "블러핏", publisher: "코리아보드게임즈", type: "파티", weight: "가볍게", players: "3–6인", time: "15분", status: "콘 신작", description: "카드 10장으로 즐기는 심리전과 베팅, 배짱 승부. 공식 Pick 3 체험작입니다.", audience: "상대 표정을 읽는 파티 게임 팬", video: "블러핏 보드게임", image: "/covers/kbg-blurfit.png", source: kbgSource },
  { title: "데스 스테이션", publisher: "코리아보드게임즈", type: "추리", weight: "적당히", players: "2–4인", time: "30분", status: "콘 신작", description: "목숨을 건 리얼리티 퍼즐 쇼에 도전하는 게임. 공식 Pick 1 체험작입니다.", audience: "추리와 공간 퍼즐을 함께 좋아하는 사람", video: "데스 스테이션 보드게임", image: "/covers/kbg-death-station.png", source: kbgSource },
  { title: "세티 확장: 우주기관", publisher: "보드피아", type: "전략", weight: "깊게", players: "1–4인", time: "90–150분", status: "콘 신작", description: "비대칭 우주기관 11개와 외계종족 3종, 새 프로젝트를 더하는 《세티》 확장입니다.", audience: "세티를 깊게 즐긴 전략 게이머", video: "세티 우주기관 보드게임", image: "/covers/seti-release.png", source: "https://boardlife.co.kr/bbs_detail.php?tb=board_news&bbs_num=16258" },
  { title: "엠버하트", publisher: "보드피아", type: "전략", weight: "적당히", players: "1–4인", time: "45–75분", status: "콘 신작", description: "일꾼을 배치해 드래곤을 구조·훈련하고 밀렵꾼과 맞서는 판타지 전략게임입니다.", audience: "테마 있는 일꾼 놓기 입문자", video: "엠버하트 보드게임", image: "/covers/emberheart-release.png", source: "https://boardlife.co.kr/bbs_detail.php?tb=board_news&bbs_num=16270" },
  { title: "죄악의 카니발", publisher: "보드피아", type: "파티", weight: "가볍게", players: "3–6인", time: "20분", status: "콘 신작", description: "일곱 죄악 카드를 비밀리에 고르고 주사위를 가져오며 상대를 방해하는 블러핑 게임입니다.", audience: "가벼운 견제와 심리전을 원하는 모임", video: "죄악의 카니발 보드게임", image: "/covers/carnival-release.png", source: "https://boardlife.co.kr/bbs_detail.php?tb=board_news&bbs_num=16270" },
  { title: "태그 팀: 아서왕 전설", publisher: "아스모디", type: "2인", weight: "적당히", players: "2인", time: "20–30분", status: "콘 신작", description: "미리 구성한 카드 순서가 자동 전투를 벌이는 2인 덱빌딩 오토배틀러. 독립 플레이가 가능합니다.", audience: "전투 덱빌딩을 간결하게 즐기고 싶은 2인", video: "태그 팀 아서왕 전설 보드게임", image: "/covers/asmodee-lineup-a.png", imageCrop: { position: "100% 20%", size: "310% auto" }, source: asmodeeSource },
  { title: "플라워즈", publisher: "보드엠", type: "가족", weight: "가볍게", players: "2–4인", time: "20분", status: "콘 신작", description: "숫자 카드의 등장 빈도와 배치 조건으로 꽃밭을 완성하는 카드 퍼즐입니다.", audience: "예쁜 테이블 게임을 원하는 가족", video: "플라워즈 보드게임", image: "/covers/flowers-release.png", source: "https://boardlife.co.kr/bbs_detail.php?tb=board_news&bbs_num=16271" },
  { title: "P.I.", publisher: "보드엠", type: "추리", weight: "적당히", players: "2–5인", time: "45분", status: "콘 신작", description: "경쟁자보다 먼저 자신의 사건을 해결해야 하는 경쟁형 추리게임입니다.", audience: "단서 조합과 추론을 좋아하는 사람", video: "P.I. 보드게임", image: "/covers/pi-release.png", source: "https://boardlife.co.kr/bbs_detail.php?tb=board_news&bbs_num=16271" },
  { title: "테이크 타임", publisher: "보드엠", type: "협력", weight: "적당히", players: "2–4인", time: "20분", status: "콘 신작", description: "제한된 의사소통만으로 숫자 카드를 시계 둘레에 배치하는 협력 퍼즐입니다.", audience: "말 없이 호흡을 맞추는 협력을 좋아하는 팀", video: "테이크 타임 보드게임", image: "/covers/taketime-release.png", source: "https://boardlife.co.kr/bbs_detail.php?tb=board_news&bbs_num=16271" },
  { title: "북타워", publisher: "보드엠", type: "협력", weight: "가볍게", players: "1–4인", time: "15분", status: "콘 신작", description: "고양이와 책을 떨어뜨리지 않도록 함께 쌓는 협력 덱스터리티입니다.", audience: "아이와 함께할 손기술 게임", video: "북타워 보드게임", image: "/covers/booktower-release.png", source: "https://boardlife.co.kr/bbs_detail.php?tb=board_news&bbs_num=16271" },
  { title: "원드러스 크리처", publisher: "MTS", type: "전략", weight: "적당히", players: "1–4인", time: "60–90분", status: "대표작", description: "일꾼과 생물 능력을 연계해 자신만의 엔진을 만드는 판타지 전략게임입니다.", audience: "생물 수집과 엔진 빌딩 팬", video: "원드러스 크리처 보드게임" },
  { title: "에이전트 애비뉴", publisher: "MTS", type: "2인", weight: "가볍게", players: "2인", time: "15분", status: "대표작", description: "카드 숫자와 이동을 읽어 상대 요원을 추적하는 빠른 심리전입니다.", audience: "짧은 2인 심리전을 찾는 사람", video: "에이전트 애비뉴 보드게임" },
  { title: "카르누타", publisher: "MTS", type: "전략", weight: "적당히", players: "2–4인", time: "60분", status: "대표작", description: "주술과 동물을 소재로 선택을 쌓아 가는 전략게임입니다.", audience: "테마형 중급 전략을 선호하는 사람", video: "카르누타 보드게임" },
  { title: "데바데 빅박스", publisher: "데블다이스", type: "전략", weight: "적당히", players: "2–4인", time: "—", status: "현장 공개", description: "데드 바이 데이라이트 보드게임 본판·확장을 정리하는 대형 수납 제품입니다.", audience: "데바데 보드게임 컬렉터", video: "데바데 보드게임 빅박스" },
  { title: "펜쏠로지", publisher: "게임올로지", type: "전략", weight: "가볍게", players: "2–4인", time: "20분", status: "현장 공개", description: "울타리 타일로 구역을 닫고 차지하는 영역 구성게임입니다.", audience: "공간 퍼즐을 깔끔하게 즐기는 사람", video: "펜쏠로지 보드게임" },
  { title: "네뷸라 컬러스", publisher: "게임올로지", type: "2인", weight: "가볍게", players: "2인", time: "15분", status: "현장 공개", description: "별 조각으로 세트와 연속 숫자를 만드는 2인 카드게임입니다.", audience: "작고 예쁜 2인 카드게임을 찾는 사람", video: "네뷸라 컬러스 보드게임" },
  { title: "다이스택", publisher: "보드붐", type: "파티", weight: "가볍게", players: "2–4인", time: "10분", status: "대표작", description: "주사위를 조건에 맞춰 빠르게 쌓는 손기술 게임입니다.", audience: "짧은 라운드의 손맛을 원하는 가족", video: "다이스택 보드게임" },
  { title: "점핑다이스", publisher: "보드붐", type: "파티", weight: "가볍게", players: "2–4인", time: "10분", status: "대표작", description: "주사위의 색과 숫자 조건을 빠르게 판단하는 순발력 게임입니다.", audience: "아이부터 어른까지 즐길 반응 게임", video: "점핑다이스 보드게임" },
  { title: "오목체스", publisher: "매직빈게임즈", type: "전략", weight: "적당히", players: "2인", time: "30분", status: "대표작", description: "오목의 연결 규칙과 서로 다른 이동 능력을 지닌 말을 결합한 추상전략입니다.", audience: "체스와 오목 모두 좋아하는 2인", video: "오목체스 보드게임" },
  { title: "식스틴", publisher: "매직빈게임즈", type: "전략", weight: "가볍게", players: "2–4인", time: "20분", status: "대표작", description: "숫자 타일을 배치·조합하며 점수를 만드는 추상전략입니다.", audience: "규칙은 짧고 생각할 거리는 있는 게임 팬", video: "식스틴 보드게임" },
  { title: "포켓알까기", publisher: "조엔", type: "가족", weight: "가볍게", players: "2–4인", time: "10분", status: "대표작", description: "손가락으로 말을 튕겨 상대 말을 떨어뜨리는 휴대용 덱스터리티입니다.", audience: "어디서든 바로 꺼낼 게임을 찾는 가족", video: "포켓알까기 보드게임" },
  { title: "루미큐브", publisher: "놀이속의세상", type: "가족", weight: "가볍게", players: "2–4인", time: "30–60분", status: "대표작", description: "숫자 타일을 같은 숫자 그룹이나 연속 숫자 묶음으로 내려놓는 클래식입니다.", audience: "세대가 함께 앉는 가족 테이블", video: "루미큐브 보드게임" },
  { title: "어스", publisher: "옐로우스타게임즈", type: "전략", weight: "적당히", players: "1–5인", time: "45–90분", status: "대표작", description: "식물과 서식지 카드로 생태계 엔진을 구축하는 전략게임입니다.", audience: "카드 콤보를 키워 가는 엔진빌딩 팬", video: "어스 보드게임" },
  { title: "터미너스", publisher: "옐로우스타게임즈", type: "전략", weight: "적당히", players: "1–5인", time: "60–90분", status: "대표작", description: "지하철 노선을 건설하고 승객을 운송하는 전략게임입니다.", audience: "노선 연결과 운영 퍼즐을 좋아하는 사람", video: "터미너스 보드게임" },
  // Google 공유 시트(7월 보드게임 콘 정보)의 업체별 신작·대표작 전체 반영
  sheetGame("치킨vs핫도그", "만두게임즈", "공식 부스 포스터의 ‘텐션 UP! 요즘 핫한 파티 게임’ 체험작입니다.", "콘 신작", "파티", "가볍게", mandooSource),
  sheetGame("태플", "만두게임즈", "공식 부스 포스터의 ‘텐션 UP! 요즘 핫한 파티 게임’ 체험작입니다.", "콘 신작", "파티", "가볍게", mandooSource),
  sheetGame("타코 쿠션 고트 치즈 피자", "만두게임즈", "공식 부스 포스터의 ‘텐션 UP! 요즘 핫한 파티 게임’ 체험작입니다.", "콘 신작", "파티", "가볍게", mandooSource),
  sheetGame("루쿠스", "만두게임즈", "공식 부스 포스터의 ‘텐션 UP! 요즘 핫한 파티 게임’ 체험작입니다.", "현장 공개", "파티", "가볍게", mandooSource),
  sheetGame("빙뱅붐", "만두게임즈", "공식 부스 포스터의 ‘텐션 UP! 요즘 핫한 파티 게임’ 체험작입니다.", "콘 신작", "파티", "가볍게", mandooSource),
  sheetGame("고양이를 조심해!", "만두게임즈", "공식 부스 포스터의 ‘간단한데 재밌다! 캐주얼 게임’ 체험작입니다.", "현장 공개", "가족", "가볍게", mandooSource),
  sheetGame("고빅", "만두게임즈", "공식 부스 포스터의 ‘간단한데 재밌다! 캐주얼 게임’ 체험작입니다.", "콘 신작", "가족", "가볍게", mandooSource),
  sheetGame("냠냠냠", "만두게임즈", "공식 부스 포스터의 ‘간단한데 재밌다! 캐주얼 게임’ 체험작입니다.", "현장 공개", "가족", "가볍게", mandooSource),
  sheetGame("아브라냥다브라", "만두게임즈", "공식 부스 포스터의 ‘간단한데 재밌다! 캐주얼 게임’ 체험작입니다.", "현장 공개", "가족", "가볍게", mandooSource),
  sheetGame("보츠와나", "만두게임즈", "공식 부스 포스터의 ‘간단한데 재밌다! 캐주얼 게임’ 체험작입니다.", "현장 공개", "가족", "가볍게", mandooSource),
  sheetGame("사그라다", "만두게임즈", "공식 부스 포스터의 ‘퀄리티 갑! 명작 게임’ 체험작입니다.", "대표작", "전략", "적당히", mandooSource),
  sheetGame("17 다이스 벳", "만두게임즈", "공식 부스 포스터의 ‘퀄리티 갑! 명작 게임’ 체험작입니다. 현장 운영 게임은 상황에 따라 달라질 수 있습니다.", "현장 공개", "전략", "적당히", mandooSource),
  { ...sheetGame("판다판다", "코리아보드게임즈", "작은 박스에 담은 큰 재미를 내세운 공식 Pick 5 체험작입니다.", "콘 신작", "가족", "가볍게", kbgSource), image: "/covers/kbg-small-box-lineup.png" },
  { ...sheetGame("소다러브", "코리아보드게임즈", "작은 박스에 담은 큰 재미를 내세운 공식 Pick 5 체험작입니다.", "콘 신작", "가족", "가볍게", kbgSource), image: "/covers/kbg-small-box-lineup.png" },
  { ...sheetGame("멍상블", "코리아보드게임즈", "작은 박스에 담은 큰 재미를 내세운 공식 Pick 5 체험작입니다.", "콘 신작", "가족", "가볍게", kbgSource), image: "/covers/kbg-small-box-lineup.png" },
  { ...sheetGame("골프", "코리아보드게임즈", "고전 게임을 더 쉽고 편하게 즐기는 공식 Pick 6 체험작입니다.", "콘 신작", "가족", "가볍게", kbgSource), image: "/covers/kbg-golf.png" },
  { ...sheetGame("덱커스", "보드피아", "사이버펑크 테마의 1인용 덱빌딩 게임입니다.", "콘 신작", "전략", "적당히"), image: "/covers/deckers.png", source: "https://boardlife.co.kr/bbs_detail.php?tb=board_news&bbs_num=16270" },
  sheetGame("스타워즈 언리미티드", "하비게임몰", "스타워즈 테마의 TCG입니다.", "대표작", "2인", "적당히"),
  sheetGame("건담 카드게임", "하비게임몰", "건담 테마의 TCG입니다.", "대표작", "2인", "적당히"),
  sheetGame("데바데 컬렉터스 에디션", "데블다이스", "데드 바이 데이라이트 보드게임 컬렉터스 에디션입니다.", "현장 공개", "전략", "적당히"),
  sheetGame("리스타트", "매직빈게임즈", "《식스틴》의 유럽 버전입니다.", "대표작", "전략"),
  sheetGame("프로마쥬", "옐로우스타게임즈", "치즈를 놓는 미들웨이트 게임으로, 치즈 모양의 특성을 시스템에 녹였습니다.", "대표작", "전략", "적당히"),
  sheetGame("스위트랜드", "옐로우스타게임즈", "비대칭 엔진빌딩·일꾼 놓기 방식의 헤비 전략게임입니다.", "대표작", "전략", "깊게"),
  sheetGame("헥서스", "조엔", "공간지각력이 필요한 게임입니다.", "콘 신작", "전략"),
  sheetGame("원드러스 크리처 윈터폴 확장", "MTS", "생물을 모으고 보호구역을 가꾸는 일꾼 놓기·세트 컬렉션 게임의 확장입니다.", "콘 신작", "전략", "적당히"),
  sheetGame("팜핸드", "MTS", "간단하게 즐기는 트릭테이킹 게임입니다.", "콘 신작", "2인"),
  sheetGame("미스터리 파티 Wave 5", "MTS", "여럿이 함께 즐기는 머더 미스터리 게임입니다.", "콘 신작", "추리", "적당히"),
  sheetGame("킵더히 확장", "MTS", "비대칭 협동 던전 디펜스·덱빌딩 게임의 확장입니다.", "콘 신작", "협력", "적당히"),
  sheetGame("스타일마스터", "보드엠", "패턴을 맞추는 게임입니다.", "콘 신작", "가족"),
  sheetGame("스누피 장기자랑", "보드엠", "간단한 덱빌딩과 트릭테이킹을 결합한 게임입니다.", "콘 신작", "전략"),
  sheetGame("다다다", "행복한 바오밥", "언어를 만들어 가는 협력 파티게임입니다.", "콘 신작", "협력"),
  sheetGame("해녀 미니 확장", "행복한 바오밥", "라이트 게임 《해녀》에 새 이벤트 카드를 더하는 확장입니다.", "콘 신작"),
  sheetGame("탑텐 TV 시트콤", "행복한 바오밥", "다섯 질문이 하나의 에피소드로 이어지는 《탑텐 TV》 게임입니다.", "콘 신작", "파티"),
  sheetGame("플레이 제주", "행복한 바오밥", "제주도 테마와 만칼라 형식을 결합한 게임입니다.", "콘 신작", "가족"),
  sheetGame("이레이저", "행복한 바오밥", "힌트가 점점 지워지는 추리 게임입니다.", "콘 신작", "추리"),
  sheetGame("매치매치", "행복한 바오밥", "짝을 맞추는 협력 게임입니다.", "콘 신작", "협력"),
  sheetGame("컬러로", "행복한 바오밥", "타일을 가져오며 펼치는 추상전략 게임입니다.", "콘 신작", "전략"),
  sheetGame("커버넌트", "아스모디", "제한된 액션에서 최적의 선택을 찾는 일꾼 놓기 게임입니다.", "콘 신작", "전략", "적당히"),
  { ...sheetGame("킹덤 크로싱", "아스모디", "쾨니히스베르크의 다리 문제를 풀어낸 전략 게임입니다.", "콘 신작", "전략", "적당히", asmodeeSource), image: "/covers/asmodee-lineup-a.png", imageCrop: { position: "0% 18%", size: "310% auto" } },
  { ...sheetGame("내셔널 이코노미", "아스모디", "수요와 공급을 일꾼 놓기 방식으로 풀어낸 게임입니다.", "콘 신작", "전략", "적당히", asmodeeSource), image: "/covers/asmodee-lineup-a.png", imageCrop: { position: "50% 18%", size: "310% auto" } },
  { ...sheetGame("패스 더 워드", "아스모디", "《텔레스트레이션》과 《저스트 원》의 감각을 결합한 파티게임입니다.", "콘 신작", "파티", "가볍게", asmodeeSource), image: "/covers/asmodee-lineup-a.png", imageCrop: { position: "0% 84%", size: "310% auto" } },
  { ...sheetGame("코스모", "아스모디", "서로 다른 덱을 골라 즐기는 홀덤 게임으로, 비딩으로 운을 극복할 수 있습니다.", "콘 신작", "파티", "적당히", asmodeeSource), image: "/covers/asmodee-lineup-a.png", imageCrop: { position: "50% 84%", size: "310% auto" } },
  { ...sheetGame("타카마치", "아스모디", "주사위로 패턴을 찾는 보드게임입니다.", "콘 신작", "가족", "가볍게", asmodeeSource), image: "/covers/asmodee-lineup-a.png", imageCrop: { position: "100% 84%", size: "310% auto" } },
  { ...sheetGame("언매치드: 닌자 거북이", "아스모디", "《언매치드》에 닌자 거북이 IP를 더한 확장입니다.", "콘 신작", "2인", "적당히", asmodeeSource), image: "/covers/asmodee-lineup-b.png", imageCrop: { position: "0% 18%", size: "285% auto" } },
  { ...sheetGame("암바르", "아스모디", "푸시 유어 럭과 추상전략을 결합한 게임입니다.", "콘 신작", "전략", "가볍게", asmodeeSource), image: "/covers/asmodee-lineup-b.png", imageCrop: { position: "100% 18%", size: "285% auto" } },
  { ...sheetGame("캐치 스케치: 롤&메스", "아스모디", "주사위로 그림 그리기 규칙을 더하는 확장입니다.", "콘 신작", "파티", "가볍게", asmodeeSource), image: "/covers/asmodee-lineup-b.png", imageCrop: { position: "50% 100%", size: "285% auto" } },
  sheetGame("우리들의 여름방학 · 퍼퓨머리 · 웬디, 어른이 되렴", "언더독게임즈", "일본 게임 위주의 머더 미스터리 대표작 라인업입니다.", "대표작", "추리", "적당히"),
  sheetGame("옵시디언 프로토콜", "라쿤펀치", "미니어처 게임 대표작입니다.", "대표작", "전략", "적당히"),
  sheetGame("미니와일드 시리즈 · 체이싱 앨리스", "피스크래프트", "공유 시트에 공개된 대표작 라인업입니다.", "대표작"),
  sheetGame("원카드 배틀 · 플립던전", "드로우", "공유 시트에 공개된 대표작 라인업입니다.", "대표작", "가족"),
  sheetGame("플랜비 · 비틀레이싱", "업앤업", "환경 교육과 보드게임을 결합한 대표작 라인업입니다.", "대표작", "가족"),
  sheetGame("쿡팟! · 인체인", "디미디움", "공유 시트에 공개된 대표작 라인업입니다.", "대표작", "가족"),
  sheetGame("멍탐정 푸들 · 미스터리 맨션 0719 · 북부대공을 암살하는 법", "미스터리 게임즈", "추리·머더 미스터리 대표작 라인업입니다.", "대표작", "추리", "적당히"),
  sheetGame("미스터리 스퀘어 시즌 3", "서월", "현장 체험형 추리 이벤트와 함께 소개되는 대표작입니다.", "대표작", "추리"),
  sheetGame("에이전트 블랙 로테이션", "올린스튜디오", "공유 시트에 공개된 대표작입니다.", "대표작", "전략"),
  sheetGame("레드 룸 · 라스트캠프", "보드마카브라더스", "공유 시트에 공개된 대표작 라인업입니다.", "대표작", "추리"),
  sheetGame("한강 에볼루션 · 푸드체인", "초이스", "공유 시트에 공개된 대표작 라인업입니다.", "대표작", "전략", "적당히"),
  sheetGame("평화주의 레이드", "문라이트 게임즈", "공유 시트에 공개된 대표작입니다.", "대표작", "협력"),
  sheetGame("미스터리 로얄", "보드팝", "보드게임·굿즈 기획 기업의 대표작입니다.", "대표작", "추리"),
  sheetGame("부릉부릉 쿼카 · 도리도리 미어", "실버건게임즈", "공유 시트에 공개된 대표작 라인업입니다.", "대표작", "가족"),
  sheetGame("메이즐링", "메이즐링", "접는 미로를 활용한 대표작입니다.", "대표작", "가족"),
  sheetGame("난 오타쿠가 아니야!!", "오타메이커", "공유 시트에 공개된 대표작입니다.", "대표작", "파티"),
  sheetGame("문학가의 집 · 그날 그밤 · 속의 살인마", "유메카라", "공유 시트에 공개된 추리·머더 미스터리 대표작 라인업입니다.", "대표작", "추리", "적당히"),
  sheetGame("매직넘버일레븐 · 프레지던트메이커 · 항로개척자", "플루토게임즈", "공유 시트에 공개된 대표작 라인업입니다.", "대표작", "전략", "적당히"),
];

const vendorTabs = ["전체", ...Array.from(new Set(games.map((game) => game.publisher)))];
const vendorNotes: Record<string, string> = {
  "전체": "공유 시트에 정리된 참가 업체와 공개 신작·대표작을 한곳에서 살펴보세요.",
  "만두게임즈": "공식 부스 포스터 기준: 파티·캐주얼·명작 게임 14종의 신작 체험 라인업입니다. 현장 운영은 변동될 수 있습니다.",
  "코리아보드게임즈": "가족·파티·협력까지 폭넓게 체험할 수 있는 신작 부스입니다.",
  "보드피아": "전략 확장과 테마 신작을 중심으로 구성된 부스입니다.",
  "아스모디": "2인 대전과 확장·후속작 라인업을 확인하세요.",
  "보드엠": "플라워즈, P.I., 테이크 타임 등 7월 신작 체험 라인업입니다.",
  "MTS": "전략·2인 게임을 중심으로 대표작을 소개합니다.",
  "데블다이스": "데드 바이 데이라이트 관련 현장 공개를 확인하세요.",
  "게임올로지": "공간 퍼즐과 2인 카드게임을 선보입니다.",
  "보드붐": "짧은 라운드의 가족·파티 게임을 즐길 수 있습니다.",
  "매직빈게임즈": "추상전략 중심의 2인·가족 게임 라인업입니다.",
  "조엔": "휴대하기 좋은 손기술 가족 게임을 소개합니다.",
  "놀이속의세상": "세대가 함께 즐기는 클래식 게임 부스입니다.",
  "옐로우스타게임즈": "엔진빌딩과 노선 운영 전략게임을 확인하세요.",
};
const vendorLinks: Record<string, { label: string; url: string }> = {
  "만두게임즈": { label: "공식 부스 소개 ↗", url: mandooSource },
  "코리아보드게임즈": { label: "공식 부스 소개 ↗", url: kbgSource },
  "보드피아": { label: "신작 공개 자료 ↗", url: "https://boardlife.co.kr/bbs_detail.php?tb=board_news&bbs_num=16270" },
  "보드엠": { label: "신작 공개 자료 ↗", url: "https://boardlife.co.kr/bbs_detail.php?tb=board_news&bbs_num=16271" },
  "아스모디": { label: "신작 공개 자료 ↗", url: "https://boardlife.co.kr/bbs_detail.php?tb=board_news&bbs_num=16288" },
  "MTS": { label: "공유 시트 라인업 ↗", url: "https://docs.google.com/spreadsheets/d/1GO008TzPSP_DikyHO8XppqErtj1Zz74K2glS7N4UhLM/edit?gid=1521344712#gid=1521344712" },
  "행복한 바오밥": { label: "공유 시트 라인업 ↗", url: "https://docs.google.com/spreadsheets/d/1GO008TzPSP_DikyHO8XppqErtj1Zz74K2glS7N4UhLM/edit?gid=1521344712#gid=1521344712" },
};
const vendorFeatures: Record<string, { image: string; title: string; description: string; source: string }> = {
  "만두게임즈": {
    image: "/covers/mandoo-booth-lineup-2026.jpg",
    title: "공식 신작 체험 라인업",
    description: "도파민 폭발 신작부터 베스트셀러 파티 게임까지. 공식 게시물에 표시된 14종의 체험 게임을 분류별로 확인하세요.",
    source: mandooSource,
  },
};
const vendorEvents: Record<string, { image: string; date: string; title: string; location: string; description: string; source: string }> = {
  "아스모디": {
    image: "/covers/asmodee-djeco-schedule.jpg",
    date: "07.18 SAT · 13:00–17:00",
    title: "아스모 플레이 · DJECO 챌린지",
    location: "COEX 3F · 컨퍼런스룸 318호",
    description: "미스테릭스 · 룰고기 친구들 · 출동 로켓 구조대의 3종 미션. 참여만 해도 할인 쿠폰을 받고, 2개 이상 성공하면 보드게임을 받을 수 있습니다.",
    source: asmodeeScheduleSource,
  },
};
const mapBooths = [
  ["만두게임즈", "map-mandoo"], ["코리아보드게임즈", "map-kbg"], ["언더독게임즈", "map-underdog"], ["보드피아", "map-boardpia"],
  ["하비게임몰", "map-hobby"], ["데블다이스", "map-devil"], ["게임올로지", "map-gameology"], ["놀이속의세상", "map-nori"],
  ["매직빈게임즈", "map-magicbean"], ["옐로우스타게임즈", "map-yellowstar"], ["MTS", "map-mts"], ["보드엠", "map-boardm"],
  ["행복한 바오밥", "map-baobab"], ["아스모디", "map-asmodee"], ["보드붐", "map-boardboom"], ["조엔", "map-joen"],
] as const;

export default function Home() {
  const [filter, setFilter] = useState("전체");
  const [query, setQuery] = useState("");
  const [selectedVendor, setSelectedVendor] = useState("전체");
  const [selectedGame, setSelectedGame] = useState(games[0]);
  const filtered = useMemo(() => games.filter((game) => (filter === "전체" || game.type === filter) && (selectedVendor === "전체" || game.publisher === selectedVendor) && `${game.title} ${game.publisher}`.toLowerCase().includes(query.toLowerCase())), [filter, query, selectedVendor]);
  const selectVendor = (vendor: string) => { setSelectedVendor(vendor); setFilter("전체"); const first = games.find((game) => vendor === "전체" || game.publisher === vendor); if (first) setSelectedGame(first); document.querySelector("#vendors")?.scrollIntoView({ behavior: "smooth", block: "start" }); };

  return <main>
    <header className="nav"><a className="brand" href="#top">BGC<span>26</span></a><nav><a href="#map">MAP</a><div className="vendor-menu"><a href="#vendors">참가 업체 <span>↓</span></a><div className="vendor-menu-panel">{vendorTabs.filter((vendor) => vendor !== "전체").map((vendor) => <button key={vendor} onClick={() => selectVendor(vendor)}>{vendor}<small>{games.filter((game) => game.publisher === vendor).length} GAMES</small></button>)}</div></div></nav><a className="nav-link" href="https://www.boardgamecon.com/" target="_blank" rel="noreferrer">OFFICIAL ↗</a></header>
    <section className="hero" id="top"><div className="hero-copy"><p className="mono">2026 BOARDGAMECON / SEOUL</p><h1>올해의 판을<br/>고르세요<span className="dot">.</span></h1><p className="hero-description">한눈에 보는 부스, 신작, 그리고<br/>테이블 위에서 시작될 이야기.</p><div className="hero-meta mono"><span>07.16 — 07.19</span><span>10:00 — 18:00</span><span>COEX B1 · SEOUL</span></div></div><div className="hero-number" aria-hidden="true">26</div></section>
    <section className="info-strip"><span className="mono">FREE ADMISSION</span><span>전 연령 · 전시 & 체험 · 대회 · 작가존</span><a href="https://english.visitkorea.or.kr/svc/contents/contentsView.do?vcontsId=69141" target="_blank" rel="noreferrer">행사 정보 ↗</a></section>
    <section className="map-section" id="map"><div className="map-panel"><div className="map-label mono">COEX EXHIBITION HALL B1 / SHEET VERIFIED BOOTH MAP</div><div className="hall"><div className="hall-note mono">← WEST HALL</div><div className="entrance">ENTRANCE →</div>{mapBooths.map(([vendor, position]) => <button className={`booth ${position}`} onClick={() => selectVendor(vendor)} key={vendor} aria-label={`${vendor} 탭 보기`}>{vendor === "코리아보드게임즈" ? <>코리아<br/>보드게임즈</> : vendor}</button>)}<div className="booth map-mimi">미미월드</div><div className="booth map-raccoon">라쿤펀치<br/>피스크래프트</div><div className="booth map-boardboom-side">보드붐</div><div className="booth map-creators">작가존 · 캐릭터 라이선싱 페어</div><div className="map-legend"><i></i> 클릭: 업체 탭 이동 <span>·</span> <b></b> 도면상 동반 부스</div></div><div className="map-note"><p>공유 시트와 현장 도면 기준으로 재배치했습니다. <strong>파란 블록</strong>을 클릭하면 해당 업체 게임을 바로 볼 수 있습니다.</p><button onClick={() => selectVendor("전체")}>전체 라인업 보기 <span>↓</span></button></div></div></section>
    <section className="vendors-section" id="vendors"><div className="vendor-content"><div className="game-tools"><div className="filter-row">{["전체", "파티", "가족", "협력", "추리", "2인", "전략"].map((item) => <button className={filter === item ? "active" : ""} onClick={() => setFilter(item)} key={item}>{item}</button>)}</div><label className="search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`${selectedVendor} 게임명 검색`} aria-label="게임명 검색" /></label></div><div className="selection-row"><p className="selection-label"><span className="mono">NOW VIEWING</span> {selectedVendor} <em>{filtered.length} GAMES</em></p>{vendorLinks[selectedVendor] && <a className="vendor-source" href={vendorLinks[selectedVendor].url} target="_blank" rel="noreferrer">{vendorLinks[selectedVendor].label}</a>}</div>{vendorFeatures[selectedVendor] && <aside className="vendor-feature"><a href={vendorFeatures[selectedVendor].source} target="_blank" rel="noreferrer"><img src={vendorFeatures[selectedVendor].image} alt={`${selectedVendor} ${vendorFeatures[selectedVendor].title} 포스터`} /></a><div><span className="mono">OFFICIAL BOOTH POST</span><h2>{vendorFeatures[selectedVendor].title}</h2><p>{vendorFeatures[selectedVendor].description}</p><a href={vendorFeatures[selectedVendor].source} target="_blank" rel="noreferrer">만두게임즈 원문 보기 ↗</a></div></aside>}{vendorEvents[selectedVendor] && <aside className="vendor-event"><a href={vendorEvents[selectedVendor].source} target="_blank" rel="noreferrer"><img src={vendorEvents[selectedVendor].image} alt={`${selectedVendor} ${vendorEvents[selectedVendor].title} 일정`} /></a><div><span className="mono">EVENT SCHEDULE</span><p className="event-date">{vendorEvents[selectedVendor].date}</p><h2>{vendorEvents[selectedVendor].title}</h2><b>{vendorEvents[selectedVendor].location}</b><p>{vendorEvents[selectedVendor].description}</p><a href={vendorEvents[selectedVendor].source} target="_blank" rel="noreferrer">현장 이벤트 원문 보기 ↗</a></div></aside>}<div className="game-cards">{filtered.map((game) => <article className={`game-card ${selectedGame.title === game.title ? "selected" : ""}`} key={`${game.publisher}-${game.title}`}>{game.image && <button className="game-cover" onClick={() => setSelectedGame(game)} aria-label={`${game.title} 상세 보기`}>{game.imageCrop ? <span className="game-cover-crop" style={{ backgroundImage: `url(${game.image})`, backgroundPosition: game.imageCrop.position, backgroundSize: game.imageCrop.size }} aria-hidden="true" /> : <img src={game.image} alt={`${game.title} 출시 이미지`} />}</button>}<button className="game-card-main" onClick={() => setSelectedGame(game)}><span className="mono">{game.status}</span><h3>{game.title}</h3><p>{game.description}</p><div><b>{game.type}</b><b>{game.weight}</b><span>{game.players} · {game.time}</span></div></button>{game.source && <a href={game.source} target="_blank" rel="noreferrer">사진·출시 공지 보기 ↗</a>}</article>)}</div></div></section>
    <footer><a className="brand" href="#top">BGC<span>26</span></a><p>업체·신작 정보는 2026.07.14 Google 공유 시트와 Boardlife 공개 정리를 기준으로 업데이트했습니다.<br/>방문 전 공식 홈페이지에서 최신 공지를 확인하세요.</p><div><a href="https://docs.google.com/spreadsheets/d/1GO008TzPSP_DikyHO8XppqErtj1Zz74K2glS7N4UhLM/edit?gid=1521344712#gid=1521344712" target="_blank" rel="noreferrer">GOOGLE SHEET ↗</a><a href="https://boardlife.co.kr/bbs_detail.php?tb=board_community&bbs_num=78795" target="_blank" rel="noreferrer">BOARDLIFE SOURCE ↗</a><a href="https://www.boardgamecon.com/" target="_blank" rel="noreferrer">OFFICIAL ↗</a></div></footer>
  </main>;
}
