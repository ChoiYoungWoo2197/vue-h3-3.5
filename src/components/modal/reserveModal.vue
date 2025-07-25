<template>
    <div
        class="modal fade show reserve-modal"
        :class="getUniqueId"
        id="reserveModal"
        data-backdrop="static"
        data-keyboard="false"
        aria-labelledby="reserve-modal"
        aria-modal="true"
        role="dialog"
        tabindex="-1"
    >
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-title">
                    <h3>발송 예약</h3>
                    <h5>설정한 시간대의 예약시간을 기준으로 발송됩니다.</h5>
                </div>
                <div class="reserve-modal">
                    <div class="form-group">
                        <div
                            class="d-flex align-items-center justify-content-between mb-2"
                        >
                            <div class="col-2">
                                <label class="form-label">예약시간</label>
                            </div>
                            <input
                                type="date"
                                class="fromdate form-control"
                                v-model="fromdate"
                            />
                            <select class="form-control ml-2" v-model="vhours">
                                <option
                                    v-for="(data, index) in hours"
                                    :key="index + '-' + getUuidv4()"
                                    :value="data.key"
                                    :selected="data.selected"
                                >
                                    {{ data.text }}
                                </option>
                            </select>
                            <select
                                class="form-control ml-2"
                                v-model="vminutues"
                            >
                                <option
                                    v-for="(data, index) in minutes"
                                    :key="index + '-' + getUuidv4()"
                                    :value="data.key"
                                    :selected="data.selected"
                                >
                                    {{ data.text }}
                                </option>
                            </select>
                        </div>
                        <div
                            class="d-flex align-items-center justify-content-between mb-2"
                        >
                            <div class="col-2">
                                <label class="form-label"></label>
                            </div>
                            <input
                                type="date"
                                class="todate form-control"
                                v-model="todate"
                                disabled
                            />
                            <select class="form-control ml-2" v-model="thours" disabled>
                                <option
                                    v-for="(data, index) in hours"
                                    :key="index + '-' + getUuidv4()"
                                    :value="data.key"
                                    :selected="data.selected"
                                >
                                    {{ data.text }}
                                </option>
                            </select>
                            <select class="form-control ml-2" v-model="tminutues" disabled>
                                <option
                                    v-for="(data, index) in minutes"
                                    :key="index + '-' + getUuidv4()"
                                    :value="data.key"
                                    :selected="data.selected"
                                >
                                    {{ data.text }}
                                </option>
                            </select>
                        </div>
                        <div class="d-flex align-items-center mb-2">
                            <div class="col-2">
                                <label class="form-label"
                                    >반복발송<br /><small></small
                                ></label>
                            </div>
                            <select class="form-control" v-model="valways">
                                <option
                                    v-for="(data, index) in always"
                                    :key="index + '-' + getUuidv4()"
                                    :value="data.key"
                                    :selected="data.selected"
                                    :disabled="data.disabled"
                                >
                                    {{ data.text }}
                                </option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="modal-button d-flex two-btn">
                    <button
                        class="btn shadow-none select-cancel"
                        @click="cancelForm"
                    >
                        닫기
                    </button>
                    <button
                        class="btn shadow-none select-save"
                        data-toggle="modal"
                        data-target="#confirm"
                        @click="submitForm"
                    >
                        확인
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import $ from "jquery";
import { store } from "../../store/store.js";
import { API_URL, TEMP_KEY } from "../../configs/config.js";
import { SHA256 } from "../../assets/js/sha256.js";
import { uuidv4 } from "../../assets/js/common.js";
import moment from 'moment';

