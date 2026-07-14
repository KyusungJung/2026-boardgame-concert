"use client";

import { useMemo, useState } from "react";

type Game = {
  title: string;
  publisher: string;
  type: "파티" | "전략" | "협력" | "추리" | "가족";
  weight: "가볍게" | "적당히" | "깊게";
  description: string;
  audience: string;
  video: string;
};

const games: Game[] = [
  { title: "치킨 vs 핫도그", publisher: "만두게임즈", type: "파티", weight: "가볍게", description: "손기술로 웃음을 만드는 덱스터리티 파티게임.", audience: "여럿이 바로 웃고 싶은 팀", video: "치킨 vs 핫도그 보드게임" },
  { title: "태플", publisher: "만두게임즈", type: "파티", weight: "가볍게", description: "제한 시간 안에 단어를 잇는 폭탄 돌리기.", audience: "어휘·순발력 게임 팬", video: "태플 보드게임" },
  { title: "컴파일", publisher: "만두게임즈", type: "전략", weight: "적당히", description: "AI 테마의 2인 카드 대결 게임.", audience: "짧고 치열한 2인전을 찾는 사람", video: "컴파일 보드게임" },
  { title: "데스 스테이션", publisher: "코리아보드게임즈", type: "추리", weight: "적당히", description: "타일을 놓으며 단서를 좁혀 가는 미스터리.", audience: "공간 퍼즐과 추리를 함께 좋아하는 사람", video: "데스 스테이션 보드게임" },
  { title: "두냐자드의 모험", publisher: "코리아보드게임즈", type: "협력", weight: "가볍게", description: "이야기 카드의 단서를 따라 타일 더미를 함께 탐색.", audience: "가족·입문자 협력 플레이", video: "두냐자드의 모험 보드게임" },
  { title: "새티 확장: 우주기관", publisher: "보드피아", type: "전략", weight: "깊게", description: "《세티》에 새 외계 종족과 우주 연구의 변주를 더하는 확장.", audience: "세티를 깊게 즐긴 전략 게이머", video: "세티 우주기관 보드게임" },
  { title: "엠버하트", publisher: "보드피아", type: "전략", weight: "적당히", description: "용이 등장하는 판타지 세계의 가벼운 일꾼 놓기.", audience: "유로게임 입문을 원하는 사람", video: "엠버하트 보드게임" },
  { title: "덱커스", publisher: "보드피아", type: "전략", weight: "적당히", description: "사이버펑크 세계에서 즐기는 1인 덱빌딩.", audience: "혼자 몰입할 게임을 찾는 사람", video: "덱커스 보드게임" },
  { title: "원드러스 크리처: 윈터폴", publisher: "MTS", type: "전략", weight: "적당히", description: "환상 생물을 모으고 보호 구역을 가꾸는 확장.", audience: "수집과 엔진 빌딩을 좋아하는 사람", video: "원드러스 크리처 윈터폴" },
  { title: "미스터리 파티 Wave 5", publisher: "MTS", type: "추리", weight: "적당히", description: "여럿이 역할을 맡아 사건을 푸는 머더 미스터리.", audience: "몰입형 모임을 준비하는 팀", video: "미스터리 파티 보드게임" },
  { title: "플라워즈", publisher: "보드엠", type: "가족", weight: "가볍게", description: "꽃 카드를 배치하며 완성도를 노리는 라이트 게임.", audience: "예쁜 테이블 게임을 원하는 가족", video: "플라워즈 보드게임" },
  { title: "테이크 타임", publisher: "보드엠", type: "협력", weight: "적당히", description: "《딕싯》 제작진의 새 협동 게임.", audience: "대화와 감각을 맞추는 협력을 좋아하는 사람", video: "테이크 타임 보드게임" },
  { title: "다다다", publisher: "행복한 바오밥", type: "파티", weight: "가볍게", description: "말을 만들어 가는 언어 창조 협력 파티게임.", audience: "창의적인 대화가 즐거운 모임", video: "다다다 보드게임" },
  { title: "이레이저", publisher: "행복한 바오밥", type: "추리", weight: "가볍게", description: "힌트가 사라지기 전에 정답을 찾아야 하는 추리.", audience: "쉽고 긴장감 있는 가족 게임", video: "이레이저 보드게임" },
  { title: "커버넌트", publisher: "아스모디", type: "전략", weight: "깊게", description: "한정된 액션에서 최선의 수를 찾는 일꾼 놓기.", audience: "묵직한 최적화 퍼즐을 원하는 사람", video: "커버넌트 보드게임" },
  { title: "킹덤 크로싱", publisher: "아스모디", type: "전략", weight: "적당히", description: "쾨니히스베르크의 다리 문제를 전략 퍼즐로 풀어낸다.", audience: "추상 전략과 길 연결 퍼즐 팬", video: "킹덤 크로싱 보드게임" },
];

