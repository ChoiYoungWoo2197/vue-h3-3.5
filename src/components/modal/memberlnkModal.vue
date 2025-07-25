<template>
  <div
    class="modal fade show"
    :class="getUniqueId"
    id="share"
    data-backdrop="static"
    data-keyboard="false"
    aria-labelledby="share"
    aria-modal="true"
    role="dialog"
    tabindex="-1"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-title">
          <h3 class="title-color">계정통합관리</h3>
        </div>
        <form class="form-inline" onkeydown="return event.key == 'Enter' ? false : true">
          <select class="form-control shadow-none rounded-0 mr-2 font-14" v-model="field">
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
              @keyup.enter="clickSearchBtn"
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
        <div
          class="admin-title-bottom d-flex justify-content-between align-items-center mbp-20"
        >
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
        </div>

        <div class="modal-select width-100">
          <button
            type="button"
            v-for="data in getDatas"
            :key="data.userid"
            :class="[userIdButton === data.userid ? 'activeButton' : '']"
            @click="clickButton(data.userid)"
          >
            <div class="d-flex justify-content-between align-items-center">
              <p>
                {{ data.usercompany }}<span>{{ data.userid }}</span>
              </p>
            </div>
          </button>
        </div>
        <div class="modal-button d-flex">
          <button class="btn shadow-none mr-2" data-dismiss="modal">닫기</button>
          <button
            class="btn shadow-none"
            data-toggle="modal"
            data-target="#confirm"
            @click="clickUserLink"
          >
            확인
          </button>
        </div>
      </div>
    </div>

    <message-modal ref="messageModal" style="display: none">
      <template slot="message">
        <span class="text-primary font-weight-bolder" style="display: inline-block"
          >7일</span
        >
        <span>이내의 데이터(시간별)만 조회가능합니다.</span>
      </template>
    </message-modal>
  </div>
</template>

<script>
import $ from "jquery";
import { store } from "../../store/store.js";
import { API_URL, TEMP_KEY } from "../../configs/config.js";
import { SHA256 } from "../../assets/js/sha256.js";
import messageModal from "../modal/messageModal.vue";

export default {
  data() {
    return {
      uniqueId: null,
      field: "usercompany",
      query: null,
      data: null,
      userIdButton: null,
      beShared: false,
    };
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
      return this.data;
    },
  },
  components: {
    messageModal,
  },
  methods: {
    hideModal() {
      $("." + this.getUniqueId).modal("hide");
    },
    showModal(data) {
      $("." + this.getUniqueId).modal("show");
      this.beShared = false;
      this.userIdButton = null;
      this.beShared === false ? this.searchDataNotShare() : this.searchDataBeShared();
    },
    clickSearchBtn() {
      this.userIdButton = null;
      this.beShared === false ? this.searchDataNotShare() : this.searchDataBeShared();
    },
    searchDataNotShare() {
      var vm = this;
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
          fromdate: "",
          todate: "",
          field: vm.field,
          start: 0,
          sort: "",
          display: "100",
          session: store.state.userStore.session,
        },
        beforeSend: function (data) {
          // vm.$refs.maskModal.showModal();
        },
        success: function (data) {
          vm.data = [];
          if (data.result === "success") {
            vm.data = data.users.slice();
          } else {
            if (data.status === "0001") {
              vm.$emit("expireSession");
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
          // vm.$refs.maskModal.hideModal();
        },
      });
    },
    searchDataBeShared() {
      var vm = this;
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
          fromdate: "",
          todate: "",
          field: vm.field,
          start: 0,
          sort: "",
          display: "100",
          session: store.state.userStore.session,
        },
        beforeSend: function (data) {
          // vm.$refs.maskModal.showModal();
        },
        success: function (data) {
          vm.data = [];
          if (data.result === "success") {
            vm.data = data.users.slice();
          } else {
            if (data.status === "0001") {
              vm.$emit("expireSession");
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
          // vm.$refs.maskModal.hideModal();
        },
      });
    },
    clickNotShared() {
      this.beShared = false;
      this.userIdButton = null;
      this.beShared === false ? this.searchDataNotShare() : this.searchDataBeShared();
    },
    clickShared() {
      this.beShared = true;
      this.userIdButton = null;
      this.beShared === false ? this.searchDataNotShare() : this.searchDataBeShared();
    },
    clickButton(userid) {
      this.userIdButton = userid;
    },
    clickUserLink() {
      var vm = this;
      var managerinfo = {
        userid: store.state.userStore.userinfo.userid,
        username: store.state.userStore.userinfo.username,
      };

      if (!this.userIdButton) {
        alert("광고주를 선택해주세요.");
        return false;
      }

      $.ajax({
        type: "post", //요청 메소드 방식
        url: API_URL + "/admin/userlink",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: this.userIdButton,
          session: store.state.userStore.session,
        },
        beforeSend: function (data) {},
        success: function (data) {
          if (data.result === "success") {
            var userinfo = data.data.userinfo;
            vm.$store.commit("setStateManager", {
              managerinfo: { username: userinfo.username, userid: userinfo.userid },
            });
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
              },
            });
            window.open(routeUrl.href, "_blank");
          } else {
            if (data.status === "0001") {
              vm.$emit("expireSession");
            } else if (data.status === "1004") {
              // vm.message.title = userId;
              // vm.message.content = "광고주에게 접근할 수 없습니다.";

              // vm.$refs.messageModal.showModal();
              alert("광고주에게 접근할 수 없습니다.");
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
.title-color {
  color: #666 !important;
}
.active {
  background: #666 !important;
  color: #fff !important;
  border: 1px solid #666;
}
.activeButton {
  background: #666 !important;
  color: #fff !important;
}
.tabmenu li {
  width: 150px;
  height: 40px;
  border: 1px solid #ddd;
  border-radius: 0;
  background: #fff;
  color: #666;
}
</style>
