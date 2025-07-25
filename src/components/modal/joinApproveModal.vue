<template>
  <div
    class="modal fade"
    :id="getUniqueId"
    data-backdrop="static"
    data-keyboard="false"
    tabindex="-1"
    aria-labelledby="joinApprove"
    style="display: none"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-title">
          <h3>가입승인</h3>
          <h5>권한을 부여할 마스터를 선택해 주세요.</h5>
        </div>
        <form class="form-inline" onkeydown="return event.key == 'Enter' ? false : true">
          <select class="form-control shadow-none rounded-0 mr-2 font-14" v-model="field">
            <option value="username">마케터명</option>
            <option value="userid">마케터ID</option>
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
        <div class="modal-select">
          <button
            type="button"
            v-for="(data, index) in getDatas"
            :key="index"
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
          <!-- <template v-if="single === true">
						<button type="button" v-for="(data, index) in getDatas" 
						:key="index"
						:class="[userIdButton === data.userid ? 'activeButton' : '']"
						@click="clickButton(data.userid)">
							<div class="d-flex justify-content-between align-items-center">
								<p>{{data.username}}<span>{{data.userid}}</span></p>
								<i class="bi bi-chevron-right"></i>
							</div>
						</button>
					</template>
					<template v-else>
						<button type="button" v-for="(data, index) in getDatas" 
						:key="index"
						:class="[userIdButtons.indexOf(data.userid) > -1  ? 'activeButton' : '']"
						@click="clickButtonForLnk(data.userid)">
							<div class="d-flex justify-content-between align-items-center">
								<p>{{data.username}}<span>{{data.userid}}</span></p>
								<i class="bi bi-chevron-right"></i>
							</div>
						</button>
					</template> -->
        </div>
        <div class="modal-button d-flex">
          <button class="btn shadow-none mr-2" data-dismiss="modal">닫기</button>
          <button
            v-if="single === true"
            class="btn shadow-none"
            data-toggle="modal"
            data-target="#confirm"
            @click="submitForm"
          >
            확인
          </button>
          <button
            v-if="single === false"
            class="btn shadow-none"
            data-toggle="modal"
            data-target="#confirm"
            @click="submitFormForLnk"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import { store } from "../../store/store.js";
import { API_URL, TEMP_KEY } from "../../configs/config.js";
import { SHA256 } from "../../assets/js/sha256.js";

export default {
  props: {
    pSingle: null,
  },
  data() {
    return {
      uniqueId: null,
      field: "username",
      query: null,
      datas: [],
      userIdButton: null,
      userIdButtons: [],
      applyuserid: null,
      applyuserids: [],
      single: true,
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
      return this.datas;
    },
  },
  mounted() {
    this.single = this.pSingle;
  },
  methods: {
    hideModal() {
      $("#" + this.getUniqueId).modal("hide");
    },
    showModal(applyuserid) {
      this.initForm();
      this.findMarketers();
      this.applyuserid = applyuserid;
      $("#" + this.getUniqueId).modal("show");
    },
    showModalForLnk(applyuserids) {
      this.initForm();
      this.findMarketers();
      this.applyuserids = applyuserids.slice();
      $("#" + this.getUniqueId).modal("show");
    },
    clickButton(userid) {
      this.userIdButton = userid;
    },
    clickButtonForLnk(userid) {
      var vm = this;
      if (this.userIdButtons.indexOf(userid) > -1) {
        this.userIdButtons.find(function (marketer, index) {
          if (marketer === undefined) return;

          if (marketer === userid) {
            vm.userIdButtons.splice(index, 1);
          }
        });
      } else {
        this.userIdButtons.push(userid);
      }
    },
    clickSearchBtn() {
      if (this.query !== null && this.query.length === 1) {
        alert("최소 2글자 이상 입력해주세요.");
        return false;
      }

      this.findMarketers();
    },
    initForm() {
      this.field = "username";
      this.query = null;
      this.datas = [];
      this.userIdButton = null;
      this.userIdButtons = [];
      this.applyuserid = null;
      this.applyuserids = [];
    },
    findMarketers() {
      var vm = this;
      $.ajax({
        type: "POST", //요청 메소드 방식
        url: API_URL + "/admin/marketers",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          query: vm.query,
          field: vm.field,
          session: store.state.userStore.session,
        },
        cache: false,
        success: function (data) {
          vm.datas = [];
          if (data.result === "success") {
            var keys = Object.keys(data.marketers);
            for (let i = 0; i < keys.length; i++) {
              vm.datas.push({
                userid: keys[i],
                username: data.marketers[keys[i]],
              });
            }
          } else {
            if (data.status === "0001") {
              vm.$emit("expireSession");
            } else {
            }
          }
        },
        error: function (a, b, c) {},
        finally: function (a, b, c) {},
      });
    },
    submitForm() {
      var vm = this;
      if (this.userIdButton === null) {
        alert("마케터를 선택해주세요.");
        return false;
      }

      $.ajax({
        type: "POST", //요청 메소드 방식
        url: API_URL + "/admin/userstatus",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          applyuserid: vm.applyuserid,
          manageruserid: vm.userIdButton,
          userstatus: "1",
          session: store.state.userStore.session,
        },
        cache: false,
        // async : false,
        success: function (data) {
          if (data.result === "success") {
            vm.hideModal();
            vm.$emit("updateUserStatus");
          } else {
            if (data.status === "0001") {
              vm.$emit("expireSession");
            } else if (data.status === "0004") {
              alert(data.errormessage);
            }
          }
        },
        error: function (a, b, c) {},
        finally: function (a, b, c) {},
      });
    },
    submitFormForLnk() {
      var vm = this;
      // if(this.userIdButtons.length === 0) {
      // 	alert("마케터를 선택해주세요.");
      // 	return false;
      // }

      if (this.userIdButton === null) {
        alert("마케터를 선택해주세요.");
        return false;
      }

      $.ajax({
        type: "POST", //요청 메소드 방식
        url: API_URL + "/admin/usertransfer",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          applyuserid: vm.applyuserids,
          manageruserid: vm.userIdButton,
          session: store.state.userStore.session,
        },
        cache: false,
        // async : false,
        success: function (data) {
          if (data.result === "success") {
            vm.hideModal();
            vm.$emit("updateUserStatus");
          } else {
            if (data.status === "0001") {
              vm.$emit("expireSession");
            } else if (data.status === "0004") {
              alert(data.errormessage);
            }
          }
        },
        error: function (a, b, c) {},
        finally: function (a, b, c) {},
      });
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
