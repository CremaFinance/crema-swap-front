(window.webpackJsonp=window.webpackJsonp||[]).push([[35],{2147:function(e,t,o){var content=o(2205);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,o(106).default)("22e6bd3a",content,!0,{sourceMap:!1})},2180:function(e,t,o){"use strict";o.r(t);var n=o(39),c=(o(1036),o(212)),l=o.n(c),d=(o(445),o(195)),r=o.n(d),m=(o(116),o(332),o(77),o(119),o(31),o(183),o(211),o(33)),h=o(143),v=o(181),x=o(155),f=o(79);m.default.use(r.a);var k=m.default.extend({components:{Modal:r.a,Icon:l.a},props:{existingCoins:{type:String,default:""},lastSelectCoin:{type:String,default:""}},data:function(){return{keyword:"",tokenList:[]}},computed:Object.assign({},Object(h.e)(["wallet","liquidity"])),watch:{keyword:function(e){this.createTokenList(void 0,e)},"wallet.tokenAccounts":{handler:function(e,t){this.createTokenList(void 0,this.keyword)},deep:!0},"liquidity.tokensObj":{handler:"tokensObjWatch",immediate:!0}},methods:{tokensObjWatch:function(e){console.log("没进来吗#####liquidity.tokensObj###newVal###",e),Object(f.b)(e)||this.createTokenList(e)},toSelect:function(e,t){this.$emit("onSelect",e)},importIconNew:function(path){try{return o(1046)("./assets".concat(path))}catch(e){return o(718)}},createTokenList:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.liquidity.tokensObj,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",o=[],c=Object(x.a)(v.b),l=[],d=[],r={};r=Object(x.a)(e),console.log("createTokenList###tokenObject###",r);for(var m=0,h=Object.keys(r);m<h.length;m++){var address=h[m],f=Object(x.a)(r[address]);if(this.lastSelectCoin&&f.symbol===this.lastSelectCoin&&(f.unusable=!0),"SOL"!==f.symbol.toUpperCase()){"CRM"!==f.symbol.toUpperCase()&&"USDC"!==f.symbol.toUpperCase()&&(f.unusable=!0);var k=this.wallet.tokenAccounts[f.token_mint];k?(f=Object.assign(Object.assign({},f),k),l.push(f)):d.push(f)}}var w=this.wallet.tokenAccounts[v.b.mintAddress];w&&(c=Object.assign(Object.assign(Object.assign({},c),w),{unusable:!0})),l=l.sort((function(a,b){return b.balance.toEther()-a.balance.toEther()})),o=[c].concat(Object(n.a)(l),d),t&&(o=o.filter((function(e){return e.symbol.toUpperCase().includes(t.toUpperCase())||e.token_mint.toUpperCase().indexOf(t.toUpperCase())>=0}))),console.log("new###CoinSelect###tokenList####",o),this.tokenList=Object(x.a)(o)}}}),w=k,y=(o(2204),o(107)),component=Object(y.a)(w,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("Modal",{attrs:{title:"Select a token",width:400,centered:"",visible:!0,footer:null},on:{cancel:function(t){return e.$emit("onClose")}}},[n("div",{staticClass:"coin-select-modal"},[n("div",{staticClass:"search-input"},[n("input",{directives:[{name:"model",rawName:"v-model",value:e.keyword,expression:"keyword"}],attrs:{onkeyup:"value=value.replace(/[^A-Za-z0-9]+$/g,'')",placeholder:"Enter the token symbol or address"},domProps:{value:e.keyword},on:{input:function(t){t.target.composing||(e.keyword=t.target.value)}}})]),e._v(" "),n("div",{staticClass:"coin-list-box"},[n("vue-scroll",[e.tokenList&&e.tokenList.length>0?n("ul",{staticClass:"coin-list"},e._l(e.tokenList,(function(t,o){return n("li",{key:o,class:t.unusable?"unusable":"",on:{click:function(o){return e.toSelect(t)}}},[n("div",{staticClass:"left"},[n("img",{attrs:{src:t.icon||e.importIconNew("/coins/"+t.symbol.toLowerCase()+".png")}}),e._v(" "),n("div",{staticClass:"name-box"},[n("h3",[e._v(e._s(t.symbol))]),e._v(" "),n("p",[e._v(e._s(t.name))])])]),e._v(" "),n("div",{staticClass:"balance-box"},[n("div",{staticClass:"balance"},[e.wallet.loading?n("div",[n("Icon",{attrs:{type:"loading"}})],1):t.tokenAccountAddress&&e.wallet.connected?n("div",[e._v("\n                  "+e._s(t.balance.fixed())+"\n                ")]):n("div")]),e._v(" "),n("p")])])})),0):n("div",{staticClass:"no-data"},[n("img",{attrs:{src:o(1034)}}),e._v(" "),n("p",[e._v("No Data")])])])],1)])])}),[],!1,null,"eed7cc4c",null);t.default=component.exports},2204:function(e,t,o){"use strict";o(2147)},2205:function(e,t,o){var n=o(105)(!1);n.push([e.i,".coin-select-modal .search-input[data-v-eed7cc4c]{background:#23262b;box-shadow:0 2px 3px 1px #1a1c1f;border-radius:10px;width:100%;height:60px;padding:1px}.coin-select-modal .search-input input[data-v-eed7cc4c]{width:100%;height:100%;background:transparent;border-radius:10px;font-size:14px;border:none;padding:0 20px}.coin-select-modal .coin-list-box[data-v-eed7cc4c]{border-top:1px solid hsla(0,0%,100%,.1);height:282px;overflow-y:auto;margin-top:20px}.coin-select-modal .coin-list-box .coin-list[data-v-eed7cc4c]{min-height:300px}.coin-select-modal .coin-list-box .coin-list li[data-v-eed7cc4c]{display:flex;height:48px;margin-top:10px;align-items:center;justify-content:space-between;font-size:14px;color:#fff;cursor:pointer}.coin-select-modal .coin-list-box .coin-list li .left[data-v-eed7cc4c]{display:flex;align-items:center}.coin-select-modal .coin-list-box .coin-list li .left img[data-v-eed7cc4c]{width:30px;height:30px;border-radius:100%}.coin-select-modal .coin-list-box .coin-list li .left .name-box[data-v-eed7cc4c]{margin-left:10px}.coin-select-modal .coin-list-box .coin-list li .left .name-box h3[data-v-eed7cc4c],.coin-select-modal .coin-list-box .coin-list li .left .name-box p[data-v-eed7cc4c]{padding:0;margin:0}.coin-select-modal .coin-list-box .coin-list li .left .name-box p[data-v-eed7cc4c]{font-size:12px;color:hsla(0,0%,100%,.5)}.coin-select-modal .coin-list-box .coin-list li .balance-box[data-v-eed7cc4c]{padding-right:10px}.coin-select-modal .coin-list-box .coin-list li.unusable[data-v-eed7cc4c]{color:hsla(0,0%,100%,.5);cursor:not-allowed}.coin-select-modal .coin-list-box .coin-list li.unusable .left img[data-v-eed7cc4c]{filter:grayscale(1)}.coin-select-modal .no-data[data-v-eed7cc4c]{width:100%;min-height:260px;display:flex;align-items:center;justify-content:center;flex-direction:column}.coin-select-modal .no-data img[data-v-eed7cc4c]{width:80px;height:80px}.coin-select-modal .no-data p[data-v-eed7cc4c]{color:hsla(0,0%,100%,.8);padding-top:10px}",""]),e.exports=n}}]);