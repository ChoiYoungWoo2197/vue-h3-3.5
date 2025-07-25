<template>
  <div :id="getUniqueId" class="w991u p-2 m-0" :style="{ height: height }"></div>
</template>

<script>
import $ from "jquery";
import { store } from "@/store/store.js";
import { API_URL, TEMP_KEY, MONG_ID } from "@/configs/config.js";
import { SHA256 } from "@/assets/js/sha256.js";
import { priceToString, isMobile, uuidv4 } from "@/assets/js/common.js";
import * as echarts from "echarts";
import moment from "moment";

export default {
  props: {    pHeight: String,    pCustom: Object,  },
  data() {
    return {
      uniqueId: null,
      periods: [],
      ims: [],
      clk: [],
      datas: { 0: [], 1: [] },
      fromdate: "",
      todate: "",
      myChart: null,
      height: null,
      custom: null,
      kpiSet: {
        총광고비: "cstd",
        총노출수: "im",
        총클릭수: "clk",
        총전환수: "cv",
        총전환매출: "cr",
        총클릭율: "ctr",
        총클릭당비용: "cpc",
        총전환당비용: "cpa",
        총전환율: "cvr",
        총ROAS: "roas",
      },
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
    setDatas() {
      var vm = this;
      var diff = moment(this.todate).diff(moment(this.fromdate), "days");
      vm.periods = [];
      for (var i = 1; i <= diff; i++) { vm.periods.push(moment(this.todate).subtract(i, "days").format("YYYY-MM-DD")); }
      vm.periods.reverse().push(this.todate);

      let legend = [];
      let keys = Object.keys(vm.custom.legend.data);
      for (let i = 0; i < vm.custom.legend.data.length; i++) { legend.push(vm.custom.legend.data[i].text); }

      $.ajax({
        type: "post", //요청 메소드 방식
        url: API_URL + "/app/dashboard/period",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          fromdate: vm.fromdate,
          todate: vm.todate,
          session: store.state.userStore.session,
        },
        beforeSend: function (data) { },
        success: function (data) {
          vm.myChart != null ? vm.myChart.dispose() : (vm.myChart = {});
          vm.datas[0] = [];
          vm.datas[1] = [];
          if (data.result === "success") {
            if (!data.data) return false;
            for (var i = 0; i < vm.periods.length; i++) {
              var period = data.data[vm.periods[i]];
              if (period !== undefined) {
                vm.datas[0].push(period[vm.kpiSet[legend[0]]]);
                vm.datas[1].push(period[vm.kpiSet[legend[1]]]);
              } else {
                vm.datas[0].push(0);
                vm.datas[1].push(0);
              }
            }

            vm.$nextTick(function () {
              vm.myChart = echarts.init(document.getElementById(this.getUniqueId));
              var option = {
                color: ["#1795F0", "#6664DA", "#4EDF9F", "#4DC6DF"],
                tooltip: { trigger: "axis", axisPointer: { type: "cross", crossStyle: { color: "#999", }, }, },
                grid: { width: "85%", },
                legend: {
                  show: vm.custom.legend.show,
                  data: legend,
                  top: vm.custom.legend.top,
                  left: vm.custom.legend.left,
                  orient: vm.custom.legend.orient,
                  textStyle: { fontSize: vm.custom.legend.textStyle.fontSize, fontWeight: vm.custom.legend.textStyle.fontWeight, },
                },
                xAxis: [
                  {
                    type: "category",
                    data: vm.periods,
                    axisPointer: { type: "shadow", },
                    axisLabel: { fontSize: vm.custom.xAxis.axisLabel.fontSize, },
                  },
                ],
                yAxis: [
                  {
                    type: "value",
                    name: legend[0],
                    axisLabel: { formatter: "{value}", },
                    axisLabel: { fontSize: vm.custom.yAxis.axisLabel.fontSize, },
                  },
                  {
                    type: "value",
                    name: legend[1],
                    axisLabel: { formatter: "{value}", },
                    axisLabel: { fontSize: vm.custom.yAxis.axisLabel.fontSize, },
                  },
                ],
                series: [
                  {
                    name: legend[0],
                    type: "bar",
                    tooltip: { valueFormatter: function (value) { return vm.priceToString(value); }, },
                    data: vm.datas[0],
                    markPoint: { symbol: 'circle', symbolSize: 30, itemStyle: { color: 'rgba(255, 69, 0, 0.8)', borderColor: '#FF4500', borderWidth: 2 }, 
                      data: [ { type: 'max', name: '최대' }, { type: 'min', name: '최소' } ],
                      label: { show: true, formatter: function (params) { return `${params.name}\n${ vm.priceToString(params.value)}`; }, fontWeight: 'bold' }, 
                    },
                    label: {
                      show: false,
                      position: "top",
                      textStyle: { fontSize: vm.custom.series.textStyle.fontSize, fontWeight: vm.custom.series.textStyle.fontWeight, },
                      formatter: function (value) { return vm.priceToString(value); },
                    },
                    barWidth: 20,
                  },
                  {
                    name: legend[1],
                    type: "line",
                    yAxisIndex: 1,
                    tooltip: { valueFormatter: function (value) { return priceToString(value); }, },
                    data: vm.datas[1],
                  },
                ],
              };
              vm.myChart.setOption(option);
              vm.myChart.on("finished", function () { vm.$emit("finishedCrossGraph"); });
            });
          } else {
            if (data.status === "0001") {
              vm.$emit("expireSession");
            } else {
            }
          }
        },
        error: function (a, b, c) {
          // console.log(a, b, c);
        },
        complete: function (a, b, c) {
          vm.$emit("hideMask");
          // vm.$refs.maskModal.hideModal();
        },
      });
    },
    setGraph(fromdate, todate) {
      var vm = this;
      vm.fromdate = fromdate;
      vm.todate = todate;
      this.setDatas();
    },
    handleResize(event) {
      // console.log(event.target.innerWidth);
      if (!this.myChart) return false;
      this.myChart.resize();
    },
    priceToString(salse) {
      if (salse === undefined) return "";

      return priceToString(salse);
    },
  },
};
</script>

<style></style>