const vendors = ["만두게임즈", "코리아보드게임즈", "보드피아", "하비게임몰", "데블다이스", "게임올로지", "보드붐", "놀이속의세상", "매직빈게임즈", "옐로우스타게임즈", "MTS", "보드엠", "행복한 바오밥", "아스모디"];

export default function Home() {
  const [filter, setFilter] = useState("전체");
  const [query, setQuery] = useState("");
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const filtered = useMemo(() => games.filter((game) => (filter === "전체" || game.type === filter) && (!selectedVendor || game.publisher === selectedVendor) && `${game.title} ${game.publisher}`.toLowerCase().includes(query.toLowerCase())), [filter, query, selectedVendor]);
  const showGames = (vendor?: string) => { setSelectedVendor(vendor ?? null); document.querySelector("#games")?.scrollIntoView({ behavior: "smooth" }); };

  return <main>
    <header className="nav"><a className="brand" href="#top">BGC<span>26</span></a><nav><a href="#map">MAP</a><a href="#games">NEW GAMES</a><a href="#vendors">VENDORS</a><a href="#watch">WATCH</a></nav><a className="nav-link" href="https://www.boardgamecon.com/" target="_blank">OFFICIAL ↗</a></header>
    <section className="hero" id="top"><div className="hero-copy"><p className="mono">2026 BOARDGAMECON / SEOUL</p><h1>올해의 판을<br/>고르세요<span className="dot">.</span></h1><p className="hero-description">한눈에 보는 부스, 신작, 그리고<br/>테이블 위에서 시작될 이야기.</p><div className="hero-meta mono"><span>07.16 — 07.19</span><span>10:00 — 18:00</span><span>COEX B1 · SEOUL</span></div></div><div className="hero-number" aria-hidden="true">26</div></section>
    <section className="info-strip"><span className="mono">FREE ADMISSION</span><span>전 연령 · 전시 & 체험 · 대회 · 작가존</span><a href="https://english.visitkorea.or.kr/svc/contents/contentsView.do?vcontsId=69141" target="_blank">행사 정보 ↗</a></section>
    <section className="map-section" id="map"><div className="section-heading"><p className="mono">01 / FLOOR GUIDE</p><h2>길을 잃기 전에,<br/>먼저 판을 읽으세요.</h2></div><div className="map-panel"><div className="map-label mono">COEX EXHIBITION HALL B1</div><div className="hall"><div className="entrance">ENTRANCE ↓</div><div className="booth stage">STAGE<br/><small>LIVE · TOURNAMENT</small></div><div className="booth b1">만두<br/>게임즈</div><div className="booth b2">코리아<br/>보드게임즈</div><div className="booth b3">보드피아</div><div className="booth b4">아스모디</div><div className="booth b5">보드엠</div><div className="booth b6">MTS</div><div className="booth b7">작가존</div><div className="booth b8">체험존</div><div className="map-legend"><i></i> 추천 신작 부스 <span>·</span> <b></b> 체험·이벤트</div></div><div className="map-note"><p>입구에서 오른쪽은 <strong>대형 퍼블리셔</strong>, 안쪽은 <strong>작가존과 체험존</strong> 중심입니다.</p><button onClick={() => showGames()}>신작부터 살펴보기 <span>↓</span></button></div></div></section>
    <section className="games-section" id="games"><div className="section-heading"><p className="mono">02 / NEW RELEASES</p><h2>이번 주말,<br/>무엇을 펼칠까?</h2></div><div className="game-tools"><div className="filter-row">{["전체", "파티", "가족", "협력", "추리", "전략"].map(item => <button className={filter === item ? "active" : ""} onClick={() => { setFilter(item); setSelectedVendor(null); }} key={item}>{item}</button>)}</div><label className="search"><span>⌕</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="게임 또는 업체 검색" aria-label="게임 또는 업체 검색"/></label></div>{selectedVendor && <div className="result-title"><span>{selectedVendor} 신작</span><button onClick={() => setSelectedVendor(null)}>필터 해제 ×</button></div>}<div className="game-list">{filtered.map((game, i) => <article className="game-row" key={game.title}><span className="mono index">{String(i + 1).padStart(2, "0")}</span><div><p className="game-title">{game.title}</p><button className="publisher" onClick={() => showGames(game.publisher)}>{game.publisher} ↗</button></div><p className="game-desc">{game.description}</p><div className="game-tags"><span>{game.type}</span><span>{game.weight}</span></div><p className="audience">{game.audience}</p><a className="play-link" href={`https://www.youtube.com/results?search_query=${encodeURIComponent(game.video)}`} target="_blank" aria-label={`${game.title} 유튜브 검색`}>▶</a></article>)}</div></section>
    <section className="vendors-section" id="vendors"><div className="vendor-intro"><p className="mono">03 / EXHIBITORS</p><h2>부스마다<br/>다른 한 수.</h2><p>공개 시트에 정리된 참가 부스를 중심으로, 관심 있는 퍼블리셔의 신작만 빠르게 모아 보세요.</p></div><div className="vendor-grid">{vendors.map((vendor, i) => <button key={vendor} onClick={() => showGames(vendor)}><span className="mono">{String(i + 1).padStart(2, "0")}</span><strong>{vendor}</strong><i>↘</i></button>)}</div></section>
    <section className="watch-section" id="watch"><div className="section-heading"><p className="mono">04 / WATCH FIRST</p><h2>룰 설명보다 먼저,<br/>테이블의 분위기.</h2></div><div className="video-grid"><a href="https://www.youtube.com/results?search_query=2026+%EB%B3%B4%EB%93%9C%EA%B2%8C%EC%9E%84%EC%BD%98" target="_blank" className="featured-video"><span className="mono">YOUTUBE SEARCH</span><b>2026 보드게임콘<br/>관련 영상 모아보기</b><i>▶</i></a><a href="https://www.youtube.com/results?search_query=%EB%B3%B4%EB%93%9C%EA%B2%8C%EC%9E%84+%EC%8B%A0%EC%9E%91+%EB%A6%AC%EB%B7%B0" target="_blank" className="video-card"><span>신작 리뷰</span><b>발매 전, 규칙과<br/>플레이 감각 확인하기</b><i>↗</i></a><a href="https://www.youtube.com/results?search_query=%EB%B3%B4%EB%93%9C%EA%B2%8C%EC%9E%84%EC%BD%98+%ED%98%84%EC%9E%A5" target="_blank" className="video-card blue"><span>현장 스케치</span><b>사람과 테이블이<br/>만드는 행사 풍경</b><i>↗</i></a></div></section>
    <footer><a className="brand" href="#top">BGC<span>26</span></a><p>이 가이드는 공개된 행사 정보와 커뮤니티 정리 시트를 바탕으로 제작되었습니다.<br/>방문 전 공식 홈페이지에서 최신 공지를 확인하세요.</p><div><a href="https://docs.google.com/spreadsheets/d/1GO008TzPSP_DikyHO8XppqErtj1Zz74K2glS7N4UhLM/edit?gid=1521344712#gid=1521344712" target="_blank">SOURCE SHEET ↗</a><a href="https://www.boardgamecon.com/" target="_blank">OFFICIAL ↗</a></div></footer>
  </main>;
}
