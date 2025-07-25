import $ from 'jquery';
import {API_URL, TEMP_KEY} from '@/configs/config.js';
import { SHA256 } from '@/assets/js/sha256.js';

function isblank(val) {
    var required = false;
    if(val == '' || val == null) { required = true; } 
    return required;
}

function isNotId(val) {
    var required = false;
    var regex = /^[a-z0-9+]*$/;

    if(isblank(val)) {
        required = true;
    } else if(!regex.test(val)) {
        required = true;
    } else if(val.length <= 4 || val.length >= 16) {
        required = true;
    }

    return required;
}

function isNotPassword(val) {
    var required = false;
    var regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,16}$/;
    
    if(isblank(val)) {
        required = true;
    } else if(!regex.test(val)) {
        required = true;
    }

    return required;
}

function isNotPasswordc(val1, val2) {
    var required = false;
    if(isblank(val2)) {
       required = true; 
    } else if(val1 !== val2) {
        required = true;
    }
    return required;
}

function isNotEmail(val) {
    var required = false;
    // var regex = /^([\w\.\_\-])*[a-zA-Z0-9]+([\w\.\_\-])*([a-zA-Z0-9])+([\w\.\_\-])+@([a-zA-Z0-9]+\.)+[a-zA-Z0-9]{2,8}$/;
    // var regex = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    var regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if(isblank(val)) {
        required = true;
    } else if(!regex.test(val)) {
        required = true;
    }
    return required;
}

function isNotTel(val) {
    var required = false;
    var regex;
    // var regex = /^0\d{1,2}(-|\))\d{3,4}-\d{4}$/;
    // var regex = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;

    if(!isblank(val)) {
      val.indexOf('-') > -1 ? regex = /^0\d{1,2}(-|\))\d{3,4}-\d{4}$/ : regex = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
    }

    // console.log(val.indexOf('-'));

    if(isblank(val)) {
        required = true;
    } else if(!regex.test(val)) {
        required = true;
    }
    return required;
}

function getDateStr(dateStr) {
    var week = ['일','월','화','수','목','금','토'];
    return week[new Date(dateStr).getDay()];
}

function getDateStr2(dateStr) {
  var week = ['월요일','화요일','수요일','목요일','금요일','토요일','일요일'];
  return week[new Date(dateStr).getDay()];
}

function clearBody() {
    $('body').removeClass("modal-open");
    $('body').removeAttr("style");
    $("#app").removeClass("view");
    $("#app").removeClass("main");
    $("#app").removeClass("dashboard");
    $('.modal-backdrop').remove();
    
}

function addClassView() {
    $("#app").addClass("view");
}

function addClassMain() {
    $("#app").addClass("main");
}

function addClassDashboard() {
    $("#app").addClass("dashboard");
}



function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function priceToString(price) {
    // return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    var parts = price.toString().split(".");
    return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : ""); 
}

function getUnit(kpi) {
  var result = '원';
  if(kpi === 'im' || kpi === 'clk' || kpi === 'cv') result = '회';
  if(kpi === 'ctr' || kpi === 'cvr' || kpi === 'roas') result = '%';

  return result;
}

function getKpiName(kpi) {
  var result = '노출수';
  if(kpi === 'im') result = '노출수'; if(kpi === 'clk') result = '클릭수'; if(kpi === 'ctr') result = '클릭율';
  if(kpi === 'cpc') result = '클릭당비용'; if(kpi === 'cst') result = '광고비'; if(kpi === 'cv') result = '전환수';
  if(kpi === 'cvr') result = '전환율'; if(kpi === 'cr') result = '전환매출'; if(kpi === 'cpa') result = '전환당비용';
  if(kpi === 'roas') result = 'ROAS';
  return result;
}

function isBanner(media) {
  let conditions = ['kakaomo', 'naverda'];
  return conditions.includes(media) ? true : false;
}

