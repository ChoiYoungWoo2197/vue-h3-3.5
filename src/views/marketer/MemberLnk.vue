<template>
  <!-- <section class="row d-flex m-h-100"> -->
  <section class="row d-flex">
    <big-menu :pMenu="'memberlnk'" @mountedMain="activeMain"></big-menu>
    <article class="admin-list marketer-list m-none">
      <form class="form-inline">
        <div class="input-group">
          <input
            class="form-control shadow-none rounded-0 font-14"
            type="search"
            placeholder="검색"
            aria-label="Search"
            v-model="queryName"
          />
          <div class="input-group-append">
            <button
              class="input-group-text btn shadow-none rounded-0 search"
              type="submit"
              @click.prevent="clickSearchMarketersBtn"
            >
              <i class="bi bi-search"></i>
            </button>
          </div>
        </div>
      </form>
      <div class="marketer-select">
        <button
          type="button"
          v-for="data in getDataMarketers"
          :key="data.userid"
          :class="[userIdButton === data.userid ? 'activeButton' : '']"
          @click="clickButton(data.userid)"
        >
          <div class="d-flex justify-content-between align-items-center">
            <p>
              {{ data.username }}<span>{{ data.userid }}</span>
            </p>
            <i class="bi bi-chevron-right"></i>
          </div>
        </button>
      </div>
    </article>
    <article class="admin-list m-none">
      <div class="admin-title d-flex justify-content-between row">
        <h3>업체 리스트</h3>
        <form class="form-inline">
          <select class="form-control shadow-none rounded-0 mr-2 font-14" v-model="field">
            <option value="usercompany">업체명</option>
            <option value="userid">광고주ID</option>
          </select>
          <div class="input-group mr-2">
            <input
              class="form-control shadow-none rounded-0 font-14"
              type="search"
              placeholder="검색"
              aria-label="Search"
              v-model="query"
            />
            <div class="input-group-append">
              <button
                class="input-group-text btn shadow-none rounded-0 search"
                type="submit"
                @click.prevent="clickSearchBtn"
              >
                <i class="bi bi-search"></i>
              </button>
            </div>
          </div>
        </form>
      </div>
      <div class="marketer-company-wrap">
        <table>
          <thead>
            <tr>
              <th width="10">
                <input
                  type="checkbox"
                  id="marketer-company-all"
                  v-model="checkItemAll"
                  @change="clickCheckItemAll"
                />
                <label for="marketer-company-all"></label>
              </th>
              <th class="text-left" width="400">업체명</th>
              <th class="text-left" width="400">광고주ID</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="data in getDatas" :key="data.userid">
              <td>
                <input
                  type="checkbox"
                  :id="'marketer-company1-' + data.userid"
                  :value="data.userid"
                  v-model="checkItem"
                  @click="clickCheckItem"
                />
                <label :for="'marketer-company1-' + data.userid"></label>
              </td>
              <td class="text-left">{{ data.usercompany }}</td>
              <td class="text-left">{{ data.userid }}</td>
            </tr>
          </tbody>
        </table>
        <div class="d-flex justify-content-end">
          <button
            type="button"
            class="form-btn color-btn btn-bottom"
            data-toggle="modal"
            data-target="#companyMove"
            @click="clickJoinApprove()"
          >
            계정이동
          </button>
        </div>
        <ul class="pagination d-flex justify-content-center align-items-center">
          <li class="page-item">
            <a
              class="page-link shadow-none"
              href="javascript:;"
              aria-label="Previous"
              @click="clickPreviousFirstPageBtn"
            >
              <span aria-hidden="true"><i class="bi bi-chevron-double-left m-0"></i></span
            ></a>
          </li>
          <li class="page-item" :class="{ disabled: isFirstPageGroup }">
            <a
              class="page-link shadow-none"
              href="javascript:;"
              aria-label="Previous"
              @click="clickPreviousPageBtn"
            >
              <span aria-hidden="true"><i class="bi bi-chevron-left"></i></span>
            </a>
          </li>
          <li
            class="page-item"
            :class="{ active: page - 1 === start }"
            v-for="page in pages"
            :key="page"
          >
            <a
              class="page-link shadow-none"
              href="javascript:;"
              v-text="page"
              @click="clickPageBtn(page - 1)"
            ></a>
          </li>
          <li class="page-item" :class="{ disabled: isLastPageGroup }">
            <a
              class="page-link shadow-none"
              href="javascript:;"
              aria-label="Next"
              @click="clickNextPageBtn"
            >
              <span aria-hidden="true"><i class="bi bi-chevron-right"></i></span>
            </a>
          </li>
          <li class="page-item">
            <a
              class="page-link shadow-none"
              href="javascript:;"
              aria-label="Next"
              @click="clickNextEndPageBtn"
            >
              <span><i class="bi bi-chevron-double-right m-0"></i></span
            ></a>
          </li>
        </ul>
      </div>
    </article>
    <div
      class="pc-only w991d d-flex justify-content-center align-items-center flex-column"
    >
      <i class="bi bi-x-circle"></i>
      <p>PC전용 기능입니다.</p>
      <p>PC버전에서 확인해 주세요.</p>
    </div>
    <expire-session-modal
      ref="expireSessionModal"
      style="display: none"
    ></expire-session-modal>
    <confirm-modal ref="confirmModal" style="display: none"></confirm-modal>
    <join-approve-modal
      ref="joinApproveModal"
      :pSingle="false"
      style="display: none"
      @updateUserStatus="handleUpdateUserStatus"
      @expireSession="handleExpireSession"
    ></join-approve-modal>
    <mask-modal ref="maskModal" style="display: none"></mask-modal>
  </section>
