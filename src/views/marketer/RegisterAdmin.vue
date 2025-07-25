<template>
  <section class="row d-flex">
    <big-menu :pMenu="'membermng'" @mountedMain="activeMain"></big-menu>
    <div class="full-wrap d-flex flex-column">
      <article class="newad registerAdmin">
        <div class="admin-title">
          <h3>광고주 등록</h3>
        </div>
        <form
          @submit.prevent="submitForm"
          onkeydown="return event.key == 'Enter' ? false : true"
        >
          <label for="resisterId" class="form-label">아이디</label>
          <div class="input-group">
            <input
              type="text"
              class="form-control shadow-none"
              placeholder="5~12자리 영문 소문자, 숫자"
              aria-label="resisterId"
              aria-describedby="resisterId"
              v-model="resisterId"
              @blur="blurResisterId()"
            />
            <button
              class="form-btn"
              type="button"
              id="resisterId"
              @click="confirmResisterId()"
            >
              중복확인
            </button>
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

          <div class="row">
            <div class="col-sm-6 resisterPw">
              <label for="resisterPw" class="form-label mt-2">비밀번호</label>
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
            <div class="col-sm-6">
              <label for="resisterPc" class="form-label mt-2">비밀번호 확인</label>
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
          </div>
          <div
            class="input-group alert alert-light mt-2 mb-0 disableColor pl-2 pr-2"
            role="alert"
          >
            <ul>
              <li>6~16자의 영문 소문자, 숫자, 특수문자 조합</li>
              <!-- <li>공백으로 입력 시 현재 사용 중인 비밀번호로 설정</li> -->
              <li>
                사용 가능한 특수문자
                <code class="border-gray">@</code>
                <code class="border-gray">$</code>
                <code class="border-gray">!</code>
                <code class="border-gray">%</code>
                <code class="border-gray">*</code>
                <code class="border-gray">#</code>
                <code class="border-gray">?</code>
                <code class="border-gray">&</code>
              </li>
            </ul>
          </div>
          <!-- <label for="resisterPw" class="form-label">비밀번호</label>
					<input type="password" class="form-control shadow-none" id="resisterPw" placeholder="6~16자의 영문 / 숫자 / 특수문자" 
					v-model="resisterPw" 
					@blur="blurResisterPw">
					<div v-if="resisterPwErrorMessage.length > 0" id="resisterPwfeedback" class="invalid-feedback d-block">{{resisterPwErrorMessage}}</div>
					
					<label for="resisterPc" class="form-label">비밀번호 확인</label>
					<input type="password" class="form-control shadow-none" id="resisterPc" placeholder="비밀번호를 확인해 주세요." 
					v-model="resisterPc" 
					@blur="blurResisterPc">
					<div v-if="resisterPcErrorMessage.length > 0" id="resisterPcfeedback" class="invalid-feedback d-block">{{resisterPcErrorMessage}}</div> -->

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

          <label for="resisterCon" class="form-label">광고 계정 인증</label>
          <select
            class="form-control col-12 shadow-none mb-2"
            aria-label="resisterCon"
            v-model="resisterSelectCon"
          >
            <option disabled="">대표 매체를 선택해 주세요.</option>
            <option value="naver">네이버</option>
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
          <label for="resisterMar" class="form-label">담당 마케터<span></span></label>
          <select-2
            class="form-control col-12 shadow-none mb-2 resisterMar"
            :pUrl="'/user/findmarketers'"
            :pMethod="'post'"
            :pUserLevel="'2'"
          >
          </select-2>
          <div v-if="logMessage.length > 0" class="input-group mb-3">
            <div class="invalid-feedback d-block">{{ logMessage }}</div>
          </div>
          <button type="submit" class="btn shadow-none">광고주 등록</button>
        </form>
      </article>
    </div>
    <waiting-2-admin-modal
      ref="waiting2AdminModal"
      style="display: none"
    ></waiting-2-admin-modal>
    <!-- <waiting-2-modal ref="waiting2Modal" style="display:none"></waiting-2-modal> -->
    <expire-session-modal
      ref="expireSessionModal"
      style="display: none"
    ></expire-session-modal>
    <confirm-modal ref="confirmModal" style="display: none"></confirm-modal>
  </section>
</template>

<script>
import $ from "jquery";
import {
  isblank,
  isNotId,
  isNotPassword,
  isNotPasswordc,
  isNotEmail,
  isNotTel,
  clearBody,
  addClassView,
} from "../../assets/js/common.js";
import { store } from "../../store/store.js";
import { SHA256 } from "../../assets/js/sha256.js";
import { API_URL, TEMP_KEY } from "../../configs/config.js";
import bigMenu from "../../components/layout/bigMenu.vue";
import select2 from "../../components/common/select2.vue";
import confirmModal from "../../components/modal/confirmModal.vue";
import expireSessionModal from "../../components/modal/expireSessionModal.vue";
import waiting2AdminModal from "../../components/modal/waiting2AdminModal.vue";

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
    bigMenu,
    expireSessionModal,
    confirmModal,
    select2,
    waiting2AdminModal,
  },
  watch: {
    resisterId(newValue, oldValue) {
      this.checkResisterId = false;
    },
    resisterEmail(newValue, oldValue) {
      this.checkResisterEmail = false;
    },
  },
  mounted() {
    $(".select2-selection").addClass(
      "shadow-none d-flex align-items-center custom-input"
    );
  },
  methods: {
    activeMain(flag) {
      this.$emit("mountedMain", true);
      this.$emit("mountedDasyboad", false);
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
          url: API_URL + "/admin/userregister",
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
            session: store.state.userStore.session,
          },
          cache: false,
          async: false,
          success: function (data) {
            if (data.result === "success") {
              vm.$refs.waiting2AdminModal.showModal();
            } else {
              if (data.errormessage) vm.logMessage = data.errormessage;
              if (data.db.errormessage) vm.logMessage = data.db.errormessage;
            }
          },
          error: function (a, b, c) {
            vm.logMessage = b;
            if (a.status === 403) {
              vm.$store.commit("logout");
              vm.$store.commit("logoutActivedMdias");
              vm.$store.commit("logoutKakaoSa");
              vm.$router.push("/");
            }
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
              if (data.errormessage) {
                vm.resisterIdErrorMessage = data.errormessage;
              }
              // if(data.errormessage) vm.logMessage = data.errormessage;
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

.custom-input {
  height: 40px !important;
  border-radius: 0 !important;
  border-color: #ddd !important;
  color: #666 !important;
}

@media screen and (min-width: 575px) {
  .main .registerAdmin .resisterPw {
    /* padding-right: .5rem !important; */
    padding-right: 10px !important;
  }
}

.disableColor {
  background-color: #e9ecef !important;
  opacity: 1;
}

code {
  padding: 2px 4px;
  font-size: 90%;
  color: #4f5584;
  background-color: rgba(197, 202, 233, 0.1);
  border-radius: 3px;
  border: 1px solid #c5cae9;
}
</style>
