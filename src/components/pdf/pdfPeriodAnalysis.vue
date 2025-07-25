<template>
  <article :id="getUniqueId" class="pdf-container">
    <div ref="pdfArea" class="main" :key="pdfKey">
      <div class="pdf-a4-l pdf-section-1">
        <section class="d-flex justify-content-between pdf-card pdf-card-1">
          <div class="title mb-0">
            <h2>HEEIL<br />REPORT</h2>
            <div class="b-l"></div>
          </div>
          <div class="logo"> <img src="@/assets/image/pdf_main_logo.png" height="35" /> </div>
        </section>
        <section class="d-flex justify-content-between pdf-card pdf-card-2">
          <div class="adv">
            <template v-if="adv !== null">
              <h3 class="bold"> {{ adv.usercompany }} <span>{{ " | " + fromdate + " ~ " + todate + "" }}</span> </h3>
            </template>
          </div>
        </section>
        <section class="d-flex justify-content-between pdf-card pdf-card-3">
          <div class="footer b-p">
            <template v-if="managerinfo">
              <h3 class="pl-3"> {{ managerinfo !== null ? managerinfo.username : "" }} <span>마케터</span> </h3>
              <ul class="pl-3">
                <li> 휴대전화 <span>{{ managerinfo !== null ? managerinfo.userphone : "" }}</span> </li>
                <li> 이메일 <span>{{ managerinfo !== null ? managerinfo.useremail : "" }}</span> </li>
              </ul>
            </template>
            <template v-else>
              <h3 class="pl-3"> {{ adv ? adv.usercompany : "" }} <span></span> </h3>
              <ul class="pl-3">
                <li> 휴대전화 <span>{{ adv ? adv.userphone : "" }}</span> </li>
                <li> 이메일 <span>{{ adv ? adv.useremail : "" }}</span> </li>
              </ul>
            </template>
          </div>
        </section>
      </div>
      <div v-for="index in pdf[activeBtn.periodUnit].end" :key="index" class="pdf-a4-l pdf-section-period" >
        <section class="d-flex pdf-card pdf-card-1">
          <div class="sub-title"> <h2>{{ getTitle + " 리포트" }}</h2> </div>
          <div class="d-flex justify-content-between">
            <div class="b-l"></div>
            <div>{{ fromdate + " ~ " + todate + "" }}</div>
          </div>
        </section>
        <section class="d-flex pdf-card pdf-card-2">
          <div v-if="index === 1">
            <div class="grap d-flex justify-content-center">
              <line-period-graph
                class="grap graph"
                ref="linePeriodGraph"
                :pHeight="'350px'"
                :pLegend="activeKpi"
                :pPeriodUnit="activeBtn.periodUnit"
                :pCustom="{
                  series: { textStyle: { fontSize: '12', fontWeight: 'bold' } },
                  xAxis: { name: '', axisLabel: { fontSize: '12' } },
                  yAxis: { name: '', axisLabel: { fontSize: '12' } },
                  grid: { left: 'center', right: 'auto', bottom: '30%', width: '90%', containLabel: true, },
                  legend: { show: true, left: 'center', top: '75%', orient: 'horizontal', },
                }"
                style="display: block"
                @finishedLinePeriodGraph="handleFinishedLinePeriodGraph"
              >
              </line-period-graph>
            </div>
          </div>
          <div class="report">
            <table class="report">
              <thead>
                <tr>
                  <td width="20%" class="text-center" v-if="activeBtn.hour === true"> 시간별 </td>
                  <td width="20%" class="text-center" v-if="activeBtn.dayweek === true"> 요일별 </td>
                  <td width="20%" class="text-center" v-if="activeBtn.day === true"> 일별 </td>
                  <td width="20%" class="text-center" v-if="activeBtn.week === true"> 주차별 </td>
                  <td width="20%" class="text-center" v-if="activeBtn.month === true"> 월별 </td>
                  <template v-for="(k,i) in ['im','clk','ctr','cpc','cst','cv','cr','cpa','cvr','roas']">
                    <td :key="i+getUuidv4()" v-if="kpi[k].check" class="text-center">{{getKpiName(k)}}</td>
                  </template>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(data, index2) in getDatasForPeriod(index)" :key="index2" :data-toggle="activeBtn.dayweek === true ? 'tooltip' : ''" :data-placement="activeBtn.dayweek === true ? 'right' : ''" :title="activeBtn.dayweek === true ? dayWeekToString(data.dayweek) : ''" >
                  <td class="text-left" v-if="activeBtn.hour === true" v-text="data.time + '시'" ></td>
                  <td class="text-left" v-else v-text="data.time"></td>
                  <template v-for="(k,i) in ['im','clk','ctr','cpc','cst','cv','cr','cpa','cvr','roas']">
                    <td :key="i+getUuidv4()" v-if="kpi[k].check" class="text-right">{{priceToString(data[k])+getUnit(k)}}</td>
                  </template>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        <section class="d-flex pdf-card pdf-card-3 justify-content-end">
          <div class="footer">
            <div class="d-flex justify-content-between">
              <img alt="" src="@/assets/image/pdf_logo.png" height="35" />
              <div>{{ "1" }}</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </article>
