<template>
  <div id="pdf-report-content" ref="pdfReportContent" :class="getUniqueId">
    <!-- 대시보드 공통 -->
    <div class="pdf-page">
      <dashboard-pdf ref="dashboardPdf" @init-finish="onChildReady"></dashboard-pdf>
    </div>
    <!-- 매체별리포트 공통 -->
    <div class="pdf-page-break pdf-page">
      <media-pdf ref="mediaPdf" @init-finish="onChildReady"></media-pdf>
    </div>
    <!-- 매체사별 반복 렌더링 -->
    <template v-for="media in filteredMediaList">
      <template v-if="activeMedia && activeMedia[media.mediaKey]">
        <div :key="`campaignPdf-${media.mediaKey}`" class="pdf-page-break pdf-page" v-if="shouldShow('campaignAnalysis', media.mediaKey)">
          <campaign-pdf :ref="`campaignPdf-${media.mediaKey}`" @init-finish="onChildReady" />
        </div>
        <div :key="`periodPdf-${media.mediaKey}`" class="pdf-page-break pdf-page" v-if="shouldShow('periodAnalysis', media.mediaKey)">
          <period-pdf :ref="`periodPdf-${media.mediaKey}`" :media="media.mediaKey" />
        </div>
        <div :key="`keywordPdf-${media.mediaKey}`" class="pdf-page-break pdf-page" v-if="shouldShow('keywordAnalysis', media.mediaKey)">
          <keyword-pdf :ref="`keywordPdf-${media.mediaKey}`" :media="media.mediaKey" />
        </div>
        <div :key="`adPdf-${media.mediaKey}`" class="pdf-page-break pdf-page" v-if="shouldShow('adAnalysis', media.mediaKey)">
          <ad-pdf :ref="`adPdf-${media.mediaKey}`" :media="media.mediaKey" type="search" />
        </div>
        <div :key="`shoppingPdf-${media.mediaKey}`" class="pdf-page-break pdf-page" v-if="shouldShow('shoppingAnalysis', media.mediaKey)">
          <shopping-pdf :ref="`shoppingPdf-${media.mediaKey}`" :media="media.mediaKey" />
        </div>     
      </template> 
    </template>
  </div>
</template>

