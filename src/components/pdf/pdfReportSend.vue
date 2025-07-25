<template>
  <article :id="getUniqueId" class="">
    <div ref="pdfArea" class="main container-total-pdf" :key="pdfKey"> 
      <div class="pdf-a4-l pdf-section-1">
        <section class="d-flex justify-content-between pdf-card pdf-card-1">
          <div class="title mb-0">
            <h2>HEEIL<br />REPORT</h2>
            <div class="b-l"></div>
          </div>
          <div class="logo"> <img src="@/assets/image/pdf_main_logo.png" height="35" /> </div>
        </section>
        <section class="d-flex justify-content-between pdf-card pdf-card-2">
          <div class="adv">
            <template v-if="report">
              <h3 class="bold">
                {{ report.reportInfo.name }}
                <span>{{ " | " + report.reportInfo.start + " ~ " + report.reportInfo.end + "" }}</span>
              </h3>
            </template>
          </div>
        </section>
        <section class="d-flex justify-content-between pdf-card pdf-card-3">
          <div class="footer b-p">
            <template v-if="report">
              <h3 class="pl-3"> {{ report.reportInfo.sender }} <span></span> </h3>
              <ul class="pl-3">
                <li> 휴대전화 <span>{{ report.reportInfo.number }}</span> </li>
                <li> 이메일 <span>{{ report.reportInfo.email }}</span> </li>
              </ul>
            </template>
          </div>
        </section>
      </div>
      <!-- 대시보드 -->
      <template v-if="report && report.activePage.dashboard">
        <d-article-total :pReport="report" @finished="hfinished" :key="rendering.dKey + getUuidv4()"></d-article-total>
      </template>
      <!-- 광고매체분석 - 전체 -->
      <template v-if="report && report.activePage.mediaAnalysis && isOneMedia() === false">
        <md-article-total :pReport="report" @finished="hfinished" :key="rendering.mdKey + getUuidv4()"></md-article-total>
      </template>
      <!-- 광고매체분석 - 네이버, 카카오, 구글 검색 -->
      <template v-if="report &&report.activePage.mediaAnalysis && (report.activeMedia.naver || report.activeMedia.kakaosa || report.activeMedia.google)">
        <md-article-sa :pReport="report" @finished="hfinished" @rendering="hrendering" :key="rendering.mdKey + getUuidv4()"></md-article-sa>
      </template>
      <!-- 광고매체분석 - 카카오 모먼트, GFA -->
      <template v-if="report && report.activePage.mediaAnalysis && (report.activeMedia.kakaomo || report.activeMedia.naverda)">
        <md-article-da :pReport="report" @finished="hfinished" @rendering="hrendering" :key="rendering.mdKey + getUuidv4()"></md-article-da>
      </template>
      <!-- 캠페인그룹분석 - 전체 -->
      <template v-if="report && report.activePage.campaignAnalysis && isOneMedia() === false">
        <cp-article-total :pReport="report" @finished="hfinished" @rendering="hrendering" :key="rendering.cpKey + getUuidv4()"></cp-article-total>
      </template>
      <!-- 캠페인그룹분석 - 네이버 -->
      <template v-if="report && report.activePage.campaignAnalysis && report.activeMedia.naver">
        <cp-article-naver-sa :pReport="report" @finished="hfinished" @rendering="hrendering" :key="rendering.cpKey + getUuidv4()"></cp-article-naver-sa>
      </template>
      <!-- 캠페인그룹분석 - 카카오 검색광고 -->
      <template v-if="report && report.activePage.campaignAnalysis && report.activeMedia.kakaosa">
        <cp-article-kakao-sa :pReport="report" @finished="hfinished" @rendering="hrendering" :key="rendering.cpKey + getUuidv4()"></cp-article-kakao-sa>
      </template>
      <!-- 캠페인그룹분석 - 카카오 모먼트 -->
      <template v-if="report && report.activePage.campaignAnalysis && report.activeMedia.kakaomo">
        <cp-article-kakao-da :pReport="report" @finished="hfinished" @rendering="hrendering" :key="rendering.cpKey + getUuidv4()"></cp-article-kakao-da>
      </template>
      <!-- 캠페인그룹분석 - GFA -->
      <template v-if="report && report.activePage.campaignAnalysis && report.activeMedia.naverda">
        <cp-article-naver-da :pReport="report" @finished="hfinished" @rendering="hrendering" :key="rendering.cpKey + getUuidv4()"></cp-article-naver-da>
      </template>
      <!-- 캠페인그룹분석 - Google -->
      <template v-if="report && report.activePage.campaignAnalysis && report.activeMedia.google">
        <cp-article-google-sa :pReport="report" @finished="hfinished" @rendering="hrendering" :key="rendering.cpKey + getUuidv4()"></cp-article-google-sa>
      </template>      
      <!-- 기간별 분석 - 전체(시간별) -->
      <template v-if="report && report.activePage.periodAnalysis && isOneMedia() === false && dropdownMenu.periodAnalysis.value === 'hour'">
        <ph-article-total :pReport="report" @finished="hfinished" @rendering="hrendering" :key="rendering.pKey + getUuidv4()"></ph-article-total>
      </template>
      <!-- 기간별 분석 - 전체(요일별) -->
      <template v-if="report && report.activePage.periodAnalysis && isOneMedia() === false && dropdownMenu.periodAnalysis.value === 'dayweek'">
        <pdw-article-total :pReport="report" @finished="hfinished" @rendering="hrendering" :key="rendering.pKey + getUuidv4()"></pdw-article-total>
      </template>
      <!-- 기간별 분석 - 전체(월별) -->
      <template v-if="report && report.activePage.periodAnalysis && isOneMedia() === false && dropdownMenu.periodAnalysis.value === 'month'">
        <pm-article-total :pReport="report" @finished="hfinished" @rendering="hrendering" :key="rendering.pKey + getUuidv4()"></pm-article-total>
      </template>
      <!-- 기간별 분석 - 전체(일별) -->
      <template v-if="report && report.activePage.periodAnalysis && isOneMedia() === false && dropdownMenu.periodAnalysis.value === 'day'">
        <pd-article-total :pReport="report" @finished="hfinished" @rendering="hrendering" :key="rendering.pKey + getUuidv4()"></pd-article-total>
      </template>
      <!-- 기간별 분석 - 네이버(시간별) -->
      <template v-if="report && report.activePage.periodAnalysis && report.activeMedia.naver && dropdownMenu.periodAnalysis.value === 'hour'">
        <ph-article-naver-sa :pReport="report" @finished="hfinished" @rendering="hrendering" :key="rendering.pKey + getUuidv4()"></ph-article-naver-sa>
      </template>
      <!-- 기간별 분석 - 네이버(요일별) -->
      <template v-if="report && report.activePage.periodAnalysis &&  report.activeMedia.naver &&  dropdownMenu && dropdownMenu.periodAnalysis.value === 'dayweek'">
        <pdw-article-naver-sa :pReport="report" @finished="hfinished" @rendering="hrendering" :key="rendering.pKey + getUuidv4()"></pdw-article-naver-sa>
      </template>
      <!-- 기간별 분석 - 네이버(월별) -->
      <template v-if="report && report.activePage.periodAnalysis && report.activeMedia.naver && dropdownMenu && dropdownMenu.periodAnalysis.value === 'month'">
        <pm-article-naver-sa :pReport="report" @finished="hfinished" @rendering="hrendering" :key="rendering.pKey + getUuidv4()"></pm-article-naver-sa>
      </template>
      <!-- 기간별 분석 - 네이버(일별) -->
      <template v-if="report &&  report.activePage.periodAnalysis && report.activeMedia.naver && dropdownMenu && dropdownMenu.periodAnalysis.value === 'day'">
        <pd-article-naver-sa :pReport="report" @finished="hfinished" @rendering="hrendering" :key="rendering.pKey + getUuidv4()"></pd-article-naver-sa>
      </template>
      <!-- 기간별 분석 - 카카오 검색광고(시간별) -->
      <template v-if="report && report.activePage.periodAnalysis && report.activeMedia.kakaosa && dropdownMenu && dropdownMenu.periodAnalysis.value === 'hour'">
        <ph-article-kakao-sa :pReport="report" @finished="hfinished" @rendering="hrendering" :key="rendering.pKey + getUuidv4()"></ph-article-kakao-sa>
      </template>
      <!-- 기간별 분석 - 카카오 검색광고(요일별) -->
      <template v-if="report && report.activePage.periodAnalysis && report.activeMedia.kakaosa && dropdownMenu && dropdownMenu.periodAnalysis.value === 'dayweek'">
        <pdw-article-kakao-sa :pReport="report" @finished="hfinished" @rendering="hrendering" :key="rendering.pKey + getUuidv4()"></pdw-article-kakao-sa>
      </template>
      <!-- 기간별 분석 - 카카오 검색광고(월별) -->
      <template v-if="report && report.activePage.periodAnalysis && report.activeMedia.kakaosa && dropdownMenu && dropdownMenu.periodAnalysis.value === 'month'">
        <pm-article-kakao-sa :pReport="report" @finished="hfinished" @rendering="hrendering" :key="rendering.pKey + getUuidv4()"></pm-article-kakao-sa>
      </template>
      <!-- 기간별 분석 - 카카오 검색광고(일별) -->
      <template v-if="report && report.activePage.periodAnalysis && report.activeMedia.kakaosa && dropdownMenu && dropdownMenu.periodAnalysis.value === 'day'">
        <pd-article-kakao-sa :pReport="report" @finished="hfinished" @rendering="hrendering" :key="rendering.pKey + getUuidv4()"></pd-article-kakao-sa>
      </template>
      <!-- 기간별 분석 - 카카오 모먼트(시간별) -->
      <template v-if="report && report.activePage.periodAnalysis && report.activeMedia.kakaomo && dropdownMenu && dropdownMenu.periodAnalysis.value === 'hour'">
        <ph-article-kakao-da :pReport="report" @finished="hfinished" @rendering="hrendering" :key="rendering.pKey + getUuidv4()"></ph-article-kakao-da>
      </template>
      <!-- 기간별 분석 - 카카오 모먼트(요일별) -->
      <template v-if="report && report.activePage.periodAnalysis && report.activeMedia.kakaomo && dropdownMenu && dropdownMenu.periodAnalysis.value === 'dayweek'">
        <pdw-article-kakao-da :pReport="report" @finished="hfinished" @rendering="hrendering" :key="rendering.pKey + getUuidv4()"></pdw-article-kakao-da>
      </template>
      <!-- 기간별 분석 - 카카오 모먼트(월별) -->
      <template v-if="report && report.activePage.periodAnalysis && report.activeMedia.kakaomo && dropdownMenu && dropdownMenu.periodAnalysis.value === 'month'">
        <pm-article-kakao-da :pReport="report" @finished="hfinished" @rendering="hrendering" :key="rendering.pKey + getUuidv4()"></pm-article-kakao-da>
      </template>
      <!-- 기간별 분석 - 카카오 모먼트(일별) -->
      <template v-if="report && report.activePage.periodAnalysis && report.activeMedia.kakaomo && dropdownMenu && dropdownMenu.periodAnalysis.value === 'day'">
        <pd-article-kakao-da :pReport="report" @finished="hfinished" @rendering="hrendering" :key="rendering.pKey + getUuidv4()"></pd-article-kakao-da>
      </template>
      <!-- 기간별 분석 - GFA(시간별) -->
      <template v-if="report && report.activePage.periodAnalysis && report.activeMedia.naverda && dropdownMenu && dropdownMenu.periodAnalysis.value === 'hour'">
        <ph-article-naver-da :pReport="report" @finished="hfinished" @rendering="hrendering" :key="rendering.pKey + getUuidv4()"></ph-article-naver-da>
      </template>
      <!-- 기간별 분석 - GFA(요일별) -->
      <template v-if="report && report.activePage.periodAnalysis && report.activeMedia.naverda && dropdownMenu && dropdownMenu.periodAnalysis.value === 'dayweek'">
        <pdw-article-naver-da :pReport="report" @finished="hfinished" @rendering="hrendering" :key="rendering.pKey + getUuidv4()"></pdw-article-naver-da>
      </template>
      <!-- 기간별 분석 - GFA(월별) -->
      <template v-if="report && report.activePage.periodAnalysis && report.activeMedia.naverda && dropdownMenu && dropdownMenu.periodAnalysis.value === 'month'">
        <pm-article-naver-da :pReport="report" @finished="hfinished" @rendering="hrendering" :key="rendering.pKey + getUuidv4()"></pm-article-naver-da>
      </template>
      <!-- 기간별 분석 - GFA(일별) -->
      <template v-if="report && report.activePage.periodAnalysis && report.activeMedia.naverda && dropdownMenu && dropdownMenu.periodAnalysis.value === 'day'">
        <pd-article-naver-da :pReport="report" @finished="hfinished" @rendering="hrendering" :key="rendering.pKey + getUuidv4()"></pd-article-naver-da>
      </template>
      <!-- 기간별 분석 - 구글(시간별) -->
      <template v-if="report && report.activePage.periodAnalysis && report.activeMedia.google && dropdownMenu.periodAnalysis.value === 'hour'">
        <ph-article-google-sa :pReport="report" @finished="hfinished" @rendering="hrendering" :key="rendering.pKey + getUuidv4()"></ph-article-google-sa>
      </template>      
      <!-- 기간별 분석 - 구글(요일별) -->
      <template v-if="report && report.activePage.periodAnalysis && report.activeMedia.google && dropdownMenu && dropdownMenu.periodAnalysis.value === 'dayweek'">
        <pdw-article-google-sa :pReport="report" @finished="hfinished" @rendering="hrendering" :key="rendering.pKey + getUuidv4()"></pdw-article-google-sa>
      </template>      
      <!-- 기간별 분석 - 구글(월별) -->
      <template v-if="report && report.activePage.periodAnalysis && report.activeMedia.google && dropdownMenu && dropdownMenu.periodAnalysis.value === 'month'">
        <pm-article-google-sa :pReport="report" @finished="hfinished" @rendering="hrendering" :key="rendering.pKey + getUuidv4()"></pm-article-google-sa>
      </template>      
      <!-- 기간별 분석 - 구글(일별) -->
      <template v-if="report &&  report.activePage.periodAnalysis && report.activeMedia.google && dropdownMenu && dropdownMenu.periodAnalysis.value === 'day'">
        <pd-article-google-sa :pReport="report" @finished="hfinished" @rendering="hrendering" :key="rendering.pKey + getUuidv4()"></pd-article-google-sa>
      </template>      
      <!-- 키워드 분석 - 전체(키워드) -->
      <template v-if="report && report.activePage.keywordAnalysis && isOneMedia() === false">
        <k-article-total :pReport="report" :pDropdownMenu="dropdownMenu" @finished="hfinished" @rendering="hrendering" :key="rendering.kKey + getUuidv4()"></k-article-total>
      </template>
      <!-- 키워드 분석 - 네이버(키워드) -->
      <template v-if="report && report.activePage.keywordAnalysis && report.activeMedia.naver">
        <k-article-naver-sa :pReport="report" :pDropdownMenu="dropdownMenu" @finished="hfinished" @rendering="hrendering" :key="rendering.kKey + getUuidv4()"></k-article-naver-sa>
      </template>
      <!-- 키워드 분석 - 카카오 검색(키워드) -->
      <template v-if="report && report.activePage.keywordAnalysis && report.activeMedia.kakaosa">
        <k-article-kakao-sa :pReport="report" :pDropdownMenu="dropdownMenu" @finished="hfinished" @rendering="hrendering" :key="rendering.kKey + getUuidv4()"></k-article-kakao-sa>
      </template>
      <!-- 키워드 분석 - 구글(키워드) -->
      <template v-if="report && report.activePage.keywordAnalysis && report.activeMedia.google">
        <k-article-google-sa :pReport="report" :pDropdownMenu="dropdownMenu" @finished="hfinished" @rendering="hrendering" :key="rendering.kKey + getUuidv4()"></k-article-google-sa>
      </template>      
      <!-- 소재별 분석 - 전체(보고서) -->
      <template v-if="report && report.activePage.adAnalysis && isOneMedia() === false">
        <ad-article-total :pReport="report" :pDropdownMenu="dropdownMenu" @finished="hfinished" @rendering="hrendering" :key="rendering.adKey + getUuidv4()"></ad-article-total>
      </template>
      <!-- 소재별 분석 - 네이버(보고서) -->
      <template v-if="report && report.activePage.adAnalysis && report.activeMedia.naver">
        <ad-article-naver-sa :pReport="report" :pDropdownMenu="dropdownMenu" @finished="hfinished" @rendering="hrendering" :key="rendering.adKey + getUuidv4()"></ad-article-naver-sa>
      </template>
      <!-- 소재별 분석 - 카카오 검색(보고서) -->
      <template v-if="report && report.activePage.adAnalysis && report.activeMedia.kakaosa">
        <ad-article-kakao-sa :pReport="report" :pDropdownMenu="dropdownMenu" @finished="hfinished" @rendering="hrendering" :key="rendering.adKey + getUuidv4()"></ad-article-kakao-sa>
      </template>
      <!-- 소재별 분석 - 카카오 모먼트(보고서) -->
      <template v-if="report && report.activePage.adAnalysis && report.activeMedia.kakaomo">
        <ad-article-kakao-da :pReport="report" :pDropdownMenu="dropdownMenu" @finished="hfinished" @rendering="hrendering" :key="rendering.adKey + getUuidv4()"></ad-article-kakao-da>
      </template>
      <!-- 소재별 분석 - GFA(보고서) -->
      <template v-if="report && report.activePage.adAnalysis && report.activeMedia.naverda">
        <ad-article-naver-da :pReport="report" :pDropdownMenu="dropdownMenu" @finished="hfinished" @rendering="hrendering" :key="rendering.adKey + getUuidv4()"></ad-article-naver-da>
      </template>
      <!-- 소재별 분석 - 구글(보고서) -->
      <template v-if="report && report.activePage.adAnalysis && report.activeMedia.google">
        <ad-article-google-da :pReport="report" :pDropdownMenu="dropdownMenu" @finished="hfinished" @rendering="hrendering" :key="rendering.adKey + getUuidv4()"></ad-article-google-da>
      </template>      
      <!-- N쇼핑검색광고 - 네이버(보고서) -->
      <template v-if="report && report.activePage.shoppingAnalysis && report.activeMedia.naver">
        <sad-article-naver-sa :pReport="report" :pDropdownMenu="dropdownMenu" @finished="hfinished" @rendering="hrendering" :key="rendering.sadKey + getUuidv4()"></sad-article-naver-sa>
      </template>
    </div>
  </article>
