<template>
  <section id="register" class="bg-light">
    <article
      class="resister-wrap container-xl d-flex justify-content-center align-items-center"
    >
      <div class="wrap row col-xl-8 col-lg-6 col-md-12 col-12">
        <div class="process-title mb-3 col-12">
          <img
            src="../assets/image/h3.png"
            alt="h3"
            @click="$router.push('/login').catch(() => {})"
          />
          <h3>회원가입</h3>
        </div>
        <form
          @submit.prevent="submitForm"
          onkeydown="return event.key == 'Enter' ? false : true"
          class="mb-0 col-12"
        >
          <div class="mb-3">
            <label for="resisterId" class="form-label">아이디</label>
            <div class="input-group">
              <input
                type="text"
                id="resisterId"
                class="form-control shadow-none rounded mr-2"
                placeholder="5~12자리 영문 소문자, 숫자"
                aria-label="resisterId"
                aria-describedby="resisterId"
                v-model="resisterId"
                @blur="blurResisterId()"
              />
              <button
                class="confirm-btn px-3 btn-hover"
                type="button"
                @click="confirmResisterId()"
              >
                중복확인
              </button>
            </div>
            <div
              v-if="resisterIdErrorMessage.length > 0"
              id="resisterIdfeedback"
              class="invalid-feedback d-block"
            >
              {{ resisterIdErrorMessage }}
            </div>
            <div
              v-if="resisterIdSuccessMessage.length > 0"
              id="resisterIdfeedbackSuucess"
              class="valid-feedback d-block"
            >
              {{ resisterIdSuccessMessage }}
            </div>
          </div>
          <div class="mb-3">
            <label for="resisterPw" class="form-label">비밀번호</label>
            <input
              type="password"
              class="form-control shadow-none"
              id="resisterPw"
              placeholder="6~16자의 영문 / 숫자 / 특수문자"
              v-model="resisterPw"
              @blur="blurResisterPw"
            />
            <div
              v-if="resisterPwErrorMessage.length > 0"
              id="resisterPwfeedback"
              class="invalid-feedback d-block"
            >
              {{ resisterPwErrorMessage }}
            </div>
          </div>
          <div class="mb-3">
            <label for="resisterPc" class="form-label">비밀번호 확인</label>
            <input
              type="password"
              class="form-control shadow-none"
              id="resisterPc"
              placeholder="비밀번호를 확인해 주세요."
              v-model="resisterPc"
              @blur="blurResisterPc"
            />
            <div
              v-if="resisterPcErrorMessage.length > 0"
              id="resisterPcfeedback"
              class="invalid-feedback d-block"
            >
              {{ resisterPcErrorMessage }}
            </div>
          </div>
          <div class="mb-3">
            <label for="resisterName" class="form-label">이름</label>
            <input
              type="text"
              class="form-control shadow-none"
              id="resisterName"
              placeholder="이름을 입력해 주세요."
              v-model="resisterName"
              @blur="blurResisterName"
            />
            <div
              v-if="resisterNameErrorMessage.length > 0"
              id="resisterNamefeedback"
              class="invalid-feedback d-block"
            >
              {{ resisterNameErrorMessage }}
            </div>
          </div>
          <div class="mb-3">
            <label for="resisterCom" class="form-label">업체명</label>
            <input
              type="text"
              class="form-control shadow-none"
              id="resisterCom"
              placeholder="업체명을 입력해 주세요."
              v-model="resisterCom"
              @blur="blurResisterCom"
            />
            <div
              v-if="resisterComErrorMessage.length > 0"
              id="resisterComfeedback"
              class="invalid-feedback d-block"
            >
              {{ resisterComErrorMessage }}
            </div>
          </div>
          <div class="mb-3">
            <label for="resisterEmail" class="form-label">이메일</label>
            <input
              type="email"
              class="form-control shadow-none"
              id="resisterEmail"
              placeholder="heeil@heeil.com"
              v-model="resisterEmail"
              @blur="blurResisterEmail"
            />
            <div
              v-if="resisterEmailErrorMessage.length > 0"
              id="resisterEmailfeedback"
              class="invalid-feedback d-block"
            >
              {{ resisterEmailErrorMessage }}
            </div>
          </div>
          <div class="mb-3">
            <label for="resisterTel" class="form-label">휴대번호</label>
            <input
              type="tel"
              class="form-control shadow-none"
              id="resisterTel"
              placeholder="휴대번호를 입력해주세요."
              v-model="resisterTel"
              @blur="blurResisterTel"
            />
            <div
              v-if="resisterTelErrorMessage.length > 0"
              id="resisterTelfeedback"
              class="invalid-feedback d-block"
            >
              {{ resisterTelErrorMessage }}
            </div>
          </div>
          <div class="mb-3">
            <label for="resisterSelectCon" class="form-label">광고 계정 인증</label>
            <select
              class="form-control col-12 shadow-none mb-2"
              aria-label="resisterSelectCon"
              v-model="resisterSelectCon"
            >
              <option disabled>대표 매체를 선택해 주세요.</option>
              <option value="naver" selected>네이버</option>
              <option value="kakao">카카오</option>
            </select>
            <div class="input-group">
              <input
                type="text"
                class="form-control shadow-none"
                id="resisterCon"
                placeholder="광고주 아이디를 입력해 주세요."
                v-model="resisterCon"
                @blur="blurResisterCon"
              />
              <div
                v-if="resisterConErrorMessage.length > 0"
                id="resisterConfeedback"
                class="invalid-feedback d-block"
              >
                {{ resisterConErrorMessage }}
              </div>
            </div>
          </div>
          <div>
            <label for="resisterMar" class="form-label"
              >담당 마케터<span> (선택)</span></label
            >
            <select-2
              class="form-control col-12 shadow-none mb-2 resisterMar"
              :pUrl="'/user/findmarketers'"
              :pMethod="'post'"
              :pUserLevel="'2'"
            >
            </select-2>
          </div>
          <div v-if="logMessage.length > 0" class="input-group mb-3">
            <div class="invalid-feedback d-block">{{ logMessage }}</div>
          </div>
          <div class="button-group mt-5">
            <button
              type="button"
              @click="clickPrevBtn"
              class="btn process-btn shadow-none btn-hover"
            >
              이전
            </button>
            <button
              type="submit"
              class="btn process-btn shadow-none btn-hover"
              data-toggle="modal"
              data-target="#resisterFin"
            >
              회원가입
            </button>
            <!--<button type="submit" class="btn process-btn shadow-none btn-hover">회원가입</button>-->
          </div>
        </form>
      </div>
    </article>
    <waiting-2-modal ref="waiting2Modal" style="display: none"></waiting-2-modal>
    <view-menu @mountedMain="handleMountedMain"></view-menu>
  </section>
