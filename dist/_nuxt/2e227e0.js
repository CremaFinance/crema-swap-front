(window.webpackJsonp=window.webpackJsonp||[]).push([[71,76],{3247:function(t,e,n){var content=n(3264);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(207).default)("2bb5d59a",content,!0,{sourceMap:!1})},3261:function(t,e,n){"use strict";n.r(e);n(181),n(3273);var input=n(3274),o=n.n(input),r=(n(752),n(349)),l=n.n(r),c=(n(63),n(317),n(57));c.default.use(l.a);var d=c.default.extend({components:{Modal:l.a,Input:o.a},data:function(){return{slippage:"",slippageArr:["0.1","0.5","1"]}},mounted:function(){this.slippage=this.$accessor.slippage},methods:{oninput:function(t){t.target.value=t.target.value.match(/^\d+(?:\.\d{0,2})?/)?t.target.value.match(/^\d+(?:\.\d{0,2})?/)[0]||null:"",t.target.value&&(this.slippage=t.target.value)},confirmSlippage:function(){this.$accessor.setSlippage(this.slippage),this.$emit("onClose")}}}),f=(n(3263),n(208)),component=Object(f.a)(d,(function(){var t=this,e=t._self._c;t._self._setupProxy;return e("Modal",{attrs:{title:"Settings","z-index":1070,centered:"",width:"400px",visible:!0,footer:null},on:{cancel:function(e){return t.$emit("onClose")}}},[e("div",{staticClass:"pool-setting"},[e("div",{staticClass:"slippage-tolerance"},[t._v("Slippage tolerance")]),t._v(" "),e("div",{staticClass:"input-content"},[t._l(t.slippageArr,(function(n,o){return e("div",{key:o,staticClass:"slippage-item",class:n===t.slippage?"slippage-item-active":"",on:{click:function(e){t.slippage=n}}},[t._v("\n        "+t._s(n)+"\n      ")])})),t._v(" "),e("Input",{attrs:{typ:"number",size:"large",suffix:"%"},on:{input:t.oninput},model:{value:t.slippage,callback:function(e){t.slippage=e},expression:"slippage"}})],2),t._v(" "),t.slippage?e("div",{staticClass:"slippage-hint",class:Number(t.slippage)>1&&50>=Number(t.slippage)?"slippage-hint-waring":Number(t.slippage)>50?"slippage-hint-error":""},[t._v("\n      "+t._s(Number(t.slippage)>1&&50>=Number(t.slippage)?"Your transaction may be fronturn":Number(t.slippage)>50?"Enter a valid slippage percentage":"")+"\n    ")]):t._e(),t._v(" "),e("div",{staticClass:"btn-box"},[e("Button",{staticClass:"disconnect-btn",on:{click:function(e){return t.$emit("onClose")}}},[t._v(" Cancel ")]),t._v(" "),e("div",{staticClass:"switch-wallet-btn-box"},[e("Button",{staticClass:"switch-wallet-btn",attrs:{disabled:Number(t.slippage)>50},on:{click:t.confirmSlippage}},[t._v("\n          Confirm\n        ")])],1)],1)])])}),[],!1,null,null,null);e.default=component.exports},3262:function(t,e,n){var content=n(3268);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(207).default)("35c1edbe",content,!0,{sourceMap:!1})},3263:function(t,e,n){"use strict";n(3247)},3264:function(t,e,n){var o=n(206)(!1);o.push([t.i,".gradient-btn-large{width:100%;height:56px;background:linear-gradient(268deg,#5fe6d0,#596eff 32%,#6950f5 68%,#ad4ff6);box-shadow:0 4px 6px 0 rgba(26,28,31,.5);border-radius:10px;font-size:18px;font-weight:700;border:1px solid #e8e4ff;color:#fff}.gradient-btn-large:hover{background:linear-gradient(268deg,#68f5de,#6c7fff 32%,#7058f8 68%,#ba60ff)}.gradient-btn-large:disabled{border:2px solid rgba(232,228,255,.1);cursor:not-allowed}.gradient-btn-large:disabled,.gradient-btn-large:disabled:hover{background:hsla(0,0%,100%,.1)}.new-gradient-btn-large{width:100%;height:56px;box-shadow:0 4px 12px 0 rgba(26,28,31,.5);border-radius:16px;margin-top:20px}.farm-btn-small,.new-gradient-btn-large{background:linear-gradient(180deg,#e4e2fe,#2881f2);padding:1px}.farm-btn-small{line-height:1;height:40px;border-radius:6px;border:none}.farm-btn-small div{text-align:center;border-radius:6px;font-size:14px;font-weight:400;color:#fff;background:linear-gradient(268deg,#5fe6d0,#597bff 38%,#9380ff 72%,#e590ff)}.farm-btn-small div:hover{background:linear-gradient(270deg,#93ffed,#84caff 34%,#a291ff 68%,#efb9ff)}.pool-setting .slippage-tolerance{margin-top:14px;color:#b5b8c2}.pool-setting .input-content{margin-top:10px;display:flex;justify-content:space-between}.pool-setting .input-content .slippage-item{width:80px;height:40px;background:none;font-size:14px;font-weight:500;color:#fff;text-align:center;line-height:40px;box-shadow:0 4px 12px 0 #25282c;border-radius:10px;border:1px solid #3f434e}.pool-setting .input-content .slippage-item-active{background:#42454b;box-shadow:0 2px 6px 0 rgba(26,28,31,.5);border-radius:10px;color:#07ebad;border:1px solid #07ebad}.pool-setting .input-content input{width:80px;height:40px;color:#fff;border:none;background:#23262b;box-shadow:0 2px 3px 1px #1a1c1f;border-radius:10px}.pool-setting .input-content .ant-input-affix-wrapper{width:auto}.pool-setting .input-content .ant-input-affix-wrapper .ant-input-suffix{color:#fff}.pool-setting .input-content .ant-input-affix-wrapper input{text-align:center!important;font-size:14px;line-height:20px;background:#23262b;box-shadow:0 2px 3px 1px #1a1c1f;border-radius:10px}.pool-setting .slippage-hint{margin-top:14px}.pool-setting .slippage-hint-waring{color:#fb0}.pool-setting .slippage-hint-error{color:#ff5050}.pool-setting .btn-box{display:flex;margin-top:40px;justify-content:space-between}.pool-setting .disconnect-btn{width:168px;height:48px;box-shadow:0 4px 12px 0 #25282c;border-radius:12px;font-size:16px;border:1px solid #3f434e;font-weight:600;background:transparent}.pool-setting .disconnect-btn:hover{background:hsla(0,0%,100%,.05)}.pool-setting .switch-wallet-btn-box{width:168px;height:46px;margin-top:0;margin-left:0!important;border-radius:12px}.pool-setting .switch-wallet-btn-box .switch-wallet-btn{width:100%;height:56px;background:linear-gradient(268deg,#5fe6d0,#596eff 32%,#6950f5 68%,#ad4ff6);box-shadow:0 4px 6px 0 rgba(26,28,31,.5);border-radius:10px;font-size:18px;font-weight:700;border:1px solid #e8e4ff;color:#fff;height:100%;font-size:16px}.pool-setting .switch-wallet-btn-box .switch-wallet-btn:hover{background:linear-gradient(268deg,#68f5de,#6c7fff 32%,#7058f8 68%,#ba60ff)}.pool-setting .switch-wallet-btn-box .switch-wallet-btn:disabled{border:2px solid rgba(232,228,255,.1);background:hsla(0,0%,100%,.1);cursor:not-allowed}.pool-setting .switch-wallet-btn-box .switch-wallet-btn:disabled:hover{background:hsla(0,0%,100%,.1)}@media screen and (max-width:750px){.pool-setting .input-content .slippage-item,.pool-setting .input-content input{width:60px}}",""]),t.exports=o},3267:function(t,e,n){"use strict";n(3262)},3268:function(t,e,n){var o=n(206)(!1);o.push([t.i,".set-icon-container[data-v-5ee3eada]{color:hsla(0,0%,100%,.5)}.set-icon-container .set-icon-box .set-icon-content[data-v-5ee3eada]{height:28px;border-radius:8px;display:flex;align-items:center;justify-content:center;cursor:pointer}.set-icon-container .set-icon-box .set-icon-content .icon[data-v-5ee3eada]{width:16px;height:16px;fill:hsla(0,0%,100%,.5);cursor:pointer}.set-icon-container .set-icon-box .set-icon-content span[data-v-5ee3eada]{font-size:12px;margin-left:4px}.set-icon-container .set-icon-box .set-icon-content[data-v-5ee3eada]:hover{color:#fff}.set-icon-container .set-icon-box .set-icon-content:hover .icon[data-v-5ee3eada]{fill:#fff}",""]),t.exports=o},3272:function(t,e,n){"use strict";n.r(e);var o=n(348).Vue.extend({data:function(){return{showSetting:!1}},computed:{slippageView:function(){return"".concat(this.$accessor.slippage,"%")}}}),r=(n(3267),n(208)),component=Object(r.a)(o,(function(){var t=this,e=t._self._c;t._self._setupProxy;return e("div",{staticClass:"set-icon-container"},[e("div",{staticClass:"set-icon-box",on:{click:function(e){t.showSetting=!0}}},[e("div",{staticClass:"set-icon-content"},[e("svg",{staticClass:"icon",attrs:{"aria-hidden":"true"}},[e("use",{attrs:{"xlink:href":"#icon-a-bianzu81"}})]),t._v(" "),e("span",[t._v(t._s(t.slippageView))])])]),t._v(" "),t.showSetting?e("Setting",{on:{onClose:function(){return t.showSetting=!1}}}):t._e()],1)}),[],!1,null,"5ee3eada",null);e.default=component.exports;installComponents(component,{Setting:n(3261).default})}}]);