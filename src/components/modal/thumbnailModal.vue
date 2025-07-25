<template>
  <div class="modal fade" :id="getUniqueId" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="confirm" style="display: none" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div v-if="data !== null" class="modal-content">
        <div class="modal-title text-left mb-0 bannder-boardbox-container">
          <h3 class="font-weight-bold">
            {{ data.ad_headline }}
            <small class="sub"></small>
          </h3>
          <div v-if="data.adgroup_bidtype" class="bannder-boardbox-basic">
            <strong style="">기본</strong>
            <ul style="">
              <li style="">
                <em style="">ID</em>
                <p style="">{{ data.ad_id }}</p>
              </li>
              <li style="">
                <em style="">유형</em>
                <p style="">{{ getCType(data.campaign_type) }}</p>
              </li>
              <li style="">
                <em style="">캠페인</em>
                <p style="">{{ data.campaign_name }}</p>
              </li>
              <li style="">
                <em style="">그룹</em>
                <p style="">{{ data.adgroup_name }}</p>
              </li>
            </ul>
          </div>
          <div v-if="data.adgroup_bidtype" class="bannder-boardbox-mng">
            <strong style="">운영</strong>
            <ul style="">
              <li style="">
                <em style="">게제 위치</em>
                <p style="">{{ getPgroups(data.adgroup_pgroups) }}</p>
              </li>
              <li style="">
                <em style="">광고 그룹 예산</em>
                <p style="">{{ priceToString(data.adgroup_budgetamount) + "원" }}</p>
              </li>
              <li style="">
                <em style="">입찰 전략</em>
                <p style="">{{ getBidgoal(data.adgroup_bidgoal) }}</p>
              </li>
              <li style="">
                <em style="">비용관리</em>
                <p style="">
                  {{ priceToString(data.adgroup_bidprice) + "원" + "(" + getBidtype(data.adgroup_bidtype) + ")" }}
                </p>
              </li>
            </ul>
          </div>
        </div>
        <div class="modal-body d-flex justify-content-center">
          <span style="display: block">
            <img :src="data.ad_image_url" class="img-thumbnail" alt="..." @error="handleNoImg" />
          </span>
        </div>
        <div class="modal-button d-flex">
          <button class="btn shadow-none" data-dismiss="modal">닫기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import span from "../layout/span.vue";
import noimg from "../../assets/image/noimg.png";
import { isMobile, priceToString, uuidv4 } from "../../assets/js/common.js";
import {
  API_URL,
  TEMP_KEY,
  PGGROUPS,
  UNITS,
  BIDGOAL,
  BIDTYPE,
  BUDGETTYPE,
  CTYPE,
} from "../../configs/config.js";

export default {
  components: { span },
  data() {
    return {
      uniqueId: null,
      data: null,
    };
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
  methods: {
    clickLoginBtn() {},
    showModal(data) {
      this.data = data;
      $("#" + this.getUniqueId).modal("show");
    },
    handleNoImg(e) {
      e.target.src = noimg;
    },
    priceToString(salse) {
      return priceToString(salse);
    },
    getCType(ctype) {
      return CTYPE[ctype];
    },
    getUnits(unit) {
      return UNITS[unit];
    },
    getBidgoal(bidgoal) {
      return BIDGOAL[bidgoal];
    },
    getBidtype(bidtype) {
      return BIDTYPE[bidtype];
    },
    getBudgettype(budgettype) {
      return BUDGETTYPE[budgettype];
    },
    getPgroups(pgroups) {
      let str = pgroups === "" ? "-" : pgroups.split(",");
      let str2 = "";
      if (str.length > 0) {
        str.forEach(function (s) {
          str2 = str2 + "," + PGGROUPS[s];
        });
      }

      return str2.substr(1);
    },
    priceToString(salse) {
      return priceToString(salse);
    },
    getUnits(unit) {
      return UNITS[unit];
    },
  },
};
</script>

<style scoped></style>
