<template>
  <div :id="getUniqueId" style="height: 400px"></div>
</template>

<script>
import $ from "jquery";
import { store } from "../../store/store.js";
import { API_URL, TEMP_KEY, MONG_ID } from "../../configs/config.js";
import { SHA256 } from "../../assets/js/sha256.js";
import * as echarts from "echarts";
import moment from "moment";

export default {
  props: {
    pMedia: String,
    pLegend: Object,
  },
  data() {
    return {
      uniqueId: null,
      fromdate: "",
      todate: "",
      myChart: null,
      app: {},
      chartDom: {},
      option: {},
      periods: [],
      csts: [],
      ims: [],
      clks: [],
      cvs: [],
    };
  },
  mounted() {
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
  watch: {
    // pMedia() {
    //     if(!this.pMedia) return false;
    //     var vm = this;
    //     console.log(this.pMedia);
    //     vm.setGraph();
    // }
  },
  methods: {
    setDatas() {
      var vm = this;
      $.ajax({
        type: "post", //요청 메소드 방식
        url: API_URL + "/app/analysis/mediachart",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          fromdate: vm.fromdate,
          todate: vm.todate,
          // "media" : 'N',
          session: store.state.userStore.session,
        },
        cache: false,
        // async : false,
        beforeSend: function (data) {
          vm.$emit("showMask");
        },
        success: function (data) {
          if (data.result === "success") {
            if (!data.data) return false;
            vm.csts = [];
            vm.ims = [];
            vm.clks = [];
            vm.cvs = [];
            vm.periods = [];

            var keys = Object.keys(data.data[vm.getMedia(vm.pMedia)]);
            for (let i = 0; i < keys.length; i++) {
              var obj = data.data[vm.getMedia(vm.pMedia)][keys[i]];

              vm.periods.push(keys[i]);
              vm.csts.push(obj.cst);
              vm.ims.push(obj.im);
              vm.clks.push(obj.clk);
              vm.cvs.push(obj.cv);
            }

            vm.$nextTick(function () {
              vm.setConfig();
            });
          } else {
            if (data.status === "0001") {
              vm.$emit("expireSession");
            } else {
            }
          }
        },
        error: function (a, b, c) {
          console.log(a, b, c);
        },
        complete: function (a, b, c) {
          vm.$emit("hideMask");
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
      if (!this.myChart) return false;
      this.myChart.resize();
    },
    getMedia(key) {
      if (key === undefined) return "";

      var media = "";
      if (key === "N") media = "naver";
      if (key === "D") media = "kakaosa";
      if (key === "K") media = "kakaomo";
      return media;
    },
    setConfig() {
      var vm = this;
      vm.app = {};
      vm.chartDom = {};
      vm.myChart = {};
      vm.option = {};

      const posList = [
        "left",
        "right",
        "top",
        "bottom",
        "inside",
        "insideTop",
        "insideLeft",
        "insideRight",
        "insideBottom",
        "insideTopLeft",
        "insideTopRight",
        "insideBottomLeft",
        "insideBottomRight",
      ];

      vm.myChart = echarts.init(document.getElementById(this.getUniqueId));
      vm.app.configParameters = {
        rotate: {
          min: -90,
          max: 90,
        },
        align: {
          options: {
            left: "left",
            center: "center",
            right: "right",
          },
        },
        verticalAlign: {
          options: {
            top: "top",
            middle: "middle",
            bottom: "bottom",
          },
        },
        position: {
          options: posList.reduce(function (map, pos) {
            map[pos] = pos;
            return map;
          }, {}),
        },
        distance: {
          min: 0,
          max: 100,
        },
      };
      vm.app.config = {
        rotate: 90,
        align: "left",
        verticalAlign: "middle",
        position: "insideBottom",
        distance: 15,
        onChange: function () {
          const labelOption = {
            rotate: vm.app.config.rotate,
            align: vm.app.config.align,
            verticalAlign: vm.app.config.verticalAlign,
            position: vm.app.config.position,
            distance: vm.app.config.distance,
          };
          vm.myChart.setOption({
            series: [
              {
                label: labelOption,
              },
              {
                label: labelOption,
              },
              {
                label: labelOption,
              },
              {
                label: labelOption,
              },
            ],
          });
        },
      };
      const labelOption = {
        show: false,
        position: vm.app.config.position,
        distance: vm.app.config.distance,
        align: vm.app.config.align,
        verticalAlign: vm.app.config.verticalAlign,
        rotate: vm.app.config.rotate,
        formatter: "{c}  {name|{a}}",
        fontSize: 14,
        rich: {
          name: {},
        },
      };
      vm.option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          width: "75%",
        },
        legend: {
          show: false,
          data: ["광고비", "노출수", "클릭수", "전환수"],
          selected: {
            광고비: vm.pLegend.cst,
            노출수: vm.pLegend.im,
            클릭수: vm.pLegend.clk,
            전환수: vm.pLegend.cv,
          },
          top: "middle",
          left: "right",
          orient: "vertical",
        },
        toolbox: {
          show: false,
          orient: "vertical",
          left: "right",
          top: "center",
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ["line", "bar", "stack"] },
            restore: { show: true },
            saveAsImage: { show: true },
          },
        },
        xAxis: [
          {
            type: "category",
            axisTick: { show: false },
            data: vm.periods,
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "광고비",
            type: "bar",
            barGap: 0,
            label: labelOption,
            emphasis: {
              focus: "series",
            },
            data: vm.csts,
          },
          {
            name: "노출수",
            type: "bar",
            label: labelOption,
            emphasis: {
              focus: "series",
            },
            data: vm.ims,
          },
          {
            name: "클릭수",
            type: "bar",
            label: labelOption,
            emphasis: {
              focus: "series",
            },
            data: vm.clks,
          },
          {
            name: "전환수",
            type: "bar",
            label: labelOption,
            emphasis: {
              focus: "series",
            },
            data: vm.cvs,
          },
        ],
      };
      vm.option && vm.myChart.setOption(vm.option);
    },
  },
};
</script>

<style scoped></style>
