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
      var report2 = $.ajax({
        type: "get", //요청 메소드 방식
        url: API_URL + "/app/dashboard/summarymedia",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: { userid: store.state.userStore.userinfo.userid, fromdate: o.fromdate, todate: o.todate, session: store.state.userStore.session },        
        success: function (data) {},
      });

      var report3 = $.ajax({
        type: "get", //요청 메소드 방식
        url: API_URL + "/app/dashboard/period",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: { userid: store.state.userStore.userinfo.userid, fromdate: o.fromdate, todate: o.todate, session: store.state.userStore.session },        
        success: function (data) {},
      });

      var report4 = $.ajax({
        type: "get", //요청 메소드 방식
        url: API_URL + "/app/dashboard/period",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: { userid: store.state.userStore.userinfo.userid, fromdate: moment().startOf('year').format('YYYY-MM-DD'), todate: o.todate, session: store.state.userStore.session },        
        success: function (data) {},
      });     
      
      $.when(report2, report3, report4).done(function(report2, report3, report4) {
        setTimeout(function() {
          vm.exportExcel(report2[0].data, report3[0].data, report4[0].data, {fromdate: o.fromdate, todate: o.todate, comparefromdate: o.comparefromdate, comparetodate: o.comparetodate});
        }, 1000);
      }).then(function(e) { vm.$emit('hideMask'); });      
    },
    async exportExcel(report2, report3, report4, date) {
      try { 
        var response = await fetch('/dashboard_template.xlsx');
        var arrayBuffer = await response.arrayBuffer();
        var workbook = await XlsxPopulate.fromDataAsync(arrayBuffer);
        var sheet = workbook.sheet(0);
        const dateObj = new Date(date.fromdate);
        const year = dateObj.getFullYear();
        const month = dateObj.getMonth() + 1;
        const daysInMonth = new Date(year, month, 0).getDate();        
        var rawRerport2 = this.getRawReport2(report2, date); /* 매체별 광고요약 */
        var rawRerport3 = this.getRawReport3(report3, date); /* 일자별 광고요약 */
        var rawRerport4 = this.getRawReport4(report4, date); /* 월별 광고요약 */
        var rawRerport5 = []; /* 전월대비 광고요약 */       
        
        if(rawRerport4.length) {
          rawRerport5 = dateObj.getMonth() == 0 ? [rawRerport4[dateObj.getMonth()].slice()] : [rawRerport4[dateObj.getMonth() - 1].slice()];
        }
        sheet.cell('C7').value(`${date.fromdate} ~ ${date.todate}`);
        sheet.cell('I7').value(`담당자SEM : ${(store.state.userStore.userinfo.username) || store.state.userStore.managerinfo.username}`);        
        sheet.cell('C15').value(rawRerport2);
        sheet.cell('C36').value(rawRerport3);
        sheet.cell('C71').value(rawRerport4);
        sheet.cell('K15').value([[`${month}월`, daysInMonth]]);
        sheet.cell('K16').value(rawRerport5);        
        sheet.range("G15:G18").style("horizontalAlignment", "right");
        sheet.range("G35:G66").style("horizontalAlignment", "right");
        sheet.range("G70:G82").style("horizontalAlignment", "right");
        sheet.range("M16:Q16").style("horizontalAlignment", "right");
        var blob = await workbook.outputAsync();
        saveAs(blob, `dashboard_report_${moment().format("YYYYMMDDHHmmss")}.xlsx`);
      } catch(e) {
        console.error(e);
      }      
    },
    getRawReport2(report2, date) {
      const mapping = { N: "NAVER", D: "KAKAO", Nda: "GFA", google: "GOOGLE" };
      const typeMap = { N: "SA", D: "SA", Nda: "GFA", google: "SA" };

      const rawsReport2 = Object.entries(report2).filter(([media]) => media !== 'TOTAL' && media !== 'K').map(([media, item]) => {
        if(media !== 'TOTAL' && media !== 'K') {
          const m = mapping[media] || media;
          const type = typeMap[media] || "";

          return [
            m, // 구분
            type, // 요일
            parseInt(item.im, 10) || 0, // 노출수
            parseInt(item.clk, 10) || 0, // 클릭수
            item.ctr ? `${item.ctr}%` : "0.00%", // 클릭률
            Math.ceil(parseFloat(item.cpc.toString().replace(/,/g, ""))) || 0, // 평균 CPC
            Math.ceil(parseFloat(item.cst.toString().replace(/,/g, ""))) || 0  // 총 광고비
          ];
        }
      })
      return rawsReport2;
    },
    getRawReport3(report3, date) {
      const dayKor = ["일", "월", "화", "수", "목", "금", "토"];
      const rawsReport3 = Object.entries(report3).map(([date, item]) => {
        const dateObj = new Date(date);
        const month = dateObj.getMonth() + 1;
        const day = dateObj.getDate();
        const dayName = dayKor[dateObj.getDay()]; // 요일명

        return [
          `${month}/${day}`, // 구분
          dayName, // 요일
          parseInt(item.im, 10) || 0, // 노출수
          parseInt(item.clk, 10) || 0, // 클릭수
          item.ctr ? `${item.ctr}%` : "0.00%", // 클릭률
          Math.ceil(parseFloat(item.cpc.toString().replace(/,/g, ""))) || 0, // 평균 CPC
          Math.ceil(parseFloat(item.cst.toString().replace(/,/g, ""))) || 0  // 총 광고비
        ];
      });
      return rawsReport3;
    },
    getRawReport4Old(report4, date) {
      const daysInMonth = { "2025-01": 31, "2025-02": 28, "2025-03": 31, "2025-04": 30, "2025-05": 31, "2025-06": 30, "2025-07": 31, "2025-08": 31, "2025-09": 30, "2025-10": 31, 
      "2025-11": 30, "2025-12": 31 };    
      const months = Object.keys(daysInMonth);
      const rawsReport4 = months.map((month) => {
        let totalIm = 0;
        let totalClk = 0;
        let totalCost = 0;

        for (const media in report4) {
          const monthData = report4[media][month];
          if (monthData) {
            totalIm += monthData.im || 0;
            totalClk += monthData.clk || 0;
            totalCost += monthData.cost || 0;
          }
        }

        const ctr = totalIm ? (totalClk / totalIm) * 100 : 0;
        const avgCpc = totalClk ? totalCost / totalClk : 0;

        return {
          month,
          days: daysInMonth[month],
          im: totalIm,
          clk: totalClk,
          ctr: Number(ctr.toFixed(2)),
          avgCpc: Math.round(avgCpc),
          cost: totalCost,
        };
      });
      return rawsReport4;  
    },
    getRawReport4(report4, date) {
      const rawData = report4;
      const toNumber = (val) => parseFloat((val + "").replace(/,/g, ""));
      const monthlyStats = {};

      Object.entries(rawData).forEach(([dateStr, data]) => {
        const month = dateStr.slice(0, 7); // 'YYYY-MM'

        if (!monthlyStats[month]) {
          monthlyStats[month] = { im: 0, clk: 0, cst: 0, cstd: 0, cv: 0, cr: 0, ctrList: [], cpcList: [], cpaList: [], cvrList: [], roasList: [], dayCount: 0 };
        }

        const stats = monthlyStats[month];

        stats.im += data.im;
        stats.clk += data.clk;
        stats.cst += toNumber(data.cst);
        stats.cstd += data.cstd;
        stats.cv += toNumber(data.cv);
        stats.cr += toNumber(data.cr);

        stats.ctrList.push(toNumber(data.ctr));
        stats.cpcList.push(toNumber(data.cpc));
        stats.cpaList.push(toNumber(data.cpa));
        stats.cvrList.push(toNumber(data.cvr));
        stats.roasList.push(toNumber(data.roas));
        stats.dayCount++;
      });
      
      const avg = (arr) => arr.length ? Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 100) / 100 : 0; // 평균 구하기 함수

      // 월별 요약 배열
      const result = Object.entries(monthlyStats).map(([month, stats]) => ({
        month,
        days: stats.dayCount,
        im: stats.im,
        clk: stats.clk,
        cst: stats.cst,
        cstd: stats.cstd,
        cv: Math.round(stats.cv * 100) / 100,
        cr: Math.round(stats.cr * 100) / 100,
        ctr: avg(stats.ctrList),
        cpc: avg(stats.cpcList),
        cpa: avg(stats.cpaList),
        cvr: avg(stats.cvrList),
        roas: avg(stats.roasList),
      }));     

      //최종 월별 요약 배열
      const rawReport4 = result.map((item) => {
        const dateObj = new Date(item.month);
        const month = dateObj.getMonth() + 1;
        return [
          `${month}월`, // 구분
          item.days, // 요일
          parseInt(item.im, 10) || 0, // 노출수
          parseInt(item.clk, 10) || 0, // 클릭수
          item.ctr ? `${item.ctr}%` : "0.00%", // 클릭률
          Math.ceil(parseFloat(item.cpc.toString().replace(/,/g, ""))) || 0, // 평균 CPC
          Math.ceil(parseFloat(item.cst.toString().replace(/,/g, ""))) || 0  // 총 광고비
        ];
      })
      return rawReport4;
    }

  },
};
</script>

<style></style>
