<template>
  <article :id="getUniqueId" class="pdf-container">
    <div ref="pdfArea" class="main" :key="pdfKey">
      <div class="pdf-a4-l pdf-section-1">
        <section class="d-flex justify-content-between card-1 pdf-card pdf-card-1">
          <div class="title mb-0">
            <h2>HEEIL<br />REPORT</h2>
            <div class="b-l"></div>
          </div>
          <div class="logo">
            <img src="../../assets/image/pdf_main_logo.png" height="35" />
          </div>
        </section>
        <section class="d-flex justify-content-between card-2 pdf-card pdf-card-2">
          <div class="adv">
            <template v-if="adv !== null">
              <h3 class="bold">
                {{ adv.usercompany }}
                <span>{{ " | " + fromdate + " ~ " + todate + "" }}</span>
              </h3>
            </template>
          </div>
        </section>
        <section class="d-flex justify-content-between card-3 pdf-card pdf-card-3">
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
      <template v-if="main">
        <div v-for="index in pdf.end" :key="index" class="pdf-a4-l pdf-section-ad">
          <section class="d-flex pdf-card pdf-card-1">
            <div class="sub-title">
              <h2>{{ "N쇼핑검색광고" }}</h2>
            </div>
            <div class="d-flex justify-content-between">
              <div class="b-l"></div>
              <div>{{ fromdate + " ~ " + todate + "" }}</div>
            </div>
          </section>
          <section class="d-flex pdf-card pdf-card-2">
            <template v-if="index === 1">
              <div class="top10">
                <div class="top10-card">
                  <template v-if="activeTopAd">
                    <div class="mb-3">
                      <h3 v-if="activeBtn.ctr === true">클릭율 BEST 상품</h3>
                      <h3 v-if="activeBtn.im === true">노출수 BEST 상품</h3>
                      <h3 v-if="activeBtn.cv === true">전환수 BEST 상품</h3>
                      <h3 v-if="activeBtn.cr === true">전환매출 BEST 상품</h3>
                      <h3 v-if="activeBtn.clk === true">클릭수 BEST 상품</h3>
                      <h3 v-if="activeBtn.cpc === true">CPC BEST 상품</h3>
                      <h3 v-if="activeBtn.cst === true">광고비 BEST 상품</h3>
                      <h3 v-if="activeBtn.roas === true">ROAS BEST 상품</h3>
                      <h3 v-if="activeBtn.cpa === true">전환당비용 BEST 상품</h3>
                    </div>
                  </template>
                  <!-- <h3 v-if="activeTopAd !== null" class="mb-2">BEST</h3> -->
                  <table>
                    <thead>
                      <tr>
                        <td width="2%" class="text-left">#</td>
                        <td width="15%" class="text-left">캠페인</td>
                        <td width="15%" class="text-left">그룹</td>
                        <td width="15%" class="text-left">네이버쇼핑ID</td>
                        <td width="15%" class="text-left">쇼핑몰상품ID</td>
                        <!-- <td width="8%" class="text-left">상품</td> -->
                        <td width="" class="text-left">상품명</td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(data, index) in activeTopAd" :key="data.ad_id + 'L'">
                        <td class="text-left">{{ index + 1 }}</td>
                        <td class="text-left">{{ data.campaign_name }}</td>
                        <td class="text-left">{{ data.adgroup_name }}</td>
                        <td class="text-left">{{ data.ad_pid }}</td>
                        <td class="text-left">{{ data.ad_pidofmall }}</td>
                        <!-- <td class="text-left"></td> -->
                        <td class="text-left">{{ data.ad_productname }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </template>
            <div class="report">
              <table class="report">
                <thead>
                  <tr>
                    <td width="20px" class="text-center">#</td>
                    <td width="15%" class="text-center">상품ID (소재ID)</td>
                    <td width="28%" class="text-center">상품명 (노출상품명)</td>
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
                  <tr
                    v-for="(data, index2) in getDatasForAd(index)"
                    :key="data.ad_pid + '-' + index2"
                    :class="
                      data.isMainData === true
                        ? ['maindata', 'collapsed']
                        : ['subdata', 'collapse', 'show', data.link]
                    "
                    :data-toggle="data.isMainData === true ? '' : ''"
                    :data-target="data.isMainData === true ? '.' + data.link : ''"
                    :aria-expande="data.isMainData === true ? 'false' : ''"
                  >
                    <template v-if="data.target === 0">
                      <td colspan="10" class="text-center">
                        데이터가 존재하지 않습니다.
                      </td>
                    </template>
                    <template v-else>
                      <template v-if="data.isMainData === true">
                        <td class="text-center">{{ data.index }}</td>
                        <td class="text-left">
                          {{ data.adPid }}
                          <!-- <a class="btn" data-toggle="modal" data-target="#keyword-modal" @click="clickShoppingAnalysisModal(data.adPid)"><i class="bi bi-box-arrow-up-right"></i></a> -->
                        </td>
                        <td class="text-left" v-text="data.adProductName"></td>
                      </template>
                      <template v-else>
                        <td></td>
                        <td class="text-left" v-text="data.adid"></td>
                        <td class="text-left" v-text="data.adProductName"></td>
                      </template>
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
      </template>
    </div>
  </article>
</template>

<script>
import $ from "jquery";
import moment from "moment";
import * as echarts from "echarts";
import { priceToString, getMedia, uuidv4, toDataURL } from "../../assets/js/common.js";
import { store } from "../../store/store.js";
import { SHA256 } from "../../assets/js/sha256.js";
import { API_URL, TEMP_KEY } from "../../configs/config.js";
import "../../assets/css/pdf.main.css";

export default {
  props: {
    pFromdate: String,
    pTodate: String,
    pActiveBtn: Object,
    pMain: Object,
    pActiveTopAd: Array,
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
      main: null,
      activeTopAd: null,
      //   activeMedia: null,
      activeBtn: null,
      pdf: {
        d: 20,
        start: 0,
        end: 0,
        spare: 20,
      },
    };
  },
  watch: {
    pFromdate() {
      this.fromdate = this.pFromdate;
    },
    pTodate() {
      this.todate = this.pTodate;
    },
    pActiveBtn: {
      deep: true,
      handler(value) {
        this.activeBtn = this.copyObject(value);
      },
    },
    // pActiveMedia: {
    //   deep: true,
    //   handler(value) {
    //     this.activeMedia = this.copyObject(value);
    //   }
    // },
    pMain: {
      deep: true,
      handler(value) {
        this.main = this.copyObject(value);
      },
    },
    pActiveTopAd: {
      deep: true,
      handler(value) {
        this.activeTopAd = this.copyObject(value);
      },
    },
  },
  computed: {
    // getDatasForMain() {
    //     // console.log(this.main.data);
    //     return this.main? this.main.data : null;
    // },
    getUniqueId() {
      if (!this.uniqueId) {
        this.uniqueId = "vm-" + this._uid;
        return this.uniqueId;
      }
      return this.uniqueId;
    },
    getUuidv4() {
      return uuidv4();
    },
  },
  components: {},
  mounted() {
    if (store.state.userStore.userinfo) {
      this.name = store.state.userStore.userinfo.username;
      this.fromdate = this.pFromdate;
      this.todate = this.pTodate;
      // this.kpi = this.pKpi;
      this.activeBtn = this.copyObject(this.pActiveBtn);
      this.main = this.copyObject(this.pMain);
      this.activeTopAd = this.copyObject(this.pActiveTopAd);
      this.adv = store.state.userStore.userinfo;
      this.managerinfo = store.state.userStore.managerinfo;
    }
  },
  updated() {
    if (this.update) {
    }
  },
  methods: {
    getDatasForAd(index) {
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
        if (!vm.main.data) continue;
        if (!vm.main.data.at(start + i)) continue;

        // console.log(index ,start+i, vm.datas.at(start+i));
        arr.push(vm.main.data.at(start + i));
      }
      // console.log(index, arr);
      return arr;
    },
    getActiveTopAd() {
      var vm = this;
      vm.activeTopAd = [];

      // console.log(vm.activeBtn.kpi, vm.main.topads[vm.activeBtn.kpi]);
      vm.activeTopAd = vm.main.topads[vm.activeBtn.kpi].slice();
    },
    getTopKpi() {
      var vm = this;
      // var date = vm.$refs.dateRangePicker.getDate();

      $.ajax({
        type: "get", //요청 메소드 방식
        url: API_URL + "/app/shopping/shoppingreport",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          fromdate: vm.fromdate,
          todate: vm.todate,
          kpi: "cst,im,cv,cpa,cpc,ctr,clk,cr,roas",
          session: store.state.userStore.session,
        },
        beforeSend: function (data) {
          vm.$emit("showMask");
          // vm.handleShowMask();
          // vm.showMaskPannelForTop = true;
        },
        success: function (data) {
          if (data.result === "success") {
            // console.log(data);
            vm.main.topads = null;
            vm.main.topads = data.data.topads;
            vm.getActiveTopAd();
            vm.getReport();
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
        complete: function (a, b, c) {
          vm.$emit("hideMask");
          // vm.handleHideMask();
          // vm.showMaskPannelForTop = false;
        },
      });
    },
    getTotal(targets) {
      var vm = this;
      var data = [];
      targets.forEach(function (maindata, index) {
        var targets = maindata.targets.length > 0 ? true : false;
        data.push({
          isMainData: true,
          adPid: maindata.ad_pid,
          adProductName: "전체",
          clk: maindata.clk,
          cpa: maindata.cpa,
          cpc: maindata.cpc,
          cr: maindata.cr,
          cst: maindata.cst,
          ctr: maindata.ctr,
          cv: maindata.cv,
          cvr: maindata.cvr,
          im: maindata.im,
          roas: maindata.roas,
          targets: targets,
          index: index + 1,
          link: "link" + "-" + maindata.ad_pid,
        });

        if (maindata.targets.length > 0) {
          // console.log(target.targets);
          maindata.targets.forEach(function (subdata) {
            data.push({
              isMainData: false,
              adid: subdata.ad_id,
              adPid: subdata.ad_pid,
              adPidofmall: subdata.ad_pidofmall,
              adPimageurl: subdata.ad_pimageurl,
              adProductName: subdata.ad_productname,
              campaignId: subdata.campaign_id,
              campaignName: subdata.campaign_name,
              adgroupId: subdata.adgroup_id,
              adgroupName: subdata.adgroup_name,
              clk: subdata.clk,
              cpa: subdata.cpa,
              cpc: subdata.cpc,
              cr: subdata.cr,
              cst: subdata.cst,
              ctr: subdata.ctr,
              cv: subdata.cv,
              cvr: subdata.cvr,
              im: subdata.im,
              roas: subdata.roas,
              target: subdata.target,
              link: "link" + "-" + maindata.ad_pid,
            });
          });
        } else {
          data.push({
            isMainData: false,
            target: 0,
            link: "link" + "-" + maindata.ad_pid,
          });
        }
      });

      return data;
    },
    getReport() {
      var vm = this;
      // var date = vm.$refs.dateRangePicker.getDate();

      // var maindatas = document.querySelectorAll(".maindata");
      // maindatas.forEach(function (maindata) {
      //     maindata.setAttribute("aria-expanded", "false");
      //     maindata.classList.add("collapsed");
      // });

      $.ajax({
        type: "get", //요청 메소드 방식
        url: API_URL + "/app/shopping/shoppingreport",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          fromdate: vm.fromdate,
          todate: vm.todate,
          start: vm.main.start,
          sort: vm.main.sort,
          display: vm.main.display,
          totalcount: vm.main.isTotalCount,
          kpi: "",
          session: store.state.userStore.session,
        },
        beforeSend: function (data) {
          // vm.handleShowMask();
          // vm.showMaskPannelForReport = true;
        },
        success: function (data) {
          if (data.result === "success") {
            vm.main.data = [];
            vm.main.responseData = null;
            vm.main.responseData = data;
            // vm.main.data = data.data !== undefined ? data.data.ads : '';

            vm.main.data = vm.getTotal(data.data.ads);
            var length = vm.main.data.length - vm.pdf.spare;
            vm.pdf.end = Math.floor(length / vm.pdf.d);
            var n = length % vm.pdf.d;

            if (vm.pdf.end <= 0) vm.pdf.end += 1;
            else if (n > 0) vm.pdf.end += 1;

            vm.pdf.end += 1; //12개용 페이지 추가

            // if(data.data) {
            //     data.data.ads.forEach(function(ad, index) {
            //         var o = ad;
            //         o.index = index+1;
            //         vm.main.data.push(o);
            //     });
            // }

            // console.log(vm.main.data);

            vm.$nextTick(function () {
              vm.createPDF();
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
        },
        complete: function (a, b, c) {
          // vm.handleHideMask();
          // vm.showMaskPannelForReport = false;
        },
      });
    },
    clickSearchBtn() {
      this.getTopKpi();
    },
    copyObject(object) {
      return JSON.parse(JSON.stringify(object));
    },
    htmlToPDF() {
      // const name = 'document';
      this.clickSearchBtn();
    },
    priceToString(salse) {
      if (salse === undefined) return "";

      return priceToString(salse);
    },
    createPDF() {
      var vm = this;
      vm.$htmlToPdf(vm.$refs.pdfArea, moment().format("LLLL") + "-" + "쇼핑검색광고");
      vm.pdfKey += 1;
      vm.$emit("hideMask");
    },
  },
};
</script>

<style scoped>
/* section-ad */
.pdf-section-ad {
  position: relative;
  background-image: url("../../assets/image/pdf_inner_bg.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
.pdf-section-ad .pdf-card-1,
.pdf-section-ad .pdf-card-2,
.pdf-section-ad .pdf-card-3 {
  padding: 0 100px 0 100px;
}
.pdf-section-ad .pdf-card-1 {
  height: 20%;
  flex-direction: column;
  padding-top: 100px;
}
.pdf-section-ad .pdf-card-1 .sub-title {
  padding-bottom: 50px;
}
.pdf-section-ad .pdf-card-1 .sub-title h2 {
  color: #555;
  font-size: 3rem;
  font-weight: 600;
}
.pdf-section-ad .pdf-card-1 .b-l {
  border-top: 8px solid #3771f8;
  width: 5%;
}
.pdf-section-ad .pdf-card-1 .b-l + div {
  font-size: 20px;
}
.pdf-section-ad .pdf-card-2 {
  padding-top: 30px;
  flex-direction: column;
  max-height: 80%;
  overflow: hidden;
}
.pdf-section-ad .pdf-card-2 .top10 {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between !important;
}
.pdf-section-ad .pdf-card-2 .top10 h3 {
  color: #555;
  font-weight: 600;
  font-size: 2rem;
}
.pdf-section-ad .pdf-card-2 .top10 .top10-card {
  width: 100%;
  box-shadow: none;
  border-radius: 0%;
  padding: 0%;
  height: auto;
  margin-bottom: 75px;
}
.pdf-section-ad .pdf-card-2 .top10 .top10-card table {
  font-size: 18px;
  border: 1px solid #ddd;
  border-radius: 19px;
}
.pdf-section-ad .pdf-card-2 .top10 .top10-card thead tr {
  color: #eee;
  font-weight: 700 !important;
  font-size: 21px;
}
.pdf-section-ad .pdf-card-2 .top10 .top10-card thead td {
  background: #386abe !important;
  color: inherit !important;
}
.pdf-section-ad .pdf-card-2 .top10 .top10-card tbody tr {
}
.pdf-section-ad .pdf-card-2 .top10 .top10-card tbody td:first-child {
  /* font-weight: 700;
  background: #cde2fd; */
}

.pdf-section-ad .pdf-card-2 .top10 .top10-card tr {
  height: 34px;
}
.pdf-section-ad .pdf-card-2 .top10 .top10-card td {
  padding: 2px 12px;
  border: 1px solid #ddd;
  background: #fff;
  text-align: right;
}
.pdf-section-ad .pdf-card-2 .report {
  width: 100%;
}
.pdf-section-ad .pdf-card-2 .report table {
  font-size: 19px;
  border: 1px solid #ddd;
  border-radius: 15px;
}
.pdf-section-ad .pdf-card-2 .report thead tr {
  color: #eee;
  font-weight: 700 !important;
  font-size: 21px;
}
.pdf-section-ad .pdf-card-2 .report thead td {
  background: #386abe !important;
  color: inherit !important;
}
.pdf-section-ad .pdf-card-2 .report tbody tr {
}
.pdf-section-ad .pdf-card-2 .report tr {
  height: 30px;
}
.pdf-section-ad .pdf-card-2 .report td {
  padding: 2px 12px;
  border: 1px solid #ddd;
  background: #fff;
  text-align: right;
}
.pdf-section-ad .pdf-card-2 .report table tr.maindata td {
  font-weight: 700;
  background: #d0e1ff !important;
}
.pdf-section-ad .pdf-card-2 .report table tr.total td {
  font-weight: 700;
  background: #e6e6e6 !important;
}
.pdf-section-ad .pdf-card-3 {
  height: 20%;
  flex-direction: column;
}
.pdf-section-ad .pdf-card-3 div div {
  font-size: 20px;
}
.pdf-section-ad .pdf-card-3 .footer {
  padding-bottom: 30px;
}
.grap {
  width: 2000px;
  height: 350px;
  display: block !important;
}
</style>
