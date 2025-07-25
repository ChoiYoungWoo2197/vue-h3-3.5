<template>
  <div class="d-flex m-h-100 dashboard">
    <big-menu-2 :pMenu="'advadd'" @mountedMain="activeMain" class="pc"></big-menu-2>
    <div class="pc wrap">
      <balance @logOut="handleLogOut" @changeData="handleChangedBalance"></balance>
      <section>
        <div class="title d-flex justify-content-between align-items-center">
          <h2>광고계정등록</h2>
        </div>
        <article>
          <table class="report link-account">
            <colgroup>
              <col width="17%" />
              <col width="20%" />            
              <col width="" />                          
            </colgroup>
            <thead>
              <tr>
                <td class="text-left">매체</td>
                <td class="text-left">연동상태</td>
                <td class="text-left">연동하기</td>
              </tr>
            </thead>
            <tbody>
              <template v-for="(k,i) in ['naver','kakaosa','naverda','kakaomo','google']" :key="i+getUuidv4()">
                <tr > 
                  <td class="text-left"><img :src="(require(`@/assets/image/icon_${k}.png`))" alt="아이콘" class="icon mr-1" width="20" height="20">{{getMedia(k)}}</td>
                  <td class="text-left"><span class="dot" :class="ids[k+'Id'] !== null ? ['bg-success'] : ['bg-danger'] "></span>{{ids[k+'Id'] !== null ? '연동중' : '미연동' }}</td>
                  <td class="text-left">
                    <template v-if="k+'Id'===null">
                      <div class="btn-group">
                        <button type="button" class="btn" data-toggle="modal" data-target="#link-naver-resister" @click="clickAddAdv(k, 'I', getMedia(k))" > <i class="bi bi-link-45deg"></i></button>
                      </div>                      
                    </template>
                    <template>
                      {{ids[k+'Id']}}
                      <div class="btn-group ml-2">
                        <button type="button" class="btn" data-toggle="modal" data-target="#link-naver-resister" @click="clickAddAdv(k, 'U', getMedia(k))" > <i class="bi bi-pencil"></i> </button>
                        <button type="button" class="btn" @click="clickDelete(k, k+'Id')" > <i class="bi bi-x-lg"></i> </button>
                      </div>
                    </template>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </article>
      </section>
    </div>
    <div class="m m-wrap">
      <mheader ref="mHeader" :pMenu="'dashboard'"></mheader>
      <mfooter ref="mFooter" :pMenu="'dashboard'"></mfooter>
      <section>
        <article class="dashboard-card">
          <div class="title">
            <h3>광고계정등록</h3>
          </div>
          <table class="report link-account">
            <thead>
              <tr>
                <td class="text-left pl-0">매체</td>
                <td class="text-left pl-0">연동상태</td>                
                <td class="text-left pl-0">연동하기</td>
              </tr>
            </thead>
            <tbody>
              <template v-for="(k,i) in [{m:'naver', i:0},{m:'kakaosa', i:1},{m:'naverda', i:2},{m:'kakaomo', i:3},{m:'google', i:4}]" :key="i+getUuidv4()">
                <tr >
                  <td class="text-left">
                    <template v-if="balance.length > 0">
                      <img :src="balance[k.i].murl" alt="아이콘" class="icon"/>
                      <span>{{getMedia(k.m)}}</span>
                    </template>
                  </td>
                  <td class="text-left">
                    <template v-if="balance.length > 0">
                      <span class="dot" :class="account[k.m].data !== null ? ['bg-success'] : ['bg-danger'] "></span>{{account[k.m].data !== null ? '연동중' : '미연동' }}
                    </template>
                  </td>                  
                  <td class="text-left">
                    <template v-if="k.m+'Id' === null">
                      <div class="btn-group">
                        <button type="button" class="btn" data-toggle="modal" data-target="#link-naver-resister" @click="clickAddAdv(k.m, 'I', getMedia(k.m))" > <i class="bi bi-link-45deg"></i> </button>
                      </div>
                    </template>
                    <template v-else>
                      <div class="d-flex align-items-center">
                        {{ ids[k.m+'Id'] }}
                        <div class="btn-group ml-2">
                          <button type="button" class="btn" data-toggle="modal" data-target="#link-naver-resister" @click="clickAddAdv(k.m, 'U', getMedia(k.m))" > <i class="bi bi-pencil"></i> </button>
                          <button type="button" class="btn" @click="clickDelete(k.m, k.m+'Id')" > <i class="bi bi-x-lg"></i> </button>
                        </div>                        
                      </div>
                    </template>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </article>
      </section>
      <mbig-menu-2 ref="mBigMenu2" @closeBtn="$refs.mFooter.setFooter('home')" ></mbig-menu-2>
      <mdate-range-picker ref="mDateRangePicker" :pStart="start" :pEnd="end" :pCstart="''" :pCend="''" @changedDate="handleChangedDateRange" @closeBtn="$refs.mFooter.setFooter('home')" > </mdate-range-picker>
      <mbalance ref="mBalance" :pBalance="balance" @closeBtn="$refs.mFooter.setFooter('home')" ></mbalance>
      <malarm ref="mFmenu" @closeBtn="$refs.mFooter.setFooter('home')"></malarm>
      <mfmenu ref="mFmenu" @logout="handleLogOut" @dbedit="$refs.mFooter.clickDbEdit('dashboard-edit')" @closeBtn="$refs.mFooter.setFooter('home')" ></mfmenu>
      <mdashboard-edit ref="mDashboardEdit" @closeBtn="$refs.mFooter.setFooter('home')" ></mdashboard-edit>
    </div>
    <log-out-modal ref="logOutModal" style="display: none"></log-out-modal>
    <expire-session-modal ref="expireSessionModal" style="display: none" ></expire-session-modal>
    <mask-modal ref="maskModal" style="display: none"></mask-modal>
    <add-adv-modal ref="addAdvModal" style="display: none" @updateAccountStatus="handleUpdateAccountStatus" @expireSession="handleExpireSession" ></add-adv-modal>
    <confirm-modal ref="confirmModal" style="display: none"></confirm-modal>
  </div>
