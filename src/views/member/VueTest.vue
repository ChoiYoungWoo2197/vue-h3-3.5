<template>
	<div class="d-flex m-h-100">
		<big-menu-2 :pMenu="'dashboard'" @mountedMain="activeMain"></big-menu-2>
		<div class="wrap">
			<balance @logOut="handleLogOut"></balance>
			<section class="userinfo-edit">
				<div class="title d-flex justify-content-between align-items-center"><h2>pdf내려받기</h2></div>
				<article class="container-test-pdf">
					<button @click="htmlToPDF">pdf내려받기</button>
					<div ref="pdfArea" class="main">
						<div >
							<!-- pdf에 들어갈 내용 내용 -->
							<!-- 타이틀 -->
							<div class="title mb-5">
								<h2 class="text-center">광고매체분석 리포트</h2>
							</div>
							<div class="card sub mb-3">
								<h4 class="mb-3">보고서 정보</h4>
								<ul>
									<li>담당자 : 최영우</li>
									<li>작성일자 : 2023-05-01 ~ 2023-05-08</li>
									<li>유형 : 광고매체분석</li>
								</ul>
							</div>
							<div class="card graph  mb-3">
								<h4 class="mb-3">매체통합 광고요약</h4>
								<div class="d-flex justify-content-center align-items-center">
									<div id="grap" class="" style="width:600px; height: 300px;"></div>
								</div>
								
							</div>
							<div class="card report  mb-3">
								<h4 class="mb-3">매체별 리포트</h4>
								<div class="d-flex justify-content-center align-items-center">
									<table >
										<thead>
											<tr style="">
												<td width="20px"></td>
												<td>매체별</td>
												<td>광고비</td>
												<td>노출수</td>
												<td>클릭수</td>
												<td>전환수</td>
												<td>전환율</td>
												<td>전환매출</td>
												<td>클릭율</td>
												<td>전환당비용</td>
												<td>클릭당비용</td>
												<td>ROAS</td>
											</tr>
										</thead>
										<tbody >
											<tr>
												<td></td>
												<td>검색광고</td>
												<td>1,000,000</td>
												<td>100,000</td>
												<td>1000</td>
												<td>300</td>
												<td>0.10%</td>
												<td>1,000,000</td>
												<td>1,000,000</td>
												<td>1,000,000</td>
												<td>1,000,000</td>
												<td>1,000,000</td>
											</tr>
											<tr>
												<td></td>
												<td>검색광고</td>
												<td>1,000,000</td>
												<td>100,000</td>
												<td>1000</td>
												<td>300</td>
												<td>0.10%</td>
												<td>1,000,000</td>
												<td>1,000,000</td>
												<td>1,000,000</td>
												<td>1,000,000</td>
												<td>1,000,000</td>
											</tr>
											<tr>
												<td></td>
												<td>검색광고</td>
												<td>1,000,000</td>
												<td>100,000</td>
												<td>1000</td>
												<td>300</td>
												<td>0.10%</td>
												<td>1,000,000</td>
												<td>1,000,000</td>
												<td>1,000,000</td>
												<td>1,000,000</td>
												<td>1,000,000</td>
											</tr>
											<tr>
												<td></td>
												<td>검색광고</td>
												<td>1,000,000</td>
												<td>100,000</td>
												<td>1000</td>
												<td>300</td>
												<td>0.10%</td>
												<td>1,000,000</td>
												<td>1,000,000</td>
												<td>1,000,000</td>
												<td>1,000,000</td>
												<td>1,000,000</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
				</article>
			</section>
		</div>

	</div>
</template>

<script>
import $ from 'jquery';
import xlsx from 'xlsx';
import moment from 'moment';
import {isblank, isNotId, isNotPassword, isNotPasswordc, isNotEmail, isNotTel} from  '../../assets/js/common.js';
import expireSessionModal from '../../components/modal/expireSessionModal.vue';
import waiting2AgencyModal from '../../components/modal/waiting2AgencyModal.vue';
import maskModal from '../../components/modal/maskModal.vue';
import { store } from '../../store/store.js';
import { SHA256 } from '../../assets/js/sha256.js';
import { API_URL, TEMP_KEY } from '../../configs/config.js';
import balance from '../../components/dashboard2/balance.vue';
import bigMenu2 from '../../components/layout/bigMenu2.vue';
import logOutModal from '../../components/modal/logOutModal.vue';

import * as echarts from 'echarts';


export default {
	data() {
		return {
			data: null,
			pdfkey : 0,
		}
	},
	computed: {

	},
	watch: {

	},
	components: {
		bigMenu2,
		logOutModal,
		balance,
	},
	mounted() {
		$(".main").removeClass("m-h-100");
		var myChart = echarts.init( document.getElementById('grap'));
		var option;

		option = {
			xAxis: {
				type: 'category',
				data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
			},
			yAxis: {
				type: 'value'
			},
			series: [
				{
				data: [150, 230, 224, 218, 135, 147, 260],
				type: 'line'
				}
			]
		};

		option && myChart.setOption(option);

	},
	updated() {
	},
	methods: {
		activeMain(flag) {
			this.$emit('mountedMain', true);
			this.$emit('mountedDasyboad', true);
		},
		handleLogOut() {
			this.$refs.logOutModal.showModal();
		},
		htmlToPDF() {
			const name = 'document';

            this.$htmlToPdf(this.$refs.pdfArea, name);
            this.pdfKey += 1;    
        }
	},


}
</script>

<style scoped>
    .main{line-height: 24px; font-size: 14px; padding: 30px; }
	.card {padding: 20px; background-color: #f8f9fa;}
	table {font-size: 13px;}
	thead {background: #494949 !important; color: #eee; font-weight: 500; }
	tr{height: 20px;}
	td{padding: 2px;}



	  
</style>