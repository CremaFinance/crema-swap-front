(window.webpackJsonp=window.webpackJsonp||[]).push([[50],{3220:function(e,t,n){var content=n(3461);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,n(148).default)("5ee07543",content,!0,{sourceMap:!1})},3460:function(e,t,n){"use strict";n(3220)},3461:function(e,t,n){var r=n(147)(!1);r.push([e.i,".fee-tier-container[data-v-da1799e0]{width:460px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;box-shadow:0 4px 12px 0 #25282c;border-radius:10px;border:1px solid #3f434e;margin-top:47px;padding:10px}.fee-tier-container .title[data-v-da1799e0]{display:flex;align-items:center;justify-content:space-between}.fee-tier-container .title>h3[data-v-da1799e0]{font-size:14px;color:#fff;margin-bottom:0;font-weight:700}.fee-tier-container .title>a[data-v-da1799e0]{width:48px;height:24px;background:hsla(0,0%,100%,.1);border-radius:7px;font-size:12px;color:#fff;display:flex;align-items:center;justify-content:center}.fee-tier-container .title>.icon[data-v-da1799e0]{width:20px;height:20px;fill:hsla(0,0%,100%,.6)}.fee-tier-container .title>.icon[data-v-da1799e0]:hover{fill:#fff}.fee-tier-container .title>.is-rotate[data-v-da1799e0]{transform:rotate(180deg)}.fee-tier-container ul[data-v-da1799e0]{display:flex;align-items:center;justify-content:space-between;margin-top:14px;margin-bottom:0}.fee-tier-container ul li[data-v-da1799e0]{width:140px;height:72px;border-radius:10px;border:1px solid #3f434e;padding:12px;box-sizing:content-box;box-shadow:0 4px 12px 0 rgba(26,28,31,.5)}.fee-tier-container ul li h3[data-v-da1799e0]{font-size:14px;color:#fff;margin-bottom:10px}.fee-tier-container ul li p[data-v-da1799e0]{font-size:12px;color:#b5b8c2;margin:0}.fee-tier-container ul li.active[data-v-da1799e0]{background:linear-gradient(270deg,#3e434e,#2f333b);box-shadow:0 4px 12px 0 rgba(26,28,31,.5)}.fee-tier-container ul li.active h3[data-v-da1799e0]{color:#07ebad}.fee-tier-container ul li.disabled[data-v-da1799e0]{cursor:not-allowed;background:#26292f}.fee-tier-container ul li.disabled h3[data-v-da1799e0],.fee-tier-container ul li.disabled p[data-v-da1799e0]{color:hsla(0,0%,100%,.3)}@media screen and (max-width:750px){.fee-tier-container[data-v-da1799e0]{width:100%}.fee-tier-container ul li[data-v-da1799e0]{width:33%;height:100%;padding:10px}.fee-tier-container ul li+li[data-v-da1799e0]{margin-left:5px}.fee-tier-container ul li p[data-v-da1799e0]{margin-bottom:0}}",""]),e.exports=r},3519:function(e,t,n){"use strict";n.r(t);var r=n(289).Vue.extend({props:{feeList:{type:Array,default:function(){return[]}},currentFee:{type:String,default:""}},data:function(){return{list:[{fee:"0.01% fee",text:"Best for stable pairs",value:"0.01%"},{fee:"0.3% fee",text:"Best for most pairs",value:"0.3%"},{fee:"1% fee",text:"Best for exotic pairs",value:"1%"}],showFeeSelect:!0,currentIndex:0}},watch:{currentFee:function(e){if(e){console.log(this.currentFee,"this.current===>"),console.log(this.feeList,"this.feeList[i].value==>");for(var i=0;i<this.feeList.length;i++)console.log(this.currentFee==this.feeList[i].value,"this.currentFee == this.feeList[i].value##"),this.currentFee==this.feeList[i].value&&(this.currentIndex=i,console.log(this.currentIndex,"currentIndex##"))}}},methods:{selectFee:function(e,t){if(!e.swap_account)return!1;this.currentIndex=t,this.$emit("feeUpdate",Object.assign({},e))}}}),o=(n(3460),n(149)),component=Object(o.a)(r,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"fee-tier-container"},[n("div",{staticClass:"title"},[e.currentIndex>-1?n("h3",[e._v("\n      "+e._s(e.feeList&&e.feeList[e.currentIndex]&&e.feeList[e.currentIndex].value||"--")+" fee tier\n    ")]):n("h3",[e._v("fee tier")]),e._v(" "),n("svg",{staticClass:"icon",class:e.showFeeSelect?"is-rotate":"",attrs:{"aria-hidden":"true"},on:{click:function(t){e.showFeeSelect=!e.showFeeSelect}}},[n("use",{attrs:{"xlink:href":"#icon-icon-on"}})])]),e._v(" "),e.showFeeSelect?n("ul",e._l(e.feeList,(function(t,r){return n("li",{key:r,class:[e.currentIndex===r?"active":"",t.swap_account?"":"disabled"].join(""),on:{click:function(n){return e.selectFee(t,r)}}},[n("h3",[e._v(e._s(t.fee))]),e._v(" "),n("p",[e._v(e._s(t.text))])])})),0):e._e()])}),[],!1,null,"da1799e0",null);t.default=component.exports}}]);