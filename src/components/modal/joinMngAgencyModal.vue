<template>
 <div class="modal fade " :class="[ joinRefuse === true ? 'joinRefuse' : '']" :id="getUniqueId" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="joinApprove" style="display: none;" aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content">
				<div class="modal-title">
					<template v-if="joinRefuse === false">
						<h3>가입승인</h3>
						<h5>승인을 하시겠습니까?</h5>
					</template>
					<template v-else>
						<h3>가입미승인</h3>
						<h5>미승인을 하시겠습니까?</h5>
					</template>

				</div>
				<table>
					<thead>
						<tr>
							<th width="100">에이전트구분</th>
							<th width="100">에이전트명</th>
							<th width="100">에이전트ID</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>{{userLevel}}</td>
							<td>{{username}}</td>
							<td>{{userid}}</td>
						</tr>
					</tbody>
				</table>
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
				userLevel : null,
				username : null,
				userid : null,
                joinRefuse : false
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
            showModal(data) {
				this.initForm();
                this.joinRefuse = data.joinRefuse;
				this.userLevel = data.userLevel;
				this.username = data.username;
				this.userid = data.userid;
                $('#'+ this.getUniqueId).modal("show");
            },
			initForm() {
                this.joinRefuse = false;
				this.userLevel = null;
				this.username = null;
				this.userid = null;
			},
			submitForm() {
				var vm = this;
				$.ajax({
						type: "POST", //요청 메소드 방식
						url: API_URL + "/admin/agentstatus",
						headers : { "authorization" : SHA256(TEMP_KEY) },
						data : {
							"userid" : store.state.userStore.userinfo.userid,
							"applyuserid" : vm.userid,
							"userstatus" : vm.joinRefuse === false ? "1" : "0",
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