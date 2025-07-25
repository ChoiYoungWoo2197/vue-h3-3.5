<template>
  <div :class="getUniqueId">
    <input 
      id="daterangepicker1" 
      type="text" 
      name="daterange" 
      hidden
      />
    <div id="daterangepicker1-container" class="embedded-daterangepicker"></div>
  </div>
</template>

<script>
import $ from "jquery";
import moment from "moment";

export default {
  props: {
    pDisabled: Boolean,
    pStart: String,
    pEnd: String,
  },
  data() {
    return {
      start: null,
      end: null,
      uniqueId: null,
      instance: null,
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
    pStart() {
      this.start = this.pStart;
    },
    pEnd() {
      let vm = this;
      vm.end = vm.pEnd;

      if (vm.start && vm.end) {
        vm.setDate({start: vm.start, end: vm.end});
      }
    },
  },
  mounted() {
    let vm = this;
    vm.start = vm.pStart;
    vm.end = vm.pEnd;
    vm.init();
  },
  methods: {
    init() {
      let vm = this;
      // init daterangepicker
      let picker = $("." + vm.uniqueId + " > " + "#daterangepicker1").daterangepicker(
        {
          parentEl: "." + vm.uniqueId + " > " + "#daterangepicker1-container",
          autoApply: true,
          locale: {
            format: "YYYY-MM-DD",
            separator: " ~ ", 
            applyLabel: "적용",
            cancelLabel: "취소", 
            startDate: vm.start,
            endDate: vm.end,
          },
        },
      );

      picker.on("apply.daterangepicker", function (ev, picker) { 
        vm.$emit("changedDate", { start: picker.startDate.format('YYYY-MM-DD'), end: picker.endDate.format('YYYY-MM-DD')  });
      });
      picker.data("daterangepicker").hide = function () {};
      picker.data("daterangepicker").show();
    },
    setDate(date) {
      let vm = this;
      vm.start = date.start;
      vm.end = date.end;
      $("." + vm.uniqueId + "  " + "#daterangepicker1").data("daterangepicker").setStartDate(date.start);
      $("." + vm.uniqueId + "  " + "#daterangepicker1").data("daterangepicker").setEndDate(date.end);
      $("." + vm.uniqueId + "  " + "#daterangepicker1").data("daterangepicker").updateCalendars();
      
    },
    getDateByType(i) {
          let date = {start: '', end: ''};
          switch(i) {
            case 0: {
              date.start = moment().subtract().format("YYYY-MM-DD");
              date.end = moment().subtract().format("YYYY-MM-DD");
            }
            break;
            case 1: {
              date.start = moment().subtract(1, "d").format("YYYY-MM-DD");
              date.end = moment().subtract().format("YYYY-MM-DD");
            }
            break;
            case 2: {
              date.start = moment().startOf("month").format("YYYY-MM-DD");
              date.end = moment().subtract().format("YYYY-MM-DD");
            }
            break;
            case 3: {
              date.start = moment().startOf("week").format("YYYY-MM-DD");
              date.end = moment().subtract().format("YYYY-MM-DD");
            }
            break;
            case 4: {
              date.start = moment().subtract(30, "d").format("YYYY-MM-DD");
              date.end = moment().subtract().format("YYYY-MM-DD");
            }
            break;
            case 5: {
              date.start = moment().subtract(1, "month").startOf("month").format("YYYY-MM-DD");
              date.end = moment().subtract(1, "month").endOf("month").format("YYYY-MM-DD");
            }
            break;
            case 6: {
              date.start = moment().subtract(1, "week").startOf("week").format("YYYY-MM-DD");
              date.end = moment().subtract(1, "week").endOf("week").format("YYYY-MM-DD");
            }
            break;
          }

          return date;
        }
  }
};
</script>

<style>
.embedded-daterangepicker .daterangepicker::before,
.embedded-daterangepicker .daterangepicker::after {
  display: none;
}
.embedded-daterangepicker .daterangepicker {
  position: relative !important;
  top: auto !important;
  left: auto !important;
  float: left;
  width: 100%;
  margin-top: 0;
}
.embedded-daterangepicker .daterangepicker .drp-calendar {
  width: 50%;
  max-width: 50%;
}

.daterangepicker .calendar-table th,
.daterangepicker .calendar-table td {
  text-align: center !important;
}

/* 768이하 일때 모바일 */
@media screen and (max-width: 565px){
  .embedded-daterangepicker .daterangepicker .drp-calendar {width: 100%; max-width: none !important; }
}
</style>
