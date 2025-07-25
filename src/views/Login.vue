<template>
  <section
    id="login"
    class="bg-login m-h-100 d-flex align-items-center"
    :key="componentKey"
  >
    <article
      class="login-wrap container-xl d-flex justify-content-center align-items-center modal-dialog-centered"
    >
      <div class="wrap row col-xl-5 col-lg-6 col-md-8 col-12 bg-white rounded-lg shadow">
        <div class="process-title mb-3 col-12">
          <img src="../assets/image/h3.png" alt="h3" />
          <h3><a href="https://h3.heeil.com/find-id" class="font-30">로그인</a></h3>
        </div>
        <form
          @submit.prevent="submitForm"
          onkeydown="return event.key == 'Enter' ? false : true"
          class="mb-3 col-12"
          @keyup.enter="submitForm"
        >
          <div class="input-group mb-3">
            <span class="input-group-text" id="loginId"
              ><i class="bi bi-person-fill"></i
            ></span>
            <input
              type="id"
              class="form-control shadow-none"
              placeholder="아이디"
              aria-label="loginId"
              aria-describedby="loginId"
              v-model="loginId"
            />
            <div
              v-if="loginIdErrorMessage.length > 0"
              id="loginIdfeedback"
              class="invalid-feedback d-block"
            >
              {{ loginIdErrorMessage }}
            </div>
          </div>
          <div class="input-group mb-3">
            <span class="input-group-text" id="loginPw"
              ><i class="bi bi-key-fill"></i
            ></span>
            <input
              type="password"
              class="form-control shadow-none"
              placeholder="비밀번호"
              aria-label="loginPw"
              aria-describedby="loginPw"
              v-model="loginPw"
            />
            <div
              v-if="loginPwErrorMessage.length > 0"
              id="loginPwfeedback"
              class="invalid-feedback d-block"
            >
              {{ loginPwErrorMessage }}
            </div>
          </div>
          <div v-if="logMessage.length > 0" class="input-group mb-3">
            <div class="invalid-feedback d-block">{{ logMessage }}</div>
          </div>
          <div class="form-check mb-3">
            <input
              type="checkbox"
              class="form-check-input shadow-none"
              id="idRemember"
              checked=""
              value="true"
              v-model="checkId"
            />
            <label class="form-check-label" for="idRemember">아이디 저장</label>
          </div>

          <button
            type="submit"
            class="btn col-12 shadow-none btn-hover"
            data-toggle="modal"
            data-target="#waiting"
          >
            로그인
          </button>
          <!--<button type="submit" class="btn col-12 shadow-none btn-hover">로그인</button>-->
        </form>
        <ul class="login-btn">
          <li><router-link to="/find-id">아이디 찾기</router-link></li>
          <li><router-link to="/find-pw">비밀번호 찾기</router-link></li>
          <li><router-link to="/terms">회원가입</router-link></li>
        </ul>
      </div>
    </article>
    <waiting-modal ref="waitingModal" style="display: none"></waiting-modal>
    <rejecting-modal ref="rejectingModal" style="display: none"></rejecting-modal>
    <holding-modal ref="holdingModal" style="display: none"></holding-modal>
    <view-menu @mountedMain="handleMountedMain"></view-menu>
  </section>
</template>

<script>
import $ from "jquery";
import { isblank, clearBody, addClassView } from "../assets/js/common.js";
import { SHA256 } from "../assets/js/sha256.js";
import { API_URL, TEMP_KEY } from "../configs/config.js";
import waitingModal from "../components/modal/waitingModal.vue";
import rejectingModal from "../components/modal/rejectingModal.vue";
import holdingModal from "../components/modal/holdingModal.vue";
import viewMenu from "../components/layout/viewMenu.vue";

export default {
  data() {
    return {
      loginId: "",
      loginPw: "",
      loginIdErrorMessage: "",
      loginPwErrorMessage: "",
      logMessage: "",
      checkId: false,
      componentKey: 0,
    };
  },
  components: {
    viewMenu,
    waitingModal,
    rejectingModal,
    holdingModal,
  },
  created() {
    // if(window.localStorage.getItem('vuex')) window.localStorage.clear();
  },
  mounted() {
    // window.localStorage.clear(); //일주일만 돌림
    $("#app").addClass("m-h-100");
    $("#footer").removeClass("bg-light");
    $("#footer").addClass("bg-dark");
    $(".modal-backdrop").remove();
    this.initForm();
  },
  destroyed() {
    // console.log('destroy');
  },
  methods: {
    forceRerender() {
      this.componentKey += 1;
    },
    handleMountedMain() {
      this.$emit("mountedMain", false);
    },
    submitForm() {
      this.loginIdErrorMessage = "";
      this.loginPwErrorMessage = "";
      this.logMessage = "";

      var vm = this;
      var ajax = true;

      if (isblank(this.loginId)) {
        this.loginIdErrorMessage = "아이디를 입력해주세요.";
        ajax = false;
      }

      if (isblank(this.loginPw)) {
        this.loginPwErrorMessage = "비밀번호를 입력해주세요.";
        ajax = false;
      }

      if (ajax) {
        $.ajax({
          type: "POST", //요청 메소드 방식
          url: API_URL + "/user/login",
          headers: { authorization: SHA256(TEMP_KEY) },
          data: {
            userid: vm.loginId,
            userpass: vm.loginPw,
          },
          cache: false,
          success: function (data) {
            // console.log(data);
            if (vm.checkId) {
              vm.$cookies.set("loginId", vm.loginId);
            }

            if (data.result === "success") {
              if (data.userinfo.userstatus === 0) {
                //대기
                vm.$refs.waitingModal.showModal();
              } else if (data.userinfo.userstatus === 1) {
                //승인
                vm.$store.commit("login", data);
                vm.$store.commit("initCount");

                if (
                  data.userinfo.userlevel === 99 ||
                  data.userinfo.userlevel === 2 ||
                  data.userinfo.userlevel === 3
                ) {
                  vm.$router.push("/agency");
                } else {
                  vm.$router.push("/dashboard");
                  vm.$store.dispatch("setKakaoSa", data.session);
                }
              } else if (data.userinfo.userstatus === 2) {
                //거절
                vm.$refs.rejectingModal.showModal();
              } else if (data.userinfo.userstatus === 3) {
                //보류
                vm.$refs.holdingModal.showModal(data);
              }
              vm.initForm();
            } else {
              if (data.errormessage) vm.logMessage = data.errormessage;
              if (data.db.errormessage) vm.logMessage = data.db.errormessage;
            }
          },
          error: function (a, b, c) {
            vm.logMessage = b;
          },
          finally: function (a, b, c) {},
        });
      }
    },
    initForm() {
      this.loginId =
        this.$cookies.get("loginId") != null ? this.$cookies.get("loginId") : "";
      this.loginPw = "";
      this.loginIdErrorMessage = "";
      this.loginPwErrorMessage = "";
      this.logMessage = "";
    },
  },
};
</script>

<style>
/* *{padding: 0 ; box-sizing: border-box ; list-style: none; word-break: keep-all; }
	body{color: #333; font-family: 'Noto Sans KR', sans-serif;} */
</style>
