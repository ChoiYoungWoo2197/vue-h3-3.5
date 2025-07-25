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
          <h3>공유하기</h3>
          <h5>공유할 마케터를 선택해 주세요.</h5>
        </div>
        <form class="form-inline" onkeydown="return event.key == 'Enter' ? false : true">
          <select class="form-control shadow-none rounded-0 mr-2 font-14" v-model="field">
            <option value="managername">마케터명</option>
            <option value="managerid">마케터ID</option>
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
        <div class="share d-flex">
          <div class="modal-select mr-2">
            <button
              type="button"
              v-for="(data, index) in getDatas"
              :key="index"
              @click="clickAdd(data)"
            >
              <div class="d-flex justify-content-between align-items-center">
                <template v-if="data.visible === true">
                  <p>
                    {{ data.username }}<span> {{ data.userid }}</span>
                  </p>
                </template>
                <template v-else>
                  <p>
                    <strike
                      >{{ data.username }}<span> {{ data.userid }}</span></strike
                    >
                  </p>
                </template>
                <i class="bi bi-chevron-right"></i>
              </div>
            </button>
          </div>
          <div class="modal-selected">
            <button
              type="button"
              v-for="(data, index) in getShared"
              :key="index"
              @click="clickRemove(data)"
            >
              <div class="d-flex justify-content-between align-items-center">
                <p>
                  {{ data.username }}<span>{{ data.userid }}</span>
                </p>
                <i class="bi bi-x-lg"></i>
              </div>
            </button>
          </div>
        </div>
        <div class="modal-button d-flex">
          <button class="btn shadow-none mr-2" data-dismiss="modal">닫기</button>
          <button
            class="btn shadow-none"
            data-toggle="modal"
            data-target="#confirm"
            @click="submitForm"
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
  data() {
    return {
      uniqueId: null,
      userInfo: null,
      field: "managername",
      query: null,
      datas: [],
      shared: [],
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
    getShared() {
      return this.shared;
    },
  },
  methods: {
    hideModal() {
      $("." + this.getUniqueId).modal("hide");
    },
    showModal(data) {
      this.initForm();
      this.userInfo = data;
      this.findSharedMarketers();
      this.findMarketers();
      $("." + this.getUniqueId).modal("show");
    },
    initForm() {
      this.userInfo = null;
      this.field = "managername";
      this.query = null;
      this.shared = [];
    },
    findSharedMarketers() {
      if (this.userInfo.share === null) return false;

      if (this.userInfo.share !== "") {
        var keys = Object.keys(this.userInfo.share);
        for (let i = 0; i < keys.length; i++) {
          this.shared.push({
            userid: keys[i],
            username: this.userInfo.share[keys[i]],
          });
        }
      }
    },
    findMarketers() {
      var vm = this;
      $.ajax({
        type: "POST", //요청 메소드 방식
        url: API_URL + "/admin/findmarketers",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          userlevel: "2",
          managerid: vm.field === "managerid" ? vm.query : "",
          managername: vm.field === "managername" ? vm.query : "",
          session: store.state.userStore.session,
        },
        success: function (data) {
          vm.datas = [];
          if (data.result === "success") {
            var keys = Object.keys(data.marketers);

            for (let i = 0; i < keys.length; i++) {
              // console.log(vm.shared);
              var found = vm.shared.find(function (marketer, index) {
                if (marketer.userid === keys[i]) {
                  return keys[i];
                }
              });

              if (store.state.userStore.userinfo.userid === keys[i]) continue;

              vm.datas.push({
                userid: keys[i],
                username: data.marketers[keys[i]],
                visible: found === undefined ? true : false,
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
    clickAdd(data) {
      if (data.visible === false) {
        alert("마케터가 중복되었습니다.");
        return false;
      }

      var found = this.datas.find(function (marketer, index) {
        if (marketer.userid === data.userid) {
          return marketer;
        }
      });

      found.visible = false;

      this.shared.push({
        userid: found.userid,
        username: found.username,
      });
    },
    clickRemove(data) {
      var vm = this;
      var found = this.datas.find(function (marketer, index) {
        if (marketer.userid === data.userid) {
          return marketer;
        }
      });

      found.visible = true;

      vm.shared.find(function (marketer, index) {
        if (marketer === undefined) return;

        if (marketer.userid === data.userid) {
          vm.shared.splice(index, 1);
        }
      });
    },
    submitForm() {
      var vm = this;

      // if(this.shared.length === 0) {
      //     alert("마케터를 선택해주세요.");
      //     return false;
      // }

      var shares = [];
      this.shared.forEach(function (marketer) {
        shares.push(marketer.userid);
      });

      $.ajax({
        type: "POST", //요청 메소드 방식
        url: API_URL + "/admin/share/update",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          applyuserid: vm.userInfo.userid,
          sharemanager: shares,
          session: store.state.userStore.session,
        },
        success: function (data) {
          if (data.result === "success") {
            vm.hideModal();
            vm.$emit("updateShared");
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
    clickSearchBtn() {
      if (this.query !== null && this.query.length === 1) {
        alert("최소 2글자 이상 입력해주세요.");
        return false;
      }

      this.findMarketers();
    },
  },
};
</script>

<style scoped></style>
