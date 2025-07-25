<template>
  <article :id="getUniqueId" class="pdf-container">
    <div ref="pdfArea" class="main" :key="pdfKey">
      <div class="pdf-a4-l pdf-section-1">
        <section class="d-flex justify-content-between pdf-card pdf-card-1">
          <div class="title mb-0">
            <h2>HEEIL<br />REPORT</h2>
            <div class="b-l"></div>
          </div>
          <div class="logo">
            <img src="../../assets/image/pdf_main_logo.png" height="35" />
          </div>
        </section>
        <section class="d-flex justify-content-between pdf-card pdf-card-2">
          <div class="adv">
            <template v-if="adv !== null">
              <h3 class="bold">
                {{ adv.usercompany }}
                <span>{{ " | " + fromdate + " ~ " + todate + "" }}</span>
              </h3>
            </template>
          </div>
        </section>
        <section class="d-flex justify-content-between pdf-card pdf-card-3">
          <div class="footer b-p">
            <template v-if="managerinfo">
              <h3 class="pl-3">
                {{ managerinfo !== null ? managerinfo.username : "" }}
                <span>마케터</span>
              </h3>
              <ul class="pl-3">
                <li>
                  휴대전화
                  <span>{{ managerinfo !== null ? managerinfo.userphone : "" }}</span>
                </li>
                <li>
                  이메일
                  <span>{{ managerinfo !== null ? managerinfo.useremail : "" }}</span>
                </li>
              </ul>
            </template>
            <template v-else>
              <h3 class="pl-3">
                {{ adv ? adv.usercompany : "" }}
                <span></span>
              </h3>
              <ul class="pl-3">
                <li>
                  휴대전화
                  <span>{{ adv ? adv.userphone : "" }}</span>
                </li>
                <li>
                  이메일
                  <span>{{ adv ? adv.useremail : "" }}</span>
                </li>
              </ul>
            </template>
          </div>
        </section>
      </div>
      <div class="pdf-a4-l pdf-section-2">
        <section class="d-flex pdf-card pdf-card-1">
          <div class="sub-title">
            <h2>대시보드</h2>
          </div>
          <div class="d-flex justify-content-between">
            <div class="b-l"></div>
            <div class="d-flex flex-column">
              <div class="mb-2">{{ "기준일: " + fromdate + " ~ " + todate + "" }}</div>
              <div>{{ "비교일: " + cFromdate + " ~ " + cTodate + "" }}</div>
            </div>
          </div>
        </section>
        <section class="d-flex pdf-card pdf-card-2">
          <summarys ref="summarys"></summarys>
          <div class="graph d-flex justify-content-center">
            <div class="text-center w-100">
              <!-- <img id="img" /> -->
              <cross-graph
                ref="crossGraph"
                class="crossGraph"
                :pHeight="'350px'"
                :pCustom="{
                  series: { textStyle: { fontSize: '12', fontWeight: 'bold' } },
                  xAxis: { name: '', axisLabel: { fontSize: '12' } },
                  yAxis: { name: '', axisLabel: { fontSize: '12' } },
                  legend: {
                    data: legend,
                    show: true,
                    left: 'center',
                    right: 'center',
                    bottom: '30%',
                    width: '90%',
                    orient: 'horizontal',
                    textStyle: {
                      fontSize: '12',
                      fontWeight: 'normal',
                    },
                  },
                }"
                @finishedCrossGraph="handleFinishedCrossGraph"
              >
              </cross-graph>
            </div>
          </div>
          <div class="report">
            <div class="row">
              <div class="col-8">
                <summarys-media ref="summarysMedai"></summarys-media>
                <!-- <div class="title"><h3>매체별 요약</h3></div>
                <table class="report" :class="getUniqueId" v-if="summarys.length > 0">
                  <thead>
                    <tr>
                      <td width="25px" class="text-center">#</td>
                      <td v-if="summarys[0].visible" width="17%" class="text-right">
                        총광고비
                      </td>
                      <td v-if="summarys[1].visible" width="17%" class="text-right">
                        총노출수
                      </td>
                      <td v-if="summarys[2].visible" width="17%" class="text-right">
                        총클릭수
                      </td>
                      <td v-if="summarys[3].visible" width="17%" class="text-right">
                        총전환수
                      </td>
                      <td v-if="summarys[4].visible" width="17%" class="text-right">
                        총전환매출
                      </td>
                      <td v-if="summarys[5].visible" width="17%" class="text-right">
                        총클릭율
                      </td>
                      <td v-if="summarys[6].visible" width="17%" class="text-right">
                        총클릭당비용
                      </td>
                      <td v-if="summarys[7].visible" width="17%" class="text-right">
                        총전환당비용
                      </td>
                      <td v-if="summarys[8].visible" width="17%" class="text-right">
                        총전환율
                      </td>
                      <td v-if="summarys[9].visible" width="17%" class="text-right">
                        총ROAS
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="summary in getMediaSummarys"
                      :key="summary.key"
                      :class="{ total: summary.key === 'TOTAL' }"
                    >
                      <td class="text-left">{{ getMediaName(summary.key) }}</td>
                      <td v-if="summarys[0].visible">
                        {{ priceToString(summary.value.cst) + "원" }}
                      </td>
                      <td v-if="summarys[1].visible">
                        {{ priceToString(summary.value.im) + "회" }}
                      </td>
                      <td v-if="summarys[2].visible">
                        {{ priceToString(summary.value.clk) + "회" }}
                      </td>
                      <td v-if="summarys[3].visible">
                        {{ priceToString(summary.value.cv) + "회" }}
                      </td>
                      <td v-if="summarys[4].visible">
                        {{ priceToString(summary.value.cr) + "원" }}
                      </td>
                      <td v-if="summarys[5].visible">
                        {{ priceToString(summary.value.ctr) + "%" }}
                      </td>
                      <td v-if="summarys[6].visible">
                        {{ priceToString(summary.value.cpc) + "원" }}
                      </td>
                      <td v-if="summarys[7].visible">
                        {{ priceToString(summary.value.cpa) + "원" }}
                      </td>
                      <td v-if="summarys[8].visible">
                        {{ priceToString(summary.value.cvr) + "%" }}
                      </td>
                      <td v-if="summarys[9].visible">
                        {{ priceToString(summary.value.roas) + "원" }}
                      </td>
                    </tr>
                  </tbody>
                </table> -->
              </div>
              <div class="col-4 d-flex justify-content-center align-items-center">
                <pie-graph
                  ref="pieGraph"
                  class="pieGraph"
                  :pCustom="{
                    series: {
                      label: {
                        fontSize: '13',
                        fontWeight: 'normal',
                      },
                    },
                    height: '300',
                    legend: {
                      show: true,
                      left: 'center',
                      top: '93%',
                      orient: 'horizontal',
                      textStyle: {
                        fontSize: '13',
                        fontWeight: 'normal',
                      },
                    },
                  }"
                  @finishedPieGraph="handleFinishedPieGraph"
                ></pie-graph>
              </div>
            </div>
          </div>
        </section>
        <section class="d-flex pdf-card pdf-card-3 justify-content-end">
          <div class="footer">
            <div class="d-flex justify-content-between">
              <img alt="" src="../../assets/image/pdf_logo.png" height="35" />
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
import {
  clearBody,
  addClassDashboard,
  priceToString,
  getMedia,
  getApp,
} from "../../assets/js/common.js";
import { store } from "../../store/store.js";
import { SHA256 } from "../../assets/js/sha256.js";
import { API_URL, TEMP_KEY, SUMMARY_SORT, MEDIA_SORT } from "../../configs/config.js";
import naverIcon from "../../assets/image/naver.png";
import kakaoSaIcon from "../../assets/image/daum.png";
import kakaoMomentIcon from "../../assets/image/kakao.png";
import summarys from "../dashboard2/summarys.vue";
import summarysMedia from "../dashboard2/summarysMedia.vue";
import crossGraph from "../graph/crossGraph.vue";
import pieGraph from "../graph/pieGraph.vue";
import "../../assets/css/pdf.main.css";

