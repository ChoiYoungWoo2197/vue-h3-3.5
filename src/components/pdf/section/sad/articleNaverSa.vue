<template>
  <div :class="getUniqueId">
    <template v-for="(index, i) in main.shoppingAnalysis.pages[0].naver.pdf.end" :key="index + i + '-' + getUuidv4()">
      <div  class="pdf-a4-l shoppingAnalysis">
        <section class="d-flex pdf-card pdf-card-1">
            <div class="sub-title">
              <h2>N쇼핑검색광고 - 네이버</h2>
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
        <section class="d-flex pdf-card pdf-card-2 naver">
            <div class="report">
              <table class="report">
                <thead>
                  <tr>
                    <td width="20px" class="text-center">#</td>
                    <td width="15%" class="text-center">상품ID (소재ID)</td>
                    <td width="28%" class="text-center">상품명 (노출상품명)</td>
                    <template v-for="(k, i) in Object.keys(sortDraggable())">
                      <td :key="k+i+getUuidv4()" v-if="report.activeBtn[k]" class="text-center">{{getKpiName(k)}}</td>
                    </template>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(data, index2) in getDatasForShoppingAd('naver', 0, index)" :key="data.ad_pid + '-' + index2" :class="data.isMainData === true ? ['maindata', 'collapsed'] : ['subdata', 'collapse', 'show', data.link]">
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
                        </td>
                        <td class="text-left" v-text="data.adProductName"></td>
                      </template>
                      <template v-else>
                        <td></td>
                        <td class="text-left" v-text="data.adid"></td>
                        <td class="text-left" v-text="data.adProductName"></td>
                      </template>
                      <template v-for="(k,i) in Object.keys(sortDraggable())">
                        <td :key="k + i + getUuidv4()" v-if="report.activeBtn[k]">{{priceToString(data[k]) + getUnits(k)}}</td>
                      </template>    
                    </template>
                  </tr>
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
  </div>
</template>

<script>
import $ from "jquery";
import moment from "moment";
import * as echarts from "echarts";
import { isBanner, clearBody, addClassDashboard, priceToString, getMedia, getApp, uuidv4, sortWeekDay, isEmptyObject, getDateStr2, downloadImage, toDataURL, sortDraggable, getKpiName } from "../../../../assets/js/common.js";
import { store } from "../../../../store/store.js";
import { SHA256 } from "../../../../assets/js/sha256.js";
import { API_URL, TEMP_KEY, SUMMARY_SORT, MEDIA_SORT, UNITS,} from "../../../../configs/config.js";
import "../../../../assets/css/pdf.total.main.css";
import noimg from "../../../../assets/image/noimg.png";

