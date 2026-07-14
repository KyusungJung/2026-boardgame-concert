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
  source?: string;
};

const games: Game[] = [
  { title: "컴파일: 메인 1", publisher: "만두게임즈", type: "2인", weight: "적당히", players: "2인", time: "20–30분", status: "대표작", description: "AI 테마 덱으로 세 전선을 두고 겨루는 카드 전략전. 높은 카드는 인장, 낮은 카드는 능력으로 쓰는 선택이 핵심입니다.", audience: "짧고 치열한 2인전을 찾는 사람", video: "컴파일 메인 1 보드게임", image: "/covers/compile-release.png", source: "https://boardlife.co.kr/bbs_detail.php?tb=board_news&bbs_num=16263" },
  { title: "카르디아", publisher: "만두게임즈", type: "2인", weight: "적당히", players: "2인", time: "20분", status: "대표작", description: "동시 공개한 카드의 높낮이에 따라 인장 획득과 카드 능력이 갈리는 심리전입니다.", audience: "블러핑과 심리전을 좋아하는 2인", video: "카르디아 보드게임", image: "/covers/cardia.png" },
  { title: "꼬치의 달인", publisher: "만두게임즈", type: "파티", weight: "가볍게", players: "2–4인", time: "10분", status: "대표작", description: "주문 카드와 같은 꼬치를 먼저 완성하는 실시간 순발력 게임입니다.", audience: "바로 꺼내 웃을 수 있는 게임을 찾는 모임", video: "꼬치의 달인 보드게임" },
  { title: "두냐자드의 모험", publisher: "코리아보드게임즈", type: "협력", weight: "가볍게", players: "2–5인", time: "15분", status: "콘 신작", description: "90초 안에 이야기와 맞는 타일을 함께 찾아내는 실시간 협력 어드벤처입니다.", audience: "가족·입문자 협력 플레이", video: "두냐자드의 모험 보드게임", image: "/covers/kbg-release.webp", source: "https://boardlife.co.kr/bbs_detail.php?tb=board_news&bbs_num=16273" },
  { title: "새우깡 잡기", publisher: "코리아보드게임즈", type: "가족", weight: "가볍게", players: "2–4인", time: "10분", status: "콘 신작", description: "같은 새우깡 카드를 짝지어 버리고 갈매기 카드를 피하는 빠른 카드게임입니다.", audience: "어린이와 가볍게 즐길 가족", video: "새우깡 잡기 보드게임", image: "/covers/kbg-release.webp", source: "https://boardlife.co.kr/bbs_detail.php?tb=board_news&bbs_num=16273" },
  { title: "블러핏", publisher: "코리아보드게임즈", type: "파티", weight: "가볍게", players: "3–6인", time: "15분", status: "콘 신작", description: "숨긴 카드와 상대의 선택을 읽어 중앙 카드를 가져오는 블러핑 게임입니다.", audience: "상대 표정을 읽는 파티 게임 팬", video: "블러핏 보드게임", image: "/covers/kbg-release.webp", source: "https://boardlife.co.kr/bbs_detail.php?tb=board_news&bbs_num=16273" },
  { title: "데스 스테이션", publisher: "코리아보드게임즈", type: "추리", weight: "적당히", players: "2–4인", time: "30분", status: "콘 신작", description: "타일을 놓고 단서를 좁혀 가며 사건을 풀어내는 추리 퍼즐입니다.", audience: "추리와 공간 퍼즐을 함께 좋아하는 사람", video: "데스 스테이션 보드게임", image: "/covers/kbg-release.webp", source: "https://boardlife.co.kr/bbs_detail.php?tb=board_news&bbs_num=16273" },
  { title: "세티: 우주 기관", publisher: "보드피아", type: "전략", weight: "깊게", players: "1–4인", time: "90–150분", status: "콘 신작", description: "비대칭 우주기관 11개와 외계종족 3종, 새 프로젝트를 더하는 《세티》 확장입니다.", audience: "세티를 깊게 즐긴 전략 게이머", video: "세티 우주 기관 보드게임", image: "/covers/seti-release.png", source: "https://boardlife.co.kr/bbs_detail.php?tb=board_news&bbs_num=16258" },
  { title: "엠버하트", publisher: "보드피아", type: "전략", weight: "적당히", players: "1–4인", time: "45–75분", status: "콘 신작", description: "일꾼을 배치해 드래곤을 구조·훈련하고 밀렵꾼과 맞서는 판타지 전략게임입니다.", audience: "테마 있는 일꾼 놓기 입문자", video: "엠버하트 보드게임", image: "/covers/emberheart-release.png", source: "https://boardlife.co.kr/bbs_detail.php?tb=board_news&bbs_num=16270" },
  { title: "죄악의 카니발", publisher: "보드피아", type: "파티", weight: "가볍게", players: "3–6인", time: "20분", status: "콘 신작", description: "일곱 죄악 카드를 비밀리에 고르고 주사위를 가져오며 상대를 방해하는 블러핑 게임입니다.", audience: "가벼운 견제와 심리전을 원하는 모임", video: "죄악의 카니발 보드게임", image: "/covers/carnival-release.png", source: "https://boardlife.co.kr/bbs_detail.php?tb=board_news&bbs_num=16270" },
  { title: "태그 팀: 아서왕 전설", publisher: "아스모디", type: "2인", weight: "적당히", players: "2인", time: "20–30분", status: "콘 신작", description: "미리 구성한 카드 순서가 자동 전투를 벌이는 2인 덱빌딩 오토배틀러. 독립 플레이가 가능합니다.", audience: "전투 덱빌딩을 간결하게 즐기고 싶은 2인", video: "태그 팀 아서왕 전설 보드게임", image: "/covers/tagteam-release.png", source: "https://boardlife.co.kr/bbs_detail.php?tb=board_news&bbs_num=16288" },
  { title: "플라워즈", publisher: "보드엠", type: "가족", weight: "가볍게", players: "2–4인", time: "20분", status: "콘 신작", description: "숫자 카드의 등장 빈도와 배치 조건으로 꽃밭을 완성하는 카드 퍼즐입니다.", audience: "예쁜 테이블 게임을 원하는 가족", video: "플라워즈 보드게임", image: "/covers/flowers-release.png", source: "https://boardlife.co.kr/bbs_detail.php?tb=board_news&bbs_num=16271" },
  { title: "P.I.", publisher: "보드엠", type: "추리", weight: "적당히", players: "2–5인", time: "45분", status: "콘 신작", description: "경쟁자보다 먼저 자신의 사건을 해결해야 하는 경쟁형 추리게임입니다.", audience: "단서 조합과 추론을 좋아하는 사람", video: "P.I. 보드게임", image: "/covers/pi-release.png", source: "https://boardlife.co.kr/bbs_detail.php?tb=board_news&bbs_num=16271" },
  { title: "테이크 타임", publisher: "보드엠", type: "협력", weight: "적당히", players: "2–4인", time: "20분", status: "콘 신작", description: "제한된 의사소통만으로 숫자 카드를 시계 둘레에 배치하는 협력 퍼즐입니다.", audience: "말 없이 호흡을 맞추는 협력을 좋아하는 팀", video: "테이크 타임 보드게임", image: "/covers/taketime-release.png", source: "https://boardlife.co.kr/bbs_detail.php?tb=board_news&bbs_num=16271" },
  { title: "북 타워", publisher: "보드엠", type: "협력", weight: "가볍게", players: "1–4인", time: "15분", status: "콘 신작", description: "고양이와 책을 떨어뜨리지 않도록 함께 쌓는 협력 덱스터리티입니다.", audience: "아이와 함께할 손기술 게임", video: "북 타워 보드게임", image: "/covers/booktower-release.png", source: "https://boardlife.co.kr/bbs_detail.php?tb=board_news&bbs_num=16271" },
  { title: "원드러스 크리처", publisher: "MTS", type: "전략", weight: "적당히", players: "1–4인", time: "60–90분", status: "대표작", description: "일꾼과 생물 능력을 연계해 자신만의 엔진을 만드는 판타지 전략게임입니다.", audience: "생물 수집과 엔진 빌딩 팬", video: "원드러스 크리처 보드게임" },
  { title: "에이전트 애비뉴", publisher: "MTS", type: "2인", weight: "가볍게", players: "2인", time: "15분", status: "대표작", description: "카드 숫자와 이동을 읽어 상대 요원을 추적하는 빠른 심리전입니다.", audience: "짧은 2인 심리전을 찾는 사람", video: "에이전트 애비뉴 보드게임" },
  { title: "카르누타", publisher: "MTS", type: "전략", weight: "적당히", players: "2–4인", time: "60분", status: "대표작", description: "주술과 동물을 소재로 선택을 쌓아 가는 전략게임입니다.", audience: "테마형 중급 전략을 선호하는 사람", video: "카르누타 보드게임" },
  { title: "데드 바이 데이라이트 빅박스", publisher: "데블다이스", type: "전략", weight: "적당히", players: "2–4인", time: "—", status: "현장 공개", description: "본판과 확장·구성물을 정리하는 대형 수납 제품. 신규 살인마 ‘조련사’ 전시와 함께 공개됩니다.", audience: "데바데 보드게임 컬렉터", video: "데드 바이 데이라이트 보드게임 빅박스" },
  { title: "펜쏠로지", publisher: "게임올로지", type: "전략", weight: "가볍게", players: "2–4인", time: "20분", status: "현장 공개", description: "울타리 타일로 구역을 닫고 차지하는 영역 구성게임입니다.", audience: "공간 퍼즐을 깔끔하게 즐기는 사람", video: "펜쏠로지 보드게임" },
  { title: "네뷸라 컬러스", publisher: "게임올로지", type: "2인", weight: "가볍게", players: "2인", time: "15분", status: "현장 공개", description: "별 조각으로 세트와 연속 숫자를 만드는 2인 카드게임입니다.", audience: "작고 예쁜 2인 카드게임을 찾는 사람", video: "네뷸라 컬러스 보드게임" },
  { title: "다이스택", publisher: "보드붐", type: "파티", weight: "가볍게", players: "2–4인", time: "10분", status: "대표작", description: "주사위를 조건에 맞춰 빠르게 쌓는 손기술 게임입니다.", audience: "짧은 라운드의 손맛을 원하는 가족", video: "다이스택 보드게임" },
  { title: "점핑다이스", publisher: "보드붐", type: "파티", weight: "가볍게", players: "2–4인", time: "10분", status: "대표작", description: "주사위의 색과 숫자 조건을 빠르게 판단하는 순발력 게임입니다.", audience: "아이부터 어른까지 즐길 반응 게임", video: "점핑다이스 보드게임" },
  { title: "오목체스: 백년전쟁", publisher: "매직빈게임즈", type: "전략", weight: "적당히", players: "2인", time: "30분", status: "대표작", description: "오목의 연결 규칙과 서로 다른 이동 능력을 지닌 말을 결합한 추상전략입니다.", audience: "체스와 오목 모두 좋아하는 2인", video: "오목체스 백년전쟁 보드게임" },
  { title: "식스틴", publisher: "매직빈게임즈", type: "전략", weight: "가볍게", players: "2–4인", time: "20분", status: "대표작", description: "숫자 타일을 배치·조합하며 점수를 만드는 추상전략입니다.", audience: "규칙은 짧고 생각할 거리는 있는 게임 팬", video: "식스틴 보드게임" },
  { title: "포켓알까기", publisher: "조엔", type: "가족", weight: "가볍게", players: "2–4인", time: "10분", status: "대표작", description: "손가락으로 말을 튕겨 상대 말을 떨어뜨리는 휴대용 덱스터리티입니다.", audience: "어디서든 바로 꺼낼 게임을 찾는 가족", video: "포켓알까기 보드게임" },
  { title: "루미큐브", publisher: "놀이속의세상", type: "가족", weight: "가볍게", players: "2–4인", time: "30–60분", status: "대표작", description: "숫자 타일을 같은 숫자 그룹이나 연속 숫자 묶음으로 내려놓는 클래식입니다.", audience: "세대가 함께 앉는 가족 테이블", video: "루미큐브 보드게임" },
  { title: "어스", publisher: "옐로우스타게임즈", type: "전략", weight: "적당히", players: "1–5인", time: "45–90분", status: "대표작", description: "식물과 서식지 카드로 생태계 엔진을 구축하는 전략게임입니다.", audience: "카드 콤보를 키워 가는 엔진빌딩 팬", video: "어스 보드게임" },
  { title: "터미너스", publisher: "옐로우스타게임즈", type: "전략", weight: "적당히", players: "1–5인", time: "60–90분", status: "대표작", description: "지하철 노선을 건설하고 승객을 운송하는 전략게임입니다.", audience: "노선 연결과 운영 퍼즐을 좋아하는 사람", video: "터미너스 보드게임" },
];

