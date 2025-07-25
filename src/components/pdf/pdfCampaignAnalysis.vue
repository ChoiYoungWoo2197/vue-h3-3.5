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
            <template v-if="adv !== null"> <h3 class="bold"> {{ adv.usercompany }} <span>{{ " | " + fromdate + " ~ " + todate + "" }}</span> </h3> </template>
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
      <template v-if="datas">
        <div v-for="index in pdf.end" :key="index" class="pdf-a4-l pdf-section-2">
          <section class="d-flex pdf-card pdf-card-1">
            <div class="sub-title"> <h2>{{ "그룹별 리포트 - " + mediaSet[media] }}</h2> </div>
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
                  :pHeight="'350px'"
                  :pLegend="legend"
                  :pPeriodUnit="periodUnit"
                  :pCustom="{ series: { textStyle: { fontSize: '12', fontWeight: 'bold' } }, xAxis: { name: '', axisLabel: { fontSize: '12' } }, yAxis: { name: '', axisLabel: { fontSize: '12' } },
                    grid: { left: 'center', right: 'auto', bottom: '30%', width: '90%', containLabel: true, }, legend: { show: true, left: 'center', top: '75%', orient: 'horizontal', },
                  }"
                  ref="linePeriodGraph"
                  style="display: none"
                  @finishedLinePeriodGraph="handleFinishedLinePeriodGraph"
                >
                </line-period-graph>
              </div>
            </div>

            <div class="report">
              <table class="report">
                <thead>
                  <tr>
                    <td width="25%" class="text-center">캠페인 (광고그룹목록)</td>
                    <td class="text-center">노출수</td>
                    <td class="text-center">클릭수</td>
                    <td class="text-center">클릭율</td>
                    <td class="text-center">클릭당비용</td>
                    <td class="text-center">광고비</td>
                    <td class="text-center">전환수</td>
                    <td class="text-center">전환율</td>
                    <td class="text-center">전환매출</td>
                    <td class="text-center">전환당비용</td>
                    <td class="text-center">ROAS</td>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(data, index2) in getDatasForCampaign(index)" :key="data.cst + '-' + index2" :class=" data.isMainData === true ? ['maindata', 'collapsed'] : ['subdata', 'show', 'collapse', data.campain] "
                    :data-toggle="data.isMainData === true ? '' : ''" :data-target="data.isMainData === true ? '.' + data.campain : ''" :aria-expanded="data.isMainData === true ? 'false' : ''" >
                    <template v-if="data.isMainData === true"> <td :class=" data.haschild === true ? ['text-left fold-btn'] : ['text-left'] " > {{ data.campaign_name }} </td> </template>
                    <template v-else> <td class="text-left"> {{ data.campaign_name }} </td> </template>
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
                  <template v-if="index === pdf.end">
                    <tr v-for="data in total" :key="data.cst + 'L'" class="total bg-white" >
                      <td class="text-left">총 합계</td>
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
                  </template>
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
      </template>
    </div>
  </article>
</template>

<script>
import $ from "jquery";
import moment from "moment";
import { priceToString} from "@/assets/js/common.js";
import { store } from "@/store/store.js";
import { SHA256 } from "@/assets/js/sha256.js";
import { API_URL, TEMP_KEY } from "@/configs/config.js";
import linePeriodGraph from "@/components/graph/linePeriodGraph.vue";
import crossGraph from "@/components/graph/crossGraph.vue";
import "@/assets/css/pdf.main.css";

