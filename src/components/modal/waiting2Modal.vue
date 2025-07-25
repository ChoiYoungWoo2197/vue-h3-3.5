<template>
    <div class="modal fade show" :id="getUniqueId" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="resisterFin" aria-modal="true" role="dialog" style="padding-right: 17px; display: block;">
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content">
				<div class="madal-header d-flex justify-content-end mb-5">
					<button type="button" class="btn-close" data-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="process-title mb-3">
					<h1><i class="bi bi-check-circle-fill font-40"></i></h1>
				</div>
				<div class="process-content mb-5">
					<h5>관리자 승인 후 회원가입이 완료됩니다.</h5>
					<p>자세한 사항은 담당 마케터에게 문의해 주세요.</p>
				</div>
				<div class="process-content">
					<button class="home-btn col-6 shadow-none btn-hover" @click="clickLoginBtn">로그인 페이지로</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import $ from 'jquery';

    export default {
        data() {
            return {
                uniqueId : null,
            }
        },
		computed: {
            getUniqueId() {
                if(!this.uniqueId) {
                    this.uniqueId = 'vm-modal-' + this._uid;
                    return this.uniqueId;
                }
                return this.uniqueId;
            }
        },
		methods: {
			clickLoginBtn() {
                // this.$router.push("/login");
                this.$router.replace("/");
            },
            showModal() {
                $('#'+ this.getUniqueId).modal("show");
            }
        }
    }
</script>

<style scoped>

</style>