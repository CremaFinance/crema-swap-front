<template>
  <div class="test-container">
    <div id="main" style="margin: auto;" class="chart-test"></div>
    <div style="margin-left: 200px;">{{volTime.day}} - {{volTime.month}} - {{volTime.year}}</div>
    <div style="margin-left: 200px;">{{TradingVolume}}</div>
  </div>
</template>

<script lang="ts">
import { Vue } from 'nuxt-property-decorator'
import * as echarts from 'echarts'

export default Vue.extend({
  data() {
    return {
      pillar:'',
      volTime:{
        day:'',
        month:'',
        year:''
      },
      TradingVolume:''
    }
  },
  mounted() {
    this.getPhan(100,100,1,'vol','day')
  },
  methods: {
    getPhan(val,num,width,title,date){
      this.$axios.get(`https://dev-api-crema.bitank.com/v1/histogram?date_type=${date}&typ=${title}&limit=${val}`).then((res) =>{
        let list = res.data.list
        const result: any = {
          categoryData:[],
          valueData:[],
        }
        if(list){
          list.forEach((item) =>{
            result.categoryData.push((item.date).slice(0,10))
            // result.categoryData.push(item.date)
            result.valueData.push(item.num)
          })
        }
        this.pillar = result
        this.initialize(num,width)
      })
    },
    initialize(val, wid){
      const chartpillar: any = document.getElementById('main')
      if (chartpillar) {
        const myPillar = echarts.init(chartpillar)
        let optionPillar: any = {
          tooltip: {
            trigger:'axis',
            formatter:(params) =>{
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
              this.TradingVolume = params[0].value[1]
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
            // boundaryGap: false,
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
              end: 20
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
              barWidth: 10 //柱图宽度
            }
          ]
        }
        //  对实例对象进行设置配置
        optionPillar && myPillar.setOption(optionPillar)
      }
    }
  },
  
})
</script>

<style lang="less">
.test-container {
  .chart-test {
    width: 642px;
    height: 320px;
  }
}
</style>
