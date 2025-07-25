<template>
  <div
    class="modal fade show linkNaver"
    id="linkNaver"
    :class="getUniqueId"
    data-backdrop="static"
    data-keyboard="false"
    tabindex="-1"
    aria-labelledby="linkNaver"
    aria-modal="true"
    role="dialog"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-title">
          <template v-if="mode === 'I'">
            <h3>계정등록</h3>
          </template>
          <template v-else>
            <h3>계정수정</h3>
          </template>

          <div class="accordion" id="apiFind">
            <div class="card">
              <div class="card-header" id="apiAccordion">
                <h2 class="mb-0">
                  <button
                    class="btn btn-link btn-block collapsed shadow-none"
                    type="button"
                    data-toggle="collapse"
                    data-target="#naverApi"
                    aria-expanded="false"
                    aria-controls="naverApi"
                  >
                    네이버 광고 API 확인 방법
                  </button>
                </h2>
              </div>
              <div
                id="naverApi"
                class="collapse"
                aria-labelledby="apiAccordion"
                data-parent="#apiFind"
              >
                <div class="card-body">
                  <p>1. 네이버광고 관리시스템 접속하기</p>
                  <img
                    src="../../assets/image/naverApi01.png"
                    alt="네이버광고 관리시스템 접속하기"
                  />
                  <p>2. 도구 &gt; API 사용 관리로 이동하기</p>
                  <img
                    src="../../assets/image/naverApi02.png"
                    alt="도구 > API 사용 관리로 이동하기"
                  />
                  <p>3. '네이버 검색광고 API 서비스 신청' 클릭해서 발급받기</p>
                  <img
                    src="../../assets/image/naverApi03.png"
                    alt="'네이버 검색광고 API 서비스 신청' 클릭해서 발급받기"
                  />
                  <p>4. 발급받은 API 정보 입력하기</p>
                  <img
                    src="../../assets/image/naverApi04.png"
                    alt="발급받은 API 정보 입력하기"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <form
          class="form-inline media-link d-flex"
          onkeydown="return event.key == 'Enter' ? false : true"
        >
          <label for="naverid" class="form-label">로그인ID</label>
          <input
            type="text"
            class="form-control shadow-none"
            id="naverid"
            placeholder=""
            v-model="naverid"
            @blur="blurNaverid"
          />
          <div
            v-if="naveridErrorMessage.length > 0"
            id="naveridErrorMessage"
            class="invalid-feedback d-block"
          >
            {{ naveridErrorMessage }}
          </div>
          <label for="navercustomer" class="form-label">내 계정 : CUSTOMER_ID</label>
          <input
            type="text"
            class="form-control shadow-none"
            id="navercustomer"
            placeholder=""
            v-model="navercustomer"
          />
          <label for="naveraccess" class="form-label">엑세스라이선스</label>
          <textarea
            class="form-control shadow-none"
            aria-label="naveraccess"
            v-model="naveraccess"
          ></textarea>
          <label for="naversecret" class="form-label">비밀키</label>
          <textarea
            class="form-control shadow-none"
            aria-label="naversecret"
            v-model="naversecret"
          ></textarea>
          <div v-if="logMessage.length > 0" class="input-group mb-3">
            <div class="invalid-feedback d-block">{{ logMessage }}</div>
          </div>
        </form>
        <div class="modal-button d-flex">
          <button class="btn shadow-none mr-2" data-dismiss="modal">취소</button>
          <button class="btn shadow-none" data-target="#confirm" @click="submitForm">
            저장
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import { isblank } from "../../assets/js/common.js";
import { store } from "../../store/store.js";
import { API_URL, TEMP_KEY } from "../../configs/config.js";
import { SHA256 } from "../../assets/js/sha256.js";

export default {
  data() {
    return {
      ajax: true,
      uniqueId: null,
      mode: "I",
      naverid: null,
      navercustomer: null,
      naveraccess: null,
      naversecret: null,
      media: null,
      mediaTittle: null,
      naveridErrorMessage: "",
      logMessage: "",
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
  },
  methods: {
    hideModal() {
      $("." + this.getUniqueId).modal("hide");
    },
    showModal(mode, media, mediaTittle) {
      this.mode = mode;
      this.media = media;
      this.mediaTittle = mediaTittle;
      this.logMessage = "";
      this.naveridErrorMessage = "";
      this.initForm();
      $("." + this.getUniqueId).modal("show");
    },
    showModalForEdit(mode, media, mediaTittle, data) {
      this.mode = mode;
      this.media = media;
      this.mediaTittle = mediaTittle;
      this.naverid = data.naverid;
      this.navercustomer = data.navercustomer;
      this.naveraccess = data.naveraccess;
      this.naversecret = data.naversecret;
      $("." + this.getUniqueId).modal("show");
    },
    validate() {
      this.logMessage = "";
      this.blurNaverid();
    },
    initForm() {
      this.naverid = null;
      this.navercustomer = null;
      this.naveraccess = null;
      this.naversecret = null;
    },
    submitForm() {
      var vm = this;
      this.ajax = true;
      this.validate();
      if (this.ajax) {
        $.ajax({
          type: "post", //요청 메소드 방식
          url: API_URL + "/app/user/account",
          headers: { authorization: SHA256(TEMP_KEY) },
          data: {
            userid: store.state.userStore.userinfo.userid,
            mode: vm.mode,
            media: "N",
            naverid: vm.naverid,
            navercustomer: vm.navercustomer,
            naveraccess: vm.naveraccess,
            naversecret: vm.naversecret,
            kakaosaid: "",
            kakaomomentid: "",
            gfaid: "",
            session: store.state.userStore.session,
          },
          cache: false,
          // async : false,
          beforeSend: function (data) {
            // vm.$refs.maskModal.showModal();
          },
          success: function (data) {
            // console.log(data);
            if (data.result === "success") {
              vm.$emit("updateAccountStatus", vm.mode, "N", {
                naverid: vm.naverid,
                navercustomer: vm.navercustomer,
                naveraccess: vm.naveraccess,
                naversecret: vm.naversecret,
              });
            } else {
              if (data.status === "0001") {
                vm.$emit("expireSession");
              } else {
              }
            }
          },
          error: function (a, b, c) {
            console.log(a, b, c);
          },
          complete: function (a, b, c) {
            // vm.$refs.maskModal.hideModal();
            vm.hideModal();
          },
        });
      }
    },
    // getMode(media) {
    // 	var mode = "";
    // 	if(media === "Naver") mode = "N";
    // 	if(media === "Ksa") mode = "D";
    // 	if(media === "Moment") mode = "K";
    // 	if(media === "Gfa") mode = "G";

    // 	return mode;
    // },
    blurNaverid() {
      this.naveridErrorMessage = "";
      if (isblank(this.naverid)) {
        this.naveridErrorMessage = "로그인ID를 입력해주세요.";
        this.ajax = false;
      }
    },
  },
};
</script>

<style scoped></style>
