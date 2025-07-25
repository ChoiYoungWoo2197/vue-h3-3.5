<template>
  <section class="row d-flex">
    <big-menu
      v-if="data"
      :pMenu="data.userlevel === 1 ? 'dashboard' : ''"
      @mountedMain="activeMain"
    >
    </big-menu>
    <div class="full-wrap d-flex flex-column">
      <article class="newad registerEdit">
        <template v-if="data !== null && data.userlevel === 1">
          <div class="admin-title">
            <h3>데이터 갱신</h3>
          </div>
          <form onkeydown="return event.key == 'Enter' ? false : true" class="mb-3">
            <div class="d-flex align-items-center">
              <button type="button" class="btn shadow-none mt-0" @click="clickReloadBtn">
                데이터 갱신
              </button>
              <div class="flex-grow-1 d-flex justify-content-center">
                <template v-if="timerResult === true">
                  <p class="font-weight-bold">
                    {{ "최근" }}<span class="text-primary"> {{ diff }}</span>
                    {{ "일치 데이터가 수집됩니다." }}
                  </p>
                </template>
                <template v-else>
                  <p class="font-weight-bold">
                    <span class="text-primary">{{ getTimerMessage }}</span>
                    {{ "초 후 갱신을 시도해주세요." }}
                  </p>
                </template>
              </div>
            </div>
          </form>
        </template>

        <div class="admin-title">
          <h3>정보수정</h3>
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
              placeholder="사원번호(5~12자리 영문 소문자, 숫자)"
              aria-label="resisterId"
              aria-describedby="resisterId"
              v-model="resisterId"
              @blur="blurResisterId()"
              disabled
            />
            <!-- <button class="form-btn" type="button" id="resisterId" @click="confirmResisterId()">중복확인</button>
						<div v-if="resisterIdErrorMessage.length > 0" id="resisterIdfeedback" class="invalid-feedback d-block">{{resisterIdErrorMessage}}</div>
						<div v-if="resisterIdSuccessMessage.length > 0" id="resisterIdfeedbackSuucess" class="valid-feedback d-block">{{resisterIdSuccessMessage}}</div> -->
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
              <li>공백으로 입력 시 현재 사용 중인 비밀번호로 설정</li>
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
            class="form-control shadow-none mb-3"
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
          <div v-if="logMessage.length > 0" class="input-group mb-3">
            <div class="invalid-feedback d-block">{{ logMessage }}</div>
          </div>
          <button type="submit" class="btn shadow-none">정보수정</button>
        </form>
      </article>
    </div>
    <mask-modal ref="maskModal" style="display: none"></mask-modal>
    <waiting-2-agency-modal
      v-if="data"
      ref="waiting2AgencyModal"
      style="display: none"
      :pTitle="'회원정보가 수정되었습니다.'"
      :pSubTitle="'재수정할 경우 해당 페이지를 이용해주시길 바랍니다.'"
      :pRtitle="data.userlevel === 1 ? '대시보드 페이지로' : '에이전시홈 페이지로'"
      :pUrl="data.userlevel === 1 ? '/dashboard' : '/agency'"
    >
    </waiting-2-agency-modal>
    <expire-session-modal
      ref="expireSessionModal"
      style="display: none"
    ></expire-session-modal>
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
} from "../../assets/js/common.js";
import { API_URL, TEMP_KEY } from "../../configs/config.js";
import { SHA256 } from "../../assets/js/sha256.js";
import bigMenu from "../../components/layout/bigMenu.vue";
import expireSessionModal from "../../components/modal/expireSessionModal.vue";
import waiting2AgencyModal from "../../components/modal/waiting2AgencyModal.vue";
import maskModal from "../../components/modal/maskModal.vue";
import { store } from "../../store/store.js";
import moment from "moment";

