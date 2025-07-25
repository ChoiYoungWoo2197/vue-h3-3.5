<template>
  <section class="row d-flex">
    <big-menu :pMenu="'agencylst'" @mountedMain="activeMain"> </big-menu>
    <article class="admin-list">
      <div class="admin-title d-flex justify-content-between align-items-center row">
        <h3 class="mb-3">에이전트 리스트</h3>
        <form class="form-inline single-search">
          <select class="form-control shadow-none rounded-0 mr-2 font-14" v-model="field">
            <option value="username">에이전트명</option>
            <option value="userid">에이전트ID</option>
            <option value="usercompany">업체명</option>
          </select>
          <div class="input-group">
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
      <div class="m-none">
        <table>
          <thead>
            <tr>
              <th class="text-left" width="300">에이전트구분</th>
              <th class="text-left w1300u" width="300">업체명</th>
              <th class="text-left w1300u" width="200">에이전트명</th>
              <th class="text-left" width="200">에이전트ID</th>
              <th class="text-left" width="100">광고계정</th>
              <th class="text-left" width="200">광고쉐어계정</th>
              <th class="text-left" width="100">상태</th>
              <th class="text-left" width="200">등록일</th>
              <th width="300">승인여부</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(data, index) in getDatas"
              :key="index"
              @click="clickTr(data, $event)"
            >
              <td class="text-left" v-text="getUserLevel(data.userlevel)"></td>
              <td class="text-left w1300u" v-text="data.usercompany"></td>
              <td class="text-left w1300u" v-text="data.username"></td>
              <td class="text-left" v-text="data.userid"></td>
              <td class="text-left" v-text="data.usercount"></td>
              <td class="text-left" v-text="data.sharecount"></td>
              <td class="text-left" v-text="getUserStatus(data.userstatus)"></td>
              <td class="text-left" v-text="dateFormat(data.userregdate)"></td>
              <td>
                <div class="btn-group" role="group">
                  <button
                    type="button"
                    class="btn shadow-none width-60"
                    data-toggle="modal"
                    data-target="#joinApprove"
                    @click="clickJoinApprove(data, $event)"
                    :class="[data.userstatus === 1 ? 'active disable' : '']"
                  >
                    승인
                  </button>
                  <button
                    type="button"
                    class="btn shadow-none width-60"
                    data-toggle="modal"
                    data-target="#joinRefuse"
                    @click="clickJoinRefuse(data, $event)"
                    :class="[data.userstatus === 0 ? 'activeRefuse disable' : '']"
                  >
                    미승인
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
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
      <div class="w991d">
        <div class="m-table">
          <ul
            v-for="(data, index) in getDatas"
            :key="index"
            @click="clickTr(data, $event)"
          >
            <div>
              <li class="p-0">
                {{ data.username }}<span>{{ data.userid }}</span>
              </li>
              <li class="p-0" v-text="dateFormat(data.userregdate)"></li>
            </div>
            <div>
              <li class="p-0" v-text="data.usercompany"></li>
              <li class="p-0" v-text="getUserLevel(data.userlevel)"></li>
            </div>
            <div class="btn-group" role="group">
              <button
                type="button"
                class="btn shadow-none"
                data-toggle="modal"
                data-target="#joinApprove"
                @click="clickJoinApprove(data, $event)"
                :class="[data.userstatus === 1 ? 'active disable' : '']"
              >
                승인
              </button>
              <button
                type="button"
                class="btn shadow-none"
                data-toggle="modal"
                data-target="#joinRefuse"
                @click="clickJoinRefuse(data, $event)"
                :class="[data.userstatus === 0 ? 'activeRefuse disable' : '']"
              >
                미승인
              </button>
            </div>
          </ul>
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
    <mask-modal ref="maskModal" style="display: none"></mask-modal>
    <confirm-modal ref="confirmModal" style="display: none"></confirm-modal>
    <expire-session-modal
      ref="expireSessionModal"
      style="display: none"
    ></expire-session-modal>
    <join-mng-agency-modal
      ref="joinMngAgencyModal"
      style="display: none"
      @updateUserStatus="handleUpdateUserStatus"
      @expireSession="handleExpireSession"
    ></join-mng-agency-modal>
  </section>
</template>

