<template>
  <div
    class="modal fade keyword-modal show"
    :id="getUniqueId"
    data-backdrop="static"
    data-keyboard="false"
    tabindex="-1"
    aria-modal="true"
    role="dialog"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-body">
          <div class="title d-flex justify-content-between align-items-center">
            <h2 class="d-flex justify-content-center">
              <template v-if="isAdPid">
                <span class="badge">상품ID</span>{{ adPid }}
              </template>
              <template v-else> <span class="badge">소재ID</span>{{ adId }} </template>
            </h2>
            <div class="search d-flex">
              <date-range-picker
                ref="dateRangePicker"
                class="form-control"
                :pStart="start"
                :pEnd="end"
                :pDisabled="false"
                @changedDate="clickSearchBtn"
              >
              </date-range-picker>
              <button
                v-if="!showMask"
                type="submit"
                class="btn submit"
                @click.prevent="clickSearchBtn"
              >
                조회하기
              </button>
              <button v-if="showMask" type="submit" class="btn submit" disabled>
                <span
                  class="spinner-grow spinner-grow-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                로딩중...
              </button>
            </div>
          </div>
          <article>
            <div class="title d-flex justify-content-between align-items-center">
              <h3>키워드 성과 리포트</h3>
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
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        id="sadIndicator1"
                        value="cst"
                        :checked="kpi.cst.check"
                        :disabled="kpi.cst.visible === false"
                        @change="clickCheckpi($event, 'cst')"
                      />
                      <label class="form-check-label" for="sadIndicator1"
                        ><p class="d-flex align-items-center">광고비</p></label
                      >
                    </div>
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        id="sadIndicator2"
                        value="im"
                        :checked="kpi.im.check"
                        :disabled="kpi.im.visible === false"
                        @change="clickCheckpi($event, 'im')"
                      />
                      <label class="form-check-label" for="sadIndicator2"
                        ><p class="d-flex align-items-center">노출수</p></label
                      >
                    </div>
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        id="sadIndicator3"
                        value="clk"
                        :checked="kpi.clk.check"
                        :disabled="kpi.clk.visible === false"
                        @change="clickCheckpi($event, 'clk')"
                      />
                      <label class="form-check-label" for="sadIndicator3"
                        ><p class="d-flex align-items-center">클릭수</p></label
                      >
                    </div>
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        id="sadIndicator4"
                        value="cv"
                        :checked="kpi.cv.check"
                        :disabled="kpi.cv.visible === false"
                        @change="clickCheckpi($event, 'cv')"
                      />
                      <label class="form-check-label" for="sadIndicator4"
                        ><p class="d-flex align-items-center">전환수</p></label
                      >
                    </div>
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        id="sadIndicator5"
                        value="cvr"
                        :checked="kpi.cvr.check"
                        :disabled="kpi.cvr.visible === false"
                        @change="clickCheckpi($event, 'cvr')"
                      />
                      <label class="form-check-label" for="sadIndicator5"
                        ><p class="d-flex align-items-center">전환율</p></label
                      >
                    </div>
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        id="sadIndicator6"
                        value="cr"
                        :checked="kpi.cr.check"
                        :disabled="kpi.cr.visible === false"
                        @change="clickCheckpi($event, 'cr')"
                      />
                      <label class="form-check-label" for="sadIndicator6"
                        ><p class="d-flex align-items-center">전환매출</p></label
                      >
                    </div>
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        id="sadIndicator7"
                        value="ctr"
                        :checked="kpi.ctr.check"
                        :disabled="kpi.ctr.visible === false"
                        @change="clickCheckpi($event, 'ctr')"
                      />
                      <label class="form-check-label" for="sadIndicator7"
                        ><p class="d-flex align-items-center">클릭율</p></label
                      >
                    </div>
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        id="sadIndicator8"
                        value="cpa"
                        :checked="kpi.cpa.check"
                        :disabled="kpi.cpa.visible === false"
                        @change="clickCheckpi($event, 'cpa')"
                      />
                      <label class="form-check-label" for="sadIndicator8"
                        ><p class="d-flex align-items-center">전환당비용</p></label
                      >
                    </div>
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        id="sadIndicator9"
                        value="cpc"
                        :checked="kpi.cpc.check"
                        :disabled="kpi.cpc.visible === false"
                        @change="clickCheckpi($event, 'cpc')"
                      />
                      <label class="form-check-label" for="sadIndicator9"
                        ><p class="d-flex align-items-center">클릭당비용</p></label
                      >
                    </div>
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        id="sadIndicator10"
                        value="roas"
                        :checked="kpi.roas.check"
                        :disabled="kpi.roas.visible === false"
                        @change="clickCheckpi($event, 'roas')"
                      />
                      <label class="form-check-label" for="sadIndicator10"
                        ><p class="d-flex align-items-center">ROAS</p></label
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
            <table class="report nshop">
              <thead>
                <tr>
                  <td class="text-left" width="30%">키워드</td>
                  <td class="text-right" v-if="kpi.im.check">
                    노출수
                    <template v-if="main.sort === 'ima' || main.sort === 'imd'">
                      <button
                        v-if="main.sort === 'ima'"
                        class="active text-yellow"
                        @click="clickSort('imd')"
                      >
                        <i class="bi bi-caret-up-fill"></i>
                      </button>
                      <button
                        v-if="main.sort === 'imd'"
                        class="active text-yellow"
                        @click="clickSort('ima')"
                      >
                        <i class="bi bi-caret-down-fill"></i>
                      </button>
                    </template>
                    <template v-else>
                      <button class="active" @click="clickSort('imd')">
                        <i class="bi bi-caret-down-fill"></i>
                      </button>
                    </template>
                  </td>
                  <td class="text-right" v-if="kpi.clk.check">
                    클릭수
                    <template v-if="main.sort === 'clka' || main.sort === 'clkd'">
                      <button
                        v-if="main.sort === 'clka'"
                        class="active text-yellow"
                        @click="clickSort('clkd')"
                      >
                        <i class="bi bi-caret-up-fill"></i>
                      </button>
                      <button
                        v-if="main.sort === 'clkd'"
                        class="active text-yellow"
                        @click="clickSort('clka')"
                      >
                        <i class="bi bi-caret-down-fill"></i>
                      </button>
                    </template>
                    <template v-else>
                      <button class="active" @click="clickSort('clkd')">
                        <i class="bi bi-caret-down-fill"></i>
                      </button>
                    </template>
                  </td>
                  <td class="text-right" v-if="kpi.ctr.check">
                    클릭율
                    <template v-if="main.sort === 'ctra' || main.sort === 'ctrd'">
                      <button
                        v-if="main.sort === 'ctra'"
                        class="active text-yellow"
                        @click="clickSort('ctrd')"
                      >
                        <i class="bi bi-caret-up-fill"></i>
                      </button>
                      <button
                        v-if="main.sort === 'ctrd'"
                        class="active text-yellow"
                        @click="clickSort('ctra')"
                      >
                        <i class="bi bi-caret-down-fill"></i>
                      </button>
                    </template>
                    <template v-else>
                      <button class="active" @click="clickSort('ctrd')">
                        <i class="bi bi-caret-down-fill"></i>
                      </button>
                    </template>
                  </td>
                  <td class="text-right" v-if="kpi.cpc.check">
                    클릭당비용
                    <template v-if="main.sort === 'cpca' || main.sort === 'cpcd'">
                      <button
                        v-if="main.sort === 'cpca'"
                        class="active text-yellow"
                        @click="clickSort('cpcd')"
                      >
                        <i class="bi bi-caret-up-fill"></i>
                      </button>
                      <button
                        v-if="main.sort === 'cpcd'"
                        class="active text-yellow"
                        @click="clickSort('cpca')"
                      >
                        <i class="bi bi-caret-down-fill"></i>
                      </button>
                    </template>
                    <template v-else>
                      <button class="active" @click="clickSort('cpcd')">
                        <i class="bi bi-caret-down-fill"></i>
                      </button>
                    </template>
                  </td>
                  <td class="text-right" v-if="kpi.cst.check">
                    광고비
                    <template v-if="main.sort === 'csta' || main.sort === 'cstd'">
                      <button
                        v-if="main.sort === 'csta'"
                        class="active text-yellow"
                        @click="clickSort('cstd')"
                      >
                        <i class="bi bi-caret-up-fill"></i>
                      </button>
                      <button
                        v-if="main.sort === 'cstd'"
                        class="active text-yellow"
                        @click="clickSort('csta')"
                      >
                        <i class="bi bi-caret-down-fill"></i>
                      </button>
                    </template>
                    <template v-else>
                      <button class="active" @click="clickSort('cstd')">
                        <i class="bi bi-caret-down-fill"></i>
                      </button>
                    </template>
                  </td>
                  <td class="text-right" v-if="kpi.cv.check">
                    전환수
                    <template v-if="main.sort === 'cva' || main.sort === 'cvd'">
                      <button
                        v-if="main.sort === 'cva'"
                        class="active text-yellow"
                        @click="clickSort('cvd')"
                      >
                        <i class="bi bi-caret-up-fill"></i>
                      </button>
                      <button
                        v-if="main.sort === 'cvd'"
                        class="active text-yellow"
                        @click="clickSort('cva')"
                      >
                        <i class="bi bi-caret-down-fill"></i>
                      </button>
                    </template>
                    <template v-else>
                      <button class="active" @click="clickSort('cvd')">
                        <i class="bi bi-caret-down-fill"></i>
                      </button>
                    </template>
                  </td>
                  <td class="text-right" v-if="kpi.cvr.check">
                    전환율
                    <template v-if="main.sort === 'cvra' || main.sort === 'cvrd'">
                      <button
                        v-if="main.sort === 'cvra'"
                        class="active text-yellow"
                        @click="clickSort('cvrd')"
                      >
                        <i class="bi bi-caret-up-fill"></i>
                      </button>
                      <button
                        v-if="main.sort === 'cvrd'"
                        class="active text-yellow"
                        @click="clickSort('cvra')"
                      >
                        <i class="bi bi-caret-down-fill"></i>
                      </button>
                    </template>
                    <template v-else>
                      <button class="active" @click="clickSort('cvrd')">
                        <i class="bi bi-caret-down-fill"></i>
                      </button>
                    </template>
                  </td>
                  <td class="text-right" v-if="kpi.cr.check">
                    전환매출
                    <template v-if="main.sort === 'cra' || main.sort === 'crd'">
                      <button
                        v-if="main.sort === 'cra'"
                        class="active text-yellow"
                        @click="clickSort('crd')"
                      >
                        <i class="bi bi-caret-up-fill"></i>
                      </button>
                      <button
                        v-if="main.sort === 'crd'"
                        class="active text-yellow"
                        @click="clickSort('cra')"
                      >
                        <i class="bi bi-caret-down-fill"></i>
                      </button>
                    </template>
                    <template v-else>
                      <button class="active" @click="clickSort('crd')">
                        <i class="bi bi-caret-down-fill"></i>
                      </button>
                    </template>
                  </td>
                  <td class="text-right" v-if="kpi.cpa.check">
                    전환당비용
                    <template v-if="main.sort === 'cpaa' || main.sort === 'cpad'">
                      <button
                        v-if="main.sort === 'cpaa'"
                        class="active text-yellow"
                        @click="clickSort('cpad')"
                      >
                        <i class="bi bi-caret-up-fill"></i>
                      </button>
                      <button
                        v-if="main.sort === 'cpad'"
                        class="active text-yellow"
                        @click="clickSort('cpaa')"
                      >
                        <i class="bi bi-caret-down-fill"></i>
                      </button>
                    </template>
                    <template v-else>
                      <button class="active" @click="clickSort('cpad')">
                        <i class="bi bi-caret-down-fill"></i>
                      </button>
                    </template>
                  </td>
                  <td class="text-right" v-if="kpi.roas.check">
                    ROAS
                    <template v-if="main.sort === 'roasa' || main.sort === 'roasd'">
                      <button
                        v-if="main.sort === 'roasa'"
                        class="active text-yellow"
                        @click="clickSort('roasd')"
                      >
                        <i class="bi bi-caret-up-fill"></i>
                      </button>
                      <button
                        v-if="main.sort === 'roasd'"
                        class="active text-yellow"
                        @click="clickSort('roasa')"
                      >
                        <i class="bi bi-caret-down-fill"></i>
                      </button>
                    </template>
                    <template v-else>
                      <button class="active" @click="clickSort('roasd')">
                        <i class="bi bi-caret-down-fill"></i>
                      </button>
                    </template>
                  </td>
                </tr>
              </thead>
              <tbody>
                <template v-if="getDatasForMain === null || getDatasForMain.length === 0">
                  <tr>
                    <td colspan="7" class="text-center">데이터가 존재하지 않습니다.</td>
                  </tr>
                </template>
                <template v-else>
                  <tr v-for="data in getDatasForMain" :key="data.ad_pid">
                    <td class="text-left">{{ data.skeyword }}</td>
                    <td
                      class="text-right"
                      v-if="kpi.im.check"
                      v-text="priceToString(data.im) + '회'"
                    ></td>
                    <td
                      class="text-right"
                      v-if="kpi.clk.check"
                      v-text="priceToString(data.clk) + '회'"
                    ></td>
                    <td
                      class="text-right"
                      v-if="kpi.ctr.check"
                      v-text="priceToString(data.ctr) + '%'"
                    ></td>
                    <td
                      class="text-right"
                      v-if="kpi.cpc.check"
                      v-text="priceToString(data.cpc) + '원'"
                    ></td>
                    <td
                      class="text-right"
                      v-if="kpi.cst.check"
                      v-text="priceToString(data.cst) + '원'"
                    ></td>
                    <td
                      class="text-right"
                      v-if="kpi.cv.check"
                      v-text="priceToString(data.cv) + '회'"
                    ></td>
                    <td
                      class="text-right"
                      v-if="kpi.cvr.check"
                      v-text="priceToString(data.cvr) + '%'"
                    ></td>
                    <td
                      class="text-right"
                      v-if="kpi.cr.check"
                      v-text="priceToString(data.cr) + '원'"
                    ></td>
                    <td
                      class="text-right"
                      v-if="kpi.cpa.check"
                      v-text="priceToString(data.cpa) + '원'"
                    ></td>
                    <td
                      class="text-right"
                      v-if="kpi.roas.check"
                      v-text="priceToString(data.roas) + '%'"
                    ></td>
                  </tr>
                </template>
              </tbody>
            </table>
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
          <div class="d-flex justify-content-between align-items-center">
            <button type="button" class="btn excel" @click="clickExcel">
              엑셀 다운받기
            </button>
            <button type="button" class="btn window-close" data-dismiss="modal">
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
// import xlsx from "xlsx";
import * as xlsx from "xlsx";
import moment from "moment";
import { isMobile, priceToString, getMedia } from "../../assets/js/common.js";
import { store } from "../../store/store.js";
import { SHA256 } from "../../assets/js/sha256.js";
import { API_URL, TEMP_KEY } from "../../configs/config.js";
import dateRangePicker from "../../components/common/dateRangePicker.vue";

