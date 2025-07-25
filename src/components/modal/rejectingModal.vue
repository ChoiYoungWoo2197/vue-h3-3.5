<template>
    <div class="modal fade" :id="getUniqueId" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="holding" aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content">
				<div class="madal-header d-flex justify-content-end mb-5">
					<button type="button" class="btn-close" data-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="process-title mb-3">
					<h1><i class="bi bi-x-circle-fill font-40"></i></h1>
				</div>
				<div class="process-content mb-5">
					<h5>관리자 승인 거절되었습니다.</h5>
					<p>자세한 사항은 담당 마케터에게 문의해 주세요.</p>
				</div>
				<div class="button-group">
					<button type="button" class="btn process-btn shadow-none btn-hover" data-dismiss="modal">닫기</button>
					<button class="btn process-btn home-btn home-tel shadow-none btn-hover" onclick="location.href='tel:070-7600-0007'"><span><i class="bi bi-telephone-fill"></i> </span>전화상담</button>
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
            },
        },
        methods: {
            showModal() {
                $('#'+ this.getUniqueId).modal("show");
            } 
        }
    }
</script>

<style scoped>

</style>