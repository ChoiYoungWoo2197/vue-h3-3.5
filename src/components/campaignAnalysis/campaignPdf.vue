<template>
  <div id="pdf-content" ref="pdfContent" :class="getUniqueId">
    <div class="header">
      <div class="d-flex justify-content-between align-items-center">
         <h1 v-if="media !== null" class="txt-48 fw-900 chart-title">{{`캠페인리포트 - ${getMedia(media)}`}}</h1>
         <div>
          <h3 class="txt-18 fw-900"><span class="chart-title">기준:</span> {{` ${date.start} ~ ${date.end}`}} </h3>
          <h3 class="txt-18 fw-900"><span class="chart-title">비교:</span> {{` ${cdate.start} ~ ${cdate.end}`}} </h3>
         </div>
      </div>
      <ul>
        <li class="txt-18" v-for="(line, index) in insightList" :key="index">{{ line }}</li>
      </ul>
    </div>
    <div class="article mt-80">
      <div class="d-flex">
        <p class="txt-18 chart-title">{{`▣ 운영 추세: ${trends}`}}</p>
      </div>      
      <div class="d-flex justify-content-between align-items-center gap-2">
        <div class="col-3 card">
          <p class="txt-18 chart-title txt-center">{{`캠페인`}}</p>
          <div class="d-flex justify-content-between" :id="`chart1-${uid}`" style="height: 300px;"></div>
        </div>
        <div class="col-3 card">
          <p class="txt-18 chart-title txt-center">{{`클릭수 / 노출수`}}</p>
          <div :id="`chart2-${uid}`" style="height: 300px;"></div>
        </div>
        <div class="col-3 card">
          <p class="txt-18 chart-title txt-center">{{`CPC / 광고비`}}</p>
          <div :id="`chart3-${uid}`" style="height: 300px;"></div>
        </div>
        <div class="col-3 card">
          <p class="txt-18 chart-title txt-center">{{`전환수 / 전환매출`}}</p>
          <div :id="`chart4-${uid}`" style="height: 300px;"></div>
        </div>
      </div>     
      <div class="mt-30">
        <div class="d-flex justify-content-between align-items-center gap-2">
            <div class="col-4 media-table">
              <p v-if="mediaList.length" class="txt-18 chart-title">
                <template v-if="media !== null && media === 'naver'">{{`▣ 파워링크: ${mediaList[0].length}개`}}</template>
                <template v-if="media !== null && media === 'kakaosa'">{{`▣ 전체: ${mediaList[0].length}개`}}</template>                
                <template v-if="media !== null && media === 'naverda'">{{`▣ 웹사이트 전환: ${mediaList[0].length}개`}}</template>                
                <template v-if="media !== null && media === 'kakaomo'">{{`▣ 카카오톡비즈보드: ${mediaList[0].length}개`}}</template>                
                <template v-if="media !== null && media === 'google'">{{`▣ 검색: ${mediaList[0].length}개`}}</template>                
              </p>
              <table>
                <colgroup>
                  <col style="width:10%;">
                  <col style="width:10%;">
                  <col style="width:10%;">
                  <col style="width:10%;">
                </colgroup>
                <thead>
                  <tr>
                    <td>이름</td>
                    <td>클릭수 / 노출수</td>
                    <td>CPC / 광고비</td>
                    <td>전환수 / 전환매출</td>
                  </tr>
                </thead>
                <tbody>
                  <template v-if="mediaList.length && mediaList[0].length">
                    <template v-for="(d,i) in 5" :key="d+i+getUuidv4()">
                      <tr >
                        <template v-if="mediaList[0][i]">
                          <td :title="mediaList[0][i]['campaign_name']">
                            {{ mediaList[0][i]['campaign_name'].length > 8 ? mediaList[0][i]['campaign_name'].slice(0, 8) + '...' : mediaList[0][i]['campaign_name'] }}
                          </td>
                          <td>{{ `${getShortNumber(mediaList[0][i]['clk'])} / ${getShortNumber(mediaList[0][i]['im'])}` }}</td>
                          <td>{{ `${getShortNumber(mediaList[0][i]['cpc'])} / ${getShortNumber(mediaList[0][i]['cst'])}` }}</td>
                          <td>{{ `${getShortNumber(mediaList[0][i]['cv'])} / ${getShortNumber(mediaList[0][i]['cr'])}` }}</td>
                        </template>
                        <template v-else>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </template>
                      </tr>                   
                    </template>
                  </template>
                  <template v-else >
                    <tr v-for="n in 5" :key="'empty-' + n">
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
            <div class="col-4 media-table">
              <p v-if="mediaList.length" class="txt-18 chart-title">
                <template v-if="media !== null && media === 'naver'">{{`▣ 쇼핑: ${mediaList[1].length}개`}}</template>
                <template v-if="media !== null && media === 'kakaosa'">{{`▣ N/A`}}</template>                
                <template v-if="media !== null && media === 'naverda'">{{`▣ 인지도 및 트래픽: ${mediaList[1].length}개`}}</template>
                <template v-if="media !== null && media === 'kakaomo'">{{`▣ 디스플레이: ${mediaList[1].length}개`}}</template>
                <template v-if="media !== null && media === 'google'">{{`▣ 디스플레이: ${mediaList[1].length}개`}}</template>
              </p>
              <table>
                <colgroup>
                  <col style="width:10%;">
                  <col style="width:10%;">
                  <col style="width:10%;">
                  <col style="width:10%;">
                </colgroup>
                <thead>
                  <tr>
                    <td>이름</td>
                    <td>클릭수 / 노출수</td>
                    <td>CPC / 광고비</td>
                    <td>전환수 / 전환매출</td>
                  </tr>
                </thead>
                <tbody>
                  <template v-if="mediaList.length && mediaList[1].length">
                    <template v-for="(d,i) in 5" :key="d+i+getUuidv4()">
                      <tr >
                        <template v-if="mediaList[1][i]">
                          <td :title="mediaList[1][i]['campaign_name']">
                            {{ mediaList[1][i]['campaign_name'].length > 8 ? mediaList[1][i]['campaign_name'].slice(0, 8) + '...' : mediaList[1][i]['campaign_name'] }}
                          </td>
                          <td>{{ `${getShortNumber(mediaList[1][i]['clk'])} / ${getShortNumber(mediaList[1][i]['im'])}` }}</td>
                          <td>{{ `${getShortNumber(mediaList[1][i]['cpc'])} / ${getShortNumber(mediaList[1][i]['cst'])}` }}</td>
                          <td>{{ `${getShortNumber(mediaList[1][i]['cv'])} / ${getShortNumber(mediaList[1][i]['cr'])}` }}</td>
                        </template>
                        <template v-else>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </template>
                      </tr>                   
                    </template>
                  </template>
                  <template v-else >
                    <tr v-for="n in 5" :key="'empty-' + n">
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
            <div class="col-4 media-table">
              <p v-if="mediaList.length" class="txt-18 chart-title">
                <template v-if="media !== null && media === 'naver'">{{`▣ 그외: 파워컨테츠 ${getCountByType(mediaList[2],'power_contents')}개 / 플레이스 ${getCountByType(mediaList[2],'place')}개 / 브랜드검색 ${getCountByType(mediaList[2],'brand_search')}개`}}</template>
                <template v-if="media !== null && media === 'kakaosa'">{{`▣ 그외: N/A`}}</template>                
                <template v-if="media !== null && media === 'naverda'">
                  {{`▣ 그외: 앱전환 ${getCountByType(mediaList[2],'install_app')}개 / 동영상조회 ${getCountByType(mediaList[2],'watch_video')}개 / 카탈로그판매 ${getCountByType(mediaList[2],'catalog')}개 / 쇼핑 ${getCountByType(mediaList[2],'shopping')}개 / 참여유도 ${getCountByType(mediaList[2],'lead')}개 / ADVoost쇼핑 ${getCountByType(mediaList[2],'pmax')}개`}}
                </template>
                <template v-if="media !== null && media === 'kakaomo'">
                  {{`▣ 그외: 카카오톡채널 ${getCountByType(mediaList[2],'talk_channel')}개 / 다음쇼핑 ${getCountByType(mediaList[2],'daum_shopping')}개 / 동영상 ${getCountByType(mediaList[2],'video')}개 / 스폰서드보드 ${getCountByType(mediaList[2],'sponsored_board')}개`}}
                </template>   
                <template v-if="media !== null && media === 'google'">
                  {{`▣ 그외: 디멘드젠캠페인 ${getCountByType(mediaList[2],'demand_gen')}개 / 호텔 ${getCountByType(mediaList[2],'hotel')}개 / 지역 ${getCountByType(mediaList[2],'local')}개 / 지역서비스광고 ${getCountByType(mediaList[2],'local_services')}개 / 다중채널 ${getCountByType(mediaList[2],'multi_channel')}개 / 실적최대화 ${getCountByType(mediaList[2],'performance_max')}개 / 쇼핑 ${getCountByType(mediaList[2],'shopping')}개 / 스마트 ${getCountByType(mediaList[2],'smart')}개 / 여행 ${getCountByType(mediaList[2],'travel')}개 / 동영상 ${getCountByType(mediaList[2],'video')}개 / 기타 ${getCountByType(mediaList[2],'unknown')}개 / 미지정 ${getCountByType(mediaList[2],'unspecified')}개`}}
                </template>                                 
              </p>
              <table>
                <colgroup>
                  <col style="width:10%;">
                  <col style="width:10%;">
                  <col style="width:10%;">
                  <col style="width:10%;">                  
                </colgroup>
                <thead>
                  <tr>
                    <td>이름</td>
                    <td>클릭수 / 노출수</td>
                    <td>CPC / 광고비</td>
                    <td>전환수 / 전환매출</td>
                  </tr>
                </thead>
                <tbody>
                  <template v-if="mediaList.length && mediaList[2].length">
                    <template v-for="(d,i) in 5" :key="d+i+getUuidv4()">
                      <tr >
                        <template v-if="mediaList[2][i]">
                          <td :title="mediaList[2][i]['campaign_name']">
                            {{ mediaList[2][i]['campaign_name'].length > 8 ? mediaList[2][i]['campaign_name'].slice(0, 8) + '...' : mediaList[2][i]['campaign_name'] }}
                          </td>
                          <td>{{ `${getShortNumber(mediaList[2][i]['clk'])} / ${getShortNumber(mediaList[2][i]['im'])}` }}</td>
                          <td>{{ `${getShortNumber(mediaList[2][i]['cpc'])} / ${getShortNumber(mediaList[2][i]['cst'])}` }}</td>
                          <td>{{ `${getShortNumber(mediaList[2][i]['cv'])} / ${getShortNumber(mediaList[2][i]['cr'])}` }}</td>
                        </template>
                        <template v-else>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </template>
                      </tr>                   
                    </template>
                  </template>
                  <template v-else >
                    <tr v-for="n in 5" :key="'empty-' + n">
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  </template>
                </tbody>               
              </table>
            </div>                       
        </div>
      </div>
    </div>
    <div class="footer"></div>     
  </div>