export default {
  data() {
    return {
      start: moment().subtract(1, "days").format("YYYY-MM-DD"),
      end: moment().subtract(1, "days").format("YYYY-MM-DD"),
      uniqueId: null,
      isAdPid: true,
      adPid: 0,
      adId: 0,
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
      activeBtn: {
        clk: false, //클릭수
        im: false, //노출수
        cst: false, //광고비
        cv: false, //전환수
        cr: false, //전환매출
        ctr: true, //클릭률
        cpc: false, //클릭 당 비용
        cpa: false, //전환 당 비용
        cvr: false, //전환율
        roas: false, //ROAS,
        kpi: "im",
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
            { key: "campaign_id", name: "캠페인" },
            { key: "adgroup_id", name: "그룹" },
            { key: "skeyword", name: "검색어" },
          ],
        },
      },
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
  },
  components: {
    dateRangePicker,
  },
  mounted() {
    this.clickSearchBtn();
  },
  methods: {
    initForm() {
      this.adPid = 0;
      this.adId = 0;
      this.isAdPid = true;
      this.main.field = "";
      this.main.query = null;
      this.main.responseData = null;
      this.main.data = null;
      this.main.sort = "imd";
      this.main.start = 0;
      this.main.display = 10;
      this.main.isTotalCount = "-1";
      this.main.pages = [];
      this.main.isFirst = false;
      this.main.isEnd = false;
    },
    showModal(isAdPid, id, start, end) {
      var vm = this;
      vm.initForm();
      vm.isAdPid = isAdPid;
      isAdPid ? (vm.adPid = id) : (vm.adId = id);
      vm.$refs.dateRangePicker.setDate({ start: start, end: end });
      vm.clickSearchBtn();
      $("#" + this.getUniqueId).modal("show");
    },
    hideModal() {
      $("#" + this.getUniqueId).modal("hide");
    },
    priceToString(salse) {
      if (salse === undefined) return "";

      return priceToString(salse);
    },
    clickSearchBtn() {
      this.main.start = 0;
      this.main.isTotalCount = "-1";
      this.getReport();
      // if (this.adPid !== 0) {
      // 	// this.getTopKpi();

      // }
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
      var date = vm.$refs.dateRangePicker.getDate();

      $.ajax({
        type: "get", //요청 메소드 방식
        url: API_URL + "/app/shopping/shoppingreport",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          fromdate: date.start,
          todate: date.end,
          start: vm.main.start,
          sort: vm.main.sort,
          display: vm.main.display,
          totalcount: vm.main.isTotalCount,
          kpi: "",
          adpid: vm.isAdPid ? vm.adPid : "",
          adid: !vm.isAdPid ? vm.adId : "",
          session: store.state.userStore.session,
        },
        beforeSend: function (data) {
          vm.showMask = true;
          // vm.handleShowMask();
          // vm.showMaskPannelForReport = true;
        },
        success: function (data) {
          if (data.result === "success") {
            vm.main.data = [];
            vm.main.responseData = null;
            vm.main.responseData = data;

            vm.main.data = vm.getTotal(data.data.ads);
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
          vm.showMask = false;
          // vm.handleHideMask();
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
          adpid: vm.adPid,
          campaign_id: target.campaign_id,
          adgroup_id: target.adgroup_id,
          skeyword: target.skeyword,
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
      var date = vm.$refs.dateRangePicker.getDate();

      $.ajax({
        type: "get", //요청 메소드 방식
        url: API_URL + "/app/shopping/shoppingreport",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          fromdate: date.start,
          todate: date.end,
          start: 0,
          sort: vm.main.sort,
          display: vm.main.isTotalCount,
          totalcount: vm.main.isTotalCount,
          kpi: "",
          adpid: vm.isAdPid ? vm.adPid : "",
          adid: !vm.isAdPid ? vm.adId : "",
          session: store.state.userStore.session,
        },
        beforeSend: function (data) {
          vm.showMask = true;
          // vm.handleHideMask();
          // vm.showMaskPannelForReport = true;
        },
        success: function (data) {
          if (data.result === "success") {
            var options = {
              common: vm.headerSet.common,
              header: vm.headerSet.naver.header,
              headProps: "header",
            };
            vm.exportExcel(data.data.ads, options);
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
          // vm.handleHideMask();
          // vm.showMaskPannelForReport = false;
        },
      });
    },

    exportExcel(data, options) {
      var vm = this;
      var headProps = [];
      var media = "naver";

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
      xlsx.writeFile(wb, moment().format("LLLL") + "-" + "쇼핑검색광고키워드" + ".xlsx");
    },
  },
};
</script>

<style scoped></style>