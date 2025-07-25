<template>
  <div id="pdf-content" ref="pdfContent" :class="getUniqueId">
    <div class="header">
      <div class="d-flex justify-content-between align-items-center">
         <h1 class="txt-48 fw-900 chart-title">SUMMARY</h1>
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
          <p class="txt-18 chart-title txt-center">{{`노출수`}}</p>
          <div :id="`chart1-${uid}`" style="height: 300px;"></div>
        </div>
        <div class="col-3 card">
          <p class="txt-18 chart-title txt-center">{{`클릭수`}}</p>
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
                <td>{{`${d[0].im}`}}<span v-if="getCpPer('im',null) !== null" :class="[getCpPer('im',null) > 0 ? 'up' : 'down']">{{`(${getShortPercent(getCpPer('im',null))})`}}</span></td>
                <td>{{`${d[0].clk}`}}<span v-if="getCpPer('clk',null) !== null" :class="[getCpPer('clk',null) > 0 ? 'up' : 'down']">{{`(${getShortPercent(getCpPer('clk',null))})`}}</span></td>
                <td>{{`${d[0].ctr}`}}<span v-if="getCpPer('ctr',null) !== null" :class="[getCpPer('ctr',null) > 0 ? 'up' : 'down']">{{`(${getShortPercent(getCpPer('ctr',null))})`}}</span></td>
                <td>{{`${d[0].cpc}`}}<span v-if="getCpPer('cpc',null) !== null" :class="[getCpPer('cpc',null) > 0 ? 'up' : 'down']">{{`(${getShortPercent(getCpPer('cpc',null))})`}}</span></td>
                <td>{{`${d[0].cst}`}}<span v-if="getCpPer('cst',null) !== null" :class="[getCpPer('cst',null) > 0 ? 'up' : 'down']">{{`(${getShortPercent(getCpPer('cst',null))})`}}</span></td>
                <td>{{`${d[0].cv}`}}<span v-if="getCpPer('cv',null) !== null" :class="[getCpPer('cv',null) > 0 ? 'up' : 'down']">{{`(${getShortPercent(getCpPer('cv',null))})`}}</span></td>
                <td>{{`${d[0].cr}`}}<span v-if="getCpPer('cr',null) !== null" :class="[getCpPer('cr',null) > 0 ? 'up' : 'down']">{{`(${getShortPercent(getCpPer('cr',null))})`}}</span></td>
                <td>{{`${d[0].cpa}`}}<span v-if="getCpPer('cpa',null) !== null" :class="[getCpPer('cpa',null) > 0 ? 'up' : 'down']">{{`(${getShortPercent(getCpPer('cpa',null))})`}}</span></td>
                <td>{{`${d[0].cvr}`}}<span v-if="getCpPer('cvr',null) !== null" :class="[getCpPer('cvr',null) > 0 ? 'up' : 'down']">{{`(${getShortPercent(getCpPer('cvr',null))})`}}</span></td>
                <td>{{`${d[0].roas}`}}<span v-if="getCpPer('roas',null) !== null" :class="[getCpPer('roas',null) > 0 ? 'up' : 'down']">{{`(${getShortPercent(getCpPer('roas',null))})`}}</span></td>
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
import {  isMobile,  priceToString,  getMedia,  uuidv4,  getUnit, getType,  getKpiName, generateInsights, generateTrends, shortNumber, shortPercent} from "@/assets/js/common.js";
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
      cpList: null,
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
      var xData = this.chart1List.map(item => item.date);
      var yData = this.chart1List.map(item => item.im);
      chart.setOption({
        tooltip: { trigger: 'axis' },      
        grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },          
        xAxis: { type: 'category', data: xData, axisLabel: { rotate: 45, fontSize: 10 }},
        yAxis: { type: 'value', name: '노출수' },
        series: [
          {
            name: '노출수',
            type: 'line',
            smooth: true,
            data: yData,
            lineStyle: { color: '#095AE1', width: 3 },
            itemStyle: { color: '#095AE1' },
            areaStyle: { color: '#3B82F6', opacity: 0.1 }
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
      var yData = this.chart2List.map(item => item.clk);
      chart.setOption({
        tooltip: { trigger: 'axis' },      
        grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },          
        xAxis: { type: 'category', data: xData, axisLabel: { rotate: 45, fontSize: 10 }},
        yAxis: { type: 'value', name: '클릭수' },
        series: [
          {
            name: '클릭수',
            type: 'line',
            smooth: true,
            data: yData,
            lineStyle: { color: '#00BFAE', width: 3 },
            itemStyle: { color: '#00BFAE' },
            areaStyle: { color: '#A8EDEA', opacity: 0.1 }
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
        vm.cpList = null;
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
          })          
        ];

        Promise.all(requests).then(([res1,res2,res3]) => {
          //console.log(res1,res2,res3);
          vm.insightList = generateInsights(res1.data, { tone: 'marketer' }); //코멘트
          vm.chart1List = Object.entries(res2.data).map(([date, values]) => { return {date, im: values.im} })
          vm.chart2List = Object.entries(res2.data).map(([date, values]) => { return {date, clk: values.clk} })
          vm.chart3List = Object.entries(res2.data).map(([date, values]) => { return {date, cpc: values.cpc} })
          vm.chart4List = Object.entries(res2.data).map(([date, values]) => { return {date, cst: values.cstd} })
          vm.cpList = res1.data;
          vm.mediaList = vm.getMediaList(res3.data);
          var imTrend = generateTrends(vm.chart1List, 'im');
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
                  vm.$emit('init-finish');
                  resolve();
                }
              });
            });
          });          
        });
      });
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
    getShortNumber(v) { return shortNumber(v); }, 
    getShortPercent(v) { return shortPercent(v); },          
    getCpPer(k, o) {
      var prev = this.cpList;
      if (prev && prev.per && typeof prev.per[k] !== 'undefined') { return parseFloat(prev.per[k]); }
      return null;
    },            
  }
};
</script>

<style scoped>

</style>
