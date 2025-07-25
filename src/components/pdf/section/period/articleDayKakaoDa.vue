<template>
  <div :class="getUniqueId">
    <template v-for="(index, i) in main.periodAnalysis.pages[2].kakaomo.day.pdf.end" :key="index + i + '-' + getUuidv4()">
      <div  class="pdf-a4-l periodAnalysis">
        <section class="d-flex pdf-card pdf-card-1">
          <div class="sub-title">
            <h2>기간별 분석 - 카카오 모먼트(일별)</h2>
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
          <div v-show="index === 1" class="row justify-content-between" ref="graphs">
            <div class="col crossGraphPeriodOneday d-flex justify-content-center">
              <div
                id="crossGraphPeriodOneday"
                class="crossGraphPeriodOneday"
              ></div>
            </div>
            <div class="col crossGraphPeriodTwoday d-flex justify-content-center">
              <div
                id="crossGraphPeriodTwoday"
                class="crossGraphPeriodTwoday"
              ></div>
            </div>
          </div>
          <div class="report">
            <table class="report">
              <thead>
                <tr>
                  <td class="text-center" width="25%">일별</td>
                  <template v-for="(k, i) in Object.keys(sortDraggable())">
                    <td :key="k+i+getUuidv4()" v-if="report.activeBtn[k]" class="text-center">{{getKpiName(k)}}</td>
                  </template>
                </tr>
              </thead>
              <tbody v-if="main.periodAnalysis.responseData !== null">
                <tr
                  v-for="(data, index2) in getDatasForPeriod('kakaomo', 2, 'day', index)"
                  :key="index2 + '-' + getUuidv4()"
                >
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
  },
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
          ],
          activeKpi: null,
          activeMedia: null,
          activeBtn: {
            hour: true,
            dayweek: false,
            day: false,
            month: false,
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
    setPeriodAnalysis() {
      var vm = this;
      vm.main.periodAnalysis.pages[0].naver.responseData = {};
      vm.main.periodAnalysis.pages[1].kakaosa.responseData = {};
      vm.main.periodAnalysis.pages[2].kakaomo.responseData = {};
    },
    sortHour(data, fromDate, toDate) {
      var vm = this;
      var sorted = {
        media: {
          kakaomo: {},
          kakaosa: {},
          naver: {},
        },
        total: {
          summary: {},
        },
      };

      ["total", "kakaomo", "kakaosa", "naver"].forEach(function (currentMedia, index) {
        if (!vm.report.activeMedia[currentMedia]) return;

        for (var j = 0; j <= 23; j++) {
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
          var newObject = new Object();
          var hour = j < 10 ? "0" + j : j;

          var diff = moment(toDate).diff(fromDate, "days");

          for (var i = 0; i <= diff; i++) {
            var currentDay = moment(fromDate).add(i, "days").format("YYYY-MM-DD");
            var obj =
              currentMedia === "total"
                ? data["total"]["summary"][currentDay]
                : data["media"][currentMedia][currentDay];

            if (!obj || obj.length === 0) {
              clk.push(0);
              im.push(0);
              cst.push(0);
              cv.push(0);
              cr.push(0);
              ctr.push(0);
              cpc.push(0);
              cpa.push(0);
              cvr.push(0);
              roas.push(0);
              continue;
            }

            clk.push(obj[hour]["clk"]);
            im.push(obj[hour]["im"]);
            cst.push(obj[hour]["cst"]);
            cv.push(obj[hour]["cv"]);
            cr.push(obj[hour]["cr"]);
            obj[hour]["ctr"] === undefined
              ? ctr.push(0)
              : isNaN(obj[hour]["ctr"])
              ? ctr.push(obj[hour]["ctr"].replace(",", ""))
              : ctr.push(obj[hour]["ctr"]);
            obj[hour]["cpc"] === undefined
              ? cpc.push(0)
              : isNaN(obj[hour]["cpc"])
              ? cpc.push(obj[hour]["cpc"].replace(",", ""))
              : cpc.push(obj[hour]["cpc"]);
            obj[hour]["cpa"] === undefined
              ? cpa.push(0)
              : isNaN(obj[hour]["cpa"])
              ? cpa.push(obj[hour]["cpa"].replace(",", ""))
              : cpa.push(obj[hour]["cpa"]);
            obj[hour]["cvr"] === undefined
              ? cvr.push(0)
              : isNaN(obj[hour]["cvr"])
              ? cvr.push(obj[hour]["cvr"].replace(",", ""))
              : cvr.push(obj[hour]["cvr"]);
            obj[hour]["roas"] === undefined
              ? roas.push(0)
              : isNaN(obj[hour]["roas"])
              ? roas.push(obj[hour]["roas"].replace(",", ""))
              : roas.push(obj[hour]["roas"]);
          }

          newObject["clk"] = vm.getSum(clk);
          newObject["im"] = vm.getSum(im);
          newObject["cst"] = vm.getSum(cst);
          newObject["cv"] = vm.getSum(cv);
          newObject["cr"] = vm.getSum(cr);

          newObject["ctr"] =
            vm.getSum(ctr) > 0 && vm.getSum(im) > 0
              ? ((vm.getSum(clk) / vm.getSum(im)) * 100).toFixed(2)
              : 0;
          newObject["cpc"] =
            vm.getSum(cst) > 0 && vm.getSum(clk) > 0
              ? (vm.getSum(cst) / vm.getSum(clk)).toFixed(0)
              : 0;
          newObject["cpa"] =
            vm.getSum(cst) > 0 && vm.getSum(cv) > 0
              ? (vm.getSum(cst) / vm.getSum(cv)).toFixed(0)
              : 0;
          newObject["cvr"] =
            vm.getSum(cv) > 0 && vm.getSum(clk) > 0
              ? ((vm.getSum(cv) / vm.getSum(clk)) * 100).toFixed(2)
              : 0;
          newObject["roas"] =
            vm.getSum(cr) > 0 && vm.getSum(cst) > 0
              ? ((vm.getSum(cr) / vm.getSum(cst)) * 100).toFixed(0)
              : 0;

          currentMedia === "total"
            ? (sorted["total"][hour] = newObject)
            : (sorted["media"][currentMedia][hour] = newObject);
        }
      });

      return sorted;
    },    
    getDatasForPeriod(media, arrindex, time, index) {
      var vm = this;
      var arr = [];
      // console.log(media, arrindex, index, vm.campaignAnalysis.pages[arrindex][media]);

      var start = (index - 1) * vm.main.periodAnalysis.pages[arrindex][media][time].pdf.d;
      var count = vm.main.periodAnalysis.pages[arrindex][media][time].pdf.d;
      var spare = vm.main.periodAnalysis.pages[arrindex][media][time].pdf.spare;

      if (index === 1) {
        count = spare;
      } else if (index > 1) {
        start =
          index - 2 > 0
            ? vm.main.periodAnalysis.pages[arrindex][media][time].pdf.spare +
              vm.main.periodAnalysis.pages[arrindex][media][time].pdf.d * (index - 2)
            : vm.main.periodAnalysis.pages[arrindex][media][time].pdf.spare;
      }

      for (let i = 0; i < count; i++) {
        if (!vm.main.periodAnalysis.pages[arrindex][media][time].report) continue;
        if (!vm.main.periodAnalysis.pages[arrindex][media][time].report.at(start + i))
          continue;

        arr.push(vm.main.periodAnalysis.pages[arrindex][media][time].report.at(start + i));
      }
      // console.log(index, arr);
      return arr;
    },    
    getDatasForPeriodTotal(arrindex, time, index) {
      var vm = this;
      var arr = [];
      // console.log(media, arrindex, index, vm.campaignAnalysis.pages[arrindex][media]);

      var start = (index - 1) * vm.main.periodAnalysis.total[arrindex][time].total.pdf.d;
      var count = vm.main.periodAnalysis.total[arrindex][time].total.pdf.d;
      var spare = vm.main.periodAnalysis.total[arrindex][time].total.pdf.spare;

      if (index === 1) {
        count = spare;
      } else if (index > 1) {
        start =
          index - 2 > 0
            ? vm.main.periodAnalysis.total[arrindex][time].total.pdf.spare +
              vm.main.periodAnalysis.total[arrindex][time].total.pdf.d * (index - 2)
            : vm.main.periodAnalysis.total[arrindex][time].total.pdf.spare;
      }

      for (let i = 0; i < count; i++) {
        if (!vm.main.periodAnalysis.total[arrindex][time].total.report) continue;
        if (!vm.main.periodAnalysis.total[arrindex][time].total.report.at(start + i)) continue;

        arr.push(vm.main.periodAnalysis.total[arrindex][time].total.report.at(start + i));
      }
      // console.log(index, arr);
      return arr;
    },    
    getReport() {
      var vm = this;
      if (vm.report.activePage.periodAnalysis) {
        var periodreportForDay = $.ajax({
          type: "get",
          url: API_URL + "/app/analysis/periodreport",
          headers: { authorization: SHA256(TEMP_KEY) },
          data: {
            userid: store.state.userStore.userinfo.userid,
            fromdate: vm.report.reportInfo.start,
            todate: vm.report.reportInfo.end,
            periodunit: "day",
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
        $.when(periodreportForDay)
        .done(function(periodreportForDay) {
          if(periodreportForDay.result === "success") {
            var isData = false;
            vm.main.medias.forEach(function (media, index) {
              if (
                vm.report.activePage.periodAnalysis &&
                vm.report.activeMedia[media]
              ) {
                isData = true;
                vm.main.periodAnalysis.pages[index][media].day.responseData =
                  periodreportForDay;
                var media = media;
                var type = media === "kakaomo" ? "dsp" : "sa";
                let values = { cst: [], cv: [], clk: [], im: [], times: [] };
                vm.main.periodAnalysis.pages[index][media].day.report = [];
                var graphDatas;
                var totalDatas;

                totalDatas = periodreportForDay.data.media[media];
                Object.keys(totalDatas).forEach(function (date, index2) {
                  var obj = totalDatas[date];
                  obj.time = date;

                  values.times.push(date);
                  values.cst.push(obj.cst);
                  values.cv.push(obj.cv);
                  values.clk.push(obj.clk);
                  values.im.push(obj.im);
                  vm.main.periodAnalysis.pages[index][media].day.report.push(obj);
                });

                var length =
                  vm.main.periodAnalysis.pages[index][media].day.report.length -
                  vm.main.periodAnalysis.pages[index][media].day.pdf.spare;
                vm.main.periodAnalysis.pages[index][media].day.pdf.end = Math.floor(
                  length / vm.main.periodAnalysis.pages[index][media].day.pdf.d
                );
                var n = length % vm.main.periodAnalysis.pages[index][media].day.pdf.d;

                if (vm.main.periodAnalysis.pages[index][media].day.pdf.end <= 0)
                  vm.main.periodAnalysis.pages[index][media].day.pdf.end += 1;
                else if (n > 0)
                  vm.main.periodAnalysis.pages[index][media].day.pdf.end += 1;

                vm.main.periodAnalysis.pages[index][media].day.pdf.end += 1; //12개용 페이지 추가

                Object.keys(vm.main.periodAnalysis.pages[index][media].day.graph).forEach(
                  function (graph, index2) {
                    if (vm.main.periodAnalysis.pages[index][media].day.graph[graph])
                      vm.main.periodAnalysis.pages[index][media].day.graph[graph].dispose();

                    vm.$nextTick(function () {
                      if(document.querySelector(".periodAnalysis " + " ." + media + " #" + graph)) {
                        vm.main.periodAnalysis.pages[index][media].day.graph[graph] = echarts.init(document.querySelector(".periodAnalysis " + " ." + media + " #" + graph));
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
                              data: values.times,
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
                        vm.main.periodAnalysis.pages[index][media].day.graph[graph].setOption(option);
                        vm.main.periodAnalysis.pages[index][media].day.graph[graph].on("finished", function () { vm.$emit("finished", { graph: graph + media, status: true });});
                      }
                    });
                  }
                );
              }
            });

            if (isData) {
              vm.main.periodAnalysis.total[3].day.total.report = [];
              if (vm.isOneMedia()) {
                vm.$emit('rendering', {graph: 'crossGraphPeriodTotalOneday', status: true});
                vm.$emit('rendering', {graph: 'crossGraphPeriodTotalTwoday', status: true});
                // return true;
              } else {
                var obj = { clk: {}, cr: {}, cst: {}, cv: {}, im: {} };
                var obj2 = {
                  clk: {},
                  cr: {},
                  cst: {},
                  cv: {},
                  im: {},
                  ctr: {},
                  cpc: {},
                  cpa: {},
                  cvr: {},
                  roas: {},
                };
                let values = {
                  clk: [],
                  cr: [],
                  cst: [],
                  cv: [],
                  im: [],
                  ctr: [],
                  cpc: [],
                  cpa: [],
                  cvr: [],
                  roas: [],
                };

                vm.main.medias.forEach(function (media, index) {
                  if (vm.report.activePage.periodAnalysis && vm.report.activeMedia[media]) {
                    Object.keys(periodreportForDay.data.media[media]).forEach(
                      function (day, index2) {
                        ["clk", "cr", "cst", "cv", "im"].forEach(function (kpi,index3) {
                          var o = periodreportForDay.data.media[media][day];
                          if (!obj[kpi][day]) obj[kpi][day] = [];

                          var v;
                          typeof o[kpi] === "string"
                            ? (v = o[kpi].replace(",", ""))
                            : (v = o[kpi]);
                          obj[kpi][day].push(v);
                        });
                      }
                    );
                  }
                });

                Object.keys(obj).forEach(function (kpi, index) {
                  Object.keys(obj[kpi]).forEach(function (date, index) {
                    var date = date;
                    obj2[kpi][date] = vm.getSum(obj[kpi][date]);
                    values[kpi].push(obj2[kpi][date]);
                  });
                });

                var diff = moment(vm.report.reportInfo.end).diff(vm.report.reportInfo.start,"days");
                ["ctr", "cpc", "cpa", "cvr", "roas"].forEach(function (kpi, index) {
                  for (var i = 0; i <= diff; i++) {
                    var date = moment(vm.report.reportInfo.start)
                      .add(i, "days")
                      .format("YYYY-MM-DD");

                    if (!obj2[kpi][date]) obj2[kpi][date] = {};
                    if (kpi === "ctr") {
                      obj2[kpi][date] =
                        obj2["clk"][date] > 0 && obj2["im"][date] > 0
                          ? ((obj2["clk"][date] / obj2["im"][date]) * 100).toFixed(2)
                          : 0;
                    }
                    if (kpi === "cpc") {
                      obj2[kpi][date] =
                        obj2["cst"][date] > 0 && obj2["clk"][date] > 0
                          ? (obj2["cst"][date] / obj2["clk"][date]).toFixed(0)
                          : 0;
                    }
                    if (kpi === "cpa") {
                      obj2[kpi][date] =
                        obj2["cst"][date] > 0 && obj2["cv"][date] > 0
                          ? (obj2["cst"][date] / obj2["cv"][date]).toFixed(0)
                          : 0;
                    }
                    if (kpi === "cvr") {
                      obj2[kpi][date] =
                        obj2["cv"][date] > 0 && obj2["clk"][date] > 0
                          ? ((obj2["cv"][date] / obj2["clk"][date]) * 100).toFixed(2)
                          : 0;
                    }
                    if (kpi === "roas") {
                      obj2[kpi][date] =
                        obj2["cr"][date] > 0 && obj2["cst"][date] > 0
                          ? ((obj2["cr"][date] / obj2["cst"][date]) * 100).toFixed(0)
                          : 0;
                    }

                    values[kpi].push(obj2[kpi][date]);
                  }
                });

                let periods = [];
                for (var i = 0; i <= diff; i++) {
                  var date = moment(vm.report.reportInfo.start)
                    .add(i, "days")
                    .format("YYYY-MM-DD");

                  vm.main.periodAnalysis.total[3].day.total.report.push({
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
                    time: date,
                  });
                  periods.push(date);
                }

                var length =
                  vm.main.periodAnalysis.total[3].day.total.report.length -
                  vm.main.periodAnalysis.total[3].day.total.pdf.spare;
                vm.main.periodAnalysis.total[3].day.total.pdf.end = Math.floor(
                  length / vm.main.periodAnalysis.total[3].day.total.pdf.d
                );
                var n = length % vm.main.periodAnalysis.total[3].day.total.pdf.d;

                if (vm.main.periodAnalysis.total[3].day.total.pdf.end <= 0)
                  vm.main.periodAnalysis.total[3].day.total.pdf.end += 1;
                else if (n > 0) vm.main.periodAnalysis.total[3].day.total.pdf.end += 1;

                vm.main.periodAnalysis.total[3].day.total.pdf.end += 1; //12개용 페이지 추가

                Object.keys(vm.main.periodAnalysis.total[3].day.total.graph).forEach(
                  function (graph, index2) {
                    if (vm.main.periodAnalysis.total[3].day.total.graph[graph])
                      vm.main.periodAnalysis.total[3].day.total.graph[graph].dispose();

                    vm.$nextTick(function () {
                      if(document.querySelector(".periodAnalysis " + " ." + "naver" + " #" + graph)) {
                        vm.main.periodAnalysis.total[3].day.total.graph[graph] = echarts.init(document.querySelector(".periodAnalysis " + " ." + "naver" + " #" + graph));
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
                        vm.main.periodAnalysis.total[3].day.total.graph[graph].setOption(option);
                        vm.main.periodAnalysis.total[3].day.total.graph[graph].on("finished", function () { vm.$emit("finished", { graph: graph, status: true });});
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

