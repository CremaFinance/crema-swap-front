(window.webpackJsonp=window.webpackJsonp||[]).push([[34],{1708:function(n,t,o){var content=o(1763);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[n.i,content,""]]),content.locals&&(n.exports=content.locals);(0,o(62).default)("78b9a0ae",content,!0,{sourceMap:!1})},1762:function(n,t,o){"use strict";o(1708)},1763:function(n,t,o){var r=o(61)(!1);r.push([n.i,".pc-address{display:block}.h5-address{display:none}.mint-address .address-container{padding:12px;background:rgba(0,0,0,.05);border-radius:8px}.mint-address .address-container>.pc-address{display:flex;justify-content:space-between;align-items:center;color:#b5b8c2}.mint-address .address-container>.pc-address+div{margin-top:14px}.mint-address .address-container .icon{width:16px;height:16px;fill:#b5b8c2}.mint-address .address-container .icon:hover{fill:#fff}.mint-address .address-container img{width:30px;height:30px}@media screen and (max-width:750px){.mint-address .address-container>.pc-address{display:none}.mint-address .address-container>.h5-address{display:flex;justify-content:space-between;align-items:center;color:#b5b8c2}.mint-address .address-container>.h5-address+div{margin-top:14px}}",""]),n.exports=r},1855:function(n,t,o){"use strict";o.r(t);o(300);var r=o(129),e=o.n(r),d=o(13),c=o(513);d.default.use(e.a);var m=d.default.extend({components:{Modal:e.a},props:{toCoin:{type:Object,default:function(){return{}}},fromCoin:{type:Object,default:function(){return{}}}},methods:{importIcon:c.a}}),l=(o(1762),o(55)),component=Object(l.a)(m,(function(){var n=this,t=n.$createElement,o=n._self._c||t;return o("div",[o("Modal",{staticClass:"mint-address",attrs:{width:"400px",visible:!0,centered:"",title:"Address",footer:null},on:{cancel:function(t){return n.$emit("onClose")}}},[o("div",{staticClass:"address-container"},[n.fromCoin&&n.fromCoin.symbol&&n.fromCoin.mintAddress?o("div",{staticClass:"pc-address"},[o("img",{attrs:{src:n.importIcon("/coins/"+n.fromCoin.symbol.toLowerCase()+".png")}}),n._v(" "),o("span",[n._v("\n          "+n._s(n.fromCoin.mintAddress&&n.fromCoin.mintAddress.substr(0,14))+"\n          ...\n          "+n._s(n.fromCoin.mintAddress&&n.fromCoin.mintAddress.substr(n.fromCoin.mintAddress.length-15,15))+"\n        ")]),n._v(" "),o("svg",{staticClass:"icon",attrs:{"aria-hidden":"true"},on:{click:function(t){return n.$accessor.copy(n.fromCoin.mintAddress)}}},[o("use",{attrs:{"xlink:href":"#icon-icon_copy"}})])]):n._e(),n._v(" "),n.toCoin&&n.toCoin.symbol&&n.toCoin.mintAddress?o("div",{staticClass:"pc-address"},[o("img",{attrs:{src:n.importIcon("/coins/"+n.toCoin.symbol.toLowerCase()+".png")}}),n._v(" "),o("span",[n._v("\n          "+n._s(n.toCoin.mintAddress&&n.toCoin.mintAddress.substr(0,14))+"\n          ...\n          "+n._s(n.toCoin.mintAddress&&n.toCoin.mintAddress.substr(n.toCoin.mintAddress.length-15,15))+"\n        ")]),n._v(" "),o("svg",{staticClass:"icon",attrs:{"aria-hidden":"true"},on:{click:function(t){return n.$accessor.copy(n.toCoin.mintAddress)}}},[o("use",{attrs:{"xlink:href":"#icon-icon_copy"}})])]):n._e(),n._v(" "),n.fromCoin&&n.fromCoin.symbol&&n.fromCoin.mintAddress?o("div",{staticClass:"h5-address"},[o("img",{attrs:{src:n.importIcon("/coins/"+n.fromCoin.symbol.toLowerCase()+".png")}}),n._v(" "),o("span",[n._v("\n          "+n._s(n.fromCoin.mintAddress&&n.fromCoin.mintAddress.substr(0,11))+"\n          ...\n          "+n._s(n.fromCoin.mintAddress&&n.fromCoin.mintAddress.substr(n.fromCoin.mintAddress.length-11,11))+"\n        ")]),n._v(" "),o("svg",{staticClass:"icon",attrs:{"aria-hidden":"true"},on:{click:function(t){return n.$accessor.copy(n.fromCoin.mintAddress)}}},[o("use",{attrs:{"xlink:href":"#icon-icon_copy"}})])]):n._e(),n._v(" "),n.toCoin&&n.toCoin.symbol&&n.toCoin.mintAddress?o("div",{staticClass:"h5-address"},[o("img",{attrs:{src:n.importIcon("/coins/"+n.toCoin.symbol.toLowerCase()+".png")}}),n._v(" "),o("span",[n._v("\n          "+n._s(n.toCoin.mintAddress&&n.toCoin.mintAddress.substr(0,11))+"\n          ...\n          "+n._s(n.toCoin.mintAddress&&n.toCoin.mintAddress.substr(n.toCoin.mintAddress.length-11,11))+"\n        ")]),n._v(" "),o("svg",{staticClass:"icon",attrs:{"aria-hidden":"true"},on:{click:function(t){return n.$accessor.copy(n.toCoin.mintAddress)}}},[o("use",{attrs:{"xlink:href":"#icon-icon_copy"}})])]):n._e()])])],1)}),[],!1,null,null,null);t.default=component.exports}}]);