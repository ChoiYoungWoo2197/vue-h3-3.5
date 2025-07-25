<template>
  <div class="d-flex m-h-100 dashboard">
    <big-menu-2 :pMenu="'dashboard'" @mountedMain="activeMain" class="pc"></big-menu-2>
    <div class="pc wrap">
      <balance @logOut="handleLogOut" @changeData="handleChangedBalance"></balance>
      <section>
        <message ref="message" class="mb-4">
          <span>
            <span>최근 집계 완료 시간(오늘) |
              <template v-for="(k,i) in accountlog" >
                <span v-if="k.campaign !== undefined && k.campaign !== ''" class="ml-1" :key="k+i+getUuidv4()"><span>{{getMedia(k.media)+": "}}</span> {{k.campaign.split(" ")[1]}}</span>
              </template>              
            </span>
          </span>
        </message>
        <div class="title d-flex justify-content-between align-items-center">
          <h2 class="">통합대시보드</h2>
          <div class="search d-flex">
            <div class="input-group">
              <div class="input-group-prepend date-standard d-flex justify-content-center align-items-center" > 비교일<span>(과거)</span> </div>
              <date-range-picker ref="cdateRangePicker"  :pStart="start" :pEnd="end" class="form-control"  :pDisabled="false" @changedDate="handleChangedCDateRange" > </date-range-picker>
            </div>
            <div class="input-group">
              <div class="input-group-prepend date-compare d-flex justify-content-center align-items-center" > 기준일<span>(현재)</span> </div>
              <date-range-picker ref="dateRangePicker" class="form-control" :pStart="start" :pEnd="end" :pDisabled="false" @changedDate="handleChangedDateRange" > </date-range-picker>
            </div>
            <button type="submit" class="btn submit" @click.prevent="clickSearchBtn"> 조회하기 </button>
          </div>
        </div>
        <summarys ref="summarys" @expireSession="handleExpireSession" @summary="isRendering('summary', true)" @changeData="handleChangeSummarys" @showAddSummayModal="clickAddSummary" @clickedSummary="handleClickedSummary" > </summarys>
        <article>
          <div class="title"><h3>매체통합 광고요약</h3></div>
          <cross-graph
            ref="crossGraph"
            :pHeight="'300px'"
            :pCustom="{
              series: { textStyle: { fontSize: '15', fontWeight: 'bold', }, },
              xAxis: { name: '', axisLabel: { fontSize: '15' } },
              yAxis: { name: '', axisLabel: { fontSize: '15' } },
              legend: {
                data: legend,
                show: true,
                left: 'center',
                top: '93%',
                width: '90%',
                orient: 'horizontal',
                textStyle: { fontSize: '15', fontWeight: 'normal', },
              },
            }"
            @expireSession="handleExpireSession"
            @finishedCrossGraph="isRendering('period', true)"
          >
          </cross-graph>
        </article>
        <div class="row article-division d-flex">
          <div class="col-12 col-xl-8">
            <article>
              <div class="title"><h3>매체별 요약</h3></div>
              <summarys-media ref="summarysMedai" @expireSession="handleExpireSession" @changeData="handleChangeSummarysMedia" @summarymedia="isRendering('summarymedia', true)" > </summarys-media>
            </article>
          </div>
          <div class="col-12 col-xl-4">
            <article>
              <div class="title"><h3>매체별 비중</h3></div>
              <pie-graph
                ref="pieGraph"
                :pCustom="{
                  series: { label: { fontSize: '13', fontWeight: 'normal', }, },
                  height: '300',
                  legend: { show: true, left: 'center', top: '93%', orient: 'horizontal', textStyle: { fontSize: '13', fontWeight: 'normal', }, },
                }"
                @expireSession="handleExpireSession"
                @finishedPieGraph="isRendering('summarymediarate', true)" >
              </pie-graph>
            </article>
          </div>
        </div>
        <div class="d-flex justify-content-end">
          <button type="button" class="ml-3 btn pdf" @click="clickPdf"> PDF 다운받기 </button>
          <button type="button" class="ml-3 btn excel" @click="clickExcel"> 엑셀 다운받기 </button>
        </div>
      </section>
    </div>
    <div class="m m-wrap">
      <mheader ref="mHeader" :pMenu="'dashboard'"></mheader>
      <mfooter ref="mFooter" :pMenu="'dashboard'"></mfooter>
      <!-- 컨텐츠 -->
      <section>
        <table class="date">
          <colgroup>
            <col width="30%" />
            <col width="70%" />
          </colgroup>
          <tbody>
            <tr>
              <td>직전 기간</td>
              <td v-if="cStart !== null">{{ cStart + " ~ " + cEnd }}</td>
            </tr>
            <tr>
              <td>기간</td>
              <td v-if="start !== null">{{ start + " ~ " + end }}</td>
            </tr>
          </tbody>
        </table>
        <div class="pills-container-btn">
          <div class="pills-btn pb-0">
            <ul class="d-flex" id="pills-tab" role="tablist">
              <li class="nav-item" role="presentation" v-for="(summary, index2) in m.summarys" :key="summary.key + '-' + index2 + '-' + getUuidv4()" >
                <button
                  class="nav-link"
                  :class="[swiperOption.index === index2 ? 'active' : '']"
                  :id="'pills' + index2 + '-tab'"
                  data-bs-toggle="pill"
                  :data-bs-target="'#pills' + index2"
                  type="button"
                  role="tab"
                  :aria-controls="'pills' + index2"
                  aria-selected="true"
                  @click="clicSwiperBtn(index2, $event)" >
                  {{ summary.name.substring(1) }}
                </button>
              </li>
            </ul>
          </div>
          <button class="allow" @click="clickAllowBtn">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="9" viewBox="0 0 12 8" >
              <path
                fill="none"
                fill-rule="evenodd"
                stroke="#1e1e23"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M1 6L6 1 11 6"
                transform="translate(0 1)" ></path>
            </svg>
          </button>
        </div>

        <article class="dashboard-card">
          <swiper ref="swiper" class="tab-content swiper" id="pills-tabContent" :options="swiperOption" @slideChange="slideChangeTransitionStart" >
            <swiper-slide v-for="(summary, index2) in m.summarys" :key="summary.key + '-' + index2 + '-' + getUuidv4()" style="width: 60%" >
              <div
                class="tab-pane"
                :class="[swiperOption.index === index2 ? 'show active' : '']"
                :id="'pills' + index2"
                role="tabpanel"
                :aria-labelledby="'pills' + index2 + '-tab'"
                tabindex="0"
                :data-index="index2" >
                <ul class="">
                  <li> <h3>{{ summary.name }}</h3> </li>
                  <li> <span class="bold">{{ summary.values.o }}</span >{{ summary.unit }} </li>
                  <li class="d-flex align-items-center">
                    <span>{{ summary.values.c }}</span >{{ summary.unit }}
                    <span :class="[summary.per.indexOf('-') === -1 ? 'up' : 'down']">{{ summary.per }}</span>
                  </li>
                </ul>
              </div>
            </swiper-slide>
          </swiper>
        </article>
        <article class="statistics-report">
          <div class="title d-flex justify-content-between align-items-center"> <h3>매체별 요약</h3> </div>
          <template v-if="m.summarysMedia.length > 0">
            <div class="m-table" v-for="(summary, index2) in m.summarysMedia" :key="summary.key + '-' + index2 + '-' + getUuidv4()" >
              <ul>
                <div class="m-table-title">
                  <div class="w-100">
                    <li class="font-weight-bold">
                      <template v-if="summary.key === 'TOTAL'" ><span>총합계</span></template >
                      <template v-else>
                        <img :src="summary.url" alt="아이콘" class="icon" />
                        <span v-if="summary.key === 'K'">{{ "모먼트" }}</span>
                        <span v-else-if="summary.key === 'Nda'">{{ "디스플레이" }}</span>
                        <span v-else>{{ "검색" }}</span>
                      </template>
                    </li>
                  </div>
                </div>
                <div class="m-table-content">
                  <div class="w-100 d-flex flex-wrap">
                    <template v-for="(k,i) in ['cst','im','clk','cv','cr','ctr','cpc','cpa','cvr','roas']">
                      <li :key="i+getUuidv4()" v-if="summarys[i].visible" class="col-4">
                        <label for="" class="">{{getKpiName(k)}}</label>
                        <div>{{priceToString(k, summary.value[k])}}</div>
                      </li>
                    </template>
                  </div>
                </div>
              </ul>
            </div>
          </template>
          <template v-else>
            <div class="m-table">
              <ul>
                <div class="m-table-title">데이터가 존재하지 않습니다.</div>
                <div class="m-talbe-content"></div>
              </ul>
            </div>
          </template>
        </article>
        <article>
          <div class="d-flex flex-column">
            <button type="button" class="btn pdf w-100" @click="clickPdf"> PDF 다운받기 </button>
          </div>
        </article>
      </section>
      <mbig-menu-2 ref="mBigMenu2" @closeBtn="$refs.mFooter.setFooter('home')" ></mbig-menu-2>
      <mdate-range-picker ref="mDateRangePicker" :pStart="start" :pEnd="end" :pCstart="cStart" :pCend="cEnd" @changedDate="handleChangedDateRange" @closeBtn="$refs.mFooter.setFooter('home')" > </mdate-range-picker>
      <mbalance ref="mBalance" :pBalance="balance" @closeBtn="$refs.mFooter.setFooter('home')" ></mbalance>
      <malarm ref="mFmenu" @closeBtn="$refs.mFooter.setFooter('home')"></malarm>
      <mfmenu ref="mFmenu" @logout="handleLogOut" @dbedit="$refs.mFooter.clickDbEdit('dashboard-edit')" @closeBtn="$refs.mFooter.setFooter('home')" ></mfmenu>
      <mdashboard-edit ref="mDashboardEdit" @closeBtn="$refs.mFooter.setFooter('home')" ></mdashboard-edit>
    </div>
    <log-out-modal ref="logOutModal" style="display: none"></log-out-modal>
    <add-summary-modal ref="addSummaryModal" :pSummarys="summarys" @selectedSummary="handleSelectedSummary" style="display: none" ></add-summary-modal>
    <expire-session-modal ref="expireSessionModal" style="display: none" ></expire-session-modal>
    <mask-modal ref="maskModal" style="display: none"></mask-modal>
    <!-- <pdf-dashboard ref="pdfDashboard" :pFromdate="start" :pTodate="end" :pCfromdate="cStart" :pCtodate="cEnd" :pSummarys="summarys" :pLegend="legend" style="display: none" @showMask="handleShowMask" @hideMask="handleHideMask"></pdf-dashboard> -->
    <dashboard-excel ref="dashboardExcel" style="display: none" @hideMask="handleHideMask"></dashboard-excel>
    <div class="hidden-print"><dashboard-pdf ref="dashboardPdf" :key="pdfKey"></dashboard-pdf></div>       
  </div>
