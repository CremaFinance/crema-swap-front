(window.webpackJsonp=window.webpackJsonp||[]).push([[13],{3265:function(t,n,o){"use strict";o(520),o(3269)},3266:function(t,n,o){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.SpinProps=void 0;var e=o(3271);Object.defineProperty(n,"SpinProps",{enumerable:!0,get:function(){return e.SpinProps}});var r=d(e),l=d(o(481));function d(t){return t&&t.__esModule?t:{default:t}}r.default.setDefaultIndicator=e.setDefaultIndicator,r.default.install=function(t){t.use(l.default),t.component(r.default.name,r.default)},n.default=r.default},3269:function(t,n,o){var content=o(3270);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,o(243).default)("c0e78406",content,!0,{sourceMap:!1})},3270:function(t,n,o){var e=o(242)(!1);e.push([t.i,'.ant-spin{box-sizing:border-box;margin:0;padding:0;color:#f1f1f2;font-size:14px;font-variant:tabular-nums;line-height:1.5;list-style:none;font-feature-settings:"tnum","tnum";position:absolute;display:none;color:#07ebad;text-align:center;vertical-align:middle;opacity:0;transition:transform .3s cubic-bezier(.78,.14,.15,.86)}.ant-spin-spinning{position:static;display:inline-block;opacity:1}.ant-spin-nested-loading{position:relative}.ant-spin-nested-loading>div>.ant-spin{position:absolute;top:0;left:0;z-index:4;display:block;width:100%;height:100%;max-height:400px}.ant-spin-nested-loading>div>.ant-spin .ant-spin-dot{position:absolute;top:50%;left:50%;margin:-10px}.ant-spin-nested-loading>div>.ant-spin .ant-spin-text{position:absolute;top:50%;width:100%;padding-top:5px;text-shadow:0 1px 2px #fff}.ant-spin-nested-loading>div>.ant-spin.ant-spin-show-text .ant-spin-dot{margin-top:-20px}.ant-spin-nested-loading>div>.ant-spin-sm .ant-spin-dot{margin:-7px}.ant-spin-nested-loading>div>.ant-spin-sm .ant-spin-text{padding-top:2px}.ant-spin-nested-loading>div>.ant-spin-sm.ant-spin-show-text .ant-spin-dot{margin-top:-17px}.ant-spin-nested-loading>div>.ant-spin-lg .ant-spin-dot{margin:-16px}.ant-spin-nested-loading>div>.ant-spin-lg .ant-spin-text{padding-top:11px}.ant-spin-nested-loading>div>.ant-spin-lg.ant-spin-show-text .ant-spin-dot{margin-top:-26px}.ant-spin-container{position:relative;transition:opacity .3s}.ant-spin-container:after{position:absolute;top:0;right:0;bottom:0;left:0;z-index:10;display:none\\9;width:100%;height:100%;background:#fff;opacity:0;transition:all .3s;content:"";pointer-events:none}.ant-spin-blur{clear:both;overflow:hidden;opacity:.5;-webkit-user-select:none;-moz-user-select:none;user-select:none;pointer-events:none}.ant-spin-blur:after{opacity:.4;pointer-events:auto}.ant-spin-tip{color:rgba(0,0,0,.45)}.ant-spin-dot{position:relative;display:inline-block;font-size:20px;width:1em;height:1em}.ant-spin-dot-item{position:absolute;display:block;width:9px;height:9px;background-color:#07ebad;border-radius:100%;transform:scale(.75);transform-origin:50% 50%;opacity:.3;animation:antSpinMove 1s linear infinite alternate}.ant-spin-dot-item:first-child{top:0;left:0}.ant-spin-dot-item:nth-child(2){top:0;right:0;animation-delay:.4s}.ant-spin-dot-item:nth-child(3){right:0;bottom:0;animation-delay:.8s}.ant-spin-dot-item:nth-child(4){bottom:0;left:0;animation-delay:1.2s}.ant-spin-dot-spin{transform:rotate(45deg);animation:antRotate 1.2s linear infinite}.ant-spin-sm .ant-spin-dot{font-size:14px}.ant-spin-sm .ant-spin-dot i{width:6px;height:6px}.ant-spin-lg .ant-spin-dot{font-size:32px}.ant-spin-lg .ant-spin-dot i{width:14px;height:14px}.ant-spin.ant-spin-show-text .ant-spin-text{display:block}@media (-ms-high-contrast:active),(-ms-high-contrast:none){.ant-spin-blur{background:#fff;opacity:.5}}@keyframes antSpinMove{to{opacity:1}}@keyframes antRotate{to{transform:rotate(405deg)}}',""]),t.exports=e},3271:function(t,n,o){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.SpinProps=n.SpinSize=void 0;var e=x(o(344)),r=x(o(323)),l=x(o(521));n.setDefaultIndicator=function(t){w="function"==typeof t.indicator?t.indicator:function(n){return n(t.indicator)}};var d=x(o(3272)),f=x(o(165)),c=x(o(324)),m=o(190),h=o(402),v=o(457);function x(t){return t&&t.__esModule?t:{default:t}}var C=n.SpinSize=f.default.oneOf(["small","default","large"]),y=n.SpinProps=function(){return{prefixCls:f.default.string,spinning:f.default.bool,size:C,wrapperClassName:f.default.string,tip:f.default.string,delay:f.default.number,indicator:f.default.any}},w=void 0;n.default={name:"ASpin",mixins:[c.default],props:(0,m.initDefaultProps)(y(),{size:"default",spinning:!0,wrapperClassName:""}),inject:{configProvider:{default:function(){return v.ConfigConsumerProps}}},data:function(){var t=this.spinning,n=function(t,n){return!!t&&!!n&&!isNaN(Number(n))}(t,this.delay);return this.originalUpdateSpinning=this.updateSpinning,this.debouncifyUpdateSpinning(this.$props),{sSpinning:t&&!n}},mounted:function(){this.updateSpinning()},updated:function(){var t=this;this.$nextTick((function(){t.debouncifyUpdateSpinning(),t.updateSpinning()}))},beforeDestroy:function(){this.cancelExistingSpin()},methods:{debouncifyUpdateSpinning:function(t){var n=(t||this.$props).delay;n&&(this.cancelExistingSpin(),this.updateSpinning=(0,d.default)(this.originalUpdateSpinning,n))},updateSpinning:function(){var t=this.spinning;this.sSpinning!==t&&this.setState({sSpinning:t})},cancelExistingSpin:function(){var t=this.updateSpinning;t&&t.cancel&&t.cancel()},getChildren:function(){return this.$slots&&this.$slots.default?(0,m.filterEmpty)(this.$slots.default):null},renderIndicator:function(t,n){var o=n+"-dot",e=(0,m.getComponentFromProp)(this,"indicator");return null===e?null:(Array.isArray(e)&&(e=1===(e=(0,m.filterEmpty)(e)).length?e[0]:e),(0,m.isValidElement)(e)?(0,h.cloneElement)(e,{class:o}):w&&(0,m.isValidElement)(w(t))?(0,h.cloneElement)(w(t),{class:o}):t("span",{class:o+" "+n+"-dot-spin"},[t("i",{class:n+"-dot-item"}),t("i",{class:n+"-dot-item"}),t("i",{class:n+"-dot-item"}),t("i",{class:n+"-dot-item"})]))}},render:function(t){var n,o=this.$props,d=o.size,f=o.prefixCls,c=o.tip,h=o.wrapperClassName,v=(0,l.default)(o,["size","prefixCls","tip","wrapperClassName"]),x=(0,this.configProvider.getPrefixCls)("spin",f),C=this.sSpinning,y=(n={},(0,r.default)(n,x,!0),(0,r.default)(n,x+"-sm","small"===d),(0,r.default)(n,x+"-lg","large"===d),(0,r.default)(n,x+"-spinning",C),(0,r.default)(n,x+"-show-text",!!c),n),w=t("div",(0,e.default)([v,{class:y}]),[this.renderIndicator(t,x),c?t("div",{class:x+"-text"},[c]):null]),_=this.getChildren();if(_){var S,k=(S={},(0,r.default)(S,x+"-container",!0),(0,r.default)(S,x+"-blur",C),S);return t("div",(0,e.default)([{on:(0,m.getListeners)(this)},{class:[x+"-nested-loading",h]}]),[C&&t("div",{key:"loading"},[w]),t("div",{class:k,key:"container"},[_])])}return w}}},3272:function(t,n,o){var e=o(677),r=o(3273),l=o(3274),d=Math.max,f=Math.min;t.exports=function(t,n,o){var c,m,h,v,x,C,y=0,w=!1,_=!1,S=!0;if("function"!=typeof t)throw new TypeError("Expected a function");function k(time){var n=c,o=m;return c=m=void 0,y=time,v=t.apply(o,n)}function N(time){return y=time,x=setTimeout(A,n),w?k(time):v}function I(time){var t=time-C;return void 0===C||t>=n||t<0||_&&time-y>=h}function A(){var time=r();if(I(time))return z(time);x=setTimeout(A,function(time){var t=n-(time-C);return _?f(t,h-(time-y)):t}(time))}function z(time){return x=void 0,S&&c?k(time):(c=m=void 0,v)}function P(){var time=r(),t=I(time);if(c=arguments,m=this,C=time,t){if(void 0===x)return N(C);if(_)return clearTimeout(x),x=setTimeout(A,n),k(C)}return void 0===x&&(x=setTimeout(A,n)),v}return n=l(n)||0,e(o)&&(w=!!o.leading,h=(_="maxWait"in o)?d(l(o.maxWait)||0,n):h,S="trailing"in o?!!o.trailing:S),P.cancel=function(){void 0!==x&&clearTimeout(x),y=0,c=C=m=x=void 0},P.flush=function(){return void 0===x?v:z(r())},P}},3273:function(t,n,o){var e=o(428);t.exports=function(){return e.Date.now()}},3274:function(t,n,o){var e=o(3275),r=o(677),l=o(3277),d=/^[-+]0x[0-9a-f]+$/i,f=/^0b[01]+$/i,c=/^0o[0-7]+$/i,m=parseInt;t.exports=function(t){if("number"==typeof t)return t;if(l(t))return NaN;if(r(t)){var n="function"==typeof t.valueOf?t.valueOf():t;t=r(n)?n+"":n}if("string"!=typeof t)return 0===t?t:+t;t=e(t);var o=f.test(t);return o||c.test(t)?m(t.slice(2),o?2:8):d.test(t)?NaN:+t}},3275:function(t,n,o){var e=o(3276),r=/^\s+/;t.exports=function(t){return t?t.slice(0,e(t)+1).replace(r,""):t}},3276:function(t,n){var o=/\s/;t.exports=function(t){for(var n=t.length;n--&&o.test(t.charAt(n)););return n}},3277:function(t,n,o){var e=o(678),r=o(572);t.exports=function(t){return"symbol"==typeof t||r(t)&&"[object Symbol]"==e(t)}},3570:function(t,n,o){var content=o(3767);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,o(243).default)("a3102ab2",content,!0,{sourceMap:!1})},3615:function(t,n,o){"use strict";o.r(n);o(134),o(3265);var e=o(3266),r=o.n(e),progress=(o(3371),o(3372)),l=o.n(progress),d=(o(58),o(236),o(69)),f=o(108),c=d.default.extend({components:{Progress:l.a,Spin:r.a},props:{poolInfo:{type:Object,default:function(){return{}}},fromCoin:{type:Object,default:function(){return{}}},toCoin:{type:Object,default:function(){return{}}},fromCoinAmount:{type:String,default:""},toCoinAmount:{type:String,default:""},fixedFromCoin:{type:Boolean,default:!0},dataIsLoading:{type:Boolean,default:!1},currentPriceView:{type:String||Number,default:""},currentPriceViewReverse:{type:String||Number,default:""},exchange:{type:Boolean,default:!0}},data:function(){return{autoRefreshTime:20,countdown:0,refreshTimer:null,direction:!1}},computed:{defaultRates:function(){var t,n,o,e;return this.poolInfo&&(null===(t=this.fromCoin)||void 0===t?void 0:t.symbol.toLowerCase())===this.poolInfo.token_a.symbol.toLowerCase()&&(null===(n=this.toCoin)||void 0===n?void 0:n.symbol.toLowerCase())===this.poolInfo.token_b.symbol.toLowerCase()?this.poolInfo.currentPriceView:this.poolInfo&&(null===(o=this.fromCoin)||void 0===o?void 0:o.symbol.toLowerCase())===this.poolInfo.token_b.symbol.toLowerCase()&&(null===(e=this.toCoin)||void 0===e?void 0:e.symbol.toLowerCase())===this.poolInfo.token_a.symbol.toLowerCase()?this.poolInfo.currentPriceViewReverse:""}},watch:{poolInfo:{handler:"poolInfoWatch",immediate:!0}},mounted:function(){this.setRefreshTimer()},destroyed:function(){clearInterval(this.refreshTimer),this.refreshTimer=null},methods:{decimalUi:f.d,fixD:f.e,poolInfoWatch:function(t,n){console.log("swapInfo###poolInfoWatch###poolInfo###",t),console.log("swapInfo###poolInfoWatch###old###",n),(null==t?void 0:t.name)!==(null==n?void 0:n.name)&&(this.isChangePool=!0)},toRefreshData:function(){this.countdown=0,this.$emit("automatic")},setRefreshTimer:function(){var t=this;this.refreshTimer=setInterval((function(){t.loading||t.countdown<t.autoRefreshTime&&(t.countdown+=1,t.countdown===t.autoRefreshTime&&t.toRefreshData())}),1e3)}}}),m=(o(3766),o(244)),component=Object(m.a)(c,(function(){var t=this,n=t._self._c;t._self._setupProxy;return n("div",{staticClass:"swap-info"},[n("div",{staticClass:"swap-info-bg"}),t._v(" "),n("h3",{staticClass:"title"},[n("span",[t._v("Price Info")]),t._v(" "),n("Progress",{class:t.dataIsLoading?"disabled":"",attrs:{type:"circle",width:14,"stroke-width":10,percent:100/t.autoRefreshTime*t.countdown,"show-info":!1},on:{click:t.toRefreshData}})],1),t._v(" "),n("div",{staticClass:"block"},[n("span",[t._v("Exchange Rate")]),t._v(" "),n("div",{staticClass:"right"},[t.fromCoin&&t.toCoin&&Number(t.fromCoinAmount)&&Number(t.toCoinAmount)&&t.defaultRates&&!t.exchange?n("div",[Number(t.fromCoinAmount)&&Number(t.toCoinAmount)&&!t.direction?n("span",[t._v("\n          1 "+t._s(t.fromCoin.symbol)+" ≈ "+t._s(t.decimalUi(Number(t.toCoinAmount)/Number(t.fromCoinAmount),t.toCoin.decimal))+"\n          "+t._s(t.toCoin.symbol)+"\n        ")]):Number(t.fromCoinAmount)&&Number(t.toCoinAmount)&&t.direction?n("span",[t._v("\n          1 "+t._s(t.toCoin.symbol)+" ≈ "+t._s(t.decimalUi(Number(t.fromCoinAmount)/Number(t.toCoinAmount),t.fromCoin.decimal))+"\n          "+t._s(t.fromCoin.symbol)+"\n        ")]):t._e(),t._v(" "),Number(t.fromCoinAmount)&&(Number(t.toCoinAmount)||t.direction)?!Number(t.fromCoinAmount)||!Number(t.toCoinAmount)&&t.direction?n("span",[t._v("1 "+t._s(t.toCoin.symbol)+" ≈ "+t._s(t.decimalUi(Number(t.defaultRates),t.fromCoin.decimal))+" "+t._s(t.fromCoin.symbol))]):t._e():n("span",[t._v("1 "+t._s(t.fromCoin.symbol)+" ≈ "+t._s(t.decimalUi(Number(t.defaultRates),t.toCoin.decimal))+" "+t._s(t.toCoin.symbol))]),t._v(" "),n("svg",{staticClass:"icon",attrs:{"aria-hidden":"true"},on:{click:function(n){t.direction=!t.direction}}},[n("use",{attrs:{"xlink:href":"#icon-icon-swap"}})])]):t._e(),t._v(" "),!t.fromCoin||!t.toCoin||Number(t.fromCoinAmount)&&Number(t.toCoinAmount)||t.exchange?t._e():n("div",[t.direction?n("span",[t._v("1 "+t._s(t.fromCoin.symbol)+" ≈ "+t._s(t.decimalUi(Number(t.defaultRates),t.toCoin.decimal))+" "+t._s(t.toCoin.symbol))]):n("span",[t._v("1 "+t._s(t.toCoin.symbol)+" ≈ "+t._s(t.decimalUi(Number(t.defaultRates),t.fromCoin.decimal))+" "+t._s(t.fromCoin.symbol))]),t._v(" "),n("svg",{staticClass:"icon",attrs:{"aria-hidden":"true"},on:{click:function(n){t.direction=!t.direction}}},[n("use",{attrs:{"xlink:href":"#icon-icon-swap"}})])]),t._v(" "),t.exchange?n("Spin",{attrs:{size:"small"}}):t._e()],1)]),t._v(" "),[n("div",{staticClass:"block"},[n("span",[t._v(t._s(t.fixedFromCoin?"Minimum Received":"Maximum Sold"))]),t._v(" "),t.toCoinAmount&&t.fromCoinAmount&&!t.exchange?n("div",{staticClass:"right"},[t._v("\n        "+t._s(t.fixedFromCoin?t.fixD(Number(t.toCoinAmount)/(1+Number(t.$accessor.slippage)/100),t.toCoin.decimal):t.fixD(t.fromCoinAmount*(1+Number(t.$accessor.slippage)/100),t.toCoin.decimal))+"\n        "+t._s(t.fixedFromCoin?t.toCoin.symbol:t.fromCoin.symbol)+"\n      ")]):n("Spin",{attrs:{size:"small"}})],1),t._v(" "),n("div",{staticClass:"block"},[n("span",[t._v("Fee")]),t._v(" "),t.poolInfo&&!t.exchange?n("div",{staticClass:"right"},[t._v(t._s(t.poolInfo.fee))]):n("Spin",{attrs:{size:"small"}})],1)]],2)}),[],!1,null,"3d1750a8",null);n.default=component.exports},3766:function(t,n,o){"use strict";o(3570)},3767:function(t,n,o){var e=o(242)(!1);e.push([t.i,".swap-info[data-v-3d1750a8]{width:440px;background:linear-gradient(270deg,rgba(0,0,0,.4),rgba(33,33,33,.4));border-radius:20px;padding:50px 20px 20px;margin:-30px auto 0;position:relative;z-index:10}.swap-info .swap-info-bg[data-v-3d1750a8]{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:346px;height:32px;background:linear-gradient(270deg,#78cfff,#596cff 50%,#b390ff);z-index:1;filter:blur(40px)}.swap-info .title[data-v-3d1750a8]{font-size:14px;color:#fff}.swap-info>.block[data-v-3d1750a8]{display:flex;align-items:center;justify-content:space-between;margin-top:12px;font-size:12px;height:20px;position:relative;z-index:10}.swap-info>.block>span[data-v-3d1750a8]{color:#b5b8c2}.swap-info>.block .right[data-v-3d1750a8]{color:#fff}.swap-info>.block .right[data-v-3d1750a8],.swap-info>.block .right>div[data-v-3d1750a8]{display:flex;align-items:center}.swap-info>.block .right .ant-progress[data-v-3d1750a8]{margin-left:6px;margin-bottom:3px}.swap-info>.block .right svg[data-v-3d1750a8]{width:20px;height:20px;fill:hsla(0,0%,100%,.5)}.swap-info>.block .right svg[data-v-3d1750a8]:hover{fill:#fff}@media screen and (max-width:750px){.swap-info[data-v-3d1750a8]{width:100%}.swap-info>.block[data-v-3d1750a8]{font-size:12px}}",""]),t.exports=e}}]);