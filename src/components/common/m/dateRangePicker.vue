<template>
  <!-- 달력 -->
  <div
    class="offcanvas offcanvas-bottom date-range-picker d-none offcanvas-date-range-picker"
    tabindex="-1"
    id="date-select"
    aria-labelledby="date-selectLabel"
    :class="getUniqueId"
  >
    <div class="offcanvas-header">
      <nav class="d-flex justify-content-between align-items-center">
        <div class="menu-info d-flex align-items-center">
          <div class="logo d-flex justify-content-center align-items-center">
            <a
              href="dashboard1-1.html"
              class="d-flex justify-content-center align-items-center"
              ><img
                src="../../../assets/image/icon_heeil.png"
                alt="희일커뮤니케이션"
                class="icon"
            /></a>
          </div>
        </div>
        <div class="title"><h2>기간</h2></div>
        <div class="menu-icon d-flex justify-content-center align-items-center">
          <button
            type="button"
            class="btn d-flex justify-content-center align-items-center"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            @click="clickSubmit(false)"
          >
            <i class="bi bi-x-lg icon" ></i>
          </button>
        </div>
      </nav>
    </div>
    <div class="offcanvas-body">
      <div class="d-flex flex-column ">
        <table class="date m-0">
          <colgroup>
            <col width="30%" />
            <col width="70%" />
          </colgroup>
          <tbody>
            <tr>
              <td>직전 기간</td>
              <td>
                {{ cStart + ' ~ ' + cEnd}}
                <!-- <date-range-picker
                  ref="cdateRangePicker"
                  class="border-0"
                  :pDisabled="true"
                >
                </date-range-picker> -->
              </td>
            </tr>
            <tr>
              <td>기간</td>
              <td>
                {{ start + ' ~ ' + end}}
                <!-- <date-range-picker
                  ref="dateRangePicker"
                  @changedDate="changedDateRangePicker"
                  class="border-0"
                  :pDisabled="true"
                >
                </date-range-picker> -->
              </td>
            </tr>            
          </tbody>
        </table>
        
        <div class="pills-container-btn">
          <div class="pills-btn">
            <ul class="d-flex" id="pills-tab">
              <li class="nav-item">
                <button class="nav-link" id="" @click="clickDate(0, $event)">오늘</button>
              </li>
              <li class="nav-item">
                <button class="nav-link" id="" @click="clickDate(1, $event)">어제</button>
              </li>
              <li class="nav-item">
                <button class="nav-link" id="" @click="clickDate(2, $event)">이번달</button>
              </li>
              <li class="nav-item">
                <button class="nav-link active" id="" @click="clickDate(3, $event)">
                  이번주
                </button>
              </li>
              <li class="nav-item">
                <button class="nav-link" id="" @click="clickDate(4, $event)">
                  지난30일
                </button>
              </li>
              <li class="nav-item">
                <button class="nav-link" id="" @click="clickDate(5, $event)">지난달</button>
              </li>
              <li class="nav-item">
                <button class="nav-link" id="" @click="clickDate(6, $event)">지난주</button>
              </li>
            </ul>
          </div>
          <button class="allow" @click="clickAllowBtn">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="9" viewBox="0 0 12 8"><path fill="none" fill-rule="evenodd" stroke="#1e1e23" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M1 6L6 1 11 6" transform="translate(0 1)"></path></svg>
          </button>
        </div>

        
        <date-range-picker-inline 
        class="calendar-wrap" ref="dateRangePickerInline"
        @changedDate="changedDateRangePicker">
        </date-range-picker-inline>
        <button class="date-select-btn" @click="clickSubmit(true)">기간 선택 완료</button>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import {
  clearBody,
  addClassDashboard,
  isMobile,
  showLayout,
} from "../../../assets/js/common.js";
import dateRangePicker from "../../common/dateRangePicker.vue";
import moment from "moment";
import dateRangePickerInline from '../dateRangePickerInline.vue';



export default {
  props: {
    pStart: String,
    pEnd: String,
    pCstart: String,
    pCend: String,
    pMenu: null,
    pDasyboard: false,
  },
  data() {
    return {
      start: null,
      end: null,
      cStart: null,
      cEnd: null,
      menu: null,
      uniqueId: null,
    };
  },
  components: {
    dateRangePicker,
    dateRangePickerInline
  },
  mounted() {
    this.start = this.pStart;
    this.end = this.pEnd;
    this.cStart = this.pCstart;
    this.cEnd = this.pCend;
    this.menu = this.pMenu;
    clearBody();
    addClassDashboard();
    let svg = document.querySelector('.offcanvas-date-range-picker .pills-container-btn .allow svg');
    svg.style.transform = 'rotate(180deg)';
    this.$emit("mountedMain", true);
  },
  computed: {
    getUniqueId() {
      if (!this.uniqueId) {
        this.uniqueId = "vm-" + this._uid;
        return this.uniqueId;
      }
      return this.uniqueId;
    },
  },
  watch: {
    pStart() {
      this.start = this.pStart;
    },
    pEnd() {
      this.end = this.pEnd;

      if (this.start && this.end) {
        
        // this.$refs.dateRangePicker.setDate({ start: this.start, end: this.end });
      }
    },
    pCstart() {
      this.cStart = this.pCstart;
    },
    pCend() {
      this.cEnd = this.pCend;

      if (this.cStart && this.cEnd) {
        // this.$refs.cdateRangePicker.setDate({ start: this.cStart, end: this.cEnd });
      }
    },
  },
  methods: {
    clickSubmit(flag) {
      showLayout();

      if(flag) {
        this.$emit("changedDate", {
          start: this.start,
          end: this.end,
          cstart: this.cStart,
          cend: this.cEnd,
        });
      }
      this.$emit('closeBtn');

    },
    changedDateRangePicker(data) {
      let date = data;
      let diff = moment(date.end).diff(moment(date.start), "days");

      this.start = date.start;
      this.end = date.end;
      this.cStart = moment(date.start)
        .subtract(1 + Number(diff), "days")
        .format("YYYY-MM-DD");
      this.cEnd = moment(date.start).subtract(1, "days").format("YYYY-MM-DD");
    },
    clickDate(i, event) {
      let btns = document.querySelectorAll(
        ".date-range-picker .offcanvas-body .nav-item .nav-link"
      );
      btns.forEach(function (btn, i) {
        btn.classList.remove("active");
      });
      event.target.classList.add("active");

      let date = this.$refs.dateRangePickerInline.getDateByType(i);
      this.start = date.start;
      this.end = date.end;

      let diff = moment(date.end).diff(moment(date.start), "days");
      this.cStart = moment(date.start)
        .subtract(1 + Number(diff), "days")
        .format("YYYY-MM-DD");
      this.cEnd = moment(date.start).subtract(1, "days").format("YYYY-MM-DD");
      this.$refs.dateRangePickerInline.setDate({ start: this.start, end: this.end });
      this.clickSubmit(true);
    },
    clickAllowBtn() {
      let pillstab = document.querySelector('.offcanvas-date-range-picker .pills-container-btn .pills-btn #pills-tab');
      let svg = document.querySelector('.offcanvas-date-range-picker .pills-container-btn .allow svg');

//  console.log(pillstab);

      if(pillstab.classList.contains('flex-wrap')) {
        pillstab.classList.remove('flex-wrap');
        svg.style.transform = 'rotate(180deg)';
      } else {
        pillstab.classList.add('flex-wrap');
        svg.style.transform = 'rotate(0deg)';
        
      }
      
    }
  },
};
</script>

<style>

</style>