export default {
  props: { pFromdate: String, pTodate: String, pLegend: Object, pPeriodUnit: String, pActiveKpi: Object, pMedia: String,  },
  data() {
    return {
      uniqueId: null,
      pdfKey: 0,
      adv: null,
      managerinfo: null,
      name: null,
      fromdate: null,
      todate: null,
      legend: null,
      periodUnit: null,
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
      datas: [],
      total: [],
      graphDatas: [],
      update: false,
      pdf: { d: 30, start: 0, end: 0, spare: 20, },
      mediaSet: { naver: "네이버SA", kakaosa: "카카오SA", naverda: "네이버GFA", kakaomo: "카카오모먼트", google: "구글" },
    };
  },
  watch: {
    pFromdate() { this.fromdate = this.pFromdate; },
    pTodate() { this.todate = this.pTodate; },
    pLegend() { this.legend = this.pLegend; },
    pPeriodUnit() { this.periodUnit = this.pPeriodUnit; },
    pActiveKpi() { this.kpi = this.pActiveKpi; },
    pMedia() { this.media = this.pMedia; },
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
  },
  components: { linePeriodGraph, crossGraph, },
  mounted() {
    if (store.state.userStore.userinfo) {
      (this.name = store.state.userStore.userinfo.username), (this.legend = this.pLegend);
      this.periodUnit = this.pPeriodUnit;
      this.fromdate = this.pFromdate;
      this.todate = this.pTodate;
      this.media = this.pMedia;
      this.adv = store.state.userStore.userinfo;
      this.managerinfo = store.state.userStore.managerinfo;
    }
  },
  updated() {},
  methods: {
    getDatasForCampaign(index) {
      var vm = this;
      var arr = [];
      var start = (index - 1) * vm.pdf.d;
      var count = vm.pdf.d;
      var spare = vm.pdf.spare;

      if (index === 1) {
        count = spare;
      } else if (index > 1) {
        start = index - 2 > 0 ? vm.pdf.spare + vm.pdf.d * (index - 2) : vm.pdf.spare;
      }

      for (let i = 0; i < count; i++) {
        if (!vm.datas) continue;
        if (!vm.datas.at(start + i)) continue;

        arr.push(vm.datas.at(start + i));
      }
      return arr;
    },
    clickSearchBtn() { this.findCampaignReport(); },
    htmlToPDF() { this.clickSearchBtn(); },
    priceToString(salse) {
      if (salse === undefined) return "";

      return priceToString(salse);
    },
    copyObject(object) { return JSON.parse(JSON.stringify(object)); },
    getGraphDatas(data, type, media) {
      var vm = this;
      var graphDatas = {};

      data.data.media[media]["day"]["graph"].forEach(function (graph) {
        graphDatas[graph.daily_dt] = {
          clk: graph.clk,
          im: graph.im,
          cst: graph.cst,
          cv: graph.cv,
          time: graph.daily_dt,
        };
      });

      vm.$refs.linePeriodGraph[0].setGraph(graphDatas, vm.fromdate, vm.todate);
    },
    initDatas() {
      return {
        naver: {
          campaign_type: [
            { web_site: "파워링크", items: [], class: "campain1" },
            { shopping: "쇼핑검색", items: [], class: "campain2" },
            { power_contents: "파워컨텐츠", items: [], class: "campain3" },
            { brand_search: "브랜드검색", items: [], class: "campain4" },
            { place: "플레이스", items: [], class: "campain5" },
          ],
        },
        kakaosa: {
          campaign_type: [{ none: "캠페인목록", items: [], class: "campain1" }],
        },
        kakaomo: {
          campaign_type: [
            {
              talk_biz_board: "카카오톡비즈보드",
              items: [],
              class: "campain1",
            },
            { display: "디스플레이", items: [], class: "campain2" },
            { talk_channel: "카카오톡 채널", items: [], class: "campain3" },
            { daum_shopping: "다음쇼핑", items: [], class: "campain4" },
            { video: "동영상", items: [], class: "campain5" },
            { sponsored_board: "스폰서드 보드", items: [], class: "campain6" },
          ],
        },
        naverda: {
          campaign_type: [
            { conversion: "웹사이트 전환", items: [], class: "campain1" },
            { web_site_traffic: "웹사이트 트래픽", items: [], class: "campain2" },
            { install_app: "앱 설치", items: [], class: "campain3" },
            { watch_video: "동영상 조회", items: [], class: "campain4" },
            { catalog: "카탈로그 판매", items: [], class: "campain5" },
            { shopping: "쇼핑 프로모션", items: [], class: "campain6" },
          ],
        },
        google: {
          campaign_type: [
            { demand_gen: "디스커버리", items: [], class: "campain1" },
            { display: "디스플레이", items: [], class: "campain2" },
            { hotel: "호텔", items: [], class: "campain3" },
            { local: "지역", items: [], class: "campain4" },
            { local_services: "지역 서비스 광고", items: [], class: "campain5" },
            { multi_channel: "다중 채널", items: [], class: "campain6" },
            { performance_max: "실적 최대화", items: [], class: "campain7" },
            { search: "검색", items: [], class: "campain8" },
            { shopping: "쇼핑", items: [], class: "campain9" },
            { smart: "스마트", items: [], class: "campain10" },
            { travel: "여행", items: [], class: "campain11" },
            { video: "동영상", items: [], class: "campain12" },
            { unknown: "기타", items: [], class: "campain13" },            
            { unspecified: "미지정", items: [], class: "campain14" },                  
          ],
        },         
        total: { clk: 0, im: 0, cst: 0, cv: 0, cr: 0, ctr: 0, cpc: 0, cpa: 0, cvr: 0, roas: 0, },
      };
    },
    getTotal(data, type, media) {
      var vm = this;
      var categorys = [];
      var totalDatas = vm.initDatas();
      var total = totalDatas["total"];

      totalDatas[media]["campaign_type"].forEach(function (campaign) {
        var keys = Object.keys(campaign);
        categorys.push(keys[0]);
      });

      categorys.forEach(function (category, index) {
        var datas = data.data.media[media]["group"][category];
        var count = 0;
        vm.datas.push({
          isMainData: true,
          campaign_id: category,
          campaign_type: category,
          campaign_name: totalDatas[media]["campaign_type"][index][category],
          clk: data.data.media[media]["total"][category]["clk"], //클릭수
          im: data.data.media[media]["total"][category]["im"], //노출수
          cv: data.data.media[media]["total"][category]["cv"], //전환수
          cr: data.data.media[media]["total"][category]["cr"], //전환매출
          cst: data.data.media[media]["total"][category]["cst"], //광고비
          ctr: data.data.media[media]["total"][category]["ctr"], //클릭률
          cpc: data.data.media[media]["total"][category]["cpc"], //클릭 당 비용
          cpa: data.data.media[media]["total"][category]["cpa"], //전환 당 비용
          cvr: data.data.media[media]["total"][category]["cvr"], //전환율
          roas: data.data.media[media]["total"][category]["roas"], //ROAS,
          campain: totalDatas[media]["campaign_type"][index]["class"],
          haschild: datas.length === 0 ? false : true,
        });

        datas.forEach(function (data, index2) {
          vm.datas.push({
            isMainData: false,
            isSubdata: true,
            campaign_id: data.campaign_id,
            campaign_type: data.campaign_type,
            campaign_name: data.campaign_name,
            clk: data.clk, //클릭수
            im: data.im, //노출수
            cv: data.cv, //전환수
            cr: data.cr, //전환매출
            cst: data.cst, //광고비
            ctr: parseFloat(data.ctr).toFixed(2), //클릭률
            cpc: parseFloat(data.cpc).toFixed(0), //클릭 당 비용
            cpa: parseFloat(data.cpa).toFixed(0), //전환 당 비용
            cvr: parseFloat(data.cvr).toFixed(2), //전환율
            roas: parseFloat(data.roas).toFixed(0), //ROAS,
            campain: totalDatas[media]["campaign_type"][index]["class"],
          });

          total.clk += parseFloat(data.clk);
          total.im += parseFloat(data.im);
          total.cv += parseFloat(data.cv);
          total.cr += parseFloat(data.cr);
          total.cst += parseFloat(data.cst);
          total.ctr = parseFloat( total.clk > 0 && total.im > 0 ? (total.clk / total.im) * 100 : 0 ).toFixed(2);
          total.cpc = parseFloat( total.cst > 0 && total.clk > 0 ? total.cst / total.clk : 0 ).toFixed(0);
          total.cpa = parseFloat( total.cst > 0 && total.cv > 0 ? total.cst / total.cv : 0 ).toFixed(0);
          total.cvr = parseFloat( total.cv > 0 && total.clk > 0 ? (total.cv / total.clk) * 100 : 0 ).toFixed(2);
          total.roas = parseFloat( total.cr > 0 && total.cst > 0 ? (total.cr / total.cst) * 100 : 0 ).toFixed(0);
          count += 1;
        });
      });
      vm.total = [];
      vm.total.push(total);
    },
    findCampaignReport() {
      var vm = this;
      $.ajax({
        type: "get", //요청 메소드 방식
        url: API_URL + "/app/analysis/campaignreport",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: { userid: store.state.userStore.userinfo.userid, fromdate: vm.fromdate, todate: vm.todate, session: store.state.userStore.session, },
        beforeSend: function (data) { vm.$emit("showMask"); },
        success: function (data) {
          vm.datas = [];
          vm.responseData = {};

          if (data.result === "success") {
            var type = "media";
            var media = vm.media;
            vm.responseData = vm.copyObject(data);
            var length = vm.datas.length - vm.pdf.spare;
            vm.pdf.end = Math.floor(length / vm.pdf.d);
            var n = length % vm.pdf.d;

            if (vm.pdf.end <= 0) vm.pdf.end += 1;
            else if (n > 0) vm.pdf.end += 1;
            vm.pdf.end += 1; //12개용 페이지 추가

            vm.getTotal(data, type, media);
            vm.$nextTick(function () { vm.getGraphDatas(data, type, media); });

          } else { if (data.status === "0001") { } else { } }
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
    createPDF() {
      var vm = this;
      vm.$htmlToPdf(vm.$refs.pdfArea, "campaign_report_"+moment().format("YYYYMMDDHHmmss"));
      vm.pdfKey += 1;
    },
    handleFinishedLinePeriodGraph() {
      this.createPDF();
      this.$emit("hideMask");
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
