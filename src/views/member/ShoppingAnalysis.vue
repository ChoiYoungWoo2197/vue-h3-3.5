<template>
  <div class="d-flex m-h-100 dashboard">
    <big-menu-2 :pMenu="'shoppingAnalysis'" @mountedMain="activeMain" class="pc"></big-menu-2>
    <div class="pc wrap">
      <balance @logOut="handleLogOut" @changeData="handleChangedBalance"></balance>
      <section>
        <message ref="message" class="mb-4">
          <span>
            <span>최근 집계 완료 시간(오늘) |
              <template v-for="(k,i) in accountlog" >
                <template v-if="'naver' === k.media">
                  <span v-if="k.campaign !== undefined && k.campaign !== ''" class="ml-1" :key="k+i+getUuidv4()"><span>{{"캠페인: "}}</span> {{k.campaign.split(" ")[1]}}</span>
                  <span v-if="k.adgroup !== undefined && k.adgroup !== ''" class="ml-1" :key="k+i+getUuidv4()"><span>{{"그룹: "}}</span> {{k.adgroup.split(" ")[1]}}</span>
                  <span v-if="k.keyword !== undefined && k.keyword !== ''" class="ml-1" :key="k+i+getUuidv4()"><span>{{"키워드: "}}</span> {{k.keyword.split(" ")[1]}}</span>
                  <span v-if="k.ad !== undefined && k.ad !== ''" class="ml-1" :key="k+i+getUuidv4()"><span>{{"소재: "}}</span> {{k.ad.split(" ")[1]}}</span>
                  <span v-if="k.shopping !== undefined && k.shopping !== ''" class="ml-1" :key="k+i+getUuidv4()"><span>{{"쇼핑: "}}</span> {{k.shopping.split(" ")[1]}}</span>
                </template>
              </template>              
            </span>
          </span>
        </message>         
        <div class="title d-flex justify-content-between align-items-center">
          <h2>쇼핑검색분석</h2>
          <div class="search d-flex">
            <date-range-picker ref="dateRangePicker" class="form-control" :pStart="start" :pEnd="end" :pDisabled="false" @changedDate="handleChangedDateRange"></date-range-picker>
            <button type="submit" class="btn submit" @click.prevent="clickSearchBtn">조회하기</button>
          </div>
        </div>
        <div class="select-btn">
          <button type="button" class="btn select" v-for="(k, i) in Object.keys(kpi)" :key="k + i + '-' + getUuidv4()" :class="[activeBtn[k] === true ? 'active' : '']" @click="clickBtn($event, k)" > {{ getKpiName(k) }} </button>
        </div>
        <div class="top10">
          <div class="col-12">
            <div class="top10-card">
              <h3 class="mb-2">{{ "총" + getKpiName(activeBtn.kpi) + " TOP10" }}</h3>
              <table>
                <thead>
                  <tr>
                    <td width="40px">#</td>
                    <td class="text-left" width="15%">캠페인</td>
                    <td class="text-left" width="15%">광고그룹</td>
                    <td class="text-left" width="15%">품질지수</td>
                    <td class="text-left" width="35%">소재</td>
                    <td class="text-right pr-0">{{ getKpiName(activeBtn.kpi) }}</td>
                    <td class="text-right pl-0" width="8%">%</td>                    
                  </tr>
                </thead>
                <tbody>
                  <template v-if="main[activeBtn.kpi + '10'].length === 0"><tr><td colspan="7" class="bg-td">데이터가 존재하지 않습니다.</td></tr></template>
                  <template v-else>
                    <template v-for="(t, index) in main[activeBtn.kpi + '10']" :key="index+getUuidv4()">
                      <tr  data-toggle="tooltip" data-placement="right" :title="priceToString(t[activeBtn.kpi]) !== '0' ? '캠페인 : ' + t.campaign_name + ' 그룹 : ' + t.adgroup_name + ', 키워드id : ' + t.keyword_id : '-'">
                        <template v-if="priceToString(t[activeBtn.kpi]) === '0'"><td colspan="7">-</td></template>
                        <template v-else>
                          <td v-text="index + 1"></td>
                          <td class="text-left">
                            <p class="d-flex align-items-center">
                              {{t.campaign_name}}
                              <a data-toggle="modal" data-target="#keyword-modal" class="btn-modal" @click="clickPlusBtn(index, t.campaign_id)"><span>더보기</span></a>
                            </p>
                          </td>
                          <td class="text-left">
                            <p class="d-flex align-items-center">
                              {{t.adgroup_name}}
                              <a data-toggle="modal" data-target="#keyword-modal" class="btn-modal" @click="clickPlusBtn2(index, t.adgroup_id)"><span>더보기</span></a>
                              <!-- <a data-toggle="modal" data-target="#keyword-modal" class="btn-modal" @click="clickPlusBtn2(index, t.adgroup_id)"><i class="bi bi-plus-square"></i></a> -->
                            </p>
                          </td>
                          <td class="text-left">
                            <div class="progress qigrade-container">
                              <div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" :style="{ width: calcQigrade(t.ad_qigrade) }">
                                <span class="sr-only"></span>
                              </div>
                              <span class="level-bar" style="left: 8px;"></span>
                              <span class="level-bar" style="left: 17px;"></span>
                              <span class="level-bar" style="left: 26px;"></span>
                              <span class="level-bar" style="left: 35px;"></span>
                              <span class="level-bar" style="left: 44px;"></span>
                              <span class="level-bar" style="left: 53px;"></span>
                            </div>                          
                          </td>
                          <td class="text-left">
                            <p class="font-weight-bold">{{ t.ad_pname ? t.ad_pname : t.ad_productname }}<small class="sub">{{ "-(" + t.ad_id	 + ")" }}</small></p>
                            <div class="item-container">
                              <div class="url-info">{{`가격: ${priceToString(t.ad_pprice)}원 / ${t.ad_deliveryfee === '0' ? '무료배송' : priceToString(t.ad_deliveryfee) +'원'}`}}</div>
                              <div class="url-info">{{t.ad_cnameofmall}}</div>
                              <div class="url-info">{{`쇼핑상품 ID:${t.ad_pid} / 몰상품 ID:${t.ad_pidofmall}`}}</div>
                            </div>
                            <div class="mb-2 mt-2">
                              <button type="button" class="btn-default btn btn-secondary btn-sm" @click="clickThumbnailSlide(t)" data-toggle="tooltip" data-placement="right" title="소재 이미지"><i class="bi bi-card-image"></i> 소재 이미지</button>
                              <button type="button" class="btn-default btn btn-secondary btn-sm ml-1" data-toggle="tooltip" data-placement="right" title="현재 입찰가(VAT미포함)"><i class="bi bi-currency-dollar"></i>{{priceToString(t.ad_bidamount)+"원"}}</button>
                              <button type="button" class="btn-default btn btn-secondary btn-sm ml-1" @click="goToUrl(t.ad_plandingurl)" data-toggle="tooltip" data-placement="right" title="연결된 링크"><i class="bi bi-link"></i>URL이동</button>
                            </div>                             
                          </td>
                          <td class="text-right pr-0">{{priceToString(t[activeBtn.kpi]) + getUnit(activeBtn.kpi)}}</td>
                          <td class="text-right pl-0">
                            <a href="#" class="d-flex align-items-center justify-content-end">
                              <template v-if="t.cp !== undefined">
                                <template v-if="t.cp.length === 0 || t.cp.per[activeBtn.kpi] === 0">{{'-'}}</template>
                                <template v-else>
                                  <span :class="[t.cp.per[activeBtn.kpi].indexOf('-') > -1 ? 'down' : 'up']">{{t.cp.per[activeBtn.kpi] + "%"}}<i :class="[t.cp.per[activeBtn.kpi].indexOf('-') > -1 ? 'bi bi-graph-down-arrow ' : 'bi bi-graph-up-arrow ']" class="ml-1 mr-0"></i></span>
                                </template>
                              </template>
                            </a>
                          </td>
                        </template>                        
                      </tr>
                      <!-- 조건부 서브 테이블 -->
                      <tr :key="index+getUuidv4()" v-if="expandedIndex === index">
                        <td colspan="7" style="padding: 8px;">
                          <div style="padding:8px; border-radius:4px; border: 2px solid #42b883;">
                            <table>
                              <thead>
                                <tr>
                                  <td width="40px">#</td>
                                  <td class="text-left" width="15%">캠페인</td>
                                  <td class="text-left" width="15%">광고그룹</td>
                                  <td class="text-left" width="15%">품질지수</td>
                                  <td class="text-left" width="35%">소재</td>
                                  <td class="text-right pr-0">{{ getKpiName(activeBtn.kpi) }}</td>
                                  <td class="text-right pl-0" width="8%">%</td>
                                </tr>
                              </thead>
                              <tbody>
                                <template v-if="expandedData !== null" >
                                  <template v-for="(t2, index2) in expandedData" :key="index2+getUuidv4()">
                                    <tr >
                                      <td>{{index2 + 1}}</td>
                                      <td class="text-left">
                                        <p class="d-flex align-items-center">{{t2.campaign_name}}</p>
                                      </td>
                                      <td class="text-left">
                                        <p class="d-flex align-items-center">{{t2.adgroup_name}}</p>
                                      </td>
                                      <td class="text-left">
                                        <div class="progress qigrade-container">
                                          <div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" :style="{ width: calcQigrade(t2.ad_qigrade) }">
                                            <span class="sr-only"></span>
                                          </div>
                                          <span class="level-bar" style="left: 8px;"></span>
                                          <span class="level-bar" style="left: 17px;"></span>
                                          <span class="level-bar" style="left: 26px;"></span>
                                          <span class="level-bar" style="left: 35px;"></span>
                                          <span class="level-bar" style="left: 44px;"></span>
                                          <span class="level-bar" style="left: 53px;"></span>
                                        </div>                          
                                      </td>
                                      <td class="text-left">
                                        <p class="font-weight-bold">{{ t2.ad_pname ? t2.ad_pname : t2.ad_productname }}<small class="sub">{{ "-(" + t2.ad_id	 + ")" }}</small></p>
                                        <div class="item-container">
                                          <div class="url-info">{{`가격: ${priceToString(t2.ad_pprice)}원 / ${t2.ad_deliveryfee === '0' ? '무료배송' : priceToString(t2.ad_deliveryfee) +'원'}`}}</div>
                                          <div class="url-info">{{t2.ad_cnameofmall}}</div>
                                          <div class="url-info">{{`쇼핑상품 ID:${t2.ad_pid} / 몰상품 ID:${t2.ad_pidofmall}`}}</div>
                                        </div>
                                        <div class="mb-2 mt-2">
                                          <button type="button" class="btn-default btn btn-secondary btn-sm" @click="clickThumbnailSlide(t2)" data-toggle="tooltip" data-placement="right" title="소재 이미지"><i class="bi bi-card-image"></i> 소재 이미지</button>
                                          <button type="button" class="btn-default btn btn-secondary btn-sm ml-1" data-toggle="tooltip" data-placement="right" title="현재 입찰가(VAT미포함)"><i class="bi bi-currency-dollar"></i>{{priceToString(t2.ad_bidamount)+"원"}}</button>
                                          <button type="button" class="btn-default btn btn-secondary btn-sm ml-1" @click="goToUrl(t2.ad_plandingurl)" data-toggle="tooltip" data-placement="right" title="연결된 링크"><i class="bi bi-link"></i>URL이동</button>
                                        </div>                                          
                                      </td>
                                      <td class="text-right pr-0">{{priceToString(t2[activeBtn.kpi]) + getUnit(activeBtn.kpi)}}</td>
                                      <td class="text-right pl-0">
                                        <a href="#" class="d-flex align-items-center justify-content-end">
                                          <template v-if="t2.cp !== undefined">
                                            <template v-if="t2.cp.length === 0 || t2.cp.per[activeBtn.kpi] === 0">{{'-'}}</template>
                                            <template v-else>
                                              <span :class="[t2.cp.per[activeBtn.kpi].indexOf('-') > -1 ? 'down' : 'up']">{{t2.cp.per[activeBtn.kpi] + "%"}}<i :class="[t2.cp.per[activeBtn.kpi].indexOf('-') > -1 ? 'bi bi-graph-down-arrow ' : 'bi bi-graph-up-arrow ']" class="ml-1 mr-0"></i></span>
                                            </template>
                                          </template>
                                        </a>
                                      </td>                                
                                    </tr>                                    
                                  </template>
                                </template>
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>                         
                    </template>
                  </template>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <article>
          <div class="title d-flex justify-content-between align-items-center">
            <h3>검색광고 리포트</h3>
            <div class="indicator d-flex align-items-center dropdown">
              <button type="button" class="btn shadow-none p-0" data-toggle="dropdown" aria-expanded="false">
                <i class="bi bi-gear m-0"></i>
              </button>
              <div class="dropdown-menu dropdown-menu-right">
                <form>
                  <template v-for="(k,i) in ['cst','im','clk','cv','cr','ctr','cpa','cpc','cvr','roas']" :key="i+getUuidv4()">
                    <div class="form-check" >
                      <input class="form-check-input" type="checkbox" :id="'indicator'+i" :value=k :checked="kpi[k].check" :disabled="kpi[k].visible === false" @change="clickCheckpi($event, k)" />
                      <label class="form-check-label" :for="'indicator'+i" ><p class="d-flex align-items-center">{{getKpiName(k)}}</p></label >
                    </div>
                  </template>
                  <div class="form-border"></div>
                  <div class="form-check">
                    <input class="form-check-input radio-check" type="checkbox" id="indicator11" value="10" :checked="pagination.display === 10" @click="pagination.display === 10 ? $event.preventDefault() : ''" @change="clickRadioDisplay($event, 10)"/>
                    <label class="form-check-label" for="indicator11" ><p class="d-flex align-items-center">10개</p></label>
                  </div>
                  <div class="form-check">
                    <input class="form-check-input radio-check" type="checkbox" id="indicator12" value="30" :checked="pagination.display === 30" @click="pagination.display === 30 ? $event.preventDefault() : ''" @change="clickRadioDisplay($event, 30)"/>                    
                    <label class="form-check-label" for="indicator12"><p class="d-flex align-items-center">30개</p></label>
                  </div>
                  <div class="form-check">
                    <input class="form-check-input radio-check" type="checkbox" id="indicator13" value="50" :checked="pagination.display === 50" @click="pagination.display === 50 ? $event.preventDefault() : ''" @change="clickRadioDisplay($event, 50)"/>
                    <label class="form-check-label" for="indicator13"><p class="d-flex align-items-center">50개</p></label>
                  </div>
                  <div class="form-check">
                    <input class="form-check-input radio-check" type="checkbox" id="indicator14" value="100" :checked="pagination.display === 100" @click="pagination.display === 100 ? $event.preventDefault() : ''" @change="clickRadioDisplay($event, 100)"/>                    
                    <label class="form-check-label" for="indicator14"><p class="d-flex align-items-center">100개</p></label>
                  </div>
                  <button type="button" class="btn indicator-close" data-toggle="dropdown" aria-expanded="false">닫기</button>
                </form>
              </div>
            </div>
          </div>
          <table class="report nshop">
            <thead>
              <tr>
                <td width="10%" class="text-left">캠페인</td>
                <td width="10%" class="text-left">그룹</td>
                <td width="10%" class="text-left">품질지수</td>
                <td width="28%" class="text-left">키워드</td>
                <template v-for="(k,i) in ['im','clk','ctr','cpc','cst','cv','cr','cpa','cvr','roas']">
                  <td :key="i+getUuidv4()" v-if="kpi[k].check">{{getKpiName(k)}}
                    <template v-if="main.sort === k+'a' || main.sort === k+'d'">
                      <button v-if="main.sort === k+'a'" class="active text-yellow" @click="clickSort(k+'d')"><i class="bi bi-caret-up-fill"></i></button>
                      <button v-if="main.sort === k+'d'" class="active text-yellow" @click="clickSort(k+'a')"><i class="bi bi-caret-down-fill"></i></button>
                    </template>
                    <template v-else>
                      <button class="active" @click="clickSort(k+'d')"> <i class="bi bi-caret-down-fill"></i> </button>                          
                    </template>
                  </td>
                </template>
              </tr>
            </thead>
            <tbody>
              <tr v-for="data in getDatasForMain" :key="data.adPid + '-' + getUuidv4()">
                <td class="txt-left">{{data.campaign_name}}</td>
                <td class="txt-left">{{data.adgroup_name}}</td>
                <td class="txt-left">
                  <div class="progress qigrade-container">
                    <div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" :style="{ width: calcQigrade(data.ad_qigrade) }">
                      <span class="sr-only"></span>
                    </div>
                    <span class="level-bar" style="left: 8px;"></span>
                    <span class="level-bar" style="left: 17px;"></span>
                    <span class="level-bar" style="left: 26px;"></span>
                    <span class="level-bar" style="left: 35px;"></span>
                    <span class="level-bar" style="left: 44px;"></span>
                    <span class="level-bar" style="left: 53px;"></span>
                  </div>
                </td>
                <td class="txt-left"> 
                  <p class="font-weight-bold">{{ data.ad_pname ? data.ad_pname : data.ad_productname }}<small class="sub">{{ "-(" + data.ad_id	 + ")" }}</small></p>
                  <div class="item-container">
                    <div class="url-info">{{`가격: ${priceToString(data.ad_pprice)}원 / ${data.ad_deliveryfee === '0' ? '무료배송' : priceToString(data.ad_deliveryfee) +'원'}`}}</div>
                    <div class="url-info">{{data.ad_cnameofmall}}</div>
                    <div class="url-info">{{`쇼핑상품 ID:${data.ad_pid} / 몰상품 ID:${data.ad_pidofmall}`}}</div>
                  </div>
                  <div class="mb-2 mt-2">
                    <button type="button" class="btn-default btn btn-secondary btn-sm" @click="clickThumbnailSlide(data)" data-toggle="tooltip" data-placement="right" title="소재 이미지"><i class="bi bi-card-image"></i> 소재 이미지</button>
                    <button type="button" class="btn-default btn btn-secondary btn-sm ml-1" data-toggle="tooltip" data-placement="right" title="현재 입찰가(VAT미포함)"><i class="bi bi-currency-dollar"></i>{{priceToString(data.ad_bidamount)+"원"}}</button>
                    <button type="button" class="btn-default btn btn-secondary btn-sm ml-1" @click="goToUrl(data.ad_plandingurl)" data-toggle="tooltip" data-placement="right" title="연결된 링크"><i class="bi bi-link"></i>URL이동</button>
                  </div>                         
                </td>
                <template v-for="(k,i) in ['im','clk','ctr','cpc','cst','cv','cr','cpa','cvr','roas']">
                  <td :key="i+getUuidv4()" v-if="kpi[k].check">{{priceToString(data[k])+getUnit(k)}}</td>
                </template>                 
              </tr>
            </tbody>
          </table>
          <pagination ref="pagination" class="d-flex justify-content-center align-items-center mb-30"
          :pStart="pagination.start" :pDisplay="pagination.display" :pTotalCount="pagination.totalcount" :pIsFirst="false" :pIsEnd="false" @changedPage="handleChangedPage">
          </pagination>
        </article>
        <div class="d-flex justify-content-end">
          <div class="d-flex justify-content-end">
            <button type="button" class="ml-3 btn pdf" @click="clickPdf">PDF 다운받기</button>
          </div>
          <div class="d-flex justify-content-end">
            <button type="button" class="ml-3 btn excel" @click="clickExcel">엑셀 다운받기</button>
          </div>
        </div>
      </section>
    </div>
    <div class="m m-wrap">
      <mheader ref="mHeader" :pMenu="'dashboard'"></mheader>
      <mfooter ref="mFooter" :pMenu="'dashboard'"></mfooter>
      <section>
        <div class="pills-container-btn">
          <div class="pills-btn pb-0">
            <ul class="d-flex" id="pills-tab" role="tablist">
              <li class="nav-item" v-for="(menu, i) in swiperOption.menu" :key="menu + i + '-' + getUuidv4()">
                <button class="nav-link" :class="[swiperOption.index === menu.index ? 'active' : '']" id="pills1-tab" data-bs-toggle="pill" data-bs-target="#pills1" type="button" role="tab" aria-controls="pills1" aria-selected="true" @click="clickTopBtn(menu.key, menu.index)">
                  {{ menu.text }}
                </button>
              </li>
            </ul>
          </div>
          <button class="allow" @click="clickAllowBtn">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="9" viewBox="0 0 12 8">
              <path fill="none" fill-rule="evenodd" stroke="#1e1e23" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M1 6L6 1 11 6" transform="translate(0 1)"></path>
            </svg>
          </button>
        </div>
        <article class="dashboard-card">
          <swiper ref="swiper" class="tab-content swiper" id="pills-tabContent" :options="swiperOption" @slideChange="slideChangeTransitionStart">
            <swiper-slide v-for="(menu, index) in swiperOption.menu" :key="menu.key + index + '-' + getUuidv4()">
              <div class="tab-pane top10-card" id="pills1" role="tabpanel" aria-labelledby="pills1-tab" tabindex="0" :data-index="menu.index">
                <h3 class="mb-2">{{ "총" + menu.text + "10" }}</h3>
                <table>
                  <thead>
                    <tr>
                      <td class="p-0 bg-white" width="20px">#</td>
                      <td class="p-0 bg-white text-left" width="60%">소재</td>
                      <td class="p-0 bg-white text-right">{{ menu.text }}</td>  
                    </tr>
                  </thead>
                  <tbody>
                    <template v-for="(menu, i) in swiperOption.menu">
                      <template v-if="activeBtn.kpi === menu.key && main[menu.key+'10'].length === 0">
                        <tr :key="i+getUuidv4()"> <td colspan="3" class="bg-td">데이터가 존재하지 않습니다.</td> </tr>
                      </template>   
                      <template v-else-if="activeBtn.kpi === menu.key">
                        <tr v-for="(data, i2) in main[menu.key+'10']" 
                        data-toggle="tooltip" 
                        data-placement="right" 
                        :title=" priceToString(data[menu.key]) !== '0' ? '캠페인 : ' + data[menu.key].campaign_name + ' 그룹 : ' + data[menu.key].adgroup_name + ', 키워드id : ' + data[menu.key].keyword_id : '-' " :key="i2+getUuidv4()" >
                          <template v-if="priceToString(data[menu.key]) === '0'"> <td colspan="3">-</td> </template>
                          <template v-else>
                            <td class="text-left">{{i2 + 1}}</td>
                            <td class="text-left">{{data.ad_id}}</td>
                            <td class="text-right">{{priceToString(data[menu.key]) + getUnits(menu.key)}}</td>
                          </template>
                        </tr>
                      </template>             
                    </template> 
                  </tbody>
                </table>
              </div>
            </swiper-slide>
          </swiper>
        </article>
        <article class="statisticst-report">
          <div class="title d-flex justify-content-between align-items-center">
            <h3>검색광고 리포트</h3>
            <div class="indicator d-flex align-items-center dropdown">
              <button type="button" class="btn shadow-none p-0" data-toggle="dropdown" aria-expanded="false"><i class="bi bi-gear m-0"></i></button>
              <div class="dropdown-menu dropdown-menu-right">
                <form>
                  <div class="form-check w-100 pl-0">
                    <select class="form-control form-control-sm" v-model="main.sort" @change="changeSort">
                      <option value="ima">노출수순(올림)</option>
                      <option value="imd">노출수순(내림)</option>
                      <option value="clka">클릭수순(올림)</option>
                      <option value="clkd">클릭수순(내림)</option>
                      <option value="ctra">클릭률순(올림)</option>
                      <option value="ctrd">클릭률순(내림)</option>
                      <option value="cpca">CPC순(올림)</option>
                      <option value="cpcd">CPC순(내림)</option>
                      <option value="csta">광고비순(올림)</option>
                      <option value="cstd">광고비순(내림)</option>
                      <option value="cva">전환수순(올림)</option>
                      <option value="cvd">전환수순(내림)</option>
                      <option value="cvra">전환률순(올림)</option>
                      <option value="cvrd">전환률순(내림)</option>
                      <option value="cra">전환매출순(올림)</option>
                      <option value="crd">전환매출순(내림)</option>
                      <option value="cpaa">CPA순(올림)</option>
                      <option value="cpcd">CPA순(내림)</option>
                      <option value="roasa">ROAS순(올림)</option>
                      <option value="roasd">ROAS순(내림)</option>
                    </select>
                  </div>
                  <div class="form-border"></div>
                  <template v-for="(k,i) in ['cst','im','clk','cv','cr','ctr','cpa','cpc','cvr','roas']" :key="i+getUuidv4()">
                    <div class="form-check" >
                      <input class="form-check-input" type="checkbox" :id="'indicator'+i" :value=k :checked="kpi[k].check" :disabled="kpi[k].visible === false" @change="clickCheckpi($event, k)" />
                      <label class="form-check-label" :for="'indicator'+i" ><p class="d-flex align-items-center ml-1">{{getKpiName(k)}}</p></label >
                    </div>
                  </template>
                  <button type="button" class="btn indicator-close" data-toggle="dropdown" aria-expanded="false">닫기</button>
                </form>
              </div>
            </div>
          </div>
          <div class="m-table d-flex" v-for="data in getDatasForMain" :key="data.ad_id + '-' + getUuidv4()" >
            <ul>
              <div class="m-table-title">
                <div class="w-100">
                  <li class="font-weight-bold d-flex align-items-center">
                    {{ data.ad_pname ? data.ad_pname : data.ad_productname }}
                    <!-- <a class="btn" :href="data.ad_pc_display" ><i class="bi bi-box-arrow-up-right"></i> </a> -->
                  </li>
                  <li>
                    <small ><span class="badge badge-pill badge-light">{{ data.campaign_name }}</span></small >
                    <small ><span class="badge badge-pill badge-light">{{ data.adgroup_name }}</span></small >
                  </li>
                </div>
              </div>
              <div class="m-table-content">
                <div class="w-100 d-flex flex-wrap">
                  <li class="col-12"> {{ data.ad_description }} </li>
                  <template v-for="(k,i) in ['im','clk','ctr','cpc','cst','cv','cvr','cr','cpa','roas']">
                    <li :key="i+getUuidv4()" class="col-4" v-if="kpi[k].check">
                      <label>{{getKpiName(k)}}</label>
                      <div>{{priceToString(data[k])+getUnits(k)}}</div>
                    </li>
                  </template>
                </div>
              </div>
            </ul>            
          </div>
          <pagination ref="pagination" class="d-flex justify-content-center align-items-center mb-30"
          :pStart="pagination.start" :pDisplay="pagination.display" :pTotalCount="pagination.totalcount" :pIsFirst="false" :pIsEnd="false" @changedPage="handleChangedPage">
          </pagination>
        </article>
        <article>
          <div class="d-flex justify-content-between">
            <button class="btn pdf" @click="clickPdf">PDF 다운받기</button>
            <button class="btn excel" @click="clickExcel">엑셀 다운받기</button>
          </div>
        </article>
      </section>
      <mbig-menu-2 ref="mBigMenu2" @closeBtn="$refs.mFooter.setFooter('home')"></mbig-menu-2>
      <mdate-range-picker ref="mDateRangePicker" :pStart="start" :pEnd="end" :pCstart="''" :pCend="''" @changedDate="handleChangedDateRange" @closeBtn="$refs.mFooter.setFooter('home')"></mdate-range-picker>
      <mbalance ref="mBalance" :pBalance="balance" @closeBtn="$refs.mFooter.setFooter('home')"></mbalance>
      <malarm ref="mFmenu" @closeBtn="$refs.mFooter.setFooter('home')"></malarm>
      <mfmenu ref="mFmenu" @logout="handleLogOut" @dbedit="$refs.mFooter.clickDbEdit('dashboard-edit')" @closeBtn="$refs.mFooter.setFooter('home')"></mfmenu>
      <mdashboard-edit ref="mDashboardEdit" @closeBtn="$refs.mFooter.setFooter('home')"></mdashboard-edit>
    </div>
    <log-out-modal ref="logOutModal" style="display: none"></log-out-modal>
    <expire-session-modal ref="expireSessionModal" style="display: none"></expire-session-modal>
    <mask-modal ref="maskModal" style="display: none"></mask-modal>
    <shopping-analysis-modal ref="shoppingAnalysisModal" style="display: none"></shopping-analysis-modal>
    <!-- <pdf-shopping-analysis ref="pdfShoppingAnalysis" :pFromdate="start" :pTodate="end" :pActiveBtn="activeBtn" :pMain="main" :pActiveTopAd="activeTopAd" style="display: none" @showMask="handleShowMask" @hideMask="handleHideMask" ></pdf-shopping-analysis> -->
    <thumbnail-slide-modal ref="thumbnailSlideModal"></thumbnail-slide-modal>
    <shopping-excel ref="shoppingExcel" style="display:none" @hideMask="handleHideMask"></shopping-excel>
    <div class="hidden-print"><shopping-pdf ref="shoppingPdf" :key="pdfKey"></shopping-pdf></div>
    
  </div>
