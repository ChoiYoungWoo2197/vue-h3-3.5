<template>
  <div :class="getUniqueId">
    <template v-for="(index, i) in main.adAnalysis.pages[2].kakaomo.pdf.end" :key="index + i + getUuidv4()">
      <div  class="pdf-a4-l adAnalysis">
        <section class="d-flex pdf-card pdf-card-1">
            <div class="sub-title">
              <h2>소재별 분석 - 카카오 모먼트</h2>
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
        <section class="d-flex pdf-card pdf-card-2 kakaomo">
          <div class="report banner">
            <table class="report"  v-if="main.adAnalysis.pages[2].responseData !== null">
                <thead>
                  <tr>
                    <td class="text-center" width="20px">#</td>
                    <td width="12%" class="text-center">캠페인</td>
                    <td width="12%" class="text-center">그룹</td>
                    <td width="20%" class="text-center">소재</td>
                    <template v-for="(k, i) in Object.keys(sortDraggable())">
                      <td :key="k+i+getUuidv4()" v-if="report.activeBtn[k]" class="text-center">{{getKpiName(k)}}</td>
                    </template>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="(d, i) in getDatasForAd('kakaomo', 2, index)" :key="d + i + getUuidv4()">
                    <tr >
                      <td class="text-center"> {{ Number(i) + 1}}</td>
                      <td class="txt-left">
                        <div class="d-flex align-items-center banner-table">
                          <ul style="padding: 0 10px;" class="banner-table-title-ul">
                            <div class="d-flex txt-left">
                              <div class="w-100">
                                <li>{{d.campaign_name}}</li>
                                <li><p class="sub">{{d.campaignid}}</p></li>
                              </div>
                            </div>
                          </ul>
                        </div>
                      </td>   
                      <td class="txt-left">
                        <div class="d-flex align-items-center banner-table">
                          <ul style="padding: 0 10px;" class="banner-table-title-ul">
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
                      <template v-for="(k,i) in Object.keys(sortDraggable())">
                        <td :key="k + i + getUuidv4()" v-if="report.activeBtn[k]">{{priceToString(d[k]) + getUnits(k)}}</td>
                      </template>                                                                                       
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
        adAnalysis: {
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
            {
              kakaosa: {
                responseData: null,
                graph: {},
                report: [],
                kpi10: { im: [], clk: [], ctr: [], cpc: [], cst: [] },
                pdf: { d: 30, start: 0, end: 0, spare: 30 },
              },
            },
            {
              kakaomo: {
                responseData: null,
                graph: {},
                report: [],
                kpi10: { im: [], clk: [], ctr: [], cpc: [], cst: [] },
                pdf: { d: 30, start: 0, end: 0, spare: 30 },
              },
            },
          ],
          total: [
            {
              total: {
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
        display: 10, //게시글의 수 
        medias: ["naver", "kakaosa", "kakaomo"],        
      },
      pdf: {
        search: { d: 15, start: 0, end: 0, spare: 5 },
        banner: { d: 15, start: 0, end: 0, spare: 12 },
      }, 
          
    };
  },
  created() {
    this.setAdAnalysis();
    this.getReport();
  },
  mounted() {
    // this.report = this.copyObject(this.pReport);
  },
  watch: {
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
    getDatasForAd(media, arrindex, index) {
      var vm = this;
      var arr = [];

      var start = (index - 1) * vm.main.adAnalysis.pages[arrindex][media].pdf.d;
      var count = vm.main.adAnalysis.pages[arrindex][media].pdf.d;
      var spare = vm.main.adAnalysis.pages[arrindex][media].pdf.spare;

      if (index === 1) {
        count = spare;
      } else if (index > 1) {
        start =
          index - 2 > 0
            ? vm.main.adAnalysis.pages[arrindex][media].pdf.spare +
              vm.main.adAnalysis.pages[arrindex][media].pdf.d * (index - 2)
            : vm.main.adAnalysis.pages[arrindex][media].pdf.spare;
      }

      for (let i = 0; i < count; i++) {
        if (!vm.main.adAnalysis.pages[arrindex][media].report) continue;
        if (!vm.main.adAnalysis.pages[arrindex][media].report.at(start + i)) continue;

        arr.push(vm.main.adAnalysis.pages[arrindex][media].report.at(start + i));
      }
      // console.log(index, arr);
      return arr;
    },
    getDatasForAdTotal(media, arrindex, index) {
      var vm = this;
      var arr = [];

      var start = (index - 1) * vm.main.adAnalysis.total[arrindex].total.pdf.d;
      var count = vm.main.adAnalysis.total[arrindex].total.pdf.d;
      var spare = vm.main.adAnalysis.total[arrindex].total.pdf.spare;

      if (index === 1) {
        count = spare;
      } else if (index > 1) {
        start =
          index - 2 > 0
            ? vm.main.adAnalysis.total[arrindex].total.pdf.spare +
              vm.main.adAnalysis.total[arrindex].total.pdf.d * (index - 2)
            : vm.main.adAnalysis.total[arrindex].total.pdf.spare;
      }

      for (let i = 0; i < count; i++) {
        if (!vm.main.adAnalysis.total[arrindex].total.report) continue;
        if (!vm.main.adAnalysis.total[arrindex].total.report.at(start + i)) continue;

        arr.push(vm.main.adAnalysis.total[arrindex].total.report.at(start + i));
      }
      // console.log(index, arr);
      return arr;
    },    
    setAdAnalysis() {
      var vm = this;
      vm.main.adAnalysis.pages[0].naver.responseData = {};
      vm.main.adAnalysis.pages[1].kakaosa.responseData = {};
      vm.main.adAnalysis.pages[2].kakaomo.responseData = {};
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
          md: "K",
          start: 0,
          sort: vm.dropdownMenu.kpi.value,
          display: vm.main.display,
          kpi: "",
          base64: "true",
          session: store.state.userStore.session,
        },
        beforeSend: function (data) {},
        success: function (data) {
          if(data.result === "success") {
            ["naver", "kakaosa", "kakaomo"].forEach(function (media, index) {
              if (media === "naver" || media === "kakaosa") return;
              if (vm.report.activePage.adAnalysis && vm.report.activeMedia[media]) {
                vm.main.adAnalysis.pages[index][media].responseData = data;
                vm.main.adAnalysis.pages[index][media].report = [];

                Object.keys(data.data.ads).forEach(function (ad,index2) {
                  var obj = data.data.ads[ad];
                  obj.no = index2 + 1;
                  vm.main.adAnalysis.pages[index][media].report.push(obj);
                });

                var length =
                  vm.main.adAnalysis.pages[index][media].report.length -
                  vm.main.adAnalysis.pages[index][media].pdf.spare;
                vm.main.adAnalysis.pages[index][media].pdf.end = Math.floor(
                  length / vm.main.adAnalysis.pages[index][media].pdf.d
                );
                var n = length % vm.main.adAnalysis.pages[index][media].pdf.d;

                if (vm.main.adAnalysis.pages[index][media].pdf.end <= 0)
                  vm.main.adAnalysis.pages[index][media].pdf.end += 1;
                else if (n > 0) vm.main.adAnalysis.pages[index][media].pdf.end += 1;

                vm.main.adAnalysis.pages[index][media].pdf.end += 1; //12개용 페이지 추가
                vm.$emit('rendering', {graph: 'adreportTotalForKeyword', status: true});
                vm.$emit("finished", {graph: "adreportkakaomoForAdToBanner", status: true});
              }
            });
          }
        },
        error: function (a, b, c) {},
        complete: function (a, b, c) {
          
        },
      });
    }
  },
};
</script>

<style scoped></style>