</template>

<script>
import $ from "jquery";
import { isMobile } from "../../assets/js/common.js";
import { store } from "../../store/store.js";
import { SHA256 } from "../../assets/js/sha256.js";
import { API_URL, TEMP_KEY } from "../../configs/config.js";
import bigMenu from "../../components/layout/bigMenu.vue";
import confirmModal from "../../components/modal/confirmModal.vue";
import expireSessionModal from "../../components/modal/expireSessionModal.vue";
import joinApproveModal from "../../components/modal/joinApproveModal.vue";
import maskModal from "../../components/modal/maskModal.vue";

export default {
  data() {
    return {
      queryName: null,
      responseDataMarketers: null,
      dataMarketers: null,
      field: "usercompany",
      query: null,
      responseData: null,
      data: null,
      start: 0, //현재 페이지
      display: 10, //게시글의 수
      displayPageNum: isMobile() === true ? 5 : 10, // 페이지 번호의 수
      sort: null,
      pages: [],
      isFirst: false,
      isEnd: false,
      userIdButton: null,
      checkItem: [],
      checkItemAll: false,
    };
  },
  components: {
    bigMenu,
    expireSessionModal,
    joinApproveModal,
    confirmModal,
    maskModal,
  },
  computed: {
    getDataMarketers() {
      return this.dataMarketers;
    },
    getDatas() {
      return this.data;
    },
    isFirstPageGroup() {
      return this.isFirst;
    },
    isLastPageGroup() {
      return this.isEnd;
    },
  },
  watch: {
    start() {
      this.searchData();
    },
  },
  mounted() {
    this.findMarketers();
  },
  methods: {
    clearCheckItem() {
      this.checkItem = [];
      this.checkItemAll = false;
    },
    activeMain(flag) {
      this.$emit("mountedMain", true);
      this.$emit("mountedDasyboad", false);
    },
    findMarketers() {
      var vm = this;
      this.clearCheckItem();
      $.ajax({
        type: "POST", //요청 메소드 방식
        url: API_URL + "/admin/marketers",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          query: vm.queryName,
          field: "username",
          session: store.state.userStore.session,
        },
        cache: false,
        beforeSend: function (data) {
          vm.$refs.maskModal.showModal();
        },
        success: function (data) {
          vm.dataMarketers = [];
          if (data.result === "success") {
            if (data.marketers === undefined) return;

            var keys = Object.keys(data.marketers);
            for (let i = 0; i < keys.length; i++) {
              vm.dataMarketers.push({
                userid: keys[i],
                username: data.marketers[keys[i]],
              });
            }
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
          vm.$refs.maskModal.hideModal();
        },
      });
    },
    handleExpireSession() {
      this.$refs.expireSessionModal.showModal();
    },
    handleUpdateUserStatus() {
      this.$refs.confirmModal.showModal();
      this.searchData();
    },
    clickButton(userid) {
      this.userIdButton = userid;
      this.start = 0;
      this.searchData();
    },
    clickSearchMarketersBtn() {
      if (this.queryName !== null && this.queryName.length === 1) {
        alert("최소 2글자 이상 입력해주세요.");
        return false;
      }
      this.findMarketers();
    },
    searchData() {
      var vm = this;
      this.clearCheckItem();
      if (this.query !== null && this.query.length === 1) {
        alert("최소 2글자 이상 입력해주세요.");
        return false;
      }

      $.ajax({
        type: "post", //요청 메소드 방식
        url: API_URL + "/admin/users",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          query: vm.query,
          manager: vm.userIdButton,
          field: vm.field,
          display: vm.display,
          start: vm.start,
          sort: vm.sort,
          session: store.state.userStore.session,
        },
        cache: false,
        // async : false,
        beforeSend: function (data) {
          vm.$refs.maskModal.showModal();
        },
        success: function (data) {
          if (data.result === "success") {
            vm.responseData = data;
            vm.data = data.users;
            vm.getStartAndEndPage();
          } else {
            if (data.status === "0001") {
              vm.handleExpireSession();
            } else {
            }
          }
        },
        error: function (a, b, c) {
          console.log(a, b, c);
        },
        complete: function (a, b, c) {
          vm.$refs.maskModal.hideModal();
        },
      });
    },
    getStartAndEndPage() {
      this.pages = [];
      var endPage =
        Math.ceil((this.start + 1) / this.displayPageNum) * this.displayPageNum;
      var startPage = endPage - this.displayPageNum + 1;
      var tempEndPage = Math.ceil(this.responseData.totalcount / this.display);
      if (endPage > tempEndPage) {
        endPage = tempEndPage;
      }

      // console.log(startPage, endPage);
      this.isFirst = this.start + 1 === 1 ? true : false;
      this.isEnd =
        Math.ceil(this.responseData.totalcount / this.display) === this.start + 1
          ? true
          : false;

      for (var i = startPage; i <= endPage; i++) {
        this.pages.push(i);
      }
    },
    clickPreviousFirstPageBtn() {
      this.start = 0;
    },
    clickPreviousPageBtn() {
      this.start = this.start === 0 ? 0 : this.start - 1;
    },
    clickNextEndPageBtn() {
      let tempEndPage = Math.ceil(this.responseData.totalcount / this.display);
      this.start = tempEndPage - 1;
    },
    clickNextPageBtn() {
      let tempEndPage = Math.ceil(this.responseData.totalcount / this.display);
      this.start = this.start > tempEndPage ? tempEndPage : this.start + 1;
    },

    clickPageBtn(page) {
      this.start = page;
    },
    clickSearchBtn() {
      this.start = 0;
      this.searchData();
    },
    clickJoinApprove() {
      if (this.checkItem.length === 0) {
        alert("광고주를 선택해주세요.");
        return false;
      }
      this.$refs.joinApproveModal.showModalForLnk(this.checkItem);
    },
    clickCheckItem() {
      this.checkItemAll = false;
    },
    clickCheckItemAll: function () {
      var vm = this;
      vm.checkItem = [];

      if (vm.data === null) vm.checkItem = [];
      else {
        if (vm.checkItemAll) {
          vm.data.forEach(function (user) {
            vm.checkItem.push(user.userid);
          });
        }
      }
    },
  },
};
</script>

<style scoped>
.activeButton {
  background: #666 !important;
  color: #fff !important;
}
</style>
