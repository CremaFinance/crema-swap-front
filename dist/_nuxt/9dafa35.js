(window.webpackJsonp=window.webpackJsonp||[]).push([[32],{1841:function(t,n,e){var content=e(1870);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,e(102).default)("02568790",content,!0,{sourceMap:!1})},1869:function(t,n,e){"use strict";e(1841)},1870:function(t,n,e){var d=e(101),r=e(881),o=e(888),f=e(915),l=d(!1),c=r(o),m=r(f);l.push([t.i,".gradient-btn-large[data-v-33df7668]{width:100%;height:56px;background:linear-gradient(214deg,#59bdad,#6676f5 61%,#9a89f9 76%,#eba7ff);border-radius:10px;font-size:20px;font-weight:700;border:2px solid rgba(232,228,255,.5);color:#fff}.gradient-btn-large[data-v-33df7668]:hover{background:linear-gradient(268deg,#74ffe8,#7592ff 39%,#a08fff 74%,#e89aff)}.gradient-btn-large[data-v-33df7668]:disabled{border:2px solid rgba(232,228,255,.1);cursor:not-allowed}.gradient-btn-large[data-v-33df7668]:disabled,.gradient-btn-large[data-v-33df7668]:disabled:hover{background:hsla(0,0%,100%,.1)}.new-gradient-btn-large[data-v-33df7668]{width:100%;height:56px;box-shadow:0 4px 12px 0 rgba(26,28,31,.5);border-radius:16px;margin-top:20px}.farm-btn-small[data-v-33df7668],.new-gradient-btn-large[data-v-33df7668]{background:linear-gradient(180deg,#e4e2fe,#2881f2);padding:1px}.farm-btn-small[data-v-33df7668]{line-height:1;height:40px;border-radius:6px;border:none}.farm-btn-small div[data-v-33df7668]{text-align:center;border-radius:6px;font-size:14px;font-weight:400;color:#fff;background:linear-gradient(268deg,#5fe6d0,#597bff 38%,#9380ff 72%,#e590ff)}.farm-btn-small div[data-v-33df7668]:hover{background:linear-gradient(270deg,#93ffed,#84caff 34%,#a291ff 68%,#efb9ff)}.mint-NFT-popup[data-v-33df7668]{padding-bottom:20px}.mint-NFT-popup .mint-NFT-key[data-v-33df7668]{height:120px;display:flex;justify-content:space-between;align-items:center;padding:0 10px;margin-top:20px}.mint-NFT-popup .mint-NFT-key img[data-v-33df7668]{width:80px;height:80px}.mint-NFT-popup .mint-NFT-key>div[data-v-33df7668]:first-child,.mint-NFT-popup .mint-NFT-key>div[data-v-33df7668]:nth-child(3){width:120px;height:120px;background:url("+c+");background-size:100% 100%;display:flex;justify-content:center;align-items:center}.mint-NFT-popup .mint-NFT-key>div[data-v-33df7668]:nth-child(2){width:60px;height:60px;background:url("+m+");background-size:100% 100%}.mint-NFT-popup .mint-NFT-detail[data-v-33df7668]{font-weight:700;height:100px;padding:20px;margin-top:20px;background:rgba(0,0,0,.2);border-radius:10px}.mint-NFT-popup .mint-NFT-btn-box[data-v-33df7668]{height:48px;margin-top:40px;display:flex;justify-content:space-between}.mint-NFT-popup .mint-NFT-btn-box .mint-NFT-btn[data-v-33df7668]{height:100%!important;width:100%;height:56px;background:linear-gradient(214deg,#59bdad,#6676f5 61%,#9a89f9 76%,#eba7ff);border-radius:10px;font-size:20px;font-weight:700;border:2px solid rgba(232,228,255,.5);color:#fff;height:48px;font-size:14px;font-weight:100;width:170px}.mint-NFT-popup .mint-NFT-btn-box .mint-NFT-btn[data-v-33df7668]:hover{background:linear-gradient(268deg,#74ffe8,#7592ff 39%,#a08fff 74%,#e89aff)}.mint-NFT-popup .mint-NFT-btn-box .mint-NFT-btn[data-v-33df7668]:disabled{border:2px solid rgba(232,228,255,.1);background:hsla(0,0%,100%,.1);cursor:not-allowed}.mint-NFT-popup .mint-NFT-btn-box .mint-NFT-btn[data-v-33df7668]:disabled:hover{background:hsla(0,0%,100%,.1)}.mint-NFT-popup .mint-NFT-btn-box .mint-NFT-btn>div[data-v-33df7668]{line-height:48px}.mint-NFT-popup .mint-NFT-btn-box .btn-cancel[data-v-33df7668]{background:#282c33!important}.mint-NFT-popup .mint-NFT-btn-box .btn-cancel[data-v-33df7668]:hover{background:#34383e!important}@media screen and (max-width:750px){.mint-NFT-popup .mint-NFT-btn-box .mint-NFT-btn[data-v-33df7668]{width:140px}.mint-NFT-popup .mint-NFT-key>div[data-v-33df7668]:first-child,.mint-NFT-popup .mint-NFT-key>div[data-v-33df7668]:nth-child(3){width:100px!important;height:100px!important}.mint-NFT-popup .mint-NFT-key img[data-v-33df7668]{width:50px;height:50px}}",""]),t.exports=l},1917:function(t,n,e){"use strict";e.r(n);e(495);var d=e(186),r=e.n(d),o=e(29),f=e(629);o.default.use(r.a);var l=o.default.extend({components:{Modal:r.a},props:{existingCoins:{type:String,default:""},lastSelectCoin:{type:String,default:""},isUpgrading:{type:Boolean,default:!1},currentKeyItem:{type:Object,default:function(){return{}}},canUpgradeHeighKeyItem:{type:Object,default:function(){return{}}}},data:function(){return{}},computed:{},watch:{},mounted:function(){},methods:{importIcon:f.a}}),c=(e(1869),e(103)),component=Object(c.a)(l,(function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("Modal",{attrs:{title:"Upgrade",width:400,centered:"",visible:!0,footer:null},on:{cancel:function(n){return t.$emit("onClose")}}},[e("div",{staticClass:"mint-NFT-popup"},[e("div",{staticClass:"mint-NFT-key"},[e("div",[e("img",{attrs:{src:t.importIcon("/images/"+t.currentKeyItem.img+"@2x.png"),alt:""}})]),t._v(" "),e("div"),t._v(" "),e("div",[e("img",{attrs:{src:t.importIcon("/images/"+t.canUpgradeHeighKeyItem.img+"@2x.png"),alt:""}})])]),t._v(" "),e("div",{staticClass:"mint-NFT-detail"},[t._v("\n      Congratulations, you can upgrade from Bronze Key to Silver Key that can unlock unlock rewards up to\n      "+t._s(t.canUpgradeHeighKeyItem.minRequireAmount-t.currentKeyItem.minRequireAmount)+"。\n    ")]),t._v(" "),e("div",{staticClass:"mint-NFT-btn-box"},[e("Button",{staticClass:"mint-NFT-btn btn-cancel",on:{click:function(n){return t.$emit("onClose")}}},[t._v("Cancel")]),t._v(" "),e("Button",{staticClass:"mint-NFT-btn",attrs:{loading:t.isUpgrading},on:{click:function(n){return t.$emit("toUpgrade")}}},[t._v("Confirm")])],1)])])}),[],!1,null,"33df7668",null);n.default=component.exports}}]);