<template>
  <div class="d-flex m-h-100 dashboard">
    <big-menu-2 :pMenu="'adAnalysis'" @mountedMain="activeMain" class="pc"></big-menu-2>
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
          <h2>소재별 분석</h2>
          <div class="search d-flex">
            <select class="form-control" id="media" v-model="media" @change="clickMedia">
              <option selected value="naver">{{getMedia("naver")}}</option>
              <option value="kakaosa">{{getMedia("kakaosa")}}</option>
              <option value="naverda">{{getMedia("naverda")}}</option>
              <option value="kakaomo">{{getMedia("kakaomo")}}</option>
              <option value="google">{{getMedia("google")}}</option>
            </select>
            <date-range-picker ref="dateRangePicker" class="form-control" :pStart="start" :pEnd="end" :pDisabled="false" @changedDate="handleChangedDateRange" > </date-range-picker>
            <button type="submit" class="btn submit" @click.prevent="clickSearchBtn"> 조회하기 </button>
          </div>
        </div>
        <div class="select-btn">
          <button type="button" class="btn select" v-for="(k, i) in Object.keys(kpi)" :key="k + i + '-' + getUuidv4()" :class="[activeBtn[k] === true ? 'active' : '']" @click="clickBtn($event, k)" > {{ getKpiName(k) }} </button>
        </div>
        <div class="top10-ad">
          <template v-if="activeMedia.type === 'search'">
            <div class="col-12">
              <div class="top10-ad-card">
                <h3 class="mb-2">{{"총"+getKpiName(activeBtn.kpi)+" TOP10" }}</h3>
                <table class="">
                  <thead>
                    <tr>
                      <td width="15%" class="text-left">캠페인</td>
                      <td width="15%" class="text-left">그룹</td>
                      <td width="15%" class="text-left">소재유형</td>
                      <td width="35%" class="text-left">소재</td>
                      <td class="text-right pr-0">{{getKpiName(activeBtn.kpi)}}</td>
                      <td width="8%" class="text-right pl-0">%</td>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-if="main[activeBtn.kpi+'10'].length === 0"><tr><td colspan="6" class="bg-td">데이터가 존재하지 않습니다.</td></tr></template>
                    <template v-else>
                      <template v-for="(t, index) in main[activeBtn.kpi + '10']" :key="index+getUuidv4()">
                        <tr data-toggle="tooltip" data-placement="right" >
                          <td class="text-left">
                            <p class="d-flex align-items-center">
                              {{t.campaign_name}}
                              <a data-toggle="modal" data-target="#keyword-modal" class="btn-modal" @click="clickPlusBtn(index, t.campaignid)"><span>더보기</span></a>
                            </p>
                          </td>
                          <td class="text-left">
                            <p class="d-flex align-items-center">
                              {{t.adgroup_name}}
                              <a data-toggle="modal" data-target="#keyword-modal" class="btn-modal" @click="clickPlusBtn2(index, t.adgroup_id)"><span>더보기</span></a>
                            </p>                            
                          </td>       
                          <td class="text-left">{{getAdTypeNew(t.ad_type)}}</td>       
                          <td class="text-left link">
                            <p class="font-weight-bold">
                              {{ t.ad_headline }}
                              <small class="sub">({{ t.ad_id }})</small>
                            </p>
                            <p>{{ t.ad_description }}</p>     
                            <div class="mb-2 mt-2">
                              <button type="button" class="btn-default btn btn-secondary btn-sm" @click="clickThumbnailSlide(t)"><i class="bi bi-card-image"></i> 소재 이미지</button>
                              <button type="button" class="btn-default btn btn-secondary btn-sm ml-1" @click="goToUrl(t.ad_pc_final)"><i class="bi bi-link"></i>URL이동</button>
                            </div>                     
                          </td>                 
                          <td class="text-right pr-0">{{ priceToString(t[activeBtn.kpi]) + getUnits(activeBtn.kpi)}}</td>
                          <td class="text-right pr-0">
                              <a href="#" class="d-flex align-items-center justify-content-end">
                                <template v-if="t.cp.length === 0"></template>
                                <template v-else>
                                  <template v-if="t.cp !== undefined">
                                    <template v-if="t.cp.per[activeBtn.kpi] === 0">{{'-'}}</template>
                                    <template v-else> 
                                      <span :class="[t.cp.per[activeBtn.kpi].indexOf('-') > -1 ? 'down' : 'up']">{{t.cp.per[activeBtn.kpi] + "%"}}<i :class="[t.cp.per[activeBtn.kpi].indexOf('-') > -1 ? 'bi bi-graph-down-arrow ' : 'bi bi-graph-up-arrow ']" class="ml-1 mr-0"></i></span> 
                                    </template>
                                  </template>
                                </template>
                              </a>                          
                          </td>
                        </tr>      
                        <!-- 조건부 서브 테이블 -->
                        <tr :key="index+getUuidv4()" v-if="expandedIndex === index">
                          <td colspan="7" style="padding: 8px;">
                            <div style="padding:8px; border-radius:4px; border: 2px solid #42b883;">
                              <table>
                                <thead>
                                  <tr>
                                    <td width="15%" class="text-left">캠페인</td>
                                    <td width="15%" class="text-left">그룹</td>
                                    <td width="15%" class="text-left">소재유형</td>
                                    <td width="35%" class="text-left">소재</td>
                                    <td class="text-right pr-0">{{getKpiName(activeBtn.kpi)}}</td>
                                    <td width="8%" class="text-right pl-0">%</td>
                                  </tr>
                                </thead>
                                <tbody>
                                  <template v-if="expandedData !== null">
                                    <template v-for="(t2, index2) in expandedData" :key="index2+getUuidv4()">
                                      <tr >
                                        <td class="text-left"><p class="d-flex align-items-center">{{t2.campaign_name}}</p></td>
                                        <td class="text-left">{{t2.adgroup_name}}</td>       
                                        <td class="text-left">{{getAdTypeNew(t2.ad_type)}}</td>     
                                        <td class="text-left link">
                                          <p class="font-weight-bold">{{ t.ad_headline }}<small class="sub">({{ t2.ad_id }})</small></p>
                                          <p>{{ t2.ad_description }}</p>     
                                          <div class="mb-2 mt-2">
                                            <button type="button" class="btn-default btn btn-secondary btn-sm" @click="clickThumbnailSlide(t2)"><i class="bi bi-card-image"></i> 소재 이미지</button>
                                            <button type="button" class="btn-default btn btn-secondary btn-sm ml-1" @click="goToUrl(t2.ad_pc_final)"><i class="bi bi-link"></i>URL이동</button>
                                          </div>                     
                                        </td>   
                                        <td class="text-right pr-0">{{ priceToString(t2[activeBtn.kpi]) + getUnits(activeBtn.kpi)}}</td>              
                                        <td class="text-right pr-0">
                                          <a href="#" class="d-flex align-items-center justify-content-end">
                                            <template v-if="t2.cp.length === 0"></template>
                                            <template v-else>
                                              <template v-if="t2.cp !== undefined">
                                                <template v-if="t2.cp.per[activeBtn.kpi] === 0">{{'-'}}</template>
                                                <template v-else> 
                                                  <span :class="[t2.cp.per[activeBtn.kpi].indexOf('-') > -1 ? 'down' : 'up']">{{t2.cp.per[activeBtn.kpi] + "%"}}<i :class="[t2.cp.per[activeBtn.kpi].indexOf('-') > -1 ? 'bi bi-graph-down-arrow ' : 'bi bi-graph-up-arrow ']" class="ml-1 mr-0"></i></span> 
                                                </template>
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
          </template>
          <template v-else>
            <div class="col-12">
              <div class="top10-ad-card">
                <h3 class="mb-2">{{"총"+getKpiName(activeBtn.kpi)+" TOP10" }}</h3>
                <table class="">
                  <thead>
                    <tr>
                      <td width="15%" class="text-left">캠페인</td>
                      <td width="15%" class="text-left">그룹</td>
                      <td width="15%" class="text-left">소재유형</td>
                      <td width="35%" class="text-left">소재</td>
                      <td class="text-right pr-0">{{getKpiName(activeBtn.kpi)}}</td>
                      <td width="8%" class="text-right pl-0">%</td>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-if="main[activeBtn.kpi+'10'].length === 0"><tr><td colspan="6" class="bg-td">데이터가 존재하지 않습니다.</td></tr></template>
                    <template v-else>
                      <tr v-for="(t, index) in main[activeBtn.kpi + '10']" data-toggle="tooltip" data-placement="right" :key="index">
                        <td class="text-left">{{t.campaign_name}}</td>
                        <td class="text-left">{{t.adgroup_name}}</td>       
                        <td class="text-left">{{getBannerType(t.campaign_type	)}}</td>       
                        <td class="link">
                          <div class="banner-table">
                            <div class="banner-table-title-icon">
                              <span> <img :src="t.ad_image_url" class="img-thumbnail" @error="handleNoImg" /> </span>
                              <span class="img-thumbnail-hover" @click="clickThumbnail(t)" >
                                <div class="d-flex justify-content-center align-items-center" >
                                  <i class="bi bi-search text-white m-0"></i>
                                </div>
                              </span>
                            </div>
                            <ul>
                              <div class="d-flex txt-left">
                                <div class="w-100">
                                  <li class="font-weight-bold"> <p class="">{{ t.ad_headline }}</p> </li>
                                  <li class=""> <p class="sub">{{ t.ad_id }}</p> </li>
                                </div>
                              </div>
                            </ul>
                          </div>
                        </td>                
                        <td class="text-right pr-0">{{ priceToString(t[activeBtn.kpi]) + getUnits(activeBtn.kpi)}}</td>
                        <td class="text-right pr-0">
                            <a href="#" class="d-flex align-items-center justify-content-end">
                              <template v-if="t.cp.length === 0"></template>
                              <template v-else>
                                <template v-if="t.cp !== undefined">
                                  <template v-if="t.cp.per[activeBtn.kpi] === 0">{{'-'}}</template>
                                  <template v-else> 
                                    <span :class="[t.cp.per[activeBtn.kpi].indexOf('-') > -1 ? 'down' : 'up']">{{t.cp.per[activeBtn.kpi] + "%"}}<i :class="[t.cp.per[activeBtn.kpi].indexOf('-') > -1 ? 'bi bi-graph-down-arrow ' : 'bi bi-graph-up-arrow ']" class="ml-1 mr-0"></i></span> 
                                  </template>
                                </template>
                              </template>                              
                            </a>                          
                        </td>
                      </tr>
                    </template>
                  </tbody>
                </table>
              </div>
            </div>
          </template>
        </div>
        <article class="">
          <div class="title d-flex justify-content-between align-items-center">
            <h3 v-if="activeMedia.type === 'search'">검색광고 리포트</h3>
            <h3 v-else>배너광고 리포트</h3>
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
                  <td width="10%" class="text-left">소재유형</td>
                  <td width="28%" class="text-left">소재</td>
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
                <template v-if="!main.data || main.data.length === 0">
                  <tr> <td class="txt-center" colspan="10">데이터가 존재하지 않습니다.</td> </tr>
                </template>
                <template v-else>
                  <template v-if="activeMedia.type === 'search'">
                    <tr v-for="data in getDatasForMain" :key="data.keyword_id + '-' + getUuidv4()" >
                      <td class="txt-left">{{data.campaign_name}}</td>
                      <td class="txt-left">{{data.adgroup_name}}</td>
                      <td class="txt-left">{{getAdTypeNew(data.ad_type)}}</td>
                      <td class="link txt-left">
                        <p class="font-weight-bold"> {{ data.ad_headline }} <small class="sub">({{ data.ad_id }})</small> </p>
                        <div>
                          {{ data.ad_description }}
                          <div class="mb-2 mt-2">
                            <button type="button" class="btn-default btn btn-secondary btn-sm" @click="clickThumbnailSlide(data)"><i class="bi bi-card-image"></i> 소재 이미지</button>
                            <button type="button" class="btn-default btn btn-secondary btn-sm ml-1" @click="goToUrl(data.ad_pc_final)"><i class="bi bi-link"></i>URL이동</button>
                          </div> 
                          <!-- <a class="btn" data-toggle="modal" :href="data.ad_pc_display" target="_blank" @click="clickUrlBtn(data.ad_pc_display)" ><i class="bi bi-box-arrow-up-right"> </i></a> -->
                        </div>
                      </td>
                      <template v-for="(k,i) in ['im','clk','ctr','cpc','cst','cv','cr','cpa','cvr','roas']">
                        <td :key="i+getUuidv4()" v-if="kpi[k].check">{{priceToString(data[k])+getUnits(k)}}</td>
                      </template>                        
                    </tr>
                  </template>
                  <template v-else>
                    <tr v-for="data in getDatasForMain" :key="data.keyword_id + '-' + getUuidv4()" >
                      <td class="text-left">{{data.campaign_name}}</td>
                      <td class="text-left">{{data.adgroup_name}}</td>       
                      <td class="text-left">{{getBannerType(data.campaign_type	)}}</td>                        
                      <td class="link">
                        <div class="banner-table">
                          <div class="banner-table-title-icon">
                            <span> <img :src="data.ad_image_url" class="img-thumbnail" @error="handleNoImg" /> </span>
                            <span class="img-thumbnail-hover" @click="clickThumbnail(data)" >
                              <div class="d-flex justify-content-center align-items-center" >
                                <i class="bi bi-search text-white m-0"></i>
                              </div>
                            </span>
                          </div>
                          <ul>
                            <div class="d-flex txt-left">
                              <div class="w-100">
                                <li class="font-weight-bold"> <p class="">{{ data.ad_headline }}</p> </li>
                                <li class=""> <p class="sub">{{ data.ad_id }}</p> </li>
                              </div>
                            </div>
                          </ul>
                        </div>
                      </td>
                      <template v-for="(k,i) in ['im','clk','ctr','cpc','cst','cv','cr','cpa','cvr','roas']">
                        <td :key="i+getUuidv4()" v-if="kpi[k].check">{{priceToString(data[k])+getUnits(k)}}</td>
                      </template> 
                    </tr>
                  </template>
                </template>
              </tbody>
              <tfoot>
                  <tr class="total bg-white">
                    <td colspan="3"></td>
                    <template v-if="main.responseData !== null">
                      <td>
                        <ul>
                          <div class="d-flex txt-left">
                            <div class="w-100">
                              <li class="font-weight-bold">
                                <p class="">{{'전체 소재 ' + main.responseData.totalcount + '개'}}</p>
                              </li>
                              <li class="">
                              </li>
                            </div>
                          </div>
                        </ul>                        
                      </td>
                      <template v-for="(k, i) in Object.keys(kpi)">
                        <td v-if="kpi[k].check" :key="k + i + getUuidv4">
                          <a href="#" class="d-flex align-items-center justify-content-end">
                            <template v-if="main.responseData.data.total.cp.per[k] === 0">{{'-'}}</template>
                            <template v-else>
                              <span>{{priceToString(main.responseData.data.total[k]) + getUnits(k)}}</span>
                              <small class="ml-1" :class="main.responseData.data.total.cp.per[k].indexOf('-') > -1 ? 'down' : 'up'">
                                {{main.responseData.data.total.cp.per[k] + '%'}}
                                <i :class="[main.responseData.data.total.cp.per[k].indexOf('-') > -1 ? 'bi bi-graph-down-arrow ' : 'bi bi-graph-up-arrow ']" class="ml-1 mr-0"></i>
                              </small>
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
                <span aria-hidden="true" ><i class="bi bi-chevron-double-left m-0"></i> </span>
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
                <span><i class="bi bi-chevron-double-right m-0"></i></span>
              </a>
            </li>
          </ul>
        </article>
        <div class="d-flex justify-content-end">
          <button type="button" class="ml-3 btn pdf" @click="clickPdf"> PDF 다운받기 </button>
          <button type="button" class="ml-3 btn excel" @click="clickExcel"> 엑셀 다운받기 </button>
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
                  {{ getMedia(media) }}
                  <i class="bi bi-arrow-down text-white mr-0"></i>
                </button>
              </li>
              <li class="nav-item" v-for="(menu, i) in swiperOption.menu" :key="menu + i + '-' + getUuidv4()" >
                <button class="nav-link" :class="[swiperOption.index === menu.index ? 'active' : '']" id="pills1-tab" data-bs-toggle="pill" data-bs-target="#pills1" type="button" role="tab" 
                  aria-controls="pills1"
                  aria-selected="true"
                  @click="clickTopBtn(menu.key, menu.index)" >
                  {{ menu.text }}
                </button>
              </li>
            </ul>
          </div>
          <button class="allow" @click="clickAllowBtn">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="9" viewBox="0 0 12 8" >
              <path fill="none" fill-rule="evenodd" stroke="#1e1e23" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M1 6L6 1 11 6" transform="translate(0 1)" ></path>
            </svg>
          </button>
        </div>
        <article class="collapse" id="mediaBtnBoxContainerCollapse">
          <ul class="media-btn-box-container">
            <template v-for="(k,i) in [{m:'naver', s:'search'}, {m:'kakaosa', s:'search'}, {m:'naverda', s:'banner'},  {m:'kakaomo', s:'banner'}, {m:'google', s:'banner'}]" :key="i+getUuidv4()">
              <li @click="clickMedia($event, k.s, k.m)">
                <input type="checkbox" />
                <label for="" :class="media === k.m ? 'active' : ''">{{getMedia(k.m)}} <span> <i class="bi" :class="media === k.m ? 'bi-check active' : 'bi-plus'" ></i> </span> </label>
              </li>
            </template>
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
          <div class="m-table d-flex" v-for="data in getDatasForMain" :key="data.keyword_id + '-' + getUuidv4()" >
            <div v-if="activeMedia.type === 'banner'">
              <div class="m-table-title-icon" @click="clickThumbnail(data)">
                <span> <img :src="data.ad_image_url" /> </span>
              </div>
            </div>
            <ul>
              <div class="m-table-title">
                <div class="w-100">
                  <li class="font-weight-bold d-flex align-items-center">
                    {{ data.ad_headline }}
                    <a class="btn" :href="data.ad_pc_display" ><i class="bi bi-box-arrow-up-right"></i> </a>
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
      <malarm ref="mFmenu" @closeBtn="$refs.mFooter.setFooter('home')"></malarm>
      <mfmenu ref="mFmenu" @logout="handleLogOut" @dbedit="$refs.mFooter.clickDbEdit('dashboard-edit')" @closeBtn="$refs.mFooter.setFooter('home')" ></mfmenu>
      <mdashboard-edit ref="mDashboardEdit" @closeBtn="$refs.mFooter.setFooter('home')" ></mdashboard-edit>
    </div>
    <log-out-modal ref="logOutModal" style="display: none"></log-out-modal>
    <expire-session-modal ref="expireSessionModal" style="display: none" ></expire-session-modal>
    <mask-modal ref="maskModal" style="display: none"></mask-modal>
    <thumbnail-modal ref="thumbnailModal"></thumbnail-modal>
    <thumbnail-slide-modal ref="thumbnailSlideModal"></thumbnail-slide-modal>
    <ad-excel ref="adExcel" style="display: none" @hideMask='handleHideMask'></ad-excel>
    <div class="hidden-print"><ad-pdf ref="adPdf" :key="pdfKey"></ad-pdf></div>
  </div>