</template>

<script>
import $ from "jquery";
import moment from "moment";
// import "swiper/dist/css/swiper.css";
import 'swiper/css';
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import {  isMobile,  priceToString,  getMedia,  uuidv4,  getUnit, getType,  getKpiName} from "@/assets/js/common.js";
import expireSessionModal from "@/components/modal/expireSessionModal.vue";
import messageModal from "@/components/modal/messageModal.vue";
import maskModal from "@/components/modal/maskModal.vue";
import { store } from "@/store/store.js";
import { SHA256 } from "@/assets/js/sha256.js";
import { API_URL, TEMP_KEY, UNITS } from "@/configs/config.js";
import message from "@/components/common/message.vue";
import balance from "@/components/dashboard2/balance.vue";
import bigMenu2 from "@/components/layout/bigMenu2.vue";
import logOutModal from "@/components/modal/logOutModal.vue";
import dateRangePicker from "@/components/common/dateRangePicker.vue";
import shoppingAnalysisModal from "@/components/modal/ShoppingAnalysisModal.vue";
import pdfShoppingAnalysis from "@/components/pdf/pdfShoppingAnalysis.vue";
import mheader from "@/components/layout/m/header.vue";
import mfooter from "@/components/layout/m/footer.vue";
import mbigMenu2 from "@/components/layout/m/bigMenu2.vue";
import mdateRangePicker from "@/components/common/m/dateRangePicker.vue";
import mbalance from "@/components/common/m/balance.vue";
import mfmenu from "@/components/common/m/fMenu.vue";
import malarm from "@/components/common/m/alarm.vue";
import mdashboardEdit from "@/components/common/m/dashboardEdit.vue";
import thumbnailSlideModal from "@/components/modal/thumbnailSlideModal.vue";
import pagination from "@/components/common/pagination.vue";
import shoppingExcel from "@/components/shoppingAnalysis/shoppingExcel.vue";
import shoppingPdf from '@/components/shoppingAnalysis/shoppingPdf.vue';
export default {
  data() {
    return {
      start: store.state.dateStore.start,
      end: store.state.dateStore.end,
      expandedIndex: null,
      expandedData: [],      
      pagination: {
        start: 0, //현재 페이지
        display: 10, //게시글의 수
        totalcount: 0, //전체 게시글의 수
      },
      main: {
        field: "",
        query: null,
        responseData: null,
        data: null,
        sort: "imd",
        im10: [],
        clk10: [],
        ctr10: [],
        cpc10: [],
        cst10: [],
        cv10: [],
        cvr10: [],
        cr10: [],
        cpa10: [],
        roas10: [],        
      },
      kpi: {
        clk: { visible: false, check: true }, //클릭수
        im: { visible: false, check: true }, //노출수
        cst: { visible: false, check: true }, //광고비
        cv: { visible: true, check: false }, //전환수
        cr: { visible: true, check: false }, //전환매출
        ctr: { visible: false, check: true }, //클릭률
        cpc: { visible: false, check: true }, //클릭 당 비용
        cpa: { visible: true, check: false }, //전환 당 비용
        cvr: { visible: true, check: false }, //전환율
        roas: { visible: true, check: false }, //ROAS
      },
      activeTopAd: null,
      activeBtn: {
        clk: false, //클릭수
        im: true, //노출수
        cst: false, //광고비
        cv: false, //전환수
        cr: false, //전환매출
        ctr: false, //클릭률
        cpc: false, //클릭 당 비용
        cpa: false, //전환 당 비용
        cvr: false, //전환율
        roas: false, //ROAS,
        kpi: "im",
      },
      headerSet: {
        common: {
          header: [
            { key: "clk", name: "클릭수" },
            { key: "im", name: "노출수" },
            { key: "cst", name: "광고비" },
            { key: "cv", name: "전환수" },
            { key: "cr", name: "전환매출" },
            { key: "ctr", name: "클릭률" },
            { key: "cpc", name: "클릭당비용" },
            { key: "cpa", name: "전환당비용" },
            { key: "cvr", name: "전환율" },
            { key: "roas", name: "ROAS" },
          ],
        },
        naver: {
          header: [
            { key: "campaign_name", name: "캠페인" },
            { key: "adgroup_name", name: "그룹" },
            { key: "ad_id", name: "소재" },
            { key: "ad_pid", name: "네이버쇼핑ID" },
            { key: "ad_pidofmall", name: "쇼핑몰상품ID" },
            { key: "ad_productname", name: "상품명" },
            { key: "ad_pimageurl", name: "이미지" },
          ],
        },
      },
      balance: [],
      swiperOption: {
        index: 0,
        menu: [
          { key: "im", index: 0, text: "노출수" },
          { key: "clk", index: 1, text: "클릭수" },
          { key: "cpc", index: 2, text: "CPC" },
          { key: "ctr", index: 3, text: "클릭율" },
          { key: "cst", index: 4, text: "광고비" },
          { key: "cv", index: 5, text: "전환수" },
          { key: "cvr", index: 6, text: "전환율" },
          { key: "cr", index: 7, text: "전환매출" },
          { key: "cpa", index: 8, text: "CPA" },
          { key: "roas", index: 9, text: "ROAS" },
        ],
        slidesPerView: "auto",
        spaceBetween: 30,
        centeredSlides: false,
        loop: false,
      },
      accountlog: [],
      pdfKey: 0
    };
  },
  computed: {
    getDatasForMain() { return this.main.data; },
  },
  components: {
    bigMenu2, logOutModal, balance, expireSessionModal, messageModal, maskModal, dateRangePicker, shoppingAnalysisModal, pdfShoppingAnalysis, 
    mheader, mfooter, mbigMenu2, mdateRangePicker, mbalance, mfmenu, malarm, mdashboardEdit, Swiper, SwiperSlide, message, thumbnailSlideModal,
    pagination, shoppingExcel, shoppingPdf    
  },
  mounted() {
    $(".main").removeClass("m-h-100");
    this.clickSearchBtn();
    this.getAccountLog();
  },
  methods: {
    handleLogOut() { this.$refs.logOutModal.showModal(); },
    handleExpireSession() { this.$refs.expireSessionModal.showModal(); },
    handleShowMask() { this.$refs.maskModal.showModal(); },
    handleHideMask() { this.$refs.maskModal.hideModal(); },
    handleChangedDateRange(data) {
      this.$refs.dateRangePicker.setDate({ start: data.start, end: data.end, compare: false });
      this.clickSearchBtn();
    },
    handleChangedBalance(data) {
      this.balance = [];
      this.balance = data.slice();
    },   
    handleChangedPage(start) {
      this.pagination.start = start;
      this.getReport();
    },         
    clickSort(sort) {
      this.main.sort = sort;
      this.pagination.start = 0;
      this.getReport();
    },
    clickCheckpi(event, type) {
      var vm = this;
      var $active = $(event.target);
      var keys = Object.keys(vm.kpi);

      for (let i = 0; i < keys.length; i++) {
        if (keys[i].indexOf(type) > -1) {
          vm.kpi[keys[i]].check = $active.is(":checked");
          break;
        }
      }
    },
    clickExcel() {
      var vm = this;
      var date = vm.$refs.dateRangePicker.getDate();
      var diff = moment(date.end).diff(moment(date.start), "days");
      var comparefromdate = moment(date.start).subtract(1 + Number(diff), "days").format("YYYY-MM-DD");
      var comparetodate = moment(date.start).subtract(1, "days").format("YYYY-MM-DD");       

      vm.handleShowMask();
      vm.$refs.shoppingExcel.clickExcel({fromdate: date.start, todate: date.end, comparefromdate: comparefromdate, comparetodate: comparetodate,
      md: {naver: "N", kakaosa: "D", naverda: "Nda", kakaomo: "K", google: "google"}["naver"], sort: vm.main.sort});
    },
    clickShoppingAnalysisModal(isAdPid, id) { this.$refs.shoppingAnalysisModal.showModal(isAdPid, id, this.start, this.end); },
    clickRadioDisplay(event, display) {
      var vm = this;
      if (vm.pagination.display === display) return false;
      vm.pagination.display = display;
      vm.clickSearchBtn();
    },
    async clickPdf() {
      var date = this.$refs.dateRangePicker.getDate();
      var diff = moment(date.end).diff(moment(date.start), "days");
      var comparefromdate = moment(date.start).subtract(1 + Number(diff), "days").format("YYYY-MM-DD");
      var comparetodate = moment(date.start).subtract(1, "days").format("YYYY-MM-DD");      

      this.handleShowMask();
      await this.$refs.shoppingPdf.initPDF({date: date, cdate: {start: comparefromdate, end: comparetodate}});
      var blob = await this.$refs.shoppingPdf.generatePDF(); // 렌더링 완료 후 PDF 생성
      window.open(URL.createObjectURL(blob));
      this.pdfKey++;
      this.handleHideMask();
    },
    clickSearchBtn() {
      var date = this.$refs.dateRangePicker.getDate();
      this.pagination.start = 0;
      this.start = date.start;
      this.end = date.end;      
      this.expandedData = [];
      this.expandedIndex = null;
      this.searchNew();
    },
    clickBtn(event, type) {
      var vm = this;
      var keys = Object.keys(vm.activeBtn);
      for (let i = 0; i < keys.length; i++) {
        keys[i].indexOf("kpi") > -1 ? (vm.activeBtn["kpi"] = "") : (vm.activeBtn[keys[i]] = false);
      }

      vm.expandedData = [];
      vm.expandedIndex = null;
      vm.activeBtn[type] = true;
      vm.activeBtn["kpi"] = type;
      vm.getTopKpi();
    },
    clickAllowBtn() {
      let pillstab = document.querySelector(".pills-container-btn .pills-btn #pills-tab");
      let svg = document.querySelector(".pills-container-btn .allow svg");
      if (pillstab.classList.contains("flex-wrap")) {
        pillstab.classList.remove("flex-wrap");
        svg.style.transform = "rotate(180deg)";
      } else {
        pillstab.classList.add("flex-wrap");
        svg.style.transform = "rotate(0deg)";
      }
    },
    clickTopBtn(top, i) {
      let vm = this;
      vm.swiperOption.index = i;
      vm.clickBtn(null, top);
      vm.$refs.swiper.swiper.slideTo(i);
    },
    clickThumbnailSlide(data) { this.$refs.thumbnailSlideModal.showModal({'ad_imgurl1': data.ad_imgurl}); },
    clickPlusBtn(index, campaignId) { 
      var vm = this;
      var diff = moment(vm.end).diff(moment(vm.start), "days");
      var comparefromdate = moment(vm.start).subtract(1 + Number(diff), "days").format("YYYY-MM-DD");
      var comparetodate = moment(vm.start).subtract(1, "days").format("YYYY-MM-DD");
      var shoppingreportForTop = $.ajax({
        type: "get", //요청 메소드 방식
        url: API_URL + "/app/shopping/campaignshoppingreport",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          fromdate: vm.start,
          todate: vm.end,
          comparefromdate: comparefromdate,
          comparetodate: comparetodate,
          kpi: vm.activeBtn.kpi,
          campaignid: campaignId,
          session: store.state.userStore.session,
        },
        beforeSend: function (data) {},
        success: function (data) {},
        error: function (a, b, c) {},
        complete: function (a, b, c) {},
      });

      $.when(shoppingreportForTop).done(function (shoppingreportForTop) {
          vm.expandedData = [];
          vm.expandedData = shoppingreportForTop.data.topads[vm.activeBtn.kpi].slice();
          vm.expandedIndex = vm.expandedIndex === index ? null : index; 
        }).then(function (data) {});      
    },    
    clickPlusBtn2(index, adgroupId) {
      var vm = this;
      var diff = moment(vm.end).diff(moment(vm.start), "days");
      var comparefromdate = moment(vm.start).subtract(1 + Number(diff), "days").format("YYYY-MM-DD");
      var comparetodate = moment(vm.start).subtract(1, "days").format("YYYY-MM-DD");
      var shoppingreportForTop = $.ajax({
        type: "get", //요청 메소드 방식
        url: API_URL + "/app/shopping/adgroupshoppingreport",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          fromdate: vm.start,
          todate: vm.end,
          comparefromdate: comparefromdate,
          comparetodate: comparetodate,
          kpi: vm.activeBtn.kpi,
          adgroupid: adgroupId,
          session: store.state.userStore.session,
        },
        beforeSend: function (data) {},
        success: function (data) {},
        error: function (a, b, c) {},
        complete: function (a, b, c) {},
      });

      $.when(shoppingreportForTop).done(function (shoppingreportForTop) {
          vm.expandedData = [];
          vm.expandedData = shoppingreportForTop.data.topads[vm.activeBtn.kpi].slice();
          vm.expandedIndex = vm.expandedIndex === index ? null : index; 
        })
        .then(function (data) {});          
    },    
    slideChangeTransitionStart() {
      let vm = this;

      vm.$nextTick(function () {
        let el = document.querySelector(".swiper-slide-active > div");
        if (el) {
          vm.swiperOption.index = Number(el.getAttribute("data-index"));
          vm.clickBtn(null, vm.swiperOption.menu[vm.swiperOption.index].key);
        }
      });
    },
    changeSort() {
      var date = this.$refs.dateRangePicker.getDate();
      this.pagination.start = 0;
      this.start = date.start;
      this.end = date.end;
      this.getReport();
    },
    priceToString(salse) {
      if (salse === undefined) return "";
      return priceToString(salse);
    },    
    getKpiName(kpi) { return getKpiName(kpi); },
    getAccountLog() {
      var vm = this;
      $.ajax({
        type: "get", //요청 메소드 방식
        url: API_URL + "/app/dashboard/accountlog",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          session: store.state.userStore.session,
        },
        beforeSend: function (data) {},
        success: function (data) {
          vm.accountlog = data.data.slice();
        },
        error: function (a, b, c) {},
        complete: function (a, b, c) {},
      });      
    }, 
    getUnit(kpi) { return getUnit(kpi); },    
    getTopKpi() {
      var vm = this;
      var date = vm.$refs.dateRangePicker.getDate();
      $.ajax({
        type: "get", //요청 메소드 방식
        url: API_URL + "/app/shopping/shoppingreport",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          fromdate: date.start,
          todate: date.end,
          kpi: vm.activeBtn.kpi,
          session: store.state.userStore.session,
        },
        beforeSend: function (data) { vm.handleShowMask(); },
        success: function (data) {
          if (data.result === "success") {
            var keys = Object.keys(data.data.topads);
            keys.forEach(function (key) {
              if(key === 'cp') return;
              vm.main[key + "10"] = [];
              vm.main[key + "10"] = data.data.topads[key];
            });               

          } else {
            if (data.status === "0001") {
              vm.handleExpireSession();
            } else {
            }
          }
        },
        error: function (a, b, c) {
          if (a.status === 403) {
            vm.$store.commit("logout");
            vm.$store.commit("logoutActivedMdias");
            vm.$store.commit("logoutKakaoSa");
            vm.$router.push("/");
          }
        },
        complete: function (a, b, c) {
          vm.handleHideMask();
          // vm.showMaskPannelForTop = false;
        },
      });
    },
    getReport() {
      var vm = this;
      var date = vm.$refs.dateRangePicker.getDate();
      var diff = moment(date.end).diff(moment(date.start), "days");
      var comparefromdate = moment(date.start).subtract(1 + Number(diff), "days").format("YYYY-MM-DD");
      var comparetodate = moment(date.start).subtract(1, "days").format("YYYY-MM-DD");
      $.ajax({
        type: "get", //요청 메소드 방식
        url: API_URL + "/app/shopping/shoppingreport",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          fromdate: date.start,
          todate: date.end,
          comparefromdate: comparefromdate,
          comparetodate: comparetodate,    
          sort: vm.main.sort,      
          kpi: "",
          start: vm.pagination.start,
          display: vm.pagination.display,
          totalcount: vm.pagination.totalcount,
          session: store.state.userStore.session,
        },
        beforeSend: function (data) {
          vm.handleShowMask();
        },
        success: function (data) {
          if (data.result === "success") {
            vm.main.data = [];
            vm.main.responseData = null;
            vm.main.responseData = data;
            vm.main.data = data.data.ads;
            vm.pagination.totalcount = vm.main.responseData.totalcount;
          } else {
            if (data.status === "0001") {
              vm.handleExpireSession();
            } else {
            }
          }
        },
        error: function (a, b, c) {
          if (a.status === 403) {
            vm.$store.commit("logout");
            vm.$store.commit("logoutActivedMdias");
            vm.$store.commit("logoutKakaoSa");
            vm.$router.push("/");
          }
        },
        complete: function (a, b, c) {
          vm.handleHideMask();
          // vm.showMaskPannelForReport = false;
        },
      });      
    },
    getUuidv4() { return uuidv4(); },
    getUnits(unit) { return UNITS[unit]; },        
    calcQigrade(qigrade) {
      var max = 7;
      var percentage = (qigrade / max) * 100;
      return `${percentage}%`;
    },    
    goToUrl(url) { window.open(url, '_blank');},
    searchNew() {
      var vm = this;
      vm.handleShowMask();
      var date = vm.$refs.dateRangePicker.getDate();
      var diff = moment(date.end).diff(moment(date.start), "days");
      var comparefromdate = moment(date.start).subtract(1 + Number(diff), "days").format("YYYY-MM-DD");
      var comparetodate = moment(date.start).subtract(1, "days").format("YYYY-MM-DD");  
      var shoppingreportForTop = $.ajax({
        type: "get", //요청 메소드 방식
        url: API_URL + "/app/shopping/shoppingreport",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          fromdate: date.start,
          todate: date.end,
          comparefromdate: comparefromdate,
          comparetodate: comparetodate,          
          kpi: vm.activeBtn.kpi,
          session: store.state.userStore.session,
        },
        beforeSend: function (data) {},
        success: function (data) {
          if (data.result === "success") {
          } else {
            if (data.status === "0001") {
              vm.handleExpireSession();
            } else {
            }
          }
        },
        error: function (a, b, c) {
          if (a.status === 403) {
            vm.$store.commit("logout");
            vm.$store.commit("logoutActivedMdias");
            vm.$store.commit("logoutKakaoSa");
            vm.$router.push("/");
          }
        },
        complete: function (a, b, c) {},
      });        
      var shoppingreportForAd = $.ajax({
        type: "get", //요청 메소드 방식
        url: API_URL + "/app/shopping/shoppingreport",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          fromdate: date.start,
          todate: date.end,
          sort: vm.main.sort,
          kpi: "",
          start: vm.pagination.start,
          display: vm.pagination.display,
          totalcount: vm.pagination.totalcount,
          session: store.state.userStore.session,
        },
        beforeSend: function (data) {},
        success: function (data) {
          if (data.result === "success") {
          } else {
            if (data.status === "0001") {
              vm.handleExpireSession();
            } else {
            }
          }
        },
        error: function (a, b, c) {
          if (a.status === 403) {
            vm.$store.commit("logout");
            vm.$store.commit("logoutActivedMdias");
            vm.$store.commit("logoutKakaoSa");
            vm.$router.push("/");
          }
        },
        complete: function (a, b, c) {},
      });          
      $.when(shoppingreportForTop,shoppingreportForAd).done(function (shoppingreportForTop,shoppingreportForAd) {
          if (shoppingreportForTop[0] && shoppingreportForTop[1] === "success") {
            var data = shoppingreportForTop[0].data;
            var keys = Object.keys(data.topads);
            keys.forEach(function (key) {
              if(key === 'cp') return;
              vm.main[key + "10"] = [];
              vm.main[key + "10"] = data.topads[key];
            });    
          }

          if (shoppingreportForAd[0] && shoppingreportForAd[1] === "success") {
            var data = shoppingreportForAd[0];
            vm.main.data = [];
            vm.main.responseData = null;
            vm.main.responseData = data;
            vm.main.data = data.data.ads;
            vm.pagination.totalcount = vm.main.responseData.totalcount;
          }          
        }).then(function () { vm.handleHideMask(); });     
    },     
    activeMain(flag) {
      this.$emit("mountedMain", true);
      this.$emit("mountedDasyboad", true);
    },     
  },
};
</script>

<style scoped></style>
