<template>
  <div :id="getUniqueId" :style="{ height: height }"></div>
</template>
<script>

import { priceToString} from "@/assets/js/common.js";
import * as echarts from "echarts";
export default {
  props: {pMedia: String,pLegend: Object,pKpi: String,pHeight: String,pCustom: Object},
  data() {
    return {
      uniqueId: null,
      fromdate: "",
      todate: "",
      myChart: null,
      chartDom: {},
      option: {},
      periods: [],
      datas: {naver: [],kakaosa: [],google:[],kakaomo: []},
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
      vm.datas.naver = [];
      vm.datas.kakaosa = [];
      vm.datas.google = [];
      vm.datas.kakaomo = [];
      vm.datas.naverda = [];

      vm.$nextTick(function () {
        vm.getTotal(vm.responseData, "dsp", "kakaomo");
        vm.getTotal(vm.responseData, "dsp", "naverda");
        vm.getTotal(vm.responseData, "sa", "naver");
        vm.getTotal(vm.responseData, "sa", "kakaosa");
        vm.getTotal(vm.responseData, "sa", "google");        
        vm.periods = Array.from(new Set(vm.periods));
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
      if (key === "G") media = "google";      
      if (key === "K") media = "kakaomo";
      if (key === "Nda") media = "naverda";
      if (key === "naver") media = "네이버 검색광고";
      if (key === "kakaosa") media = "카카오 검색광고";
      if (key === "google") media = "구글";      
      if (key === "kakaomo") media = "카카오 모먼트";
      if (key === "naverda") media = "네이버 디스플레이";

      return media;
    },
    getTotal(data, type, media) {
      var vm = this;
      //total
      var keysTotal =media === null? Object.keys(data.data[type]): Object.keys(data.data[type][media]);
      for (let i = 0; i < keysTotal.length; i++) {
        var obj =media === null? data.data[type][keysTotal[i]]: data.data[type][media][keysTotal[i]];
        vm.periods.push(keysTotal[i]);

        if (obj.length === 0) continue;
        vm.datas[media].push(obj[vm.pKpi]);
      }
    },
    setConfig() {
      var vm = this;
      vm.chartDom = {};
      vm.option = {};
      vm.myChart != null ? vm.myChart.dispose() : (vm.myChart = {});
      vm.myChart = echarts.init(document.getElementById(vm.getUniqueId));
      vm.option = {
        color: ["#1795F0", "#6664DA", "#4EDF9F", "#4DC6DF"],
        title: {show: false,text: "Stacked Line"},
        tooltip: {trigger: "axis", axisPointer: {type: "cross",label: {backgroundColor: "#6a7985",}}},
        legend: {
          show: vm.custom.legend.show,
          data: [
            vm.getMedia("naver"),
            vm.getMedia("kakaosa"),
            vm.getMedia("google"),
            vm.getMedia("naverda"),
            vm.getMedia("kakaomo"),
          ],
          selected: {
            "네이버 검색광고": vm.pLegend.naver.check,
            "카카오 검색광고": vm.pLegend.kakaosa.check,
            "구글": vm.pLegend.google.check,
            "네이버 디스플레이": vm.pLegend.naverda.check,
            "카카오 모먼트": vm.pLegend.kakaomo.check,
          },
          top: vm.custom.legend.top,
          left: vm.custom.legend.left,
          orient: vm.custom.legend.orient,
          textStyle: {fontSize: 12,fontWeight: "normal"},
        },
        grid: {
          left: vm.custom.grid.left,
          right: vm.custom.grid.right,
          bottom: vm.custom.grid.bottom,
          width: vm.custom.grid.width,
          containLabel: vm.custom.grid.containLabel,
        },
        toolbox: {show: false,feature: {saveAsImage: {}}},
        xAxis: {
          name: vm.custom.xAxis.name,
          type: "category",
          boundaryGap: false,
          data: vm.periods,
          axisLabel: {fontSize: vm.custom.xAxis.axisLabel.fontSize},
          show: vm.custom.xAxis.show !== undefined ? vm.custom.xAxis.show : true,
        },
        yAxis: {
          name: vm.custom.yAxis.name,
          type: "value",
          minorSplitLine: {show: true},
          axisLabel: {fontSize: vm.custom.yAxis.axisLabel.fontSize},
          show: vm.custom.yAxis.show !== undefined ? vm.custom.yAxis.show : true,
        },
        series: [
          {
            smooth: true,
            name: vm.getMedia("naver"),
            type: "line",
            areaStyle: {},
            label: {
              show: false,
              position: "top",
              textStyle: {fontSize: vm.custom.series.textStyle.fontSize,fontWeight: vm.custom.series.textStyle.fontWeight},
              formatter: function (value) {return vm.priceToString(value.value);},
            },
            markPoint: {data:vm.custom.mobile !== undefined? [{ type: "max", name: "Max" },{ type: "min", name: "Min" },]: []},
            data: vm.datas.naver,
          },
          {
            smooth: true,
            name: vm.getMedia("kakaosa"),
            type: "line",
            areaStyle: {},
            label: {
              show: false,
              position: "top",
              textStyle: {fontSize: vm.custom.series.textStyle.fontSize,fontWeight: vm.custom.series.textStyle.fontWeight},
              formatter: function (value) {return vm.priceToString(value.value);},
            },            
            markPoint: {data:vm.custom.mobile !== undefined? [{ type: "max", name: "Max" },{ type: "min", name: "Min" }]: []},
            data: vm.datas.kakaosa,
          },
          {
            smooth: true,
            name: vm.getMedia("google"),
            type: "line",
            areaStyle: {},
            label: {
              show: false,
              position: "top",
              textStyle: {fontSize: vm.custom.series.textStyle.fontSize,fontWeight: vm.custom.series.textStyle.fontWeight},
              formatter: function (value) {return vm.priceToString(value.value);},
            },            
            markPoint: {data:vm.custom.mobile !== undefined? [{ type: "max", name: "Max" },{ type: "min", name: "Min" },]: []},
            data: vm.datas.google,
          },
          {
            smooth: true,
            name: vm.getMedia("naverda"),
            type: "line",
            areaStyle: {},
            label: {
              show: false,
              position: "top",
              textStyle: {fontSize: vm.custom.series.textStyle.fontSize,fontWeight: vm.custom.series.textStyle.fontWeight},
              formatter: function (value) {return vm.priceToString(value.value);},
            },
            markPoint: {data:vm.custom.mobile !== undefined? [{ type: "max", name: "Max" },{ type: "min", name: "Min" },]: []},
            data: vm.datas.naverda,
          },
          {
            smooth: true,
            name: vm.getMedia("kakaomo"),
            type: "line",
            areaStyle: {},
            label: {
              show: false,
              position: "top",
              textStyle: {fontSize: vm.custom.series.textStyle.fontSize,fontWeight: vm.custom.series.textStyle.fontWeight},
              formatter: function (value) {return vm.priceToString(value.value);},
            },
            markPoint: {data:vm.custom.mobile !== undefined? [{ type: "max", name: "Max" },{ type: "min", name: "Min" },]: [],},
            data: vm.datas.kakaomo,
          },
        ],
      };

      vm.option && vm.myChart.setOption(vm.option);
      vm.myChart.on("finished", function () {vm.$emit("finishedLineGraph");});
    },
  },
};
</script>