export default {
  data() {
    return {
      diff: 10,
      timerResult: true,
      timerMessage: "",
      timer: null,
      ajax: true,
      resisterId: null,
      resisterPw: null,
      resisterPc: null,
      resisterName: null,
      resisterCom: null,
      resisterEmail: null,
      resisterTel: null,
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
      logMessage: "",
      data: null,
    };
  },
  components: {
    bigMenu,
    expireSessionModal,
    waiting2AgencyModal,
    maskModal,
  },
  mounted() {
    $(".main").addClass("m-h-100");
    this.$store.commit("initCount");
    this.initForm();
    this.setForm();
  },
  computed: {
    getTimerMessage() {
      return store.state.dataReloadStore.count;
    },
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
    activeMain(flag) {
      this.$emit("mountedMain", true);
      // this.$emit('mountedDasyboad', false);
    },
    validate() {
      this.logMessage = "";
      if (this.resisterPw !== "" || this.resisterPc !== "") {
        this.blurResisterPw();
        this.blurResisterPc();
      }
      this.blurResisterName();
      this.blurResisterCom();
      this.blurResisterEmail();
      this.blurResisterTel();
    },
    submitForm() {
      var vm = this;
      this.ajax = true;
      this.validate();
      if (this.ajax) {
        $.ajax({
          type: "POST", //요청 메소드 방식
          url: API_URL + "/admin/userupdate",
          headers: { authorization: SHA256(TEMP_KEY) },
          data: {
            userid: vm.resisterId,
            userpass: vm.resisterPw,
            username: vm.resisterName,
            usercompany: vm.resisterCom,
            useremail: vm.resisterEmail,
            userphone: vm.resisterTel,
            session: store.state.userStore.session,
          },
          cache: false,
          async: false,
          beforeSend: function (data) {
            vm.$refs.maskModal.showModal();
          },
          success: function (data) {
            if (data.result === "success") {
              vm.$store.commit("registerEdit", {
                usercompany: vm.resisterCom,
                useremail: vm.resisterEmail,
                userid: vm.data.userid,
                userlevel: vm.data.userlevel,
                username: vm.resisterName,
                userpassupdate: moment().format("YYYY-MM-DD HH:mm:ss"),
                userphone: vm.resisterTel,
                userregdate: vm.data.userregdate,
                userseq: vm.data.userseq,
                userpstatus: vm.data.userstatus,
              });
              vm.$refs.waiting2AgencyModal.showModal();
            } else if (data.status === "0001") {
              vm.handleExpireSession();
            } else if (data.status === "0004") {
              vm.$refs.waiting2AgencyModal.showModal();
            } else {
              if (data.errormessage) vm.logMessage = data.errormessage;
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
          complete: function (a, b, c) {
            vm.$refs.maskModal.hideModal();
          },
        });
      }
    },
    blurResisterPw() {
      this.resisterPwErrorMessage = "";
      if (isblank(this.resisterPc) === true && isblank(this.resisterPw) === true) {
        this.resisterPwErrorMessage = "";
        this.resisterPcErrorMessage = "";
      } else if (isNotPassword(this.resisterPw)) {
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
      if (isblank(this.resisterPc) === true && isblank(this.resisterPw) === true) {
        this.resisterPwErrorMessage = "";
        this.resisterPcErrorMessage = "";
      } else if (isNotPasswordc(this.resisterPw, this.resisterPc)) {
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
      } else if (this.data.useremail === this.resisterEmail) {
        return false;
      } else if (!this.checkResisterEmail) {
        $.ajax({
          type: "POST", //요청 메소드 방식
          url: API_URL + "/user/exists",
          headers: { authorization: SHA256(TEMP_KEY) },
          data: {
            userid: "",
            useremail: vm.resisterEmail,
          },
          // cache : false,
          // async : false,
          success: function (data) {
            vm.checkResisterEmail = true;
            // if(data.result === "success") {
            // 	vm.checkResisterEmail = true;
            // } else {
            // 	vm.ajax = false;
            // 	vm.checkResisterEmail = false;
            // 	vm.resisterEmailErrorMessage = data.errormessage;
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
    blurResisterLevel() {
      this.resisterCom = this.resisterLevel === "2" ? "희일커뮤니케이션" : null;
    },
    handleExpireSession() {
      this.$refs.expireSessionModal.showModal();
    },
    initForm() {
      this.ajax = true;
      this.resisterLevel = "2";
      this.resisterId = null;
      this.resisterPw = null;
      this.resisterPc = null;
      this.resisterName = null;
      this.resisterCom = null;
      this.resisterEmail = null;
      this.resisterTel = null;
      this.checkResisterId = false;
      this.checkResisterEmail = false;
      this.resisterIdErrorMessage = "";
      this.resisterIdSuccessMessage = "";
      this.resisterPwErrorMessage = "";
      this.resisterPcErrorMessage = "";
      this.resisterNameErrorMessage = "";
      this.resisterComErrorMessage = "";
      this.resisterEmailErrorMessage = "";
      this.resisterTelErrorMessage = "";
      this.logMessage = "";
      this.data = null;
    },
    setForm() {
      this.data = store.state.userStore.userinfo;
      this.resisterLevel = store.state.userStore.userinfo.userlevel;
      this.resisterId = store.state.userStore.userinfo.userid;
      // this.resisterPw = pData.userPW;
      // this.resisterPc = pData.userPW;
      this.resisterName = store.state.userStore.userinfo.username;
      this.resisterCom = store.state.userStore.userinfo.usercompany;
      this.resisterEmail = store.state.userStore.userinfo.useremail;
      this.resisterTel = store.state.userStore.userinfo.userphone;
    },
    clickReloadBtn() {
      var vm = this;
      if (store.state.dataReloadStore.result === true) {
        vm.reload();

        clearInterval(vm.timer); //타이머 초기화
        vm.timer = setInterval(function () {
          vm.timerResult = false;

          vm.$store.commit("decreaseCount");
          if (store.state.dataReloadStore.count > -1) {
            vm.timerMessage = store.state.dataReloadStore.count;
          } else {
            vm.timerResult = true;
            vm.$store.commit("initCount");
            clearInterval(vm.timer); //종료
          }
        }, 1000); //1초
      }
    },
    reload() {
      var vm = this;
      // var fromdate = moment().subtract(31,"d").format("YYYY-MM-DD");
      var fromdate = moment().subtract(vm.diff, "d").format("YYYY-MM-DD");
      var todate = moment().subtract(1, "d").format("YYYY-MM-DD");

      $.ajax({
        type: "get", //요청 메소드 방식
        url: API_URL + "/rest/crond/day90collection",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          fromdate: fromdate,
          todate: todate,
          session: store.state.userStore.session,
        },
        beforeSend: function (data) {
          //  vm.handleShowMask();
        },
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
          if (a.status === 403) {
            vm.$store.commit("logout");
            vm.$store.commit("logoutActivedMdias");
            vm.$store.commit("logoutKakaoSa");
            vm.$router.push("/");
          }
        },
        complete: function (a, b, c) {
          //  vm.handleHideMask();
        },
      });
    },
  },
};
</script>

<style scoped>
@media screen and (min-width: 575px) {
  .main .registerEdit .resisterPw {
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
