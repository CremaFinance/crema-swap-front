<template>
  <div>
    <div v-if="isShow =='small'" class="h5-container">
      <div class="echarts-chart">
        <div class="chart-all">
          <div class="chart-title">
            <div class="chart-title-left">
              <p><img src="@/assets/images/icon-Total-Value-Locked.png" alt="" />Total Value Locked</p>
              <p>$&nbsp;<span>{{ TotalValue ? TotalValue : wdAll.TotalValue }}</span></p>
            </div>
            <div class="chart-title-right">
              <div>
                <div class="title-day" :class="echartsVal =='D' ?'title-active' :''" @click="changeEcharts('D')">D</div>
                <div class="title-week" :class="echartsVal =='W' ?'title-active' :''" @click="changeEcharts('W')">W</div>
                <div class="title-mouth" :class="echartsVal =='M' ?'title-active' :''" @click="changeEcharts('M')">M</div>
              </div>
              <!-- <p>02 JUN , 2021</p> -->
              <p v-if="tvlTime.day">{{ tvlTime.day }} {{ tvlTime.month }} , {{ tvlTime.year }}</p>
            </div>
          </div>
          <div id="mains" class="chart-test"></div>
        </div>
      </div>
      <div class="echarts-chart chart-pillar">
        <div class="chart-all">
          <div class="chart-title">
            <div class="chart-title-left">
              <p><img src="@/assets/images/icon-Trading-Volume.png" alt="" />Trading Volume</p>
              <p>$&nbsp;<span>{{TradingVolume ? TradingVolume : wdAll.TradingVolume }}</span></p>
            </div>
            <div class="chart-title-right">
              <div>
                <div class="title-day" :class="echartVal =='D' ?'title-active' :''" @click="changeEchart('D')">D</div>
                <div class="title-week" :class="echartVal =='W' ?'title-active' :''" @click="changeEchart('W')">W</div>
                <div class="title-mouth" :class="echartVal =='M' ?'title-active' :''" @click="changeEchart('M')">M</div>
              </div>
              <!-- <p>02 JUN , 2021</p> -->
              <p v-if="volTime.day">{{ volTime.day }} {{ volTime.month }} , {{ volTime.year }}</p>
              <p v-else>Past 24H</p>
            </div>
          </div>
          <div id="pillars" class="chart-test"></div>
        </div>
      </div>
      <div class="echarts-detail">
        <div>
          <p>Cumulative Volume</p>
          <p><a>$</a>&nbsp;<span>{{ wdAll.Vol }}</span></p>
          <img src="@/assets/images/h5-vol.png" alt="">
        </div>
        <div>
          <p>Cumulative Transactions</p>
          <p><span>{{ wdAll.Tra }}</span></p>
          <img src="@/assets/images/h5-tra.png" alt="">
        </div>
        <div>
          <p>Total Tokens</p>
          <p><span>{{ wdAll.Token }}</span></p>
          <img src="@/assets/images/h5-token.png" alt="">
        </div>
        <!-- <div>
          <p>Total Users</p>
          <p><span>{{ wdAll.Users }}</span></p>
          <img src="@/assets/images/h5-user.png" alt="">
        </div> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from'nuxt-property-decorator'
import * as echarts from'echarts'

