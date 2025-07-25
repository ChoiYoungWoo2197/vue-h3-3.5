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
      <div class="pdf-a4-l pdf-section-2">
        <section class="d-flex pdf-card pdf-card-1">
          <div class="sub-title">
            <h2>키워드 분석</h2>
          </div>
          <div class="d-flex justify-content-between">
            <div class="b-l"></div>
            <div>{{ fromdate + " ~ " + todate + "" }}</div>
          </div>
        </section>
        <section class="d-flex pdf-card pdf-card-2">
          <div class="top10">
            <div class="top10-card">
              <h3 class="mb-2">총광고비 TOP10</h3>
              <table>
                <thead>
                  <tr>
                    <td class="text-center" width="20px">#</td>
                    <td class="text-center" width="48%">캠페인(광고그룹)</td>
                    <td class="text-center" width="28%">키워드</td>
                    <td class="text-center">총광고비</td>
                  </tr>
                </thead>
                <tbody>
                  <template v-if="main === null" >
                    <tr> <td colspan="4" class="bg-td">데이터가 존재하지 않습니다.</td> </tr>
                  </template >
                  <template v-else>
                    <tr v-for="(cst, index) in main.cst10" data-toggle="tooltip" data-placement="right" :title=" priceToString(cst.cst) !== '0' ? '캠페인 : ' + cst.campaign_name + ' 그룹 : ' + cst.adgroup_name + ', 키워드id : ' + cst.keyword_id : '-' " :key="index" >
                      <template v-if="priceToString(cst.cst) === '0'">
                        <td class="text-center" v-text="index + 1"></td>
                        <td class="text-center" colspan="3">-</td>
                      </template>
                      <template v-else>
                        <td class="text-center" v-text="index + 1"></td>
                        <td class="text-left"> {{ cst.campaign_name + "(" + cst.adgroup_name + ")" }} </td>
                        <td class="text-left" v-text="cst.keyword_name"></td>
                        <td v-text="priceToString(cst.cst) + '원'"></td>
                      </template>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
            <div class="top10-card">
              <h3 class="mb-2">전환수 TOP10</h3>
              <table>
                <thead>
                  <tr>
                    <td class="text-center" width="20px">#</td>
                    <td class="text-center" width="48%">캠페인(광고그룹)</td>
                    <td class="text-center" width="28%">키워드</td>
                    <td class="text-center">전환수</td>
                  </tr>
                </thead>
                <tbody>
                  <template v-if="main === null">
                    <tr> <td colspan="4" class="bg-td">데이터가 존재하지 않습니다.</td> </tr>
                  </template >
                  <template v-else>
                    <tr v-for="(cv, index) in main.cv10" :key="index">
                      <template v-if="priceToString(cv.cv) === '0'">
                        <td class="text-center" v-text="index + 1"></td>
                        <td class="text-center" colspan="3">-</td>
                      </template>
                      <template v-else>
                        <td class="text-center" v-text="index + 1"></td>
                        <td class="text-left"> {{ cv.campaign_name + "(" + cv.adgroup_name + ")" }} </td>
                        <td class="text-left" v-text="cv.keyword_name"></td>
                        <td v-text="priceToString(cv.cv) + '회'"></td>
                      </template>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
            <div class="top10-card">
              <h3 class="mb-2">노출수 TOP10</h3>
              <table>
                <thead>
                  <tr>
                    <td class="text-center" width="20px">#</td>
                    <td class="text-center" width="48%">캠페인(광고그룹)</td>
                    <td class="text-center" width="28%">키워드</td>
                    <td class="text-center">노출수</td>
                  </tr>
                </thead>
                <tbody>
                  <template v-if="main === null" >
                    <tr> <td colspan="4" class="bg-td">데이터가 존재하지 않습니다.</td> </tr>
                  </template >
                  <template v-else>
                    <tr v-for="(im, index) in main.im10" :key="index">
                      <template v-if="priceToString(im.im) === '0'">
                        <td class="text-center" v-text="index + 1"></td>
                        <td class="text-center" colspan="3">-</td>
                      </template>
                      <template v-else>
                        <td class="text-center" v-text="index + 1"></td>
                        <td class="text-left"> {{ im.campaign_name + "(" + im.adgroup_name + ")" }} </td>
                        <td class="text-left" v-text="im.keyword_name"></td>
                        <td v-text="priceToString(im.im) + '회'"></td>
                      </template>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
            <div class="top10-card">
              <h3 class="mb-2">클릭수 TOP10</h3>
              <table>
                <thead>
                  <tr>
                    <td class="text-center" width="20px">#</td>
                    <td class="text-center" width="48%">캠페인(광고그룹)</td>
                    <td class="text-center" width="28%">키워드</td>
                    <td class="text-center">클릭수</td>
                  </tr>
                </thead>
                <tbody>
                  <template v-if="main === null" >
                    <tr> <td colspan="4" class="bg-td">데이터가 존재하지 않습니다.</td> </tr>
                  </template >
                  <template v-else>
                    <tr v-for="(clk, index) in main.clk10" :key="index">
                      <template v-if="priceToString(clk.clk) === '0'">
                        <td class="text-center" v-text="index + 1"></td>
                        <td class="text-center" colspan="3">-</td>
                      </template>
                      <template v-else>
                        <td class="text-center" v-text="index + 1"></td>
                        <td class="text-left"> {{ clk.campaign_name + "(" + clk.adgroup_name + ")" }} </td>
                        <td class="text-left" v-text="clk.keyword_name"></td>
                        <td v-text="priceToString(clk.clk) + '회'"></td>
                      </template>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
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
      <div v-for="index in pdf.end" :key="index" class="pdf-a4-l pdf-section-keyword">
        <section class="d-flex pdf-card pdf-card-1">
          <div class="sub-title"> <h2>{{ "키워드 분석" }}</h2> </div>
          <div class="d-flex justify-content-between">
            <div class="b-l"></div>
            <div>{{ fromdate + " ~ " + todate + "" }}</div>
          </div>
        </section>
        <section class="d-flex pdf-card pdf-card-2">
          <div class="report">
            <table class="report">
              <thead>
                <tr>
                  <td class="text-center" width="20px">#</td>
                  <td width="15%" class="text-center">캠페인</td>
                  <td width="15%" class="text-center">그룹</td>
                  <td width="15%" class="text-center">키워드</td>
                  <template v-for="(k,i) in ['im','clk','ctr','cpc','cst','cv','cr','cpa','cvr','roas']" :key="i+getUuidv4()">
                    <td class="text-center" >{{getKpiName(k)}}</td>
                  </template>
                  <!-- <td class="text-center">노출수</td>
                  <td class="text-center">클릭수</td>
                  <td class="text-center">클릭율</td>
                  <td class="text-center">클릭당비용</td>
                  <td class="text-center">광고비</td>
                  <td class="text-center">전환수</td>
                  <td class="text-center">전환율</td>
                  <td class="text-center">전환매출</td>
                  <td class="text-center">전환당비용</td>
                  <td class="text-center">ROAS</td> -->
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(data, index2) in getDatasForMain(index)"
                  :key="data.keyword_id + 'L'"
                >
                  <td class="text-center">{{ (index - 1) * pdf.d + (index2 + 1) }}</td>
                  <td class="txt-left" v-text="data.campaign_name"></td>
                  <td class="txt-left" v-text="data.adgroup_name"></td>
                  <td class="txt-left">{{ data.keyword_name }}</td>
                  <td v-text="priceToString(data.im) + '회'"></td>
                  <td v-text="priceToString(data.clk) + '회'"></td>
                  <td v-text="priceToString(data.ctr) + '%'"></td>
                  <td v-text="priceToString(data.cpc) + '원'"></td>
                  <td v-text="priceToString(data.cst) + '원'"></td>
                  <td v-text="priceToString(data.cv) + '회'"></td>
                  <td v-text="priceToString(data.cvr) + '%'"></td>
                  <td v-text="priceToString(data.cr) + '원'"></td>
                  <td v-text="priceToString(data.cpa) + '원'"></td>
                  <td v-text="priceToString(data.roas) + '%'"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        <section class="d-flex pdf-card pdf-card-3 justify-content-end">
          <div class="footer">
            <div class="d-flex justify-content-between">
              <img alt="" src="@/assets/image/pdf_logo.png" height="35" />
              <div>{{ "2" }}</div>
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
import {  clearBody,  addClassDashboard,  priceToString,  getMedia,  getApp, uuidv4,  getUnit, getType,  getKpiName } from "@/assets/js/common.js";
import { store } from "@/store/store.js";
import { SHA256 } from "@/assets/js/sha256.js";
import { API_URL, TEMP_KEY } from "@/configs/config.js";
import "@/assets/css/pdf.main.css";

