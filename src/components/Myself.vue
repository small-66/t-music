<template>
  <div id="home">
    <nav-header></nav-header>
    <canvas id="canvas" class="canvas"></canvas>
    <div id="my-box">
      <div class="my-wrap">
        <h2 class="animated bounceInUp">前端的自我修养</h2>
        <div class="animated  zoomIn">
          <h3 >The courage to start, to find the road to success</h3>
          <h3>刘洋</h3>
          <h3>坐标：北京</h3>
          <h3>前端攻城狮一枚（两年），目前离职状态</h3>
          <h3>熟练掌握HTML、CSS、JS、jQuery、Ajax，熟悉H5、CSS3<br>熟悉主流框架VueJS，了解后端接口及Oracle、MongoDB</h3>
          <a href="javascript:;" class="about" @click="isAbout=true">联系我</a>
        </div>
        <transition name="fade-in">
          <div v-show="isAbout" class="boxs">
            <p><span>Tel :</span>15267144234</p>
            <p><span>Email :</span>papa909@163.com</p>
            <p><span>QQ :</span>1420440046</p>
          </div>
        </transition>
      </div>
    </div>

  </div>
</template>

<script>
  import NavHeader from './Header'
  import '@/assets/css/animate.css'
  import '@/assets/css/base.css'
  export default {
    data() {
      return {
        isAbout: false
      }
    },
    components: {
      NavHeader
    },
    methods:{
    },
    mounted() {
      var canvas = document.querySelector('canvas'),
        mybox= document.getElementById('my-box'),
        ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      mybox.style.width =window.innerWidth +'px';
      mybox.style.height = window.innerHeight +'px';
      ctx.lineWidth = .3;
      ctx.strokeStyle = (new Color(150)).style;

      var mousePosition = {
        x:  canvas.width - 100,
        y:  canvas.height - 60
      };

      var dots = {
        nb: 250,
        distance: 100,
        d_radius: 150,
        array: []
      };

      function colorValue(min) {
        return Math.floor(Math.random() * 255 + min);
      }

      function createColorStyle(r,g,b) {
        return 'rgba(' + r + ',' + g + ',' + b + ', 0.8)';
      }

      function mixComponents(comp1, weight1, comp2, weight2) {
        return (comp1 * weight1 + comp2 * weight2) / (weight1 + weight2);
      }

      function averageColorStyles(dot1, dot2) {
        var color1 = dot1.color,
          color2 = dot2.color;

        var r = mixComponents(color1.r, dot1.radius, color2.r,
          dot2.radius),
          g = mixComponents(color1.g, dot1.radius, color2.g, dot2.radius),
          b = mixComponents(color1.b, dot1.radius, color2.b, dot2.radius);
        return createColorStyle(Math.floor(r), Math.floor(g), Math.floor
        (b));
      }

      function Color(min) {
        min = min || 0;
        this.r = colorValue(min);
        this.g = colorValue(min);
        this.b = colorValue(min);
        this.style = createColorStyle(this.r, this.g, this.b);
      }

      function Dot(){
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;

        this.vx = -.5 + Math.random();
        this.vy = -.5 + Math.random();

        this.radius = Math.random() * 2;

        this.color = new Color();
      }

      Dot.prototype = {
        draw: function(){
          ctx.beginPath();
          ctx.fillStyle = this.color.style;
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2,
            false);
          ctx.fill();
        }
      };

      function createDots(){
        for(var i = 0; i < dots.nb; i++){
          dots.array.push(new Dot());
        }
      }

      function moveDots() {
        for(var i = 0; i < dots.nb; i++){

          var dot = dots.array[i];

          if(dot.y < 0 || dot.y > canvas.height){
            dot.vx = dot.vx;
            dot.vy = - dot.vy;
          }
          else if(dot.x < 0 || dot.x > canvas.width){
            dot.vx = - dot.vx;
            dot.vy = dot.vy;
          }
          dot.x += dot.vx;
          dot.y += dot.vy;
        }
      }

      function connectDots() {
        for(var i = 0; i < dots.nb; i++){
          for(var j = 0; j < dots.nb; j++){
            var i_dot = dots.array[i];
            var j_dot = dots.array[j];

            if((i_dot.x - j_dot.x) < dots.distance && (i_dot.y
              - j_dot.y) < dots.distance && (i_dot.x - j_dot.x) > - dots.distance && (i_dot.y - j_dot.y)
              > - dots.distance){
              if((i_dot.x - mousePosition.x) <
                dots.d_radius && (i_dot.y - mousePosition.y) < dots.d_radius && (i_dot.x - mousePosition.x)
                > - dots.d_radius && (i_dot.y - mousePosition.y) > - dots.d_radius){
                ctx.beginPath();
                ctx.strokeStyle =
                  averageColorStyles(i_dot, j_dot);
                ctx.moveTo(i_dot.x, i_dot.y);
                ctx.lineTo(j_dot.x, j_dot.y);
                ctx.stroke();
                ctx.closePath();
              }
            }
          }
        }
      }

      function drawDots() {
        for(var i = 0; i < dots.nb; i++){
          var dot = dots.array[i];
          dot.draw();
        }
      }

      function animateDots() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        moveDots();
        connectDots();
        drawDots();

        requestAnimationFrame(animateDots);
      }

      //----------------------跟着鼠标动--------------------
      document.getElementById('home').addEventListener('mousemove', function(e){
        mousePosition.x = e.pageX;
        mousePosition.y = e.pageY;
      });

      document.getElementById('home').addEventListener('mouseleave', function(e){
        mousePosition.x = canvas.width / 2;
        mousePosition.y = canvas.height / 2;
      });
      //----------------------跟着鼠标动--------------------

      createDots();
      requestAnimationFrame(animateDots);
    }
  }
