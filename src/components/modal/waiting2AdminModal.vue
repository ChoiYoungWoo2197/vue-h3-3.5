<template>
    <div class="modal fade" :id="getUniqueId" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="joinApprove" style="display: none;" aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content">
				<div class="modal-title">
                    <h3>광고주가 등록되었습니다.</h3>
                    <h5>
                        <span>관리자를 통해 가입승인을 요청하여 주시기 바랍니다. </span> 
                        <span class="text-primary font-weight-bolder" style="display : inline-block;"><router-link to="/membermng">계정통합관리 페이지로</router-link></span>
                    </h5>
				</div>
				<div class="modal-button d-flex">
					<!-- <button class="btn shadow-none mr-2" data-dismiss="modal">닫기</button> -->
					<!-- <button class="btn shadow-none" data-toggle="modal" data-target="#confirm" @click="submitForm">확인</button> -->
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import $ from 'jquery';
import { store } from '../../store/store.js';
import { API_URL, TEMP_KEY } from '../../configs/config.js';
import { SHA256 } from '../../assets/js/sha256.js';

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
            hideModal() {
				$('#'+ this.getUniqueId).modal("hide");
			},
            showModal() {
                $('#'+ this.getUniqueId).modal("show");
            },
        }
    }
</script>

<style scoped>

</style>