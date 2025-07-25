<template>
  <div class="d-flex m-h-100">
    <big-menu-2 :pMenu="'alarms'" @mountedMain="activeMain"></big-menu-2>
    <div class="wrap">
      <balance @logOut="handleLogOut"></balance>
      <section>
        <div class="title d-flex justify-content-between align-items-center">
          <h2>알림</h2>
        </div>
        <article>
          <!--<div class="title"><h3></h3></div>-->
          <table class="report alarm">
            <thead>
              <tr>
                <td width="20%">알림 일시</td>
                <td width="20%">구분</td>
                <td width="20%">유형</td>
                <td width="40%">변경 내용</td>
              </tr>
            </thead>
            <tbody>
              <template v-if="getDatasForMain === null || getDatasForMain.length === 0">
                <tr>
                  <td colspan="4" class="text-center">데이터가 존재하지 않습니다.</td>
                </tr>
              </template>
              <template v-else>
                <tr v-for="(data, i) in getDatasForMain" :key="i + 'L'">
                  <td>{{ data.daily_dt }}</td>
                  <td>{{ data.media }}</td>
                  <td>{{ data.type }}</td>
                  <td>{{ data.content }}</td>
                </tr>
              </template>
            </tbody>
          </table>
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
      </section>
    </div>

    <log-out-modal ref="logOutModal" style="display: none"></log-out-modal>
    <expire-session-modal
      ref="expireSessionModal"
      style="display: none"
    ></expire-session-modal>
    <mask-modal ref="maskModal" style="display: none"></mask-modal>
  </div>
</template>

<script>
import $ from "jquery";
import moment from "moment";
import { isMobile, priceToString, getMedia } from "../../assets/js/common.js";
import expireSessionModal from "../../components/modal/expireSessionModal.vue";
import messageModal from "../../components/modal/messageModal.vue";
import maskModal from "../../components/modal/maskModal.vue";
import { store } from "../../store/store.js";
import { SHA256 } from "../../assets/js/sha256.js";
import { API_URL, TEMP_KEY } from "../../configs/config.js";
import balance from "../../components/dashboard2/balance.vue";
import bigMenu2 from "../../components/layout/bigMenu2.vue";
import logOutModal from "../../components/modal/logOutModal.vue";

export default {
  data() {
    return {
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
  computed: {
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
  components: {
    bigMenu2,
    logOutModal,
    balance,
    expireSessionModal,
    messageModal,
    maskModal,
  },
  mounted() {
    $(".main").removeClass("m-h-100");
    this.clickSearchBtn();
  },
  methods: {
    activeMain(flag) {
      this.$emit("mountedMain", true);
      this.$emit("mountedDasyboad", true);
    },
    handleLogOut() {
      this.$refs.logOutModal.showModal();
    },
    handleExpireSession() {
      this.$refs.expireSessionModal.showModal();
    },
    handleShowMask() {
      this.$refs.maskModal.showModal();
    },
    handleHideMask() {
      this.$refs.maskModal.hideModal();
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
          vm.handleShowMask();
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
          vm.handleHideMask();
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

<style scoped></style>
