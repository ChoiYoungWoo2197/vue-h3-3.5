<template>
  <div class="modal fade show link-account-modal" :class="getUniqueId" id="mediaModal" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="mediaModal" aria-modal="true" role="dialog" >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-body">
          <template v-if="media === 'naver'">
            <div class="title"> <h3>{{ mediaTittle }} 계정 등록</h3> </div>
            <form>
              <div class="form-group">
                <div class="row align-items-center">
                  <label for="" class="form-label col-md-5">로그인ID</label>
                  <div class="col-md-7"> <input type="text" class="form-control" id="" v-model="spare1" /> </div>
                </div>
                <div class="row align-items-center">
                  <label for="" class="form-label col-md-5">내 계정 : COUSTOMED_ID</label>
                  <div class="col-md-7"> <input type="text" class="form-control" id="" v-model="spare2" /> </div>
                </div>
                <div class="row align-items-center">
                  <label for="" class="form-label col-md-5">액세스 라이선스</label>
                  <div class="col-md-7">
                    <input type="text" class="form-control" id="" v-model="spare3" />
                  </div>
                </div>
                <div class="row align-items-center">
                  <label for="" class="form-label col-md-5">비밀키</label>
                  <div class="col-md-7"> <input type="text" class="form-control" id="" v-model="spare4" /> </div>
                </div>
              </div>
            </form>
          </template>
          <template v-for="(k,i) in ['kakaosa','naverda','kakaomo','google']">
            <div v-if="media === k" :key="i">
              <div class="title"><h3>{{getMedia(k)+' 계정 등록 '}}</h3></div>
              <form>
                <div class="form-group">
                  <div class="row align-items-center">
                    <label for="" class="form-label col-md-5">광고계정 ID</label>
                    <div class="col-md-7"> <input type="text" class="form-control" id="" v-model="spare2" /> </div>
                  </div>
                  <div class="alert alert-warning" role="alert">
                    관리 계정 멤버로 추가되어야 API 사용이 가능합니다.<br />
                    마스터계정(카카오-heeilcom@daum.net, 구글-heeilmb@gmail.com)                    
                  </div>
                </div>
              </form>
            </div>
          </template>
          <div v-if="logMessage.length > 0" class="input-group mb-3">
            <div class="invalid-feedback d-block">{{ logMessage }}</div>
          </div>
        </div>
        <div class="modal-footer d-flex justify-content-between align-items-center">
          <div class="api-btn d-flex align-items-center col-md-6">
            <template v-if="media === 'naver'"> <button type="button" class="btn api-popup" value="네이버 API 확인 방법" @click="showNaverApi" > 네이버 API 확인 방법 </button> </template>
            <template v-else-if="media === 'naverda'"> <button type="button" class="btn api-popup" value="네이버디스플레이 API 확인 방법" @click="showNaverDaApi" > 네이버디스플레이 API 확인 방법 </button> </template>
            <template v-else-if="media === 'google'"> <button type="button" class="btn api-popup" value="네이버디스플레이 API 확인 방법" @click="showGoogleApi" > Google Ads API 확인 방법 </button> </template>            
            <template v-else> <button type="button" class="btn api-popup" value="카카오 API 확인 방법" @click="showKakaoApi" > 카카오 API 확인 방법 </button> </template>
          </div>
          <div class="two-btn col-md-6 text-right d-flex justify-content-between justify-content-md-end" >
            <button type="submit" class="btn select-cancel" data-dismiss="modal"> 취소 </button>
            <button type="submit" class="btn select-save" @click="submitForm"> 저장 </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import { isblank, uuidv4, getMedia } from "@/assets/js/common.js";
import { store } from "@/store/store.js";
import { API_URL, TEMP_KEY } from "@/configs/config.js";
import { SHA256 } from "@/assets/js/sha256.js";