<script>
import "@/assets/css/pdf.main.report.css";
import moment from "moment";
import html2pdf from 'html2pdf.js';
import { clearBody, addClassDashboard, priceToString, getMedia, getApp, uuidv4, sortWeekDay, isEmptyObject, getDateStr2, downloadImage, toDataURL,  getUnit, getType,  getKpiName, generateInsights, generateTrends, shortNumber, shortPercent} from "@/assets/js/common.js";
import { store } from "@/store/store.js";
import { SHA256 } from "@/assets/js/sha256.js";
import { API_URL, TEMP_KEY, SUMMARY_SORT, MEDIA_SORT } from "@/configs/config.js";
import dashboardPdf from "@/components/dashboard2/dashboardPdf.vue";
import mediaPdf from "@/components/mediaAnalysis/mediaPdf.vue";
import campaignPdf from '@/components/campaignAnalysis/campaignPdf.vue';
import periodPdf from '@/components/periodAnalysis/periodPdf.vue';
import keywordPdf from '@/components/keywordAnalysis/keywordPdf.vue';
import adPdf from '@/components/adAnalysis/adPdf.vue';
import shoppingPdf from '@/components/shoppingAnalysis/shoppingPdf.vue';
export default {
  props: {},
  data() {
    return {
      uniqueId: null,
      activeBtn: null,
      activeMedia: null,
      activePage: null,
      draggable: null,
      dropdownMenu: null,
      report: null,
      id: null,
      filteredMediaList: [    
        { mediaKey: 'naver' },
        { mediaKey: 'kakaosa' },
        { mediaKey: 'kakaomo' },
        { mediaKey: 'naverda' },
        { mediaKey: 'google' }
      ],   
    };
  },
  watch: {},
  computed: {
    getUniqueId() {
      if (!this.uniqueId) {
        this.uniqueId = "vm-" + this._uid;  
        return this.uniqueId;
      }
      return this.uniqueId;
    },
  },
  components: {dashboardPdf, mediaPdf, campaignPdf, periodPdf, keywordPdf, adPdf, shoppingPdf},
  methods: {
    onChildReady() { this.childReady = true; },       
    async generatePDF() {
      const element = this.$refs.pdfReportContent;
      const worker = html2pdf()
        .set({
          margin: 0,
          filename: `dashboard_report_${moment().format("YYYYMMDDHHmmss")}.pdf`,
          pagebreak: {mode: ['avoid-all', 'css', 'legacy'], before: '.pdf-page-break'},
          image: {type: 'jpeg', quality: 0.98},
          html2canvas: {scrollY: 0, scale: 2, letterRendering: true, allowTaint: false, useCORS: true},
          jsPDF: {orientation: 'landscape', unit: 'mm', format: [420, 297]}
        }).from(element).toPdf();

        const pdf = await worker.get('pdf');         // jsPDF 인스턴스
        const blob = pdf.output('blob');             // Blob 객체로 추출
        this.$emit("finishDownload", {id: this.id, pdfdate: moment().format()});
        return blob;        
    },   
    async initPDF({ report }) {
      this.activeBtn = report.activeBtn;
      this.activeMedia = report.activeMedia;
      this.activePage = report.activePage; 
      this.draggable = report.draggable;
      this.dropdownMenu = report.dropdownMenu;
      this.report = report.reportInfo;
      this.id = report.id;      
      var dateRange = {date: { start: this.report.start, end: this.report.end }, cdate: { start: this.report.cstart, end: this.report.cend }};
      //console.log(this.activeBtn, this.activeMedia, this.activePage, this.draggable, this.dropdownMenu, this.report);
      await this.$refs.dashboardPdf.initPDF(dateRange);
      await this.$refs.mediaPdf.initPDF(dateRange);

      // 매체사별 컴포넌트 호출 (체이닝 없이 순차 await)
      for (var media of this.filteredMediaList) {
        var key = media.mediaKey;
        if (this.activeMedia && !this.activeMedia[key]) continue;

        // campaignPdf
        var campaignRef = this.$refs[`campaignPdf-${key}`];
        var campaignInstance = Array.isArray(campaignRef) ? campaignRef[0] : campaignRef;
        if (campaignInstance && campaignInstance.initPDF) {
          await campaignInstance.initPDF({ ...dateRange, media: key });
        }

        // periodPdf
        var periodRef = this.$refs[`periodPdf-${key}`];
        var periodInstance = Array.isArray(periodRef) ? periodRef[0] : periodRef;
        if (periodInstance && periodInstance.initPDF) {
          await periodInstance.initPDF({ ...dateRange, media: key });
        }

        // keywordPdf
        var keywordRef = this.$refs[`keywordPdf-${key}`];
        var keywordInstance = Array.isArray(keywordRef) ? keywordRef[0] : keywordRef;
        if (keywordInstance && keywordInstance.initPDF) {

          if(['naver', 'kakaosa', 'google'].includes(key)) {
            await keywordInstance.initPDF({ ...dateRange, media: key });
          }          
        }

        // adPdf
        var adRef = this.$refs[`adPdf-${key}`];
        var adInstance = Array.isArray(adRef) ? adRef[0] : adRef;
        if (adInstance && adInstance.initPDF) {
          await adInstance.initPDF({ ...dateRange, media: key, type: {naver:'search', kakaosa:'search', kakaomo:'banner', naverda:'banner', google:'banner'}[key] });
        }

        // shoppingPdf
        var shoppingRef = this.$refs[`shoppingPdf-${key}`];
        var shoppingInstance = Array.isArray(shoppingRef) ? shoppingRef[0] : shoppingRef;
        if (shoppingInstance && shoppingInstance.initPDF) {
          if(['naver'].includes(key)) {
            await shoppingInstance.initPDF({ ...dateRange, media: key });
          }          
        }
      }
      await this.$nextTick(); // 전체 페이지 렌더링 기다림
    },    
    async initPDFOld({ report }) {
      this.activeBtn = report.activeBtn;
      this.activeMedia = report.activeMedia;
      this.activePage = report.activePage; 
      this.draggable = report.draggable;
      this.dropdownMenu = report.dropdownMenu;
      this.report = report.reportInfo;
      this.id = report.id;      
      // console.log(this.activeBtn, this.activeMedia, this.activePage, this.draggable, this.dropdownMenu, this.report);
      var media = '';
      for (var [m, v] of Object.entries(this.activeMedia)) {
        media = v === true ? m : 'naver';
        break; // 첫 번째 요소만 처리하고 종료
      }

      await this.$refs.dashboardPdf.initPDF({date: {start: this.report.start, end: this.report.end}, cdate: {start: this.report.cstart, end: this.report.cend}});
      await this.$refs.mediaPdf.initPDF({date: {start: this.report.start, end: this.report.end}, cdate: {start: this.report.cstart, end: this.report.cend}});
      for (const media of this.filteredMediaList) {
        var key = media.mediaKey;
        var ref = this.$refs[`campaignPdf-${key}`];
       
        if (!this.activeMedia[key]) continue; // false면 건너뜀

        var instance = Array.isArray(ref) ? ref[0] : ref;

        if (instance && typeof instance.initPDF === 'function') {
          await instance.initPDF({
            date: { start: report.reportInfo.start, end: report.reportInfo.end },
            cdate: { start: report.reportInfo.cstart, end: report.reportInfo.cend },
            media: key
          });
        }
      }
      // await this.$refs.campaignPdf.initPDF({date: {start: this.report.start, end: this.report.end}, cdate: {start: this.report.cstart, end: this.report.cend}, media: media});
      await this.$refs.periodPdf.initPDF({date: {start: this.report.start, end: this.report.end}, cdate: {start: this.report.cstart, end: this.report.cend}, media: media});
      await this.$refs.keywordPdf.initPDF({date: {start: this.report.start, end: this.report.end}, cdate: {start: this.report.cstart, end: this.report.cend}, media: media});
      await this.$refs.adPdf.initPDF({date: {start: this.report.start, end: this.report.end}, cdate: {start: this.report.cstart, end: this.report.cend}, media: media, type: 'search'});
      await this.$refs.shoppingPdf.initPDF({date: {start: this.report.start, end: this.report.end}, cdate: {start: this.report.cstart, end: this.report.cend}});
      await this.$nextTick(); // 전체 페이지 렌더링 기다림
    },
    shouldShowKeywordPdf(mediaKey) { return !['kakaomo', 'naverda'].includes(mediaKey); },
    shouldShowShoppingPdf(mediaKey) { return ['naver'].includes(mediaKey) },
    shouldShow(pageType, mediaKey = null) {
      if(!this.activePage || !this.activePage[pageType]) return false;
      if (pageType === 'keywordAnalysis' && ['kakaomo', 'naverda'].includes(mediaKey)) { return false; } // keywordAnalysis 예외: 'kakaomo', 'naverda' 제외
      if (pageType === 'shoppingAnalysis' && mediaKey !== 'naver') { return false; } // shoppingAnalysis 예외: 'naver'만 허용
      return true;
    },
    getUuidv4() { return uuidv4(); },
  },
};
</script>

<style></style>
