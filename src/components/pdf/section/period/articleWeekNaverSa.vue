<template>
  <div :class="getUniqueId">
    <template v-for="(index, i) in main.periodAnalysis.pages[0].naver.week.pdf.end">
      <div :key="index + i + '-' + getUuidv4()" class="pdf-a4-l periodAnalysis">
        <section class="d-flex pdf-card pdf-card-1">
          <div class="sub-title">
            <h2>기간별 분석 - 네이버 검색광고(주차별)</h2>
          </div>
          <div class="d-flex justify-content-between">
            <div class="b-l"></div>
            <template v-if="report">
              <div> {{ report.reportInfo.start + " ~ " + report.reportInfo.end + "" }} </div>
            </template>
          </div>
        </section>
        <section class="d-flex pdf-card pdf-card-2 naver">
          <div v-show="index === 1" class="row justify-content-between" ref="graphs">
            <div class="col crossGraphPeriodOnedayweek d-flex justify-content-center">
              <div id="crossGraphPeriodOnedayweek" class="crossGraphPeriodOnedayweek" ></div>
            </div>
            <div class="col crossGraphPeriodTwodayweek d-flex justify-content-center">
              <div id="crossGraphPeriodTwodayweek" class="crossGraphPeriodTwodayweek" ></div>
            </div>
          </div>
          <div class="report">
            <table class="report">
              <thead>
                <tr>
                  <td class="text-center" width="25%">주차별</td>
                  <template v-for="(k, i) in Object.keys(sortDraggable())">
                    <td :key="k+i+getUuidv4()" v-if="report.activeBtn[k]" class="text-center">{{getKpiName(k)}}</td>
                  </template>
                </tr>
              </thead>
              <tbody v-if="main.periodAnalysis.responseData !== null">
                <tr v-for="(data, index2) in getDatasForPeriod('naver', 0, 'week', index)" :key="index2 + '-' + getUuidv4()" >
                  <td class="text-left">{{ data.time}}</td>
                  <template v-for="(k,i) in Object.keys(sortDraggable())">
                    <td :key="k + i + getUuidv4()" v-if="report.activeBtn[k]">{{priceToString(data[k]) + getUnits(k)}}</td>
                  </template>                  
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        <section class="d-flex pdf-card pdf-card-3">
          <div class="footer">
            <div class="d-flex justify-content-between">
              <img alt="" src="@/assets/image/pdf_logo.png" height="35" />
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
import { isBanner, clearBody, addClassDashboard, priceToString, getMedia, getApp, uuidv4, sortWeekDay, isEmptyObject, getDateStr2, downloadImage, toDataURL, sortDraggable, getKpiName, divideIntoSegments } from "@/assets/js/common.js";
import { store } from "@/store/store.js";
import { SHA256 } from "@/assets/js/sha256.js";
import { API_URL, TEMP_KEY, SUMMARY_SORT, MEDIA_SORT, UNITS,} from "@/configs/config.js";
import "@/assets/css/pdf.total.main.css";
import noimg from "@/assets/image/noimg.png";