function getCookie(b){
    var d=document.cookie.split(";");
    for(var c=0;c<d.length;c++){
        if(d[c].indexOf("=")==-1){
            if(b==d[c]){
                return""
            }
        }else{
            var a=d[c].split("=");
            if(b==a[0].trim()){
                return unescape(a[1].trim());
            }
        }
    }
}
function sortWeekDay(data) {
    var sorted = {};
    // var weekDaySorter = {'mon':"월", 'tue':"화", 'wed':"수", 'thu':"목", 'fri':"금", 'sat':"토", 'sun':"일"};
    var weekDaySorter = {'mon':1, 'tue':2, 'wed':3, 'thu':4, 'fri':5, 'sat':6, 'sun':7};
    var keys = Object.keys(weekDaySorter);
    for (var i = 0; i < keys.length; i++) {
        // sorted[weekDaySorter[keys[i]]] = data[keys[i]];
        sorted[i+1] = data[keys[i]];
    }
    return sorted;
}

function sortDraggable(data) {
  // 객체를 배열로 변환
  const entries = Object.entries(data);

  // 값 기준으로 오름차순 정렬
  entries.sort((a, b) => a[1] - b[1]);

  // 정렬된 배열을 다시 객체로 변환
  const sortedDraggable = Object.fromEntries(entries);

  return sortedDraggable;
}

function desireDraggable(data, desiredOrder) {
  // items 배열을 desiredOrder 배열을 기준으로 정렬
  const sortedDraggable = data.sort((a, b) => {
    return desiredOrder.indexOf(a.name) - desiredOrder.indexOf(b.name);
  });

  return sortedDraggable;
}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function getTextLength (str) {
    var len = 0;
    for (var i = 0; i < str.length; i++) {
        if (escape(str.charAt(i)).length == 6) {
            len++;
        }
        len++;
    }
    return len;
}

function getMedia(media) {
    var result = '';
    if(media === 'total') result = '전체';
    else if(media === 'naver') result = '네이버SA';
    else if(media === 'kakaosa') result = '카카오SA';
    else if(media === 'kakaomo') result = '카카오모먼트';
    else if(media === 'naverda') result = '네이버GFA';
    else if(media === 'google') result = '구글';
    return result;
}

function getApp(app) {
    var result = '';

    if(app === 'sa') result = '검색광고';
    else if(app === 'dsp') result = '배너광고';

    return result;
}

function getAdType(type) {
  var result = '';
  if(type === 1) result = '파워링크(단일형)';
  else if(type === 2) result = '파워링크(반응형)';
  else if(type === 3) result = '파워컨텐츠';
  return result;
}

function getUserInfoBySesstion(session) {
    var userInfo;

    var http = new XMLHttpRequest();
    var url = API_URL + '/rest/user/userinfo' + '?' + 'session=' + session;

    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
            var data = JSON.parse(http.responseText);
            this.userInfo = data.data;
            
        }
    };

    http.open("GET", url);
    http.setRequestHeader("authorization", SHA256(TEMP_KEY));
    http.send();



    // $.ajax({
    //     type: 'get', //요청 메소드 방식
    //     url: API_URL + '/rest/user/userinfo',
    //     headers : { "authorization" : SHA256(TEMP_KEY) },
    //     data :{
    //         "session" : session
    //     },
    //     success: function (data) {
    //         console.log(data);
    //         if(data.result === "success") {
    //         } else {
    //         }
    //     },
    // });

    // console.log(http.user);

    return http.responseText;
}

function toDataURL(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
      var reader = new FileReader();
      reader.onloadend = function() {
        callback(reader.result);
      }
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
}

function downloadImage(url) {
  fetch(url, {mode: 'no-cors'})
  .then(response => response.blob())
  .then(imgBlob => {
    const imageObjectURL = URL.createObjectURL(imgBlob); // 응답 받은 이미지를 blob 객체로 변환
    return response;
  })
}

