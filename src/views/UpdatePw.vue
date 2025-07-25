<template>
	<section class="bg-login m-h-100">
		<article class="login-wrap container-xl d-flex justify-content-center align-items-center modal-dialog-centered">
			<div class="wrap row col-xl-5 col-lg-6 col-md-8 col-12 bg-white rounded-lg shadow">
				<div class="process-title mb-3 col-12">
					<img src="../assets/image/h3.png" alt="h3" @click="$router.push('/login').catch(()=>{})">
					<h3>비밀번호 수정</h3>
				</div>
				<form @submit.prevent="submitForm" onkeydown="return event.key == 'Enter' ? false : true" class="mb-3 col-12">
					<div class="input-group mb-3">
						<span class="input-group-text" id="loginId"><i class="bi bi-person-fill"></i></span>
						<input type="id" class="form-control shadow-none" placeholder="비밀번호" aria-label="loginId" aria-describedby="loginId"
							v-model="loginId">
						<!-- <div v-if="loginIdErrorMessage.length > 0" id="loginIdfeedback" class="invalid-feedback d-block">{{loginIdErrorMessage}}</div> -->
					</div>
					<div class="input-group mb-3">
						<span class="input-group-text" id="loginPw"><i class="bi bi-key-fill"></i></span>
						<input type="password" class="form-control shadow-none" placeholder="비밀번호 확인" aria-label="loginPw" aria-describedby="loginPw"
							v-model="loginPw">
						<!-- <div v-if="loginPwErrorMessage.length > 0" id="loginPwfeedback" class="invalid-feedback d-block">{{loginPwErrorMessage}}</div> -->
					</div>
					<!-- <div v-if="logMessage.length > 0" class="input-group mb-3">
						<div class="invalid-feedback d-block">{{logMessage}}</div>
					</div> -->
				</form>
				<ul class="login-btn">
					<!-- <li><router-link to="/find-id">아이디 찾기</router-link></li>
					<li><router-link to="/find-pw">비밀번호 찾기</router-link></li>
					<li><router-link to="/terms">회원가입</router-link></li> -->
				</ul>
			</div>
		</article>
	</section>
</template>

<script>
    export default {
        data () {
			return {

			}
		},
    }
</script>

<style scoped>

</style>