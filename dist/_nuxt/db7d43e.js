(window.webpackJsonp=window.webpackJsonp||[]).push([[31],{1727:function(t,e,o){var content=o(1769);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,o(62).default)("ffc5d852",content,!0,{sourceMap:!1})},1768:function(t,e,o){"use strict";o(1727)},1769:function(t,e,o){var n=o(61)(!1);n.push([t.i,"*[data-v-8b319af8]{line-height:1}.is-open[data-v-8b319af8]{height:auto!important}.farming-pool-card-list[data-v-8b319af8]{margin-top:27px}.farming-pool-card-box[data-v-8b319af8]{background:linear-gradient(270deg,#3e434e,#292d33);border-radius:20px;border:1px solid #3f434e}.farming-pool-card-box+.farming-pool-card-box[data-v-8b319af8]{margin-top:20px}.farming-pool-card[data-v-8b319af8]{padding:22px 12px;height:215px;overflow:hidden}.farming-pool-card .symbol-info[data-v-8b319af8]{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px}.farming-pool-card .symbol-info .symbol-left[data-v-8b319af8]{display:flex;align-items:center;margin-right:8px}.farming-pool-card .symbol-info .symbol-left img[data-v-8b319af8]{width:36px;height:36px}.farming-pool-card .symbol-info .symbol-left .coin-after[data-v-8b319af8]{margin-left:-5px}.farming-pool-card .symbol-info .symbol-left .symbol-text[data-v-8b319af8]{font-size:14px;color:#fff;margin-left:12px}.farming-pool-card .symbol-info .symbol-left .fee-rate[data-v-8b319af8]{padding:4px 7px;border-radius:4px;background:rgba(7,235,173,.1);font-size:12px;color:#07ebad;margin-top:4px;line-height:1}.farming-pool-card .symbol-info .symbol-right .open-or-close[data-v-8b319af8]{display:flex;align-items:center;justify-content:center;cursor:pointer}.farming-pool-card .symbol-info .symbol-right .open-or-close .icon[data-v-8b319af8]{width:20px;height:20px}.farming-pool-card .symbol-info .symbol-right .open-or-close .icon-open[data-v-8b319af8]{transform:rotate(180deg)}.farming-pool-card .symbol-info .symbol-right .open-or-close-disabled[data-v-8b319af8]{color:#5f667c}.farming-pool-card .symbol-info .symbol-right .open-or-close-disabled .icon[data-v-8b319af8]{width:20px;height:20px;fill:#5f667c}.farming-pool-card .trade-info[data-v-8b319af8]{display:flex;flex-wrap:wrap}.farming-pool-card .trade-info .trade-info-item[data-v-8b319af8]{width:50%;margin-bottom:30px}.farming-pool-card .trade-info .trade-info-item .trade-info-title[data-v-8b319af8]{font-size:12px;color:#d8d8d8;display:flex;align-items:center;line-height:20px}.farming-pool-card .trade-info .trade-info-item .trade-info-title .icon[data-v-8b319af8]{width:20px;height:20px;fill:#b5b8c2}.farming-pool-card .trade-info .trade-info-item .trade-info-text[data-v-8b319af8]{font-size:14px;font-weight:800;color:#fff;margin-top:12px}.farming-pool-card .trade-info .trade-info-item .trade-info-text img[data-v-8b319af8]{width:16px;height:16px}.farming-pool-card .get-lp[data-v-8b319af8]{display:flex;justify-content:space-between}.farming-pool-card .get-lp a[data-v-8b319af8]{color:#fff}.farming-pool-card .get-lp .get-lp-btn[data-v-8b319af8],.farming-pool-card .get-lp .view-contract-btn[data-v-8b319af8]{width:136px;height:auto;display:inline-block;padding:13px 0;text-align:center;background:linear-gradient(270deg,#3e434e,#282a2f);border-radius:8px;border:1px solid #3f434e;line-height:1;font-size:14px;font-family:Arial-BoldMT,Arial;font-weight:400}.farming-pool-card .stake-and-unstake[data-v-8b319af8]{margin-top:28px;background:rgba(0,0,0,.05);border-radius:10px}.farming-pool-card .stake-and-unstake .stake-box[data-v-8b319af8]{padding:0 16px 40px;border-bottom:1px solid hsla(0,0%,100%,.1)}.farming-pool-card .stake-and-unstake .stake-box .action-btn[data-v-8b319af8]{width:100%;line-height:1;height:40px;padding:1px;background:linear-gradient(180deg,#e4e2fe,#2881f2);border-radius:13px;border:none}.farming-pool-card .stake-and-unstake .stake-box .action-btn div[data-v-8b319af8]{text-align:center;border-radius:12px;line-height:38px;font-size:14px;font-weight:400;color:#fff;background:linear-gradient(268deg,#5fe6d0,#597bff 38%,#9380ff 72%,#e590ff)}.farming-pool-card .stake-and-unstake .stake-box .action-btn div[data-v-8b319af8]:hover{background:linear-gradient(270deg,#93ffed,#84caff 34%,#a291ff 68%,#efb9ff)}.farming-pool-card .stake-and-unstake .unstake-box[data-v-8b319af8]{margin-top:20px;padding-bottom:20px;border:none}",""]),t.exports=n},1848:function(t,e,o){"use strict";o.r(e);o(306);var n=o(202),r=o.n(n),d=(o(262),o(63),o(233),o(13)),l=o(534);d.default.use(r.a);var c=d.default.extend({components:{},props:{isStaked:{type:String,default:"All"},searchKey:{type:String,default:""}},data:function(){return{stakeTitle:"Stake",showStake:!1,isShowTableTr:-1,tableDataArr:[{symbolName:"CUSDT-CUSDC",feeRate:"0.05",coinA:"CUSDT",coinB:"CUSDC",apr:"106.8",liquidity:"999.8",rewardRangeTab:"1 - 1.002",rewardRange:"0.989 - 1",earned:"17.54",isStaked:"Staked"},{symbolName:"SOL-USDC",feeRate:"0.3",coinA:"SOL",coinB:"USDC",apr:"620.15",liquidity:"6,808,102.16",rewardRange:"215.4906 - 220.1256",rewardRangeTab:"0.004638 - 0.004936",earned:"- -"},{symbolName:"mSOL-SOL",feeRate:"0.3",coinA:"mSOL",coinB:"SOL",apr:"306.12",liquidity:"2,588,575.18",rewardRangeTab:"0.9771 - 0.9901",rewardRange:"1.007998 - 1.008013",earned:"- -"},{symbolName:"mSOL-USDC",feeRate:"0.3",coinA:"mSOL",coinB:"USDC",apr:"201.09",liquidity:"1,592,057.39",rewardRange:"219.5432 - 236.1908",rewardRangeTab:"0.004561 - 0.004682",earned:"- -"}]}},watch:{},methods:{importIcon:l.a,showStakeConfirm:function(title){this.stakeTitle=title,this.showStake=!0},showNotify:function(title){this.$notify.success({message:"".concat(title," Success"),icon:this.$createElement("img",{class:{"notify-icon":!0},attrs:{src:"/icon_Copied@2x.png"}}),description:function(t){return t("div",["".concat(title," Success")])}})},updateIsShowTableTr:function(t){0==t&&0!=this.isShowTableTr?this.isShowTableTr=0:0==t&&0==this.isShowTableTr&&(this.isShowTableTr=-1)},toogleData:function(t){var e=this.tableDataArr[t],o=e.coinB,n=e.coinA,r=(e.rewardRange,e.rewardRange.split("").reverse().join("")),data=Object.assign(Object.assign({},e),{coinA:o,coinB:n,rewardRange:r});this.tableDataArr[t]=data,this.$forceUpdate()}}}),f=(o(1768),o(55)),component=Object(f.a)(c,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"farming-pool-card-list"},t._l(t.tableDataArr,(function(e,r){return n("div",{key:r,staticClass:"farming-pool-card-box"},["All"===t.isStaked||t.isStaked===e.isStaked?n("div",{staticClass:"farming-pool-card",class:t.isShowTableTr==r&&0==r?"is-open":""},[n("div",{staticClass:"symbol-info"},[n("div",{staticClass:"symbol-left"},[n("img",{staticClass:"coin-before",attrs:{src:t.importIcon("/coins/"+e.coinA.toLowerCase()+".png"),alt:""}}),n("img",{staticClass:"coin-after",attrs:{src:t.importIcon("/coins/"+e.coinB.toLowerCase()+".png"),alt:""}}),t._v(" "),n("div",{staticClass:"symbol-text"},[n("div",{staticClass:"symbol-name"},[t._v(t._s(e.coinA)+"-"+t._s(e.coinB))]),t._v(" "),n("div",{staticClass:"fee-rate"},[t._v("Fee Rate "+t._s(e.feeRate)+"%")])])]),t._v(" "),n("div",{staticClass:"symbol-right"},[n("div",{staticClass:"open-or-close",class:0!==r?"open-or-close-disabled":"",on:{click:function(e){return t.updateIsShowTableTr(r)}}},[t._v("\n            Details\n            "),n("svg",{staticClass:"icon",class:t.isShowTableTr==r?"icon-open":"",attrs:{"aria-hidden":"true"}},[n("use",{attrs:{"xlink:href":"#icon-icon-on"}})])])])]),t._v(" "),n("div",{staticClass:"trade-info"},[n("div",{staticClass:"trade-info-item"},[n("div",{staticClass:"trade-info-title"},[t._v("APR")]),t._v(" "),n("div",{staticClass:"trade-info-text"},[t._v(t._s(e.apr))])]),t._v(" "),n("div",{staticClass:"trade-info-item"},[n("div",{staticClass:"trade-info-title"},[t._v("Liquidity")]),t._v(" "),n("div",{staticClass:"trade-info-text"},[t._v("$"+t._s(e.liquidity))])]),t._v(" "),n("div",{staticClass:"trade-info-item"},[n("div",{staticClass:"trade-info-title"},[t._v("\n            Reward Range"),n("svg",{staticClass:"icon",attrs:{"aria-hidden":"true"},on:{click:function(e){return t.toogleData(r)}}},[n("use",{attrs:{"xlink:href":"#icon-reward-range"}})])]),t._v(" "),n("div",{staticClass:"trade-info-text"},[t._v(t._s(e.rewardRange))])]),t._v(" "),n("div",{staticClass:"trade-info-item"},[n("div",{staticClass:"trade-info-title"},[t._v("Earned")]),t._v(" "),n("div",{staticClass:"trade-info-text"},[t._v("\n            106.01CRM"),0==r?n("img",{attrs:{src:o(811),alt:""},on:{click:function(e){return t.showStakeConfirm("Harvest")}}}):t._e()])])]),t._v(" "),n("div",{staticClass:"get-lp"},[n("Button",{staticClass:"get-lp-btn"},[n("nuxt-link",{attrs:{to:"/pool"}},[t._v("Get LP NFT")])],1),t._v(" "),n("Button",{staticClass:"view-contract-btn"},[t._v("View Contract")])],1),t._v(" "),n("div",{staticClass:"stake-and-unstake"},[n("div",{staticClass:"stake-box trade-info"},[t._m(0,!0),t._v(" "),t._m(1,!0),t._v(" "),t._m(2,!0),t._v(" "),t._m(3,!0),t._v(" "),n("Button",{staticClass:"action-btn",on:{click:function(e){return t.showNotify("Stake")}}},[n("div",[t._v("Stake - preview")])])],1),t._v(" "),n("div",{staticClass:"stake-box trade-info unstake-box"},[t._m(4,!0),t._v(" "),t._m(5,!0),t._v(" "),t._m(6,!0),t._v(" "),t._m(7,!0),t._v(" "),n("Button",{staticClass:"action-btn",on:{click:function(e){return t.showNotify("UnStake")}}},[n("div",[t._v("Unstake - preview")])])],1)])]):t._e()])})),0)}),[function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",{staticClass:"trade-info-item"},[o("div",{staticClass:"trade-info-title"},[t._v("NFT ID")]),t._v(" "),o("div",{staticClass:"trade-info-text"},[t._v("2")])])},function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",{staticClass:"trade-info-item"},[o("div",{staticClass:"trade-info-title"},[t._v("Liquidity")]),t._v(" "),o("div",{staticClass:"trade-info-text"},[t._v("$ 1856.89")])])},function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",{staticClass:"trade-info-item"},[o("div",{staticClass:"trade-info-title"},[t._v("Price Range")]),t._v(" "),o("div",{staticClass:"trade-info-text"},[t._v("1 - 1.001")])])},function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",{staticClass:"trade-info-item"},[o("div",{staticClass:"trade-info-title"},[t._v("Earned")]),t._v(" "),o("div",{staticClass:"trade-info-text"},[t._v("- - CRM")])])},function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",{staticClass:"trade-info-item"},[o("div",{staticClass:"trade-info-title"},[t._v("NFT ID")]),t._v(" "),o("div",{staticClass:"trade-info-text"},[t._v("2")])])},function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",{staticClass:"trade-info-item"},[o("div",{staticClass:"trade-info-title"},[t._v("Liquidity")]),t._v(" "),o("div",{staticClass:"trade-info-text"},[t._v("$ 1856.89")])])},function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",{staticClass:"trade-info-item"},[o("div",{staticClass:"trade-info-title"},[t._v("Price Range")]),t._v(" "),o("div",{staticClass:"trade-info-text"},[t._v("0.999 - 1.001")])])},function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",{staticClass:"trade-info-item"},[o("div",{staticClass:"trade-info-title"},[t._v("Earned")]),t._v(" "),o("div",{staticClass:"trade-info-text"},[t._v("- - CRM")])])}],!1,null,"8b319af8",null);e.default=component.exports}}]);