(window.webpackJsonp=window.webpackJsonp||[]).push([[51,29,31,46],{1704:function(t,e,n){var content=n(1726);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(62).default)("2c2a365e",content,!0,{sourceMap:!1})},1722:function(t,e,n){var content=n(1767);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(62).default)("6d05ed50",content,!0,{sourceMap:!1})},1725:function(t,e,n){"use strict";n(1704)},1726:function(t,e,n){var r=n(61)(!1);r.push([t.i,".stake-confirm[data-v-4e49d9fd]{background:linear-gradient(214deg,#3e434e,#23262b);box-shadow:0 4px 12px 0 rgba(26,28,31,.5);border-radius:10px;border:1px solid #3f434e}.stake-confirm .get-lp[data-v-4e49d9fd]{font-size:14px;color:#5f667c;display:flex;align-items:center}.stake-confirm .get-lp .icon[data-v-4e49d9fd]{width:20px;height:20px;margin-left:12px}.stake-confirm .symbol-name[data-v-4e49d9fd]{margin-top:27px;display:flex;align-items:center}.stake-confirm .symbol-name .symbol-logo img[data-v-4e49d9fd]{width:36px;height:36px}.stake-confirm .symbol-name .symbol-logo .coin-after[data-v-4e49d9fd]{margin-left:-5px}.stake-confirm .symbol-name .symbol-text[data-v-4e49d9fd]{font-size:16px;color:#fff;margin-left:10px}.stake-confirm .enter-container[data-v-4e49d9fd]{margin-top:30px;background:#23262b;box-shadow:0 2px 3px 1px #1a1c1f;border-radius:10px;display:flex;justify-content:space-between;align-items:center;padding:15px 20px 15px 10px}.stake-confirm .enter-container .enter-amount[data-v-4e49d9fd]{text-align:right}.stake-confirm .enter-container .enter-amount .balance-text[data-v-4e49d9fd]{font-size:14px;color:#fff}.stake-confirm .enter-container .enter-amount .max-btn[data-v-4e49d9fd]{width:46px;height:22px;background:linear-gradient(233deg,#4bb5ff,#ce90ff);border-radius:7px;line-height:1;margin-top:10px}.stake-confirm .enter-container input[data-v-4e49d9fd]{max-width:200px;height:100%;border:none;outline:none;background:#23262b}.stake-confirm .enter-container input[data-v-4e49d9fd]:hover{border:none}.stake-confirm .btn-box[data-v-4e49d9fd]{width:100%;font-size:16px;color:#fff;display:flex;justify-content:space-between;margin-top:30px;line-height:1}.stake-confirm .btn-box .cancel-btn[data-v-4e49d9fd]{width:180px;padding:16px 0;box-shadow:0 4px 12px 0 #25282c;border-radius:12px;border:1px solid #3f434e;background:transparent}.stake-confirm .btn-box .submit-btn[data-v-4e49d9fd]{width:180px;padding:16px 0;background:linear-gradient(270deg,#5fe6d0,#60b2f1 33%,#9380ff 68%,#e590ff);border-radius:12px;margin-left:21px}.stake-confirm .harvest-title[data-v-4e49d9fd]{display:flex;align-items:center;font-size:16px;font-weight:600;color:#fff}.stake-confirm .harvest-title img[data-v-4e49d9fd]{width:30px;height:30px;margin-right:10px}.stake-confirm .rewards[data-v-4e49d9fd]{padding:20px;display:flex;justify-content:space-between;background:rgba(0,0,0,.05);margin-top:12px;border-radius:10px}.stake-confirm .rewards .rewards-text[data-v-4e49d9fd]{font-size:14px;color:#5f667c}.stake-confirm .rewards .rewards-balance[data-v-4e49d9fd]{font-size:16px;font-weight:800;color:#fff}",""]),t.exports=r},1727:function(t,e,n){var content=n(1769);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(62).default)("ffc5d852",content,!0,{sourceMap:!1})},1757:function(t,e,n){"use strict";n.r(e);n(305);var r=n(130),o=n.n(r),input=(n(1689),n(1690)),c=n.n(input),d=n(13),l=n(534);d.default.use(o.a).use(c.a);var f=d.default.extend({components:{Modal:o.a,Input:c.a},props:{title:{type:String,default:"Stake"}},data:function(){return{}},methods:{importIcon:l.a,submit:function(){this.$notify.success({message:"Harvest Success",icon:this.$createElement("img",{class:{"notify-icon":!0},attrs:{src:"/icon_Copied@2x.png"}}),description:function(t){return t("div",["Harvest Success"])}}),this.$emit("onClose")}}}),v=(n(1725),n(55)),component=Object(v.a)(f,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("Modal",{staticClass:"stake-confirm",attrs:{width:"400px",visible:!0,title:t.title,centered:"",footer:null},on:{cancel:function(e){return t.$emit("onClose")}}},["Harvest"==t.title||"Harvest All"==t.title?r("div",{staticClass:"stake-confirm-container"},[r("div",{staticClass:"harvest-title"},[r("img",{attrs:{src:n(817),alt:""}}),t._v("\n      CRM\n    ")]),t._v(" "),r("div",{staticClass:"rewards"},[r("div",{staticClass:"rewards-text"},[t._v("Rewards")]),t._v(" "),r("div",{staticClass:"rewards-balance"},[t._v("106.01CRM")])])]):r("div",{staticClass:"stake-confirm-container"},["Stake"===t.title?r("div",{staticClass:"get-lp"},[t._v("\n      Get "+t._s("USDT / USDC")+" LPT\n      "),r("svg",{staticClass:"icon",attrs:{"aria-hidden":"true"}},[r("use",{attrs:{"xlink:href":"#icon-icon-Jump"}})])]):t._e(),t._v(" "),r("div",{staticClass:"symbol-name"},[r("div",{staticClass:"symbol-logo"},[r("img",{staticClass:"coin-before",attrs:{src:t.importIcon("/coins/"+"USDT".toLowerCase()+".png"),alt:""}}),r("img",{staticClass:"coin-after",attrs:{src:t.importIcon("/coins/"+"USDC".toLowerCase()+".png"),alt:""}})]),t._v(" "),r("div",{staticClass:"symbol-text"},[t._v(t._s("USDT / USDC")+" LP NFT")])]),t._v(" "),r("div",{staticClass:"enter-container"},[r("Input"),t._v(" "),r("div",{staticClass:"enter-amount"},[r("div",{staticClass:"balance-text"},[t._v("Balance 100.122312")]),t._v(" "),r("Button",{staticClass:"max-btn"},[t._v("MAX")])],1)],1)]),t._v(" "),r("div",{staticClass:"btn-box"},[r("Button",{staticClass:"cancel-btn",on:{click:function(e){return t.$emit("onClose")}}},[t._v("Cancle")]),t._v(" "),r("Button",{staticClass:"submit-btn",on:{click:t.submit}},[t._v(t._s(t.title))])],1)])}),[],!1,null,"4e49d9fd",null);e.default=component.exports},1766:function(t,e,n){"use strict";n(1722)},1767:function(t,e,n){var r=n(61)(!1);r.push([t.i,".farming-pool-table-container[data-v-1b2c17d7]{margin-top:20px;height:100%}.is-open[data-v-1b2c17d7]{height:auto!important}.farming-pool-table[data-v-1b2c17d7]{border:1px solid #565c6a;border-radius:20px;height:91px;overflow:hidden}.farming-pool-table table[data-v-1b2c17d7]{width:100%;border-collapse:collapse;font-size:14px;margin-left:auto;margin-right:auto}.farming-pool-table .symbol-info[data-v-1b2c17d7]{display:flex;align-items:center}.farming-pool-table .symbol-info .symbol-left[data-v-1b2c17d7]{margin-right:8px}.farming-pool-table .symbol-info .symbol-left img[data-v-1b2c17d7]{width:36px;height:36px}.farming-pool-table .symbol-info .symbol-left .coin-after[data-v-1b2c17d7]{margin-left:-5px}.farming-pool-table .symbol-info .symbol-text[data-v-1b2c17d7]{font-size:14px;color:#fff}.farming-pool-table .symbol-info .fee-rate[data-v-1b2c17d7]{padding:4px 7px;border-radius:4px;background:rgba(7,235,173,.1);font-size:12px;color:#07ebad;margin-top:4px;line-height:1}.farming-pool-table .td-title[data-v-1b2c17d7]{font-size:12px;color:#b5b8c2;display:flex;align-items:center}.farming-pool-table .td-title .icon[data-v-1b2c17d7]{width:20px;height:20px;fill:#b5b8c2;margin-left:4px}.farming-pool-table .td-title .icon[data-v-1b2c17d7]:hover{fill:#fff}.farming-pool-table .td-text[data-v-1b2c17d7]{font-size:14px;font-weight:800;color:#fff;margin-top:10px;display:flex}.farming-pool-table .td-text img[data-v-1b2c17d7]{width:20px;height:20px;margin-left:7px}.farming-pool-table .get-lp-btn[data-v-1b2c17d7],.farming-pool-table .view-contract-btn[data-v-1b2c17d7]{width:172px;height:auto;display:inline-block;padding:13px 0;text-align:center;background:linear-gradient(270deg,#3e434e,#282a2f);border-radius:8px;border:1px solid #3f434e;line-height:1;font-size:14px;font-family:Arial-BoldMT,Arial;font-weight:400}.farming-pool-table .view-contract[data-v-1b2c17d7]{margin-top:10px}.farming-pool-table .view-contract-btn[data-v-1b2c17d7]{color:hsla(0,0%,100%,.3)}.farming-pool-table .get-lp-btn[data-v-1b2c17d7]{color:#fff;margin-bottom:10px}.farming-pool-table .action-btn[data-v-1b2c17d7]{width:140px;line-height:1;height:40px;padding:1px;background:linear-gradient(180deg,#e4e2fe,#2881f2);border-radius:13px;border:none}.farming-pool-table .action-btn div[data-v-1b2c17d7]{text-align:center;border-radius:12px;line-height:38px;font-size:14px;font-weight:400;color:#fff;background:linear-gradient(268deg,#5fe6d0,#597bff 38%,#9380ff 72%,#e590ff)}.farming-pool-table .action-btn div[data-v-1b2c17d7]:hover{background:linear-gradient(270deg,#93ffed,#84caff 34%,#a291ff 68%,#efb9ff)}.farming-pool-table .open-or-close[data-v-1b2c17d7]{display:flex;align-items:center;justify-content:center;cursor:pointer}.farming-pool-table .open-or-close .icon[data-v-1b2c17d7]{width:20px;height:20px}.farming-pool-table .open-or-close .icon-open[data-v-1b2c17d7]{transform:rotate(180deg)}.farming-pool-table .open-or-close-disabled[data-v-1b2c17d7]{color:#5f667c}.farming-pool-table .open-or-close-disabled .icon[data-v-1b2c17d7]{width:20px;height:20px;fill:#5f667c}tr[data-v-1b2c17d7]{background:linear-gradient(214deg,#3e434e,#23262b);background-attachment:fixed;border-radius:20px;margin-top:20px}table tr:last-child td[data-v-1b2c17d7]{border:none}table tr td[data-v-1b2c17d7]{padding:20px;border-bottom:1px solid #565c6a}table tr .get-lp-box[data-v-1b2c17d7]{border-bottom:1px solid transparent;line-height:1}table tr .view-contract-box[data-v-1b2c17d7]{padding-top:0}",""]),t.exports=r},1768:function(t,e,n){"use strict";n(1727)},1769:function(t,e,n){var r=n(61)(!1);r.push([t.i,"*[data-v-8b319af8]{line-height:1}.is-open[data-v-8b319af8]{height:auto!important}.farming-pool-card-list[data-v-8b319af8]{margin-top:27px}.farming-pool-card-box[data-v-8b319af8]{background:linear-gradient(270deg,#3e434e,#292d33);border-radius:20px;border:1px solid #3f434e}.farming-pool-card-box+.farming-pool-card-box[data-v-8b319af8]{margin-top:20px}.farming-pool-card[data-v-8b319af8]{padding:22px 12px;height:215px;overflow:hidden}.farming-pool-card .symbol-info[data-v-8b319af8]{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px}.farming-pool-card .symbol-info .symbol-left[data-v-8b319af8]{display:flex;align-items:center;margin-right:8px}.farming-pool-card .symbol-info .symbol-left img[data-v-8b319af8]{width:36px;height:36px}.farming-pool-card .symbol-info .symbol-left .coin-after[data-v-8b319af8]{margin-left:-5px}.farming-pool-card .symbol-info .symbol-left .symbol-text[data-v-8b319af8]{font-size:14px;color:#fff;margin-left:12px}.farming-pool-card .symbol-info .symbol-left .fee-rate[data-v-8b319af8]{padding:4px 7px;border-radius:4px;background:rgba(7,235,173,.1);font-size:12px;color:#07ebad;margin-top:4px;line-height:1}.farming-pool-card .symbol-info .symbol-right .open-or-close[data-v-8b319af8]{display:flex;align-items:center;justify-content:center;cursor:pointer}.farming-pool-card .symbol-info .symbol-right .open-or-close .icon[data-v-8b319af8]{width:20px;height:20px}.farming-pool-card .symbol-info .symbol-right .open-or-close .icon-open[data-v-8b319af8]{transform:rotate(180deg)}.farming-pool-card .symbol-info .symbol-right .open-or-close-disabled[data-v-8b319af8]{color:#5f667c}.farming-pool-card .symbol-info .symbol-right .open-or-close-disabled .icon[data-v-8b319af8]{width:20px;height:20px;fill:#5f667c}.farming-pool-card .trade-info[data-v-8b319af8]{display:flex;flex-wrap:wrap}.farming-pool-card .trade-info .trade-info-item[data-v-8b319af8]{width:50%;margin-bottom:30px}.farming-pool-card .trade-info .trade-info-item .trade-info-title[data-v-8b319af8]{font-size:12px;color:#d8d8d8;display:flex;align-items:center;line-height:20px}.farming-pool-card .trade-info .trade-info-item .trade-info-title .icon[data-v-8b319af8]{width:20px;height:20px;fill:#b5b8c2}.farming-pool-card .trade-info .trade-info-item .trade-info-text[data-v-8b319af8]{font-size:14px;font-weight:800;color:#fff;margin-top:12px}.farming-pool-card .trade-info .trade-info-item .trade-info-text img[data-v-8b319af8]{width:16px;height:16px}.farming-pool-card .get-lp[data-v-8b319af8]{display:flex;justify-content:space-between}.farming-pool-card .get-lp a[data-v-8b319af8]{color:#fff}.farming-pool-card .get-lp .get-lp-btn[data-v-8b319af8],.farming-pool-card .get-lp .view-contract-btn[data-v-8b319af8]{width:136px;height:auto;display:inline-block;padding:13px 0;text-align:center;background:linear-gradient(270deg,#3e434e,#282a2f);border-radius:8px;border:1px solid #3f434e;line-height:1;font-size:14px;font-family:Arial-BoldMT,Arial;font-weight:400}.farming-pool-card .stake-and-unstake[data-v-8b319af8]{margin-top:28px;background:rgba(0,0,0,.05);border-radius:10px}.farming-pool-card .stake-and-unstake .stake-box[data-v-8b319af8]{padding:0 16px 40px;border-bottom:1px solid hsla(0,0%,100%,.1)}.farming-pool-card .stake-and-unstake .stake-box .action-btn[data-v-8b319af8]{width:100%;line-height:1;height:40px;padding:1px;background:linear-gradient(180deg,#e4e2fe,#2881f2);border-radius:13px;border:none}.farming-pool-card .stake-and-unstake .stake-box .action-btn div[data-v-8b319af8]{text-align:center;border-radius:12px;line-height:38px;font-size:14px;font-weight:400;color:#fff;background:linear-gradient(268deg,#5fe6d0,#597bff 38%,#9380ff 72%,#e590ff)}.farming-pool-card .stake-and-unstake .stake-box .action-btn div[data-v-8b319af8]:hover{background:linear-gradient(270deg,#93ffed,#84caff 34%,#a291ff 68%,#efb9ff)}.farming-pool-card .stake-and-unstake .unstake-box[data-v-8b319af8]{margin-top:20px;padding-bottom:20px;border:none}",""]),t.exports=r},1812:function(t,e,n){var content=n(1939);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(62).default)("958f1dfa",content,!0,{sourceMap:!1})},1847:function(t,e,n){"use strict";n.r(e);n(306);var r=n(202),o=n.n(r),c=n(13),d=n(534);c.default.use(o.a);var l=c.default.extend({components:{Button:o.a},props:{isStaked:{type:String,default:"All"},searchKey:{type:String,default:""}},data:function(){return{stakeTitle:"Stake",showStake:!1,isShowTableTr:-1,tableDataArr:[{symbolName:"CUSDT-CUSDC",feeRate:"0.05",coinA:"CUSDT",coinB:"CUSDC",apr:"106.8",liquidity:"999.8",rewardRangeTab:"1 - 1.002",rewardRange:"0.989 - 1",earned:"17.54",isStaked:"Staked"},{symbolName:"SOL-USDC",feeRate:"0.3",coinA:"SOL",coinB:"USDC",apr:"620.15",liquidity:"6,808,102.16",rewardRange:"215.4906 - 220.1256",rewardRangeTab:"0.004638 - 0.004936",earned:"- -"},{symbolName:"mSOL-SOL",feeRate:"0.3",coinA:"mSOL",coinB:"SOL",apr:"306.12",liquidity:"2,588,575.18",rewardRangeTab:"0.9771 - 0.9901",rewardRange:"1.007998 - 1.008013",earned:"- -"},{symbolName:"mSOL-USDC",feeRate:"0.3",coinA:"mSOL",coinB:"USDC",apr:"201.09",liquidity:"1,592,057.39",rewardRange:"219.5432 - 236.1908",rewardRangeTab:"0.004561 - 0.004682",earned:"- -"}],isEewardRangeTab:-1}},watch:{},methods:{importIcon:d.a,showStakeConfirm:function(title){this.stakeTitle=title,this.showStake=!0},showNotify:function(title){this.$notify.success({message:"".concat(title," Success"),icon:this.$createElement("img",{class:{"notify-icon":!0},attrs:{src:"/icon_Copied@2x.png"}}),description:function(t){return t("div",["".concat(title," Success")])}})},updateIsShowTableTr:function(t){0==t&&0!=this.isShowTableTr?this.isShowTableTr=0:0==t&&0==this.isShowTableTr&&(this.isShowTableTr=-1)},toogleData:function(t,e){var n=this.tableDataArr[t],r=n.coinB,o=n.coinA,c=n.rewardRange,d=n.rewardRangeTab,data=Object.assign(Object.assign({},n),{coinA:r,coinB:o,rewardRange:d,rewardRangeTab:c});this.tableDataArr[t]=data,this.$forceUpdate()}}}),f=(n(1766),n(55)),component=Object(f.a)(l,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",[t._l(t.tableDataArr,(function(e,o){return r("div",{key:o,staticClass:"farming-pool-table-container"},["All"===t.isStaked||t.isStaked===e.isStaked?r("div",{staticClass:"farming-pool-table",class:t.isShowTableTr==o&&0==o?"is-open":""},[r("table",[r("tbody",[r("tr",[r("td",{attrs:{width:"25%"}},[r("div",{staticClass:"symbol-info"},[r("div",{staticClass:"symbol-left"},[r("img",{staticClass:"coin-before",attrs:{src:t.importIcon("/coins/"+e.coinA.toLowerCase()+".png"),alt:""}}),r("img",{staticClass:"coin-after",attrs:{src:t.importIcon("/coins/"+e.coinB.toLowerCase()+".png"),alt:""}})]),t._v(" "),r("div",{staticClass:"symbol-text"},[r("div",{staticClass:"symbol-name"},[t._v(t._s(e.coinA)+"-"+t._s(e.coinB))]),t._v(" "),r("div",{staticClass:"fee-rate"},[t._v("Fee Rate "+t._s(e.feeRate)+"%")])])])]),t._v(" "),r("td",[r("div",{staticClass:"td-title"},[t._v("APR")]),t._v(" "),r("div",{staticClass:"td-text"},[t._v(t._s(e.apr)+"%")])]),t._v(" "),r("td",{attrs:{width:"15%"}},[r("div",{staticClass:"td-title"},[t._v("Liquidity")]),t._v(" "),r("div",{staticClass:"td-text"},[t._v("$ "+t._s(e.liquidity))])]),t._v(" "),r("td",{attrs:{width:"20%"}},[r("div",{staticClass:"td-title"},[t._v("\n                Reward Range\n                "),r("svg",{staticClass:"icon",attrs:{"aria-hidden":"true"},on:{click:function(n){return t.toogleData(o,e)}}},[r("use",{attrs:{"xlink:href":"#icon-reward-range"}})])]),t._v(" "),r("div",{staticClass:"td-text"},[t._v(t._s(e.rewardRange))])]),t._v(" "),r("td",[r("div",{staticClass:"td-title"},[t._v("Earned")]),t._v(" "),r("div",{staticClass:"td-text"},[t._v("\n                -- CRM\n                "),0==o?r("img",{attrs:{src:n(811),alt:""},on:{click:function(e){return t.showStakeConfirm("Harvest All")}}}):t._e()])]),t._v(" "),r("td",[r("div",{staticClass:"open-or-close",class:0!==o?"open-or-close-disabled":"",on:{click:function(e){return t.updateIsShowTableTr(o)}}},[t._v("\n                Details\n                "),r("svg",{staticClass:"icon",class:t.isShowTableTr==o?"icon-open":"",attrs:{"aria-hidden":"true"}},[r("use",{attrs:{"xlink:href":"#icon-icon-on"}})])])])]),t._v(" "),r("tr",[r("td",{staticClass:"get-lp-box",attrs:{rowspan:"2"}},[r("div",{staticClass:"get-lp"},[r("Button",{staticClass:"get-lp-btn"},[r("nuxt-link",{attrs:{to:"/pool"}},[t._v("Get LP NFT")])],1)],1),t._v(" "),r("div",{staticClass:"view-contract"},[r("Button",{staticClass:"view-contract-btn"},[t._v("View Contract")])],1)]),t._v(" "),t._m(0,!0),t._v(" "),t._m(1,!0),t._v(" "),t._m(2,!0),t._v(" "),t._m(3,!0),t._v(" "),r("td",[r("Button",{staticClass:"action-btn",on:{click:function(e){return t.showNotify("Stake")}}},[r("div",[t._v("Stake - preview")])])],1)]),t._v(" "),r("tr",[t._m(4,!0),t._v(" "),t._m(5,!0),t._v(" "),t._m(6,!0),t._v(" "),r("td",[r("div",{staticClass:"td-title"},[t._v("Earned")]),t._v(" "),r("div",{staticClass:"td-text"},[t._v("\n                106.01CRM"),r("img",{attrs:{src:n(811),alt:""},on:{click:function(e){return t.showStakeConfirm("Harvest")}}})])]),t._v(" "),r("td",[r("Button",{staticClass:"action-btn",on:{click:function(e){return t.showNotify("Unstake")}}},[r("div",[t._v("Unstake - preview")])])],1)])])])]):t._e()])})),t._v(" "),t.showStake?r("Stake",{attrs:{title:t.stakeTitle},on:{onClose:function(){return t.showStake=!1}}}):t._e()],2)}),[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("td",[n("div",{staticClass:"td-title"},[t._v("NFT ID")]),t._v(" "),n("div",{staticClass:"td-text"},[t._v("2")])])},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("td",[n("div",{staticClass:"td-title"},[t._v("Liquidity")]),t._v(" "),n("div",{staticClass:"td-text"},[t._v("$ 1856.89")])])},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("td",[n("div",{staticClass:"td-title"},[t._v("Price Range")]),t._v(" "),n("div",{staticClass:"td-text"},[t._v("1 - 1.001")])])},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("td",[n("div",{staticClass:"td-title"},[t._v("Earned")]),t._v(" "),n("div",{staticClass:"td-text"},[t._v("\n                - - CRM\n                ")])])},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("td",[n("div",{staticClass:"td-title"},[t._v("NFT ID")]),t._v(" "),n("div",{staticClass:"td-text"},[t._v("1")])])},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("td",[n("div",{staticClass:"td-title"},[t._v("Liquidity")]),t._v(" "),n("div",{staticClass:"td-text"},[t._v("$ 1,395.27")])])},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("td",[n("div",{staticClass:"td-title"},[t._v("Price Range")]),t._v(" "),n("div",{staticClass:"td-text"},[t._v("1 - 1.002")])])}],!1,null,"1b2c17d7",null);e.default=component.exports;installComponents(component,{Stake:n(1757).default})},1848:function(t,e,n){"use strict";n.r(e);n(306);var r=n(202),o=n.n(r),c=(n(262),n(63),n(233),n(13)),d=n(534);c.default.use(o.a);var l=c.default.extend({components:{},props:{isStaked:{type:String,default:"All"},searchKey:{type:String,default:""}},data:function(){return{stakeTitle:"Stake",showStake:!1,isShowTableTr:-1,tableDataArr:[{symbolName:"CUSDT-CUSDC",feeRate:"0.05",coinA:"CUSDT",coinB:"CUSDC",apr:"106.8",liquidity:"999.8",rewardRangeTab:"1 - 1.002",rewardRange:"0.989 - 1",earned:"17.54",isStaked:"Staked"},{symbolName:"SOL-USDC",feeRate:"0.3",coinA:"SOL",coinB:"USDC",apr:"620.15",liquidity:"6,808,102.16",rewardRange:"215.4906 - 220.1256",rewardRangeTab:"0.004638 - 0.004936",earned:"- -"},{symbolName:"mSOL-SOL",feeRate:"0.3",coinA:"mSOL",coinB:"SOL",apr:"306.12",liquidity:"2,588,575.18",rewardRangeTab:"0.9771 - 0.9901",rewardRange:"1.007998 - 1.008013",earned:"- -"},{symbolName:"mSOL-USDC",feeRate:"0.3",coinA:"mSOL",coinB:"USDC",apr:"201.09",liquidity:"1,592,057.39",rewardRange:"219.5432 - 236.1908",rewardRangeTab:"0.004561 - 0.004682",earned:"- -"}]}},watch:{},methods:{importIcon:d.a,showStakeConfirm:function(title){this.stakeTitle=title,this.showStake=!0},showNotify:function(title){this.$notify.success({message:"".concat(title," Success"),icon:this.$createElement("img",{class:{"notify-icon":!0},attrs:{src:"/icon_Copied@2x.png"}}),description:function(t){return t("div",["".concat(title," Success")])}})},updateIsShowTableTr:function(t){0==t&&0!=this.isShowTableTr?this.isShowTableTr=0:0==t&&0==this.isShowTableTr&&(this.isShowTableTr=-1)},toogleData:function(t){var e=this.tableDataArr[t],n=e.coinB,r=e.coinA,o=(e.rewardRange,e.rewardRange.split("").reverse().join("")),data=Object.assign(Object.assign({},e),{coinA:n,coinB:r,rewardRange:o});this.tableDataArr[t]=data,this.$forceUpdate()}}}),f=(n(1768),n(55)),component=Object(f.a)(l,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"farming-pool-card-list"},t._l(t.tableDataArr,(function(e,o){return r("div",{key:o,staticClass:"farming-pool-card-box"},["All"===t.isStaked||t.isStaked===e.isStaked?r("div",{staticClass:"farming-pool-card",class:t.isShowTableTr==o&&0==o?"is-open":""},[r("div",{staticClass:"symbol-info"},[r("div",{staticClass:"symbol-left"},[r("img",{staticClass:"coin-before",attrs:{src:t.importIcon("/coins/"+e.coinA.toLowerCase()+".png"),alt:""}}),r("img",{staticClass:"coin-after",attrs:{src:t.importIcon("/coins/"+e.coinB.toLowerCase()+".png"),alt:""}}),t._v(" "),r("div",{staticClass:"symbol-text"},[r("div",{staticClass:"symbol-name"},[t._v(t._s(e.coinA)+"-"+t._s(e.coinB))]),t._v(" "),r("div",{staticClass:"fee-rate"},[t._v("Fee Rate "+t._s(e.feeRate)+"%")])])]),t._v(" "),r("div",{staticClass:"symbol-right"},[r("div",{staticClass:"open-or-close",class:0!==o?"open-or-close-disabled":"",on:{click:function(e){return t.updateIsShowTableTr(o)}}},[t._v("\n            Details\n            "),r("svg",{staticClass:"icon",class:t.isShowTableTr==o?"icon-open":"",attrs:{"aria-hidden":"true"}},[r("use",{attrs:{"xlink:href":"#icon-icon-on"}})])])])]),t._v(" "),r("div",{staticClass:"trade-info"},[r("div",{staticClass:"trade-info-item"},[r("div",{staticClass:"trade-info-title"},[t._v("APR")]),t._v(" "),r("div",{staticClass:"trade-info-text"},[t._v(t._s(e.apr))])]),t._v(" "),r("div",{staticClass:"trade-info-item"},[r("div",{staticClass:"trade-info-title"},[t._v("Liquidity")]),t._v(" "),r("div",{staticClass:"trade-info-text"},[t._v("$"+t._s(e.liquidity))])]),t._v(" "),r("div",{staticClass:"trade-info-item"},[r("div",{staticClass:"trade-info-title"},[t._v("\n            Reward Range"),r("svg",{staticClass:"icon",attrs:{"aria-hidden":"true"},on:{click:function(e){return t.toogleData(o)}}},[r("use",{attrs:{"xlink:href":"#icon-reward-range"}})])]),t._v(" "),r("div",{staticClass:"trade-info-text"},[t._v(t._s(e.rewardRange))])]),t._v(" "),r("div",{staticClass:"trade-info-item"},[r("div",{staticClass:"trade-info-title"},[t._v("Earned")]),t._v(" "),r("div",{staticClass:"trade-info-text"},[t._v("\n            106.01CRM"),0==o?r("img",{attrs:{src:n(811),alt:""},on:{click:function(e){return t.showStakeConfirm("Harvest")}}}):t._e()])])]),t._v(" "),r("div",{staticClass:"get-lp"},[r("Button",{staticClass:"get-lp-btn"},[r("nuxt-link",{attrs:{to:"/pool"}},[t._v("Get LP NFT")])],1),t._v(" "),r("Button",{staticClass:"view-contract-btn"},[t._v("View Contract")])],1),t._v(" "),r("div",{staticClass:"stake-and-unstake"},[r("div",{staticClass:"stake-box trade-info"},[t._m(0,!0),t._v(" "),t._m(1,!0),t._v(" "),t._m(2,!0),t._v(" "),t._m(3,!0),t._v(" "),r("Button",{staticClass:"action-btn",on:{click:function(e){return t.showNotify("Stake")}}},[r("div",[t._v("Stake - preview")])])],1),t._v(" "),r("div",{staticClass:"stake-box trade-info unstake-box"},[t._m(4,!0),t._v(" "),t._m(5,!0),t._v(" "),t._m(6,!0),t._v(" "),t._m(7,!0),t._v(" "),r("Button",{staticClass:"action-btn",on:{click:function(e){return t.showNotify("UnStake")}}},[r("div",[t._v("Unstake - preview")])])],1)])]):t._e()])})),0)}),[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"trade-info-item"},[n("div",{staticClass:"trade-info-title"},[t._v("NFT ID")]),t._v(" "),n("div",{staticClass:"trade-info-text"},[t._v("2")])])},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"trade-info-item"},[n("div",{staticClass:"trade-info-title"},[t._v("Liquidity")]),t._v(" "),n("div",{staticClass:"trade-info-text"},[t._v("$ 1856.89")])])},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"trade-info-item"},[n("div",{staticClass:"trade-info-title"},[t._v("Price Range")]),t._v(" "),n("div",{staticClass:"trade-info-text"},[t._v("1 - 1.001")])])},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"trade-info-item"},[n("div",{staticClass:"trade-info-title"},[t._v("Earned")]),t._v(" "),n("div",{staticClass:"trade-info-text"},[t._v("- - CRM")])])},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"trade-info-item"},[n("div",{staticClass:"trade-info-title"},[t._v("NFT ID")]),t._v(" "),n("div",{staticClass:"trade-info-text"},[t._v("2")])])},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"trade-info-item"},[n("div",{staticClass:"trade-info-title"},[t._v("Liquidity")]),t._v(" "),n("div",{staticClass:"trade-info-text"},[t._v("$ 1856.89")])])},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"trade-info-item"},[n("div",{staticClass:"trade-info-title"},[t._v("Price Range")]),t._v(" "),n("div",{staticClass:"trade-info-text"},[t._v("0.999 - 1.001")])])},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"trade-info-item"},[n("div",{staticClass:"trade-info-title"},[t._v("Earned")]),t._v(" "),n("div",{staticClass:"trade-info-text"},[t._v("- - CRM")])])}],!1,null,"8b319af8",null);e.default=component.exports},1938:function(t,e,n){"use strict";n(1812)},1939:function(t,e,n){var r=n(61),o=n(804),c=n(839),d=r(!1),l=o(c);d.push([t.i,".farming-container .farming-container-center[data-v-27ac9afc]{width:1000px;margin:auto}.farming-container .farming-container-center .farming-title[data-v-27ac9afc]{display:flex;justify-content:space-between;align-items:center}.farming-container .farming-container-center .farming-title .title[data-v-27ac9afc]{font-size:20px;font-weight:400;color:#fff}.farming-container .farming-container-center .farming-title .title-right[data-v-27ac9afc]{display:flex;align-items:center}.farming-container .farming-container-center .farming-title .title-right .pool-status-tab[data-v-27ac9afc]{display:flex;max-height:28px;cursor:pointer;padding:2px;line-height:1;background:hsla(0,0%,100%,.1);border-radius:8px}.farming-container .farming-container-center .farming-title .title-right .pool-status-tab .pool-status-staked-active[data-v-27ac9afc]{padding:5px 9px;background:linear-gradient(233deg,#4bb5ff,#ce90ff);box-shadow:0 2px 9px 0 rgba(0,0,0,.3),-3px -3px 5px 0 hsla(0,0%,100%,.1);border-radius:7px;font-size:14px;color:#fff}.farming-container .farming-container-center .farming-title .title-right .pool-status-tab .pool-status-staked[data-v-27ac9afc]{padding:5px 9px}.farming-container .farming-container-center .farming-title .title-right .pool-status-tab .pool-status-all[data-v-27ac9afc]{padding:5px 23px 5px 19px}.farming-container .farming-container-center .farming-title .title-right .pool-status-tab .pool-status-all-active[data-v-27ac9afc]{padding:5px 23px 5px 19px;background:linear-gradient(233deg,#4bb5ff,#ce90ff);box-shadow:0 2px 9px 0 rgba(0,0,0,.3),-3px -3px 5px 0 hsla(0,0%,100%,.1);border-radius:7px;font-size:14px;color:#fff}.farming-container .farming-container-center .farming-title .title-right .search-pool[data-v-27ac9afc]{width:273px;margin-left:20px;padding-left:20px;padding-right:5px;background:#23262b;box-shadow:0 0 2px 0 #535966,0 2px 3px 1px #1a1c1f;border-radius:20px;display:flex;align-items:center;justify-content:space-between}.farming-container .farming-container-center .farming-title .title-right .search-pool input[data-v-27ac9afc]{border:none;outline:none;background:#23262b;line-height:40px}.farming-container .farming-container-center .farming-title .title-right .search-pool .input-search[data-v-27ac9afc]{width:30px;height:30px;background:url("+l+");background-size:100% auto}.farming-container .farming-container-center .farming-banner[data-v-27ac9afc]{margin-top:20px;border-radius:20px}.farming-container .farming-container-center .farming-banner img[data-v-27ac9afc]{width:1000px;height:120px}.farming-container .farming-container-center .farming-banner .h5-banner[data-v-27ac9afc],.farming-container .farming-container-center .h5-search-pool[data-v-27ac9afc]{display:none}.farming-container .farming-container-center .pc-farming-pool[data-v-27ac9afc]{display:block}.farming-container .farming-container-center .h5-farming-pool[data-v-27ac9afc]{display:none}@media screen and (max-width:750px){.farming-container[data-v-27ac9afc]{width:100%;padding:20px 16px 0}.farming-container .farming-container-center[data-v-27ac9afc]{width:100%}.farming-container .farming-container-center .farming-banner .pc-banner[data-v-27ac9afc],.farming-container .farming-container-center .farming-title .title-right .search-pool[data-v-27ac9afc]{display:none}.farming-container .farming-container-center .farming-banner .h5-banner[data-v-27ac9afc]{display:block;width:100%;height:auto}.farming-container .farming-container-center .h5-search-pool[data-v-27ac9afc]{width:100%;margin-top:20px;padding-left:20px;padding-right:5px;background:#23262b;box-shadow:0 0 2px 0 #535966,0 2px 3px 1px #1a1c1f;border-radius:20px;display:flex;align-items:center;justify-content:space-between}.farming-container .farming-container-center .h5-search-pool input[data-v-27ac9afc]{border:none;outline:none;background:#23262b;line-height:40px}.farming-container .farming-container-center .h5-search-pool .input-search[data-v-27ac9afc]{width:30px;height:30px;background:url("+l+");background-size:100% auto}.farming-container .farming-container-center .pc-farming-pool[data-v-27ac9afc]{display:none}.farming-container .farming-container-center .h5-farming-pool[data-v-27ac9afc]{display:block}}",""]),t.exports=d},2016:function(t,e,n){"use strict";n.r(e);var r=[function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"farming-banner"},[r("img",{staticClass:"pc-banner",attrs:{src:n(836),alt:""}}),t._v(" "),r("img",{staticClass:"h5-banner",attrs:{src:n(835),alt:""}})])}],o=n(13).default.extend({data:function(){return{poolStatus:"All",searchKey:""}}}),c=(n(1938),n(55)),component=Object(c.a)(o,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"farming-container"},[n("div",{staticClass:"farming-container-center"},[n("div",{staticClass:"farming-title"},[n("div",{staticClass:"title"},[t._v("Farming")]),t._v(" "),n("div",{staticClass:"title-right"},[n("div",{staticClass:"pool-status-tab"},[n("div",{class:"Staked"===t.poolStatus?"pool-status-staked-active":"pool-status-staked",on:{click:function(e){t.poolStatus="Staked"}}},[t._v("\n            Staked\n          ")]),t._v(" "),n("div",{class:"All"===t.poolStatus?"pool-status-all-active":"pool-status-all",on:{click:function(e){t.poolStatus="All"}}},[t._v("\n            All\n          ")])]),t._v(" "),n("div",{staticClass:"search-pool"},[n("Input",{attrs:{placeholder:"Search Token or Pools"},model:{value:t.searchKey,callback:function(e){t.searchKey=e},expression:"searchKey"}}),t._v(" "),n("div",{staticClass:"input-search"})],1)])]),t._v(" "),t._m(0),t._v(" "),n("div",{staticClass:"h5-search-pool"},[n("Input",{attrs:{placeholder:"Search Token or Pools"},model:{value:t.searchKey,callback:function(e){t.searchKey=e},expression:"searchKey"}}),t._v(" "),n("div",{staticClass:"input-search"})],1),t._v(" "),n("FarmingPool",{staticClass:"pc-farming-pool",attrs:{isStaked:t.poolStatus,searchKey:t.searchKey}}),t._v(" "),n("H5FarmingPool",{staticClass:"h5-farming-pool",attrs:{isStaked:t.poolStatus,searchKey:t.searchKey}})],1)])}),r,!1,null,"27ac9afc",null);e.default=component.exports;installComponents(component,{FarmingPool:n(1847).default,H5FarmingPool:n(1848).default})}}]);