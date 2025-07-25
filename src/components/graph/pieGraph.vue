<template>
  <div :id="getUniqueId" :style="{ height: height + 'px' }"></div>
</template>

<script>
import $ from "jquery";
import { store } from "@/store/store.js";
import { API_URL, TEMP_KEY, MEDIA_SORT } from "@/configs/config.js";
import { SHA256 } from "@/assets/js/sha256.js";
import * as echarts from "echarts";

export default {
  props: {    pCustom: Object,  },
  data() {
    return {
      uniqueId: null,
      fromdate: null,
      todate: null,
      atSummarys: [],
      myChart: null,
      height: 300,
      custom: null,
    };
  },
  mounted() {
    if (this.pCustom) {
      this.custom = this.pCustom;
      this.height = this.pCustom.height;
    }

    window.addEventListener("resize", this.handleResize);
  },
  computed: {
    getUniqueId() {
      if (!this.uniqueId) {
        this.uniqueId = "vm-modal-" + this._uid;
        return this.uniqueId;
      }
      return this.uniqueId;
    },
  },
  methods: {
    setDatas() {
      var vm = this;
      $.ajax({
        type: "post", //요청 메소드 방식
        url: API_URL + "/app/dashboard/summarymediarate",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          fromdate: vm.fromdate,
          todate: vm.todate,
          session: store.state.userStore.session,
        },
        beforeSend: function (data) { },
        success: function (data) {
          vm.myChart = null;

          if (data.result === "success") {
            if (!data.data) return false;
            var keys = Object.keys(data.data);

            for (let i = 0; i < keys.length; i++) { vm.atSummarys.push({ name: vm.getName(keys[i]), value: Math.ceil(data.data[keys[i]].per), sort: MEDIA_SORT[keys[i]], }); }
            vm.atSummarys.sort(function (a, b) { return a.sort < b.sort ? -1 : a.sort > b.sort ? 1 : 0; });

            vm.$nextTick(function () {
              vm.myChart = echarts.init(document.getElementById(this.getUniqueId));
              var option = {
                color:[    '#5470C6', '#91CC75', '#FAC858', '#EE6666', '#73C0DE', '#3BA272', '#FC8452', '#9A60B4', '#EA7CCC'],
                title: { text: "", subtext: "", left: "center", },
                tooltip: { trigger: "item", formatter: '{b}: {d}%'},
                legend: {
                  show: vm.custom.legend.show,
                  top: vm.custom.legend.top,
                  left: vm.custom.legend.left,
                  orient: vm.custom.legend.orient,
                  textStyle: { fontSize: vm.custom.legend.textStyle.fontSize, fontWeight: vm.custom.legend.textStyle.fontWeight, },
                },
                series: [
                  {
                    name: "매체",
                    type: "pie",
                    radius: ["45%", "70%"],
                    data: vm.atSummarys,
                    itemStyle: { borderRadius: 10, borderColor: "#fff", borderWidth: 2, },
                    label: { fontSize: vm.custom.series.label.fontSize, fontWeight: vm.custom.series.label.fontWeight, },
                  },
                ],
              };

              vm.myChart.setOption(option);
              vm.myChart.on("finished", function () { vm.$emit("finishedPieGraph"); });
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
          // vm.$refs.maskModal.hideModal();
        },
      });
    },
    setGraph(fromdate, todate) {
      var vm = this;
      vm.fromdate = fromdate;
      vm.todate = todate;
      vm.atSummarys = [];
      this.setDatas();
    },
    getName(key) {
      if (key === undefined) return "";

      var name = "";
      if (key === "N") name = "네이버SA";
      if (key === "D") name = "카카오SA";
      if (key === "K") name = "카카오모먼트";
      if (key === "Nda") name = "네이버GFA";
      if (key === "google") name = "구글";
      return name;
    },
    handleResize(event) {
      // console.log(event.target.innerWidth);
      if (!this.myChart) return false;
      this.myChart.resize();
    },
  },
};
</script>

<style></style>
