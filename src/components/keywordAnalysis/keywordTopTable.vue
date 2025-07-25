<template>
  <table :class="getUniqueId">
    <thead>
      <tr>
        <td width="40px">#</td>
        <td class="text-left" width="15%">캠페인</td>
        <td class="text-left" width="15%">광고그룹</td>
        <td class="text-left" width="15%">품질지수</td>
        <td class="text-left" width="35%">키워드</td>
        <td class="text-right pr-0"></td>
        <td class="text-right pl-0" width="8%">%</td>        
      </tr>
    </thead>
    <tbody>
    </tbody>
  </table>
</template>

<script>
import $ from "jquery";
import {  isMobile,  priceToString,  getMedia,  uuidv4,  getUnit, getType,  getKpiName} from "@/assets/js/common.js";
import { store } from "@/store/store.js";
import { SHA256 } from "@/assets/js/sha256.js";
import { API_URL, TEMP_KEY } from "@/configs/config.js";

export default {
  props: {},
  data() {
    return {
      uniqueId: null,
    };
  },
  computed: {
    getUniqueId() {
      if (!this.uniqueId) {
        this.uniqueId = "vm-" + this._uid;
        return this.uniqueId;
      }
      return this.uniqueId;
    },
  },
  components: {},
  watch: {},
  mounted() {},
  methods: {},
};
</script>

<style></style>
