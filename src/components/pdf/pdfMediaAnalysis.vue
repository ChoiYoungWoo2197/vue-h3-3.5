<template>
  <article :id="getUniqueId" class="pdf-container">
    <div ref="pdfArea" class="main" :key="pdfKey">
      <div class="pdf-a4-l pdf-section-1">
        <section class="d-flex justify-content-between pdf-card pdf-card-1">
          <div class="title mb-0">
            <h2>HEEIL<br />REPORT</h2>
            <div class="b-l"></div>
          </div>
          <div class="logo"> <img src="../../assets/image/pdf_main_logo.png" height="35" /> </div>
        </section>
        <section class="d-flex justify-content-between pdf-card pdf-card-2">
          <div class="adv">
            <template v-if="adv !== null">
              <h3 class="bold"> {{ adv.usercompany }} <span>{{ " | " + fromDate + " ~ " + todate + "" }}</span> </h3>
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
              <h3 class="pl-3"> {{ adv ? adv.usercompany : "" }} </h3>
              <ul class="pl-3">
                <li> 휴대전화 <span>{{ adv ? adv.userphone : "" }}</span> </li>
                <li> 이메일 <span>{{ adv ? adv.useremail : "" }}</span> </li>
              </ul>
            </template>
          </div>
        </section>
      </div>
      <div class="pdf-a4-l pdf-section-2">
        <section class="d-flex pdf-card pdf-card-1">
          <div class="sub-title"> <h2>매체별 리포트</h2> </div>
          <div class="d-flex justify-content-between">
            <div class="b-l"></div>
            <div>{{ fromDate + " ~ " + todate + "" }}</div>
          </div>
        </section>
        <section class="d-flex pdf-card pdf-card-2">
          <div class="grap d-flex justify-content-center">
            <div class="text-center w-100">
              <line-graph
                class="grap"
                ref="lineGraph"
                :pHeight="'350px'"
                :pLegend="graph.legend"
                :pKpi="graph.kpi"
                :pCustom="{
                  series: { textStyle: { fontSize: '12', fontWeight: 'bold' } },
                  xAxis: { name: '', axisLabel: { fontSize: '12' } },
                  yAxis: { name: '', axisLabel: { fontSize: '12' } },
                  grid: { left: 'center', right: 'center', bottom: '30%', width: '90%', containLabel: true, },
                  legend: { show: true, left: 'center', top: '75%', orient: 'horizontal', },
                }"
                @finishedLineGraph="handleFinishedLineGraph"
              >
              </line-graph>
            </div>
          </div>
          <div class="report">
            <table>
              <thead>
                <tr style="">
                  <td width="10%" class="text-center">매체별</td>
                  <td class="text-center">노출수</td>
                  <td class="text-center">클릭수</td>
                  <td class="text-center">클릭율</td>
                  <td class="text-center">클릭당비용</td>
                  <td class="text-center">광고비</td>
                  <td class="text-center">전환수</td>
                  <td class="text-center">전환매출</td>
                  <td class="text-center">전환당비용</td>
                  <td class="text-center">전환율</td>
                  <td class="text-center">ROAS</td>
                </tr>
              </thead>
              <tbody>
                <tr class="maindata">
                  <td class="text-left">검색광고</td>
                  <template v-for="(data, i) in getObject('total', datas['sa'])">
                    <td :key="i + getUuidv4()" v-if="kpi[data.k].check"> {{ priceToString(data.v) + getUnit(data.k) }} </td>
                  </template>
                </tr>
                <tr class="subdata show">
                  <td class="text-left">{{getMedia("naver")}}</td>
                  <td v-for="(data, i) in getObject('naver', datas['sa'])" :key="i + getUuidv4()" v-show="kpi[data.k].check" > {{ priceToString(data.v) + getUnit(data.k) }} </td>
                </tr>
                <tr class="subdata show">
                  <td class="text-left">{{getMedia("kakaosa")}}</td>
                  <td v-for="(data, i) in getObject('kakaosa', datas['sa'])" :key="i + getUuidv4()" v-show="kpi[data.k].check" > {{ priceToString(data.v) + getUnit(data.k) }} </td>
                </tr>
                <tr class="subdata show">
                  <td class="text-left">{{getMedia("google")}}</td>
                  <td v-for="(data, i) in getObject('google', datas['sa'])" :key="i + getUuidv4()" v-show="kpi[data.k].check" > {{ priceToString(data.v) + getUnit(data.k) }} </td>
                </tr>
                <tr class="maindata">
                  <td class="text-left">배너광고</td>
                  <template v-for="(data, i) in getObject('total', datas['dsp'])">
                    <td :key="i + getUuidv4()" v-if="kpi[data.k].check"> {{ priceToString(data.v) + getUnit(data.k) }} </td>
                  </template>
                </tr>
                <tr class="subdata show">
                  <td class="text-left">{{getMedia("naverda")}}</td>
                  <td v-for="(data, i) in getObject('naverda', datas['dsp'])" :key="i + getUuidv4()" v-show="kpi[data.k].check" > {{ priceToString(data.v) + getUnit(data.k) }} </td>
                </tr>
                <tr class="subdata show">
                  <td class="text-left">{{getMedia("kakaomo")}}</td>
                  <td v-for="(data, i) in getObject('kakaomo', datas['dsp'])" :key="i + getUuidv4()" v-show="kpi[data.k].check" > {{ priceToString(data.v) + getUnit(data.k) }} </td>
                </tr>
                <tr class="total bg-white">
                  <td class="text-left">총 합계</td>
                  <template v-for="(data, i) in getObject('total', datas)">
                    <td :key="i + getUuidv4()" v-if="kpi[data.k].check"> {{ priceToString(data.v) + getUnit(data.k) }} </td>
                  </template>
                </tr>
              </tbody>
            </table>
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
import { priceToString, uuidv4,  getUnit, getMedia} from "@/assets/js/common.js";
import { store } from "@/store/store.js";
import LineGraph from "@/components/graph/lineGraph.vue";
import { SHA256 } from "@/assets/js/sha256.js";
import { API_URL, TEMP_KEY, MEDIA_ANALYSIS_SORT } from "@/configs/config.js";
import "@/assets/css/pdf.main.css";