</template>

<script>
import "@/assets/css/pdf.main.new.css";
import $ from "jquery";
import moment from "moment";
import html2pdf from 'html2pdf.js';
import * as echarts from 'echarts';
import {  isMobile,  priceToString,  getMedia,  uuidv4,  getUnit, getType,  getKpiName, generateInsights, generateTrends, shortNumber} from "@/assets/js/common.js";
import { store } from "@/store/store.js";
import { SHA256 } from "@/assets/js/sha256.js";
import { API_URL, TEMP_KEY } from "@/configs/config.js";
export default {
  props: {},
  data() {
    return {
      uniqueId: null,
      insightList: [],      
      trends: null,  
      mediaList: [],
      chart1List: [],
      chart2List: [],
      chart3List: [],
      chart4List: [],  
      date: {},
      cdate: {},
      media: null,
      uid: this._uid, // 각 컴포넌트 인스턴스에 대해 고유  
    };
  },
  computed: {
    getUniqueId() {
      if (!this.uniqueId) {
        this.uniqueId = "vm-" + this._uid;
        return this.uniqueId;
      }
      return this.uniqueId;
    },
  },
  components: {},
  mounted() {},
  methods: {
    async generatePDF() {
      const element = this.$refs.pdfContent;
      const worker = html2pdf()
        .set({
          margin: 0,
          filename: `dashboard_report_${moment().format("YYYYMMDDHHmmss")}.pdf`,
          pagebreak: {mode: ['avoid-all', 'css', 'legacy']},
          image: {type: 'jpeg', quality: 0.98},
          html2canvas: {scrollY: 0, scale: 3, letterRendering: true, allowTaint: false, useCORS: true},
          jsPDF: {orientation: 'landscape', unit: 'mm', format: [420, 297]}
        }).from(element).toPdf();

        const pdf = await worker.get('pdf');         // jsPDF 인스턴스
        const blob = pdf.output('blob');             // Blob 객체로 추출
        return blob;        
    },    
    priceToString(salse) {
      if (salse === undefined) return "";
      return priceToString(salse);
    },
    initChart1() {
      var dom = document.getElementById(`chart1-${this.uid}`);
      if (!dom) return null;
      var oldChart = echarts.getInstanceByDom(dom); // 🔥 기존 인스턴스 제거
      if (oldChart) { echarts.dispose(dom); }      

      var chart = echarts.init(dom);
      var yData = this.chart1List.slice();
      chart.setOption({
        color: ['#00C9A7', '#F7B801', '#EA3546', '#662E9B', '#6C63FF'],
        title: { show: false },
        tooltip: { trigger: 'item', formatter: '{b}: {d}%'},
        legend: { show: false },
        series: [
          { name: '매체별 비중', type: 'pie', radius: '80%', center: ['50%', '50%'],
            data: yData,
            emphasis: { itemStyle: { shadowBlur: 15, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.3)' } },
            label: { position: 'inside', formatter: function(params) { return `${params.name} ${Math.round(params.percent)}%`; }, fontSize: 14, color: '#fff', fontWeight: 'bold' } 
          }
        ]
      });
      return chart;  
    },
    initChart2() {
      var dom = document.getElementById(`chart2-${this.uid}`);
      if (!dom) return null;
      var oldChart = echarts.getInstanceByDom(dom); // 🔥 기존 인스턴스 제거
      if (oldChart) { echarts.dispose(dom); }      

      var chart = echarts.init(dom);
      var xData = this.chart2List.map(item => item.date);
      var lineData = this.chart2List.map(item => item.clk);
      var barData = this.chart2List.map(item => item.im);
      chart.setOption({
        tooltip: { trigger: 'axis' },      
        grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },          
        xAxis: { type: 'category', data: xData, axisLabel: { rotate: 45, fontSize: 10 }},
        yAxis: [{ type: 'value', name: '클릭수', position: 'left' }, {type: 'value', name: '노출수', position: 'right'}],
        legend: {
          data: ['클릭수', '노출수'],
          bottom: 0,           // ⬅️ 아래쪽에 배치
          left: 'center',      // ⬅️ 가운데 정렬
          orient: 'horizontal',// ⬅️ 가로 배열
          itemWidth: 14,       // 색상 아이콘 너비
          itemHeight: 10,      // 색상 아이콘 높이
          textStyle: { fontSize: 12, color: '#333' }
        },        
        series: [
          {
            name: '클릭수',
            type: 'line',
            smooth: true,
            data: lineData,
            yAxisIndex: 0,
            lineStyle: { color: '#00BFAE', width: 3 },
            itemStyle: { color: '#00BFAE' },
            areaStyle: { color: '#A8EDEA', opacity: 0.1 },
            z: 10
          },
          {
            name: "노출수",          
            type: 'bar',
            smooth: true,   
            data: barData,      
            yAxisIndex: 1,
            barWidth: 10,
            itemStyle: { color: '#095AE1', opacity: 0.6 },
            z: 1            
          }
        ]
      });
      return chart;    
    },
    initChart3() {
      var dom = document.getElementById(`chart3-${this.uid}`);
      if (!dom) return null;
      var oldChart = echarts.getInstanceByDom(dom); // 🔥 기존 인스턴스 제거
      if (oldChart) { echarts.dispose(dom); }      

      var chart = echarts.init(dom);
      var xData = this.chart3List.map(item => item.date);
      var lineData = this.chart3List.map(item => item.cpc);
      var barData  = this.chart3List.map(item => item.cst);
      chart.setOption({
        tooltip: { trigger: 'axis' },      
        grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },          
        xAxis: { type: 'category', data: xData, axisLabel: { rotate: 45, fontSize: 10 }},
        yAxis: [{ type: 'value', name: 'CPC', position: 'left' }, { type: 'value', name: '광고비', position: 'right' }],
        legend: {
          data: ['CPC', '광고비'],
          bottom: 0,           // ⬅️ 아래쪽에 배치
          left: 'center',      // ⬅️ 가운데 정렬
          orient: 'horizontal',// ⬅️ 가로 배열
          itemWidth: 14,       // 색상 아이콘 너비
          itemHeight: 10,      // 색상 아이콘 높이
          textStyle: { fontSize: 12, color: '#333' }
        },          
        series: [
          {
            name: 'CPC',
            type: 'line',
            smooth: true,
            data: lineData,
            yAxisIndex: 0,
            lineStyle: { color: '#9B51E0', width: 3 },
            itemStyle: { color: '#9B51E0' },
            areaStyle: { color: '#E5D5F9', opacity: 0.1 },
            z: 10
          },
          {
            name: "광고비",          
            type: 'bar',
            smooth: true,   
            data: barData,      
            yAxisIndex: 1,
            barWidth: 10,
            itemStyle: { color: '#FF4D6D', opacity: 0.6 },
            z: 1            
          }          
        ]
      });
      return chart;      
    },    
    initChart4() {
      var dom = document.getElementById(`chart4-${this.uid}`);
      if (!dom) return null;
      var oldChart = echarts.getInstanceByDom(dom); // 🔥 기존 인스턴스 제거
      if (oldChart) { echarts.dispose(dom); }      

      var chart = echarts.init(dom);
      var xData = this.chart4List.map(item => item.date);
      var lineData = this.chart4List.map(item => item.cv);
      var barData = this.chart4List.map(item => item.cr);
      chart.setOption({
        tooltip: { trigger: 'axis' },      
        grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },          
        xAxis: { type: 'category', data: xData, axisLabel: { rotate: 45, fontSize: 10 }},
        yAxis: [{ type: 'value', name: '전환수', position: 'left' }, {type: 'value', name: '전환매출', position: 'right'}],
        legend: {
          data: ['전환수', '전환매출'],
          bottom: 0,           // ⬅️ 아래쪽에 배치
          left: 'center',      // ⬅️ 가운데 정렬
          orient: 'horizontal',// ⬅️ 가로 배열
          itemWidth: 14,       // 색상 아이콘 너비
          itemHeight: 10,      // 색상 아이콘 높이
          textStyle: { fontSize: 12, color: '#333' }
        },           
        series: [
          {
            name: '전환수',
            type: 'line',
            smooth: true,
            data: lineData,
            yAxisIndex: 0,
            lineStyle: { color: '#FFA500', width: 3 },
            itemStyle: { color: '#FFCBA4' },
            areaStyle: { color: '#EED5B7', opacity: 0.1 },
            z: 10
          },
          {
            name: "전환매출",          
            type: 'bar',
            smooth: true,   
            data: barData,      
            yAxisIndex: 1,
            barWidth: 10,
            itemStyle: { color: '#A0522D', opacity: 0.6 },
            z: 1            
          }          
        ]
      });
      return chart;      
    },
    initPDF(o) {
      var vm = this;
      return new Promise((resolve) => {
        vm.date = o.date || {};
        vm.cdate = o.cdate || {};
        vm.insightList = [];
        vm.mediaList = [];
        vm.chart1List = [];
        vm.chart2List = [];
        vm.chart3List = [];
        vm.chart4List = [];
        vm.trends = null;
        vm.media = o.media || {};        
        var requests = [
          $.ajax({
            type: "get",
            url: API_URL + "/app/analysis/campaignreport",
            headers: {authorization: SHA256(TEMP_KEY)},
            data: {userid: store.state.userStore.userinfo.userid, fromdate: vm.date.start, todate: vm.date.end, comparefromdate: vm.cdate.start, 
            comparetodate: vm.cdate.end, session: store.state.userStore.session,
            },            
          }),
        ];

        Promise.all(requests).then(([res1]) => {
          //console.log(res1);
          vm.insightList = generateInsights(vm.convertInsightList(res1.data.media[vm.media]), { tone: 'marketer' }); //코멘트
          vm.chart1List = vm.getChart1List(vm.converChart1List(res1.data.media[vm.media].group));
          vm.chart2List = Object.entries(res1.data.media[vm.media].day.graph).map(([date, values]) => { return {date: values.daily_dt, clk: values.clk, im: values.im} })
          vm.chart3List = Object.entries(res1.data.media[vm.media].day.graph).map(([date, values]) => { return {date: values.daily_dt, cpc: (values.cst / values.clk), cst: values.cst} })
          vm.chart4List = Object.entries(res1.data.media[vm.media].day.graph).map(([date, values]) => { return {date: values.daily_dt, cv: values.cv, cr: values.cr} })
          vm.mediaList = vm.getMediaList(res1.data.media[vm.media].group, vm.media);
          var imTrend = generateTrends(vm.chart2List, 'im');
          var clkTrend = generateTrends(vm.chart2List, 'clk');
          var cpcTrend = generateTrends(vm.chart3List, 'cpc');
          var cstTrend = generateTrends(vm.chart3List, 'cst');
          var cvTrend = generateTrends(vm.chart4List, 'cv');
          var crTrend = generateTrends(vm.chart4List, 'cr');
          vm.trends = `노출수 ${imTrend} / 클릭수 ${clkTrend} / CPC ${cpcTrend} / 광고비 ${cstTrend} / 전환수 ${cvTrend} / 전환매출 ${crTrend}`;
          vm.$nextTick(() => {
            var chart1 = vm.initChart1();
            var chart2 = vm.initChart2();
            var chart3 = vm.initChart3();
            var chart4 = vm.initChart4();
            var charts = [chart1, chart2, chart3, chart4].filter(Boolean);
            var doneCount = 0;

            charts.forEach((chart) => {
              chart.on('finished', () => {
                doneCount++;
                if (doneCount === charts.length) {
                  resolve();
                }
              });
            });
          });          
        });
      });
    },
    getChart1List(chart1List) {
      const mapping = { 
        web_site: "파워링크", shopping: "쇼핑검색", power_contents: "파워컨텐츠", brand_search: "브랜드검색", place: "플레이스", none:"전체",
        conversion: "웹사이트 전환", web_site_traffic: "인지도 및 트래픽", install_app: "앱 전환", watch_video: "동영상 조회", catalog: "카탈로그 판매", shopping: "쇼핑 프로모션", lead: "참여 유도", pmax: "ADVoost 쇼핑",
        talk_biz_board: "카카오톡비즈보드", display: "디스플레이", talk_channel: "카카오톡 채널", daum_shopping: "다음쇼핑", video: "동영상", sponsored_board: "스폰서드 보드",
        demand_gen: "디멘드젠캠페인",display: "디스플레이",hotel: "호텔",local: "지역",local_services: "지역 서비스 광고",multi_channel: "다중 채널",performance_max: "실적 최대화", search: "검색",shopping: "쇼핑",smart: "스마트",
        travel: "여행",video: "동영상",unknown: "기타",unspecified: "미지정",
        TOTAL: "TOTAL" };
      const typeMap = { N: "SA", D: "SA", Nda: "GFA", google: "SA", total: "TOTAL" };
      const rawsChart1List = Object.entries(chart1List).map(([media, item]) => {
        const m = mapping[item.type] || item.type;
        return { name: m, value: item.share };
      })
      return rawsChart1List;
    },
    getMediaList(v, m) {
      var max = 5;
      var mapping = {
        naver: { fix: ["web_site", "shopping"], none: ["power_contents", "brand_search", "place"] },
        kakaosa: { fix: ["none"], none: []},
        naverda: { fix: ["conversion", "web_site_traffic"], none: ["install_app", "watch_video", "catalog", "shopping", "lead", "pmax" ]},
        kakaomo: { fix: ["talk_biz_board", "display"], none: ["talk_channel", "daum_shopping", "video", "sponsored_board"]},
        google: { fix: ["search", "display"], none: ["demand_gen", "hotel", "local", "local_services", "multi_channel", "performance_max", "shopping", "smart", "travel", "video", "unknown", "unspecified"]}
      };
      var rawsMediaList = [];
      var doneCount = 0;
      var extractMediaItems = (mediaKeys) => {
        var extracted = [];
        Object.entries(v).filter(([media]) => mediaKeys.includes(media)).forEach(([media, items]) => {
            for (var item of items) {
              if (doneCount >= max) break;

              extracted.push({
                type: media,
                campaign_id: item.campaign_id || "-",
                campaign_name: item.campaign_name || "-",
                im: item.im ? `${priceToString(parseInt(item.im, 10))}회` : "0회",
                clk: item.clk ? `${priceToString(parseInt(item.clk, 10))}회` : "0회",
                ctr: item.ctr ? `${parseFloat(item.ctr).toFixed(2)}%` : "0.00%",
                cpc: item.cpc ? `${priceToString(Math.ceil(parseFloat(item.cpc)))}원` : "0원",
                cst: item.cst ? `${priceToString(Math.ceil(parseFloat(item.cst)))}원` : "0원",
                cv: item.cv ? `${priceToString(parseInt(item.cv, 10))}회` : "0회",
                cr: item.cr ? `${priceToString(Math.ceil(parseFloat(item.cr)))}원` : "0원",
                cvr: item.cvr ? `${parseFloat(item.cvr).toFixed(2)}%` : "0.00%",
                cpa: item.cpa ? `${priceToString(Math.ceil(parseFloat(item.cpa)))}원` : "0원",
                roas: item.roas ? `${parseFloat(item.roas).toFixed(2)}%` : "0.00%",
              });
              doneCount++;
            }
          });
        return extracted;
      };

      // 🌐 Naver 처리
      if (m === "naver") {
        doneCount = 0;
        var rawsMediaList1 = extractMediaItems(mapping.naver.fix.slice(0, 1)); // web_site
        doneCount = 0;
        var rawsMediaList2 = extractMediaItems(mapping.naver.fix.slice(1));   // shopping
        doneCount = 0;
        var rawsMediaList3 = extractMediaItems(mapping.naver.none);           // power_contents, brand_search, place

        rawsMediaList = [rawsMediaList1, rawsMediaList2, rawsMediaList3];
      }
      // 🌐 KakaoSA 처리
      if (m === "kakaosa") {
        doneCount = 0;
        var rawsMediaList1 = extractMediaItems(mapping.kakaosa.fix.slice(0, 1)); // none
        doneCount = 0;
        var rawsMediaList2 = extractMediaItems(mapping.kakaosa.fix.slice(1));   // shopping
        doneCount = 0;
        var rawsMediaList3 = extractMediaItems(mapping.kakaosa.none);           // power_contents, brand_search, place        
        rawsMediaList = [rawsMediaList1, rawsMediaList2, rawsMediaList3];
      }
      // 🌐 GFA 처리
      if (m === "naverda") {
        doneCount = 0;
        var rawsMediaList1 = extractMediaItems(mapping.naverda.fix.slice(0, 1)); // none
        doneCount = 0;
        var rawsMediaList2 = extractMediaItems(mapping.naverda.fix.slice(1));   // shopping
        doneCount = 0;
        var rawsMediaList3 = extractMediaItems(mapping.naverda.none);           // power_contents, brand_search, place        
        rawsMediaList = [rawsMediaList1, rawsMediaList2, rawsMediaList3];
      }   
      // 🌐 KakaoMo 처리
      if (m === "kakaomo") {
        doneCount = 0;
        var rawsMediaList1 = extractMediaItems(mapping.kakaomo.fix.slice(0, 1)); // none
        doneCount = 0;
        var rawsMediaList2 = extractMediaItems(mapping.kakaomo.fix.slice(1));   // shopping
        doneCount = 0;
        var rawsMediaList3 = extractMediaItems(mapping.kakaomo.none);           // power_contents, brand_search, place        
        rawsMediaList = [rawsMediaList1, rawsMediaList2, rawsMediaList3];
      }          
      // 🌐 Google 처리
      if (m === "google") {
        doneCount = 0;
        var rawsMediaList1 = extractMediaItems(mapping.google.fix.slice(0, 1)); // none
        doneCount = 0;
        var rawsMediaList2 = extractMediaItems(mapping.google.fix.slice(1));   // shopping
        doneCount = 0;
        var rawsMediaList3 = extractMediaItems(mapping.google.none);           // power_contents, brand_search, place        
        rawsMediaList = [rawsMediaList1, rawsMediaList2, rawsMediaList3];
      }             
      return rawsMediaList;
    }, 
    getKpiName(k) {return getKpiName(k);},
    getType(type) { return getType(type); },
    getUuidv4() { return uuidv4(); },
    getUnit(k) { return getUnit(k); },   
    getShortNumber(v) { return shortNumber(v);}, 
    getCountByType(d, type) { return d.filter(item => item.type === type).length; },
    getMedia(m) { return getMedia(m); },
    convertInsightList(d) {
      var data = d;
      const summary = { im: 0, clk: 0, cst: 0, cv: 0, cr: 0 };

      // 1. 현재 데이터 총합 구하기
      data.day.graph.forEach(day => {
        summary.im += parseInt(day.im || 0);
        summary.clk += parseInt(day.clk || 0);
        summary.cst += parseInt(day.cst || 0);
        summary.cv += parseFloat(day.cv || 0);
        summary.cr += parseInt(day.cr || 0);
      });

      // 2. 파생 지표 계산
      var derived = {
        ctr: summary.im > 0 ? (summary.clk / summary.im) * 100 : 0,
        cpc: summary.clk > 0 ? summary.cst / summary.clk : 0,
        cpa: summary.cv > 0 ? summary.cst / summary.cv : 0,
        cvr: summary.clk > 0 ? (summary.cv / summary.clk) * 100 : 0,
        roas: summary.cst > 0 ? (summary.cr / summary.cst) * 100 : 0
      };

      // 3. 비교값 및 퍼센트 변화 추출
      var cp = data.cp.cp || {};
      var per = data.cp.per || {};

      // 4. 결과 반환
      return {
        ...summary,        // 합산값: im, clk, cst, cv, cr
        ...derived,        // 파생 지표: ctr, cpc, cpa, cvr, roas
        cp,             // 비교 기준 값
        per             // 변화율 %
      };      
    },
    converChart1List(d) {
      var rawData = d;
      var typeKeys = Object.keys(rawData);

      // 타입별 비용 합
      var typeCostMap = typeKeys.map(type => {
        var totalCst = rawData[type].reduce((sum, item) => sum + (item.cst || 0), 0);
        return { type, totalCst };
      });

      // 전체 비용
      var totalCstAll = typeCostMap.reduce((sum, t) => sum + t.totalCst, 0);

      // 비중 계산
      var typeShare = typeCostMap.map(t => ({
        type: t.type,
        totalCst: t.totalCst,
        share: totalCstAll > 0 ? Math.ceil(parseFloat((t.totalCst / totalCstAll) * 100)) : 0
      }));     
      return typeShare;
    }        
  }
};
</script>

<style scoped>

</style>
