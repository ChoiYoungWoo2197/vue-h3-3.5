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
      <template v-if="activeMedia !== null && activeMedia.type === 'search'">
        <div class="pdf-a4-l pdf-section-ad">
          <section class="d-flex pdf-card pdf-card-1">
            <div class="sub-title"> <h2>{{ "소재별 분석" }}</h2> </div>
            <div class="d-flex justify-content-between">
              <div class="b-l"></div>
              <div>{{ fromdate + " ~ " + todate + "" }}</div>
            </div>
          </section>
          <section class="d-flex pdf-card pdf-card-2">
            <div class="col-12">
              <div class="top10-card">
                <h3 class="mb-2">{{"총"+getKpiName(activeBtn.kpi)+" TOP10" }}</h3>
                <table class="">
                  <thead>
                    <tr>
                      <td width="15%" class="text-left">캠페인</td>
                      <td width="15%" class="text-left">그룹</td>
                      <td width="15%" class="text-left">소재유형</td>
                      <td width="35%" class="text-left">소재</td>
                      <td class="text-right pr-0">{{getKpiName(activeBtn.kpi)}}</td>
                      <td width="8%" class="text-right pl-0">%</td>
                    </tr>
                  </thead>
                  <tbody>
                      <tr v-for="(t, index) in main[activeBtn.kpi + '10']" data-toggle="tooltip" data-placement="right" :key="index">
                        <td class="text-left">{{t.campaign_name}}</td>
                        <td class="text-left">{{t.adgroup_name}}</td>       
                        <td class="text-left">{{getAdTypeNew(t.ad_type)}}</td>       
                        <td class="text-left link">
                          <p class="font-weight-bold">
                            {{ t.ad_headline }}
                            <small class="sub">({{ t.ad_id }})</small>
                          </p>
                          <p>{{ t.ad_description }}</p>
                        </td>  
                        <td class="text-right pr-0">{{ priceToString(t[activeBtn.kpi]) + getUnits(activeBtn.kpi)}}</td>
                        <td class="text-right pr-0">
                            <a href="#" class="d-flex align-items-center justify-content-end">
                              <template v-if="t.cp !== undefined">
                                <template v-if="t.cp.per[activeBtn.kpi] === 0">{{'-'}}</template>
                                <template v-else><span :class="[t.cp.per[activeBtn.kpi].indexOf('-') > -1 ? 'down' : 'up']">{{t.cp.per[activeBtn.kpi] + "%"}}</span></template>
                              </template>
                            </a>                          
                        </td> 
                      </tr>
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
      </template>
      <template v-else-if="activeMedia !== null && activeMedia.type === 'banner'">
        <div class="pdf-a4-l pdf-section-ad" >
          <section class="d-flex pdf-card pdf-card-1">
            <div class="sub-title"> <h2>{{ "소재별 분석" }}</h2> </div>
            <div class="d-flex justify-content-between">
              <div class="b-l"></div>
              <div>{{ fromdate + " ~ " + todate + "" }}</div>
            </div>
          </section>
          <section class="d-flex pdf-card pdf-card-2">
            <div class="col-12">
              <div class="top10-ad-card">
                <h3 class="mb-2">{{"총"+getKpiName(activeBtn.kpi)+" TOP10" }}</h3>
                <table class="">
                  <thead>
                    <tr>
                      <td width="15%" class="text-left">캠페인</td>
                      <td width="15%" class="text-left">그룹</td>
                      <td width="15%" class="text-left">소재유형</td>
                      <td width="35%" class="text-left">소재</td>
                      <td class="text-right pr-0">{{getKpiName(activeBtn.kpi)}}</td>
                      <td width="8%" class="text-right pl-0">%</td>
                    </tr>
                  </thead>
                  <tbody>
                      <tr v-for="(t, index) in main[activeBtn.kpi + '10']" data-toggle="tooltip" data-placement="right" :key="index">
                        <td class="text-left">{{t.campaign_name}}</td>
                        <td class="text-left">{{t.adgroup_name}}</td>       
                        <td class="text-left">{{getBannerType(t.campaign_type	)}}</td>       
                        <!-- <td class="link">
                          <div class="banner-table">
                            <div class="banner-table-title-icon">
                              <span> <img :src="t.ad_image_url" class="img-thumbnail" @error="handleNoImg" /> </span>
                              <span class="img-thumbnail-hover" @click="clickThumbnail(t)" >
                                <div class="d-flex justify-content-center align-items-center" >
                                  <i class="bi bi-search text-white m-0"></i>
                                </div>
                              </span>
                            </div>
                            <ul>
                              <div class="d-flex txt-left">
                                <div class="w-100">
                                  <li class="font-weight-bold"> <p class="">{{ t.ad_headline }}</p> </li>
                                  <li class=""> <p class="sub">{{ t.ad_id }}</p> </li>
                                </div>
                              </div>
                            </ul>
                          </div>
                        </td>                
                        <td class="text-right pr-0">{{ priceToString(t[activeBtn.kpi]) + getUnits(activeBtn.kpi)}}</td>
                        <td class="text-right pr-0">
                            <a href="#" class="d-flex align-items-center justify-content-end">
                              <template v-if="t.cp !== undefined">
                                <template v-if="t.cp.per[activeBtn.kpi] === 0">{{'-'}}</template>
                                <template v-else> 
                                  <span :class="[t.cp.per[activeBtn.kpi].indexOf('-') > -1 ? 'down' : 'up']">{{t.cp.per[activeBtn.kpi] + "%"}}<i :class="[t.cp.per[activeBtn.kpi].indexOf('-') > -1 ? 'bi bi-graph-down-arrow ' : 'bi bi-graph-up-arrow ']" class="ml-1 mr-0"></i></span> 
                                </template>
                              </template>
                            </a>                          
                        </td> -->
                      </tr>
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
      </template>
    </div>
  </article>