</template>

<script>
import $ from "jquery";
import { API_URL, TEMP_KEY } from "../configs/config.js";
import { SHA256 } from "../assets/js/sha256.js";
import select2 from "../components/common/select2.vue";
import waiting2Modal from "../components/modal/waiting2Modal.vue";
import {
  isblank,
  isNotId,
  isNotPassword,
  isNotPasswordc,
  isNotEmail,
  isNotTel,
  clearBody,
  addClassView,
} from "../assets/js/common.js";
import viewMenu from "../components/layout/viewMenu.vue";

export default {
  data() {
    return {
      ajax: true,
      resisterId: null,
      resisterPw: null,
      resisterPc: null,
      resisterName: null,
      resisterCom: null,
      resisterEmail: null,
      resisterTel: null,
      resisterSelectCon: "naver",
      resisterCon: null,
      resisterMar: "",
      checkResisterId: false,
      checkResisterEmail: false,
      resisterIdErrorMessage: "",
      resisterIdSuccessMessage: "",
      resisterPwErrorMessage: "",
      resisterPcErrorMessage: "",
      resisterNameErrorMessage: "",
      resisterComErrorMessage: "",
      resisterEmailErrorMessage: "",
      resisterTelErrorMessage: "",
      resisterConErrorMessage: "",
      logMessage: "",
    };
  },
  components: {
    select2,
    waiting2Modal,
    viewMenu,
  },
  created() {},
  mounted() {
    $(".select2-selection").addClass("shadow-none d-flex align-items-center");
  },
  watch: {
    resisterId(newValue, oldValue) {
      this.checkResisterId = false;
    },
    resisterEmail(newValue, oldValue) {
      this.checkResisterEmail = false;
    },
  },
  methods: {
    handleMountedMain() {
      this.$emit("mountedMain", false);
    },
    validate() {
      this.logMessage = "";
      this.confirmResisterId();
      this.blurResisterPw();
      this.blurResisterPc();
      this.blurResisterName();
      this.blurResisterCom();
      this.blurResisterEmail();
      this.blurResisterTel();
      this.blurResisterCon();
    },
    submitForm() {
      var vm = this;
      this.ajax = true;
      this.validate();
      if (this.ajax) {
        $.ajax({
          type: "POST", //요청 메소드 방식
          url: API_URL + "/user/register",
          headers: { authorization: SHA256(TEMP_KEY) },
          data: {
            userid: vm.resisterId,
            userpass: vm.resisterPw,
            username: vm.resisterName,
            usercompany: vm.resisterCom,
            useremail: vm.resisterEmail,
            userphone: vm.resisterTel,
            advmedia: vm.resisterSelectCon,
            advid: vm.resisterCon,
            advmarketer: $(".resisterMar").val() === "-1" ? "" : $(".resisterMar").val(),
          },
          cache: false,
          async: false,
          success: function (data) {
            // console.log(data);
            if (data.result === "success") {
              vm.$refs.waiting2Modal.showModal();
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
    blurResisterId() {
      var vm = this;
      this.resisterIdErrorMessage = "";
      if (!this.checkResisterId) {
        this.resisterIdSuccessMessage = "";
      }

      if (isNotId(this.resisterId)) {
        this.resisterIdErrorMessage =
          "아이디는 5~12자의 영문(소문자), 숫자로 입력해주세요.";
        this.ajax = false;
      } else if (!this.checkResisterId) {
        this.resisterIdErrorMessage = "아이디 중복 확인을 해주세요.";
        this.ajax = false;
      }
    },
    confirmResisterId() {
      var vm = this;
      // this.logMessage = '';
      this.resisterIdErrorMessage = "";
      this.resisterIdSuccessMessage = "";
      this.checkResisterId = false;

      if (isNotId(this.resisterId)) {
        this.resisterIdErrorMessage =
          "아이디는 5~12자의 영문(소문자), 숫자로 입력해주세요.";
        this.ajax = false;
      } else {
        $.ajax({
          type: "POST", //요청 메소드 방식
          url: API_URL + "/user/exists",
          headers: { authorization: SHA256(TEMP_KEY) },
          data: {
            userid: vm.resisterId,
            useremail: "",
          },
          // cache: false,
          // async: false,
          success: function (data) {
            // console.log(data.result);
            if (data.result === "success") {
              vm.checkResisterId = true;
              vm.resisterIdSuccessMessage = "확인 완료";
            } else {
              vm.ajax = false;
              vm.checkResisterId = false;
              vm.resisterIdErrorMessage = data.errormessage;
              // if(data.errormessage) {
              // 	vm.logMessage = data.errormessage;
              // 	vm.resisterIdErrorMessage = data.errormessage;
              // }

              // if(data.db.errormessage) vm.logMessage =  data.db.errormessage;
            }

            // console.log(vm.ajax, 'exists/id');
          },
          error: function (a, b, c) {
            vm.logMessage = b;
          },
          finally: function (a, b, c) {},
        });
      }
    },
    blurResisterPw() {
      this.resisterPwErrorMessage = "";
      if (isNotPassword(this.resisterPw)) {
        this.resisterPwErrorMessage =
          "비밀번호는 6~16자의 영문, 숫자, 특수문자 조합으로 입력해주세요.";
        this.ajax = false;
      }

      if (this.resisterPw != null && this.resisterPc != null) {
        this.blurResisterPc(this.resisterPw, this.resisterPc);
      }
      // console.log(this.ajax, 'blurResisterPw');
    },
    blurResisterPc() {
      this.resisterPcErrorMessage = "";
      if (isNotPasswordc(this.resisterPw, this.resisterPc)) {
        this.resisterPcErrorMessage = "비밀번호가 일치하지 않습니다.";
        this.ajax = false;
      }
      // console.log(this.ajax, 'blurResisterPc');
    },
    blurResisterName() {
      this.resisterNameErrorMessage = "";
      if (isblank(this.resisterName)) {
        this.resisterNameErrorMessage = "이름을 입력해주세요.";
        this.ajax = false;
      }
      // console.log(this.ajax, 'blurResisterName');
    },
    blurResisterCom() {
      this.resisterComErrorMessage = "";
      if (isblank(this.resisterCom)) {
        this.resisterComErrorMessage = "업체명을 입력해주세요.";
        this.ajax = false;
      }
      // console.log(this.ajax, 'blurResisterCom');
    },
    blurResisterEmail() {
      var vm = this;
      this.resisterEmailErrorMessage = "";
      if (isNotEmail(this.resisterEmail)) {
        this.resisterEmailErrorMessage = "이메일 주소가 올바르지 않습니다.";
        this.ajax = false;
      } else if (!this.checkResisterEmail) {
        $.ajax({
          type: "POST", //요청 메소드 방식
          url: API_URL + "/user/exists",
          headers: { authorization: SHA256(TEMP_KEY) },
          data: {
            userid: "",
            useremail: vm.resisterEmail,
          },
          // cache: false,
          // async: false,
          success: function (data) {
            vm.checkResisterEmail = true;
            // if (data.result === "success") {
            //   vm.checkResisterEmail = true;
            // } else {
            //   vm.ajax = false;
            //   vm.checkResisterEmail = false;
            //   vm.resisterEmailErrorMessage = data.errormessage;
            //   // if(data.errormessage) vm.logMessage = data.errormessage;
            //   // if(data.db.errormessage) vm.logMessage =  data.db.errormessage;
            // }
          },
          error: function (a, b, c) {
            vm.logMessage = b;
          },
          finally: function (a, b, c) {},
        });
      }
    },
    blurResisterTel() {
      this.resisterTelErrorMessage = "";
      if (isNotTel(this.resisterTel)) {
        this.resisterTelErrorMessage = "휴대번호가 올바르지 않습니다.";
        this.ajax = false;
      }
      // console.log(this.ajax, 'blurResisterTel');
    },
    blurResisterCon() {
      this.resisterConErrorMessage = "";
      if (isblank(this.resisterCon)) {
        this.resisterConErrorMessage = "광고주 아이디를 입력해주세요.";
        this.ajax = false;
      }
      // console.log(this.ajax, 'blurResisterCon');
    },
    clickPrevBtn() {
      this.$router.go(-1);
    },
  },
};
</script>

<style>
.select2-selection--single {
  height: 46px !important;
}

.select2-selection__arrow b {
  display: none !important;
}
</style>
