<template>
    <section id="findPw" class="bg-light m-h-100">
        <article
            class="find-wrap container-xl d-flex justify-content-center align-items-center modal-dialog-centered"
        >
            <div class="wrap row col-xl-5 col-lg-6 col-md-8 col-12">
                <div class="process-title mb-3 col-12">
                    <img
                        src="../assets/image/h3.png"
                        alt="h3"
                        @click="$router.push('/login').catch(() => {})"
                    />
                    <h3>비밀번호 찾기</h3>
                    <p>회원가입시 작성한 정보를 입력해 주세요.</p>
                </div>
                <form
                    @submit.prevent="submitForm"
                    onkeydown="return event.key == 'Enter' ? false : true"
                    class="mb-0 col-12"
                >
                    <div class="mb-2">
                        <label for="findP\id" class="form-label">아이디</label>
                        <input
                            type="text"
                            class="form-control shadow-none"
                            id="findPid"
                            placeholder="아이디를 입력해 주세요."
                            v-model="findPid"
                            @blur="blurFindPid"
                        />
                        <div
                            v-if="findPidErrorMessage.length > 0"
                            id="findPidfeedback"
                            class="invalid-feedback d-block"
                        >
                            {{ findPidErrorMessage }}
                        </div>
                    </div>
                    <div class="row mb-2">
                      <div class="col-9 pl-0 pr-0">
                        <div class="">
                            <label for="findPemail" class="form-label"
                                >이메일</label
                            >
                            <input
                                type="email"
                                class="form-control shadow-none"
                                id="findPemail"
                                placeholder="이메일을 입력해 주세요."
                                v-model="findPemail"
                                @blur="blurFindPemail"
                            />
                        </div>
                      </div>
                      <div class="col pr-0 d-flex justify-content-start align-items-end">
                            <button
                                type="button"
                                class="btn-email-auth-no btn process-btn shadow-none btn-hover w-100"
                                @click="clickBtnEmailAuthNo"
                            >
                                인증코드
                            </button>
                      </div>
                      <div
                          v-if="findPemailErrorMessage.length > 0"
                          id="findPemailfeedback"
                          class="invalid-feedback d-block"
                      >
                          {{ findPemailErrorMessage }}
                      </div>
                      <div v-if="logMessage.length > 0" class="input-group mb-3">
                        <div class="invalid-feedback d-block">
                            {{ logMessage }}
                        </div>
                      </div>

                    </div>
                    <div class="mb-2">
                        <input
                            type="text"
                            class="email-auth-no form-control shadow-none"
                            id="emailAuthNo"
                            placeholder="인증코드를 입력해주세요."
                            v-model="emailAuthNo"
                            :disabled="isDisable === true"
                        />
                    </div>
                    <div class="button-group mt-5">
                        <button
                            type="button"
                            @click="clickLoginBtn"
                            class="btn process-btn shadow-none btn-hover"
                        >
                            로그인 페이지로
                        </button>
                        <button
                            type="submit"
                            class="btn process-btn shadow-none btn-hover"
                            data-target="#findPw"
                        >
                            다음
                        </button>
                        <!--<button type="submit" class="btn process-btn shadow-none btn-hover">아이디 찾기</button>-->
                    </div>
                </form>
            </div>
        </article>
        <find-pw-modal ref="findPwModal" style="display: none"></find-pw-modal>
    </section>
</template>

<script>
import $ from "jquery";
import {
    isblank,
    isNotEmail,
    isNotId,
    clearBody,
    addClassView,
} from "../assets/js/common.js";
import { SHA256 } from "../assets/js/sha256.js";
import { API_URL, TEMP_KEY } from "../configs/config.js";
import findPwModal from "../components/modal/findPwModal.vue";

export default {
    data() {
        return {
            ajax: true,
            findPname: "",
            findPid: "",
            findPemail: "",
            findPnameErrorMessage: "",
            findPidErrorMessage: "",
            findPemailErrorMessage: "",
            logMessage: "",
            emailAuthNo: '',
            isDisable: true,
        };
    },
    components: {
        findPwModal,
    },
    created() {},
    mounted() {
        $("#footer").removeClass("bg-dark");
        $("#footer").addClass("bg-light");
        clearBody();
        addClassView();
    },
    methods: {
        validate() {
            this.logMessage = "";
            // this.blurFindPname();
            // this.blurFindPid();
            this.blurFindPemail();
        },
        clickLoginBtn() {
            this.$router.push("/");
        },
        submitForm() {
            var vm = this;
            this.ajax = true;
            this.validate();

            if (this.ajax) {
                $.ajax({
                    type: "POST", //요청 메소드 방식
                    url: API_URL + "/user/findpass",
                    headers: { authorization: SHA256(TEMP_KEY) },
                    data: {
                        "userid" : vm.findPid,
                        // "userid" : vm.findPid,
                        "useremail": vm.findPemail,
                        "code": vm.emailAuthNo
                    },
                    success: function (data) {
                        // console.log(data);
                        if (data.result === "success") {
                            vm.$refs.findPwModal.showModal();
                        } else {
                            vm.logMessage = '인증이 실패하였습니다. 다시 한번 확인해주세요.';
                        }
                    },
                    error: function (a, b, c) {
                        vm.logMessage = b;
                    },
                    finally: function (a, b, c) {},
                });
            }
        },
        blurFindPname() {
            this.findPnameErrorMessage = "";
            if (isblank(this.findPname)) {
                this.findPnameErrorMessage = "이름을 입력해주세요.";
                this.ajax = false;
            }
        },
        blurFindPid() {
            this.findPidErrorMessage = "";
            if (isblank(this.findPid)) {
                this.findPidErrorMessage = "아이디를 입력해주세요.";
                this.ajax = false;
            }
        },
        blurFindPemail() {
            this.findPemailErrorMessage = "";
            if (isNotEmail(this.findPemail)) {
                this.findPemailErrorMessage =
                    "이메일 주소가 올바르지 않습니다.";
                this.ajax = false;
            }
        },
        clickBtnEmailAuthNo() {
          let vm = this;
          vm.emailAuthNo = '';
          vm.isDisable = true;
					$.ajax({
						type: "POST", //요청 메소드 방식
						url: API_URL + "/user/emailauthnoforpw",
						headers : { "authorization" : SHA256(TEMP_KEY) },
						data : {
							"userid" : vm.findPid,
							"useremail" : vm.findPemail,
						},
						success : function(data){
              if(data.status === '200') {
                vm.isDisable = false;

              } else {
                alert('아이디 및 이메일 정보를 확인해주세요.');
              }
            },
						error : function(a, b, c){},
					});
        }
    },
};
</script>

<style scoped>
</style>