</script>

<style scoped>
  #home{
    position: relative;
    width: 100%;
    height: 100%;
    color: #fff;
     box-sizing: border-box;
    overflow-x: hidden;
    background: rgba(7,17,27,0.95);
  }
  .canvas {
    position: fixed;
  }
  .my-wrap {
    position: absolute;
    width: 100%;
    height:100%;
    text-align: center;
    overflow: hidden;
  }
  .my-wrap h2{
    font-family: cursive, 微软雅黑, "arial, helvetica, sans-serif";
    font-size: 40px;
    text-shadow: rgb(169, 169, 169) 4px 4px 10px;
    color: rgb(255, 102, 51);
    transform: translateY(0px);
    margin: 100px auto 30px;
    width: 400px;
  }
  .my-wrap h2:after{
    position: absolute;
    width: 400px;
    margin: auto;
    left: 0;
    bottom: -10px;
    content: '';
    border-top: 1px solid rgba(255,255,255,.5);
  }

  .my-wrap h3{
    color:#eef3f0;
    font-size: 18px;
    margin: 20px auto;
  }
  .about {
    text-decoration: none;
    background: url('../assets/images/nav_gv.png') repeat 0px 0px;
    width: 130px;
    height: 43px;
    display: block;
    text-align: center;
    line-height: 43px;
    cursor: pointer;
    margin: 10px auto;
    font: 18px/43px 'microsoft yahei';
    color: #066197;
  }
  a.about:hover {
    background: url('../assets/images/nav_gv.png') repeat 0px -43px;
    color:#1d7eb8;
    -webkit-box-shadow: 0 0 6px #1d7eb8;
    transition-duration: 0.5s;
  }
  .boxs{
    width: 500px;
    height: 200px;
    margin: 40px auto;
    text-align: left;
  }
  .boxs p{
    margin-top: 18px;
    color: #2bc4e2;
  }
  .boxs span{
    display: inline-block;
    font-weight: bold;
    color: #FBEFE7;
    width: 60px;
    margin-left: 30%;
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
</style>
