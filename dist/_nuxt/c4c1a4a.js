(window.webpackJsonp=window.webpackJsonp||[]).push([[55,18,23,42,47],{1648:function(t,n,o){var content=o(1656);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,o(89).default)("f580aa36",content,!0,{sourceMap:!1})},1653:function(t,n,o){"use strict";o.r(n);o(1672);var input=o(1673),e=o.n(input),c=(o(428),o(172)),r=o.n(c),l=(o(62),o(430),o(25));l.default.use(r.a);var d=l.default.extend({components:{Modal:r.a,Input:e.a},data:function(){return{slippage:"",slippageArr:["0.1","0.5","1"]}},mounted:function(){this.slippage=this.$accessor.slippage},methods:{oninput:function(t){t.target.value=t.target.value.match(/^\d+(?:\.\d{0,2})?/)?t.target.value.match(/^\d+(?:\.\d{0,2})?/)[0]||null:"",t.target.value&&(this.slippage=t.target.value)},confirmSlippage:function(){this.$accessor.setSlippage(this.slippage),this.$emit("onClose")}}}),f=(o(1655),o(90)),component=Object(f.a)(d,(function(){var t=this,n=t.$createElement,o=t._self._c||n;return o("Modal",{attrs:{title:"Settings",zIndex:1070,centered:"",width:"400px",visible:!0,footer:null},on:{cancel:function(n){return t.$emit("onClose")}}},[o("div",{staticClass:"pool-setting"},[o("div",{staticClass:"slippage-tolerance"},[t._v("Slippage tolerance")]),t._v(" "),o("div",{staticClass:"input-content"},[t._l(t.slippageArr,(function(n,e){return o("div",{key:e,staticClass:"slippage-item",class:n===t.slippage?"slippage-item-active":"",on:{click:function(o){t.slippage=n}}},[t._v("\n        "+t._s(n)+"\n      ")])})),t._v(" "),o("Input",{attrs:{typ:"number",size:"large",suffix:"%"},on:{input:t.oninput},model:{value:t.slippage,callback:function(n){t.slippage=n},expression:"slippage"}})],2),t._v(" "),t.slippage?o("div",{staticClass:"slippage-hint",class:Number(t.slippage)>1&&50>=Number(t.slippage)?"slippage-hint-waring":Number(t.slippage)>50?"slippage-hint-error":""},[t._v("\n      "+t._s(Number(t.slippage)>1&&50>=Number(t.slippage)?"Your transaction may be fronturn":Number(t.slippage)>50?"Enter a valid slippage percentage":"")+"\n    ")]):t._e(),t._v(" "),o("div",{staticClass:"btn-box"},[o("Button",{staticClass:"disconnect-btn",on:{click:function(n){return t.$emit("onClose")}}},[t._v(" Cancel ")]),t._v(" "),o("div",{staticClass:"switch-wallet-btn-box"},[o("Button",{staticClass:"switch-wallet-btn",attrs:{disabled:Number(t.slippage)>50},on:{click:t.confirmSlippage}},[t._v("\n          Confirm\n        ")])],1)],1)])])}),[],!1,null,null,null);n.default=component.exports},1654:function(t,n,o){var content=o(1677);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,o(89).default)("4ad2e0bc",content,!0,{sourceMap:!1})},1655:function(t,n,o){"use strict";o(1648)},1656:function(t,n,o){var e=o(88)(!1);e.push([t.i,".gradient-btn-large{width:100%;height:56px;background:linear-gradient(214deg,#59bdad,#6676f5 61%,#9a89f9 76%,#eba7ff);border-radius:10px;font-size:20px;font-weight:700;border:2px solid rgba(232,228,255,.5);color:#fff}.gradient-btn-large:hover{background:linear-gradient(268deg,#74ffe8,#7592ff 39%,#a08fff 74%,#e89aff)}.gradient-btn-large:disabled{border:2px solid rgba(232,228,255,.1);cursor:not-allowed}.gradient-btn-large:disabled,.gradient-btn-large:disabled:hover{background:hsla(0,0%,100%,.1)}.new-gradient-btn-large{width:100%;height:56px;background:linear-gradient(180deg,#e4e2fe,#2881f2);box-shadow:0 4px 12px 0 rgba(26,28,31,.5);border-radius:16px;margin-top:20px;padding:1px}.pool-setting .slippage-tolerance{margin-top:14px;color:#b5b8c2}.pool-setting .input-content{margin-top:10px;display:flex;justify-content:space-between}.pool-setting .input-content .slippage-item{width:80px;height:40px;background:none;font-size:14px;font-weight:500;color:#fff;text-align:center;line-height:40px;box-shadow:0 4px 12px 0 #25282c;border-radius:10px;border:1px solid #3f434e}.pool-setting .input-content .slippage-item-active{background:#42454b;box-shadow:0 2px 6px 0 rgba(26,28,31,.5);border-radius:10px;color:#07ebad;border:1px solid #07ebad}.pool-setting .input-content input{width:80px;height:40px;color:#fff;border:none;background:#23262b;box-shadow:0 2px 3px 1px #1a1c1f;border-radius:10px}.pool-setting .input-content .ant-input-affix-wrapper{width:auto}.pool-setting .input-content .ant-input-affix-wrapper .ant-input-suffix{color:#fff}.pool-setting .input-content .ant-input-affix-wrapper input{text-align:center!important;font-size:14px;line-height:20px;background:#23262b;box-shadow:0 2px 3px 1px #1a1c1f;border-radius:10px}.pool-setting .slippage-hint{margin-top:14px}.pool-setting .slippage-hint-waring{color:#fb0}.pool-setting .slippage-hint-error{color:#ff5050}.pool-setting .btn-box{display:flex;margin-top:40px;justify-content:space-between}.pool-setting .disconnect-btn{width:168px;height:48px;box-shadow:0 4px 12px 0 #25282c;border-radius:12px;font-size:16px;border:1px solid #3f434e;font-weight:600;background:transparent}.pool-setting .disconnect-btn:hover{background:hsla(0,0%,100%,.05)}.pool-setting .switch-wallet-btn-box{width:168px;height:46px;margin-top:0;margin-left:0!important;border-radius:12px}.pool-setting .switch-wallet-btn-box .switch-wallet-btn{width:100%;height:56px;background:linear-gradient(214deg,#59bdad,#6676f5 61%,#9a89f9 76%,#eba7ff);border-radius:10px;font-size:20px;font-weight:700;border:2px solid rgba(232,228,255,.5);color:#fff;height:100%;font-size:16px}.pool-setting .switch-wallet-btn-box .switch-wallet-btn:hover{background:linear-gradient(268deg,#74ffe8,#7592ff 39%,#a08fff 74%,#e89aff)}.pool-setting .switch-wallet-btn-box .switch-wallet-btn:disabled{border:2px solid rgba(232,228,255,.1);background:hsla(0,0%,100%,.1);cursor:not-allowed}.pool-setting .switch-wallet-btn-box .switch-wallet-btn:disabled:hover{background:hsla(0,0%,100%,.1)}@media screen and (max-width:750px){.pool-setting .input-content .slippage-item,.pool-setting .input-content input{width:60px}}",""]),t.exports=e},1657:function(t,n,o){var content=o(1680);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,o(89).default)("630259c2",content,!0,{sourceMap:!1})},1674:function(t,n,o){"use strict";var e=o(22),c=o(834);e({target:"String",proto:!0,forced:o(835)("fixed")},{fixed:function(){return c(this,"tt","","")}})},1676:function(t,n,o){"use strict";o(1654)},1677:function(t,n,o){var e=o(88)(!1);e.push([t.i,".set-icon-container .set-icon-box[data-v-54d05da4]{width:30px;height:30px;padding:1px;border-radius:15px;background:linear-gradient(137deg,#23262b,#3e434e)}.set-icon-container .set-icon-box .set-icon-content[data-v-54d05da4]{width:28px;height:28px;border-radius:14px;background:linear-gradient(141deg,#383e49,#1a1c1f);box-shadow:2px 4px 12px 0 #23262b,-3px -2px 10px 0 rgba(138,147,160,.16);display:flex;align-items:center;justify-content:center}.set-icon-container .set-icon-box .set-icon-content[data-v-54d05da4]:hover{background:linear-gradient(141deg,#424953,#2a2e33)}.set-icon-container .set-icon-box .set-icon-content .icon[data-v-54d05da4]{width:16px;height:16px;fill:#fff;cursor:pointer}",""]),t.exports=e},1678:function(t,n,o){var content=o(1697);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,o(89).default)("1bac5186",content,!0,{sourceMap:!1})},1679:function(t,n,o){"use strict";o(1657)},1680:function(t,n,o){var e=o(88)(!1);e.push([t.i,".coin-block[data-v-282c4c29]{position:relative;width:460px;height:80px;background:#23262b;box-shadow:0 0 2px 0 #535966,0 2px 3px 1px #1a1c1f;border-radius:20px}.coin-block .coin-box[data-v-282c4c29]{display:flex;align-items:center;padding:8px 20px 8px 8px}.coin-block .coin-box .coin-name[data-v-282c4c29]{width:148px;height:64px;border-radius:12px;border:1px solid #3f434e;display:flex;align-items:center;justify-content:center;background:linear-gradient(270deg,#3e434e,#2f333b);box-shadow:0 4px 12px 0 rgba(26,28,31,.5)}.coin-block .coin-box .coin-name img[data-v-282c4c29]{width:36px;height:36px;border-radius:100%;margin-right:6px}.coin-block .coin-box .coin-name span[data-v-282c4c29]{font-size:16px;color:#fff;font-weight:700}.coin-block .coin-box .coin-name svg[data-v-282c4c29]{width:20px;height:20px;fill:hsla(0,0%,100%,.5)}.coin-block .coin-box .coin-name:hover svg[data-v-282c4c29]{fill:#fff}.coin-block .coin-box .right[data-v-282c4c29]{height:64px;flex:1}.coin-block .coin-box .right .balance-box[data-v-282c4c29]{display:flex;justify-content:flex-end}.coin-block .coin-box .right .balance-box span[data-v-282c4c29]{font-size:14px;color:hsla(0,0%,100%,.5)}.coin-block .coin-box .right .balance-box button[data-v-282c4c29]{width:48px;height:24px;background:linear-gradient(233deg,#4bb5ff,#ce90ff);box-shadow:0 2px 9px 0 rgba(0,0,0,.59),-3px -3px 5px 0 hsla(0,0%,100%,.1);border-radius:7px;color:#fff;margin-left:10px;font-size:12px}.coin-block .coin-box .right>input[data-v-282c4c29]{font-size:24px;color:#fff;border:none;background:none;padding-left:10px;text-align:right;width:100%;margin-top:10px}.coin-block .lock-mask[data-v-282c4c29]{position:absolute;left:0;right:0;top:0;bottom:0;background:rgba(51,55,64,.9);display:flex;align-items:center;justify-content:center;border-radius:10px;padding:20px}.coin-block .lock-mask img[data-v-282c4c29]{width:40px;height:40px}.coin-block .lock-mask p[data-v-282c4c29]{height:40px;margin-left:10px;font-size:14px;color:#fff;text-align:center}@media screen and (max-width:750px){.coin-block[data-v-282c4c29]{width:100%}.coin-block .coin-box .coin-name[data-v-282c4c29]{width:120px}.coin-block .coin-box .balance-box[data-v-282c4c29]{text-align:right}}",""]),t.exports=e},1684:function(t,n,o){"use strict";o.r(n);var e=o(25),c=o(593),r=o(103),l=o(96),d=e.default.extend({model:{prop:"value",event:"onInput"},props:{value:{type:String,default:""},coinName:{type:String,default:""},balance:{type:Object,default:null},showMax:{type:Boolean,default:!0},disabled:{type:Boolean,default:!1},showLock:{type:Boolean,default:!1},notSelect:{type:Boolean,default:!1},coinObj:{type:Object,default:function(){return{}}}},computed:Object.assign(Object.assign({},Object(l.e)(["wallet"])),{coinBalance:function(){if(this.coinObj&&this.coinObj.mintAddress&&this.wallet.tokenAccounts){var t=this.wallet.tokenAccounts[this.coinObj.mintAddress];if(t&&t.balance)return t.balance}return 0}}),methods:{importIcon:c.a,lt:r.c,selectCoin:function(){this.notSelect||this.$emit("onSelect")}}}),f=(o(1679),o(90)),component=Object(f.a)(d,(function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("div",{staticClass:"coin-block"},[e("div",{staticClass:"coin-box"},[e("div",{staticClass:"coin-name",on:{click:t.selectCoin}},[t.coinName?e("img",{attrs:{src:t.importIcon("/coins/"+t.coinName.toLowerCase()+".png")}}):e("img",{attrs:{src:o(828)}}),t._v(" "),e("span",[t._v(t._s(t.coinName||"Select"))]),t._v(" "),t.notSelect?t._e():e("svg",{staticClass:"icon",attrs:{"aria-hidden":"true"}},[e("use",{attrs:{"xlink:href":"#icon-icon-on"}})])]),t._v(" "),e("div",{staticClass:"right"},[e("div",{staticClass:"balance-box"},[e("span",[t._v("Balance: "+t._s(t.balance&&!t.balance.wei.isNaN()&&t.balance.fixed()||0))]),t._v(" "),t.showMax&&t.balance&&(!t.value||t.lt(t.value,t.balance.toEther()))?e("button",{staticClass:"max",on:{click:function(n){return t.$emit("onMax")}}},[t._v("\n          MAX\n        ")]):t._e()]),t._v(" "),e("input",{attrs:{type:"text",autocomplete:"off",autocorrect:"off",placeholder:"0.00",pattern:"^[0-9]*[.,]?[0-9]*$",minlength:"1",maxlength:"79",spellcheck:"false",disabled:t.disabled},domProps:{value:t.value},on:{input:function(n){return t.$emit("onInput",n.target.value)},focus:function(n){return t.$emit("onFocus")}}})])]),t._v(" "),t.showLock?e("div",{staticClass:"lock-mask"},[e("img",{attrs:{src:o(831)}}),t._v(" "),e("p",[t._v("The market price is outside your specified price range. Single-asset deposit only.")])]):t._e()])}),[],!1,null,"282c4c29",null);n.default=component.exports},1685:function(t,n,o){"use strict";o.r(n);var e=o(157).Vue.extend({data:function(){return{showSetting:!1}}}),c=(o(1676),o(90)),component=Object(c.a)(e,(function(){var t=this,n=t.$createElement,o=t._self._c||n;return o("div",{staticClass:"set-icon-container"},[o("div",{staticClass:"set-icon-box"},[o("div",{staticClass:"set-icon-content"},[o("svg",{staticClass:"icon",attrs:{"aria-hidden":"true"},on:{click:function(n){t.showSetting=!0}}},[o("use",{attrs:{"xlink:href":"#icon-a-bianzu81"}})])])]),t._v(" "),t.showSetting?o("Setting",{on:{onClose:function(){return t.showSetting=!1}}}):t._e()],1)}),[],!1,null,"54d05da4",null);n.default=component.exports;installComponents(component,{Setting:o(1653).default})},1696:function(t,n,o){"use strict";o(1678)},1697:function(t,n,o){var e=o(88)(!1);e.push([t.i,".coin-tab[data-v-2f5c454b]{width:126px;height:28px;background:hsla(0,0%,100%,.1)}.coin-tab[data-v-2f5c454b],.coin-tab>div[data-v-2f5c454b]{border-radius:8px;display:flex}.coin-tab>div[data-v-2f5c454b]{width:62px;align-items:center;justify-content:center;font-size:12px;color:#fff;cursor:pointer}.coin-tab>div.active[data-v-2f5c454b]{background:linear-gradient(233deg,#4bb5ff,#ce90ff)}",""]),t.exports=e},1702:function(t,n,o){"use strict";o.r(n);var e=o(157).Vue.extend({props:{list:{type:Array,default:function(){return["-",""]}},current:{type:String,default:"-"}},data:function(){return{showSetting:!1}},methods:{changeDirection:function(t){t!==this.current&&this.$emit("onChange",t)}}}),c=(o(1696),o(90)),component=Object(c.a)(e,(function(){var t=this,n=t.$createElement,o=t._self._c||n;return o("div",{staticClass:"coin-tab"},t._l(t.list,(function(n,e){return o("div",{key:e,class:n===t.current?"active":"",on:{click:function(o){return t.changeDirection(n)}}},[t._v("\n    "+t._s(n)+"\n  ")])})),0)}),[],!1,null,"2f5c454b",null);n.default=component.exports},1830:function(t,n,o){var content=o(2002);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,o(89).default)("5966e99c",content,!0,{sourceMap:!1})},2001:function(t,n,o){"use strict";o(1830)},2002:function(t,n,o){var e=o(88)(!1);e.push([t.i,".gradient-btn-large[data-v-2216ca0a]{width:100%;height:56px;background:linear-gradient(214deg,#59bdad,#6676f5 61%,#9a89f9 76%,#eba7ff);border-radius:10px;font-size:20px;font-weight:700;border:2px solid rgba(232,228,255,.5);color:#fff}.gradient-btn-large[data-v-2216ca0a]:hover{background:linear-gradient(268deg,#74ffe8,#7592ff 39%,#a08fff 74%,#e89aff)}.gradient-btn-large[data-v-2216ca0a]:disabled{border:2px solid rgba(232,228,255,.1);cursor:not-allowed}.gradient-btn-large[data-v-2216ca0a]:disabled,.gradient-btn-large[data-v-2216ca0a]:disabled:hover{background:hsla(0,0%,100%,.1)}.new-gradient-btn-large[data-v-2216ca0a]{width:100%;height:56px;background:linear-gradient(180deg,#e4e2fe,#2881f2);box-shadow:0 4px 12px 0 rgba(26,28,31,.5);border-radius:16px;margin-top:20px;padding:1px}.increase-container[data-v-2216ca0a]{width:996px;margin:0 auto}.increase-container .go-back-box .icon[data-v-2216ca0a]{width:20px;height:20px;fill:#fff}.increase-container .go-back-box .icon[data-v-2216ca0a]:hover{fill:#07ebad}.increase-container>.title[data-v-2216ca0a]{font-size:20px;font-weight:600;color:#fff}.increase-container .increase-body[data-v-2216ca0a]{width:100%;min-height:449px;background:linear-gradient(214deg,#3e434e,#23262b);border-radius:20px;border:1px solid #565c6a;padding:20px}.increase-container .increase-body .top[data-v-2216ca0a]{display:flex;align-items:center;justify-content:space-between}.increase-container .increase-body .top .coin-pair[data-v-2216ca0a]{display:flex;align-items:center}.increase-container .increase-body .top .coin-pair img[data-v-2216ca0a]{width:36px;height:36px;border-radius:100%}.increase-container .increase-body .top .coin-pair img.last[data-v-2216ca0a]{margin-left:-10px}.increase-container .increase-body .top .coin-pair span[data-v-2216ca0a]{font-size:16px;color:#fff;margin-left:8px;margin-right:8px}.increase-container .increase-body .increase-content[data-v-2216ca0a]{display:flex;justify-content:space-between;margin-top:20px}.increase-container .increase-body .increase-content .left[data-v-2216ca0a],.increase-container .increase-body .increase-content .right[data-v-2216ca0a]{width:458px}.increase-container .increase-body .increase-content .left .liquidity-info[data-v-2216ca0a]{width:456px;height:100px;box-shadow:0 4px 12px 0 #25282c;border-radius:10px;border:1px solid #3f434e;padding:12px 20px;margin-bottom:0}.increase-container .increase-body .increase-content .left .liquidity-info li[data-v-2216ca0a]{display:flex;align-items:center;justify-content:space-between;color:#fff;font-size:14px;margin-top:6px}.increase-container .increase-body .increase-content .left .liquidity-info li[data-v-2216ca0a]:first-child{margin-top:0}.increase-container .increase-body .increase-content .left .selected-range-title[data-v-2216ca0a]{display:flex;align-items:center;justify-content:space-between;margin-top:24px}.increase-container .increase-body .increase-content .left .selected-range-title>span[data-v-2216ca0a]{font-size:16px}.increase-container .increase-body .increase-content .left .price-rate[data-v-2216ca0a]{text-align:right;font-size:16px;font-family:Arial-BoldMT,Arial;font-weight:400;color:#fff;line-height:16px;background:linear-gradient(233deg,#4bb5ff,#ce90ff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-top:14px}.increase-container .increase-body .increase-content .left .price-range-box[data-v-2216ca0a]{width:456px;height:144px;box-shadow:0 4px 12px 0 #25282c;border-radius:10px;border:1px solid #3f434e;padding:0 20px;margin-top:12px}.increase-container .increase-body .increase-content .left .price-range-box .price-box[data-v-2216ca0a]{border-bottom:1px solid hsla(0,0%,100%,.1);display:flex;align-items:center;padding-top:14px;padding-bottom:8px;justify-content:space-between}.increase-container .increase-body .increase-content .left .price-range-box .price-box .price-item[data-v-2216ca0a]{width:180px;text-align:center}.increase-container .increase-body .increase-content .left .price-range-box .price-box .price-item h3[data-v-2216ca0a]{font-size:12px;color:hsla(0,0%,100%,.5);margin-bottom:0}.increase-container .increase-body .increase-content .left .price-range-box .price-box .price-item div[data-v-2216ca0a]{font-size:14px;color:#fff;padding:6px 0}.increase-container .increase-body .increase-content .left .price-range-box .price-box .price-item p[data-v-2216ca0a]{font-size:12px;color:hsla(0,0%,100%,.5);margin-bottom:0}.increase-container .increase-body .increase-content .left .price-range-box .note-box[data-v-2216ca0a]{display:flex;align-items:center;justify-content:space-between;padding-top:8px}.increase-container .increase-body .increase-content .left .price-range-box .note-box .note-item[data-v-2216ca0a]{width:180px;font-size:12px;color:#b5b8c2;margin-bottom:0}.increase-container .increase-body .increase-content .right .coin-block-gap[data-v-2216ca0a]{width:100%;height:36px}.increase-container .increase-body .increase-content .right .add-more-liquidity[data-v-2216ca0a]{width:100%;height:56px;background:linear-gradient(214deg,#59bdad,#6676f5 61%,#9a89f9 76%,#eba7ff);border-radius:10px;font-size:20px;font-weight:700;border:2px solid rgba(232,228,255,.5);color:#fff;margin-top:40px}.increase-container .increase-body .increase-content .right .add-more-liquidity[data-v-2216ca0a]:hover{background:linear-gradient(268deg,#74ffe8,#7592ff 39%,#a08fff 74%,#e89aff)}.increase-container .increase-body .increase-content .right .add-more-liquidity[data-v-2216ca0a]:disabled{border:2px solid rgba(232,228,255,.1);background:hsla(0,0%,100%,.1);cursor:not-allowed}.increase-container .increase-body .increase-content .right .add-more-liquidity[data-v-2216ca0a]:disabled:hover{background:hsla(0,0%,100%,.1)}@media screen and (max-width:750px){.increase-container[data-v-2216ca0a]{width:100%}.increase-container .increase-body[data-v-2216ca0a]{padding:20px 10px}.increase-container .increase-body .increase-content[data-v-2216ca0a]{display:block}.increase-container .increase-body .increase-content .left[data-v-2216ca0a],.increase-container .increase-body .increase-content .left .liquidity-info[data-v-2216ca0a]{width:100%}.increase-container .increase-body .increase-content .left .price-range-box[data-v-2216ca0a]{width:100%;height:auto}.increase-container .increase-body .increase-content .left .price-range-box .note-item[data-v-2216ca0a]{text-align:center}.increase-container .increase-body .increase-content .right[data-v-2216ca0a]{width:100%;margin-top:30px}}",""]),t.exports=e},2081:function(t,n,o){"use strict";o.r(n);o(429);var e=o(272),c=o.n(e),r=(o(1674),o(269),o(35),o(105),o(120),o(595),o(173),o(157)),l=o(96),d=o(593),f=o(93),h=o(103),x=o(216),m=o(1721),v=o(102),C=o(2064),w=r.Vue.extend({components:{Button:c.a},data:function(){return{currentData:{},direction:!0,coinTabList:[],currentCoin:"",fromCoin:{},toCoin:{},fromCoinAmount:"",toCoinAmount:"",fixedFromCoin:!0,showFromCoinLock:!1,showToCoinLock:!1,deltaLiquity:0,poolInfo:null,isLoading:!1}},computed:Object.assign(Object.assign({},Object(l.e)({wallet:function(t){return t.wallet},liquidity:function(t){return t.liquidity},url:function(t){return t.url}})),{isDisabled:function(){var t=this.showFromCoinLock,n=this.showToCoinLock,o=this.$data.fromCoinAmount,e=this.$data.toCoinAmount;return!(t&&!n&&e)&&(!(n&&!t&&o)&&!(!n&&!t&&e&&o))},insufficientBalance:function(){var t=this.$data.fromCoin&&this.$data.fromCoin.balance&&this.$data.fromCoin.balance.fixed()||"",n=this.$data.toCoin&&this.$data.toCoin.balance&&this.$data.toCoin.balance.fixed()||"",o=Object(h.b)(this.$data.fromCoinAmount,t),e=Object(h.b)(this.$data.toCoinAmount,n),c=this.showFromCoinLock,r=this.showToCoinLock;return!(c&&!r&&!e)&&(!(r&&!c&&!o)&&!!(c||r||o||e))},noEnterAmount:function(){var t=Number(this.fromCoinAmount),n=Number(this.toCoinAmount),o=this.showFromCoinLock,e=this.showToCoinLock;return!(!o||e||n)||(!(!e||o||t)||!(o||e||t&&n))}}),watch:{"liquidity.myPositions":{handler:"watchMyPosions",immediate:!0},"liquidity.currentPositon":{handler:"watchCurrentPositon",immediate:!0},direction:function(t){this.currentCoin=t?this.coinTabList[0]:this.coinTabList[1]}},methods:{fixD:f.d,decimalFormat:f.c,importIcon:d.a,updateAmounts:function(){var t,n,o,e,c,r,l,d,m,v,C,w=this.currentData.lower_tick,y=this.currentData.upper_tick;if(this.fixedFromCoin?(v=new h.a(this.fromCoinAmount,null===(t=this.fromCoin)||void 0===t?void 0:t.decimals,!1).wei.toNumber(),C=(null===(n=this.fromCoin)||void 0===n?void 0:n.symbol)===this.poolInfo.coin.symbol&&(null===(o=this.toCoin)||void 0===o?void 0:o.symbol)===this.poolInfo.pc.symbol?0:1):(v=new h.a(this.toCoinAmount,null===(e=this.toCoin)||void 0===e?void 0:e.decimals,!1).wei.toNumber(),C=(null===(c=this.toCoin)||void 0===c?void 0:c.symbol)===this.poolInfo.coin.symbol&&(null===(r=this.toCoin)||void 0===r?void 0:r.symbol)===this.poolInfo.pc.symbol?0:1),this.showFromCoinLock||this.showToCoinLock)if(this.showToCoinLock){if(!this.showFromCoinLock){var _=new h.a(this.fromCoinAmount,null===(m=this.fromCoin)||void 0===m?void 0:m.decimals,!1).wei.toNumber(),k=Object(x.c)(w,y,_);this.deltaLiquity=k}}else{var A=new h.a(this.toCoinAmount,null===(d=this.toCoin)||void 0===d?void 0:d.decimals,!1).wei.toNumber(),I=Object(x.d)(w,y,A);this.deltaLiquity=I}else{var j=Object(x.e)(w,y,v,this.poolInfo.current_price,C),$=j.dst,L=j.delta_liquity,O=(null===(l=this.toCoin)||void 0===l?void 0:l.decimals)||6;if(this.deltaLiquity=L,this.fixedFromCoin){var S=Object(f.d)(Math.abs($)/Math.pow(10,O),O)||"0";this.toCoinAmount=S}else{var M=Object(f.d)(Math.abs($)/Math.pow(10,O),O)||"0";this.fromCoinAmount=M}}},inputChange:function(t){this.fixedFromCoin?(this.fromCoinAmount=t,this.updateAmounts()):(this.toCoinAmount=t,this.updateAmounts())},goBackDetail:function(){var t=this.$route.params.id;this.$router.push("/detail/".concat(t))},watchMyPosions:function(t){this.$route.params.id;this.$accessor.liquidity.setCurrentPositon({myPosions:t,id:this.$route.params.id})},watchCurrentPositon:function(t){var n=this.$route.params.id;if(t&&t.id===n&&(this.currentData=t,!Object(f.b)(t))){var o=t.poolInfo;this.poolInfo=o,o.coin&&o.pc&&(this.coinTabList=[o.coin.symbol,o.pc.symbol],this.currentCoin=o.coin.symbol,this.fromCoin=o.coin,this.toCoin=o.pc,this.updateCoinInfo(this.wallet.tokenAccounts),Number(t.fromCoinAmount)?this.showFromCoinLock=!1:this.showFromCoinLock=!0,Number(t.toCoinAmount)?this.showToCoinLock=!1:this.showToCoinLock=!0)}},changeDirection:function(){this.direction=!this.direction},maxBtnSelect:function(t){var n,o;"fromCoin"===t?(this.fixedFromCoin=!0,this.fromCoinAmount=this.fromCoin&&this.fromCoin.balance?"SOL"!==this.fromCoin.symbol?this.fromCoin.balance.fixed():String(Number(this.fromCoin.balance.fixed())-.05):"0"):(this.fixedFromCoin=!1,this.toCoinAmount=(null===(o=null===(n=this.toCoin)||void 0===n?void 0:n.balance)||void 0===o?void 0:o.fixed())||"")},updateCoinInfo:function(t){if(this.fromCoin){var n=t[this.fromCoin.mintAddress];n&&(this.fromCoin=Object.assign(Object.assign({},this.fromCoin),n))}if(this.toCoin){var o=t[this.toCoin.mintAddress];o&&(this.toCoin=Object.assign(Object.assign({},this.toCoin),o))}},supply:function(){var t=this;this.isLoading=!0;var n,o,e=this.$web3,c=this.$wallet,r=Object(v.a)(this.poolInfo),l=Object(v.a)(this.currentData),d=Object(C.a)(this.wallet.tokenAccounts,"".concat(r.coin.mintAddress,".tokenAccountAddress")),h=Object(C.a)(this.wallet.tokenAccounts,"".concat(r.pc.mintAddress,".tokenAccountAddress")),x=Object(C.a)(this.wallet.tokenAccounts,"".concat(l.nft_token_id,".tokenAccountAddress")),w=Object(f.e)().toString();this.$notify.info({key:w,message:"Making transaction...",description:"",duration:0,icon:this.$createElement("img",{class:{"notify-icon":!0},attrs:{src:"/tanhao@2x.png"}})}),this.fromCoinAmount&&(n=Number(this.fromCoinAmount)*(1+Number(this.$accessor.slippage)/100)),this.toCoinAmount&&(o=Number(this.toCoinAmount)*(1+Number(this.$accessor.slippage)/100)),Object(m.a)(e,c,r,r.coin,r.pc,d,h,l.nft_token_id,x,l.lower_tick,l.upper_tick,this.deltaLiquity,n,o,1).then((function(n){var o,e;t.$notify.info({key:w,message:"Transaction has been sent",icon:t.$createElement("img",{class:{"notify-icon":!0},attrs:{src:"/tanhao@2x.png"}}),description:function(o){return o("div",["Confirmation is in progress.  Check your transaction on ",o("a",{attrs:{href:"".concat(t.url.explorer,"/tx/").concat(n),target:"_blank"}},"here")])}});var c="Add liquidity  ".concat(t.fromCoinAmount," ").concat(null===(o=r.coin)||void 0===o?void 0:o.symbol," and ").concat(t.toCoinAmount," ").concat(null===(e=r.pc)||void 0===e?void 0:e.symbol," to the pool");t.$accessor.transaction.sub({txid:n,description:c}),t.$accessor.transaction.setShowSubmitted(!0),setTimeout((function(){t.$accessor.liquidity.requestInfos()}),2e3)})).catch((function(n){console.log("error#####",n),t.$notify.error({key:w,message:"Add liquidity failed",description:n.message,class:"error",icon:t.$createElement("img",{class:{"notify-icon":!0},attrs:{src:"/icon_Error@2x.png"}})})})).finally((function(){t.fromCoinAmount="",t.toCoinAmount="",t.isLoading=!1}))}}}),y=(o(2001),o(90)),component=Object(y.a)(w,(function(){var t=this,n=t.$createElement,o=t._self._c||n;return o("div",{staticClass:"increase-container"},[o("div",{staticClass:"go-back-box"},[o("svg",{staticClass:"icon",attrs:{"aria-hidden":"true"},on:{click:t.goBackDetail}},[o("use",{attrs:{"xlink:href":"#icon-icon-return"}})])]),t._v(" "),o("h3",{staticClass:"title"},[t._v("Increase Liquidity")]),t._v(" "),o("div",{staticClass:"increase-body"},[o("div",{staticClass:"top"},[o("div",{staticClass:"coin-pair"},[t.poolInfo?o("img",{attrs:{src:t.importIcon("/coins/"+t.poolInfo.coin.symbol.toLowerCase()+".png"),alt:""}}):t._e(),t._v(" "),t.poolInfo?o("img",{staticClass:"last",attrs:{src:t.importIcon("/coins/"+t.poolInfo.pc.symbol.toLowerCase()+".png"),alt:""}}):t._e(),t._v(" "),t.poolInfo?o("span",[t._v(t._s(t.poolInfo.coin.symbol)+" - "+t._s(t.poolInfo.pc.symbol))]):t._e(),t._v(" "),o("StatusBlock",{attrs:{"current-status":t.currentData.currentStatus}})],1),t._v(" "),o("div",{staticClass:"right"},[o("SetIcon")],1)]),t._v(" "),o("div",{staticClass:"increase-content"},[o("div",{staticClass:"left"},[o("ul",{staticClass:"liquidity-info"},[t.poolInfo?o("li",[o("span",[t._v(t._s(t.poolInfo.coin.symbol))]),t._v(" "),o("span",[t._v(t._s(t.currentData.fromCoinAmount))])]):t._e(),t._v(" "),t.poolInfo?o("li",[o("span",[t._v(t._s(t.poolInfo.pc.symbol))]),t._v(" "),o("span",[t._v(t._s(t.currentData.toCoinAmount))])]):t._e(),t._v(" "),t.poolInfo?o("li",[o("span",[t._v("Fee Tier")]),t._v(" "),o("span",[t._v(t._s(t.poolInfo.feeView)+" %")])]):t._e()]),t._v(" "),o("div",{staticClass:"selected-range-title"},[o("span",[t._v("Selected Range")]),t._v(" "),o("CoinTab",{attrs:{list:t.coinTabList,current:t.currentCoin},on:{onChange:t.changeDirection}})],1),t._v(" "),t.direction&&t.poolInfo?o("div",{staticClass:"price-rate"},[t._v("\n          1 "+t._s(t.poolInfo.coin.symbol)+" ≈ "+t._s(t.fixD(t.poolInfo.currentPriceView,t.poolInfo.pc.decimals))+"\n          "+t._s(t.poolInfo.pc.symbol)+"\n        ")]):!t.direction&&t.poolInfo?o("div",{staticClass:"price-rate"},[t._v("\n          1 "+t._s(t.poolInfo.pc.symbol)+" ≈ "+t._s(t.fixD(t.poolInfo.currentPriceViewReverse,t.poolInfo.coin.decimals))+"\n          "+t._s(t.poolInfo.coin.symbol)+"\n        ")]):t._e(),t._v(" "),t.currentData&&t.poolInfo?o("div",{staticClass:"price-range-box"},[o("div",{staticClass:"price-box"},[o("div",{staticClass:"price-item"},[o("h3",[t._v("Min Price")]),t._v(" "),t.direction?o("div",[t._v(t._s(t.decimalFormat(t.currentData.minPrice,6)))]):o("div",[t._v(t._s(t.decimalFormat(1/t.currentData.maxPrice,6)))]),t._v(" "),o("p",[t._v("\n                "+t._s(t.direction?t.poolInfo.pc.symbol:t.poolInfo.coin.symbol)+" per\n                "+t._s(t.direction?t.poolInfo.coin.symbol:t.poolInfo.pc.symbol)+"\n              ")])]),t._v(" "),o("div",{staticClass:"price-item"},[o("h3",[t._v("Max Price")]),t._v(" "),t.direction?o("div",[t._v("\n                "+t._s(t.currentData.maxPrice.indexOf("+")>0?"∞":t.decimalFormat(t.currentData.maxPrice,6))+"\n              ")]):o("div",[t._v("\n                "+t._s(t.currentData.maxPrice.indexOf("+")>0?"∞":t.decimalFormat(1/t.currentData.minPrice,6))+"\n              ")]),t._v(" "),o("p",[t._v("\n                "+t._s(t.direction?t.poolInfo.pc.symbol:t.poolInfo.coin.symbol)+" per\n                "+t._s(t.direction?t.poolInfo.coin.symbol:t.poolInfo.pc.symbol)+"\n              ")])])]),t._v(" "),o("div",{staticClass:"note-box"},[o("p",{staticClass:"note-item"},[t._v("\n              Your position will be 100% "+t._s(t.direction?t.poolInfo.coin.symbol:t.poolInfo.pc.symbol)+" at this price\n            ")]),t._v(" "),o("p",{staticClass:"note-item"},[t._v("\n              Your position will be 100% "+t._s(t.direction?t.poolInfo.pc.symbol:t.poolInfo.coin.symbol)+" at this price\n            ")])])]):t._e()]),t._v(" "),o("div",{staticClass:"right"},[o("CoinBlock",{attrs:{"coin-name":t.fromCoin?t.fromCoin.symbol:"",balance:t.fromCoin?t.fromCoin.balance:null,"show-lock":t.showFromCoinLock,"not-select":""},on:{onInput:t.inputChange,onFocus:function(){t.fixedFromCoin=!0},onMax:function(n){return t.maxBtnSelect("fromCoin")}},model:{value:t.fromCoinAmount,callback:function(n){t.fromCoinAmount=n},expression:"fromCoinAmount"}}),t._v(" "),o("div",{staticClass:"coin-block-gap"}),t._v(" "),o("CoinBlock",{attrs:{"coin-name":t.toCoin?t.toCoin.symbol:"",balance:t.toCoin?t.toCoin.balance:null,"show-lock":t.showToCoinLock,"not-select":""},on:{onInput:t.inputChange,onFocus:function(){t.fixedFromCoin=!1},onMax:function(n){return t.maxBtnSelect("toCoin")}},model:{value:t.toCoinAmount,callback:function(n){t.toCoinAmount=n},expression:"toCoinAmount"}}),t._v(" "),o("Button",{staticClass:"add-more-liquidity",attrs:{disabled:t.isLoading||t.isDisabled||t.insufficientBalance,loading:t.isLoading},on:{click:t.supply}},[t._v("\n          "+t._s(t.noEnterAmount?"Enter an amount":t.insufficientBalance?"Insufficient balance":"Add More Liquidity")+"\n        ")])],1)])])])}),[],!1,null,"2216ca0a",null);n.default=component.exports;installComponents(component,{StatusBlock:o(1651).default,SetIcon:o(1685).default,CoinTab:o(1702).default,CoinBlock:o(1684).default})}}]);