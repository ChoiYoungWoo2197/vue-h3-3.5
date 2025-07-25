<template>
  <div class="d-flex m-h-100 dashboard">
    <big-menu-2 :pMenu="'periodAnalysis'" @mountedMain="activeMain" class="pc" ></big-menu-2>
    <div class="pc wrap">
      <balance @logOut="handleLogOut" @changeData="handleChangedBalance"></balance>
      <section>
        <message ref="message" class="mb-4">
          <span>
            <span>최근 집계 완료 시간(오늘) |
              <template v-for="(k,i) in accountlog" >
                <template v-if="media === k.media">
                  <span v-if="k.campaign !== undefined && k.campaign !== ''" class="ml-1" :key="k+i+getUuidv4()"><span>{{"캠페인: "}}</span> {{k.campaign.split(" ")[1]}}</span>
                  <span v-if="k.adgroup !== undefined && k.adgroup !== ''" class="ml-1" :key="k+i+getUuidv4()"><span>{{"그룹: "}}</span> {{k.adgroup.split(" ")[1]}}</span>
                  <span v-if="k.keyword !== undefined && k.keyword !== ''" class="ml-1" :key="k+i+getUuidv4()"><span>{{"키워드: "}}</span> {{k.keyword.split(" ")[1]}}</span>
                  <span v-if="k.ad !== undefined && k.ad !== ''" class="ml-1" :key="k+i+getUuidv4()"><span>{{"소재: "}}</span> {{k.ad.split(" ")[1]}}</span>
                  <span v-if="k.shopping !== undefined && k.shopping !== ''" class="ml-1" :key="k+i+getUuidv4()"><span>{{"쇼핑: "}}</span> {{k.shopping.split(" ")[1]}}</span>
                </template>
              </template>              
            </span>
          </span>
        </message>          
        <div class="title d-flex justify-content-between align-items-center">
          <h2>기간별 분석</h2>
          <div class="search d-flex">
            <select class="form-control" id="time" v-model="time" @change="clickBtn">
              <option value="hour">시간별</option>
              <option value="dayweek">요일별</option>
              <option value="day">일별</option>
              <option value="week" selected>주차별</option>
              <option value="month">월별</option>
            </select>
            <select class="form-control" id="media" v-model="media" @change="clickMedia">
              <option selected value="naver">{{getMediaNew("naver")}}</option>
              <option value="kakaosa">{{getMediaNew("kakaosa")}}</option>
              <option value="naverda">{{getMediaNew("naverda")}}</option>
              <option value="kakaomo">{{getMediaNew("kakaomo")}}</option>
              <option value="google">{{getMediaNew("google")}}</option>
            </select>
            <date-range-picker ref="dateRangePicker" class="form-control" :pStart="start" :pEnd="end" :pDisabled="false" @changedDate="handleChangedDateRange" > </date-range-picker>
            <button type="submit" class="btn submit" @click.prevent="clickSearchBtn"> 조회하기 </button>
          </div>
        </div>
        <div class="select-btn">
          <button type="button" class="btn select" :class="[activeKpi.cst === true ? 'active' : '']" @click="clickKpiBtn($event, 'cst')" > 광고비 </button>
          <button type="button" class="btn select" :class="[activeKpi.im === true ? 'active' : '']" @click="clickKpiBtn($event, 'im')" > 노출수 </button>
          <button type="button" class="btn select" :class="[activeKpi.clk === true ? 'active' : '']" @click="clickKpiBtn($event, 'clk')" > 클릭수 </button>
          <button type="button" class="btn select" :class="[activeKpi.cv === true ? 'active' : '']" @click="clickKpiBtn($event, 'cv')" > 전환수 </button>
        </div>
        <article>
          <div class="title"> <h3>{{ getTitle }} 추이</h3> </div>
          <line-period-graph
            ref="linePeriodGraph"
            :pHeight="'300px'"
            :pLegend="activeKpi"
            :pPeriodUnit="activeBtn.periodUnit"
            :pCustom="{
              series: { textStyle: { fontSize: '15', fontWeight: 'bold', }, },
              xAxis: { name: '', axisLabel: { fontSize: '15' } },
              yAxis: { name: '', axisLabel: { fontSize: '15' } },
              grid: { left: 'center', bottom: '17%', width: '90%', containLabel: true, },
              legend: { show: false, left: 'right', top: 'middle', orient: 'vertical', },
            }"
            @expireSession="handleExpireSession"
            @showMask="handleShowMask"
            @hideMask="handleHideMask"
          >
          </line-period-graph>
        </article>
        <article>
          <div class="title d-flex justify-content-between align-items-center">
            <h3>{{ getTitle }} 리포트</h3>
            <div class="indicator d-flex align-items-center dropdown">
              <button type="button" class="btn shadow-none p-0" data-toggle="dropdown" aria-expanded="false" >
                <i class="bi bi-gear m-0"></i>
              </button>
              <div class="dropdown-menu dropdown-menu-right">
                <form>
                  <template v-for="(k,i) in ['cst','im','clk','cv','cr','ctr','cpa','cpc','cvr','roas']" :key="i+getUuidv4()">
                    <div class="form-check" >
                      <input class="form-check-input" type="checkbox" :id="'indicator'+i" :value=k :checked="kpi[k].check" :disabled="kpi[k].visible === false" @change="clickCheckpi($event, k)" />
                      <label class="form-check-label" :for="'indicator'+i" ><p class="d-flex align-items-center">{{getKpiName(k)}}</p></label >
                    </div>                    
                  </template>
                  <button type="button" class="btn indicator-close" data-toggle="dropdown" aria-expanded="false" > 닫기 </button>
                </form>
              </div>
            </div>
          </div>
          <div class="overflow-scroll">
            <table class="report">
              <thead>
                <tr>
                  <td width="20%" class="text-left" v-if="activeBtn.hour === true"> 시간별 </td>
                  <td width="20%" class="text-left" v-if="activeBtn.dayweek === true"> 요일별 </td>
                  <td width="20%" class="text-left" v-if="activeBtn.day === true"> 일별 </td>
                  <td width="20%" class="text-left" v-if="activeBtn.week === true"> 주차별 </td>
                  <td width="20%" class="text-left" v-if="activeBtn.month === true"> 월별 </td>
                  <template v-for="(k,i) in ['im','clk','ctr','cpc','cst','cv','cr','cpa','cvr','roas']">
                    <td :key="i+getUuidv4()" v-if="kpi[k].check" :class="{ 'text-right': i === 0 }">{{getKpiName(k)}}</td>
                  </template>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(data, index) in getDatas" :key="index + '-' + getUuidv4()" :data-toggle="activeBtn.dayweek === true ? 'tooltip' : ''" :data-placement="activeBtn.dayweek === true ? 'right' : ''" :title="activeBtn.dayweek === true ? dayWeekToString(data.dayweek) : ''" >
                  <td class="text-left" v-if="activeBtn.hour === true" v-text="data.time + '시'"></td>
                  <td class="text-left" v-else v-text="data.time"></td>
                  <template v-for="(k,i) in ['im','clk','ctr','cpc','cst','cv','cr','cpa','cvr','roas']">
                    <td :key="i+getUuidv4()" v-if="kpi[k].check" :class="{ 'text-right': i === 0 }">{{priceToString(data[k])+getUnit(k)}}</td>
                  </template>
                </tr>
              </tbody>
              <tfoot>
                <tr class="total bg-white">
                  <td class="text-left">총 합계</td>
                  <template v-if="responseData !== null && kpi">
                    <template v-for="(data, i) in total2">
                      <template v-for="(d, i2) in ['im', 'clk', 'ctr', 'cpc', 'cst', 'cv', 'cr', 'cpa', 'cvr', 'roas']">
                        <td v-if="kpi[d] !== undefined && kpi[d].check" class="text-right" :key="i + d + i2 + getUuidv4">
                          <a v-if="data.cp.per !== undefined" href="#" class="d-flex align-items-center justify-content-end">
                            <template v-if="data.cp.per[d] === 0">{{'-'}}</template>
                            <template v-else>
                              <span>{{priceToString(data[d]) + getUnit(d)}}</span>
                              <small class="ml-1" :class="[data.cp.per[d].indexOf('-') > -1 ? 'down' : 'up']"> {{data.cp.per[d] +'%'}}
                                <i :class="[data.cp.per[d].indexOf('-') > -1 ? 'bi bi-graph-down-arrow ' : 'bi bi-graph-up-arrow ']" class="ml-1 mr-0"></i>
                              </small>
                            </template>
                          </a>
                        </td>
                      </template>
                    </template>
                  </template>
                </tr>
              </tfoot>
            </table>
          </div>
        </article>
        <div class="d-flex justify-content-end">
          <button type="button" class="ml-3 btn pdf" @click="clickPdf"> PDF 다운받기 </button>
          <button type="button" class="ml-3 btn excel" @click="clickExcel"> 엑셀 다운받기 </button>
        </div>
      </section>
    </div>
    <div class="m m-wrap">
      <mheader ref="mHeader" :pMenu="'dashboard'"></mheader>
      <mfooter ref="mFooter" :pMenu="'dashboard'"></mfooter>
      <section>
        <div class="pills-container-btn">
          <div class="pills-btn pb-0">
            <ul class="d-flex" id="pills-tab" role="tablist">
              <li class="nav-item">
                <button class="nav-link time active" id="" type="button" data-toggle="collapse" data-target="#timeBtnBoxContainerCollapse" aria-expanded="false" aria-controls="timeBtnBoxContainerCollapse" >
                  {{ getTitle }}
                  <i class="bi bi-arrow-down text-white mr-0"></i>
                </button>
              </li>
              <li class="nav-item">
                <button class="nav-link media active" id="" type="button" data-toggle="collapse" data-target="#mediaBtnBoxContainerCollapse" aria-expanded="false" aria-controls="mediaBtnBoxContainerCollapse" >
                  {{ getMedia }}
                  <i class="bi bi-arrow-down text-white mr-0"></i>
                </button>
              </li>
              <li class="nav-item"> <button class="nav-link" :class="[activeKpi.cst === true ? 'active' : '']" id="" @click="clickKpiBtn($event, 'cst')" > 광고비 </button> </li>
              <li class="nav-item"> <button class="nav-link" :class="[activeKpi.im === true ? 'active' : '']" id="" @click="clickKpiBtn($event, 'im')" > 노출수 </button> </li>
              <li class="nav-item"> <button class="nav-link" :class="[activeKpi.clk === true ? 'active' : '']" id="" @click="clickKpiBtn($event, 'clk')" > 클릭수 </button> </li>
              <li class="nav-item"> <button class="nav-link" :class="[activeKpi.cv === true ? 'active' : '']" id="" @click="clickKpiBtn($event, 'cv')" > 전환수 </button> </li>
            </ul>
          </div>
          <button class="allow" @click="clickAllowBtn">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="9" viewBox="0 0 12 8" >
              <path fill="none" fill-rule="evenodd" stroke="#1e1e23" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M1 6L6 1 11 6" transform="translate(0 1)" ></path>
            </svg>
          </button>
        </div>
        <article class="collapse" id="timeBtnBoxContainerCollapse">
          <ul class="media-btn-box-container">
            <li @click="clickBtn($event, 'hour')">
              <input type="checkbox" />
              <label for="" :class="time === 'hour' ? 'active' : ''"> 시간별 <span> <i class="bi" :class="time === 'hour' ? 'bi-check active' : 'bi-plus'" ></i> </span> </label>
            </li>
            <li @click="clickBtn($event, 'dayweek')">
              <input type="checkbox" />
              <label for="" :class="time === 'dayweek' ? 'active' : ''"> 요일별 <span> <i class="bi" :class="time === 'dayweek' ? 'bi-check active' : 'bi-plus'" ></i> </span> </label>
            </li>
            <li @click="clickBtn($event, 'day')">
              <input type="checkbox" />
              <label for="" :class="time === 'day' ? 'active' : ''"> 일별 <span> <i class="bi" :class="time === 'day' ? 'bi-check active' : 'bi-plus'" ></i> </span> </label>
            </li>
            <li @click="clickBtn($event, 'week')">
              <input type="checkbox" />
              <label for="" :class="time === 'week' ? 'active' : ''"> 주차별 <span> <i class="bi" :class="time === 'week' ? 'bi-check active' : 'bi-plus'" ></i> </span> </label>
            </li>
            <li @click="clickBtn($event, 'month')">
              <input type="checkbox" />
              <label for="" :class="time === 'month' ? 'active' : ''"> 월별 <span> <i class="bi" :class="time === 'month' ? 'bi-check active' : 'bi-plus'" ></i> </span> </label>
            </li>
          </ul>
        </article>
        <article class="collapse" id="mediaBtnBoxContainerCollapse">
          <ul class="media-btn-box-container">
            <li @click="clickMedia($event, 'naver')">
              <input type="checkbox" />
              <label for="" :class="media === 'naver' ? 'active' : ''">
                {{getMediaNew("naver")}} <span> <i class="bi" :class="media === 'naver' ? 'bi-check active' : 'bi-plus'" ></i> </span>
              </label>
            </li>
            <li @click="clickMedia($event, 'kakaosa')">
              <input type="checkbox" />
              <label for="" :class="media === 'kakaosa' ? 'active' : ''">
                {{getMediaNew("kakaosa")}} <span> <i class="bi" :class="media === 'kakaosa' ? 'bi-check active' : 'bi-plus'" ></i> </span>
              </label>
            </li>
            <li @click="clickMedia($event, 'naverda')">
              <input type="checkbox" />
              <label for="" :class="media === 'naverda' ? 'active' : ''">
                {{getMediaNew("naverda")}} <span> <i class="bi" :class="media === 'naverda' ? 'bi-check active' : 'bi-plus'" ></i> </span>
              </label>
            </li>
            <li @click="clickMedia($event, 'kakaomo')">
              <input type="checkbox" />
              <label for="" :class="media === 'kakaomo' ? 'active' : ''">
                {{getMediaNew("kakaomo")}} <span> <i class="bi" :class="media === 'kakaomo' ? 'bi-check active' : 'bi-plus'" ></i> </span>
              </label>
            </li>
            <li @click="clickMedia($event, 'google')">
              <input type="checkbox" />
              <label for="" :class="media === 'google' ? 'active' : ''">
                {{getMediaNew("google")}} <span> <i class="bi" :class="media === 'google' ? 'bi-check active' : 'bi-plus'" ></i> </span>
              </label>
            </li>            
          </ul>
        </article>
        <article class="dashboard-card">
          <div class="title"> <h3>{{ getTitle }} 추이</h3> </div>
          <line-period-graph
            ref="linePeriodGraph2"
            :pHeight="'280px'"
            :pLegend="activeKpi"
            :pPeriodUnit="activeBtn.periodUnit"
            :pCustom="{
              series: { textStyle: { fontSize: '15', fontWeight: 'bold', }, },
              xAxis: { name: '', axisLabel: { fontSize: '15' }, show: false },
              yAxis: { name: '', axisLabel: { fontSize: '15' }, show: false },
              grid: { right: '10%', bottom: '5%', width: '100%', containLabel: true, },
              legend: { show: false, left: 'right', top: 'middle', orient: 'vertical', },
              mobile: true,
            }"
            @expireSession="handleExpireSession"
            @showMask="handleShowMask"
            @hideMask="handleHideMask"
          >
          </line-period-graph>
        </article>
        <article class="statistics-report">
          <div class="title d-flex justify-content-between align-items-center">
            <h3>
              그룹별 리포트
              <template v-if="activeBtn.hour === true" ><span>{{ "(시간별)" }}</span></template >
              <template v-if="activeBtn.dayweek === true" ><span>{{ "(요일별)" }}</span></template >
              <template v-if="activeBtn.day === true" ><span>{{ "(일별)" }}</span></template >
              <template v-if="activeBtn.week === true" ><span>{{ "(주차별)" }}</span></template >
              <template v-if="activeBtn.month === true" ><span>{{ "(월별)" }}</span></template >
            </h3>
            <div class="indicator d-flex align-items-center dropdown">
              <button type="button" class="btn shadow-none p-0" data-toggle="dropdown" aria-expanded="false" > <i class="bi bi-gear m-0"></i> </button>
              <div class="dropdown-menu dropdown-menu-right">
                <form>
                  <template v-for="(k,i) in ['cst','im','clk','cv','cr','ctr','cpa','cpc','cvr','roas']" :key="i+getUuidv4()">
                    <div class="form-check" >
                      <input class="form-check-input" type="checkbox" :id="'indicator'+i" :value=k :checked="kpi[k].check" :disabled="kpi[k].visible === false" @change="clickCheckpi($event, k)" />
                      <label class="form-check-label" :for="'indicator'+i" ><p class="d-flex align-items-center ml-1">{{getKpiName(k)}}</p></label >
                    </div>                    
                  </template>
                  <button type="button" class="btn indicator-close" data-toggle="dropdown" aria-expanded="false" > 닫기 </button>
                </form>
              </div>
            </div>
          </div>
          <div class="m-table" v-for="(data, index) in getDatas" :key="index + '-' + getUuidv4()" >
            <ul>
              <div class="m-table-title">
                <div class="w-100"> <li class="font-weight-bold">{{ data.time }}</li> </div>
              </div>
              <div class="m-table-content">
                <div class="w-100 d-flex flex-wrap">
                  <template v-for="(k,i) in ['cst','im','clk','cv','cr','ctr','cpa','cpc','cvr','roas']">
                    <li class="col-4" v-if="kpi[k].check" :key="i+getUuidv4()">
                      <label for="">{{getKpiName(k)}}</label>
                      <div>{{ priceToString(data[k]) + getUnit(k)}}</div>  
                    </li>
                  </template>
                </div>
              </div>
            </ul>
          </div>
        </article>
        <article>
          <div class="d-flex justify-content-between">
            <button type="button" class="btn pdf" @click="clickPdf">PDF 다운받기</button>
            <button type="button" class="btn excel" @click="clickExcel"> 엑셀 다운받기 </button>
          </div>
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
    <message-modal ref="messageModal" style="display: none">
      <template slot="message">
        <span class="text-primary font-weight-bolder" style="display: inline-block" >7일</span >
        <span>이내의 데이터(시간별)만 조회가능합니다.</span>
      </template>
    </message-modal>
    <mask-modal ref="maskModal" style="display: none"></mask-modal>
    <div class="hidden-print"><period-pdf ref="periodPdf" :key="pdfKey"></period-pdf></div>
    <!-- <pdf-period-analysis ref="pdfPeriodAnalysis" :pFromdate="start" :pTodate="end" :pKpi="kpi" :pActiveKpi="activeKpi" :pActiveBtn="activeBtn" :pActiveMedia="activeMedia" :pActiveWeekSet="activeWeekSet" style="display: none" @showMask="handleShowMask" @hideMask="handleHideMask" > </pdf-period-analysis> -->
  </div>
