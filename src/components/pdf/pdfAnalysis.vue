<template>
	<div :class="getUniqueId">
		
	</div>
</template>

<script>
export default {
	data() {
		return {
			uniqueId : null,
		}
	},
	computed: {
        getUniqueId() {
            if(!this.uniqueId) {
                this.uniqueId = 'vm-' + this._uid;
                return this.uniqueId;
            }
            return this.uniqueId;
        },
    },
	mounted() {

	},
	methods: {
	},


}
</script>

<style scoped>
	  	/* pdf 공통 css */
	*{margin: 0; padding: 0; box-sizing: border-box; -moz-box-sizing: border-box; font-family: 'Noto Sans KR', sans-serif !important;}
	/* .a4-l {width: 297mm; height: 210mm; display: flex; flex-direction: column; background: #f8f9fa; padding:20px;  line-height: 24px; font-size: 14px; } */
	.a4-l {width: 594mm; height: 420mm; display: flex; flex-direction: column; background: #fff; padding:20px;  line-height: 24px; font-size: 30px; }

	/* section1 */
	.section-1 { position: relative; background-image: url('../../assets/image/pdf_main_bg.png'); background-repeat: no-repeat;  background-position: center; background-size: cover; }
	.section-1 h1, h2, h3{color: white; }
	.section-1 .card-1,.card-2, .card-3 {padding: 100px; padding-bottom:0; padding-top: 0;}
	.section-1 .card-1 {padding-top: 50px;}
	.section-1 .card-1 .title h2 {font-size: 12rem; font-weight: 800; margin-left: -15px;}
	.section-1 .card-1 .title .b-l{border: 5px solid white; width: 25%; margin-top: 70px;}
	.section-1 .card-1 .logo {text-align: right; padding-top: 30px;}
	.section-1 .card-2 .adv {padding-top: 20px;}
	.section-1 .card-2 .adv h3 {font-size: 5rem; font-weight: 600; margin-left: -7px;}
	.section-1 .card-2 .adv h3 span {font-weight: 200;}
	.section-1 .card-3 {height: 20%; padding-bottom: 50px;}
	.section-1 .card-3 .footer{ line-height: 70px;}
	.section-1 .card-3 .b-p{border-left: 7px solid white; }
	.section-1 .card-3 .footer h3{font-size: 3rem; width: 100%; letter-spacing: 5px; font-weight: 600;}
	.section-1 .card-3 .footer h3 span{font-size: 35px;}
	.section-1 .card-3 .footer ul{color: white;}
	.section-1 .card-3 .footer li{float:left; margin-right: 20px; font-weight: 600;}
	.section-1 .card-3 .footer li span{font-weight: 300; font-size: 28px; padding-left: 10px;}

	/* section2 */
	.section-2 { position: relative; background-image: url('../../assets/image/pdf_inner_bg.png'); background-repeat: no-repeat;  background-position: center; background-size: cover; }
	.section-2 .card-1,.card-2, .card-3 {padding: 0 100px 0 100px;}
	.section-2 .card-1{height: 20%; flex-direction: column; padding-top: 100px;}
	.section-2 .card-1 .sub-title{padding-bottom: 50px;}
	.section-2 .card-1 .sub-title h2{color: #555; font-size: 3rem; font-weight: 600;}
	.section-2 .card-1 .b-l{border-top: 8px solid #3771F8; width: 5%;}
	.section-2 .card-1 .b-l + div{font-size: 20px;}
	.section-2 .card-2{padding-top: 30px; flex-direction: column; max-height: 80%; overflow: hidden;}
	.section-2 .card-2 .report{width: 100%;}
	.section-2 .card-2 .report table {font-size: 22px; border: 1px solid #ddd; border-radius: 15px;}
	.section-2 .card-2 .report thead tr{color: #eee; font-weight: 700 !important; font-size: 24px; }
	.section-2 .card-2 .report thead td{ background: #386ABE !important; }
	.section-2 .card-2 .report tbody tr {}
	.section-2 .card-2 .report tr{height: 30px;}
	.section-2 .card-2 .report td{padding: 2px 12px; border: 1px solid #ddd; background: #fff; text-align: right;}
	.section-2 .card-2 .report table tr.maindata td{font-weight: 700; background: #D0E1FF !important;}
	.section-2 .card-2 .report table tr.total td{font-weight: 700; background: #E6E6E6 !important;}
	.section-2 .card-3{height: 20%; flex-direction: column;}
	.section-2 .card-3 div div {font-size: 20px;}
	.section-2 .card-3 .footer{padding-bottom: 30px;}
	.grap{width: 2000px; display: none;}
</style>