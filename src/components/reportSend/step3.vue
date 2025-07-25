<template>
  <form onkeydown="return event.key == 'Enter' ? false : true" :class="getUniqueId">
    <div class="form-group row mb-4">
      <div class="col-xl-6 row align-items-center mb-2">
        <label for="" class="form-label col-xl-3">광고성지표</label>
        <div class="col-xl-9">
          <article class="collapse show m-0 p-0" id="kpiBtnBoxContainerCollapse">
            <ul class="media-btn-box-container">
              <li
                v-for="(k, i) in kpis"
                :key="i + '-' + getUuidv4()"
                @click="clickkpi(k.key)"
              >
                <input type="checkbox" />
                <label for="" :class="k.check ? 'active' : ''">
                  {{ k.name }}
                  <span>
                    <i class="bi" :class="k.check ? 'bi-check active' : 'bi-plus'"></i>
                  </span>
                </label>
              </li>
            </ul>
          </article>
        </div>
        <div v-if="error.kpiErrorMsg.length > 0" class="invalid-feedback d-block">
          {{ error.kpiErrorMsg }}
        </div>
      </div>
      <div class="col-xl-6 row align-items-center mb-2">
        <label for="" class="form-label col-xl-3">정렬(내림차순)</label>
        <div class="col-xl-9">
          <article class="collapse show m-0 p-0" id="sortBtnBoxContainerCollapse">
            <ul class="media-btn-box-container">
              <li
                v-for="(s, i) in sort"
                :key="i + '-' + getUuidv4()"
                @click="clicksort(s.key)"
              >
                <input type="checkbox" />
                <label for="" :class="s.check ? 'active' : ''">
                  {{ s.name }}
                  <span>
                    <i class="bi" :class="s.check ? 'bi-check active' : 'bi-plus'"></i>
                  </span>
                </label>
              </li>
            </ul>
          </article>
        </div>
        <div v-if="error.sortErrorMsg.length > 0" class="invalid-feedback d-block">
          {{ error.sortErrorMsg }}
        </div>
      </div>
    </div>
    <two-btn @prev="prev" @next="next"></two-btn>
  </form>
</template>

<script>
import { store } from "../../store/store.js";
import twoBtn from "./twoBtn.vue";
import {
  isMobile,
  priceToString,
  getMedia,
  uuidv4,
  getType,
} from "../../assets/js/common.js";

export default {
  props: {},
  data() {
    return {
      ajax: {
        kpi: true,
        sort: true,
      },
      uniqueId: null,
      step: 3,
      last: 5,
      kpis: [
        { name: "노출수", key: "im", check: false },
        { name: "클릭수", key: "clk", check: false },
        { name: "클릭률", key: "ctr", check: false },
        { name: "클릭당비용", key: "cpc", check: false },
        { name: "광고비", key: "cst", check: false },
        { name: "전환수", key: "cv", check: false },
        { name: "전환율", key: "cvr", check: false },
        { name: "전환매출", key: "cr", check: false },
        { name: "전환당비용", key: "cpa", check: false },
        { name: "ROAS", key: "roas", check: false },
      ],
      sort: [
        { name: "노출수", key: "im", check: false, value: 2 },
        { name: "클릭수", key: "clk", check: false, value: 3 },
        { name: "클릭률", key: "ctr", check: false, value: 7 },
        { name: "클릭당비용", key: "cpc", check: false, value: 9 },
        { name: "광고비", key: "cst", check: false, value: 1 },
        { name: "전환수", key: "cv", check: false, value: 4 },
        { name: "전환율", key: "cvr", check: false, value: 5 },
        { name: "전환매출", key: "cr", check: false, value: 6 },
        { name: "전환당비용", key: "cpa", check: false, value: 8 },
        { name: "ROAS", key: "roas", check: false, value: 10 },
      ],
      error: {
        kpiErrorMsg: "",
        sortErrorMsg: "",
      },
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
  components: {
    twoBtn,
  },
  watch: {},
  mounted() {},
  methods: {
    getUuidv4() {
      return uuidv4();
    },
    prev() {
      let vm = this;
      vm.$emit("prev");
    },
    next() {
      let vm = this;
      vm.ajax.kpi = true;
      vm.ajax.sort = true;
      vm.validate();
      vm.ajax.kpi && vm.ajax.sort ? vm.$emit("next") : "";
    },
    getData() {
      let vm = this;
      return {
        kpis: vm.kpis,
        sort: vm.sort,
      };
    },
    validate() {
      this.checkKpi();
      this.checkSort();
    },
    checkKpi() {
      let vm = this;
      let cnt = 0;
      vm.ajax.kpi = false;
      this.kpis.forEach(function (k) {
        if (k.check) {
          cnt += 1;
          vm.ajax.kpi = true;
        }
      });

      if (cnt < vm.last) vm.ajax.kpi = false;

      !vm.ajax.kpi
        ? (vm.error.kpiErrorMsg = "지표를 5개이상 선택하세요.")
        : (vm.error.kpiErrorMsg = "");
    },
    clickkpi(key) {
      this.kpis.forEach(function (k) {
        if (k.key === key) k.check = !k.check;
      });
    },
    checkSort() {
      let vm = this;
      vm.ajax.sort = false;
      vm.sort.forEach(function (s) {
        if (s.check) vm.ajax.sort = true;
      });

      !vm.ajax.sort
        ? (vm.error.sortErrorMsg = "정렬을 선택하세요.")
        : (vm.error.sortErrorMsg = "");
    },
    clicksort(key) {
      let vm = this;
      vm.sort.forEach(function (s, i) {
        vm.sort[i].check = false;

        if (s.key === key) vm.sort[i].check = true;
      });
    },
  },
};
</script>

<style></style>