</template>

<script>
import $ from "jquery";
import {  isblank,  isNotId,  isNotPassword,  isNotPasswordc,  isNotEmail,  isNotTel, getMedia,  uuidv4,  } from "@/assets/js/common.js";
import expireSessionModal from "@/components/modal/expireSessionModal.vue";
import addAdvModal from "@/components/modal/addAdvModal.vue";
import linkNaverAdvModal from "@/components/modal/linkNaverAdvModal.vue";
import linkAdvModal from "@/components/modal/linkAdvModal.vue";
import confirmModal from "@/components/modal/confirmModal.vue";
import maskModal from "@/components/modal/maskModal.vue";
import { store } from "@/store/store.js";
import { SHA256 } from "@/assets/js/sha256.js";
import { API_URL, TEMP_KEY } from "@/configs/config.js";
import balance from "@/components/dashboard2/balance.vue";
import bigMenu2 from "@/components/layout/bigMenu2.vue";
import logOutModal from "@/components/modal/logOutModal.vue";
import mheader from "@/components/layout/m/header.vue";
import mfooter from "@/components/layout/m/footer.vue";
import mbigMenu2 from "@/components/layout/m/bigMenu2.vue";
import mdateRangePicker from "@/components/common/m/dateRangePicker.vue";
import mbalance from "@/components/common/m/balance.vue";
import mfmenu from "@/components/common/m/fMenu.vue";
import malarm from "@/components/common/m/alarm.vue";
import mdashboardEdit from "@/components/common/m/dashboardEdit.vue";

