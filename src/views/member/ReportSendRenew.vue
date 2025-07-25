<template>
  <div class="d-flex m-h-100 dashboard">
    <big-menu-2 :pMenu="'reportSendRenew'" @mountedMain="activeMain" class="pc"></big-menu-2>
    <div class="pc wrap">
      <balance @logOut="handleLogOut" @changeData="handleChangedBalance"></balance>
      <section class="send-group">
        <message ref="message" class="mb-4">
          <span>
            <span>{{"저장 후 리포트 내역에서 다운로드 버튼을 눌러주세요."}}</span>
          </span>
        </message>
        <div class="title d-flex justify-content-between align-items-center"> <h2>리포트 발송(리뉴얼🔥)</h2> </div>
        <article>
          <div class="title d-flex justify-content-between align-items-center">
            <h3>새 리포트 작성</h3>
            <div class="indicator d-flex align-items-center dropdown">
              <button type="button" class="btn shadow-none p-0" data-toggle="dropdown" aria-expanded="false" >
                <i class="bi bi-gear m-0"></i>
              </button>
              <div class="dropdown-menu dropdown-menu-right">
                <form>
                  <div class="form-check w-100">
                    <input class="form-check-input" type="checkbox" id="indicator1" value="" disabled hidden />
                    <label class="form-check-label" for="indicator1" ><p class="d-flex align-items-center">기간별분석</p></label>
                  </div>
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="indicator2" value="1" :checked="dropdownMenu.periodAnalysis.value === 1" @click="dropdownMenu.periodAnalysis.value === 1 ? $event.preventDefault() : '' " @change="clickRadioPeriodAnalysis($event, 1)" />
                    <label class="form-check-label" for="indicator2" ><p class="d-flex align-items-center">시간별</p></label >
                  </div>
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="indicator3" value="2" :checked="dropdownMenu.periodAnalysis.value === 2" @click=" dropdownMenu.periodAnalysis.value === 2 ? $event.preventDefault() : '' " @change="clickRadioPeriodAnalysis($event, 2)" />
                    <label class="form-check-label" for="indicator3" ><p class="d-flex align-items-center">요일별</p></label >
                  </div>
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="indicator4" key="" value="3" :checked="dropdownMenu.periodAnalysis.value === 3" @click=" dropdownMenu.periodAnalysis.value === 3 ? $event.preventDefault() : '' " @change="clickRadioPeriodAnalysis($event, 3)" />
                    <label class="form-check-label" for="indicator4" ><p class="d-flex align-items-center">일별</p></label >
                  </div>
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="indicator5" value="4" :checked="dropdownMenu.periodAnalysis.value === 4" @click=" dropdownMenu.periodAnalysis.value === 4 ? $event.preventDefault() : '' " @change="clickRadioPeriodAnalysis($event, 4)" />
                    <label class="form-check-label" for="indicator5" ><p class="d-flex align-items-center">월별</p></label>
                  </div>
                  <!-- <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="indicator6" value="5" :checked="dropdownMenu.periodAnalysis.value === 5" @click=" dropdownMenu.periodAnalysis.value === 5 ? $event.preventDefault() : '' " @change="clickRadioPeriodAnalysis($event, 5)" />
                    <label class="form-check-label" for="indicator6" ><p class="d-flex align-items-center">주차별</p></label>
                  </div>                   -->
                  <div class="form-border"></div>
                  <div class="form-check w-100">
                    <input class="form-check-input" type="checkbox" id="indicator6" value="" disabled hidden />
                    <label class="form-check-label" for="indicator6" ><p class="d-flex align-items-center">정렬(내림차순)</p></label >
                  </div>
                  <template v-for="(k,i) in [{k:'cst', i:7,v:1},{k:'im', i:8,v:2},{k:'clk', i:9,v:3},{k:'cv', i:10,v:4},{k:'cvr', i:11,v:5},{k:'cr', i:12,v:6},{k:'ctr', i:13,v:7},{k:'cpa', i:14,v:8},{k:'cpc', i:15,v:9},{k:'roas', i:16,v:10}]" :key="i+getUuidv4()">
                    <div  class="form-check">
                      <input class="form-check-input" type="checkbox" :id="'indicator'+k.i" :value="k.v" :checked="dropdownMenu.kpi.value === (i+1)" 
                      @click="dropdownMenu.kpi.value === (i+1) ? $event.preventDefault() : ''"
                      @change="clickRadioKpi($event, (i+1))" />
                      <label class="form-check-label" :for="'indicator'+k.i"><p class="d-flex align-items-center">{{getKpiName(k.k)}}</p></label>
                    </div>
                  </template>
                  <button type="button" class="btn indicator-close" data-toggle="dropdown" aria-expanded="false" > 닫기 </button>
                </form>
              </div>
            </div>
          </div>
          <form>
            <div class="form-group row">
              <div class="col-xl-6 row align-items-center">
                <label for="" class="form-label">보고서명</label>
                <div>
                  <input type="text" class="form-control" id="" v-model="reportInfo.name" @blur="blurResisterName()" />
                </div>
                <div v-if="error.resisterNameErrorMessage.length > 0" id="resisterNamefeedback" class="invalid-feedback d-block" > {{ error.resisterNameErrorMessage }} </div>
              </div>
              <div class="col-xl-6 row align-items-center">
                <label for="" class="form-label"></label>
                <div></div>
              </div>
              <div class="col-xl-6 row align-items-center">
                <label for="" class="form-label">기준일</label>
                <div> <date-range-picker ref="dateRangePicker" class="form-control" :pStart="reportInfo.start" :pEnd="reportInfo.end" :pDisabled="false" @changedDate="handleChangedDateRange" > </date-range-picker> </div>
              </div>    
              <div class="col-xl-6 row align-items-center">
                <label for="" class="form-label">비교일</label>
                <div> <date-range-picker ref="cdateRangePicker" class="form-control" :pStart="reportInfo.cstart" :pEnd="reportInfo.cend" :pDisabled="false"> </date-range-picker> </div>
              </div>          
            </div>
            <div class="form-group row">
              <div class="col-xl-6 row align-items-center">
                <label for="" class="form-label">마케터</label>
                <div> <input type="text" class="form-control" id="" v-model="reportInfo.sender" /> </div>
                <div v-if="error.resisterSenderErrorMessage.length > 0" id="resisterSenderfeedback" class="invalid-feedback d-block" > {{ error.resisterSenderErrorMessage }} </div>
              </div>
              <div class="col-xl-6 row align-items-center">
                <label for="" class="form-label">마케터 전화번호</label>
                <div> <input type="text" class="form-control" id="" v-model="reportInfo.number" /> </div>
                <div v-if="error.resisterNumberErrorMessage.length > 0" id="resisterNumberfeedback" class="invalid-feedback d-block" > {{ error.resisterNumberErrorMessage }} </div>
              </div>
            </div>
            <div class="form-group row">
              <div class="col-xl-6 row align-items-center">
                <label for="" class="form-label">발신 이메일</label>
                <div> <input type="text" class="form-control" id="" v-model="reportInfo.email" /> </div>
                <div v-if="error.resisterEmailErrorMessage.length > 0" id="resisterEmailfeedback" class="invalid-feedback d-block" > {{ error.resisterEmailErrorMessage }} </div>
              </div>
              <div class="col-xl-6 row align-items-center">
                <label for="" class="form-label">광고주 이메일</label>
                <div> <input type="text" class="form-control" id="" v-model="reportInfo.recver" placeholder="" /> </div>
                <div v-if="error.resisterRecverErrorMessage.length > 0" id="resisterRecvfeedback" class="invalid-feedback d-block" > {{ error.resisterRecverErrorMessage }} </div>
              </div>
            </div>
            <div class="form-group row">
              <div class="col-xl-12 row align-items-center">
                <label for="" class="form-label">매체</label>
                <div class="send-btn">
                  <button type="button" class="btn" :class="[activeMedia.naver === true ? 'active' : '']" @click="clickMediaBtn($event, 'naver')" > {{getMedia("naver")}} </button>
                  <button type="button" class="btn" :class="[activeMedia.kakaosa === true ? 'active' : '']" @click="clickMediaBtn($event, 'kakaosa')" > {{getMedia("kakaosa")}}</button>
                  <button type="button" class="btn" :class="[activeMedia.kakaomo === true ? 'active' : '']" @click="clickMediaBtn($event, 'kakaomo')" > {{getMedia("kakaomo")}}</button>
                  <button type="button" class="btn" :class="[activeMedia.naverda === true ? 'active' : '']" @click="clickMediaBtn($event, 'naverda')" > {{getMedia("naverda")}}</button>   
                  <button type="button" class="btn" :class="[activeMedia.google === true ? 'active' : '']" @click="clickMediaBtn($event, 'google')" > {{getMedia("google")}}</button>                                   
                </div>
              </div>
            </div>
            <div class="form-group row">
              <div class="col-xl-12 row align-items-center">
                <label for="" class="form-label">광고정보</label>
                <div class="send-btn">
                  <button type="button" class="btn" :class="[activePage.dashboard === true ? 'active' : '']" @click="clickPageBtn($event, 'dashboard')" disabled > 통합대시보드 </button>
                  <button type="button" class="btn" :class="[activePage.mediaAnalysis === true ? 'active' : '']" @click="clickPageBtn($event, 'mediaAnalysis')" > 광고매체분석 </button>
                  <button type="button" class="btn" :class="[activePage.campaignAnalysis === true ? 'active' : '']" @click="clickPageBtn($event, 'campaignAnalysis')" > 캠페인그룹분석 </button>
                  <button type="button" class="btn" :class="[activePage.periodAnalysis === true ? 'active' : '']" @click="clickPageBtn($event, 'periodAnalysis')" > 기간별분석 </button>
                  <button type="button" class="btn" :class="[activePage.keywordAnalysis === true ? 'active' : '']" @click="clickPageBtn($event, 'keywordAnalysis')" > 키워드분석 </button>
                  <button type="button" class="btn" :class="[activePage.adAnalysis === true ? 'active' : '']" @click="clickPageBtn($event, 'adAnalysis')" > 소재별분석 </button>
                  <button type="button" class="btn" :class="[activePage.shoppingAnalysis === true ? 'active' : '']" @click="clickPageBtn($event, 'shoppingAnalysis')" > N쇼핑검색광고 </button>
                </div>
              </div>
            </div>
            <div class="form-group row" hidden>
              <div class="col-xl-12 row align-items-center">
                <label for="" class="form-label">광고성지표</label>
                <div class="send-btn">
                  <draggable v-model="draggable.items" ghost-class="ghost"  @end="dragEnd">
                    <button type="button" class="btn select" v-for="(k,i) in draggable.items" :key="k + i + getUuidv4()" :class="[activeBtn[k.name] === true ? 'active' : '']" @click="clickKpiBtn($event, k.name)">
                      <i class="bi bi-justify"></i> {{ getKpiName(k.name) }}
                    </button>                    
                  </draggable>
                </div>
              </div>
            </div>
            <div class="form-group row">
              <div class="col-xl-12 row align-items-center">
                <label for="" class="form-label align-start mt-2">광고 성과 의견</label>
                <div id="editor"></div>
              </div>
            </div>
          </form>
          <div class="d-flex justify-content-center align-items-center">
            <div class="two-btn">
              <button type="submit" class="btn select-cancel" @click="$router.push('/dashboard')" > 취소 </button>
              <button type="submit" class="btn select-save" @click="addReport"> 저장 </button>
            </div>
          </div>
        </article>
        <article>
          <div class="title"><h3>리포트 내역</h3></div>
          <table class="report send-report">
            <thead>
              <tr>
                <td width="15%" class="text-left">보고서명</td>
                <td width="8%" class="text-left">발송일</td>
                <td width="8%" class="text-left">생성일</td>
                <td width="15%" class="text-left">기준일</td>
                <td width="15%" class="text-left">비교일</td>
                <td width="8%" class="text-left">메일발송여부</td>
                <td width="15%" class="text-left">메일주소</td>
                <td width="8%" class="text-left">다운로드</td>
                <td width="8%" class="text-left">메일 발송</td>
                <td width="8%" class="text-left">예약</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(report, index) in reports" :key="index + getUuidv4()" @click="clickTr(report, $event)" >
                <td class="text-left">{{ report.reportInfo.name }}</td>
                <td class="text-left">{{ report.reportInfo.sendate }}</td>
                <td class="text-left">{{ report.reportInfo.pdfdate }}</td>
                <td class="text-left"> {{ report.reportInfo.start + " ~ " + report.reportInfo.end }} </td>
                <td class="text-left"> {{ report.reportInfo.cstart + " ~ " + report.reportInfo.cend }} </td>
                <td class="text-left">{{ report.reportInfo.sendstatus }}</td>
                <td class="text-left">{{ report.reportInfo.recver }}</td>
                <td class="text-left">
                  <div class="btn-group">
                    <button type="button" class="btn download" @click="clickPdf(report, $event)" >
                      <i class="bi bi-chevron-bar-down m-0"></i>
                    </button>
                  </div>
                </td>
                <td class="text-left">
                  <div class="btn-group">
                    <button type="button" class="btn" @click="clickEmail(report, $event)">
                      <i class="bi bi-reply m-0"></i>
                    </button>
                  </div>
                </td>
                <td class="text-left">
                  <div class="btn-group">
                    <button type="button" class="btn" @click="clickReserveModal(report, $event)" >
                      <i class="bi bi-calendar3 m-0"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <ul class="pagination d-flex justify-content-center align-items-center mb-30">
            <li class="page-item">
              <a class="page-link shadow-none" href="javascript:;" aria-label="Previous" @click="clickPreviousFirstPageBtnForMain" >
                <span aria-hidden="true" ><i class="bi bi-chevron-double-left m-0"></i></span>
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
      </section>
    </div>
    <div class="m m-wrap">
      <mheader ref="mHeader" :pMenu="'dashboard'"></mheader>
      <mfooter ref="mFooter" :pMenu="'dashboard'"></mfooter>
      <section>
        <article class="dashboard-card">
          <div class="title d-flex justify-content-between align-items-center">
            <h3>리포트내역</h3>
            <router-link class="btn" :to="{ path: '/m-report-send-set', query: {}, }">
              <i class="bi bi-plus-square"></i>
            </router-link>
          </div>
          <div v-for="(report, index) in reports" :key="index + getUuidv4()" class="m-table" >
            <ul>
              <div class="m-table-title">
                <div class="w-100"> <li class="font-weight-bold">{{ report.reportInfo.name }}</li> </div>
              </div>
              <div class="m-table-content flex-column">
                <div class="w-100 d-flex flex-wrap">
                  <li class="col-4"> <label for="">생성일</label> </li>
                  <li class="col-8 text-truncate"> <div> {{ report.reportInfo.pdfdate }} </div> </li>
                </div>
                <div class="w-100 d-flex flex-wrap">
                  <li class="col-4"> <label for="">기간</label> </li>
                  <li class="col-8 text-truncate"> <div> {{ report.reportInfo.start + " ~ " + report.reportInfo.end }} </div> </li>
                </div>
                <div class="w-100 d-flex flex-wrap">
                  <li class="col-4"> <label for="">메일발송여부</label> </li>
                  <li class="col-8 text-truncate"> <div> {{ report.reportInfo.sendstatus }} </div> </li>
                </div>
                <div class="w-100 d-flex flex-wrap">
                  <li class="col-4"> <label for="">메일주소</label> </li>
                  <li class="col-8 text-truncate"> <div> {{ report.reportInfo.recver }} </div> </li>
                </div>
                <div class="w-100 d-flex flex-wrap">
                  <button class="btn pdf w-100" @click="clickPdf(report, $event)"> PDF 다운로드 </button>
                </div>
              </div>
            </ul>
          </div>
          <ul class="pagination d-flex justify-content-center align-items-center mb-30">
            <li class="page-item">
              <a class="page-link shadow-none" href="javascript:;" aria-label="Previous" @click="clickPreviousFirstPageBtnForMain" >
                <span aria-hidden="true" ><i class="bi bi-chevron-double-left m-0"></i></span>
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
                <span><i class="bi bi-chevron-double-right m-0"></i></span>
              </a>
            </li>
          </ul>
        </article>
      </section>
      <mbig-menu-2 ref="mBigMenu2" @closeBtn="$refs.mFooter.setFooter('home')" ></mbig-menu-2>
      <mdate-range-picker ref="mDateRangePicker" :pStart="reportInfo.start" :pEnd="reportInfo.end" :pCstart="''" :pCend="''" @changedDate="handleChangedDateRange" @closeBtn="$refs.mFooter.setFooter('home')" > </mdate-range-picker>
      <mbalance ref="mBalance" :pBalance="balance" @closeBtn="$refs.mFooter.setFooter('home')" ></mbalance>
      <malarm ref="mFmenu" @closeBtn="$refs.mFooter.setFooter('home')"></malarm>
      <mfmenu ref="mFmenu" @logout="handleLogOut" @dbedit="$refs.mFooter.clickDbEdit('dashboard-edit')" @closeBtn="$refs.mFooter.setFooter('home')" ></mfmenu>
      <mdashboard-edit ref="mDashboardEdit" @closeBtn="$refs.mFooter.setFooter('home')" ></mdashboard-edit>
    </div>
    <log-out-modal ref="logOutModal" style="display: none"></log-out-modal>
    <expire-session-modal ref="expireSessionModal" style="display: none" ></expire-session-modal>
    <mask-modal ref="maskModal" style="display: none"></mask-modal>
    <!-- <pdf-report-send ref="pdfReportSend" style="display: none" @finishDownload="handleFinishDownload" @finishEmail="handleFinishEmail" @showMask="handleShowMask" @hideMask="handleHideMask" > </pdf-report-send> -->
    <!-- <pdf-report-send-renew ref="pdfReportSendRenew" style="display: none" @finishDownload="handleFinishDownload" @finishEmail="handleFinishEmail" @showMask="handleShowMask" @hideMask="handleHideMask" > </pdf-report-send-renew> -->
    <div class="hidden-print"><pdf-report-send-renew ref="pdfReportSendRenew" @finishDownload="handleFinishDownload" :key="pdfKey"></pdf-report-send-renew></div>
    <reserve-modal ref="reserveModal" style="display: none" @selectedReservation="handleSelectedReservation" ></reserve-modal>
  </div>