</template>

<script>
import $ from "jquery";
// import xlsx from "xlsx";
import * as xlsx from "xlsx";
import XlsxPopulate from "xlsx-populate/browser/xlsx-populate";
import {  isMobile,  priceToString,  getDateStr,  sortWeekDay,  getMedia,  uuidv4,  divideIntoSegments,  getUnit,  getKpiName,} from "@/assets/js/common.js";
import dateRangePicker from "@/components/common/dateRangePicker.vue";
import expireSessionModal from "@/components/modal/expireSessionModal.vue";
import messageModal from "@/components/modal/messageModal.vue";
import maskModal from "@/components/modal/maskModal.vue";
import linePeriodGraph from "@/components/graph/linePeriodGraph.vue";
import moment from "moment";
import { store } from "@/store/store.js";
import { SHA256 } from "@/assets/js/sha256.js";
import { API_URL, TEMP_KEY, MEDIA_ANALYSIS_SORT } from "@/configs/config.js";
import message from "@/components/common/message.vue";
import balance from "@/components/dashboard2/balance.vue";
import bigMenu2 from "@/components/layout/bigMenu2.vue";
import logOutModal from "@/components/modal/logOutModal.vue";
import "@/assets/js/jqueryui.1.12.js";
import pdfPeriodAnalysis from "@/components/pdf/pdfPeriodAnalysis.vue";
import mheader from "@/components/layout/m/header.vue";
import mfooter from "@/components/layout/m/footer.vue";
import mbigMenu2 from "@/components/layout/m/bigMenu2.vue";
import mdateRangePicker from "@/components/common/m/dateRangePicker.vue";
import mbalance from "@/components/common/m/balance.vue";
import mfmenu from "@/components/common/m/fMenu.vue";
import malarm from "@/components/common/m/alarm.vue";
import mdashboardEdit from "@/components/common/m/dashboardEdit.vue";
import periodPdf from "@/components/periodAnalysis/periodPdf.vue";
export default {
  data() {
    return {
      start: store.state.dateStore.start,
      end: store.state.dateStore.end,
      time: "week",
      media: "naver",
      activeWeekSet: [],
      activeMedia: { total: false, naver: true, kakaosa: false, naverda: false, kakaomo: false, google: false, type: "media", media: "naver", },
      activeDayBtn: { day7: true, day30: false, day60: false, day90: false, },
      activeBtn: { hour: false, dayweek: false, day: false, week: true, month: false, period: "", periodUnit: "week", },
      activeKpi: { cst: true, im: true, clk: false, cv: false, },
      kpi: {
        clk: { visible: false, check: true }, //클릭수
        im: { visible: false, check: true }, //노출수
        cst: { visible: false, check: true }, //광고비
        cv: { visible: true, check: false }, //전환수
        cr: { visible: true, check: false }, //전환매출
        ctr: { visible: false, check: true }, //클릭률
        cpc: { visible: false, check: true }, //클릭 당 비용
        cpa: { visible: true, check: false }, //전환 당 비용
        cvr: { visible: true, check: false }, //전환율
        roas: { visible: true, check: false }, //ROAS
      },
      datas: [],
      responseData: null,
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
        hour: { header: [{ key: "hour", name: "시간별" }], },
        dayweek: { header: [ { key: "dayweek", name: "요일별" }, { key: "count", name: "횟수" }, ], },
        day: { header: [{ key: "day", name: "일별" }], },
        week: { header: [{ key: "week", name: "주차별" }], },
        month: { header: [{ key: "month", name: "월별" }], },
      },
      balance: [],
      total2: [],
      accountlog: [],
      pdfKey: 0
    };
  },
  computed: {
    getDatas() { return this.datas; },
    getTableClass() {
      var tableClass = "";
      if (this.activeBtn.hour) { tableClass = "timetable"; } 
      else if (this.activeBtn.dayweek) { tableClass = "dow"; } 
      else if (this.activeBtn.day) { tableClass = ""; } 
      else if (this.activeBtn.month) { tableClass = ""; }
      return tableClass;
    },
    getTitle() {
      var title = "";
      if (this.activeBtn.periodUnit === "hour") title = "시간별";
      if (this.activeBtn.periodUnit === "dayweek") title = "요일별";
      if (this.activeBtn.periodUnit === "day") title = "일별";
      if (this.activeBtn.periodUnit === "week") title = "주차별";
      if (this.activeBtn.periodUnit === "month") title = "월별";
      return title;
    },
    getMedia(media) { return getMedia(this.media); },
  },
  components: { bigMenu2, logOutModal, balance, linePeriodGraph, messageModal, dateRangePicker, expireSessionModal, maskModal, pdfPeriodAnalysis, mheader, mfooter, mbigMenu2, mdateRangePicker,    
  mbalance, mfmenu, malarm, mdashboardEdit, message, periodPdf
  },
  mounted() {
    $(".main").removeClass("m-h-100");
    this.clickSearchBtn();
    this.getAccountLog();
  },
  updated() { $('[data-toggle="tooltip"]').tooltip(); },
  methods: {
    getUuidv4() { return uuidv4(); },
    activeMain(flag) {
      this.$emit("mountedMain", true);
      this.$emit("mountedDasyboad", true);
    },
    handleLogOut() { this.$refs.logOutModal.showModal(); },
    handleExpireSession() { this.$refs.expireSessionModal.showModal(); },
    handleShowMask() { this.$refs.maskModal.showModal(); },
    handleHideMask() { this.$refs.maskModal.hideModal(); },
    clickSearchBtn() {
      var vm = this;
      // if (vm.is7DayUp()) return;
      var date = vm.$refs.dateRangePicker.getDate();
      vm.start = date.start;
      vm.end = date.end;

      if (vm.activeBtn.periodUnit === "week") {
        var diff = moment(vm.end).diff(moment(vm.start), "days");
        if (diff < 7) {
          alert("8일 이상 선택해주세요.");
          return false;
        }
      }

      vm.activeBtn.period = date.start + " ~ " + date.end;
      vm.findPeriodReport();
    },
    priceToString(salse) {
      if (salse === undefined) return "";
      return priceToString(salse);
    },
    is7DayUp() {
      var vm = this;
      var date = vm.$refs.dateRangePicker.getDate();
      var is7DayUp = false;
      if (vm.activeBtn.periodUnit === "hour") {
        var fromdate = date.start;
        var todate = date.end;
        var diff = moment(todate).diff(moment(fromdate), "days");

        if (diff >= 7) {
          this.$refs.messageModal.showModal();
          is7DayUp = true;
        }
      }

      return is7DayUp;
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
    clickBtn(event, time) {
      var vm = this;
      if (time) vm.time = time;
      var type = vm.time;
      var keys = Object.keys(vm.activeBtn);
      for (let i = 0; i < keys.length; i++) {
        if (keys[i] === "period" || keys[i] === "periodUnit") continue;
        vm.activeBtn[keys[i]] = false;
      }

      if (type === "week") {
        let end = moment().subtract(1, "d").format("YYYY-MM-DD");
        let start = moment(end).subtract(31, "d").format("YYYY-MM-DD");
        vm.activeWeekSet = [];
        vm.activeWeekSet = divideIntoSegments(start, end, 5);

        vm.$refs.dateRangePicker.setDate({
          start: vm.activeWeekSet[0].start,
          end: vm.activeWeekSet[vm.activeWeekSet.length - 1].end,
        });
      }

      vm.activeBtn[type] = true;
      vm.activeBtn["periodUnit"] = type;
      vm.clickSearchBtn();
    },
    findPeriodReport() {
      var vm = this;
      var date = vm.$refs.dateRangePicker.getDate();
      var diff = moment(date.end).diff(moment(date.start), "days");
      var comparefromdate = moment(date.start).subtract(1 + Number(diff), "days").format("YYYY-MM-DD");
      var comparetodate = moment(date.start).subtract(1, "days").format("YYYY-MM-DD");
      $.ajax({
        type: "get", //요청 메소드 방식
        url: API_URL + "/app/analysis/periodreport",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          fromdate: date.start,
          todate: date.end,
          periodunit: vm.activeBtn.periodUnit,
          comparefromdate: comparefromdate,
          comparetodate: comparetodate,            
          session: store.state.userStore.session,
        },
        beforeSend: function (data) { vm.handleShowMask(); },
        success: function (data) {
          vm.datas = [];
          vm.total2 = [];
          vm.responseData = null;

          if (data.result === "success") {
            var type = vm.activeMedia.type;
            var media = vm.activeMedia.media;
            vm.responseData = data.data;
            var graphDatas;
            var totalDatas = { media: { kakaomo: {}, kakaosa: {}, naver: {}, naverda: {}, google: {}, }, total: { summary: {}, }, };

            if (vm.activeBtn.periodUnit === "hour") {
              totalDatas = vm.sortHour(data.data, date.start, date.end);
              type === "total" ? (graphDatas = totalDatas[type]) : (graphDatas = totalDatas[type][media]);
            } else if (vm.activeBtn.periodUnit === "dayweek") {
              type === "total" ? (graphDatas = sortWeekDay(data.data[type]["summary"])) : (graphDatas = sortWeekDay(data.data[type][media]));
              var keys = Object.keys(graphDatas);
              for (var i = 0; i < keys.length; i++) {
                var obj = new Object();
                obj[keys[i]] = graphDatas[keys[i]];
                type === "total" ? Object.assign(totalDatas[type], obj) : Object.assign(totalDatas[type][media], obj);
              }
            } else { 
              type === "total" ? (graphDatas = data.data[type]) : (graphDatas = data.data[type][media]);
              totalDatas = data.data;
            }
            vm.$refs.linePeriodGraph.setGraph(graphDatas, date.start, date.end);
            vm.$refs.linePeriodGraph2.setGraph(graphDatas, date.start, date.end);
            vm.getTotal(totalDatas, type, media);
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
        complete: function (a, b, c) { vm.handleHideMask();},
      });
    },
    clickMedia(event, media) {
      var vm = this;
      // if (vm.is7DayUp()) return;

      var $btn = $(event.target);
      var keys = Object.keys(vm.activeMedia);
      for (let i = 0; i < keys.length; i++) {
        if (keys[i] === "type" || keys[i] === "media") continue;
        vm.activeMedia[keys[i]] = false;
      }

      if (media) vm.media = media;
      var type = vm.media === "total" ? "total" : "media";
      var media = vm.media === "total" ? "total" : vm.media;
      var date = vm.$refs.dateRangePicker.getDate();

      vm.activeMedia[media] = true;
      vm.activeMedia["type"] = type;
      vm.activeMedia["media"] = media;
      vm.activeBtn.periodUnit = vm.time;

      var graphDatas;
      var totalDatas = {
        media: { kakaomo: {}, kakaosa: {}, naver: {}, naverda: {}, google: {}, },
        total: {summary: {}},
      };

      if (vm.activeBtn.periodUnit === "hour") {
        totalDatas = vm.sortHour(vm.responseData, date.start, date.end);
        type === "total" ? (graphDatas = totalDatas[type]) : (graphDatas = totalDatas[type][media]);
      } else if (vm.activeBtn.periodUnit === "dayweek") {
        type === "total" ? (graphDatas = sortWeekDay(vm.responseData[type]["summary"])) : (graphDatas = sortWeekDay(vm.responseData[type][media]));
        var keys = Object.keys(graphDatas);
        for (var i = 0; i < keys.length; i++) {
          var obj = new Object();
          obj[keys[i]] = graphDatas[keys[i]];
          type === "total" ? Object.assign(totalDatas[type], obj) : Object.assign(totalDatas[type][media], obj);
        }
      } else {
        type === "total" ? (graphDatas = vm.responseData[type]) : (graphDatas = vm.responseData[type][media]);
        totalDatas = vm.responseData;
      }

      vm.$refs.linePeriodGraph.setGraph(graphDatas, date.start, date.end);
      vm.$refs.linePeriodGraph2.setGraph(graphDatas, date.start, date.end);
      vm.getTotal(totalDatas, type, media);
    },
    clickKpiBtn(event, kpi) {
      var vm = this;
      // if (vm.is7DayUp()) return;

      vm.activeKpi[kpi] = !vm.activeKpi[kpi];
      var date = vm.$refs.dateRangePicker.getDate();
      var graphDatas;
      var totalDatas = {
        media: { kakaomo: {}, kakaosa: {}, naver: {}, naverda: {}, google: {} },
        total: { summary: {}, },
      };

      if (vm.activeBtn.periodUnit === "hour") {
        totalDatas = vm.sortHour(vm.responseData, date.start, date.end);
        vm.activeMedia.type === "total" ? (graphDatas = totalDatas[vm.activeMedia.type]) : (graphDatas = totalDatas[vm.activeMedia.type][vm.activeMedia.media]);
      } else if (vm.activeBtn.periodUnit === "dayweek") { vm.activeMedia.type === "total" ? (graphDatas = sortWeekDay(vm.responseData[vm.activeMedia.type]["summary"])) : (graphDatas = sortWeekDay(vm.responseData[vm.activeMedia.type][vm.activeMedia.media]));
      } else { vm.activeMedia.type === "total" ? (graphDatas = vm.responseData[vm.activeMedia.type]) : (graphDatas = vm.responseData[vm.activeMedia.type][vm.activeMedia.media]); }

      vm.$refs.linePeriodGraph.setGraph(graphDatas, date.start, date.end);
      vm.$refs.linePeriodGraph2.setGraph(graphDatas, date.start, date.end);
    },
    getTotal(data, type, media) {
      var vm = this;
      vm.datas = [];
      vm.total2 = [];
      vm.total2.push(vm.responseData.total.summary.all[media]);
      var date = vm.$refs.dateRangePicker.getDate();
      var keysTotal = [];
      var periodUnit = vm.activeBtn.periodUnit;
      var dayweek = { 1: { name: "월요일", datas: [] }, 2: { name: "화요일", datas: [] }, 3: { name: "수요일", datas: [] }, 4: { name: "목요일", datas: [] }, 5: { name: "금요일", datas: [] }, 6: { name: "토요일", datas: [] }, 7: { name: "일요일", datas: [] }, };
      let week = { clk: 0, im: 0, cst: 0, cv: 0, cr: 0, ctr: 0, cpc: 0, cpa: 0, cvr: 0, roas: 0 };
      let weekSet = { start: "", end: "", c: -1, d: 0};
      let weekNumber = 0;

      //total
      keysTotal = media === "total" ? Object.keys(data[type]) : Object.keys(data[type][media]);
      keysTotal.sort();

      if (periodUnit === "dayweek") {
        var fromdate = date.start;
        var todate = date.end;
        var diff = moment(todate).diff(moment(fromdate), "days");

        for (var i = 0; i <= diff; i++) {
          var day = moment(fromdate).add(i, "days");
          var isoWeekday = day.isoWeekday();
          var format = day.format("YYYY-MM-DD");
          dayweek[isoWeekday]["datas"].push(format);
        }
      }

      if (periodUnit === "week") {
        
        vm.activeWeekSet = [];
        vm.activeWeekSet = divideIntoSegments(vm.start, vm.end, 5);
        //console.log(vm.start, vm.end, vm.activeWeekSet);
        weekSet.start = vm.activeWeekSet[weekNumber].start;
        weekSet.end = vm.activeWeekSet[weekNumber].end;
        weekSet.d = moment(vm.activeWeekSet[weekNumber].end).diff(moment(vm.activeWeekSet[weekNumber].start),"days");
      }

      for (let i = 0; i < keysTotal.length; i++) {
        var obj = "";
        obj = media === "total" ? data[type][keysTotal[i]] : data[type][media][keysTotal[i]];

        if (!obj || obj.length === 0 || keysTotal[i] === "summary") continue;
        if (periodUnit === "hour") obj["time"] = i < 10 ? "0" + i : i;
        if (periodUnit === "dayweek") {
          obj["time"] = dayweek[i + 1]["name"];
          obj["dayweek"] = dayweek[i + 1]["datas"];
        }
        if (periodUnit === "week") {
          weekSet.c += 1;
          week.clk += parseFloat(obj.clk);
          week.im += parseFloat(obj.im);
          week.cst += parseFloat(obj.cst);
          week.cv += parseFloat(obj.cv);
          week.cr += parseFloat(obj.cr);

          if (weekSet.c !== weekSet.d) continue;
          if (weekSet.c === weekSet.d) {
            week["time"] = weekNumber + 1 + "주차" + "(" + vm.activeWeekSet[weekNumber].start + " ~ " + vm.activeWeekSet[weekNumber].end + ")";
            week.ctr = week.clk > 0 && week.im > 0 ? ((week.clk / week.im) * 100).toFixed(2) : 0;
            week.cpc = week.cst > 0 && week.clk > 0 ? (week.cst / week.clk).toFixed(0) : 0;
            week.cpa = week.cst > 0 && week.cv > 0 ? (week.cst / week.cv).toFixed(0) : 0;
            week.cvr = week.cv > 0 && week.clk > 0 ? ((week.cv / week.clk) * 100).toFixed(2) : 0;
            week.roas = week.cr > 0 && week.cst > 0 ? ((week.cr / week.cst) * 100).toFixed(0) : 0;
            obj = week;

            week = { clk: 0, im: 0, cst: 0, cv: 0, cr: 0, ctr: 0, cpc: 0, cpa: 0, cvr: 0, roas: 0 };
            weekNumber += 1;

            if (vm.activeWeekSet[weekNumber]) {
              weekSet.c = -1;
              weekSet.d = moment(vm.activeWeekSet[weekNumber].end).diff(moment(vm.activeWeekSet[weekNumber].start), "days");
            }
          }
        }

        if (periodUnit === "day" || periodUnit === "month") obj["time"] = keysTotal[i];

        obj["cpa"] === undefined ? "" : (obj["cpa"] = Math.ceil(obj["cpa"].toString().replace(",", "")));
        obj["cpc"] === undefined ? "" : (obj["cpc"] = Math.ceil(obj["cpc"].toString().replace(",", "")));
        obj["roas"] === undefined ? "" : (obj["roas"] = Math.ceil(obj["roas"].toString().replace(",", "")));
        vm.datas.push(obj);
      }
    },
    priceToString(salse) {
      if (salse === undefined) return "";
      return priceToString(salse);
    },
    dayWeekToString(datas) {
      var dayweek = "";
      if (datas === undefined) return "";

      for (var i = 0; i < datas.length; i++) {
        dayweek += datas[i];
        if (datas.length - 1 !== i) dayweek += ", ";
      }

      return dayweek;
    },
    getSum(arr) {
      var result = arr.reduce(function add(sum, currValue) { return parseFloat(sum) + parseFloat(currValue); }, 0);
      return result;
    },
    sortHour(data, fromDate, toDate) {
      var vm = this;
      var sorted = { media: { kakaomo: {}, kakaosa: {}, naver: {}, naverda: {}, google: {} }, total: { summary: {}, }, };

      ["total", "kakaomo", "kakaosa", "naver", "naverda", "google"].forEach(function ( currentMedia, index ) {
        for (var j = 0; j <= 23; j++) {
          var clk = []; //클릭수
          var im = []; //노출수
          var cst = []; //광고비
          var cv = []; //전환수
          var cr = []; //전환매출
          var ctr = []; //클릭률
          var cpc = []; //클릭 당 비용
          var cpa = []; //전환 당 비용
          var cvr = []; //전환율
          var roas = []; //ROAS
          var newObject = new Object();
          var hour = j < 10 ? "0" + j : j;

          var diff = moment(toDate).diff(fromDate, "days");

          for (var i = 0; i <= diff; i++) {
            var currentDay = moment(fromDate).add(i, "days").format("YYYY-MM-DD");
            var obj = currentMedia === "total" ? data["total"]["summary"][currentDay] : data["media"][currentMedia][currentDay];
            if (!obj || obj.length === 0) {
              clk.push(0);
              im.push(0);
              cst.push(0);
              cv.push(0);
              cr.push(0);
              ctr.push(0);
              cpc.push(0);
              cpa.push(0);
              cvr.push(0);
              roas.push(0);
              continue;
            }

            clk.push(obj[hour]["clk"]);
            im.push(obj[hour]["im"]);
            cst.push(obj[hour]["cst"]);
            cv.push(obj[hour]["cv"]);
            cr.push(obj[hour]["cr"]);
            obj[hour]["ctr"] === undefined ? ctr.push(0) : isNaN(obj[hour]["ctr"]) ? ctr.push(obj[hour]["ctr"].replace(",", "")) : ctr.push(obj[hour]["ctr"]);
            obj[hour]["cpc"] === undefined ? cpc.push(0) : isNaN(obj[hour]["cpc"]) ? cpc.push(obj[hour]["cpc"].replace(",", "")) : cpc.push(obj[hour]["cpc"]);
            obj[hour]["cpa"] === undefined ? cpa.push(0) : isNaN(obj[hour]["cpa"]) ? cpa.push(obj[hour]["cpa"].replace(",", "")) : cpa.push(obj[hour]["cpa"]);
            obj[hour]["cvr"] === undefined ? cvr.push(0) : isNaN(obj[hour]["cvr"]) ? cvr.push(obj[hour]["cvr"].replace(",", "")) : cvr.push(obj[hour]["cvr"]);
            obj[hour]["roas"] === undefined ? roas.push(0) : isNaN(obj[hour]["roas"]) ? roas.push(obj[hour]["roas"].replace(",", "")) : roas.push(obj[hour]["roas"]);
          }

          newObject["clk"] = vm.getSum(clk);
          newObject["im"] = vm.getSum(im);
          newObject["cst"] = vm.getSum(cst);
          newObject["cv"] = vm.getSum(cv);
          newObject["cr"] = vm.getSum(cr);
          newObject["ctr"] = vm.getSum(ctr) > 0 && vm.getSum(im) > 0 ? ((vm.getSum(clk) / vm.getSum(im)) * 100).toFixed(2) : 0;
          newObject["cpc"] = vm.getSum(cst) > 0 && vm.getSum(clk) > 0 ? (vm.getSum(cst) / vm.getSum(clk)).toFixed(0) : 0;
          newObject["cpa"] = vm.getSum(cst) > 0 && vm.getSum(cv) > 0 ? (vm.getSum(cst) / vm.getSum(cv)).toFixed(0) : 0;
          newObject["cvr"] = vm.getSum(cv) > 0 && vm.getSum(clk) > 0 ? ((vm.getSum(cv) / vm.getSum(clk)) * 100).toFixed(2) : 0;
          newObject["roas"] = vm.getSum(cr) > 0 && vm.getSum(cst) > 0 ? ((vm.getSum(cr) / vm.getSum(cst)) * 100).toFixed(0) : 0;
          currentMedia === "total" ? (sorted["total"][hour] = newObject) : (sorted["media"][currentMedia][hour] = newObject);
        }
      });

      return sorted;
    },
    clickExcel() {
      var vm = this;
      if (vm.responseData !== null) {
        var options = { common: vm.headerSet.common, header: vm.headerSet[vm.activeBtn.periodUnit].header, headProps: "header", };
        vm.exportExcel(vm.responseData, options);
      } 
    },
    async exportExcel(data, options) {
      var vm = this;
      var headProps = [];

      // try {
      //   //엑셀 템플릿 파일 불러오기
      //   var response = await fetch(API_URL+"/static/template.xlsx"); // Vue 2에서는 static 폴더 사용
      //   var blob = await response.blob();   
      //   // 2. xlsx-populate로 엑셀 파일 로드
      //   // var workbook = await XlsxPopulate.fromDataAsync(await blob.arrayBuffer());
      //   console.log(blob.arrayBuffer(), XlsxPopulate, await XlsxPopulate.fromDataAsync(await blob.arrayBuffer()));
      //   // 3. 데이터 입력 (예제: A2~B6에 값 채우기)
      //   // var sheet = workbook.sheet("Sheet1");
      //   // sheet.cell("A2").value("January");
      //   // sheet.cell("B2").value(500);
      //   // sheet.cell("A3").value("February");
      //   // sheet.cell("B3").value(600);

      //   // // 4. 수정된 엑셀 다운로드
      //   // const updatedBlob = await workbook.outputAsync();
      //   // const link = document.createElement("a");
      //   // link.href = URL.createObjectURL(updatedBlob);
      //   // link.download = "updated_template.xlsx";
      //   // link.click();        


      //   // console.log(response);
      // } catch(error) {
      //   console.log("Error loading Excel template:", error);
      // }

   


      if (Array.isArray(options.headProps)) { headProps = options.headProps; } 
      else if (options.headProps === "header") {
        for (var h of vm.headerSet[vm.activeBtn.periodUnit].header) { headProps.push(h.key); }
        for (var c of vm.headerSet.common.header) { headProps.push(c.key); }
      } 
      else { headProps = Object.keys(data[0]); }

      this.visibleHeadProps = headProps;
      this.instance = document.createElement("table");

      // Header 세팅
      var rows = [];
      if (!Array.isArray(vm.headerSet[vm.activeBtn.periodUnit].header[0])) {
        rows.push(vm.headerSet[vm.activeBtn.periodUnit].header);
        for (var c of vm.headerSet.common.header) { rows[0].push(c); }
      } 
      else { rows = vm.headerSet[vm.activeBtn.periodUnit].header; }

      var thead = document.createElement("thead");
      for (var row of rows) {
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
      vm.datas.forEach(function (data, index) {
        var value = Object.assign({}, data);
        value[vm.activeBtn.periodUnit] = data.time;

        if (vm.activeBtn.periodUnit === "hour") {
        } else if (vm.activeBtn.periodUnit === "dayweek") {
          value["count"] = data.dayweek.length;
        }

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

      xlsx.utils.book_append_sheet(wb, ws, getMedia(vm.activeMedia.media));
      const wbout = xlsx.write(wb, { bookType: "xlsx", type: "array" });
      const url = window.URL.createObjectURL(
        new Blob([wbout], { type: "application/octet-stream" })
      );
      const a = document.createElement("a");
      a.href = url;
      a.download = "period_report_"+moment().format("YYYYMMDDHHmmss")+".xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    },
    async clickPdf() {
      var date = this.$refs.dateRangePicker.getDate();
      var diff = moment(date.end).diff(moment(date.start), "days");
      var comparefromdate = moment(date.start).subtract(1 + Number(diff), "days").format("YYYY-MM-DD");
      var comparetodate = moment(date.start).subtract(1, "days").format("YYYY-MM-DD");      

      this.handleShowMask();
      await this.$refs.periodPdf.initPDF({date: date, cdate: {start: comparefromdate, end: comparetodate}, media: this.media});
      var blob = await this.$refs.periodPdf.generatePDF(); // 렌더링 완료 후 PDF 생성
      window.open(URL.createObjectURL(blob));
      this.pdfKey++;
      this.handleHideMask();
    },
    handleChangedDateRange(data) {
      this.$refs.dateRangePicker.setDate({ start: data.start, end: data.end, compare: false, });
      this.clickSearchBtn();
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
    handleChangedBalance(data) {
      this.balance = [];
      this.balance = data.slice();
    },
    getUnit(k) { return getUnit(k); },
    getKpiName(k) { return getKpiName(k); },    
    getMediaNew(media) {return getMedia(media);},
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
  },
};
</script>
