webpackJsonp([9],{"3b9P":function(t,s){},"P/oU":function(t,s,i){"use strict";Object.defineProperty(s,"__esModule",{value:!0});var e=i("3cXf"),a=i.n(e),o=i("4YfN"),n=i.n(o),c=i("KgXo"),r=i("9rMa"),l=i("0tE7"),u=i("/Nq/"),g=i("wSez"),m={data:function(){return{historyPosition:"0",userImg:"",createList:[],subList:[],listLoading:!1,bottom:0,localListShow:!0,createListShow:!0,subListShow:!0,inPages:!0}},components:{scroll:l.a,loading:c.a},methods:n()({},Object(r.c)({setMusicList:"SET_MUSICLIST",setCurrentIndex:"SET_CURRENTINDEX"}),{getPlayList:function(t,s){var i=this;!0!==s&&(this.listLoading=!0),Object(u.t)(t).then(function(s){var e=s.data;if(e&&e.code+""=="200"){var a=e.playlist;if(a){a.forEach(function(s){s.image=s.coverImgUrl,s.name=s.userId+""==t+""&&-1!==s.name.indexOf(i.$store.state.userName)?"我喜欢的音乐":s.name});var o=a.filter(function(s){return s.userId+""!=t+""}),n=a.filter(function(s){return s.userId+""==t+""});setTimeout(function(){i.createList=n,i.subList=o,i.listLoading=!1},1e3)}}}).catch(function(t){i.listLoading=!1})},logout:function(){var t=this;g.Indicator.open("注销中"),Object(u.j)().then(function(s){g.Indicator.close(),t.$store.state.loginState=!1,t.setCurrentIndex(0),t.setMusicList([]),t.$bus.emit("del-player")}).catch(function(s){t.toast("注销失败！"),g.Indicator.close()})},goToLogin:function(){this.setCurrentIndex(0),this.setMusicList([]),this.$bus.emit("del-player"),this.$router.push("/phoneLogin")},goToDetail:function(t){this.$router.push({name:"songDetail",params:{type:"historyList",title:t.name,image:t.image,trackCount:t.trackCount}})}}),watch:{"$store.state.userId":function(t){var s=this,i=JSON.parse(localStorage.getItem("my_message.createList"))||[],e=JSON.parse(localStorage.getItem("my_message.subList"))||[];if(t){if(i.length>0&&e.length>0)return this.createList=i,this.subList=e,void setTimeout(function(){s.getPlayList(s.$store.state.userId,!0)},1e3);this.getPlayList(t)}else this.createList=[],this.subList=[]},createList:function(t){localStorage.setItem("my_message.createList",a()(t))},subList:function(t){localStorage.setItem("my_message.subList",a()(t))}},mounted:function(){var t=this;if(window.plus){var s=window.plus.navigator.getStatusbarHeight();this.bottom=s}else document.addEventListener("plusready",function(){var t=window.plus.navigator.getStatusbarHeight();this.bottom=t},!1);if(this.$store.state.userId){var i=JSON.parse(localStorage.getItem("my_message.createList"))||[],e=JSON.parse(localStorage.getItem("my_message.subList"))||[];if(i.length>0&&e.length>0)return this.createList=i,this.subList=e,void setTimeout(function(){t.getPlayList(t.$store.state.userId,!0)},1e3);this.getPlayList(this.$store.state.userId)}},activated:function(){this.inPages=!0},computed:n()({},Object(r.b)(["currentSong","historyList"])),deactivated:function(){this.historyPosition=this.$refs.scroll.scrollPosition()+"",this.inPages=!1}},h={render:function(){var t=this,s=t.$createElement,i=t._self._c||s;return i("div",{staticClass:"myMessage"},[i("scroll",{ref:"scroll",staticClass:"scroll",attrs:{"in-page":t.inPages,data:t.createList,"start-y":t.historyPosition}},[i("div",{style:t.currentSong.id?{height:"auto","padding-bottom":t.bottom+60+"px"}:{height:"auto","padding-bottom":t.bottom+"px"}},[i("div",{staticClass:"decorate"}),t._v(" "),i("div",{staticStyle:{"padding-top":"10px"}},[i("div",{staticClass:"user"},[i("div",{staticClass:"icon"},[i("img",{directives:[{name:"lazy",rawName:"v-lazy",value:t.$store.state.userImg,expression:"$store.state.userImg"}],key:t.$store.state.userImg,attrs:{width:"100%",height:"100%"}})]),t._v(" "),i("div",{staticClass:"userName"},[t._v(t._s(t.$store.state.userName||"未登录"))]),t._v(" "),!1===t.$store.state.loginState?i("div",{staticClass:"user_btn",on:{click:function(s){return s.stopPropagation(),t.goToLogin(s)}}},[t._v("登陆")]):t._e(),t._v(" "),!0===t.$store.state.loginState?i("div",{staticClass:"user_btn",on:{click:function(s){return s.stopPropagation(),t.logout(s)}}},[t._v("注销")]):t._e()])]),t._v(" "),i("div",{staticClass:"title",staticStyle:{"margin-top":"15px"},on:{click:function(s){s.stopPropagation(),t.localListShow=!t.localListShow}}},[i("i",{class:t.localListShow?"iconfont icon icon-back":"iconfont icon icon-next"}),t._v("\n        记录\n      ")]),t._v(" "),i("ul",{directives:[{name:"show",rawName:"v-show",value:t.localListShow,expression:"localListShow"}],staticClass:"list"},[t.historyList.length>0?i("li",{staticClass:"item",on:{click:function(s){s.stopPropagation(),t.goToDetail({image:t.historyList[0].image,name:"最近播放",trackCount:t.historyList.length})}}},[i("img",{directives:[{name:"lazy",rawName:"v-lazy",value:t.historyList[0].image,expression:"historyList[0].image"}],key:t.historyList[0].image,staticClass:"icon"}),t._v(" "),i("div",{staticClass:"box"},[i("h2",{staticClass:"name"},[t._v("最近播放")]),t._v(" "),i("p",{staticClass:"count"},[t._v(t._s(t.historyList.length)+"(首)")])])]):t._e()]),t._v(" "),t.listLoading?t._e():i("div",[t.createList.length>0?i("div",{staticClass:"title",staticStyle:{"margin-top":"15px"},on:{click:function(s){s.stopPropagation(),t.createListShow=!t.createListShow}}},[i("i",{class:t.createListShow?"iconfont icon icon-back":"iconfont icon icon-next"}),t._v("\n          创建的歌单\n        ")]):t._e(),t._v(" "),i("ul",{directives:[{name:"show",rawName:"v-show",value:t.createListShow,expression:"createListShow"}],staticClass:"list"},t._l(t.createList,function(s){return i("li",{key:s.id,staticClass:"item",on:{click:function(i){i.stopPropagation(),t.$router.push({name:"songDetail",params:{id:s.id,image:s.image,title:s.name,playCount:s.playCount,trackCount:s.trackCount}})}}},[i("img",{directives:[{name:"lazy",rawName:"v-lazy",value:s.image,expression:"item.image"}],key:s.image,staticClass:"icon"}),t._v(" "),i("div",{staticClass:"box"},[i("h2",{staticClass:"name"},[t._v(t._s(s.name))]),t._v(" "),i("p",{staticClass:"count"},[t._v(t._s(s.trackCount)+"(首)")])])])})),t._v(" "),t.subList.length>0?i("div",{staticClass:"title",staticStyle:{"margin-top":"15px"},on:{click:function(s){s.stopPropagation(),t.subListShow=!t.subListShow}}},[i("i",{class:t.subListShow?"iconfont icon icon-back":"iconfont icon icon-next"}),t._v("\n          收藏的歌单\n        ")]):t._e(),t._v(" "),i("ul",{directives:[{name:"show",rawName:"v-show",value:t.subListShow,expression:"subListShow"}],staticClass:"list"},t._l(t.subList,function(s){return i("li",{key:s.id,staticClass:"item",on:{click:function(i){i.stopPropagation(),t.$router.push({name:"songDetail",params:{id:s.id,image:s.image,title:s.name,playCount:s.playCount,trackCount:s.trackCount}})}}},[i("img",{directives:[{name:"lazy",rawName:"v-lazy",value:s.image,expression:"item.image"}],key:s.image,staticClass:"icon"}),t._v(" "),i("div",{staticClass:"box"},[i("h2",{staticClass:"name"},[t._v(t._s(s.name))]),t._v(" "),i("p",{staticClass:"count"},[t._v(t._s(s.trackCount)+"(首)")])])])}))])])]),t._v(" "),t.listLoading?i("div",{staticClass:"loading-content"},[i("loading")],1):t._e()],1)},staticRenderFns:[]};var d=i("C7Lr")(m,h,!1,function(t){i("3b9P")},"data-v-69068bd1",null);s.default=d.exports}});
//# sourceMappingURL=9.706fe8ad25de1ef2f0f6.js.map