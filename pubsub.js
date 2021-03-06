/*
 * JavaScript Document
 * ps.js
 * Created on 2015年10月22日 下午1:59:23
 * Copyright (c)   All Rights Reserved.
 * @auth xsTao
 * @desc:
 *  website:  http://blog.seoui.com/
    demo:     http://peachyy.github.io/pubsub/
 * 	 一个WEB前端发布(publish) 订阅(subscribe) 的小组件 不需要第3方库的依赖
 *  * 支持像jquery一样的链式调用风格
 *  *使用ps.pub / ps.publish    发布通知
 *  *使用ps.sub /ps.subscribe   订阅通知
 *  *使用ps.unsub /ps.unsubscribe 取消已订阅的通知
 *   ps.setDebug()调试模式开关
 */

!function(w,path){
	var ps={
	},
	subs={},
	debug=false,
	tokencache=1,
	tokenPre="pubAndSub-";
	swapEP();
	/**
	 * 发布通知
	 */
	ps.publish=ps.pub=function(){
		var args=getArgsAsArrays(arguments);
		if(args.length<=0){
			throw new Error('发布通知必须要指定订阅通知类型');
		}
		var event=args[0],calls=subs[event];
		if(!calls){//不处理没有用户订阅的事件
			return;
		}
		var ctx = { event: event, args:args.splice(1)},
		len=calls.length;
		for(var i=0;i<len;i++){
			ctx.token=calls[i].token;
			calls[i].callback.apply(ctx,ctx.args);
		}
		return this;
	}
	/**
	 * 订阅通知
	 */
	ps.subscribe=ps.sub=function(event,call){
		var a=subs[event]=subs[event]||[],
		instanceToken=tokenPre+tokencache++;
		a.push({
			token:instanceToken,
			callback:call
		});
		return instanceToken;
	}
	/**
	 * 删除 第1个参数为订阅通知名称  第2个参数可以为TOKEN/函数对象 
	 * 如果是token则使用token匹配删除 
	 * 如果是使用function函数 则匹配function函数删除
	 */
	ps.unsubscribe=ps.unsub=function(){
		var i=0,len=0,
		args=getArgsAsArrays(arguments),
		event=args[0],currEvent=subs[event];
		if(!currEvent){
			return;//没有这个订阅的通知不执行任何操作
		}
		for(i,len=currEvent.length;i<len;i++){
			var where=args[1];
			if(typeof where=='function' && currEvent[i].callback===where){
				subs[event].splice(i,1);
				_log("remove success[key:"+event+",token:"+where+"] by fun");
				return this;
			}else if(typeof where=='string' && currEvent[i].token===where){
				subs[event].splice(i,1);
				_log("remove success[key:"+event+",token:"+where+"] by token");
				return this;
			}else{
				//other 暂时没有处理
			}
		}
		return this;
	}
	/**
	 * 获取订阅者的信息
	 */
	ps.getsubsmembers=function(){
		return subs;
	}
	/**
	 * 设置是否是调试模式 调试模式会输出一些日志信息
	 * @param b Boolean 
	 */
	ps.setDebug=function(b){
		debug=b;
	}
	//////////////////////util
	/**
	 * 获取参数列表 转换为[]
	 */
	function getArgsAsArrays(arg){
		return Array.prototype.slice.call(arg);
	}
	function _log(v){
		if(window.console && console.log && debug===true){
			var t=new Date();
			console.log("["+t.getFullYear()+"-"+(t.getMonth()+1)+"-"+t.getDate()+" "+t.getHours()+":"+t.getMinutes()+":"+t.getSeconds()+"]\t"+v);
		}
	}
	//兼容环节适配
	function swapEP(){
	    //修复IE8、或IE8以下的浏览器 splice 规则与webkit不同的兼容
		if (document.documentMode && document.documentMode < 9) {
			var originalSplice = Array.prototype.splice;
			Array.prototype.splice = function() {
				var arr = [],  i = 0,  max = arguments.length;   	    
				for (; i < max; i++){
					arr.push(arguments[i]);
				}
				if (arr.length==1) {
					arr.push(this.length - arr[0]);
				}
				return originalSplice.apply(this, arr);
		    };
	    }
	}
	w[path?path:'ps']=ps;
}(window,undefined);