export default {
  props: {    pReport: Object,  },
  data() {
    return {
      // mediaAnalysis: this.copyObject(this.pMediaAnalysis),
      report: this.copyObject(this.pReport),
      main: {
        periodAnalysis: {
          pages: [
            {
              naver: {
                hour: {
                  responseData: null,
                  graph: { crossGraphPeriodOnehour: null, crossGraphPeriodTwohour: null },
                  report: [],
                  total: [],
                  pdf: { d: 30, start: 0, end: 0, spare: 20 },
                },
                dayweek: {
                  responseData: null,
                  graph: {
                    crossGraphPeriodOnedayweek: null,
                    crossGraphPeriodTwodayweek: null,
                  },
                  report: [],
                  total: [],
                  pdf: { d: 30, start: 0, end: 0, spare: 20 },
                },
                day: {
                  responseData: null,
                  graph: { crossGraphPeriodOneday: null, crossGraphPeriodTwoday: null },
                  report: [],
                  total: [],
                  pdf: { d: 30, start: 0, end: 0, spare: 20 },
                },
                month: {
                  responseData: null,
                  graph: { crossGraphPeriodOnemonth: null, crossGraphPeriodTwomonth: null },
                  report: [],
                  total: [],
                  pdf: { d: 30, start: 0, end: 0, spare: 20 },
                },
                week: {
                  responseData: null,
                  graph: { crossGraphPeriodOneweek: null, crossGraphPeriodTwoweek: null },
                  report: [],
                  total: [],
                  pdf: { d: 30, start: 0, end: 0, spare: 20 },
                },                
              },
            },
            {
              kakaosa: {
                hour: {
                  responseData: null,
                  graph: { crossGraphPeriodOnehour: null, crossGraphPeriodTwohour: null },
                  report: [],
                  total: [],
                  pdf: { d: 30, start: 0, end: 0, spare: 20 },
                },
                dayweek: {
                  responseData: null,
                  graph: {
                    crossGraphPeriodOnedayweek: null,
                    crossGraphPeriodTwodayweek: null,
                  },
                  report: [],
                  total: [],
                  pdf: { d: 30, start: 0, end: 0, spare: 20 },
                },
                day: {
                  responseData: null,
                  graph: { crossGraphPeriodOneday: null, crossGraphPeriodTwoday: null },
                  report: [],
                  total: [],
                  pdf: { d: 30, start: 0, end: 0, spare: 20 },
                },
                month: {
                  responseData: null,
                  graph: { crossGraphPeriodOnemonth: null, crossGraphPeriodTwomonth: null },
                  report: [],
                  total: [],
                  pdf: { d: 30, start: 0, end: 0, spare: 20 },
                },
                week: {
                  responseData: null,
                  graph: { crossGraphPeriodOneweek: null, crossGraphPeriodTwoweek: null },
                  report: [],
                  total: [],
                  pdf: { d: 30, start: 0, end: 0, spare: 20 },
                },  
              },
            },
            {
              kakaomo: {
                hour: {
                  graph: { crossGraphPeriodOnehour: null, crossGraphPeriodTwohour: null },
                  report: [],
                  total: [],
                  pdf: { d: 30, start: 0, end: 0, spare: 20 },
                },
                dayweek: {
                  graph: {
                    crossGraphPeriodOnedayweek: null,
                    crossGraphPeriodTwodayweek: null,
                  },
                  report: [],
                  total: [],
                  pdf: { d: 30, start: 0, end: 0, spare: 20 },
                },
                day: {
                  graph: { crossGraphPeriodOneday: null, crossGraphPeriodTwoday: null },
                  report: [],
                  total: [],
                  pdf: { d: 30, start: 0, end: 0, spare: 20 },
                },
                month: {
                  graph: { crossGraphPeriodOnemonth: null, crossGraphPeriodTwomonth: null },
                  report: [],
                  total: [],
                  pdf: { d: 30, start: 0, end: 0, spare: 20 },
                },
                week: {
                  responseData: null,
                  graph: { crossGraphPeriodOneweek: null, crossGraphPeriodTwoweek: null },
                  report: [],
                  total: [],
                  pdf: { d: 30, start: 0, end: 0, spare: 20 },
                },  
              },
            },
          ],
          total: [
            {
              hour: {
                total: {
                  graph: {
                    crossGraphPeriodTotalOnehour: null,
                    crossGraphPeriodTotalTwohour: null,
                  },
                  report: [],
                  total: [],
                  pdf: { d: 30, start: 0, end: 0, spare: 20 },
                },
              },
            },
            {
              dayweek: {
                total: {
                  graph: {
                    crossGraphPeriodTotalOnedayweek: null,
                    crossGraphPeriodTotalTwodayweek: null,
                  },
                  report: [],
                  total: [],
                  pdf: { d: 30, start: 0, end: 0, spare: 20 },
                },
              },
            },
            {
              month: {
                total: {
                  graph: {
                    crossGraphPeriodTotalOnemonth: null,
                    crossGraphPeriodTotalTwomonth: null,
                  },
                  report: [],
                  total: [],
                  pdf: { d: 30, start: 0, end: 0, spare: 20 },
                },
              },
            },
            {
              day: {
                total: {
                  graph: {
                    crossGraphPeriodTotalOneday: null,
                    crossGraphPeriodTotalTwoday: null,
                  },
                  report: [],
                  total: [],
                  pdf: { d: 30, start: 0, end: 0, spare: 20 },
                },
              },
            },
            {
              week: {
                total: {
                  graph: {
                    crossGraphPeriodTotalOneweek: null,
                    crossGraphPeriodTotalTwoweek: null,
                  },
                  report: [],
                  total: [],
                  pdf: { d: 30, start: 0, end: 0, spare: 20 },
                },
              },
            },            
          ],
          activeKpi: null,
          activeMedia: null,
          activeBtn: {
            hour: true,
            dayweek: false,
            day: false,
            month: false,
            week: false,
            period: "",
            periodUnit: "hour",
          },
          datas: [],
        },  
        start: 0, //현재 페이지
        display: 20, //게시글의 수 
        medias: ["naver", "kakaosa", "kakaomo"],        
      },
      pdf: {
        search: { d: 15, start: 0, end: 0, spare: 5 },
        banner: { d: 15, start: 0, end: 0, spare: 12 },
      }, 
          
    };
  },
  created() {
    this.setPeriodAnalysis();
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
    getMedia(media) { return (media) => getMedia(media); },    
  },
  methods: {
    sortDraggable() { return sortDraggable(this.report.draggable); },
    getKpiName(kpi) { return getKpiName(kpi); },            
    copyObject(object) { return Object.assign({}, object); },
    isEmptyObject(obj) { return isEmptyObject(obj); },
    priceToString(salse) {
      if (salse === undefined) return "";
      return priceToString(salse);
    },
    getUuidv4() { return uuidv4(); },
    getUnits(unit) { return UNITS[unit]; }, 
    handleNoImg(e) { e.target.src = noimg; },    
    getSum(arr) {
      var result = arr.reduce(function add(sum, currValue) { return parseFloat(sum) + parseFloat(currValue); }, 0);
      return result;
    },  
    isOneMedia() {
      let vm = this;
      let v = 0;
      var keys = Object.keys(vm.report.activeMedia);
      for (let k = 0; k < keys.length; k++) { if (vm.report.activeMedia[keys[k]]) v++; }
      return v === 1 ? true : false;
    },  
    setPeriodAnalysis() {
      var vm = this;
      vm.main.periodAnalysis.pages[0].naver.responseData = {};
      vm.main.periodAnalysis.pages[1].kakaosa.responseData = {};
      vm.main.periodAnalysis.pages[2].kakaomo.responseData = {};
    },
    getDatasForPeriod(media, arrindex, time, index) {
      var vm = this;
      var arr = [];
      var start = (index - 1) * vm.main.periodAnalysis.pages[arrindex][media][time].pdf.d;
      var count = vm.main.periodAnalysis.pages[arrindex][media][time].pdf.d;
      var spare = vm.main.periodAnalysis.pages[arrindex][media][time].pdf.spare;

      if (index === 1) { count = spare; } 
      else if (index > 1) { start = index - 2 > 0 ? vm.main.periodAnalysis.pages[arrindex][media][time].pdf.spare + vm.main.periodAnalysis.pages[arrindex][media][time].pdf.d * (index - 2) : vm.main.periodAnalysis.pages[arrindex][media][time].pdf.spare; }

      for (let i = 0; i < count; i++) {
        if (!vm.main.periodAnalysis.pages[arrindex][media][time].report) continue;
        if (!vm.main.periodAnalysis.pages[arrindex][media][time].report.at(start + i))
          continue;

        arr.push(vm.main.periodAnalysis.pages[arrindex][media][time].report.at(start + i));
      }
      // console.log(index, arr);
      return arr;
    },    
    getReport() {
      var vm = this;
      if (vm.report.activePage.periodAnalysis) {
        var periodreportForWeek = $.ajax({
          type: "get",
          url: API_URL + "/app/analysis/periodreport",
          headers: { authorization: SHA256(TEMP_KEY) },
          data: {
            userid: store.state.userStore.userinfo.userid,
            fromdate: vm.report.reportInfo.start,
            todate: vm.report.reportInfo.end,
            periodunit: "week",
            session: store.state.userStore.session,
          },
          success: function (data) {
            if (data.result === "success") {
            } else {
              if (data.status === "0001") {
                vm.$emit("expireSession");
              } else {
              }
            }
          },
          error: function () {},
        });

        $.when(periodreportForWeek).done(function(periodreportForWeek) {
          if(periodreportForWeek.result === "success") {
            var isData = false;
            vm.main.medias.forEach(function (media, index) {
              if (vm.report.activePage.periodAnalysis && vm.report.activeMedia[media]) {
                isData = true;
                vm.main.periodAnalysis.pages[index][media].week.responseData = periodreportForWeek;
                var media = media;
                var type = media === "kakaomo" ? "dsp" : "sa";
                let values = { cst: [], cv: [], clk: [], im: [], times: [] };
                vm.main.periodAnalysis.pages[index][media].week.report = [];
                var graphDatas;
                var totalDatas;
  
                var length = vm.main.periodAnalysis.pages[index][media].week.report.length - vm.main.periodAnalysis.pages[index][media].week.pdf.spare;
                vm.main.periodAnalysis.pages[index][media].week.pdf.end = Math.floor( length / vm.main.periodAnalysis.pages[index][media].week.pdf.d );
                var n = length % vm.main.periodAnalysis.pages[index][media].week.pdf.d;

                if (vm.main.periodAnalysis.pages[index][media].week.pdf.end <= 0)
                  vm.main.periodAnalysis.pages[index][media].week.pdf.end += 1;
                else if (n > 0)
                  vm.main.periodAnalysis.pages[index][media].week.pdf.end += 1;

                vm.main.periodAnalysis.pages[index][media].week.pdf.end += 1; //12개용 페이지 추가

                Object.keys( vm.main.periodAnalysis.pages[index][media].week.graph ).forEach(function (graph, index2) {
                  if (vm.main.periodAnalysis.pages[index][media].week.graph[graph])
                    vm.main.periodAnalysis.pages[index][media].week.graph[graph].dispose();

                  vm.$nextTick(function () {

                  });
                });
              }
            });

            if (isData) {
              
              vm.main.periodAnalysis.total[1].week.total.report = [];
              if (vm.isOneMedia()) {
                vm.$emit('rendering', {graph: 'crossGraphPeriodTotalOneweek', status: true});
                vm.$emit('rendering', {graph: 'crossGraphPeriodTotalTwoweek', status: true});
                // return true;
              } else {
                var obj = { clk: {}, cr: {}, cst: {}, cv: {}, im: {} };
                var obj2 = { clk: {}, cr: {}, cst: {}, cv: {}, im: {}, ctr: {}, cpc: {}, cpa: {}, cvr: {}, roas: {}, };
                let values = { clk: [], cr: [], cst: [], cv: [], im: [], ctr: [], cpc: [], cpa: [], cvr: [], roas: [], };
                vm.main.medias.forEach(function (media, index) {
                  if (vm.report.activePage.periodAnalysis && vm.report.activeMedia[media]) {
                    Object.keys(periodreportForWeek.data.media[media]).forEach(
                      function (week, index2) {
                        ["clk", "cr", "cst", "cv", "im"].forEach(function (kpi,index3) {
                          var o = periodreportForWeek.data.media[media][week];
                          if (!obj[kpi][week]) obj[kpi][week] = [];

                          var v;
                          typeof o[kpi] === "string" ? (v = o[kpi].replace(",", "")) : (v = o[kpi]);
                          obj[kpi][week].push(v);
                        });
                      }
                    );
                  }
                });



                let periods = [];
                var week = { mon: "월요일", tue: "화요일", wed: "수요일", thu: "목요일", fri: "금요일", sat: "토요일", sun: "일요일", };

                ["mon", "tue", "wed", "thu", "fri", "sat", "sun"].forEach(function ( dayweek, i ) {
                  vm.main.periodAnalysis.total[1].dayweek.total.report.push({
                    clk: values["clk"][i],
                    cpa: values["cpa"][i],
                    cpc: values["cpc"][i],
                    cr: values["cr"][i],
                    cst: values["cst"][i],
                    ctr: values["ctr"][i],
                    cv: values["cv"][i],
                    cvr: values["cvr"][i],
                    im: values["im"][i],
                    roas: values["roas"][i],
                    time: week[dayweek],
                  });
                  periods.push(week[dayweek]);
                });

                var length =
                  vm.main.periodAnalysis.total[1].dayweek.total.report.length -
                  vm.main.periodAnalysis.total[1].dayweek.total.pdf.spare;
                vm.main.periodAnalysis.total[1].dayweek.total.pdf.end = Math.floor(
                  length / vm.main.periodAnalysis.total[1].dayweek.total.pdf.d
                );
                var n = length % vm.main.periodAnalysis.total[1].dayweek.total.pdf.d;

                if (vm.main.periodAnalysis.total[1].dayweek.total.pdf.end <= 0)
                  vm.main.periodAnalysis.total[1].dayweek.total.pdf.end += 1;
                else if (n > 0) vm.main.periodAnalysis.total[1].dayweek.total.pdf.end += 1;

                vm.main.periodAnalysis.total[1].dayweek.total.pdf.end += 1; //12개용 페이지 추가
                Object.keys(vm.main.periodAnalysis.total[1].dayweek.total.graph).forEach(
                  function (graph, index2) {
                    if (vm.main.periodAnalysis.total[1].dayweek.total.graph[graph])
                      vm.main.periodAnalysis.total[1].dayweek.total.graph[graph].dispose();
                    vm.$nextTick(function () {
                      if(document.querySelector(".periodAnalysis " + " ." + "naver" + " #" + graph)) {
                        vm.main.periodAnalysis.total[1].dayweek.total.graph[graph] = echarts.init(document.querySelector(".periodAnalysis " + " ." + "naver" + " #" + graph));
                        var option = {
                              color: ["#1795F0", "#6664DA", "#4EDF9F", "#4DC6DF"],
                              tooltip: {
                                trigger: "axis",
                                axisPointer: {
                                  type: "cross",
                                  crossStyle: { color: "#999" },
                                },
                              },
                              toolbox: { feature: {} },
                              grid: { width: "80%", height: "auto" },
                              legend: {
                                show: true,
                                data: !index2 ? ["노출수", "클릭수"] : ["광고비", "전환수"],
                                top: "93%",
                                left: "center",
                                orient: "horizontal",
                                textStyle: { fontSize: "12", fontWeight: "normal" },
                              },
                              xAxis: [
                                {
                                  type: "category",
                                  data: periods,
                                  axisPointer: { type: "shadow" },
                                  axisLabel: { fontSize: "12" },
                                },
                              ],
                              yAxis: [
                                {
                                  type: "value",
                                  name: !index2 ? "노출수" : "광고비",
                                  axisLabel: { formatter: "{value}" },
                                  axisLabel: { fontSize: "12" },
                                },
                                {
                                  type: "value",
                                  name: !index2 ? "클릭수" : "전환수",
                                  axisLabel: { formatter: "{value}" },
                                  axisLabel: { fontSize: "12" },
                                },
                              ],
                              series: [
                                {
                                  name: !index2 ? "노출수" : "광고비",
                                  type: "bar",
                                  tooltip: {
                                    valueFormatter: function (value) {
                                      return value;
                                    },
                                  },
                                  data: !index2 ? values.im : values.cst,
                                  label: {
                                    show: false,
                                    position: "top",
                                    textStyle: { fontSize: "12", fontWeight: "bold" },
                                    formatter: function (value) {
                                      return priceToString(value.value);
                                    },
                                  },
                                  barWidth: 20,
                                },
                                {
                                  name: !index2 ? "클릭수" : "전환수",
                                  type: "line",
                                  yAxisIndex: 1,
                                  tooltip: {
                                    valueFormatter: function (value) {
                                      return value;
                                    },
                                  },
                                  data: !index2 ? values.clk : values.cv,
                                },
                              ],
                        };
                        vm.main.periodAnalysis.total[1].dayweek.total.graph[graph].setOption(option);
                        vm.main.periodAnalysis.total[1].dayweek.total.graph[graph].on("finished", function () {vm.$emit("finished", {graph: graph, status: true});});
                      }
                    });
                  }
                );
              }
            }            
          }
        }).then();
      }

    }
  },
};
</script>

<style scoped></style>