</template>

<script>
import $ from "jquery";
import moment from "moment";
import * as echarts from "echarts";
import {priceToString, getMedia, uuidv4, toDataURL, getKpiName, getAdType} from "@/assets/js/common.js";
import {store} from "@/store/store.js";
import {SHA256} from "@/assets/js/sha256.js";
import {API_URL, TEMP_KEY, PGGROUPS, UNITS, BIDGOAL, BIDTYPE, BUDGETTYPE, CTYPE} from "@/configs/config.js";
import "@/assets/css/pdf.main.css";

export default {
  props: { pFromdate: String, pTodate: String, pActiveBtn: Object, pActiveMedia: Object, pMain: Object, pActiveTopAd: Object, },
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
      main:null,
      //main: {im10: [], clk10: [], ctr10: [], cpc10: [], cst10: [], cv10: [], cvr10: [], cr10: [], cpa10: [], roas10: []},
      activeTopAd: null,
      activeMedia: null,
      activeBtn: null,
      pdf: {search: { d: 15, start: 0, end: 0, spare: 5 }, banner: { d: 15, start: 0, end: 0, spare: 12 }},
    };
  },
  watch: {
    pFromdate() { this.fromdate = this.pFromdate; },
    pTodate() { this.todate = this.pTodate; },
    pActiveBtn: {
      deep: true,
      handler(value) { this.activeBtn = this.copyObject(value); },
    },
    pActiveMedia: {
      deep: true,
      handler(value) { this.activeMedia = this.copyObject(value);},
    },
    pMain: {
      deep: true,
      handler(value) { this.main = this.copyObject(value); },
    },
    pActiveTopAd: {
      deep: true,
      handler(value) { this.activeTopAd = this.copyObject(value); },
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
    getUuidv4() { return uuidv4(); },
  },
  components: {},
  mounted() {
    if (store.state.userStore.userinfo) {
      this.name = store.state.userStore.userinfo.username;
      this.fromdate = this.pFromdate;
      this.todate = this.pTodate;
      this.activeBtn = this.copyObject(this.pActiveBtn);
      this.activeMedia = this.copyObject(this.pActiveMedia);
      this.main = this.copyObject(this.pMain);
      this.activeTopAd = this.copyObject(this.pActiveTopAd);
      this.adv = store.state.userStore.userinfo;
      this.managerinfo = store.state.userStore.managerinfo;
    }
  },
  updated() {},
  methods: {
    getDatasForAd(index) {
      var vm = this;
      var arr = [];
      var start = (index - 1) * vm.pdf[vm.activeMedia.type].d;
      var count = vm.pdf[vm.activeMedia.type].d;
      var spare = vm.pdf[vm.activeMedia.type].spare;

      if (index === 1) {
        count = spare;
      } else if (index > 1) {
        start = index - 2 > 0 ? vm.pdf[vm.activeMedia.type].spare + vm.pdf[vm.activeMedia.type].d * (index - 2) : vm.pdf[vm.activeMedia.type].spare;
      }

      for (let i = 0; i < count; i++) {
        if (!vm.main.data) continue;
        if (!vm.main.data.at(start + i)) continue;
        arr.push(vm.main.data.at(start + i));
      }
      return arr;
    },
    clickSearchBtn() { this.getTopKpi(); },
    copyObject(object) { return JSON.parse(JSON.stringify(object)); },
    htmlToPDF() { this.clickSearchBtn(); },
    priceToString(salse) {
      if (salse === undefined) return "";
      return priceToString(salse);
    },
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
        case "naverda":
          md = "Nda";
          break;
        case "kakaomo":
          md = "K";
          break;
        case "google":
          md = "google";
          break;          
        default:
          md = "N";
      }

      $.ajax({
        type: "get", //요청 메소드 방식
        url: API_URL + "/app/analysis/adreport",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          fromdate: vm.fromdate,
          todate: vm.todate,
          type: vm.activeMedia.type,
          adgroupid: vm.activeMedia.adgroupid,
          md: md,
          start: 0,
          sort: vm.main.sort,
          display: vm.main.display,
          kpi: vm.activeBtn.kpi,
          session: store.state.userStore.session,
        },
        beforeSend: function (data) { vm.$emit("showMask"); },
        success: function (data) {
          if (data.result === "success") {
            var keys = Object.keys(data.data.topads);
            keys.forEach(function (key) {
              vm.main[key+"10"] = [];
              vm.main[key+"10"] = data.data.topads[key];
            });
            vm.createPDF();
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
        },
        complete: function (a, b, c) {},
      });
    },
    createPDF() {
      var vm = this;
      vm.$htmlToPdf(vm.$refs.pdfArea, "ad_report_" + moment().format("YYYYMMDDHHmmss"));
      vm.pdfKey += 1;
      vm.$emit("hideMask");
    },
    handleFinishedLinePeriodGraph() {},
    getKpiName(kpi) { return getKpiName(kpi); },
    getAdTypeNew(type) { return getAdType(type);},
    getUnits(unit) { return UNITS[unit]; },
    getBannerType(type){ return CTYPE[type];}
  },
};
</script>