</template>

<script>
import $ from "jquery";
import xlsx from "xlsx";
import moment from "moment";
import draggable from "vuedraggable";
import Editor from '@toast-ui/editor';
import {isMobile, priceToString, getMedia, uuidv4, isblank, isNotEmail, isNotTel, getKpiName, sortDraggable, desireDraggable} from "@/assets/js/common.js";
import expireSessionModal from "@/components/modal/expireSessionModal.vue";
import messageModal from "@/components/modal/messageModal.vue";
import maskModal from "@/components/modal/maskModal.vue";
import reserveModal from "@/components/modal/reserveModal.vue";
import message from "@/components/common/message.vue";
import { store } from "@/store/store.js";
import { SHA256 } from "@/assets/js/sha256.js";
import { API_URL, TEMP_KEY } from "@/configs/config.js";
import balance from "@/components/dashboard2/balance.vue";
import bigMenu2 from "@/components/layout/bigMenu2.vue";
import logOutModal from "@/components/modal/logOutModal.vue";
import dateRangePicker from "@/components/common/dateRangePicker.vue";
// import pdfReportSend from "@/components/pdf/pdfReportSend.vue";
import pdfReportSendRenew from "@/components/pdf/pdfReportSendRenew.vue";
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
      pdfKey: 0,
      ajax: null,
      sendStatusSet: { 0: "발송전", 1: "성공", 2: "실패" },
      dropdownMenu: { periodAnalysis: { value: 4 }, kpi: { value: 0 }, },
      reportInfo: { id: 0, name: "희일보고서", start: store.state.dateStore.start, end: store.state.dateStore.end, cstart: null, cend: null, sender: null, number: null, email: null, recver: null, }, 
      main: { field: "", query: null, responseData: null, data: null, start: 0, display: 10, displayPageNum: isMobile() === true ? 5 : 10, sort: "imd", isTotalCount: "-1", pages: [], isFirst: false, isEnd: false },
      activeBtn: { im: true, clk: true, ctr: true, cpc: true, cst: true, cv: true, cvr: true, cr: true, cpa: true, roas: true },
      draggable: {
        items: [
          {name : "im" , title : "노출수"},
          {name : "clk" , title : "클릭수"},
          {name : "ctr" , title : "클릭률"},
          {name : "cpc" , title : "클릭당비용"},
          {name : "cst" , title : "광고비"},
          {name : "cv" , title : "전환수"},
          {name : "cvr" , title : "전환율"},
          {name : "cr" , title : "전환매출"},
          {name : "cpa" , title : "전환당비용"},
          {name : "roas" , title : "ROAS"},
        ],
        dragging: false,
        active: { im: 0, clk: 1, cst: 2, cv: 3, cr: 4, ctr: 5, cpc: 6, cpa: 7, cvr: 8, roas: 9, }
      },
      activeMedia: { naver: true, kakaosa: false, kakaomo: false, naverda: false, google: false, },
      activePage: { dashboard: true, mediaAnalysis: true, campaignAnalysis: false, periodAnalysis: false, keywordAnalysis: false, adAnalysis: false, shoppingAnalysis: false, },
      reports: [],
      balance: [],
      error: { resisterNameErrorMessage: "", resisterSenderErrorMessage: "", resisterNumberErrorMessage: "", resisterEmailErrorMessage: "", resisterRecverErrorMessage: "", },
    };
  },
  computed: {
    getDatasForMain() { return this.main.data; },
    isFirstPageGroupForMain() { return this.main.isFirst; },
    isLastPageGroupForMain() { return this.main.isEnd; },
  },
  watch: {},
  components: { bigMenu2, logOutModal, balance, expireSessionModal, messageModal, maskModal, dateRangePicker, reserveModal, mheader, mfooter, 
  mbigMenu2, mdateRangePicker, mbalance, mfmenu, malarm, mdashboardEdit, draggable, pdfReportSendRenew, message
  },
  mounted() {
    $(".main").removeClass("m-h-100");
    if (store.state.userStore.managerinfo) {
      this.reportInfo.sender = store.state.userStore.managerinfo.username;
      this.reportInfo.number = store.state.userStore.managerinfo.userphone;
      this.reportInfo.email = store.state.userStore.managerinfo.useremail;
    } else {
      this.reportInfo.sender = store.state.userStore.userinfo.username;
      this.reportInfo.number = store.state.userStore.userinfo.userphone;
      this.reportInfo.email = store.state.userStore.userinfo.useremail;
    }
    this.reportInfo.recver = store.state.userStore.userinfo.useremail;
    this.handleChangedDateRange();
    this.clickSearchBtn();
    this.initToastEditor();  
  },
  updated() {},
  methods: {
    clickReserveModal(report, event) { this.$refs.reserveModal.showModal(store.state.userStore.userinfo.userid, report.id); },
    clickRadioPeriodAnalysis(event, value) {
      var vm = this;
      if (vm.dropdownMenu.periodAnalysis.value === value) return false;
      vm.dropdownMenu.periodAnalysis.value = value;
    },
    clickRadioKpi(event, value) {
      var vm = this;
      if (vm.dropdownMenu.kpi.value === value) return false;
      vm.dropdownMenu.kpi.value = value;
    },
    async clickPdf(report, event) {
      event.stopPropagation();
      var vm = this;
      this.handleShowMask();
      await this.$refs.pdfReportSendRenew.initPDF({report: report, email: false, reservation: false});
      var blob = await this.$refs.pdfReportSendRenew.generatePDF(); // 렌더링 완료 후 PDF 생성
      window.open(URL.createObjectURL(blob));      
      this.handleHideMask();
      // this.$refs.pdfReportSendRenew.htmlToPDF(report, false, false);
    },
    clickEmail(report, event) {
      event.stopPropagation();
      // console.log(report);
      var vm = this;
      //this.$refs.pdfReportSendRenew.htmlToPDF(report, true, false);
    },
    clickMediaBtn(event, media) {
      var vm = this;
      vm.activeMedia[media] = !vm.activeMedia[media];

      if (!vm.activeMedia["naver"] && !vm.activeMedia["kakaosa"] && !vm.activeMedia["kakaomo"] && !vm.activeMedia["naverda"] && !vm.activeMedia["google"]) {
        vm.activeMedia[media] = !vm.activeMedia[media];
        alert("최소 1개 매체는 선택해주세요.");
        return false;
      }
    },
    clickPageBtn(event, page) {
      var vm = this;
      vm.activePage[page] = !vm.activePage[page];
    },
    clickKpiBtn(event, btn) {
      var vm = this;
      vm.activeBtn[btn] = !vm.activeBtn[btn];

      if(Object.keys(vm.activeBtn).filter(key => vm.activeBtn[key] === true).length < 1) {
        vm.activeBtn[btn] = !vm.activeBtn[btn];
        alert("최소 1개 지표는 선택해주세요.");
        return false;
      }
    },
    clickSearchBtn() {
      var vm = this;
      var date = this.$refs.dateRangePicker.getDate();
      vm.start = date.start;
      vm.end = date.end;
      vm.main.start = 0;
      vm.getReport();
    },
    clickPreviousFirstPageBtnForMain() {
      var vm = this;
      vm.main.start = 0;
      vm.getReport();
    },
    clickPreviousPageBtnForMain() {
      var vm = this;
      vm.main.start = vm.main.start === 0 ? 0 : vm.main.start - 1;
      vm.getReport();
    },
    clickNextEndPageBtnForMain() {
      var vm = this;
      let tempEndPage = Math.ceil(vm.main.responseData.totalcount / vm.main.display);
      vm.main.start = tempEndPage - 1;
      vm.getReport();
    },
    clickNextPageBtnForMain() {
      var vm = this;
      let tempEndPage = Math.ceil(vm.main.responseData.totalcount / vm.main.display);
      vm.main.start = vm.main.start > tempEndPage ? tempEndPage : vm.main.start + 1;
      vm.getReport();
    },
    clickPageBtnForMain(page) {
      var vm = this;
      vm.main.start = page;
      vm.getReport();
    },
    clickTr(report, event) {
      this.$refs.cdateRangePicker.setDate({ start: report.reportInfo.cstart, end: report.reportInfo.cend, });
      this.$refs.dateRangePicker.setDate({ start: report.reportInfo.start, end: report.reportInfo.end, });
      this.reportInfo.id = report.reportInfo.id;
      this.reportInfo.name = report.reportInfo.name;
      this.reportInfo.sender = report.reportInfo.sender;
      this.reportInfo.number = report.reportInfo.number;
      this.reportInfo.email = report.reportInfo.email;
      this.reportInfo.recver = report.reportInfo.recver;
      this.activeBtn.clk = report.activeBtn.clk;
      this.activeBtn.im = report.activeBtn.im;
      this.activeBtn.cv = report.activeBtn.cv;
      this.activeBtn.cr = report.activeBtn.cr;
      this.activeBtn.ctr = report.activeBtn.ctr;
      this.activeBtn.cpc = report.activeBtn.cpc;
      this.activeBtn.cpa = report.activeBtn.cpa;
      this.activeBtn.cvr = report.activeBtn.cvr;
      this.activeBtn.roas = report.activeBtn.roas;
      this.activeMedia.naver = report.activeMedia.naver;
      this.activeMedia.kakaosa = report.activeMedia.kakaosa;
      this.activeMedia.kakaomo = report.activeMedia.kakaomo;
      this.activeMedia.naverda = report.activeMedia.naverda;
      this.activeMedia.google = report.activeMedia.google;
      this.activePage.dashboard = report.activePage.dashboard;
      this.activePage.mediaAnalysis = report.activePage.mediaAnalysis;
      this.activePage.periodAnalysis = report.activePage.periodAnalysis;
      this.activePage.campaignAnalysis = report.activePage.campaignAnalysis;
      this.activePage.keywordAnalysis = report.activePage.keywordAnalysis;
      this.activePage.adAnalysis = report.activePage.adAnalysis;
      this.activePage.shoppingAnalysis = report.activePage.shoppingAnalysis;
      this.dropdownMenu.periodAnalysis.value = report.dropdownMenu.periodAnalysis;
      this.dropdownMenu.kpi.value = report.dropdownMenu.kpi;
      this.draggable.items = desireDraggable(this.draggable.items, Object.keys(sortDraggable(report.draggable))).slice();
    },    
    handleLogOut() { this.$refs.logOutModal.showModal(); },
    handleExpireSession() { this.$refs.expireSessionModal.showModal(); },
    handleShowMask() { if (this.$refs.maskModal) this.$refs.maskModal.showModal(); },
    handleHideMask() { if (this.$refs.maskModal) this.$refs.maskModal.hideModal(); },
    handleFinishEmail(email) {
      var vm = this;
      var value = null;

      vm.reports.findIndex(function (report, index) { if (report.id === email.id) { value = index; } });
      vm.reports[value].reportInfo.sendate = moment(email.emaildate).format("YYYY-MM-DD");
      vm.reports[value].reportInfo.sendstatus = vm.sendStatusSet[email.sendStatus];
    },
    handleFinishDownload(pdf) {
      // console.log(id, datetime, this.reports);
      var vm = this;
      var value = null;
      vm.reports.findIndex(function (report, index) { if (report.id === pdf.id) { value = index; } });
      vm.reports[value].reportInfo.pdfdate = moment(pdf.pdfdate).format("YYYY-MM-DD");
      $.ajax({
        type: "get", //요청 메소드 방식
        url: API_URL + "/app/reportsend/reportset",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          mode: "upsert",
          name: vm.reports[value].reportInfo.name,
          fromdate: vm.reports[value].reportInfo.start,
          todate: vm.reports[value].reportInfo.end,
          cfromdate: vm.reports[value].reportInfo.cstart,
          ctodate: vm.reports[value].reportInfo.cend,          
          sender: vm.reports[value].reportInfo.sender,
          sendate: 0,
          sendstatus: 0,
          pdfdate: vm.reports[value].reportInfo.pdfdate,
          number: vm.reports[value].reportInfo.number,
          email: vm.reports[value].reportInfo.email,
          recver: vm.reports[value].reportInfo.recver,
          media: "",
          page: "",
          kpi: "",
          id: vm.reports[value].id,
          session: store.state.userStore.session,
        },
        beforeSend: function (data) {
          // vm.$refs.maskModal.showModal();
        },
        success: function (data) {
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
          // vm.$refs.maskModal.hideModal();
        },
      });
    },
    handleSelectedReservation(reservation) {
      let vm = this;
      $.ajax({
        type: "get", //요청 메소드 방식
        url: API_URL + "/app/reportsend/reportsend-reservation",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          mode: "upsert",
          bid: reservation.bid,
          time: moment( reservation.year + " " + reservation.hour + ":" + reservation.minute ).format("YYYY-MM-DD HH:mm"),
          type: reservation.always,
          session: store.state.userStore.session,
        },
        beforeSend: function (data) {
          // vm.showMaskPannelForReport = true;
        },
        success: function (data) {
          if (data.result === "success") {
            let report = vm.reports.find((report) => report.id === reservation.bid);
            vm.$refs.pdfReportSendRenew.htmlToPDF(report, false, true);
            // console.log(data);
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
          vm.$refs.reserveModal.hideModal();
        },
      });
    },
    handleChangedBalance(data) {
      this.balance = [];
      this.balance = data.slice();
    },
    handleChangedDateRange(data) {
      //비교일
      var pstart = "";
      var pend = "";   
      var diff = "";   
      var date = this.$refs.dateRangePicker.getDate();
      if(date === null) return;

      diff = moment(date.end).diff(moment(date.start), "days");
      pstart = moment(date.start).subtract(1 + Number(diff), "days").format("YYYY-MM-DD");
      pend = moment(date.start).subtract(1, "days").format("YYYY-MM-DD");   
      this.$refs.cdateRangePicker.setDate({ start: pstart, end: pend, compare: false, });
    },        
    blurResisterName() {
      this.error.resisterNameErrorMessage = "";
      if (isblank(this.reportInfo.name)) {
        this.error.resisterNameErrorMessage = "보고서명을 입력해주세요.";
        this.ajax = false;
      }
    },
    blurResisterSender() {
      this.error.resisterSenderErrorMessage = "";
      if (isblank(this.reportInfo.sender)) {
        this.error.resisterSenderErrorMessage = "마케터를 입력해주세요.";
        this.ajax = false;
      }
    },
    blurResisterNumber() {
      this.error.resisterNumberErrorMessage = "";
      if (isNotTel(this.reportInfo.number)) {
        this.error.resisterNumberErrorMessage = "휴대번호가 올바르지 않습니다.";
        this.ajax = false;
      }
      // console.log(this.ajax, 'blurResisterTel');
    },
    blurResisterEmail() {
      this.error.resisterEmailErrorMessage = "";
      if (isNotEmail(this.reportInfo.email)) {
        this.error.resisterEmailErrorMessage = "이메일 주소가 올바르지 않습니다.";
        this.ajax = false;
      }
      // console.log(this.ajax, 'blurResisterTel');
    },
    blurResisterRecver() {
      this.error.resisterRecverErrorMessage = "";
      if (isNotEmail(this.reportInfo.recver)) {
        this.error.resisterRecverErrorMessage = "이메일 주소가 올바르지 않습니다.";
        this.ajax = false;
      }
      // console.log(this.ajax, 'blurResisterTel');
    },
    getUuidv4() { return uuidv4(); },
    getKpiName(kpi) { return getKpiName(kpi); },
    getStartAndEndPageForMain() {
      // this.main.isTotalCount !== '0' ? this.main.responseData.totalcount = this.main.isTotalCount : this.main.isTotalCount = this.main.responseData.totalcount;
      var vm = this;
      vm.main.isTotalCount = vm.main.responseData.totalcount;
      vm.main.pages = [];
      var endPage = Math.ceil((vm.main.start + 1) / vm.main.displayPageNum) * vm.main.displayPageNum;
      var startPage = endPage - vm.main.displayPageNum + 1;
      var tempEndPage = Math.ceil(vm.main.responseData.totalcount / vm.main.display);
      if (endPage > tempEndPage) { endPage = tempEndPage; }

      vm.main.isFirst = vm.main.start + 1 === 1 ? true : false;
      vm.main.isEnd = Math.ceil(vm.main.responseData.totalcount / vm.main.display) === vm.main.start + 1 ? true : false;
      for (var i = startPage; i <= endPage; i++) { vm.main.pages.push(i); }
    },    
    getReport() {
      var vm = this;
      var date = vm.$refs.dateRangePicker.getDate();
      $.ajax({
        type: "get", //요청 메소드 방식
        url: API_URL + "/app/reportsend/reportset",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          mode: "get",
          fromdate: date.start,
          todate: date.end,
          start: vm.main.start,
          sort: vm.main.sort,
          display: vm.main.display,
          totalcount: "-1",
          session: store.state.userStore.session,
        },
        beforeSend: function (data) { vm.handleShowMask(); },
        success: function (data) {
          if (data.result === "success") {
            // console.log(data);
            vm.reports = [];
            vm.main.data = [];
            vm.main.responseData = null;
            vm.main.responseData = data;
            vm.main.data = vm.copyObject(data.data.reportset);
            vm.getStartAndEndPageForMain();
            vm.main.data.forEach(function (report, index) {
              vm.reports.push({
                id: report.daily_seq,
                reportInfo: {
                  name: report.name,
                  start: report.period.split("~")[0].trim(),
                  end: report.period.split("~")[1].trim(),
                  cstart: report.cperiod ? report.cperiod.split("~")[0].trim() : moment(report.period.split("~")[0].trim()).subtract(60, "days").format("YYYY-MM-DD"),
                  cend: report.cperiod ? report.cperiod.split("~")[1].trim() : moment(report.period.split("~")[1].trim()).subtract(30, "days").format("YYYY-MM-DD"),                  
                  sender: report.sender,
                  sendate: !report.sendate ? "-" : moment(report.sendate).format("YYYY-MM-DD"),
                  sendstatus: vm.sendStatusSet[report.sendstatus], 
                  pdfdate: !report.pdfdate ? "-" : moment(report.pdfdate).format("YYYY-MM-DD"),
                  number: report.number,
                  email: report.email,
                  recver: report.recver,
                },
                activeBtn: {
                  clk: report.clk ? true : false,
                  im: report.im ? true : false,
                  cst: report.cst ? true : false,
                  cv: report.cv ? true : false,
                  cr: report.cr ? true : false,
                  ctr: report.ctr ? true : false,
                  cpc: report.cpc ? true : false,
                  cpa: report.cpa ? true : false,
                  cvr: report.cvr ? true : false,
                  roas: report.roas ? true : false,
                },
                activeMedia: {
                  naver: report.naver ? true : false,
                  kakaosa: report.kakaosa ? true : false,
                  kakaomo: report.kakaomo ? true : false,
                  naverda: report.naverda ? true : false,
                  google: report.google ? true : false,
                },
                activePage: {
                  dashboard: report.dashboard ? true : false,
                  mediaAnalysis: report.mediaAnalysis ? true : false,
                  periodAnalysis: report.periodAnalysis ? true : false,
                  campaignAnalysis: report.campaignAnalysis ? true : false,
                  keywordAnalysis: report.keywordAnalysis ? true : false,
                  adAnalysis: report.adAnalysis ? true : false,
                  shoppingAnalysis: report.shoppingAnalysis ? true : false,
                },
                dropdownMenu: {
                  periodAnalysis: report.targets.length ? report.targets[0].s_1 : 0, //기간별분석
                  kpi: report.targets.length ? report.targets[0].s_2 : 0, //정렬
                },
                draggable: {
                  im: report.targets.length ? Number(report.targets[0].s_3.split(",")[0]) : 0,
                  clk: report.targets.length ? Number(report.targets[0].s_3.split(",")[1]) : 0,
                  ctr: report.targets.length ? Number(report.targets[0].s_3.split(",")[2]) : 0,
                  cpc: report.targets.length ? Number(report.targets[0].s_3.split(",")[3]) : 0,
                  cst: report.targets.length ? Number(report.targets[0].s_3.split(",")[4]) : 0,
                  cv: report.targets.length ? Number(report.targets[0].s_3.split(",")[5]) : 0,
                  cvr: report.targets.length ? Number(report.targets[0].s_3.split(",")[6]) : 0,
                  cr: report.targets.length ? Number(report.targets[0].s_3.split(",")[7]) : 0,
                  cpa: report.targets.length ? Number(report.targets[0].s_3.split(",")[8]) : 0,
                  roas: report.targets.length ? Number(report.targets[0].s_3.split(",")[9]) : 0,              
                }
              });
            });
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
          vm.handleHideMask();
          // vm.showMaskPannelForReport = false;
        },
      });
    },      
    getTest() {
      let items = [
        {name : "im" , title : "노출수"},
        {name : "clk" , title : "클릭수"},
        {name : "ctr" , title : "클릭률"},
        {name : "cpc" , title : "클릭당비용"},
        {name : "cst" , title : "광고비"},
        {name : "cv" , title : "전환수"},
        {name : "cvr" , title : "전환율"},
        {name : "cr" , title : "전환매출"},
        {name : "cpa" , title : "전환당비용"},
        {name : "roas" , title : "ROAS"},
      ]

      return desireDraggable(items, Object.keys(this.draggable.active));
    },
    getMedia(media) { return getMedia(media);},
    addReport() {
      var vm = this;
      vm.ajax = true;
      vm.validate();

      if (!vm.ajax) return false;

      var date = vm.$refs.dateRangePicker.getDate();
      var cdate = vm.$refs.cdateRangePicker.getDate();
      vm.start = date.start;
      vm.end = date.end;
      // vm.cstart = cdate.cstart;
      // vm.cend = cdate.cend;
      // console.log(vm.start,vm.cstart);
      var media = ""; //네이버검색광고, 카카오검색광고, 카카오모먼트
      var keys = Object.keys(vm.activeMedia);
      keys.forEach(function (key, index) {
        vm.activeMedia[key] ? (media += "1") : (media += "0");
        if (keys.length - 1 !== index) media += ",";
      });

      var page = ""; //통합대시보드, 광고매체분석, 캠페인그룹분석, 기간별분석, 키워드분석, 소재별분석
      var keys = Object.keys(vm.activePage);
      keys.forEach(function (key, index) {
        vm.activePage[key] ? (page += "1") : (page += "0");
        if (keys.length - 1 !== index) page += ",";
      });

      var kpi = ""; //노출수, 클릭수, 클릭률, 클릭당비용, 광고비, 전환수, 전환율, 전환매출, 전환당비용, ROAS
      var drag = "";
      var keys = Object.keys(vm.activeBtn);
      keys.forEach(function (key, index) {
        vm.activeBtn[key] ? (kpi += "1") : (kpi += "0");
        vm.draggable.items.find(function (item, i) { if(item.name === key) drag += i; });

        if (keys.length - 1 !== index) {
          kpi += ",";
          drag += ",";
        }
      });

      /**
       * 기간별분석(시간별-1, 요일별-2, 일별-3, 월별-4, 주차별-5),
       * 정렬(광고비-1, 노출수-2, 클릭수-3, 전환수-4, 전환율-5, 전환매출-6, 클릭율-7, 전환당비용-8, 클릭당비용-9, roas-10)
       */
      var dropdownMenu = "";
      var keys = Object.keys(vm.dropdownMenu);
      keys.forEach(function (key, index) {
        var value = vm.dropdownMenu[key].value;
        if (key === "periodAnalysis" && vm.dropdownMenu[key].value === 0) value = 1;
        if (key === "kpi" && vm.dropdownMenu[key].value === 0) value = 2;

        dropdownMenu += value;
        if (keys.length - 1 !== index) dropdownMenu += ",";
      });

      $.ajax({
        type: "get", //요청 메소드 방식
        url: API_URL + "/app/reportsend/reportset",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          mode: "upsert",
          name: vm.reportInfo.name,
          fromdate: vm.start,
          todate: vm.end,
          cfromdate: cdate.start,
          ctodate: cdate.end,
          sender: vm.reportInfo.sender,
          sendate: 0,
          sendstatus: 0,
          pdfdate: 0,
          number: vm.reportInfo.number,
          email: vm.reportInfo.email,
          recver: vm.reportInfo.recver,
          media: media,
          page: page,
          kpi: kpi,
          dropdownmenu: dropdownMenu,
          drag: drag,
          id: "-1",
          session: store.state.userStore.session,
        },
        beforeSend: function (data) {
          vm.$refs.maskModal.showModal();
        },
        success: function (data) {
          // console.log(data);
          vm.initForm();
          vm.clickSearchBtn();
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
    dragEnd(e) { },  
    copyObject(object) { return JSON.parse(JSON.stringify(object)); }, 
    initForm() {
      this.reportInfo.id = 0;
      this.reportInfo.name = "희일보고서";
      if (store.state.userStore.managerinfo) {
        this.reportInfo.sender = store.state.userStore.managerinfo.username;
        this.reportInfo.number = store.state.userStore.managerinfo.userphone;
        this.reportInfo.email = store.state.userStore.managerinfo.useremail;
      } else {
        this.reportInfo.sender = store.state.userStore.userinfo.username;
        this.reportInfo.number = store.state.userStore.userinfo.userphone;
        this.reportInfo.email = store.state.userStore.userinfo.useremail;
      }
      this.reportInfo.recver = store.state.userStore.userinfo.useremail;

      this.activeBtn.clk = true;
      this.activeBtn.im = true;
      this.activeBtn.cv = false;
      this.activeBtn.cr = false;
      this.activeBtn.ctr = true;
      this.activeBtn.cpc = true;
      this.activeBtn.cpa = false;
      this.activeBtn.cvr = false;
      this.activeBtn.roas = false;
      this.activeMedia.naver = true;
      this.activeMedia.kakaosa = false;
      this.activeMedia.kakaomo = false;
      this.activeMedia.naverda = false;
      this.activeMedia.google = false;
      this.activePage.dashboard = true;
      this.activePage.mediaAnalysis = true;
      this.activePage.periodAnalysis = false;
      this.activePage.campaignAnalysis = false;
      this.activePage.keywordAnalysis = false;
      this.activePage.adAnalysis = false;
      this.activePage.shoppingAnalysis = false;
      // this.dropdownMenu.periodAnalysis = 0;
      // this.dropdownMenu.kpi = 0;
    },  
    initToastEditor() {
      var editor = new Editor({
        el: document.querySelector('#editor'),
        height: '500px',
        initialEditType: 'markdown',
        previewStyle: 'vertical'
      });
      editor.getMarkdown();  
    },
    activeMain(flag) {
      this.$emit("mountedMain", true);
      this.$emit("mountedDasyboad", true);
    },         
    validate() {
      this.blurResisterName();
      this.blurResisterSender();
      this.blurResisterNumber();
      this.blurResisterEmail();
      this.blurResisterRecver();
    },   
    priceToString(salse) {
      if (salse === undefined) return "";
      return priceToString(salse);
    },     
  },
};
</script>

<style scoped></style>
