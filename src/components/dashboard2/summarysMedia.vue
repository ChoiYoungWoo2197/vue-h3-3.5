<template>
  <table class="report" :class="getUniqueId">
    <thead v-if="summarys.length > 0">
      <tr>
        <td class="text-left" width="25%">#</td>
        <td v-if="summarys[0].visible" width="15%" class="text-right">총광고비</td>
        <td v-if="summarys[1].visible" width="15%" class="text-right">총노출수</td>
        <td v-if="summarys[2].visible" width="15%" class="text-right">총클릭수</td>
        <td v-if="summarys[3].visible" width="15%" class="text-right">총전환수</td>
        <td v-if="summarys[4].visible" width="15%" class="text-right">총전환매출</td>
        <td v-if="summarys[5].visible" width="15%" class="text-right">총클릭율</td>
        <td v-if="summarys[6].visible" width="15%" class="text-right">총클릭당비용</td>
        <td v-if="summarys[7].visible" width="15%" class="text-right">총전환당비용</td>
        <td v-if="summarys[8].visible" width="15%" class="text-right">총전환율</td>
        <td v-if="summarys[9].visible" width="15%" class="text-right">총ROAS</td>
      </tr>
    </thead>
    <tbody v-if="summarys.length > 0">
      <tr v-for="summary in getSummarys" :key="summary.key" :class="{ total: summary.key === 'TOTAL' }" >
        <td class="text-left">{{ getName(summary.key) }}</td>
        <td v-if="summarys[0].visible" class="text-right"> {{ priceToString("cst", summary.value.cst) }} </td>
        <td v-if="summarys[1].visible" class="text-right"> {{ priceToString("im", summary.value.im) }} </td>
        <td v-if="summarys[2].visible" class="text-right"> {{ priceToString("clk", summary.value.clk) }} </td>
        <td v-if="summarys[3].visible" class="text-right"> {{ priceToString("cv", summary.value.cv) }} </td>
        <td v-if="summarys[4].visible" class="text-right"> {{ priceToString("cr", summary.value.cr) }} </td>
        <td v-if="summarys[5].visible" class="text-right"> {{ priceToString("ctr", summary.value.ctr) }} </td>
        <td v-if="summarys[6].visible" class="text-right"> {{ priceToString("cpc", summary.value.cpc) }} </td>
        <td v-if="summarys[7].visible" class="text-right"> {{ priceToString("cpa", summary.value.cpa) }} </td>
        <td v-if="summarys[8].visible" class="text-right"> {{ priceToString("cvr", summary.value.cvr) }} </td>
        <td v-if="summarys[9].visible" class="text-right"> {{ priceToString("roas", summary.value.roas) }} </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import $ from "jquery";
import { store } from "@/store/store.js";
import { API_URL, TEMP_KEY, MONG_ID, MEDIA_SORT } from "@/configs/config.js";
import { SHA256 } from "@/assets/js/sha256.js";
import { priceToString } from "@/assets/js/common.js";
import googleIcon from "@/assets/image/icon_google.png";
import naverIcon from "@/assets/image/icon_naver.png";
import kakaosaIcon from "@/assets/image/icon_kakaosa.png";
import kakaomoIcon from "@/assets/image/icon_kakaomo.png";
import naverdaIcon from "@/assets/image/icon_naverda.png";
export default {
  data() {
    return {
      uniqueId: null,
      fromdate: null,
      todate: null,
      totalCst: 0,
      atSummarys: [],
      summarys: [],
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
  mounted() {  },
  methods: {
    setSummaryMedia(fromdate, todate, summarys) {
      var vm = this;
      vm.atSummarys = [];
      vm.summarys = [];
      vm.summarys = summarys.slice();
      vm.fromdate = fromdate;
      vm.todate = todate;
      vm.totalCst = 0;

      $.ajax({
        type: "post",
        url: API_URL + "/app/dashboard/summarymedia",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          fromdate: vm.fromdate,
          todate: vm.todate,
          session: store.state.userStore.session,
        },
        success: function (data) {
          if (data.result === "success") {
            if (!data.data) return false;
            var keys = Object.keys(data.data);
            for (let i = 0; i < keys.length; i++) {
              vm.atSummarys.push({ key: keys[i], value: data.data[keys[i]], url: vm.getImageUrl(keys[i]), sort: MEDIA_SORT[keys[i]], });
              vm.totalCst += data.data[keys[i]].cst;
            }

            vm.$emit( "changeData", vm.atSummarys.sort(function (a, b) { return a.sort < b.sort ? -1 : a.sort > b.sort ? 1 : 0; }));
          } else {
            if (data.status === "0001") {
              vm.$emit("expireSession");
            } else {
            }
          }
        },
        complete: function (data) {
          vm.$emit("summarymedia");
        },
      });
    },
    priceToString(key, salse) {
      if (salse === undefined) return "";
      var unit = "";
      if (key === "cst" || key === "cstd" || key === "cpc" || key === "cr") { unit = "원"; } 
      else if (key === "ctr" || key === "cvr" || key === "roas") { unit = "%"; } 
      else { unit = "회"; }
      return priceToString(salse) + unit;
    },
    getImageUrl(key) {
      if (key === undefined) return "";

      var url = "";
      if (key === "N") url = naverIcon;
      if (key === "Nda") url = naverdaIcon;
      if (key === "D") url = kakaosaIcon;
      if (key === "K") url = kakaomoIcon;
      if (key === "google") url = googleIcon;
      return url;
    },
    getName(key) {
      if (key === undefined) return "";

      var name = "";
      if (key === "TOTAL") name = "총 합계";
      if (key === "N") name = "네이버SA";
      if (key === "D") name = "카카오SA";
      if (key === "K") name = "카카오모먼트 ";
      if (key === "Nda") name = "네이버GFA";
      if (key === "google") name = "구글";
      return name;
    },
  },
};
</script>

<style scoped></style>
