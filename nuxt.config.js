import lessToJson from 'less-to-json'
import path from 'path'

const lessVariables = lessToJson('src/styles/variables.less')

export default {
  mode: 'spa',
  router: {
    mode: 'hash'
  },
  server: {
    host: '0.0.0.0'
  },

  srcDir: './src/',
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Crema Finance | A Powerful Concentrated Liquidity Protocol',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      {
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no'
      },
      // {
      //   hid: 'description',
      //   name: 'description',
      //   content: 'Probably the Smartest DEX'
      // },
      // {
      //   'http-equiv': 'Content-Security-Policy',
      //   content: "script-src 'self'; object-src 'none'; style-src beta.hydraswap.io; child-src https:"
      // }
      {
        'http-equiv': 'Content-Security-Policy',
        content: "object-src 'none';child-src https:"
      }
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico?t=5678'
      }
    ],
    script: [
      {
        src: '/js/iconfont.js?t=2345678111'
      }
    ]
  },

  loadingIndicator: {
    // name: 'circle',
    name: 'pulse',
    // color: '#5ac4be',
    color: '#00ffd0',
    // background: '#131a35'
    background: '#000'
  },

  // loading: '@/components/Loading.vue',
  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    {
      src: '@/styles/antd.less',
      lang: 'less'
    },
    {
      src: '@/styles/global.less',
      lang: 'less'
    },
    {
      src: '@/styles/common.less',
      lang: 'less'
    }
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/axios.ts',
    '@/plugins/api.ts',
    '@/plugins/web3.ts',
    '@/plugins/notify.ts',
    '@/plugins/babel-polyfill',
    '@/plugins/lazyload.ts'
  ],
  // router: {
  //   middleware: ['route']
  // },

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
    // https://typed-vuex.roe.dev
    'nuxt-typed-vuex'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    'nuxt-clipboard',
    '@nuxtjs/dayjs',
    '@nuxtjs/google-gtag'
    // '@nuxtjs/sentry'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  clipboard: {
    autoSetContainer: true
  },

  dayjs: {
    locales: ['en'],
    defaultLocale: 'en',
    plugins: ['utc']
  },

  'google-gtag': {
    id: 'G-78BZ5BGCV5'
  },

  // sentry: {
  //   dsn: '',
  //   config: {}
  // },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [/^ant-design-vue/, '@jup-ag/core'],

    loaders: {
      less: {
        javascriptEnabled: true,
        modifyVars: lessVariables
      }
    },

    babel: {
      plugins: [
        [
          'import',
          {
            libraryName: 'ant-design-vue',
            libraryDirectory: 'lib',
            style: true
          },
          'ant-design-vue'
        ]
      ]
    },

    // extend(config) {
    //   config.resolve.alias['@ant-design/icons/lib/dist$'] = path.resolve(__dirname, './src/utils/antd-icons.ts')
    // }

    extend(config, { isDev, isClient }) {
      config.resolve.alias['@ant-design/icons/lib/dist$'] = path.resolve(__dirname, './src/utils/antd-icons.ts')
      if (isClient) {
        config.node = {
          fs: 'empty',
          child_process: 'empty'
        }
      }
      // if (isDev && isClient) {
      // config.module.rules.push({
      //   test: /\.(js)$/,
      //   loader: 'babel-loader'
      // // exclude: /(node_modules)/
      // include: /(node_modules)/
      // use: {
      //   loader: 'babel-loader',
      //   options: {
      //     // options选项里面配置的必须要写上
      //     presets: ['@babel/preset-env'],
      //     plugins: ['@babel/plugin-transform-runtime', '@babel/plugin-proposal-class-properties']
      //   }
      // }
      // })
    }
  }
}
