<template>
  <div class="chart-box">
    <div v-show="!chartLoading" class="chart">
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
      <svg id="chart-h5"></svg>
    </div>
    <Spin v-if="chartLoading" class="chart-loading"></Spin>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import * as d3 from 'd3'
import { tick2UiPrice, uiPrice2Tick } from '@cremafinance/crema-sdk'
import { fixD, checkNullObj, decimalFormat } from '@/utils'
import Decimal from 'decimal.js'
import { Spin } from 'ant-design-vue'

export default Vue.extend({
  components: {
    Spin
  },
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
    },
    tickList: {
      type: Array,
      default: () => {
        return []
      }
    },
    currentTick: {
      type: Number,
      default: 0
    },
    chartLoading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isDraw: false,
      // zoom: 0.125
      zoom: 1,
      isLoading: false
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
    },
    tickList(newVal) {
      if (this.poolInfo && !checkNullObj(this.poolInfo)) {
        this.dataProcessing(this.poolInfo, this.zoom)
      }
    },
    currentTick(newVal) {
      if (this.poolInfo && !checkNullObj(this.poolInfo)) {
        this.dataProcessing(this.poolInfo, this.zoom)
      }
    }
  },
  methods: {
    poolInfoWatch(infos: any, oldInfos: any) {
      if (infos && !checkNullObj(infos) && infos !== oldInfos) {
        this.dataProcessing(infos, this.zoom)
      }
    },
    minPriceWatch(newVal: string, oldVal: string) {
      if (newVal !== oldVal) {
        this.dataProcessing(this.poolInfo, this.zoom)
      }
    },
    maxPriceWatch(newVal: string, oldVal: string) {
      if (newVal !== oldVal) {
        this.dataProcessing(this.poolInfo, this.zoom)
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
    dataProcessing(infos: any, zoom: number = 1) {
      if (infos && infos.token_a && this.tickList.length > 0 && !this.chartLoading) {
        this.isDraw = true
        const currentTick = this.currentTick
        const tickMax = currentTick + 100 * zoom
        const tickMin = currentTick - 100 * zoom

        console.log(
          'D3Chart###bug###test##currentPrice###正###',
          tick2UiPrice(currentTick, this.poolInfo.token_a.decimal, this.poolInfo.token_b.decimal).toString()
        )
        console.log(
          'D3Chart###bug###test##currentPrice###反###',
          tick2UiPrice(currentTick, this.poolInfo.token_b.decimal, this.poolInfo.token_a.decimal).toString()
        )

        // const minPriceTick = price2Tick(new Decimal(decimalFormat(String(this.minPrice), 12)))
        // const maxPriceTick = price2Tick(new Decimal(decimalFormat(String(this.maxPrice), 12)))
        let minPriceTick: any
        let maxPriceTick: any
        if (this.maxPrice === '∞') {
          maxPriceTick = 0
        } else {
          if (this.direction) {
            maxPriceTick = uiPrice2Tick(
              new Decimal(decimalFormat(String(this.maxPrice), 12)),
              this.poolInfo.token_a.decimal,
              this.poolInfo.token_b.decimal
            )
          } else {
            maxPriceTick = uiPrice2Tick(
              new Decimal(1 / Number(decimalFormat(String(this.minPrice), 12))),
              this.poolInfo.token_a.decimal,
              this.poolInfo.token_b.decimal
            )
          }
        }

        if (this.minPrice === '0') {
          minPriceTick = 0
        } else {
          if (this.direction) {
            minPriceTick = uiPrice2Tick(
              new Decimal(decimalFormat(String(this.minPrice), 12)),
              this.poolInfo.token_a.decimal,
              this.poolInfo.token_b.decimal
            )
          } else {
            minPriceTick = uiPrice2Tick(
              new Decimal(1 / Number(decimalFormat(String(this.maxPrice), 12))),
              this.poolInfo.token_a.decimal,
              this.poolInfo.token_b.decimal
            )
          }
        }

        const currentLiquity = infos.currentLiquity.div(Math.pow(10, 6)).toNumber()
        const tick_info_array = this.tickList

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
          nowLiquityLeft = nowLiquityLeft - leftArray[l].liquityNet.div(Math.pow(10, 6)).toNumber()
        }

        let nowLiquityRight = currentLiquity
        for (let r = 0; r < rightArray.length; r++) {
          rightArray[r].liquityAmount = nowLiquityRight
          nowLiquityRight = nowLiquityRight + rightArray[r].liquityNet.div(Math.pow(10, 6)).toNumber()
        }

        let chartData: any = []
        chartData = [...leftArray.reverse(), { tick: currentTick, liquityAmount: currentLiquity }, ...rightArray]

        if (!this.direction) {
          chartData = chartData.reverse()
        }

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

      const utickMin = xArr[0] - (xArr[1] - xArr[0])
      const utickMax = xArr[4] + (xArr[4] - xArr[3])
      const unit = width / (utickMax - utickMin)

      d3.select('#chart-h5').selectAll('*').remove()
      const svg = d3
        .select('#chart-h5')
        // .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.right})`)

      const maxHeight: number =
        d3.max(chartData, function (d: any) {
          return Number(d.liquityAmount)
        }) || 0

      const yScale = d3.scaleLinear().range([0, height]).domain([maxHeight, 0])
      const xScale = d3.scaleBand().rangeRound([0, width]).padding(0.1)

      const barsBox = svg.append('g').attr('id', 'barsBox')
      const bars = barsBox.selectAll('rect').data(chartData).enter().append('rect')
      bars
        .attr('x', function (d: any, index: number) {
          if (index === 0) return 0
          if (_this.direction) {
            return Math.abs(chartData[index - 1].tick - utickMin) * unit
          } else {
            return Math.abs(utickMax - chartData[index - 1].tick) * unit
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

      if (_this.direction) {
        for (let i = 0; i < xArr.length; i++) {
          const price: string =
            decimalFormat(
              String(tick2UiPrice(xArr[i], this.poolInfo.token_a.decimal, this.poolInfo.token_b.decimal).toNumber()),
              6
            ) || '0'

          xPriceArr.push(price)
          const x = Math.abs(xArr[i] - utickMin) * unit
          let length: number = 0
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
      } else {
        for (let i = xArr.length - 1; i >= 0; i--) {
          // for (let i = 0; i < xArr.length; i++) {
          // const price: string = decimalFormat(String(tick2Price(xArr[i]).toNumber() / 1), 6) || '0'
          const price: string =
            decimalFormat(
              String(
                1 / tick2UiPrice(xArr[i], this.poolInfo.token_a.decimal, this.poolInfo.token_b.decimal).toNumber()
              ),
              6
            ) || '0'
          xPriceArr.push(price)
          const x = Math.abs(xArr[i] - utickMax) * unit
          let length: number = 0
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
        .handleSize(30)
        .on('end', brushend)

      console.log('D3Chart#####draw###minPriceTick###', minPriceTick)
      console.log('D3Chart#####draw###maxPriceTick###', maxPriceTick)
      console.log('D3Chart#####draw###utickMin####', utickMin)
      console.log('D3Chart#####draw###utickMax####', utickMax)

      let minPriceTickX = minPriceTick < utickMin ? -100 : Math.abs(minPriceTick - utickMin) * unit
      // let minPriceTickX = -100
      let maxPriceTickX = maxPriceTick < utickMin ? -100 : Math.abs(maxPriceTick - utickMin) * unit

      console.log('D3Chart#####draw###minPriceTickX###', minPriceTickX)
      console.log('D3Chart#####draw###maxPriceTickX###', maxPriceTickX)

      if (this.minPrice === '0') {
        minPriceTickX = 0
      }
      if (this.maxPrice === '∞') {
        maxPriceTickX = width
      }

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

        console.log('D3Chart#####draw####e.selection[0]###', e.selection[0])
        console.log('D3Chart#####draw####e.selection[1]###', e.selection[1])
        console.log('D3Chart#####draw####unit###', unit)
        console.log('D3Chart#####draw####utickMin###', utickMin)
        console.log('D3Chart#####draw####e.selection[0] / unit + utickMin###', e.selection[0] / unit + utickMin)
        console.log('D3Chart#####draw####e.selection[1] / unit + utickMin###', e.selection[1] / unit + utickMin)

        console.log('D3Chart#####draw####this.direction###', _this.direction)

        let minPrice: any
        let maxPrice: any
        if (_this.direction) {
          minPrice = tick2UiPrice(
            e.selection[0] / unit + utickMin,
            _this.poolInfo.token_a.decimal,
            _this.poolInfo.token_b.decimal
          ).toNumber()
          maxPrice = tick2UiPrice(
            e.selection[1] / unit + utickMin,
            _this.poolInfo.token_a.decimal,
            _this.poolInfo.token_b.decimal
          ).toNumber()
        } else {
          minPrice =
            1 /
            tick2UiPrice(
              e.selection[1] / unit + utickMin,
              _this.poolInfo.token_a.decimal,
              _this.poolInfo.token_b.decimal
            ).toNumber()
          maxPrice =
            1 /
            tick2UiPrice(
              e.selection[0] / unit + utickMin,
              _this.poolInfo.token_a.decimal,
              _this.poolInfo.token_b.decimal
            ).toNumber()
        }

        console.log('D3Chart#####draw####minPrice###', minPrice)
        console.log('D3Chart#####draw####maxPrice###', maxPrice)

        _this.$emit('onChangeMinPrice', String(minPrice))
        _this.$emit('onChangeMaxPrice', String(maxPrice))
      }

      // brush selection style
      d3.select('.selection').attr('stroke', 'rgba(255, 255, 255, 0)').attr('fill', 'rgba(255, 255, 255, 0.4')
      this.isDraw = false
    }
  }
})
</script>
<style lang="less" scoped>
.chart-box {
  position: relative;
  min-height: 201px;
  .chart-loading {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50% -50%);
  }
}
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
    top: -18px;
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
      top: -30px;
    }
  }
}
</style>