export default {
  props: { pFromdate: String, pTodate: String, pMedia: String, pLegend: Object, pKpi: String, pActiveKpi: Object, },
  data() {
    return {
      uniqueId: null,
      pdfKey: 0,
      adv: null,
      managerinfo: null,
      fromDate: null,
      todate: null,
      graph: { name: null, media: null, legend: null, kpi: null, },
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
      datas: {
        total: {},
        sa: { total: {}, naver: {}, kakaosa: {}, google: {}, },
        dsp: { total: {}, naverda: {}, kakaomo: {}, },
      },
      responseData: null,
      update: false,
    };
  },
  watch: {
    pFromdate() { this.fromDate = this.pFromdate; },
    pTodate() { this.todate = this.pTodate; },
    pMedia() { this.graph.media = this.pMedia; },
    pLegend() { this.graph.legend = this.pLegend;     },
    pKpi() { this.graph.kpi = this.pKpi; },
    pActiveKpi() { this.kpi = this.pActiveKpi; },
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
  components: { LineGraph, },
  mounted() {
    if (store.state.userStore.userinfo) {
      (this.graph.name = store.state.userStore.userinfo.username),
        (this.graph.media = this.pMedia);
      this.graph.legend = this.pLegend;
      this.graph.kpi = this.pKpi;
      this.fromDate = this.pFromdate;
      this.todate = this.pTodate;
      this.adv = store.state.userStore.userinfo;
      this.managerinfo = store.state.userStore.managerinfo;
    }
  },
  updated() {
    if (this.update) {
      this.handleFinishedLineGraph();
      this.update = false;
    }
  },
  methods: {
    findMediaReport() {
      var vm = this;
      $.ajax({
        type: "get", //요청 메소드 방식
        url: API_URL + "/app/analysis/mediareport",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: { userid: store.state.userStore.userinfo.userid, fromdate: vm.fromDate, todate: vm.todate, session: store.state.userStore.session, },
        beforeSend: function (data) { vm.$emit("showMask"); },
        success: function (data) {
          vm.responseData = null;
          vm.datas.total = {};
          vm.datas.sa.naver = {};
          vm.datas.sa.kakaosa = {};
          vm.datas.sa.google = {};
          vm.datas.dsp.naverda = {};
          vm.datas.dsp.kakaomo = {};

          if (data.result === "success") {
            vm.getTotal(data, "dsp", "naverda");
            vm.getTotal(data, "dsp", "kakaomo");
            vm.getTotal(data, "sa", "naver");
            vm.getTotal(data, "sa", "kakaosa");
            vm.getTotal(data, "sa", "google");            
            vm.responseData = data;
            vm.getTypeTotal(data.data.total.summary);
            vm.$nextTick(function () { vm.$refs.lineGraph.setGraph(vm.responseData, vm.fromDate, vm.todate); });
          } else {
            if (data.status === "0001") { } else { }
          }
        },
        error: function (a, b, c) {
          vm.$emit("hideMask");
          if (a.status === 403) {
            vm.$store.commit("logout");
            vm.$store.commit("logoutActivedMdias");
            vm.$store.commit("logoutKakaoSa");
            vm.$router.push("/");
          }
        },
        complete: function (a, b, c) { },
      });
    },
    getTotal(data, type, media) {
      var vm = this;
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

      //total
      var keysTotal = media === null ? Object.keys(data.data[type]) : Object.keys(data.data[type][media]);
      for (let i = 0; i < keysTotal.length; i++) {
        var obj = media === null ? data.data[type][keysTotal[i]] : data.data[type][media][keysTotal[i]];
        if (obj.length === 0) continue;
        clk.push(obj.clk);
        im.push(obj.im);
        cst.push(obj.cst);
        cv.push(obj.cv);
        cr.push(obj.cr);
      }

      if (!media) {
        vm.datas[type].clk = vm.getSum(clk);
        vm.datas[type].im = vm.getSum(im);
        vm.datas[type].cst = vm.getSum(cst);
        vm.datas[type].cv = vm.getSum(cv);
        vm.datas[type].cr = vm.getSum(cr);
        vm.datas[type].ctr = vm.datas[type].clk > 0 && vm.datas[type].im > 0 ? ((vm.datas[type].clk / vm.datas[type].im) * 100).toFixed(2) : 0;
        vm.datas[type].cpc = vm.datas[type].cst > 0 && vm.datas[type].clk > 0 ? (vm.datas[type].cst / vm.datas[type].clk).toFixed(0) : 0;
        vm.datas[type].cpa = vm.datas[type].cst > 0 && vm.datas[type].cv > 0 ? (vm.datas[type].cst / vm.datas[type].cv).toFixed(0) : 0;
        vm.datas[type].cvr = vm.datas[type].cv > 0 && vm.datas[type].clk > 0 ? ((vm.datas[type].cv / vm.datas[type].clk) * 100).toFixed(2) : 0;
        vm.datas[type].roas = vm.datas[type].cr > 0 && vm.datas[type].cst > 0 ? ((vm.datas[type].cr / vm.datas[type].cst) * 100).toFixed(0) : 0;
      } else {
        vm.datas[type][media].clk = vm.getSum(clk);
        vm.datas[type][media].im = vm.getSum(im);
        vm.datas[type][media].cst = vm.getSum(cst);
        vm.datas[type][media].cv = vm.getSum(cv);
        vm.datas[type][media].cr = vm.getSum(cr);
        vm.datas[type][media].ctr = vm.datas[type][media].clk > 0 && vm.datas[type][media].im > 0 ? ((vm.datas[type][media].clk / vm.datas[type][media].im) * 100).toFixed(2) : 0;
        vm.datas[type][media].cpc = vm.datas[type][media].cst > 0 && vm.datas[type][media].clk > 0 ? (vm.datas[type][media].cst / vm.datas[type][media].clk).toFixed(0) : 0;
        vm.datas[type][media].cpa = vm.datas[type][media].cst > 0 && vm.datas[type][media].cv > 0 ? (vm.datas[type][media].cst / vm.datas[type][media].cv).toFixed(0) : 0;
        vm.datas[type][media].cvr = vm.datas[type][media].cv > 0 && vm.datas[type][media].clk > 0 ? ((vm.datas[type][media].cv / vm.datas[type][media].clk) * 100).toFixed(2) : 0;
        vm.datas[type][media].roas = vm.datas[type][media].cr > 0 && vm.datas[type][media].cst > 0 ? ((vm.datas[type][media].cr / vm.datas[type][media].cst) * 100).toFixed(0) : 0;
      }
    },
    getSum(arr) {
      var result = arr.reduce(function add(sum, currValue) { return parseFloat(sum) + parseFloat(currValue); }, 0);
      return result;
    },
    getTypeTotal(data) {
      var vm = this;
      var count = ["all", "sa", "dsp"];
      var keys = Object.keys(vm.kpi);
      for (let i = 0; i < count.length; i++) {
        for (let k = 0; k < keys.length; k++) {
          count[i] === "all" ? (vm.datas["total"][keys[k]] = data[count[i]][keys[k]]) : (vm.datas[count[i]]["total"][keys[k]] = data[count[i]][keys[k]]);
        }
      }
    },
    priceToString(salse) {
      if (salse === undefined) return "";
      return priceToString(salse);
    },
    createPDF() {
      var vm = this;
      vm.$htmlToPdf(vm.$refs.pdfArea, "media_report_"+ moment().format("YYYYMMDDHHmmss"));
      vm.pdfKey += 1;
    },
    handleFinishedLineGraph() {
      this.createPDF();
      this.$emit("hideMask");
    },
    getObject(key, o) {
      let objs = [];
      var keys = Object.keys(o[key]);

      for (let i = 0; i < keys.length; i++) { objs.push({ k: keys[i], v: o[key][keys[i]], s: MEDIA_ANALYSIS_SORT[keys[i]], }); }
      objs.sort(function (a, b) { return a.s < b.s ? -1 : a.s > b.s ? 1 : 0; });
      return objs;
    },
    getUnit(k) { return getUnit(k); },
    getUuidv4() { return uuidv4(); },
    clickSearchBtn() { this.findMediaReport(); },
    htmlToPDF() { this.clickSearchBtn(); },
    getMedia(media) { return getMedia(media);}
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
.pdf-section-2 .pdf-card-2 .report {
  width: 100%;
}
.pdf-section-2 .pdf-card-2 .report table {
  font-size: 19px;
  border: 1px solid #ddd;
  border-radius: 15px;
}
.pdf-section-2 .pdf-card-2 .report thead tr {
  color: #eee;
  font-weight: 700 !important;
  font-size: 21px;
}
.pdf-section-2 .pdf-card-2 .report thead td {
  background: #386abe !important;
  color: inherit !important;
}
.pdf-section-2 .pdf-card-2 .report tbody tr {
}
.pdf-section-2 .pdf-card-2 .report tr {
  height: 30px;
}
.pdf-section-2 .pdf-card-2 .report td {
  padding: 2px 12px;
  border: 1px solid #ddd;
  background: #fff;
  text-align: right;
}
.pdf-section-2 .pdf-card-2 .report table tr.maindata td {
  font-weight: 700;
  background: #d0e1ff !important;
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
  font-size: 20px;
}
.pdf-section-2 .pdf-card-3 .footer {
  padding-bottom: 30px;
}
.grap {
  width: 2000px;
  height: 350px;
  display: block !important;
}
</style>
