<template>
  <div class="chart">
    <div class="zoom-button-box">
      <div>
        <svg id="zoomOut" class="icon" aria-hidden="true" @click="zoomOut">
          <use xlink:href="#icon-big"></use>
        </svg>
      </div>
      <div>
        <svg id="zoomIn" class="icon" aria-hidden="true" @click="zoomIn">
          <use xlink:href="#icon-small"></use>
        </svg>
      </div>
    </div>
    <svg id="chart"></svg>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import * as d3 from 'd3'
import {
  getNearestTick,
  price2tick,
  tick2price,
  showPrice2contractPrice,
  contractPrice2showPrice
} from '@/tokenSwap/swapv3'
import { tick2Price, price2Tick } from '@cremafinance/crema-sdk'
import { fixD, checkNullObj, decimalFormat } from '@/utils'
import Decimal from 'decimal.js'

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
      isDraw: false,
      zoom: 0.125
      // zoom: 1
    }
  },
  watch: {
    poolInfo: {
      handler: 'poolInfoWatch',
      immediate: true
    },
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
        this.dataProcessing(this.poolInfo, this.zoom)
      }
    }
  },
  mounted() {
    // this.drawChart()
    if (!this.isDraw && this.poolInfo && !checkNullObj(this.poolInfo)) {
      this.dataProcessing(this.poolInfo, this.zoom)
    }
  },
  methods: {
    poolInfoWatch(infos: any, oldInfos: any) {
      if (infos && !checkNullObj(infos) && infos !== oldInfos) {
        this.dataProcessing(infos, this.zoom)
      }
    },
    minPriceWatch(newVal: string, oldVal: string) {
      console.log('minPriceWatch没走到这儿####newVal', newVal)
      // if (this.currentChartData && this.currentChartData.length > 0) {
      if (newVal !== oldVal) {
        // this.updateChartRange(newVal, this.maxPrice)
        this.dataProcessing(this.poolInfo, this.zoom)
      }
    },
    maxPriceWatch(newVal: string, oldVal: string) {
      console.log('maxPriceWatch没走到这儿####newVal', newVal)

      // if (this.currentChartData && this.currentChartData.length > 0) {
      if (newVal !== oldVal) {
        this.dataProcessing(this.poolInfo, this.zoom)
        // if (newVal !== '∞') {
        //   this.updateChartRange(this.minPrice, newVal)
        // } else {
        //   this.updateChartRange(this.minPrice, String(this.currentChartData[this.currentChartData.length - 1][0]))
        // }
      }
    },
    zoomOut() {
      if (this.zoom < 0.015625) return
      const zoom = this.zoom / 2
      this.zoom = zoom
      this.dataProcessing(this.poolInfo, zoom)
    },
    zoomIn() {
      if (this.zoom > 32) return
      const zoom = this.zoom * 2
      this.zoom = zoom
      this.dataProcessing(this.poolInfo, zoom)
    },
    dataProcessing(infos: any, zoom: number = 0.125) {
      // dataProcessing(infos: any, zoom: number = 1) {
      console.log('zoom####', zoom)
      if (infos && infos.coin) {
        const current_price = this.direction ? infos.currentPriceView : infos.currentPriceViewReverse
        console.log('dataProcessing####current_price#####', current_price)
        // const currentTick = price2Tick(new Decimal(Math.sqrt(current_price)))
        const currentTick = price2Tick(new Decimal(current_price))
        console.log('这里this.minPrice####', this.minPrice)
        console.log('这里this.maxPrice####', this.maxPrice)

        // const tickMax = (currentTick + 1000) * zoom
        // const tickMin = (currentTick - 1000) * zoom
        const tickMax = currentTick + 1000 * zoom
        const tickMin = currentTick - 1000 * zoom

        console.log('这里currentTick####', currentTick)
        console.log('这里tickMax####', tickMax)
        console.log('这里tickMin####', tickMin)
        console.log('this.minPrice123123####', this.minPrice)
        console.log('this.maxPrice123123####', this.maxPrice)
        const minPriceTick = price2Tick(new Decimal(decimalFormat(String(this.minPrice), 12)))
        const maxPriceTick = price2Tick(new Decimal(decimalFormat(String(this.maxPrice), 12)))

        // console.log('tickMax#####', tickMax)
        // console.log('tickMin#####', tickMin)
        console.log('infos.current_liquity####', infos.current_liquity.toString())

        // const currentLiquity = infos.current_liquity.toNumber()
        const currentLiquity = new Decimal(infos.current_liquity.toString()).div(Math.pow(10, 6)).toNumber()
        const tick_info_array = infos.tick_info_array

        console.log('tick_info_array######', tick_info_array)

        const leftArray: any = []
        const rightArray: any = []
        let item: any = {}

        for (let i = 0; i < tick_info_array.length; i++) {
          item = tick_info_array[i]
          if (item.tick <= currentTick && item.tick >= tickMin) {
            leftArray.unshift(item)
          } else if (item.tick > currentTick && item.tick <= tickMax) {
            rightArray.push(item)
          }
        }

        let nowLiquityLeft = currentLiquity
        for (let l = 0; l < leftArray.length; l++) {
          leftArray[l].liquityAmount = nowLiquityLeft
          nowLiquityLeft =
            nowLiquityLeft - new Decimal(leftArray[l].liquity_net.toString()).div(Math.pow(10, 6)).toNumber()
        }

        let nowLiquityRight = currentLiquity
        for (let r = 0; r < rightArray.length; r++) {
          rightArray[r].liquityAmount = nowLiquityRight
          nowLiquityRight =
            nowLiquityRight + new Decimal(rightArray[r].liquity_net.toString()).div(Math.pow(10, 6)).toNumber()
        }

        console.log('d3####leftArray#####', leftArray)
        console.log('d3####rightArray#####', rightArray)

        let chartData: any = []
        chartData = [...leftArray.reverse(), { tick: currentTick, liquityAmount: currentLiquity }, ...rightArray]

        if (!this.direction) {
          chartData = chartData.reverse()
        }

        console.log('d3##chartData#####', chartData)
        console.log('这里这里####minPriceTick####', minPriceTick)
        console.log('这里这里####maxPriceTick####', maxPriceTick)
        console.log('这里这里####currentTick####', currentTick)
        console.log('这里这里####tickMin####', tickMin)
        console.log('这里这里####tickMax####', tickMax)
        this.drawChart(chartData, tickMin, tickMax, minPriceTick, maxPriceTick, currentTick)
      }
    },
    drawChart(
      chartData: any,
      tickMin: number,
      tickMax: number,
      minPriceTick: number,
      maxPriceTick: number,
      currentTick: number
    ) {
      // console.log('进来了吗####d3###drawChart')
      const _this = this
      const margin = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
      }

      const width = 460 - margin.left - margin.right // 460
      const height = 195 - margin.top - margin.bottom // 195

      const xArr = [
        tickMin,
        currentTick - (currentTick - tickMin) / 2,
        currentTick,
        currentTick + (tickMax - currentTick) / 2,
        tickMax
      ]
      const xPriceArr: any = []
      console.log('xArr123####', xArr)

      const utickMin = xArr[0] - (xArr[1] - xArr[0]) * 2
      const utickMax = xArr[4] + (xArr[4] - xArr[3]) * 2
      console.log('utickMin#####', utickMin)
      console.log('utickMax#####', utickMax)
      //
      // const unit = width / (tickMax * 1.2 - tickMin / 1.2)
      console.log('width###', width)
      const unit = width / (utickMax - utickMin)

      // console.log('unit####', unit)

      d3.select('#chart').selectAll('*').remove()
      const svg = d3
        .select('#chart')
        // .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.right})`)

      const maxHeight: number =
        d3.max(chartData, function (d: any) {
          return Number(d.liquityAmount)
        }) || 0

      // console.log('d3######', maxHeight)
      // const minHeight: number = d3.min(chartData, function (d: any) {
      //   return Number(d.liquityAmount)
      // })

      const yScale = d3.scaleLinear().range([0, height]).domain([maxHeight, 0])
      const xScale = d3.scaleBand().rangeRound([0, width]).padding(0.1)

      const barsBox = svg.append('g').attr('id', 'barsBox')
      const bars = barsBox.selectAll('rect').data(chartData).enter().append('rect')
      bars
        .attr('x', function (d: any, index: number) {
          // console.log('1234###Math.abs(d.tick - tickMin) * unit####', Math.abs(d.tick - tickMin) * unit)
          if (index === 0) return 0
          if (_this.direction) {
            // return Math.abs(chartData[index - 1].tick - tickMin) * unit
            return Math.abs(chartData[index - 1].tick - tickMin) * unit
          } else {
            return Math.abs(tickMax - chartData[index - 1].tick) * unit
          }
        })
        .attr('y', function (d: any, index: number) {
          if (index === 0) return 0
          if (_this.direction) {
            return yScale(chartData[index - 1].liquityAmount)
          } else {
            return yScale(d.liquityAmount)
          }
        })
        .attr('width', function (d: any, index: number) {
          if (index === 0) return 0
          if (_this.direction) {
            return Math.abs(d.tick - chartData[index - 1].tick) * unit
          } else {
            return Math.abs(chartData[index - 1].tick - d.tick) * unit
          }
        })
        .attr('height', function (d: any, index: number) {
          if (index === 0) return 0
          if (_this.direction) {
            return height - yScale(chartData[index - 1].liquityAmount)
          } else {
            return height - yScale(d.liquityAmount)
          }
        })
        .attr('fill', '#2C4A57')
        .attr('class', 'bars')

      // 自己画坐标轴
      const xAxisBox = svg.append('g')
      const xAxisLine = xAxisBox
        .append('line')
        .attr('x1', 0)
        .attr('y1', 155)
        .attr('x2', 420)
        .attr('y2', 155)
        .attr('stroke-width', 1)
        .attr('stroke', '#50535D')

      const ticksBox = xAxisBox.append('g')
      const z = tickMax - tickMin
      // const xArr = [tickMin / 1.2, tickMin / 2.4, currentTick, tickMax / 2.4, tickMax / 1.2]
      // const xArr = [
      //   tickMin,
      //   currentTick - (currentTick - tickMin) / 2,
      //   currentTick,
      //   currentTick + (tickMax - currentTick) / 2,
      //   tickMax
      // ]
      // const xPriceArr: any = []
      // console.log('xArr123####', xArr)

      if (_this.direction) {
        for (let i = 0; i < xArr.length; i++) {
          const price: string = decimalFormat(String(tick2Price(xArr[i]).toNumber()), 6) || '0'
          // const price: string = '.'
          xPriceArr.push(price)
          console.log('xArr[i]####', xArr[i])
          console.log('tickMin####', tickMin)
          console.log('unit####', unit)
          // const x = Math.abs(xArr[i] - tickMin / 1.2) * unit
          const x = Math.abs(xArr[i] - utickMin) * unit
          console.log('x#####', x)

          let length: number = 0
          // for (let j = 0; j < price.length; j++) {
          //   if (price[j] === '1') {
          //     length += 4.02
          //   } else if (price[j] === '.') {
          //     length += 4
          //   } else {
          //     length += 5.7
          //   }
          // }
          for (let j = 0; j < price.length; j++) {
            if (price[j] === '1') {
              length += 4.02
            } else if (price[j] === '.') {
              length += 2.64
            } else if (price[j] === '7') {
              length += 5.48
            } else {
              length += 6
            }
          }
          console.log('length#####', length)

          ticksBox
            .append('text')
            .text(price)
            .attr('x', x - length / 2)
            .attr('y', 170)
            .attr('fill', 'rgba(255, 255, 255, 0.5')
            .style('font-size', '10')
        }
      } else {
        for (let i = xArr.length - 1; i >= 0; i--) {
          const price: string = decimalFormat(String(tick2Price(xArr[i]).toNumber() / 1), 6) || '0'
          xPriceArr.push(price)
          const x = Math.abs(xArr[i] - utickMin) * unit
          // console.log('这里这里####price####', price)
          let length: number = 0
          // for (let j = 0; j < price.length; j++) {
          //   if (price[j] === '1') {
          //     length += 4.02
          //   } else if (price[j] === '.') {
          //     length += 4
          //   } else {
          //     length += 5.7
          //   }
          // }
          for (let j = 0; j < price.length; j++) {
            if (price[j] === '1') {
              length += 4.02
            } else if (price[j] === '.') {
              length += 2.64
            } else if (price[j] === '7') {
              length += 5.48
            } else {
              length += 6
            }
          }

          ticksBox
            .append('text')
            .text(price)
            .attr('x', x - length / 2)
            .attr('y', 170)
            .attr('fill', 'rgba(255, 255, 255, 0.5')
            .style('font-size', '10')
        }
      }

      console.log('xPriceArr#####', xPriceArr)

      // leftHandle
      const leftHandle = svg.append('g').attr('id', 'left-handle')

      leftHandle
        .append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', 0)
        .attr('y2', 155)
        .attr('stroke-dasharray', '5, 5')
        .attr('stroke-width', 2)
        .attr('stroke', 'rgba(255, 255, 255, 0.4)')

      // leftHandle
      //   .append('rect')
      //   .attr('x', 0)
      //   .attr('y', 0)
      //   .attr('rx', 5)
      //   .attr('ry', 5)
      //   .attr('width', 14)
      //   .attr('height', 30)
      //   .style('fill', '#1EE1CF')
      //   .attr('stroke', '#fff')
      //   .attr('stroke-width', '1')
      leftHandle
        .append('path')
        .attr('d', 'M 1 0 V 0 M 0 1 h 12 q 5 0, 5 5 v 22 q 0 5 -5 5 h -12 z')
        .attr('fill', '#1EE1CF')
        .attr('stroke', '#707378')
        .attr('transform', 'translate(1, 32) rotate(180)')

      leftHandle.append('rect').attr('width', 1).attr('height', 10).attr('x', -9).attr('y', 10).attr('fill', 'white')

      leftHandle.append('rect').attr('width', 1).attr('height', 10).attr('x', -6).attr('y', 10).attr('fill', 'white')

      // rightHandle
      const rightHandle = svg.append('g').attr('id', 'right-handle')

      rightHandle
        .append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', 0)
        .attr('y2', 155)
        .attr('stroke-dasharray', '5, 5')
        .attr('stroke-width', 2)
        .attr('stroke', 'rgba(255, 255, 255, 0.4)')

      // rightHandle
      //   .append('circle')
      //   .attr('x', 0)
      //   .attr('r', 10)
      //   .style('fill', '#005AFF')
      //   .attr('stroke', '#fff')
      //   .attr('stroke-width', '1')
      rightHandle
        .append('path')
        .attr('d', 'M 1 0 V 0 M 0 1 h 12 q 5 0, 5 5 v 22 q 0 5 -5 5 h -12 z')
        .attr('fill', '#005AFF')
        .attr('stroke', '#707378')
        .attr('transform', 'translate(-1, -2)')

      rightHandle.append('rect').attr('width', 1).attr('height', 10).attr('x', 6).attr('y', 10).attr('fill', 'white')

      rightHandle.append('rect').attr('width', 1).attr('height', 10).attr('x', 9).attr('y', 10).attr('fill', 'white')

      // brush
      const brush = d3
        .brushX()
        .extent([
          [0, 0],
          [width, height]
        ])
        .on('end', brushend)

      let minPriceTickX = Math.abs(minPriceTick - tickMin) * unit
      let maxPriceTickX = Math.abs(maxPriceTick - tickMin) * unit
      if (this.minPrice === '0') {
        minPriceTickX = 0
      }
      if (this.maxPrice === '∞') {
        maxPriceTickX = width
      }

      console.log('unit####', unit)
      console.log('this.minPrice123####', this.minPrice)
      console.log('this.maxPrice123####', this.maxPrice)
      console.log('minPriceTickX#####', minPriceTickX)
      console.log('maxPriceTickX#####', maxPriceTickX)

      svg.append('g').attr('class', 'brush').call(brush).call(brush.move, [minPriceTickX, maxPriceTickX])
      leftHandle.attr('transform', 'translate(' + minPriceTickX + ', 0)')
      rightHandle.attr('transform', 'translate(' + maxPriceTickX + ', 0)')

      function brushend(e) {
        // eslint-disable-next-line no-useless-return
        if (!e.sourceEvent) return // Only transition after input.
        // eslint-disable-next-line no-useless-return
        if (!e.selection) return // Ignore empty selections.
        console.log(e.selection)
        // const areaArray = e.selection; //[x0,x1]
        leftHandle.attr('transform', 'translate(' + e.selection[0] + ', 0)')

        rightHandle.attr('transform', 'translate(' + e.selection[1] + ', 0)')

        const minPrice = tick2Price(e.selection[0] / unit + tickMin).toNumber()
        const maxPrice = tick2Price(e.selection[1] / unit + tickMin).toNumber()

        _this.$emit('onChangeMinPrice', String(minPrice))
        _this.$emit('onChangeMaxPrice', String(maxPrice))
      }

      // brush selection style
      d3.select('.selection').attr('stroke', 'rgba(255, 255, 255, 0)').attr('fill', 'rgba(255, 255, 255, 0.4')
    }
  }
})
</script>
<style lang="less" scoped>
.chart {
  position: relative;
  .zoom-button-box {
    width: 80px;
    height: 28px;
    background: linear-gradient(220deg, #3e434e 0%, #23262b 100%);
    box-shadow: 0px 2px 9px 0px rgba(26, 28, 31, 0.52);
    border-radius: 10px;
    display: flex;
    align-items: center;
    position: absolute;
    right: 0px;
    top: -14px;
    div {
      width: 40px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      &:first-child {
        border-right: 1px solid rgba(255, 255, 255, 0.1);
      }
      svg {
        width: 20px;
        height: 20px;
        fill: #fff;
        cursor: pointer;
      }
    }
  }
}

@media screen and (max-width: 750px) {
  .chart {
    .zoom-button-box {
      top: 0px;
    }
  }
}
</style>

