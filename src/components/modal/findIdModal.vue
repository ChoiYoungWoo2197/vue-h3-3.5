<template>
    <div class="modal fade show" :id="getUniqueId" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="findId" aria-modal="true" role="dialog" style="display: block;">
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content">
                <form @submit.prevent="submitForm" onkeydown="return event.key == 'Enter' ? false : true">
                    <div class="madal-header d-flex justify-content-end mb-5"><button type="button" class="btn-close" data-dismiss="modal" aria-label="Close"></button></div>
                    <div class="process-title mb-3">
                        <h1><i class="bi bi-check-circle-fill"></i></h1>
                    </div>
                    <div class="process-content mb-5">
                        <h5>아이디가 발송되었습니다.</h5>
                        <p>메일함을 확인해 주세요.</p>
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

export default {
        data() {
            return {
                ajax : true,
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
            clickLoginBtn() {
                // this.$router.push("/login");
                this.$router.push("/");
            },
            showModal() {
                $('#'+ this.getUniqueId).modal("show");
            },
        }
    }
</script>

<style scoped>

</style>