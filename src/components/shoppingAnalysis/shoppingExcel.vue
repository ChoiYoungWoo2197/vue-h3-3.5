<template>
  <div :class="getUniqueId">
  </div>
</template>

<script>
import $ from "jquery";
import moment from "moment";
import XlsxPopulate from 'xlsx-populate/browser/xlsx-populate.min.js';
import { saveAs } from "file-saver";
import {  isMobile,  priceToString,  getMedia,  uuidv4,  getUnit, getType,  getKpiName} from "@/assets/js/common.js";
import { store } from "@/store/store.js";
import { SHA256 } from "@/assets/js/sha256.js";
import { API_URL, TEMP_KEY } from "@/configs/config.js";
export default {
  props: {},
  data() {
    return {
      uniqueId: null,
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
    clickExcel(o) {
      var vm = this;
      var report = $.ajax({
        type: "get", //요청 메소드 방식
        url: API_URL + "/app/shopping/shoppingreport",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: { userid: store.state.userStore.userinfo.userid, fromdate: o.fromdate, todate: o.todate, comparefromdate: o.comparefromdate, comparetodate: o.comparetodate,              
          md: o.md, start: 0, sort: o.sort, display: 100, totalcount: "", kpi: "", session: store.state.userStore.session,
        },        
        success: function (data) {},
      });

      var im = $.ajax({
        type: "get", //요청 메소드 방식
        url: API_URL + "/app/shopping/shoppingreport",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: { userid: store.state.userStore.userinfo.userid, fromdate: o.fromdate, todate: o.todate, comparefromdate: o.comparefromdate, comparetodate: o.comparetodate,
          md: o.md, start: 0, sort: 'imd', display: 100, totalcount: "", kpi: "im", session: store.state.userStore.session,
        },        
        success: function (data) {},
      });

      var clk = $.ajax({
        type: "get", //요청 메소드 방식
        url: API_URL + "/app/shopping/shoppingreport",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: { userid: store.state.userStore.userinfo.userid, fromdate: o.fromdate, todate: o.todate, comparefromdate: o.comparefromdate, comparetodate: o.comparetodate,              
          md: o.md, start: 0, sort: 'clkd', display: 100, totalcount: "", kpi: "clk", session: store.state.userStore.session,
        },        
        success: function (data) {},
      });   
      
      var cpc = $.ajax({
        type: "get", //요청 메소드 방식
        url: API_URL + "/app/shopping/shoppingreport",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: { userid: store.state.userStore.userinfo.userid, fromdate: o.fromdate, todate: o.todate, comparefromdate: o.comparefromdate, comparetodate: o.comparetodate,              
          md: o.md, start: 0, sort: 'cpcd', display: 100, totalcount: "", kpi: "cpc", session: store.state.userStore.session,
        },        
        success: function (data) {},
      });       

      var cst = $.ajax({
        type: "get", //요청 메소드 방식
        url: API_URL + "/app/shopping/shoppingreport",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: { userid: store.state.userStore.userinfo.userid, fromdate: o.fromdate, todate: o.todate, comparefromdate: o.comparefromdate, comparetodate: o.comparetodate,              
          md: o.md, start: 0, sort: 'cstd', display: 100, totalcount: "", kpi: "cst", session: store.state.userStore.session,
        },        
        success: function (data) {},
      });       

      $.when(report, im, clk, cpc, cst).done(function(report, im, clk, cpc, cst) {
        setTimeout(function() {
          vm.exportExcel(o.md, report[0].data.ads, im[0].data.topads, clk[0].data.topads, cpc[0].data.topads, cst[0].data.topads);
        }, 1000);        
      }).then(function(e) { vm.$emit('hideMask'); });
    },
    async exportExcel(media, report, im, clk, cpc, cst) {
      try {
        var response = await fetch('/shopping_template.xlsx');
        var arrayBuffer = await response.arrayBuffer();
        var workbook = await XlsxPopulate.fromDataAsync(arrayBuffer);
        var sheet = workbook.sheet(0);
        //var sheetNameMap = { N: "NAVER 키워드", D: "KAKAO 키워드", google: "GOOGLE 키워드" };
        //sheet.name(sheetNameMap[media] || "Keyword Report");

        var rawsReport = report.map(item => {
          return [
            (`${item.campaign_name} / ${item.adgroup_name}`) || "-",     // GROUP
            item.ad_pname || item.ad_productname,      // KEYWORD
            parseInt(item.im) || 0,                  // 노출수 (impressions)
            parseInt(item.clk) || 0,                 // 클릭수 (clicks)
            item.ctr ? `${item.ctr}%` : "0.00%", // 클릭율 (CTR, already string)
            Math.ceil(parseFloat(item.cpc.replace(/,/g,""))) || "0", // 평균CPC (avg cost per click)
            Math.ceil(parseFloat(item.cst)) || "0"                  // 총광고비 (cost)
          ];
        });
        var rawsIm = im['im'].map(item => { return [ item.keyword_name || "-", parseInt(item.im) || 0 ]; });    
        var rawsClk = clk['clk'].map(item => { return [ item.keyword_name || "-", parseInt(item.clk) || 0 ]; });  
        var rawsCpc = cpc['cpc'].map(item => { return [ item.keyword_name || "-", Math.ceil(parseFloat(item.cpc.replace(/,/g,""))) || 0 ]; });  
        var rawCst = cst['cst'].map(item => { return [ item.keyword_name || "-", Math.ceil(parseFloat(item.cst)) || 0 ]; });                     
            
        sheet.cell('B2').value({N: "▣ NAVER KEYWORD DATA", D: "▣ KAKAO KEYWORD DATA", google: "▣ GOOGLE KEYWORD DATA"}[media]); //타이틀
        sheet.cell('B6').value(rawsReport);
        sheet.cell('K6').value(rawsIm);
        sheet.cell('K19').value(rawsClk);
        sheet.cell('K32').value(rawsCpc);
        sheet.cell('K45').value(rawCst);
        sheet.range("F1:F1000").style("horizontalAlignment", "right");
        sheet.range("G1:F1000").style("horizontalAlignment", "right");
        sheet.range("H1:F1000").style("horizontalAlignment", "right");

        var blob = await workbook.outputAsync();
        saveAs(blob, `shopping_report_${moment().format("YYYYMMDDHHmmss")}.xlsx`);
      } catch(e) {
        console.error(e);
      }      
    }
  },
};
</script>

<style></style>
