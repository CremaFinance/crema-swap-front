(window.webpackJsonp=window.webpackJsonp||[]).push([[47],{2967:function(t,e,n){"use strict";n(427),n(2974)},2968:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.SkeletonProps=void 0;var o=C(n(253)),l=C(n(84)),r=C(n(332)),d=C(n(393)),f=C(n(99)),c=n(121),h=n(370),k=n(2976),v=C(k),m=n(2977),x=C(m),_=n(2978),y=C(_),w=C(n(392));function C(t){return t&&t.__esModule?t:{default:t}}var D=e.SkeletonProps={active:f.default.bool,loading:f.default.bool,prefixCls:f.default.string,children:f.default.any,avatar:f.default.oneOfType([f.default.string,k.SkeletonAvatarProps,f.default.bool]),title:f.default.oneOfType([f.default.bool,f.default.string,m.SkeletonTitleProps]),paragraph:f.default.oneOfType([f.default.bool,f.default.string,_.SkeletonParagraphProps])};function P(t){return t&&"object"===(void 0===t?"undefined":(0,r.default)(t))?t:{}}function O(t,e){return t&&!e?{shape:"square"}:{shape:"circle"}}function I(t,e){return!t&&e?{width:"38%"}:t&&e?{width:"50%"}:{}}function S(t,e){var n={};return t&&e||(n.width="61%"),n.rows=!t&&e?3:2,n}var j={name:"ASkeleton",props:(0,c.initDefaultProps)(D,{avatar:!1,title:!0,paragraph:!0}),inject:{configProvider:{default:function(){return h.ConfigConsumerProps}}},render:function(){var t=arguments[0],e=this.$props,n=e.prefixCls,r=e.loading,f=e.avatar,title=e.title,h=e.paragraph,k=e.active,m=this.configProvider.getPrefixCls,_=m("skeleton",n);if(r||!(0,c.hasProp)(this,"loading")){var w,C=!!f||""===f,D=!!title,j=!!h,N=void 0;if(C){var L={props:(0,l.default)({prefixCls:_+"-avatar"},O(D,j),P(f))};N=t("div",{class:_+"-header"},[t(v.default,L)])}var M=void 0;if(D||j){var A=void 0;if(D){var F={props:(0,l.default)({prefixCls:_+"-title"},I(C,j),P(title))};A=t(x.default,F)}var T=void 0;if(j){var z={props:(0,l.default)({prefixCls:_+"-paragraph"},S(C,D),P(h))};T=t(y.default,z)}M=t("div",{class:_+"-content"},[A,T])}var $=(0,d.default)(_,(w={},(0,o.default)(w,_+"-with-avatar",C),(0,o.default)(w,_+"-active",k),w));return t("div",{class:$},[N,M])}var U=this.$slots.default;return U&&1===U.length?U[0]:t("span",[U])},install:function(t){t.use(w.default),t.component(j.name,j)}};e.default=j},2974:function(t,e,n){var content=n(2975);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(148).default)("1727eed2",content,!0,{sourceMap:!1})},2975:function(t,e,n){var o=n(147)(!1);o.push([t.i,".ant-skeleton{display:table;width:100%}.ant-skeleton-header{display:table-cell;padding-right:16px;vertical-align:top}.ant-skeleton-header .ant-skeleton-avatar{display:inline-block;vertical-align:top;background:#f2f2f2;width:32px;height:32px;line-height:32px}.ant-skeleton-header .ant-skeleton-avatar.ant-skeleton-avatar-circle{border-radius:50%}.ant-skeleton-header .ant-skeleton-avatar-lg{width:40px;height:40px;line-height:40px}.ant-skeleton-header .ant-skeleton-avatar-lg.ant-skeleton-avatar-circle{border-radius:50%}.ant-skeleton-header .ant-skeleton-avatar-sm{width:24px;height:24px;line-height:24px}.ant-skeleton-header .ant-skeleton-avatar-sm.ant-skeleton-avatar-circle{border-radius:50%}.ant-skeleton-content{display:table-cell;width:100%;vertical-align:top}.ant-skeleton-content .ant-skeleton-title{width:100%;height:16px;margin-top:16px;background:#f2f2f2}.ant-skeleton-content .ant-skeleton-title+.ant-skeleton-paragraph{margin-top:24px}.ant-skeleton-content .ant-skeleton-paragraph{padding:0}.ant-skeleton-content .ant-skeleton-paragraph>li{width:100%;height:16px;list-style:none;background:#f2f2f2}.ant-skeleton-content .ant-skeleton-paragraph>li:last-child:not(:first-child):not(:nth-child(2)){width:61%}.ant-skeleton-content .ant-skeleton-paragraph>li+li{margin-top:16px}.ant-skeleton-with-avatar .ant-skeleton-content .ant-skeleton-title{margin-top:12px}.ant-skeleton-with-avatar .ant-skeleton-content .ant-skeleton-title+.ant-skeleton-paragraph{margin-top:28px}.ant-skeleton.ant-skeleton-active .ant-skeleton-avatar,.ant-skeleton.ant-skeleton-active .ant-skeleton-content .ant-skeleton-paragraph>li,.ant-skeleton.ant-skeleton-active .ant-skeleton-content .ant-skeleton-title{background:linear-gradient(90deg,#f2f2f2 25%,#e6e6e6 37%,#f2f2f2 63%);background-size:400% 100%;-webkit-animation:ant-skeleton-loading 1.4s ease infinite;animation:ant-skeleton-loading 1.4s ease infinite}@-webkit-keyframes ant-skeleton-loading{0%{background-position:100% 50%}to{background-position:0 50%}}@keyframes ant-skeleton-loading{0%{background-position:100% 50%}to{background-position:0 50%}}",""]),t.exports=o},2976:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.SkeletonAvatarProps=void 0;var o=f(n(253)),l=f(n(393)),r=f(n(99)),d=n(121);function f(t){return t&&t.__esModule?t:{default:t}}var c={prefixCls:r.default.string,size:r.default.oneOfType([r.default.oneOf(["large","small","default"]),r.default.number]),shape:r.default.oneOf(["circle","square"])},h=(e.SkeletonAvatarProps=r.default.shape(c).loose,{props:(0,d.initDefaultProps)(c,{size:"large"}),render:function(){var t,e,n=arguments[0],r=this.$props,d=r.prefixCls,f=r.size,c=r.shape,h=(0,l.default)((t={},(0,o.default)(t,d+"-lg","large"===f),(0,o.default)(t,d+"-sm","small"===f),t)),k=(0,l.default)((e={},(0,o.default)(e,d+"-circle","circle"===c),(0,o.default)(e,d+"-square","square"===c),e)),v="number"==typeof f?{width:f+"px",height:f+"px",lineHeight:f+"px"}:{};return n("span",{class:(0,l.default)(d,h,k),style:v})}});e.default=h},2977:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.SkeletonTitleProps=void 0;var o,l=n(99),r=(o=l)&&o.__esModule?o:{default:o};var d={prefixCls:r.default.string,width:r.default.oneOfType([r.default.number,r.default.string])},f=(e.SkeletonTitleProps=r.default.shape(d),{props:d,render:function(){var t=arguments[0],e=this.$props,n=e.prefixCls,o=e.width,l="number"==typeof o?o+"px":o;return t("h3",{class:n,style:{width:l}})}});e.default=f},2978:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.SkeletonParagraphProps=void 0;var o=r(n(610)),l=r(n(99));function r(t){return t&&t.__esModule?t:{default:t}}var d=l.default.oneOfType([l.default.number,l.default.string]),f={prefixCls:l.default.string,width:l.default.oneOfType([d,l.default.arrayOf(d)]),rows:l.default.number},c=(e.SkeletonParagraphProps=l.default.shape(f),{props:f,methods:{getWidth:function(t){var e=this.width,n=this.rows,o=void 0===n?2:n;return Array.isArray(e)?e[t]:o-1===t?e:void 0}},render:function(){var t=this,e=arguments[0],n=this.$props,l=n.prefixCls,r=n.rows,d=[].concat((0,o.default)(Array(r))).map((function(n,o){var l=t.getWidth(o);return e("li",{key:o,style:{width:"number"==typeof l?l+"px":l}})}));return e("ul",{class:l},[d])}});e.default=c},2993:function(t,e,n){var content=n(3068);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(148).default)("41b24062",content,!0,{sourceMap:!1})},3067:function(t,e,n){"use strict";n(2993)},3068:function(t,e,n){var o=n(147),l=n(959),r=n(1500),d=n(1501),f=o(!1),c=l(r),h=l(d);f.push([t.i,".detail-info-block[data-v-6875fb2c]{width:460px;height:188px;background-image:url("+c+");background-repeat:no-repeat;background-position:0 0;background-size:100% 100%;padding:15px 10px 10px 145px}.detail-info-block.unclaimed-fees[data-v-6875fb2c]{background-image:url("+h+");background-size:100% 100%}.detail-info-block .title[data-v-6875fb2c]{display:flex;align-items:center;justify-content:space-between}.detail-info-block .title h3[data-v-6875fb2c]{font-size:14px;color:#fff}.detail-info-block .title button[data-v-6875fb2c]{width:100px;height:26px;background:linear-gradient(270deg,#5fe6d0,#60b2f1 33%,#9380ff 68%,#e590ff);border-radius:7px}.detail-info-block .title button[data-v-6875fb2c]:disabled{background:hsla(0,0%,100%,.1);cursor:not-allowed}.detail-info-block .title button[data-v-6875fb2c]:disabled:hover{background:hsla(0,0%,100%,.1)}.detail-info-block .title button[data-v-6875fb2c]:hover{background:linear-gradient(268deg,#74ffe8,#7592ff 39%,#a08fff 74%,#e89aff)}.detail-info-block .rates[data-v-6875fb2c]{font-size:20px;color:#fff}.detail-info-block .info-box[data-v-6875fb2c]{width:304px;background:rgba(0,0,0,.1);border-radius:10px;padding:4px 10px;margin-top:10px;display:flex;flex-direction:column}.detail-info-block .info-box.reverse[data-v-6875fb2c]{flex-direction:column-reverse}.detail-info-block .info-box .info-block[data-v-6875fb2c]{display:flex;align-items:center;justify-content:space-between;margin:6px 0}.detail-info-block .info-box .info-block .left[data-v-6875fb2c],.detail-info-block .info-box .info-block .right[data-v-6875fb2c]{display:flex;align-items:center}.detail-info-block .info-box .info-block .left img[data-v-6875fb2c]{width:30px;height:30px}.detail-info-block .info-box .info-block .left span[data-v-6875fb2c]{font-size:14px;color:#fff;margin-left:8px}.detail-info-block .info-box .info-block .left a[data-v-6875fb2c]{display:block;width:20px;height:20px}.detail-info-block .info-box .info-block .left svg[data-v-6875fb2c]{width:20px;height:20px;fill:hsla(0,0%,100%,.5)}.detail-info-block .info-box .info-block .left svg[data-v-6875fb2c]:hover{fill:#07ebad}.detail-info-block .info-box .info-block .right .percent[data-v-6875fb2c]{width:60px;height:28px;background:hsla(0,0%,100%,.1);border-radius:8px;display:flex;align-items:center;justify-content:center;margin-left:10px}@media screen and (max-width:750px){.unclaimed-fees[data-v-6875fb2c]{background:none!important}.detail-info-block[data-v-6875fb2c]{width:100%;background:none;padding:10px}.detail-info-block .info-box[data-v-6875fb2c]{width:100%}}",""]),t.exports=f},3100:function(t,e,n){"use strict";n.r(e);n(2967);var o=n(2968),l=n.n(o),r=(n(175),n(46)),d=n(958),f=n(200),c=n(86),h=r.default.extend({components:{Skeleton:l.a},props:{currentData:{type:Object,default:function(){return{}}},poolInfo:{type:Object,default:function(){return null}},title:{type:String,default:""},isLoading:{type:Boolean,default:!1},direction:{type:Boolean,default:!0}},computed:Object.assign(Object.assign({},Object(f.e)(["wallet","url"])),{tokenaNum:function(){return this.currentData&&this.poolInfo?"Liquidity"!==this.title?Number(this.currentData.tokenaFee)>=1e-6?Object(c.c)(this.currentData.tokenaFee,this.poolInfo.token_a.decimal):0===Number(this.currentData.tokenaFee)?"0":Object(c.c)(this.currentData.tokenaFee,this.poolInfo.token_a.decimal):Object(c.c)(this.currentData.fromCoinAmount,this.poolInfo.token_a.decimal):"--"},tokenbNum:function(){return this.currentData&&this.poolInfo?"Liquidity"!==this.title?Number(this.currentData.tokenbFee)>=1e-6?Object(c.c)(this.currentData.tokenbFee,this.poolInfo.token_b.decimal):0===Number(this.currentData.tokenbFee)?"0":Object(c.c)(this.currentData.tokenbFee,this.poolInfo.token_b.decimal):Object(c.c)(this.currentData.toCoinAmount,this.poolInfo.token_b.decimal):"--"}}),watch:{currentData:{handler:"currentDataWatch",immediate:!0}},methods:{decimalFormat:c.c,importIcon:d.a,currentDataWatch:function(t){console.log("DetailInfoBlock###currentDataWatch####",t)},toClaim:function(){this.$emit("claim")},getPercent:function(t){var e=Number(this.currentData.fromCoinAmount),n=Number(this.currentData.toCoinAmount);return e&&n?"50%":"from"===t?e?"100%":"0%":n?"100%":"0%"},processShowUSD:function(t){return Number(t)<1e-4&&Number(t)>0?"<0.0001":Object(c.a)(t,4)}}}),k=(n(3067),n(149)),component=Object(k.a)(h,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{class:["detail-info-block","Liquidity"!==t.title?"unclaimed-fees":""]},[n("Skeleton",{attrs:{loading:!t.poolInfo,active:""}},[n("div",{staticClass:"title"},[n("h3",[t._v(t._s(t.title))]),t._v(" "),"Liquidity"!==t.title?n("button",{attrs:{disabled:t.isLoading||!t.wallet.connected||!(Number(t.currentData.tokenaFee)||Number(t.currentData.tokenbFee))||t.currentData.isPause,loading:t.isLoading},on:{click:t.toClaim}},[t._v("\n        Claim\n      ")]):t._e()]),t._v(" "),n("div",{staticClass:"rates"},[t._v("\n      $\n      "+t._s("Liquidity"!==t.title?t.processShowUSD(t.currentData.feeUSD):t.processShowUSD(t.currentData.amountUSD))+"\n    ")]),t._v(" "),n("div",{class:["info-box",t.direction?"":"reverse"]},[t.poolInfo?n("div",{staticClass:"info-block"},[n("div",{staticClass:"left"},[n("img",{attrs:{src:t.poolInfo.token_a.icon||t.importIcon("/coins/"+t.poolInfo.token_a.symbol.toLowerCase()+".png")}}),t._v(" "),n("span",[t._v(t._s(t.poolInfo.token_a.symbol))]),t._v(" "),"Liquidity"===t.title?n("a",{attrs:{href:t.url.explorer+"/address/"+t.poolInfo.token_a.token_mint,target:"_blank"}},[n("svg",{staticClass:"icon",attrs:{"aria-hidden":"true"}},[n("use",{attrs:{"xlink:href":"#icon-icon-Jump"}})])]):t._e()]),t._v(" "),n("div",{staticClass:"right"},[n("span",{staticClass:"num"},[t._v(t._s(t.tokenaNum))]),t._v(" "),"Liquidity"===t.title?n("span",{staticClass:"percent"},[t._v(t._s(t.currentData.fromPercent)+"%")]):t._e()])]):t._e(),t._v(" "),t.poolInfo?n("div",{staticClass:"info-block"},[n("div",{staticClass:"left"},[n("img",{attrs:{src:t.poolInfo.token_b.icon||t.importIcon("/coins/"+t.poolInfo.token_b.symbol.toLowerCase()+".png")}}),t._v(" "),n("span",[t._v(t._s(t.poolInfo.token_b.symbol))])]),t._v(" "),n("div",{staticClass:"right"},[n("span",{staticClass:"num"},[t._v(t._s(t.tokenbNum))]),t._v(" "),"Liquidity"===t.title?n("span",{staticClass:"percent"},[t._v(t._s(t.currentData.toPercent)+"%")]):t._e()])]):t._e()])])],1)}),[],!1,null,"6875fb2c",null);e.default=component.exports}}]);