<template>
  <div :class="getUniqueId" class="pdf-a4-l adAnalysis" >
    <button @click="downloadPDF">pdf</button>
    <section class="d-flex pdf-card pdf-card-1">
      <div class="sub-title">
        <h2>
          {{ "배너별 리포트" + " - " }}
          <span>{{ "GFA" }}</span>
        </h2>
      </div>
      <div class="d-flex justify-content-between">
        <div class="b-l"></div>
        <template v-if="report">
          <div>
            {{ report.reportInfo.start + " ~ " + report.reportInfo.end + "" }}
          </div>
        </template>
      </div>
    </section>
      <section class="d-flex pdf-card pdf-card-2 gfa">
        <div class="report banner">
          <table>
            <thead>
              <tr>
                <td class="text-center" width="20px">#</td>
                <td width="15%" class="text-center">캠페인</td>
                <td width="15%" class="text-center">그룹</td>
                <td width="25%" class="text-center">소재</td>
                <td v-if="report.activeBtn.im" class="text-center">노출수</td>
                <td v-if="report.activeBtn.clk" class="text-center">클릭수</td>
                <td v-if="report.activeBtn.ctr" class="text-center">클릭율</td>
                <td v-if="report.activeBtn.cpc" class="text-center">클릭당비용</td>
                <td v-if="report.activeBtn.cst" class="text-center">광고비</td>
                <td v-if="report.activeBtn.cv" class="text-center">전환수</td>
                <td v-if="report.activeBtn.cvr" class="text-center">전환율</td>
                <td v-if="report.activeBtn.cr" class="text-center">전환매출</td>
                <td v-if="report.activeBtn.cpa" class="text-center">전환당비용</td>
                <td v-if="report.activeBtn.roas" class="text-center">ROAS</td>
              </tr>
            </thead>
            <tbody>
              <template v-for="(d, i) in main.datas">
                <tr :key="i + getUuidv4()">
                  <td class="text-center">{{ Number(i)+1}}</td>
                  <td class="txt-left">
                    <div class="d-flex align-items-center">
                      <ul style="padding: 0 10px;">
                        <div class="d-flex txt-left">
                          <div class="w-100">
                            <li class=""><p>{{d.campaign_name}}</p></li>
                            <li><p class="sub">{{d.campaignid}}</p></li>
                          </div>
                        </div>
                      </ul>                      
                    </div>
                  </td>
                  <td class="txt-left">
                    <div class="d-flex align-items-center">
                      <ul style="padding: 0 10px;">
                        <div class="d-flex txt-left">
                          <div class="w-100">
                            <li class=""><p>{{d.adgroup_name}}</p></li>
                            <li><p class="sub">{{d.adgroup_id}}</p></li>
                          </div>
                        </div>
                      </ul>                      
                    </div>                    
                  </td>
                  <td class="txt-left">
                    <div class="d-flex align-items-center banner-table">
                      <div class="position-relative h-100 banner-table-title-icon">
                        <span class="d-block">
                          <img class="img-thumbnail" :src="d.ad_image_pbase64" @error="handleNoImg"/>
                        </span>
                      </div>
                      <ul style="padding: 0 10px;" class="banner-table-title-ul">
                        <div class="d-flex txt-left">
                          <div class="w-100">
                            <li class=""><p>{{d.ad_headline}}</p></li>
                            <li><p class="sub">{{d.ad_id}}</p></li>
                          </div>
                        </div>
                      </ul>
                    </div>
                  </td>
                  <td v-if="report.activeBtn.im" v-text="priceToString(d.im) + getUnits('im')"></td>
                  <td v-if="report.activeBtn.clk" v-text="priceToString(d.clk) + getUnits('clk')"></td>
                  <td v-if="report.activeBtn.ctr" v-text="priceToString(d.ctr) + getUnits('ctr')"></td>
                  <td v-if="report.activeBtn.cpc" v-text="priceToString(d.cpc) + getUnits('cpc')"></td>
                  <td v-if="report.activeBtn.cst" v-text="priceToString(d.cst) + getUnits('cst')"></td>
                  <td v-if="report.activeBtn.cv"  v-text="priceToString(d.cv) + getUnits('cv')"></td>
                  <td v-if="report.activeBtn.cvr" v-text="priceToString(d.cvr) + getUnits('cvr')"></td>
                  <td v-if="report.activeBtn.cr"  v-text="priceToString(d.cr) + getUnits('cr')"></td>
                  <td v-if="report.activeBtn.cpa" v-text="priceToString(d.cpa) + getUnits('cpa')"></td>
                  <td v-if="report.activeBtn.roas" v-text="priceToString(d.roas) + getUnits('roas')"></td>                  
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </section>
    <section class="d-flex pdf-card pdf-card-3">
      <div class="footer">
        <div class="d-flex justify-content-between">
          <img alt="" src="../../../../assets/image/pdf_logo.png" height="35" />
          <!-- <div>{{ mediaAnalysis.page }}</div> -->
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import $ from "jquery";
import moment from "moment";
import { clearBody, addClassDashboard, priceToString, getMedia, getApp, uuidv4, sortWeekDay, isEmptyObject, getDateStr2, downloadImage, toDataURL } from "../../../../assets/js/common.js";
import { store } from "../../../../store/store.js";
import { SHA256 } from "../../../../assets/js/sha256.js";
import { API_URL, TEMP_KEY, SUMMARY_SORT, MEDIA_SORT, UNITS,} from "../../../../configs/config.js";
import "../../../../assets/css/pdf.total.main.css";
import noimg from "../../../../assets/image/noimg.png";

