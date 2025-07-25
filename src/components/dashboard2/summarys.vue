<template>
  <div class="summary-card row" :class="getUniqueId">
    <div v-for="summary in getSummarys" :key="summary.key" class="col-xl-2">
      <ul @click="clickSummary(summary)">
        <li>{{ getName(summary.key) }}</li>
        <li class="no-wrap">
          {{ priceToString(summary.value) + getUnit(summary.key) }}
          <template v-if="summary.per.indexOf('-') === -1">
            <p class="">
              <span class="ml-0">{{ priceToString(summary.cp) + getUnit(summary.key) }}</span >
              <span class="up">{{ summary.per + "%)" }}</span>
            </p>
          </template>
          <template v-else>
            <p>
              <span class="ml-0">{{ priceToString(summary.cp) + getUnit(summary.key) }}</span >
              <span class="down">{{ summary.per.substr(1) + "%)" }}</span>
            </p>
          </template>
        </li>
      </ul>
    </div>
    <div class="col-xl-2">
      <ul class="integrated d-flex flex-column justify-content-center align-items-center" @click="clickAddSummary" >
        <li>
          <div class="d-flex flex-column justify-content-center align-items-center">
            <button type="button" data-toggle="modal" data-target="#add-summary-modal"> <i class="bi bi-plus-lg"></i> </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import { store } from "@/store/store.js";
import { API_URL, TEMP_KEY, MONG_ID, SUMMARY_SORT } from "@/configs/config.js";
import { SHA256 } from "@/assets/js/sha256.js";
import { priceToString } from "@/assets/js/common.js";
import moment from "moment";

export default {
  components: {},
  props: {},
  data() {
    return {
      uniqueId: null,
      summarys: [],
      fromdate: null,
      todate: null,
      comparefromdate: null,
      comparetodate: null,
      atSummarys: [],
    };
  },
  computed: {
    getUniqueId() {
      if (!this.uniqueId) {
        this.uniqueId = "vm-modal-" + this._uid;
        return this.uniqueId;
      }
      return this.uniqueId;
    },
    getSummarys() {
      this.atSummarys.sort(function (a, b) { return a.sort < b.sort ? -1 : a.sort > b.sort ? 1 : 0; });
      return this.atSummarys;
    },
  },
  watch: {},
  mounted() {},
  methods: {
    clickSummary(summary) { this.$emit("clickedSummary", { key: summary.key, text: this.getName(summary.key) }); },
    clickAddSummary() { this.$emit("showAddSummayModal"); },
    setSummary(summarys, fromdate, todate, comparefromdate, comparetodate) {
      var vm = this;
      vm.summarys = [];
      vm.atSummarys = [];
      vm.summarys = summarys.slice();
      vm.fromdate = fromdate;
      vm.todate = todate;
      vm.comparefromdate = comparefromdate;
      vm.comparetodate = comparetodate;

      $.ajax({
        type: "post",
        url: API_URL + "/app/dashboard/summary",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          fromdate: vm.fromdate,
          todate: vm.todate,
          comparefromdate: vm.comparefromdate,
          comparetodate: vm.comparetodate,
          session: store.state.userStore.session,
        },
        success: function (data) {
          // console.log(i, vm.atSummarys);
          if (data.result === "success") {
            if (!data.data) return false;
            var keys = Object.keys(SUMMARY_SORT);
            keys.forEach(function (key) {
              let obj = vm.summarys.findIndex(function (summary, index) { return summary.key === key; });
              if (!vm.summarys[obj].visible) return;

              vm.atSummarys.push({
                key: key,
                name: vm.getName(key),
                value: data.data[key],
                per: !data.data.per ? "0" : data.data.per[key].toString(),
                cp: !data.data.cp[key] ? "0" : data.data.cp[key].toString(),
                values: { o: vm.priceToString(data.data[key]), c: vm.priceToString(data.data.cp[key].toString()), },
                unit: vm.getUnit(key),
                sort: SUMMARY_SORT[key],
              });
            });

            vm.$emit("changeData", vm.atSummarys);
          } else {
            if (data.status === "0001") {
              vm.$emit("expireSession");
            } else {
            }
          }
        },
        complete: function (data) { vm.$emit("summary"); },
      });
    },
    priceToString(salse) {
      if (salse === undefined) return "";
      return priceToString(salse);
    },
    getName(key) {
      if (key === undefined) return "";

      var name = "";
      if (key === "cst") name = "총광고비";
      if (key === "clk") name = "총클릭수";
      if (key === "cv") name = "총전환수";
      if (key === "im") name = "총노출수";
      if (key === "cr") name = "총전환매출";
      if (key === "ctr") name = "총클릭율";
      if (key === "cpc") name = "총클릭당비용";
      if (key === "cpa") name = "총전환당비용";
      if (key === "cvr") name = "총전환율";
      if (key === "roas") name = "총ROAS";

      return name;
    },
    getUnit(key) {
      if (key === undefined) return "";

      var name = "";
      if (key === "cst") name = "원";
      if (key === "clk") name = "회";
      if (key === "cv") name = "회";
      if (key === "im") name = "회";
      if (key === "cr") name = "원";
      if (key === "ctr") name = "%";
      if (key === "cpc") name = "원";
      if (key === "cpa") name = "원";
      if (key === "cvr") name = "%";
      if (key === "roas") name = "%";

      return name;
    },
  },
};
</script>

<style scoped></style>
