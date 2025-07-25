<template>
    <section class="row d-flex dashboard">
        <big-menu 
        :pMenu="'keywordAnalysis'"
        @mountedMain="activeMain"></big-menu>
		<div class="full-wrap flex-column non-reverse">
           <article class="admin-list m-none">
				<div class="admin-title d-flex justify-content-between align-items-center row m-0">
					<h3>키워드분석</h3>
					<form class="form-inline multi-search flex-column mt-3">
						<div class="row m-0">
							<div class="btn-title w991u">조회기간<span></span></div>
                            <date-picker ref="fromdate" class="form-control shadow-none rounded-0 font-14 fromdate" :pDisabled="false"></date-picker>
							<date-picker ref="todate" class="form-control shadow-none rounded-0 font-14 todate" :pDisabled="false"></date-picker>
							<button class="input-group-text btn shadow-none rounded-0 search" type="submit" style="margin-left: -1px;" @click.prevent="clickSearchBtn"><i class="bi bi-search"></i></button>
						</div>
					</form>
				</div>
                <div class="d-flex btn-title-group mt-3">
					<button class="btn shadow-none btn-title" :class="[activeMedia.naver === true ? 'active' : '']" @click="clickMedia($event, 'media', 'naver')">네이버 검색광고</button>
					<button class="btn shadow-none btn-title" :class="[activeMedia.kakaosa === true ? 'active' : '']" @click="clickMedia($event, 'media', 'kakaosa')">카카오 검색광고</button>
				</div>
			</article>
            <article class="admin-list m-none" style="margin-left: 30px;">
                <div class="admin-title d-flex justify-content-between align-items-center row">
					<h3>키워드 순위</h3>
					<div class="edit-analysis d-flex align-items-center dropdown">
						<a class="btn shadow-none" href="#" role="button" id="ranking-indicator" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="bi bi-gear"></i></a>
						<div class="dropdown-menu dropdown-menu-right">
							<form>
								<h6 class="dropdown-header">성과 지표</h6>
								<div class="form-check form-check-inline">
									<input class="form-check-input" type="checkbox" id="ranking-01" value="cst" :checked="kpi10.cst.check" :disabled="kpi10.cst.visible === false" @change="clickCheckpi10($event, 'cst')">
									<label class="form-check-label" for="ranking-01">광고비</label>
								</div>
								<div class="form-check form-check-inline">
									<input class="form-check-input" type="checkbox" id="ranking-02" value="im" :checked="kpi10.im.check" :disabled="kpi10.im.visible === false" @change="clickCheckpi10($event, 'im')">
									<label class="form-check-label" for="ranking-02">노출수</label>
								</div>
								<div class="form-check form-check-inline">
									<input class="form-check-input" type="checkbox" id="ranking-03" value="clk" :checked="kpi10.clk.check" :disabled="kpi10.clk.visible === false" @change="clickCheckpi10($event, 'clk')">
									<label class="form-check-label" for="ranking-03">클릭수</label>
								</div>
								<div class="form-check form-check-inline">
									<input class="form-check-input" type="checkbox" id="ranking-04" value="cv" :checked="kpi10.cv.check" :disabled="kpi10.cv.visible === false" @change="clickCheckpi10($event, 'cv')">
									<label class="form-check-label" for="ranking-04">전환수</label>
								</div>
								<!-- <div class="form-check form-check-inline">
									<input class="form-check-input" type="checkbox" id="ranking-05" value="cvr" :checked="kpi10.cvr.check" :disabled="kpi10.cvr.visible === false" @change="clickCheckpi10($event, 'cvr')">
									<label class="form-check-label" for="ranking-05">전환율</label>
								</div> -->
								<div class="form-check form-check-inline">
									<input class="form-check-input" type="checkbox" id="ranking-06" value="cr" :checked="kpi10.cr.check" :disabled="kpi10.cr.visible === false" @change="clickCheckpi10($event, 'cr')">
									<label class="form-check-label" for="ranking-06">전환매출</label>
								</div>
								<!-- <div class="form-check form-check-inline">
									<input class="form-check-input" type="checkbox" id="ranking-07" value="ctr" :checked="kpi10.ctr.check" :disabled="kpi10.ctr.visible === false" @change="clickCheckpi10($event, 'ctr')">
									<label class="form-check-label" for="ranking-07">클릭율</label>
								</div> -->
								<div class="form-check form-check-inline">
									<input class="form-check-input" type="checkbox" id="ranking-08" value="cpa" :checked="kpi10.cpa.check" :disabled="kpi10.cpa.visible === false" @change="clickCheckpi10($event, 'cpa')">
									<label class="form-check-label" for="ranking-08">전환당비용</label>
								</div>
								<div class="form-check form-check-inline">
									<input class="form-check-input" type="checkbox" id="ranking-09" value="cpc" :checked="kpi10.cpc.check" :disabled="kpi10.cpc.visible === false" @change="clickCheckpi10($event, 'cpc')">
									<label class="form-check-label" for="ranking-09">클릭당비용</label>
								</div>
								<div class="form-check form-check-inline">
									<input class="form-check-input" type="checkbox" id="ranking-10" value="roas" :checked="kpi10.roas.check" :disabled="kpi10.roas.visible === false" @change="clickCheckpi10($event, 'roas')">
									<label class="form-check-label" for="ranking-10">ROAS</label>
								</div>
							</form>
						</div>
					</div>
				</div>
                <div class="top10 d-flex">
					<table v-if="kpi10.cst.check === true">
						<thead>
							<tr>
								<th colspan="3" width="300">광고비 TOP10</th>
							</tr>
							<tr>
								<th width="50">순위</th>
								<th width="180">키워드</th>
								<th width="80">총광고비</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(cst, index) in main.cst10" :key="index">
								<td v-text="index+1"></td>
								<td v-text="cst.keyword_name"></td>
								<td v-text="priceToString(cst.cst)+ '원'"></td>
							</tr>
						</tbody>
					</table>
					<table v-if="kpi10.im.check === true">
						<thead>
							<tr>
								<th colspan="3" width="300">노출수 TOP10</th>
							</tr>
							<tr>
								<th width="50">순위</th>
								<th width="180">키워드</th>
								<th width="80">노출수</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(im, index) in main.im10" :key="index">
								<td v-text="index+1"></td>
								<td v-text="im.keyword_name"></td>
								<td v-text="priceToString(im.im)+ '회'"></td>
							</tr>
						</tbody>
					</table>
					<table v-if="kpi10.clk.check === true">
						<thead>
							<tr>
								<th colspan="3" width="300">클릭수 TOP10</th>
							</tr>
							<tr>
								<th width="50">순위</th>
								<th width="180">키워드</th>
								<th width="80">클릭수</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(clk, index) in main.clk10" :key="index">
								<td v-text="index+1"></td>
								<td v-text="clk.keyword_name"></td>
								<td v-text="priceToString(clk.clk)+ '회'"></td>
							</tr>
						</tbody>
					</table>
					<table v-if="kpi10.cv.check === true">
						<thead>
							<tr>
								<th colspan="3" width="300">전환수 TOP10</th>
							</tr>
							<tr>
								<th width="50">순위</th>
								<th width="180">키워드</th>
								<th width="80">전환수</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(cv, index) in main.cv10" :key="index">
								<td v-text="index+1"></td>
								<td v-text="cv.keyword_name"></td>
								<td v-text="priceToString(cv.cv)+ '회'"></td>
							</tr>
						</tbody>
					</table>
					<table v-if="kpi10.cr.check === true">
						<thead>
							<tr>
								<th colspan="3" width="300">전환매출 TOP10</th>
							</tr>
							<tr>
								<th width="50">순위</th>
								<th width="180">키워드</th>
								<th width="80">전환매출</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(cr, index) in main.cr10" :key="index">
								<td v-text="index+1"></td>
								<td v-text="cr.keyword_name"></td>
								<td v-text="priceToString(cr.cr)+ '원'"></td>
							</tr>
						</tbody>	
					</table>
					<table v-if="kpi10.cpa.check === true">
						<thead>
							<tr>
								<th colspan="3" width="300">전환당비용 TOP10</th>
							</tr>
							<tr>
								<th width="50">순위</th>
								<th width="180">키워드</th>
								<th width="80">전환당비용</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(cpa, index) in main.cpa10" :key="index">
								<td v-text="index+1"></td>
								<td v-text="cpa.keyword_name"></td>
								<td v-text="priceToString(cpa.cpa)+ '원'"></td>
							</tr>
						</tbody>
					</table>
					<table v-if="kpi10.cpc.check === true">
						<thead>
							<tr>
								<th colspan="3" width="300">클릭당비용 TOP10</th>
							</tr>
							<tr>
								<th width="50">순위</th>
								<th width="180">키워드</th>
								<th width="80">클릭당비용</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(cpc, index) in main.cpc10" :key="index">
								<td v-text="index+1"></td>
								<td v-text="cpc.keyword_name"></td>
								<td v-text="priceToString(cpc.cpc)+ '원'"></td>
							</tr>
						</tbody>
					</table>
					<table v-if="kpi10.roas.check === true">
						<thead>
							<tr>
								<th colspan="3" width="300">ROAS TOP10</th>
							</tr>
							<tr>
								<th width="50">순위</th>
								<th width="180">키워드</th>
								<th width="80">ROAS</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(roas, index) in main.roas10" :key="index">
								<td v-text="index+1"></td>
								<td v-text="roas.keyword_name"></td>
								<td v-text="priceToString(roas.roas)+ '원'"></td>
							</tr>
						</tbody>
					</table>
				
				</div>
			</article>
            <article class="admin-list flex-none m-none">
                <div class="admin-title d-flex justify-content-between align-items-center row">
					<div class="d-flex align-items-center">
						<h3>키워드 리포트</h3>
					</div>
					<div class="edit-analysis d-flex align-items-center dropdown">
						<a class="btn shadow-none" href="#" role="button" id="edit-indicator" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="bi bi-gear"></i></a>
						<div class="dropdown-menu dropdown-menu-right">
							<form>
								<h6 class="dropdown-header">성과 지표</h6>
								<div class="form-check form-check-inline">
									<input class="form-check-input" type="checkbox" id="analysis-01" value="cst" :checked="kpi.cst.check" :disabled="kpi.cst.visible === false" @change="clickCheckpi($event, 'cst')">
									<label class="form-check-label" for="analysis-01">광고비</label>
								</div>
								<div class="form-check form-check-inline">
									<input class="form-check-input" type="checkbox" id="analysis-02" value="im" :checked="kpi.im.check" :disabled="kpi.im.visible === false" @change="clickCheckpi($event, 'im')">
									<label class="form-check-label" for="analysis-02">노출수</label>
								</div>
								<div class="form-check form-check-inline">
									<input class="form-check-input" type="checkbox" id="analysis-03" value="clk" :checked="kpi.clk.check" :disabled="kpi.clk.visible === false" @change="clickCheckpi($event, 'clk')">
									<label class="form-check-label" for="analysis-03">클릭수</label>
								</div>
								<div class="form-check form-check-inline">
									<input class="form-check-input" type="checkbox" id="analysis-04" value="cv" :checked="kpi.cv.check" :disabled="kpi.cv.visible === false" @change="clickCheckpi($event, 'cv')">
									<label class="form-check-label" for="analysis-04">전환수</label>
								</div>
								<div class="form-check form-check-inline">
									<input class="form-check-input" type="checkbox" id="analysis-05" value="cvr" :checked="kpi.cvr.check" :disabled="kpi.cvr.visible === false" @change="clickCheckpi($event, 'cvr')">
									<label class="form-check-label" for="analysis-05">전환율</label>
								</div>
								<div class="form-check form-check-inline">
									<input class="form-check-input" type="checkbox" id="analysis-06" value="cr" :checked="kpi.cst.check" :disabled="kpi.cr.visible === false" @change="clickCheckpi($event, 'cr')">
									<label class="form-check-label" for="analysis-06">전환매출</label>
								</div>
								<div class="form-check form-check-inline">
									<input class="form-check-input" type="checkbox" id="analysis-07" value="ctr" :checked="kpi.ctr.check" :disabled="kpi.ctr.visible === false" @change="clickCheckpi($event, 'ctr')">
									<label class="form-check-label" for="analysis-07">클릭율</label>
								</div>
								<div class="form-check form-check-inline">
									<input class="form-check-input" type="checkbox" id="analysis-08" value="cpa" :checked="kpi.cpa.check" :disabled="kpi.cpa.visible === false" @change="clickCheckpi($event, 'cpa')">
									<label class="form-check-label" for="analysis-08">전환당비용</label>
								</div>
								<div class="form-check form-check-inline">
									<input class="form-check-input" type="checkbox" id="analysis-09" value="cpc" :checked="kpi.cpc.check" :disabled="kpi.cpc.visible === false" @change="clickCheckpi($event, 'cpc')">
									<label class="form-check-label" for="analysis-09">클릭당비용</label>
								</div>
								<div class="form-check form-check-inline">
									<input class="form-check-input" type="checkbox" id="analysis-10" value="roas" :checked="kpi.roas.check" :disabled="kpi.roas.visible === false" @change="clickCheckpi($event, 'roas')">
									<label class="form-check-label" for="analysis-10">ROAS</label>
								</div>
							</form>
						</div>
					</div>
				</div>
                <div class="ad-media overflow-scroll m-none bg-white">
                    <table width="100%"><!--전체 윤곽 테이블 시작-->
                    <tbody>
						<thead>
							<tr class="bg-th">
								<td style="width: 25%;">
									<table style="width: 100%;"> 
										<tbody>
											<tr ><th class="bg-th" width="300" style="height: 50px; text-align: center;">카테고리</th></tr>
										</tbody>
									</table>
								</td>
								<td style="width: 75%;">
								<table style="width: 100%;"> 
								<tbody>
									<tr >
										<th class="bg-th" width="200" style="text-align: center; height: 50px;">키워드</th>
										<th class="bg-th" width="100" style="height: 50px;" v-if="kpi.cst.check">광고비
											<template v-if="main.sort === 'csta' || main.sort === 'cstd'">
												<button v-if="main.sort === 'csta'" class="active" @click="clickSort('cstd')"><i class="bi bi-caret-up-fill activeArrow"></i></button>
												<button v-if="main.sort === 'cstd'" class="active" @click="clickSort('csta')"><i class="bi bi-caret-down-fill activeArrow"></i></button>
											</template>
											<template v-else>
												<button class="active" @click="clickSort('cstd')"><i class="bi bi-caret-down-fill"></i></button>
											</template>
										</th>
										<th class="bg-th" width="100" style="height: 50px;" v-if="kpi.im.check">노출수
											<template v-if="main.sort === 'ima' || main.sort === 'imd'">
												<button v-if="main.sort === 'ima'" class="active" @click="clickSort('imd')"><i class="bi bi-caret-up-fill activeArrow"></i></button>
												<button v-if="main.sort === 'imd'" class="active" @click="clickSort('ima')"><i class="bi bi-caret-down-fill activeArrow"></i></button>
											</template>
											<template v-else>
												<button class="active" @click="clickSort('imd')"><i class="bi bi-caret-down-fill"></i></button>
											</template>
										</th>
										<th class="bg-th" width="100" style="height: 50px;" v-if="kpi.clk.check">클릭수
											<template v-if="main.sort === 'clka' || main.sort === 'clkd'">
												<button v-if="main.sort === 'clka'" class="active" @click="clickSort('clkd')"><i class="bi bi-caret-up-fill activeArrow"></i></button>
												<button v-if="main.sort === 'clkd'" class="active" @click="clickSort('clka')"><i class="bi bi-caret-down-fill activeArrow"></i></button>
											</template>
											<template v-else>
												<button class="active" @click="clickSort('clkd')"><i class="bi bi-caret-down-fill"></i></button>
											</template>
										</th>
										<th class="bg-th" width="100" style="height: 50px;" v-if="kpi.cv.check">전환수
											<template v-if="main.sort === 'cva' || main.sort === 'cvd'">
												<button v-if="main.sort === 'cva'" class="active" @click="clickSort('cvd')"><i class="bi bi-caret-up-fill activeArrow"></i></button>
												<button v-if="main.sort === 'cvd'" class="active" @click="clickSort('cva')"><i class="bi bi-caret-down-fill activeArrow"></i></button>
											</template>
											<template v-else>
												<button class="active" @click="clickSort('cvd')"><i class="bi bi-caret-down-fill"></i></button>
											</template>
										</th>
										<th class="bg-th" width="100" style="height: 50px;" v-if="kpi.cvr.check">전환율
											<template v-if="main.sort === 'cvra' || main.sort === 'cvrd'">
												<button v-if="main.sort === 'cvra'" class="active" @click="clickSort('cvrd')"><i class="bi bi-caret-up-fill activeArrow"></i></button>
												<button v-if="main.sort === 'cvrd'" class="active" @click="clickSort('cvra')"><i class="bi bi-caret-down-fill activeArrow"></i></button>
											</template>
											<template v-else>
												<button class="active" @click="clickSort('cvrd')"><i class="bi bi-caret-down-fill"></i></button>
											</template>
										</th>
										<th class="bg-th" width="100" style="height: 50px;" v-if="kpi.cr.check">전환매출
											<template v-if="main.sort === 'cra' || main.sort === 'crd'">
												<button v-if="main.sort === 'cra'" class="active" @click="clickSort('crd')"><i class="bi bi-caret-up-fill activeArrow"></i></button>
												<button v-if="main.sort === 'crd'" class="active" @click="clickSort('cra')"><i class="bi bi-caret-down-fill activeArrow"></i></button>
											</template>
											<template v-else>
												<button class="active" @click="clickSort('crd')"><i class="bi bi-caret-down-fill"></i></button>
											</template>
										</th>
										<th class="bg-th" width="100" style="height: 50px;" v-if="kpi.ctr.check">클릭율
											<template v-if="main.sort === 'ctra' || main.sort === 'ctrd'">
												<button v-if="main.sort === 'ctra'" class="active" @click="clickSort('ctrd')"><i class="bi bi-caret-up-fill activeArrow"></i></button>
												<button v-if="main.sort === 'ctrd'" class="active" @click="clickSort('ctra')"><i class="bi bi-caret-down-fill activeArrow"></i></button>
											</template>
											<template v-else>
												<button class="active" @click="clickSort('ctrd')"><i class="bi bi-caret-down-fill"></i></button>
											</template>
										</th>
										<th class="bg-th" width="100" style="height: 50px;" v-if="kpi.cpa.check">전환당비용
											<template v-if="main.sort === 'cpaa' || main.sort === 'cpad'">
												<button v-if="main.sort === 'cpaa'" class="active" @click="clickSort('cpad')"><i class="bi bi-caret-up-fill activeArrow"></i></button>
												<button v-if="main.sort === 'cpad'" class="active" @click="clickSort('cpaa')"><i class="bi bi-caret-down-fill activeArrow"></i></button>
											</template>
											<template v-else>
												<button class="active" @click="clickSort('cpad')"><i class="bi bi-caret-down-fill"></i></button>
											</template>
										</th>
										<th class="bg-th" width="100" style="height: 50px;" v-if="kpi.cpc.check">클릭당비용
											<template v-if="main.sort === 'cpca' || main.sort === 'cpcd'">
												<button v-if="main.sort === 'cpca'" class="active" @click="clickSort('cpcd')"><i class="bi bi-caret-up-fill activeArrow"></i></button>
												<button v-if="main.sort === 'cpcd'" class="active" @click="clickSort('cpca')"><i class="bi bi-caret-down-fill activeArrow"></i></button>
											</template>
											<template v-else>
												<button class="active" @click="clickSort('cpcd')"><i class="bi bi-caret-down-fill"></i></button>
											</template>
										</th>
										<th class="bg-th" width="100" style="height: 50px;" v-if="kpi.roas.check">ROAS
											<template v-if="main.sort === 'roasa' || main.sort === 'roasd'">
												<button v-if="main.sort === 'roasa'" class="active" @click="clickSort('roasd')"><i class="bi bi-caret-up-fill activeArrow"></i></button>
												<button v-if="main.sort === 'roasd'" class="active" @click="clickSort('roasa')"><i class="bi bi-caret-down-fill activeArrow"></i></button>
											</template>
											<template v-else>
												<button class="active" @click="clickSort('roasd')"><i class="bi bi-caret-down-fill"></i></button>
											</template>
										</th>
									</tr>
								</tbody>
								</table>
								</td>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td style="width: 25%;">
									<table height="100" style="width: 100%;"> 
										<tbody>
											<!-- <tr v-for="(category, index) in getCategorys" :key="index" :class="category.isMainData"> -->
											<tr v-for="(category, index) in getCategorys" :key="index" :class="[category.isMainData, category.isActive === true ? 'activeTr' : '']">
												<template v-if="category.isMainData === 'maindata'">
													<td width="300" v-text="category.name"></td>
												</template>
												<template v-else>
													<td width="300" v-text="category.name" @click="clickAdgroup(category)"></td>
												</template>
											</tr>
										</tbody>
									</table>
								</td>
								
								<td style="width: 75%;">
								<table height="100" style="width: 100%;"> 
								<tbody>
									<tr v-for="data in getDatasForMain" :key="data.keyword_id">
										<td width="200" v-text="data.keyword_name"></td>
										<td width="100" v-if="kpi.cst.check" v-text="priceToString(data.cst) + '원'"></td>
										<td width="100" v-if="kpi.im.check" v-text="priceToString(data.im) + '회'"></td>
										<td width="100" v-if="kpi.clk.check" v-text="priceToString(data.clk) + '회'"></td>
										<td width="100" v-if="kpi.cv.check" v-text="priceToString(data.cv) + '회'"></td>
										<td width="100" v-if="kpi.cvr.check" v-text="priceToString(data.cvr) + '%'"></td>
										<td width="100" v-if="kpi.cr.check" v-text="priceToString(data.cr) + '원'"></td>
										<td width="100" v-if="kpi.ctr.check" v-text="priceToString(data.ctr) + '%'"></td>
										<td width="100" v-if="kpi.cpa.check" v-text="priceToString(data.cpa) + '원'"></td>
										<td width="100" v-if="kpi.cpc.check" v-text="priceToString(data.cpc) + '원'"></td>
										<td width="100" v-if="kpi.roas.check" v-text="priceToString(data.roas) + '원'"></td>
									</tr>
									
								</tbody>
								</table>
								</td>
							</tr>
						</tbody>
                        
                    </tbody>
                    </table>
					<ul class="pagination d-flex justify-content-center align-items-center mb-30">
                        <li class="page-item"><a class="page-link shadow-none" href="javascript:;" aria-label="Previous" @click="clickPreviousFirstPageBtnForMain">
                            <span aria-hidden="true"><i class="bi bi-chevron-double-left m-0"></i></span></a>
                        </li>
						<li class="page-item" :class="{disabled : isFirstPageGroupForMain}">
							<a class="page-link shadow-none" href="javascript:;" aria-label="Previous" @click="clickPreviousPageBtnForMain">
								<span aria-hidden="true"><i class="bi bi-chevron-left"></i></span>
							</a>
						</li>
						<li class="page-item" v-for="page in main.pages" :key="page">
							<a class="page-link shadow-none" href="javascript:;" v-text="page"
							:class="{active : page-1 === main.start}"
							@click="clickPageBtnForMain(page-1)"></a>
						</li>
						<li class="page-item" :class="{disabled : isLastPageGroupForMain}">
							<a class="page-link shadow-none" href="javascript:;" aria-label="Next" @click="clickNextPageBtnForMain">
								<span aria-hidden="true"><i class="bi bi-chevron-right"></i></span>
							</a>
						</li>
                        <li class="page-item"><a class="page-link shadow-none" href="javascript:;" aria-label="Next" @click="clickNextEndPageBtnForMain">
                            <span><i class="bi bi-chevron-double-right m-0"></i></span></a>
                        </li>
					</ul>
				</div>
			</article>
		</div>
		<div class="pc-only w991d d-flex justify-content-center align-items-center flex-column">
			<i class="bi bi-x-circle"></i>
			<p>PC전용 기능입니다.</p>
			<p>PC버전에서 확인해 주세요.</p>
		</div>
		<expire-session-modal ref="expireSessionModal" style="display:none"></expire-session-modal>
		<mask-modal ref="maskModal" style="display:none"></mask-modal>
    </section>
