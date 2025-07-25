<template>
  <div class="modal" :id="getUniqueId" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="joinApprove" aria-modal="true" role="dialog" style="display: block">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <!-- 로딩 애니메이션 -->
        <div class="loader"></div>
        <!-- 텍스트 안내 -->
        <h2 class="mb-2 font-weight-bold">로딩 중입니다.</h2>
        <p>1분 정도 소요될 수 있으니 잠시만 기다려 주시기 바랍니다.</p>
        <!-- 닫기 버튼 (개발 시에만 필요하거나 예외 상황 처리 시 사용) -->
        <button type="button" class="btn process-btn shadow-none btn-hover closeBtn" data-dismiss="modal" hidden>닫기</button>
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
      }
      return this.uniqueId;
    },
  },
  methods: {
    showModal() {$("#" + this.getUniqueId).modal("show");},
    hideModal() {$("#" + this.getUniqueId).modal("hide");},
  },
};
</script>

<style scoped>
.modal {background: rgba(0, 0, 0, 0.6); position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 1050; display: flex; align-items: center; justify-content: center;}
.modal-dialog { max-width: 400px; margin: 0 auto;}
.modal-content { background: #fff; border-radius: 1rem; padding: 2rem; text-align: center; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2); animation: fadeIn 0.3s ease-in-out;}
/* 로딩 애니메이션 */
.loader { width: 60px; height: 60px; border: 6px solid #e0e0e0; border-top: 6px solid #25b09b; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px auto;}
/* 텍스트 스타일 */
h2 { font-size: 1.5rem; color: #333;}
p { color: #666; font-size: 0.95rem;}
button.closeBtn { margin-top: 20px;}
/* 애니메이션 */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
</style>
