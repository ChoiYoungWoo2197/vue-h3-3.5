<template>
    <div class="modal fade joinWaiting" :id="getUniqueId" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="joinWaiting" aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content">
				<div class="modal-title">
					<h3>가입보류</h3>
					<h5>가입을 보류하시겠습니까?</h5>
				</div>
				<table>
					<thead>
						<tr>
							<th width="100">업체명</th>
							<th width="100">마스터</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>{{applyuserCompany}}</td>
							<td>{{managerName}}</td>
						</tr>
					</tbody>
				</table>
				<p class="modal-mail">확인을 누르면 가입보류 메일이 발송됩니다.</p>
				<div class="modal-button d-flex">
					<button class="btn shadow-none mr-2" data-dismiss="modal">닫기</button>
					<button class="btn shadow-none" data-dismiss="modal" data-toggle="modal" data-target="#confirm" @click="submitForm">확인</button>
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
				applyuserid : null,
				applyuserCompany : null,
				managerId : null,
				managerName : null,
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
			hideModal() {
				$('#'+ this.getUniqueId).modal("hide");
			},
            showModal(data) {
				// console.log(data);
				this.initForm();
				this.applyuserid = data.userid;
				this.applyuserCompany = data.usercompany;
				this.managerName = data.usermanagername === "" ? "-" : data.usermanagername;
				this.managerId = data.usermanager;
                $('#'+ this.getUniqueId).modal("show");
            },
			initForm() {
				this.applyuserid = null;
				this.applyuserCompany = null;
				this.managerName = null;
				this.managerId = null;
			},
			submitForm() {
				var vm = this;
				$.ajax({
						type: "POST", //요청 메소드 방식
						url: API_URL + "/admin/userstatus",
						headers : { "authorization" : SHA256(TEMP_KEY) },
						data : {
							"userid" : store.state.userStore.userinfo.userid,
							"applyuserid" : vm.applyuserid,
							"manageruserid" : vm.managerId,
							"userstatus" : "3",
							"session" : store.state.userStore.session,
						},
						cache : false,
						// async : false,
						success : function(data){
							// console.log(data);
							if(data.result === "success") {
								vm.hideModal();
								vm.$emit('updateUserStatus');
							} else {
								if(data.status === "0001") {
									vm.$emit('expireSession');
								} else if(data.status === "0004"){
									alert(data.errormessage);
								} 
							}
						},
						error : function(a, b, c){
						},
						finally : function(a, b, c) {
						}
				});
			}
        } 
    }
</script>

<style scoped>

</style>