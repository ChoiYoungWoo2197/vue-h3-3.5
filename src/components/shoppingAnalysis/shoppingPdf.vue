<template>
  <div id="pdf-content" ref="pdfContent" :class="getUniqueId">
    <div class="header">
      <div class="d-flex justify-content-between align-items-center">
         <h1 v-if="media !== null" class="txt-48 fw-900 chart-title">{{`소핑검색리포트 - ${getMedia('naver')}`}}</h1>
         <div>
          <h3 class="txt-18 fw-900"><span class="chart-title">기준:</span> {{` ${date.start} ~ ${date.end}`}} </h3>
          <h3 class="txt-18 fw-900"><span class="chart-title">비교:</span> {{` ${cdate.start} ~ ${cdate.end}`}} </h3>
         </div>
      </div>
    </div>
    <div class="article mt-80">
      <div class="d-flex">
        <p class="txt-18 chart-title">{{`▣ TOP5 쇼핑소재`}}</p>
      </div>      
      <div class="d-flex justify-content-between align-items-center gap-2">
        <div v-for="(k,i) in ['im','clk','cst']" :key="'empty-' + k+i" class="col-4 media-table">
          <table>
            <thead>
              <tr>
                <td style="">이미지</td>
                <td>캠페인 / 그룹</td>
                <td style="">소재</td>
                <td>{{`TOP5 ${getKpiName(k)}`}}</td>                   
              </tr>
            </thead>
            <tbody>
              <template v-for="i in 5" :key="'empty-'+i">
                <tr >
                  <template v-if="getKpiList(k)[i-1]">
                    <td><img
                        style="height: 55px; width: 100px;"
                        class="img-thumbnail"
                        :src="getKpiList(k)[i-1] && getKpiList(k)[i-1]['ad_image_pbase64']
                          ? `${getKpiList(k)[i-1]['ad_image_pbase64']}`
                          : 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=='"
                    /></td>
                     <td class="text-left">
                      <div class="pl-2">{{`${getKpiList(k)[i-1]['campaign_name']}`}}</div>
                      <div class="pl-2">{{`${getKpiList(k)[i-1]['adgroup_name']}`}}</div>
                    </td>
                    <template v-if="getKpiList(k)[i-1]['ad_pname'].length">
                      <td :title="getKpiList(k)[i-1]['ad_pname']">
                        {{ getKpiList(k)[i-1]['ad_pname'].length > 15 ? getKpiList(k)[i-1]['ad_pname'].slice(0, 15) + '...' : getKpiList(k)[i-1]['ad_pname'] }}
                      </td>
                    </template>
                    <template v-else>
                      <td :title="getKpiList(k)[i-1]['ad_productname']">
                        {{ getKpiList(k)[i-1]['ad_productname'].length > 15 ? getKpiList(k)[i-1]['ad_productname'].slice(0, 15) + '...' : getKpiList(k)[i-1]['ad_productname'] }}
                      </td>
                    </template>
                   <td>
                      {{ `${(k==='ctr' ? getShortPercent(getKpiList(k)[i-1][k]) : getShortNumber(getKpiList(k)[i-1][k]))}`  }}
                      <span v-if="getCpPer(k, i) !== null" :class="[getCpPer(k, i) > 0 ? 'up' : 'down']">{{ `(${getShortPercent(getCpPer(k, i))})` }}</span>
                    </td>
                  </template>
                  <template v-else>
                    <td><img style="height: 55px; width: 100px;" class="img-thumbnail" :src="'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=='"/></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </template>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>     
      <div class="d-flex justify-content-between align-items-center gap-2">
        <div v-for="(k,i) in ['cv','cr','roas']" :key="'empty-' + k+i" class="col-4 media-table">
          <table>
            <thead>
              <tr>
                <td style="">이미지</td>
                <td>캠페인 / 그룹</td>
                <td style="">소재</td>
                <td>{{`TOP5 ${getKpiName(k)}`}}</td>                   
              </tr>
            </thead>
            <tbody>
              <template v-for="i in 5" :key="'empty-'+i">
                <tr >
                  <template v-if="getKpiList(k)[i-1]">
                    <td><img
                        style="height: 55px; width: 100px;"
                        class="img-thumbnail"
                        :src="getKpiList(k)[i-1] && getKpiList(k)[i-1]['ad_image_pbase64']
                          ? `${getKpiList(k)[i-1]['ad_image_pbase64']}`
                          : 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=='"
                    /></td>
                     <td class="text-left">
                      <div class="pl-2">{{`${getKpiList(k)[i-1]['campaign_name']}`}}</div>
                      <div class="pl-2">{{`${getKpiList(k)[i-1]['adgroup_name']}`}}</div>
                    </td>
                    <template v-if="getKpiList(k)[i-1]['ad_pname'].length">
                      <td :title="getKpiList(k)[i-1]['ad_pname']">
                        {{ getKpiList(k)[i-1]['ad_pname'].length > 15 ? getKpiList(k)[i-1]['ad_pname'].slice(0, 15) + '...' : getKpiList(k)[i-1]['ad_pname'] }}
                      </td>
                    </template>
                    <template v-else>
                      <td :title="getKpiList(k)[i-1]['ad_productname']">
                        {{ getKpiList(k)[i-1]['ad_productname'].length > 15 ? getKpiList(k)[i-1]['ad_productname'].slice(0, 15) + '...' : getKpiList(k)[i-1]['ad_productname'] }}
                      </td>
                    </template>
                   <td>
                      {{ `${(k==='roas' ? getShortPercent(getKpiList(k)[i-1][k]) : getShortNumber(getKpiList(k)[i-1][k]))}`  }}
                      <span v-if="getCpPer(k, i) !== null" :class="[getCpPer(k, i) > 0 ? 'up' : 'down']">{{ `(${getShortPercent(getCpPer(k, i))})` }}</span>
                    </td>
                  </template>
                  <template v-else>
                    <td><img style="height: 55px; width: 100px;" class="img-thumbnail" :src="'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=='"/></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </template>
                </tr>
              </template>
            </tbody>
          </table>
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
      clkList: [],
      cpcList: [],
      crList: [],
      cstList: [],  
      ctrList: [],  
      cvList: [],  
      imList: [],  
      roasList: [],  
      date: {},
      cdate: {},
      media: null,
      type: null
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
    initChart1() {},
    initChart2() {},
    initChart3() {},    
    initChart4() {},
    initPDF(o) {
      var vm = this;
      return new Promise((resolve) => {
        vm.date = o.date || {};
        vm.cdate = o.cdate || {};
        vm.insightList = [];
        vm.mediaList = [];
        vm.clkList = [],
        vm.cpcList = [],
        vm.crList = [],
        vm.cstList = [],  
        vm.ctrList = [],  
        vm.cvList = [],  
        vm.imList = [],  
        vm.roasList = [],  
        vm.trends = null;
        vm.media = o.media || {};        
        vm.type = o.type || {};
        var requests = [
          $.ajax({
            type: "get",
            url: API_URL + "/app/shopping/shoppingreport",
            headers: {authorization: SHA256(TEMP_KEY)},
            data: { userid: store.state.userStore.userinfo.userid, fromdate: vm.date.start, todate: vm.date.end, 
            comparefromdate: vm.cdate.start, comparetodate: vm.cdate.end, kpi: "im,clk,ctr,cpc,cst,cv,cr,roas", 
            session: store.state.userStore.session, base64: "true",
            },
          }),
        ];

        Promise.all(requests).then(([res1]) => {
          var kpiKeys = ['im', 'clk', 'ctr', 'cpc', 'cst', 'cv', 'cr', 'roas'];
          kpiKeys.forEach(key => {
            var listKey = key + 'List';
            vm[listKey] = Array.isArray(res1.data.topads[key]) ? res1.data.topads[key].slice() : [];
          });    
          //console.log(vm.imList, vm.clkList, vm.cpcList, vm.crList, vm.cstList, vm.cvList);
          vm.$nextTick(() => {            
            resolve();
          });          
        });
      });
    },
    getChart1List(chart1List) {},
    getMediaList(v, m) {}, 
    getKpiName(k) {return getKpiName(k);},
    getType(type) { return getType(type); },
    getUuidv4() { return uuidv4(); },
    getUnit(k) { return getUnit(k); },   
    getShortNumber(v) { return shortNumber(v); }, 
    getShortPercent(v) { return shortPercent(v); },
    getCountByType(d, type) { return d.filter(item => item.type === type).length; },
    getMedia(m) { return getMedia(m); },
    getKpiList(k) { return this[k+'List'] || []; },
    getCpPer(k, i) {
      var list = this.getKpiList(k);
      if (i <= 0 || !list || list.length <= i - 1) return null; // i가 0 이하이거나 배열 범위 초과 시 null 반환
      
      var prev = list[i - 1];
      if ( prev && prev.cp && prev.cp.per && typeof prev.cp.per[k] !== 'undefined' ) { return parseFloat(prev.cp.per[k]); } // prev가 객체이고 cp/per/k 구조가 있을 때만 반환
      return null;
    },  
    convertInsightList(d) {},
    converChart1List(d) {}        
  }
};
</script>

<style scoped>

</style>
