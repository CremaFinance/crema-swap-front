(window.webpackJsonp=window.webpackJsonp||[]).push([[35],{1914:function(t,e,o){var content=o(1977);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,o(97).default)("a5de7288",content,!0,{sourceMap:!1})},1976:function(t,e,o){"use strict";o(1914)},1977:function(t,e,o){var n=o(96),c=o(883),l=o(940),r=o(941),f=n(!1),d=c(l),m=c(r);f.push([t.i,".detail-info-block[data-v-49e7f4ce]{width:460px;height:188px;background-image:url("+d+");background-repeat:no-repeat;background-position:0 0;background-size:100% 100%;padding:15px 10px 10px 145px}.detail-info-block.unclaimed-fees[data-v-49e7f4ce]{background-image:url("+m+");background-size:100% 100%}.detail-info-block>.title[data-v-49e7f4ce]{display:flex;align-items:center;justify-content:space-between}.detail-info-block>.title h3[data-v-49e7f4ce]{font-size:14px;color:#fff}.detail-info-block>.title button[data-v-49e7f4ce]{width:100px;height:26px;background:linear-gradient(270deg,#5fe6d0,#60b2f1 33%,#9380ff 68%,#e590ff);border-radius:7px}.detail-info-block>.title button[data-v-49e7f4ce]:disabled{background:hsla(0,0%,100%,.1);cursor:not-allowed}.detail-info-block>.title button[data-v-49e7f4ce]:disabled:hover{background:hsla(0,0%,100%,.1)}.detail-info-block>.title button[data-v-49e7f4ce]:hover{background:linear-gradient(268deg,#74ffe8,#7592ff 39%,#a08fff 74%,#e89aff)}.detail-info-block .rates[data-v-49e7f4ce]{font-size:20px;color:#fff}.detail-info-block .info-box[data-v-49e7f4ce]{width:304px;background:rgba(0,0,0,.1);border-radius:10px;padding:4px 10px;margin-top:10px;display:flex;flex-direction:column}.detail-info-block .info-box.reverse[data-v-49e7f4ce]{flex-direction:column-reverse}.detail-info-block .info-box .info-block[data-v-49e7f4ce]{display:flex;align-items:center;justify-content:space-between;margin:6px 0}.detail-info-block .info-box .info-block .left[data-v-49e7f4ce],.detail-info-block .info-box .info-block .right[data-v-49e7f4ce]{display:flex;align-items:center}.detail-info-block .info-box .info-block .left img[data-v-49e7f4ce]{width:30px;height:30px}.detail-info-block .info-box .info-block .left span[data-v-49e7f4ce]{font-size:14px;color:#fff;margin-left:8px}.detail-info-block .info-box .info-block .left a[data-v-49e7f4ce]{display:block;width:20px;height:20px}.detail-info-block .info-box .info-block .left svg[data-v-49e7f4ce]{width:20px;height:20px;fill:hsla(0,0%,100%,.5)}.detail-info-block .info-box .info-block .left svg[data-v-49e7f4ce]:hover{fill:#07ebad}.detail-info-block .info-box .info-block .right .percent[data-v-49e7f4ce]{width:60px;height:28px;background:hsla(0,0%,100%,.1);border-radius:8px;display:flex;align-items:center;justify-content:center;margin-left:10px}@media screen and (max-width:750px){.unclaimed-fees[data-v-49e7f4ce]{background:none!important}.detail-info-block[data-v-49e7f4ce]{width:100%;background:none;padding:10px}.detail-info-block .info-box[data-v-49e7f4ce]{width:100%}}",""]),t.exports=f},2061:function(t,e,o){"use strict";o.r(e);o(334);var n=o(28),c=o(629),l=o(110),r=o(66),f=n.default.extend({props:{currentData:{type:Object,default:function(){return{}}},poolInfo:{type:Object,default:function(){return null}},title:{type:String,default:""},isLoading:{type:Boolean,default:!1},direction:{type:Boolean,default:!0}},computed:Object.assign(Object.assign({},Object(l.e)(["wallet","url"])),{tokenaNum:function(){return this.currentData&&this.poolInfo?"Liquidity"!==this.title?Number(this.currentData.tokenaFee)>1e-6?Object(r.c)(this.currentData.tokenaFee,this.poolInfo.coin.decimals):0===Number(this.currentData.tokenaFee)?"0":"<0.00001":Object(r.c)(this.currentData.fromCoinAmount,this.poolInfo.coin.decimals):"--"},tokenbNum:function(){return this.currentData&&this.poolInfo?"Liquidity"!==this.title?Number(this.currentData.tokenbFee)>1e-6?Object(r.c)(this.currentData.tokenbFee,this.poolInfo.pc.decimals):0===Number(this.currentData.tokenbFee)?"0":"<0.00001":Object(r.c)(this.currentData.toCoinAmount,this.poolInfo.pc.decimals):"--"}}),watch:{currentData:{handler:"currentDataWatch",immediate:!0}},methods:{decimalFormat:r.c,importIcon:c.a,currentDataWatch:function(t){},toClaim:function(){this.$emit("claim")},getPercent:function(t){var e=Number(this.currentData.fromCoinAmount),o=Number(this.currentData.toCoinAmount);return e&&o?"50%":"from"===t?e?"100%":"0%":o?"100%":"0%"},processShowUSD:function(t){return Number(t)<1e-4&&Number(t)>0?"<0.0001":t}}}),d=(o(1976),o(89)),component=Object(d.a)(f,(function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",{class:["detail-info-block","Liquidity"!==t.title?"unclaimed-fees":""]},[o("div",{staticClass:"title"},[o("h3",[t._v(t._s(t.title))]),t._v(" "),"Liquidity"!==t.title?o("button",{attrs:{disabled:t.isLoading||!t.wallet.connected||!(Number(t.currentData.tokenaFee)||Number(t.currentData.tokenbFee)),loading:t.isLoading},on:{click:t.toClaim}},[t._v("\n      Claim\n    ")]):t._e()]),t._v(" "),o("div",{staticClass:"rates"},[t._v("\n    $\n    "+t._s("Liquidity"!==t.title?t.processShowUSD(t.currentData.feeUSD):t.processShowUSD(t.currentData.amountUSD))+"\n  ")]),t._v(" "),o("div",{class:["info-box",t.direction?"":"reverse"]},[t.poolInfo?o("div",{staticClass:"info-block"},[o("div",{staticClass:"left"},[o("img",{attrs:{src:t.importIcon("/coins/"+t.poolInfo.coin.symbol.toLowerCase()+".png")}}),t._v(" "),o("span",[t._v(t._s(t.poolInfo.coin.symbol))]),t._v(" "),"Liquidity"===t.title?o("a",{attrs:{href:t.url.explorer+"/address/"+t.poolInfo.coin.mintAddress,target:"_blank"}},[o("svg",{staticClass:"icon",attrs:{"aria-hidden":"true"}},[o("use",{attrs:{"xlink:href":"#icon-icon-Jump"}})])]):t._e()]),t._v(" "),o("div",{staticClass:"right"},[o("span",{staticClass:"num"},[t._v(t._s(t.tokenaNum))]),t._v(" "),"Liquidity"===t.title?o("span",{staticClass:"percent"},[t._v(t._s(t.currentData.fromPercent)+"%")]):t._e()])]):t._e(),t._v(" "),t.poolInfo?o("div",{staticClass:"info-block"},[o("div",{staticClass:"left"},[o("img",{attrs:{src:t.importIcon("/coins/"+t.poolInfo.pc.symbol.toLowerCase()+".png")}}),t._v(" "),o("span",[t._v(t._s(t.poolInfo.pc.symbol))])]),t._v(" "),o("div",{staticClass:"right"},[o("span",{staticClass:"num"},[t._v(t._s(t.tokenbNum))]),t._v(" "),"Liquidity"===t.title?o("span",{staticClass:"percent"},[t._v(t._s(t.currentData.toPercent)+"%")]):t._e()])]):t._e()])])}),[],!1,null,"49e7f4ce",null);e.default=component.exports}}]);