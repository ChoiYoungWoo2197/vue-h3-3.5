<template>
  <!-- <section class="row d-flex m-h-100" :id="getUniqueId"> -->
  <section class="row d-flex">
    <big-menu :pMenu="'membermng'" @mountedMain="activeMain"></big-menu>
    <article class="admin-list">
      <div class="admin-title">
        <form class="form-inline multi-search">
          <div class="row">
            <date-range-picker
              ref="dateRangePicker"
              class="form-control"
              :pStart="pStart"
              :pEnd="end"
              :pDisabled="false"
              @changedDate="clickSearchBtn"
            >
            </date-range-picker>
            <!-- <date-picker ref="fromdate" class="form-control shadow-none rounded-0 font-14 fromdate"></date-picker>
						<date-picker ref="todate" class="form-control shadow-none rounded-0 font-14 todate"></date-picker>
						<div class="btn-group w991u">
							<button type="button" class="date-btn" @click="clickYesterDay">어제</button>
							<button type="button" class="date-btn" @click="clickSevenDay">7일</button>
							<button type="button" class="date-btn" @click="clickMonth">이번달</button>
							<button type="button" class="date-btn" @click="clickPrevMonth">지난달</button>
						</div> -->
          </div>
          <div class="row">
            <select
              class="form-control shadow-none rounded-0 mr-2 font-14"
              v-model="field"
            >
              <option value="username">광고주명</option>
              <option value="usercompany">업체명</option>
              <option value="userid">광고주ID</option>
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
          </div>
        </form>
        <div class="admin-title-bottom d-flex justify-content-between align-items-center">
          <ul class="tabmenu row">
            <li
              :class="[beShared === false ? 'active' : '']"
              class="btn d-flex justify-content-center align-items-center font-14"
              @click="clickNotShared"
            >
              내 광고주
            </li>
            <li
              :class="[beShared === true ? 'active' : '']"
              class="btn d-flex justify-content-center align-items-center font-14"
              @click="clickShared"
            >
              공유받은 광고주
            </li>
          </ul>
          <button
            type="button"
            class="form-btn color-btn w991u"
            @click="clickRegisterAdmin"
          >
            광고주 등록
          </button>
        </div>
      </div>
      <div class="w991u">
        <template v-if="beShared === false">
          <table class="agency">
            <thead>
              <tr>
                <th width="10">
                  <input
                    type="checkbox"
                    id="favorites-all"
                    value=""
                    @click="clickStarAll($event)"
                  />
                  <label
                    for="favorites-all"
                    class="noneStar"
                    :class="[sort === 'fa' ? 'activeStar' : '']"
                  ></label>
                </th>
                <th class="text-left" width="25%">업체명</th>
                <th class="text-left" width="25%">광고주ID</th>
                <th width="25%">공유</th>
                <th width="25%">이동</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="data in getDatas" :key="data.userid">
                <td class="starTd">
                  <input type="checkbox" id="favorites1" value="" />
                  <label
                    for="favorites1"
                    class="noneStar"
                    :class="[data.favorites === 'y' ? 'activeStar' : '']"
                    @click="clickStar($event, data.userid)"
                  ></label>
                </td>
                <td class="text-left" v-text="data.usercompany"></td>
                <td class="text-left" v-text="data.userid"></td>
                <!-- <td v-text="priceToString(data.salse)"></td> -->
                <td>
                  <div class="btn-group">
                    <button
                      class="btn shadow-none"
                      :class="[data.share !== null ? 'active' : '']"
                      data-toggle=""
                      data-target="#share"
                      @click="clickShare(data)"
                    >
                      공유하기
                    </button>
                  </div>
                </td>
                <td>
                  <div class="btn-group">
                    <button class="btn shadow-none" @click="clickUserLink(data.userid)">
                      바로가기
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </template>
        <template v-else>
          <table class="agency">
            <thead>
              <tr>
                <th class="text-left" width="25%">업체명</th>
                <th class="text-left" width="25%">광고주ID</th>
                <!-- <th width="100" @click="clickSort">광고비
									<template v-if="sort === null">
										<button ><i class="bi bi-caret-up-fill"></i></button>
									</template>
									<template v-else-if="sort === 'sa'">
										<button class="active "><i class="bi bi-caret-up-fill activeArrow"></i></button>
									</template>
									<template v-else>
										<button class="active "><i class="bi bi-caret-down-fill activeArrow"></i></button>
									</template>
								</th> -->
                <th class="text-left" width="25%">마스터</th>
                <th width="25%">이동</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="data in getDatas" :key="data.userid">
                <td class="text-left" v-text="data.usercompany"></td>
                <td class="text-left" v-text="data.userid"></td>
                <!-- <td v-text="priceToString(data.salse)"></td> -->
                <td class="text-left" v-text="data.username"></td>
                <td>
                  <div class="btn-group">
                    <button class="btn shadow-none" @click="clickUserLink(data.userid)">
                      바로가기
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </template>

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
            v-for="page in pages"
            :class="{ active: page - 1 === start }"
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
        <template v-if="beShared === false">
          <table class="m-agency">
            <thead>
              <tr>
                <th width="300" class="text-left">업체명</th>
                <!-- <th width="200" @click="clickSort">
                  광고비
                  <template v-if="sort === null">
                    <button class="active"><i class="bi bi-caret-up-fill"></i></button>
                  </template>
                  <template v-else-if="sort === 'sa'">
                    <button class="active">
                      <i class="bi bi-caret-up-fill activeArrow"></i>
                    </button>
                  </template>
                  <template v-else>
                    <button class="active">
                      <i class="bi bi-caret-down-fill activeArrow"></i>
                    </button>
                  </template>
                </th> -->
                <th width="50">공유</th>
                <th width="50">이동</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="data in getDatas" :key="data.userid">
                <td class="text-left">
                  {{ data.usercompany + "(" + data.userid + ")" }}
                </td>
                <!-- <td v-text="priceToString(data.salse)"></td> -->
                <td>
                  <div class="btn-group">
                    <button
                      class="btn shadow-none"
                      data-toggle=""
                      data-target="#share"
                      :class="[data.share !== null ? 'active' : '']"
                      @click="clickShare(data)"
                    >
                      <i class="bi bi-share"></i>
                    </button>
                  </div>
                </td>
                <td>
                  <div class="btn-group">
                    <button class="btn shadow-none" @click="clickUserLink(data.userid)">
                      <i class="bi bi-arrow-bar-right"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </template>
        <template v-else>
          <table class="m-agency">
            <thead>
              <tr>
                <th width="300" class="text-left">업체명</th>
                <!-- <th width="200" @click="clickSort">
                  광고비
                  <template v-if="sort === null">
                    <button class="active"><i class="bi bi-caret-up-fill"></i></button>
                  </template>
                  <template v-else-if="sort === 'sa'">
                    <button class="active">
                      <i class="bi bi-caret-up-fill activeArrow"></i>
                    </button>
                  </template>
                  <template v-else>
                    <button class="active">
                      <i class="bi bi-caret-down-fill activeArrow"></i>
                    </button>
                  </template>
                </th> -->
                <th width="120" class="text-left">마스터</th>
                <th width="80">이동</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="data in getDatas" :key="data.userid">
                <td class="text-left">
                  {{ data.usercompany + "(" + data.userid + ")" }}
                </td>
                <!-- <td v-text="priceToString(data.salse)"></td> -->
                <td v-text="data.username"></td>
                <td>
                  <div class="btn-group">
                    <button class="btn shadow-none" @click="clickUserLink(data.userid)">
                      <i class="bi bi-arrow-bar-right"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </template>

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
        <div class="mt-4 w991d">
          <button
            type="button"
            class="form-btn color-btn"
            style="width: 100%"
            @click="clickRegisterAdmin"
          >
            광고주 등록
          </button>
        </div>
      </div>
    </article>
    <expire-session-modal
      ref="expireSessionModal"
      style="display: none"
    ></expire-session-modal>
    <confirm-modal ref="confirmModal" style="display: none"></confirm-modal>
    <share-modal
      ref="shareModal"
      style="display: none"
      @updateShared="handleUpdateShared"
      @expireSession="handleExpireSession"
    ></share-modal>
    <mask-modal ref="maskModal" style="display: none"></mask-modal>
    <message-modal ref="messageModal" style="display: none">
      <template slot="message">
        <span class="text-primary font-weight-bolder" style="display: inline-block">{{
          message.title
        }}</span>
        <span>{{ message.content }}</span>
      </template>
    </message-modal>
  </section>
