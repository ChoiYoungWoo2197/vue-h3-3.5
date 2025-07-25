<template>
  <div class="d-flex m-h-100">
    <big-menu-2 :pMenu="''" @mountedMain="activeMain"></big-menu-2>
    <div class="wrap">
      <balance @logOut="handleLogOut"></balance>
      <section class="userinfo-edit">
        <div class="title d-flex justify-content-between align-items-center">
          <h2>정보 수정</h2>
        </div>
        <article>
          <form onkeydown="return event.key == 'Enter' ? false : true">
            <div class="form-group row">
              <div class="col-xl-6 row align-items-center">
                <label for="resisterId" class="form-label col-2 col-xl-3">아이디</label>
                <div class="col-10 col-xl-9">
                  <input
                    type="text"
                    class="form-control"
                    id="resisterId"
                    v-model="resisterId"
                    @blur="blurResisterId()"
                    placeholder=""
                    disabled=""
                  />
                </div>
              </div>
            </div>
            <div class="form-group row">
              <div class="col-xl-6 row align-items-center">
                <label for="resisterPw" class="form-label col-2 col-xl-3">비밀번호</label>
                <div class="col-10 col-xl-9">
                  <input
                    type="text"
                    class="form-control"
                    id="resisterPw"
                    v-model="resisterPw"
                    @blur="blurResisterPw"
                    placeholder=""
                  />
                  <div
                    v-if="resisterPwErrorMessage.length > 0"
                    id="resisterPwfeedback"
                    class="invalid-feedback d-block"
                  >
                    {{ resisterPwErrorMessage }}
                  </div>
                </div>
              </div>
              <div class="col-xl-6 row align-items-center">
                <label for="resisterPc" class="form-label col-2 col-xl-3"
                  >비밀번호 확인</label
                >
                <div class="col-10 col-xl-9">
                  <input
                    type="text"
                    class="form-control"
                    id="resisterPc"
                    v-model="resisterPc"
                    @blur="blurResisterPc"
                    placeholder=""
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
            </div>
            <div class="row">
              <div class="col-12">
                <div class="alert alert-warning" role="alert">
                  6~16자의 영문 소문자, 숫자, 특수문자 조합<br />
                  공백으로 입력 시 현재 사용 중인 비밀번호로 설정<br />
                  사용 가능한 특수문자
                  <span class="alert alert-secondary" role="alert">@</span>
                  <span class="alert alert-secondary" role="alert">$</span>
                  <span class="alert alert-secondary" role="alert">!</span>
                  <span class="alert alert-secondary" role="alert">%</span>
                  <span class="alert alert-secondary" role="alert">*</span>
                  <span class="alert alert-secondary" role="alert">#</span>
                  <span class="alert alert-secondary" role="alert">?</span>
                  <span class="alert alert-secondary" role="alert">&amp;</span>
                </div>
              </div>
            </div>
            <div class="form-group row">
              <div class="col-xl-6 row align-items-center">
                <label for="resisterName" class="form-label col-2 col-xl-3">이름</label>
                <div class="col-10 col-xl-9">
                  <input
                    type="text"
                    class="form-control"
                    id="resisterName"
                    v-model="resisterName"
                    @blur="blurResisterName"
                    placeholder=""
                  />
                  <div
                    v-if="resisterNameErrorMessage.length > 0"
                    id="resisterNamefeedback"
                    class="invalid-feedback d-block"
                  >
                    {{ resisterNameErrorMessage }}
                  </div>
                </div>
              </div>
              <div class="col-xl-6 row align-items-center">
                <label for="resisterCom" class="form-label col-2 col-xl-3">업체명</label>
                <div class="col-10 col-xl-9">
                  <input
                    type="text"
                    class="form-control"
                    id="resisterCom"
                    v-model="resisterCom"
                    @blur="blurResisterCom"
                    placeholder=""
                  />
                  <div
                    v-if="resisterComErrorMessage.length > 0"
                    id="resisterComfeedback"
                    class="invalid-feedback d-block"
                  >
                    {{ resisterComErrorMessage }}
                  </div>
                </div>
              </div>
            </div>
            <div class="form-group row">
              <div class="col-xl-6 row align-items-center">
                <label for="resisterEmail" class="form-label col-2 col-xl-3"
                  >이메일</label
                >
                <div class="col-10 col-xl-9">
                  <input
                    type="text"
                    class="form-control"
                    id="resisterEmail"
                    v-model="resisterEmail"
                    @blur="blurResisterEmail"
                    placeholder=""
                  />
                  <div
                    v-if="resisterEmailErrorMessage.length > 0"
                    id="resisterEmailfeedback"
                    class="invalid-feedback d-block"
                  >
                    {{ resisterEmailErrorMessage }}
                  </div>
                </div>
              </div>
              <div class="col-xl-6 row align-items-center">
                <label for="resisterTel" class="form-label col-2 col-xl-3"
                  >휴대번호</label
                >
                <div class="col-10 col-xl-9">
                  <input
                    type="text"
                    class="form-control"
                    id="resisterTel"
                    v-model="resisterTel"
                    @blur="blurResisterTel"
                    placeholder=""
                  />
                  <div
                    v-if="resisterTelErrorMessage.length > 0"
                    id="resisterTelfeedback"
                    class="invalid-feedback d-block"
                  >
                    {{ resisterTelErrorMessage }}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </article>
        <div class="title d-flex justify-content-between align-items-center">
          <div class="data-renewal d-flex align-items-center">
            <button type="submit" class="btn submit" @click="clickReloadBtn">
              데이터 갱신
            </button>
              <p class="">
                {{ "최근" }}<span class="text-primary"> {{ "30" }}</span>
                {{ "일치 데이터가 수집됩니다." }}
              </p>            
          </div>
          <div class="two-btn">
            <button type="submit" class="btn select-cancel" @click="cancelForm">
              취소
            </button>
            <button type="submit" class="btn select-save" @click="submitForm">
              저장
            </button>
          </div>
          <div v-if="logMessage.length > 0" class="input-group mb-3">
            <div class="invalid-feedback d-block">{{ logMessage }}</div>
          </div>
        </div>
      </section>
    </div>

    <log-out-modal ref="logOutModal" style="display: none"></log-out-modal>
    <expire-session-modal
      ref="expireSessionModal"
      style="display: none"
    ></expire-session-modal>
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
    <mask-modal ref="maskModal" style="display: none"></mask-modal>
  </div>