export default {
    props: {},
    data() {
        return {
            uniqueId: null,
            userid: null,
            bid: null,
            fromdate: "2023-08-08",
            todate:"",
            vhours: "09",
            thours: "",
            hours: [
                // {key: '00', text: '00시', selected: false},
                // {key: '01', text: '01시', selected: false},
                // {key: '02', text: '02시', selected: false},
                // {key: '03', text: '03시', selected: false},
                // {key: '04', text: '04시', selected: false},
                // {key: '05', text: '05시', selected: false},
                // {key: '06', text: '06시', selected: false},
                // {key: '07', text: '07시', selected: false},
                // {key: '08', text: '08시', selected: false},
                { key: "09", text: "09시", selected: false },
                { key: "10", text: "10시", selected: true },
                { key: "11", text: "11시", selected: false },
                { key: "12", text: "12시", selected: false },
                { key: "13", text: "13시", selected: false },
                { key: "14", text: "14시", selected: false },
                { key: "15", text: "15시", selected: false },
                { key: "16", text: "16시", selected: false },
                { key: "17", text: "17시", selected: false },
                { key: "18", text: "18시", selected: false },
                // {key: '19', text: '19시', selected: false},
                // {key: '20', text: '20시', selected: false},
                // {key: '21', text: '21시', selected: false},
                // {key: '22', text: '22시', selected: false},
                // {key: '23', text: '23시', selected: false},
            ],
            vminutues: "00",
            tminutues: "",
            minutes: [
                { key: "00", text: "00분", selected: false },
                { key: "15", text: "15분", selected: true },
                { key: "30", text: "30분", selected: false },
                { key: "45", text: "45분", selected: false },
            ],
            valways: "default",
            always: [
                {
                    key: "default",
                    text: "첫 발송 후 반복 발송하기를 설정해주세요.",
                    selected: true,
                    disabled: true,
                },
                {
                    key: "off",
                    text: "설정안함",
                    selected: false,
                    disabled: false,
                },
                // { key: "day", text: "매일", selected: false, disabled: false },
                {
                    key: "week",
                    text: "주간(+7일)",
                    selected: false,
                    disabled: false,
                },
            ],
        };
    },
    mounted() {
        // console.log(this.pSummarys);
    },
    computed: {
        getUniqueId() {
            if (!this.uniqueId) {
                this.uniqueId = "vm-modal-" + this._uid;
                return this.uniqueId;
            }
            return this.uniqueId;
        },
    },
    watch: {},
    components: {},
    methods: {
        getMinutes() {
          let m = moment().minute();
          
          if(m<15) m = '00';
          if(m>=15 && m<30) m = '15';
          if(m>=30 && m<45) m = '30';
          if(m>=45 && m<60) m = '45';

          return m;
        },
        getUuidv4() {
            return uuidv4();
        },
        copyObject(object) {
            return JSON.parse(JSON.stringify(object));
        },
        hideModal() {
            $("." + this.getUniqueId).modal("hide");
        },
        showModal(userid, bid) {
            this.userid = userid;
            this.bid = bid;
            this.initForm();
            $("." + this.getUniqueId).modal("show");
        },
        cancelForm() {
            this.hideModal();
        },
        initForm() {
          let vm = this;
          $.ajax({
            type: 'get', //요청 메소드 방식
            url: API_URL + "/app/reportsend/reportsend-reservation",
            headers : { "authorization" : SHA256(TEMP_KEY) },
            data :{
              "userid" : store.state.userStore.userinfo.userid,
              "mode": 'get',
              "bid": vm.bid,
              "session" : store.state.userStore.session
            },
            beforeSend : function(data) { },
            success : function(data){
              if(data.result === "success") {
                let reportreservation = data.data.reportreservation;
                let typeSet = {0: 'default', 1: 'off', 2: 'day', 3: 'week'};
                vm.valways = typeSet['0'];
                vm.fromdate = moment().format('YYYY-MM-DD');
                vm.vhours = moment().format('HH');
                vm.vminutues = vm.getMinutes();
                vm.todate = '';
                vm.thours = '';
                vm.tminutues = '';

                if(reportreservation.length) {
                  let time = moment(reportreservation[0].time);
                  vm.valways = typeSet[reportreservation[0].type];
                  vm.todate = time.format('YYYY-MM-DD');
                  vm.thours = time.format('HH');
                  vm.tminutues = time.format('mm');
                } 
              } else {
                  if(data.status === "0001") {
                  } else {}
              }
            },
            error : function(a, b, c){
              if(a.status === 403) {
                vm.$store.commit("logout");
                vm.$store.commit("logoutActivedMdias");
                vm.$store.commit("logoutKakaoSa");
                vm.$router.push("/");
              }
            },
            complete : function(a, b, c) { }
          });
        },
        submitForm() {
            let vm = this;
            let c = moment();
            let t = moment(vm.fromdate+ ' ' + vm.vhours + ':' + vm.vminutues);

            if(c.isAfter(t)) {
              alert('예약시간은 현재시간보다 늦은 시간이어야 합니다.');
              return false;
            }

            this.$emit("selectedReservation", {
                year: vm.fromdate,
                hour: vm.vhours,
                minute: vm.vminutues,
                always: vm.valways,
                userid: vm.userid,
                bid: vm.bid,
            });
        },
    },
};
</script>

<style scoped>
</style>