(window.webpackJsonp=window.webpackJsonp||[]).push([[16],{1973:function(t,o,n){"use strict";n(290),n(1988)},1974:function(t,o,n){"use strict";Object.defineProperty(o,"__esModule",{value:!0}),o.SpinProps=void 0;var e=n(1990);Object.defineProperty(o,"SpinProps",{enumerable:!0,get:function(){return e.SpinProps}});var l=c(e),r=c(n(224));function c(t){return t&&t.__esModule?t:{default:t}}l.default.setDefaultIndicator=e.setDefaultIndicator,l.default.install=function(t){t.use(r.default),t.component(l.default.name,l.default)},o.default=l.default},1988:function(t,o,n){var content=n(1989);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(88).default)("c0e78406",content,!0,{sourceMap:!1})},1989:function(t,o,n){var e=n(87)(!1);e.push([t.i,'.ant-spin{box-sizing:border-box;margin:0;padding:0;color:#f1f1f2;font-size:14px;font-variant:tabular-nums;line-height:1.5;list-style:none;font-feature-settings:"tnum","tnum";position:absolute;display:none;color:#07ebad;text-align:center;vertical-align:middle;opacity:0;transition:transform .3s cubic-bezier(.78,.14,.15,.86)}.ant-spin-spinning{position:static;display:inline-block;opacity:1}.ant-spin-nested-loading{position:relative}.ant-spin-nested-loading>div>.ant-spin{position:absolute;top:0;left:0;z-index:4;display:block;width:100%;height:100%;max-height:400px}.ant-spin-nested-loading>div>.ant-spin .ant-spin-dot{position:absolute;top:50%;left:50%;margin:-10px}.ant-spin-nested-loading>div>.ant-spin .ant-spin-text{position:absolute;top:50%;width:100%;padding-top:5px;text-shadow:0 1px 2px #fff}.ant-spin-nested-loading>div>.ant-spin.ant-spin-show-text .ant-spin-dot{margin-top:-20px}.ant-spin-nested-loading>div>.ant-spin-sm .ant-spin-dot{margin:-7px}.ant-spin-nested-loading>div>.ant-spin-sm .ant-spin-text{padding-top:2px}.ant-spin-nested-loading>div>.ant-spin-sm.ant-spin-show-text .ant-spin-dot{margin-top:-17px}.ant-spin-nested-loading>div>.ant-spin-lg .ant-spin-dot{margin:-16px}.ant-spin-nested-loading>div>.ant-spin-lg .ant-spin-text{padding-top:11px}.ant-spin-nested-loading>div>.ant-spin-lg.ant-spin-show-text .ant-spin-dot{margin-top:-26px}.ant-spin-container{position:relative;transition:opacity .3s}.ant-spin-container:after{position:absolute;top:0;right:0;bottom:0;left:0;z-index:10;display:none\\9;width:100%;height:100%;background:#fff;opacity:0;transition:all .3s;content:"";pointer-events:none}.ant-spin-blur{clear:both;overflow:hidden;opacity:.5;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;pointer-events:none}.ant-spin-blur:after{opacity:.4;pointer-events:auto}.ant-spin-tip{color:rgba(0,0,0,.45)}.ant-spin-dot{position:relative;display:inline-block;font-size:20px;width:1em;height:1em}.ant-spin-dot-item{position:absolute;display:block;width:9px;height:9px;background-color:#07ebad;border-radius:100%;transform:scale(.75);transform-origin:50% 50%;opacity:.3;-webkit-animation:antSpinMove 1s linear infinite alternate;animation:antSpinMove 1s linear infinite alternate}.ant-spin-dot-item:first-child{top:0;left:0}.ant-spin-dot-item:nth-child(2){top:0;right:0;-webkit-animation-delay:.4s;animation-delay:.4s}.ant-spin-dot-item:nth-child(3){right:0;bottom:0;-webkit-animation-delay:.8s;animation-delay:.8s}.ant-spin-dot-item:nth-child(4){bottom:0;left:0;-webkit-animation-delay:1.2s;animation-delay:1.2s}.ant-spin-dot-spin{transform:rotate(45deg);-webkit-animation:antRotate 1.2s linear infinite;animation:antRotate 1.2s linear infinite}.ant-spin-sm .ant-spin-dot{font-size:14px}.ant-spin-sm .ant-spin-dot i{width:6px;height:6px}.ant-spin-lg .ant-spin-dot{font-size:32px}.ant-spin-lg .ant-spin-dot i{width:14px;height:14px}.ant-spin.ant-spin-show-text .ant-spin-text{display:block}@media (-ms-high-contrast:active),(-ms-high-contrast:none){.ant-spin-blur{background:#fff;opacity:.5}}@-webkit-keyframes antSpinMove{to{opacity:1}}@keyframes antSpinMove{to{opacity:1}}@-webkit-keyframes antRotate{to{transform:rotate(405deg)}}@keyframes antRotate{to{transform:rotate(405deg)}}',""]),t.exports=e},1990:function(t,o,n){"use strict";Object.defineProperty(o,"__esModule",{value:!0}),o.SpinProps=o.SpinSize=void 0;var e=v(n(140)),l=v(n(135)),r=v(n(291));o.setDefaultIndicator=function(t){k="function"==typeof t.indicator?t.indicator:function(o){return o(t.indicator)}};var c=v(n(1991)),d=v(n(49)),m=v(n(136)),f=n(62),h=n(172),x=n(206);function v(t){return t&&t.__esModule?t:{default:t}}var y=o.SpinSize=d.default.oneOf(["small","default","large"]),w=o.SpinProps=function(){return{prefixCls:d.default.string,spinning:d.default.bool,size:y,wrapperClassName:d.default.string,tip:d.default.string,delay:d.default.number,indicator:d.default.any}},k=void 0;o.default={name:"ASpin",mixins:[m.default],props:(0,f.initDefaultProps)(w(),{size:"default",spinning:!0,wrapperClassName:""}),inject:{configProvider:{default:function(){return x.ConfigConsumerProps}}},data:function(){var t=this.spinning,o=function(t,o){return!!t&&!!o&&!isNaN(Number(o))}(t,this.delay);return this.originalUpdateSpinning=this.updateSpinning,this.debouncifyUpdateSpinning(this.$props),{sSpinning:t&&!o}},mounted:function(){this.updateSpinning()},updated:function(){var t=this;this.$nextTick((function(){t.debouncifyUpdateSpinning(),t.updateSpinning()}))},beforeDestroy:function(){this.cancelExistingSpin()},methods:{debouncifyUpdateSpinning:function(t){var o=(t||this.$props).delay;o&&(this.cancelExistingSpin(),this.updateSpinning=(0,c.default)(this.originalUpdateSpinning,o))},updateSpinning:function(){var t=this.spinning;this.sSpinning!==t&&this.setState({sSpinning:t})},cancelExistingSpin:function(){var t=this.updateSpinning;t&&t.cancel&&t.cancel()},getChildren:function(){return this.$slots&&this.$slots.default?(0,f.filterEmpty)(this.$slots.default):null},renderIndicator:function(t,o){var n=o+"-dot",e=(0,f.getComponentFromProp)(this,"indicator");return null===e?null:(Array.isArray(e)&&(e=1===(e=(0,f.filterEmpty)(e)).length?e[0]:e),(0,f.isValidElement)(e)?(0,h.cloneElement)(e,{class:n}):k&&(0,f.isValidElement)(k(t))?(0,h.cloneElement)(k(t),{class:n}):t("span",{class:n+" "+o+"-dot-spin"},[t("i",{class:o+"-dot-item"}),t("i",{class:o+"-dot-item"}),t("i",{class:o+"-dot-item"}),t("i",{class:o+"-dot-item"})]))}},render:function(t){var o,n=this.$props,c=n.size,d=n.prefixCls,m=n.tip,h=n.wrapperClassName,x=(0,r.default)(n,["size","prefixCls","tip","wrapperClassName"]),v=(0,this.configProvider.getPrefixCls)("spin",d),y=this.sSpinning,w=(o={},(0,l.default)(o,v,!0),(0,l.default)(o,v+"-sm","small"===c),(0,l.default)(o,v+"-lg","large"===c),(0,l.default)(o,v+"-spinning",y),(0,l.default)(o,v+"-show-text",!!m),o),k=t("div",(0,e.default)([x,{class:w}]),[this.renderIndicator(t,v),m?t("div",{class:v+"-text"},[m]):null]),_=this.getChildren();if(_){var C,P=(C={},(0,l.default)(C,v+"-container",!0),(0,l.default)(C,v+"-blur",y),C);return t("div",(0,e.default)([{on:(0,f.getListeners)(this)},{class:[v+"-nested-loading",h]}]),[y&&t("div",{key:"loading"},[k]),t("div",{class:P,key:"container"},[_])])}return k}}},1991:function(t,o,n){var e=n(364),l=n(1992),r=n(1993),c=Math.max,d=Math.min;t.exports=function(t,o,n){var m,f,h,x,v,y,w=0,k=!1,_=!1,C=!0;if("function"!=typeof t)throw new TypeError("Expected a function");function P(time){var o=m,n=f;return m=f=void 0,w=time,x=t.apply(n,o)}function S(time){return w=time,v=setTimeout(O,o),k?P(time):x}function j(time){var t=time-y;return void 0===y||t>=o||t<0||_&&time-w>=h}function O(){var time=l();if(j(time))return M(time);v=setTimeout(O,function(time){var t=o-(time-y);return _?d(t,h-(time-w)):t}(time))}function M(time){return v=void 0,C&&m?P(time):(m=f=void 0,x)}function A(){var time=l(),t=j(time);if(m=arguments,f=this,y=time,t){if(void 0===v)return S(y);if(_)return clearTimeout(v),v=setTimeout(O,o),P(y)}return void 0===v&&(v=setTimeout(O,o)),x}return o=r(o)||0,e(n)&&(k=!!n.leading,h=(_="maxWait"in n)?c(r(n.maxWait)||0,o):h,C="trailing"in n?!!n.trailing:C),A.cancel=function(){void 0!==v&&clearTimeout(v),w=0,m=y=f=v=void 0},A.flush=function(){return void 0===v?x:M(l())},A}},1992:function(t,o,n){var e=n(190);t.exports=function(){return e.Date.now()}},1993:function(t,o,n){var e=n(1994),l=n(364),r=n(1996),c=/^[-+]0x[0-9a-f]+$/i,d=/^0b[01]+$/i,m=/^0o[0-7]+$/i,f=parseInt;t.exports=function(t){if("number"==typeof t)return t;if(r(t))return NaN;if(l(t)){var o="function"==typeof t.valueOf?t.valueOf():t;t=l(o)?o+"":o}if("string"!=typeof t)return 0===t?t:+t;t=e(t);var n=d.test(t);return n||m.test(t)?f(t.slice(2),n?2:8):c.test(t)?NaN:+t}},1994:function(t,o,n){var e=n(1995),l=/^\s+/;t.exports=function(t){return t?t.slice(0,e(t)+1).replace(l,""):t}},1995:function(t,o){var n=/\s/;t.exports=function(t){for(var o=t.length;o--&&n.test(t.charAt(o)););return o}},1996:function(t,o,n){var e=n(365),l=n(332);t.exports=function(t){return"symbol"==typeof t||l(t)&&"[object Symbol]"==e(t)}},2019:function(t,o,n){"use strict";var e=n(188),l=n(124),r=n(56);o.a=e.Vue.extend({data:function(){return{shouldRequestMyPos:!1}},computed:Object.assign(Object.assign({},Object(l.e)(["wallet","liquidity"])),{walletConnectedAndHavePoolsObj:function(){return!(!this.liquidity.poolsObj||!this.wallet.connected||Object(r.b)(this.wallet.tokenAccounts)||!this.shouldRequestMyPos)}}),watch:{walletConnectedAndHavePoolsObj:{handler:"walletConnectedAndHavePoolsObjWatch",immediate:!0},"liquidity.myPositions":{handler:"watchMyPositions",immediate:!0}},mounted:function(){console.log("this is test")},methods:{walletConnectedAndHavePoolsObjWatch:function(t){t&&(this.$accessor.liquidity.getMyPositionsNew({tokenAccounts:this.wallet.tokenAccounts,owner:this.wallet.address}),this.shouldRequestMyPos=!1)},watchMyPositions:function(t){!t||t.length<1?this.shouldRequestMyPos=!0:(console.log("mixin###watchMyPosition###newVal###",t),this.$accessor.liquidity.setCurrentPositon({myPosions:t,id:this.$route.query.id}))},refresh:function(){this.$accessor.liquidity.getMyPositionsNew({tokenAccounts:this.wallet.tokenAccounts,owner:this.wallet.address})}}})},2245:function(t,o,n){var content=n(2435);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(88).default)("583a4d70",content,!0,{sourceMap:!1})},2434:function(t,o,n){"use strict";n(2245)},2435:function(t,o,n){var e=n(87),l=n(669),r=n(1056),c=e(!1),d=l(r);c.push([t.i,".positon-list-box[data-v-61e380a3]{width:1110px;position:relative;margin:0 auto}.positon-list-box .positon-list-content[data-v-61e380a3]{width:100%;min-height:500px;height:100%;margin:30px 0 auto;position:relative}.positon-list-box .positon-list-content .ant-spin-spinning[data-v-61e380a3]{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)}.positon-list-box .positon-list-content .no-data[data-v-61e380a3]{width:100%;min-height:260px;display:flex;align-items:center;justify-content:center;flex-direction:column}.positon-list-box .positon-list-content .no-data img[data-v-61e380a3]{width:100px;height:100px}.positon-list-box .positon-list-content .no-data p[data-v-61e380a3]{color:hsla(0,0%,100%,.8);padding-top:10px}.positon-list-box .positon-list-content .positon-list[data-v-61e380a3]{width:1100px;margin:0 auto;transition:transform 1s;display:flex;flex-flow:row wrap}.positon-list-box .positon-list-content .positon-list .positon-item-container[data-v-61e380a3]{position:relative;width:260px;margin:0 0 20px 20px}.positon-list-box .positon-list-content .positon-list .positon-item-container:hover .positon-item-box[data-v-61e380a3]{transform:translateY(-80px)}.positon-list-box .positon-list-content .positon-list .positon-item-container .positon-item-box[data-v-61e380a3]{margin:0 auto;width:260px;border-radius:180px;display:flex;justify-content:center;background:linear-gradient(180deg,#245e5f,#0f719e,#255e5d);padding:4px;position:relative;z-index:5;transition:transform 1s}.positon-list-box .positon-list-content .positon-list .positon-item-container .positon-item-box .positon-item[data-v-61e380a3]{width:260px;height:100%;min-height:385px;border-radius:180px;position:relative;z-index:5;display:flex;justify-content:center;flex-wrap:wrap;background:linear-gradient(180deg,#101118,#0f1116 82%,#004f80)}.positon-list-box .positon-list-content .positon-list .positon-item-container .positon-item-box .positon-item .circle[data-v-61e380a3]{width:222px;height:222px;background:linear-gradient(180deg,#515866,#34393f);border-radius:50%;margin:15px auto 0;display:flex;justify-content:center;padding:15px;position:relative;z-index:5}.positon-list-box .positon-list-content .positon-list .positon-item-container .positon-item-box .positon-item .circle .circle-center[data-v-61e380a3]{width:100%;height:100%;background:#22252b;border-radius:50%;position:relative;text-align:center;padding:20px 8px 8px}.positon-list-box .positon-list-content .positon-list .positon-item-container .positon-item-box .positon-item .circle .circle-center .circle-center-pic[data-v-61e380a3]{width:calc(100% - 8px);height:calc(100% - 8px);background:url("+d+");background-size:100% 100%;border-radius:50%;text-align:center;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)}.positon-list-box .positon-list-content .positon-list .positon-item-container .positon-item-box .positon-item .circle .circle-center .coin-box[data-v-61e380a3]{display:flex;justify-content:center;margin-top:25px}.positon-list-box .positon-list-content .positon-list .positon-item-container .positon-item-box .positon-item .circle .circle-center .coin-box .coin-after-box[data-v-61e380a3]{width:42px;height:42px;margin-top:20px;margin-left:-25px;background:#1e2126;border-radius:50%;padding:2px}.positon-list-box .positon-list-content .positon-list .positon-item-container .positon-item-box .positon-item .circle .circle-center img[data-v-61e380a3]{display:inline-block}.positon-list-box .positon-list-content .positon-list .positon-item-container .positon-item-box .positon-item .circle .circle-center .coin-after[data-v-61e380a3],.positon-list-box .positon-list-content .positon-list .positon-item-container .positon-item-box .positon-item .circle .circle-center .coin-before[data-v-61e380a3]{width:40px;height:40px}.positon-list-box .positon-list-content .positon-list .positon-item-container .positon-item-box .positon-item .circle .circle-center .symbol-name[data-v-61e380a3]{font-size:16px;font-family:Avenir-Heavy,Avenir;font-weight:800;color:#fff;margin-top:12px}.positon-list-box .positon-list-content .positon-list .positon-item-container .positon-item-box .positon-item .circle .add-liquidity[data-v-61e380a3]{position:absolute;bottom:-16px;width:120px;height:32px;box-shadow:0 4px 12px 0 rgba(26,28,31,.5);border-radius:16px;background:linear-gradient(90deg,#b762ff,#5dc1dd);padding:2px}.positon-list-box .positon-list-content .positon-list .positon-item-container .positon-item-box .positon-item .circle .add-liquidity:hover+.text-tips[data-v-61e380a3]{display:block}.positon-list-box .positon-list-content .positon-list .positon-item-container .positon-item-box .positon-item .circle .add-liquidity span[data-v-61e380a3]{display:block;width:100%;height:28px;background:#000;border-radius:14px;line-height:28px;font-size:14px;font-family:Arial-BoldMT,Arial;font-weight:400;color:#fff}.positon-list-box .positon-list-content .positon-list .positon-item-container .positon-item-box .positon-item .circle .add-liquidity-disabled[data-v-61e380a3],.positon-list-box .positon-list-content .positon-list .positon-item-container .positon-item-box .positon-item .circle .add-liquidity-disabled span[data-v-61e380a3]{background:#5d626d!important;color:hsla(0,0%,100%,.5)}.positon-list-box .positon-list-content .positon-list .positon-item-container .positon-item-box .positon-item .circle .add-liquidity-disabled[data-v-61e380a3]:hover{background:#5d626d!important}.positon-list-box .positon-list-content .positon-list .positon-item-container .positon-item-box .positon-item .circle .text-tips[data-v-61e380a3]{position:absolute;bottom:30px;text-align:center;padding:5px 10px;background:linear-gradient(214deg,#3e434e,#23262b);border-radius:10px;display:none}.positon-list-box .positon-list-content .positon-list .positon-item-container .positon-item-box .positon-item .total-deposits[data-v-61e380a3],.positon-list-box .positon-list-content .positon-list .positon-item-container .positon-item-box .positon-item .volume-24h[data-v-61e380a3]{width:100%;text-align:center}.positon-list-box .positon-list-content .positon-list .positon-item-container .positon-item-box .positon-item .total-deposits .leabl[data-v-61e380a3],.positon-list-box .positon-list-content .positon-list .positon-item-container .positon-item-box .positon-item .volume-24h .leabl[data-v-61e380a3]{font-size:12px;font-weight:400;color:hsla(0,0%,100%,.5)}.positon-list-box .positon-list-content .positon-list .positon-item-container .positon-item-box .positon-item .total-deposits .text[data-v-61e380a3],.positon-list-box .positon-list-content .positon-list .positon-item-container .positon-item-box .positon-item .volume-24h .text[data-v-61e380a3]{font-size:14px;font-weight:600;color:#fff}.positon-list-box .positon-list-content .positon-list .positon-item-container .positon-item-box .positon-item .total-deposits[data-v-61e380a3]{margin-top:30px}.positon-list-box .positon-list-content .positon-list .positon-item-container .positon-item-box .positon-item .volume-24h[data-v-61e380a3]{margin-top:15px;margin-bottom:25px}.positon-list-box .positon-list-content .positon-list .positon-item-container .my-positon-box[data-v-61e380a3]{position:absolute;top:0;width:260px;height:390px;border-radius:180px;padding:2px;z-index:1;transition:transform 1s;background:linear-gradient(180deg,#33373f,#393939,#515765)}.positon-list-box .positon-list-content .positon-list .positon-item-container .my-positon-box .my-positon[data-v-61e380a3]{width:100%;height:100%;padding-top:250px;border-radius:180px;text-align:center;background:linear-gradient(180deg,#000,#2d3036)}.positon-list-box .positon-list-content .positon-list .positon-item-container .my-positon-box .my-positon .my-nft-title[data-v-61e380a3]{font-size:14px;font-family:PingFangSC-Semibold,PingFang SC;font-weight:600;margin-top:40px;color:hsla(0,0%,100%,.5)}.positon-list-box .positon-list-content .positon-list .positon-item-container .my-positon-box .my-positon .my-nft-text[data-v-61e380a3]{margin-top:70px;font-size:14px;font-family:Avenir-Heavy,Avenir;font-weight:800;color:#fff}.positon-list-box .positon-list-content .positon-list .positon-item-container .my-positon-box .my-positon .address[data-v-61e380a3]{max-width:175px;width:100%;height:28px;background:hsla(0,0%,100%,.1);border-radius:14px;-webkit-backdrop-filter:blur(0);backdrop-filter:blur(0);margin:75px auto 0;display:flex;align-items:center;justify-content:center;padding:0 8px;cursor:pointer}.positon-list-box .positon-list-content .positon-list .positon-item-container .my-positon-box .my-positon .address span[data-v-61e380a3]{font-size:12px;font-weight:800;color:#fff;white-space:nowrap}.positon-list-box .positon-list-content .positon-list .positon-item-container .my-positon-box .my-positon .address .active[data-v-61e380a3]{display:inline-block;width:6px;height:6px;background:rgba(2,255,78,.6);border-radius:50%;margin-right:8px}.positon-list-box .positon-list-content .positon-list .positon-item-container .my-positon-box .my-positon .address .active-text[data-v-61e380a3]{margin-right:4px;font-size:14px;font-weight:800;color:hsla(0,0%,100%,.5)}.positon-list-box .positon-list-content .positon-list .positon-item-container .my-positon-box .my-positon .icon[data-v-61e380a3]{width:20px;height:20px;fill:rgba(2,255,78,.6);cursor:pointer}.positon-list-box .positon-list-content .positon-list .positon-item-container .slide-fade-enter-active[data-v-61e380a3],.positon-list-box .positon-list-content .positon-list .positon-item-container .slide-fade-leave-active[data-v-61e380a3]{transition:opacity 1s}.positon-list-box .positon-list-content .positon-list .positon-item-container .slide-fade-enter[data-v-61e380a3],.positon-list-box .positon-list-content .positon-list .positon-item-container .slide-fade-leave-to[data-v-61e380a3]{opacity:0}.positon-list-box .positon-list-content .positon-list .positon-item-container:nth-child(6n+1) .positon-item-box[data-v-61e380a3]{background:linear-gradient(180deg,#3a7a73,#00413a,#3a7a73)}.positon-list-box .positon-list-content .positon-list .positon-item-container:nth-child(6n+1) .positon-item-box .positon-item[data-v-61e380a3]{background:linear-gradient(180deg,#101118,#0f1116 82%,#00665f)}.positon-list-box .positon-list-content .positon-list .positon-item-container:nth-child(6n+3) .positon-item-box[data-v-61e380a3]{background:linear-gradient(180deg,#4838b1,#5c16cb,#494891)}.positon-list-box .positon-list-content .positon-list .positon-item-container:nth-child(6n+3) .positon-item-box .positon-item[data-v-61e380a3]{background:linear-gradient(180deg,#101118,#191529 79%,#3f339f)}.positon-list-box .positon-list-content .positon-list .positon-item-container:nth-child(6n+2) .positon-item-box[data-v-61e380a3]{background:linear-gradient(180deg,#245e5f,#0f719e,#255e5d)}.positon-list-box .positon-list-content .positon-list .positon-item-container:nth-child(6n+2) .positon-item-box .positon-item[data-v-61e380a3]{background:linear-gradient(180deg,#101118,#0f1116 82%,#004f80)}.positon-list-box .positon-list-content .positon-list .positon-item-container:nth-child(6n+5) .positon-item-box[data-v-61e380a3]{background:linear-gradient(180deg,#7a6751,#9e5d0f,#786753)}.positon-list-box .positon-list-content .positon-list .positon-item-container:nth-child(6n+5) .positon-item-box .positon-item[data-v-61e380a3]{background:linear-gradient(180deg,#101118,#0f1116 82%,#662e00)}.positon-list-box .positon-list-content .positon-list .positon-item-container:nth-child(6n+6) .positon-item-box[data-v-61e380a3]{background:linear-gradient(180deg,#7d7540,#59521e,#796e36)}.positon-list-box .positon-list-content .positon-list .positon-item-container:nth-child(6n+6) .positon-item-box .positon-item[data-v-61e380a3]{background:linear-gradient(180deg,#101118,#14160f 82%,#665900)}.positon-list-box .positon-list-content .positon-list .positon-item-container:nth-child(6n+4) .positon-item-box[data-v-61e380a3]{background:linear-gradient(180deg,#801f76,#7911a4,#681164)}.positon-list-box .positon-list-content .positon-list .positon-item-container:nth-child(6n+4) .positon-item-box .positon-item[data-v-61e380a3]{background:linear-gradient(180deg,#101118,#271529 79%,#540d3f)}.positon-list-box .positon-list-content .positon-list .positon-item-container[data-v-61e380a3]:nth-child(4n+1){margin-left:0}.positon-list-box .positon-list-content .positon-list-flex[data-v-61e380a3]{display:flex;justify-content:center}@media screen and (max-width:750px){.positon-list-box[data-v-61e380a3]{width:100%}.positon-list-box .left-btn[data-v-61e380a3],.positon-list-box .right-btn[data-v-61e380a3]{display:none}.positon-list-box .positon-list-content[data-v-61e380a3]{width:100%}.positon-list[data-v-61e380a3]{display:flex!important;width:100%!important;height:100%;justify-content:center;margin:auto;padding:0 0 94px}.positon-list .positon-item-container[data-v-61e380a3]{margin:20px auto}.positon-item-container[data-v-61e380a3]{height:100%;display:block;margin:30px auto}}",""]),t.exports=c},2533:function(t,o,n){"use strict";n.r(o);n(1973);var e=n(1974),l=n.n(e),r=(n(129),n(142),n(40),n(141),n(159),n(90),n(83),n(294),n(366),n(95),n(82),n(148),n(27)),c=n(124),d=n(668),m=n(56),f=n(2019),h=n(128),x=n.n(h),v=n(146),y=n(326),w=n(96),k=r.default.extend({components:{Spin:l.a},mixins:[f.a],props:{selectCoin:{type:String,default:"All"},inputValue:{type:String,default:""}},data:function(){return{isShow:!1,openIndex:null,list:[],myPosition:{},statisticsInfo:{},tokensObj:{},poolsDefaultPriceRangeObj:""}},computed:Object.assign(Object.assign({},Object(c.e)(["wallet","liquidity"])),{walletConnectedAndHavePoolsObj:function(){return!(!this.liquidity.poolsObj||!this.wallet.connected||Object(m.b)(this.wallet.tokenAccounts))},poolListLoading:function(){return this.liquidity.poolListLoading}}),watch:{"liquidity.coinPairConfigList":{handler:"watchCoinPairConfigList",immediate:!0},"liquidity.myPositions":{handler:"watchMyPositions",immediate:!0},"liquidity.tokensObj":{handler:"watchTokensObj",immediate:!0},"wallet.connected":function(t){},walletConnectedAndHavePoolsObj:{handler:"walletConnectedAndHavePoolsObjWatch",immediate:!0},"liquidity.myPositionObj":{handler:"watchMyPositionObj",immediate:!0},"liquidity.poolsDefaultPriceRangeObj":{handler:"watchPoolsDefaultPriceRangeObj",immediate:!0},selectCoin:{handler:"watchSelectCoin",immediate:!0},inputValue:{handler:"watchInputValue",immediate:!0}},methods:{importIcon:d.a,watchTokensObj:function(t){console.log(t,"info##")},gotoPool:function(t){this.wallet.connected?this.$router.push("/deposit?from=".concat(t.tokenA,"&to=").concat(t.tokenB)):this.$accessor.wallet.openModal()},watchMyPositionObj:function(t){this.myPosition=t,this.watchSelectCoin(this.selectCoin)},walletConnectedAndHavePoolsObjWatch:function(t){t&&this.$accessor.liquidity.getMyPositionsNew({tokenAccounts:this.wallet.tokenAccounts,owner:this.wallet.address})},gotoDetail:function(t){this.$accessor.liquidity.setCurrentPositon(null),this.$router.push("/detail?id=".concat(t.nftTokenId))},watchPoolsDefaultPriceRangeObj:function(t){this.poolsDefaultPriceRangeObj=t,this.watchSelectCoin(this.selectCoin)},watchCoinPairConfigList:function(t){this.statisticsInfo=t,this.watchSelectCoin(this.selectCoin)},watchSelectCoin:function(t){var o=this;if(this.statisticsInfo&&this.statisticsInfo&&this.statisticsInfo.length>0){console.log(this.statisticsInfo,"this.statisticsInfo##");var n=this.statisticsInfo||[];"All"!==t&&(n=n.filter((function(o){return o&&o.name.includes(t)})));var e=[];n.forEach((function(t){var n=o.poolsDefaultPriceRangeObj[t.swap_account];e.push(Object.assign(Object.assign({tokenA:t.token_a.symbol,tokenAicon:t.token_a.icon,tokenB:t.token_b.symbol,tokenBicon:t.token_b.icon,name:t.name,tvl_in_usd:Object(m.d)(n&&n.tvl_in_usd,2),vol_in_usd_24h:Object(m.d)(n&&n.vol_in_usd_24h,2)},o.myPosition[t.name]),{sort:"CRM-USDC"==t.name?1:-1}))})),console.log(e,"tepList##"),this.list=e.sort((function(a,b){return b.tvl_in_usd-a.tvl_in_usd})).sort((function(a,b){return b.sort-a.sort}))}},watchInputValue:function(t){if(t){var o=this.list.filter((function(o){return o&&o.name.toLowerCase().includes(t.toLowerCase())}));this.list=o}else this.watchSelectCoin(this.selectCoin)},toPosition:function(){this.wallet.connected?this.$router.push("/position"):this.$accessor.wallet.openModal()},calculate:function(t){var o=Object(w.e)(t.lowerTick,t.upperTick,t.liquity,t.currentSqrtPrice),n=o.amountA,e=o.amountB,l=Object(m.d)(n.div(Math.pow(10,t.token_a.decimal)),t.token_a.decimal),r=Object(m.d)(e.div(Math.pow(10,t.token_b.decimal)),t.token_b.decimal),c=new x.a(l),d=new x.a(r),f=t.currentPriceView,h=c.multipliedBy(f),k=d.plus(h),_=v.c[t.token_b.symbol]||1;_=Object(y.d)(t.token_b.symbol.toLowerCase()).then((function(data){})),"CUSDC"===t.token_b.symbol.toUpperCase()&&(_=v.c[t.token_b.symbol]);var C=k.multipliedBy(_),P=Object(m.c)(C.toFixed(),4),S=h.toNumber()?h.dividedBy(C.multipliedBy(_)).multipliedBy(100):new x.a(0),j=d.toNumber()?d.dividedBy(C.multipliedBy(_)).multipliedBy(100):new x.a(0);return S=Math.round(S.toNumber()),j=Math.round(j.toNumber()),P},cardsSortRule:function(pre,t){return pre.nftTokenMint&&t.nftTokenMint?pre.amount_usd-t.amount_usd:pre.nftTokenMint||t.nftTokenMint?void 0:pre.tvl_in_usd-t.tvl_in_usd},thousands:function(t){if(Math.floor(t)===t)return(t||0).toString().replace(/(\d)(?=(?:\d{3})+$)/g,"$1,");var o=t.toString(),n=o.includes(".")>-1?/(\d)(?=(\d{3})+\.)/g:/(\d)(?=(?:\d{3})+$)/g;return o.replace(n,"$1,")}}}),_=(n(2434),n(89)),component=Object(_.a)(k,(function(){var t=this,o=t.$createElement,e=t._self._c||o;return e("div",{staticClass:"positon-list-box"},[e("div",{staticClass:"positon-list-content"},[t.poolListLoading?[e("Spin",{attrs:{size:"large"}})]:[t.list&&t.list.length>0?e("div",{staticClass:"positon-list",class:t.list&&t.list.length<3?"positon-list-flex":""},t._l(t.list,(function(o,n){return e("div",{key:n,staticClass:"positon-item-container"},[e("div",{staticClass:"positon-item-box"},[e("div",{staticClass:"positon-item"},[e("div",{staticClass:"positon-box"}),t._v(" "),e("div",{staticClass:"circle"},[e("div",{staticClass:"circle-center"},[e("div",{staticClass:"circle-center-pic"}),t._v(" "),e("div",{staticClass:"coin-box"},[e("div",{staticClass:"coin-before-box"},[e("img",{staticClass:"coin-before",attrs:{src:o.tokenAicon||t.importIcon("/coins/"+o.tokenA.toLowerCase()+".png")}})]),t._v(" "),e("div",{staticClass:"coin-after-box"},[e("img",{staticClass:"coin-after",attrs:{src:o.tokenBicon||t.importIcon("/coins/"+o.tokenB.toLowerCase()+".png")}})])]),t._v(" "),e("div",{staticClass:"symbol-name"},[t._v(t._s(o.tokenA)+" - "+t._s(o.tokenB))])]),t._v(" "),"CRM-USDC"!==o.name?e("Button",{staticClass:"add-liquidity add-liquidity-disabled"},[e("span",[t._v("Ended")])]):e("Button",{staticClass:"add-liquidity",on:{click:function(n){return t.gotoPool(o)}}},[e("span",[t._v("Add Liquidity")])])],1),t._v(" "),e("div",{staticClass:"total-deposits"},[e("div",{staticClass:"leabl"},[t._v("Total Deposits")]),t._v(" "),e("div",{staticClass:"text"},[t._v("$"+t._s(o&&o.tvl_in_usd&&t.thousands(o.tvl_in_usd)))])]),t._v(" "),e("div",{staticClass:"volume-24h"},[e("div",{staticClass:"leabl"},[t._v("Volume (24H)")]),t._v(" "),e("div",{staticClass:"text"},[t._v("$"+t._s(o&&o.vol_in_usd_24h&&t.thousands(o.vol_in_usd_24h)))])])])]),t._v(" "),e("transition",{attrs:{name:"slide-fade",appear:""}},[e("div",{staticClass:"my-positon-box"},[t.wallet.connected&&o.nftTokenMint?e("div",{staticClass:"my-positon"},[e("div",{staticClass:"address",on:{click:function(n){return t.gotoDetail(o)}}},[e("span",{staticClass:"active"}),t._v(" "),e("span",{staticClass:"active-text"},[t._v("Position")]),t._v(" "),e("span",[t._v("\n                    "+t._s(o.nftTokenMint.substr(0,4))+"\n                    ...\n                    "+t._s(o.nftTokenMint.substr(o.nftTokenMint.length-4,4))+"\n                  ")])]),t._v(" "),e("svg",{staticClass:"icon",attrs:{"aria-hidden":"true"},on:{click:t.toPosition}},[e("use",{attrs:{"xlink:href":"#icon-icon-on"}})])]):t._e(),t._v(" "),t.wallet.connected?t._e():e("div",{staticClass:"my-positon"},[e("div",{staticClass:"my-nft-text"},[t._v("Please connect a wallet")]),t._v(" "),e("svg",{staticClass:"icon",attrs:{"aria-hidden":"true"},on:{click:t.toPosition}},[e("use",{attrs:{"xlink:href":"#icon-icon-on"}})])]),t._v(" "),t.wallet.connected&&!o.nftTokenMint?e("div",{staticClass:"my-positon"},[e("div",{staticClass:"my-nft-text"},[t._v("No liquidity position")])]):t._e()])])],1)})),0):e("div",{staticClass:"no-data"},[e("img",{attrs:{src:n(961)}}),t._v(" "),e("p",[t._v("No liquidity pools")])])]],2)])}),[],!1,null,"61e380a3",null);o.default=component.exports}}]);