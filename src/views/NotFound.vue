<template>
	<section id="notFound" class="bg-login m-h-100">
		<article class="login-wrap container-xl d-flex justify-content-center align-items-center modal-dialog-centered">
			<div class="wrap row col-xl-5 col-lg-6 col-md-8 col-12 bg-white rounded-lg shadow">
				<form onkeydown="return event.key == 'Enter' ? false : true" class="mb-3 col-12">
					<div class="input-group mb-3">
                        <h1 class="text-danger">404</h1>
					</div>
                    <div class="input-group mb-3">
                        <h2>Page not found.</h2>
					</div>
				</form>
			</div>
		</article>
        <view-menu @mountedMain="handleMountedMain"></view-menu>
	</section>
</template>

<script>
import $ from 'jquery';
import {clearBody, addClassView} from  '../assets/js/common.js';
import viewMenu from '../components/layout/viewMenu.vue';

    export default {
        data() {
            return {

            }
        },
        components : {
            viewMenu
        },
        mounted() {
            $("#app").addClass("m-h-100");
            $('#footer').removeClass('bg-light');
			$('#footer').addClass('bg-dark');
            $('.modal-backdrop').remove();
            clearBody();
            addClassView();
        },
        methods: {
            handleMountedMain() { this.$emit('mountedMain', false); },
        }
    }
</script>

<style scoped>

</style>