(window.webpackJsonp=window.webpackJsonp||[]).push([[102,68,71,76],{2908:function(t,n,e){"use strict";e(421),e(2911)},2909:function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.SpinProps=void 0;var o=e(2913);Object.defineProperty(n,"SpinProps",{enumerable:!0,get:function(){return o.SpinProps}});var r=c(o),l=c(e(383));function c(t){return t&&t.__esModule?t:{default:t}}r.default.setDefaultIndicator=o.setDefaultIndicator,r.default.install=function(t){t.use(l.default),t.component(r.default.name,r.default)},n.default=r.default},2911:function(t,n,e){var content=e(2912);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,e(143).default)("c0e78406",content,!0,{sourceMap:!1})},2912:function(t,n,e){var o=e(142)(!1);o.push([t.i,'.ant-spin{box-sizing:border-box;margin:0;padding:0;color:#f1f1f2;font-size:14px;font-variant:tabular-nums;line-height:1.5;list-style:none;font-feature-settings:"tnum","tnum";position:absolute;display:none;color:#07ebad;text-align:center;vertical-align:middle;opacity:0;transition:transform .3s cubic-bezier(.78,.14,.15,.86)}.ant-spin-spinning{position:static;display:inline-block;opacity:1}.ant-spin-nested-loading{position:relative}.ant-spin-nested-loading>div>.ant-spin{position:absolute;top:0;left:0;z-index:4;display:block;width:100%;height:100%;max-height:400px}.ant-spin-nested-loading>div>.ant-spin .ant-spin-dot{position:absolute;top:50%;left:50%;margin:-10px}.ant-spin-nested-loading>div>.ant-spin .ant-spin-text{position:absolute;top:50%;width:100%;padding-top:5px;text-shadow:0 1px 2px #fff}.ant-spin-nested-loading>div>.ant-spin.ant-spin-show-text .ant-spin-dot{margin-top:-20px}.ant-spin-nested-loading>div>.ant-spin-sm .ant-spin-dot{margin:-7px}.ant-spin-nested-loading>div>.ant-spin-sm .ant-spin-text{padding-top:2px}.ant-spin-nested-loading>div>.ant-spin-sm.ant-spin-show-text .ant-spin-dot{margin-top:-17px}.ant-spin-nested-loading>div>.ant-spin-lg .ant-spin-dot{margin:-16px}.ant-spin-nested-loading>div>.ant-spin-lg .ant-spin-text{padding-top:11px}.ant-spin-nested-loading>div>.ant-spin-lg.ant-spin-show-text .ant-spin-dot{margin-top:-26px}.ant-spin-container{position:relative;transition:opacity .3s}.ant-spin-container:after{position:absolute;top:0;right:0;bottom:0;left:0;z-index:10;display:none\\9;width:100%;height:100%;background:#fff;opacity:0;transition:all .3s;content:"";pointer-events:none}.ant-spin-blur{clear:both;overflow:hidden;opacity:.5;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;pointer-events:none}.ant-spin-blur:after{opacity:.4;pointer-events:auto}.ant-spin-tip{color:rgba(0,0,0,.45)}.ant-spin-dot{position:relative;display:inline-block;font-size:20px;width:1em;height:1em}.ant-spin-dot-item{position:absolute;display:block;width:9px;height:9px;background-color:#07ebad;border-radius:100%;transform:scale(.75);transform-origin:50% 50%;opacity:.3;-webkit-animation:antSpinMove 1s linear infinite alternate;animation:antSpinMove 1s linear infinite alternate}.ant-spin-dot-item:first-child{top:0;left:0}.ant-spin-dot-item:nth-child(2){top:0;right:0;-webkit-animation-delay:.4s;animation-delay:.4s}.ant-spin-dot-item:nth-child(3){right:0;bottom:0;-webkit-animation-delay:.8s;animation-delay:.8s}.ant-spin-dot-item:nth-child(4){bottom:0;left:0;-webkit-animation-delay:1.2s;animation-delay:1.2s}.ant-spin-dot-spin{transform:rotate(45deg);-webkit-animation:antRotate 1.2s linear infinite;animation:antRotate 1.2s linear infinite}.ant-spin-sm .ant-spin-dot{font-size:14px}.ant-spin-sm .ant-spin-dot i{width:6px;height:6px}.ant-spin-lg .ant-spin-dot{font-size:32px}.ant-spin-lg .ant-spin-dot i{width:14px;height:14px}.ant-spin.ant-spin-show-text .ant-spin-text{display:block}@media (-ms-high-contrast:active),(-ms-high-contrast:none){.ant-spin-blur{background:#fff;opacity:.5}}@-webkit-keyframes antSpinMove{to{opacity:1}}@keyframes antSpinMove{to{opacity:1}}@-webkit-keyframes antRotate{to{transform:rotate(405deg)}}@keyframes antRotate{to{transform:rotate(405deg)}}',""]),t.exports=o},2913:function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.SpinProps=n.SpinSize=void 0;var o=x(e(219)),r=x(e(211)),l=x(e(422));n.setDefaultIndicator=function(t){k="function"==typeof t.indicator?t.indicator:function(n){return n(t.indicator)}};var c=x(e(2914)),d=x(e(94)),f=x(e(212)),m=e(114),h=e(279),v=e(359);function x(t){return t&&t.__esModule?t:{default:t}}var w=n.SpinSize=d.default.oneOf(["small","default","large"]),y=n.SpinProps=function(){return{prefixCls:d.default.string,spinning:d.default.bool,size:w,wrapperClassName:d.default.string,tip:d.default.string,delay:d.default.number,indicator:d.default.any}},k=void 0;n.default={name:"ASpin",mixins:[f.default],props:(0,m.initDefaultProps)(y(),{size:"default",spinning:!0,wrapperClassName:""}),inject:{configProvider:{default:function(){return v.ConfigConsumerProps}}},data:function(){var t=this.spinning,n=function(t,n){return!!t&&!!n&&!isNaN(Number(n))}(t,this.delay);return this.originalUpdateSpinning=this.updateSpinning,this.debouncifyUpdateSpinning(this.$props),{sSpinning:t&&!n}},mounted:function(){this.updateSpinning()},updated:function(){var t=this;this.$nextTick((function(){t.debouncifyUpdateSpinning(),t.updateSpinning()}))},beforeDestroy:function(){this.cancelExistingSpin()},methods:{debouncifyUpdateSpinning:function(t){var n=(t||this.$props).delay;n&&(this.cancelExistingSpin(),this.updateSpinning=(0,c.default)(this.originalUpdateSpinning,n))},updateSpinning:function(){var t=this.spinning;this.sSpinning!==t&&this.setState({sSpinning:t})},cancelExistingSpin:function(){var t=this.updateSpinning;t&&t.cancel&&t.cancel()},getChildren:function(){return this.$slots&&this.$slots.default?(0,m.filterEmpty)(this.$slots.default):null},renderIndicator:function(t,n){var e=n+"-dot",o=(0,m.getComponentFromProp)(this,"indicator");return null===o?null:(Array.isArray(o)&&(o=1===(o=(0,m.filterEmpty)(o)).length?o[0]:o),(0,m.isValidElement)(o)?(0,h.cloneElement)(o,{class:e}):k&&(0,m.isValidElement)(k(t))?(0,h.cloneElement)(k(t),{class:e}):t("span",{class:e+" "+n+"-dot-spin"},[t("i",{class:n+"-dot-item"}),t("i",{class:n+"-dot-item"}),t("i",{class:n+"-dot-item"}),t("i",{class:n+"-dot-item"})]))}},render:function(t){var n,e=this.$props,c=e.size,d=e.prefixCls,f=e.tip,h=e.wrapperClassName,v=(0,l.default)(e,["size","prefixCls","tip","wrapperClassName"]),x=(0,this.configProvider.getPrefixCls)("spin",d),w=this.sSpinning,y=(n={},(0,r.default)(n,x,!0),(0,r.default)(n,x+"-sm","small"===c),(0,r.default)(n,x+"-lg","large"===c),(0,r.default)(n,x+"-spinning",w),(0,r.default)(n,x+"-show-text",!!f),n),k=t("div",(0,o.default)([v,{class:y}]),[this.renderIndicator(t,x),f?t("div",{class:x+"-text"},[f]):null]),_=this.getChildren();if(_){var C,S=(C={},(0,r.default)(C,x+"-container",!0),(0,r.default)(C,x+"-blur",w),C);return t("div",(0,o.default)([{on:(0,m.getListeners)(this)},{class:[x+"-nested-loading",h]}]),[w&&t("div",{key:"loading"},[k]),t("div",{class:S,key:"container"},[_])])}return k}}},2914:function(t,n,e){var o=e(524),r=e(2915),l=e(2916),c=Math.max,d=Math.min;t.exports=function(t,n,e){var f,m,h,v,x,w,y=0,k=!1,_=!1,C=!0;if("function"!=typeof t)throw new TypeError("Expected a function");function S(time){var n=f,e=m;return f=m=void 0,y=time,v=t.apply(e,n)}function A(time){return y=time,x=setTimeout($,n),k?S(time):v}function P(time){var t=time-w;return void 0===w||t>=n||t<0||_&&time-y>=h}function $(){var time=r();if(P(time))return M(time);x=setTimeout($,function(time){var t=n-(time-w);return _?d(t,h-(time-y)):t}(time))}function M(time){return x=void 0,C&&f?S(time):(f=m=void 0,v)}function I(){var time=r(),t=P(time);if(f=arguments,m=this,w=time,t){if(void 0===x)return A(w);if(_)return clearTimeout(x),x=setTimeout($,n),S(w)}return void 0===x&&(x=setTimeout($,n)),v}return n=l(n)||0,o(e)&&(k=!!e.leading,h=(_="maxWait"in e)?c(l(e.maxWait)||0,n):h,C="trailing"in e?!!e.trailing:C),I.cancel=function(){void 0!==x&&clearTimeout(x),y=0,f=w=m=x=void 0},I.flush=function(){return void 0===x?v:M(r())},I}},2915:function(t,n,e){var o=e(324);t.exports=function(){return o.Date.now()}},2916:function(t,n,e){var o=e(2917),r=e(524),l=e(2919),c=/^[-+]0x[0-9a-f]+$/i,d=/^0b[01]+$/i,f=/^0o[0-7]+$/i,m=parseInt;t.exports=function(t){if("number"==typeof t)return t;if(l(t))return NaN;if(r(t)){var n="function"==typeof t.valueOf?t.valueOf():t;t=r(n)?n+"":n}if("string"!=typeof t)return 0===t?t:+t;t=o(t);var e=d.test(t);return e||f.test(t)?m(t.slice(2),e?2:8):c.test(t)?NaN:+t}},2917:function(t,n,e){var o=e(2918),r=/^\s+/;t.exports=function(t){return t?t.slice(0,o(t)+1).replace(r,""):t}},2918:function(t,n){var e=/\s/;t.exports=function(t){for(var n=t.length;n--&&e.test(t.charAt(n)););return n}},2919:function(t,n,e){var o=e(525),r=e(463);t.exports=function(t){return"symbol"==typeof t||r(t)&&"[object Symbol]"==o(t)}},2920:function(t,n,e){var content=e(2935);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,e(143).default)("bab2ee22",content,!0,{sourceMap:!1})},2921:function(t,n,e){var content=e(2937);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,e(143).default)("3a07b6e2",content,!0,{sourceMap:!1})},2925:function(t,n,e){var content=e(2942);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,e(143).default)("f580aa36",content,!0,{sourceMap:!1})},2933:function(t,n,e){"use strict";e.r(n);e(2922);var o=e(2923),r=e.n(o),l=e(43).default.extend({components:{Tooltip:r.a},props:["currentStatus"],methods:{getPopupContainer:function(){return this.$refs.modal}}}),c=(e(2936),e(144)),component=Object(c.a)(l,(function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("div",{ref:"modal"},[e("Tooltip",{attrs:{"overlay-class-name":"customize-tooltip",getPopupContainer:t.getPopupContainer,placement:"bottom"}},[e("template",{slot:"title"},["Active"===t.currentStatus?e("div",{staticClass:"active-tooltip"},[t._v("\n        The price of this pool is currently within your position price range.\n      ")]):t._e(),t._v(" "),"Inactive"===t.currentStatus?e("div",{staticClass:"active-tooltip"},[t._v("\n        The price of this pool is currently out of your position price range.\n      ")]):t._e()]),t._v(" "),e("div",{staticClass:"deta-block-status"},["Closed"===t.currentStatus?e("div",[e("span",[t._v("Closed")])]):"Active"===t.currentStatus?e("div",[e("i",{staticClass:"circle"}),t._v(" "),e("span",[t._v(t._s(t.currentStatus))])]):e("div",[e("svg",{staticClass:"icon",attrs:{"aria-hidden":"true"}},[e("use",{attrs:{"xlink:href":"#icon-icon-tips"}})]),t._v(" "),e("span",[t._v(t._s(t.currentStatus))])])])],2)],1)}),[],!1,null,"d27f6c36",null);n.default=component.exports},2934:function(t,n,e){"use strict";e(2920)},2935:function(t,n,e){var o=e(142)(!1);o.push([t.i,".refresh-icon-box[data-v-91d99c36]{width:30px;height:30px;background:linear-gradient(141deg,#383e49,#1a1c1f);border-radius:15px;margin:0 10px;display:flex;align-items:center;justify-content:center;cursor:pointer}.refresh-icon-box[data-v-91d99c36]:hover{background:linear-gradient(141deg,#424953,#2a2e33);box-shadow:2px 4px 12px 0 #23262b,-3px -2px 10px 0 rgba(138,147,160,.16)}.refresh-icon-box svg[data-v-91d99c36]{width:18px;height:18px;fill:#fff}.refresh-icon-box .is-loading[data-v-91d99c36]{-webkit-animation:spin-data-v-91d99c36 1s linear infinite;animation:spin-data-v-91d99c36 1s linear infinite}@-webkit-keyframes spin-data-v-91d99c36{to{transform:rotate(1turn)}}@keyframes spin-data-v-91d99c36{to{transform:rotate(1turn)}}",""]),t.exports=o},2936:function(t,n,e){"use strict";e(2921)},2937:function(t,n,e){var o=e(142)(!1);o.push([t.i,".deta-block-status[data-v-d27f6c36]{cursor:pointer;height:28px;justify-content:space-around;background:hsla(0,0%,100%,.1);border-radius:8px;text-align:center;padding:0 12px}.deta-block-status[data-v-d27f6c36],.deta-block-status div[data-v-d27f6c36]{display:flex;align-items:center}.deta-block-status .circle[data-v-d27f6c36]{display:block;width:6px;height:6px;background:#00ff4d;border-radius:50%}.deta-block-status svg[data-v-d27f6c36]{width:20px;height:20px;fill:#fff}.deta-block-status span[data-v-d27f6c36]{font-size:14px;font-weight:700;margin-left:8px}@media screen and (max-width:750px){.coin-block .input-block input[data-v-d27f6c36]{width:100px}}",""]),t.exports=o},2938:function(t,n,e){"use strict";e.r(n);var o=e(260).Vue.extend({props:{loading:{type:Boolean,default:!1}},methods:{refresh:function(){this.$emit("refresh")}}}),r=(e(2934),e(144)),component=Object(r.a)(o,(function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("div",{staticClass:"icon-box refresh-icon-box"},[e("svg",{class:["icon",t.loading?"is-loading":""],attrs:{"aria-hidden":"true"},on:{click:t.refresh}},[e("use",{attrs:{"xlink:href":"#icon-icon-refresh"}})])])}),[],!1,null,"91d99c36",null);n.default=component.exports},2939:function(t,n,e){"use strict";e.r(n);e(2951);var input=e(2952),o=e.n(input),r=(e(600),e(261)),l=e.n(r),c=(e(69),e(360),e(43));c.default.use(l.a);var d=c.default.extend({components:{Modal:l.a,Input:o.a},data:function(){return{slippage:"",slippageArr:["0.1","0.5","1"]}},mounted:function(){this.slippage=this.$accessor.slippage},methods:{oninput:function(t){t.target.value=t.target.value.match(/^\d+(?:\.\d{0,2})?/)?t.target.value.match(/^\d+(?:\.\d{0,2})?/)[0]||null:"",t.target.value&&(this.slippage=t.target.value)},confirmSlippage:function(){this.$accessor.setSlippage(this.slippage),this.$emit("onClose")}}}),f=(e(2941),e(144)),component=Object(f.a)(d,(function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("Modal",{attrs:{title:"Settings","z-index":1070,centered:"",width:"400px",visible:!0,footer:null},on:{cancel:function(n){return t.$emit("onClose")}}},[e("div",{staticClass:"pool-setting"},[e("div",{staticClass:"slippage-tolerance"},[t._v("Slippage tolerance")]),t._v(" "),e("div",{staticClass:"input-content"},[t._l(t.slippageArr,(function(n,o){return e("div",{key:o,staticClass:"slippage-item",class:n===t.slippage?"slippage-item-active":"",on:{click:function(e){t.slippage=n}}},[t._v("\n        "+t._s(n)+"\n      ")])})),t._v(" "),e("Input",{attrs:{typ:"number",size:"large",suffix:"%"},on:{input:t.oninput},model:{value:t.slippage,callback:function(n){t.slippage=n},expression:"slippage"}})],2),t._v(" "),t.slippage?e("div",{staticClass:"slippage-hint",class:Number(t.slippage)>1&&50>=Number(t.slippage)?"slippage-hint-waring":Number(t.slippage)>50?"slippage-hint-error":""},[t._v("\n      "+t._s(Number(t.slippage)>1&&50>=Number(t.slippage)?"Your transaction may be fronturn":Number(t.slippage)>50?"Enter a valid slippage percentage":"")+"\n    ")]):t._e(),t._v(" "),e("div",{staticClass:"btn-box"},[e("Button",{staticClass:"disconnect-btn",on:{click:function(n){return t.$emit("onClose")}}},[t._v(" Cancel ")]),t._v(" "),e("div",{staticClass:"switch-wallet-btn-box"},[e("Button",{staticClass:"switch-wallet-btn",attrs:{disabled:Number(t.slippage)>50},on:{click:t.confirmSlippage}},[t._v("\n          Confirm\n        ")])],1)],1)])])}),[],!1,null,null,null);n.default=component.exports},2940:function(t,n,e){var content=e(2946);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,e(143).default)("6d0fc74c",content,!0,{sourceMap:!1})},2941:function(t,n,e){"use strict";e(2925)},2942:function(t,n,e){var o=e(142)(!1);o.push([t.i,".gradient-btn-large{width:100%;height:56px;background:linear-gradient(268deg,#5fe6d0,#596eff 32%,#6950f5 68%,#ad4ff6);box-shadow:0 4px 6px 0 rgba(26,28,31,.5);border-radius:10px;font-size:18px;font-weight:700;border:1px solid #e8e4ff;color:#fff}.gradient-btn-large:hover{background:linear-gradient(268deg,#68f5de,#6c7fff 32%,#7058f8 68%,#ba60ff)}.gradient-btn-large:disabled{border:2px solid rgba(232,228,255,.1);cursor:not-allowed}.gradient-btn-large:disabled,.gradient-btn-large:disabled:hover{background:hsla(0,0%,100%,.1)}.new-gradient-btn-large{width:100%;height:56px;box-shadow:0 4px 12px 0 rgba(26,28,31,.5);border-radius:16px;margin-top:20px}.farm-btn-small,.new-gradient-btn-large{background:linear-gradient(180deg,#e4e2fe,#2881f2);padding:1px}.farm-btn-small{line-height:1;height:40px;border-radius:6px;border:none}.farm-btn-small div{text-align:center;border-radius:6px;font-size:14px;font-weight:400;color:#fff;background:linear-gradient(268deg,#5fe6d0,#597bff 38%,#9380ff 72%,#e590ff)}.farm-btn-small div:hover{background:linear-gradient(270deg,#93ffed,#84caff 34%,#a291ff 68%,#efb9ff)}.pool-setting .slippage-tolerance{margin-top:14px;color:#b5b8c2}.pool-setting .input-content{margin-top:10px;display:flex;justify-content:space-between}.pool-setting .input-content .slippage-item{width:80px;height:40px;background:none;font-size:14px;font-weight:500;color:#fff;text-align:center;line-height:40px;box-shadow:0 4px 12px 0 #25282c;border-radius:10px;border:1px solid #3f434e}.pool-setting .input-content .slippage-item-active{background:#42454b;box-shadow:0 2px 6px 0 rgba(26,28,31,.5);border-radius:10px;color:#07ebad;border:1px solid #07ebad}.pool-setting .input-content input{width:80px;height:40px;color:#fff;border:none;background:#23262b;box-shadow:0 2px 3px 1px #1a1c1f;border-radius:10px}.pool-setting .input-content .ant-input-affix-wrapper{width:auto}.pool-setting .input-content .ant-input-affix-wrapper .ant-input-suffix{color:#fff}.pool-setting .input-content .ant-input-affix-wrapper input{text-align:center!important;font-size:14px;line-height:20px;background:#23262b;box-shadow:0 2px 3px 1px #1a1c1f;border-radius:10px}.pool-setting .slippage-hint{margin-top:14px}.pool-setting .slippage-hint-waring{color:#fb0}.pool-setting .slippage-hint-error{color:#ff5050}.pool-setting .btn-box{display:flex;margin-top:40px;justify-content:space-between}.pool-setting .disconnect-btn{width:168px;height:48px;box-shadow:0 4px 12px 0 #25282c;border-radius:12px;font-size:16px;border:1px solid #3f434e;font-weight:600;background:transparent}.pool-setting .disconnect-btn:hover{background:hsla(0,0%,100%,.05)}.pool-setting .switch-wallet-btn-box{width:168px;height:46px;margin-top:0;margin-left:0!important;border-radius:12px}.pool-setting .switch-wallet-btn-box .switch-wallet-btn{width:100%;height:56px;background:linear-gradient(268deg,#5fe6d0,#596eff 32%,#6950f5 68%,#ad4ff6);box-shadow:0 4px 6px 0 rgba(26,28,31,.5);border-radius:10px;font-size:18px;font-weight:700;border:1px solid #e8e4ff;color:#fff;height:100%;font-size:16px}.pool-setting .switch-wallet-btn-box .switch-wallet-btn:hover{background:linear-gradient(268deg,#68f5de,#6c7fff 32%,#7058f8 68%,#ba60ff)}.pool-setting .switch-wallet-btn-box .switch-wallet-btn:disabled{border:2px solid rgba(232,228,255,.1);background:hsla(0,0%,100%,.1);cursor:not-allowed}.pool-setting .switch-wallet-btn-box .switch-wallet-btn:disabled:hover{background:hsla(0,0%,100%,.1)}@media screen and (max-width:750px){.pool-setting .input-content .slippage-item,.pool-setting .input-content input{width:60px}}",""]),t.exports=o},2945:function(t,n,e){"use strict";e(2940)},2946:function(t,n,e){var o=e(142)(!1);o.push([t.i,".set-icon-container[data-v-5ee3eada]{color:hsla(0,0%,100%,.5)}.set-icon-container .set-icon-box .set-icon-content[data-v-5ee3eada]{height:28px;border-radius:8px;display:flex;align-items:center;justify-content:center;cursor:pointer}.set-icon-container .set-icon-box .set-icon-content .icon[data-v-5ee3eada]{width:16px;height:16px;fill:hsla(0,0%,100%,.5);cursor:pointer}.set-icon-container .set-icon-box .set-icon-content span[data-v-5ee3eada]{font-size:12px;margin-left:4px}.set-icon-container .set-icon-box .set-icon-content[data-v-5ee3eada]:hover{color:#fff}.set-icon-container .set-icon-box .set-icon-content:hover .icon[data-v-5ee3eada]{fill:#fff}",""]),t.exports=o},2947:function(t,n,e){"use strict";var o=e(260),r=e(194),l=e(82);n.a=o.Vue.extend({data:function(){return{shouldRequestMyPos:!1}},computed:Object.assign(Object.assign({},Object(r.e)(["wallet","liquidity"])),{walletConnectedAndHavePoolsObj:function(){return!(!this.liquidity.poolsObj||!this.wallet.connected||Object(l.b)(this.wallet.tokenAccounts)||!this.shouldRequestMyPos)}}),watch:{walletConnectedAndHavePoolsObj:{handler:"walletConnectedAndHavePoolsObjWatch",immediate:!0},"liquidity.myPositions":{handler:"watchMyPositions",immediate:!0}},mounted:function(){console.log("this is test")},methods:{walletConnectedAndHavePoolsObjWatch:function(t){t&&("v1"==this.$route.query.version?this.$accessor.liquidity.getMyPositionsV1({tokenAccounts:this.wallet.tokenAccounts,owner:this.wallet.address}):this.$accessor.liquidity.getMyPositionsNew({tokenAccounts:this.wallet.tokenAccounts,owner:this.wallet.address}),this.shouldRequestMyPos=!1)},watchMyPositions:function(t){!t||t.length<1?this.shouldRequestMyPos=!0:"v1"==t[0].version?this.$accessor.liquidity.setCurrentPositonV1({myPosions:t,id:this.$route.query.id}):this.$accessor.liquidity.setCurrentPositon({myPosions:t,id:this.$route.query.id})},refresh:function(){"v1"==this.currentData.version||"v1"==this.currenVersion?this.$accessor.liquidity.getMyPositionsV1({tokenAccounts:this.wallet.tokenAccounts,owner:this.wallet.address}):this.$accessor.liquidity.getMyPositionsNew({tokenAccounts:this.wallet.tokenAccounts,owner:this.wallet.address})}}})},2950:function(t,n,e){"use strict";e.r(n);var o=e(260).Vue.extend({data:function(){return{showSetting:!1}},computed:{slippageView:function(){return"".concat(this.$accessor.slippage,"%")}}}),r=(e(2945),e(144)),component=Object(r.a)(o,(function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("div",{staticClass:"set-icon-container"},[e("div",{staticClass:"set-icon-box",on:{click:function(n){t.showSetting=!0}}},[e("div",{staticClass:"set-icon-content"},[e("svg",{staticClass:"icon",attrs:{"aria-hidden":"true"}},[e("use",{attrs:{"xlink:href":"#icon-a-bianzu81"}})]),t._v(" "),e("span",[t._v(t._s(t.slippageView))])])]),t._v(" "),t.showSetting?e("Setting",{on:{onClose:function(){return t.showSetting=!1}}}):t._e()],1)}),[],!1,null,"5ee3eada",null);n.default=component.exports;installComponents(component,{Setting:e(2939).default})},3205:function(t,n,e){var content=e(3412);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,e(143).default)("b7b5c7f8",content,!0,{sourceMap:!1})},3411:function(t,n,e){"use strict";e(3205)},3412:function(t,n,e){var o=e(142)(!1);o.push([t.i,".gradient-btn-large[data-v-69c6f988]{width:100%;height:56px;background:linear-gradient(268deg,#5fe6d0,#596eff 32%,#6950f5 68%,#ad4ff6);box-shadow:0 4px 6px 0 rgba(26,28,31,.5);border-radius:10px;font-size:18px;font-weight:700;border:1px solid #e8e4ff;color:#fff}.gradient-btn-large[data-v-69c6f988]:hover{background:linear-gradient(268deg,#68f5de,#6c7fff 32%,#7058f8 68%,#ba60ff)}.gradient-btn-large[data-v-69c6f988]:disabled{border:2px solid rgba(232,228,255,.1);cursor:not-allowed}.gradient-btn-large[data-v-69c6f988]:disabled,.gradient-btn-large[data-v-69c6f988]:disabled:hover{background:hsla(0,0%,100%,.1)}.new-gradient-btn-large[data-v-69c6f988]{width:100%;height:56px;box-shadow:0 4px 12px 0 rgba(26,28,31,.5);border-radius:16px;margin-top:20px}.farm-btn-small[data-v-69c6f988],.new-gradient-btn-large[data-v-69c6f988]{background:linear-gradient(180deg,#e4e2fe,#2881f2);padding:1px}.farm-btn-small[data-v-69c6f988]{line-height:1;height:40px;border-radius:6px;border:none}.farm-btn-small div[data-v-69c6f988]{text-align:center;border-radius:6px;font-size:14px;font-weight:400;color:#fff;background:linear-gradient(268deg,#5fe6d0,#597bff 38%,#9380ff 72%,#e590ff)}.farm-btn-small div[data-v-69c6f988]:hover{background:linear-gradient(270deg,#93ffed,#84caff 34%,#a291ff 68%,#efb9ff)}.remove-container[data-v-69c6f988]{padding:20px;margin-top:20px}.container[data-v-69c6f988]{width:492px}.container .back-btn[data-v-69c6f988]{display:flex;align-items:center}.container .back-btn .icon[data-v-69c6f988]{width:20px;height:20px;fill:#fff}.container .back-btn .icon[data-v-69c6f988]:hover{fill:#07ebad}.container .title[data-v-69c6f988]{font-size:20px;margin-top:10px;font-weight:600;display:flex;align-items:center;justify-content:space-between}.container .pool-settings[data-v-69c6f988]{margin-top:20px;background:linear-gradient(214deg,#3e434e,#23262b);border-radius:20px;border:1px solid #565c6a;padding:20px}.container .pool-settings .top-box[data-v-69c6f988]{display:flex;align-items:center;justify-content:space-between}.container .pool-settings .top-box .left[data-v-69c6f988]{display:flex;align-items:center}.container .pool-settings .top-box .left img[data-v-69c6f988]{width:36px;height:36px}.container .pool-settings .top-box .left img.last[data-v-69c6f988]{margin-left:-10px}.container .pool-settings .top-box .left>span[data-v-69c6f988]{font-size:16px;color:#fff;margin-left:8px;margin-right:8px;white-space:nowrap}.container .pool-settings .amount[data-v-69c6f988]{margin-top:20px;padding:20px;box-shadow:0 4px 12px 0 #25282c;border-radius:10px;border:1px solid #3f434e}.container .pool-settings .amount .amount-title[data-v-69c6f988]{font-size:14px;color:#fff}.container .pool-settings .amount .amount-tab[data-v-69c6f988]{display:flex;justify-content:space-between;align-items:center;margin-top:16px}.container .pool-settings .amount .amount-tab .amount-left[data-v-69c6f988]{font-size:24px;font-weight:400;color:#fff}.container .pool-settings .amount .amount-tab .amount-right[data-v-69c6f988]{display:flex;align-items:center;justify-content:space-between}.container .pool-settings .amount .amount-tab .amount-right .amount-tab-btn[data-v-69c6f988]{width:60px;height:32px;font-size:12px;color:hsla(0,0%,100%,.75);line-height:32px;text-align:center;cursor:pointer;box-shadow:0 4px 12px 0 #25282c;border-radius:6px;border:1px solid #3f434e}.container .pool-settings .amount .amount-tab .amount-right .amount-tab-btn+.amount-tab-btn[data-v-69c6f988]{margin-left:20px}.container .pool-settings .amount .amount-tab .amount-right .amount-tab-btn[data-v-69c6f988]:active,.container .pool-settings .amount .amount-tab .amount-right .amount-tab-btn[data-v-69c6f988]:hover{background:#42454b;box-shadow:0 2px 6px 0 rgba(26,28,31,.5);border-radius:6px;border:1px solid #07ebad;color:#07ebad}.container .pool-settings .amount .amount-tab .amount-right .amount-tab-btn-active[data-v-69c6f988]{border-radius:6px;border:1px solid #07ebad;color:#07ebad}.container .pool-settings .amount .ant-slider[data-v-69c6f988]{margin:28px 0 0}.container .pool-settings .amount .ant-slider[data-v-69c6f988] .ant-slider-track{background:#07ebad}.container .pool-settings .amount .ant-slider[data-v-69c6f988] .ant-slider-rail{background:hsla(0,0%,100%,.1)}.container .pool-settings .amount .ant-slider[data-v-69c6f988] .ant-slider-handle.ant-tooltip-open{background:#07ebad}.container .pool-settings .liquidity-coins[data-v-69c6f988]{margin-top:20px;padding:25px 20px;box-shadow:0 4px 12px 0 #25282c;border-radius:10px;border:1px solid #3f434e}.container .pool-settings .liquidity-coins .before-coin[data-v-69c6f988]{display:flex;justify-content:space-between;align-items:center}.container .pool-settings .liquidity-coins .before-coin .coin-label[data-v-69c6f988]{font-size:14px;color:#b5b8c2}.container .pool-settings .liquidity-coins .before-coin .coin-num[data-v-69c6f988]{font-size:16px;font-weight:400;color:#fff}.container .pool-settings .liquidity-coins .before-coin .coin-num img[data-v-69c6f988]{width:20px;height:20px;margin-left:7px}.container .pool-settings .liquidity-coins .after-coin[data-v-69c6f988]{margin-top:21px}.container .pool-settings .liquidity-coins .coin-line[data-v-69c6f988]{width:100%;margin:30px 0;height:1px;box-shadow:0 4px 12px 0 #25282c;background-color:#3f434e}.container .remove-btn[data-v-69c6f988]{font-size:20px;width:100%;height:56px;background:linear-gradient(268deg,#5fe6d0,#596eff 32%,#6950f5 68%,#ad4ff6);box-shadow:0 4px 6px 0 rgba(26,28,31,.5);border-radius:10px;font-size:18px;font-weight:700;border:1px solid #e8e4ff;color:#fff;margin-top:40px}.container .remove-btn[data-v-69c6f988]:hover{background:linear-gradient(268deg,#68f5de,#6c7fff 32%,#7058f8 68%,#ba60ff)}.container .remove-btn[data-v-69c6f988]:disabled{border:2px solid rgba(232,228,255,.1);background:hsla(0,0%,100%,.1);cursor:not-allowed}.container .remove-btn[data-v-69c6f988]:disabled:hover{background:hsla(0,0%,100%,.1)}@media screen and (max-width:750px){.remove-container[data-v-69c6f988]{padding:20px 0 0;margin-top:0}.container[data-v-69c6f988]{width:100%}.container .pool-settings[data-v-69c6f988]{padding:20px 10px}.container .pool-settings .top-box .left img[data-v-69c6f988]{width:20px;height:20px}.container .pool-settings .top-box .left span[data-v-69c6f988]{font-size:14px}.container .pool-settings .amount .amount-tab .amount-right .amount-tab-btn[data-v-69c6f988]{width:40px}.container .pool-settings .amount .amount-tab .amount-right .amount-tab-btn+.amount-tab-btn[data-v-69c6f988]{margin-left:10px}}",""]),t.exports=o},3505:function(t,n,e){"use strict";e.r(n);e(2908);var o=e(2909),r=e.n(o),l=(e(3139),e(3140)),c=e.n(l),d=(e(601),e(423)),f=e.n(d),m=(e(52),e(27),e(201),e(61),e(384),e(95),e(43)),h=e(949),v=e(194),x=e(82),w=e(206),y=e(1),k=e(9),_=e.n(k),C=e(564),S=e(2947),A=function(t,n,e,o){return new(e||(e=Promise))((function(r,l){function c(t){try{f(o.next(t))}catch(t){l(t)}}function d(t){try{f(o.throw(t))}catch(t){l(t)}}function f(t){var n;t.done?r(t.value):(n=t.value,n instanceof e?n:new e((function(t){t(n)}))).then(c,d)}f((o=o.apply(t,n||[])).next())}))};m.default.use(c.a).use(f.a);var P=m.default.extend({components:{Slider:c.a,Button:f.a,Spin:r.a},mixins:[S.a],data:function(){return{title:"CRM",isRemove:!1,showSetting:!1,untitle:"USDT",nowtitle:"CRM",sliderValue:50,currentData:{},poolInfo:null,amountPercentageIndex:1,amountPercentage:[{name:"25%",value:.25},{name:"50%",value:.5},{name:"75%",value:.75},{name:"Max",value:1}],sliderChangeFlag:!1,fromCoinAmount:"0",toCoinAmount:"0",currentStatus:"",isLoading:!1}},computed:Object.assign({},Object(v.e)({wallet:function(t){return t.wallet},liquidity:function(t){return t.liquidity},url:function(t){return t.url}})),watch:{sliderValue:function(t){this.sliderValue=Math.ceil(t)},"liquidity.myPositions":{handler:"watchMyPosions",immediate:!0},"liquidity.currentPositon":{handler:"watchCurrentPositon",immediate:!0}},methods:{decimalFormat:x.c,importIcon:h.a,getFeeView:function(t){if(t){var n=Object(x.d)(t,9);return 0===Number(n)?"0":n}return"--"},gotoPosition:function(){this.$router.push("/position?version=v1")},watchMyPosions:function(t){},watchCurrentPositon:function(t){console.log("remove##watchCurrentPositon###currentPositon###",t);var n=this.$route.query.id;if(t&&t.nftTokenMint===n){this.currentData=t,t.fromCoinAmount&&(this.fromCoinAmount=String(t.fromCoinAmount*Number(this.sliderValue/100))),t.toCoinAmount&&(this.toCoinAmount=String(t.toCoinAmount*Number(this.sliderValue/100)));var e=t;this.poolInfo=e,console.log("remove####watchCurrentPositon###poolInfo######",e)}},setPercent:function(t,n){this.amountPercentageIndex=n,this.sliderValue=100*t.value;var e=this.currentData,o=e.fromCoinAmount,r=e.toCoinAmount;o&&r&&(this.fromCoinAmount=String(o*Number(t.value)),this.toCoinAmount=String(r*Number(t.value)))},sliderChange:function(t){this.sliderChangeFlag=!0,this.amountPercentageIndex=-1,this.setPercent({value:this.sliderValue/100},-1)},toRemoveNew:function(){var t,n;return A(this,void 0,void 0,regeneratorRuntime.mark((function e(){var o,r,l,c,d,f,m,h,v,x,k,S,A,P,$;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return this.sliderChangeFlag=!1,this.isLoading=!0,this.$web3,o=this.$wallet,r=Object(w.a)(this.poolInfo),l=Object(w.a)(this.currentData),e.next=8,Object(C.c)(r.tokenSwapKey,o);case 8:return c=e.sent,console.log("toRemoveNew####this.sliderValue / 100###",this.sliderValue/100),console.log("toRemoveNew####Number(this.$accessor.slippage) / 100###",Number(this.$accessor.slippage)/100),d=c.calculatePositionValueWithSlid(l.nftTokenId,new _.a(this.sliderValue/100),new _.a(Number(this.$accessor.slippage)/100)),this.$accessor.transaction.setTransactionDesc("Remove liquidity"),this.$accessor.transaction.setShowWaiting(!0),f="",d.minAmountA.toString()&&"0"!==d.minAmountA.toString()?(v=Math.pow(10,Math.floor(Number(l.token_a.decimal/2))),m=d.minAmountA.toNumber()<=v?new _.a(1):d.minAmountA.sub(v)):m=d.minAmountA,d.minAmountB.toString()&&"0"!==d.minAmountB.toString()?(x=Math.pow(10,Math.floor(Number(l.token_b.decimal/2))),h=d.minAmountB.toNumber()<=x?new _.a(1):d.minAmountB.sub(x)):h=d.minAmountB,e.prev=17,console.log("toRemoveNew####currentData.nftTokenId###",l.nftTokenId),console.log("toRemoveNew####positionValue.liquity###",d.liquity.toString()),console.log("toRemoveNew####positionValue.minAmountA###",d.minAmountA.toString()),console.log("toRemoveNew####positionValue.minAmountB###",d.minAmountB.toString()),console.log("toRemoveNew####currentData.nftTokenAccount###",l.nftTokenAccount),console.log("toRemoveNew####positionMinAmountA####",m.toString()),console.log("toRemoveNew####positionMinAmountB####",h.toString()),e.next=27,c.decreaseLiquityAtomic(l.nftTokenId,d.liquity,m,h,new y.PublicKey(l.nftTokenAccount));case 27:return k=e.sent,S={skipPreflight:!0,commitment:"confirmed",preflightCommitment:"confirmed",maxRetries:30,printLogs:!0},e.next=31,k.send(S);case 31:if(!(A=e.sent)||!A.signature){e.next=41;break}return f=A.signature,P="Remove  ".concat(this.fromCoinAmount," ").concat(null===(t=r.token_a)||void 0===t?void 0:t.symbol," and ").concat(this.toCoinAmount," ").concat(null===(n=r.token_b)||void 0===n?void 0:n.symbol," from the pool"),this.$accessor.transaction.setShowSubmitted(!0),$=this,this.$accessor.transaction.sub({txid:f,description:P,type:"Remove Liquidity",successCallback:function(){$.isLoading=!1,100===$.sliderValue?$.gotoPosition():($.$accessor.liquidity.getMyPositionsNew({tokenAccounts:$.wallet.tokenAccounts,owner:$.wallet.address}),$.$accessor.transaction.setShowSubmitted(!1))},errorCallback:function(){$.isLoading=!1}}),e.next=40,A.wait({commitment:"confirmed",useWebsocket:!0,retries:30});case 40:e.sent;case 41:e.next=51;break;case 43:e.prev=43,e.t0=e.catch(17),console.log("toRemoveLiquidity###error####",e.t0),this.isLoading=!1,this.$accessor.transaction.setShowWaiting(!1),this.$accessor.transaction.setShowSubmitted(!1),this.$notify.close(f+"loading"),this.$notify.error({key:"RemoveLiquidityFailed",message:"Remove liquidity failed",description:e.t0.message,class:"error",icon:this.$createElement("img",{class:{"notify-icon":!0},attrs:{src:"/icon_Error@2x.png"}})});case 51:case"end":return e.stop()}}),e,this,[[17,43]])})))}}}),$=(e(3411),e(144)),component=Object($.a)(P,(function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("div",{staticClass:"container remove-container"},[e("div",{staticClass:"back-btn",on:{click:t.gotoPosition}},[e("svg",{staticClass:"icon",attrs:{"aria-hidden":"true"}},[e("use",{attrs:{"xlink:href":"#icon-icon-return"}})])]),t._v(" "),e("div",{staticClass:"title"},[e("span",{staticClass:"left"},[t._v("Remove Liquidity")]),t._v(" "),e("RefreshIcon",{attrs:{loading:t.liquidity.currentPositonLoading},on:{refresh:t.refresh}})],1),t._v(" "),e("div",{staticClass:"pool-settings"},[e("div",{staticClass:"top-box"},[t.poolInfo?e("div",{staticClass:"left"},[e("img",{attrs:{src:t.poolInfo.token_a.icon||t.importIcon("/coins/"+t.poolInfo.token_a.symbol.toLowerCase()+".png")}}),t._v(" "),e("img",{staticClass:"last",attrs:{src:t.poolInfo.token_b.icon||t.importIcon("/coins/"+t.poolInfo.token_b.symbol.toLowerCase()+".png")}}),t._v(" "),e("span",[t._v(t._s(t.poolInfo.token_a.symbol)+" - "+t._s(t.poolInfo.token_b.symbol))]),t._v(" "),e("StatusBlock",{attrs:{"current-status":t.currentData.currentStatus}})],1):t._e(),t._v(" "),e("div",{staticClass:"right"},[e("SetIcon")],1)]),t._v(" "),e("div",{staticClass:"amount"},[e("div",{staticClass:"amount-title"},[t._v("Amount")]),t._v(" "),e("div",{staticClass:"amount-tab"},[e("div",{staticClass:"amount-left"},[t._v(t._s(t.sliderValue)+"%")]),t._v(" "),e("div",{staticClass:"amount-right"},t._l(t.amountPercentage,(function(n,o){return e("div",{key:n.name,staticClass:"amount-tab-btn",class:t.amountPercentageIndex==o||t.sliderValue/100==n.value?"amount-tab-btn-active":"",on:{click:function(e){return t.setPercent(n,o)}}},[t._v("\n            "+t._s(n.name)+"\n          ")])})),0)]),t._v(" "),e("Slider",{attrs:{"tooltip-visible":t.sliderChangeFlag,"tooltip-placement":"bottom"},on:{change:t.sliderChange},model:{value:t.sliderValue,callback:function(n){t.sliderValue=n},expression:"sliderValue"}})],1),t._v(" "),e("div",{staticClass:"liquidity-coins"},[e("div",{staticClass:"before-coin"},[t.poolInfo?e("div",{staticClass:"coin-label"},[t._v("Pooled "+t._s(t.poolInfo.token_a.symbol)+":")]):t._e(),t._v(" "),t.poolInfo?e("div",{staticClass:"coin-num"},[t._v("\n          "+t._s(t.decimalFormat(t.fromCoinAmount,t.poolInfo.token_a.decimal))+"\n        ")]):t._e()]),t._v(" "),e("div",{staticClass:"before-coin after-coin"},[t.poolInfo?e("div",{staticClass:"coin-label"},[t._v("Pooled "+t._s(t.poolInfo.token_b.symbol)+":")]):t._e(),t._v(" "),t.poolInfo?e("div",{staticClass:"coin-num"},[t._v("\n          "+t._s(t.decimalFormat(t.toCoinAmount,t.poolInfo.token_b.decimal))+"\n        ")]):t._e()]),t._v(" "),0!==Number(t.currentData.tokenaFee)||0!==Number(t.currentData.tokenbFee)?[e("div",{staticClass:"coin-line"}),t._v(" "),e("div",{staticClass:"before-coin"},[t.poolInfo?e("div",{staticClass:"coin-label"},[t._v(t._s(t.poolInfo.token_a.symbol)+" Fees Earned:")]):t._e(),t._v(" "),e("div",{staticClass:"coin-num"},[t._v("\n            "+t._s(t.getFeeView(t.currentData.tokenaFee))+"\n          ")])]),t._v(" "),e("div",{staticClass:"before-coin after-coin"},[t.poolInfo?e("div",{staticClass:"coin-label"},[t._v(t._s(t.poolInfo.token_b.symbol)+" Fees Earned:")]):t._e(),t._v(" "),e("div",{staticClass:"coin-num"},[t._v("\n            "+t._s(t.getFeeView(t.currentData.tokenbFee))+"\n          ")])])]:t._e()],2),t._v(" "),e("Button",{staticClass:"remove-btn",attrs:{disabled:t.isLoading,loading:t.isLoading},on:{click:t.toRemoveNew}},[t._v("Remove")])],1),t._v(" "),t.showSetting?e("Setting",{on:{onClose:function(){return t.showSetting=!1}}}):t._e(),t._v(" "),e("div",{directives:[{name:"show",rawName:"v-show",value:t.liquidity.currentPositonLoading,expression:"liquidity.currentPositonLoading"}],staticClass:"loading-global"},[e("Spin")],1)],1)}),[],!1,null,"69c6f988",null);n.default=component.exports;installComponents(component,{RefreshIcon:e(2938).default,StatusBlock:e(2933).default,SetIcon:e(2950).default,Setting:e(2939).default})}}]);