export default {
  props: { pFromdate: String, pTodate: String, pActiveKpi: Object, pMedia: String, pActiveMedia: Object, pMain: Object, },
  data() {
    return {
      uniqueId: null,
      pdfKey: 0,
      adv: null,
      managerinfo: null,
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
      media: null,
      main: null,
      activeMedia: null,
      update: false,
      pdf: { d: 30, start: 0, end: 0, },
    };
  },
  watch: {
    pFromdate() { this.fromdate = this.pFromdate; },
    pTodate() { this.todate = this.pTodate; },
    pActiveKpi() { this.kpi = this.pActiveKpi; },
    pMedia() { this.main = this.copyObject(this.pMain); },
    pActiveMedia() { this.activeMedia = this.pActiveMedia; },
    pMain() { this.main = this.copyObject(this.pMain); },
  },
  computed: {
    getUniqueId() {
      if (!this.uniqueId) {
        this.uniqueId = "vm-" + this._uid;
        return this.uniqueId;
      }
      return this.uniqueId;
    },
    // getDatasForMain() {
    // 	console.log(index);
    // 	return this.main ? this.main.data : '';
    // },
  },
  components: {},
  mounted() {
    if (store.state.userStore.userinfo) {
      (this.name = store.state.userStore.userinfo.username),
        (this.fromdate = this.pFromdate);
      this.todate = this.pTodate;
      // this.kpi = this.pActiveKpi;
      this.media = this.pMedia;
      this.main = this.copyObject(this.pMain);
      this.activeMedia = this.pActiveMedia;
      this.adv = store.state.userStore.userinfo;
      this.managerinfo = store.state.userStore.managerinfo;
    }
  },
  updated() {
    if (this.update) {
      this.update = false;
      this.createPDF();
      this.$emit("hideMask");
    }
  },
  methods: {
    getDatasForMain(index) {
      var vm = this;
      var arr = [];
      var start = (index - 1) * vm.pdf.d;
      var count = vm.pdf.d;

      for (let i = 0; i < count; i++) {
        if (!vm.main.data) continue;
        if (!vm.main.data.at(start + i)) continue;

        // console.log(start+i, vm.main.data.at(start+i));
        arr.push(vm.main.data.at(start + i));
      }
      // console.log(index, arr);
      return arr;
    },
    clickSearchBtn() { this.getTopKpi(); },
    htmlToPDF() { this.clickSearchBtn(); },
    priceToString(salse) {
      if (salse === undefined) return "";
      return priceToString(salse);
    },
    copyObject(object) { return JSON.parse(JSON.stringify(object)); },
    getTopKpi() {
      var vm = this;
      var md = "";
      // var date = vm.$refs.dateRangePicker.getDate();
      switch (vm.activeMedia.media) {
        case "naver":
          md = "N";
          break;
        case "kakaosa":
          md = "D";
          break;
        case "google":
          md = "google";
          break;          
        default:
          md = "TOTAL";
      }

      $.ajax({
        type: "get", //요청 메소드 방식
        url: API_URL + "/app/analysis/keywordreport",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          fromdate: vm.fromdate,
          todate: vm.todate,
          campaigntype: vm.activeMedia.campaignType,
          adgroupid: vm.activeMedia.adgroupid,
          md: md,
          start: 0,
          sort: vm.main.sort,
          display: 10,
          totalcount: vm.main.isTotalCount,
          kpi: "cst,im,cv,cpa,cpc,clk,cr,roas",
          session: store.state.userStore.session,
        },
        beforeSend: function (data) { vm.$emit("showMask"); },
        success: function (data) {
          if (data.result === "success") {
            var keys = Object.keys(data.data.kpis);
            keys.forEach(function (key) {
              vm.main[key + "10"] = [];
              vm.main[key + "10"] = data.data.kpis[key];
            });

            //리포트
            $.ajax({
              type: "get", //요청 메소드 방식
              url: API_URL + "/app/analysis/keywordreport",
              headers: { authorization: SHA256(TEMP_KEY) },
              data: {
                userid: store.state.userStore.userinfo.userid,
                fromdate: vm.fromdate,
                todate: vm.todate,
                campaigntype: vm.activeMedia.campaignType,
                adgroupid: vm.activeMedia.adgroupid,
                md: md,
                start: vm.pMain.start,
                sort: vm.pMain.sort,
                display: vm.pMain.display,
                totalcount: vm.pMain.isTotalCount,
                kpi: "",
                session: store.state.userStore.session,
              },
              beforeSend: function (data) {},
              success: function (data) {
                if (data.result === "success") {
                  vm.main.data = [];
                  vm.main.responseData = null;
                  vm.main.responseData = data;
                  vm.main.data = data.data.keywords.slice();
                  vm.pdf.end = Math.floor(vm.pMain.display / vm.pdf.d);
                  var n = vm.pMain.display % vm.pdf.d;

                  if (vm.pdf.end === 0) vm.pdf.end += 1;
                  else if (n > 0) vm.pdf.end += 1;

                  vm.$nextTick(function () { vm.createPDF(); });
                } else {
                  if (data.status === "0001") {
                    vm.handleExpireSession();
                  } else {
                  }
                }
              },
              error: function (a, b, c) { vm.$emit("hideMask"); },
              complete: function (a, b, c) {},
            });
          } else {
            if (data.status === "0001") {
              vm.handleExpireSession();
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
          vm.$emit("hideMask");
        },
        complete: function (a, b, c) {
          // vm.$emit('hideMask');
        },
      });
    },
    createPDF() {
      var vm = this;
      vm.$htmlToPdf(vm.$refs.pdfArea, "keyword_report_"+ moment().format("YYYYMMDDHHmmss"));
      vm.pdfKey += 1;
      vm.$emit("hideMask");
    },
    getKpiName(k) {return getKpiName(k);},
    getType(type) { return getType(type); },
    getUuidv4() { return uuidv4(); },
    getUnit(kpi) { return getUnit(kpi); },  
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
.pdf-section-2 .pdf-card-2 .top10 {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between !important;
}
.pdf-section-2 .pdf-card-2 .top10 h3 {
  color: #555;
  font-weight: 600;
  font-size: 2rem;
}
.pdf-section-2 .pdf-card-2 .top10 .top10-card {
  width: 49%;
  box-shadow: none;
  border-radius: 0%;
  padding: 0%;
  height: auto;
  margin-bottom: 75px;
}
.pdf-section-2 .pdf-card-2 .top10 .top10-card table {
  font-size: 18px;
  border: 1px solid #ddd;
  border-radius: 19px;
}
.pdf-section-2 .pdf-card-2 .top10 .top10-card thead tr {
  color: #eee;
  font-weight: 700 !important;
  font-size: 21px;
}
.pdf-section-2 .pdf-card-2 .top10 .top10-card thead td {
  background: #386abe !important;
  color: inherit !important;
}
.pdf-section-2 .pdf-card-2 .top10 .top10-card tbody tr {
}
.pdf-section-2 .pdf-card-2 .top10 .top10-card tbody td:first-child {
  font-weight: 700;
  background: #cde2fd;
}

.pdf-section-2 .pdf-card-2 .top10 .top10-card tr {
  height: 34px;
}
.pdf-section-2 .pdf-card-2 .top10 .top10-card td {
  padding: 2px 12px;
  border: 1px solid #ddd;
  background: #fff;
  text-align: right;
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

/* section-keyword */
.pdf-section-keyword {
  position: relative;
  background-image: url("../../assets/image/pdf_inner_bg.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
.pdf-section-keyword .pdf-card-1,
.pdf-section-keyword .pdf-card-2,
.pdf-section-keyword .pdf-card-3 {
  padding: 0 100px 0 100px;
}
.pdf-section-keyword .pdf-card-1 {
  height: 20%;
  flex-direction: column;
  padding-top: 100px;
}
.pdf-section-keyword .pdf-card-1 .sub-title {
  padding-bottom: 50px;
}
.pdf-section-keyword .pdf-card-1 .sub-title h2 {
  color: #555;
  font-size: 3rem;
  font-weight: 600;
}
.pdf-section-keyword .pdf-card-1 .b-l {
  border-top: 8px solid #3771f8;
  width: 5%;
}
.pdf-section-keyword .pdf-card-1 .b-l + div {
  font-size: 20px;
}
.pdf-section-keyword .pdf-card-2 .report {
  width: 100%;
}
.pdf-section-keyword .pdf-card-2 .report table {
  font-size: 19px;
  border: 1px solid #ddd;
  border-radius: 15px;
}
.pdf-section-keyword .pdf-card-2 .report thead tr {
  color: #eee;
  font-weight: 700 !important;
  font-size: 21px;
}
.pdf-section-keyword .pdf-card-2 .report thead td {
  background: #386abe !important;
  color: inherit !important;
}
.pdf-section-keyword .pdf-card-2 .report tbody tr {
}
.pdf-section-keyword .pdf-card-2 .report tr {
  height: 30px;
}
.pdf-section-keyword .pdf-card-2 .report td {
  padding: 2px 12px;
  border: 1px solid #ddd;
  background: #fff;
  text-align: right;
}
.pdf-section-keyword .pdf-card-2 .report table tr.maindata td {
  font-weight: 700;
  background: #d0e1ff !important;
}
.pdf-section-keyword .pdf-card-2 .report table tr.total td {
  font-weight: 700;
  background: #e6e6e6 !important;
}
.pdf-section-keyword .pdf-card-3 {
  height: 20%;
  flex-direction: column;
}
.pdf-section-keyword .pdf-card-3 div div {
  font-size: 20px;
}
.pdf-section-keyword .pdf-card-3 .footer {
  padding-bottom: 30px;
}
.grap {
  width: 2000px;
  height: 350px;
  display: block !important;
}
</style>
