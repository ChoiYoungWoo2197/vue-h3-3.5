<template>
  <div onkeydown="return event.key == 'Enter' ? false : true" :class="getUniqueId">
    <div class="form-group row mb-4">
      <div class="col-sm-3 align-items-center mb-2 mr-2">
        <label for="" class="form-label col-xl-3">아이디</label>
          <div class="input-group">
            <input
              type="text"
              class="form-control shadow-none"
              placeholder="5~12자리 영문 소문자, 숫자"
              aria-label="resisterId"
              aria-describedby="resisterId"
              v-model="reportInfo.resisterId"
              @blur="blurResisterId()"
            />
            <button class="form-btn" type="button" id="resisterId" @click="confirmResisterId()">중복확인</button>
            <div v-if="error.resisterIdErrorMessage.length > 0" id="resisterIdfeedback" class="invalid-feedback d-block">{{ error.resisterIdErrorMessage }}</div>            
            <div v-if="error.resisterIdSuccessMessage.length > 0" id="resisterIdfeedbackSuucess" class="invalid-feedback d-block text-success">{{ error.resisterIdSuccessMessage }}</div>                        
          </div>        
      </div>      
    </div>
    <div class="form-group row mb-4">
      <div class="col-sm-3 align-items-center mb-2 mr-2">
        <label for="" class="form-label col-xl-3">비밀번호</label>
        <input
          type="password"
          class="form-control shadow-none"
          id="reportInfo.resisterPw"
          placeholder="6~16자의 영문 / 숫자 / 특수문자"
          v-model="reportInfo.resisterPw"
          @blur="blurResisterPw"
        />
        <div v-if="error.resisterPwErrorMessage.length > 0" id="resisterPwfeedback" class="invalid-feedback d-block">{{ error.resisterPwErrorMessage }}</div>                    
      </div>    
      <div class="col-sm-3 align-items-center mb-2">
        <label for="" class="form-label col-xl-4">비밀번호 확인</label>
        <input
          type="password"
          class="form-control shadow-none"
          id="resisterPc"
          placeholder="비밀번호를 확인해 주세요."
          v-model="reportInfo.resisterPc"
          @blur="blurResisterPc"
        />
        <div v-if="error.resisterPcErrorMessage.length > 0" id="resisterPcfeedback" class="invalid-feedback d-block">{{ error.resisterPcErrorMessage }}</div>                    
      </div>         
    </div>  
    <div class="form-group row mb-4">
      <div class="col-sm-3 align-items-center mb-2 mr-2">
        <label for="" class="form-label col-xl-3">이름</label>
        <input
          type="text"
          class="form-control shadow-none"
          id="resisterName"
          placeholder="이름을 입력해 주세요."
          v-model="reportInfo.resisterName"
          @blur="blurResisterName"
        />
        <div v-if="error.resisterNameErrorMessage.length > 0" id="resisterNamefeedback" class="invalid-feedback d-block">{{ error.resisterNameErrorMessage }}</div>        
      </div>    
      <div class="col-sm-3 align-items-center mb-2">
        <label for="" class="form-label col-xl-3">업체명</label>
        <input
          type="text"
          class="form-control shadow-none"
          id="resisterCom"
          placeholder="이름을 입력해 주세요."
          v-model="reportInfo.resisterCom"
          @blur="blurResisterCom"
        />
        <div v-if="error.resisterComErrorMessage.length > 0" id="resisterComfeedback" class="invalid-feedback d-block">{{ error.resisterComErrorMessage }}</div>        
      </div>        
    </div>  

    <two-btn @prev="prev" @next="next"></two-btn>
  </div>
</template>

<script>
import $ from "jquery";
import { store } from "@/store/store.js";
import { SHA256 } from "@/assets/js/sha256.js";
import { API_URL, TEMP_KEY } from "@/configs/config.js";
import twoBtn from "@/components/registerAdmin/twoBtn.vue";
import { isMobile, priceToString, getMedia, uuidv4, getType, isblank, isNotId, isNotPassword, isNotPasswordc} from "@/assets/js/common.js";

