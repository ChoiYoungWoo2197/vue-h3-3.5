<template>
  <div class="d-flex m-h-100 dashboard">
    <big-menu-2
      :pMenu="'dashboard'"
      @mountedMain="activeMain"
      class="pc d-none"
    ></big-menu-2>
    <balance
      @logOut="handleLogOut"
      @changeData="handleChangedBalance"
      style="display: none !important"
    ></balance>
    <div class="m m-wrap">
      <mheader ref="mHeader" :pMenu="'dashboard'"></mheader>
      <mfooter ref="mFooter" :pMenu="'dashboard'"></mfooter>
      <section>
        <article class="dashboard-card">
          <div class="title"><h3>새 리포트 작성</h3></div>
          <step-bar :pStep="step"></step-bar>
          <step-section ref="stepSection">
            <swiper-slide>
              <div
                class="tab-pane top10-card"
                id="pills1"
                role="tabpanel"
                aria-labelledby="pills1-tab"
                tabindex="1"
                data-index="1"
              >
                <step-1 ref="step1" @prev="prev" @next="next"></step-1>
              </div>
            </swiper-slide>
            <swiper-slide>
              <div
                class="tab-pane top10-card"
                id="pills2"
                role="tabpanel"
                aria-labelledby="pills2-tab"
                tabindex="2"
                data-index="2"
              >
                <step-2 ref="step2" @prev="prev" @next="next"></step-2>
              </div>
            </swiper-slide>
            <swiper-slide>
              <div
                class="tab-pane top10-card"
                id="pills3"
                role="tabpanel"
                aria-labelledby="pills3-tab"
                tabindex="3"
                data-index="3"
              >
                <step-3 ref="step3" @prev="prev" @next="next"></step-3>
              </div>
            </swiper-slide>
          </step-section>
        </article>
      </section>
      <mbig-menu-2 ref="mBigMenu2"></mbig-menu-2>
      <mdate-range-picker
        ref="mDateRangePicker"
        :pStart="start"
        :pEnd="end"
        :pCstart="''"
        :pCend="''"
        @changedDate="handleChangedDateRange"
      >
      </mdate-range-picker>
      <mbalance ref="mBalance" :pBalance="balance"></mbalance>
      <malarm ref="mFmenu" @closeBtn="$refs.mFooter.setFooter('home')"></malarm>
      <mfmenu
        ref="mFmenu"
        @logout="handleLogOut"
        @dbedit="$refs.mFooter.clickDbEdit('dashboard-edit')"
        @closeBtn="$refs.mFooter.setFooter('home')"
      ></mfmenu>
      <mdashboard-edit
        ref="mDashboardEdit"
        @closeBtn="$refs.mFooter.setFooter('home')"
      ></mdashboard-edit>
    </div>
    <log-out-modal ref="logOutModal" style="display: none"></log-out-modal>
    <expire-session-modal
      ref="expireSessionModal"
      style="display: none"
    ></expire-session-modal>
    <mask-modal ref="maskModal" style="display: none"></mask-modal>
  </div>
</template>

<script>
import $ from "jquery";
import * as xlsx from "xlsx";
import {
  isMobile,
  priceToString,
  getMedia,
  uuidv4,
  getType,
} from "../../../assets/js/common.js";
import moment from "moment";
import { store } from "../../../store/store.js";
import { SHA256 } from "../../../assets/js/sha256.js";
import { API_URL, TEMP_KEY } from "../../../configs/config.js";
import bigMenu2 from "../../../components/layout/bigMenu2.vue";
import balance from "../../../components/dashboard2/balance.vue";
import mheader from "../../../components/layout/m/header.vue";
import mfooter from "../../../components/layout/m/footer.vue";
import mbigMenu2 from "../../../components/layout/m/bigMenu2.vue";
import mdateRangePicker from "../../../components/common/m/dateRangePicker.vue";
import mbalance from "../../../components/common/m/balance.vue";
import mfmenu from "../../../components/common/m/fMenu.vue";
import malarm from "../../../components/common/m/alarm.vue";
import mdashboardEdit from "../../../components/common/m/dashboardEdit.vue";
import logOutModal from "../../../components/modal/logOutModal.vue";
import expireSessionModal from "../../../components/modal/expireSessionModal.vue";
import maskModal from "../../../components/modal/maskModal.vue";
import stepBar from "../../../components/common/stepBar.vue";
import stepSection from "../../../components/common/stepSection.vue";
import step1 from "../../../components/reportSend/step1.vue";
import step2 from "../../../components/reportSend/step2.vue";
import step3 from "../../../components/reportSend/step3.vue";
// import "swiper/dist/css/swiper.css";
import 'swiper/css';
// import { swiper, swiperSlide } from "vue-awesome-swiper";
import { Swiper, SwiperSlide } from "vue-awesome-swiper";

