"use strict";var e=require("elliptic");var t=require("hash.js");var r=require("chai");require("bitcoin-computer-bitcore");var n=require("dotenv");var o=require("is-primitive");var i=require("is-plain-object");var a=require("fs");var s=require("os");function c(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}var d=c(t);var f=c(n);var u=c(o);var l=c(i);var h=c(a);var b=c(s);const{deleteProperty:p}=Reflect;const y=u.default;const v=l.default;const g=e=>"object"==typeof e&&null!==e||"function"==typeof e;const w=e=>{if(!y(e))throw new TypeError("Object keys must be strings or symbols");if((e=>"__proto__"===e||"constructor"===e||"prototype"===e)(e))throw new Error(`Cannot set unsafe key: "${e}"`)};const m=(e,t)=>t&&"function"==typeof t.split?t.split(e):"symbol"==typeof e?[e]:Array.isArray(e)?e:((e,t,r)=>{const n=(e=>Array.isArray(e)?e.flat().map(String).join(","):e)(t?((e,t)=>{if("string"!=typeof e||!t)return e;let r=e+";";return void 0!==t.arrays&&(r+=`arrays=${t.arrays};`),void 0!==t.separator&&(r+=`separator=${t.separator};`),void 0!==t.split&&(r+=`split=${t.split};`),void 0!==t.merge&&(r+=`merge=${t.merge};`),void 0!==t.preservePaths&&(r+=`preservePaths=${t.preservePaths};`),r})(e,t):e);w(n);const o=_.cache.get(n)||r();return _.cache.set(n,o),o})(e,t,(()=>((e,t={})=>{const r=t.separator||".";const n="/"!==r&&t.preservePaths;if("string"==typeof e&&!1!==n&&/\//.test(e))return[e];const o=[];let i="";const a=e=>{let t;""!==e.trim()&&Number.isInteger(t=Number(e))?o.push(t):o.push(e)};for(let t=0;t<e.length;t++){const n=e[t];"\\"!==n?n!==r?i+=n:(a(i),i=""):i+=e[++t]}return i&&a(i),o})(e,t)));const S=(e,t,r,n)=>{if(w(t),void 0===r)p(e,t);else if(n&&n.merge){const o="function"===n.merge?n.merge:Object.assign;o&&v(e[t])&&v(r)?e[t]=o(e[t],r):e[t]=r}else e[t]=r;return e};const _=(e,t,r,n)=>{if(!t||!g(e))return e;const o=m(t,n);let i=e;for(let e=0;e<o.length;e++){const t=o[e];const a=o[e+1];if(w(t),void 0===a){S(i,t,r,n);break}"number"!=typeof a||Array.isArray(i[t])?(g(i[t])||(i[t]={}),i=i[t]):i=i[t]=[]}return e};_.split=m,_.cache=new Map,_.clear=()=>{_.cache=new Map};var P=_;var O=h.default;var x="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};var k="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};var E=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}();var T=function e(t,r){var n=r.indexOf(".");if(!~n){if(null==t)return;return t[r]}var o=r.substring(0,n),i=r.substring(n+1);if(null!=t)return t=t[o],i?e(t,i):t},j=P,q=function(e,t){if("function"!=typeof t)return JSON.parse(O.readFileSync(e));O.readFile(e,"utf-8",(function(e,r){try{r=JSON.parse(r)}catch(t){e=e||t}t(e,r)}))},R=h.default,A=b.default;var K=function(){function e(t,r){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.options=r=r||{},r.stringify_width=r.stringify_width||2,r.stringify_fn=r.stringify_fn||null,r.stringify_eol=r.stringify_eol||!1,r.ignore_dots=r.ignore_dots||!1,this.path=t,this.data=this.read()}return E(e,[{key:"set",value:function(e,t,r){var n=this;return"object"===(void 0===e?"undefined":k(e))?function(e,t){var r=0,n=[];if(Array.isArray(e))for(;r<e.length&&!1!==t(e[r],r);++r);else if("object"===(void 0===e?"undefined":x(e))&&null!==e)for(n=Object.keys(e);r<n.length&&!1!==t(e[n[r]],n[r]);++r);}(e,(function(e,t){j(n.data,t,e,r)})):this.options.ignore_dots?this.data[e]=t:j(this.data,e,t,r),this.options.autosave&&this.save(),this}},{key:"get",value:function(e){return e?this.options.ignore_dots?this.data[e]:T(this.data,e):this.toObject()}},{key:"unset",value:function(e){return this.set(e,void 0)}},{key:"append",value:function(e,t){var r=this.get(e);if(r=void 0===r?[]:r,!Array.isArray(r))throw new Error("The data is not an array!");return r.push(t),this.set(e,r),this}},{key:"pop",value:function(e){var t=this.get(e);if(!Array.isArray(t))throw new Error("The data is not an array!");return t.pop(),this.set(e,t),this}},{key:"read",value:function(e){if(!e)try{return q(this.path)}catch(e){return{}}q(this.path,(function(t,r){e(null,r=t?{}:r)}))}},{key:"write",value:function(e,t){return t?R.writeFile(this.path,e,t):R.writeFileSync(this.path,e),this}},{key:"empty",value:function(e){return this.write("{}",e)}},{key:"save",value:function(e){var t=JSON.stringify(this.data,this.options.stringify_fn,this.options.stringify_width,this.options.stringify_eol);return this.write(this.options.stringify_eol?t+A.EOL:t,e),this}},{key:"toObject",value:function(){return this.data}}]),e}();f.default.config();const D=new K(`${__dirname}/../../package.json`,{stringify_eol:!0});const{PORT:U="3000",ZMQ_URL:W="tcp://litecoind:28332",CHAIN:C="LTC",NETWORK:J="regtest",BCN_ENV:L="dev",BCN_URL:N="http://127.0.0.1:3000",DEBUG_MODE:M="1",POSTGRES_USER:F="bcn",POSTGRES_PASSWORD:B="bcn",POSTGRES_DB:G="bcn",POSTGRES_HOST:I="127.0.0.1",POSTGRES_PORT:$="5432",RPC_PROTOCOL:H="http",RPC_USER:V="bcn-admin",RPC_PASSWORD:Z="kH4nU5Okm6-uyC0_mA5ztVNacJqZbYd_KGLl6mx722A=",RPC_HOST:z="litecoind",RPC_PORT:Q="19332",TESTING:Y=!1,DEFAULT_WALLET:X="defaultwallet"}=process.env;process.env.ALLOWED_RPC_METHODS&&process.env.ALLOWED_RPC_METHODS.split(",").map((e=>new RegExp(e))),D.get("version"),parseInt(U,10);var ee=N;parseInt(M,10),parseInt($,10),parseInt(Q,10),JSON.parse(Y.toString());const te=(e,t)=>{if(e.length!==t.length)return!1;for(let r=0;r<e.length;r++){const n=e[r];const o=Object.keys(n);let i=!1;for(let e=0;e<t.length;e++){const r=t[e];const a=Object.keys(r);if(o.length===a.length&&o.every((e=>a.includes(e)))&&o.every((e=>n[e]===r[e]))){i=!0;break}}if(!i)return!1}return!0};describe("utils",(()=>{describe("auth utils",(()=>{const t=new e.ec("secp256k1").genKeyPair();const n=t.getPublic().encodeCompressed("hex");const o=d.default.sha256().update("message").digest("hex");const i=t.sign(o).toDER("hex");const a=Date.now();it("Should create Authentication header and parse it",(()=>{const e=((e,t=Date.now(),r)=>{if(!r){const n=d.default.sha256().update(ee+t).digest("hex");r=e.sign(n).toDER("hex")}const n=[r,e.getPublic().encodeCompressed("hex"),t];return`Bearer ${Buffer.from(n.join(":")).toString("base64")}`})(t,a,i);const s=(e=>{const t=e.split(" ");if(2!==t.length||"Bearer"!==t[0])throw new Error("Authentication header is invalid.");const r=Buffer.from(t[1],"base64").toString().split(":");if(3!==r.length)throw new Error;return{signature:r[0],publicKey:r[1],timestamp:parseInt(r[2],10)}})(e);r.expect(s.signature).eq(i),r.expect(s.publicKey).eq(n),r.expect(s.timestamp).eq(a),r.expect(t.verify(o,i)).to.be.true}))})),describe("arraysEqual utils",(()=>{it("Should work with identical arrays",(()=>{r.expect(te([{a:20,b:"hello",c:"world"}],[{a:20,b:"hello",c:"world"}])).eq(!0)})),it("Should work with object with different key order",(()=>{r.expect(te([{a:20,c:"world",b:"hello"}],[{a:20,b:"hello",c:"world"}])).eq(!0)})),it("Should work with object with different key order, different values",(()=>{r.expect(te([{a:20,b:"hello",c:"world"}],[{a:8,c:"world",b:"hello"}])).eq(!1)})),it("Should work with different arrays in length",(()=>{r.expect(te([{a:20,c:"world",b:"hello"}],[{a:20,c:"world",b:"hello"},{a:20,c:"world",b:"hello"}])).eq(!1)})),it("Should work with object arrays containing different object types",(()=>{r.expect(te([{a:7,c:"bye",b:"bye"},{a:20,c:"world",b:"hello"}],[{a:20,c:"world",b:"hello"},{a:7,c:"bye",b:"bye"}])).eq(!0)})),it("Should work with same utxos set, different object ordering ",(()=>{const e=[{address:"mx4WdU51jPh6KKvT5Dq27wMJJUW81vbF7y",amount:49.99976817,satoshis:4999976817,scriptPubKey:"76a914b579e625fdfdca267d3b57ccc130f501fa1a27d188ac",txid:"5c84c2b6b95a97eab570da1820e5f099f2216d980aaf7d9823f4082252206e7f",vout:5},{address:"mx4WdU51jPh6KKvT5Dq27wMJJUW81vbF7y",amount:50,satoshis:5e9,scriptPubKey:"76a914b579e625fdfdca267d3b57ccc130f501fa1a27d188ac",txid:"ac676b8137bd66513d6dbcdd7ae8721d9c7d6fc4b75ce4e939ea7e20805ed0ac",vout:0},{address:"mx4WdU51jPh6KKvT5Dq27wMJJUW81vbF7y",amount:25,satoshis:25e8,scriptPubKey:"76a914b579e625fdfdca267d3b57ccc130f501fa1a27d188ac",txid:"82dfd1af79519bad58f33608df7a01d3d2cced1b2f1864a7d91ca7b07289ad38",vout:0}];const t=[{address:"mx4WdU51jPh6KKvT5Dq27wMJJUW81vbF7y",amount:25,satoshis:25e8,scriptPubKey:"76a914b579e625fdfdca267d3b57ccc130f501fa1a27d188ac",txid:"82dfd1af79519bad58f33608df7a01d3d2cced1b2f1864a7d91ca7b07289ad38",vout:0},{address:"mx4WdU51jPh6KKvT5Dq27wMJJUW81vbF7y",amount:49.99976817,satoshis:4999976817,scriptPubKey:"76a914b579e625fdfdca267d3b57ccc130f501fa1a27d188ac",txid:"5c84c2b6b95a97eab570da1820e5f099f2216d980aaf7d9823f4082252206e7f",vout:5},{address:"mx4WdU51jPh6KKvT5Dq27wMJJUW81vbF7y",amount:50,satoshis:5e9,scriptPubKey:"76a914b579e625fdfdca267d3b57ccc130f501fa1a27d188ac",txid:"ac676b8137bd66513d6dbcdd7ae8721d9c7d6fc4b75ce4e939ea7e20805ed0ac",vout:0}];r.expect(te(e,t)).eq(!0),r.expect(te(t,e)).eq(!0)}))}))}));
