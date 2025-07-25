<template>
    <input
        :class="getUniqueId"
        class="datePickr"
        type="text"
        v-model="date"
        placeholder="연도-월-일"
        :disabled="activeDisabled == true"
    />
</template>

<script>
import $ from "jquery";

export default {
    props: {
        pDisabled: Boolean,
    },
    data() {
        return {
            date: null,
            uniqueId: null,
            activeDisabled: false,
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
        pDisabled() {
            this.activeDisabled = this.pDisabled;
        },
    },
    mounted() {
        this.activeDisabled = this.pDisabled;
        var vm = this;
        $.datepicker.setDefaults({
            closeText: "취소",
            showButtonPanel: true,
            prevText: "이전달",
            nextText: "다음달",
            currentText: "오늘",
            monthNames: [
                "1월",
                "2월",
                "3월",
                "4월",
                "5월",
                "6월",
                "7월",
                "8월",
                "9월",
                "10월",
                "11월",
                "12월",
            ],
            monthNamesShort: [
                "1월",
                "2월",
                "3월",
                "4월",
                "5월",
                "6월",
                "7월",
                "8월",
                "9월",
                "10월",
                "11월",
                "12월",
            ],
            dayNames: [
                "일요일",
                "월요일",
                "화요일",
                "수요일",
                "목요일",
                "금요일",
                "토요일",
            ],
            dayNamesShort: ["일", "월", "화", "수", "목", "금", "토"],
            dayNamesMin: ["일", "월", "화", "수", "목", "금", "토"],
            weekHeader: "주",
            dateFormat: "yy-mm-dd", // 날짜형태 예)yy년 m월 d일
            firstDay: 0,
            isRTL: false,
            showMonthAfterYear: true,
            yearSuffix: "년",
        });

        $("." + this.getUniqueId).datepicker({
            // minDate: 0,
            onSelect: function (selectedDate) {
                vm.date = selectedDate;
                vm.$emit("changedDate", vm.date);
            },
            onClose: function () {
                if (
                    $(window.event.srcElement).hasClass("ui-datepicker-close")
                ) {
                    vm.date = null;
                    vm.$emit("changedDate", vm.date);
                }
            },
        });
    },
    methods: {
        setDate(date) {
            this.date = date;
        },
        getDate() {
            return this.date;
        },
    },
};
</script>

<style scoped>
</style>