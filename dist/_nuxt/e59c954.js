(window.webpackJsonp=window.webpackJsonp||[]).push([[24],{2293:function(e,t,c){var content=c(2526);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,c(96).default)("504664d6",content,!0,{sourceMap:!1})},2525:function(e,t,c){"use strict";c(2293)},2526:function(e,t,c){var l=c(95)(!1);l.push([e.i,".c-checkbox[data-v-7c27303a]{display:flex;align-items:center;cursor:pointer}.c-checkbox img[data-v-7c27303a]{width:16px;height:16px;margin-right:4px}.c-checkbox>label[data-v-7c27303a]{font-size:14px;color:#fff}",""]),e.exports=l},2583:function(e,t,c){"use strict";c.r(t);var l=c(34).default.extend({name:"CCheckbox",props:{value:{type:Boolean,required:!0},disabled:{type:Boolean,default:!1}},data:function(){return{cvalue:this.value}},watch:{value:function(e,t){e!==t&&(this.cvalue=e)},cvalue:function(e){this.$emit("input",e)}},methods:{toggle:function(){this.cvalue=!this.cvalue}}}),o=(c(2525),c(102)),component=Object(o.a)(l,(function(){var e=this,t=e.$createElement,l=e._self._c||t;return l("div",{class:["c-checkbox",e.disabled?"disabled":""],on:{click:e.toggle}},[e.cvalue?l("img",{attrs:{src:c(1080)}}):l("img",{attrs:{src:c(1081)}}),e._v(" "),l("label",{staticClass:"label"},[e._t("default")],2)])}),[],!1,null,"7c27303a",null);t.default=component.exports}}]);