</template>

<script>
import $ from "jquery";
import moment from "moment";
import * as echarts from "echarts";
import {  clearBody,  addClassDashboard,  priceToString,  getMedia,  getApp,  sortWeekDay,  getUnit,  getKpiName,  uuidv4 } from "@/assets/js/common.js";
import { store } from "@/store/store.js";
import { SHA256 } from "@/assets/js/sha256.js";
import { API_URL, TEMP_KEY, MEDIA_ANALYSIS_SORT } from "@/configs/config.js";
import linePeriodGraph from "@/components/graph/linePeriodGraph.vue";
import "@/assets/css/pdf.main.css";

export default {
  props: {
    pFromdate: String,
    pTodate: String,
    pKpi: Object,
    pActiveKpi: Object,
    pActiveBtn: Object,
    pActiveMedia: Object,
    pActiveWeekSet: Array,
  },
  data() {
    return {
      uniqueId: null,
      pdfKey: 0,
      adv: null,
      managerinfo: null,
      activeWeekSet: [],
      name: null,
      fromdate: null,
      todate: null,
      kpi: {
        clk: { visible: true, check: true }, //클릭수
        im: { visible: true, check: true }, //노출수
        cst: { visible: false, check: true }, //광고비
        cv: { visible: true, check: true }, //전환수
        cr: { visible: false, check: true }, //전환매출
        ctr: { visible: true, check: true }, //클릭률
        cpc: { visible: true, check: true }, //클릭 당 비용
        cpa: { visible: true, check: true }, //전환 당 비용
        cvr: { visible: false, check: true }, //전환율
        roas: { visible: true, check: true }, //ROAS
      },
      activeKpi: null,
      activeMedia: null,
      activeBtn: { hour: false, dayweek: false, day: false, week: true, month: false, period: "", periodUnit: "week", },
      datas: [],
      responseData: null,
      pdf: { hour: { d: 20, start: 0, end: 0, spare: 20 }, dayweek: { d: 7, start: 0, end: 0, spare: 0 }, day: { d: 30, start: 0, end: 0, spare: 20 }, week: { d: 30, start: 0, end: 0, spare: 20 }, month: { d: 30, start: 0, end: 0, spare: 0 }, },
    };
  },
  watch: {
    pFromdate() { this.fromdate = this.pFromdate; },
    pTodate() { this.todate = this.pTodate; },
    pKpi() { this.kpi = this.pKpi; },
    pActiveKpi() { this.activeKpi = this.pActiveKpi; },
    pActiveBtn() { this.activeBtn = this.pActiveBtn; },
    pActiveMedia() { this.activeMedia = this.pActiveMedia; },
    pActiveWeekSet: {
      deep: true,
      handler(value) {
        // console.log(value);
        this.activeWeekSet = this.copyObject(value);
      },
    },
  },
  computed: {
    getUniqueId() {
      if (!this.uniqueId) {
        this.uniqueId = "vm-" + this._uid;
        return this.uniqueId;
      }
      return this.uniqueId;
    },
    getDatas() { return this.datas; },
    getTableClass() {
      var tableClass = "";
      if (this.activeBtn.hour) { tableClass = "timetable"; } 
      else if (this.activeBtn.dayweek) { tableClass = "dow"; } 
      else if (this.activeBtn.day) { tableClass = ""; } 
      else if (this.activeBtn.month) { tableClass = ""; }
      return tableClass;
    },
    getTitle() {
      var title = "";
      if (this.activeBtn.periodUnit === "hour") title = "시간별";
      if (this.activeBtn.periodUnit === "dayweek") title = "요일별";
      if (this.activeBtn.periodUnit === "day") title = "일별";
      if (this.activeBtn.periodUnit === "month") title = "월별";
      return title;
    },
  },
  components: { linePeriodGraph, },
  mounted() {
    if (store.state.userStore.userinfo) {
      (this.name = store.state.userStore.userinfo.username),
        (this.fromdate = this.pFromdate);
      this.todate = this.pTodate;
      // this.kpi = this.pKpi;
      this.activeWeekSet = this.copyObject(this.pActiveWeekSet);
      this.activeKpi = this.pActiveKpi;
      this.activeBtn = this.pActiveBtn;
      this.activeMedia = this.pActiveMedia;
      this.adv = store.state.userStore.userinfo;
      this.managerinfo = store.state.userStore.managerinfo;
    }
  },
  updated() {},
  methods: {
    copyObject(object) { return JSON.parse(JSON.stringify(object)); },
    getDatasForPeriod(index) {
      var vm = this;
      var arr = [];
      var start = (index - 1) * vm.pdf[vm.activeBtn.periodUnit].d;
      var count = vm.pdf[vm.activeBtn.periodUnit].d;
      var spare = vm.pdf[vm.activeBtn.periodUnit].spare;

      if (index === 1 && vm.activeBtn.periodUnit === "day") { count = spare; } 
      else if (index > 1 && vm.activeBtn.periodUnit === "day") {
        start = index - 2 > 0 ? vm.pdf[vm.activeBtn.periodUnit].spare + vm.pdf[vm.activeBtn.periodUnit].d * (index - 2) : vm.pdf[vm.activeBtn.periodUnit].spare;
      }

      for (let i = 0; i < count; i++) {
        if (!vm.datas) continue;
        if (!vm.datas.at(start + i)) continue;
        arr.push(vm.datas.at(start + i));
      }
      return arr;
    },
    clickSearchBtn() { this.findPeriodReport(); },
    htmlToPDF() { this.clickSearchBtn(); },
    priceToString(salse) {
      if (salse === undefined) return "";
      return priceToString(salse);
    },
    dayWeekToString(datas) {
      var dayweek = "";
      if (datas === undefined) return "";

      for (var i = 0; i < datas.length; i++) {
        dayweek += datas[i];
        if (datas.length - 1 !== i) dayweek += ", ";
      }

      return dayweek;
    },
    getSum(arr) {
      var result = arr.reduce(function add(sum, currValue) { return parseFloat(sum) + parseFloat(currValue); }, 0);
      return result;
    },
    sortHour(data, fromDate, toDate) {
      var vm = this;
      var sorted = {
        media: { kakaomo: {}, kakaosa: {}, naver: {}, naverda: {}, google: {} },
        total: { summary: {}, },
      };

      ["total", "kakaomo", "kakaosa", "naver", "naverda", "google"].forEach(function ( currentMedia, index ) {
        for (var j = 0; j <= 23; j++) {
          var clk = []; //클릭수
          var im = []; //노출수
          var cst = []; //광고비
          var cv = []; //전환수
          var cr = []; //전환매출
          var ctr = []; //클릭률
          var cpc = []; //클릭 당 비용
          var cpa = []; //전환 당 비용
          var cvr = []; //전환율
          var roas = []; //ROAS
          var newObject = new Object();
          var hour = j < 10 ? "0" + j : j;

          var diff = moment(toDate).diff(fromDate, "days");

          for (var i = 0; i <= diff; i++) {
            var currentDay = moment(fromDate).add(i, "days").format("YYYY-MM-DD");
            var obj = currentMedia === "total" ? data["total"]["summary"][currentDay] : data["media"][currentMedia][currentDay];
            if (!obj || obj.length === 0) {
              clk.push(0);
              im.push(0);
              cst.push(0);
              cv.push(0);
              cr.push(0);
              ctr.push(0);
              cpc.push(0);
              cpa.push(0);
              cvr.push(0);
              roas.push(0);
              continue;
            }

            clk.push(obj[hour]["clk"]);
            im.push(obj[hour]["im"]);
            cst.push(obj[hour]["cst"]);
            cv.push(obj[hour]["cv"]);
            cr.push(obj[hour]["cr"]);
            obj[hour]["ctr"] === undefined ? ctr.push(0) : isNaN(obj[hour]["ctr"]) ? ctr.push(obj[hour]["ctr"].replace(",", "")) : ctr.push(obj[hour]["ctr"]);
            obj[hour]["cpc"] === undefined ? cpc.push(0) : isNaN(obj[hour]["cpc"]) ? cpc.push(obj[hour]["cpc"].replace(",", "")) : cpc.push(obj[hour]["cpc"]);
            obj[hour]["cpa"] === undefined ? cpa.push(0) : isNaN(obj[hour]["cpa"]) ? cpa.push(obj[hour]["cpa"].replace(",", "")) : cpa.push(obj[hour]["cpa"]);
            obj[hour]["cvr"] === undefined ? cvr.push(0) : isNaN(obj[hour]["cvr"]) ? cvr.push(obj[hour]["cvr"].replace(",", "")) : cvr.push(obj[hour]["cvr"]);
            obj[hour]["roas"] === undefined ? roas.push(0) : isNaN(obj[hour]["roas"]) ? roas.push(obj[hour]["roas"].replace(",", "")) : roas.push(obj[hour]["roas"]);
          }

          newObject["clk"] = vm.getSum(clk);
          newObject["im"] = vm.getSum(im);
          newObject["cst"] = vm.getSum(cst);
          newObject["cv"] = vm.getSum(cv);
          newObject["cr"] = vm.getSum(cr);
          newObject["ctr"] = vm.getSum(ctr) > 0 && vm.getSum(im) > 0 ? ((vm.getSum(clk) / vm.getSum(im)) * 100).toFixed(2) : 0;
          newObject["cpc"] = vm.getSum(cst) > 0 && vm.getSum(clk) > 0 ? (vm.getSum(cst) / vm.getSum(clk)).toFixed(0) : 0;
          newObject["cpa"] = vm.getSum(cst) > 0 && vm.getSum(cv) > 0 ? (vm.getSum(cst) / vm.getSum(cv)).toFixed(0) : 0;
          newObject["cvr"] = vm.getSum(cv) > 0 && vm.getSum(clk) > 0 ? ((vm.getSum(cv) / vm.getSum(clk)) * 100).toFixed(2) : 0;
          newObject["roas"] = vm.getSum(cr) > 0 && vm.getSum(cst) > 0 ? ((vm.getSum(cr) / vm.getSum(cst)) * 100).toFixed(0) : 0;
          currentMedia === "total" ? (sorted["total"][hour] = newObject) : (sorted["media"][currentMedia][hour] = newObject);
        }
      });

      return sorted;
    },
    getTotal(data, type, media) {
      var vm = this;
      vm.datas = [];
      var keysTotal = [];
      var periodUnit = vm.activeBtn.periodUnit;
      var dayweek = {
        1: { name: "월요일", datas: [] },
        2: { name: "화요일", datas: [] },
        3: { name: "수요일", datas: [] },
        4: { name: "목요일", datas: [] },
        5: { name: "금요일", datas: [] },
        6: { name: "토요일", datas: [] },
        7: { name: "일요일", datas: [] },
      };
      let week = { clk: 0, im: 0, cst: 0, cv: 0, cr: 0, ctr: 0, cpc: 0, cpa: 0, cvr: 0, roas: 0, };
      let weekSet = { start: "", end: "", c: -1, d: 0, };
      let weekNumber = 0;

      //total
      keysTotal = media === "total" ? Object.keys(data[type]) : Object.keys(data[type][media]);
      keysTotal.sort();

      if (periodUnit === "dayweek") {
        var fromdate = vm.fromdate;
        var todate = vm.todate;
        var diff = moment(todate).diff(moment(fromdate), "days");

        for (var i = 0; i <= diff; i++) {
          var day = moment(fromdate).add(i, "days");
          var isoWeekday = day.isoWeekday();
          var format = day.format("YYYY-MM-DD");
          dayweek[isoWeekday]["datas"].push(format);
        }
      }

      if (periodUnit === "week") {
        weekSet.start = vm.activeWeekSet[weekNumber].start;
        weekSet.end = vm.activeWeekSet[weekNumber].end;
        weekSet.d = moment(vm.activeWeekSet[weekNumber].end).diff( moment(vm.activeWeekSet[weekNumber].start), "days" );
      }

      for (let i = 0; i < keysTotal.length; i++) {
        var obj = "";
        obj = media === "total" ? data[type][keysTotal[i]] : data[type][media][keysTotal[i]];

        if (!obj || obj.length === 0 || keysTotal[i] === "summary") continue;
        if (periodUnit === "hour") obj["time"] = i < 10 ? "0" + i : i;
        if (periodUnit === "dayweek") {
          obj["time"] = dayweek[i + 1]["name"];
          obj["dayweek"] = dayweek[i + 1]["datas"];
        }

        if (periodUnit === "week") {
          weekSet.c += 1;
          week.clk += parseFloat(obj.clk);
          week.im += parseFloat(obj.im);
          week.cst += parseFloat(obj.cst);
          week.cv += parseFloat(obj.cv);
          week.cr += parseFloat(obj.cr);

          // console.log(i, obj);
          if (weekSet.c !== weekSet.d) continue;
          if (weekSet.c === weekSet.d) {
            week["time"] = weekNumber + 1 + "주차" + "(" + vm.activeWeekSet[weekNumber].start + " ~ " + vm.activeWeekSet[weekNumber].end + ")";
            week.ctr = week.clk > 0 && week.im > 0 ? ((week.clk / week.im) * 100).toFixed(2) : 0;
            week.cpc = week.cst > 0 && week.clk > 0 ? (week.cst / week.clk).toFixed(0) : 0;
            week.cpa = week.cst > 0 && week.cv > 0 ? (week.cst / week.cv).toFixed(0) : 0;
            week.cvr = week.cv > 0 && week.clk > 0 ? ((week.cv / week.clk) * 100).toFixed(2) : 0;
            week.roas = week.cr > 0 && week.cst > 0 ? ((week.cr / week.cst) * 100).toFixed(0) : 0;
            obj = week;

            week = { clk: 0, im: 0, cst: 0, cv: 0, cr: 0, ctr: 0, cpc: 0, cpa: 0, cvr: 0, roas: 0, };
            weekNumber += 1;
            if (vm.activeWeekSet[weekNumber]) {
              weekSet.c = -1;
              weekSet.d = moment(vm.activeWeekSet[weekNumber].end).diff( moment(vm.activeWeekSet[weekNumber].start), "days" );
            }
          }
        }

        if (periodUnit === "day" || periodUnit === "month") obj["time"] = keysTotal[i];
        obj["cpa"] === undefined ? "" : (obj["cpa"] = Math.ceil(obj["cpa"].toString().replace(",", "")));
        obj["cpc"] === undefined ? "" : (obj["cpc"] = Math.ceil(obj["cpc"].toString().replace(",", "")));
        obj["roas"] === undefined ? "" : (obj["roas"] = Math.ceil(obj["roas"].toString().replace(",", "")));
        vm.datas.push(obj);
      }

      var length = vm.activeBtn.periodUnit === "day" ? vm.datas.length - vm.pdf[vm.activeBtn.periodUnit].spare : vm.datas.length;
      vm.pdf[vm.activeBtn.periodUnit].end = Math.floor( length / vm.pdf[vm.activeBtn.periodUnit].d );
      var n = vm.datas.length % vm.pdf[vm.activeBtn.periodUnit].d;

      if (vm.pdf[vm.activeBtn.periodUnit].end === 0)
        vm.pdf[vm.activeBtn.periodUnit].end += 1;
      else if (n > 0) vm.pdf[vm.activeBtn.periodUnit].end += 1;

      if (vm.activeBtn.periodUnit === "day") vm.pdf[vm.activeBtn.periodUnit].end += 1; //12개용 페이지 추가
    },
    findPeriodReport() {
      var vm = this;

      $.ajax({
        type: "get", //요청 메소드 방식
        url: API_URL + "/app/analysis/periodreport",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: { userid: store.state.userStore.userinfo.userid, fromdate: vm.fromdate, todate: vm.todate, periodunit: vm.activeBtn.periodUnit, session: store.state.userStore.session, },
        beforeSend: function (data) { vm.$emit("showMask"); },
        success: function (data) {
          vm.datas = [];
          vm.responseData = null;

          if (data.result === "success") {
            var type = vm.activeMedia.type;
            var media = vm.activeMedia.media;
            vm.responseData = data.data;

            var graphDatas;
            var totalDatas = {
              media: { kakaomo: {}, kakaosa: {}, naver: {}, naverda: {}, google: {} },
              total: { summary: {}, },
            };

            if (vm.activeBtn.periodUnit === "hour") {
              totalDatas = vm.sortHour(data.data, vm.fromdate, vm.todate);
              type === "total" ? (graphDatas = totalDatas[type]) : (graphDatas = totalDatas[type][media]);
            } else if (vm.activeBtn.periodUnit === "dayweek") {
              type === "total" ? (graphDatas = sortWeekDay(data.data[type]["summary"])) : (graphDatas = sortWeekDay(data.data[type][media]));
              var keys = Object.keys(graphDatas);
              for (var i = 0; i < keys.length; i++) {
                var obj = new Object();
                obj[keys[i]] = graphDatas[keys[i]];
                type === "total" ? Object.assign(totalDatas[type], obj) : Object.assign(totalDatas[type][media], obj);
              }
            } else {
              type === "total" ? (graphDatas = data.data[type]) : (graphDatas = data.data[type][media]);
              totalDatas = data.data;
            }

            vm.getTotal(totalDatas, type, media);
            vm.$nextTick(function () { vm.$refs.linePeriodGraph[0].setGraph(graphDatas, vm.fromdate, vm.todate); });
          } else {
            if (data.status === "0001") {
              // vm.handleExpireSession();
            } else {
            }
          }
        },
        error: function (a, b, c) {
          if (a.status === 403) {
            vm.$store.commit("logout");
            vm.$store.commit("logoutActivedMdias");
            vm.$store.commit("logoutKakaoSa");
            vm.$router.push("/");
          }
        },
        complete: function (a, b, c) {
          //  vm.handleHideMask();
        },
      });
    },
    createPDF() {
      var vm = this;
      vm.$htmlToPdf(vm.$refs.pdfArea, "period_report_"+ moment().format("YYYYMMDDHHmmss"));
      vm.pdfKey += 1;
    },
    handleFinishedLinePeriodGraph() {
      this.createPDF();
      this.$emit("hideMask");
    },
    getUnit(k) { return getUnit(k); },
    getUuidv4() { return uuidv4(); },
    getKpiName(k) { return getKpiName(k); },
  },
};
</script>