export default {
  data() {
    return {
      start: store.state.dateStore.start,
      end: store.state.dateStore.end,
      activedMedia: "",
      activeMode: "",
      activedMediaTittle: "",
      ids:{naverId: null, kakaosaId: null,naverdaId: null,kakaomoId: null,googleId: null,},
      balance: [],
      account:{
        naver:{data:store.state.mediaStore.activedMedias[0].data},
        kakaosa:{data:store.state.mediaStore.activedMedias[1].data},
        naverda:{data:store.state.mediaStore.activedMedias[2].data},
        kakaomo:{data:store.state.mediaStore.activedMedias[3].data},
        google:{data:store.state.mediaStore.activedMedias[4].data},}
    };
  },
  computed: {},
  watch: {},
  components: { bigMenu2, logOutModal, balance, expireSessionModal, maskModal, addAdvModal, linkNaverAdvModal, linkAdvModal, confirmModal, mheader,
    mfooter, mbigMenu2, mdateRangePicker, mbalance, mfmenu, malarm, mdashboardEdit
  },
  mounted() {
    $(".main").removeClass("m-h-100");
    this.setDatas();
  },
  updated() {},
  methods: {
    activeMain(flag) {
      this.$emit("mountedMain", true);
      this.$emit("mountedDasyboad", true);
    },
    handleLogOut() { this.$refs.logOutModal.showModal(); },
    handleExpireSession() { this.$refs.expireSessionModal.showModal(); },
    handleShowMask() { this.$refs.maskModal.showModal(); },
    handleHideMask() { this.$refs.maskModal.hideModal(); },
    setNaver(naver) {
      let vm = this;
      naver[0].account.naverid === null ? (vm.data = null) : (vm.data = { key: "naver", value: naver[0].account.naverid, });

      vm.$store.commit("setActivedMedias", {
        mode: naver[0].account.naverid === null ? "D" : "I",
        media: "naver",
        data: { naverid: naver[0].account.naverid, navercustomer: naver[0].account.navercustomer, naveraccess: naver[0].account.naveraccess, naversecret: naver[0].account.naversecret, },
      });
      vm.ids.naverId = naver[0].account.naverid;
    },
    setKakaosa(kakaosa) {
      let vm = this;
      kakaosa[0].account.kakaosaid === null ? (vm.data = null) : (vm.data = { key: "kakaosa", value: kakaosa[0].account.kakaosaid, });
      vm.$store.commit("setActivedMedias", {
        mode: kakaosa[0].account.kakaosaid === null ? "D" : "I",
        media: "kakaosa",
        data: { kakaosaid: kakaosa[0].account.kakaosaid, kakaomomentid: "", gfaid: "", googleid: ""},
      });
      vm.ids.kakaosaId = kakaosa[0].account.kakaosaid;
    },
    setNaverda(naverda) {
      let vm = this;
      naverda[0].account.naverdaid === null ? (vm.data = null) : (vm.data = { key: "naverda", value: naverda[0].account.naverdaid, });
      vm.$store.commit("setActivedMedias", {
        mode: naverda[0].account.naverdaid === null ? "D" : "I",
        media: "naverda",
        data: { kakaosaid: "", naverdaid: naverda[0].account.naverdaid, gfaid: "", },
      });
      vm.ids.naverdaId = naverda[0].account.naverdaid;
    },
    setKakaomo(kakaomo) {
      let vm = this;
      kakaomo[0].account.kakaomomentid === null ? (vm.data = null) : (vm.data = { key: "kakaomo", value: kakaomo[0].account.kakaomomentid, });
      vm.$store.commit("setActivedMedias", {
        mode: kakaomo[0].account.kakaomomentid === null ? "D" : "I",
        media: "kakaomo",
        data: { kakaosaid: "", kakaomomentid: kakaomo[0].account.kakaomomentid, gfaid: "", },
      });
      vm.ids.kakaomoId = kakaomo[0].account.kakaomomentid;
    },
    setGoogle(google) {
      let vm = this;
      google[0].account.googleid === null ? (vm.data = null) : (vm.data = { key: "google", value: google[0].account.googleid, });
      vm.$store.commit("setActivedMedias", {
        mode: google[0].account.googleid === null ? "D" : "I",
        media: "google",
        data: { kakaosaid: "", googleid: google[0].account.googleid, gfaid: "", },
      });
      vm.ids.googleId = google[0].account.googleid;
    },    
    clickAddAdv(media, mode, mediaTittle) {
      this.activedMedia = media;
      this.activeMode = mode;
      this.activedMediaTittle = mediaTittle;
      this.$refs.addAdvModal.showModal(media, mode, mediaTittle);
    },
    setDatas() {
      var vm = this;
      vm.ids.naverId = null;
      vm.ids.kakaosaId = null;
      vm.ids.naverdaId = null;
      vm.ids.kakaomoId = null;
      vm.ids.googleId = null;
      var naver = $.ajax({
        type: "post",
        url: API_URL + "/app/user/account",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          mode: "L",
          media: "naver",
          naverid: "",
          navercustomer: "",
          naveraccess: "",
          naversecret: "",
          kakaosaid: "",
          naverdaid: "",
          kakaomomentid: "",
          googleid: "",
          session: store.state.userStore.session,
        },
        success: function (data) {
          if (data.result === "success") {
          } else {
            if (data.status === "0001") {
              vm.$emit("expireSession");
            } else {
            }
          }
        },
        error: function () {},
      });
      var kakaosa = $.ajax({
        type: "post",
        url: API_URL + "/app/user/account",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          mode: "L",
          media: "kakaosa",
          naverid: "",
          navercustomer: "",
          naveraccess: "",
          naversecret: "",
          kakaosaid: "",
          naverdaid: "",
          kakaomomentid: "",
          googleid: "",
          session: store.state.userStore.session,
        },
        success: function (data) {
          if (data.result === "success") {
          } else {
            if (data.status === "0001") {
              vm.$emit("expireSession");
            } else {
            }
          }
        },
        error: function () {},
      });
      var naverda = $.ajax({
        type: "post",
        url: API_URL + "/app/user/account",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          mode: "L",
          media: "naverda",
          naverid: "",
          navercustomer: "",
          naveraccess: "",
          naversecret: "",
          kakaosaid: "",
          naverdaid: "",
          kakaomomentid: "",
          googleid: "",
          session: store.state.userStore.session,
        },
        success: function (data) {
          if (data.result === "success") {
          } else {
            if (data.status === "0001") {
              vm.$emit("expireSession");
            } else {
            }
          }
        },
        error: function () {},
      });
      var kakaomo = $.ajax({
        type: "post",
        url: API_URL + "/app/user/account",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          mode: "L",
          media: "kakaomo",
          naverid: "",
          navercustomer: "",
          naveraccess: "",
          naversecret: "",
          kakaosaid: "",
          naverdaid: "",
          kakaomomentid: "",
          googleid: "",
          session: store.state.userStore.session,
        },
        success: function (data) {
          if (data.result === "success") {
          } else {
            if (data.status === "0001") {
              vm.$emit("expireSession");
            } else {
            }
          }
        },
        error: function () {},
      });
      var google = $.ajax({
        type: "post",
        url: API_URL + "/app/user/account",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          mode: "L",
          media: "google",
          naverid: "",
          navercustomer: "",
          naveraccess: "",
          naversecret: "",
          kakaosaid: "",
          naverdaid: "",
          kakaomomentid: "",
          googleid: "",
          session: store.state.userStore.session,
        },
        success: function (data) {
          if (data.result === "success") {
          } else {
            if (data.status === "0001") {
              vm.$emit("expireSession");
            } else {
            }
          }
        },
        error: function () {},
      });      

      $.when(naver, kakaosa, naverda, kakaomo, google).done(function (naver, kakaosa, naverda, kakaomo, google) {
          if (naver[1] === "success") { vm.setNaver(naver); }
          if (kakaosa[1] === "success") { vm.setKakaosa(kakaosa); }
          if (naverda[1] === "success") { vm.setNaverda(naverda); }
          if (kakaomo[1] === "success") { vm.setKakaomo(kakaomo); }
          if (google[1] === "success") { vm.setGoogle(google);}
        }).then(function () {});
    },
    clickDelete(media, id) {
      var vm = this;
      if (!confirm("광고계정(" + id + ")을 삭제하시겠습니까?")) { return false; }

      $.ajax({
        type: "post", //요청 메소드 방식
        url: API_URL + "/app/user/account",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          mode: "D",
          media: media,
          naverid: vm.media === "naver" ? id : "",
          navercustomer: "",
          naveraccess: "",
          naversecret: "",
          kakaosaid: vm.media === "kakaosa" ? id : "",
          kakaomomentid: vm.media === "kakaomo" ? id : "",
          gfaid: vm.media === "naverda" ? id : "",
          googleid: vm.media === "google" ? id : "",
          session: store.state.userStore.session,
        },
        beforeSend: function (data) {
          // vm.$refs.maskModal.showModal();
        },
        success: function (data) {
          // console.log(data);
          if (data.result === "success") {
            vm.handleUpdateAccountStatus("D", media, null);
            // vm.$emit('updateAccountStatus', 'D', vm.getMedia(media), null);
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
          // vm.hideModal();
        },
      });
    },
    handleUpdateAccountStatus(mode, media, data) {
      this.setActiveMedias(mode, media, data);
      this.setDatas();
      this.$refs.confirmModal.showModal();
    },
    setActiveMedias(mode, media, data) {
      var vm = this;
      vm.$store.commit("setActivedMedias", { mode, media, data, });
    },
    getMedia(media) { return getMedia(media); },
    handleChangedDateRange(data) { this.$refs.dateRangePicker.setDate({ start: data.start, end: data.end, compare: false, }); },
    handleChangedBalance(data) {
      this.balance = [];
      this.balance = data.slice();
    },
    getUuidv4() { return uuidv4(); },
  },
};
</script>

<style scoped></style>
