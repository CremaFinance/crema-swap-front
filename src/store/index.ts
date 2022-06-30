import * as url from './url'
import * as route from './route'
import * as price from './price'
import * as setting from './setting'
import * as wallet from './wallet'
import * as swap from './swap'
import * as liquidity from './liquidity'
import * as farm from './farm'
import * as farming from './farming'
import * as farmingv2 from './farmingv2'
import * as transaction from './transaction'

import { getAccessorType, mutationTree, actionTree } from 'typed-vuex'

import enquireJs from 'enquire.js'

function enquireScreen(call: Function) {
  const handler = {
    match() {
      call && call(true)
    },
    unmatch() {
      call && call(false)
    }
  }

  enquireJs.register('only screen and (max-width: 922.99px)', handler)
}

export const state = () => ({
  isMobile: false,
  slippage: '1',
  showNetWorkWarnning: false
})

export type RootState = ReturnType<typeof state>

export const getters = {}

export const mutations = mutationTree(state, {
  setIsMobile(state, isMobile: boolean) {
    state.isMobile = isMobile
  },
  setSlippage(state, slippage: string) {
    state.slippage = slippage
    localStorage.setItem('crema-slippage', slippage)
  },
  setNetWorkWarnning(state, value) {
    state.showNetWorkWarnning = value
  }
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    queryIsMobile({ commit }) {
      enquireScreen((isMobile: boolean) => commit('setIsMobile', isMobile))
    },

    copy(_vuexContext, text: string) {
      ; (this as any)._vm
        .$copyText(text)
        .then(() => {
          this.$notify.success({
            message: 'Copy success',
            description: '',
            class: 'success',
            icon: (h: any) => h('img', { class: { 'notify-icon': true }, attrs: { src: '/icon_Copied@2x.png' } })
          })
        })
        .catch(() => {
          this.$notify.error({
            message: 'Copy failed',
            description: '',
            class: 'error',
            icon: (h: any) => h('img', { class: { 'notify-icon': true }, attrs: { src: '/icon_Error@2x.png' } })
          })
        })
    },

    setSlippage({ commit }, slippage) {
      commit('setSlippage', slippage)
    },
    setNetWorkWarnning({ commit }, value) {
      commit('setNetWorkWarnning', value)
    }
  }
)

export const accessorType = getAccessorType({
  actions,
  getters,
  mutations,
  state,
  modules: {
    url,
    route,
    price,
    setting,
    wallet,
    swap,
    liquidity,
    farm,
    farming,
    farmingv2,
    transaction
  }
})
