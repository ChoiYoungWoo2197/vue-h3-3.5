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
          <div class="title"><h3>캠페인 정보</h3></div>
          <form onkeydown="return event.key == 'Enter' ? false : true">
            <div class="form-group row mb-2">
              <div class="col-3 row align-items-center">
                <label for="resisterId" class="form-label">이름</label>
              </div>
              <div class="col- row align-items-center">
                <span v-if="campaign.name"> {{ campaign.name }}</span>
              </div>
            </div>
            <div class="form-group row">
              <div class="col-3 row align-items-center">
                <label for="resisterId" class="form-label">유형</label>
              </div>
              <div class="col- row align-items-center">
                <span v-if="campaign.type">{{ getType }}</span>
              </div>
            </div>
          </form>
        </article>
        <article class="statistics-report">
          <div class="title d-flex justify-content-between align-items-center">
            <h3>광고그룹</h3>
            <div class="indicator d-flex align-items-center dropdown">
              <button
                type="button"
                class="btn shadow-none p-0"
                data-toggle="dropdown"
                aria-expanded="false"
              >
                <i class="bi bi-gear m-0"></i>
              </button>
              <div class="dropdown-menu dropdown-menu-right">
                <form>
                  <div class="form-check w-100 pl-0">
                    <select
                      class="form-control form-control-sm"
                      v-model="main.sort"
                      @change="changeSort"
                    >
                      <option value="ima">노출수순(올림)</option>
                      <option value="imd">노출수순(내림)</option>
                      <option value="clka">클릭수순(올림)</option>
                      <option value="clkd">클릭수순(내림)</option>
                      <option value="ctra">클릭률순(올림)</option>
                      <option value="ctrd">클릭률순(내림)</option>
                      <option value="cpca">CPC순(올림)</option>
                      <option value="cpcd">CPC순(내림)</option>
                      <option value="csta">광고비순(올림)</option>
                      <option value="cstd">광고비순(내림)</option>
                      <option value="cva">전환수순(올림)</option>
                      <option value="cvd">전환수순(내림)</option>
                      <option value="cvra">전환률순(올림)</option>
                      <option value="cvrd">전환률순(내림)</option>
                      <option value="cra">전환매출순(올림)</option>
                      <option value="crd">전환매출순(내림)</option>
                      <option value="cpaa">CPA순(올림)</option>
                      <option value="cpcd">CPA순(내림)</option>
                      <option value="roasa">ROAS순(올림)</option>
                      <option value="roasd">ROAS순(내림)</option>
                    </select>
                  </div>

                  <div class="form-border"></div>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      id="indicator1"
                      value="cst"
                      :checked="kpi.cst.check"
                      :disabled="kpi.cst.visible === false"
                      @change="clickCheckpi($event, 'cst')"
                    />
                    <label class="form-check-label" for="indicator1"
                      ><p class="d-flex align-items-center ml-1">광고비</p></label
                    >
                  </div>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      id="indicator2"
                      value="im"
                      :checked="kpi.im.check"
                      :disabled="kpi.im.visible === false"
                      @change="clickCheckpi($event, 'im')"
                    />
                    <label class="form-check-label" for="indicator2"
                      ><p class="d-flex align-items-center ml-1">노출수</p></label
                    >
                  </div>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      id="indicator3"
                      value="clk"
                      :checked="kpi.clk.check"
                      :disabled="kpi.clk.visible === false"
                      @change="clickCheckpi($event, 'clk')"
                    />
                    <label class="form-check-label" for="indicator3"
                      ><p class="d-flex align-items-center ml-1">클릭수</p></label
                    >
                  </div>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      id="indicator4"
                      value="cv"
                      :checked="kpi.cv.check"
                      :disabled="kpi.cv.visible === false"
                      @change="clickCheckpi($event, 'cv')"
                    />
                    <label class="form-check-label" for="indicator4"
                      ><p class="d-flex align-items-center ml-1">전환수</p></label
                    >
                  </div>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      id="indicator5"
                      value="cvr"
                      :checked="kpi.cvr.check"
                      :disabled="kpi.cvr.visible === false"
                      @change="clickCheckpi($event, 'cvr')"
                    />
                    <label class="form-check-label" for="indicator5"
                      ><p class="d-flex align-items-center ml-1">전환율</p></label
                    >
                  </div>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      id="indicator6"
                      value="cr"
                      :checked="kpi.cr.check"
                      :disabled="kpi.cr.visible === false"
                      @change="clickCheckpi($event, 'cr')"
                    />
                    <label class="form-check-label" for="indicator6"
                      ><p class="d-flex align-items-center ml-1">전환매출</p></label
                    >
                  </div>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      id="indicator7"
                      value="ctr"
                      :checked="kpi.ctr.check"
                      :disabled="kpi.ctr.visible === false"
                      @change="clickCheckpi($event, 'ctr')"
                    />
                    <label class="form-check-label" for="indicator7"
                      ><p class="d-flex align-items-center ml-1">클릭율</p></label
                    >
                  </div>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      id="indicator8"
                      value="cpa"
                      :checked="kpi.cpa.check"
                      :disabled="kpi.cpa.visible === false"
                      @change="clickCheckpi($event, 'cpa')"
                    />
                    <label class="form-check-label" for="indicator8"
                      ><p class="d-flex align-items-center ml-1">전환당비용</p></label
                    >
                  </div>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      id="indicator9"
                      value="cpc"
                      :checked="kpi.cpc.check"
                      :disabled="kpi.cpc.visible === false"
                      @change="clickCheckpi($event, 'cpc')"
                    />
                    <label class="form-check-label" for="indicator9"
                      ><p class="d-flex align-items-center ml-1">클릭당비용</p></label
                    >
                  </div>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      id="indicator10"
                      value="roas"
                      :checked="kpi.roas.check"
                      :disabled="kpi.roas.visible === false"
                      @change="clickCheckpi($event, 'roas')"
                    />
                    <label class="form-check-label" for="indicator10"
                      ><p class="d-flex align-items-center ml-1">ROAS</p></label
                    >
                  </div>
                  <button
                    type="button"
                    class="btn indicator-close"
                    data-toggle="dropdown"
                    aria-expanded="false"
                  >
                    닫기
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div
            class="m-table"
            v-for="data in getDatasForMain"
            :key="data.adgroup_id + '-' + getUuidv4()"
          >
            <ul>
              <div class="m-table-title">
                <div class="w-100">
                  <li class="font-weight-bold">{{ data.adgroup_name }}</li>
                </div>
              </div>
              <div class="m-table-content">
                <div class="w-100 d-flex flex-wrap">
                  <li v-if="kpi.im.check" class="col-4">
                    <label for="" class="">노출수</label>
                    <div>{{ priceToString(data.im) + "회" }}</div>
                    <!-- <span style="margin-left:2px; margin-right:9px; color: #757575;">{{ priceToString(data.im) + '회'}}</span> -->
                  </li>
                  <li v-if="kpi.clk.check" class="col-4">
                    <label for="" class="">클릭수</label>
                    <div>{{ priceToString(data.clk) + "회" }}</div>
                  </li>
                  <li v-if="kpi.ctr.check" class="col-4">
                    <label for="" class="" style="">클릭률</label>
                    <div>{{ priceToString(data.ctr) + "%" }}</div>
                  </li>
                  <li v-if="kpi.cpc.check" class="col-4">
                    <label for="" class="">CPC</label>
                    <div>{{ priceToString(data.cpc) + "원" }}</div>
                  </li>
                  <li v-if="kpi.cst.check" class="col-4">
                    <label for="" class="">광고비</label>
                    <div>{{ priceToString(data.cst) + "원" }}</div>
                  </li>
                  <li v-if="kpi.cv.check" class="col-4">
                    <label for="" class="">전환수</label>
                    <div>{{ priceToString(data.cv) + "회" }}</div>
                  </li>
                  <li v-if="kpi.cvr.check" class="col-4">
                    <label for="" class="">전환률</label>
                    <div>{{ priceToString(data.cvr) + "%" }}</div>
                  </li>
                  <li v-if="kpi.cr.check" class="col-4">
                    <label for="" class="">전환매출</label>
                    <div>{{ priceToString(data.cr) + "원" }}</div>
                  </li>
                  <li v-if="kpi.cpa.check" class="col-4">
                    <label for="" class="">CPA</label>
                    <div>{{ priceToString(data.cpa) + "원" }}</div>
                  </li>
                  <li v-if="kpi.roas.check" class="col-4">
                    <label for="" class="">ROAS</label>
                    <div>{{ priceToString(data.roas) + "%" }}</div>
                  </li>
                </div>
              </div>
            </ul>
          </div>
          <ul class="pagination d-flex justify-content-center align-items-center mb-30">
            <li class="page-item">
              <a
                class="page-link shadow-none"
                href="javascript:;"
                aria-label="Previous"
                @click="clickPreviousFirstPageBtnForMain"
              >
                <span aria-hidden="true"
                  ><i class="bi bi-chevron-double-left m-0"></i></span
              ></a>
            </li>
            <li class="page-item" :class="{ disabled: isFirstPageGroupForMain }">
              <a
                class="page-link shadow-none"
                href="javascript:;"
                aria-label="Previous"
                @click="clickPreviousPageBtnForMain"
              >
                <span aria-hidden="true"><i class="bi bi-chevron-left"></i></span>
              </a>
            </li>
            <li
              class="page-item"
              :class="{ active: page - 1 === main.start }"
              v-for="page in main.pages"
              :key="page"
            >
              <a
                class="page-link shadow-none"
                href="javascript:;"
                v-text="page"
                @click="clickPageBtnForMain(page - 1)"
              ></a>
            </li>
            <li class="page-item" :class="{ disabled: isLastPageGroupForMain }">
              <a
                class="page-link shadow-none"
                href="javascript:;"
                aria-label="Next"
                @click="clickNextPageBtnForMain"
              >
                <span aria-hidden="true"><i class="bi bi-chevron-right"></i></span>
              </a>
            </li>
            <li class="page-item">
              <a
                class="page-link shadow-none"
                href="javascript:;"
                aria-label="Next"
                @click="clickNextEndPageBtnForMain"
              >
                <span><i class="bi bi-chevron-double-right m-0"></i></span
              ></a>
            </li>
          </ul>
        </article>
        <article>
          <div class="d-flex flex-column">
            <button class="btn excel w-100" @click="clickExcel">엑셀 다운받기</button>
          </div>
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
// import xlsx from "xlsx";
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

