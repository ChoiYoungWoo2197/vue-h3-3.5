<template>
  <!-- 하단 메뉴 -->
  <div
    class="offcanvas offcanvas-bottom alarm d-none"
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
        <div class="title"><h2>알람</h2></div>
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
        <article class="alarm">
          <div class="title d-flex justify-content-between align-items-center">
            <h3>알람</h3>
            <div class="indicator d-flex align-items-center dropdown">
              <button
                type="button"
                class="btn shadow-none p-0"
                data-toggle="dropdown"
                aria-expanded="false"
                @click="$router.push('/alarms-set').catch(() => {})"
              >
                <i class="bi bi-gear m-0"></i>
              </button>
              <div class="dropdown-menu dropdown-menu-right">
                <form></form>
              </div>
            </div>
          </div>
          <div
            class="m-table d-flex"
            v-for="(data, i) in getDatasForMain"
            :key="i + '-' + getUuidv4()"
          >
            <ul>
              <div class="m-table-title">
                <div class="w-100">
                  <li class="font-weight-bold d-flex align-items-center">
                    {{ "" + data.content }}
                  </li>
                  <li>
                    <small>
                      <span class="badge badge-pill badge-light">
                        {{ data.daily_dt }}
                      </span>
                    </small>
                    <small>
                      <span class="badge badge-pill badge-light">
                        {{ data.media }}
                      </span>
                    </small>
                    <small>
                      <span class="badge badge-pill badge-light">
                        {{ data.type }}
                      </span>
                    </small>
                  </li>
                </div>
              </div>
              <div class="m-table-content">
                <div class="w-100 d-flex flex-wrap">
                  <li class="col-12"></li>
                </div>
              </div>
            </ul>
          </div>
          <ul class="pagination d-flex justify-content-center align-items-center mb-30">
            <li class="page-item">
              <a
                class="page-link shadow-none"
                href="javascript:;"
                aria-label="Previous"
                @click="clickPreviousFirstPageBtnForMain"
              >
                <span aria-hidden="true"
                  ><i class="bi bi-chevron-double-left m-0"></i></span
              ></a>
            </li>
            <li class="page-item" :class="{ disabled: isFirstPageGroupForMain }">
              <a
                class="page-link shadow-none"
                href="javascript:;"
                aria-label="Previous"
                @click="clickPreviousPageBtnForMain"
              >
                <span aria-hidden="true"><i class="bi bi-chevron-left"></i></span>
              </a>
            </li>
            <li
              class="page-item"
              :class="{ active: page - 1 === main.start }"
              v-for="page in main.pages"
              :key="page"
            >
              <a
                class="page-link shadow-none"
                href="javascript:;"
                v-text="page"
                @click="clickPageBtnForMain(page - 1)"
              ></a>
            </li>
            <li class="page-item" :class="{ disabled: isLastPageGroupForMain }">
              <a
                class="page-link shadow-none"
                href="javascript:;"
                aria-label="Next"
                @click="clickNextPageBtnForMain"
              >
                <span aria-hidden="true"><i class="bi bi-chevron-right"></i></span>
              </a>
            </li>
            <li class="page-item">
              <a
                class="page-link shadow-none"
                href="javascript:;"
                aria-label="Next"
                @click="clickNextEndPageBtnForMain"
              >
                <span><i class="bi bi-chevron-double-right m-0"></i></span
              ></a>
            </li>
          </ul>
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
import { store } from "../../../store/store.js";
import { SHA256 } from "../../../assets/js/sha256.js";
import { API_URL, TEMP_KEY } from "../../../configs/config.js";

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
      main: {
        field: "",
        query: null,
        topads: null,
        responseData: null,
        data: null,
        start: 0, //현재 페이지
        display: 10, //게시글의 수
        displayPageNum: isMobile() === true ? 5 : 10, // 페이지 번호의 수
        isTotalCount: "-1",
        sort: "imd",
        pages: [],
        isFirst: false,
        isEnd: false,
      },
    };
  },
  components: {},
  mounted() {
    clearBody();
    addClassDashboard();
    this.$emit("mountedMain", true);
    this.clickSearchBtn();
  },
  computed: {
    getUniqueId() {
      if (!this.uniqueId) {
        this.uniqueId = "vm-" + this._uid;
        return this.uniqueId;
      }
      return this.uniqueId;
    },
    getDatasForMain() {
      return this.main.data;
    },
    isFirstPageGroupForMain() {
      return this.main.isFirst;
    },
    isLastPageGroupForMain() {
      return this.main.isEnd;
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
    clickSearchBtn() {
      this.main.start = 0;
      this.main.isTotalCount = "-1";
      this.getReport();
    },
    getReport() {
      var vm = this;

      $.ajax({
        type: "get", //요청 메소드 방식
        url: API_URL + "/app/alarm/alarm",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          fromdate: "",
          todate: "",
          start: vm.main.start,
          sort: "",
          display: vm.main.display,
          totalcount: vm.main.isTotalCount,
          mode: "user",
          session: store.state.userStore.session,
        },
        beforeSend: function (data) {
          // vm.handleShowMask();
          // vm.showMaskPannelForReport = true;
        },
        success: function (data) {
          if (data.result === "success") {
            vm.main.data = [];
            vm.main.responseData = null;
            vm.main.responseData = data;
            vm.main.data = data.data.alarms.slice();
            vm.getStartAndEndPageForMain();
          } else {
            if (data.status === "0001") {
              vm.handleExpireSession();
            } else {
            }
          }
        },
        error: function (a, b, c) {
          if (a.status === 403) {
            vm.$store.commit("logout");
            vm.$store.commit("logoutActivedMdias");
            vm.$store.commit("logoutKakaoSa");
            vm.$router.push("/");
          }
        },
        complete: function (a, b, c) {
          // vm.handleHideMask();
          // vm.showMaskPannelForReport = false;
        },
      });
    },
    getStartAndEndPageForMain() {
      // this.main.isTotalCount !== '0' ? this.main.responseData.totalcount = this.main.isTotalCount : this.main.isTotalCount = this.main.responseData.totalcount;
      this.main.isTotalCount = this.main.responseData.totalcount;

      this.main.pages = [];
      var endPage =
        Math.ceil((this.main.start + 1) / this.main.displayPageNum) *
        this.main.displayPageNum;
      var startPage = endPage - this.main.displayPageNum + 1;
      var tempEndPage = Math.ceil(this.main.responseData.totalcount / this.main.display);
      if (endPage > tempEndPage) {
        endPage = tempEndPage;
      }

      this.main.isFirst = this.main.start + 1 === 1 ? true : false;
      this.main.isEnd =
        Math.ceil(this.main.responseData.totalcount / this.main.display) ===
        this.main.start + 1
          ? true
          : false;

      for (var i = startPage; i <= endPage; i++) {
        this.main.pages.push(i);
      }
    },
    clickPreviousFirstPageBtnForMain() {
      this.main.start = 0;
      this.getReport();
    },
    clickPreviousPageBtnForMain() {
      this.main.start = this.main.start === 0 ? 0 : this.main.start - 1;
      this.getReport();
    },
    clickNextEndPageBtnForMain() {
      let tempEndPage = Math.ceil(this.main.responseData.totalcount / this.main.display);
      this.main.start = tempEndPage - 1;
      this.getReport();
    },
    clickNextPageBtnForMain() {
      let tempEndPage = Math.ceil(this.main.responseData.totalcount / this.main.display);
      this.main.start = this.main.start > tempEndPage ? tempEndPage : this.main.start + 1;
      this.getReport();
    },
    clickPageBtnForMain(page) {
      this.main.start = page;
      this.getReport();
    },
  },
};
</script>

<style></style>