const vendorTabs = ["전체", "만두게임즈", "코리아보드게임즈", "보드피아", "아스모디", "보드엠", "MTS", "데블다이스", "게임올로지", "보드붐", "매직빈게임즈", "조엔", "놀이속의세상", "옐로우스타게임즈"];
const mapBooths = [
  ["만두게임즈", "b1"], ["코리아보드게임즈", "b2"], ["보드피아", "b3"], ["아스모디", "b4"], ["보드엠", "b5"], ["MTS", "b6"],
] as const;

export default function Home() {
  const [filter, setFilter] = useState("전체");
  const [query, setQuery] = useState("");
  const [selectedVendor, setSelectedVendor] = useState("전체");
  const [selectedGame, setSelectedGame] = useState(games[0]);
  const filtered = useMemo(() => games.filter((game) => (filter === "전체" || game.type === filter) && (selectedVendor === "전체" || game.publisher === selectedVendor) && `${game.title} ${game.publisher}`.toLowerCase().includes(query.toLowerCase())), [filter, query, selectedVendor]);
  const selectVendor = (vendor: string) => { setSelectedVendor(vendor); setFilter("전체"); const first = games.find((game) => vendor === "전체" || game.publisher === vendor); if (first) setSelectedGame(first); document.querySelector("#vendors")?.scrollIntoView({ behavior: "smooth", block: "start" }); };

  return <main>
    <header className="nav"><a className="brand" href="#top">BGC<span>26</span></a><nav><a href="#map">MAP</a><a href="#vendors">VENDORS</a></nav><a className="nav-link" href="https://www.boardgamecon.com/" target="_blank" rel="noreferrer">OFFICIAL ↗</a></header>
    <section className="hero" id="top"><div className="hero-copy"><p className="mono">2026 BOARDGAMECON / SEOUL</p><h1>올해의 판을<br/>고르세요<span className="dot">.</span></h1><p className="hero-description">한눈에 보는 부스, 신작, 그리고<br/>테이블 위에서 시작될 이야기.</p><div className="hero-meta mono"><span>07.16 — 07.19</span><span>10:00 — 18:00</span><span>COEX B1 · SEOUL</span></div></div><div className="hero-number" aria-hidden="true">26</div></section>
    <section className="info-strip"><span className="mono">FREE ADMISSION</span><span>전 연령 · 전시 & 체험 · 대회 · 작가존</span><a href="https://english.visitkorea.or.kr/svc/contents/contentsView.do?vcontsId=69141" target="_blank" rel="noreferrer">행사 정보 ↗</a></section>
    <section className="map-section" id="map"><div className="section-heading"><p className="mono">01 / FLOOR GUIDE</p><h2>길을 잃기 전에,<br/>먼저 판을 읽으세요.</h2></div><div className="map-panel"><div className="map-label mono">COEX EXHIBITION HALL B1 / BOOTH SELECT</div><div className="hall"><div className="entrance">ENTRANCE ↓</div><div className="booth stage">STAGE<br/><small>LIVE · TOURNAMENT</small></div>{mapBooths.map(([vendor, position]) => <button className={`booth ${position}`} onClick={() => selectVendor(vendor)} key={vendor} aria-label={`${vendor} 탭 보기`}>{vendor === "코리아보드게임즈" ? <>코리아<br/>보드게임즈</> : vendor}</button>)}<div className="booth b7">작가존</div><div className="booth b8">체험존</div><div className="map-legend"><i></i> 클릭: 업체 탭 이동 <span>·</span> <b></b> 체험·이벤트</div></div><div className="map-note"><p>부스를 클릭하면 아래 <strong>업체별 탭</strong>에서 해당 게임을 바로 볼 수 있습니다.</p><button onClick={() => selectVendor("전체")}>전체 라인업 보기 <span>↓</span></button></div></div></section>
    <section className="vendors-section" id="vendors"><div className="vendor-intro"><p className="mono">02 / EXHIBITORS & GAMES</p><h2>부스마다<br/>다른 한 수.</h2><p>탭을 고르면 해당 업체의 공개 신작·대표작과 상세 플레이 정보를 보여줍니다.</p></div><div className="vendor-content"><div className="vendor-tabs" role="tablist" aria-label="참가 업체">{vendorTabs.map((vendor) => <button key={vendor} role="tab" aria-selected={selectedVendor === vendor} className={selectedVendor === vendor ? "active" : ""} onClick={() => selectVendor(vendor)}>{vendor}</button>)}</div><div className="game-tools"><div className="filter-row">{["전체", "파티", "가족", "협력", "추리", "2인", "전략"].map((item) => <button className={filter === item ? "active" : ""} onClick={() => setFilter(item)} key={item}>{item}</button>)}</div><label className="search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="게임명 검색" aria-label="게임명 검색" /></label></div><p className="selection-label"><span className="mono">NOW VIEWING</span> {selectedVendor} <em>{filtered.length} GAMES</em></p><div className="game-cards">{filtered.map((game) => <article className={`game-card ${selectedGame.title === game.title ? "selected" : ""}`} key={game.title}>{game.image && <button className="game-cover" onClick={() => setSelectedGame(game)} aria-label={`${game.title} 상세 보기`}><img src={game.image} alt={`${game.title} 출시 이미지`} /></button>}<button className="game-card-main" onClick={() => setSelectedGame(game)}><span className="mono">{game.status}</span><h3>{game.title}</h3><p>{game.description}</p><div><b>{game.type}</b><b>{game.weight}</b><span>{game.players} · {game.time}</span></div></button>{game.source && <a href={game.source} target="_blank" rel="noreferrer">출시 공지 보기 ↗</a>}</article>)}</div></div></section>
    <footer><a className="brand" href="#top">BGC<span>26</span></a><p>업체·신작 정보는 2026.07.13 기준 Boardlife 공개 정리와 주최·업체 공개 자료를 요약했습니다.<br/>방문 전 공식 홈페이지에서 최신 공지를 확인하세요.</p><div><a href="https://boardlife.co.kr/bbs_detail.php?tb=board_community&bbs_num=78795" target="_blank" rel="noreferrer">BOARDLIFE SOURCE ↗</a><a href="https://www.boardgamecon.com/" target="_blank" rel="noreferrer">OFFICIAL ↗</a></div></footer>
  </main>;
}
