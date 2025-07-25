<template>
  <div
    class="modal fade show dashboard-modal"
    :class="getUniqueId"
    id="dashboardModal"
    data-backdrop="static"
    data-keyboard="false"
    aria-labelledby="dashboardModal"
    aria-modal="true"
    role="dialog"
    tabindex="-1"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-title">
          <h3>지표</h3>
          <h5>표시할 지표를 선택해 주세요.</h5>
        </div>
        <div class="share d-flex">
          <div class="modal-select w-100">
            <button
              :class="data.visible ? 'active' : ''"
              type="button"
              v-for="(data, index) in summarys"
              :key="index"
              @click="clickAdd(data)"
            >
              <div class="d-flex justify-content-between align-items-center">
                <template v-if="data.visible === true">
                  <p>
                    {{ data.text }}
                  </p>
                </template>
                <template v-else>
                  <p>
                    <strike>{{ data.text }}</strike>
                  </p>
                </template>
                <i class="bi bi-chevron-right"></i>
              </div>
            </button>
          </div>
          <!-- <div class="modal-selected">
                    </div> -->
        </div>
        <div class="modal-button d-flex two-btn">
          <button class="btn shadow-none select-cancel" @click="cancelForm">닫기</button>
          <button
            class="btn shadow-none select-save"
            data-toggle="modal"
            data-target="#confirm"
            @click="submitForm"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import { store } from "../../store/store.js";
import { API_URL, TEMP_KEY } from "../../configs/config.js";
import { SHA256 } from "../../assets/js/sha256.js";

export default {
  props: {
    pSummarys: Array,
  },
  data() {
    return {
      uniqueId: null,
      summarys: [
        { key: "cst", text: "총광고비", visible: true },
        { key: "im", text: "총노출수", visible: true },
        { key: "clk", text: "총클릭수", visible: true },
        { key: "cv", text: "총전환수", visible: false },
        { key: "cr", text: "총전환매출", visible: false },
        { key: "ctr", text: "총클릭율", visible: true },
        { key: "cpc", text: "총클릭당비용", visible: true },
        { key: "cpa", text: "총전환당비용", visible: false },
        { key: "cvr", text: "총전환율", visible: false },
        { key: "roas", text: "총ROAS", visible: false },
      ],
    };
  },
  mounted() {
    // console.log(this.pSummarys);
  },
  computed: {
    getUniqueId() {
      if (!this.uniqueId) {
        this.uniqueId = "vm-modal-" + this._uid;
        return this.uniqueId;
      }
      return this.uniqueId;
    },
    getDatas() {
      return this.datas;
    },
  },
  watch: {
    pSummarys: {
      deep: true,
      handler(value) {
        // this.summarys = this.copyObject(this.pSummarys);
      },
    },
  },
  methods: {
    copyObject(object) {
      return JSON.parse(JSON.stringify(object));
    },
    hideModal() {
      $("." + this.getUniqueId).modal("hide");
    },
    showModal() {
      this.initForm();
      // console.log("ddd");
      $("." + this.getUniqueId).modal("show");
    },
    cancelForm() {
      this.summarys = this.pSummarys.slice();
      this.hideModal();
    },
    clickAdd(data) {
      let vm = this;
      let c = 0;
      vm.summarys.forEach(function (summary, index) {
        if (summary.visible) c = c + 1;
      });

      // if(c === 1 && !data.visible) {
      //   alert("최소 1개는 선택되어야 합니다.");
      //   return false;
      // }

      if (c >= 5 && !data.visible) {
        alert("최대 5개까지 선택할 수 있습니다.");
        return false;
      }

      vm.summarys.forEach(function (summary, index) {
        if (summary.key === data.key) summary.visible = !data.visible;
      });
    },
    initForm() {},
    submitForm() {
      this.$emit("selectedSummary", this.summarys);
    },
  },
};
</script>

<style scoped></style>