</template>

<script>
import $ from "jquery";
import xlsx from "xlsx";
import moment from "moment";
import {isblank,  isNotId,  isNotPassword,  isNotPasswordc,  isNotEmail,  isNotTel} from "../../assets/js/common.js";
import expireSessionModal from "../../components/modal/expireSessionModal.vue";
import waiting2AgencyModal from "../../components/modal/waiting2AgencyModal.vue";
import maskModal from "../../components/modal/maskModal.vue";
import { store } from "../../store/store.js";
import { SHA256 } from "../../assets/js/sha256.js";
import { API_URL, TEMP_KEY } from "../../configs/config.js";
import balance from "../../components/dashboard2/balance.vue";
import bigMenu2 from "../../components/layout/bigMenu2.vue";
import logOutModal from "../../components/modal/logOutModal.vue";

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
  components: {
    bigMenu2,
    logOutModal,
    balance,
    expireSessionModal,
    maskModal,
    waiting2AgencyModal,
  },
  mounted() {
    $(".main").removeClass("m-h-100");
    this.initForm();
    this.setForm();
  },
  updated() {},
  methods: {
    activeMain(flag) {
      this.$emit("mountedMain", true);
      this.$emit("mountedDasyboad", true);
    },
    handleLogOut() {
      this.$refs.logOutModal.showModal();
    },
    handleExpireSession() {
      this.$refs.expireSessionModal.showModal();
    },
    handleShowMask() {
      this.$refs.maskModal.showModal();
    },
    handleHideMask() {
      this.$refs.maskModal.hideModal();
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
      // var fromdate = "2024-08-01";
      // var todate = "2024-08-31";
      var fromdate = moment().subtract(30, "d").format("YYYY-MM-DD");
      var todate = moment().subtract(1, "d").format("YYYY-MM-DD");

      var isReload = $.ajax({
        type: "get", //요청 메소드 방식
        url: API_URL + "/app/data/isreload",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          nowdate: moment().unix(),
          session: store.state.userStore.session,
        },
        beforeSend: function (data) {},
        success: function (data) {
          if(!data.isreload) { alert("1시간 후에 이용하실수 있습니다."); return false;}

          $.ajax({
            type: "get", //요청 메소드 방식
            url: API_URL + "/rest/crond/day90collection",
            headers: { authorization: SHA256(TEMP_KEY) },
            data: {
              userid: store.state.userStore.userinfo.userid,
              fromdate: vm.fromdate,
              todate: vm.todate,
              session: store.state.userStore.session,
            },
            beforeSend: function (data) {alert("수집이 요청되었습니다. 1시간 후에 재요청할 수 있습니다.");},
            success: function (data) {
              // console.log(data);
              if (data.result === "success") {} 
              else { if (data.status === "0001") {vm.handleExpireSession();}
              }
            },
            error: function (a, b, c) {},
            complete: function (a, b, c) {},
          });     

        },
        error: function (a, b, c) {},
        complete: function (a, b, c) {},
      });      

      //  $.when(isReload).done(function(isReload) {
      //     if (isReload.status === "0001") {
      //       vm.$store.commit("logout");
      //       vm.$store.commit("logoutActivedMdias");
      //       vm.$store.commit("logoutKakaoSa");
      //       vm.$router.push("/");
      //     }

      //   if(!isReload.isreload) { alert("1시간 후에 이용하실수 있습니다."); return false;}
        
      //   // $.ajax({
      //   //   type: "get", //요청 메소드 방식
      //   //   url: API_URL + "/rest/crond/day90collection",
      //   //   headers: { authorization: SHA256(TEMP_KEY) },
      //   //   data: {
      //   //     userid: store.state.userStore.userinfo.userid,
      //   //     fromdate: fromdate,
      //   //     todate: todate,
      //   //     session: store.state.userStore.session,
      //   //   },
      //   //   beforeSend: function (data) {},
      //   //   success: function (data) {
      //   //     console.log(data);
      //   //     if (data.result === "success") {alert("수집이 요청되었습니다. 1시간 후에 재요청할 수 있습니다.");} 
      //   //     else { if (data.status === "0001") {vm.handleExpireSession();}
      //   //     }
      //   //   },
      //   //   error: function (a, b, c) {},
      //   //   complete: function (a, b, c) {},
      //   // });        

      //   console.log(isReload);
      //  }).then();
    },
    cancelForm() {this.$router.push("/dashboard");},
  },
};
</script>

<style scoped></style>
