<template>
  <select :id="getUniqueId" style="width: 100%"></select>
</template>

<script>
import $ from "jquery";
import { API_URL, TEMP_KEY } from "../../configs/config.js";
import { SHA256 } from "../../assets/js/sha256.js";

export default {
  props: {
    pUrl: String,
    pMethod: String,
    pUserLevel: String,
  },
  data() {
    return {
      url: null,
      method: null,
      userLevel: null,
      datas: [],
    };
  },
  computed: {
    getUniqueId() {
      if (!this.uniqueId) {
        this.uniqueId = "vm-select2-" + this._uid;
        return this.uniqueId;
      }
      return this.uniqueId;
    },
  },
  watch: {
    pUrl() {
      this.url = this.pUrl;
    },
    pMethod() {
      this.method = this.pMethod;
    },
    pUserLevel() {
      this.userLevel = this.pUserLevel;
    },
  },
  mounted() {
    this.url = this.pUrl;
    this.method = this.pMethod;
    this.userLevel = this.pUserLevel;
    this.getDatas();
    this.initSelect2();
  },
  destroyed() {
    // console.log('select2');
  },
  methods: {
    getDatas() {
      var vm = this;
      $.ajax({
        type: vm.method, //요청 메소드 방식
        url: API_URL + vm.url,
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userlevel: vm.userLevel,
        },
        cache: false,
        async: false,
        success: function (data) {
          vm.datas = [
            {
              id: -1,
              text: "담당 마케터를 선택해 주세요.",
              selected: true,
            },
          ];
          if (data.result === "success") {
            var keys = Object.keys(data.marketers);
            for (let i = 0; i < keys.length; i++) {
              vm.datas.push({
                id: keys[i],
                text: data.marketers[keys[i]] + "(" + keys[i] + ")",
              });
            }
          }
        },
        error: function (a, b, c) {},
        finally: function (a, b, c) {},
      });
    },
    initSelect2() {
      var vm = this;
      $("#" + this.getUniqueId).select2({
        placeholder: "담당 마케터를 선택해 주세요.",
        theme: "bootstrap",
        data: vm.datas,
      });
    },
  },
};
</script>

<style scoped></style>
