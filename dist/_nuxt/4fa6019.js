(window.webpackJsonp=window.webpackJsonp||[]).push([[72,73],{2965:function(t,e,n){var content=n(3002);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(148).default)("035a92b2",content,!0,{sourceMap:!1})},2979:function(t,e,n){"use strict";n.r(e);n(175),n(66),n(187),n(158),n(176),n(1472);var r=n(46),o=n(130),c=n(86),l=n(211),d=r.default.extend({props:{value:{type:String,required:!0},pType:{type:String,default:"Max"},fromCoin:{type:Object,default:function(){return{}}},toCoin:{type:Object,default:function(){return{}}},dirction:{type:Boolean,default:!0},defaultMaxPrice:{type:String,default:""},tickSpace:{type:Number,default:10}},data:function(){return{pValue:"",oValue:0,blockStyle:{}}},watch:{value:function(t,e){var n=t.split(".");n&&n[1]&&n[1].length>6?(this.pValue=String(Object(c.c)(t,6)),this.oValue=Number(t)):(this.pValue=t,this.oValue=Number(t))},dirction:function(t){this.oValue=Number(this.value)},pValue:function(t,e){"∞"===e&&t!==e&&t.includes("∞")&&(this.pValue="∞")}},mounted:function(){this.pValue=this.value,"∞"!==this.value&&(this.oValue=Number(this.value))},methods:{addPrice:function(){if(!Number.isNaN(this.oValue)&&this.oValue){var t=Object(o.c)(new l.a(this.oValue),this.tickSpace),e=Object(o.e)(t+this.tickSpace);this.oValue=e;var n=String(Object(c.c)(String(e),6));this.pValue=n,this.$emit("input",n)}},minusPrice:function(){if(!Number.isNaN(this.oValue)&&this.oValue){var t=Object(o.c)(new l.a(this.oValue),this.tickSpace),e=Object(o.e)(t-this.tickSpace);this.oValue=e;var n=String(Object(c.c)(String(e),6));this.pValue=n,this.$emit("input",n)}},onBlur:function(){if("∞"!==this.pValue&&"0"!==this.pValue){var t=Object(o.c)(new l.a(this.pValue),this.tickSpace),e=Object(o.e)(t);this.oValue=e;var n=String(Object(c.c)(String(e),6));this.pValue=n,this.$emit("input",n)}else"∞"===this.pValue&&(this.pValue=this.defaultMaxPrice),this.$emit("input",this.pValue)}}}),f=(n(3001),n(149)),component=Object(f.a)(d,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"set-price-item"},[n("h3",{staticClass:"title"},[t._v(t._s(t.pType)+" Price")]),t._v(" "),n("div",{staticClass:"input-box"},[n("a",{staticClass:"plus-btn",attrs:{disabled:!t.fromCoin&&!t.toCoin},on:{click:t.minusPrice}},[n("span",[n("svg",{staticClass:"icon",attrs:{"aria-hidden":"true"}},[n("use",{attrs:{"xlink:href":"#icon-icon-Reduction"}})])])]),t._v(" "),n("input",{directives:[{name:"model",rawName:"v-model",value:t.pValue,expression:"pValue"}],attrs:{id:"pValu",autocomplete:"off"},domProps:{value:t.pValue},on:{blur:t.onBlur,input:function(e){e.target.composing||(t.pValue=e.target.value)}}}),t._v(" "),n("a",{staticClass:"minus-btn",attrs:{disabled:!t.fromCoin&&!t.toCoin},on:{click:t.addPrice}},[n("span",[n("svg",{staticClass:"icon",attrs:{"aria-hidden":"true"}},[n("use",{attrs:{"xlink:href":"#icon-a-icon-AddCustomMarket"}})])])])]),t._v(" "),n("p",{staticClass:"per-text",class:t.toCoin||t.fromCoin?"":"per-text-disabled"},[t._v("\n    "+t._s(t.toCoin&&t.toCoin.symbol)+" per "+t._s(t.fromCoin&&t.fromCoin.symbol)+"\n  ")])])}),[],!1,null,"30665990",null);e.default=component.exports},2984:function(t,e,n){var content=n(3034);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(148).default)("36243da3",content,!0,{sourceMap:!1})},3001:function(t,e,n){"use strict";n(2965)},3002:function(t,e,n){var r=n(147)(!1);r.push([t.i,".set-price-item[data-v-30665990]{width:50%;height:84px;text-align:center;color:#b5b8c2;padding:10px}.set-price-item .title[data-v-30665990]{font-size:12px;margin-bottom:0;color:hsla(0,0%,100%,.5)}.set-price-item .input-box[data-v-30665990]{display:flex;align-items:center;justify-content:space-between}.set-price-item .input-box a[data-v-30665990]{display:block;width:30px;height:30px;background:linear-gradient(137deg,#23262b,#3e434e);padding:1px;border-radius:15px;cursor:pointer}.set-price-item .input-box a[disabled][data-v-30665990]{background:hsla(0,0%,100%,.1)}.set-price-item .input-box a[disabled] svg[data-v-30665990]{fill:hsla(0,0%,100%,.1)}.set-price-item .input-box a span[data-v-30665990]{width:28px;height:28px;display:flex;align-items:center;justify-content:center;background:linear-gradient(141deg,#383e49,#1a1c1f);border-radius:14px}.set-price-item .input-box a span[data-v-30665990]:hover{background:linear-gradient(141deg,#424953,#2a2e33)}.set-price-item .input-box a span svg[data-v-30665990]{width:24px;height:24px;fill:#fff}.set-price-item .input-box input[data-v-30665990]{width:139px;font-size:14px;color:#fff;text-align:center;border:none;background:none;padding:0 10px;font-weight:700}.set-price-item .per-text[data-v-30665990]{font-size:12px;color:hsla(0,0%,100%,.5)}.set-price-item .per-text-disabled[data-v-30665990]{color:#b5b8c2}@media screen and (max-width:750px){.set-price-item[data-v-30665990]{width:48%}.set-price-item .input-box input[data-v-30665990]{width:100%}}",""]),t.exports=r},3033:function(t,e,n){"use strict";n(2984)},3034:function(t,e,n){var r=n(147)(!1);r.push([t.i,".set-price-container[data-v-6a204878]{width:460px}.set-price-container .set-price-top[data-v-6a204878]{display:flex;align-items:center;justify-content:space-between}.set-price-container .set-price-top>.left[data-v-6a204878]{font-size:14px;font-weight:800;color:#fff}.set-price-container .set-price-top>.right[data-v-6a204878]{display:flex;align-items:center}.set-price-container .set-price-top>.right a[data-v-6a204878]{color:hsla(0,0%,100%,.5);font-size:14px;cursor:pointer}.set-price-container .set-price-top>.right a[data-v-6a204878]:hover{color:#fff}.set-price-container .set-price-top>.right .full-range-btn[data-v-6a204878]{display:flex;align-items:center;margin-left:12px;cursor:pointer}.set-price-container .set-price-top>.right .full-range-btn span[data-v-6a204878]{color:hsla(0,0%,100%,.5);font-size:14px}.set-price-container .set-price-top>.right .full-range-btn .radio[data-v-6a204878]{width:12px;height:12px;border-radius:100%;background:none;border:1px solid #fff;margin-right:4px;padding:0;position:relative}.set-price-container .set-price-top>.right .full-range-btn .radio i[data-v-6a204878]{display:inline-block;width:6px;height:6px;background:linear-gradient(270deg,#1a89d5,#1c00ff);border-radius:100%;margin:0;position:absolute;left:50%;top:50%;transform:translate(-50%,-50%)}.set-price-container .price-hint[data-v-6a204878]{margin-top:12px;color:#fb0;display:flex;align-items:center;line-height:1}.set-price-container .price-hint .icon[data-v-6a204878]{width:20px;height:20px;margin-right:8px;fill:#fb0}.set-price-block[data-v-6a204878]{width:100%;position:relative;margin-top:12px;background:#23262b;box-shadow:0 0 2px 0 #535966,inset 0 2px 3px 1px #1a1c1f;border-radius:16px}.set-price-block .set-price-form[data-v-6a204878]{width:100%;display:flex;align-items:center;justify-content:space-between}.set-price-block .set-price-form[data-v-6a204878]>:first-child{border-right:1px solid hsla(0,0%,100%,.1)}.set-price-block .full-range-note[data-v-6a204878]{position:absolute;left:0;right:0;top:0;bottom:0;background:rgba(51,55,64,.9);border-radius:10px;padding:14px;height:auto;display:flex;align-items:center;justify-content:space-between}.set-price-block .full-range-note .left[data-v-6a204878]{flex:1}.set-price-block .full-range-note .title[data-v-6a204878]{display:flex;align-items:center;margin-top:12px}.set-price-block .full-range-note .title .icon[data-v-6a204878]{width:16px;height:16px;fill:#fb0}.set-price-block .full-range-note .title span[data-v-6a204878]{font-size:14px;color:#fb0;margin-left:4px}.set-price-block .full-range-note p[data-v-6a204878]{font-size:14px;color:rgba(255,187,0,.9);padding-top:6px}.set-price-block .full-range-note>button[data-v-6a204878]{display:block;width:98px;height:28px;background:linear-gradient(270deg,#5fe6d0,#60b2f1 33%,#9380ff 68%,#e590ff);border-radius:7px;margin:0 auto 0 20px;white-space:nowrap}.set-price-block .full-range[data-v-6a204878]{width:460px;height:46px;background:linear-gradient(270deg,#3e434e,#2b2f36);box-shadow:0 4px 12px 0 rgba(26,28,31,.5);border-radius:10px;border:1px solid #3f434e;font-size:14px;color:#fff;margin-top:9px}@media screen and (max-width:750px){.set-price-block[data-v-6a204878],.set-price-block .full-range[data-v-6a204878],.set-price-container[data-v-6a204878]{width:100%}.set-price-block .full-range-note p[data-v-6a204878]{font-size:12px}}",""]),t.exports=r},3095:function(t,e,n){"use strict";n.r(e);n(175);var r=n(46),o=n(2979),c=r.default.extend({components:{SetPriceItem:o.default},props:{min:{type:String,default:""},max:{type:String,default:""},defaultMinPrice:{type:String,default:""},defaultMaxPrice:{type:String,default:""},fromCoin:{type:Object,default:function(){return{}}},toCoin:{type:Object,default:function(){return{}}},dirction:{type:Boolean,default:!0},invalidPriceRange:{type:Boolean,default:!1},tickSpace:{type:Number,default:10}},data:function(){return{showUnderStand:!1,isRadio:!1,minPrice:"",maxPrice:""}},watch:{min:function(t,e){t!==e&&(this.minPrice=t),"0"!==t&&(this.isRadio=!1)},max:function(t,e){t!==e&&(this.maxPrice=t),"∞"!==t&&(this.isRadio=!1)},minPrice:function(t,e){t!==e&&this.$emit("onChangeMinPrice",t)},maxPrice:function(t,e){t!==e&&this.$emit("onChangeMaxPrice",t)}},mounted:function(){this.minPrice=this.min,this.maxPrice=this.max},methods:{understand:function(){this.minPrice="0",this.maxPrice="∞",this.showUnderStand=!1},resetPrice:function(){this.minPrice=this.defaultMinPrice,this.maxPrice=this.defaultMaxPrice,this.showUnderStand=!1,this.isRadio=!1},changeShowUnderStand:function(){this.isRadio=!this.isRadio,this.isRadio?this.showUnderStand=!0:this.resetPrice(),this.showUnderStand||(this.minPrice=this.defaultMinPrice,this.maxPrice=this.defaultMaxPrice)}}}),l=(n(3033),n(149)),component=Object(l.a)(c,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"set-price-container"},[n("div",{staticClass:"set-price-top"},[n("div",{staticClass:"left"},[t._v("Set Price Range")]),t._v(" "),n("div",{staticClass:"right"},[n("a",{on:{click:t.resetPrice}},[t._v("Reset")]),t._v(" "),n("div",{staticClass:"full-range-btn",on:{click:t.changeShowUnderStand}},[n("div",{staticClass:"radio"},[t.isRadio?n("i"):t._e()]),t._v(" "),n("span",[t._v("Full range")])])])]),t._v(" "),n("div",{staticClass:"set-price-block"},[n("div",{staticClass:"set-price-form"},[n("SetPriceItem",{attrs:{"p-type":"Min","default-max-price":t.defaultMaxPrice,"from-coin":t.fromCoin,"to-coin":t.toCoin,dirction:t.dirction,"tick-space":t.tickSpace},model:{value:t.minPrice,callback:function(e){t.minPrice=e},expression:"minPrice"}}),t._v(" "),n("SetPriceItem",{attrs:{"p-type":"Max","default-max-price":t.defaultMaxPrice,"from-coin":t.fromCoin,"to-coin":t.toCoin,dirction:t.dirction,"tick-space":t.tickSpace},model:{value:t.maxPrice,callback:function(e){t.maxPrice=e},expression:"maxPrice"}})],1),t._v(" "),t.showUnderStand?n("div",{staticClass:"full-range-note"},[n("div",{staticClass:"left"},[n("div",{staticClass:"title"},[n("svg",{staticClass:"icon",attrs:{"aria-hidden":"true"}},[n("use",{attrs:{"xlink:href":"#icon-error"}})]),t._v(" "),n("span",[t._v("Lower Efficiency")])]),t._v(" "),n("p",[t._v("Please note that full range positions may earn less fees than concentrated liquidity.")])]),t._v(" "),n("button",{on:{click:t.understand}},[t._v("I understand")])]):t._e()]),t._v(" "),t.invalidPriceRange?n("div",{staticClass:"price-hint"},[n("svg",{staticClass:"icon",attrs:{"aria-hidden":"true"}},[n("use",{attrs:{"xlink:href":"#icon-error"}})]),t._v("\n    The max price should be higher than min price.\n  ")]):t._e()])}),[],!1,null,"6a204878",null);e.default=component.exports;installComponents(component,{SetPriceItem:n(2979).default})}}]);