function isEmptyObject(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

function encryptData(data) {
  return btoa(data); // Base64 인코딩
}

function decryptData(encryptedData) {
  return atob(encryptedData); // Base64 디코딩
}

function divideIntoSegments(startDateString, endDateString, numSegments) {
  const startDate = new Date(startDateString);
  const endDate = new Date(endDateString);

  const totalDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
  const daysPerSegment = Math.floor(totalDays / numSegments);
  const remainderDays = totalDays % numSegments;

  const segments = [];
  let currentStart = new Date(startDate);

  for (let i = 0; i < numSegments; i++) {
      const segmentStart = new Date(currentStart);
      let segmentDays = daysPerSegment + (i < remainderDays ? 1 : 0); // 나머지 날짜를 앞에서부터 분배
      const segmentEnd = new Date(segmentStart);
      segmentEnd.setDate(segmentStart.getDate() + segmentDays - 1);

      // 마지막 세그먼트는 강제로 endDate로 설정
      if (i === numSegments - 1) {
          segmentEnd.setTime(endDate.getTime());
      }

      segments.push({
          start: segmentStart.toISOString().substr(0, 10),
          end: segmentEnd.toISOString().substr(0, 10)
      });

      // 다음 세그먼트 시작일 조정
      currentStart.setDate(segmentEnd.getDate() + 1);
  }

  return segments;
}

function hideLayout() {
  let top = document.querySelector('.m-wrap > .m-top');
  let search = document.querySelector('.m-wrap > .m-search');
  let footer = document.querySelector('.m-wrap > .m-footer');
  let section = document.querySelector('.m-wrap > section');

  top ? top.classList.add('d-none') : '';
  search ? search.classList.add('d-none') : '';
  footer ? footer.classList.add('d-none') : '';
  section ? section.classList.add('d-none') : '';  
}

function showLayout() {
  hideOffcanvas();
  let top = document.querySelector('.m-wrap > .m-top');
  let search = document.querySelector('.m-wrap > .m-search');
  let footer = document.querySelector('.m-wrap > .m-footer');
  let section = document.querySelector('.m-wrap > section');

  top ? top.classList.remove("d-none") : '';
  search ? search.classList.remove("d-none") : '';
  footer ? footer.classList.remove("d-none") : '';
  section ? section.classList.remove("d-none") : '';
}

function hideOffcanvas() {
  let offcanvas = document.querySelectorAll('.offcanvas');
  offcanvas.forEach(function(el) {
    if(el) el.classList.add('d-none');
    // if(el) el.classList.remove('open');
  });  
}

function getType(type) {
  let result = '';
  if(type === 'web_site') result = '파워링크';
  if(type === 'shopping') result = '쇼핑검색';
  if(type === 'power_contents') result = '파워컨텐츠';
  if(type === 'brand_search') result = '브랜드 검색';
  if(type === 'place') result = '플레이스';
  if(type === 'none') result = '없음';
  if(type === 'daum_shopping') result = '다음쇼핑'; 
  if(type === 'display') result = '디스플레이';
  if(type === 'sponsored_board') result = '소폰서드 보드';
  if(type === 'talk_biz_board') result = '카카오톡비즈보드';
  if(type === 'talk_channel') result = '카카오톡채널';
  if(type === 'video') result = '동영상';
  if(type === 'conversion') result = '웹사이트 전환';
  if(type === 'web_site_traffic') result = '인지도 및 트래픽';
  if(type === 'install_app') result = '앱 전환';
  if(type === 'watch_video') result = '동영상 조회';
  if(type === 'catalog') result = '카탈로그 판매';
  if(type === 'shopping') result = '쇼핑 프로모션';
  if(type === 'lead') result = '참여 유도';
  if(type === 'pmax') result = 'ADVoost 쇼핑';  
  if(type === 'demand_gen') result = '디멘드젠 캠페인';
  if(type === 'display') result = '디스플레이';
  if(type === 'hotel') result = '호텔';
  if(type === 'local') result = '지역';
  if(type === 'local_services') result = '지역 서비스 광고';
  if(type === 'multi_channel') result = '다중 채널';
  if(type === 'performance_max') result = '실적 최대화';
  if(type === 'search') result = '검색';
  if(type === 'shopping') result = '쇼핑';
  if(type === 'smart') result = '스마트';
  if(type === 'travel') result = '여행';
  if(type === 'video') result = '동영상';                      
  if(type === 'unknown') result = '기타';  
  if(type === 'unspecified') result = '미지정';  
  return result
}

function getLevel(level) {
  let result = '캠페인';

  if(level === 'campaign') result = '캠페인';
  if(level === 'adgroup') result = '그룹';
  if(level === 'ad') result = '소재';
  if(level === 'keyword') result = '키워드';
  return result;
}

function getTarget(target) {
  let result = '디바이스';

  if(target === 'device') result = '디바이스';
  if(target === 'age') result = '연령';
  if(target === 'gender') result = '성별';
  if(target === 'location') result = '지역별';
  if(target === 'hours') result = '시간대별';
  return result;
}

function getStructure(api_url, temp_key, userid, session, media) {
  return new Promise(function (resolve, reject) {
    $.ajax({
      type: "get",
      url: api_url + "/app/analysis/targetstructure",
      headers: { authorization: SHA256(temp_key) },
      data: { userid: userid, session: session, md: media },
      success: function (data) {
        resolve(data);
      },
      error: function (xhr, status, error) {
        reject(error);
      },
    });
  });    
}

function getLocation(location) {
  let result = '서울특별시';

  if(location === '00') result = '대한민국외';
  if(location === '01') result = '강원도';
  if(location === '02') result = '경기도';
  if(location === '03') result = '경상남도';
  if(location === '04') result = '경상북도';
  if(location === '05') result = '광주광역시';
  if(location === '06') result = '대구광역시';
  if(location === '07') result = '대전광역시';
  if(location === '08') result = '부산광역시';
  if(location === '09') result = '서울특별시';
  if(location === '10') result = '울산광역시';
  if(location === '11') result = '인천광역시';
  if(location === '12') result = '전라남도';
  if(location === '13') result = '전라북도';
  if(location === '14') result = '제주특별자치도';
  if(location === '15') result = '충청남도';
  if(location === '16') result = '충청북도';
  if(location === '17') result = '세종특별자치시';  
  if(location === '99') result = '국내-확인불가';
  if(location === '-1') result = '알수없음';
  return result;
}

function formatNumber(num, unit = '') {
  if (num === undefined || isNaN(num)) return '-';
  return Number(num).toLocaleString() + unit;
}

function interpretChange(value, tone = 'marketer', label = '') {
  const num = parseFloat(value);
  const abs = Math.abs(num);

  if (tone === 'data') { return `${label}: ${num > 0 ? '+' : ''}${num.toFixed(2)}%`; }
  if (tone === 'neutral') { return `${label}는 ${num > 0 ? `${num.toFixed(2)}% 증가` : `${abs.toFixed(2)}% 감소`}했습니다.`; }
  if (abs < 5) return `${label}는 큰 변화 없이 유지되었습니다.`;
  if (abs < 15) return `${label}는 소폭 ${num > 0 ? '증가' : '감소'}했습니다.`;
  return `${label}는 크게 ${num > 0 ? '증가' : '감소'}했습니다.`;
}

function generateInsights(data, options = {}) {
  const { tone = 'marketer' } = options;
  const result = [];
  
  result.push(`1. 광고비는 ${formatNumber(data.cst, '원')} 집행되었으며, ${interpretChange(data.per.cst, tone, '광고비')}`);// 광고비
  result.push(`2. 노출 수는 ${formatNumber(data.im, '회')}로 ${interpretChange(data.per.im, tone, '노출 수')} 클릭 수는 ${formatNumber(data.clk, '회')}로 ${interpretChange(data.per.clk, tone, '클릭 수')} 클릭률은 ${parseFloat(data.ctr).toFixed(2)}%입니다.`);// 노출 + 클릭 + 클릭률
  result.push(`3. 전환 수는 ${formatNumber(data.cv, '건')}이며, 전환율(CVR)은 ${parseFloat(data.cvr).toFixed(2)}%로 ${interpretChange(data.per.cvr, tone, '전환율')}`);// 전환수 + 전환율
  result.push(`4. CPC는 ${formatNumber(Math.round(data.cpc), '원')}로 ${interpretChange(data.per.cpc, tone, 'CPC')} CPA는 ${formatNumber(Math.round(data.cpa), '원')}입니다.`);// CPC + CPA
  result.push(`5. ROAS는 ${parseFloat(data.roas).toFixed(2)}%로 ${interpretChange(data.per.roas, tone, 'ROAS')} 비용 대비 성과가 ${parseFloat(data.per.roas).toFixed(2) > 0 ? '향상' : '저하'}되었습니다.`); //ROAS
  return result;
}

function generateTrendsOld(data, key) {
  if (!data || data.length < 2) return '데이터 부족';
  const start = parseFloat(data[0][key]);
  const end = parseFloat(data[data.length - 1][key]);

  if (isNaN(start) || isNaN(end) || start === 0) return '데이터 오류';

  const rate = (end - start) / Math.abs(start);
  if (rate > 0.05) return '상승';
  if (rate < -0.05) return '하강';
  return '유지';  
}

function generateTrends(data, key) {
  if (!data || data.length < 2) return '데이터 부족';
  const clean = (v) => typeof v === 'string' ? parseFloat(v.replace(/,/g, '').replace(/%/g, '')) : parseFloat(v);

  // 0이 아닌 첫 번째 값
  let start = null;
  for (const item of data) {
    const val = clean(item[key]);
    if (!isNaN(val) && val !== 0) {
      start = val;
      break;
    }
  }

  // 0이 아닌 마지막 값
  let end = null;
  for (let i = data.length - 1; i >= 0; i--) {
    const val = clean(data[i][key]);
    if (!isNaN(val) && val !== 0) {
      end = val;
      break;
    }
  }

  if (start === null || end === null) return '데이터 부족';

  const rate = (end - start) / Math.abs(start);
  if (rate > 0.05) return '상승';
  if (rate < -0.05) return '하강';
  return '유지';
}

function shortNumber(value) {
  value = +value.toString().replace(/[^0-9]/g, '');
  if (value >= 1e8) return (value / 1e8).toFixed(1) + '억';
  if (value >= 1e4) return (value / 1e4).toFixed(1) + '만';
  if (value >= 1e3) return (value / 1e3).toFixed(1) + '천';
  return value.toLocaleString();
}

function shortPercent(value) {
  // 문자열일 경우 쉼표와 % 제거 후 숫자로 변환
  if (typeof value === 'string') {
    value = value.replace(/,/g, '').replace('%', '');
  }

  value = parseFloat(value);
  if (isNaN(value)) return '-';

  if (value >= 1e4) return (value / 1e4).toFixed(1) + '만%';
  if (value >= 1e3) return (value / 1e3).toFixed(1) + '천%';
  if (value >= 100) return value.toFixed(0) + '%';
  if (value >= 10) return value.toFixed(1) + '%';
  return value.toFixed(2) + '%';
}

export { isblank, isNotId, isNotPassword, isNotPasswordc, isNotEmail, isNotTel, isBanner, clearBody, addClassView, addClassMain, addClassDashboard, isMobile, priceToString, 
  getCookie, getDateStr, getDateStr2, sortWeekDay, uuidv4, getTextLength, getMedia, getApp, getUserInfoBySesstion, toDataURL, isEmptyObject, downloadImage, encryptData, 
  decryptData, divideIntoSegments, hideLayout, showLayout, hideOffcanvas, getType, getUnit, getKpiName, getLevel, getTarget, sortDraggable, desireDraggable, getAdType,
  getStructure, getLocation, generateInsights, generateTrends, shortNumber, shortPercent };

