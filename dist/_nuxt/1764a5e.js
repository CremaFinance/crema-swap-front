(window.webpackJsonp=window.webpackJsonp||[]).push([[12],{3302:function(t,e,n){"use strict";n(516),n(3310)},3303:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.SkeletonProps=void 0;var r=x(n(312)),o=x(n(90)),c=x(n(385)),l=x(n(473)),d=x(n(109)),f=n(160),h=n(441),m=n(3312),k=x(m),v=n(3313),w=x(v),y=n(3314),P=x(y),O=x(n(472));function x(t){return t&&t.__esModule?t:{default:t}}var L=e.SkeletonProps={active:d.default.bool,loading:d.default.bool,prefixCls:d.default.string,children:d.default.any,avatar:d.default.oneOfType([d.default.string,m.SkeletonAvatarProps,d.default.bool]),title:d.default.oneOfType([d.default.bool,d.default.string,v.SkeletonTitleProps]),paragraph:d.default.oneOfType([d.default.bool,d.default.string,y.SkeletonParagraphProps])};function S(t){return t&&"object"===(void 0===t?"undefined":(0,c.default)(t))?t:{}}function _(t,e){return t&&!e?{shape:"square"}:{shape:"circle"}}function j(t,e){return!t&&e?{width:"38%"}:t&&e?{width:"50%"}:{}}function C(t,e){var n={};return t&&e||(n.width="61%"),n.rows=!t&&e?3:2,n}var T={name:"ASkeleton",props:(0,f.initDefaultProps)(L,{avatar:!1,title:!0,paragraph:!0}),inject:{configProvider:{default:function(){return h.ConfigConsumerProps}}},render:function(){var t=arguments[0],e=this.$props,n=e.prefixCls,c=e.loading,d=e.avatar,title=e.title,h=e.paragraph,m=e.active,v=this.configProvider.getPrefixCls,y=v("skeleton",n);if(c||!(0,f.hasProp)(this,"loading")){var O,x=!!d||""===d,L=!!title,T=!!h,D=void 0;if(x){var M={props:(0,o.default)({prefixCls:y+"-avatar"},_(L,T),S(d))};D=t("div",{class:y+"-header"},[t(k.default,M)])}var $=void 0;if(L||T){var A=void 0;if(L){var N={props:(0,o.default)({prefixCls:y+"-title"},j(x,T),S(title))};A=t(w.default,N)}var I=void 0;if(T){var R={props:(0,o.default)({prefixCls:y+"-paragraph"},C(x,L),S(h))};I=t(P.default,R)}$=t("div",{class:y+"-content"},[A,I])}var V=(0,l.default)(y,(O={},(0,r.default)(O,y+"-with-avatar",x),(0,r.default)(O,y+"-active",m),O));return t("div",{class:V},[D,$])}var K=this.$slots.default;return K&&1===K.length?K[0]:t("span",[K])},install:function(t){t.use(O.default),t.component(T.name,T)}};e.default=T},3310:function(t,e,n){var content=n(3311);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(214).default)("1727eed2",content,!0,{sourceMap:!1})},3311:function(t,e,n){var r=n(213)(!1);r.push([t.i,".ant-skeleton{display:table;width:100%}.ant-skeleton-header{display:table-cell;padding-right:16px;vertical-align:top}.ant-skeleton-header .ant-skeleton-avatar{display:inline-block;vertical-align:top;background:#f2f2f2;width:32px;height:32px;line-height:32px}.ant-skeleton-header .ant-skeleton-avatar.ant-skeleton-avatar-circle{border-radius:50%}.ant-skeleton-header .ant-skeleton-avatar-lg{width:40px;height:40px;line-height:40px}.ant-skeleton-header .ant-skeleton-avatar-lg.ant-skeleton-avatar-circle{border-radius:50%}.ant-skeleton-header .ant-skeleton-avatar-sm{width:24px;height:24px;line-height:24px}.ant-skeleton-header .ant-skeleton-avatar-sm.ant-skeleton-avatar-circle{border-radius:50%}.ant-skeleton-content{display:table-cell;width:100%;vertical-align:top}.ant-skeleton-content .ant-skeleton-title{width:100%;height:16px;margin-top:16px;background:#f2f2f2}.ant-skeleton-content .ant-skeleton-title+.ant-skeleton-paragraph{margin-top:24px}.ant-skeleton-content .ant-skeleton-paragraph{padding:0}.ant-skeleton-content .ant-skeleton-paragraph>li{width:100%;height:16px;list-style:none;background:#f2f2f2}.ant-skeleton-content .ant-skeleton-paragraph>li:last-child:not(:first-child):not(:nth-child(2)){width:61%}.ant-skeleton-content .ant-skeleton-paragraph>li+li{margin-top:16px}.ant-skeleton-with-avatar .ant-skeleton-content .ant-skeleton-title{margin-top:12px}.ant-skeleton-with-avatar .ant-skeleton-content .ant-skeleton-title+.ant-skeleton-paragraph{margin-top:28px}.ant-skeleton.ant-skeleton-active .ant-skeleton-avatar,.ant-skeleton.ant-skeleton-active .ant-skeleton-content .ant-skeleton-paragraph>li,.ant-skeleton.ant-skeleton-active .ant-skeleton-content .ant-skeleton-title{background:linear-gradient(90deg,#f2f2f2 25%,#e6e6e6 37%,#f2f2f2 63%);background-size:400% 100%;animation:ant-skeleton-loading 1.4s ease infinite}@keyframes ant-skeleton-loading{0%{background-position:100% 50%}to{background-position:0 50%}}",""]),t.exports=r},3312:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.SkeletonAvatarProps=void 0;var r=d(n(312)),o=d(n(473)),c=d(n(109)),l=n(160);function d(t){return t&&t.__esModule?t:{default:t}}var f={prefixCls:c.default.string,size:c.default.oneOfType([c.default.oneOf(["large","small","default"]),c.default.number]),shape:c.default.oneOf(["circle","square"])},h=(e.SkeletonAvatarProps=c.default.shape(f).loose,{props:(0,l.initDefaultProps)(f,{size:"large"}),render:function(){var t,e,n=arguments[0],c=this.$props,l=c.prefixCls,d=c.size,f=c.shape,h=(0,o.default)((t={},(0,r.default)(t,l+"-lg","large"===d),(0,r.default)(t,l+"-sm","small"===d),t)),m=(0,o.default)((e={},(0,r.default)(e,l+"-circle","circle"===f),(0,r.default)(e,l+"-square","square"===f),e)),k="number"==typeof d?{width:d+"px",height:d+"px",lineHeight:d+"px"}:{};return n("span",{class:(0,o.default)(l,h,m),style:k})}});e.default=h},3313:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.SkeletonTitleProps=void 0;var r,o=n(109),c=(r=o)&&r.__esModule?r:{default:r};var l={prefixCls:c.default.string,width:c.default.oneOfType([c.default.number,c.default.string])},d=(e.SkeletonTitleProps=c.default.shape(l),{props:l,render:function(){var t=arguments[0],e=this.$props,n=e.prefixCls,r=e.width,o="number"==typeof r?r+"px":r;return t("h3",{class:n,style:{width:o}})}});e.default=d},3314:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.SkeletonParagraphProps=void 0;var r=c(n(757)),o=c(n(109));function c(t){return t&&t.__esModule?t:{default:t}}var l=o.default.oneOfType([o.default.number,o.default.string]),d={prefixCls:o.default.string,width:o.default.oneOfType([l,o.default.arrayOf(l)]),rows:o.default.number},f=(e.SkeletonParagraphProps=o.default.shape(d),{props:d,methods:{getWidth:function(t){var e=this.width,n=this.rows,r=void 0===n?2:n;return Array.isArray(e)?e[t]:r-1===t?e:void 0}},render:function(){var t=this,e=arguments[0],n=this.$props,o=n.prefixCls,c=n.rows,l=[].concat((0,r.default)(Array(c))).map((function(n,r){var o=t.getWidth(r);return e("li",{key:r,style:{width:"number"==typeof o?o+"px":o}})}));return e("ul",{class:o},[l])}});e.default=f},3435:function(t,e,n){"use strict";var r=n(22),o=n(10),c=(n(3302),n(3303)),l=n.n(c),d=(n(3252),n(3253)),f=n.n(d),h=(n(3266),n(3267)),m=n.n(h),k=(n(756),n(519)),v=n.n(k),w=(n(25),n(18),n(49),n(48),n(47),n(62),n(327),n(159),n(38),n(161),n(173),n(240),n(56)),y=n(754),P=n(264),O=n(674),x=n(92),L=n(0),S=n(9),_=n(19),j=n(474),C=n(16),T=n(94),D=n(436),M=n(221),$=n(308),A=function(t,e,n,r){return new(n||(n=Promise))((function(o,c){function l(t){try{f(r.next(t))}catch(t){c(t)}}function d(t){try{f(r.throw(t))}catch(t){c(t)}}function f(t){var e;t.done?o(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(l,d)}f((r=r.apply(t,e||[])).next())}))};w.default.use(v.a),e.a=w.default.extend({components:{Button:v.a,Tooltip:m.a,Spin:f.a,Skeleton:l.a},props:{searchKey:{type:String,default:""},currentType:{type:String,default:""},tvlData:{type:Object,default:function(){return{}}}},data:function(){return{changeNFT:!1,tableData:[{NFTID:"2",Liquidity:"$ 856.89",PriceRange:"1 - 1.002",isStaked:"Stake"},{NFTID:"1",Liquidity:"$ 1,395.27",PriceRange:"1 - 1.002",isStaked:"Unstake"}],statisticsInfo:{},poolsDefaultPriceRangeObj:"",farmingV2ListOrigin:[],farmingV2List:[],farmingMyPositionList:[],isOpenArr:{},isClaiming:!1,isStaking:!1,isUnStaking:!1,isDisabled:!1,stakeSuccess:!1,stakeFailed:!1,tokensRewardList:{},farmObj:{},loading:!0}},computed:Object.assign(Object.assign({},Object(P.e)(["wallet","transaction","url","farming","liquidity","farmingv2"])),{walletConnectedAndHavePoolsObj:function(){return!(!this.liquidity.poolsObj||!this.wallet.connected||Object(T.b)(this.wallet.tokenAccounts))}}),watch:{"liquidity.tokensRewardObj":{handler:"watchTokensRewardObj",immediate:!0},searchKey:function(t){this.filterDataList(t,this.currentType)},"liquidity.myPositions":{handler:"watchMyPositions",immediate:!0},walletConnectedAndHavePoolsObj:{handler:"walletConnectedAndHavePoolsObjWatch",immediate:!0},"liquidity.newPoolList":{handler:"watchNewPoolList",immediate:!0},"liquidity.farmList":{handler:"watchFarmList",immediate:!0}},mounted:function(){this.$accessor.liquidity.getPoolsDefaultPriceRange()},methods:{watchFarmList:function(t){t&&(this.farmObj=t)},watchNewPoolList:function(t){t&&t.length>0&&(this.farmingV2ListOrigin=t,this.loading=!1,this.searchKey||(this.farmingV2List=t),this.$accessor.liquidity.getFarmList(t))},importIcon:y.a,fixD:T.e,watchPoolsDefaultPriceRangeObj:function(t){this.poolsDefaultPriceRangeObj=t,t&&this.watchCoinPairConfigList(this.liquidity.coinPairConfigList)},walletConnectedAndHavePoolsObjWatch:function(t){t&&this.$accessor.liquidity.getMyPositionsNew({tokenAccounts:this.wallet.tokenAccounts,owner:this.wallet.address})},watchCoinPairConfigList:function(t){var e=this;if(this.statisticsInfo=t,this.statisticsInfo&&this.statisticsInfo&&this.statisticsInfo.length>0){var n=this.statisticsInfo||[],r=[],o=this.liquidity.poolsObj||{};n.forEach((function(t){var n,c,l=e.poolsDefaultPriceRangeObj?e.poolsDefaultPriceRangeObj[t.swap_account]:{},d=o?o[t.swap_account]:{};if(n=0,c=0,"v2"==t.version&&d){var f=d.token_a.decimal,h=d.token_b.decimal,m=Object(M.getNearestTickByCurrentTick)(d.data.currentTickIndex,d.tickSpace),k=m-d.tickSpace,v=m+d.tickSpace;n=Object(T.e)(M.TickMath.tickIndexToPrice(k,f,h).toString(),4),c=Object(T.e)(M.TickMath.tickIndexToPrice(v,f,h).toString(),4)}else n=0,c=0;r.push({emissionsList:d?d.emissionsList:[],emissionsAmount:d?d.emissionsAmount:0,pooolRewardersAmountLists:d?d.pooolRewardersAmountLists:[],token_a:d?d.token_a:[],token_b:d?d.token_b:[],minPrice:n,maxPrice:c,rewardAmount:d?d.rewardAmount:[],rewardNum:d?d.rewardNum:[],name:t.name,tvl_in_usd:Object(T.e)(l&&l.tvl_in_usd,2),liquidity:d&&d.data?d.data.liquidity:"",apr:l?l.rewarder_apr:"",swap_key:d?String(d.tokenSwapKey):"",version:t.version,swap_account:d?d.swap_account:""})}));var c=[];"Ended"!=this.currentType&&(this.farmingV2List=r.sort((function(a,b){return b.tvl_in_usd-a.tvl_in_usd})).sort((function(a,b){return b.sort-a.sort})).filter((function(t){return"v2"==t.version}))),"{}"!==JSON.stringify(o)&&(c=r.filter((function(t){return"v2"==t.version})).filter((function(t){return t.rewardNum>0})),this.farmingV2List=c)}},watchMyPositions:function(t){var e=t,n={};if(e.length>0&&e){for(var i=0;i<e.length;i++){var r=e[i]||[],o=M.TickMath.tickIndexToSqrtPriceX64(r.tickLowerIndex),c=M.TickMath.tickIndexToSqrtPriceX64(r.tickUpperIndex),l=M.ClmmPoolUtil.getTokenAmountFromLiquidity(r.liquidity,r.currentSqrtPrice,o,c,!0),d=Number(l.tokenA.toString())/Math.pow(10,r.token_a.decimal),f=Number(l.tokenB.toString())/Math.pow(10,r.token_b.decimal);r.amountAValue=d,r.amountBValue=f;r.currentPriceView,Number(r.minPrice),r.maxPrice.indexOf("+")>0||Number(r.maxPrice);var h=d*$.c[r.token_a.symbol]+f*$.c[r.token_b.symbol];r.amountUSD=h;var m=r.token_a.decimal,k=r.token_b.decimal,v=Object(T.e)(M.TickMath.tickIndexToPrice(r.tickLowerIndex,m,k).toString(),4),w=Object(T.e)(M.TickMath.tickIndexToPrice(r.tickUpperIndex,m,k).toString(),4);r.minPriceFarming=v,r.maxPriceFarming=w,n[String(r.address)]?n[String(r.address)].push(Object.assign({},r)):n[String(r.address)]=[Object.assign({},r)]}for(var y=0;y<this.farmingV2List.length;y++)n[this.farmingV2List[y].swap_account]||(n[this.farmingV2List[y].swap_account]=[]);this.farmingMyPositionList=n}},gotoLp:function(t){if(this.wallet.connected){var e=this.liquidity.coinPairConfigObj&&this.liquidity.coinPairConfigObj[t.swap_key],n="",r="";if(e)n=e.token_a.symbol,"WSOL"===e.token_a.symbol.toUpperCase()&&(n="SOL"),r=e.token_b.symbol,"WSOL"===e.token_b.symbol.toUpperCase()&&(r="SOL");else{var o=t.name.split("-");n=o[0],r=o[1]}this.$router.push("/deposit?from=".concat(n,"&to=").concat(r))}else this.$accessor.wallet.openModal()},removePosition:function(t,e){this.$router.push("/remove?id=".concat(e.positionNftMint,"&fromUrl=farming"))},increasePosition:function(t,e){this.$router.push("/increase?id=".concat(e.positionNftMint))},processShowUSD:function(t){if(t&&this.liquidity.rates){var e=t.amountAValue*this.liquidity.rates[t.token_a.symbol.toLowerCase()]+t.amountBValue*this.liquidity.rates[t.token_b.symbol.toLowerCase()];return Number(e)<1e-4&&Number(e)>0?"<0.0001":Object(T.a)(e,4)}return"--"},toogleData:function(t,e){var n=JSON.parse(JSON.stringify(this.isOpenArr));this.isOpenArr=Object.assign(Object.assign({},n),Object(o.a)({},t,!n[t]));var r=[];if(this.farmingMyPositionList[e.swap_account].length>0)for(var i=0;i<this.farmingMyPositionList[e.swap_account].length;i++)r.push(this.farmingMyPositionList[e.swap_account][i].positionPublicKey)},getIcon:function(t,e){if(this.liquidity.coinPairConfigObj&&this.liquidity.coinPairConfigObj[t]){var r=this.liquidity.coinPairConfigObj[t];return"a"===e?r.token_a.icon?r.token_a.icon:Object(y.a)("/coins/".concat(r.token_a.symbol.toLowerCase(),".png")):r.token_b.icon?r.token_b.icon:Object(y.a)("/coins/".concat(r.token_b.symbol.toLowerCase(),".png"))}return n(1131)},processNftAddress:function(address){return address?"".concat(address.substr(0,4),"...").concat(address.substr(address.length-4,4)):""},watchFarmingV2List:function(t){this.dataOriginList=t,this.filterDataList(this.searchKey,this.currentType,t)},filterDataListOrigin:function(t,e,n){var r=n||this.farmingV2List,o=[];if("Ended"!==e)if(t){o=r.filter((function(n){var r=!0,o=!0;return t&&(r=n.name.toLowerCase().includes(t.toLowerCase())),"Live"!==e&&(o=n.quarries&&n.quarries.length>1),r&&o})),this.farmingV2List=o;for(var i=0;i<o.length;i++)this.toogleDataAll(i,o[i])}else this.watchCoinPairConfigList(this.liquidity.coinPairConfigList);else this.dataList=o},filterDataList:function(t,e,n){var r=n||this.farmingV2ListOrigin,o=[];if("Ended"!==e)if(t){o=r.filter((function(n){var r=!0,o=!0;return t&&(r=n.name.toLowerCase().includes(t.toLowerCase())),"Live"!==e&&(o=n.quarries&&n.quarries.length>1),r&&o})),this.farmingV2List=o;for(var i=0;i<o.length;i++)this.toogleDataAll(i,o[i])}else this.farmingV2List=this.farmingV2ListOrigin;else this.dataList=o},toogleDataAll:function(t,e){this.$accessor.farmingv2.getPositionObjInfo({tvlData:this.tvlData,farmingInfo:e,rates:this.liquidity.rates,coinPairConfigObj:this.liquidity.poolsObj})},toStake:function(t,e){return A(this,void 0,void 0,regeneratorRuntime.mark((function n(){var o,c,l,d,f,h,m,k,v,w,y,P,O,T,M,$,A,N,I,i,R,V,K,F,W,U,H,E,B,J,z;return regeneratorRuntime.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return this.stakeSuccess=!1,this.stakeFailed=!1,this.currentPosition=e,o=t.positionWrapper,c=t.merge_pool.address,l=t.quarries,d=e.nftTokenId||e.nftMint,f=this.$wallet,h=this.$web3,m=Object(j.i)(h,f),this.isStaking=!0,this.isDisabled=!0,this.$accessor.transaction.setTransactionDesc("Stake ".concat(t.name," NFT")),this.$accessor.transaction.setShowWaiting(!0),k="",n.prev=15,n.next=18,x.a.fetchPositionWrapper(new L.PublicKey(o),m.provider.connection);case 18:return v=n.sent,Object(_.default)(null!==v,"wrapper not found"),n.next=22,x.a.fetchSwapPositionByOwner(v.swapKey,d,m.provider.wallet.publicKey,m.provider.connection);case 22:return w=n.sent,Object(_.default)(null!==w,"Can't find the swap position you own"),y=m.mergeMine.loadMP({mpKey:new L.PublicKey(c)}),n.next=27,m.mergeMine.findMergeMinerAddress({owner:m.provider.wallet.publicKey,pool:new L.PublicKey(c)});case 27:return P=n.sent,n.next=30,m.positionWrapper.mintWrapTokens({wrapper:v,positionInfo:w,tokenProgram:S.TOKEN_PROGRAM_ID});case 30:return O=n.sent,T=Object(r.a)(O.tx.instructions),n.next=34,Object(D.a)(f,new L.PublicKey(o),new L.PublicKey(d));case 34:return M=n.sent,n.next=37,y.data();case 37:return $=n.sent,n.next=40,C.k.load(m.provider.connection,$.primaryMint);case 40:A=n.sent,Object(_.default)(null!==A,"The primary token is null"),N={},I=t.merge_pool.primary_mint,t.merge_pool.replica_mint,i=0;case 46:if(!(i<l.length)){n.next=64;break}if((R=l[i]).stake_token_mint!==I){n.next=56;break}return V=R.rewarder,n.next=52,y.deposit({amount:new C.l(A,M.toString()),rewarder:new L.PublicKey(V)});case 52:K=n.sent,i===l.length-1?((F=K.instructions).unshift.apply(F,Object(r.a)(T)),N=K):T.push.apply(T,Object(r.a)(K.instructions)),n.next=61;break;case 56:return W=R.rewarder,n.next=59,y.stakeReplicaMiner(new L.PublicKey(W),P);case 59:U=n.sent,i===l.length-1?((H=U.instructions).unshift.apply(H,Object(r.a)(T)),N=U):T.push.apply(T,Object(r.a)(U.instructions));case 61:i++,n.next=46;break;case 64:return E={skipPreflight:!0,commitment:"confirmed",preflightCommitment:"confirmed",maxRetries:30,printLogs:!0},n.next=67,N.send(E);case 67:return B=n.sent,this.$accessor.transaction.setShowWaiting(!1),B&&B.signature&&(k=B.signature,J="Stake ".concat(t.name," NFT"),this.$accessor.transaction.setShowSubmitted(!0),z=this,this.$accessor.transaction.sub({txid:k,description:J,type:"Stake",successCallback:function(){z.isStaking=!1,z.isDisabled=!1,z.$emit("refreshData"),z.$accessor.farmingv2.getPositionObj({tvlData:z.tvlData,farmingInfo:t,rates:z.liquidity.rates,coinPairConfigObj:z.liquidity.coinPairConfigObj}),z.stakeSuccess=!0},errorCallback:function(){z.isStaking=!1,z.isDisabled=!1,z.stakeFailed=!0}})),n.next=72,B.wait({commitment:"confirmed",useWebsocket:!0,retries:30});case 72:n.sent,n.next=84;break;case 75:n.prev=75,n.t0=n.catch(15),this.stakeFailed=!0,this.$accessor.transaction.setShowWaiting(!1),this.$accessor.transaction.setShowSubmitted(!1),this.isStaking=!1,this.isDisabled=!1,this.$notify.close(k+"loading"),this.$notify.error({key:"StakeErr",message:"Transaction failed",description:""});case 84:case"end":return n.stop()}}),n,this,[[15,75]])})))},toClaim:function(t,e){return A(this,void 0,void 0,regeneratorRuntime.mark((function n(){var r,o,c,l,d,f,i,h,m,k,v,w,y,P,x=this;return regeneratorRuntime.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return r=this.$wallet,n.next=3,Object(O.e)(r,t.swap_account);case 3:if(o=n.sent,c=[],l=e,d=[],this.tokensRewardList&&l.forEach((function(t){var e,n;"So11111111111111111111111111111111111111112"!=t.mint&&d.push((null===(e=x.tokensRewardList[t.mint])||void 0===e?void 0:e.symbol)?null===(n=x.tokensRewardList[t.mint])||void 0===n?void 0:n.symbol:"")})),f="",f=1==d.length?d[0]:2==d.length?d[0]+" and "+d[1]:d[0]+" "+d[1]+" and "+d[2],this.farmingMyPositionList[t.swap_account].length>0)for(i=0;i<this.farmingMyPositionList[t.swap_account].length;i++)c.push(this.farmingMyPositionList[t.swap_account][i].positionPublicKey);if(this.isClaiming=!0,this.isDisabled=!0,this.$accessor.transaction.setTransactionDesc("Harvest ".concat(f," rewards")),this.$accessor.transaction.setShowWaiting(!0),h="",n.prev=16,null,k={skipPreflight:!0,commitment:"confirmed",preflightCommitment:"confirmed",maxRetries:30,printLogs:!0},!(c&&c.length>0)){n.next=31;break}return n.next=22,o.collectAllRewarderIxs(c);case 22:v=n.sent,w=0;case 24:if(!(w<v.length)){n.next=31;break}return n.next=27,v[w].confirm(k);case 27:m=n.sent;case 28:w++,n.next=24;break;case 31:m&&m.signature&&(h=m.signature,y="Harvest ".concat(f," rewards"),P=this,this.$accessor.transaction.setShowSubmitted(!0),this.$accessor.transaction.sub({txid:h,description:y,type:"Harvest",successCallback:function(){P.isClaiming=!1,P.isDisabled=!1,P.$emit("refreshData"),x.$accessor.liquidity.getPoolList(),x.$accessor.liquidity.getFarmList(x.farmingV2ListOrigin)},errorCallback:function(){P.isClaiming=!1,P.isDisabled=!1}})),n.next=42;break;case 34:n.prev=34,n.t0=n.catch(16),this.$accessor.transaction.setShowWaiting(!1),this.$accessor.transaction.setShowSubmitted(!1),this.isClaiming=!1,this.isDisabled=!1,this.$notify.close(h+"loading"),this.$notify.error({key:"HarvestErr",message:"Transaction failed",description:""});case 42:case"end":return n.stop()}}),n,this,[[16,34]])})))},watchTokensRewardObj:function(t){this.tokensRewardList=t},importIconNew:function(path){try{return n(1711)("./assets".concat(path))}catch(t){return n(1131)}},getCurrentStatus:function(t){return t.isPause?"Closed":Number(t.currentPriceView)>=Number(t.minPrice)&&Number(t.currentPriceView)<=Number(t.maxPrice)||!Number(t.minPrice)&&isNaN(Number(t.maxPrice))?"Active":"Inactive"},getPopupContainer:function(){return this.$refs.modal}}})}}]);