</template>

<script>
import $ from "jquery";
import moment from "moment";
import * as echarts from "echarts";
import { clearBody, addClassDashboard, priceToString, getMedia, getApp, uuidv4, sortWeekDay, isEmptyObject, getDateStr2, downloadImage, toDataURL} from "@/assets/js/common.js";
import { htmlToPdf } from "@/assets/js/htmlToPdfForFile.js";
import { store } from "@/store/store.js";
import { SHA256 } from "@/assets/js/sha256.js";
import { API_URL, TEMP_KEY, SUMMARY_SORT, MEDIA_SORT } from "@/configs/config.js";
import dArticleTotal from "@/components/pdf/section/dashboard/articleTotal.vue";
import mdArticleTotal from "@/components/pdf/section/media/articleTotal.vue";
import mdArticleSa from "@/components/pdf/section/media/articleSa.vue";
import mdArticleDa from "@/components/pdf/section/media/articleDa.vue";
import cpArticleTotal from "@/components/pdf/section/campaign/articleTotal.vue";
import cpArticleNaverSa from "@/components/pdf/section/campaign/articleNaverSa.vue";
import cpArticleKakaoSa from "@/components/pdf/section/campaign/articleKakaoSa.vue";
import cpArticleKakaoDa from "@/components/pdf/section/campaign/articleKakaoDa.vue";
import cpArticleNaverDa from "@/components/pdf/section/campaign/articleNaverDa.vue";
import cpArticleGoogleSa from "@/components/pdf/section/campaign/articleGoogleSa.vue";
import phArticleTotal from "@/components/pdf/section/period/articleHourTotal.vue";
import phArticleNaverSa from "@/components/pdf/section/period/articleHourNaverSa.vue";
import phArticleKakaoSa from "@/components/pdf/section/period/articleHourKakaoSa.vue";
import phArticleGoogleSa from "@/components/pdf/section/period/articleHourGoogleSa.vue";
import phArticleKakaoDa from "@/components/pdf/section/period/articleHourKakaoDa.vue";
import phArticleNaverDa from "@/components/pdf/section/period/articleHourNaverDa.vue";
import pdArticleTotal from "@/components/pdf/section/period/articleDayTotal.vue";
import pdArticleNaverSa from "@/components/pdf/section/period/articleDayNaverSa.vue";
import pdArticleKakaoSa from "@/components/pdf/section/period/articleDayKakaoSa.vue";
import pdArticleGoogleSa from "@/components/pdf/section/period/articleDayGoogleSa.vue";
import pdArticleKakaoDa from "@/components/pdf/section/period/articleDayKakaoDa.vue";
import pdArticleNaverDa from "@/components/pdf/section/period/articleDayNaverDa.vue";
import pmArticleTotal from "@/components/pdf/section/period/articleMonthTotal.vue";
import pmArticleNaverSa from "@/components/pdf/section/period/articleMonthNaverSa.vue";
import pmArticleKakaoSa from "@/components/pdf/section/period/articleMonthKakaoSa.vue";
import pmArticleGoogleSa from "@/components/pdf/section/period/articleMonthGoogleSa.vue";
import pmArticleKakaoDa from "@/components/pdf/section/period/articleMonthKakaoDa.vue";
import pmArticleNaverDa from "@/components/pdf/section/period/articleMonthNaverDa.vue";
import pdwArticleTotal from "@/components/pdf/section/period/articleDwTotal.vue";
import pdwArticleNaverSa from "@/components/pdf/section/period/articleDwNaverSa.vue";
import pdwArticleKakaoSa from "@/components/pdf/section/period/articleDwKakaoSa.vue";
import pdwArticleGoogleSa from "@/components/pdf/section/period/articleDwGoogleSa.vue";
import pdwArticleKakaoDa from "@/components/pdf/section/period/articleDwKakaoDa.vue";
import pdwArticleNaverDa from "@/components/pdf/section/period/articleDwNaverDa.vue";
import kArticleTotal from "@/components/pdf/section/keyword/articleTotal.vue";
import kArticleNaverSa from "@/components/pdf/section/keyword/articleNaverSa.vue";
import kArticleKakaoSa from "@/components/pdf/section/keyword/articleKakaoSa.vue";
import kArticleGoogleSa from "@/components/pdf/section/keyword/articleGoogleSa.vue";
import adArticleTotal from "@/components/pdf/section/ad/articleTotal.vue";
import adArticleNaverSa from "@/components/pdf/section/ad/articleNaverSa.vue";
import adArticleKakaoSa from "@/components/pdf/section/ad/articleKakaoSa.vue";
import adArticleKakaoDa from "@/components/pdf/section/ad/articleKakaoDa.vue";
import adArticleNaverDa from "@/components/pdf/section/ad/articleNaverDa.vue";
import adArticleGoogleDa from "@/components/pdf/section/ad/articleGoogleDa.vue";
import sadArticleNaverSa from "@/components/pdf/section/sad/articleNaverSa.vue";
import "@/assets/css/pdf.total.main.css";

