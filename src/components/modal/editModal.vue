<template>
  <div
    class="modal fade"
    :id="getUniqueId"
    data-backdrop="static"
    data-keyboard="false"
    tabindex="-1"
    aria-labelledby="edit"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-title">
          <h3>회원정보 수정</h3>
        </div>
        <form class="form-inline">
          <div>
            <label for="" class="form-label">업체명</label>
            <input
              type="text"
              class="form-control shadow-none"
              id=""
              placeholder="업체명"
              disabled=""
            />
          </div>
          <div>
            <label for="" class="form-label">이름</label>
            <input
              type="text"
              class="form-control shadow-none"
              id=""
              placeholder="이름"
              disabled=""
            />
          </div>
          <div>
            <label for="resisterEmail" class="form-label">이메일</label>
            <input
              type="email"
              class="form-control shadow-none"
              id="resisterEmail"
              placeholder="heeil@heeil.com"
              disabled=""
            />
          </div>
          <div>
            <label for="resisterTel" class="form-label">휴대번호</label>
            <input
              type="tel"
              class="form-control shadow-none"
              id="resisterTel"
              placeholder="010-1234-5678"
              disabled=""
            />
          </div>
          <div>
            <label for="" class="form-label">비밀번호 변경</label>
            <input
              type="password"
              class="form-control shadow-none"
              id=""
              placeholder="6자리 이상의 영문, 숫자, 특수문자"
            />
          </div>
          <div>
            <label for="" class="form-label">비밀번호 변경 확인</label>
            <input
              type="password"
              class="form-control shadow-none"
              id=""
              placeholder="6자리 이상의 영문, 숫자, 특수문자"
            />
          </div>
          <div class="edit-button d-flex">
            <button class="btn shadow-none mr-2" data-dismiss="modal">닫기</button>
            <button
              class="btn shadow-none"
              data-dismiss="modal"
              data-toggle="modal"
              data-target="#confirm"
            >
              확인
            </button>
          </div>
        </form>
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
