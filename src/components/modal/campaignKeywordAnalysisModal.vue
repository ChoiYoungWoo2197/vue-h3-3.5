<template>
  <div class="modal fade keyword-modal show" :id="getUniqueId" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-modal="true" role="dialog" >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-body">
          <div class="title d-flex justify-content-between align-items-center">
            <h2 class="d-flex justify-content-center"> <span class="badge">캠페인 ID</span>{{ campaignId }} </h2>
            <div class="search d-flex">
              <date-range-picker ref="dateRangePicker" class="form-control" :pStart="start" :pEnd="end" :pDisabled="false" @changedDate="clickSearchBtn" > </date-range-picker>
              <button v-if="!showMask" type="submit" class="btn submit" @click.prevent="clickSearchBtn" > 조회하기 </button>
              <button v-if="showMask" type="submit" class="btn submit" disabled> <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true" ></span> 로딩중... </button>
            </div>
          </div>
          <article>
            <div class="title d-flex justify-content-between align-items-center">
              <h3>키워드 리포트</h3>
              <div class="indicator d-flex align-items-center dropdown">
                <button type="button" class="btn shadow-none p-0" data-toggle="dropdown" aria-expanded="false" > <i class="bi bi-gear m-0"></i> </button>
                <div class="dropdown-menu dropdown-menu-right">
                  <form>
                    <template v-for="(k,i) in ['cst','im','clk','cv','cr','ctr','cpa','cpc','cvr','roas']" :key="i+getUuidv4()">
                      <div class="form-check" >
                        <input class="form-check-input" type="checkbox" :id="'mindicator'+i" :value=k :checked="kpi[k].check" :disabled="kpi[k].visible === false" @change="clickCheckpi($event, k)" />
                        <label class="form-check-label" :for="'mindicator'+i" ><p class="d-flex align-items-center">{{getKpiName(k)}}</p></label >
                      </div>
                    </template>                    
                    <button type="button" class="btn indicator-close" data-toggle="dropdown" aria-expanded="false" > 닫기 </button>
                  </form>
                </div>
              </div>
            </div>
            <table class="report nshop">
              <thead>
                <tr>
                  <td width="40px">#</td>
                  <td class="text-left" width="15%">그룹</td>
                  <td class="text-left" width="15%">품질지수</td>
                  <td class="text-left" width="35%">키워드</td>
                  <td class="text-right pr-0">{{getKpiName(main.sort.slice(0,-1))}}</td>
                  <td class="text-right pl-0" width="8%">%</td>                  
                </tr>
              </thead>
              <tbody>
                <template v-if="getDatasForMain === null || getDatasForMain.length === 0"> <tr> <td colspan="7" class="text-center">데이터가 존재하지 않습니다.</td> </tr> </template>
                <template v-else>
                  <tr v-for="(data,i) in getDatasForMain" :key="data.adgroup_id + 'L'+getUuidv4()">
                    <td>{{i+1}}</td>
                    <td class="text-left">{{ data.adgroup_name }}</td>
                    <td class="text-left">
                      <div class="progress qigrade-container">
                        <div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" :style="{ width: calcQigrade(data.keyword_qigrade) }">
                          <span class="sr-only"></span>
                        </div>
                        <span class="level-bar" style="left: 8px;"></span>
                        <span class="level-bar" style="left: 17px;"></span>
                        <span class="level-bar" style="left: 26px;"></span>
                        <span class="level-bar" style="left: 35px;"></span>
                        <span class="level-bar" style="left: 44px;"></span>
                        <span class="level-bar" style="left: 53px;"></span>
                      </div>                       
                    </td>
                    <td class="text-left">{{ data.keyword_name }}</td>
                    <td class="text-right pr-0">{{priceToString(data[main.sort.slice(0,-1)]) + getUnit(main.sort.slice(0,-1))}}</td>
                    <td class="text-right pr-0">
                      <a href="#" class="d-flex align-items-center justify-content-end">
                        <template v-if="data.cp !== undefined">
                          <template v-if="data.cp.length === 0 || t.cp.per[main.sort.slice(0,-1)] === 0">{{'-'}}</template>
                          <template v-else>
                            <span :class="[data.cp.per[main.sort.slice(0,-1)].indexOf('-') > -1 ? 'down' : 'up']">{{data.cp.per[main.sort.slice(0,-1)] + "%"}}<i :class="[data.cp.per[top].indexOf('-') > -1 ? 'bi bi-graph-down-arrow ' : 'bi bi-graph-up-arrow ']" class="ml-1 mr-0"></i></span>
                          </template>
                        </template>
                      </a>                      
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
            <ul class="pagination d-flex justify-content-center align-items-center mb-30">
              <li class="page-item">
                <a class="page-link shadow-none" href="javascript:;" aria-label="Previous" @click="clickPreviousFirstPageBtnForMain" >
                  <span aria-hidden="true" ><i class="bi bi-chevron-double-left m-0"></i></span >
                </a>
              </li>
              <li class="page-item" :class="{ disabled: isFirstPageGroupForMain }">
                <a class="page-link shadow-none" href="javascript:;" aria-label="Previous" @click="clickPreviousPageBtnForMain" >
                  <span aria-hidden="true"><i class="bi bi-chevron-left"></i></span>
                </a>
              </li>
              <li class="page-item" :class="{ active: page - 1 === main.start }" v-for="page in main.pages" :key="page" >
                <a class="page-link shadow-none" href="javascript:;" v-text="page" @click="clickPageBtnForMain(page - 1)" ></a>
              </li>
              <li class="page-item" :class="{ disabled: isLastPageGroupForMain }">
                <a class="page-link shadow-none" href="javascript:;" aria-label="Next" @click="clickNextPageBtnForMain" >
                  <span aria-hidden="true"><i class="bi bi-chevron-right"></i></span>
                </a>
              </li>
              <li class="page-item">
                <a class="page-link shadow-none" href="javascript:;" aria-label="Next" @click="clickNextEndPageBtnForMain" >
                  <span><i class="bi bi-chevron-double-right m-0"></i></span >
                </a>
              </li>
            </ul>
          </article>
          <div class="d-flex justify-content-between align-items-center">
            <button type="button" class="btn excel" @click="clickExcel"> 엑셀 다운받기 </button>
            <button type="button" class="btn window-close" data-dismiss="modal"> 닫기 </button>
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
import {  isMobile,  priceToString,  getMedia,  uuidv4,  getUnit, getType,  getKpiName} from "@/assets/js/common.js";
import { store } from "@/store/store.js";
import { SHA256 } from "@/assets/js/sha256.js";
import { API_URL, TEMP_KEY } from "@/configs/config.js";
import dateRangePicker from "@/components/common/dateRangePicker.vue";
export default {
  data() {
    return {
      start: null,
      end: null,
      cstart: null,
      cend: null,
      uniqueId: null,
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
        google: {
          header: [
            { key: "campaign_name", name: "캠페인" },
            { key: "adgroup_name", name: "그룹" },
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
    getDatasForMain() { return this.main.data; },
    isFirstPageGroupForMain() { return this.main.isFirst; },
    isLastPageGroupForMain() { return this.main.isEnd; },
  },
  components: { dateRangePicker, },
  mounted() { this.clickSearchBtn(); },
  methods: {
    initForm() {
      this.media = null;
      this.start = null;
      this.end = null;
      this.cstart = null;
      this.cend = null;
      this.campaignId = 0;
      this.main.field = "";
      this.main.query = null;
      this.main.responseData = null;
      this.main.data = null;
      this.main.start = 0;
      this.main.display = 10;
      this.main.isTotalCount = "-1";
      this.main.pages = [];
      this.main.isFirst = false;
      this.main.isEnd = false;
    },
    showModal(o, media, sort, start, end, comparefromdate, comparetodate) {
      var vm = this;
      vm.initForm();
      console.log(o, media, start, end, comparefromdate, comparetodate);
      vm.media = media;
      vm.start = start;
      vm.end = end;
      vm.cstart = comparefromdate;
      vm.cend = comparetodate;
      vm.main.sort = sort;
      vm.campaignId = o.campaign_id;
      vm.$refs.dateRangePicker.setDate({ start: vm.start, end: vm.end });
      vm.clickSearchBtn();
      $("#" + this.getUniqueId).modal("show");
    },
    priceToString(salse) {
      if (salse === undefined) return "";
      return priceToString(salse);
    },
    clickSearchBtn() {
      this.main.start = 0;
      this.main.isTotalCount = "-1";
      this.getReport();
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
        case "google":
          md = "google";
          break;          
        default:
          md = "N";
      }
      $.ajax({
        type: "get", //요청 메소드 방식
        url: API_URL + "/app/analysis/campaignkeywordreport",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          fromdate: vm.start,
          todate: vm.end,
          comparefromdate: vm.cstart,
          comparetodate: vm.cend,
          start: vm.main.start,
          sort: vm.main.sort,
          display: vm.main.display,
          totalcount: vm.main.isTotalCount,
          md: md,
          campaignid: vm.campaignId,
          session: store.state.userStore.session,
        },
        beforeSend: function (data) {
          vm.showMask = true;
        },
        success: function (data) {
          if (data.result === "success") {
            vm.main.data = [];
            vm.main.responseData = null;
            vm.main.responseData = data;
            vm.main.data = data.data.keywords;
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
        },
      });
    },
    getStartAndEndPageForMain() {
      // this.main.isTotalCount !== '0' ? this.main.responseData.totalcount = this.main.isTotalCount : this.main.isTotalCount = this.main.responseData.totalcount;
      this.main.isTotalCount = this.main.responseData.totalcount;
      this.main.pages = [];
      var endPage = Math.ceil((this.main.start + 1) / this.main.displayPageNum) * this.main.displayPageNum;
      var startPage = endPage - this.main.displayPageNum + 1;
      var tempEndPage = Math.ceil(this.main.responseData.totalcount / this.main.display);
      if (endPage > tempEndPage) { endPage = tempEndPage; }

      this.main.isFirst = this.main.start + 1 === 1 ? true : false;
      this.main.isEnd = Math.ceil(this.main.responseData.totalcount / this.main.display) === this.main.start + 1 ? true : false;

      for (var i = startPage; i <= endPage; i++) { this.main.pages.push(i); }
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
      var date = vm.$refs.dateRangePicker.getDate();
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
        case "google":
          md = "google";
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
          campaignid: vm.campaignId,
          session: store.state.userStore.session,
        },
        beforeSend: function (data) { vm.showMask = true; },
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
        complete: function (a, b, c) { vm.showMask = false; },
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
      xlsx.writeFile(wb, "adgroup_report"+moment().format("YYYYMMDDHHmmss") + ".xlsx");
    },
    getUuidv4() {return uuidv4();},
    getKpiName(k) {return getKpiName(k);},
    getUnit(k) {return getUnit(k);},
    hideModal() { $("#" + this.getUniqueId).modal("hide"); },
    calcQigrade(qigrade) {
      var max = 7;
      var percentage = (qigrade / max) * 100;
      return `${percentage}%`;
    },    
  },
};
</script>

<style scoped></style>