export default {
  props: {},
  data() {
    return {
      uniqueId: null,
      pdfKey: 0,
      report: null,
      email: false,
      reservation: false,
      rendering: {
        summary: false,
        summarymedia: false,
        period: false,
        summarymediarate: false,
        mediareport: false,
        dKey: 0,
        mdKey: 0,
        cpKey: 0,
        pKey: 0,
        kKey: 0,
        sadKey: 0,
        adKey: 0,
        crossGraphMediaTotalOne: false,
        crossGraphMediaTotalTwo: false,
        crossGraphMediaOnenaver: false,
        crossGraphMediaTwonaver: false,
        crossGraphMediaOnekakaosa: false,
        crossGraphMediaTwokakaosa: false,
        crossGraphMediaOnekakaomo: false,
        crossGraphMediaTwokakaomo: false,
        crossGraphMediaOnenaverda: false,
        crossGraphMediaTwonaverda: false,   
        crossGraphMediaOnegoogle: false,
        crossGraphMediaTwogoogle: false,              
        crossGraphCampaignTotalOne: false,
        crossGraphCampaignTotalTwo: false,
        crossGraphCampaignOnenaver: false,
        crossGraphCampaignTwonaver: false,
        crossGraphCampaignOnekakaosa: false,
        crossGraphCampaignTwokakaosa: false,
        crossGraphCampaignOnekakaomo: false,
        crossGraphCampaignTwokakaomo: false,
        crossGraphCampaignOnenaverda: false,
        crossGraphCampaignTwonaverda: false,   
        crossGraphCampaignOnegoogle: false,
        crossGraphCampaignTwogoogle: false,              
        crossGraphPeriodTotalOnehour: false,
        crossGraphPeriodTotalTwohour: false,
        crossGraphPeriodTotalOnedayweek: false,
        crossGraphPeriodTotalTwodayweek: false,
        crossGraphPeriodTotalOneday: false,
        crossGraphPeriodTotalTwoday: false,
        crossGraphPeriodTotalOnemonth: false,
        crossGraphPeriodTotalTwomonth: false,
        crossGraphPeriodOnehournaver: false,
        crossGraphPeriodTwohournaver: false,
        crossGraphPeriodOnedayweeknaver: false,
        crossGraphPeriodTwodayweeknaver: false,
        crossGraphPeriodOnedaynaver: false,
        crossGraphPeriodTwodaynaver: false,
        crossGraphPeriodOnemonthnaver: false,
        crossGraphPeriodTwomonthnaver: false,
        crossGraphPeriodOnehourkakaosa: false,
        crossGraphPeriodTwohourkakaosa: false,
        crossGraphPeriodOnedayweekkakaosa: false,
        crossGraphPeriodTwodayweekkakaosa: false,
        crossGraphPeriodOnedaykakaosa: false,
        crossGraphPeriodTwodaykakaosa: false,
        crossGraphPeriodOnemonthkakaosa: false,
        crossGraphPeriodTwomonthkakaosa: false,        
        crossGraphPeriodOnehourkakaomo: false,
        crossGraphPeriodTwohourkakaomo: false,
        crossGraphPeriodOnedayweekkakaomo: false,
        crossGraphPeriodTwodayweekkakaomo: false,
        crossGraphPeriodOnedaykakaomo: false,
        crossGraphPeriodTwodaykakaomo: false,
        crossGraphPeriodOnemonthkakaomo: false,
        crossGraphPeriodTwomonthkakaomo: false,         
        crossGraphPeriodOnehournaverda: false,
        crossGraphPeriodTwohournaverda: false,
        crossGraphPeriodOnedayweeknaverda: false,
        crossGraphPeriodTwodayweeknaverda: false,
        crossGraphPeriodOnedaynaverda: false,
        crossGraphPeriodTwodaynaverda: false,
        crossGraphPeriodOnemonthnaverda: false,
        crossGraphPeriodTwomonthnaverda: false,   
        crossGraphPeriodOnehourgoogle: false,
        crossGraphPeriodTwohourgoogle: false,    
        crossGraphPeriodOnedayweekgoogle: false,
        crossGraphPeriodTwodayweekgoogle: false,        
        crossGraphPeriodOnedaygoogle: false,
        crossGraphPeriodTwodaygoogle: false, 
        crossGraphPeriodOnemonthgoogle: false,
        crossGraphPeriodTwomonthgoogle: false,        
        keywordreportTotalForTop: false,
        keywordreportTotalForKeyword: false,
        keywordreportnaverForTop: false,
        keywordreportnaverForKeyword: false,
        keywordreportkakaosaForTop: false,
        keywordreportkakaosaForKeyword: false,
        keywordreportgoogleForTop: false,
        keywordreportgoogleForKeyword: false,        
        adreportTotalForTop: false,
        adreportTotalForKeyword: false,
        adreportnaverForTopToSearch: false,
        adreportnaverForAdToSearch: false,
        adreportkakaosaForTopToSearch: false,
        adreportkakaosaForAdToSearch: false,
        adreportkakaomoForTopToBanner: false,
        adreportkakaomoForAdToBanner: false,
        adreportnaverdaForAdToBanner: false,
        adreportgoogledaForAdToBanner: false,
        shoppingreportForTop: false,
        shoppingreportForShoppingAd: false,
      },
      dashboard: {
        page: 1,
        cFromdate: null,
        cTodate: null,
        summarys: [
          { key: "cst", text: "총광고비", visible: true },
          { key: "im", text: "총노출수", visible: true },
          { key: "clk", text: "총클릭수", visible: true },
          { key: "cv", text: "총전환수", visible: true },
          { key: "rv", text: "총전환매출", visible: true },
          { key: null, text: "클릭율", visible: false },
          { key: null, text: "cpc", visible: false },
          { key: null, text: "전환율", visible: false },
          { key: null, text: "ROAS", visible: false },
          { key: null, text: "전환당비용", visible: false },
        ],
        atSummarys: [],
        atMediaSummarys: [],
        atPieSummarys: [],
        totalCst: 0,
        graph: {
          crossGraph: null,
          pieGraph: null,
        },
      },
      medias: ["naver", "kakaosa", "kakaomo", "naverda","google"],
      dropdownMenu: {
        periodAnalysis: { value: null },
        kpi: { value: null },
      },
    };
  },
  watch: {},
  computed: {
    getUniqueId() {
      if (!this.uniqueId) {
        this.uniqueId = "vm-" + this._uid;
        return this.uniqueId;
      }
      return this.uniqueId;
    },
  },
  components: {
    mdArticleTotal, mdArticleSa, mdArticleDa, cpArticleTotal, cpArticleNaverSa, cpArticleKakaoSa, cpArticleKakaoDa, cpArticleGoogleSa, phArticleTotal,
    pdwArticleTotal, pdArticleTotal, pmArticleTotal, phArticleNaverSa, phArticleNaverSa, pdwArticleNaverSa, pdArticleNaverSa,
    pmArticleNaverSa, phArticleKakaoSa, pdArticleKakaoSa, pmArticleKakaoSa, pdwArticleKakaoSa, phArticleGoogleSa, pdArticleGoogleSa, pdwArticleGoogleSa, pmArticleGoogleSa,
    kArticleGoogleSa, phArticleKakaoDa, pdArticleKakaoDa, pmArticleKakaoDa, pdwArticleKakaoDa, cpArticleNaverDa, phArticleNaverDa, pdArticleNaverDa, pmArticleNaverDa, pdwArticleNaverDa,
    kArticleNaverSa, kArticleTotal, kArticleKakaoSa, sadArticleNaverSa, dArticleTotal, adArticleNaverSa, adArticleKakaoSa, adArticleKakaoDa,
    adArticleTotal, adArticleNaverDa, adArticleGoogleDa},
  created() {},
  mounted() {},
  updated() {},
  methods: {
    hrendering(d) {
      this.rendering[d.graph] = d.status;
    },
    hfinished(d) {
      this.createPDF(d.graph, d.status);
    },
    isEmptyObject(obj) {
      return isEmptyObject(obj);
    },
    setDashboard() {
      var vm = this;
      vm.dashboard.summarys = [];
      vm.dashboard.atSummarys = [];
      vm.dashboard.atMediaSummarys = [];
      vm.dashboard.atPieSummarys = [];
      vm.dashboard.totalCst = 0;

      if (vm.report.reportInfo.start !== null && vm.report.reportInfo.end !== null) {
        var diff = moment(vm.report.reportInfo.end).diff(moment(vm.report.reportInfo.start), "days");
        vm.dashboard.cFromdate = moment(vm.report.reportInfo.start).subtract(1 + Number(diff), "days").format("YYYY-MM-DD");
        vm.dashboard.cTodate = moment(vm.report.reportInfo.start).subtract(1, "days").format("YYYY-MM-DD");
      }
    },
    clickSearchBtn() {
      var vm = this;
      vm.page = 1;
      if (!vm.reservation) {vm.$emit("showMask");}
      vm.setDashboard(); // 통합대시보드
      vm.rendering.dKey++;
      vm.rendering.mdKey++;
      vm.rendering.cpKey++;
      vm.rendering.pKey++;
      vm.rendering.kKey++;
      vm.rendering.adKey++;
      vm.rendering.sadKey++;
    },
    htmlToPDF(report, email, reservation) {
      this.report = report;
      this.email = email;
      this.reservation = reservation;
      var dropdownMenuSet = {
        periodAnalysis: { 0: null, 1: "hour", 2: "dayweek", 3: "day", 4: "month", 5:"week" },
        kpi: { 0: null, 1: "cstd", 2: "imd", 3: "clkd", 4: "cvd", 5: "cvrd", 6: "crd", 7: "ctrd", 8: "cpad", 9: "cpcd", 10: "roasd", },
      };

      this.dropdownMenu.periodAnalysis.value = report.dropdownMenu.periodAnalysis === 0 ? "hour" : dropdownMenuSet.periodAnalysis[report.dropdownMenu.periodAnalysis];
      this.dropdownMenu.kpi.value = report.dropdownMenu.kpi === 0 ? "imd" : dropdownMenuSet.kpi[report.dropdownMenu.kpi];
      this.clickSearchBtn();
    },
    priceToString(salse) {
      if (salse === undefined) return "";
      return priceToString(salse);
    },
    copyObject(object) { return JSON.parse(JSON.stringify(object)); },
    createPDF(page, flag) {
      var vm = this;
      vm.rendering[page] = flag;
      if (!vm.rendering.summary) return false;
      if (!vm.rendering.summarymedia) return false;
      if (!vm.rendering.period) return false;
      if (!vm.rendering.summarymediarate) return false;
      if (vm.report.activePage.mediaAnalysis && vm.report.activeMedia.naver && !vm.rendering.crossGraphMediaOnenaver) return false;            
      if (vm.report.activePage.mediaAnalysis && vm.report.activeMedia.naver && !vm.rendering.crossGraphMediaTwonaver) return false;
      if (vm.report.activePage.mediaAnalysis && vm.report.activeMedia.kakaosa && !vm.rendering.crossGraphMediaOnekakaosa) return false;
      if (vm.report.activePage.mediaAnalysis && vm.report.activeMedia.kakaosa && !vm.rendering.crossGraphMediaTwokakaosa) return false;
      if (vm.report.activePage.mediaAnalysis && vm.report.activeMedia.kakaomo && !vm.rendering.crossGraphMediaOnekakaomo) return false;
      if (vm.report.activePage.mediaAnalysis && vm.report.activeMedia.kakaomo && !vm.rendering.crossGraphMediaTwokakaomo) return false;
      if (vm.report.activePage.mediaAnalysis && vm.report.activeMedia.naverda && !vm.rendering.crossGraphMediaOnenaverda) return false;
      if (vm.report.activePage.mediaAnalysis && vm.report.activeMedia.naverda && !vm.rendering.crossGraphMediaTwonaverda) return false;    
      if (vm.report.activePage.mediaAnalysis && vm.report.activeMedia.google && !vm.rendering.crossGraphMediaOnegoogle) return false;
      if (vm.report.activePage.mediaAnalysis && vm.report.activeMedia.google && !vm.rendering.crossGraphMediaTwogoogle) return false;             
      if (vm.report.activePage.mediaAnalysis && !vm.rendering.crossGraphMediaTotalOne) return false;
      if (vm.report.activePage.mediaAnalysis && !vm.rendering.crossGraphMediaTotalTwo) return false;
      if (vm.report.activePage.campaignAnalysis && vm.report.activeMedia.naver && !vm.rendering.crossGraphCampaignOnenaver) return false;
      if (vm.report.activePage.campaignAnalysis && vm.report.activeMedia.naver && !vm.rendering.crossGraphCampaignTwonaver) return false;
      if (vm.report.activePage.campaignAnalysis && vm.report.activeMedia.kakaosa && !vm.rendering.crossGraphCampaignOnekakaosa) return false;
      if (vm.report.activePage.campaignAnalysis && vm.report.activeMedia.kakaosa && !vm.rendering.crossGraphCampaignTwokakaosa) return false;                 
      if (vm.report.activePage.campaignAnalysis && vm.report.activeMedia.kakaomo && !vm.rendering.crossGraphCampaignOnekakaomo) return false;
      if (vm.report.activePage.campaignAnalysis && vm.report.activeMedia.kakaomo && !vm.rendering.crossGraphCampaignTwokakaomo) return false;
      if (vm.report.activePage.campaignAnalysis && vm.report.activeMedia.naverda && !vm.rendering.crossGraphCampaignOnenaverda) return false;
      if (vm.report.activePage.campaignAnalysis && vm.report.activeMedia.naverda && !vm.rendering.crossGraphCampaignTwonaverda) return false;        
      if (vm.report.activePage.campaignAnalysis && vm.report.activeMedia.google && !vm.rendering.crossGraphCampaignOnegoogle) return false;
      if (vm.report.activePage.campaignAnalysis && vm.report.activeMedia.google && !vm.rendering.crossGraphCampaignTwogoogle) return false;      
      if (vm.report.activePage.campaignAnalysis && !vm.rendering.crossGraphCampaignTotalOne) return false;
      if (vm.report.activePage.campaignAnalysis && !vm.rendering.crossGraphCampaignTotalTwo) return false;           
      if (vm.report.activePage.periodAnalysis && vm.report.activeMedia.naver && vm.dropdownMenu.periodAnalysis.value === "hour" && !vm.rendering.crossGraphPeriodOnehournaver) return false;
      if (vm.report.activePage.periodAnalysis && vm.report.activeMedia.naver && vm.dropdownMenu.periodAnalysis.value === "hour" && !vm.rendering.crossGraphPeriodTwohournaver) return false;
      if (vm.report.activePage.periodAnalysis && vm.report.activeMedia.naver && vm.dropdownMenu.periodAnalysis.value === "dayweek" && !vm.rendering.crossGraphPeriodOnedayweeknaver) return false;
      if (vm.report.activePage.periodAnalysis && vm.report.activeMedia.naver && vm.dropdownMenu.periodAnalysis.value === "dayweek" && !vm.rendering.crossGraphPeriodTwodayweeknaver) return false;
      if (vm.report.activePage.periodAnalysis && vm.report.activeMedia.naver && vm.dropdownMenu.periodAnalysis.value === "month" && !vm.rendering.crossGraphPeriodOnemonthnaver) return false;
      if (vm.report.activePage.periodAnalysis && vm.report.activeMedia.naver && vm.dropdownMenu.periodAnalysis.value === "month" && !vm.rendering.crossGraphPeriodTwomonthnaver) return false;
      if (vm.report.activePage.periodAnalysis && vm.report.activeMedia.naver && vm.dropdownMenu.periodAnalysis.value === "day" && !vm.rendering.crossGraphPeriodOnedaynaver) return false;
      if (vm.report.activePage.periodAnalysis && vm.report.activeMedia.naver && vm.dropdownMenu.periodAnalysis.value === "day" && !vm.rendering.crossGraphPeriodTwodaynaver) return false;
      if (vm.report.activePage.periodAnalysis && vm.report.activeMedia.kakaosa && vm.dropdownMenu.periodAnalysis.value === "hour" && !vm.rendering.crossGraphPeriodOnehourkakaosa) return false;
      if (vm.report.activePage.periodAnalysis && vm.report.activeMedia.kakaosa && vm.dropdownMenu.periodAnalysis.value === "hour" && !vm.rendering.crossGraphPeriodTwohourkakaosa) return false;
      if (vm.report.activePage.periodAnalysis && vm.report.activeMedia.kakaosa && vm.dropdownMenu.periodAnalysis.value === "dayweek" && !vm.rendering.crossGraphPeriodOnedayweekkakaosa) return false;
      if (vm.report.activePage.periodAnalysis && vm.report.activeMedia.kakaosa && vm.dropdownMenu.periodAnalysis.value === "dayweek" && !vm.rendering.crossGraphPeriodTwodayweekkakaosa) return false;
      if (vm.report.activePage.periodAnalysis && vm.report.activeMedia.kakaosa && vm.dropdownMenu.periodAnalysis.value === "month" && !vm.rendering.crossGraphPeriodOnemonthkakaosa) return false;
      if (vm.report.activePage.periodAnalysis && vm.report.activeMedia.kakaosa && vm.dropdownMenu.periodAnalysis.value === "month" && !vm.rendering.crossGraphPeriodTwomonthkakaosa) return false;
      if (vm.report.activePage.periodAnalysis && vm.report.activeMedia.kakaosa && vm.dropdownMenu.periodAnalysis.value === "day" && !vm.rendering.crossGraphPeriodOnedaykakaosa) return false;
      if (vm.report.activePage.periodAnalysis && vm.report.activeMedia.kakaosa && vm.dropdownMenu.periodAnalysis.value === "day" && !vm.rendering.crossGraphPeriodTwodaykakaosa) return false;
      if (vm.report.activePage.periodAnalysis && vm.report.activeMedia.kakaomo && vm.dropdownMenu.periodAnalysis.value === "hour" && !vm.rendering.crossGraphPeriodOnehourkakaomo) return false;
      if (vm.report.activePage.periodAnalysis && vm.report.activeMedia.kakaomo && vm.dropdownMenu.periodAnalysis.value === "hour" && !vm.rendering.crossGraphPeriodTwohourkakaomo) return false;
      if (vm.report.activePage.periodAnalysis && vm.report.activeMedia.kakaomo && vm.dropdownMenu.periodAnalysis.value === "dayweek" && !vm.rendering.crossGraphPeriodOnedayweekkakaomo) return false;
      if (vm.report.activePage.periodAnalysis && vm.report.activeMedia.kakaomo && vm.dropdownMenu.periodAnalysis.value === "dayweek" && !vm.rendering.crossGraphPeriodTwodayweekkakaomo) return false;
      if (vm.report.activePage.periodAnalysis && vm.report.activeMedia.kakaomo && vm.dropdownMenu.periodAnalysis.value === "month" && !vm.rendering.crossGraphPeriodOnemonthkakaomo) return false;
      if (vm.report.activePage.periodAnalysis && vm.report.activeMedia.kakaomo && vm.dropdownMenu.periodAnalysis.value === "month" && !vm.rendering.crossGraphPeriodTwomonthkakaomo) return false;
      if (vm.report.activePage.periodAnalysis && vm.report.activeMedia.kakaomo && vm.dropdownMenu.periodAnalysis.value === "day" && !vm.rendering.crossGraphPeriodOnedaykakaomo) return false;
      if (vm.report.activePage.periodAnalysis && vm.report.activeMedia.kakaomo && vm.dropdownMenu.periodAnalysis.value === "day" && !vm.rendering.crossGraphPeriodTwodaykakaomo) return false;
      if (vm.report.activePage.periodAnalysis && vm.report.activeMedia.naverda && vm.dropdownMenu.periodAnalysis.value === "hour" && !vm.rendering.crossGraphPeriodOnehournaverda) return false;
      if (vm.report.activePage.periodAnalysis && vm.report.activeMedia.naverda && vm.dropdownMenu.periodAnalysis.value === "hour" && !vm.rendering.crossGraphPeriodTwohournaverda) return false;
      if (vm.report.activePage.periodAnalysis && vm.report.activeMedia.naverda && vm.dropdownMenu.periodAnalysis.value === "dayweek" &&!vm.rendering.crossGraphPeriodOnedayweeknaverda) return false;
      if (vm.report.activePage.periodAnalysis && vm.report.activeMedia.naverda && vm.dropdownMenu.periodAnalysis.value === "dayweek" && !vm.rendering.crossGraphPeriodTwodayweeknaverda) return false;
      if (vm.report.activePage.periodAnalysis && vm.report.activeMedia.naverda && vm.dropdownMenu.periodAnalysis.value === "month" && !vm.rendering.crossGraphPeriodOnemonthnaverda) return false;
      if (vm.report.activePage.periodAnalysis && vm.report.activeMedia.naverda && vm.dropdownMenu.periodAnalysis.value === "month" && !vm.rendering.crossGraphPeriodTwomonthnaverda) return false;
      if (vm.report.activePage.periodAnalysis && vm.report.activeMedia.naverda && vm.dropdownMenu.periodAnalysis.value === "day" && !vm.rendering.crossGraphPeriodOnedaynaverda) return false;
      if (vm.report.activePage.periodAnalysis && vm.report.activeMedia.naverda && vm.dropdownMenu.periodAnalysis.value === "day" && !vm.rendering.crossGraphPeriodTwodaynaverda) return false;
      if (vm.report.activePage.periodAnalysis && vm.report.activeMedia.google && vm.dropdownMenu.periodAnalysis.value === "hour" && !vm.rendering.crossGraphPeriodOnehourgoogle) return false;
      if (vm.report.activePage.periodAnalysis && vm.report.activeMedia.google && vm.dropdownMenu.periodAnalysis.value === "hour" && !vm.rendering.crossGraphPeriodTwohourgoogle) return false;  
      if (vm.report.activePage.periodAnalysis && vm.report.activeMedia.google && vm.dropdownMenu.periodAnalysis.value === "day" && !vm.rendering.crossGraphPeriodOnedaygoogle) return false;
      if (vm.report.activePage.periodAnalysis && vm.report.activeMedia.google && vm.dropdownMenu.periodAnalysis.value === "day" && !vm.rendering.crossGraphPeriodTwodaygoogle) return false;  
      if (vm.report.activePage.periodAnalysis && vm.report.activeMedia.google && vm.dropdownMenu.periodAnalysis.value === "day" && !vm.rendering.crossGraphPeriodOnedayweekgoogle) return false;
      if (vm.report.activePage.periodAnalysis && vm.report.activeMedia.google && vm.dropdownMenu.periodAnalysis.value === "day" && !vm.rendering.crossGraphPeriodTwodayweekgoogle) return false;  
      if (vm.report.activePage.periodAnalysis && vm.report.activeMedia.google && vm.dropdownMenu.periodAnalysis.value === "month" && !vm.rendering.crossGraphPeriodOnemonthgoogle) return false;
      if (vm.report.activePage.periodAnalysis && vm.report.activeMedia.google && vm.dropdownMenu.periodAnalysis.value === "month" && !vm.rendering.crossGraphPeriodTwomonthgoogle) return false;            
      if (vm.report.activePage.periodAnalysis && vm.dropdownMenu.periodAnalysis.value === "hour" && !vm.rendering.crossGraphPeriodTotalOnehour) return false;
      if (vm.report.activePage.periodAnalysis && vm.dropdownMenu.periodAnalysis.value === "hour" && !vm.rendering.crossGraphPeriodTotalTwohour) return false;
      if (vm.report.activePage.periodAnalysis && vm.dropdownMenu.periodAnalysis.value === "dayweek" && !vm.rendering.crossGraphPeriodTotalOnedayweek) return false;
      if (vm.report.activePage.periodAnalysis && vm.dropdownMenu.periodAnalysis.value === "dayweek" && !vm.rendering.crossGraphPeriodTotalTwodayweek) return false;
      if (vm.report.activePage.periodAnalysis && vm.dropdownMenu.periodAnalysis.value === "month" && !vm.rendering.crossGraphPeriodTotalOnemonth) return false;
      if (vm.report.activePage.periodAnalysis && vm.dropdownMenu.periodAnalysis.value === "month" && !vm.rendering.crossGraphPeriodTotalTwomonth) return false;
      if (vm.report.activePage.periodAnalysis && vm.dropdownMenu.periodAnalysis.value === "day" && !vm.rendering.crossGraphPeriodTotalOneday) return false;
      if (vm.report.activePage.periodAnalysis && vm.dropdownMenu.periodAnalysis.value === "day" && !vm.rendering.crossGraphPeriodTotalTwoday) return false;
      if (vm.report.activePage.keywordAnalysis && vm.report.activeMedia.naver && !vm.rendering.keywordreportnaverForKeyword) return false;
      if (vm.report.activePage.keywordAnalysis && vm.report.activeMedia.kakaosa && !vm.rendering.keywordreportkakaosaForKeyword) return false;
      // if (vm.report.activePage.keywordAnalysis && !vm.rendering.keywordreportTotalForKeyword) return false;
      if (vm.report.activePage.adAnalysis && vm.report.activeMedia.naver && !vm.rendering.adreportnaverForAdToSearch) return false;
      if (vm.report.activePage.adAnalysis && vm.report.activeMedia.kakaosa && !vm.rendering.adreportkakaosaForAdToSearch) return false;
      if (vm.report.activePage.adAnalysis && vm.report.activeMedia.kakaomo && !vm.rendering.adreportkakaomoForAdToBanner) return false;
      if (vm.report.activePage.adAnalysis && vm.report.activeMedia.naverda && !vm.rendering.adreportnaverdaForAdToBanner) return false;
      if (vm.report.activePage.adAnalysis && vm.report.activeMedia.google && !vm.rendering.adreportgoogledaForAdToBanner) return false;
      
      // if (vm.report.activePage.adAnalysis && !vm.rendering.adreportTotalForKeyword) return false;
      if (vm.report.activePage.shoppingAnalysis && vm.report.activeMedia.naver && !vm.rendering.shoppingreportForShoppingAd) return false;

      vm.setRendering();
      htmlToPdf(vm.$refs.pdfArea, "report_"+moment().format("YYYYMMDDHHmmss")).then(
        function (data) {
          let url = !vm.email ? "reportsend-pdf" : "reportsend-email";
          let formdata = new FormData();
          let name = "report_"+moment().format("YYYYMMDDHHmmss") + ".pdf";
          formdata.append("userid", store.state.userStore.userinfo.userid);
          formdata.append("bid", vm.report.id);
          formdata.append("name", vm.report.reportInfo.name);
          formdata.append("sender", vm.report.reportInfo.sender);
          formdata.append("semail", vm.report.reportInfo.email);
          formdata.append("recver", store.state.userStore.userinfo.username);
          formdata.append("remail", vm.report.reportInfo.recver);
          formdata.append("session", store.state.userStore.session);
          formdata.append("file", new Blob([data], { type: "application/pdf" }), name);

          $.ajax({
            type: "post",
            url: API_URL + "/app/reportsend/" + url,
            headers: { authorization: SHA256(TEMP_KEY) },
            data: formdata,
            processData: false, // FormData를 전송할 때 반드시 false로 설정해야 합니다.
            contentType: false, // FormData를 전송할 때 반드시 false로 설정해야 합니다.
            success: function (response) {
              // // console.log('전송 성공:', response);
              // 전송 성공에 대한 로직을 작성합니다.
              if (!vm.email) {
                if (vm.reservation) return;

                const downloadLink = document.createElement("a");
                downloadLink.href = URL.createObjectURL(new Blob([data], { type: "application/pdf" }));
                downloadLink.download = name;
                downloadLink.click();
                vm.$emit("finishDownload", {id: vm.report.id, pdfdate: moment().format()});
              } else {
                vm.$emit("finishEmail", {id: vm.report.id,sendStatus: response.data.sendStatus,emaildate: moment(response.data.dateTime).format()});
              }

              // vm.pdfKey += 1;
            },
            error: function (xhr, status, error) {
              console.error("전송 실패:", error);
              // 전송 실패에 대한 로직을 작성합니다.
            },
          });
        }
      );
    },
    getUuidv4() {
      return uuidv4();
    },
    isOneMedia() {
      let vm = this;
      let v = 0;
      var keys = Object.keys(vm.report.activeMedia);
      for (let k = 0; k < keys.length; k++) {
        // console.log(v, vm.report.activeMedia[keys[k]], keys[k]);
        if (vm.report.activeMedia[keys[k]]) v++;
      }

      return v === 1 ? true : false;
    },
    setRendering() {
      this.rendering.summary = false;
      this.rendering.summarymedia = false;
      this.rendering.period = false;
      this.rendering.summarymediarate = false;
      this.rendering.crossGraphMediaOnenaver = false;
      this.rendering.crossGraphMediaTwonaver = false;
      this.rendering.crossGraphMediaOnekakaosa = false;
      this.rendering.crossGraphMediaTwokakaosa = false;
      this.rendering.crossGraphMediaOnekakaomo = false;
      this.rendering.crossGraphMediaTwokakaomo = false;
      this.rendering.crossGraphMediaOnenaverda = false;
      this.rendering.crossGraphMediaTwonaverda = false;
      this.rendering.crossGraphMediaOnegoogle = false;
      this.rendering.crossGraphMediaTwogoogle = false;      
      this.rendering.crossGraphMediaTotalOne = false;
      this.rendering.crossGraphMediaTotalTwo = false;
      this.rendering.crossGraphCampaignOnenaver = false;
      this.rendering.crossGraphCampaignTwonaver = false;
      this.rendering.crossGraphCampaignOnekakaosa = false;
      this.rendering.crossGraphCampaignTwokakaosa = false;
      this.rendering.crossGraphCampaignOnekakaomo = false;
      this.rendering.crossGraphCampaignTwokakaomo = false;
      this.rendering.crossGraphCampaignOnenaverda = false;
      this.rendering.crossGraphCampaignTwonaverda = false;  
      this.rendering.crossGraphCampaignOnegoogle = false;
      this.rendering.crossGraphCampaignTwogoogle = false;             
      this.rendering.crossGraphCampaignTotalOne = false;
      this.rendering.crossGraphCampaignTotalTwo = false;
      this.rendering.crossGraphPeriodOnehournaver = false;
      this.rendering.crossGraphPeriodTwohournaver = false;
      this.rendering.crossGraphPeriodOnedayweeknaver = false;
      this.rendering.crossGraphPeriodTwodayweeknaver = false;
      this.rendering.crossGraphPeriodOnemonthnaver = false;
      this.rendering.crossGraphPeriodTwomonthnaver = false;
      this.rendering.crossGraphPeriodOnedaynaver = false;
      this.rendering.crossGraphPeriodTwodaynaver = false;
      this.rendering.crossGraphPeriodOnehourkakaosa = false;
      this.rendering.crossGraphPeriodTwohourkakaosa = false;
      this.rendering.crossGraphPeriodOnedayweekkakaosa = false;
      this.rendering.crossGraphPeriodTwodayweekkakaosa = false;
      this.rendering.crossGraphPeriodOnemonthkakaosa = false;
      this.rendering.crossGraphPeriodTwomonthkakaosa = false;
      this.rendering.crossGraphPeriodOnedaykakaosa = false;
      this.rendering.crossGraphPeriodTwodaykakaosa = false;
      this.rendering.crossGraphPeriodOnehourkakaomo = false;
      this.rendering.crossGraphPeriodTwohourkakaomo = false;
      this.rendering.crossGraphPeriodOnedayweekkakaomo = false;
      this.rendering.crossGraphPeriodTwodayweekkakaomo = false;
      this.rendering.crossGraphPeriodOnemonthkakaomo = false;
      this.rendering.crossGraphPeriodTwomonthkakaomo = false;
      this.rendering.crossGraphPeriodOnedaykakaomo = false;
      this.rendering.crossGraphPeriodTwodaykakaomo = false;
      this.rendering.crossGraphPeriodOnehournaverda = false;
      this.rendering.crossGraphPeriodTwohournaverda = false;
      this.rendering.crossGraphPeriodOnedayweeknaverda = false;
      this.rendering.crossGraphPeriodTwodayweeknaverda = false;
      this.rendering.crossGraphPeriodOnemonthnaverda = false;
      this.rendering.crossGraphPeriodTwomonthnaverda = false;
      this.rendering.crossGraphPeriodOnedaynaverda = false;
      this.rendering.crossGraphPeriodTwodaynaverda = false;  
      this.rendering.crossGraphPeriodOnehourgoogle = false;
      this.rendering.crossGraphPeriodTwohourgoogle = false; 
      this.rendering.crossGraphPeriodOnedayweekgoogle = false;
      this.rendering.crossGraphPeriodTwodayweekgoogle = false;     
      this.rendering.crossGraphPeriodOnemonthgoogle = false;
      this.rendering.crossGraphPeriodTwomonthgoogle = false;          
      this.rendering.crossGraphPeriodOnedaygoogle = false;
      this.rendering.crossGraphPeriodTwodaygoogle = false;             
      this.rendering.crossGraphPeriodTotalOnehour = false;
      this.rendering.crossGraphPeriodTotalTwohour = false;
      this.rendering.crossGraphPeriodTotalOnedayweek = false;
      this.rendering.crossGraphPeriodTotalTwodayweek = false;
      this.rendering.crossGraphPeriodTotalOnemonth = false;
      this.rendering.crossGraphPeriodTotalTwomonth = false;
      this.rendering.crossGraphPeriodTotalOneday = false;
      this.rendering.crossGraphPeriodTotalTwoday = false;
      this.rendering.keywordreportnaverForTop = false;
      this.rendering.keywordreportnaverForKeyword = false;
      this.rendering.keywordreportkakaosaForTop = false;
      this.rendering.keywordreportkakaosaForKeyword = false;
      this.rendering.keywordreportgoogleForTop = false;
      this.rendering.keywordreportgoogleForKeyword = false;      
      this.rendering.keywordreportTotalForTop = false;
      this.rendering.keywordreportTotalForKeyword = false;
      this.rendering.adreportnaverForTopToSearch = false;
      this.rendering.adreportnaverForAdToSearch = false;
      this.rendering.adreportkakaosaForTopToSearch = false;
      this.rendering.adreportkakaosaForAdToSearch = false;
      this.rendering.adreportkakaomoForTopToBanner = false;
      this.rendering.adreportkakaomoForAdToBanner = false;
      this.rendering.adreportnaverdaForAdToBanner = false;
      this.rendering.adreportgoogledaForAdToBanner = false;
      this.rendering.adreportTotalForTop = false;
      this.rendering.adreportTotalForKeyword = false;
      this.rendering.shoppingreportForTop = false;
      this.rendering.shoppingreportForShoppingAd = false;
    }
  },
};
</script>

<style scoped></style>
