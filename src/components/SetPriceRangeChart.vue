<template>
  <div class="set-price-range">
    <div class="title">Set Price Range</div>
    <div id="rangeChart" class="range-chart"></div>
  </div>
</template>

<script lang="ts">
import { Vue } from 'nuxt-property-decorator'
import * as echarts from 'echarts'
import {
  getNearestTick,
  price2tick,
  tick2price,
  showPrice2contractPrice,
  contractPrice2showPrice
} from '@/tokenSwap/swapv3'
import { Numberu128 } from '@/tokenSwap'
import { fixD, checkNullObj } from '@/utils'

export default Vue.extend({
  props: {
    poolInfo: {
      type: Object,
      default: () => {
        return {}
      }
    },
    minPrice: {
      type: String,
      default: ''
    },
    maxPrice: {
      type: String,
      default: ''
    },
    direction: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      myChart: null as any,
      currentChartData: [] as any,
      isDraw: false
    }
  },
  computed: {},
  watch: {
    poolInfo: {
      handler: 'poolInfoWatch',
      immediate: true
    },
    // minPrice(newVal: string) {
    //   if (Number(newVal) < this.currentChartData[0][0]) {
    //     this.updateChartRange(this.currentChartData[0][0], this.maxPrice)
    //   } else {
    //     this.updateChartRange(newVal, this.maxPrice)
    //   }
    // },
    // maxPrice(newVal: string) {
    //   if (newVal !== '∞') {
    //     this.updateChartRange(this.minPrice, newVal)
    //   } else {
    //     this.updateChartRange(this.minPrice, String(this.currentChartData.length[this.currentChartData.length - 1][0]))
    //   }
    // },
    minPrice: {
      handler: 'minPriceWatch',
      immediate: true
    },
    maxPrice: {
      handler: 'maxPriceWatch',
      immediate: true
    },
    direction(newValue: boolean) {
      if (this.poolInfo && !checkNullObj(this.poolInfo)) {
        this.dataProcessing(this.poolInfo)
      }
    }
  },
  mounted() {
    if (!this.isDraw && this.poolInfo && !checkNullObj(this.poolInfo)) {
      this.dataProcessing(this.poolInfo)
    }
  },
  methods: {
    poolInfoWatch(infos: any, oldInfos: any) {
      if (infos && !checkNullObj(infos) && infos !== oldInfos) {
        this.dataProcessing(infos)
      }
    },
    minPriceWatch(newVal: string) {
      if (this.currentChartData && this.currentChartData.length > 0) {
        // if (Number(newVal) < this.currentChartData[0][0]) {
        //   this.updateChartRange(this.currentChartData[0][0], this.maxPrice)
        // } else {
        this.updateChartRange(newVal, this.maxPrice)
        // }
      }
    },
    maxPriceWatch(newVal: string) {
      if (this.currentChartData && this.currentChartData.length > 0) {
        if (newVal !== '∞') {
          this.updateChartRange(this.minPrice, newVal)
        } else {
          this.updateChartRange(this.minPrice, String(this.currentChartData[this.currentChartData.length - 1][0]))
        }
      }
    },
    updateChartRange(min: string, max: string) {
      const minCoordinate = this.getCoordinate(Number(min))
      const maxCoordinate = this.getCoordinate(Number(max))
      if (this.myChart) {
        this.myChart.dispatchAction({
          type: 'brush',
          areas: [
            {
              brushType: 'lineX',
              coordRange: [minCoordinate, maxCoordinate],
              xAxisIndex: 0
            }
          ]
        })
      }
    },
    // 获取坐标
    getCoordinate(price: number) {
      const list = this.currentChartData
      if (!list || list.length < 1) return 0
      if (price < list[0][0]) return 0
      if (price > list[list.length - 1][0]) return list.length - 1
      for (let i = 0; i < list.length - 1; i++) {
        if (price >= list[i][0] && price <= list[i + 1][0]) {
          return i
        }
      }
      return 0
    },
    dataProcessing(infos: any) {
      if (infos && infos.coin) {
        const current_price = infos.currentPriceView
        const currentTick = price2tick(Math.sqrt(current_price))

        // const tickMax = price2tick(Math.sqrt(current_price * 3)) // 当前价格二倍
        // const tickMin = currentTick - (tickMax - currentTick)
        const tickMax = 800
        const tickMin = -800

        const currentLiquity = infos.current_liquity.toNumber()
        const tick_info_array = infos.tick_info_array

        // console.log('current_price#####', current_price)
        // console.log('currentTick#####', currentTick)
        // console.log('tickMax#####', tickMax)
        // console.log('tickMin#####', tickMin)
        // console.log('currentLiquity#####', currentLiquity)

        // console.log('tick_info_array########', tick_info_array)
        // console.log('tick_info_array########', JSON.stringify(tick_info_array))

        // 测试
        // const tickMax = 10 // 当前价格二倍
        // const tickMin = 0
        // const currentTick = 12
        // const currentLiquity = 1000
        // const tick_info_array = [
        //   {
        //     tick: 2,
        //     liquity_net: new Numberu128('10')
        //   },
        //   {
        //     tick: 5,
        //     liquity_net: new Numberu128('10')
        //   },
        //   {
        //     tick: 10,
        //     liquity_net: new Numberu128('10')
        //   },
        //   {
        //     tick: 15,
        //     liquity_net: new Numberu128('10')
        //   },
        //   {
        //     tick: 30,
        //     liquity_net: new Numberu128('10')
        //   },
        //   {
        //     tick: 40,
        //     liquity_net: new Numberu128('10')
        //   }
        // ]

        const leftArray: any = []
        const rightArray: any = []
        let item: any = {}
        // const testarray111: any = []
        for (let i = 0; i < tick_info_array.length; i++) {
          item = tick_info_array[i]
          // testarray111.push({
          //   ...item,
          //   liquityNetToNumber: item.liquity_net.toNumber()
          // })
          if (item.tick < currentTick) {
            leftArray.unshift(item)
          } else {
            rightArray.push(item)
          }
        }

        console.log('leftArray######', leftArray)
        console.log('rightArray######', rightArray)

        let leftData: any = []
        let preTickLeft = currentTick
        let nowLiquityLeft = currentLiquity
        // console.log('leftArray####', leftArray)
        for (let l = 0; l < leftArray.length; l++) {
          const newList = this.generateArray(leftArray[l].tick, preTickLeft, nowLiquityLeft, tickMin, tickMax)
          leftData = [...newList, ...leftData]
          preTickLeft = leftArray[l].tick
          nowLiquityLeft = nowLiquityLeft - leftArray[l].liquity_net.toNumber()
        }

        // console.log('leftData#####', leftData)

        let rightData: any = []
        let preTickright = currentTick
        let nowLiquityRight = currentLiquity
        // console.log('rightArray####', rightArray)
        for (let r = 0; r < rightArray.length; r++) {
          const newList = this.generateArray(preTickright, rightArray[r].tick, nowLiquityRight, tickMin, tickMax)
          rightData = [...rightData, ...newList]
          preTickright = rightArray[r].tick
          nowLiquityRight = nowLiquityRight + rightArray[r].liquity_net.toNumber()
        }

        // console.log('rightData####', rightData)

        let chartData: any = []
        // if (this.direction) {
        chartData = [...leftData, ...rightData]

        if (!this.direction) {
          chartData = chartData.reverse()
        }
        // } else {
        // chartData = [...rightData, ...leftData]
        // }

        // console.log('currentTick####', currentTick)
        // console.log('currentLiquity####', currentLiquity)
        // console.log('chartData####', chartData)

        // const resultData: any = []
        // for (let i = 0; i < chartData.length; i++) {
        //   resultData.unshift([chartData[i][0], chartData[i][1] / Math.pow(10, 12)])
        // }

        // console.log('resultData####', resultData)
        this.currentChartData = chartData
        // this.currentChartData = resultData
        console.log('chartData####', chartData)
        this.drawChart(chartData)
        // this.drawChart(resultData)
      }
    },

    // dataProcessing(infos: any) {
    //   console.log('进来了几次呢dataProcessing###')
    //   this.isDraw = true
    //   if (infos && infos.coin) {
    //     const current_price = infos.currentPriceView
    //     const currentTick = price2tick(Math.sqrt(current_price))
    //     const currentLiquity = infos.current_liquity.toNumber()
    //     const tick_info_array = infos.tick_info_array
    //     console.log('currentTick####', currentTick)
    //     console.log('currentLiquity####', currentLiquity)
    //     console.log('tick_info_array####', tick_info_array)

    //     const testTick = tick2price(-443632)
    //     console.log('testTick####', testTick)

    //     const leftArray: any = []
    //     const rightArray: any = []
    //     let item: any = {}
    //     for (let i = 0; i < tick_info_array.length; i++) {
    //       item = tick_info_array[i]
    //       if (item.tick < currentTick) {
    //         leftArray.unshift(item)
    //       } else {
    //         rightArray.push(item)
    //       }
    //     }

    //     console.log('leftArray####', leftArray)
    //     console.log('rightArray####', rightArray)

    //     const leftData: any = this.getUnilateralArray(leftArray, currentLiquity, 'left')
    //     const rightData: any = this.getUnilateralArray(rightArray, currentLiquity, 'left')

    //     console.log('leftData#####', leftData)
    //     console.log('rightData#####', rightData)
    //     // const chartData = [...leftData.reverse(), ...rightData]

    //     const chartData: any = []
    //     for (let i = 0; i < leftData.length; i++) {
    //       // chartData.unshift([leftData[i][0], leftData[i][1] / Math.pow(10, 12)])
    //       chartData.unshift([leftData[i][0], leftData[i][1]])
    //       // chartData.unshift([fixD(Math.pow(tick2price(leftData[i][0]), 2), 6), leftData[i][1]])
    //     }

    //     for (let i = 0; i < rightData.length; i++) {
    //       // chartData.push([rightData[i][0], rightData[i][1] / Math.pow(10, 12)])
    //       chartData.push([rightData[i][0], rightData[i][1]])
    //       // chartData.push([fixD(Math.pow(tick2price(rightData[i][0]), 2), 6), rightData[i][1]])
    //     }

    //     console.log('chartData#####', chartData)
    //     console.log('chartData#####', JSON.stringify(chartData))
    //     this.drawChart(chartData)
    //   }
    // },
    // 获取单侧数组
    getUnilateralArray(list: any = [], currentLiquity: any, direction: string) {
      const result: any = []
      let liquity: number
      for (let i = 0; i < list.length; i++) {
        if (i === 0) {
          liquity = currentLiquity
        } else {
          if (direction === 'left') {
            liquity = currentLiquity - list[i].liquity_net.toNumber()
          } else {
            liquity = currentLiquity + list[i].liquity_net.toNumber()
          }
        }
        if (this.direction) {
          result.push([list[i].tick, liquity])
        } else {
          result.unshift([list[i].tick, liquity])
        }
      }
      return result
    },
    generateArray(start: number, end: number, liquity: number, tickMin: number, tickMax: number) {
      const list: any = []
      const s = start < tickMin ? tickMin : start
      const e = end > tickMax ? tickMax : end
      for (let i = s; i < e; i = i + 10) {
        // list.push([Math.pow(tick2price(i), 2), liquity])
        if (this.direction) {
          list.push([Math.pow(tick2price(i), 2), liquity])
        } else {
          list.push([1 / Math.pow(tick2price(i), 2), liquity])
        }
      }
      return list
    },
    drawChart(chartData: any) {
      const chartDom = document.getElementById('rangeChart')
      // console.log('parseInt(String(chartData.length / 4))####', parseInt(String(chartData.length / 4)))
      if (chartDom) {
        this.myChart = echarts.init(chartDom)
        let option: any

        option = {
          legend: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
          },
          grid: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 30
          },
          xAxis: {
            // show: false,
            type: 'category',
            // boundaryGap: true,
            // data: xData.reverse(),
            // minInterval: 1,
            // data: [0, 100, 200, 300, 400, 500, 600]
            // interval: parseInt(String(chartData.length / 4)),
            // interval: 5000,
            axisLabel: {
              showMinLabel: false,
              padding: [3, 10],
              // interval: 2,
              // eslint-disable-next-line object-shorthand
              formatter: function (value: number) {
                // return fixD(Math.pow(tick2price(value), 2), 6)
                return fixD(value, 6)
              }
            }
          },
          yAxis: {
            show: false,
            type: 'value'
          },
          toolbox: {
            show: false
          },
          brush: {
            toolbox: ['lineX'],
            brushType: 'lineX',
            xAxisIndex: 'all',
            brushLink: 'all',
            outOfBrush: {
              // colorAlpha: 0.8,
              // color: 'rgba(0, 204, 255,0.1)'
              color: '#2C4A57'
              // color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              //   {
              //     offset: 0,
              //     color: 'rgba(0, 204, 255,0.1)'
              //   },
              //   {
              //     offset: 1,
              //     color: 'rgba(0, 232, 255, 0)'
              //   }
              // ])
            },
            brushStyle: {
              borderWidth: 1,
              color: 'rgba(95, 230, 208, 0.1)'
              // color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              //   {
              //     offset: 0,
              //     color: 'rgba(95, 230, 208, 0.1)'
              //   },
              //   {
              //     offset: 0.33,
              //     color: 'rgba(89,108,255,0.1)'
              //   },
              //   {
              //     offset: 0.66,
              //     color: 'rgba(147,128,255,0.1)'
              //   },
              //   {
              //     offset: 1,
              //     color: 'rgba(229,144,255,0.1)'
              //   }
              // ])
            }
          },

          dataZoom: [
            // {
            //   type: 'slider',
            //   top: '20%',
            //   bottom: '24%',
            //   moveHandleSize: 1
            // }
            {
              type: 'inside'
              // startValue: chartData.length / 2 - 100,
              // endValue: chartData.length / 2 + 100
            }
          ],
          series: [
            {
              data: chartData,
              // data: yData.reverse(),
              type: 'bar',
              // symbolSize: 0,
              // showSymbol: false,
              itemStyle: {
                // color: 'rgba(0, 204, 255,0.1)'
                color: '#2C4A57'
                // color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                //   {
                //     offset: 0,
                //     // color: 'rgba(0, 204, 255,0.57)'
                //     color: 'rgba(0, 204, 255,0.1)'
                //   },
                //   {
                //     offset: 1,
                //     color: 'rgba(0, 232, 255, 0)'
                //   }
                // ])
              },
              barCategoryGap: '0%'
            }
          ]
        }

        option && this.myChart.setOption(option)

        // myChart.dispatchAction({
        //   type: 'brush',
        //   areas: [
        //     {
        //       brushType: 'lineX',
        //       coordRange: [0, 1],
        //       xAxisIndex: 0
        //     }
        //   ]
        // })

        this.myChart.on('brushEnd', (params: any) => {
          const coordRange = params.areas[0].coordRange
          const min = chartData[coordRange[0]]
          const max = chartData[coordRange[1]]
          this.$emit('onChangeMinPrice', String(min[0]))
          this.$emit('onChangeMaxPrice', String(max[0]))
        })

        setTimeout(() => {
          this.updateChartRange(this.minPrice, this.maxPrice)
        }, 1500)
      }
    }
  }
})
</script>

<style lang="less">
.set-price-range {
  > .title {
    font-size: 14px;
    color: #fff;
  }
  .range-chart {
    width: 460px;
    height: 195px;
  }
}
@media screen and (max-width: 750px) {
  .set-price-range {
    display: none;
  }
}
</style>
