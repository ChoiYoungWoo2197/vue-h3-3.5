<template>
  <div :class="getUniqueId" class="pdf-a4-l pdf-section-2 dashboard">
    <section class="d-flex pdf-card pdf-card-1">
      <div class="sub-title"> <h2>SUMMARY</h2> </div>
      <div class="d-flex justify-content-between">
        <div class="b-l"></div>
        <template v-if="report">
          <div class="d-flex flex-column">
            <div class="mb-2"> {{ "기준일: " + report.reportInfo.start + " ~ " + report.reportInfo.end + "" }} </div>
            <div v-if="main.dashboard.cFromdate !== null"> {{ "비교일: " + main.dashboard.cFromdate + " ~ " + main.dashboard.cTodate + "" }} </div>
          </div>
        </template>
      </div>
    </section>
    <section class="d-flex pdf-card pdf-card-2">
      <div class="summary-card row">
        <ul style="height: 180px; width:300px" class="align-items-center bg-white">
          <li>{{ "지표" }}</li>
          <li class="no-wrap"> {{ "기준 데이터" }}
            <p class="pl-1"> 비교 데이터 (<span class="only-up">+</span>/<span class="only-down">-</span>)</p>
          </li>            
        </ul>   
        <template v-for="(k, i) in Object.keys(sortDraggable())">
          <template v-for="summary in getSummarys">
            <ul v-if="k === summary.key && report.activeBtn[k]" :key="k+i+summary.key+getUuidv4()" style="height: 180px; width:300px" class="align-items-center bg-white">
              <li>{{ '총' + getKpiName(k) }}</li>
              <li class="no-wrap"> {{ priceToString(summary.value) + getUnits(k) }}
                <template v-if="summary.per.indexOf('-') === -1">
                  <!-- <p class="pl-1">{{ priceToString(summary.cp)}}<span class="up">{{ summary.per + getUnits(k) }}</span></p> -->
                  <p class="pl-1">{{ priceToString(summary.cp)}}<span class="up">{{ summary.per + '%' }}</span></p>
                </template>
                <template v-else>
                  <!-- <p class="pl-1">{{ priceToString(summary.cp)}}<span class="down">{{ summary.per.substr(1) + getUnits(k) }}</span></p> -->
                  <p class="pl-1">{{ priceToString(summary.cp)}}<span class="down">{{ summary.per.substr(1) + '%' }}</span></p>
                </template>
              </li>
            </ul>
          </template>
        </template>
      </div>
      <div class="crossGraph d-flex justify-content-center">
        <div id="crossGraph" class="crossGraph"></div>
      </div>
      <div class="report">
        <div class="row">
          <div class="col-8">
            <table class="report">
              <thead>
               <tr>
                <td width="45" class="text-center">#</td>
                <template v-for="(k, i) in Object.keys(sortDraggable())">
                  <td :key="k+i+getUuidv4()" v-if="report.activeBtn[k]" class="text-center" width="80">{{'총' + getKpiName(k)}}</td>
                </template>
               </tr>
              </thead>
              <tbody>
                <tr v-for="summary in getMediaSummarys" :key="summary.key + '-' + getUuidv4()" :class="{ total: summary.key === 'TOTAL' }">
                  <td class="text-left" width="80">{{ getMediaName(summary.key) }}</td>
                  <template v-for="(k,i) in Object.keys(sortDraggable())">
                    <td :key="k + i + getUuidv4()" v-if="report.activeBtn[k]">{{priceToString(summary.value[k]) + getUnits(k)}}</td>
                  </template> 
                </tr>
              </tbody>
            </table>
          </div>
          <div class="col-4 d-flex justify-content-center">
            <div id="pieGraph" class="pieGraph"></div>
          </div>
        </div>
      </div>
    </section>
    <section class="d-flex pdf-card pdf-card-3">
      <div class="footer">
        <div class="d-flex justify-content-between">
          <img alt="" src="@/assets/image/pdf_logo.png" height="35" />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import $ from "jquery";
