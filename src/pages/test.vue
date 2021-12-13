<template>
  <div class="test-container">
    <div id="main" class="chart-test"></div>
  </div>
</template>

<script lang="ts">
import { Vue } from 'nuxt-property-decorator'
import * as echarts from 'echarts'

export default Vue.extend({
  mounted() {
    const chartDom = document.getElementById('main')
    if (chartDom) {
      const myChart = echarts.init(chartDom)
      let option: any

      option = {
        xAxis: {
          // show: false,
          type: 'category',
          boundaryGap: false
          // data: [0, 100, 200, 300, 400, 500, 600]
        },
        yAxis: {
          show: false,
          type: 'value'
        },
        tooltip: {
          show: true
        },
        brush: {
          toolbox: ['lineX'],
          xAxisIndex: 'all',
          brushLink: 'all',
          outOfBrush: {
            colorAlpha: 0.1
          }
        },
        // dataZoom: [
        //   {
        //     type: 'slider',
        //     top: '20%',
        //     bottom: '24%',
        //     moveHandleSize: 1
        //   }
        // ],
        series: [
          {
            // data: [
            //   820, 932, 901, 934, 1290, 1330, 1320, 820, 932, 901, 934, 1290, 1330, 1320, 820, 932, 901, 934, 1290,
            //   1330, 1320, 820, 932, 901, 934, 1290, 1330, 1320
            // ],
            data: [
              [0, 820],
              [10, 821],
              [20, 831],
              [30, 841],
              [40, 851],
              [50, 861],
              [60, 871],
              [70, 881],
              [80, 891],
              [90, 901],
              [100, 911],
              [110, 921],
              [120, 931],
              [130, 941],
              [140, 951],
              [150, 961],
              [160, 971],
              [170, 981],
              [180, 991],
              [190, 1001],
              [200, 1011],
              [210, 1021],
              [220, 1031],
              [230, 1041],
              [240, 1051],
              [250, 1061],
              [260, 1071],
              [270, 1081],
              [280, 1091],
              [290, 1101],
              [300, 1111],

              [310, 1101],
              [320, 1091],
              [330, 1081],
              [340, 1071],
              [350, 1061],
              [360, 1051],
              [370, 1041],
              [380, 1031],
              [390, 1021],
              [400, 1011],
              [410, 1001],
              [420, 990],
              [430, 980],
              [440, 970],
              [450, 960],
              [460, 950],
              [470, 940],
              [480, 930],
              [490, 920],
              [500, 910],
              [510, 900],
              [520, 890],
              [530, 880],
              [540, 870],
              [550, 860],
              [560, 850],
              [570, 840],
              [580, 830],
              [590, 820],
              [600, 810]
            ],
            type: 'line',
            // symbolSize: 0,
            showSymbol: false,
            // lineStyle: {
            //   color: 'rgba(0,0,0,0)',
            //   width: 0
            // },
            areaStyle: {
              // color: 'rgba(0,0,0,0)',
              // opacity: 0
            }
          }
        ]
      }

      // myChart.dispatchAction({
      //   type: 'brush',
      //   areas: [
      //     {
      //       brushType: 'lineX',
      //       coordRange: [300, 400],
      //       xAxisIndex: 0
      //     }
      //   ]
      // })

      option && myChart.setOption(option)

      myChart.dispatchAction({
        type: 'brush',
        areas: [
          {
            brushType: 'lineX',
            coordRange: [29, 32],
            xAxisIndex: 0
          }
        ]
      })
    }
  }
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
