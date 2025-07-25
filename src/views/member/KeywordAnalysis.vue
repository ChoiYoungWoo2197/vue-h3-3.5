<template>
  <div class="d-flex m-h-100 dashboard">
    <big-menu-2 :pMenu="'keywordAnalysis'" @mountedMain="activeMain" class="pc" ></big-menu-2>
    <div class="pc wrap">
      <balance @logOut="handleLogOut" @changeData="handleChangedBalance"></balance>
      <section>
        <message ref="message" class="mb-4">
          <span>
            <span>최근 집계 완료 시간(오늘) |
              <template v-for="(k,i) in accountlog" >
                <template v-if="media === k.media">
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
          <h2>키워드 분석</h2>
          <div class="search d-flex">
            <select class="form-control" id="media" v-model="media" @change="clickMedia">
              <option selected value="naver">{{getMediaNew("naver")}}</option>
              <option value="kakaosa">{{getMediaNew("kakaosa")}}</option>
              <option value="google">{{getMediaNew("google")}}</option>              
            </select>
            <date-range-picker ref="dateRangePicker" class="form-control" :pStart="start" :pEnd="end" :pDisabled="false" @changedDate="handleChangedDateRange" >
            </date-range-picker>
            <button type="submit" class="btn submit" @click.prevent="clickSearchBtn"> 조회하기 </button>
          </div>
        </div>
        <div class="select-btn">
          <button v-for="(k, i) in Object.keys(kpi10)" :key="k + i + '-' + getUuidv4()" type="button" class="btn select" :class="[top === k ? 'active' : '']" @click="clickTopBtn(k, i)" >
            {{ kpi10[k].text }}
          </button>
        </div>
        <div class="top10">
          <div class="col-12">
            <div class="top10-card">
              <h3 class="mb-2">{{ "총" + kpi10[top].text + " TOP10" }}</h3>
              <table>
                <thead>
                  <tr>
                    <td width="40px">#</td>
                    <td class="text-left" width="15%">캠페인</td>
                    <td class="text-left" width="15%">광고그룹</td>
                    <td class="text-left" width="15%">품질지수</td>
                    <td class="text-left" width="35%">키워드</td>
                    <td class="text-right pr-0">{{ kpi10[top].text }}</td>
                    <td class="text-right pl-0" width="8%">%</td>
                  </tr>
                </thead>
                <tbody>
                  <template v-if="main[top + '10'].length === 0"><tr><td colspan="7" class="bg-td">데이터가 존재하지 않습니다.</td></tr></template>
                  <template v-else>
                    <template v-for="(t, index) in main[top + '10']" :key="index+getUuidv4()">
                      <tr  data-toggle="tooltip" data-placement="right" :title="priceToString(t[top]) !== '0' ? '캠페인 : ' + t.campaign_name + ' 그룹 : ' + t.adgroup_name + ', 키워드id : ' + t.keyword_id : '-'">
                        <template v-if="priceToString(t[top]) === '0'"><td colspan="7">-</td></template>
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
                            </p>
                          </td>
                          <td class="text-left">
                            <div class="progress qigrade-container">
                              <div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" :style="{ width: calcQigrade(t.keyword_qigrade) }">
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
                          <td class="text-left link">
                            <p class="font-weight-bold">
                              {{ t.keyword_name }}<small class="sub">{{ "(" + t.keyword_id + ")" }}</small>
                            </p>
                            <div class="mb-2 mt-2">
                              <button type="button" class="btn-default btn btn-secondary btn-sm" data-toggle="tooltip" data-placement="right" title="현재 입찰가(VAT미포함)"><i class="bi bi-currency-dollar"></i>{{priceToString(t.keyword_bidamount)+"원"}}</button>
                            </div>                             
                          </td>
                          <td class="text-right pr-0">{{priceToString(t[top]) + getUnit(top)}}</td>
                          <td class="text-right pl-0">
                            <a href="#" class="d-flex align-items-center justify-content-end">
                              <template v-if="t.cp !== undefined">
                                <template v-if="t.cp.length === 0 || t.cp.per[top] === 0">{{'-'}}</template>
                                <template v-else>
                                  <span :class="[t.cp.per[top].indexOf('-') > -1 ? 'down' : 'up']">{{t.cp.per[top] + "%"}}<i :class="[t.cp.per[top].indexOf('-') > -1 ? 'bi bi-graph-down-arrow ' : 'bi bi-graph-up-arrow ']" class="ml-1 mr-0"></i></span>
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
                                  <td class="text-left" width="35%">키워드</td>
                                  <td class="text-right pr-0">{{ kpi10[top].text }}</td>
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
                                          <div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" :style="{ width: calcQigrade(t2.keyword_qigrade) }">
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
                                        <p class="font-weight-bold">
                                          {{ t2.keyword_name }}<small class="sub">{{ "-(" + t2.keyword_id + ")" }}</small>
                                        </p>
                                        <div class="mb-2 mt-2">
                                          <button type="button" class="btn-default btn btn-secondary btn-sm" data-toggle="tooltip" data-placement="right" title="현재 입찰가(VAT미포함)"><i class="bi bi-currency-dollar"></i>{{priceToString(t2.keyword_bidamount)+"원"}}</button>
                                        </div>                                          
                                      </td>
                                      <td class="text-right pr-0">{{priceToString(t2[top]) + getUnit(top)}}</td>
                                      <td class="text-right pl-0">
                                        <a href="#" class="d-flex align-items-center justify-content-end">
                                          <template v-if="t2.cp !== undefined">
                                            <template v-if="t2.cp.length === 0 || t2.cp.per[top] === 0">{{'-'}}</template>
                                            <template v-else>
                                              <span :class="[t2.cp.per[top].indexOf('-') > -1 ? 'down' : 'up']">{{t2.cp.per[top] + "%"}}<i :class="[t2.cp.per[top].indexOf('-') > -1 ? 'bi bi-graph-down-arrow ' : 'bi bi-graph-up-arrow ']" class="ml-1 mr-0"></i></span>
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
          <template v-if="showMaskPannelForReport === true" ><mask-pannel ref="maskPannel2" :pheight="200"></mask-pannel> </template>
          <template v-else>
            <div class="title d-flex justify-content-between align-items-center">
              <h3>키워드 리포트</h3>
              <div class="indicator d-flex align-items-center dropdown">
                <button type="button" class="btn shadow-none p-0" data-toggle="dropdown" aria-expanded="false" > <i class="bi bi-gear m-0"></i> </button>
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
                      <input class="form-check-input radio-check" type="checkbox" id="indicator11" value="10" :checked="main.display === 10" @click="main.display === 10 ? $event.preventDefault() : ''" @change="clickRadioDisplay($event, 10)" />
                      <label class="form-check-label" for="indicator11" ><p class="d-flex align-items-center">10개</p></label >
                    </div>
                    <div class="form-check">
                      <input class="form-check-input radio-check" type="checkbox" id="indicator12" value="30" :checked="main.display === 30" @click="main.display === 30 ? $event.preventDefault() : ''" @change="clickRadioDisplay($event, 30)" />
                      <label class="form-check-label" for="indicator12" ><p class="d-flex align-items-center">30개</p></label >
                    </div>
                    <div class="form-check">
                      <input class="form-check-input radio-check" type="checkbox" id="indicator13" value="50" :checked="main.display === 50" @click="main.display === 50 ? $event.preventDefault() : ''" @change="clickRadioDisplay($event, 50)" />
                      <label class="form-check-label" for="indicator13" ><p class="d-flex align-items-center">50개</p></label >
                    </div>
                    <div class="form-check">
                      <input class="form-check-input radio-check" type="checkbox" id="indicator14" value="100" :checked="main.display === 100" @click="main.display === 100 ? $event.preventDefault() : ''" @change="clickRadioDisplay($event, 100)" />
                      <label class="form-check-label" for="indicator14" ><p class="d-flex align-items-center">100개</p></label >
                    </div> 
                    <button type="button" class="btn indicator-close" data-toggle="dropdown" aria-expanded="false" > 닫기 </button>
                  </form>
                </div>
              </div>
            </div>
            <div class="">
              <table class="report">
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
                  <tr v-for="data in getDatasForMain" :key="data.keyword_id + 'L'">
                    <td class="txt-left">{{data.campaign_name}}</td>
                    <td class="txt-left">{{data.adgroup_name}}</td>
                    <td class="txt-left">
                      <div class="progress qigrade-container">
                        <div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" :style="{ width: calcQigrade(data.keyword_qigrade) }">
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
                      <p class="font-weight-bold">
                        {{ data.keyword_name }} <small class="sub">{{ "-(" + data.keyword_id + ")" }}</small> 
                      </p>
                      <div class="mb-2 mt-2">
                        <button type="button" class="btn-default btn btn-secondary btn-sm" data-toggle="tooltip" data-placement="right" title="현재 입찰가(VAT미포함)"><i class="bi bi-currency-dollar"></i>{{priceToString(data.keyword_bidamount)+"원"}}</button>
                      </div>                         
                    </td>
                    <template v-for="(k,i) in ['im','clk','ctr','cpc','cst','cv','cr','cpa','cvr','roas']">
                      <td :key="i+getUuidv4()" v-if="kpi[k].check">{{priceToString(data[k])+getUnit(k)}}</td>
                    </template>   
                  </tr>
                </tbody>
                <tfoot>
                  <tr class="total bg-white">
                    <td colspan="3"></td>
                    <td>{{'전체 키워드 ' + main.isTotalCount + '개'}}</td>
                    <template v-if="main.total.length > 0">
                      <template v-for="(k,i) in ['im','clk','ctr','cpc','cst','cv','cr','cpa','cvr','roas']">
                        <td v-if="kpi[k].check" :key="i+getUuidv4()">
                          <a href="#" class="d-flex align-items-center justify-content-end">
                            <template v-if="main.total[0].cp !== undefined">
                              <template v-if="main.total[0].cp.per[k] === 0">{{'-'}}</template>
                              <template v-else>
                                <span>{{priceToString(main.total[0][k]) + getUnit(k)}}</span>
                                <small class="ml-1" :class="[main.total[0].cp.per[k].indexOf('-') > -1 ? 'down' : 'up']"> {{main.total[0].cp.per[k] +'%'}}
                                  <i :class="[main.total[0].cp.per[k].indexOf('-') > -1 ? 'bi bi-graph-down-arrow ' : 'bi bi-graph-up-arrow ']" class="ml-1 mr-0"></i>
                                </small>                              
                              </template>
                            </template>
                          </a>
                        </td>
                      </template>                      
                    </template>
                  </tr>
                </tfoot>
              </table>
            </div>
            <ul class="pagination d-flex justify-content-center align-items-center mb-30">
              <li class="page-item">
                <a class="page-link shadow-none" href="javascript:;" aria-label="Previous" @click="clickPreviousFirstPageBtnForMain" >
                  <span aria-hidden="true" ><i class="bi bi-chevron-double-left m-0"></i></span>
                </a>
              </li>
              <li class="page-item" :class="{ disabled: isFirstPageGroupForMain }">
                <a class="page-link shadow-none" href="javascript:;" aria-label="Previous" @click="clickPreviousPageBtnForMain" >
                  <span aria-hidden="true"><i class="bi bi-chevron-left"></i></span>
                </a>
              </li>
              <li class="page-item" :class="{ active: page - 1 === main.start }" v-for="page in main.pages" :key="page" >
                <a class="page-link shadow-none" href="javascript:;" v-text="page" @click="clickPageBtnForMain(page - 1)" ></a>
              </li>
              <li class="page-item" :class="{ disabled: isLastPageGroupForMain }">
                <a class="page-link shadow-none" href="javascript:;" aria-label="Next" @click="clickNextPageBtnForMain" >
                  <span aria-hidden="true"><i class="bi bi-chevron-right"></i></span>
                </a>
              </li>
              <li class="page-item">
                <a class="page-link shadow-none" href="javascript:;" aria-label="Next" @click="clickNextEndPageBtnForMain" >
                  <span><i class="bi bi-chevron-double-right m-0"></i></span >
                </a>
              </li>
            </ul>
          </template>
        </article>
        <div class="d-flex justify-content-end">
          <div class="d-flex justify-content-end"> <button type="button" class="ml-3 btn pdf" @click="clickPdf"> PDF 다운받기 </button> </div>
          <div class="d-flex justify-content-end"> <button type="button" class="ml-3 btn excel" @click="clickExcel"> 엑셀 다운받기 </button> </div>
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
              <li class="nav-item">
                <button class="nav-link media active" id="" type="button" data-toggle="collapse" data-target="#mediaBtnBoxContainerCollapse" aria-expanded="false" aria-controls="mediaBtnBoxContainerCollapse" >
                  {{ getMedia }}
                  <i class="bi bi-arrow-down text-white mr-0"></i>
                </button>
              </li>
              <li class="nav-item" v-for="(menu, index) in swiperOption.menu" :key="menu.key + index + '-' + getUuidv4()" >
                <button
                  class="nav-link"
                  :class="[swiperOption.index === menu.index ? 'active' : '']"
                  id="pills1-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills1"
                  type="button"
                  role="tab"
                  aria-controls="pills1"
                  aria-selected="true"
                  @click="clickTopBtn(menu.key, menu.index)"
                >
                  {{ menu.text }}
                </button>
              </li>
            </ul>
          </div>
          <button class="allow" @click="clickAllowBtn">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="9" viewBox="0 0 12 8" >
              <path
                fill="none"
                fill-rule="evenodd"
                stroke="#1e1e23"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M1 6L6 1 11 6"
                transform="translate(0 1)"
              ></path>
            </svg>
          </button>
        </div>
        <article class="collapse" id="mediaBtnBoxContainerCollapse">
          <ul class="media-btn-box-container">
            <li @click="clickMedia($event, 'naver')">
              <input type="checkbox" />
              <label for="" :class="media === 'naver' ? 'active' : ''">
                {{getMediaNew("naver")}}
                <span> <i class="bi" :class="media === 'naver' ? 'bi-check active' : 'bi-plus'" ></i> </span>
              </label>
            </li>
            <li @click="clickMedia($event, 'kakaosa')">
              <input type="checkbox" />
              <label for="" :class="media === 'kakaosa' ? 'active' : ''">
                {{getMediaNew("kakaosa")}}
                <span> <i class="bi" :class="media === 'kakaosa' ? 'bi-check active' : 'bi-plus'" ></i> </span>
              </label>
            </li>
            <li @click="clickMedia($event, 'google')">
              <input type="checkbox" />
              <label for="" :class="media === 'google' ? 'active' : ''">
                {{getMediaNew("google")}}
                <span> <i class="bi" :class="media === 'google' ? 'bi-check active' : 'bi-plus'" ></i> </span>
              </label>
            </li>            
            <li @click="clickMedia($event, 'total')">
              <input type="checkbox" />
              <label for="" :class="media === 'total' ? 'active' : ''">
                전체
                <span> <i class="bi" :class="media === 'total' ? 'bi-check active' : 'bi-plus'" ></i> </span>
              </label>
            </li>
          </ul>
        </article>
        <article class="dashboard-card">
          <swiper ref="swiper" class="tab-content swiper" id="pills-tabContent" :options="swiperOption" @slideChange="slideChangeTransitionStart" >
            <swiper-slide v-for="(menu, index) in swiperOption.menu" :key="menu.key + index + '-' + getUuidv4()" >
              <div class="tab-pane top10-card" id="pills1" role="tabpanel" aria-labelledby="pills1-tab" tabindex="0" :data-index="menu.index" >
                <h3 class="mb-2">{{ "총" + menu.text + "10" }}</h3>
                <table>
                  <thead>
                    <tr>
                      <td class="p-0 bg-white" width="20px">#</td>
                      <td class="p-0 bg-white text-left" width="60%">키워드</td>
                      <td class="p-0 bg-white text-right">{{ menu.text }}</td>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-if="menu.key === 'im'">
                      <template v-if="main.im10.length === 0" >
                        <tr> <td colspan="3" class="bg-td">데이터가 존재하지 않습니다.</td> </tr>
                      </template >
                      <template v-else>
                        <tr v-for="(im, index) in main.im10" data-toggle="tooltip" data-placement="right" :title=" priceToString(im.im) !== '0' ?
                         '캠페인 : ' + im.campaign_name + ' 그룹 : ' + im.adgroup_name + ', 키워드id : ' + im.keyword_id : '-' " :key="index" >
                          <template v-if="priceToString(im.im) === '0'"> <td colspan="3">-</td> </template>
                          <template v-else>
                            <td class="text-left" v-text="index + 1"></td>
                            <td class="text-left" v-text="im.keyword_name"></td>
                            <td class="text-right" v-text="priceToString(im.im) + '회'" ></td>
                          </template>
                        </tr>
                      </template>
                    </template>
                    <template v-if="menu.key === 'clk'">
                      <template v-if="main.clk10.length === 0"
                        ><tr>
                          <td colspan="3" class="bg-td">데이터가 존재하지 않습니다.</td>
                        </tr></template
                      >
                      <template v-else>
                        <tr
                          v-for="(clk, index) in main.clk10"
                          data-toggle="tooltip"
                          data-placement="right"
                          :title="
                            priceToString(clk.clk) !== '0'
                              ? '캠페인 : ' +
                                clk.campaign_name +
                                ' 그룹 : ' +
                                clk.adgroup_name +
                                ', 키워드id : ' +
                                clk.keyword_id
                              : '-'
                          "
                          :key="index"
                        >
                          <template v-if="priceToString(clk.clk) === '0'">
                            <td colspan="3">-</td>
                          </template>
                          <template v-else>
                            <td class="text-left" v-text="index + 1"></td>
                            <td class="text-left" v-text="clk.keyword_name"></td>
                            <td
                              class="text-right"
                              v-text="priceToString(clk.clk) + '회'"
                            ></td>
                          </template>
                        </tr>
                      </template>
                    </template>
                    <template v-if="menu.key === 'cpc'">
                      <template v-if="main.cpc10.length === 0"
                        ><tr>
                          <td colspan="3" class="bg-td">데이터가 존재하지 않습니다.</td>
                        </tr></template
                      >
                      <template v-else>
                        <tr
                          v-for="(cpc, index) in main.cpc10"
                          data-toggle="tooltip"
                          data-placement="right"
                          :title="
                            priceToString(cpc.cpc) !== '0'
                              ? '캠페인 : ' +
                                cpc.campaign_name +
                                ' 그룹 : ' +
                                cpc.adgroup_name +
                                ', 키워드id : ' +
                                cpc.keyword_id
                              : '-'
                          "
                          :key="index"
                        >
                          <template v-if="priceToString(cpc.cpc) === '0'">
                            <td colspan="3">-</td>
                          </template>
                          <template v-else>
                            <td class="text-left" v-text="index + 1"></td>
                            <td class="text-left" v-text="cpc.keyword_name"></td>
                            <td
                              class="text-right"
                              v-text="priceToString(cpc.cpc) + '원'"
                            ></td>
                          </template>
                        </tr>
                      </template>
                    </template>
                    <template v-if="menu.key === 'cst'">
                      <template v-if="main.cst10.length === 0"
                        ><tr>
                          <td colspan="3" class="bg-td">데이터가 존재하지 않습니다.</td>
                        </tr></template
                      >
                      <template v-else>
                        <tr
                          v-for="(cst, index) in main.cst10"
                          data-toggle="tooltip"
                          data-placement="right"
                          :title="
                            priceToString(cst.cst) !== '0'
                              ? '캠페인 : ' +
                                cst.campaign_name +
                                ' 그룹 : ' +
                                cst.adgroup_name +
                                ', 키워드id : ' +
                                cst.keyword_id
                              : '-'
                          "
                          :key="index"
                        >
                          <template v-if="priceToString(cst.cst) === '0'">
                            <td colspan="3">-</td>
                          </template>
                          <template v-else>
                            <td class="text-left" v-text="index + 1"></td>
                            <td class="text-left" v-text="cst.keyword_name"></td>
                            <td
                              class="text-right"
                              v-text="priceToString(cst.cst) + '원'"
                            ></td>
                          </template>
                        </tr>
                      </template>
                    </template>
                    <template v-if="menu.key === 'cv'">
                      <template v-if="main.cv10.length === 0"
                        ><tr>
                          <td colspan="3" class="bg-td">데이터가 존재하지 않습니다.</td>
                        </tr></template
                      >
                      <template v-else>
                        <tr
                          v-for="(cv, index) in main.cv10"
                          data-toggle="tooltip"
                          data-placement="right"
                          :title="
                            priceToString(cv.cv) !== '0'
                              ? '캠페인 : ' +
                                cv.campaign_name +
                                ' 그룹 : ' +
                                cv.adgroup_name +
                                ', 키워드id : ' +
                                cv.keyword_id
                              : '-'
                          "
                          :key="index"
                        >
                          <template v-if="priceToString(cv.cv) === '0'">
                            <td colspan="3">-</td>
                          </template>
                          <template v-else>
                            <td class="text-left" v-text="index + 1"></td>
                            <td class="text-left" v-text="cv.keyword_name"></td>
                            <td
                              class="text-right"
                              v-text="priceToString(cv.cv) + '회'"
                            ></td>
                          </template>
                        </tr>
                      </template>
                    </template>
                    <template v-if="menu.key === 'cvr'">
                      <template v-if="main.cvr10.length === 0"
                        ><tr>
                          <td colspan="3" class="bg-td">데이터가 존재하지 않습니다.</td>
                        </tr></template
                      >
                      <template v-else>
                        <tr
                          v-for="(cvr, index) in main.cvr10"
                          data-toggle="tooltip"
                          data-placement="right"
                          :title="
                            priceToString(cvr.cvr) !== '0'
                              ? '캠페인 : ' +
                                cvr.campaign_name +
                                ' 그룹 : ' +
                                cvr.adgroup_name +
                                ', 키워드id : ' +
                                cvr.keyword_id
                              : '-'
                          "
                          :key="index"
                        >
                          <template v-if="priceToString(cvr.cvr) === '0'">
                            <td colspan="3">-</td>
                          </template>
                          <template v-else>
                            <td class="text-left" v-text="index + 1"></td>
                            <td class="text-left" v-text="cvr.keyword_name"></td>
                            <td
                              class="text-right"
                              v-text="priceToString(cvr.cvr) + '%'"
                            ></td>
                          </template>
                        </tr>
                      </template>
                    </template>
                    <template v-if="menu.key === 'cr'">
                      <template v-if="main.cr10.length === 0"
                        ><tr>
                          <td colspan="3" class="bg-td">데이터가 존재하지 않습니다.</td>
                        </tr></template
                      >
                      <template v-else>
                        <tr
                          v-for="(cr, index) in main.cr10"
                          data-toggle="tooltip"
                          data-placement="right"
                          :title="
                            priceToString(cr.cr) !== '0'
                              ? '캠페인 : ' +
                                cr.campaign_name +
                                ' 그룹 : ' +
                                cr.adgroup_name +
                                ', 키워드id : ' +
                                cr.keyword_id
                              : '-'
                          "
                          :key="index"
                        >
                          <template v-if="priceToString(cr.cr) === '0'">
                            <td colspan="3">-</td>
                          </template>
                          <template v-else>
                            <td class="text-left" v-text="index + 1"></td>
                            <td class="text-left" v-text="cr.keyword_name"></td>
                            <td
                              class="text-right"
                              v-text="priceToString(cr.cr) + '원'"
                            ></td>
                          </template>
                        </tr>
                      </template>
                    </template>
                    <template v-if="menu.key === 'cpa'">
                      <template v-if="main.cpa10.length === 0"
                        ><tr>
                          <td colspan="3" class="bg-td">데이터가 존재하지 않습니다.</td>
                        </tr></template
                      >
                      <template v-else>
                        <tr
                          v-for="(cpa, index) in main.cpa10"
                          data-toggle="tooltip"
                          data-placement="right"
                          :title="
                            priceToString(cpa.cpa) !== '0'
                              ? '캠페인 : ' +
                                cpa.campaign_name +
                                ' 그룹 : ' +
                                cpa.adgroup_name +
                                ', 키워드id : ' +
                                cpa.keyword_id
                              : '-'
                          "
                          :key="index"
                        >
                          <template v-if="priceToString(cpa.cpa) === '0'">
                            <td colspan="3">-</td>
                          </template>
                          <template v-else>
                            <td class="text-left" v-text="index + 1"></td>
                            <td class="text-left" v-text="cpa.keyword_name"></td>
                            <td
                              class="text-right"
                              v-text="priceToString(cpa.cpa) + '원'"
                            ></td>
                          </template>
                        </tr>
                      </template>
                    </template>
                    <template v-if="menu.key === 'roas'">
                      <template v-if="main.roas10.length === 0"
                        ><tr>
                          <td colspan="3" class="bg-td">데이터가 존재하지 않습니다.</td>
                        </tr></template
                      >
                      <template v-else>
                        <tr
                          v-for="(roas, index) in main.roas10"
                          data-toggle="tooltip"
                          data-placement="right"
                          :title="
                            priceToString(roas.roas) !== '0'
                              ? '캠페인 : ' +
                                roas.campaign_name +
                                ' 그룹 : ' +
                                roas.adgroup_name +
                                ', 키워드id : ' +
                                roas.keyword_id
                              : '-'
                          "
                          :key="index"
                        >
                          <template v-if="priceToString(roas.roas) === '0'">
                            <td colspan="3">-</td>
                          </template>
                          <template v-else>
                            <td class="text-left" v-text="index + 1"></td>
                            <td class="text-left" v-text="roas.keyword_name"></td>
                            <td
                              class="text-right"
                              v-text="priceToString(roas.roas) + '%'"
                            ></td>
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
            <h3>키워드 리포트</h3>
            <div class="indicator d-flex align-items-center dropdown">
              <button type="button" class="btn shadow-none p-0" data-toggle="dropdown" aria-expanded="false" > <i class="bi bi-gear m-0"></i> </button>
              <div class="dropdown-menu dropdown-menu-right">
                <form>
                  <div class="form-check w-100 pl-0">
                    <select class="form-control form-control-sm" v-model="main.sort" @change="changeSort" >
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
                  <button type="button" class="btn indicator-close" data-toggle="dropdown" aria-expanded="false" > 닫기 </button>
                </form>
              </div>
            </div>
          </div>
          <div class="m-table" v-for="data in getDatasForMain" :key="data.keyword_id + '-' + getUuidv4()" >
            <ul>
              <div class="m-table-title">
                <div class="w-100">
                  <li class="font-weight-bold">{{ data.keyword_name }}</li>
                  <li>
                    <small ><span class="badge badge-pill badge-light">{{ data.campaign_name }}</span></small >
                    <small ><span class="badge badge-pill badge-light">{{ data.adgroup_name }}</span></small >
                  </li>
                </div>
              </div>
              <div class="m-table-content">
                <div class="w-100 d-flex flex-wrap">
                  <template v-for="(k,i) in ['cst','im','clk','cv','cr','ctr','cpa','cpc','cvr','roas']">
                    <li v-if="kpi[k].check" :key="i+getUuidv4()" class="col-4">
                      <label for="" class="">{{getKpiName(k)}}</label>
                      <div>{{ priceToString(data[k]) + getUnit(k)}}</div>                      
                    </li>
                  </template>
                </div>
              </div>
            </ul>
          </div>
          <ul class="pagination d-flex justify-content-center align-items-center mb-30">
            <li class="page-item">
              <a class="page-link shadow-none" href="javascript:;" aria-label="Previous" @click="clickPreviousFirstPageBtnForMain" >
                <span aria-hidden="true" ><i class="bi bi-chevron-double-left m-0"></i></span >
              </a>
            </li>
            <li class="page-item" :class="{ disabled: isFirstPageGroupForMain }">
              <a class="page-link shadow-none" href="javascript:;" aria-label="Previous" @click="clickPreviousPageBtnForMain" >
                <span aria-hidden="true"><i class="bi bi-chevron-left"></i></span>
              </a>
            </li>
            <li class="page-item" :class="{ active: page - 1 === main.start }" v-for="page in main.pages" :key="page" >
              <a class="page-link shadow-none" href="javascript:;" v-text="page" @click="clickPageBtnForMain(page - 1)" ></a>
            </li>
            <li class="page-item" :class="{ disabled: isLastPageGroupForMain }">
              <a class="page-link shadow-none" href="javascript:;" aria-label="Next" @click="clickNextPageBtnForMain" >
                <span aria-hidden="true"><i class="bi bi-chevron-right"></i></span>
              </a>
            </li>
            <li class="page-item">
              <a class="page-link shadow-none" href="javascript:;" aria-label="Next" @click="clickNextEndPageBtnForMain" >
                <span><i class="bi bi-chevron-double-right m-0"></i></span >
              </a>
            </li>
          </ul>
        </article>
        <article>
          <div class="d-flex justify-content-between">
            <button type="button" class="btn pdf" @click="clickPdf">PDF 다운받기</button>
            <button type="button" class="btn excel" @click="clickExcel"> 엑셀 다운받기 </button>
          </div>
        </article>
      </section>
      <mbig-menu-2 ref="mBigMenu2" @closeBtn="$refs.mFooter.setFooter('home')" ></mbig-menu-2>
      <mdate-range-picker ref="mDateRangePicker" :pStart="start" :pEnd="end" :pCstart="''" :pCend="''" @changedDate="handleChangedDateRange" @closeBtn="$refs.mFooter.setFooter('home')" > </mdate-range-picker>
      <mbalance ref="mBalance" :pBalance="balance" @closeBtn="$refs.mFooter.setFooter('home')" ></mbalance>
      <mbalance ref="mBalance" :pBalance="balance" @closeBtn="$refs.mFooter.setFooter('home')" ></mbalance>
      <malarm ref="mFmenu" @closeBtn="$refs.mFooter.setFooter('home')"></malarm>
      <mfmenu ref="mFmenu" @logout="handleLogOut" @dbedit="$refs.mFooter.clickDbEdit('dashboard-edit')" @closeBtn="$refs.mFooter.setFooter('home')" ></mfmenu>
      <mdashboard-edit ref="mDashboardEdit" @closeBtn="$refs.mFooter.setFooter('home')" ></mdashboard-edit>
    </div>
    <log-out-modal ref="logOutModal" style="display: none"></log-out-modal>
    <expire-session-modal ref="expireSessionModal" style="display: none" ></expire-session-modal>
    <mask-modal ref="maskModal" style="display: none"></mask-modal>
    <campaign-keyword-analysis-modal ref="campaignKeywordAnalysisModal" style="display: none" ></campaign-keyword-analysis-modal>
    <!-- <pdf-keyword-analysis-vue ref="pdfKeywordAnalysis" :pFromdate="start" :pTodate="end" :pActiveKpi="kpi" :pMedia="media" :pActiveMedia="activeMedia" :pMain="main" style="display: none" @showMask="handleShowMask" @hideMask="handleHideMask" > </pdf-keyword-analysis-vue> -->
    <div class="hidden-print"><keyword-pdf ref="keywordPdf" :key="pdfKey"></keyword-pdf></div>
    <keyword-excel ref="keywordExcel" style="display: none" @hideMask="handleHideMask"></keyword-excel>
  </div>
