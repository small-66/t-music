<template>
  <div class="shop-wrap">
    <nav-bread>
      <span slot="bread">Goods</span>
    </nav-bread>
    <router-link class="btn btn--m" to="/cart" style="float: right;margin-top: 2px">购物车</router-link>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">Sort by:</span>
          <!--<a href="javascript:void(0)" class="default cur">Default</a>-->
          <a href="javascript:;" class="price" @click="sortGoods" >
            Price
            <span v-show="!sortFlag">↓</span>
            <span v-show="sortFlag">↑</span>
          </a>
          <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div class="filter stopPop" id="filter" :class="{ 'filterby-show':filterBy}">
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd><a href="javascript:void(0)" :class="{ 'cur':priceChecked=='all' }"
                     @click="priceChecked='all'">All</a></dd>
              <dd v-for="(price,index) in priceFilter" @click="setPriceFilter(index) ">
                <a href="javascript:void(0)" :class="{ 'cur':priceChecked==index }">{{ price.startPrice }} ~ {{ price.endPrice }}</a>
              </dd>
            </dl>
          </div>

          <!-- search result accessories list -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <li v-for="(item,index) in goodsList">
                  <div class="pic">
                    <a href="#"><img v-lazy="'/static/img/'+ item.productImage" alt=""></a>
                  </div>
                  <div class="main">
                    <div class="name">{{ item.productName  }}</div>
                    <div class="price">￥{{ item.salePrice  }}</div>
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn--m"
                        @click="addCart(item.productId)"
                      >加入购物车</a>
                    </div>
                  </div>
                </li>

              </ul>
              <div class="loadMore" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="30">
                <img src="../assets/loading-bars.svg" alt="" v-show="loading">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="md-overlay " v-show="overLayFlag" @click="closePop"></div>

    <modal :mdShow="mdShow" @close="closeModal">
      <p slot="message">
        请先登录，否则无法加入购物车
      </p>
      <div slot="btnGroup">
        <a href="javascript:;" class="btn btn--m" @click="mdShow=false">关闭</a>
      </div>
    </modal>
    <modal :mdShow="mdShowCart" @close="closeModal">
      <p slot="message">
        加入购物车成功！
      </p>
      <div slot="btnGroup">
        <a href="javascript:;" class="btn btn--m" @click="mdShowCart=false">继续购物</a>
        <router-link  class="btn btn--m" to="/cart">查看购物车</router-link>
      </div>
    </modal>
    <nav-footer></nav-footer>
  </div>
</template>
<script type="text-ecamscript-6">
  import '@/assets/css/product.css'
  import NavFooter from './Footer'
  import NavBread from './NavBread'
  import Modal from './../components/Modal'
  import axios from 'axios'
  export default{
      data(){
        return {
          goodsList:[],
          sortFlag: true,
          page: 1,
          pageSize: 7,
          priceFilter:[
            {
              startPrice:'0.00',
              endPrice:'100.00'
            },
             {
              startPrice:'100.00',
              endPrice:'500.00'
            },
             {
              startPrice:'500.00',
              endPrice:'1000.00'
            },
             {
              startPrice:'1000.00',
              endPrice:'10000.00'
            }
          ],
          priceChecked: 'all',
          filterBy: false,
          overLayFlag: false,
          busy: true,
          loading: false,
          mdShow: false,
          mdShowCart: false
        }
      },
      components:{
        NavFooter,
        NavBread,
        Modal
      },
      mounted(){
        this.getGoodsList(true)
      },
      methods:{
        getGoodsList(flag){
          var param ={
            page: this.page,
            pageSize: this.pageSize,
            sort: this.sortFlag?1:-1,
            priceLev: this.priceChecked
          }
          this.loading= true
          axios.get('/goods/list',{
            params: param
          }).then((response)=>{
            let res = response.data
            this.loading= false
            if(res.status==0){
              if(flag){
               this.goodsList = this.goodsList.concat( res.result.list)
               if(res.result.count==0){
                  this.busy = true
               }else{
                  this.busy = false
               }
              }else{
                this.goodsList = res.result.list
              }
            }else{
              this.goodsList = []
              this.busy = false
            }
          })
        },
        showFilterPop(){
            this.filterBy= true
            this.overLayFlag= true
        },
        setPriceFilter(index){
          this.priceChecked= index
          this.closePop()
          this.page = 1
          this.getGoodsList()
        },
        closePop(){
            this.filterBy= false
            this.overLayFlag= false
        },
        sortGoods(){
          this.sortFlag=!this.sortFlag
          this.page = 1
          this.getGoodsList()
        },
        loadMore(){
          this.busy = true
          setTimeout(() => {
            this.page++
            this.getGoodsList(true)
          }, 500)
        },
        addCart(productId){
          axios.post('/goods/addCart',{
            productId:productId
          }).then((response)=>{
            let res = response.data
            if(res.status==0){
              this.mdShowCart = true
            }else{
               this.mdShow = true
            }
          })
        },
        closeModal(){
          this.mdShow = false
        }
      }
  }
</script>

