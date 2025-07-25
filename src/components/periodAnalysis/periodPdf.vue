<template>
  <div id="pdf-content" ref="pdfContent" :class="getUniqueId">
    <div class="header">
      <div class="d-flex justify-content-between align-items-center">
         <h1 v-if="media !== null" class="txt-48 fw-900 chart-title">{{`기간별리포트 - ${getMedia(media)}`}}</h1>
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
          <p class="txt-18 chart-title txt-center">{{`월별`}}</p>
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
              <p v-if="mediaList.length" class="txt-18 chart-title">{{`▣ 1~5월`}}</p>
              <table>
                <colgroup>
                  <col style="width:10%;">
                  <col style="width:10%;">
                  <col style="width:10%;">
                  <col style="width:10%;">
                </colgroup>
                <thead>
                  <tr>
                    <td>기간</td>
                    <td>클릭수 / 노출수</td>
                    <td>CPC / 광고비</td>
                    <td>전환수 / 전환매출</td>
                  </tr>
                </thead>
                <tbody>
                  <template v-if="mediaList.length">
                    <template v-for="(d,i) in getRange(1,5)" :key="d+i+getUuidv4()">
                      <tr >
                        <template v-if="mediaList[d-1]">
                          <td>{{ `${mediaList[d-1]['type']}` }}</td>
                          <td>{{ `${getShortNumber(mediaList[d-1]['clk'])} / ${getShortNumber(mediaList[d-1]['im'])}` }}</td>
                          <td>{{ `${getShortNumber(mediaList[d-1]['cpc'])} / ${getShortNumber(mediaList[d-1]['cst'])}` }}</td>
                          <td>{{ `${getShortNumber(mediaList[d-1]['cv'])} / ${getShortNumber(mediaList[d-1]['cr'])}` }}</td>
                        </template>
                      </tr>                   
                    </template>
                  </template>
                </tbody>
              </table>
            </div>
            <div class="col-4 media-table">
              <p v-if="mediaList.length" class="txt-18 chart-title">{{`▣ 6~10월`}}</p>
              <table>
                <colgroup>
                  <col style="width:10%;">
                  <col style="width:10%;">
                  <col style="width:10%;">
                  <col style="width:10%;">
                </colgroup>
                <thead>
                  <tr>
                    <td>기간</td>
                    <td>클릭수 / 노출수</td>
                    <td>CPC / 광고비</td>
                    <td>전환수 / 전환매출</td>
                  </tr>
                </thead>
                <tbody>
                  <template v-if="mediaList.length">
                    <template v-for="(d,i) in getRange(6,10)" :key="d+i+getUuidv4()">
                      <tr >
                        <template v-if="mediaList[d-1]">
                          <td>{{ `${mediaList[d-1]['type']}` }}</td>
                          <td>{{ `${getShortNumber(mediaList[d-1]['clk'])} / ${getShortNumber(mediaList[d-1]['im'])}` }}</td>
                          <td>{{ `${getShortNumber(mediaList[d-1]['cpc'])} / ${getShortNumber(mediaList[d-1]['cst'])}` }}</td>
                          <td>{{ `${getShortNumber(mediaList[d-1]['cv'])} / ${getShortNumber(mediaList[d-1]['cr'])}` }}</td>
                        </template>
                      </tr>                   
                    </template>
                  </template>                 
                </tbody>
              </table>
            </div>
            <div class="col-4 media-table">
              <p v-if="mediaList.length" class="txt-18 chart-title">{{`▣ 11~12월`}}</p>
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
                  <template v-if="mediaList.length">
                    <template v-for="(d,i) in getRange(11,15)" :key="d+i+getUuidv4()">
                      <tr >
                        <template v-if="mediaList[d-1]">
                          <td>{{ `${mediaList[d-1]['type']}` }}</td>
                          <td>{{ `${getShortNumber(mediaList[d-1]['clk'])} / ${getShortNumber(mediaList[d-1]['im'])}` }}</td>
                          <td>{{ `${getShortNumber(mediaList[d-1]['cpc'])} / ${getShortNumber(mediaList[d-1]['cst'])}` }}</td>
                          <td>{{ `${getShortNumber(mediaList[d-1]['cv'])} / ${getShortNumber(mediaList[d-1]['cr'])}` }}</td>
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
      var startOfYear  = moment().startOf('year').format('YYYY-MM-DD');
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
            type: "post",
            url: API_URL + "/app/dashboard/summary",
            headers: {authorization: SHA256(TEMP_KEY)},
            data: {userid: store.state.userStore.userinfo.userid, fromdate: vm.date.start, todate: vm.date.end, comparefromdate: vm.cdate.start, 
            comparetodate: vm.cdate.end, session: store.state.userStore.session,
            },            
          }),          
          $.ajax({
            type: "get",
            url: API_URL + "/app/analysis/periodreport",
            headers: {authorization: SHA256(TEMP_KEY)},
            data: {userid: store.state.userStore.userinfo.userid, fromdate: startOfYear, todate: vm.date.end, comparefromdate: "", comparetodate: "", periodunit: "month", session: store.state.userStore.session,
            },            
          }),
        ];

        Promise.all(requests).then(([res1,res2]) => {
          //console.log(res1,res2);
          vm.insightList = generateInsights(res1.data, { tone: 'marketer' }); //코멘트
          vm.chart1List = vm.getChart1List(vm.converChart1List(res2.data.media[vm.media]));          
          vm.chart2List = vm.getChart2List(res2.data.media[vm.media]);
          vm.chart3List = vm.getChart3List(res2.data.media[vm.media]);
          vm.chart4List = vm.getChart4List(res2.data.media[vm.media]);
          vm.mediaList = vm.getMediaList(res2.data.media[vm.media], vm.media);
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
      const mapping = {};
      const typeMap = { N: "SA", D: "SA", Nda: "GFA", google: "SA", total: "TOTAL" };
      const rawsChart1List = Object.entries(chart1List).map(([media, item]) => {
        const m = mapping[item.type] || item.type;
        return { name: m, value: item.share };
      })
      return rawsChart1List;
    },
    getChart2List(chartList) {
      var rawsChart2List = [];
      // 기본적으로 1~12월 루프
      for (var i = 0; i < 12; i++) {
        var monthKey = moment().month(i).format("YYYY-MM");
        var item = chartList[monthKey] || {};
        rawsChart2List.push({
          date: monthKey,
          im: item.im ? `${parseInt(item.im, 10)}` : 0,
          clk: item.clk ? `${parseInt(item.clk, 10)}` : 0,
        });
      }
      return rawsChart2List;
    },
    getChart3List(chartList) {
      var rawsChart3List = [];
      // 기본적으로 1~12월 루프
      for (var i = 0; i < 12; i++) {
        var monthKey = moment().month(i).format("YYYY-MM");
        var item = chartList[monthKey] || {};
        rawsChart3List.push({
          date: monthKey,
          cpc: (item.cst / item.clk) ?  `${item.cst / item.clk}` : 0,
          cst: item.cst ? `${Math.ceil(parseFloat(item.cst))}` : 0,
        });
      }
      return rawsChart3List;
    },    
    getChart4List(chartList) {
      var rawsChart4List = [];
      // 기본적으로 1~12월 루프
      for (var i = 0; i < 12; i++) {
        var monthKey = moment().month(i).format("YYYY-MM");
        var item = chartList[monthKey] || {};
        rawsChart4List.push({
          date: monthKey,
          cv: item.cv ? `${item.cv}` : 0,
          cr: item.cr ? `${item.cr}` : 0,
        });
      }
      return rawsChart4List;
    },        
    getMediaList(v, m) {
      var rawsMediaList = [];
      // 기본적으로 1~12월 루프
      for (var i = 0; i < 12; i++) {
        var monthKey = moment().month(i).format("YYYY-MM");
        var item = v[monthKey] || {};
        rawsMediaList.push({
          type: monthKey,
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
      }
      return rawsMediaList;
    }, 
    getKpiName(k) {return getKpiName(k);},
    getType(type) { return getType(type); },
    getUuidv4() { return uuidv4(); },
    getUnit(k) { return getUnit(k); },   
    getShortNumber(v) { return shortNumber(v);}, 
    getCountByType(d, type) { return d.filter(item => item.type === type).length; },
    getRange(s, e) { return Array.from({ length: e - s + 1 }, (_, i) => s + i); },
    getMedia(m) { return getMedia(m); },
    converChart1List(d) {
      var rawData = d;
      var currentYear = moment().format('YYYY');
      var result = [];
      var total = 0;

      // 1. 총 광고비 합산
      for (var i = 1; i <= 12; i++) {
        var key = currentYear + '-' + (i < 10 ? '0' + i : i);
        if (rawData[key] && rawData[key].cst) {
          total += rawData[key].cst;
        }
      }

      // 2. 1월~12월 데이터 구성
      for (var i = 1; i <= 12; i++) {
        var key = currentYear + '-' + (i < 10 ? '0' + i : i);
        var cost = 0;
        if (rawData[key] && rawData[key].cst) { cost = rawData[key].cst; }

        var share = total ? Math.round((cost / total) * 100) : 0;
        result.push({ type: i + '월', totalCst: cost, share: share });
      }
      return result;
    }        
  }
};
</script>

<style scoped>

</style>