</template>

<script>
import $ from 'jquery';
import {isMobile, priceToString} from  '../../assets/js/common.js';
import bigMenu from '../../components/layout/bigMenu.vue';
import datePicker from '../../components/common/datePicker.vue';
import expireSessionModal from '../../components/modal/expireSessionModal.vue';
import messageModal from '../../components/modal/messageModal.vue';
import maskModal from '../../components/modal/maskModal.vue';
import moment from 'moment';
import { store } from '../../store/store.js';
import { SHA256 } from '../../assets/js/sha256.js';
import {API_URL, TEMP_KEY} from '../../configs/config.js';


    export default {
        data() {
            return {
				category : [],
                activeMedia : {
					naver : true,
					kakaosa : false,
					type : 'media',
					media : 'naver',
					campaignId : '',
					campaignType : '',
					adgroupid : '',
				},
				main : {
					field : "",
					query : null,
					responseData : null,
					data : null,
					start : 0, //현재 페이지
					display : 10, //게시글의 수
					displayPageNum : isMobile() === true ? 5 : 10, // 페이지 번호의 수
					sort : "cstd",
					pages : [],
					isFirst : false,
					isEnd : false,
					clk10 : [],
					im10 : [],
					cst10 : [],
					cv10 : [],
					cr10 : [],
					cpc10 : [],
					cpa10 : [],
					roas10 : [],
				},
				kpi10 : {
					clk : {visible : true, check : true}, 	//클릭수
					im : {visible : true, check : true}, 	//노출수
					cst : {visible : false, check : true}, 	//광고비
					cv : {visible : true, check : true}, 	//전환수
					cr : {visible : false, check : true}, 	//전환매출
					// ctr : {visible : true, check : false}, 	//클릭률
					cpc : {visible : true, check : false}, 	//클릭 당 비용
					cpa : {visible : true, check : false}, 	//전환 당 비용 
					// cvr : {visible : false, check : true}, 	//전환율 
					roas : {visible : true, check : false}, //ROAS
				},
				kpi : {
					clk : {visible : true, check : true}, 	//클릭수
					im : {visible : true, check : true}, 	//노출수
					cst : {visible : false, check : true}, 	//광고비
					cv : {visible : true, check : true}, 	//전환수
					cr : {visible : false, check : true}, 	//전환매출
					ctr : {visible : true, check : false}, 	//클릭률
					cpc : {visible : true, check : false}, 	//클릭 당 비용
					cpa : {visible : true, check : false}, 	//전환 당 비용 
					cvr : {visible : false, check : true}, 	//전환율 
					roas : {visible : true, check : false}, //ROAS
				},
			}          
        },
		computed: {
            getCategorys() {
                return this.category;
            },
			getDatasForMain() {
      			return this.main.data;
    		},
			isFirstPageGroupForMain() {
				return this.main.isFirst;
			},
			isLastPageGroupForMain() {
				return this.main.isEnd;
			},
		},
        components : {
			bigMenu,
			datePicker,
            messageModal,
			expireSessionModal,
			maskModal,
		},
        mounted() {
            $(".main").removeClass("m-h-100");
            this.click7Day();
            this.clickSearchBtn();
        },
        methods : {
			activeMain(flag) {
                this.$emit('mountedMain', true);
                this.$emit('mountedDasyboad', true);
            },
            handleExpireSession() {
				this.$refs.expireSessionModal.showModal();
			},
			handleShowMask() {
				this.$refs.maskModal.showModal();
			},
			handleHideMask() {
				this.$refs.maskModal.hideModal();
			},
			priceToString(salse) {
				if(salse === undefined) return '';

				return priceToString(salse);
			},
			handleExpireSession() {
				this.$refs.expireSessionModal.showModal();
			},
            click7Day() {
				// this.$refs.fromdate.setDate(moment().subtract(7,"d").format("YYYY-MM-DD"));
				this.$refs.fromdate.setDate(moment().subtract(1,"d").format("YYYY-MM-DD"));
				this.$refs.todate.setDate(moment().subtract(1,"d").format("YYYY-MM-DD"));

			},
            clickMedia(event,type, media) {
				var vm = this;
				if(vm.activeMedia["media"] === media) return false;

                var $btn = $(event.target);
				var keys = Object.keys(vm.activeMedia);
				for (let i = 0; i < keys.length; i++) {
					if(keys[i] === "type" || keys[i] === "media") continue;
					vm.activeMedia[keys[i]] = false;
				}

				vm.activeMedia[media] = true;
				vm.activeMedia["type"] = type;
				vm.activeMedia["media"] = media;

				this.main.start = 0;
				this.getCategory();
			},
            getCategory() {
                var vm = this;
                var category = vm.activeMedia.media === "naver" ? "N" : "D"; 


				$.ajax({
					type: 'get', //요청 메소드 방식
					url: API_URL + '/app/analysis/keywordreport',
                    headers : { "authorization" : SHA256(TEMP_KEY) },
					data :{
                        "userid" : store.state.userStore.userinfo.userid,
						"fromdate" : vm.$refs.fromdate.getDate(),
						"todate" : vm.$refs.todate.getDate(),
                        "campaigntype" : "",
                        "adgroupid" : "",
                        "category" : category,
						"session" : store.state.userStore.session
                    },
					beforeSend : function(data) {
                        //  vm.handleShowMask();
					},
					success : function(data){
						vm.category = [];
						vm.activeMedia.campaignId = null;
						vm.activeMedia.campaignType = null;
						vm.activeMedia.adgroupid = null;

						var isFirst = true;
                        var campaign = "";
                        if(data.result === "success") {
                            data.data.category.adgroup.forEach(function(adgroup) {
                                if(campaign != adgroup.campaign_id) {
                                    campaign = adgroup.campaign_id;
                                    vm.category.push({
                                        isMainData : "maindata",
                                        type : "campaign",
                                        parent : '',
										parentType : adgroup.adgroup_type,
                                        id : adgroup.campaign_id,
                                        name : adgroup.campaign_name,
										isActive : false,

                                    });

									if(vm.activeMedia.campaignId === null) {
										vm.activeMedia.campaignId = adgroup.campaign_id;
										vm.activeMedia.campaignType = adgroup.adgroup_type;
										vm.activeMedia.adgroupid = adgroup.adgroup_id;
									}
                                }
                                
                                vm.category.push({
                                        isMainData : "subdata",
                                        type : "adgroup",
                                        parent : adgroup.campaign_id,
										parentType : adgroup.adgroup_type,
                                        id : adgroup.adgroup_id,
                                        name : adgroup.adgroup_name,
										isActive : isFirst === true ? true : false,
                                });

								isFirst = false;
                            })

							vm.getReport();
	
                        } else {
                            if(data.status === "0001") {
                                vm.handleExpireSession();
                            } else {}
                        }
					},
					error : function(a, b, c){
						if(a.status === 403) {
							vm.$store.commit("logout");
							vm.$store.commit("logoutActivedMdias");
							vm.$store.commit("logoutKakaoSa");
							vm.$router.push("/");
						}
					},
					complete : function(a, b, c) {
                        //  vm.handleHideMask();
					}
				});
            },
			getTopKpi(kpis) {
				var vm = this;
				var keys = Object.keys(kpis);
				keys.forEach(function(key) {
					vm.main[key + "10"] = [];
					vm.main[key + "10"] = kpis[key];
				})
			},
			getReport() {
                var vm = this;
                var category = vm.activeMedia.media === "naver" ? "N" : "D"; 

				$.ajax({
					type: 'get', //요청 메소드 방식
					url: API_URL + '/app/analysis/keywordreport',
                    headers : { "authorization" : SHA256(TEMP_KEY) },
					data :{
                        "userid" : store.state.userStore.userinfo.userid,
						"fromdate" : vm.$refs.fromdate.getDate(),
						"todate" : vm.$refs.todate.getDate(),
                        "campaigntype" : vm.activeMedia.campaignType,
                        "adgroupid" : vm.activeMedia.adgroupid,
						"md" : category,
						"start" : vm.main.start,
						"sort" : vm.main.sort,
						"display" : vm.main.display,
						"kpi" : "cst,im,cv,cpa,cpc,clk,cr,roas",
						"session" : store.state.userStore.session
                    },
					beforeSend : function(data) {
                         vm.handleShowMask();
					},
					success : function(data){
                        if(data.result === "success") {
							// console.log(data.data.keywords);
							vm.main.data = [];
							vm.main.responseData = null;

							vm.main.responseData = data;
							vm.main.data = data.data.keywords;
							vm.getStartAndEndPageForMain();
							vm.getTopKpi(data.data.kpis);

	
                        } else {
                            if(data.status === "0001") {
                                vm.handleExpireSession();
                            } else {}
                        }
					},
					error : function(a, b, c){
						if(a.status === 403) {
							vm.$store.commit("logout");
							vm.$store.commit("logoutActivedMdias");
							vm.$store.commit("logoutKakaoSa");
							vm.$router.push("/");
						}
					},
					complete : function(a, b, c) {
                         vm.handleHideMask();
					}
				});
			},
			getStartAndEndPageForMain() {
				this.main.pages = [];
				var endPage = Math.ceil((this.main.start+1) / this.main.displayPageNum) * this.main.displayPageNum;
				var startPage = (endPage - this.main.displayPageNum) + 1;
				var tempEndPage = Math.ceil(this.main.responseData.totalcount / this.main.display);
				if(endPage > tempEndPage) {
					endPage = tempEndPage;
				}

				this.main.isFirst = this.main.start+1 === 1 ? true : false;
				this.main.isEnd = (Math.ceil(this.main.responseData.totalcount/this.main.display) === (this.main.start+1)) ? true : false;

				for(var i=startPage; i<=endPage; i++) {
					this.main.pages.push(i);
				}
			},
			clickPreviousFirstPageBtnForMain() {
                this.main.start = 0;
                this.getReport();
            },
			clickPreviousPageBtnForMain() {
				this.main.start = this.main.start === 0 ? 0 : this.main.start-1;
				this.getReport();

			},
			clickNextEndPageBtnForMain() {
                let tempEndPage = Math.ceil(this.main.responseData.totalcount / this.main.display);
                this.main.start = tempEndPage - 1;
                this.getReport();
            },
			clickNextPageBtnForMain() {
				let tempEndPage = Math.ceil(this.main.responseData.totalcount / this.main.display);
				this.main.start = this.main.start > tempEndPage ? tempEndPage : this.main.start+1;
				this.getReport();

			},
			clickPageBtnForMain(page) {
				this.main.start = page;
				this.getReport();
			},
            clickSearchBtn() {
				this.category.length == 0 ? this.getCategory() : this.getReport();
            },
			clickAdgroup(data) {
				this.category.forEach(function(category) {
					if(category.isActive === true) {
						category.isActive = false;
						return true;
					}
				});

				this.category.forEach(function(category) {
					if(category.id === data.id) {
						category.isActive = true;
						return true;
					}
				});

				this.main.start = 0;
				this.activeMedia.campaignId = data.parent;
				this.activeMedia.campaignType = data.parentType;
				this.activeMedia.adgroupid = data.id;

				this.getReport();
			},
			clickCheckpi(event, type) {
				var vm = this;
				var $active = $(event.target);
				var keys = Object.keys(vm.kpi);
 				
				for (let i = 0; i < keys.length; i++) {
					if(keys[i].indexOf(type) > -1 ) {
						vm.kpi[keys[i]].check = $active.is(':checked');
						break;
					}
				}
			},
			clickCheckpi10(event, type) {
				var vm = this;
				var $active = $(event.target);
				var keys = Object.keys(vm.kpi10);

				for (let i = 0; i < keys.length; i++) {
					if(keys[i].indexOf(type) > -1 ) {
						vm.kpi10[keys[i]].check = $active.is(':checked');
						break;
					}
				}
			},
			clickSort(sort) {
				this.main.sort = sort;
				this.main.start = 0;
				this.getReport();
			},

        }

    }
</script>

<style scoped>
	.bg-th {
		background: #f8f9fa !important;
	}
	.activeTr {
		background: #666 !important;
    	color: #fff !important;
	}
	.activeArrow  {
		color: #7186d3;
	}

	/* 크롬 적용 */
	@media screen and (-webkit-min-device-pixel-ratio:0) and (min-width: 991px){ 
 	.main .dashboard{
		 flex-wrap: nowrap !important;
	}

	.item {
		width: 18%;
		text-align: center;
		padding: 5px;
		flex-grow: 1;
	}
}
</style>