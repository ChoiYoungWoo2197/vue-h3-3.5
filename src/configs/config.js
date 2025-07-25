//자동화 개발/운영
var API_URL = process.env.NODE_ENV === 'development' ? '' : "https://api.heeil.com/v1/h3";

//인증키
var TEMP_KEY = "8ce31da9509b8722106b4d1d8604853f";

//몽고API ID
var MONG_ID = 1279963;

//Summary 순서
var SUMMARY_SORT = { cst: 0, im: 1, clk: 2, cv: 3, cr: 4, ctr:5, cpc:6, cpa:7, cvr:8, roas:9 };

//Media분석 순서
var MEDIA_ANALYSIS_SORT = { im: 0, clk: 1, ctr:2, cpc:3, cst: 4, cv: 5, cr: 6, cpa:7, cvr:8,roas:9 };

//매체 순서
var MEDIA_SORT = {N: 0, D: 1, Nda: 2, K: 3, google: 4, TOTAL: 99};

//입찰 전략
var BIDGOAL = {max_click: "클릭 수 최대화", max_conv: "전환 수 최대화", none: "수동 입찰", manual: "수동 입찰", autobid: "자동 입찰"}

// 청구 기준
var BIDTYPE = {cpc: "cpc", cpm: "cpm", cpv: "cpv", cpms: "cpms"}

//예산 타입
var BUDGETTYPE = {daily: "일예산",  total: "총예산"}

//게제 위치
var PGGROUPS = {
  band: "네이버 패밀리 매체 > 피드 영역",
  f_banner: "네이버 패밀리 매체 > 배너 영역", 
  f_smartchannel: "네이버 패밀리 매체 > 스마트채널",
  m_banner: "네이버 > 배너 영역 > 서비스 통합",
  m_feed: "네이버 > 피드 영역",
  m_main: "네이버 > 배너 영역 > 네이버 메인",
  m_smartchannel: "네이버 > 스마트채널",
  nw_banner: "네이버 퍼포먼스 네트워크 > 배너 영역",
  nw_smartchannel: "네이버 퍼포먼스 네트워크 > 스마트채널",
  n_communication: "네이버 > 커뮤니케이션 영역",
  n_instream: "네이버 > 인스트림 영역",
  n_shopping: "네이버 > 쇼핑 영역",
  kakao_talk: "카카오톡",
  kakao_story: "카카오스토리",
  daum: "다음",
  kakao_service: "카카오 서비스",
  network: "네트워크"
}

//단위
var UNITS = {cst: "원", clk: "회", cv: "회", im: "회", cr: "원", ctr: "%", cpc: "원", cpa: "원", cvr: "%", roas: "%",}

// 캠페인 
var CTYPE = {
  conversion: "웹사이트 전환",
  web_site_traffic: "웹사이트 트래픽",
  install_app: "앱 설치",
  watch_video: "동영상 조회",
  catalog: "카탈로그 판매",
  shopping: "쇼핑 프로모션",
  talk_biz_board: "카카오톡비즈보드",
  display: "디스플레이",
  talk_channel: "카카오톡 채널",
  daum_shopping: "다음쇼핑",
  video: "동영상",
  sponsored_board: "개인화 메시지",
}

export { API_URL, TEMP_KEY, MONG_ID, SUMMARY_SORT, MEDIA_ANALYSIS_SORT, MEDIA_SORT, PGGROUPS, UNITS, BIDGOAL, BIDTYPE, BUDGETTYPE, CTYPE };