</template>

<script>
import $ from "jquery";
import moment from "moment";
import XlsxPopulate from 'xlsx-populate/browser/xlsx-populate.min.js';
import { saveAs } from "file-saver";
import {  isMobile,  priceToString,  getMedia,  uuidv4,  getUnit, getType,  getKpiName} from "@/assets/js/common.js";
import { store } from "@/store/store.js";
import { SHA256 } from "@/assets/js/sha256.js";
import { API_URL, TEMP_KEY } from "@/configs/config.js";
import "@/assets/js/jqueryui.1.12.js";
// import "swiper/dist/css/swiper.css";
import 'swiper/css';
// import { swiper, swiperSlide } from "vue-awesome-swiper";
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import expireSessionModal from "@/components/modal/expireSessionModal.vue";
import messageModal from "@/components/modal/messageModal.vue";
import maskModal from "@/components/modal/maskModal.vue";
import campaignKeywordAnalysisModal from "@/components/modal/campaignKeywordAnalysisModal.vue";
import keywordTopTable from "@/components/keywordAnalysis/keywordTopTable.vue";
import keywordExcel from "@/components/keywordAnalysis/keywordExcel.vue";
import message from "@/components/common/message.vue";
import balance from "@/components/dashboard2/balance.vue";
import bigMenu2 from "@/components/layout/bigMenu2.vue";
import logOutModal from "@/components/modal/logOutModal.vue";
import dateRangePicker from "@/components/common/dateRangePicker.vue";
import pdfKeywordAnalysisVue from "@/components/pdf/pdfKeywordAnalysis.vue";
import mheader from "@/components/layout/m/header.vue";
import mfooter from "@/components/layout/m/footer.vue";
import mbigMenu2 from "@/components/layout/m/bigMenu2.vue";
import mdateRangePicker from "@/components/common/m/dateRangePicker.vue";
import mbalance from "@/components/common/m/balance.vue";
import mfmenu from "@/components/common/m/fMenu.vue";
import malarm from "@/components/common/m/alarm.vue";
import mdashboardEdit from "@/components/common/m/dashboardEdit.vue";
import keywordPdf from '@/components/keywordAnalysis/keywordPdf.vue';
export default {
  data() {
    return {
      top: "im",
      start: store.state.dateStore.start,
      end: store.state.dateStore.end,
      showMaskPannelForTop: false,
      showMaskPannelForReport: false,
      expandedIndex: null,
      expandedData: [],
      media: "naver",
      activeMedia: {
        total: false,
        naver: true,
        kakaosa: false,
        google: false,
        type: "media",
        media: "naver",
        campaignId: "",
        campaignType: "",
        adgroupid: "",
      },
      main: {
        field: "",
        query: null,
        responseData: null,
        data: null,
        total: [],
        start: 0, //현재 페이지
        display: 10, //게시글의 수
        displayPageNum: isMobile() === true ? 5 : 10, // 페이지 번호의 수
        sort: "imd",
        pages: [],
        isFirst: false,
        isEnd: false,
        // isKpiSelect : false,
        isTotalCount: "-1",
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
      kpi10: {
        im: { visible: true, check: true, text: "노출수" }, //노출수
        clk: { visible: true, check: true, text: "클릭수" }, //클릭수
        ctr: { visible: true, check: false, text: "클릭율" }, //클릭률
        cpc: { visible: true, check: true, text: "클릭당비용" }, //클릭 당 비용
        cst: { visible: false, check: true, text: "광고비" }, //광고비
        cv: { visible: true, check: true, text: "전환수" }, //전환수
        cvr: { visible: false, check: true, text: "전환율" }, //전환율
        cr: { visible: false, check: true, text: "전환매출" }, //전환매출
        cpa: { visible: true, check: true, text: "전환당비용" }, //전환 당 비용
        roas: { visible: true, check: true, text: "ROAS" }, //ROAS
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
        total: {
          header: [
            { key: "campaign_name", name: "캠페인" },
            { key: "adgroup_name", name: "그룹" },
            { key: "keyword_name", name: "키워드" },
          ],
        },
        naver: {
          header: [
            { key: "campaign_name", name: "캠페인" },
            { key: "adgroup_name", name: "그룹" },
            { key: "keyword_name", name: "키워드" },
          ],
        },
        kakaosa: {
          header: [
            { key: "campaign_name", name: "캠페인" },
            { key: "adgroup_name", name: "그룹" },
            { key: "keyword_name", name: "키워드" },
          ],
        },
        google: {
          header: [
            { key: "campaign_name", name: "캠페인" },
            { key: "adgroup_name", name: "그룹" },
            { key: "keyword_name", name: "키워드" },
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
          { key: "cst", index: 3, text: "광고비" },
          { key: "cv", index: 4, text: "전환수" },
          // { key: "cvr", index: 5, text: "전환율" },
          { key: "cr", index: 5, text: "전환매출" },
          { key: "cpa", index: 6, text: "CPA" },
          { key: "roas", index: 7, text: "ROAS" },
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
    isFirstPageGroupForMain() { return this.main.isFirst; },
    isLastPageGroupForMain() { return this.main.isEnd; },
    getMedia(media) { return getMedia(this.media); },
  },
  components: {
    bigMenu2, logOutModal, balance, expireSessionModal, maskModal, messageModal, dateRangePicker, pdfKeywordAnalysisVue, mheader, mfooter, mbigMenu2,
    mdateRangePicker, mbalance, mfmenu, malarm, mdashboardEdit, Swiper, SwiperSlide, message, campaignKeywordAnalysisModal, keywordTopTable, keywordExcel, keywordPdf
  },
  mounted() {
    $(".main").removeClass("m-h-100");
    this.clickSearchBtn();
    this.getAccountLog();
  },
  updated() {},
  methods: {
    handleLogOut() { this.$refs.logOutModal.showModal(); },
    handleExpireSession() { this.$refs.expireSessionModal.showModal(); },
    handleShowMask() { this.$refs.maskModal.showModal(); },
    handleHideMask() { this.$refs.maskModal.hideModal(); },
    handleChangedBalance(data) {
      this.balance = [];
      this.balance = data.slice();
    },
    handleChangedDateRange(data) {
      this.$refs.dateRangePicker.setDate({ start: data.start, end: data.end, compare: false, });
      this.clickSearchBtn();
    },    
    clickMedia(event, media) {
      var vm = this;
      if (media) { vm.media = media; }

      var type = vm.media === "total" ? "total" : "media";
      var media = vm.media === "total" ? "total" : vm.media;
      if (vm.activeMedia["media"] === media) return false;

      var $btn = $(event.target);
      var keys = Object.keys(vm.activeMedia);
      for (let i = 0; i < keys.length; i++) {
        if (keys[i] === "type" || keys[i] === "media") continue;
        vm.activeMedia[keys[i]] = false;
      }

      vm.activeMedia[media] = true;
      vm.activeMedia["type"] = type;
      vm.activeMedia["media"] = media;

      this.main.isTotalCount = "-1";
      this.main.start = 0;
      this.expandedData = [];
      this.expandedIndex = null;
      this.searchNew();
    },
    clickPreviousFirstPageBtnForMain() {
      this.main.start = 0;
      this.getReport();
    },
    clickPreviousPageBtnForMain() {
      this.main.start = this.main.start === 0 ? 0 : this.main.start - 1;
      this.getReport();
    },
    clickNextEndPageBtnForMain() {
      let tempEndPage = Math.ceil(this.main.responseData.totalcount / this.main.display);
      this.main.start = tempEndPage - 1;
      this.getReport();
    },
    clickNextPageBtnForMain() {
      let tempEndPage = Math.ceil(this.main.responseData.totalcount / this.main.display);
      this.main.start = this.main.start > tempEndPage ? tempEndPage : this.main.start + 1;
      this.getReport();
    },
    clickPageBtnForMain(page) {
      this.main.start = page;
      this.getReport();
    },
    clickSearchBtn() {
      var date = this.$refs.dateRangePicker.getDate();
      this.start = date.start;
      this.end = date.end;
      this.main.start = 0;
      this.expandedData = [];
      this.expandedIndex = null;
      this.searchNew();
    },
    clickAdgroup(data) {
      this.category.forEach(function (category) {
        if (category.isActive === true) {
          category.isActive = false;
          return true;
        }
      });

      this.category.forEach(function (category) {
        if (category.id === data.id) {
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
        if (keys[i].indexOf(type) > -1) {
          vm.kpi[keys[i]].check = $active.is(":checked");
          break;
        }
      }
    },
    clickCheckpi10(event, type) {
      var vm = this;
      var $active = $(event.target);
      var keys = Object.keys(vm.kpi10);

      for (let i = 0; i < keys.length; i++) {
        if (keys[i].indexOf(type) > -1) {
          vm.kpi10[keys[i]].check = $active.is(":checked");
          break;
        }
      }
    },
    clickSort(sort) {
      this.main.sort = sort;
      this.main.start = 0;
      this.getReport();
    },
    clickExcel() {
      var vm = this;
      var date = vm.$refs.dateRangePicker.getDate();
      var diff = moment(date.end).diff(moment(date.start), "days");
      var comparefromdate = moment(date.start).subtract(1 + Number(diff), "days").format("YYYY-MM-DD");
      var comparetodate = moment(date.start).subtract(1, "days").format("YYYY-MM-DD");      
      
      vm.handleShowMask();
      vm.$refs.keywordExcel.clickExcel({fromdate: date.start, todate: date.end, comparefromdate: comparefromdate, comparetodate: comparetodate, 
      md: {naver: "N", kakaosa: "D", google: "google"}[vm.activeMedia.media], sort: vm.main.sort});
    },    
    async clickPdf() {
      var date = this.$refs.dateRangePicker.getDate();
      var diff = moment(date.end).diff(moment(date.start), "days");
      var comparefromdate = moment(date.start).subtract(1 + Number(diff), "days").format("YYYY-MM-DD");
      var comparetodate = moment(date.start).subtract(1, "days").format("YYYY-MM-DD");      

      this.handleShowMask();
      await this.$refs.keywordPdf.initPDF({date: date, cdate: {start: comparefromdate, end: comparetodate}, media: this.media});
      var blob = await this.$refs.keywordPdf.generatePDF(); // 렌더링 완료 후 PDF 생성
      window.open(URL.createObjectURL(blob));
      this.pdfKey++;
      this.handleHideMask();
    }, 
    clickRadioDisplay(event, display) {
      var vm = this;
      if (vm.main.display === display) return false;
      vm.main.display = display;
      vm.main.start = 0;
      vm.getReport();
      // vm.clickSearchBtn();
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
      vm.$refs.swiper.swiper.slideTo(i);
      vm.top = top;
      vm.expandedData = [];
      vm.expandedIndex = null;
      vm.getTopKpi();
    },
    clickPlusBtn(index, campaignId) { 
      var vm = this;
      var diff = moment(vm.end).diff(moment(vm.start), "days");
      var comparefromdate = moment(vm.start).subtract(1 + Number(diff), "days").format("YYYY-MM-DD");
      var comparetodate = moment(vm.start).subtract(1, "days").format("YYYY-MM-DD");
      var md = "";
      switch (vm.activeMedia.media) {
        case "naver":
          md = "N";
          break;
        case "kakaosa":
          md = "D";
          break;
        case "google":
          md = "google";
          break;          
        default:
          md = "TOTAL";
      }      

      var keywordreportForTop = $.ajax({
        type: "get", //요청 메소드 방식
        url: API_URL + "/app/analysis/campaignkeywordreport",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          fromdate: vm.start,
          todate: vm.end,
          comparefromdate: comparefromdate,
          comparetodate: comparetodate,
          md: md,
          kpi: vm.top,
          campaignid: campaignId,
          session: store.state.userStore.session,
        },
        beforeSend: function (data) {},
        success: function (data) {},
        error: function (a, b, c) {},
        complete: function (a, b, c) {},
      });

      $.when(keywordreportForTop).done(function (keywordreportForTop) {
          console.log(keywordreportForTop);
          vm.expandedData = [];
          vm.expandedData = keywordreportForTop.data.kpis[vm.top].slice();
          vm.expandedIndex = vm.expandedIndex === index ? null : index; 
        })
        .then(function (data) {});      
    },
    clickPlusBtn2(index, adgroupId) {
      var vm = this;
      var diff = moment(vm.end).diff(moment(vm.start), "days");
      var comparefromdate = moment(vm.start).subtract(1 + Number(diff), "days").format("YYYY-MM-DD");
      var comparetodate = moment(vm.start).subtract(1, "days").format("YYYY-MM-DD");
      var md = "";
      switch (vm.activeMedia.media) {
        case "naver":
          md = "N";
          break;
        case "kakaosa":
          md = "D";
          break;
        case "google":
          md = "google";
          break;          
        default:
          md = "TOTAL";
      }      

      var keywordreportForTop = $.ajax({
        type: "get", //요청 메소드 방식
        url: API_URL + "/app/analysis/adgroupkeywordreport",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          fromdate: vm.start,
          todate: vm.end,
          comparefromdate: comparefromdate,
          comparetodate: comparetodate,
          md: md,
          kpi: vm.top,
          adgroupid: adgroupId,
          session: store.state.userStore.session,
        },
        beforeSend: function (data) {},
        success: function (data) {},
        error: function (a, b, c) {},
        complete: function (a, b, c) {},
      });

      $.when(keywordreportForTop).done(function (keywordreportForTop) {
          console.log(keywordreportForTop);
          vm.expandedData = [];
          vm.expandedData = keywordreportForTop.data.kpis[vm.top].slice();
          vm.expandedIndex = vm.expandedIndex === index ? null : index; 
        })
        .then(function (data) {});          
    },       
    clickCampaignKeywordAnalysisModal(o) { 
      var diff = moment(this.end).diff(moment(this.start), "days");
      var comparefromdate = moment(this.start).subtract(1 + Number(diff), "days").format("YYYY-MM-DD");
      var comparetodate = moment(this.start).subtract(1, "days").format("YYYY-MM-DD");
      this.$refs.campaignKeywordAnalysisModal.showModal(o, this.media, this.top+"d", this.start, this.end, comparefromdate,  comparetodate); 
    },    
    slideChangeTransitionStart() {
      let vm = this;
      vm.$nextTick(function () {
        let el = document.querySelector(".swiper-slide-active > div");

        if (el) {
          // console.log(Number(el.getAttribute("data-index")));
          vm.swiperOption.index = Number(el.getAttribute("data-index"));
          vm.clickTopBtn(
            vm.swiperOption.menu[vm.swiperOption.index].key,
            vm.swiperOption.index
          );
        }
      });
    },
    changeSort() {
      var date = this.$refs.dateRangePicker.getDate();
      this.start = date.start;
      this.end = date.end;
      this.main.start = 0;
      this.getReport();
      // this.getTopKpi();
      // this.clickSearchBtn();
    },
    priceToString(salse) {
      if (salse === undefined) return "";
      return priceToString(salse);
    },    
    getKpiName(k) {return getKpiName(k);},
    getType(type) { return getType(type); },
    getUuidv4() { return uuidv4(); },    
    getUnit(kpi) { return getUnit(kpi); },    
    getMediaNew(media) {return getMedia(media);},
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
    getTopKpi() {
      var vm = this;
      var md = "";
      var date = vm.$refs.dateRangePicker.getDate();
      var diff = moment(date.end).diff(moment(date.start), "days");
      var comparefromdate = moment(date.start).subtract(1 + Number(diff), "days").format("YYYY-MM-DD");
      var comparetodate = moment(date.start).subtract(1, "days").format("YYYY-MM-DD");

      switch (vm.activeMedia.media) {
        case "naver":
          md = "N";
          break;
        case "kakaosa":
          md = "D";
          break;
        case "google":
          md = "google";
          break;          
        default:
          md = "TOTAL";
      }

      $.ajax({
        type: "get", //요청 메소드 방식
        url: API_URL + "/app/analysis/keywordreport",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          fromdate: date.start,
          todate: date.end,
          comparefromdate: comparefromdate,
          comparetodate: comparetodate,
          campaigntype: vm.activeMedia.campaignType,
          adgroupid: vm.activeMedia.adgroupid,
          md: md,
          start: 0,
          sort: vm.main.sort,
          display: vm.main.display,
          totalcount: vm.main.isTotalCount,
          kpi: vm.top,
          session: store.state.userStore.session,
        },
        beforeSend: function (data) { vm.handleShowMask(); },
        success: function (data) {
          if (data.result === "success") {
            var keys = Object.keys(data.data.kpis);
            keys.forEach(function (key) {
              vm.main[key + "10"] = [];
              vm.main[key + "10"] = data.data.kpis[key];
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
      var md = "";
      var date = vm.$refs.dateRangePicker.getDate();
      var diff = moment(date.end).diff(moment(date.start), "days");
      var comparefromdate = moment(date.start).subtract(1 + Number(diff), "days").format("YYYY-MM-DD");
      var comparetodate = moment(date.start).subtract(1, "days").format("YYYY-MM-DD");

      switch (vm.activeMedia.media) {
        case "naver":
          md = "N";
          break;
        case "kakaosa":
          md = "D";
          break;
        case "google":
          md = "google";
          break;          
        default:
          md = "TOTAL";
      }

      $.ajax({
        type: "get", //요청 메소드 방식
        url: API_URL + "/app/analysis/keywordreport",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          fromdate: date.start,
          todate: date.end,
          comparefromdate: comparefromdate,
          comparetodate: comparetodate,          
          campaigntype: vm.activeMedia.campaignType,
          adgroupid: vm.activeMedia.adgroupid,
          md: md,
          start: vm.main.start,
          sort: vm.main.sort,
          display: vm.main.display,
          totalcount: vm.main.isTotalCount,
          // "kpi" : vm.main.isKpiSelect == false ? "cst,im,cv,cpa,cpc,clk,cr,roas" : "",
          kpi: "",
          session: store.state.userStore.session,
        },
        beforeSend: function (data) {
          vm.handleShowMask();
          // vm.showMaskPannelForReport = true;
        },
        success: function (data) {
          if (data.result === "success") {
            // console.log(data);
            vm.main.data = [];
            vm.main.responseData = null;

            vm.main.responseData = data;
            vm.main.data = data.data.keywords;
            vm.getStartAndEndPageForMain();
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
    getCampaignKeywordTop(){

    },    
    getStartAndEndPageForMain() {
      // this.main.isTotalCount !== '0' ? this.main.responseData.totalcount = this.main.isTotalCount : this.main.isTotalCount = this.main.responseData.totalcount;
      this.main.isTotalCount = this.main.responseData.totalcount;

      this.main.pages = [];
      var endPage = Math.ceil((this.main.start + 1) / this.main.displayPageNum) * this.main.displayPageNum;
      var startPage = endPage - this.main.displayPageNum + 1;
      var tempEndPage = Math.ceil(this.main.responseData.totalcount / this.main.display);
      if (endPage > tempEndPage) { endPage = tempEndPage; }

      this.main.isFirst = this.main.start + 1 === 1 ? true : false;
      this.main.isEnd = Math.ceil(this.main.responseData.totalcount / this.main.display) === this.main.start + 1 ? true : false;
      for (var i = startPage; i <= endPage; i++) { this.main.pages.push(i); }
    },    
    calcQigrade(qigrade) {
      var max = 7;
      var percentage = (qigrade / max) * 100;
      return `${percentage}%`;
    },
    activeMain(flag) {
      this.$emit("mountedMain", true);
      this.$emit("mountedDasyboad", true);
    },   
    searchNew() {
      var vm = this;
      var md = "";
      vm.handleShowMask();
      var date = vm.$refs.dateRangePicker.getDate();
      var diff = moment(date.end).diff(moment(date.start), "days");
      var comparefromdate = moment(date.start).subtract(1 + Number(diff), "days").format("YYYY-MM-DD");
      var comparetodate = moment(date.start).subtract(1, "days").format("YYYY-MM-DD");

      switch (vm.activeMedia.media) {
        case "naver":
          md = "N";
          break;
        case "kakaosa":
          md = "D";
          break;
        case "google":
          md = "google";
          break;          
        default:
          md = "TOTAL";
      }

      var keywordreportForTop = $.ajax({
        type: "get", //요청 메소드 방식
        url: API_URL + "/app/analysis/keywordreport",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          fromdate: date.start,
          todate: date.end,
          comparefromdate: comparefromdate,
          comparetodate: comparetodate,          
          campaigntype: vm.activeMedia.campaignType,
          adgroupid: vm.activeMedia.adgroupid,
          md: md,
          start: 0,
          sort: vm.main.sort,
          display: vm.main.display,
          totalcount: vm.main.isTotalCount,
          kpi: vm.top,
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

      var keywordreportForKeyword = $.ajax({
        type: "get", //요청 메소드 방식
        url: API_URL + "/app/analysis/keywordreport",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          fromdate: date.start,
          todate: date.end,
          comparefromdate: comparefromdate,
          comparetodate: comparetodate,             
          campaigntype: vm.activeMedia.campaignType,
          adgroupid: vm.activeMedia.adgroupid,
          md: md,
          start: vm.main.start,
          sort: vm.main.sort,
          display: vm.main.display,
          totalcount: vm.main.isTotalCount,
          kpi: "",
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

      $.when(keywordreportForTop, keywordreportForKeyword)
        .done(function (keywordreportForTop, keywordreportForKeyword) {
          // console.log(keywordreportForTop, keywordreportForKeyword);
          if (keywordreportForTop && keywordreportForTop[1] === "success") {
            var data = keywordreportForTop[0];
            var keys = Object.keys(data.data.kpis);
            keys.forEach(function (key) {
              if(key === 'cp') return;

              vm.main[key + "10"] = [];
              vm.main[key + "10"] = data.data.kpis[key];
            });
          }

          if (keywordreportForKeyword && keywordreportForKeyword[1] === "success") {
            var data = keywordreportForKeyword[0];
            vm.main.data = [];
            vm.main.total = [];
            vm.main.responseData = null;

            vm.main.responseData = data;
            vm.main.data = data.data.keywords;
            vm.main.total.push(data.data.total);
            vm.getStartAndEndPageForMain();
          }
        })
        .then(function (data) {
          vm.handleHideMask();
        });
    },     
  },
};
</script>

<style scoped></style>
