<template>
  <div
    class="modal fade show linkKsa linkMoment linkGfa"
    id="linkKsa"
    :class="getUniqueId"
    data-backdrop="static"
    data-keyboard="false"
    tabindex="-1"
    aria-labelledby="linkKsa"
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

          <template v-if="media === 'Ksa'">
            <div class="accordion" id="apiFind2">
              <div class="card">
                <div class="card-header" id="apiAccordion2">
                  <h2 class="mb-0">
                    <button
                      class="btn btn-link btn-block shadow-none collapsed"
                      type="button"
                      data-toggle="collapse"
                      data-target="#kakaoApi"
                      aria-expanded="false"
                      aria-controls="kakaoApi"
                    >
                      카카오 광고 API 등록 방법
                    </button>
                  </h2>
                </div>
                <div
                  id="kakaoApi"
                  class="collapse"
                  aria-labelledby="apiAccordion2"
                  data-parent="#apiFind2"
                  style=""
                >
                  <div class="card-body">
                    <p>1. 카카오 관리자센터 접속하기</p>
                    <img
                      src="../../assets/image/ksaApi01.jpg"
                      alt="카카오 관리자센터 접속하기"
                    />
                    <p>2. [왼쪽 메뉴] 설정 &gt; 광고계정 관리</p>
                    <img
                      src="../../assets/image/ksaApi02.jpg"
                      alt="[왼쪽 메뉴] 설정 > 광고계정 관리"
                    />
                    <p>3. [광고계정 관리] 멤버 관리 &gt; 초대</p>
                    <img
                      src="../../assets/image/ksaApi03.jpg"
                      alt="[광고계정 관리] 멤버 관리 > 초대"
                    />
                    <p>4. [멤버 초대] heeilcom@daum.net 입력</p>
                    <img
                      src="../../assets/image/ksaApi04.jpg"
                      alt="[멤버 초대] heeilcom@daum.net 입력 후 확인하기"
                    />
                    <p>5. 희일 담당 마케터에게 문의해서 API 승인 완료하기</p>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>

        <form
          class="form-inline media-link d-flex"
          onkeydown="return event.key == 'Enter' ? false : true"
        >
          <label for="mediaid" class="form-label">{{ mediaTittle }} ID</label>
          <input
            type="text"
            class="form-control shadow-none"
            id="mediaid"
            placeholder=""
            v-model="mediaid"
            @blur="blurMediaid"
          />
          <template v-if="media === 'Ksa'"
            ><p class="pt-2">
              ※heeilcom@daum.net 멤버 수락 후 API 사용이 가능합니다. 담당 마케터에게
              문의해 주세요.
            </p></template
          >
          <div
            v-if="mediaidErrorMessage.length > 0"
            id="mediaidErrorMessage"
            class="invalid-feedback d-block"
          >
            {{ mediaidErrorMessage }}
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
  props: {},
  data() {
    return {
      media: "",
      mediaTittle: "",
      uniqueId: null,
      mode: "I",
      mediaid: null,
      mediaidErrorMessage: "",
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
  watch: {
    pMedia() {
      this.media = this.pMedia;
    },
    pMediaTittle() {
      this.mediaTittle = this.pMediaTittle;
    },
  },
  mounted() {
    this.media = this.pMedia;
    this.mediaTittle = this.pMediaTittle;
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
      this.mediaidErrorMessage = "";
      this.initForm();
      $("." + this.getUniqueId).modal("show");
    },
    showModalForEdit(mode, media, mediaTittle, data) {
      this.mode = mode;
      this.media = media;
      this.mediaTittle = mediaTittle;
      this.mediaid = this.getDataByMedia(data);
      $("." + this.getUniqueId).modal("show");
    },
    validate() {
      this.logMessage = "";
      this.blurMediaid();
    },
    initForm() {
      this.mediaid = null;
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
            media: vm.getMedia(vm.media),
            naverid: "",
            navercustomer: "",
            naveraccess: "",
            naversecret: "",
            kakaosaid: vm.media === "Ksa" ? vm.mediaid : "",
            kakaomomentid: vm.media === "Moment" ? vm.mediaid : "",
            gfaid: vm.media === "Gfa" ? vm.mediaid : "",
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
              vm.$emit("updateAccountStatus", vm.mode, vm.getMedia(vm.media), {
                kakaosaid: vm.media === "Ksa" ? vm.mediaid : "",
                kakaomomentid: vm.media === "Moment" ? vm.mediaid : "",
                gfaid: vm.media === "Gfa" ? vm.mediaid : "",
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
    blurMediaid() {
      this.mediaidErrorMessage = "";
      if (isblank(this.mediaid)) {
        this.mediaidErrorMessage = "매체ID를 입력해주세요.";
        this.ajax = false;
      }
    },
    getMedia(media) {
      var result = "";
      if (media === "Naver") result = "N";
      if (media === "Ksa") result = "D";
      if (media === "Moment") result = "K";
      if (media === "Gfa") result = "G";

      return result;
    },
    getDataByMedia(data) {
      var value = "";
      if (this.media === "Ksa") value = data.kakaosaid;
      if (this.media === "Moment") value = data.kakaomomentid;
      if (this.media === "Gfa") value = data.gfaid;
      return value;
    },
  },
};
</script>

<style scoped></style>
