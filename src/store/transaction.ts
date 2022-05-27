import { Context, SignatureResult } from '@solana/web3.js'
import { actionTree, getterTree, mutationTree } from 'typed-vuex'

import { getUnixTs } from '@/utils'
import LocalStorage from '@/utils/local-storage'
import logger from '@/utils/logger'

type TxHistoryInfo = { status: 'Succeed' | 'Fail' | 'Pending' | 'Droped'; description: string; time: number }
export const state = () => {
  try {
    return {
      history: JSON.parse(LocalStorage.get('RAY_TX_HISTORY') ?? '{}'),
      currentTransactionDesc: '',
      currentTransactionTxid: '',
      showWaiting: false,
      showSubmitted: false
    }
  } catch (err) {
    return {
      history: {},
      currentTransactionDesc: '',
      currentTransactionTxid: '',
      showWaiting: false,
      showSubmitted: false
    }
  }
}

export const getters = getterTree(state, {})

export const mutations = mutationTree(state, {
  setShowWaiting(state, status: boolean) {
    state.showWaiting = status
  },
  setShowSubmitted(state, status: boolean) {
    state.showWaiting = false
    state.showSubmitted = status
  },
  setTransactionDesc(state, desc: string) {
    state.currentTransactionDesc = desc
  },
  pushTx(
    state: any,
    { txid, description, walletAddress }: { txid: string; description: string; walletAddress: string }
  ) {
    state.currentTransactionTxid = txid
    const wholeHistory = { ...state.history }
    const targetHistory = wholeHistory[walletAddress] ?? {}

    if (Object.keys(targetHistory).length >= 20) {
      const earliestTime = Math.min(...Object.values(targetHistory).map((o: any) => o.time))
      const [earliestTxid] =
        Object.entries<TxHistoryInfo>(targetHistory).find(([, { time }]) => time === earliestTime) ?? []
      delete targetHistory[earliestTxid ?? '']
    }

    targetHistory[txid] = {
      status: 'pending',
      description,
      time: getUnixTs()
    }

    state.history = { ...wholeHistory, [walletAddress]: targetHistory }
    LocalStorage.set('RAY_TX_HISTORY', JSON.stringify(state.history))
  },

  setListenerId(
    state: any,
    { txid, listenerId, walletAddress }: { txid: string; listenerId: number; walletAddress: string }
  ) {
    const wholeHistory = { ...state.history }
    const targetHistory = wholeHistory[walletAddress] ?? {}

    // listenerId
    targetHistory[txid] = { ...targetHistory[txid], ...{ listenerId } }

    state.history = { ...wholeHistory, [walletAddress]: targetHistory }
    LocalStorage.set('RAY_TX_HISTORY', JSON.stringify(state.history))
  },

  setTxStatus(
    state: any,
    { txid, status, block, walletAddress }: { txid: string; status: string; block: number; walletAddress: string }
  ) {
    const wholeHistory = { ...state.history }
    const targetHistory = wholeHistory[walletAddress] ?? {}

    targetHistory[txid] = { ...targetHistory[txid], ...{ status, block } }

    state.history = { ...wholeHistory, [walletAddress]: targetHistory }
    LocalStorage.set('RAY_TX_HISTORY', JSON.stringify(state.history))
  }
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    setShowWaiting({ commit }, status: boolean) {
      commit('setShowWaiting', status)
    },
    setShowSubmitted({ commit }, status: boolean) {
      commit('setShowSubmitted', status)
    },
    setTransactionDesc({ commit }, desc: string) {
      commit('setTransactionDesc', desc)
    },
    sub(
      { commit },
      {
        txid,
        description,
        type = '',
        successCallback,
        errorCallback
      }: { txid: string; description: string; type: string; successCallback: any; errorCallback: any }
    ) {
      const walletAddress = this.$accessor.wallet?.address
      commit('pushTx', { txid, description, walletAddress })
      logger('Sub', txid)

      const conn = this.$web3
      const notify = this.$notify
      if (type) {
        notify.info({
          key: txid + 'loading',
          icon: (h: any) =>
            h('img', {
              class: { 'notify-icon': true, 'loading-animate': true },
              attrs: { src: '/icon-loading.png' }
            }),
          message: (h: any) => h('div', { style: 'color: #fff' }, 'Confirming transaction'),
          description: (h: any) =>
            h('div', {}, [
              h(
                'a',
                {
                  style: { color: '#b5b8c2', 'text-decoration': 'underline' },
                  class: { 'notify-link': true },
                  attrs: {
                    href: `https://solscan.io/tx/${txid}`,
                    target: '_blank'
                  }
                },
                'View transaction'
              ),
              h('span', {}, `: ${type}`)
            ]),
          duration: 0
        })
      }

      const listenerId = conn.onSignature(
        txid,
        function (signatureResult: SignatureResult, context: Context) {
          notify.close(txid + 'loading')
          const { slot } = context

          if (!signatureResult.err) {
            // success
            commit('setTxStatus', { txid, status: 'success', block: slot, walletAddress })

            notify.success({
              key: txid,
              icon: (h: any) =>
                h('img', {
                  class: { 'notify-icon': true },
                  attrs: { src: '/icon_Copied@2x.png' }
                }),
              message: (h: any) => h('div', { style: 'color: #07EBAD' }, 'Transaction has been confirmed'),
              description
            })
            if (successCallback) {
              successCallback()
            }
          } else {
            // fail
            commit('setTxStatus', { txid, status: 'fail', block: slot, walletAddress })

            notify.error({
              key: txid,
              message: 'Transaction failed',
              description
            })
            if (errorCallback) {
              errorCallback()
            }
          }
        },
        'single'
      )

      commit('setListenerId', { txid, listenerId: listenerId + 1, walletAddress })
    }
  }
)