export default {
  data() {
    return {
      start: store.state.dateStore.start,
      end: store.state.dateStore.end,
      uniqueId: null,
      balance: [],
      showMask: false,
      step: 1,
      last: 3,
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
    getDatasForMain() {
      return this.main.data;
    },
    isFirstPageGroupForMain() {
      return this.main.isFirst;
    },
    isLastPageGroupForMain() {
      return this.main.isEnd;
    },
    getType() {
      return getType(this.campaign.type);
    },
  },
  components: {
    mheader,
    mfooter,
    mbigMenu2,
    mdateRangePicker,
    mbalance,
    balance,
    bigMenu2,
    logOutModal,
    expireSessionModal,
    maskModal,
    mfmenu,
    malarm,
    mdashboardEdit,
    stepBar,
    stepSection,
    step1,
    step2,
    step3,
    Swiper,
    SwiperSlide,
  },
  mounted() {
    $(".main").removeClass("m-h-100");
  },
  watch: {
    step() {
      this.$refs.stepSection.slideStep(this.step);
    },
  },
  methods: {
    getUuidv4() {
      return uuidv4();
    },
    activeMain(flag) {
      this.$emit("mountedMain", true);
      this.$emit("mountedDasyboad", true);
    },
    handleChangedDateRange(data) {
      let vm = this;
      vm.start = data.start;
      vm.end = data.end;
    },
    priceToString(salse) {
      if (salse === undefined) return "";

      return priceToString(salse);
    },
    handleChangedBalance(data) {
      this.balance = [];
      this.balance = data.slice();
    },
    handleLogOut() {
      this.$refs.logOutModal.showModal();
    },
    handleShowMask() {
      this.$refs.maskModal.showModal();
    },
    handleHideMask() {
      this.$refs.maskModal.hideModal();
    },
    handleLogOut() {
      this.$refs.logOutModal.showModal();
    },
    prev() {
      if (this.step === 1) this.moveHome();
      if (this.step !== 1) this.step--;
    },
    next() {
      if (this.step === this.last) this.addReport();
      if (this.step !== 3) this.step++;
    },
    moveHome() {
      this.$router.push("/report-send");
    },
    addReport() {
      let vm = this;
      let step1 = vm.$refs.step1.getData();
      let step2 = vm.$refs.step2.getData();
      let step3 = vm.$refs.step3.getData();

      let media = "";
      step2.medias.forEach(function (m, i) {
        m.check ? (media += "1") : (media += "0");
        step2.medias.length - 1 !== i ? (media += ",") : "";
      });

      let page = "";
      step2.pages.forEach(function (p, i) {
        p.check ? (page += "1") : (page += "0");
        step2.pages.length - 1 !== i ? (page += ",") : "";
      });

      let kpi = "";
      step3.kpis.forEach(function (k, i) {
        k.check ? (kpi += "1") : (kpi += "0");
        step3.kpis.length - 1 !== i ? (kpi += ",") : "";
      });

      let dropdownMenu = "1,";
      step3.sort.forEach(function (s, i) {
        s.check ? (dropdownMenu += s.value) : "";
      });

      $.ajax({
        type: "get", //요청 메소드 방식
        url: API_URL + "/app/reportsend/reportset",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          mode: "upsert",
          name: step1.name,
          fromdate: step1.start,
          todate: step1.end,
          sender: step1.sender,
          sendate: 0,
          sendstatus: 0,
          pdfdate: 0,
          number: step1.number,
          email: step1.email,
          recver: step1.recver,
          media: media,
          page: page,
          kpi: kpi,
          dropdownmenu: dropdownMenu,
          id: "-1",
          session: store.state.userStore.session,
        },
        beforeSend: function (data) {
          vm.$refs.maskModal.showModal();
        },
        success: function (data) {
          vm.$router.push("/report-send");
          // console.log(data);
          // vm.initForm();
          // vm.clickSearchBtn();
          if (data.result === "success") {
          } else if (data.status === "0001") {
            vm.handleExpireSession();
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
          vm.$refs.maskModal.hideModal();
        },
      });
    },
  },
};
</script>

<style></style>