import moment from "moment";
import * as echarts from "echarts";
import { isBanner, clearBody, addClassDashboard, priceToString, getMedia, getApp, uuidv4, sortWeekDay, isEmptyObject, getDateStr2, downloadImage, toDataURL, sortDraggable, getKpiName} from "@/assets/js/common.js";
import { store } from "@/store/store.js";
import { SHA256 } from "@/assets/js/sha256.js";
import { API_URL, TEMP_KEY, SUMMARY_SORT, MEDIA_SORT, UNITS,} from "@/configs/config.js";
import "@/assets/css/pdf.total.main.css";
import noimg from "@/assets/image/noimg.png";

export default {
  props: { pReport: Object, pDropdownMenu: Object, },
  data() {
    return {
      // mediaAnalysis: this.copyObject(this.pMediaAnalysis),
      report: this.copyObject(this.pReport),
      dropdownMenu: this.copyObject(this.pDropdownMenu),
      main: {
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
            { key: "ctr", text: "클릭율", visible: false },
            { key: "cpc", text: "cpc", visible: false },
            { key: "cvr", text: "전환율", visible: false },
            { key: "roas", text: "ROAS", visible: false },
            { key: "cpa", text: "전환당비용", visible: false },
          ],
          atSummarys: [],
          atMediaSummarys: [],
          atPieSummarys: [],
          totalCst: 0,
          graph: { crossGraph: null, pieGraph: null, },
        },        
        start: 0, //현재 페이지
        display: 20, //게시글의 수 
        medias: ["naver", "kakaosa", "kakaomo", "naverda", "google"],        
      },
      pdf: { search: { d: 15, start: 0, end: 0, spare: 5 }, banner: { d: 15, start: 0, end: 0, spare: 12 }, }, 
          
    };
  },
  created() {
    this.setDashboard();
    this.getReport();
  },
  mounted() {  },
  watch: {
    pMediaAnalysis: {
      deep: true,
      handler(value) { this.mediaAnalysis = this.copyObject(value); },
    },
    pReport: {
      deep: true,
      handler(value) { this.report = this.copyObject(value); },
    },
  },
  computed: {
    getUniqueId() {
      if (!this.uniqueId) {
        this.uniqueId = "vm-modal-" + this._uid;
        return this.uniqueId;
      }
      return this.uniqueId;
    },
    getMedia(media) { return (media) => getMedia(media); },    
    getSummarys() {
      this.main.dashboard.atSummarys.sort(function (a, b) { return a.sort < b.sort ? -1 : a.sort > b.sort ? 1 : 0; });
      return this.main.dashboard.atSummarys;
    },    
    getMediaSummarys() {
      this.main.dashboard.atMediaSummarys.sort(function (a, b) { return a.sort < b.sort ? -1 : a.sort > b.sort ? 1 : 0; });
      return this.main.dashboard.atMediaSummarys;
    },    
  },
  methods: {
    sortDraggable() { return sortDraggable(this.report.draggable); },
    getKpiName(kpi) { return getKpiName(kpi); },      
    copyObject(object) { return Object.assign({}, object); },
    isEmptyObject(obj) { return isEmptyObject(obj); },
    priceToString(salse) {
      if (salse === undefined) return "";
      return priceToString(salse);
    },
    getUuidv4() { return uuidv4(); },
    getUnits(unit) { return UNITS[unit]; }, 
    handleNoImg(e) { e.target.src = noimg; },    
    getSum(arr) {
      var result = arr.reduce(function add(sum, currValue) { return parseFloat(sum) + parseFloat(currValue); }, 0);
      return result;
    },  
    getName(key) {
      if (key === undefined) return "";

      var name = "";
      if (key === "cst") name = "총광고비";
      if (key === "clk") name = "총클릭수";
      if (key === "cv") name = "총전환수";
      if (key === "im") name = "총노출수";
      if (key === "cr") name = "총전환매출";
      return name;
    },    
    getMediaName(key) {
      if (key === undefined) return "";

      var name = "";
      if (key === "TOTAL") name = "총 합계";
      if (key === "N") name = "네이버SA";
      if (key === "D") name = "카카오SA";
      if (key === "K") name = "모먼트";
      if (key === "Nda") name = "GFA";
      if (key === "google") name = "구글";
      return name;
    },      
    isOneMedia() {
      let vm = this;
      let v = 0;
      var keys = Object.keys(vm.report.activeMedia);
      for (let k = 0; k < keys.length; k++) { if (vm.report.activeMedia[keys[k]]) v++; }
      return v === 1 ? true : false;
    },  
    initDatas() {
      return {
        naver: {
          campaign_type: [
            { web_site: "파워링크", items: [], class: "campain1" },
            { shopping: "쇼핑검색", items: [], class: "campain2" },
            { power_contents: "파워컨텐츠", items: [], class: "campain3" },
            { brand_search: "브랜드검색", items: [], class: "campain4" },
            { place: "플레이스", items: [], class: "campain5" },
          ],
        },
        kakaosa: {
          campaign_type: [{ none: "캠페인목록", items: [], class: "campain1" }],
        },
        kakaomo: {
          campaign_type: [
            {
              talk_biz_board: "카카오톡비즈보드",
              items: [],
              class: "campain1",
            },
            { display: "디스플레이", items: [], class: "campain2" },
            { talk_channel: "카카오톡 채널", items: [], class: "campain3" },
            { daum_shopping: "다음쇼핑", items: [], class: "campain4" },
            { video: "동영상", items: [], class: "campain5" },
            { sponsored_board: "스폰서드 보드", items: [], class: "campain6" },
          ],
        },
        google: {
          campaign_type: [
            { demand_gen: "디멘드젠 캠페인", items: [], class: "campain1" },
            { display: "디스플레이", items: [], class: "campain2" },
            { hotel: "호텔", items: [], class: "campain3" },
            { local: "지역", items: [], class: "campain4" },
            { local_services: "지역 서비스 광고", items: [], class: "campain5" },
            { multi_channel: "다중 채널", items: [], class: "campain6" },
            { performance_max: "실적 최대화", items: [], class: "campain7" },
            { search: "검색", items: [], class: "campain8" },
            { shopping: "쇼핑", items: [], class: "campain9" },
            { smart: "스마트", items: [], class: "campain10" },
            { travel: "여행", items: [], class: "campain11" },
            { video: "동영상", items: [], class: "campain12" },
            { unknown: "기타", items: [], class: "campain13" },            
            { unspecified: "미지정", items: [], class: "campain14" },                  
          ],
        },       
        total: {
          clk: 0, //클릭수
          im: 0, //노출수
          cst: 0, //광고비
          cv: 0, //전환수
          cr: 0, //전환매출
          ctr: 0, //클릭률
          cpc: 0, //클릭 당 비용
          cpa: 0, //전환 당 비용
          cvr: 0, //전환율
          roas: 0, //ROAS
        },
      };
    },  
    setDashboard() {
      var vm = this;
      vm.main.dashboard.summarys = [];
      vm.main.dashboard.atSummarys = [];
      vm.main.dashboard.atMediaSummarys = [];
      vm.main.dashboard.atPieSummarys = [];
      vm.main.dashboard.totalCst = 0;

      if (vm.report.reportInfo.cstart === null && vm.report.reportInfo.cend === null) {
        var diff = moment(vm.report.reportInfo.end).diff( moment(vm.report.reportInfo.start), "days" );
        vm.main.dashboard.cFromdate = moment(vm.report.reportInfo.start).subtract(1 + Number(diff), "days").format("YYYY-MM-DD");
        vm.main.dashboard.cTodate = moment(vm.report.reportInfo.start).subtract(1, "days").format("YYYY-MM-DD");
      } else {
         vm.main.dashboard.cFromdate = vm.report.reportInfo.cstart;
         vm.main.dashboard.cTodate = vm.report.reportInfo.cend;
      }
    },  
    getReport() {
      let vm = this;
      if(vm.main.dashboard.cFromdate.length === 0 || vm.main.dashboard.cTodate.length === 0) return;
      
      if (vm.report.activePage.dashboard) {
        var media = '';
        vm.main.medias.forEach(function(m, i) {
          if(vm.report.activeMedia[m]) media += '1';
          else media += '0';
          if(i < vm.main.medias.length -1) media += ',';
        })
        var summary = $.ajax({
          type: "post",
          url: API_URL + "/app/dashboard/summary",
          headers: { authorization: SHA256(TEMP_KEY) },
          data: {
            userid: store.state.userStore.userinfo.userid,
            fromdate: vm.report.reportInfo.start,
            todate: vm.report.reportInfo.end,
            comparefromdate: vm.main.dashboard.cFromdate,
            comparetodate: vm.main.dashboard.cTodate,
            media: media,
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

        var summarymedia = $.ajax({
          type: "post",
          url: API_URL + "/app/dashboard/summarymedia",
          headers: { authorization: SHA256(TEMP_KEY) },
          data: {
            userid: store.state.userStore.userinfo.userid,
            fromdate: vm.report.reportInfo.start,
            todate: vm.report.reportInfo.end,
            media: media,
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

        var summarymediarate = $.ajax({
          type: "post",
          url: API_URL + "/app/dashboard/summarymediarate",
          headers: { authorization: SHA256(TEMP_KEY) },
          data: {
            userid: store.state.userStore.userinfo.userid,
            fromdate: vm.report.reportInfo.start,
            todate: vm.report.reportInfo.end,
            media: media,            
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

        var period = $.ajax({
          type: "post",
          url: API_URL + "/app/dashboard/period",
          headers: { authorization: SHA256(TEMP_KEY) },
          data: {
            userid: store.state.userStore.userinfo.userid,
            fromdate: vm.report.reportInfo.start,
            todate: vm.report.reportInfo.end,
            media: media,            
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
      }  

      $.when(summary, summarymedia, summarymediarate, period).done(function(summary, summarymedia, summarymediarate, period) {
        if(summary[1] === "success") {
          var keys = Object.keys(SUMMARY_SORT);
          keys.forEach(function (key) {
            vm.main.dashboard.atSummarys.push({
              key: key,
              value: summary[0].data[key],
              per: !summary[0].data.per ? "0" : summary[0].data.per[key].toString(),
              cp: !summary[0].data.cp[key] ? "0" : summary[0].data.cp[key].toString(),
              sort: SUMMARY_SORT[key],
            });
          });

          vm.$emit("finished", {graph: "summary", status: true});
        }
        if(summarymedia[1] === "success") {
          var keys = Object.keys(summarymedia[0].data);
          // console.log(keys, vm.report.activeMedia.kakaomo, summarymedia[0].data);
          for (let i = 0; i < keys.length; i++) {
            if(keys[i] === 'N' && !vm.report.activeMedia.naver) continue;
            if(keys[i] === 'D' && !vm.report.activeMedia.kakaosa) continue;
            if(keys[i] === 'K' && !vm.report.activeMedia.kakaomo) continue;
            if(keys[i] === 'Nda' && !vm.report.activeMedia.naverda) continue;
            if(keys[i] === 'google' && !vm.report.activeMedia.google) continue;
            vm.main.dashboard.atMediaSummarys.push({ key: keys[i], value: summarymedia[0].data[keys[i]], sort: MEDIA_SORT[keys[i]], });
            vm.main.dashboard.totalCst += summarymedia[0].data[keys[i]].cst;
          }
          vm.$emit("finished", {graph: "summarymedia", status: true});
        }
        if(summarymediarate[1] === "success") {
          if (vm.main.dashboard.graph.pieGraph) vm.main.dashboard.graph.pieGraph.dispose();
            var keys = Object.keys(summarymediarate[0].data);
            for (let i = 0; i < keys.length; i++) { 
              if(keys[i] === 'N' && !vm.report.activeMedia.naver) continue;
              if(keys[i] === 'D' && !vm.report.activeMedia.kakaosa) continue;
              if(keys[i] === 'K' && !vm.report.activeMedia.kakaomo) continue;
              if(keys[i] === 'Nda' && !vm.report.activeMedia.naverda) continue;
              if(keys[i] === 'google' && !vm.report.activeMedia.google) continue;              
              vm.main.dashboard.atPieSummarys.push({ name: vm.getMediaName(keys[i]), value: Math.ceil(summarymediarate[0].data[keys[i]].per), sort: MEDIA_SORT[keys[i]], }); 
            }
            vm.$nextTick(function() {
              if(document.getElementById("pieGraph")) {
                vm.main.dashboard.graph.pieGraph = echarts.init(document.getElementById("pieGraph"));
                var option = {
                  color:[    '#5470C6', '#91CC75', '#FAC858', '#EE6666', '#73C0DE', '#3BA272', '#FC8452', '#9A60B4', '#EA7CCC'],
                  title: { text: "", subtext: "", left: "center", },
                  tooltip: { trigger: "item", },
                  legend: { show: true, top: "93%", left: "center", orient: "horizontal", textStyle: { fontSize: 12, fontWeight: "bold", }, },
                  series: [ { name: "Access From", type: "pie", radius: ["45%", "70%"], data: vm.main.dashboard.atPieSummarys, itemStyle: { borderRadius: 10, borderColor: "#fff", borderWidth: 2, }, label: { show: false, fontSize: 12, fontWeight: "normal", }, }, ],
                };

                vm.main.dashboard.graph.pieGraph.setOption(option);
                vm.main.dashboard.graph.pieGraph.on("finished", function () { vm.$emit("finished", {graph: "summarymediarate", status: true});});    
              }
            });
      
        }
        if(period[1] === "success") {
          let periods = [];
          var ims = [];
          var clk = [];
          var diff = moment(vm.report.reportInfo.end).diff(moment(vm.report.reportInfo.start), "days");
          for (var i = 1; i <= diff; i++) { periods.push(moment(vm.report.reportInfo.end).subtract(i, "days").format("YYYY-MM-DD"));}
          periods.reverse().push(vm.report.reportInfo.end);

          for (var i = 0; i < periods.length; i++) {
            var ob = period[0].data[periods[i]];
            if (ob !== undefined) {
              ims.push(ob.im);
              clk.push(ob.clk);
            } else {
              ims.push(0);
              clk.push(0);
            }
          }

          vm.$nextTick(function() {
            if(document.getElementById("crossGraph")) {
              vm.main.dashboard.graph.crossGraph = echarts.init(document.getElementById("crossGraph"));
              var option = {
                color: ["#1795F0", "#6664DA", "#4EDF9F", "#4DC6DF"],
                tooltip: { trigger: "axis", axisPointer: { type: "cross", crossStyle: { color: "#999", }, }, },
                grid: { width: "80%", },
                legend: { show: true, data: ["총노출수", "총클릭수"], top: "93%", left: "center", orient: "horizontal", textStyle: { fontSize: "12", fontWeight: "normal", }, },
                xAxis: [ { type: "category", data: periods, axisPointer: { type: "shadow", }, axisLabel: { fontSize: "12", }, }, ],
                yAxis: [
                  { type: "value", name: "총노출수", axisLabel: { formatter: "{value}", }, axisLabel: { fontSize: "12", }, },
                  { type: "value", name: "총클릭수", axisLabel: { formatter: "{value}", }, axisLabel: { fontSize: "12", }, },
                ],
                series: [
                  {
                    name: "총노출수",
                    type: "bar",
                    tooltip: { valueFormatter: function (value) { return value; }, },
                    data: ims,
                    label: { show: false, position: "top", textStyle: { fontSize: "12", fontWeight: "bold", }, formatter: function (value) { return priceToString(value.value); }, },
                    barWidth: 20,
                  },
                  {
                    name: "총클릭수",
                    type: "line",
                    yAxisIndex: 1,
                    tooltip: { valueFormatter: function (value) { return value; }, },
                    data: clk,
                  },
                ],
              };
              vm.main.dashboard.graph.crossGraph.setOption(option);
              vm.main.dashboard.graph.crossGraph.on("finished", function () { vm.$emit("finished", {graph: "period", status: true});});       
            }
          });
        }
      }).then(function(e) {
        // console.log(e);
      })
    }
   
  },
};
</script>

<style scoped></style>
