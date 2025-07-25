<template>
  <!-- 실시간 잔액 -->
  <div
    class="offcanvas offcanvas-bottom balance d-none"
    tabindex="-1"
    id="date-select"
    aria-labelledby="date-selectLabel"
    :class="getUniqueId"
  >
    <div class="offcanvas-header">
      <nav class="d-flex justify-content-between align-items-center">
        <div class="menu-info d-flex align-items-center">
          <div class="logo d-flex justify-content-center align-items-center">
            <a
              href="dashboard1-1.html"
              class="d-flex justify-content-center align-items-center"
              ><img
                src="@/assets/image/icon_heeil.png"
                alt="희일커뮤니케이션"
                class="icon"
            /></a>
          </div>
        </div>
        <div class="title"><h2>잔액</h2></div>
        <div class="menu-icon d-flex justify-content-center align-items-center">
          <button
            type="button"
            class="btn d-flex justify-content-center align-items-center"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          >
            <i class="bi bi-x-lg icon" @click="clickSubmit"></i>
          </button>
        </div>
      </nav>
    </div>
    <div class="offcanvas-body">
      <div class="d-flex flex-column">
        <article class="balance">
          <div class="title"><h3>잔액</h3></div>
          <table>
            <colgroup>
              <col width="40%" />
              <col width="60%" />
            </colgroup>
            <tbody>
              <tr v-for="(data, index2) in balance" :key="index2 + '-' + getUuidv4()">
                <td>
                  <img :src="data.murl" alt="아이콘" class="icon" />
                  <span> {{ data.media === "K" ? "모먼트" : "검색" }}</span>
                </td>
                <td>
                  <span class="bold">{{ priceToString(data.balance) }}</span
                  >원
                </td>
              </tr>
            </tbody>
          </table>
        </article>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import {
  clearBody,
  addClassDashboard,
  isMobile,
  uuidv4,
  priceToString,
  showLayout,
} from "../../../assets/js/common.js";
import dateRangePicker from "../../common/dateRangePicker.vue";
import moment from "moment";

export default {
  props: {
    pBalance: Array,
    pMenu: null,
    pDasyboard: false,
  },
  data() {
    return {
      balance: [],
      menu: null,
      uniqueId: null,
    };
  },
  components: {},
  mounted() {
    clearBody();
    addClassDashboard();
    this.$emit("mountedMain", true);
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
  watch: {
    pBalance: {
      deep: true,
      handler(value) {
        this.balance = this.copyObject(value);
      },
    },
  },
  methods: {
    getUuidv4() {
      return uuidv4();
    },
    copyObject(object) {
      return JSON.parse(JSON.stringify(object));
    },
    clickSubmit() {
      showLayout();
      this.$emit("closeBtn");
    },
    priceToString(salse) {
      if (salse === undefined) return "";

      return priceToString(salse);
    },
  },
};
</script>

<style></style>