export default {
  props: {},
  data() {
    return {
      ajax: true,
      uniqueId: null,
      reportInfo: {
        resisterId: null,
        resisterPw: null,
        resisterPc: null,
        resisterName: null,
        resisterCom: null,
      },
      error: {
        checkResisterId: false,
        resisterIdErrorMessage: "",
        resisterIdSuccessMessage: "",
        resisterPwErrorMessage: "",
        resisterPcErrorMessage: "",
        resisterNameErrorMessage: "",
        resisterComErrorMessage: "",
        logMessage: "",
      },
      step: 1,
    };
  },
  computed: {
    getUniqueId() {
      if (!this.uniqueId) {
        this.uniqueId = "vm-" + this._uid;
        return this.uniqueId;
      }
      return this.uniqueId;
    },
  },
  components: {twoBtn,},
  watch: {},
  mounted() {},
  methods: {
    validate() {
      this.logMessage = "";
      this.confirmResisterId();
      this.blurResisterPw();
      this.blurResisterPc();
      this.blurResisterName();
      this.blurResisterCom();
    },
    getData() { return this.reportInfo; },
    prev() {
      let vm = this;
      vm.$emit("prev");
    },
    next() {
      let vm = this;
      vm.ajax = true;
      vm.validate();
      vm.ajax ? vm.$emit("next") : "";
    },
    confirmResisterId() {
      var vm = this;
      this.error.resisterIdErrorMessage = "";
      this.error.resisterIdSuccessMessage = "";
      this.error.checkResisterId = false;

      if (isNotId(this.reportInfo.resisterId)) {
        this.error.resisterIdErrorMessage = "아이디는 5~12자의 영문(소문자), 숫자로 입력해주세요.";
        this.ajax = false;
      } else {
        $.ajax({
          type: "POST", //요청 메소드 방식
          url: API_URL + "/user/exists",
          headers: { authorization: SHA256(TEMP_KEY) },
          data: { userid: vm.reportInfo.resisterId, useremail: ""},
          success: function (data) {
            if (data.result === "success") {
              vm.error.checkResisterId = true;
              vm.error.resisterIdSuccessMessage = "확인 완료";
            } else {
              vm.ajax = false;
              vm.error.checkResisterId = false;
              if (data.errormessage) { vm.error.resisterIdErrorMessage = data.errormessage; }
            }
          },
          error: function (a, b, c) { vm.logMessage = b; },
          finally: function (a, b, c) {},
        });
      }
    },    
    blurResisterId() {
      var vm = this;
      this.error.resisterIdErrorMessage = "";
      if (!this.reportInfo.checkResisterId) { this.error.resisterIdSuccessMessage = ""; }

      if (isNotId(this.reportInfo.resisterId)) {
        this.error.resisterIdErrorMessage = "아이디는 5~12자의 영문(소문자), 숫자로 입력해주세요.";
        this.ajax = false;
      } else if (!this.reportInfo.checkResisterId) {
        this.error.resisterIdErrorMessage = "아이디 중복 확인을 해주세요.";
        this.ajax = false;
      }
    },
    blurResisterPw() {
      this.error.resisterPwErrorMessage = "";
      if (isblank(this.reportInfo.resisterPw)) {
        this.error.resisterPwErrorMessage = "비밀번호는 6~16자의 영문, 숫자, 특수문자 조합으로 입력해주세요.";
        this.ajax = false;
      }

      if (this.reportInfo.resisterPw != null && this.reportInfo.resisterPc != null) {
        this.blurResisterPc(this.reportInfo.resisterPw, this.reportInfo.resisterPc);
      }
    },
    blurResisterPc() {
      this.error.resisterPcErrorMessage = "";
      if (isNotPasswordc(this.reportInfo.resisterPw, this.reportInfo.resisterPc)) {
        this.error.resisterPcErrorMessage = "비밀번호가 일치하지 않습니다.";
        this.ajax = false;
      }
    },    
    blurResisterName() {
      this.error.resisterNameErrorMessage = "";
      if (isblank(this.reportInfo.resisterName)) {
        this.error.resisterNameErrorMessage = "이름을 입력해주세요.";
        this.ajax = false;
      }
    },
    blurResisterCom() {
      this.error.resisterComErrorMessage = "";
      if (isblank(this.reportInfo.resisterCom)) {
        this.error.resisterComErrorMessage = "업체명을 입력해주세요.";
        this.ajax = false;
      }
    },    
  },
};
</script>

<style></style>