export default {
  props: {
    pFromdate: String,
    pTodate: String,
    pCfromdate: String,
    pCtodate: String,
    pSummarys: Array,
    pLegend: Array,
  },
  data() {
    return {
      uniqueId: null,
      pdfKey: 0,
      adv: null,
      managerinfo: null,
      name: null,
      fromdate: null,
      todate: null,
      cFromdate: null,
      cTodate: null,
      finished: {
        crossGraph: false,
        pieGraph: false,
      },
      summarys: [],
      atSummarys: [],
      atMediaSummarys: [],
      atPieSummarys: [],
      graph: {
        pieGraph: null,
      },
      legend: [
        { key: "im", text: "총노출수" },
        { key: "clk", text: "총클릭수" },
      ],
      totalCst: 0,
    };
  },
  watch: {
    pFromdate() {
      this.fromdate = this.pFromdate;
    },
    pTodate() {
      this.todate = this.pTodate;
    },
    pCfromdate() {
      this.cFromdate = this.pCfromdate;
    },
    pCtodate() {
      this.cTodate = this.pCtodate;
    },
    pLegend: {
      deep: true,
      handler(value) {
        this.legend = this.copyObject(this.pLegend);
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
    getSummarys() {
      this.atSummarys.sort(function (a, b) {
        return a.sort < b.sort ? -1 : a.sort > b.sort ? 1 : 0;
      });

      return this.atSummarys;
    },
    getMediaSummarys() {
      this.atMediaSummarys.sort(function (a, b) {
        return a.sort < b.sort ? -1 : a.sort > b.sort ? 1 : 0;
      });

      return this.atMediaSummarys;
    },
  },
  components: {
    summarys,
    summarysMedia,
    crossGraph,
    pieGraph,
  },
  mounted() {
    if (store.state.userStore.userinfo) {
      this.name = store.state.userStore.userinfo.username;
      this.fromdate = this.pFromdate;
      this.todate = this.pTodate;
      this.cFromdate = this.pCfromdate;
      this.cTodate = this.pCtodate;
      this.adv = store.state.userStore.userinfo;
      this.managerinfo = store.state.userStore.managerinfo;
      // this.clickSearchBtn();
    }
  },
  updated() {},
  methods: {
    getImageUrl(key) {
      if (key === undefined) return "";

      var url = "";
      if (key === "N") url = naverIcon;
      if (key === "D") url = kakaoMomentIcon;
      if (key === "K") url = kakaoMomentIcon;
      return url;
    },
    getMediaName(key) {
      if (key === undefined) return "";

      var name = "";
      if (key === "TOTAL") name = "총 합계";
      if (key === "N") name = "네이버sa";
      if (key === "D") name = "카카오sa";
      if (key === "K") name = "카카오mo";
      if (key === "Nda") name = "네이버gfa";
      return name;
    },
    getName(key) {
      if (key === undefined) return "";

      var name = "";
      if (key === "cst") name = "총광고비";
      if (key === "clk") name = "총클릭수";
      if (key === "cv") name = "총전환수";
      if (key === "im") name = "총노출수";
      if (key === "cr") name = "총전환매출";
      if (key === "ctr") name = "총클릭율";
      if (key === "cpc") name = "총클릭당비용";
      if (key === "cpa") name = "총전환당비용";
      if (key === "cvr") name = "총전환율";
      if (key === "roas") name = "총ROAS";

      return name;
    },
    getUnit(key) {
      if (key === undefined) return "";

      var name = "";
      if (key === "cst") name = "원";
      if (key === "clk") name = "회";
      if (key === "cv") name = "회";
      if (key === "im") name = "회";
      if (key === "cr") name = "원";
      if (key === "ctr") name = "%";
      if (key === "cpc") name = "원";
      if (key === "cpa") name = "원";
      if (key === "cvr") name = "%";
      if (key === "roas") name = "원";

      return name;
    },
    clickSearchBtn() {
      var vm = this;

      // vm.$emit("showMask");
      vm.$refs.summarys.setSummary(
        vm.pSummarys,
        vm.fromdate,
        vm.todate,
        vm.cFromdate,
        vm.cTodate
      );
      vm.$refs.summarysMedai.setSummaryMedia(vm.fromdate, vm.todate, vm.pSummarys);

      vm.$nextTick(function () {
        vm.$refs.crossGraph.setGraph(vm.fromdate, vm.todate, vm.legend);
        vm.$refs.pieGraph.setGraph(vm.fromdate, vm.todate);

        // vm.createPDF();
      });

      // vm.setSummaryMedia(vm.fromdate, vm.todate);
    },
    htmlToPDF() {
      // const name = 'document';
      this.clickSearchBtn();
    },
    priceToString(salse) {
      if (salse === undefined) return "";

      return priceToString(salse);
    },
    copyObject(object) {
      return JSON.parse(JSON.stringify(object));
    },
    createPDF() {
      var vm = this;
      vm.$htmlToPdf(vm.$refs.pdfArea, moment().format("LLLL") + "-" + "대시보드");
      vm.pdfKey += 1;
      vm.finished.crossGraph = false;
      vm.finished.pieGraph = false;
    },
    handleFinishedCrossGraph(url) {
      var vm = this;
      vm.finished.crossGraph = true;
      // if (vm.finished.crossGraph && vm.finished.pieGraph) vm.createPDF();
    },
    handleFinishedPieGraph(url) {
      var vm = this;
      vm.finished.pieGraph = true;
      // if (vm.finished.crossGraph && vm.finished.pieGraph) vm.createPDF();
    },
  },
};
</script>

<style scoped>
/* section2 */
.pdf-section-2 {
  position: relative;
  background-image: url("../../assets/image/pdf_inner_bg.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
.pdf-section-2 .pdf-card-1,
.pdf-section-2 .pdf-card-2,
.pdf-section-2 .pdf-card-3 {
  padding: 0 100px 0 100px;
}
.pdf-section-2 .pdf-card-1 {
  height: 20%;
  flex-direction: column;
  padding-top: 100px;
}
.pdf-section-2 .pdf-card-1 .sub-title {
  padding-bottom: 50px;
}
.pdf-section-2 .pdf-card-1 .sub-title h2 {
  color: #555;
  font-size: 3rem;
  font-weight: 600;
}
.pdf-section-2 .pdf-card-1 .b-l {
  border-top: 8px solid #3771f8;
  width: 5%;
}
.pdf-section-2 .pdf-card-1 .b-l + div {
  font-size: 20px;
}
.pdf-section-2 .pdf-card-2 {
  padding-top: 30px;
  flex-direction: column;
  max-height: 80%;
  overflow: hidden;
}
.pdf-section-2 .pdf-card-2 .summary-card {
  margin: -10px -10px 10px -10px;
}
.pdf-section-2 .pdf-card-2 .summary-card ul {
  box-shadow: 0 0 5px rgba(0, 0, 0, 0);
  border-radius: 0.375rem;
  padding: 20px;
  margin: 10px;
  background: #f8f9fa;
  cursor: default;
  height: 115px;
}

.pdf-section-2 .pdf-card-2 .summary-card ul li {
  font-size: 14px;
  /* margin-bottom: 10px; */
}
.pdf-section-2 .pdf-card-2 .summary-card ul .lt {
  font-size: 14px !important;
  font-weight: 700;
}
.pdf-section-2 .pdf-card-2 .summary-card ul .no-wrap {
  white-space: nowrap;
}
.pdf-section-2 .pdf-card-2 .summary-card ul li:last-of-type span.down {
  color: #14aee0;
}
.pdf-section-2 .pdf-card-2 .summary-card ul li:last-of-type span.down:before {
  content: "(-";
}
.pdf-section-2 .pdf-card-2 .summary-card ul li:last-of-type span.up {
  color: #e04513;
}
.pdf-section-2 .pdf-card-2 .summary-card ul li:last-of-type span.up:before {
  content: "(+";
}
.pdf-section-2 .pdf-card-2 .summary-card ul li:last-of-type span:after {
  content: "";
}
.pdf-section-2 .pdf-card-2 .summary-card ul.integrated {
  background: #494949;
  color: #fff;
}
.pdf-section-2 .pdf-card-2 .summary-card ul.integrated:hover {
  background: #777;
  cursor: pointer;
}
.pdf-section-2 .pdf-card-2 .summary-card ul.integrated button {
  border: 0;
  background: 0;
  color: #fff;
}

.pdf-section-2 .pdf-card-2 .graph {
  background: #f8f9fa;
}

.pdf-section-2 .pdf-card-2 .report {
  margin-top: 40px;
  width: 100%;
}
.pdf-section-2 .pdf-card-2 .report .row {
  display: flex;
  flex-direction: row;
  justify-content: space-between !important;
}
.pdf-section-2 .pdf-card-2 .report .row [class*="col-"] {
  background: #f8f9fa;
  padding: 20px;
}
.pdf-section-2 .pdf-card-2 .report .row .col-6 {
  flex: 0 0 56% !important;
  max-width: 56% !important;
}
.pdf-section-2 .pdf-card-2 .report table {
  font-size: 16px;
  border: 1px solid #9c9c9c;
  border-radius: 0.75rem;
  overflow: hidden;
  min-width: 1000px;
}
.pdf-section-2 .pdf-card-2 .report thead tr {
  color: #eee;
  font-weight: 700 !important;
  font-size: 17px;
}
.pdf-section-2 .pdf-card-2 .report thead td {
  background: #386abe !important;
  border: 1px solid #164088;
  color: inherit !important;
}
.pdf-section-2 .pdf-card-2 .report tbody tr {
}
.pdf-section-2 .pdf-card-2 .report tr {
  height: 50px;
}
.pdf-section-2 .pdf-card-2 .report td {
  padding: 0px 12px;
  border: 1px solid #ddd;
  background: #fff;
  text-align: right;
}
.pdf-section-2 .pdf-card-2 .report table tr.maindata td {
  font-weight: 700;
  background: #d0e1ff !important;
  border: 1px solid #77a9ff;
}
.pdf-section-2 .pdf-card-2 .report table tr.total td {
  font-weight: 700;
  background: #e6e6e6 !important;
}
.pdf-section-2 .pdf-card-3 {
  height: 20%;
  flex-direction: column;
}
.pdf-section-2 .pdf-card-3 div div {
  font-size: 17px;
}
.pdf-section-2 .pdf-card-3 .footer {
  padding-bottom: 30px;
}
.crossGraph {
  width: 2000px;
  height: 350px;
  display: block !important;
}
.pieGraph {
  width: 600px;
  height: 260px;
  display: block !important;
}
</style>
