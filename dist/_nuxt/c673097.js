(window.webpackJsonp=window.webpackJsonp||[]).push([[67],{1837:function(n,t,e){var content=e(1858);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[n.i,content,""]]),content.locals&&(n.exports=content.locals);(0,e(102).default)("a29ea7a8",content,!0,{sourceMap:!1})},1838:function(n,t,e){var content=e(1860);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[n.i,content,""]]),content.locals&&(n.exports=content.locals);(0,e(102).default)("3e417504",content,!0,{sourceMap:!1})},1857:function(n,t,e){"use strict";e(1837)},1858:function(n,t,e){var r=e(101),o=e(882),c=e(904),d=e(901),l=e(893),f=e(920),m=r(!1),v=o(c),h=o(d),x=o(l),w=o(f);m.push([n.i,".farm-Banner[data-v-2479ec16],.farming-Banner[data-v-2479ec16]{width:1000px;height:160px;background:url("+v+");background-size:100% 100%;display:flex}.farm-Banner[data-v-2479ec16]{background:url("+h+');background-size:100% 100%;height:120px;display:flex;justify-content:space-between}.farm-Banner>div[data-v-2479ec16]{width:400px}.farm-Countdown[data-v-2479ec16]{padding:30px 0;font-size:16px}.farm-Countdown>div[data-v-2479ec16]{display:flex;width:165px;height:30px;line-height:30px;justify-content:space-between;font-family:"Avenir-Next"!important}.farm-Countdown span[data-v-2479ec16]{display:block;width:30px;height:30px;background:#303030;border-radius:4px;font-size:18px;text-align:center}.farming-Banner-title[data-v-2479ec16]{width:630px;height:100%;padding:110px 0 0 47px}.farming-Banner-title>span[data-v-2479ec16]:last-child{margin-left:20px;cursor:pointer}.farming-Banner-Btn[data-v-2479ec16]{display:flex;flex-wrap:wrap;width:275px;height:100%;padding:20px}.farming-Banner-Btn .farming-Btn[data-v-2479ec16],.farming-Banner-Btn>div[data-v-2479ec16]{width:100%;margin:auto}.farming-Banner-value[data-v-2479ec16]{font-size:20px;display:flex;justify-content:center}.farming-Banner-value>span[data-v-2479ec16]{font-family:"Avenir-Next"!important}img[data-v-2479ec16]{width:30px;height:30px}.farming-Btn[data-v-2479ec16]{width:120px!important;height:40px;background:url('+x+");background-size:100% 100%;cursor:pointer}.farming-Btn[data-v-2479ec16]:hover{background:url("+w+");background-size:100% 100%}",""]),n.exports=m},1859:function(n,t,e){"use strict";e(1838)},1860:function(n,t,e){var r=e(101),o=e(882),c=e(903),d=e(921),l=e(893),f=e(900),m=r(!1),v=o(c),h=o(d),x=o(l),w=o(f);m.push([n.i,".farming-Banner[data-v-0ae17ddc]{height:110px;background:url("+v+");background-size:100% 100%}.My-Caffeine[data-v-0ae17ddc]{height:90px;background:url("+h+');background-size:100% 100%;margin-top:20px;display:flex;justify-content:space-between;padding:0 10px;align-items:center}.farming-Banner-value[data-v-0ae17ddc]{width:100%;font-size:10px}.farming-Banner-value span[data-v-0ae17ddc]{font-size:20px;font-family:"Avenir-Next"!important}.farming-Banner-value>div[data-v-0ae17ddc]{display:flex;flex-wrap:wrap;align-items:center}img[data-v-0ae17ddc]{width:30px;height:30px}.farming-Banner-btn[data-v-0ae17ddc]{margin:0 auto;width:200px;height:35px}.farming-Btn[data-v-0ae17ddc]{margin:0 auto;display:block;width:110px;height:35px;background:url('+x+");background-size:100% 100%}.farm-Banner[data-v-0ae17ddc]{width:100%;height:150px;background:url("+w+");background-size:100% 100%;padding:70px 14px 0}.farming-Banner-time[data-v-0ae17ddc]{width:144px;margin-top:16px;display:flex;align-items:center;justify-content:space-between}.farming-Banner-time span[data-v-0ae17ddc]{display:block;width:30px;height:30px;background:#303030;border-radius:4px;font-size:18px;text-align:center}",""]),n.exports=m},1908:function(n,t,e){"use strict";e.r(t);e(1797),e(187);var r=e(29),o=e(630),c=e(110),d=e(120),l=r.default.extend({components:{},props:{isStaked:{type:String,default:"All"},searchKey:{type:String,default:""},isFarming:{type:String,default:"All"}},data:function(){return{stakeTitle:"Stake",day:"",hour:"",min:"",sec:"",caffeineMintAddress:"32JXVurQacMxQF6qFxKkeAbysQcXsCakuYx3eyYRBoSR"}},computed:Object.assign(Object.assign({},Object(c.e)(["wallet"])),{caffeineAmount:function(){if(this.wallet&&this.wallet.tokenAccounts){var n=this.wallet.tokenAccounts,t=new d.a(0);if(n["32JXVurQacMxQF6qFxKkeAbysQcXsCakuYx3eyYRBoSR"])return t=n["32JXVurQacMxQF6qFxKkeAbysQcXsCakuYx3eyYRBoSR"].balance,t.fixed()}return 0}}),watch:{},mounted:function(){var n=this;window.setInterval((function(){n.countDown("2022-3-30 0:0:0")}),1e3)},methods:{importIcon:o.a,countDown:function(time){var n=+new Date,t=(+new Date(time)-n)/1e3,e=parseInt(String(t/60/60/24));e=e<10?"0"+e:e;var r=parseInt(String(t/60/60%24));r=r<10?"0"+r:r;var o=parseInt(String(t/60%60));o=o<10?"0"+o:o;var s=parseInt(String(t%60));s=s<10?"0"+s:s,this.day=e,this.hour=r,this.min=o,this.sec=s},comingsoon:function(){this.$notify.success({message:"Coming Soon",description:""})}}}),f=(e(1857),e(103)),component=Object(f.a)(l,(function(){var n=this,t=n.$createElement,r=n._self._c||t;return r("div",["Farming"==n.isFarming?r("div",{staticClass:"farming-Banner"},[n._m(0),n._v(" "),r("div",{staticClass:"farming-Banner-Btn"},[r("div",{staticClass:"farming-Banner-value"},[r("img",{attrs:{src:e(892),alt:""}}),n._v(" "),r("span",[n._v(n._s(n.caffeineAmount))])]),n._v(" "),r("div",{staticStyle:{height:"14px","text-align":"center","line-height":"14px"}},[n._v("My Caffeine")]),n._v(" "),r("a",{staticClass:"farming-Btn",on:{click:n.comingsoon}})])]):n._e(),n._v(" "),"Farm"==n.isFarming?r("div",{staticClass:"farm-Banner"},[r("div"),n._v(" "),r("div",{staticClass:"farm-Countdown"},[r("h3",[n._v("Stake end in")]),n._v(" "),r("div",[r("span",[n._v(n._s(n.day?n.day:"--"))]),n._v(" : "),r("span",[n._v(n._s(n.hour?n.hour:"--"))]),n._v(" :\n        "),r("span",[n._v(n._s(n.min?n.min:"--"))]),n._v(" :\n        "),r("span",[n._v(n._s(n.sec?n.sec:"--"))])])])]):n._e()])}),[function(){var n=this,t=n.$createElement,e=n._self._c||t;return e("div",{staticClass:"farming-Banner-title"},[e("span",[n._v("2022-03-07 18:009 (UTC) to 2022-03-23 18:00 (UTC)")]),n._v(" "),e("span",[n._v("Learn more >")])])}],!1,null,"2479ec16",null);t.default=component.exports},1909:function(n,t,e){"use strict";e.r(t);e(1797),e(187);var r=e(29),o=e(630),c=e(110),d=e(120),l=r.default.extend({components:{},props:{isStaked:{type:String,default:"All"},searchKey:{type:String,default:""},isFarming:{type:String,default:"All"}},data:function(){return{stakeTitle:"Stake",day:"",hour:"",min:"",sec:""}},computed:Object.assign(Object.assign({},Object(c.e)(["wallet"])),{caffeineAmount:function(){if(this.wallet&&this.wallet.tokenAccounts){var n=this.wallet.tokenAccounts,t=new d.a(0);if(n["32JXVurQacMxQF6qFxKkeAbysQcXsCakuYx3eyYRBoSR"])return t=n["32JXVurQacMxQF6qFxKkeAbysQcXsCakuYx3eyYRBoSR"].balance,t.fixed()}return 0}}),watch:{},mounted:function(){var n=this;window.setInterval((function(){n.countDown("2022-3-30 0:0:0")}),1e3)},methods:{importIcon:o.a,countDown:function(time){var n=+new Date,t=(+new Date(time)-n)/1e3,e=parseInt(String(t/60/60/24));e=e<10?"0"+e:e;var r=parseInt(String(t/60/60%24));r=r<10?"0"+r:r;var o=parseInt(String(t/60%60));o=o<10?"0"+o:o;var s=parseInt(String(t%60));s=s<10?"0"+s:s,this.day=e,this.hour=r,this.min=o,this.sec=s}}}),f=(e(1859),e(103)),component=Object(f.a)(l,(function(){var n=this,t=n.$createElement,r=n._self._c||t;return r("div",["Farming"==n.isFarming?r("div",{staticClass:"farming-Banner"}):n._e(),n._v(" "),"Farming"==n.isFarming?r("div",{staticClass:"My-Caffeine"},[r("div",{staticClass:"farming-Banner-value"},[r("p",[n._v("My Caffeine")]),n._v(" "),r("div",[r("img",{attrs:{src:e(892),alt:""}}),n._v(" "),r("span",[n._v(n._s(n.caffeineAmount))])])]),n._v(" "),n._m(0)]):n._e(),n._v(" "),"Farm"==n.isFarming?r("div",{staticClass:"farm-Banner"},[r("div",{staticClass:"farm-Banner-value"},[n._v("Stake start in")]),n._v(" "),r("div",{staticClass:"farming-Banner-time"},[r("span",[n._v(n._s(n.day?n.day:"--"))]),n._v(" : "),r("span",[n._v(n._s(n.hour?n.hour:"--"))]),n._v(" :\n      "),r("span",[n._v(n._s(n.min?n.min:"--"))]),n._v(" :\n      "),r("span",[n._v(n._s(n.sec?n.sec:"--"))])])]):n._e()])}),[function(){var n=this.$createElement,t=this._self._c||n;return t("div",{staticClass:"farming-Banner-btn"},[t("a",{staticClass:"farming-Btn"})])}],!1,null,"0ae17ddc",null);t.default=component.exports},1991:function(n,t,e){var content=e(2140);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[n.i,content,""]]),content.locals&&(n.exports=content.locals);(0,e(102).default)("552a25c1",content,!0,{sourceMap:!1})},2139:function(n,t,e){"use strict";e(1991)},2140:function(n,t,e){var r=e(101),o=e(882),c=e(938),d=r(!1),l=o(c);d.push([n.i,".farming-container .farming-container-center[data-v-aae84890]{width:1100px;margin:auto;display:flex;flex-wrap:wrap;justify-content:space-around}.farming-container .farming-container-center .farming-title[data-v-aae84890]{width:1000px;display:flex;justify-content:space-between;align-items:center}.farming-container .farming-container-center .farming-title .title[data-v-aae84890]{font-size:20px;color:#fff;padding:28px 0 12px;margin-bottom:0;font-weight:700}.farming-container .farming-container-center .farming-title .title-right[data-v-aae84890]{display:flex;align-items:center}.farming-container .farming-container-center .farming-title .title-right .pool-status-tab[data-v-aae84890]{display:flex;max-height:28px;cursor:pointer;padding:2px;line-height:1;background:hsla(0,0%,100%,.1);border-radius:8px}.farming-container .farming-container-center .farming-title .title-right .pool-status-tab .pool-status-staked-active[data-v-aae84890]{padding:5px 9px;background:linear-gradient(233deg,#4bb5ff,#ce90ff);box-shadow:0 2px 9px 0 rgba(0,0,0,.3),-3px -3px 5px 0 hsla(0,0%,100%,.1);border-radius:7px;font-size:14px;color:#fff}.farming-container .farming-container-center .farming-title .title-right .pool-status-tab .pool-status-staked[data-v-aae84890]{padding:5px 9px}.farming-container .farming-container-center .farming-title .title-right .pool-status-tab .pool-status-all[data-v-aae84890]{padding:5px 23px 5px 19px}.farming-container .farming-container-center .farming-title .title-right .pool-status-tab .pool-status-all-active[data-v-aae84890]{padding:5px 23px 5px 19px;background:linear-gradient(233deg,#4bb5ff,#ce90ff);box-shadow:0 2px 9px 0 rgba(0,0,0,.3),-3px -3px 5px 0 hsla(0,0%,100%,.1);border-radius:7px;font-size:14px;color:#fff}.farming-container .farming-container-center .farming-title .title-right .search-pool[data-v-aae84890]{width:273px;margin-left:20px;padding-left:20px;padding-right:5px;background:#23262b;box-shadow:0 0 2px 0 #535966,0 2px 3px 1px #1a1c1f;border-radius:20px;display:flex;align-items:center;justify-content:space-between}.farming-container .farming-container-center .farming-title .title-right .search-pool input[data-v-aae84890]{border:none;outline:none;background:#23262b;line-height:40px}.farming-container .farming-container-center .farming-title .title-right .search-pool .input-search[data-v-aae84890]{width:30px;height:30px;background:url("+l+");background-size:100% auto}.farming-container .farming-container-center .farming-banner[data-v-aae84890]{border-radius:20px}.farming-container .farming-container-center .farming-banner img[data-v-aae84890]{width:1000px;height:160px}.farming-container .farming-container-center .farming-banner .h5-banner[data-v-aae84890]{display:none}.farming-container .farming-container-center .farming-pool-container[data-v-aae84890]{width:1000px;position:relative;margin-top:20px}.farming-container .farming-container-center .loading-box[data-v-aae84890]{width:100%;display:flex;align-items:center;justify-content:center;position:absolute;left:0;top:0;right:0;bottom:0;z-index:9999;background:rgba(0,0,0,.4);border-radius:20px}.farming-container .farming-container-center .pc-farming-pool[data-v-aae84890]{display:block}.farming-container .farming-container-center .h5-farming-pool[data-v-aae84890]{display:none}@media screen and (max-width:750px){.farming-container[data-v-aae84890],.farming-container .farming-container-center[data-v-aae84890]{width:100%}.farming-container .farming-container-center .farming-title .title-right .search-pool[data-v-aae84890]{display:none}.farming-container .farming-container-center .farming-banner[data-v-aae84890]{width:100%}.farming-container .farming-container-center .farming-banner .pc-banner[data-v-aae84890]{display:none}.farming-container .farming-container-center .farming-banner .h5-banner[data-v-aae84890]{display:block;width:100%}.farming-container .farming-container-center .farming-pool-container[data-v-aae84890]{width:100%}.farming-container .farming-container-center .pc-farming-pool[data-v-aae84890]{display:none}.farming-container .farming-container-center .h5-farming-pool[data-v-aae84890]{display:block}}",""]),n.exports=d},2272:function(n,t,e){"use strict";e.r(t);e(1920);var r=e(1923),o=e.n(r),c=(e(38),e(88),e(29)),d=e(110),l=c.default.extend({components:{Spin:o.a},data:function(){return{poolStatus:"All",searchKey:"",showFarm:"Farming",tvlData:{}}},computed:Object.assign({},Object(d.e)(["farming"])),mounted:function(){this.getFarmTvl()},methods:{getFarmTvl:function(){var n=this;this.$axios.get("https://dev-api-crema.bitank.com/farm/tvl").then((function(t){var e={};t&&t.wrappers&&t.wrappers.forEach((function(n){e[n.address]=n})),n.tvlData=e}))}}}),f=(e(2139),e(103)),component=Object(f.a)(l,(function(){var n=this,t=n.$createElement,e=n._self._c||t;return e("div",{staticClass:"farming-container"},[e("div",{staticClass:"farming-container-center"},[n._m(0),n._v(" "),e("div",{staticClass:"farming-banner"},[e("DFarmingBanner",{staticClass:"pc-banner",attrs:{"is-farming":n.showFarm}}),n._v(" "),e("H5DFarmingBanner",{staticClass:"h5-banner",attrs:{"is-farming":n.showFarm}})],1),n._v(" "),e("div",{staticClass:"farming-pool-container"},[n.farming.farmingListLoading?e("div",{staticClass:"loading-box"},[e("Spin")],1):n._e(),n._v(" "),e("FarmingPoolNew",{staticClass:"pc-farming-pool",attrs:{tvlData:n.tvlData,"is-staked":n.poolStatus,"search-key":n.searchKey}}),n._v(" "),e("H5FarmingPoolNew",{staticClass:"h5-farming-pool",attrs:{tvlData:n.tvlData,"is-staked":n.poolStatus,"search-key":n.searchKey}})],1)])])}),[function(){var n=this,t=n.$createElement,e=n._self._c||t;return e("div",{staticClass:"farming-title"},[e("h3",{staticClass:"title"},[n._v("Farming")])])}],!1,null,"aae84890",null);t.default=component.exports;installComponents(component,{DFarmingBanner:e(1908).default,H5DFarmingBanner:e(1909).default,FarmingPoolNew:e(2260).default,H5FarmingPoolNew:e(2261).default})}}]);