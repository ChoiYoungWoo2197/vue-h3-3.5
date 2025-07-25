<template>
  <div id="pdf-content" ref="pdfContent" :class="getUniqueId">
    <div class="header">
      <div class="d-flex justify-content-between align-items-center">
         <h1 class="txt-48 fw-900 chart-title">매체리포트</h1>
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
          <p class="txt-18 chart-title txt-center">{{`매체`}}</p>
          <div class="d-flex justify-content-between" :id="`chart1-${uid}`" style="height: 300px;"></div>
        </div>
        <div class="col-3 card">
          <p class="txt-18 chart-title txt-center">{{`클릭수, 노출수`}}</p>
          <div :id="`chart2-${uid}`" style="height: 300px;"></div>
        </div>
        <div class="col-3 card">
          <p class="txt-18 chart-title txt-center">{{`CPC`}}</p>
          <div :id="`chart3-${uid}`" style="height: 300px;"></div>
        </div>
        <div class="col-3 card">
          <p class="txt-18 chart-title txt-center">{{`광고비`}}</p>
          <div :id="`chart4-${uid}`" style="height: 300px;"></div>
        </div>
      </div>     
      <div class="mt-30">
        <p class="txt-18 chart-title">{{`▣ 매체별 광고요약`}}</p>
        <table>
          <colgroup>
            <col style="width:10%;">
            <col style="width:10%;">
            <col style="width:10%;">
            <col style="width:10%;">
            <col style="width:10%;">
            <col style="width:10%;">
            <col style="width:10%;">
            <col style="width:10%;">
            <col style="width:10%;">
            <col style="width:10%;">
            <col style="width:10%;">                 
          </colgroup>
          <thead>
            <tr>
              <td>매체</td>
              <template  v-for="(k,i) in ['im','clk','ctr','cpc','cst','cv','cr','cpa','cvr','roas']" :key="i+getUuidv4()">
                <td >{{`${getKpiName(k)}`}}</td>
              </template>
            </tr>
          </thead>
          <tbody>
            <template v-for="(d, i) in mediaList">
              <tr v-if="d[0].media !== 'TOTAL'" :key="i+getUuidv4()">
                <td>{{`${d[0].media}`}}</td>
                <td>{{`${d[0].im}`}}</td>
                <td>{{`${d[0].clk}`}}</td>
                <td>{{`${d[0].ctr}`}}</td>
                <td>{{`${d[0].cpc}`}}</td>
                <td>{{`${d[0].cst}`}}</td>
                <td>{{`${d[0].cv}`}}</td>
                <td>{{`${d[0].cr}`}}</td>
                <td>{{`${d[0].cpa}`}}</td>
                <td>{{`${d[0].cvr}`}}</td>
                <td>{{`${d[0].roas}`}}</td>
              </tr>
            </template>
            <template v-for="(d, i) in mediaList">
              <tr class="total" v-if="d[0].media === 'TOTAL'" :key="i+getUuidv4()">
                <td>{{`${d[0].media}`}}</td>
                <td>{{`${d[0].im}`}}</td>
                <td>{{`${d[0].clk}`}}</td>
                <td>{{`${d[0].ctr}`}}</td>
                <td>{{`${d[0].cpc}`}}</td>
                <td>{{`${d[0].cst}`}}</td>
                <td>{{`${d[0].cv}`}}</td>
                <td>{{`${d[0].cr}`}}</td>
                <td>{{`${d[0].cpa}`}}</td>
                <td>{{`${d[0].cvr}`}}</td>
                <td>{{`${d[0].roas}`}}</td>                
              </tr>
            </template>            
          </tbody>
        </table>
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
import {  isMobile,  priceToString,  getMedia,  uuidv4,  getUnit, getType,  getKpiName, generateInsights, generateTrends} from "@/assets/js/common.js";
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
      var yData = this.chart3List.map(item => item.cpc);
      chart.setOption({
        tooltip: { trigger: 'axis' },      
        grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },          
        xAxis: { type: 'category', data: xData, axisLabel: { rotate: 45, fontSize: 10 }},
        yAxis: { type: 'value', name: 'CPC' },
        series: [
          {
            name: 'CPC',
            type: 'line',
            smooth: true,
            data: yData,
            lineStyle: { color: '#9B51E0', width: 3 },
            itemStyle: { color: '#9B51E0' },
            areaStyle: { color: '#E5D5F9', opacity: 0.1 }
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
      var yData = this.chart4List.map(item => item.cst);
      chart.setOption({
        tooltip: { trigger: 'axis' },      
        grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },          
        xAxis: { type: 'category', data: xData, axisLabel: { rotate: 45, fontSize: 10 }},
        yAxis: { type: 'value', name: '광고비' },
        series: [
          {
            name: '광고비',
            type: 'line',
            smooth: true,
            data: yData,
            lineStyle: { color: '#FF4D6D', width: 3 },
            itemStyle: { color: '#FF4D6D' },
            areaStyle: { color: '#FFC2CC', opacity: 0.1 }
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
            type: "post",
            url: API_URL + "/app/dashboard/period",
            headers: {authorization: SHA256(TEMP_KEY)},
            data: {userid: store.state.userStore.userinfo.userid, fromdate: vm.date.start, todate: vm.date.end, session: store.state.userStore.session,
            },            
          }),
          $.ajax({
            type: "post",
            url: API_URL + "/app/dashboard/summarymedia",
            headers: {authorization: SHA256(TEMP_KEY)},
            data: {userid: store.state.userStore.userinfo.userid, fromdate: vm.date.start, todate: vm.date.end, session: store.state.userStore.session,
            },            
          }),
          $.ajax({
            type: "post",
            url: API_URL + "/app/dashboard/summarymediarate",
            headers: {authorization: SHA256(TEMP_KEY)},
            data: {userid: store.state.userStore.userinfo.userid, fromdate: vm.date.start, todate: vm.date.end, session: store.state.userStore.session,
            },            
          })                         
        ];

        Promise.all(requests).then(([res1,res2,res3,res4]) => {
          //console.log(res1,res2,res3, res4);
          vm.insightList = generateInsights(res1.data, { tone: 'marketer' }); //코멘트
          vm.chart1List = vm.getChart1List(res4.data);
          vm.chart2List = Object.entries(res2.data).map(([date, values]) => { return {date, clk: values.clk, im: values.im} })
          vm.chart3List = Object.entries(res2.data).map(([date, values]) => { return {date, cpc: values.cpc} })
          vm.chart4List = Object.entries(res2.data).map(([date, values]) => { return {date, cst: values.cstd} })
          vm.mediaList = vm.getMediaList(res3.data);

          var imTrend = generateTrends(vm.chart2List, 'im');
          var clkTrend = generateTrends(vm.chart2List, 'clk');
          var cpcTrend = generateTrends(vm.chart3List, 'cpc');
          var cstTrend = generateTrends(vm.chart4List, 'cst');
          vm.trends = `노출수 ${imTrend} / 클릭수 ${clkTrend} / CPC ${cpcTrend} / 광고비 ${cstTrend}`;
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
      const mapping = { N: "네이버SA", D: "카카오SA", K: "카카오모먼트", Nda: "네이버GFA", google: "구글", TOTAL: "TOTAL" };
      const typeMap = { N: "SA", D: "SA", Nda: "GFA", google: "SA", total: "TOTAL" };

      const rawsChart1List = Object.entries(chart1List).map(([media, item]) => {
        const m = mapping[media] || media;
        const type = typeMap[media] || "";
        return { name: m, value: item.per };
      })
      return rawsChart1List;
    },
    getMediaList(mediaList) {
      const mapping = { N: "네이버SA", D: "카카오SA", K: "카카오모먼트", Nda: "네이버GFA", google: "구글", TOTAL: "TOTAL" };
      const typeMap = { N: "SA", D: "SA", Nda: "GFA", google: "SA", total: "TOTAL" };
      const rawsMediaList = Object.entries(mediaList).map(([media, item]) => {
        const m = mapping[media] || media;
        const type = typeMap[media] || "";

        return [
          {
            media: m, type: type, 
            im: (`${priceToString(parseInt(item.im, 10))}회` ) || 0, 
            clk: (`${priceToString(parseInt(item.clk, 10))}회` ) || 0, 
            ctr: item.ctr ? `${item.ctr}%` : "0.00%",
            cpc: (`${priceToString(Math.ceil(parseFloat(item.cpc.toString().replace(/,/g, ""))))}원`) || 0, 
            cst: (`${priceToString(Math.ceil(parseFloat(item.cst.toString().replace(/,/g, ""))))}원`) || 0, 
            cv: (`${priceToString(parseInt(item.cv, 10))}회` ) || 0, 
            cr: (`${priceToString(Math.ceil(parseFloat(item.cr.toString().replace(/,/g, ""))))}원`) || 0, 
            cvr: item.cvr ? `${item.cvr}%` : "0.00%",
            cpa: (`${priceToString(Math.ceil(parseFloat(item.cpa.toString().replace(/,/g, ""))))}원`) || 0, 
            roas: item.roas ? `${item.roas}%` : "0.00%",
          }
        ];
      })
      return rawsMediaList;
    },    
    getKpiName(k) {return getKpiName(k);},
    getType(type) { return getType(type); },
    getUuidv4() { return uuidv4(); },
    getUnit(k) { return getUnit(k); },              
  }
};
</script>

<style scoped>

</style>