export default {
  props: {},
  data() {
    return {
      logMessage: "",
      uniqueId: null,
      media: "",
      mediaTittle: "",
      responseData: null,
      data: null,
      mode: null,
      spare1: null,
      spare2: null,
      spare3: null,
      spare4: null,
    };
  },
  mounted() {
    this.media = this.pMedia;
    this.mediaTittle = this.pMediaTittle;
  },
  watch: {},
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
    showModal(media, mode, mediaTittle) {
      let vm = this;
      vm.responseData = null;
      vm.logMessage = "";
      vm.data = null;
      vm.spare1 = 0;
      vm.spare2 = 0;
      vm.spare3 = 0;
      vm.spare4 = 0;     

      if (media === "naver") {
        if (store.state.mediaStore.activedMedias[0].data) {
          vm.spare1 = store.state.mediaStore.activedMedias[0].data.naverid;
          vm.spare2 = store.state.mediaStore.activedMedias[0].data.navercustomer;
          vm.spare3 = store.state.mediaStore.activedMedias[0].data.naveraccess;
          vm.spare4 = store.state.mediaStore.activedMedias[0].data.naversecret;
        }
      } else {
        store.state.mediaStore.activedMedias.forEach(function (m) {
          console.log(m);
          if (m.media === media) {
            vm.spare2 = m.userid;
          }
        });
      }

      vm.media = media;
      vm.mode = mode;
      vm.mediaTittle = mediaTittle;
      $("." + vm.getUniqueId).modal("show");
    },
    getMedia(media) { return getMedia(media); },
    validate() {
      this.logMessage = "";
      if (isblank(this.spare2)) {
        this.logMessage = "광고계정ID를 입력해주세요.";
        this.ajax = false;
      }
    },
    showNaverApi() { window.open( "https://sian.heeil.com/promotion/h3_d/new/dashboard/image/naver-api.jpg", "height=" + screen.height + ",width=" + screen.width + "fullscreen=yes" ); },
    showKakaoApi() { window.open( "https://sian.heeil.com/promotion/h3_d/new/dashboard/image/kakao-api.jpg", "height=" + screen.height + ",width=" + screen.width + "fullscreen=yes" ); },
    showNaverDaApi() { window.open( "https://sian.heeil.com/promotion/h3_d/new/dashboard/image/navergfa-api.jpg", "height=" + screen.height + ",width=" + screen.width + "fullscreen=yes" ); },
    showGoogleApi() { window.open( "https://sian.heeil.com/promotion/h3_d/new/dashboard/image/google-api.jpg", "height=" + screen.height + ",width=" + screen.width + "fullscreen=yes" ); },
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
            media: vm.media,
            naverid: vm.media === "naver" ? vm.spare1 : "",
            navercustomer: vm.media === "naver" ? vm.spare2 : "",
            naveraccess: vm.media === "naver" ? vm.spare3 : "",
            naversecret: vm.media === "naver" ? vm.spare4 : "",
            kakaosaid: vm.media === "kakaosa" ? vm.spare2 : "",
            kakaomomentid: vm.media === "kakaomo" ? vm.spare2 : "",
            naverdaid: vm.media === "naverda" ? vm.spare2 : "",
            googleid: vm.media === "google" ? vm.spare2 : "",
            session: store.state.userStore.session,
          },
          beforeSend: function (data) {},
          success: function (data) {
            // console.log(data);
            if (data.result === "success") {
              if (vm.media === "naver") {
                vm.$emit("updateAccountStatus", vm.mode, "naver", { naverid: vm.naverid, navercustomer: vm.navercustomer, naveraccess: vm.naveraccess, naversecret: vm.naversecret, });
              } else {
                vm.$emit("updateAccountStatus", vm.mode, vm.media, { kakaosaid: vm.media === "kakaosa" ? vm.mediaid : "", kakaomomentid: vm.media === "kakaomo" ? vm.mediaid : "", gfaid: vm.media === "naverda" ? vm.mediaid : "", googleid: vm.media === "google" ? vm.mediaid : "" });
              }
            } else {
              if (data.status === "0001") {
                vm.$emit("expireSession");
              } else {
              }
            }
            vm.hideModal();
          },
          error: function (a, b, c) {
            console.log(a, b, c);
          },
          complete: function (a, b, c) {},
        });
      }
    },
    getUuidv4() { return uuidv4(); },
  },
};
</script>

<style scoped></style>