</template>

<script>
import $ from "jquery";
import moment from "moment";
import {store} from "@/store/store.js";
import {SHA256} from "@/assets/js/sha256.js";
// import "swiper/dist/css/swiper.css";
import 'swiper/css';
// import { swiper, swiperSlide } from "vue-awesome-swiper";
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import {API_URL, TEMP_KEY, PGGROUPS, UNITS, BIDGOAL, BIDTYPE, BUDGETTYPE, CTYPE} from "@/configs/config.js";
import {isMobile, priceToString, getMedia, uuidv4, getKpiName, getAdType} from "@/assets/js/common.js";
import expireSessionModal from "@/components/modal/expireSessionModal.vue";
import messageModal from "@/components/modal/messageModal.vue";
import maskModal from "@/components/modal/maskModal.vue";
import message from "@/components/common/message.vue";
import balance from "@/components/dashboard2/balance.vue";
import bigMenu2 from "@/components/layout/bigMenu2.vue";
import logOutModal from "@/components/modal/logOutModal.vue";
import dateRangePicker from "@/components/common/dateRangePicker.vue";
import pdfAdAnalysis from "@/components/pdf/pdfAdAnalysis.vue";
import thumbnailModal from "@/components/modal/thumbnailModal.vue";
import thumbnailSlideModal from "@/components/modal/thumbnailSlideModal.vue";
import adExcel from "@/components/adAnalysis/adExcel.vue";
import mheader from "@/components/layout/m/header.vue";
import mfooter from "@/components/layout/m/footer.vue";
import mbigMenu2 from "@/components/layout/m/bigMenu2.vue";
import mdateRangePicker from "@/components/common/m/dateRangePicker.vue";
import mbalance from "@/components/common/m/balance.vue";
import mfmenu from "@/components/common/m/fMenu.vue";
import malarm from "@/components/common/m/alarm.vue";
import mdashboardEdit from "@/components/common/m/dashboardEdit.vue";
import noimg from "@/assets/image/noimg.png";
import adPdf from '@/components/adAnalysis/adPdf.vue';
export default {
  data() {
    return {
      start: store.state.dateStore.start,
      end: store.state.dateStore.end,
      showMaskPannelForTop: false,
      showMaskPannelForReport: false,
      expandedIndex: null,
      expandedData: [],
      media: "naver",
      activeMedia: { naver: true, kakaosa: false, kakaomo: false, naverda: false, google: false, type: "search", media: "naver", },
      main: {
        field: "",
        query: null,
        topads: null,
        responseData: null,
        data: null,
        start: 0, //현재 페이지
        display: 10, //게시글의 수
        displayPageNum: isMobile() === true ? 5 : 10, // 페이지 번호의 수
        sort: "imd",
        pages: [],
        isFirst: false,
        isEnd: false,
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
        im: { visible: false, check: true, text: "노출수" }, //노출수
        clk: { visible: false, check: true, text: "클릭수" }, //클릭수
        ctr: { visible: false, check: true, text: "클릭율" }, //클릭률
        cpc: { visible: false, check: true, text: "클릭당비용" }, //클릭 당 비용
        cst: { visible: false, check: true, text: "광고비" }, //광고비
        cv: { visible: true, check: false, text: "전환수" }, //전환수
        cvr: { visible: true, check: false, text: "전환율" }, //전환율
        cr: { visible: true, check: false, text: "전환매출" }, //전환매출
        cpa: { visible: true, check: false, text: "전환당비용" }, //전환 당 비용
        roas: { visible: true, check: false, text: "ROAS" }, //ROAS
      },
      activeBtn: {
        im: true, //노출수
        clk: false, //클릭수
        ctr: false, //클릭률
        cpc: false, //클릭 당 비용
        cst: false, //광고비
        cv: false, //전환수
        cvr: false, //전환율
        cr: false, //전환매출
        cpa: false, //전환 당 비용
        roas: false, //ROAS
        kpi: "im",
      },
      activeTopAd: {
        best: {
          kpi: "",
          campaignId: "",
          campaignName: "",
          adGroupId: "",
          adGroupName: "",
          ad: { id: "", headline: "", description: "", pcDisplay: "", pcFinal: "", imageName: "", imageUrl: "", },
        },
        worst: {
          kpi: "",
          campaignId: "",
          campaignName: "",
          adGroupId: "",
          adGroupName: "",
          ad: { id: "", headline: "", description: "", pcDisplay: "", pcFinal: "", imageName: "", imageUrl: "", },
        },
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
        search: {
          header: [
            { key: "ad_headline", name: "제목" },
            { key: "ad_description", name: "설명" },
            { key: "ad_pc_display", name: "표시 URL" },
            { key: "ad_pc_final", name: "연결 URL" },
          ],
        },
        banner: {
          header: [
            { key: "ad_headline", name: "제목" },
            { key: "ad_description", name: "설명" },
            { key: "ad_image_name", name: "이미지" },
            { key: "ad_image_url", name: "이미지 URL" },
          ],
        },
        naver: {
          header: [
            { key: "campaign_name", name: "캠페인" },
            { key: "adgroup_name", name: "그룹" },
            { key: "ad_id", name: "소재" },
          ],
        },
        kakaosa: {
          header: [
            { key: "campaign_name", name: "캠페인" },
            { key: "adgroup_name", name: "그룹" },
            { key: "ad_id", name: "소재" },
          ],
        },
        kakaomo: {
          header: [
            { key: "campaign_name", name: "캠페인" },
            { key: "adgroup_name", name: "그룹" },
            { key: "ad_id", name: "소재" },
          ],
        },
        naverda: {
          header: [
            { key: "campaign_name", name: "캠페인" },
            { key: "adgroup_name", name: "그룹" },
            { key: "ad_id", name: "소재" },
          ],
        },
        google: {
          header: [
            { key: "campaign_name", name: "캠페인" },
            { key: "adgroup_name", name: "그룹" },
            { key: "ad_id", name: "소재" },
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
          // { key: "cvr", index: 6, text: "전환율" },
          { key: "cr", index: 6, text: "전환매출" },
          { key: "cpa", index: 7, text: "CPA" },
          { key: "roas", index: 8, text: "ROAS" },
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
  },
  watch: {},
  components: {
    bigMenu2, logOutModal, balance, expireSessionModal, messageModal, maskModal, dateRangePicker, pdfAdAnalysis, thumbnailModal, mheader,
    mfooter, mbigMenu2, mdateRangePicker, mbalance, mfmenu, malarm, mdashboardEdit, Swiper, SwiperSlide, message, thumbnailSlideModal,
    adExcel, adPdf
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
    handleShowMask() { if (this.$refs.maskModal) this.$refs.maskModal.showModal(); },
    handleHideMask() { if (this.$refs.maskModal) this.$refs.maskModal.hideModal(); },
    handleNoImg(e) { e.target.src = noimg; },
    handleChangedBalance(data) {
      this.balance = [];
      this.balance = data.slice();
    },
    handleChangedDateRange(data) {
      this.$refs.dateRangePicker.setDate({
        start: data.start,
        end: data.end,
        compare: false,
      });
      this.clickSearchBtn();
    },    
    getBidgoal(bidgoal) { return BIDGOAL[bidgoal]; },
    getBidtype(bidtype) { return BIDTYPE[bidtype]; },
    getBudgettype(budgettype) { return BUDGETTYPE[budgettype]; },
    getPgroups(pgroups) {
      let str = pgroups === "" ? "-" : pgroups.split(",");
      let str2 = "";
      if (str.length > 0) {
        str.forEach(function (s) { str2 = str2 + "," + PGGROUPS[s]; });
      }
      return str2.substr(1);
    },
    getUnits(unit) { return UNITS[unit]; },
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
        case "naverda":
          md = "Nda";
          break;
        case "kakaomo":
          md = "K";
          break;
        case "google":
          md = "google";
          break;          
        default:
          md = "N";
      }

      $.ajax({
        type: "get", //요청 메소드 방식
        url: API_URL + "/app/analysis/adreport",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          fromdate: date.start,
          todate: date.end,
          comparefromdate: comparefromdate,
          comparetodate: comparetodate,          
          type: vm.activeMedia.type,
          adgroupid: vm.activeMedia.adgroupid,
          md: md,
          start: 0,
          sort: vm.main.sort,
          display: vm.main.display,
          kpi: vm.activeBtn.kpi,
          session: store.state.userStore.session,
        },
        beforeSend: function (data) {
          vm.handleShowMask();
          // vm.showMaskPannelForTop = true;
        },
        success: function (data) {
          if (data.result === "success") {
            //console.log(data);
            var keys = Object.keys(data.data.topads);
            keys.forEach(function (key) {
              vm.main[key+"10"] = [];
              vm.main[key+"10"] = data.data.topads[key];
            });
            //vm.main.topads = null;
            //vm.main.topads = data.data.topads;
            //vm.getActiveTopAd();
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
        case "naverda":
          md = "Nda";
          break;
        case "kakaomo":
          md = "K";
          break;
        case "google":
          md = "google";
          break;          
        default:
          md = "N";
      }

      $.ajax({
        type: "get", //요청 메소드 방식
        url: API_URL + "/app/analysis/adreport",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          fromdate: date.start,
          todate: date.end,
          comparefromdate: comparefromdate,
          comparetodate: comparetodate,          
          type: vm.activeMedia.type,
          adgroupid: vm.activeMedia.adgroupid,
          md: md,
          start: vm.main.start,
          sort: vm.main.sort,
          display: vm.main.display,
          kpi: "",
          session: store.state.userStore.session,
        },
        beforeSend: function (data) {
          vm.handleShowMask();
          // vm.showMaskPannelForReport = true;
        },
        success: function (data) {
          if (data.result === "success") {
            vm.main.data = [];
            vm.main.responseData = null;
            vm.main.responseData = data;
            vm.main.data = data.data !== undefined ? data.data.ads : "";
            vm.getStartAndEndPageForMain();
            // vm.getActiveTopAd();
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
    getStartAndEndPageForMain() {
      this.main.pages = [];
      var endPage = Math.ceil((this.main.start + 1) / this.main.displayPageNum) * this.main.displayPageNum;
      var startPage = endPage - this.main.displayPageNum + 1;
      var tempEndPage = Math.ceil(this.main.responseData.totalcount / this.main.display);
      if (endPage > tempEndPage) { endPage = tempEndPage; }

      this.main.isFirst = this.main.start + 1 === 1 ? true : false;
      this.main.isEnd = Math.ceil(this.main.responseData.totalcount / this.main.display) === this.main.start + 1 ? true : false;
      for (var i = startPage; i <= endPage; i++) { this.main.pages.push(i); }
    },
    getUuidv4() { return uuidv4(); },
    getUnits(unit) { return UNITS[unit]; },     
    getMedia(media) { return getMedia(media); },
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
    getAdTypeNew(type) { return getAdType(type);},
    getBannerType(type){ return CTYPE[type];},
    getActiveTopAd() {
      var vm = this;
      var kpi = "";
      Object.keys(vm.activeBtn).forEach(function (key) {
        if (vm.activeBtn["" + key] === true) {
          kpi = key;
          return false;
        }
      });

      vm.activeTopAd.best.key = "";
      vm.activeTopAd.best.kpi = "";
      vm.activeTopAd.best.campaignId = "";
      vm.activeTopAd.best.campaignName = "";
      vm.activeTopAd.best.campaignType = "";
      vm.activeTopAd.best.adGroupId = "";
      vm.activeTopAd.best.adGroupName = "";
      vm.activeTopAd.best.adGroupbidgoal = "";
      vm.activeTopAd.best.adGroupbidprice = "";
      vm.activeTopAd.best.adGroupbidtype = "";
      vm.activeTopAd.best.adGroupbudgetamount = "";
      vm.activeTopAd.best.adGroupbudgettype = "";
      vm.activeTopAd.best.ad.id = "";
      vm.activeTopAd.best.ad.headline = "";
      vm.activeTopAd.best.ad.description = "";
      vm.activeTopAd.best.ad.pcDisplay = "";
      vm.activeTopAd.best.ad.pcFinal = "";
      vm.activeTopAd.best.ad.imageName = "";
      vm.activeTopAd.best.ad.imageUrl = "";
      vm.activeTopAd.worst.key = "";      
      vm.activeTopAd.worst.kpi = "";
      vm.activeTopAd.worst.campaignId = "";
      vm.activeTopAd.worst.campaignName = "";
      vm.activeTopAd.worst.campaignType = "";
      vm.activeTopAd.worst.adGroupId = "";
      vm.activeTopAd.worst.adGroupName = "";
      vm.activeTopAd.worst.adGroupbidgoal = "";
      vm.activeTopAd.worst.adGroupbidprice = "";
      vm.activeTopAd.worst.adGroupbidtype = "";
      vm.activeTopAd.worst.adGroupbudgetamount = "";
      vm.activeTopAd.worst.adGroupbudgettype = "";
      vm.activeTopAd.worst.ad.id = "";
      vm.activeTopAd.worst.ad.headline = "";
      vm.activeTopAd.worst.ad.description = "";
      vm.activeTopAd.worst.ad.pcDisplay = "";
      vm.activeTopAd.worst.ad.pcFinal = "";
      vm.activeTopAd.worst.ad.imageName = "";
      vm.activeTopAd.worst.ad.imageUrl = "";

      if (vm.main.topads !== null) {
        var max = _.first(vm.main.topads["" + kpi]["max"]);
        var min = _.first(vm.main.topads["" + kpi]["min"]);
        if (max !== undefined) {
          vm.activeTopAd.best.key = kpi;
          vm.activeTopAd.best.kpi = vm.kpi["" + kpi]["text"];
          vm.activeTopAd.best.obj = max;
          vm.activeTopAd.best.campaignId = max.campaignid;
          vm.activeTopAd.best.campaignName = max.campaign_name;
          vm.activeTopAd.best.campaignType = max.campaigntype;
          vm.activeTopAd.best.adGroupId = max.adgroup_id;
          vm.activeTopAd.best.adGroupName = max.adgroup_name;
          vm.activeTopAd.best.adGroupbidgoal = max.adgroup_bidgoal;
          vm.activeTopAd.best.adGroupbidprice = max.adgroup_bidprice;
          vm.activeTopAd.best.adGroupbidtype = max.adgroup_bidtype;
          vm.activeTopAd.best.adGroupbudgetamount = max.adgroup_budgetamount;
          vm.activeTopAd.best.adGroupbudgettype = max.adgroup_budgettype;
          vm.activeTopAd.best.ad.id = max.ad_id;
          vm.activeTopAd.best.ad.headline = max.ad_headline;
          vm.activeTopAd.best.ad.description = max.ad_description;
          vm.activeTopAd.best.ad.pcDisplay = max.ad_pc_display;
          vm.activeTopAd.best.ad.pcFinal = max.ad_pc_final;
          vm.activeTopAd.best.ad.imageName = !max.ad_image_name ? "" : max.ad_image_name;
          vm.activeTopAd.best.ad.imageUrl = !max.ad_image_url ? "" : max.ad_image_url;

          vm.activeTopAd.worst.key = kpi;
          vm.activeTopAd.worst.kpi = vm.kpi["" + kpi]["text"];
          vm.activeTopAd.worst.obj = min;
          vm.activeTopAd.worst.campaignId = min.campaignid;
          vm.activeTopAd.worst.campaignName = min.campaign_name;
          vm.activeTopAd.worst.campaignType = min.campaigntype;
          vm.activeTopAd.worst.adGroupId = min.adgroup_id;
          vm.activeTopAd.worst.adGroupName = min.adgroup_name;
          vm.activeTopAd.worst.adGroupbidgoal = min.adgroup_bidgoal;
          vm.activeTopAd.worst.adGroupbidprice = min.adgroup_bidprice;
          vm.activeTopAd.worst.adGroupbidtype = min.adgroup_bidtype;
          vm.activeTopAd.worst.adGroupbudgetamount = min.adgroup_budgetamount;
          vm.activeTopAd.worst.adGroupbudgettype = min.adgroup_budgettype;
          vm.activeTopAd.worst.ad.id = min.ad_id;
          vm.activeTopAd.worst.ad.headline = min.ad_headline;
          vm.activeTopAd.worst.ad.description = min.ad_description;
          vm.activeTopAd.worst.ad.pcDisplay = min.ad_pc_display;
          vm.activeTopAd.worst.ad.pcFinal = min.ad_pc_final;
          vm.activeTopAd.worst.ad.imageName = !min.ad_image_name ? "" : min.ad_image_name;
          vm.activeTopAd.worst.ad.imageUrl = !min.ad_image_url ? "" : min.ad_image_url;
          
        }
      }
    },    
    getKpiName(kpi) { return getKpiName(kpi); },         
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
    clickBtn(event, type) {
      var vm = this;
      var keys = Object.keys(vm.activeBtn);
      for (let i = 0; i < keys.length; i++) { vm.activeBtn[keys[i]] = false; }

      vm.activeBtn[type] = true;
      vm.activeBtn.kpi = type;
      vm.getTopKpi();
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
      var type = vm.activeMedia.type;

      vm.handleShowMask();
      vm.$refs.adExcel.clickExcel({fromdate: date.start, todate: date.end, comparefromdate: comparefromdate, comparetodate: comparetodate, type: type,
      md: {naver: "N", kakaosa: "D", naverda: "Nda", kakaomo: "K", google: "google"}[vm.activeMedia.media], sort: vm.main.sort});
    },
    clickRadioDisplay(event, display) {
      var vm = this;
      if (vm.main.display === display) return false;
      vm.main.display = display;
      vm.main.start = 0;
      vm.getReport();
      // vm.clickSearchBtn();
    },
    async clickPdf() {
      var date = this.$refs.dateRangePicker.getDate();
      var diff = moment(date.end).diff(moment(date.start), "days");
      var comparefromdate = moment(date.start).subtract(1 + Number(diff), "days").format("YYYY-MM-DD");
      var comparetodate = moment(date.start).subtract(1, "days").format("YYYY-MM-DD");      

      this.handleShowMask();
      await this.$refs.adPdf.initPDF({date: date, cdate: {start: comparefromdate, end: comparetodate}, media: this.media, type: this.activeMedia.type});
      var blob = await this.$refs.adPdf.generatePDF(); // 렌더링 완료 후 PDF 생성
      window.open(URL.createObjectURL(blob));
      this.pdfKey++;
      this.handleHideMask();
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
      vm.expandedData = [];
      vm.expandedIndex = null;      
      vm.swiperOption.index = i;
      vm.clickBtn(null, top);
      vm.$refs.swiper.swiper.slideTo(i);
    },
    clickThumbnail(data) { this.$refs.thumbnailModal.showModal(data); },
    clickThumbnailSlide(data) { this.$refs.thumbnailSlideModal.showModal(data);},    
    clickUrlBtn(url) { window.open(url, "_blank"); },
    clickMedia(event, type, media) {
      var vm = this;
      var type = "";
      if (event.type !== "change") vm.media = media;
      if (vm.media === "naver" || vm.media === "kakaosa") type = "search";
      if (vm.media === "naverda" || vm.media === "kakaomo" || vm.media === "google") type = "banner";
      var media = vm.media;

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
      this.main.start = 0;
      this.expandedData = [];
      this.expandedIndex = null;      
      this.searchNew();
    },
    clickSearchBtn() {
      this.main.start = 0;
      var date = this.$refs.dateRangePicker.getDate();
      this.start = date.start;
      this.end = date.end;
      this.expandedData = [];
      this.expandedIndex = null;      
      this.searchNew();
    },    
    clickPlusBtn(index, campaignId) {
      var vm = this;
      var diff = moment(vm.end).diff(moment(vm.start), "days");
      var comparefromdate = moment(vm.start).subtract(1 + Number(diff), "days").format("YYYY-MM-DD");
      var comparetodate = moment(vm.start).subtract(1, "days").format("YYYY-MM-DD");     
      var md = {naver: "N", kakaosa: "D", kakaomo: "K", naverda: "Nda", google: "google"}[vm.activeMedia.media];

      var adreportForTop = $.ajax({
        type: "get", //요청 메소드 방식
        url: API_URL + "/app/analysis/campaignadreport",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: { userid: store.state.userStore.userinfo.userid, fromdate: vm.start, todate: vm.end, comparefromdate: comparefromdate, comparetodate: comparetodate,          
          md: md, sort: vm.main.sort, kpi: vm.activeBtn.kpi, campaignid: campaignId, session: store.state.userStore.session,
        },
        beforeSend: function (data) {},
        success: function (data) {},
        error: function (a, b, c) {},
        complete: function (a, b, c) {},
      });

      $.when(adreportForTop).done(function (adreportForTop) {
        //console.log(adreportForTop);
        vm.expandedData = [];
        vm.expandedData = adreportForTop.data.topads[vm.activeBtn.kpi].slice();
        vm.expandedIndex = vm.expandedIndex === index ? null : index;
      });
    },
    clickPlusBtn2(index, adgroupId) {
      var vm = this;
      var diff = moment(vm.end).diff(moment(vm.start), "days");
      var comparefromdate = moment(vm.start).subtract(1 + Number(diff), "days").format("YYYY-MM-DD");
      var comparetodate = moment(vm.start).subtract(1, "days").format("YYYY-MM-DD");     
      var md = {naver: "N", kakaosa: "D", kakaomo: "K", naverda: "Nda", google: "google"}[vm.activeMedia.media];

      var adreportForTop = $.ajax({
        type: "get", //요청 메소드 방식
        url: API_URL + "/app/analysis/adgroupadreport",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: { userid: store.state.userStore.userinfo.userid, fromdate: vm.start, todate: vm.end, comparefromdate: comparefromdate, comparetodate: comparetodate,          
          md: md, sort: vm.main.sort, kpi: vm.activeBtn.kpi, adgroupid: adgroupId, session: store.state.userStore.session,
        },
        beforeSend: function (data) {},
        success: function (data) {},
        error: function (a, b, c) {},
        complete: function (a, b, c) {},
      });

      $.when(adreportForTop).done(function (adreportForTop) {
        //console.log(adreportForTop);
        vm.expandedData = [];
        vm.expandedData = adreportForTop.data.topads[vm.activeBtn.kpi].slice();
        vm.expandedIndex = vm.expandedIndex === index ? null : index;
      });
    },    
    slideChangeTransitionStart() {
      let vm = this;

      vm.$nextTick(function () {
        let el = document.querySelector(".swiper-slide-active > div");
        if (el) {
          //console.log(Number(el.getAttribute("data-index")));
          vm.swiperOption.index = Number(el.getAttribute("data-index"));
          vm.clickBtn(null, vm.swiperOption.menu[vm.swiperOption.index].key);
        }
      });
    },    
    goToUrl(url) { window.open(url, '_blank');},
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
        case "naverda":
          md = "Nda";
          break;
        case "kakaomo":
          md = "K";
          break;
        case "google":
          md = "google";
          break;          
        default:
          md = "N";
      }

      var adreportForTop = $.ajax({
        type: "get", //요청 메소드 방식
        url: API_URL + "/app/analysis/adreport",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          fromdate: date.start,
          todate: date.end,
          comparefromdate: comparefromdate,
          comparetodate: comparetodate,          
          type: vm.activeMedia.type,
          adgroupid: vm.activeMedia.adgroupid,
          md: md,
          start: 0,
          sort: vm.main.sort,
          display: vm.main.display,
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
      var adreportForKeyword = $.ajax({
        type: "get", //요청 메소드 방식
        url: API_URL + "/app/analysis/adreport",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          fromdate: date.start,
          todate: date.end,
          comparefromdate: comparefromdate,
          comparetodate: comparetodate,            
          type: vm.activeMedia.type,
          adgroupid: vm.activeMedia.adgroupid,
          md: md,
          start: vm.main.start,
          sort: vm.main.sort,
          display: vm.main.display,
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
      $.when(adreportForTop, adreportForKeyword)
        .done(function (adreportForTop, adreportForKeyword) {
          if (adreportForTop && adreportForTop[1] === "success") {
            var data = adreportForTop[0].data;
            var keys = Object.keys(data.topads);
            keys.forEach(function (key) {
              vm.main[key+"10"] = [];
              vm.main[key+"10"] = data.topads[key];
            });
          }

          if (adreportForKeyword && adreportForKeyword[1] === "success") {
            var data = adreportForKeyword[0];
            vm.main.data = [];
            vm.main.responseData = null;
            vm.main.responseData = data;
            vm.main.data = data.data !== undefined ? data.data.ads : "";
            vm.getStartAndEndPageForMain();
          }
        })
        .then(function () { vm.handleHideMask(); });
    },    
    changeSort() {
      this.main.start = 0;
      var date = this.$refs.dateRangePicker.getDate();
      this.start = date.start;
      this.end = date.end;
      this.getReport();

      // this.clickSearchBtn();
    },    
    priceToString(salse) {
      if (salse === undefined) return "";
      return priceToString(salse);
    },    
  },
};
</script>

<style scoped></style>
