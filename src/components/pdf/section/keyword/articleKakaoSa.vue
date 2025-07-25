<template>
  <div :class="getUniqueId">
    <template v-for="(index, i) in main.keywordAnalysis.pages[1].kakaosa.pdf.end" :key="index + i + getUuidv4()">
      <div  class="pdf-a4-l keywordAnalysis">
        <section class="d-flex pdf-card pdf-card-1">
            <div class="sub-title">
              <h2>키워드 분석 - 카카오 검색광고</h2>
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
        <section class="d-flex pdf-card pdf-card-2 kakaosa">
          <div class="report keyword10-container" v-if="main.keywordAnalysis.pages[1].kakaosa.responseData !== null">
            <template v-for="(k, i) in Object.keys(sortDraggable())" :key="k + i + getUuidv4()">
              <div  class="keyword10-container-item">
                <table>
                  <thead>
                    <tr><td colspan="4" class="text-center">{{'TOP10 ' + getKpiName(k) }}</td></tr>
                    <tr>
                      <th class="text-center" width="22%">캠페인</th>
                      <th class="text-center" width="22%">그룹</th>
                      <th class="text-center" width="22%">키워드</th>
                      <th class="text-center">{{getKpiName(k)}}</th>                      
                    </tr>
                  </thead>
                  <tbody>
                    <template v-for="(d, i) in main.keywordAnalysis.pages[1].kakaosa.responseData.data.kpis[k]" :key="d+i+getUuidv4">
                      <tr >
                        <td class="text-center">{{d.campaign_name}}</td>
                        <td class="text-center">{{d.adgroup_name}}</td>
                        <td class="text-center">{{d.keyword_name}}</td>
                        <td class="text-center kpi">{{priceToString(d[k]) + getUnits(k) }}</td>
                      </tr>
                    </template>
                  </tbody>
                </table>
              </div>
            </template>
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
    keywordAnalysis: Object,
    pReport: Object,
    pDropdownMenu: Object,
  },
  data() {
    return {
      // mediaAnalysis: this.copyObject(this.pMediaAnalysis),
      report: this.copyObject(this.pReport),
      dropdownMenu: this.copyObject(this.pDropdownMenu),
      main: {
        keywordAnalysis: {
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
          ],
          total: [
            {
              total: {
                responseData: null,
                graph: {},
                report: [],
                kpi10: { im: [], clk: [], ctr: [], cpc: [], cst: [] },
                pdf: { d: 30, start: 0, end: 0, spare: 20 },
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
    this.setKeywordAnalysis();
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
    pDropdownMenu: {
      deep: true,
      handler(value) {
        this.dropdownMenu = this.copyObject(value);
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
      // console.log(salse, main.mediaAnalysis.datas.sa.kakaosa);
      if (salse === undefined) return "";

      return priceToString(salse);
    },
    priceByMedia(media, k) {
      let banner = isBanner(media);
      let v = banner ? this.priceToString(this.main.mediaAnalysis.datas.dsp[media][k]) : this.priceToString(this.main.mediaAnalysis.datas.sa[media][k]);
      return v.length ? v : 0;
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
    setKeywordAnalysis() {
      var vm = this;
      vm.main.keywordAnalysis.pages[0].naver.responseData = {};
      vm.main.keywordAnalysis.pages[1].kakaosa.responseData = {};
    },    
    getDatasForKeyword(media, arrindex, index) {
      var vm = this;
      var arr = [];

      var start = (index - 1) * vm.main.keywordAnalysis.pages[arrindex][media].pdf.d;
      var count = vm.main.keywordAnalysis.pages[arrindex][media].pdf.d;
      var spare = vm.main.keywordAnalysis.pages[arrindex][media].pdf.spare;

      if (index === 1) {
        count = spare;
      } else if (index > 1) {
        start =
          index - 2 > 0
            ? vm.main.keywordAnalysis.pages[arrindex][media].pdf.spare +
              vm.main.keywordAnalysis.pages[arrindex][media].pdf.d * (index - 2)
            : vm.main.keywordAnalysis.pages[arrindex][media].pdf.spare;
      }

      for (let i = 0; i < count; i++) {
        if (!vm.main.keywordAnalysis.pages[arrindex][media].report) continue;
        if (!vm.main.keywordAnalysis.pages[arrindex][media].report.at(start + i)) continue;

        arr.push(vm.main.keywordAnalysis.pages[arrindex][media].report.at(start + i));
      }
      // console.log(index, arr);
      return arr;
    },
    getDatasForKeywordTotal(media, arrindex, index) {
      var vm = this;
      var arr = [];

      var start = (index - 1) * vm.main.keywordAnalysis.total[arrindex][media].pdf.d;
      var count = vm.main.keywordAnalysis.total[arrindex][media].pdf.d;
      var spare = vm.main.keywordAnalysis.total[arrindex][media].pdf.spare;

      if (index === 1) {
        count = spare;
      } else if (index > 1) {
        start =
          index - 2 > 0
            ? vm.main.keywordAnalysis.total[arrindex][media].pdf.spare +
              vm.main.keywordAnalysis.total[arrindex][media].pdf.d * (index - 2)
            : vm.main.keywordAnalysis.total[arrindex][media].pdf.spare;
      }

      for (let i = 0; i < count; i++) {
        if (!vm.main.keywordAnalysis.total[arrindex][media].report) continue;
        if (!vm.main.keywordAnalysis.total[arrindex][media].report.at(start + i)) continue;

        arr.push(vm.main.keywordAnalysis.total[arrindex][media].report.at(start + i));
      }
      // console.log(index, arr);
      return arr;
    },    
    getReport() {
      let vm = this;
      $.ajax({
        type: "get", //요청 메소드 방식
        url: API_URL + "/app/analysis/keywordreport",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          fromdate: vm.report.reportInfo.start,
          todate: vm.report.reportInfo.end,
          campaigntype: "",
          adgroupid: "",
          md: "D",
          start: 0,
          sort: vm.dropdownMenu.kpi.value,
          display: vm.main.display,
          totalcount: "-1",
          kpi: "im,clk,ctr,cpc,cst,cv,cr,cvr,cpa,roas",
          session: store.state.userStore.session,
        },
        beforeSend: function (data) {},
        success: function (data) {
          if(data.result === "success") {
            ["naver", "kakaosa"].forEach(function (media, index) {
              if (media === "naver") return;
              if (vm.report.activePage.keywordAnalysis && vm.report.activeMedia[media]) {
                vm.main.keywordAnalysis.pages[index][media].responseData = data;
                vm.main.keywordAnalysis.pages[index][media].report = [];
                vm.main.keywordAnalysis.pages[index][media].pdf.end = 1; //12개용 페이지 추가
                vm.$emit('rendering', {graph: 'keywordreportTotalForKeyword', status: true});
                vm.$emit("finished", {graph: "keywordreportkakaosaForKeyword", status: true});
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