export default Vue.extend({
  props: {
    isShow: {
      type: String,
      default:'All'
    },
    wdAll: {
      type: Object,
      default:() =>{}
    }
  },
  data() {
    return {
      list:'',
      pillar:'',
      echartsVal:'D',
      echartVal:'D',
      Vol:'',
      Tra:'',
      Token:'',
      Users:'',
      TotalValue:'',
      TradingVolume:'',
      tvlTime:{
        day:'',
        month:'',
        year:''
      },
      volTime:{
        day:'',
        month:'',
        year:''
      },
      time:1
    }
  },
  mounted() {
    // this.getData();
    this.getTvl('day','tvl',100,100,10)
    // ------------------------------------------------------------------------------->
    this.getPhan(100,100,1,'vol','day')
  },
  methods: {
    getPhan(val,num,width,title,date){
      this.$axios.get(`https://dev-api-crema.bitank.com/v1/histogram?date_type=${date}&typ=${title}&limit=${val}`).then((res) =>{
        let list = res.data.list
        const result: any = {
          categoryData:[],
          valueData:[],
          wheelBase:[]
        }
        if(list){
          list.forEach((item) =>{
            result.categoryData.push((item.date).slice(0,10))
            // result.wheelBase.push((item.date).slice(5,7)+'/'+(item.date).slice(8,10))
            // result.categoryData.push(item.date)
            result.valueData.push(item.num)
          })
        }
        this.pillar = result
        this.initialize(num, width)
      })
    },
    getTvl(date,title,val,view,con){
      this.$axios.get(`https://dev-api-crema.bitank.com/v1/histogram?date_type=${date}&typ=${title}&limit=${val}`).then((res) =>{
        let list = res.data.list
        const result: any = {
          categoryData:[],
          valueData:[]
        }
        if(list){
          list.forEach((item) =>{
            result.categoryData.push((item.date).slice(0,10))
            // result.wheelBase.push((item.date).slice(5,7)+'/'+(item.date).slice(8,10))
            // result.categoryData.push(item.date)
            result.valueData.push(item.num)
          })
        }
        
        this.list = result
        this.optionTVL(view,con)
      })
    },
    getNum(value) {
      if (!value) return 0;
      const newValue = ["", "", ""];
      let fr = 1000;
      let num  = 3;
      let txt = "";
      let fm = 1;
      while (value / fr >= 1) {
        fr *= 10;
        num += 1;
      }
      if (num <= 3) {
        newValue[0] = parseInt(value) + "";
        newValue[1] = "";
      } else if (num <= 9) {
        txt = parseInt(String(num - 4)) / 3 >= 1 ? "M" : "K";
        fm = txt === "K" ? 1000 : 1000000;
        if (value % fm === 0) {
          newValue[0] = parseInt(String(value / fm)) + "";
        } else {
          newValue[0] = this.retain(parseFloat(String(value / fm)), 2);
        }
        newValue[1] = txt;
      } else if (num <= 16) {
        txt = (num - 9) / 3 > 1 ? "T" : "B";
        fm = 1;
        if (txt === "B") {
          fm = 1000000000;
        } else if (txt === "T") {
          fm = 1000000000000;
        }
        if (value % fm === 0) {
          newValue[0] = parseInt(String(value / fm)) + "";
        } else {
          newValue[0] = this.retain(parseFloat(String(value / fm)), 2);
        }
        newValue[1] = txt;
      }
      if (value < 1000) {
        newValue[0] = value + "";
        newValue[1] = "";
      }
      return newValue.join("");
    },
    retain(num, decimal) {
      num = num.toString();
      let index = num.indexOf(".");
      if (index !== -1) {
        num = num.substring(0, decimal + index + 1);
      } else {
        num = num.substring(0);
      }
      return parseFloat(num).toFixed(decimal);
    },
    optionTVL(val,con) {
      const chartDom: any = document.getElementById('mains')
      const myChart = echarts.init(chartDom)
      let option: any = {
        tooltip: {
          trigger:'axis',
          formatter:(params) =>{
             let months = params[0].axisValue.slice(5,7);
            let value = months == 1 ? 'Jan' : months == 2 ? 'Feb' :months == 3 ? 'Mar' : 
                        months == 4 ? 'Apr' :months == 5 ? 'May' : months == 6 ? 'Jun' : 
                        months == 7 ? 'Jul' : months == 8 ? 'Aug' : months == 9 ? 'Sep' : 
                        months == 10 ? 'Oct' : months == 11 ? 'Nov' :'Dec'
            this.tvlTime = {
              day:params[0].axisValue.slice(8,10),
              month:value,
              year:params[0].axisValue.slice(0,4),
            }
            this.TotalValue = this.thousands(Math.round(params[0].value * 100) / 100)
          }
        },
        grid: {
          bottom: 40,
          left: 20,
          right: 20
        },
        toolbox: {},
        xAxis: {
          type:'category',
          // type:'time',
          data: this.list.categoryData,
          boundaryGap: true,
          splitNumber:con,
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitArea: {
            show: false
          },
          axisLine:{
            show: false
          },
          axisLabel: {
            margin: 20,
            padding: [0, 0, 0, 20]    // 四个数字分别为上右下左与原位置距离
            // formatter:(value,index)=>{
            //   // console.log(value,index)
            //   let data = new Date(value)
            //   let hours = data.getHours()
            //   return hours
            // }
          }
        },
        yAxis: {
          show: false,
          splitLine: { show: false }
        },
        dataZoom: [
          {
            type:'inside',
            start: 0,
            end: val,
            zoomLock:true,
          }
        ],
        series: [
          {
            name:'Fake Data',
            type:'line',
            smooth: true,
            symbol:'none',
            areaStyle: {},
            barGap:'1%',
            large: true,
            // data: this.list,
            data: this.list.valueData,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color:'#D3ABFF' },
                // { offset: 0.5, color:'#188df0' },
                { offset: 1, color:'#00FFFE' }
              ])
            },
            emphasis: {
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color:'#D3ABFF' },
                  // { offset: 0.5, color:'#188df0' },
                  { offset: 1, color:'#000' }
                ])
              }
            },
            barWidth: 100 //柱图宽度
          }
        ]
      }
      //  对实例对象进行设置配置
      option && myChart.setOption(option)
      myChart.on('globalout',(params) => {
          // console.log(params);
          this.tvlTime = {}
          this.TotalValue = ''
      });
    },
    initialize(val, wid) {
      const chartpillar: any = document.getElementById('pillars')
      const myPillar = echarts.init(chartpillar)
      let optionPillar: any = {
        tooltip: {
          trigger:'axis',
          formatter:(params) =>{
            // console.log(params[0].value)
            // this.volTime = {
            //   day:1,
            //   month:2,
            //   year:3
            // }
            // this.TradingVolume = params[0].value[1]
            // console.log(params[0].axisValue);
            let months = params[0].axisValue.slice(5,7);
            let value = months == 1 ? 'Jan' : months == 2 ? 'Feb' :months == 3 ? 'Mar' : 
                        months == 4 ? 'Apr' :months == 5 ? 'May' : months == 6 ? 'Jun' : 
                        months == 7 ? 'Jul' : months == 8 ? 'Aug' : months == 9 ? 'Sep' : 
                        months == 10 ? 'Oct' : months == 11 ? 'Nov' :'Dec'
            this.volTime = {
              day:params[0].axisValue.slice(8,10),
              month:value,
              year:params[0].axisValue.slice(0,4),
            }
            this.TradingVolume = this.thousands(Math.round(params[0].value * 100) / 100)
            // return params[0].value;
          }
        },
        grid: {
          bottom: 40,
          left: 20,
          right: 20
        },
        xAxis: {
          type:'category',
          // type:'time',
          data: this.pillar.categoryData,
          boundaryGap: true,
          interval:1,
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          splitLine: {
            show: false
          },
          splitArea: {
            show: false
          },
          axisLabel: {
            margin: 20,
            padding: [0, 0, 0, 20]    // 四个数字分别为上右下左与原位置距离
          }
        },
        yAxis: {
          // data: this.pillar.valueData,
          // type:'value',
          show: false,
          splitArea: { show: false }
        },
        // title: {
        //   left: 20,
        //   top: 15
        // },
        dataZoom: [
          {
            type:'inside',
            start: 0,
            end: val,
            zoomLock:true,
          }
        ],
        series: [
          {
            data: this.pillar.valueData,
            type:'bar',
            barGap:'1%',
            large: true,
            itemStyle: {
              color:'#a90000',
              normal: {
                barBorderRadius: 20,
                color: new echarts.graphic.LinearGradient(0,1,0,0,[
                    {
                      offset: 0,
                      color:'#D3ABFF' // 0% 处的颜色
                    },
                    {
                      offset: 0.6,
                      color:'#00FFFE' // 60% 处的颜色
                    },
                    {
                      offset: 1,
                      color:'#00FFFE' // 100% 处的颜色
                    }
                  ],
                  false
                )
              }
            },
            barWidth: wid //柱图宽度
          }
        ]
      }
      //  对实例对象进行设置配置
      optionPillar && myPillar.setOption(optionPillar)
      myPillar.on('globalout',(params) => {
          this.volTime = {}
          this.TradingVolume = ''
      });
    },
    // 添加计位符
    thousands(num: any) {
      if(Math.floor(num) === num){
        const numStr = (num || 0).toString();
        return numStr.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
      }else{
        const str = num.toString()
        const reg = str.includes(".") > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g
        return str.replace(reg, "$1,")
      }
    },
    // 计算数据
    generateData(count) {
      let baseValue = Math.random() * 1000
      let time = +new Date(2011, 0, 1)
      let smallBaseValue
      function next(idx) {
        smallBaseValue = idx % 30 === 0 ? Math.random() * 700 : smallBaseValue + Math.random() * 500 - 250
        baseValue += Math.random() * 20 - 10
        return Math.max(0, Math.round(baseValue + smallBaseValue) + 3000)
      }
      let categoryDatas: any = []
      let valueDatas: any = []
      for (let i = 0; i < count; i++) {
        // categoryDatas.push(echarts.format.formatTime('yyyy-MM-dd\nhh:mm:ss', time, false))
        categoryDatas.push(echarts.format.formatTime('ss', time, false))
        valueDatas.push(next(i).toFixed(2))
        time += 1000
      }
      return {
        categoryData: categoryDatas,
        valueData: valueDatas
      }
    },
    changeEcharts(val) {
      this.echartsVal = val
      if (val =='D') {
        this.getTvl('day','tvl',100,100,10)
      } else if (val =='W') {
        this.getTvl('wek','tvl',100,100,9)
      } else if (val =='M') {
        this.getTvl('mon','tvl',100,100,9)
      }
    },
    changeEchart(val) {
      this.echartVal = val
      if (val =='D') {
        this.getPhan(100,100,1,'vol','day')
      } else if (val =='W') {
        this.getPhan(50,100,10,'vol','wek')
      } else if (val =='M') {
        this.getPhan(30,100,20,'vol','mon')
      }
    }
  }
})
</script>

