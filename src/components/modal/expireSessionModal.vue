<template>
  <div
    class="modal fade show"
    :id="getUniqueId"
    data-backdrop="static"
    data-keyboard="false"
    tabindex="-1"
    aria-labelledby="joinApprove"
    aria-modal="true"
    role="dialog"
    style="display: block"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-title">
          <h3>세션만료</h3>
          <h5>
            <span>서비스 이용을 위해 다시</span>
            <span class="text-primary font-weight-bolder" style="display: inline-block"
              ><router-link to="/" @click="clickLogin">로그인</router-link></span
            >
            <!-- <span class="text-primary font-weight-bolder" style="display : inline-block;"><a href="#" @click="clickLogin">로그인</a></span> -->
            <span>하여 주시기 바랍니다.</span>
          </h5>
        </div>
        <div class="modal-button d-flex">
          <!-- <button class="btn shadow-none mr-2" data-dismiss="modal">닫기</button> -->
          <!-- <button class="btn shadow-none" data-dismiss="modal" data-toggle="modal" data-target="#confirm">로그인 페이지로</button> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import { store } from "../../store/store.js";

export default {
  data() {
    return {
      uniqueId: null,
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
    clickLogin() {
      this.$router.push("/");
    },
    showModal() {
      // store.state.userStore.session = null;
      // console.log(store.state.userStore.session);
      $("#" + this.getUniqueId).modal("show");
      // $('#joinApprove').modal("show");
    },
  },
};
</script>

<style scoped></style>
