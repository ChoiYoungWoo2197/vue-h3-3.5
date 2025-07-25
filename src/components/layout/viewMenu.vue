<template>
    <div v-show="false"> 

    </div>
</template>

<script>
import $ from 'jquery';
import {clearBody, addClassView} from  '../../assets/js/common.js';

    export default {
        data() {
            return {

            }
        },
        mounted() {
            $('#footer').removeClass('bg-dark');
			$('#footer').addClass('bg-light');
            $('.modal-backdrop').remove();
			clearBody();
			addClassView();
            this.$emit('mountedMain', false);
        }
    }
</script>

<style>
	/* *{padding: 0 ; box-sizing: border-box ; list-style: none; word-break: keep-all;} */
	/* body{color: #555; background: #f8f9fa;} */
</style>