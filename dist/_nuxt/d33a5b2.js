(window.webpackJsonp=window.webpackJsonp||[]).push([[33],{2152:function(t,e,o){var content=o(2226);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,o(96).default)("0fae2b13",content,!0,{sourceMap:!1})},2225:function(t,e,o){"use strict";o(2152)},2226:function(t,e,o){var n=o(95)(!1);n.push([t.i,".coin-block[data-v-b6fd3d18]{position:relative;width:460px;height:80px;background:#23262b;box-shadow:0 0 2px 0 #535966,0 2px 3px 1px #1a1c1f;border-radius:20px}.coin-block .coin-box[data-v-b6fd3d18]{display:flex;align-items:center;padding:8px}.coin-block .coin-box .coin-name[data-v-b6fd3d18]{width:148px;height:64px;border-radius:12px;border:1px solid #3f434e;display:flex;align-items:center;justify-content:center;background:linear-gradient(270deg,#3e434e,#2f333b);box-shadow:0 4px 12px 0 rgba(26,28,31,.5)}.coin-block .coin-box .coin-name img[data-v-b6fd3d18]{width:36px;height:36px;border-radius:100%;margin-right:6px}.coin-block .coin-box .coin-name span[data-v-b6fd3d18]{font-size:16px;color:#fff;font-weight:700}.coin-block .coin-box .coin-name svg[data-v-b6fd3d18]{width:20px;height:20px;fill:hsla(0,0%,100%,.5)}.coin-block .coin-box .coin-name:hover svg[data-v-b6fd3d18]{fill:#fff}.coin-block .coin-box .right[data-v-b6fd3d18]{height:64px;flex:1}.coin-block .coin-box .right .balance-box[data-v-b6fd3d18]{display:flex;justify-content:flex-end}.coin-block .coin-box .right .balance-box span[data-v-b6fd3d18]{font-size:14px;color:hsla(0,0%,100%,.5)}.coin-block .coin-box .right .balance-box button[data-v-b6fd3d18]{width:48px;height:24px;background:linear-gradient(233deg,#4bb5ff,#ce90ff);box-shadow:0 2px 9px 0 rgba(0,0,0,.59),-3px -3px 5px 0 hsla(0,0%,100%,.1);border-radius:7px;color:#fff;margin-left:10px;font-size:12px;cursor:pointer}.coin-block .coin-box .right .balance-box button[data-v-b6fd3d18]:disabled{background:hsla(0,0%,100%,.1);color:hsla(0,0%,100%,.5);box-shadow:none;cursor:not-allowed}.coin-block .coin-box .right>input[data-v-b6fd3d18]{font-size:24px;color:#fff;border:none;background:none;padding-left:10px;text-align:right;width:100%;margin-top:8px}.coin-block .lock-mask[data-v-b6fd3d18]{position:absolute;left:0;right:0;top:0;bottom:0;background:rgba(51,55,64,.9);display:flex;align-items:center;justify-content:center;border-radius:10px;padding:20px}.coin-block .lock-mask img[data-v-b6fd3d18]{width:40px;height:40px}.coin-block .lock-mask p[data-v-b6fd3d18]{height:40px;margin-left:10px;font-size:14px;color:#fff;text-align:center}@media screen and (max-width:750px){.coin-block[data-v-b6fd3d18]{width:100%}.coin-block .coin-box .coin-name[data-v-b6fd3d18]{width:120px}.coin-block .coin-box .balance-box[data-v-b6fd3d18]{text-align:right}}",""]),t.exports=n},2330:function(t,e,o){"use strict";o.r(e);o(229),o(197),o(87),o(198);var n=o(34),c=o(705),l=o(135),d=o(131),r=o(63),f=n.default.extend({model:{prop:"value",event:"onInput"},props:{value:{type:String,default:""},coinName:{type:String,default:""},balance:{type:Object,default:null},showMax:{type:Boolean,default:!0},disabled:{type:Boolean,default:!1},showLock:{type:Boolean,default:!1},notSelect:{type:Boolean,default:!1},coinObj:{type:Object,default:function(){return{}}},coinItem:{type:Object,default:function(){return{}}}},data:function(){return{pValue:""}},computed:Object.assign({},Object(d.e)(["wallet"])),watch:{value:function(t,e){this.pValue=t},pValue:function(t,e){var o=this,n=this.coinItem.decimals||6,c=t;c=Number(t.split(",").join(""))>99999999999?Object(r.a)("99999999999",n):Object(r.a)(t,n),this.$nextTick((function(){o.pValue=c}))}},methods:{importIcon:c.a,lt:l.c,selectCoin:function(){this.notSelect||this.$emit("onSelect")},handleInput:function(t){var e=t.target.value.split(",").join("");this.$emit("onInput",e)}}}),x=(o(2225),o(102)),component=Object(x.a)(f,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"coin-block"},[n("div",{staticClass:"coin-box"},[n("div",{directives:[{name:"lazy-container",rawName:"v-lazy-container",value:{selector:"img",error:"/images/icon_missing.png",loading:"/images/icon_missing.png"},expression:"{\n        selector: 'img',\n        error: '/images/icon_missing.png',\n        loading: '/images/icon_missing.png'\n      }"}],staticClass:"coin-name",on:{click:t.selectCoin}},[t.coinItem?n("img",{attrs:{"data-src":t.coinItem.logoURI}}):n("img",{attrs:{src:o(991)}}),t._v(" "),n("span",[t._v(t._s(t.coinItem&&t.coinItem.symbol||"Select"))]),t._v(" "),t.notSelect?t._e():n("svg",{staticClass:"icon",attrs:{"aria-hidden":"true"}},[n("use",{attrs:{"xlink:href":"#icon-icon-on"}})])]),t._v(" "),n("div",{staticClass:"right"},[n("div",{staticClass:"balance-box"},[n("span",[t._v("Balance: "+t._s(t.balance&&!t.balance.wei.isNaN()&&t.balance.fixed()||0))]),t._v(" "),t.balance?n("button",{staticClass:"max",attrs:{disabled:!t.balance||!Number(t.balance.fixed())},on:{click:function(e){return t.$emit("onMax")}}},[t._v("\n          MAX\n        ")]):t._e()]),t._v(" "),n("input",{attrs:{type:"text",step:"0.0000000001",autocomplete:"off",autocorrect:"off",placeholder:"0.00",pattern:"^[0-9]*[.,]?[0-9]*$",minlength:"1",max:"999999999999",spellcheck:"false",disabled:t.disabled},domProps:{value:t.pValue},on:{input:t.handleInput,focus:function(e){return t.$emit("onFocus")}}})])]),t._v(" "),t.showLock?n("div",{staticClass:"lock-mask"},[n("img",{attrs:{src:o(998)}}),t._v(" "),n("p",[t._v("The market price is outside your specified price range. Single-asset deposit only.")])]):t._e()])}),[],!1,null,"b6fd3d18",null);e.default=component.exports}}]);