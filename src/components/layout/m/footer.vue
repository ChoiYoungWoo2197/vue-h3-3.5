<template>
  <!-- 하단바 -->
  <div
    class="m-footer bottom d-flex justify-content-center align-items-center"
    :class="getUniqueId"
  >
    <button
      class="btn d-flex justify-content-center align-items-center shadow-none"
      :class="[footer === 'home' ? 'btn-outline-primary' : '']"
      type="button"
      @click="clickHome('home')"
    >
      <i class="bi bi-house icon"></i><span>홈</span>
    </button>
    <button
      class="btn d-flex justify-content-center align-items-center shadow-none"
      :class="[footer === 'balance' ? 'btn-outline-primary' : '']"
      type="button"
      @click="clickBalance('balance')"
    >
      <i class="bi bi-coin icon"></i><span>잔액</span>
    </button>
    <button
      class="btn d-flex justify-content-center align-items-center shadow-none"
      :class="[footer === 'date' ? 'btn-outline-primary' : '']"
      type="button"
      data-bs-toggle="offcanvas"
      data-bs-target="#date-select"
      aria-controls="date-select"
      @click="clickDate('date')"
    >
      <i class="bi bi-calendar-check icon"></i><span>기간</span>
    </button>
    <button
      class="btn d-flex justify-content-center align-items-center shadow-none"
      :class="[footer === 'alarm' ? 'btn-outline-primary' : '']"
      type="button"
      @click="clickAlarm('alarm')"
    >
      <i class="bi bi-bell icon"></i><span>알림</span>
    </button>
    <button
      class="btn d-flex justify-content-center align-items-center shadow-none"
      :class="[footer === 'fmenu' ? 'btn-outline-primary' : '']"
      type="button"
      @click="clickFmenu('fmenu')"
    >
      <i class="bi bi-three-dots-vertical icon"></i><span>더보기</span>
    </button>
  </div>
</template>

<script>
import $ from "jquery";
import {
  clearBody,
  addClassDashboard,
  isMobile,
  hideLayout,
  showLayout,
  hideOffcanvas,
} from "../../../assets/js/common.js";

export default {
  props: {
    pMenu: null,
    pDasyboard: false,
  },
  data() {
    return {
      menu: null,
      uniqueId: null,
      date: { start: null, end: null },
      footer: "home",
    };
  },
  mounted() {
    this.menu = this.pMenu;
    clearBody();
    addClassDashboard();
    this.$emit("mountedMain", true);
  },
  watch: {
    // pFooter() {
    //   this.footer = this.pFooter;
    //   console.log('ffffff', this.footer);
    // }
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
  methods: {
    hideLayout() {
      let top = document.querySelector(".m-wrap > .m-top");
      let footer = document.querySelector(".m-wrap > .m-footer");
      let section = document.querySelector(".m-wrap > section");

      top.classList.add("d-none");
      footer.classList.add("d-none");
      section.classList.add("d-none");
    },
    hideOffcanvas() {
      let offcanvas = document.querySelectorAll(".offcanvas-bottom");
      offcanvas.forEach(function (el) {
        if (el) el.classList.add("d-none");
      });
    },
    clickDate(footer) {
      this.footer = footer;
      // this.hideOffcanvas();
      // this.hideLayout();
      hideLayout();
      hideOffcanvas();

      let dateRangePicker = document.querySelector(".m-wrap > .date-range-picker");
      dateRangePicker.classList.remove("d-none");
    },
    clickBalance(footer) {
      this.footer = footer;
      // this.hideOffcanvas();
      // this.hideLayout();
      hideLayout();
      hideOffcanvas();

      let balance = document.querySelector(".m-wrap > .balance");
      balance.classList.remove("d-none");
    },
    clickFmenu(footer) {
      this.footer = footer;
      // this.hideOffcanvas();
      // this.hideLayout();
      hideLayout();
      hideOffcanvas();

      let fmenu = document.querySelector(".m-wrap > .fmenu");
      fmenu.classList.remove("d-none");
    },
    clickAlarm(footer) {
      this.footer = footer;
      // this.hideOffcanvas();
      // this.hideLayout();
      hideLayout();
      hideOffcanvas();

      let alarm = document.querySelector(".m-wrap > .alarm");
      alarm.classList.remove("d-none");
    },
    clickHome(footer) {
      this.footer = footer;
      showLayout();
    },
    setFooter(footer) {
      this.footer = footer;
    },
    clickDbEdit(footer) {
      this.footer = footer;

      hideLayout();
      hideOffcanvas();

      let dbEdit = document.querySelector(".m-wrap > " + "." + footer);
      dbEdit.classList.remove("d-none");
    },
  },
};
</script>

<style></style>
