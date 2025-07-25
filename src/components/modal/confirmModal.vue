<template>
  <div
    class="modal fade"
    :id="getUniqueId"
    data-backdrop="static"
    data-keyboard="false"
    tabindex="-1"
    aria-labelledby="confirm"
    style="display: none"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-title">
          <h3>완료되었습니다.</h3>
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
    clickLoginBtn() {},
    showModal() {
      $("#" + this.getUniqueId).modal("show");
    },
  },
};
</script>

<style scoped></style>
