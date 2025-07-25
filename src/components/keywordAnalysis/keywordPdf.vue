<template>
  <div id="pdf-content" ref="pdfContent" :class="getUniqueId">
    <div class="header">
      <div class="d-flex justify-content-between align-items-center">
         <h1 v-if="media !== null" class="txt-48 fw-900 chart-title">{{`키워드리포트 - ${getMedia(media)}`}}</h1>
         <div>
          <h3 class="txt-18 fw-900"><span class="chart-title">기준:</span> {{` ${date.start} ~ ${date.end}`}} </h3>
          <h3 class="txt-18 fw-900"><span class="chart-title">비교:</span> {{` ${cdate.start} ~ ${cdate.end}`}} </h3>
         </div>
      </div>
    </div>
    <div class="article mt-80">
      <div class="d-flex">
        <p class="txt-18 chart-title">{{`▣ TOP10 키워드`}}</p>
      </div>      
      <div class="d-flex justify-content-between align-items-center gap-2">
        <template v-for="(k,i) in ['im','clk','ctr','cpc']" :key="k+i+getUuidv4()">
          <div class="col-3 media-table" >
            <table>
              <thead>
                <tr>
                  <td>캠페인 / 그룹</td>
                  <td>키워드</td>
                  <td>{{`TOP10 ${getKpiName(k)}`}}</td>
                </tr>
              </thead>
              <tbody>
                <template v-for="i in 10" :key="'empty-'+i">
                  <tr >
                    <template v-if="getKpiList(k)[i-1]">
                      <td :title="getKpiList(k)[i-1]['campaign_name']">
                        {{ getKpiList(k)[i-1]['campaign_name'].length > 3 ? `${getKpiList(k)[i-1]['campaign_name'].slice(0, 3)}... / ${getKpiList(k)[i-1]['adgroup_name'].slice(0, 2)}`   + '...' : `${getKpiList(k)[i-1]['campaign_name']} / ${getKpiList(k)[i-1]['adgroup_name']}`  }}
                      </td>
                      <td :title="getKpiList(k)[i-1]['keyword_name']">
                        {{ getKpiList(k)[i-1]['keyword_name'].length > 5 ? getKpiList(k)[i-1]['keyword_name'].slice(0, 5) + '...' : getKpiList(k)[i-1]['keyword_name'] }}
                      </td>
                      <td>
                        {{ `${(k==='ctr' ? getShortPercent(getKpiList(k)[i-1][k]) : getShortNumber(getKpiList(k)[i-1][k]))}`  }}
                        <span v-if="getCpPer(k, i) !== null" :class="[getCpPer(k, i) > 0 ? 'up' : 'down']">{{ `(${getShortPercent(getCpPer(k, i))})` }}</span>
                      </td>
                    </template>
                    <template v-else>
                      <td></td>
                      <td></td>
                      <td></td>
                    </template>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </template>
      </div>     
      <div class="d-flex justify-content-between align-items-center gap-2">
        <template v-for="(k,i) in ['cst','cv','cr','roas']" :key="k+i+getUuidv4()">
          <div class="col-3 media-table" >
            <table>
              <thead>
                <tr>
                  <td>캠페인 / 그룹</td>
                  <td>키워드</td>
                  <td>{{`TOP10 ${getKpiName(k)}`}}</td>
                </tr>
              </thead>
              <tbody>
                <template v-for="i in 10" :key="'empty-'+i">
                  <tr >
                    <template v-if="getKpiList(k)[i-1]">
                      <td :title="getKpiList(k)[i-1]['campaign_name']">
                        {{ getKpiList(k)[i-1]['campaign_name'].length > 3 ? `${getKpiList(k)[i-1]['campaign_name'].slice(0, 3)}... / ${getKpiList(k)[i-1]['adgroup_name'].slice(0, 2)}`   + '...' : `${getKpiList(k)[i-1]['campaign_name']} / ${getKpiList(k)[i-1]['adgroup_name']}`  }}
                      </td>
                      <td :title="getKpiList(k)[i-1]['keyword_name']">
                        {{ getKpiList(k)[i-1]['keyword_name'].length > 5 ? getKpiList(k)[i-1]['keyword_name'].slice(0, 5) + '...' : getKpiList(k)[i-1]['keyword_name'] }}
                      </td>
                      <td>
                        {{ `${(k==='roas' ? getShortPercent(getKpiList(k)[i-1][k]) : getShortNumber(getKpiList(k)[i-1][k]))}`  }}
                        <span v-if="getCpPer(k, i) !== null" :class="[getCpPer(k, i) > 0 ? 'up' : 'down']">{{ `(${getShortPercent(getCpPer(k, i))})` }}</span>
                      </td>
                    </template>
                    <template v-else>
                      <td></td>
                      <td></td>
                      <td></td>
                    </template>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>          
        </template>
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
        var requests = [
          $.ajax({
            type: "get",
            url: API_URL + "/app/analysis/keywordreport",
            headers: {authorization: SHA256(TEMP_KEY)},
            data: {userid: store.state.userStore.userinfo.userid, fromdate: vm.date.start, todate: vm.date.end, 
            comparefromdate: vm.cdate.start, 
            comparetodate: vm.cdate.end, 
            md: {naver: "N", kakaosa: "D", google: "google"}[vm.media],
            start: 0,
            sort: 'imd',
            display: 10,
            totalcount: "-1",
            kpi: "im,clk,ctr,cpc,cst,cv,cr,roas",
            session: store.state.userStore.session,
            },            
          }),
        ];

        Promise.all(requests).then(([res1]) => {
          var kpiKeys = ['clk', 'cpc', 'cr', 'cst', 'ctr', 'cv', 'im', 'roas'];
          kpiKeys.forEach(key => {
            var listKey = key + 'List';
            vm[listKey] = Array.isArray(res1.data.kpis[key]) ? res1.data.kpis[key].slice() : [];
          });    
          vm.$nextTick(() => {            
            resolve();
          });          
        });
      });
    },
    getChart1List(chart1List) {},
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