</template>

<script>
import $ from "jquery";
import { isMobile, priceToString } from "../../assets/js/common.js";
import { store } from "../../store/store.js";
import { SHA256 } from "../../assets/js/sha256.js";
import { API_URL, TEMP_KEY } from "../../configs/config.js";
import bigMenu from "../../components/layout/bigMenu.vue";
import confirmModal from "../../components/modal/confirmModal.vue";
import expireSessionModal from "../../components/modal/expireSessionModal.vue";
import messageModal from "../../components/modal/messageModal.vue";
import shareModal from "../../components/modal/shareModal.vue";
import datePicker from "../../components/common/datePicker.vue";
import dateRangePicker from "../../components/common/dateRangePicker.vue";
import maskModal from "../../components/modal/maskModal.vue";
import moment from "moment";

export default {
  data() {
    return {
      pStart: moment().subtract(7, "days").format("YYYY-MM-DD"),
      end: moment().subtract(1, "days").format("YYYY-MM-DD"),
      componentsKey: 0,
      uniqueId: null,
      beShared: false,
      field: "username",
      query: null,
      responseData: null,
      data: null,
      start: 0, //현재 페이지
      display: 10, //게시글의 수
      displayPageNum: isMobile() === true ? 5 : 10, // 페이지 번호의 수
      sort: "fa",
      pages: [],
      isFirst: false,
      isEnd: false,
      message: {
        title: "",
        content: "",
      },
    };
  },
  components: {
    bigMenu,
    datePicker,
    expireSessionModal,
    messageModal,
    shareModal,
    confirmModal,
    maskModal,
    dateRangePicker,
  },
  computed: {
    getUniqueId() {
      if (!this.uniqueId) {
        this.uniqueId = "vm--" + this._uid;
        return this.uniqueId;
      }
      return this.uniqueId;
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
  mounted() {
    this.beShared = false;
    // this.clickMonth();
    if (this.beShared === true) {
      this.searchDataBeShared();
    } else {
      this.searchDataNotShare();
    }
  },
  watch: {
    start() {
      if (this.beShared === true) {
        this.searchDataBeShared();
      } else {
        this.searchDataNotShare();
      }
    },
  },
  methods: {
    searchDataNotShare() {
      var vm = this;
      // this.removeStartActive();
      if (this.query !== null && this.query.length === 1) {
        alert("최소 2글자 이상 입력해주세요.");
        return false;
      }

      $.ajax({
        type: "post", //요청 메소드 방식
        url: API_URL + "/admin/share",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          query: vm.query,
          fromdate: $(".fromdate").val(),
          todate: $(".todate").val(),
          field: vm.field,
          start: vm.start,
          sort: vm.sort,
          display: vm.display,
          session: store.state.userStore.session,
        },
        // cache : false,
        // async : false,
        beforeSend: function (data) {
          vm.$refs.maskModal.showModal();
        },
        success: function (data) {
          // console.log(data);
          if (data.result === "success") {
            vm.responseData = data;
            vm.data = data.users.slice();
            vm.getStartAndEndPage();
          } else {
            if (data.status === "0001") {
              vm.handleExpireSession();
            } else {
            }
          }
        },
        error: function (a, b, c) {
          // console.log(a,b,c);
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
    searchDataBeShared() {
      var vm = this;
      var date = vm.$refs.dateRangePicker.getDate();
      if (this.query !== null && this.query.length === 1) {
        alert("최소 2글자 이상 입력해주세요.");
        return false;
      }

      $.ajax({
        type: "post", //요청 메소드 방식
        url: API_URL + "/admin/beshared",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          query: vm.query,
          fromdate: date.start,
          todate: date.end,
          field: vm.field,
          start: vm.start,
          sort: vm.sort,
          display: vm.display,
          session: store.state.userStore.session,
        },
        // cache : false,
        // async : false,
        beforeSend: function (data) {
          vm.$refs.maskModal.showModal();
        },
        success: function (data) {
          // console.log(data);
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
          // console.log(a,b,c);
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
      if (this.beShared === true) {
        this.searchDataBeShared();
      } else {
        this.searchDataNotShare();
      }
    },
    activeMain(flag) {
      this.$emit("mountedMain", true);
      this.$emit("mountedDasyboad", false);
    },
    clickNotShared() {
      this.beShared = false;
      this.start = 0;
      if (this.beShared === true) {
        this.searchDataBeShared();
      } else {
        this.searchDataNotShare();
      }
    },
    clickShared() {
      this.beShared = true;
      this.start = 0;
      if (this.beShared === true) {
        this.searchDataBeShared();
      } else {
        this.searchDataNotShare();
      }
    },
    removeStartActive() {
      $("#" + this.getUniqueId)
        .find(".starTd label")
        .each(function (label) {
          $(this).removeClass("activeStar");
        });
    },
    clickStar(event, applyuserid) {
      var favorites = "n";

      if ($(event.target).hasClass("activeStar") === false) {
        $(event.target).addClass("activeStar");
        favorites = "y";
      } else {
        $(event.target).removeClass("activeStar");
        favorites = "n";
      }

      $.ajax({
        type: "post", //요청 메소드 방식
        url: API_URL + "/admin/favorites",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          applyuserid: applyuserid,
          favorites: favorites,
          session: store.state.userStore.session,
        },
        cache: false,
        // async : false,
        beforeSend: function (data) {},
        success: function (data) {
          // console.log(data);
          if (data.result === "success") {
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
        complete: function (a, b, c) {},
      });
    },
    clickSort() {
      if (this.sort === null) {
        this.sort = "sa";
      } else if (this.sort === "sa") {
        this.sort = "sd";
      } else {
        this.sort = "sa";
      }
      this.start = 0;
      if (this.beShared === true) {
        this.searchDataBeShared();
      } else {
        this.searchDataNotShare();
      }
    },
    clickShare(data) {
      this.$refs.shareModal.showModal(data);
    },
    handleExpireSession() {
      this.$refs.expireSessionModal.showModal();
    },
    handleUpdateShared() {
      this.$refs.confirmModal.showModal();
      if (this.beShared === true) {
        this.searchDataBeShared();
      } else {
        this.searchDataNotShare();
      }
    },
    clickRegisterAdmin() {
      this.$router.push("/admin-register");
    },
    priceToString(salse) {
      if (salse === undefined) return "";

      return priceToString(salse) + "원";
    },
    clickStarAll(event) {
      if ($(event.target).next("label").hasClass("activeStar")) {
        this.sort = "fd";
      } else {
        this.sort = "fa";
      }
      this.start = 0;
      this.searchDataNotShare();
    },
    clickUserLink(userId) {
      var vm = this;
      var managerinfo = {
        userid: store.state.userStore.userinfo.userid,
        username: store.state.userStore.userinfo.username,
      };

      $.ajax({
        type: "post", //요청 메소드 방식
        url: API_URL + "/admin/userlink",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: userId,
          session: store.state.userStore.session,
        },
        beforeSend: function (data) {},
        success: function (data) {
          if (data.result === "success") {
            var userinfo = data.data.userinfo;
            var routeUrl = vm.$router.resolve({
              path: "/bdashboard",
              query: {
                session: userinfo.session,
                token: userinfo.token,
                usercompany: userinfo.usercompany,
                useremail: userinfo.useremail,
                userid: userinfo.userid,
                userlevel: userinfo.userlevel,
                username: userinfo.username,
                userpassupdate: userinfo.userpassupdate,
                userphone: userinfo.userphone,
                userregdate: userinfo.userregdate,
                userseq: userinfo.userseq,
                userstatus: userinfo.userstatus,
                managername: managerinfo.username,
                manageruserid: managerinfo.userid,
                manageruserphone: managerinfo.userphone,
                manageruseremail: managerinfo.useremail,
              },
            });
            window.open(routeUrl.href, "_blank");
          } else {
            if (data.status === "0001") {
              vm.handleExpireSession();
            } else if (data.status === "1004") {
              vm.message.title = userId;
              vm.message.content = "광고주에게 접근할 수 없습니다.";

              vm.$refs.messageModal.showModal();
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
        complete: function (a, b, c) {},
      });
    },
  },
};
</script>

<style scoped>
.activeStar {
  background: url("../../assets/image/star-fill.svg") no-repeat center !important;
}

.noneStar {
  display: inline-block;
  width: 50px;
  height: 50px;
  cursor: pointer;
  background: url("../../assets/image/star.svg") no-repeat center;
}
.activeArrow {
  color: #7186d3;
}
</style>
