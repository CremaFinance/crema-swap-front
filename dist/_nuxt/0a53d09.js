(window.webpackJsonp=window.webpackJsonp||[]).push([[64],{3315:function(t,e,o){var content=o(3356);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,o(214).default)("814c36c8",content,!0,{sourceMap:!1})},3355:function(t,e,o){"use strict";o(3315)},3356:function(t,e,o){var d=o(213),n=o(1130),c=o(1726),r=d(!1),l=n(c);r.push([t.i,"@keyframes bgzou-6fd1ef77{to{background-position:160px 0}}.deta-block-status-box-disable[data-v-6fd1ef77]{background:linear-gradient(180deg,#1b1f2a,#191c31 81%,#1e323e)!important}.deta-block-status-box-disable .deta-block-status-bottom[data-v-6fd1ef77]{display:none}.deta-block-status-box[data-v-6fd1ef77]{width:160px;height:80px;background:#181229;border-radius:55px;position:relative;padding:12px 0}.deta-block-status-box .deta-block-status-bottom-box[data-v-6fd1ef77]{width:100%;height:100%;position:absolute;top:0;border-radius:55px;overflow:hidden}.deta-block-status-box .deta-block-status-bottom-box .deta-block-status-bottom[data-v-6fd1ef77]{position:absolute;bottom:0;width:160px;height:44px;background:url("+l+");background-size:160px 44px;animation:bgzou-6fd1ef77 10s linear infinite}.deta-block-status-box .active-tooltip[data-v-6fd1ef77]{display:none;width:420px;position:absolute;text-align:left;padding:10px 15px;background:linear-gradient(214deg,#3e434e,#23262b);border-radius:10px;top:-65px;right:-80%;color:#b5b8c2;z-index:100}.deta-block-status-box .deta-block-status[data-v-6fd1ef77]{position:relative;cursor:pointer;height:28px;display:flex;align-items:center;justify-content:space-around;border-radius:8px;text-align:center;padding:0 12px;z-index:999}.deta-block-status-box .deta-block-status:hover+.active-tooltip[data-v-6fd1ef77]{display:block}.deta-block-status-box .deta-block-status div[data-v-6fd1ef77]{display:flex;align-items:center}.deta-block-status-box .deta-block-status .circle[data-v-6fd1ef77]{display:block;width:6px;height:6px;background:#00ff4d;border-radius:50%}.deta-block-status-box .deta-block-status .ended-status .circle[data-v-6fd1ef77]{background:#666}.deta-block-status-box .deta-block-status svg[data-v-6fd1ef77]{width:20px;height:20px;fill:#fff}.deta-block-status-box .deta-block-status span[data-v-6fd1ef77]{font-size:14px;font-weight:700;margin-left:8px}.deta-block-status-box .deta-block-status .inactive span[data-v-6fd1ef77]{margin-left:0}.deta-block-status-box .address[data-v-6fd1ef77]{width:98px;margin:0 auto;height:28px;line-height:28px;background:hsla(0,0%,100%,.1);border-radius:14px;-webkit-backdrop-filter:blur(0);backdrop-filter:blur(0);text-align:center;cursor:pointer}.deta-block-status-box .address a[data-v-6fd1ef77]{font-size:12px;color:#fff}.deta-block-status-box .address a[data-v-6fd1ef77]:hover{text-decoration:underline}@media screen and (max-width:750px){.coin-block .input-block input[data-v-6fd1ef77]{width:100px}.deta-block-status-box[data-v-6fd1ef77]{width:100%;display:flex;align-items:center;justify-content:space-between;padding:0 20px}.deta-block-status-box .deta-block-status-bottom-box[data-v-6fd1ef77]{left:0}.deta-block-status-box .deta-block-status-bottom-box .deta-block-status-bottom[data-v-6fd1ef77]{width:100%}.deta-block-status-box .address[data-v-6fd1ef77]{margin:0}}",""]),t.exports=r},3367:function(t,e,o){"use strict";o.r(e);var d=o(56),n=o(518),c=o(264),r=d.default.extend({components:{},props:["currentStatus","pItem"],computed:Object.assign({},Object(c.e)(["url"])),data:function(){return{isShowtips:!1}},methods:{getExplorerUrl:n.a}}),l=(o(3355),o(215)),component=Object(l.a)(r,(function(){var t=this,e=t._self._c;t._self._setupProxy;return e("div",{staticClass:"deta-block-status-box",class:"Inactive"===t.currentStatus||"Closed"===t.currentStatus||t.pItem.isEnded?"deta-block-status-box-disable":""},[t._m(0),t._v(" "),t.pItem.isEnded?e("div",{staticClass:"deta-block-status"},[t._m(1)]):e("div",{staticClass:"deta-block-status"},["Closed"===t.currentStatus?e("div",[e("span",[t._v("Closed")])]):"Active"===t.currentStatus?e("div",[e("i",{staticClass:"circle"}),t._v(" "),e("span",[t._v(t._s(t.currentStatus))])]):e("div",{staticClass:"inactive"},[e("svg",{staticClass:"icon",attrs:{"aria-hidden":"true"}},[e("use",{attrs:{"xlink:href":"#icon-icon-tips"}})]),t._v(" "),e("span",[t._v(t._s(t.currentStatus))])])]),t._v(" "),t.pItem.isEnded||"Active"!==t.currentStatus&&"Inactive"!==t.currentStatus?t._e():e("div",{staticClass:"active-tooltip"},[t._v("\n    "+t._s("Active"===t.currentStatus?"The price of this pool is currently within your position price range.":"Inactive"===t.currentStatus?"The price of this pool is currently out of your position price range.":"")+"\n  ")]),t._v(" "),t.pItem.nftTokenMint?e("div",{staticClass:"address"},[e("a",{attrs:{target:"_blank"},on:{click:function(e){return e.stopPropagation(),t.getExplorerUrl("account",t.pItem.nftTokenAccount)}}},[t._v("\n      "+t._s(t.pItem.nftTokenMint.substr(0,4))+"\n      ...\n      "+t._s(t.pItem.nftTokenMint.substr(t.pItem.nftTokenMint.length-4,4))+"\n    ")])]):t._e()])}),[function(){var t=this._self._c;this._self._setupProxy;return t("div",{staticClass:"deta-block-status-bottom-box"},[t("div",{staticClass:"deta-block-status-bottom"})])},function(){var t=this,e=t._self._c;t._self._setupProxy;return e("div",{staticClass:"ended-status"},[e("i",{staticClass:"circle"}),t._v(" "),e("span",[t._v("Ended")])])}],!1,null,"6fd1ef77",null);e.default=component.exports}}]);