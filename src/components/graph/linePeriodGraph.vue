<template>
  <!-- <div :id="getUniqueId" style="height: 400px;"> -->
  <div :id="getUniqueId" :style="{ height: height }"></div>
</template>

<script>
import $ from "jquery";
import { store } from "../../store/store.js";
import { API_URL, TEMP_KEY, MONG_ID } from "../../configs/config.js";
import { SHA256 } from "../../assets/js/sha256.js";
import { priceToString, isMobile, uuidv4 } from "../../assets/js/common.js";
import * as echarts from "echarts";
import moment from "moment";

export default {
  props: {
    pLegend: Object,
    pPeriodUnit: String,
    pHeight: String,
    pCustom: Object,
  },
  data() {
    return {
      uniqueId: null,
      fromdate: "",
      todate: "",
      myChart: null,
      chartDom: {},
      option: {},
      periods: [],
      datas: {
        csts: [],
        ims: [],
        clks: [],
        cvs: [],
      },
      responseData: null,
      height: null,
      custom: null,
    };
  },
  mounted() {
    this.height = this.pHeight;
    this.custom = this.pCustom;
    window.addEventListener("resize", this.handleResize);
  },
  updated() {},
  computed: {
    getUniqueId() {
      if (!this.uniqueId) {
        this.uniqueId = "vm-modal-" + this._uid;
        return this.uniqueId;
      }
      return this.uniqueId;
    },
  },
  watch: {},
  methods: {
    priceToString(salse) {
      if (salse === undefined) return "";

      return priceToString(salse);
    },
    setDatas() {
      var vm = this;
      vm.periods = [];
      vm.datas.csts = [];
      vm.datas.ims = [];
      vm.datas.clks = [];
      vm.datas.cvs = [];
      // console.log(vm.responseData);

      vm.$nextTick(function () {
        vm.getTotal(vm.responseData);
        vm.setConfig();
      });
    },
    setGraph(responseData, fromdate, todate) {
      var vm = this;
      vm.responseData = responseData;
      vm.fromdate = fromdate;
      vm.todate = todate;
      this.setDatas();
    },
    handleResize(event) {
      if (!this.myChart) return false;
      this.myChart.resize();
    },
    getMedia(key) {
      if (key === undefined) return "";

      var media = "";
      if (key === "N") media = "naver";
      if (key === "D") media = "kakaosa";
      if (key === "Nda") media = "naverda";
      if (key === "K") media = "kakaomo";
      if (key === "google") media = "google";
      if (key === "cst") media = "광고비";
      if (key === "im") media = "노출수";
      if (key === "clk") media = "클릭수";
      if (key === "cv") media = "전환수";

      return media;
    },
    getTotal(data) {
      var vm = this;
      //total
      var keysTotal = Object.keys(data);
      keysTotal.sort();
      for (let i = 0; i < keysTotal.length; i++) {
        if (keysTotal[i].indexOf("summary") > -1) continue;
        var obj = data[keysTotal[i]];
        vm.periods.push(keysTotal[i]);
        vm.datas.csts.push(obj.cst);
        vm.datas.ims.push(obj.im);
        vm.datas.clks.push(obj.clk);
        vm.datas.cvs.push(obj.cv);
      }
    },
    setConfig() {
      var vm = this;
      vm.chartDom = {};
      // vm.myChart = {};
      vm.option = {};
      vm.myChart != null ? vm.myChart.dispose() : (vm.myChart = {});
      vm.myChart = echarts.init(document.getElementById(vm.getUniqueId));
      vm.option = {
        color: ["#1795F0", "#6664DA", "#4EDF9F", "#4DC6DF"],
        title: {
          show: false,
          text: "Stacked Line",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985",
            },
          },
        },
        legend: {
          show: vm.custom.legend.show,
          data: [
            vm.getMedia("cst"),
            vm.getMedia("im"),
            vm.getMedia("clk"),
            vm.getMedia("cv"),
          ],
          selected: {
            광고비: vm.pLegend.cst,
            노출수: vm.pLegend.im,
            클릭수: vm.pLegend.clk,
            전환수: vm.pLegend.cv,
          },
          top: vm.custom.legend.top,
          left: vm.custom.legend.left,
          orient: vm.custom.legend.orient,
          textStyle: {
            fontSize: 19,
            fontWeight: "normal",
          },
        },
        grid: {
          left: vm.custom.grid.left,
          right: vm.custom.grid.right,
          bottom: vm.custom.grid.bottom,
          width: vm.custom.grid.width,
          containLabel: vm.custom.grid.containLabel,
        },
        toolbox: {
          show: false,
          feature: {
            saveAsImage: {},
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: vm.periods,
          axisLabel: {
            fontSize: vm.custom.xAxis.axisLabel.fontSize,
            formatter: function (value) {
              var periodUnit = "";
              var weekDaySorter = {
                1: "월",
                2: "화",
                3: "수",
                4: "목",
                5: "금",
                6: "토",
                7: "일",
              };

              if (vm.pPeriodUnit === "hour") periodUnit = "시";
              if (vm.pPeriodUnit === "dayweek") periodUnit = "요일";
              if (vm.pPeriodUnit === "day") periodUnit = "일";
              if (vm.pPeriodUnit === "month") periodUnit = "월";
              return (
                (vm.pPeriodUnit !== "dayweek" ? value : weekDaySorter[value]) + periodUnit
              );
            },
          },
          show: vm.custom.xAxis.show !== undefined ? vm.custom.xAxis.show : true,
        },
        yAxis: {
          type: "value",
          minorSplitLine: {
            show: true,
          },
          axisLabel: {
            fontSize: vm.custom.yAxis.axisLabel.fontSize,
          },
          show: vm.custom.yAxis.show !== undefined ? vm.custom.yAxis.show : true,
        },
        series: [
          {
            smooth: true,
            name: vm.getMedia("cst"),
            type: "line",
            // stack: 'Total',
            areaStyle: {},
            // emphasis: {
            //   focus: "series"
            // },
            label: {
              show: false,
              position: "top",
              textStyle: {
                fontSize: vm.custom.series.textStyle.fontSize,
                fontWeight: vm.custom.series.textStyle.fontWeight,
              },
              formatter: function (value) {
                return vm.priceToString(value.value);
              },
            },
            markPoint: {
              data:
                vm.custom.mobile !== undefined
                  ? [
                      { type: "max", name: "Max" },
                      { type: "min", name: "Min" },
                    ]
                  : [],
            },
            data: vm.datas.csts,
          },
          {
            smooth: true,
            name: vm.getMedia("im"),
            type: "line",
            // stack: 'Total',
            areaStyle: {},
            // emphasis: {
            //   focus: "series"
            // },
            label: {
              show: false,
              position: "top",
              textStyle: {
                fontSize: vm.custom.series.textStyle.fontSize,
                fontWeight: vm.custom.series.textStyle.fontWeight,
              },
              formatter: function (value) {
                return vm.priceToString(value.value);
              },
            },
            markPoint: {
              data:
                vm.custom.mobile !== undefined
                  ? [
                      { type: "max", name: "Max" },
                      { type: "min", name: "Min" },
                    ]
                  : [],
            },
            data: vm.datas.ims,
          },
          {
            smooth: true,
            name: vm.getMedia("clk"),
            type: "line",
            // stack: 'Total',
            areaStyle: {},
            // emphasis: {
            //   focus: "series"
            // },
            label: {
              show: false,
              position: "top",
              textStyle: {
                fontSize: vm.custom.series.textStyle.fontSize,
                fontWeight: vm.custom.series.textStyle.fontWeight,
              },
              formatter: function (value) {
                return vm.priceToString(value.value);
              },
            },
            markPoint: {
              data:
                vm.custom.mobile !== undefined
                  ? [
                      { type: "max", name: "Max" },
                      { type: "min", name: "Min" },
                    ]
                  : [],
            },
            data: vm.datas.clks,
          },
          {
            smooth: true,
            name: vm.getMedia("cv"),
            type: "line",
            // stack: 'Total',
            areaStyle: {},
            // emphasis: {
            //   focus: "series"
            // },
            label: {
              show: false,
              position: "top",
              textStyle: {
                fontSize: vm.custom.series.textStyle.fontSize,
                fontWeight: vm.custom.series.textStyle.fontWeight,
              },
              formatter: function (value) {
                return vm.priceToString(value.value);
              },
            },
            markPoint: {
              data:
                vm.custom.mobile !== undefined
                  ? [
                      { type: "max", name: "Max" },
                      { type: "min", name: "Min" },
                    ]
                  : [],
            },
            data: vm.datas.cvs,
          },
        ],
      };

      vm.option && vm.myChart.setOption(vm.option);

      vm.myChart.on("finished", function () {
        // console.log(vm.myChart.getDataURL());
        vm.$emit("finishedLinePeriodGraph");
      });
    },
  },
};
</script>

<style scoped></style>