<style scoped>
/* section-period */
.pdf-section-period {
  position: relative;
  background-image: url("../../assets/image/pdf_inner_bg.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
.pdf-section-period .pdf-card-1,
.pdf-section-period .pdf-card-2,
.pdf-section-period .pdf-card-3 {
  padding: 0 100px 0 100px;
}
.pdf-section-period .pdf-card-1 {
  height: 20%;
  flex-direction: column;
  padding-top: 100px;
}
.pdf-section-period .pdf-card-1 .sub-title {
  padding-bottom: 50px;
}
.pdf-section-period .pdf-card-1 .sub-title h2 {
  color: #555;
  font-size: 3rem;
  font-weight: 600;
}
.pdf-section-period .pdf-card-1 .b-l {
  border-top: 8px solid #3771f8;
  width: 5%;
}
.pdf-section-period .pdf-card-1 .b-l + div {
  font-size: 20px;
}
.pdf-section-period .pdf-card-2 {
  padding-top: 30px;
  flex-direction: column;
  max-height: 80%;
  overflow: hidden;
}
.pdf-section-period .pdf-card-2 .report {
  width: 100%;
}
.pdf-section-period .pdf-card-2 .report table {
  font-size: 19px;
  border: 1px solid #ddd;
  border-radius: 15px;
}
.pdf-section-period .pdf-card-2 .report thead tr {
  color: #eee;
  font-weight: 700 !important;
  font-size: 21px;
}
.pdf-section-period .pdf-card-2 .report thead td {
  background: #386abe !important;
  color: inherit !important;
}
.pdf-section-period .pdf-card-2 .report tbody tr {
}
.pdf-section-period .pdf-card-2 .report tr {
  height: 30px;
}
.pdf-section-period .pdf-card-2 .report td {
  padding: 2px 12px;
  border: 1px solid #ddd;
  background: #fff;
  text-align: right;
}
.pdf-section-period .pdf-card-2 .report table tr.maindata td {
  font-weight: 700;
  background: #d0e1ff !important;
}
.pdf-section-period .pdf-card-2 .report table tr.total td {
  font-weight: 700;
  background: #e6e6e6 !important;
}
.pdf-section-period .pdf-card-3 {
  height: 20%;
  flex-direction: column;
}
.pdf-section-period .pdf-card-3 div div {
  font-size: 20px;
}
.pdf-section-period .pdf-card-3 .footer {
  padding-bottom: 30px;
}
.grap {
  width: 2000px;
  height: 350px;
  display: block !important;
}
</style>
