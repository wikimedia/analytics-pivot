webpackJsonp([4],{

/***/ 722:
/***/ function(module, exports) {

	/*! drag-drop-polyfill 2.0.0-beta.0 | Copyright (c) 2016 Tim Ruffles | BSD 2 License */
	var DragDropPolyfill;!function(a){function b(){var a={dragEvents:"ondragstart"in document.documentElement,draggable:"draggable"in document.documentElement,touchEvents:"ontouchstart"in document.documentElement,userAgentSupportingNativeDnD:void 0},b=!!window.chrome||/chrome/i.test(navigator.userAgent);return a.userAgentSupportingNativeDnD=!(/iPad|iPhone|iPod|Android/.test(navigator.userAgent)||b&&a.touchEvents),a}function c(a){if(a&&Object.keys(a).forEach(function(b){t[b]=a[b]}),!t.forceApply){var c=b();if(c.userAgentSupportingNativeDnD&&c.draggable&&c.dragEvents)return}document.addEventListener("touchstart",d)}function d(a){if(!u){var b=e(a);if(b)try{u=new C(a,t,b,f)}catch(c){throw f(t,a,3),c}}}function e(a){var b=a.target;do if(b.draggable!==!1&&b.getAttribute&&"true"===b.getAttribute("draggable"))return b;while((b=b.parentNode)&&b!==document.body)}function f(a,b,c){if(0===c&&a.defaultActionOverride)try{a.defaultActionOverride(b)}catch(d){}u=null}function g(a){return 0===a.length?0:a.reduce(function(a,b){return b+a},0)/a.length}function h(a){return a&&a.tagName}function i(a,b){for(var c=0;c<a.changedTouches.length;c++){var d=a.changedTouches[c];if(d.identifier===b)return!0}return!1}function j(a,b,c,d,e,f,g){void 0===g&&(g=null);var h=b.changedTouches[0],i=new Event(c,{bubbles:!0,cancelable:d});i.dataTransfer=f,i.relatedTarget=g,i.screenX=h.screenX,i.screenY=h.screenY,i.clientX=h.clientX,i.clientY=h.clientY,i.pageX=h.pageX,i.pageY=h.pageY;var j=a.getBoundingClientRect();return i.offsetX=i.clientX-j.left,i.offsetY=i.clientY-j.top,i}function k(a,b,c){for(var d=[],e=[],f=0;f<b.touches.length;f++){var h=b.touches[f];d.push(h[a+"X"]),e.push(h[a+"Y"])}c.x=g(d),c.y=g(e)}function l(a,b){if(1===a.nodeType){for(var c=getComputedStyle(a),d=0;d<c.length;d++){var e=c[d];b.style.setProperty(e,c.getPropertyValue(e),c.getPropertyPriority(e))}b.style.pointerEvents="none",b.removeAttribute("id"),b.removeAttribute("class"),b.removeAttribute("draggable")}if(a.hasChildNodes())for(var d=0;d<a.childNodes.length;d++)l(a.childNodes[d],b.childNodes[d])}function m(a){var b=a.cloneNode(!0);return l(a,b),b.style.position="absolute",b.style.left="0px",b.style.top="0px",b.style.zIndex="999999",b.classList.add(z),b.classList.add(B),b}function n(a){return x.map(function(b){var c=a.style[b+"transform"];return c&&"none"!==c?c.replace(/translate\(\D*\d+[^,]*,\D*\d+[^,]*\)\s*/g,""):""})}function o(a,b,c,d,e){void 0===e&&(e=!0);var f=b.x,g=b.y;d&&(f+=d.x,g+=d.y),e&&(f-=parseInt(a.offsetWidth,10)/2,g-=parseInt(a.offsetHeight,10)/2);for(var h="translate3d("+f+"px,"+g+"px, 0)",i=0;i<x.length;i++){var j=x[i]+"transform";a.style[j]=h+" "+c[i]}}function p(a,b,c,d){var e=getComputedStyle(a);if("hidden"===e.visibility||"none"===e.display)return void d();var f=a.getBoundingClientRect(),g={x:f.left,y:f.top};g.x+=document.body.scrollLeft||document.documentElement.scrollLeft,g.y+=document.body.scrollTop||document.documentElement.scrollTop,g.x-=parseInt(e.marginLeft,10),g.y-=parseInt(e.marginTop,10),b.classList.add(A);var h=getComputedStyle(b),i=parseFloat(h.transitionDuration),j=parseFloat(h.transitionDelay),k=Math.round(1e3*(i+j));o(b,g,c,void 0,!1),setTimeout(d,k)}function q(a,b){return a?a===v[0]?w[0]:0===a.indexOf(v[1])||a===v[7]?w[1]:0===a.indexOf(v[4])?w[3]:a===v[6]?w[2]:w[1]:3===b.nodeType&&"A"===b.tagName?w[3]:w[1]}function r(a,b,c,d,e,f,g){void 0===f&&(f=!0),void 0===g&&(g=null);var h=j(b,c,a,f,document.defaultView,e,g),i=!b.dispatchEvent(h);return d.g=0,i}function s(a,b){if(!a||a===v[7])return b;if(b===w[1]){if(0===a.indexOf(w[1]))return w[1]}else if(b===w[3]){if(0===a.indexOf(w[3])||a.indexOf("Link")>-1)return w[3]}else if(b===w[2]&&(0===a.indexOf(w[2])||a.indexOf("Move")>-1))return w[2];return w[0]}var t={iterationInterval:150};a.Initialize=c;var u,v=["none","copy","copyLink","copyMove","link","linkMove","move","all"],w=["none","copy","move","link"],x=["","-webkit-"],y="dnd-poly-",z=y+"drag-image",A=y+"snapback",B=y+"icon",C=function(){function a(a,b,c,d){this.h=a,this.i=b,this.j=c,this.k=d,this.l=0,this.m=null,this.o=null,this.p=a,this.q=a.changedTouches[0],this.s=this.t.bind(this),this.u=this.v.bind(this),document.addEventListener("touchmove",this.s),document.addEventListener("touchend",this.u),document.addEventListener("touchcancel",this.u)}return a.prototype.A=function(){var a=this;this.l=1,this.B=w[0],this.C={D:{},F:void 0,g:3,G:[]},this.H={x:null,y:null},this.I={x:null,y:null};var b=this.j;if(this.J=new D(this.C,function(c,d,e){b=c,"number"!=typeof d&&"number"!=typeof e||(a.K={x:d||0,y:e||0})}),this.C.g=2,this.J.dropEffect=w[0],r("dragstart",this.j,this.p,this.C,this.J))return this.l=3,this.L(),!1;if(k("page",this.p,this.I),this.M=m(b),this.N=n(this.M),!this.K)if(this.i.dragImageOffset)this.K={x:this.i.dragImageOffset.x,y:this.i.dragImageOffset.y};else if(this.i.dragImageCenterOnTouch)this.K={x:0,y:0};else{var c=b.getBoundingClientRect(),d=getComputedStyle(b);this.K={x:c.left-this.q.clientX-parseInt(d.marginLeft,10),y:c.top-this.q.clientY-parseInt(d.marginTop,10)}}return o(this.M,this.I,this.N,this.K,this.i.dragImageCenterOnTouch),document.body.appendChild(this.M),this.O=setInterval(function(){a.P||(a.P=!0,a.R(),a.P=!1)},this.i.iterationInterval),!0},a.prototype.L=function(){this.O&&(clearInterval(this.O),this.O=null),document.removeEventListener("touchmove",this.s),document.removeEventListener("touchend",this.u),document.removeEventListener("touchcancel",this.u),this.M&&(this.M.parentNode.removeChild(this.M),this.M=null),this.k(this.i,this.p,this.l)},a.prototype.t=function(a){var b=this;if(i(a,this.q.identifier)!==!1){if(this.p=a,0===this.l){var c=1===a.touches.length;if(this.i.dragStartConditionOverride){try{c=this.i.dragStartConditionOverride(a)}catch(d){}if("boolean"!=typeof c)return}return c?void(this.A()===!0&&(this.h.preventDefault(),a.preventDefault())):void this.L()}a.preventDefault(),k("client",a,this.H),k("page",a,this.I);var e=!1;if(this.i.dragImageTranslateOverride)try{if(e=this.i.dragImageTranslateOverride(a,{x:this.H.x,y:this.H.y},this.m,function(a,c){b.M&&(b.H.x+=a,b.H.y+=c,b.I.x+=a,b.I.y+=c,o(b.M,b.I,b.N,b.K,b.i.dragImageCenterOnTouch))}))return}catch(d){}o(this.M,this.I,this.N,this.K,this.i.dragImageCenterOnTouch)}},a.prototype.v=function(a){if(i(a,this.q.identifier)!==!1){if(this.i.dragImageTranslateOverride)try{this.i.dragImageTranslateOverride(void 0,void 0,void 0,function(){})}catch(b){}if(0===this.l)return void this.L();a.preventDefault(),this.l="touchcancel"===a.type?3:2}},a.prototype.R=function(){var a=this,b=this.B;this.C.g=3,this.J.dropEffect=w[0];var c=r("drag",this.j,this.p,this.C,this.J);if(c&&(this.B=w[0]),c||2===this.l||3===this.l){var d=this.S(this.l);return d?void p(this.j,this.M,this.N,function(){a.T()}):void this.T()}var e=document.elementFromPoint(this.H.x,this.H.y),f=this.o;e!==this.m&&e!==this.o&&(this.m=e,null!==this.o&&(this.C.g=3,this.J.dropEffect=w[0],r("dragexit",this.o,this.p,this.C,this.J,!1)),null===this.m?this.o=this.m:(this.C.g=3,this.J.dropEffect=q(this.C.F,this.j),r("dragenter",this.m,this.p,this.C,this.J)?(this.o=this.m,this.B=s(this.J.effectAllowed,this.J.dropEffect)):this.m!==document.body&&(this.o=document.body))),f!==this.o&&h(f)&&(this.C.g=3,this.J.dropEffect=w[0],r("dragleave",f,this.p,this.C,this.J,!1,this.o)),h(this.o)&&(this.C.g=3,this.J.dropEffect=q(this.C.F,this.j),r("dragover",this.o,this.p,this.C,this.J)===!1?this.B=w[0]:this.B=s(this.J.effectAllowed,this.J.dropEffect)),b!==this.B&&this.M.classList.remove(y+b);var g=y+this.B;this.M.classList.contains(g)===!1&&this.M.classList.add(g)},a.prototype.S=function(a){var b=this.B===w[0]||null===this.o||3===a;return b?h(this.o)&&(this.C.g=3,this.J.dropEffect=w[0],r("dragleave",this.o,this.p,this.C,this.J,!1)):h(this.o)&&(this.C.g=1,this.J.dropEffect=this.B,r("drop",this.o,this.p,this.C,this.J)===!0?this.B=this.J.dropEffect:this.B=w[0]),b},a.prototype.T=function(){this.C.g=3,this.J.dropEffect=this.B,r("dragend",this.j,this.p,this.C,this.J,!1),this.l=2,this.L()},a}(),D=function(){function a(a,b){this.U=a,this.V=b,this.W=w[0]}return Object.defineProperty(a.prototype,"types",{get:function(){if(0!==this.U.g)return Object.freeze(this.U.G)},enumerable:!0,configurable:!0}),a.prototype.setData=function(a,b){if(2===this.U.g){if(a.indexOf(" ")>-1)throw new Error("illegal arg: type contains space");this.U.D[a]=b,this.U.G.indexOf(a)===-1&&this.U.G.push(a)}},a.prototype.getData=function(a){if(1===this.U.g||2===this.U.g)return this.U.D[a]||""},a.prototype.clearData=function(a){if(2===this.U.g){if(a&&this.U.D[a]){delete this.U.D[a];var b=this.U.G.indexOf(a);return void(b>-1&&this.U.G.splice(b,1))}this.U.D={},this.U.G=[]}},a.prototype.setDragImage=function(a,b,c){2===this.U.g&&this.V(a,b,c)},Object.defineProperty(a.prototype,"effectAllowed",{get:function(){return this.U.F},set:function(a){2===this.U.g&&v.indexOf(a)>-1&&(this.U.F=a)},enumerable:!0,configurable:!0}),Object.defineProperty(a.prototype,"dropEffect",{get:function(){return this.W},set:function(a){0!==this.U.g&&v.indexOf(a)>-1&&(this.W=a)},enumerable:!0,configurable:!0}),a}()}(DragDropPolyfill||(DragDropPolyfill={}));
	module.exports = DragDropPolyfill;

/***/ },

/***/ 723:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(724);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./drag-drop-polyfill.css", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./drag-drop-polyfill.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 724:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, "\n.dnd-poly-drag-image {\n    opacity: .5 !important;\n}\n\n.dnd-poly-drag-image.dnd-poly-snapback {\n    transition-property: transform, -webkit-transform !important;\n    transition-duration: 250ms !important;\n    transition-timing-function: ease-out !important;\n}\n", ""]);

	// exports


/***/ }

});