<template>
    <div class="modal fade show" :id="getUniqueId" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="waiting" style="display: block; padding-right: 17px;" aria-modal="true" role="dialog">
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content">
                <!-- <form  onsubmit="return false"> -->
                <form class="inputForm d-block" @submit.prevent="submitForm" onkeydown="return event.key == 'Enter' ? false : true">
                    <div class="madal-header d-flex justify-content-end mb-5">
                        <button type="button" class="btn-close" data-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="mb-4">
                        <h5>관리자 승인 보류되었습니다.</h5>
                        <p class="text-left" >광고주 수정시 아이디를 다시 한번 확인해주세요.</p>
                    </div>
                    <div class="mb-4">
                       	<label for="resisterSelectCon" class="form-label">광고 계정 인증</label>
						<select class="form-control col-12 shadow-none mb-2 resisterSelectCon" aria-label="resisterSelectCon">
							<option disabled>대표 매체를 선택해 주세요.</option>
							<option value="naver" selected>네이버</option>
							<option value="kakao">카카오</option>
						</select>
						<div class="input-group">
							<input type="text" class="form-control shadow-none resisterCon" id="resisterCon" placeholder="광고주 아이디를 입력해 주세요."
                                @blur="blurResisterCon">
							<div class="invalid-feedback resisterConErrorMessage">광고주 아이디를 입력해 주세요.</div>
                        </div>
                    </div>
                    <div class="input-group mb-3">
						<div class="invalid-feedback errorMessage"></div>
					</div>
                    <div class="process-content">
                        <button class="home-btn col-6 shadow-none btn-hover" data-dismiss="modal">닫기</button>
                        <button type="submit" class="btn process-btn shadow-none btn-hover" data-toggle="modal" data-target="#resisterFin">수정</button>
                    </div>
                </form>
                <form class="successForm d-none" onkeydown="return event.key == 'Enter' ? false : true">
                    <div class="madal-header d-flex justify-content-end mb-5">
                        <button type="button" class="btn-close" data-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="process-title mb-3">
                        <h1><i class="bi bi-check-circle-fill"></i></h1>
                    </div>
                    <div class="process-content mb-4">
                        <h5>광고주가 수정되었습니다.</h5>
                        <p>자세한 사항은 담당 마케터에게 문의해 주세요.</p>
                    </div>
                    <div class="process-content">
                        <button class="home-btn col-6 shadow-none btn-hover" @click="clickLoginBtn">로그인 페이지로</button>
                    </div>
                </form>
			</div>
		</div>
     </div>
</template>

<script>
import $ from 'jquery';
import {API_URL} from '../../configs/config.js';
import { isblank } from  '../../assets/js/common.js';

    export default {
        data() {
            return {
                ajax : true,
                uniqueId : null,
                resisterId : null,
                session : null,
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
            clickLoginBtn() {
                this.$router.push("/");
            },
            showModal(data) {
                this.initForm();
                this.resisterId = data.userinfo.userid;
                this.session = data.session;
                if(data.userinfo.advmedia) {
                    $('.resisterSelectCon').val(data.userinfo.advmedia);
                } else {
                    $('.resisterSelectCon').val("naver");
                }
                
                $('.resisterCon').val(data.userinfo.advid);
                $('#'+ this.getUniqueId).modal("show");
            },
            validate() {
                this.blurResisterCon();
            },
            blurResisterCon() {
                // $(".errorMessage").removeClass("d-block");
                
				if(isblank($('.resisterCon').val())) {
                    $('.resisterConErrorMessage').addClass("d-block");
					this.ajax = false;
				}
			}, 
            initForm() {
                $('.resisterSelectCon').val("naver");
                $('.resisterCon').val("");
                $('.resisterConErrorMessage').removeClass("d-block");
                $('.errorMessage').removeClass("d-block");

                $('.inputForm').removeClass("d-none d-block");
                $('.successForm').removeClass("d-none d-block");
                $('.inputForm').addClass("d-block");
                $('.successForm').addClass("d-none");
            },
            submitForm() {
				var vm = this;
                this.ajax = true;
				this.validate();

                var param = {
                    "userid" : vm.resisterId,
                    "advinfo" : {
                        "advmedia" : $('.resisterSelectCon').val(),
                        "advid" : $('.resisterCon').val()
                    },
                    "session" : vm.session,
                };
 
                if(this.ajax) {
                    $.ajax({
                        type: "POST", //요청 메소드 방식
                        url : API_URL + "/user/updateadvinfo",
                        data : param,
                        cache : false,
                        success : function(data){
                            if(data.result === "success") {
                                // alert("광고 계정이 수정되었습니다.");
                                // $('#' + vm.getUniqueId).modal("hide"); 
                                $('.inputForm').removeClass("d-block");
                                $('.inputForm').addClass("d-none");
                                $('.successForm').addClass("d-block");
                            } else {
                                $(".resisterConErrorMessage").removeClass("d-block");
                                $(".errorMessage").addClass("d-block");
                                $(".errorMessage").html(data.errormessage);
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
    }
</script>

<style scoped>

</style>