export default {
  props: {
    pReport: Object,
  },
  data() {
    return {
      mediaAnalysis: this.copyObject(this.pMediaAnalysis),
      report: this.copyObject(this.pReport),
      main: {
        datas: [],
        start: 0, //현재 페이지
        display: 10, //게시글의 수        
      },
      pdf: {
        search: { d: 15, start: 0, end: 0, spare: 5 },
        banner: { d: 15, start: 0, end: 0, spare: 12 },
      },
    };
  },
  created() {
    this.getReport();
  },
  mounted() {
    let vm = this;
// vm.$htmlToPdf(vm.$refs.pdfArea, moment().format("LLLL") + "-" + "캠페인분석");
  },
  watch: {
    pMediaAnalysis: {
      deep: true,
      handler(value) {
        this.mediaAnalysis = this.copyObject(value);
      },
    },
    pReport: {
      deep: true,
      handler(value) {
        this.report = this.copyObject(value);
      },
    },
  },
  computed: {
    getUniqueId() {
      if (!this.uniqueId) {
        this.uniqueId = "vm-modal-" + this._uid;
        return this.uniqueId;
      }
      return this.uniqueId;
    },
  },
  destroyed() {
    
  },
  methods: {
    copyObject(object) {
      return Object.assign({}, object);
    },
    isEmptyObject(obj) {
      return isEmptyObject(obj);
    },
    priceToString(salse) {
      if (salse === undefined) return "";

      return priceToString(salse);
    },
    getUuidv4() {
      return uuidv4();
    },
    getUnits(unit) {
      return UNITS[unit];
    }, 
    handleNoImg(e) {
      e.target.src = noimg;
    },       
    getReport() {
      let vm = this;
      $.ajax({
        type: "get", //요청 메소드 방식
        url: API_URL + "/app/analysis/adreport",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          fromdate: vm.report.reportInfo.start,
          todate: vm.report.reportInfo.end,
          type: "banner",
          md: "Nda",
          start: vm.main.start,
          sort: "imd",
          display: vm.main.display,
          kpi: "",
          base64: "true",
          session: store.state.userStore.session,
        },
        beforeSend: function (data) {},
        success: function (data) {
          if (data.result === "success") {
            vm.main.datas = [];
            vm.main.datas = vm.copyObject(data.data.ads);
          } else {
          }
        },
        error: function (a, b, c) {},
        complete: function (a, b, c) {
          
        },
      });
    },
    async downloadPDF() {
      let vm = this;
      // await vm.getReport();
      vm.$nextTick().then(() => {
        vm.$emit("pdf", vm.getUniqueId);
        // vm.$htmlToPdf(vm.$refs.pdfArea, moment().format("LLLL") + "-" + "캠페인분석");
      });
    },
  },
};
</script>

<style scoped></style>
