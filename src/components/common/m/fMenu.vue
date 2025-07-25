<template>
  <!-- 하단 메뉴 -->
  <div
    class="offcanvas offcanvas-bottom fmenu d-none"
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
        <div class="title"><h2>더보기</h2></div>
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
        <article class="fmenu">
          <div class="title"><h3>더보기</h3></div>
          <div class="list-group">
            <a
              href="#"
              class="list-group-item list-group-item-action d-flex align-items-center justify-content-between"
              @click="clickLogOut"
            >
              <div>로그아웃</div>
              <i class="bi bi-chevron-right"></i>
            </a>
            <a
              href="#"
              class="list-group-item list-group-item-action d-flex align-items-center justify-content-between"
              @click="clickDashboardEdit"
            >
              <div>정보수정</div>
              <i class="bi bi-chevron-right"></i>
            </a>
            <a
              href="#"
              class="list-group-item list-group-item-action d-flex align-items-center justify-content-between"
              @click="clickDmMode"
            >
              <div>PC버전으로 보기</div>
              <i class="bi bi-chevron-right"></i
            ></a>
          </div>
          <!-- <ul class="list-group">
            <li class="list-group-item d-flex align-items-center justify-content-between">
              <div>로그아웃</div>
              <i class="bi bi-chevron-right"></i>
            </li>
            <li class="list-group-item d-flex align-items-center justify-content-between">
              <div>정보수정</div>
              <i class="bi bi-chevron-right"></i>
            </li>
            <li class="list-group-item d-flex align-items-center justify-content-between">
              <div>PC버전으로 보기</div>
              <i class="bi bi-chevron-right"></i>
            </li>
          </ul> -->
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
    clickLogOut() {
      this.$emit("logout");
    },
    clickDashboardEdit() {
      this.$emit("dbedit");
    },
    clickDmMode() {
      document.cookie = "DesktopMode=false";
      window.scrollTo(0, 0);
      this.$router.go();
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