<script>
import $ from "jquery";
import moment from "moment";
import { API_URL, TEMP_KEY } from "../../configs/config.js";
import { SHA256 } from "../../assets/js/sha256.js";
import bigMenu from "../../components/layout/bigMenu.vue";
import expireSessionModal from "../../components/modal/expireSessionModal.vue";
import joinMngAgencyModal from "../../components/modal/joinMngAgencyModal.vue";
import confirmModal from "../../components/modal/confirmModal.vue";
import maskModal from "../../components/modal/maskModal.vue";
import { store } from "../../store/store.js";
import { isMobile } from "../../assets/js/common.js";

export default {
  data() {
    return {
      field: "username",
      query: null,
      responseData: null,
      data: null,
      start: 0, //현재 페이지
      display: 10, //게시글의 수
      displayPageNum: isMobile() === true ? 5 : 10, // 페이지 번호의 수
      sort: "dd",
      pages: [],
      isFirst: false,
      isEnd: false,
    };
  },
  components: {
    bigMenu,
    expireSessionModal,
    joinMngAgencyModal,
    confirmModal,
    maskModal,
  },
  mounted() {
    this.searchData();
  },
  computed: {
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
  methods: {
    searchData() {
      var vm = this;
      if (this.query !== null && this.query.length === 1) {
        alert("최소 2글자 이상 입력해주세요.");
        return false;
      }

      $.ajax({
        type: "post", //요청 메소드 방식
        url: API_URL + "/admin/agent",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          query: vm.query,
          field: vm.field,
          display: vm.display,
          start: vm.start,
          sort: vm.sort,
          session: store.state.userStore.session,
        },
        cache: false,
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
      var currentPage = this.start - 1;
      this.start = this.start === 0 ? 0 : this.start - 1;
    },
    clickNextEndPageBtn() {
      let tempEndPage = Math.ceil(this.responseData.totalcount / this.display);
      this.start = tempEndPage - 1;
    },
    clickNextPageBtn() {
      let tempEndPage = Math.ceil(this.responseData.totalcount / this.display);
      this.start = this.start > tempEndPage ? tempEndPage : this.start + 1;
      // console.log(this.start, tempEndPage);
    },
    clickPageBtn(page) {
      this.start = page;
    },
    clickSearchBtn() {
      this.start = 0;
      this.searchData();
    },
    clickJoinApprove(data, event) {
      if (this.isExistDisable(event)) return false;
      var vm = this;
      this.$refs.joinMngAgencyModal.showModal({
        joinRefuse: false,
        userLevel: vm.getUserLevel(data.userlevel),
        username: data.username,
        userid: data.userid,
      });
    },
    clickJoinRefuse(data) {
      if (this.isExistDisable(event)) return false;
      var vm = this;
      this.$refs.joinMngAgencyModal.showModal({
        joinRefuse: true,
        userLevel: vm.getUserLevel(data.userlevel),
        username: data.username,
        userid: data.userid,
      });
    },
    activeMain(flag) {
      this.$emit("mountedMain", true);
      this.$emit("mountedDasyboad", false);
    },
    handleExpireSession() {
      this.$refs.expireSessionModal.showModal();
    },
    handleUpdateUserStatus() {
      this.$refs.confirmModal.showModal();
      this.searchData();
    },
    getUserStatus(userStatus) {
      // console.log(userStatus);
      if (userStatus === 0) return "미승인";
      else if (userStatus === 1) return "승인";
      else if (userStatus === 2) return "거절";
      else if (userStatus === 3) return "보류";
      else if (userStatus === 98) return "퇴사";
      else return "탈퇴";
    },
    getUserLevel(userlevel) {
      if (userlevel === 2) {
        return "마케터";
      } else if (userlevel === 3) {
        return "채널";
      }
    },
    isExistDisable(event) {
      return $(event.target).hasClass("disable");
    },
    dateFormat(date) {
      return moment(date).format("YYYY-MM-DD");
    },
    clickTr(data, $event) {
      if ($($event.target).hasClass("btn") === true) return false;
      this.$router.push({
        name: "AgencyEdit",
        query: {
          pData: JSON.stringify(data),
        },
      });
    },
  },
};
</script>

<style scoped>
.activeRefuse {
  background: #dc573a !important;
  color: #fff !important;
  border: 1px solid #dc573a !important;
  transition: 0s !important;
}
</style>