<style lang="less">
.test-container .echarts-chart {
  margin: 0 auto;
  width: 1000px;
  height: 320px;
  display: flex;
  justify-content: space-between;
}
.h5-container .echarts-chart{
  width: 100%;
  .chart-all{
    width: 100%;
    height: 240px;
  }
  .chart-test {
    width: 100%;
    height: 200px;
    padding: 0px;
  }
  .chart-title{
    padding: 10px 10px 0;
  }
  .chart-title-left{
    span{
      font-size: 24px;
    }
  }
  .chart-title-right{
    text-align: right;
  }
}
.echarts-detail{
  width: 100%;
  height: 210px;
  // height: 100px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-content: space-between;
  > div{
    width: 162px;
    height: 100px;
    border-radius: 10px;
    background: linear-gradient(225deg, #3e434e 0%, #2e3238 100%);
    padding: 16px 10px 0;
    font-family: 'HelveticaNeue-Bold', 'HelveticaNeue';
    font-size: 12px;
    position: relative;
  }
  img{
    width: 80px;
    position: absolute;
    right: 0;
    bottom: 0;
  }
  a{
    font-size:20px !important;
    color:#fff;
  }
  span{
    font-size: 24px;
    font-weight: bold;
  }
}
.echarts-chart span {
  color: #fff;
}
.chart-all {
  width: 660px;
  border-radius: 10px;
  // background: linear-gradient(225deg, #3e434e 0%, #2e3238 100%);
  background: #30343c;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-end;
  justify-content: center;
  position: relative;
}
.chart-title {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px 0;
  position: absolute;
  top: 0;
  z-index: 100;
}
.chart-title > div {
  height: 80px;
  p{
    font-weight: bold;
  }
}
.chart-title-left {
  p {
    margin: 0 !important;
  }
  img {
    width: 32px;
    height: 32px;
    margin-right: 16px;
  }
  span {
    font-size: 36px;
    font-weight: bold;
  }
}
.chart-title-right p{
  text-align: right;
}
.chart-title-right > div {
  width: 90px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  > div {
    width: 24px;
    height: 24px;
    border-radius: 4px;
    background: linear-gradient(270deg, #555a62 0%, #3e434e 100%);
    border: 1px solid #565c6a;
    text-align: center;
    cursor: pointer;
    color: #747679;
    &:hover {
      color: #fff;
    }
  }
}
.title-active {
  border: 1px solid #07ebad !important;
  color: #fff !important;
}
.chart-pillar {
  margin: 20px auto !important;
}
.chart-test {
  width: 630px;
  height: 280px;
  padding: 0px;
}
.chart-spec {
  width: 320px;
  height: 320px;
  display: flex;
  flex-wrap: wrap;
  align-content: space-between;
}
.chart-spec > div {
  width: 320px;
  height: 150px;
  border-radius: 10px;
  padding: 20px;
  font-weight: bold;
  span {
    font-size: 36px;
  }
}
.chart-spec-vol {
  background: url('@/assets/images/bg-Cumulative-Volume.png');
  background-size: 100% 100%;
}
.chart-spec-tra {
  background: url('@/assets/images/bg-Cumulative-Transactions.png');
  background-size: 100% 100%;
}
.chart-spec-token {
  background: url('@/assets/images/bg-Total-Tokens.png');
  background-size: 100% 100%;
}
.chart-spec-user {
  background: url('@/assets/images/bg-Total-Users.png');
  background-size: 100% 100%;
}
</style>
