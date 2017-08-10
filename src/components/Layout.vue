<template>
  <div>
    <nav-header @listenToChildEvent="showMsgFromChild" :toShop="toShop"></nav-header>
    <div id="menu" v-show="!toShop">
      <canvas id="canvas" class="canvas"></canvas>
      <transition name="fade-out">
        <div v-show="!toMus">
          <div class="nav">

              <a class="gv" href="javascript:;" @click="MusicLog()">Music</a>


              <a class="gv" href="avascript:;" @click="toShopping">Mall</a>

              <a class="gv" href="/myself" >About me</a>

          </div>
        </div>
      </transition>
      <transition name="fade-in">
        <div v-show="toMus">
          <music-mall :toMus="toMus"></music-mall>
          <div>
            <button class="btn-back" @click="back()"></button>
          </div>
        </div>
      </transition>
      <div class="city"></div>
      <div class="moon"></div>
    </div>
    <shopping-mall v-show="toShop"></shopping-mall>
  </div>
</template>
<script type="text-ecamscript-6">
  import '@/assets/css/login.css'
  import '@/assets/css/base.css'
  import NavHeader from './Header'
  import Stars from '../../static/js/Star'
  import Moon from '../../static/js/Moon'
  import Meteor   from '../../static/js/Meteor'
  import MusicMall from '@/components/MusicMall'
  import ShoppingMall from '@/components/ShoppingMall'
  export default{
    components:{
      NavHeader,
      MusicMall,
      ShoppingMall
    },
    data(){
      return {
        toMus: false,
        toShop: false
      }
    },
    mounted() {
      window.onload = window.onresize =function(){
        var canvas = document.getElementById('canvas'),
          ctx = canvas.getContext('2d'),
          width = window.innerWidth,
          height = window.innerHeight,
          //实例化月亮和星星。流星是随机时间生成，所以只初始化数组
          moon = new Moon(ctx, width, height),
          stars = new Stars(ctx, width, height, 200),
          meteors = [],
          count = 0
          canvas.width = width;
          canvas.height = height;

        const meteorGenerator = ()=> {
          //x位置偏移，以免经过月亮
          let x = Math.random() * width + 800
          meteors.push(new Meteor(ctx, x, height))

          //每隔随机时间，生成新流星
          setTimeout(()=> {
              meteorGenerator()

          }, Math.random() * 2000)
      }
      const frame = ()=>{
          count++
          count % 10 == 0 && stars.blink()
          moon.draw()
          stars.draw()

          meteors.forEach((meteor, index, arr)=> {
              //如果流星离开视野之内，销毁流星实例，回收内存
              if (meteor.flow()) {
                  meteor.draw()
              } else {
                  arr.splice(index, 1)
              }
          })
          requestAnimationFrame(frame)
        }
        meteorGenerator()
        frame()
      }



    },
    methods: {
      toShopping(){
        this.toShop= true
      },
      MusicLog() {
        this.toMus = !this.toMus
      },
      back(){
        this.toMus = !this.toMus
      },
      showMsgFromChild(data){
        console.log('来自子组件的数据data：'+data)
      }
    }
  }
</script>

<style>
  .shop-wrap{
    position: absolute;
    top: 80px;
    left: 0;
    width: 100%;
  }
  #menu {
    width: 100%;
    height: 100%;
    /*overflow: hidden;*/
    position: absolute;
  }

  .canvas {
    position: fixed;
    z-index: -1;
  }
  .city {
    width: 100%;
    height: 170px;
    position: fixed;
    bottom: 0px;
    background: url('../assets/images/city.png') no-repeat;
    background-size: cover;
  }
  .moon {
    width: 100px;
    height: 100px;
    position: absolute;
    left: 100px;
    top: 100px;
    background: url('../assets/images/moon.png') no-repeat;
    background-size: cover;
  }



  .nav {
    width: 200px;
    height: auto;
    position: absolute;
    top: 250px;
    left: 50%;
    margin-left: -100px;
  }
  .gv {
    text-decoration: none;
    background: url('../assets/images/nav_gv.png') repeat 0px 0px;
    width: 130px;
    height: 43px;
    display: block;
    text-align: center;
    line-height: 43px;
    cursor: pointer;
    float: left;
    margin: 10px 2px 10px 2px;
    font: 18px/43px 'microsoft yahei';
    color: #066197;
  }
  a.gv:hover {
    background: url('../assets/images/nav_gv.png') repeat 0px -43px;
    color:#1d7eb8;
    -webkit-box-shadow: 0 0 6px #1d7eb8;
    transition-duration: 0.5s;
  }
  .fade-out-enter-active, .fade-out-leave-active {
    transition: all .5s
  }
  .fade-out-enter, .fade-out-leave-active {
    opacity: 0;
    transform: translateX(-400px);
  }

  .fade-in-enter-active, .fade-in-leave-active {
    transition: all .5s
  }
  .fade-in-enter, .fade-in-leave-active {
    opacity: 0;
    transform: translateX(400px);
  }
  .btn-back{
    width: 32px;
    height: 32px;
    position: absolute;
    left: 200px;
    top: 350px;
    border: none;
    opacity: .8;
    background: url("../assets/images/back.png") no-repeat;
  }


</style>