export default {
  props: {
    pReport: Object,
    pDropdownMenu: Object,
  },
  data() {
    return {
      // mediaAnalysis: this.copyObject(this.pMediaAnalysis),
      report: this.copyObject(this.pReport),
      dropdownMenu: this.copyObject(this.pDropdownMenu),
      main: {
        shoppingAnalysis: {
          pages: [
            {
              naver: {
                responseData: null,
                graph: {},
                report: [],
                kpi10: { im: [], clk: [], ctr: [], cpc: [], cst: [] },
                pdf: { d: 30, start: 0, end: 0, spare: 30 },
              },
            },
          ],
        },    
        start: 0, //현재 페이지
        display: 30, //게시글의 수 
        medias: ["naver", "kakaosa", "kakaomo"],        
      },
      pdf: {
        search: { d: 15, start: 0, end: 0, spare: 5 },
        banner: { d: 15, start: 0, end: 0, spare: 12 },
      }, 
          
    };
  },
  created() {
    this.setShoppingAnalysis();
    this.getReport();
  },
  mounted() {
    // this.report = this.copyObject(this.pReport);
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
    getMedia(media) {
      return (media) => getMedia(media);
    },    
  },
  methods: {
    sortDraggable() {
      return sortDraggable(this.report.draggable);
    },
    getKpiName(kpi) {
      return getKpiName(kpi);
    },        
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
    getSum(arr) {
      var result = arr.reduce(function add(sum, currValue) {
        return parseFloat(sum) + parseFloat(currValue);
      }, 0);

      return result;
    },  
    isOneMedia() {
      let vm = this;
      let v = 0;
      var keys = Object.keys(vm.report.activeMedia);
      for (let k = 0; k < keys.length; k++) {
        if (vm.report.activeMedia[keys[k]]) v++;
      }
      return v === 1 ? true : false;
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
        total: {
          clk: 0, //클릭수
          im: 0, //노출수
          cst: 0, //광고비
          cv: 0, //전환수
          cr: 0, //전환매출
          ctr: 0, //클릭률
          cpc: 0, //클릭 당 비용
          cpa: 0, //전환 당 비용
          cvr: 0, //전환율
          roas: 0, //ROAS
        },
      };
    },    
    getDatasForShoppingAd(media, arrindex, index) {
      var vm = this;
      var arr = [];

      var start = (index - 1) * vm.main.shoppingAnalysis.pages[arrindex][media].pdf.d;
      var count = vm.main.shoppingAnalysis.pages[arrindex][media].pdf.d;
      var spare = vm.main.shoppingAnalysis.pages[arrindex][media].pdf.spare;

      if (index === 1) {
        count = spare;
      } else if (index > 1) {
        start =
          index - 2 > 0
            ? vm.main.shoppingAnalysis.pages[arrindex][media].pdf.spare +
              vm.main.shoppingAnalysis.pages[arrindex][media].pdf.d * (index - 2)
            : vm.main.shoppingAnalysis.pages[arrindex][media].pdf.spare;
      }

      for (let i = 0; i < count; i++) {
        if (!vm.main.shoppingAnalysis.pages[arrindex][media].report) continue;
        if (!vm.main.shoppingAnalysis.pages[arrindex][media].report.at(start + i)) continue;

        arr.push(vm.main.shoppingAnalysis.pages[arrindex][media].report.at(start + i));
      }
      // console.log(index, arr);
      return arr;
    }, 
    setShoppingAnalysis() {
      var vm = this;
      vm.main.shoppingAnalysis.pages[0].naver.responseData = {};
    },
    getTotalForShoppingAd(targets) {
      var vm = this;
      var data = [];
      targets.forEach(function (maindata, index) {
        // console.log(maindata);
        var targets = [];
        data.push({
          isMainData: true,
          adPid: maindata.ad_pid,
          adProductName: maindata.ad_pname || maindata.ad_productname,
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

        if (targets.length > 0) {
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
          // data.push({
          //   isMainData: false,
          //   target: 0,
          //   link: "link" + "-" + maindata.ad_pid,
          // });
        }
      });

      return data;
    },       
    getReport() {
      let vm = this;
      $.ajax({
        type: "get",
        url: API_URL + "/app/shopping/shoppingreport",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          fromdate: vm.report.reportInfo.start,
          todate: vm.report.reportInfo.end,
          start: 0,
          sort: vm.dropdownMenu.kpi.value,
          display: vm.main.display,
          totalcount: "-1",
          kpi: "",
          session: store.state.userStore.session,
        },
        success: function (data) {
          if (data.result === "success") {
            ["naver"].forEach(function (media, index) {
              if (vm.report.activePage.shoppingAnalysis && vm.report.activeMedia[media]) {
                vm.main.shoppingAnalysis.pages[index][media].responseData = data;
                vm.main.shoppingAnalysis.pages[index][media].report = [];
                vm.main.shoppingAnalysis.pages[index][media].report = vm.getTotalForShoppingAd(data.data.ads);

                var length =
                  vm.main.shoppingAnalysis.pages[index][media].report.length -
                  vm.main.shoppingAnalysis.pages[index][media].pdf.spare;
                vm.main.shoppingAnalysis.pages[index][media].pdf.end = Math.floor(
                  length / vm.main.shoppingAnalysis.pages[index][media].pdf.d
                );
                var n = length % vm.main.shoppingAnalysis.pages[index][media].pdf.d;

                if (vm.main.shoppingAnalysis.pages[index][media].pdf.end <= 0)
                  vm.main.shoppingAnalysis.pages[index][media].pdf.end += 1;
                else if (n > 0) vm.main.shoppingAnalysis.pages[index][media].pdf.end += 1;

                vm.main.shoppingAnalysis.pages[index][media].pdf.end += 1; //12개용 페이지 추가
                vm.$emit("finished", {graph: "shoppingreportForShoppingAd", status: true});
              }
            });
          } else {
            if (data.status === "0001") {
              vm.$emit("expireSession");
            } else {
            }
          }
        },
        error: function () {},
      });      
    }
  },
};
</script>

<style scoped></style>
