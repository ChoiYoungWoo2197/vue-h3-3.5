<template>
  <div class="top d-flex justify-content-between align-items-center" :id="getUniqueId">
    <ul class="balance">
      <li><span class="badge font-weight-bold">잔액</span></li>
      <li v-for="data in getDatas" class="d-flex align-items-center" :key="data.media">
        <img class="mr-1" :src="data.url"/><span>{{ priceToString(data.media, data.balance) }}</span>
      </li>
    </ul>
    <ul class="shotcut d-flex justify-content-between align-items-center">
      <li class="alarm-modal">
        <button type="button" class="btn shadow-none position-relative" data-toggle="dropdown" aria-expanded="false" >
          <i class="bi bi-bell m-0"></i >
          <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" v-text="main.data === null ? 0 : main.totalcount" ></span>
        </button>
        <div class="dropdown-menu dropdown-menu-right">
          <div class="dropdown-header"><p>새 알림</p></div>
          <ul>
            <template v-if="main.data === null || main.data === 0"> <li> <a><p>데이터가 존재하지 않습니다.</p></a> </li></template>
            <li v-for="(data, i) in main.data" :key="i + '-' + getUuidv4">
              <router-link to="/alarms" class="dropdown-item">
                <p>{{ data.daily_dt }} <span>{{ data.media }}</span> </p>
                <p>{{ data.content }}</p>
              </router-link>
            </li>
          </ul>
          <div class="dropdown-footer">
            <div class="two-btn">
              <button type="submit" class="btn select-cancel" data-toggle="dropdown" aria-expanded="false" > 닫기 </button>
              <button type="submit" class="btn select-save" @click="$router.push('/alarms').catch(() => {})" > 전체 보기 </button>
            </div>
          </div>
        </div>
      </li>
      <li class="userinfo d-flex align-items-center">
        <template v-if="managerinfo !== null">
          <button type="button" class="btn shadow-none" data-toggle="dropdown" aria-expanded="false" >
            <i class="bi bi-person-circle"></i >{{ managerinfo.username + "(" + managerinfo.userid + ")" }}
          </button>
          <div class="dropdown-menu dropdown-menu-right">
            <router-link to="/dashboard-edit" class="dropdown-item">정보수정</router-link>
            <a class="dropdown-item" href="#" @click="clickLogOutModal">로그아웃</a>
            <a v-if="isMobile === true" class="dropdown-item" href="#">모바일 버전</a>
          </div>
        </template>
      </li>
    </ul>
  </div>
</template>

<script>
import $ from "jquery";
import { store } from "@/store/store.js";
import { SHA256 } from "@/assets/js/sha256.js";
import { API_URL, TEMP_KEY, MEDIA_SORT } from "@/configs/config.js";
import { priceToString, isMobile, uuidv4, getMedia } from "@/assets/js/common.js";
import googleIcon from "@/assets/image/icon_google.png";
import naverIcon from "@/assets/image/icon_naver.png";
import kakaosaIcon from "@/assets/image/icon_kakaosa.png";
import kakaomoIcon from "@/assets/image/icon_kakaomo.png";
import naverdaIcon from "@/assets/image/icon_naverda.png";
export default {
  components: {},
  data() {
    return {
      uniqueId: null,
      isMobile: isMobile() === true ? true : false,
      data: [],
      managerinfo: null,
      main: { responseData: null, data: null, start: 0, display: 10, isTotalCount: "-1", },
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
    getDatas() {
      this.data.sort(function (a, b) { return a.sort < b.sort ? -1 : a.sort > b.sort ? 1 : 0; });
      return this.data;
    },
    getUuidv4() { return uuidv4(); },
  },
  created() {},
  mounted() {
    this.setDatasNew();
    this.managerinfo = !store.state.userStore.managerinfo ? { username: store.state.userStore.userinfo.username, userid: store.state.userStore.userinfo.userid, }
      : { username: store.state.userStore.managerinfo.username, userid: store.state.userStore.managerinfo.userid, };
    this.clickSearchBtn();
  },
  methods: {
    setDatasNew() {
      var vm = this;
      vm.data = [];
      $.ajax({
        type: "post",
        url: API_URL + "/app/dashboard/balance",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          medias: "naver,kakaosa,kakaomo,naverda,google",
          session: store.state.userStore.session,
        },
        success: function (data) {
          if (data.result === "success") {
            vm.data.push(
              { media: "naver", balance: data.data.naver.balance, url: naverIcon, murl: naverIcon, sort: MEDIA_SORT["N"], },
              { media: "kakaosa", balance: data.data.kakaosa.balance, url: kakaosaIcon, murl: kakaosaIcon, sort: MEDIA_SORT["D"], },
              { media: "kakaomo", balance: data.data.kakaomo.balance, url: kakaomoIcon, murl: kakaomoIcon, sort: MEDIA_SORT["K"], },
              { media: "naverda", balance: data.data.naverda.balance, url: naverdaIcon, murl: naverdaIcon, sort: MEDIA_SORT["Nda"], },
              { media: "google", balance: data.data.google.balance, url: googleIcon, murl: googleIcon, sort: MEDIA_SORT["google"], }
            );
            vm.$emit("changeData", vm.data);
          } else {
            if (data.status === "0001") {
              vm.$emit("expireSession");
            } else {
            }
          }
        },
      });
    },
    priceToString(media, salse) {
      if (media === "naverda" || media === "google") return "미지원";
      if (salse === undefined) return "";
      if (salse === -1) return "미연동";
      //console.log(salse, media);
      return priceToString(salse) + "원";
    },  
    clickLogOutModal() {this.$emit("logOut");},
    clickSearchBtn() {
      this.main.start = 0;
      this.main.isTotalCount = "-1";
      this.getReport();
    },
    getReport() {
      var vm = this;

      $.ajax({
        type: "get", //요청 메소드 방식
        url: API_URL + "/app/alarm/alarm",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          fromdate: "",
          todate: "",
          start: vm.main.start,
          sort: "",
          display: vm.main.display,
          totalcount: vm.main.isTotalCount,
          mode: "user",
          session: store.state.userStore.session,
        },
        beforeSend: function (data) {},
        success: function (data) {
          if (data.result === "success") {
            vm.main.data = [];
            vm.main.responseData = null;
            vm.main.responseData = data;
            vm.main.totalcount = data.totalcount;
            vm.main.data = data.data.alarms.slice();
          } else {
            if (data.status === "0001") {
              vm.$emit("expireSession");
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
        complete: function (a, b, c) {},
      });
    },
  },
};
</script>

<style scoped></style>