export default {
  data() {
    return {
      start: moment().subtract(7, "days").format("YYYY-MM-DD"),
      end: moment().subtract(1, "days").format("YYYY-MM-DD"),
      uniqueId: null,
      campaign: { id: null, name: null, type: null },
      campaignId: 0,
      media: null,
      main: {
        field: "",
        query: null,
        responseData: null,
        data: null,
        start: 0, //현재 페이지
        display: 10, //게시글의 수
        displayPageNum: isMobile() === true ? 5 : 10, // 페이지 번호의 수
        isTotalCount: "-1",
        sort: "imd",
        pages: [],
        isFirst: false,
        isEnd: false,
      },
      kpi: {
        clk: { visible: false, check: true, text: "클릭수" }, //클릭수
        im: { visible: false, check: true, text: "노출수" }, //노출수
        cst: { visible: true, check: true, text: "광고비" }, //광고비
        cv: { visible: true, check: false, text: "전환수" }, //전환수
        cr: { visible: true, check: false, text: "전환매출" }, //전환매출
        ctr: { visible: false, check: true, text: "클릭률" }, //클릭률
        cpc: { visible: false, check: true, text: "클릭당비용" }, //클릭 당 비용
        cpa: { visible: true, check: false, text: "전환당비용" }, //전환 당 비용
        cvr: { visible: true, check: false, text: "전환율" }, //전환율
        roas: { visible: true, check: false, text: "ROAS" }, //ROAS
      },
      headerSet: {
        common: {
          header: [
            { key: "clk", name: "클릭수" },
            { key: "im", name: "노출수" },
            { key: "cst", name: "광고비" },
            { key: "cv", name: "전환수" },
            { key: "cr", name: "전환매출" },
            { key: "ctr", name: "클릭률" },
            { key: "cpc", name: "클릭당비용" },
            { key: "cpa", name: "전환당비용" },
            { key: "cvr", name: "전환율" },
            { key: "roas", name: "ROAS" },
          ],
        },
        naver: {
          header: [
            { key: "campaign_name", name: "캠페인" },
            { key: "adgroup_name", name: "그룹" },
          ],
        },
        kakaosa: {
          header: [
            { key: "campaign_name", name: "캠페인" },
            { key: "adgroup_name", name: "그룹" },
          ],
        },
        kakaomo: {
          header: [
            { key: "campaign_name", name: "캠페인" },
            { key: "adgroup_name", name: "그룹" },
          ],
        },
        naverda: {
          header: [
            { key: "campaign_name", name: "캠페인" },
            { key: "adgroup_name", name: "그룹" },
          ],
        },
      },
      balance: [],
      showMask: false,
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
  },
  mounted() {
    $(".main").removeClass("m-h-100");
    this.campaign.id = this.$route.query.id;
    this.campaign.name = this.$route.query.name;
    this.campaign.type = this.$route.query.type;
    this.media = this.$route.query.media;
    this.start = this.$route.query.start;
    this.end = this.$route.query.end;
    this.clickSearchBtn();
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
      vm.clickSearchBtn();
    },
    priceToString(salse) {
      if (salse === undefined) return "";

      return priceToString(salse);
    },
    clickSearchBtn() {
      this.main.start = 0;
      this.main.isTotalCount = "-1";

      if (this.adPid !== 0) {
        // this.getTopKpi();
        this.getReport();
      }
    },
    clickBtn(event, type) {
      var vm = this;
      var keys = Object.keys(vm.activeBtn);
      for (let i = 0; i < keys.length; i++) {
        keys[i].indexOf("kpi") > -1
          ? (vm.activeBtn["kpi"] = "")
          : (vm.activeBtn[keys[i]] = false);
        // vm.activeBtn[keys[i]] = false;
      }

      vm.activeBtn[type] = true;
      vm.activeBtn["kpi"] = type;
      vm.getActiveTopAd();
    },
    getReport() {
      var vm = this;
      var md = "";
      var date = { start: vm.start, end: vm.end };

      switch (vm.media) {
        case "naver":
          md = "N";
          break;
        case "kakaosa":
          md = "D";
          break;
        case "kakaomo":
          md = "K";
          break;
        case "naverda":
          md = "Nda";
          break;
        default:
          md = "N";
      }

      // console.log(vm.media);

      $.ajax({
        type: "get", //요청 메소드 방식
        url: API_URL + "/app/analysis/adgroupreport",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          fromdate: date.start,
          todate: date.end,
          start: vm.main.start,
          sort: vm.main.sort,
          display: vm.main.display,
          totalcount: vm.main.isTotalCount,
          md: md,
          campaignid: vm.campaign.id,
          session: store.state.userStore.session,
        },
        beforeSend: function (data) {
          // vm.showMask = true;
          vm.handleShowMask();
          // vm.showMaskPannelForReport = true;
        },
        success: function (data) {
          if (data.result === "success") {
            vm.main.data = [];
            vm.main.responseData = null;
            vm.main.responseData = data;

            vm.main.data = vm.getTotal(data.data.groups);
            vm.getStartAndEndPageForMain();
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
          // vm.showMask = false;
          vm.handleHideMask();
          // vm.showMaskPannelForReport = false;
        },
      });
    },
    getStartAndEndPageForMain() {
      // this.main.isTotalCount !== '0' ? this.main.responseData.totalcount = this.main.isTotalCount : this.main.isTotalCount = this.main.responseData.totalcount;
      this.main.isTotalCount = this.main.responseData.totalcount;

      this.main.pages = [];
      var endPage =
        Math.ceil((this.main.start + 1) / this.main.displayPageNum) *
        this.main.displayPageNum;
      var startPage = endPage - this.main.displayPageNum + 1;
      var tempEndPage = Math.ceil(this.main.responseData.totalcount / this.main.display);
      if (endPage > tempEndPage) {
        endPage = tempEndPage;
      }

      this.main.isFirst = this.main.start + 1 === 1 ? true : false;
      this.main.isEnd =
        Math.ceil(this.main.responseData.totalcount / this.main.display) ===
        this.main.start + 1
          ? true
          : false;

      for (var i = startPage; i <= endPage; i++) {
        this.main.pages.push(i);
      }
    },
    clickPreviousFirstPageBtnForMain() {
      this.main.start = 0;
      this.getReport();
    },
    clickPreviousPageBtnForMain() {
      this.main.start = this.main.start === 0 ? 0 : this.main.start - 1;
      this.getReport();
    },
    clickNextEndPageBtnForMain() {
      let tempEndPage = Math.ceil(this.main.responseData.totalcount / this.main.display);
      this.main.start = tempEndPage - 1;
      this.getReport();
    },
    clickNextPageBtnForMain() {
      let tempEndPage = Math.ceil(this.main.responseData.totalcount / this.main.display);
      this.main.start = this.main.start > tempEndPage ? tempEndPage : this.main.start + 1;
      this.getReport();
    },
    clickPageBtnForMain(page) {
      this.main.start = page;
      this.getReport();
    },
    clickSort(sort) {
      this.main.sort = sort;
      this.main.start = 0;
      this.getReport();
    },
    clickCheckpi(event, type) {
      var vm = this;
      var $active = $(event.target);
      var keys = Object.keys(vm.kpi);

      for (let i = 0; i < keys.length; i++) {
        if (keys[i].indexOf(type) > -1) {
          vm.kpi[keys[i]].check = $active.is(":checked");
          break;
        }
      }
    },
    getTotal(targets) {
      var vm = this;
      var data = [];
      targets.forEach(function (target) {
        data.push({
          campaign_id: target.campaign_id,
          campaign_name: target.campaign_name,
          adgroup_id: target.adgroup_id,
          adgroup_name: target.adgroup_name,
          clk: target.clk,
          cpa: target.cpa,
          cpc: target.cpc,
          cr: target.cr,
          cst: target.cst,
          ctr: target.ctr,
          cv: target.cv,
          cvr: target.cvr,
          im: target.im,
          roas: target.roas,
        });
      });

      return data;
    },
    clickExcel() {
      var vm = this;
      var md = "";
      var date = { start: vm.start, end: vm.end };
      switch (vm.media) {
        case "naver":
          md = "N";
          break;
        case "kakaosa":
          md = "D";
          break;
        case "kakaomo":
          md = "K";
          break;
        case "naverda":
          md = "Nda";
          break;
        default:
          md = "N";
      }

      $.ajax({
        type: "get", //요청 메소드 방식
        url: API_URL + "/app/analysis/adgroupreport",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          fromdate: date.start,
          todate: date.end,
          start: 0,
          sort: vm.main.sort,
          display: vm.main.isTotalCount,
          totalcount: vm.main.isTotalCount,
          md: md,
          campaignid: vm.campaign.id,
          session: store.state.userStore.session,
        },
        beforeSend: function (data) {
          // vm.showMask = true;
          vm.handleHideMask();
          // vm.showMaskPannelForReport = true;
        },
        success: function (data) {
          if (data.result === "success") {
            var options = {
              common: vm.headerSet.common,
              header: vm.headerSet[vm.media].header,
              headProps: "header",
            };
            vm.exportExcel(data.data.groups, options);
          } else {
            if (data.status === "0001") {
              // vm.handleExpireSession();
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
          vm.showMask = false;
          vm.handleHideMask();
          // vm.showMaskPannelForReport = false;
        },
      });
    },
    exportExcel(data, options) {
      var vm = this;
      var headProps = [];
      var media = vm.media;

      if (Array.isArray(options.headProps)) {
        headProps = options.headProps;
      } else if (options.headProps === "header") {
        for (var h of vm.headerSet[media].header) {
          headProps.push(h.key);
        }
        for (var c of vm.headerSet.common.header) {
          headProps.push(c.key);
        }
      } else {
        headProps = Object.keys(data[0]);
      }

      this.visibleHeadProps = headProps;
      this.instance = document.createElement("table");

      // Header 세팅
      var header = [];
      if (!Array.isArray(vm.headerSet[media].header[0])) {
        var value = vm.headerSet[media].header.slice();
        header.push(value);
        for (var c of vm.headerSet.common.header) {
          header[0].push(c);
        }
      } else {
        header = vm.headerSet[media].header;
      }

      var thead = document.createElement("thead");
      for (var row of header) {
        var tr = document.createElement("tr");
        for (var h of row) {
          var rowspan = h.rowspan || "1";
          var colspan = h.colspan || "1";
          var th = document.createElement("th");
          th.setAttribute("rowspan", rowspan);
          th.setAttribute("colspan", colspan);
          th.innerText = h.name;
          tr.appendChild(th);
        }
        thead.appendChild(tr);
      }
      this.instance.appendChild(thead);

      // Body 세팅
      var tbody = document.createElement("tbody");

      var excel = [];
      data.forEach(function (data, index) {
        var value = Object.assign({}, data);
        excel.push(value);
      });
      for (var row of excel) {
        var tr = document.createElement("tr");
        for (var cellkey of this.visibleHeadProps) {
          var td = document.createElement("td");
          td.innerText = row[cellkey];
          tr.appendChild(td);
        }
        tbody.appendChild(tr);
      }
      this.instance.appendChild(tbody);

      // instance에 만들어진 table을 엑셀파일로 저장
      var config = { raw: true, type: "string" };
      var ws = xlsx.utils.table_to_sheet(this.instance, config);
      var wb = xlsx.utils.book_new();

      xlsx.utils.book_append_sheet(wb, ws, getMedia(media));
      const wbout = xlsx.write(wb, { bookType: "xlsx", type: "array" });
      const url = window.URL.createObjectURL(
        new Blob([wbout], { type: "application/octet-stream" })
      );
      const a = document.createElement("a");
      a.href = url;
      a.download = moment().format("LLLL") + "-" + "그룹분석" + ".xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
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
    changeSort() {
      this.clickSearchBtn();
    },
  },
};
</script>

<style scoped></style>