</template>

<script>
import $ from "jquery";
import moment from "moment";
// import "swiper/dist/css/swiper.css";
import 'swiper/css';
// import { swiper, swiperSlide } from "vue-awesome-swiper";
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import {  clearBody,  addClassDashboard,  uuidv4,  priceToString, getUnit,  getType,  getKpiName, getMedia } from "@/assets/js/common.js";
import {  API_URL,  TEMP_KEY } from "@/configs/config.js";
import { store } from "@/store/store.js";
import { SHA256 } from "@/assets/js/sha256.js";
import message from "@/components/common/message.vue";
import dateRangePicker from "@/components/common/dateRangePicker.vue";
import addSummaryModal from "@/components/modal/addSummaryModal.vue";
import crossGraph from "@/components/graph/crossGraph.vue";
import pieGraph from "@/components/graph/pieGraph.vue";
import summarys from "@/components/dashboard2/summarys.vue";
import summarysMedia from "@/components/dashboard2/summarysMedia.vue";
import expireSessionModal from "@/components/modal/expireSessionModal.vue";
import SummarysMedia from "@/components/dashboard2/summarysMedia.vue";
import maskModal from "@/components/modal/maskModal.vue";
import bigMenu2 from "@/components/layout/bigMenu2.vue";
import balance from "@/components/dashboard2/balance.vue";
import logOutModal from "@/components/modal/logOutModal.vue";
import pdfDashboard from "@/components/pdf/pdfDashboard.vue";
import mheader from "@/components/layout/m/header.vue";
import mfooter from "@/components/layout/m/footer.vue";
import mbigMenu2 from "@/components/layout/m/bigMenu2.vue";
import mdateRangePicker from "@/components/common/m/dateRangePicker.vue";
import mbalance from "@/components/common/m/balance.vue";
import mfmenu from "@/components/common/m/fMenu.vue";
import malarm from "@/components/common/m/alarm.vue";
import mdashboardEdit from "@/components/common/m/dashboardEdit.vue";
import dashboardExcel from "@/components/dashboard2/dashboardExcel.vue";
import dashboardPdf from "@/components/dashboard2/dashboardPdf.vue";
export default {
  data() {
    return {
      start: store.state.dateStore.start,
      end: store.state.dateStore.end,
      cStart: store.state.dateStore.cStart,
      cEnd: store.state.dateStore.cEnd,
      summarys: [
        { key: "cst", text: "총광고비", visible: true },
        { key: "im", text: "총노출수", visible: true },
        { key: "clk", text: "총클릭수", visible: true },
        { key: "cv", text: "총전환수", visible: false },
        { key: "cr", text: "총전환매출", visible: false },
        { key: "ctr", text: "총클릭율", visible: true },
        { key: "cpc", text: "총클릭당비용", visible: true },
        { key: "cpa", text: "총전환당비용", visible: false },
        { key: "cvr", text: "총전환율", visible: false },
        { key: "roas", text: "총ROAS", visible: false },
      ],
      activeDayBtn: { day7: true, dayMon: false, dayWeek: false, dayP30: false, dayPMon: false, dayPW: false, },
      rendering: { summary: false, summarymedia: false, period: false, summarymediarate: false, },
      legend: [ { key: "im", text: "총노출수" }, { key: "clk", text: "총클릭수" }, ],
      m: { summarys: [], summarysMedia: [], },
      swiperOption: { index: 0, menu: [], slidesPerView: "auto", spaceBetween: 30, centeredSlides: false, loop: true, },
      balance: [],
      accountlog: [],
      pdfKey: 0,
    };
  },
  components: { bigMenu2, balance, logOutModal, dateRangePicker, addSummaryModal, crossGraph, pieGraph, summarys, summarysMedia, expireSessionModal, maskModal,
    SummarysMedia, pdfDashboard, Swiper, SwiperSlide, mheader, mfooter, mbigMenu2, mdateRangePicker, mbalance, mfmenu, malarm, mdashboardEdit, message, dashboardExcel,
    dashboardPdf
  },
  mounted() {
    $(".main").removeClass("m-h-100");
    this.$refs.cdateRangePicker.setDate({ start: this.cStart, end: this.cEnd, compare: true });
    this.clickSearchBtn();
    this.getAccountLog();
  },
  computed: { swiper() { return this.$refs.swiper.$swiper; }, },
  methods: {
    handleChangedBalance(data) {
      this.balance = [];
      this.balance = data.slice();
    },
    handleChangedCDateRange(data) {
      this.$refs.cdateRangePicker.setDate({ start: data.start, end: data.end, compare: true, });
      //this.handleChangedDate();
      this.clickSearchBtn();
    },    
    handleChangedDateRange(data) {
      this.$refs.dateRangePicker.setDate({ start: data.start, end: data.end, compare: false, });
      this.handleChangedDate();
      this.clickSearchBtn();
    },
    handleChangeSummarysMedia(data) {
      this.m.summarysMedia = [];
      this.m.summarysMedia = data.slice();
    },
    handleChangeSummarys(data) {
      this.m.summarys = [];
      this.m.summarys = data.slice();
    },
    handleSelectedSummary(summarys) {
      let vm = this;
      vm.summarys = summarys.slice();
      let date = vm.$refs.dateRangePicker.getDate();
      let cdate = vm.$refs.cdateRangePicker.getDate();

      vm.$refs.summarys.setSummary(vm.summarys, date.start, date.end, cdate.start, cdate.end);
      vm.$refs.summarysMedai.setSummaryMedia(date.start, date.end, vm.summarys);
      vm.$refs.crossGraph.setGraph(date.start, date.end, vm.legend);
      vm.$refs.addSummaryModal.hideModal();
    },    
    handleClickedSummary(summary) {
      let vm = this;
      let date = vm.$refs.dateRangePicker.getDate();

      vm.legend.push(summary);
      vm.legend.shift();
      vm.$refs.crossGraph.setGraph(date.start, date.end, vm.legend);
    },
    handleExpireSession() { this.$refs.expireSessionModal.showModal(); },
    handleChangedDate() {
      var pstart = "";
      var pend = "";
      var date = this.$refs.dateRangePicker.getDate();

      if (date.start !== null && date.end !== null) {
        var diff = moment(date.end).diff(moment(date.start), "days");
        pstart = moment(date.start).subtract(1 + Number(diff), "days").format("YYYY-MM-DD");
        pend = moment(date.start).subtract(1, "days").format("YYYY-MM-DD");
      }

      this.setCompareDate(pstart, pend);
    },
    handleShowMask() { this.$refs.maskModal.showModal(); },
    handleHideMask() { this.$refs.maskModal.hideModal(); },
    handleLogOut() { this.$refs.logOutModal.showModal(); },    
    clicSwiperBtn(i, event) {
      let vm = this;
      vm.swiperOption.index = i;
      vm.$refs.swiper.swiper.slideTo(i);
    },
    clickSearchBtn() {
      var vm = this;
      var date = this.$refs.dateRangePicker.getDate();
      var cdate = this.$refs.cdateRangePicker.getDate();

      vm.handleShowMask();
      vm.start = date.start;
      vm.end = date.end;
      vm.cStart = cdate.start;
      vm.cEnd = cdate.end;
      vm.$refs.crossGraph.setGraph(date.start, date.end, vm.legend);
      vm.$refs.summarys.setSummary(this.summarys, date.start, date.end, cdate.start, cdate.end);
      vm.$refs.summarysMedai.setSummaryMedia(date.start, date.end, this.summarys);
      vm.$refs.pieGraph.setGraph(date.start, date.end);
    },    
    clickAddSummary() { this.$refs.addSummaryModal.showModal(); },
    async clickPdf() {
      var date = this.$refs.dateRangePicker.getDate();
      var cdate = this.$refs.cdateRangePicker.getDate();

      this.handleShowMask();
      await this.$refs.dashboardPdf.initPDF({date: date, cdate: cdate}); // 자식 컴포넌트 렌더링 완료까지 기다림
      const blob = await this.$refs.dashboardPdf.generatePDF(); // 렌더링 완료 후 PDF 생성
      window.open(URL.createObjectURL(blob));
      this.pdfKey++;
      this.handleHideMask();
    },    
    clickAllowBtn() {
      let pillstab = document.querySelector(".pills-container-btn .pills-btn #pills-tab");
      let svg = document.querySelector(".pills-container-btn .allow svg");
      if (pillstab.classList.contains("flex-wrap")) {
        pillstab.classList.remove("flex-wrap");
        svg.style.transform = "rotate(180deg)";
      } else {
        pillstab.classList.add("flex-wrap");
        svg.style.transform = "rotate(0deg)";
      }
    },    
    clickExcel() {
      var vm = this;
      var date = vm.$refs.dateRangePicker.getDate();
      var diff = moment(date.end).diff(moment(date.start), "days");
      var comparefromdate = moment(date.start).subtract(1 + Number(diff), "days").format("YYYY-MM-DD");
      var comparetodate = moment(date.start).subtract(1, "days").format("YYYY-MM-DD");   

      vm.handleShowMask();
      vm.$refs.dashboardExcel.clickExcel({fromdate: date.start, todate: date.end, comparefromdate: comparefromdate, comparetodate: comparetodate, md: '', sort: ''});
    },      
    slideChangeTransitionStart() {
      let vm = this;
      vm.$nextTick(function () {
        let el = document.querySelector(".swiper-slide-active > div");
        if (el) { vm.swiperOption.index = Number(el.getAttribute("data-index")); }
      });
    },
    activeMain(flag) {
      this.$emit("mountedMain", true);
      this.$emit("mountedDasyboad", true);
    },
    changedDateRangePicker() {
      this.handleChangedDate();
      this.clickSearchBtn();
    },
    isRendering(page, flag) {
      var vm = this;
      // console.log(page, flag);
      vm.rendering[page] = flag;

      if (!vm.rendering.summary) return false;
      if (!vm.rendering.summarymedia) return false;
      if (!vm.rendering.period) return false;
      if (!vm.rendering.summarymediarate) return false;

      vm.rendering.summary = false;
      vm.rendering.summarymedia = false;
      vm.rendering.period = false;
      vm.rendering.summarymediarate = false;
      vm.handleHideMask();
    },
    priceToString(key, salse) {
      if (salse === undefined) return "";
      var unit = "";

      if (key === "cst" || key === "cstd" || key === "cpc" || key === "cr") { unit = "원"; } 
      else if (key === "ctr" || key === "cvr" || key === "roas") { unit = "%"; } 
      else { unit = "회"; }
      return priceToString(salse) + unit;
    },
    getKpiName(k) {return getKpiName(k);},
    getType(type) { return getType(type); },
    getUnit(k) { return getUnit(k); },
    getAccountLog() {
      var vm = this;
      $.ajax({
        type: "get", //요청 메소드 방식
        url: API_URL + "/app/dashboard/accountlog",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          session: store.state.userStore.session,
        },
        beforeSend: function (data) {},
        success: function (data) {
          vm.accountlog = data.data.slice();
        },
        error: function (a, b, c) {},
        complete: function (a, b, c) {},
      });      
    },
    getMedia(media) { return getMedia(media);},
    getUuidv4() { return uuidv4(); },
    setDate() { this.handleChangedDate(null); },
    setCompareDate(start, end) { this.$refs.cdateRangePicker.setDate({ start: start, end: end, compare: true, }); },    
  },
};
</script>

<style scoped></style>
