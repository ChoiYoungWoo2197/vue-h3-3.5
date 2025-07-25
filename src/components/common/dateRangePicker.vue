<template>
  <input :class="getUniqueId" class="" type="text" name="daterange" :disabled="activeDisabled == true"  />
</template>

<script>
import $ from "jquery";
import moment from "moment";
import { store } from "@/store/store.js";

export default {
  props: {    pDisabled: Boolean,    pStart: String,    pEnd: String,  },
  data() {
    return {
      activeDisabled: false,
      start: null,
      end: null,
      uniqueId: null,
    };
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
    pDisabled() { this.activeDisabled = this.pDisabled; },
  },
  mounted() {
    var vm = this;
    vm.activeDisabled = vm.pDisabled;
    moment.locale("ko");
    vm.start = vm.pStart;
    vm.end = vm.pEnd;
    $("." + this.getUniqueId).daterangepicker(
      {
        timePicker: false,
        timePicker24Hour: true,
        timePickerSeconds: true,
        dateLimit: { days: 365, },
        maxDate: moment().subtract(1, 'days'),
        locale: {
          format: "YYYY-MM-DD",
          separator: " ~ ",
          applyLabel: "적용",
          cancelLabel: "취소",
          fromLabel: "From",
          toLabel: "To",
          customRangeLabel: "Custom",
          daysOfWeek: ["일", "월", "화", "수", "목", "금", "토"],
          monthNames: [ "1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월", ],
        },
        ranges: {
          오늘: [ moment().subtract().format("YYYY-MM-DD"), moment().subtract().format("YYYY-MM-DD"), ],
          어제: [ moment().subtract(1, "d").format("YYYY-MM-DD"), moment().subtract(1, 'days').format("YYYY-MM-DD"), ],
          이번달: [ moment().startOf("month").format("YYYY-MM-DD"), moment().subtract(1, 'days').format("YYYY-MM-DD"), ],
          이번주: [ moment().startOf("week").format("YYYY-MM-DD"), moment().subtract(1, 'days').format("YYYY-MM-DD"), ],
          지난30일: [ moment().subtract(30, "d").format("YYYY-MM-DD"), moment().subtract(1, 'days').format("YYYY-MM-DD"), ],
          지난달: [ moment().subtract(1, "month").startOf("month").format("YYYY-MM-DD"), moment().subtract(1, "month").endOf("month").format("YYYY-MM-DD"), ],
          지난주: [ moment().subtract(1, "week").startOf("week").format("YYYY-MM-DD"), moment().subtract(1, "week").endOf("week").format("YYYY-MM-DD"), ],
        },
        showCustomRangeLabel: false,
        alwaysShowCalendars: true,
        drops: "down",
        startDate: vm.pStart,
        endDate: vm.pEnd,
      },
      function (start, end, label) {
        vm.start = start.format("YYYY-MM-DD");
        vm.end = end.format("YYYY-MM-DD");
        vm.$emit("changedDate", { start: vm.start, end: vm.end });
      }
    );
  },
  methods: {
    getDate() {
      var vm = this;
      return { start: vm.start, end: vm.end, };
    },
    setDate(date) {
      var vm = this;
      vm.start = date.start;
      vm.end = date.end;
      $("." + this.getUniqueId) .data("daterangepicker") .setStartDate(date.start);
      $("." + this.getUniqueId) .data("daterangepicker") .setEndDate(date.end);

      if (!date.compare) {
        vm.$store.commit("setDate", { start: vm.start, end: vm.end });
        var diff = moment(vm.end).diff(moment(vm.start), "days");
        vm.$store.commit("setCDate", { cStart: moment(vm.start) .subtract(1 + Number(diff), "days") .format("YYYY-MM-DD"), cEnd: moment(vm.start).subtract(1, "days").format("YYYY-MM-DD"), });
      } else {
        vm.$store.commit("setCDate", { cStart: vm.start, cEnd: vm.end });
      }
    },
    getDateByType(i) {
      let date = { start: "", end: "" };
      switch (i) {
        case 0:
          { date.start = moment().subtract().format("YYYY-MM-DD"); date.end = moment().subtract().format("YYYY-MM-DD"); }
          break;
        case 1:
          { date.start = moment().subtract(1, "d").format("YYYY-MM-DD"); date.end = moment().subtract().format("YYYY-MM-DD"); }
          break;
        case 2:
          { date.start = moment().startOf("month").format("YYYY-MM-DD"); date.end = moment().subtract().format("YYYY-MM-DD"); }
          break;
        case 3:
          { date.start = moment().startOf("week").format("YYYY-MM-DD"); date.end = moment().subtract().format("YYYY-MM-DD"); }
          break;
        case 4:
          { date.start = moment().subtract(30, "d").format("YYYY-MM-DD"); date.end = moment().subtract().format("YYYY-MM-DD"); }
          break;
        case 5:
          { date.start = moment() .subtract(1, "month") .startOf("month") .format("YYYY-MM-DD"); date.end = moment().subtract(1, "month").endOf("month").format("YYYY-MM-DD"); }
          break;
        case 6:
          { date.start = moment() .subtract(1, "week") .startOf("week") .format("YYYY-MM-DD"); date.end = moment().subtract(1, "week").endOf("week").format("YYYY-MM-DD"); }
          break;
      }

      return date;
    },
  },
};
</script>

<style scoped></style>