<style scoped>
/* section-ad */
.pdf-section-ad {position: relative; background-image: url("../../assets/image/pdf_inner_bg.png"); background-repeat: no-repeat; background-position: center; background-size: cover;}
.pdf-section-ad .pdf-card-1, .pdf-section-ad .pdf-card-2, .pdf-section-ad .pdf-card-3 {padding: 0 100px 0 100px;}
.pdf-section-ad .pdf-card-1 {  height: 20%;  flex-direction: column;  padding-top: 100px;}
.pdf-section-ad .pdf-card-1 .sub-title {  padding-bottom: 50px;}
.pdf-section-ad .pdf-card-1 .sub-title h2 {  color: #555;  font-size: 3rem;  font-weight: 600;}
.pdf-section-ad .pdf-card-1 .b-l {  border-top: 8px solid #3771f8;  width: 5%;}
.pdf-section-ad .pdf-card-1 .b-l + div {  font-size: 20px;}
.pdf-section-ad .pdf-card-2 {  padding-top: 30px;  flex-direction: column;  max-height: 80%;  overflow: hidden;}
.pdf-section-ad .pdf-card-2 .top10 {  display: flex;  flex-direction: row;  flex-wrap: wrap;  justify-content: space-between !important;}
.pdf-section-ad .pdf-card-2 .top10 h3 {  color: #555;  font-weight: 600;  font-size: 2rem;}
.pdf-section-ad .pdf-card-2 .top10-card {  width: 100%;  box-shadow: none;  border-radius: 0%;  padding: 0%;  height: auto;  margin-bottom: 75px;}
.pdf-section-ad .pdf-card-2 .top10-card table {  font-size: 18px;  border: 1px solid #ddd;  border-radius: 19px;}
.pdf-section-ad .pdf-card-2 .top10-card thead tr {  color: #eee;  font-weight: 700 !important;  font-size: 21px;}
.pdf-section-ad .pdf-card-2 .top10-card thead td {  background: #386abe !important;  color: inherit !important;}
.pdf-section-ad .pdf-card-2 .top10-card tbody tr {}
.pdf-section-ad .pdf-card-2 .top10-card tbody td { height: 50px;}
.pdf-section-ad .pdf-card-2 .top10-card tr {  height: 34px;}
.pdf-section-ad .pdf-card-2 .top10-card td {  padding: 2px 12px;  border: 1px solid #ddd;  background: #fff;  text-align: right;}
.pdf-section-ad .pdf-card-2 .report {  width: 100%;}
.pdf-section-ad .pdf-card-2 .report table {  font-size: 19px;  border: 1px solid #ddd;  border-radius: 15px;}
.pdf-section-ad .pdf-card-2 .report thead tr {  color: #eee;  font-weight: 700 !important;  font-size: 21px;}
.pdf-section-ad .pdf-card-2 .report thead td {  background: #386abe !important;  color: inherit !important;}
.pdf-section-ad .pdf-card-2 .report tbody tr {}
.pdf-section-ad .pdf-card-2 .report tr {  height: 30px;}
.pdf-section-ad .pdf-card-2 .report td {  padding: 2px 12px;  border: 1px solid #ddd;  background: #fff;  text-align: right;}
.pdf-section-ad .pdf-card-2 .report table tr.maindata td {  font-weight: 700;  background: #d0e1ff !important;}
.pdf-section-ad .pdf-card-2 .report table tr.total td {  font-weight: 700;  background: #e6e6e6 !important;}
.pdf-section-ad .pdf-card-3 {  height: 20%;  flex-direction: column;}
.pdf-section-ad .pdf-card-3 div div {  font-size: 20px;}
.pdf-section-ad .pdf-card-3 .footer {  padding-bottom: 30px;}
.grap {  width: 2000px;  height: 350px;  display: block !important;}
</style>
