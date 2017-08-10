<template>
  <div class="music_txt">
    <h3><< 流言飞语 >></h3>
    <h4>&nbsp&nbsp&nbsp&nbsp&nbspJust to stay your wish  </h4>
    <div class="barrage_box" ref="barrageBox" >
      <transition-group name="fade-in" tag="ul" >
        <li v-for="(item,index) in barrageList" :key="index">{{ item }}</li>
      </transition-group>
    </div>
    <input type="text" class="barrage_txt" ref="barrageTxt" @keyup.enter="toScreen">
    <button class="barrage_btn" @click="toScreen" >ENTER</button>
  </div>

</template>
<script type="text-ecamscript-6">
  export default{
    data(){
      return{
        val:'',
        barrageList:[
          '爱能让你骄傲如烈日，也能让我卑微入尘土',
          '这些句子，记录着我的哀伤 在那些难过的日子里，与我为伴',
          '怀念那些不能被重拾的美好时光',
          '一场繁华一场梦',
          '一场欢喜一场空'
        ]
      }
    },
    methods:{
      toScreen(){
        this.val = this.$refs.barrageTxt.value
        this.barrageList.push(this.val)
        this.$refs.barrageTxt.value=''
      }
    }
  }
</script>
<style>
  .music_txt{
    width: 100%;
    text-align: center;
    line-height: 30px;
  }
  .music_txt h3{
    font-size: 22px;
    color: rgba(255,229,230,1);
  }

  .barrage_box{
    width: 100%;
    height: 180px;
    position: relative;
    text-align: left;
  }
  .barrage_box:before{
    width: 0%;
    height: 0px;
    border: 1px solid #aaa;
    border-bottom: none;
    position: absolute;
    left: 0%;
    top: 0;
    content: "";
    opacity: 0;
  }
  .barrage_box:hover:before{
    animation: nav 0.5s cubic-bezier(0,1,1,1) 0s 1 both;
    -webkit-animation: nav 0.5s cubic-bezier(0,1,1,1) 0s 1 both;
  }
  .barrage_box:after{
    width: 0%;
    height: 0px;
    border: 1px solid #aaa;
    border-top: none;
    position: absolute;
    right: 0%;
    bottom: 0%;
    content: "";
    opacity: 0;
  }
  .barrage_box:hover:after{
    animation: nav 0.5s cubic-bezier(0,1,1,1) 0s 1 both;
    -webkit-animation: nav 0.5s cubic-bezier(0,1,1,1) 0s 1 both;
  }
  @-webkit-keyframes nav{
    0%{width:0%;height:0;}
    1%{width:0%;height:0;opacity:1;}
    50%{width:100%;height:0;opacity:1;}
    100%{width:100%;height:30px;opacity:1;}
  }
  @keyframes nav{
    0%{width:0%;height:0;}
    1%{width:0%;height:0;opacity:1;}
    50%{width:100%;height:0;opacity:1;}
    100%{width:100%;height:30px;opacity:1;}
  }
  .barrage_box li{
    color: rgba(255,229,230,.6);
    font-weight:bold;
    display: inline-block;
    padding: 0 10px;
    color: darkslategrey;
    text-indent: 3px;
  }
  .music_txt .barrage_txt{
    position: absolute;
    right: 10px;
    bottom: 34px;
    width: 80%;
    height: 20px;
    border:none;
    background:rgba(255,255,255,.3);
    color: #2bc4e2;
    border-radius: 10px;
  }
  .barrage_btn{
    position: absolute;
    right: 10px;
    bottom: 34px;
    width: 50px;
    height: 28px;
    border-radius: 20px;
    color: #fff;
    z-index: 999;
  }

</style>
