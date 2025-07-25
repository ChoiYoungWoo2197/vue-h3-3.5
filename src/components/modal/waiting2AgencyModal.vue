<template>
    <div class="modal fade" :id="getUniqueId" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="joinApprove" style="display: none;" aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content">
				<div class="modal-title">
                    <h3>{{pTitle}}</h3>
                    <h5>
                        <span>{{pSubTitle}}</span> 
                        <span class="text-primary font-weight-bolder" style="display : inline-block;"><router-link :to="pUrl">{{pRtitle}}</router-link></span>
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

    export default {
        props: {
            pTitle : String,
            pSubTitle : String,
            pRtitle : String,
            pUrl : String,
        },
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