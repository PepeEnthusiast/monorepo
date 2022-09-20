import t from"@bitcoin-computer/bitcore-mnemonic-ltc";import{expect as e}from"chai";import n from"axios";import r from"crypto";import o from"crypto-js";import*as s from"eciesjs";import"exponential-backoff";import"@endo/static-module-record";import"ses";import i from"http";import a from"https";import c from"url";import u from"util";function d(t,e){var n={};for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&e.indexOf(r)<0&&(n[r]=t[r]);if(null!=t&&"function"==typeof Object.getOwnPropertySymbols){var o=0;for(r=Object.getOwnPropertySymbols(t);o<r.length;o++)e.indexOf(r[o])<0&&Object.prototype.propertyIsEnumerable.call(t,r[o])&&(n[r[o]]=t[r[o]])}return n}function f(t,e,n,r){return new(n||(n=Promise))((function(o,s){function i(t){try{c(r.next(t))}catch(t){s(t)}}function a(t){try{c(r.throw(t))}catch(t){s(t)}}function c(t){var e;t.done?o(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(i,a)}c((r=r.apply(t,e||[])).next())}))}const{CHAIN:l,NETWORK:h,BCN_URL:p,RPC_USER:g,RPC_PASSWORD:b,TEST_MNEMONICS:m}=process.env;const v=l||"LTC";const w=h||"testnet";const y=p||"https://node.bitcoincomputer.io";const x=m||"travel upgrade inside soda birth essence junk merit never twenty system opinion;toddler hockey salute wheel harvest video narrow riot guitar lake sea call;cannon hour begin test replace fury motion squirrel envelope announce neck culture";const S=parseInt(process.env.BC_DUST_LIMIT||"",10)||("LTC"===v?15460:1546);const{crypto:T}=t.bitcore;const C=(t,e)=>{const n=Date.now();const r=T.Hash.sha256(Buffer.from(e+n));const o=[T.ECDSA.sign(r,t,"big").toString("hex"),t.publicKey.toString(),n];return`Bearer ${Buffer.from(o.join(":")).toString("base64")}`};class O{constructor(e=y,n=new t.bitcore.PrivateKey,r={}){this.baseUrl=e,this.headers=r,this.privateKey=n}get(t){return f(this,void 0,void 0,(function*(){const e=this.privateKey?{Authentication:C(this.privateKey,this.baseUrl)}:{};return(yield n.get(`${this.baseUrl}${t}`,{headers:Object.assign(Object.assign({},this.headers),e)})).data}))}post(t,e){return f(this,void 0,void 0,(function*(){const r=this.privateKey?{Authentication:C(this.privateKey,this.baseUrl)}:{};return(yield n.post(`${this.baseUrl}${t}`,e,{headers:Object.assign(Object.assign({},this.headers),r)})).data}))}delete(t){return f(this,void 0,void 0,(function*(){const e=this.privateKey?{Authentication:C(this.privateKey,this.baseUrl)}:{};return(yield n.delete(`${this.baseUrl}${t}`,{headers:Object.assign(Object.assign({},this.headers),e)})).data}))}}parseInt(process.env.BC_DEFAULT_FEE||"",10),parseInt(process.env.BC_SCRIPT_CHUNK_SIZE||"",10),parseInt(process.env.MWEB_HEIGHT||"",10);const{PublicKey:B,crypto:_}=t.bitcore;const{Point:P}=_;function k(t){return Buffer.from(t,"hex").toString().replace(/\0/g,"")}function I(t,e){return t.slice(e)+t.slice(0,e)}function A(t,e,n){if(t.length*Math.log2(e)>53)throw new Error(`Input too large ${t.length} ${Math.log2(e)}`);if(![2,10,16].includes(e)||![2,10,16].includes(n))throw new Error("ToBase or FromBase invalid in covertNumber.");if(2===e&&t.length%8!=0)throw new Error("Binary strings must be byte aligned.");if(16===e&&t.length%2!=0)throw new Error("Hex strings must be of even length.");const r=parseInt(t,e).toString(n);return 2===n?r.padStart(8*Math.ceil(r.length/8),"0"):16===n?r.padStart(2*Math.ceil(r.length/2),"0"):r}function R(t,e){const n=new RegExp(`.{1,${e}}`,"g");return t.match(n)||[]}function $(t){return R(t,2).map((t=>A(t,16,2))).join("")}function K(t){return R(t,8).map((t=>A(t,2,16))).join("")}function E(t){return t.toString(16).padStart(3,"0")}function j(t){return parseInt(t,16)}function D(t){if(62!==t.length)throw new Error("Input to hexToPublicKey must be of length 62");let e=!1;let n=0;let r;for(;!e;){if(n>=256)throw new Error("Something went wrong storing data");const o=n.toString(16).padStart(2,"0")+K(I($(t).padStart(64,"0"),n));try{r=P.fromX(!1,o),e=!0}catch(t){n+=1}}if(!r)throw new Error("Something went wrong storing data");return new B(r)}function U(t){const e=t.point.getX().toString("hex").padStart(64,"0");const n=A(e.slice(0,2),16,10);return K((o=parseInt(n,10),(r=$(e.slice(2))).slice(-o)+r.slice(0,-o)));var r,o}function H(t,e){const n={"any-testnet":"uTKUDCkpo12vstJBsMWmrTPz9wFE6DuzGH","BTC-mainnet":"igpnnoLziUyxtQuWYCP13gHYVhUru6iLaY","LTC-mainnet":"t77o829ngHnuUorwDkf129fL6ERLFNqKG8","DOGE-mainnet":"XfNRUdvrv6uCDbCF5xJ18UYwVkkefkXvEd","BCH-mainnet":"CSAkkS8Mro9mYRqhksS1FyYrsnSE5MVQ5m"};return I("testnet"===e||"regtest"===e?n["any-testnet"]:n[`${t}-${e}`],19)}function M(t=v,e=w){if("testnet"===e||"regtest"===e)return 1;if("BTC"===t)return 0;if("LTC"===t)return 2;if("DOGE"===t)return 3;if("BCH"===t)return 145;if("BSV"===t)return 236;throw new Error(`Unsupported chain ${t}`)}function N({purpose:t=44,coinType:e=2,account:n=0}={}){return`m/${t.toString()}'/${e.toString()}'/${n.toString()}'`}function F({chain:t=v,network:e=w}={}){return N({coinType:M(t,e)})}function q(){return Math.round(Math.random()*Math.pow(2,31))}function L(e,n){const r=function(e,n){return((t,e,n={})=>{const{path:r="m/44'/0'/0'/0",passphrase:o=""}=n;let s=t.toHDPrivateKey(o,e);return r&&(s=s.deriveChild(r)),s.privateKey})(new t("replace this seed"),n,{path:F({chain:e,network:n}),passphrase:""})}(e,n);return B.fromPrivateKey(r)}function W({mnemonic:e=new t,path:n=F(),passphrase:r="",network:o=w}){return e.toHDPrivateKey(r,o).deriveChild(n)}function J(t){if(!/^[0-9A-Fa-f]{64}$/.test(t))throw new Error(`Invalid txId: ${t}`)}function z(t){if(!/^[0-9A-Fa-f]{64}\/\d+$/.test(t))throw new Error(`Invalid outId: ${t}`)}function G(t){z(t);const[e,n]=t.split("/");return{txId:e,outputIndex:parseInt(n,10)}}const{Transaction:Y}=t.bitcore;const{UnspentOutput:V}=Y;class X{constructor({chain:e,network:n,mnemonic:r,path:o,passphrase:s,url:i}={}){if(this.chain=e?e.toUpperCase():v,this.network=n?n.toLowerCase():w,this.mnemonic=new t(r?r.toString():void 0),this.path=o||F({chain:this.chain,network:this.network}),this.passphrase=s||"",this.bcn=new O(i,this.privateKey),!["LTC","BTC"].includes(this.chain))throw new Error("We currently only support LTC, support for other currencies will be added soon.");if(!["mainnet","testnet","regtest"].includes(this.network))throw new Error("Please set 'network' to 'regtest', 'testnet', or 'mainnet'")}get privateKey(){return W(this).privateKey}getBalance(t){return f(this,void 0,void 0,(function*(){const{chain:e,network:n}=this;return yield this.bcn.get(`/v1/${e}/${n}/address/${t}/balance`)}))}getTransactions(t){return f(this,void 0,void 0,(function*(){return(yield this.getRawTxs(t)).map((t=>new Y(t)))}))}getRawTxs(t){return f(this,void 0,void 0,(function*(){t.map(J);const{chain:e,network:n}=this;return this.bcn.post(`/v1/${e}/${n}/tx/bulk/`,{txIds:t})}))}sendTransaction(t){return f(this,void 0,void 0,(function*(){return this.bcn.post(`/v1/${this.chain}/${this.network}/tx/send`,{rawTx:t})}))}getUtxosByAddress(t){return f(this,void 0,void 0,(function*(){const{chain:e,network:n}=this;return(yield this.bcn.get(`/v1/${e}/${n}/wallet/${t.toString()}/utxos`)).map((({rev:t,scriptPubKey:e,satoshis:n})=>{const[r,o]=t.split("/");return new V({txId:r,outputIndex:parseInt(o,10),satoshis:n,script:e})}))}))}query({publicKey:t,classHash:e}){return f(this,void 0,void 0,(function*(){if(void 0===t&&void 0===e)throw new Error("Query parameters cannot be empty.");let n="";t&&(n+=`?publicKey=${t}`),e&&(n+=0===n.length?"?":"&",n+=`classHash=${e}`);const{chain:r,network:o}=this;return this.bcn.get(`/v1/${r}/${o}/non-standard-utxos${n}`)}))}idsToRevs(t){return f(this,void 0,void 0,(function*(){t.map(z);const{chain:e,network:n}=this;return this.bcn.post(`/v1/${e}/${n}/revs`,{ids:t})}))}rpc(t,e){return f(this,void 0,void 0,(function*(){return this.bcn.post(`/v1/${this.chain}/${this.network}/rpc`,{method:t,params:e})}))}static getSecretOutput({_url:t,privateKey:e}){return f(this,void 0,void 0,(function*(){const n=t.split("/");const r=n[n.length-1];const o=n.slice(0,-2).join("/");const s=new O(o,e);return{host:o,data:yield s.get(`/v1/store/${r}`)}}))}static setSecretOutput({secretOutput:t,host:e,privateKey:n}){return f(this,void 0,void 0,(function*(){return new O(e,n).post("/v1/store/",t)}))}static deleteSecretOutput({_url:t,privateKey:e}){return f(this,void 0,void 0,(function*(){const n=t.split("/");const r=n[n.length-1];const o=n.slice(0,-2).join("/");const s=new O(o,e);yield s.delete(`/v1/store/${r}`)}))}get url(){return this.bcn.baseUrl}}const{PublicKey:Q,Script:Z}=t.bitcore;function tt(t,e,n,r){if(t.length>3)throw new Error("Too many owners");return function(t,e,n,r){const o=r?[...t,L(e,n).toBuffer()]:t;const s=new Z;return s.add("OP_1"),o.forEach((t=>{s.add(t)})),s.add(`OP_${o.length}`),s.add("OP_CHECKMULTISIG"),s}(t.map((t=>t.toBuffer())),e,n,r)}function et(t,e){return function(t,e){const n=t.chunks.filter((t=>t.buf));return(e?n.slice(0,-1):n).map((t=>t.buf))}(t,e).map((t=>Q.fromBuffer(t)))}function nt(t){return Buffer.from(o.SHA256(t).toString(),"hex").toString("hex").substr(0,4)}function rt(t){return`${nt(t)};${t}`}function ot(t){const e=t.substr(0,4);const n=t.substr(5);if(!function(t,e){return nt(t)===e}(n,e))throw new Error("Decryption failure");return n}function st(t){if(void 0!==t._readers){const{_readers:e,_url:n,_owners:i,_amount:a}=t,c=d(t,["_readers","_url","_owners","_amount"]);const u=function(t,e){const n=r.randomBytes(32).toString("hex");const i=function(t,e){if(!/^[0-9a-f]{64}$/.test(e))throw new Error("Invalid secret");const n=Buffer.from(e,"hex").toString("binary");const r=rt(t);return o.AES.encrypt(r,n).toString()}(t,n);const a=e.map((t=>function(t,e){if(!/^0[2-3][0-9a-f]{64}|04[0-9a-f]{128}$/.test(e))throw new Error("Invalid publicKey");const n=rt(t);return s.encrypt(e,Buffer.from(n,"utf8")).toString("base64")}(n,t)));return{__cypher:i,__secrets:a}}(JSON.stringify(c),e);return void 0!==n&&(u._url=n),void 0!==i&&(u._owners=i),void 0!==a&&(u._amount=a),u}return t}const{Transaction:at}=t.bitcore;const{Output:ct,UnspentOutput:ut}=at;class dt{constructor({restClient:t=new X}={}){this.tx=new at,this.tx.feePerKb(2e4),this.outData=[],this.restClient=t}get txId(){return this.tx.id}get chain(){return this.restClient.chain}get network(){return this.restClient.network}get inputs(){return this.tx.inputs.map((t=>`${t.prevTxId.toString("hex")}/${t.outputIndex}`))}get inRevs(){const{enc:t}=this;let[e]=t;return e=Number.isFinite(e)?e:0,this.tx.inputs.slice(0,e).map((({prevTxId:t,outputIndex:e})=>`${t.toString("hex")}/${e}`))}get outRevs(){const{enc:t}=this;let[,e]=t;return e=Number.isFinite(e)?e:0,Array.from(Array(e).keys()).map((t=>`${this.tx.id}/${t}`))}get opReturns(){try{const{outputs:t}=this.tx;return t.filter((({script:t})=>t.isDataOut())).map((({script:t})=>t.getData())).map((t=>t.toString())).join()}catch(t){return""}}get enc(){return R(this.opReturns.slice(0,9),3).map(j)}get dataPrefix(){return this.opReturns.slice(9)}isBcdbTx(){return this.tx.outputs.some((t=>t.script.toAddress(this.network).toString()===H(this.chain,this.network)))}isFullyFunded(){return this.tx._getInputAmount()-this.tx._getOutputAmount()>=this.tx.getFee()}getOwnerOutputs(){const{enc:t}=this;const[,e=0]=t;return this.tx.outputs.slice(0,e)}getDataOutputs(){const{enc:t}=this;const[,e,n]=t;return this.tx.outputs.slice(e,n)}getOutData(){return f(this,void 0,void 0,(function*(){try{const t=this.getDataOutputs().map((t=>t.script)).map((t=>et(t,!0))).flat().map(U).map(k).join("");const{dataPrefix:e}=this;const n=JSON.parse(e+t);const r=this.restClient.privateKey.toBuffer().toString("hex");const i=this.getOwnerOutputs();if(i.length!==n.length)throw new Error("Inconsistent state");const a=i.map(((t,e)=>Object.assign(Object.assign({},n[e]),{_owners:et(t.script,!1).map((t=>t.toString())),_amount:t.satoshis})));return Promise.all(a.map((t=>f(this,void 0,void 0,(function*(){try{const e=yield function(t){return e=>f(this,void 0,void 0,(function*(){if(function(t){return void 0!==t._url}(e)){const{_url:n}=e,r=d(e,["_url"]);const{host:o,data:s}=yield X.getSecretOutput({_url:n,privateKey:t});return Object.assign(Object.assign(Object.assign({},r),JSON.parse(s)),{_url:o})}return e}))}(this.restClient.privateKey)(t);return function(t,e){if(function(t){return void 0!==t.__cypher&&void 0!==t.__secrets}(t)){const{__cypher:n,__secrets:r}=t,i=d(t,["__cypher","__secrets"]);return Object.assign(Object.assign(Object.assign({},i),JSON.parse(function({__cypher:t,__secrets:e},n){let r="";if(n.forEach((n=>{e.forEach((e=>{try{const i=function(t,e){if(!/^[0-9a-f]{64}$/.test(e))throw new Error("Invalid privateKey");return ot(s.decrypt(e,Buffer.from(t,"base64")).toString("utf8"))}(e,n);r=function(t,e){if(!/^[0-9a-f]{64}$/.test(e))throw new Error("Invalid secret");const n=Buffer.from(e,"hex").toString("binary");return ot(o.AES.decrypt(t,n).toString(o.enc.Utf8))}(t,i)}catch(t){const e=["Decryption failure","Unsupported state or unable to authenticate data"];if(t instanceof Error&&!e.includes(t.message))throw t}}))})),r)return r;throw new Error("Decryption failure")}({__cypher:n,__secrets:r},e))),{_readers:[]})}return t}(e,[r])}catch(t){return null}})))))}catch(t){return[]}}))}getOwners(){return this.getOwnerOutputs().map((t=>et(t.script,!1).map((t=>t.toString()))))}getAmounts(){return this.getOwnerOutputs().map((t=>t.satoshis))}spendFromData(e){return f(this,void 0,void 0,(function*(){if(!e.length)return;const n=e.map(G);const r=n.map((t=>t.txId));const o=yield this.restClient.getTransactions(r);for(let e=0;e<n.length;e+=1){const{txId:r,outputIndex:s}=n[e];const{outputs:i}=o[e];const a=i[s];const c=Math.round(a.satoshis);const u=new t.bitcore.Script(a.script);const d=new ut({txId:r,outputIndex:s,satoshis:c,script:u});const f=et(u,!1).map((t=>t.toString()));this.tx.from([d],f,1,{noSorting:!0})}}))}createDataOuts(e){e.forEach((({_amount:e,_owners:n=[]})=>{if(Array.isArray(n)&&n.length>3)throw new Error("Too many owners.");const r=n.map((e=>t.bitcore.PublicKey.fromString(e)));const o=e||S;const s=tt(r,this.chain,this.network,!1);this.tx.addOutput(new ct({script:s,satoshis:o}))}));const n=e.map((t=>d(t,["_amount","_owners"])));const r=S;const o=JSON.stringify(n);const s=o.slice(0,71);const i=function(t,e,n,r){var o;return function(t,e){const n=[];for(let e=0;e<t.length;e+=2)n.push(t.slice(e,e+2));return n}(R((o=t,Buffer.from(o).toString("hex")),62).map((t=>t.padStart(62,"0"))).map(D)).map((t=>tt(t,e,n,!0)))}(o.slice(71),this.chain,this.network);const a=E(this.tx.inputs.length)+E(this.tx.outputs.length)+E(this.tx.outputs.length+i.length);i.forEach((t=>{this.tx.addOutput(new ct({script:t,satoshis:r}))})),this.tx.addData(a+s)}static getBcTx({hex:t="",restClient:e=new X}){const n=new this({restClient:e});return n.tx.fromString(t),n.outData=[],n}static fromTxHex({hex:t="",restClient:e=new X}){return f(this,void 0,void 0,(function*(){let n=[];let r=[];let o=[];const s=new this({restClient:e});s.tx.fromString(t);try{n=yield s.getOutData()}catch(t){}try{r=s.getOwners()}catch(t){}try{o=s.getAmounts()}catch(t){}return s.outData=n.map(((t,e)=>Object.assign(Object.assign({},t),{_owners:r[e],_amount:o[e]}))),s}))}static fromTxId({txId:t="",restClient:e=new X}){return f(this,void 0,void 0,(function*(){const[n]=yield e.getRawTxs([t]);return this.fromTxHex({hex:n,restClient:e})}))}}class ft{constructor(t={}){this.restClient=new X(t)}derive(t="0"){const e=`${this.path}${this.path.length>0?"/":""}${t}`;const{chain:n,network:r,url:o,mnemonic:s,passphrase:i}=this.restClient;return new ft({chain:n,network:r,url:o,mnemonic:s.toString(),path:e,passphrase:i})}getBalance(){return f(this,void 0,void 0,(function*(){return this.restClient.getBalance(this.address)}))}getUtxosByAmount(t){return f(this,void 0,void 0,(function*(){const e=yield this.restClient.getUtxosByAddress(this.address);let n=0;const r=[];!function(t){const e=t;for(let t=e.length-1;t>0;t-=1){const n=Math.floor(Math.random()*(t+1));[e[t],e[n]]=[e[n],e[t]]}}(e);for(const o of e)if(n+=o.satoshis,r.push(o),n>=t)return r;const{network:o,chain:s}=this.restClient;const i=this.address.toString();throw new Error(`Insufficient balance in address ${i} on ${o} ${s}. Found ${n}, required ${t}.`)}))}fundAndSendTx(e){return f(this,void 0,void 0,(function*(){e.tx.feePerKb(4e4);const n=e.tx.outputs.length;const{chain:r,network:o}=this.restClient;e.tx.to(H(r,o),0);const s=yield this.restClient.getUtxosByAddress(this.address);if(e.tx.change(this.address),0===s.length)throw new Error(`Insufficient balance in address ${this.address}.`);let i=0;let a=0;let c=0;do{const[n]=s.splice(0,1);e.tx.from([new t.bitcore.Transaction.UnspentOutput(n)]),e.tx.sign(this.privateKey,1),a=e.tx.toString().length,e.tx.fee(2e4*a*2),e.tx._updateChangeOutput(),c=e.tx._getInputAmount()-e.tx._getOutputAmount(),i=c/a*1e3}while(0!==s.length&&i<4e4);if(i<4e4&&0===s.length)throw new Error(`Insufficient balance in address ${this.address} to fund transaction. Found ${e.tx._getInputAmount()}\n        but required ${e.tx._getOutputAmount()+c}.`);if(a=e.tx.toString().length,c=Math.max(Math.ceil(a/1e3*2e4),S),e.tx.fee(c),e.tx.outputs[n].satoshis=c,e.tx._outputAmount=void 0,e.tx.feePerKb(2e4),e.tx._outputAmount=void 0,e.tx._updateChangeOutput(),!1===e.isFullyFunded()||!1===e.tx.verify())throw new Error(`Something went wrong. Address ${this.address}. Transaction: ${JSON.stringify(e.tx,null,2)}`);return e.tx.sign(this.privateKey,1),this.restClient.sendTransaction(e.tx.toString())}))}send(t,e){return f(this,void 0,void 0,(function*(){const{restClient:n}=this;const r=new dt({restClient:n});return r.tx.to(e,t),this.fundAndSendTx(r)}))}get hdPrivateKey(){return W(this.restClient)}get privateKey(){return this.hdPrivateKey.privateKey}get publicKey(){return this.hdPrivateKey.publicKey}get passphrase(){return this.restClient.passphrase}get path(){return this.restClient.path}get chain(){return this.restClient.chain}get network(){return this.restClient.network}get url(){return this.restClient.url}get mnemonic(){return this.restClient.mnemonic}get address(){return this.publicKey.toAddress(this.restClient.network)}}class lt{constructor(t={}){this.wallet=new ft(t)}fromTxHex(t){return f(this,void 0,void 0,(function*(){const{restClient:e}=this.wallet;return dt.fromTxHex({hex:t,restClient:e})}))}fromTxId(t){return f(this,void 0,void 0,(function*(){const[e]=yield this.wallet.restClient.getRawTxs([t]);return this.fromTxHex(e)}))}get(t){return f(this,void 0,void 0,(function*(){const e=t.map(G);return Promise.all(e.map((({txId:t,outputIndex:e})=>f(this,void 0,void 0,(function*(){const{outData:n}=yield this.fromTxId(t);if(e>n.length)throw new Error("Index out of bounds");return n[e]})))))}))}put(t){return this.update([],t)}getBcTx(t){const{restClient:e}=this.wallet;return dt.getBcTx({hex:t,restClient:e})}createTx(t,e){return f(this,void 0,void 0,(function*(){const{wallet:n}=this;const{restClient:r}=n;const o=new dt({restClient:r});const{privateKey:s,publicKey:i}=n;const a=e.map((t=>{var{_owners:e}=t,n=d(t,["_owners"]);return Object.assign({_owners:e||[i.toString()]},n)})).map(st);const c=yield Promise.all(a.map(function(t){return e=>f(this,void 0,void 0,(function*(){if(void 0!==e._url){const{_url:n,_owners:r,_amount:o}=e,s=d(e,["_url","_owners","_amount"]);const i=yield X.setSecretOutput({host:n,secretOutput:{data:JSON.stringify(s)},privateKey:t});return void 0!==r&&(i._owners=r),void 0!==o&&(i._amount=o),i}return e}))}(s)));return yield o.spendFromData(t),yield o.createDataOuts(c),o}))}update(t,e){return f(this,void 0,void 0,(function*(){const n=yield this.createTx(t,e);return yield this.wallet.fundAndSendTx(n),n.outRevs}))}}var ht=i;var pt=a;var gt=c;function bt(t){"string"==typeof t&&(t=function(t){var e=gt.parse(t);var n=e.hostname;var r=parseInt(e.port,10);var o=e.protocol;o=o.substring(0,o.length-1);var s=e.auth.split(":");return{host:n,port:r,protocol:o,user:s[0]?decodeURIComponent(s[0]):null,pass:s[1]?decodeURIComponent(s[1]):null}}(t)),t=t||{},this.host=t.host||"127.0.0.1",this.port=t.port||8332,this.user=t.user||"user",this.pass=t.pass||"pass",this.protocol="http"===t.protocol?ht:pt,this.batchedCalls=null,this.disableAgent=t.disableAgent||!1;var e=void 0!==t.rejectUnauthorized;this.rejectUnauthorized=!e||t.rejectUnauthorized,bt.config.log?this.log=bt.config.log:this.log=bt.loggers[bt.config.logger||"normal"]}var mt=console.log.bind(console);var vt=function(){};function wt(t,e){var n=this;t=JSON.stringify(t);var r=this.user+":"+this.pass;var o=Buffer.from&&Buffer.from!==Uint8Array.from?Buffer.from(r):new Buffer(r);this.auth=o.toString("base64");var s={host:n.host,path:"/",method:"POST",port:n.port,rejectUnauthorized:n.rejectUnauthorized,agent:!n.disableAgent&&void 0};if(n.httpOptions)for(var i in n.httpOptions)s[i]=n.httpOptions[i];var a=!1;var c="Bitcoin JSON-RPC: ";var u=this.protocol.request(s,(function(t){var r="";t.on("data",(function(t){r+=t})),t.on("end",(function(){if(!a)if(a=!0,401!==t.statusCode)if(403!==t.statusCode){if(500===t.statusCode&&"Work queue depth exceeded"===r.toString("utf8")){var o=new Error("Bitcoin JSON-RPC: "+r.toString("utf8"));return o.code=429,void e(o)}var s;try{s=JSON.parse(r)}catch(o){n.log.err(o.stack),n.log.err(r),n.log.err("HTTP Status code:"+t.statusCode);var i=new Error(c+"Error Parsing JSON: "+o.message);return void e(i)}e(s.error,s)}else e(new Error(c+"Connection Rejected: 403 Forbidden"));else e(new Error(c+"Connection Rejected: 401 Unnauthorized"))}))}));u.on("error",(function(t){var n=new Error(c+"Request Error: "+t.message);a||(a=!0,e(n))})),u.setHeader("Content-Length",t.length),u.setHeader("Content-Type","application/json"),u.setHeader("Authorization","Basic "+n.auth),u.write(t),u.end()}bt.loggers={none:{info:vt,warn:vt,err:vt,debug:vt},normal:{info:mt,warn:mt,err:mt,debug:vt},debug:{info:mt,warn:mt,err:mt,debug:mt}},bt.config={logger:"normal"},bt.prototype.batch=function(t,e){this.batchedCalls=[],t(),wt.call(this,this.batchedCalls,e),this.batchedCalls=null},bt.callspec={abandonTransaction:"str",abortRescan:"",addMultiSigAddress:"",addNode:"",analyzePSBT:"str",backupWallet:"",bumpFee:"str",clearBanned:"",combinePSBT:"obj",combineRawTransaction:"obj",convertToPSBT:"str",createMultiSig:"",createPSBT:"obj",createRawTransaction:"obj obj",createWallet:"str",decodePSBT:"str",decodeScript:"str",decodeRawTransaction:"",deriveAddresses:"str",disconnectNode:"",dumpPrivKey:"",dumpWallet:"str",encryptWallet:"",enumerateSigners:"",estimateFee:"",estimateSmartFee:"int str",estimatePriority:"int",generate:"int",generateBlock:"str obj",generateToAddress:"int str",generateToDescriptor:"int str",getAccount:"",getAccountAddress:"str",getAddedNodeInfo:"",getAddressMempool:"obj",getAddressUtxos:"obj",getAddressBalance:"obj",getAddressDeltas:"obj",getAddressesByLabel:"str",getAddressInfo:"str",getAddressTxids:"obj",getAddressesByAccount:"",getBalance:"str int",getBalances:"",getBestBlockHash:"",getBlockDeltas:"str",getBlock:"str int",getBlockchainInfo:"",getBlockCount:"",getBlockFilter:"str",getBlockHashes:"int int obj",getBlockHash:"int",getBlockHeader:"str",getBlockNumber:"",getBlockStats:"str",getBlockTemplate:"",getConnectionCount:"",getChainTips:"",getChainTxStats:"",getDescriptorInfo:"str",getDifficulty:"",getGenerate:"",getHashesPerSec:"",getIndexInfo:"",getInfo:"",getMemoryInfo:"",getMemoryPool:"",getMemPoolAncestors:"str",getMemPoolDescendants:"str",getMemPoolEntry:"str",getMemPoolInfo:"",getMiningInfo:"",getNetTotals:"",getNetworkHashPS:"",getNetworkInfo:"",getNewAddress:"str str",getNodeAddresses:"",getPeerInfo:"",getRawChangeAddress:"",getRawMemPool:"bool",getRawTransaction:"str int",getReceivedByAccount:"str int",getReceivedByAddress:"str int",getReceivedByLabel:"str",getRpcInfo:"",getSpentInfo:"obj",getTransaction:"",getTxOut:"str int bool",getTxOutProof:"",getTxOutSetInfo:"",getUnconfirmedBalance:"",getWalletInfo:"",getWork:"",getZmqNotifications:"",finalizePSBT:"str",fundRawTransaction:"str",help:"",importAddress:"str str bool",importDescriptors:"str",importMulti:"obj obj",importPrivKey:"str str bool",importPrunedFunds:"str, str",importPubKey:"str",importWallet:"str",invalidateBlock:"str",joinPSBTs:"obj",keyPoolRefill:"",listAccounts:"int",listAddressGroupings:"",listBanned:"",listDescriptors:"",listLabels:"",listLockUnspent:"bool",listReceivedByAccount:"int bool",listReceivedByAddress:"int bool",listReceivedByLabel:"",listSinceBlock:"str int",listTransactions:"str int int",listUnspent:"int int",listWalletDir:"",listWallets:"",loadWallet:"str",lockUnspent:"",logging:"",move:"str str float int str",ping:"",preciousBlock:"str",prioritiseTransaction:"str float int",pruneBlockChain:"int",psbtBumpFee:"str",removePrunedFunds:"str",reScanBlockChain:"",saveMemPool:"",send:"obj",setHDSeed:"",setLabel:"str str",setWalletFlag:"str",scanTxOutSet:"str",sendFrom:"str str float int str str",sendMany:"str obj int str",sendRawTransaction:"str",sendToAddress:"str float str str",setAccount:"",setBan:"str str",setNetworkActive:"bool",setGenerate:"bool int",setTxFee:"float",signMessage:"",signMessageWithPrivKey:"str str",signRawTransaction:"",signRawTransactionWithKey:"str obj",signRawTransactionWithWallet:"str",stop:"",submitBlock:"str",submitHeader:"str",testMemPoolAccept:"obj",unloadWallet:"",upgradeWallet:"",uptime:"",utxoUpdatePSBT:"str",validateAddress:"",verifyChain:"",verifyMessage:"",verifyTxOutProof:"str",walletCreateFundedPSBT:"",walletDisplayAddress:"str",walletLock:"",walletPassPhrase:"string int",walletPassphraseChange:"",walletProcessPSBT:"str"};var yt=function(t,e,n){return Array.prototype.slice.call(t,e,n)};function xt(){return parseInt(1e5*Math.random())}!function(t,e,n){function r(t,e){return function(){var r=arguments.length-1;this.batchedCalls&&(r=arguments.length);for(var o=0;o<r;o++)e[o]&&(arguments[o]=e[o](arguments[o]));this.batchedCalls?this.batchedCalls.push({jsonrpc:"2.0",method:t,params:yt(arguments),id:xt()}):n.call(this,{method:t,params:yt(arguments,0,arguments.length-1),id:xt()},arguments[arguments.length-1])}}var o={str:function(t){return t.toString()},int:function(t){return parseFloat(t)},float:function(t){return parseFloat(t)},bool:function(t){return!0===t||"1"==t||"true"==t||"true"==t.toString().toLowerCase()},obj:function(t){return"string"==typeof t?JSON.parse(t):t}};for(var s in e){var i=[];if(e[s].length){i=e[s].split(" ");for(var a=0;a<i.length;a++)o[i[a]]?i[a]=o[i[a]]:i[a]=o.str}var c=s.toLowerCase();t.prototype[s]=r(c,i),t.prototype[c]=t.prototype[s]}}(bt,bt.callspec,wt);var St=bt;const Tt=new St({protocol:process.env.RPC_PROTOCOL,user:process.env.RPC_USER,pass:process.env.RPC_PASSWORD,host:process.env.RPC_HOST,port:process.env.RPC_PORT});u.promisify(St.prototype.createwallet.bind(Tt)),u.promisify(St.prototype.getaddressinfo.bind(Tt)),u.promisify(St.prototype.getBlock.bind(Tt)),u.promisify(St.prototype.getBlockchainInfo.bind(Tt)),u.promisify(St.prototype.getBlockHash.bind(Tt)),u.promisify(St.prototype.getNewAddress.bind(Tt)),u.promisify(St.prototype.generateToAddress.bind(Tt)),u.promisify(St.prototype.getRawTransaction.bind(Tt)),u.promisify(St.prototype.importaddress.bind(Tt)),u.promisify(St.prototype.listunspent.bind(Tt)),u.promisify(St.prototype.sendRawTransaction.bind(Tt)),u.promisify(St.prototype.sendToAddress.bind(Tt));const{Opcode:Ct,Script:Ot,crypto:Bt,Transaction:_t,encoding:Pt}=t.bitcore;function kt(e=0){return function(e=0){return function(e=0){return new t(function(t=0){return x.split(";")[t]}(e))}().toHDPrivateKey("",w).deriveChild(function({chain:t=v,network:e=w,account:n=q()}={}){return N({account:n,coinType:M(t,e)})}({account:e}))}(e).privateKey}function It(t=0){return function(t=0){return kt(t).toPublicKey()}(t).toAddress()}function At(e=1e5,n=0){const r=Ot.buildPublicKeyHashOut(It(n));return{address:It(n),txId:"a477af6b2667c29670467e4e0728b685ee07b240235771862318e29ddbe58458",outputIndex:n,script:r,vout:0,amount:e/1e8,satoshis:e,scriptPubKey:"",inspect:()=>"",toObject:()=>new t.bitcore.Transaction.UnspentOutput({})}}const{PrivateKey:Rt,PublicKey:$t,Transaction:Kt}=t.bitcore;const Et=new Rt;describe("Db",(()=>{describe("to",(()=>{it("should add a p2sh output",(()=>{const t=new dt;t.tx.to(It(),S),e(t.chain).eq(v),e(t.network).eq(w),e(t.tx).to.not.be.undefined,e(t.inputs).to.deep.eq([]),e(t.outData).to.deep.eq([]),e(t.opReturns).to.deep.eq("")}))})),describe("fromTxHex",(()=>{const t=new lt;it("should return an empty array if opReturn is not set",(()=>f(void 0,void 0,void 0,(function*(){const n=new dt;n.tx.from([new Kt.UnspentOutput(At())]),n.tx.to(It(),S),n.tx.sign(kt(),1);const r=yield t.fromTxHex(n.tx.toString());e(r.opReturns).to.deep.eq("")})))),it("should work for a transaction with a data output",(()=>f(void 0,void 0,void 0,(function*(){const t={a:1,_owners:[$t.fromPrivateKey(Et).toString()],_amount:S};const n=new lt;const r=new dt;r.createDataOuts([t]),r.tx.from([new Kt.UnspentOutput(At())]),r.tx.sign(kt(),1);const o=r.tx.toString();const{inputs:s,inRevs:i,outRevs:a,opReturns:c,outData:u,txId:d,tx:f}=yield n.fromTxHex(o);e(f).to.not.be.undefined,e(f.inputs).to.not.be.undefined,e(f.outputs).to.not.be.undefined,e(f.outputs[0].satoshis).to.not.be.undefined,e(f.outputs[0].script).to.not.be.undefined,e(f.version).to.not.be.undefined,e(f.nLockTime).to.not.be.undefined,e(s).to.deep.eq(["a477af6b2667c29670467e4e0728b685ee07b240235771862318e29ddbe58458/0"]),e(i).to.deep.eq([]),e(a).to.deep.eq([`${r.tx.id}/0`]),e(c).to.deep.eq('000001001[{"a":1}]'),e(u).to.deep.eq([t]),e(d).eq(r.tx.id)})))),it("should work for a transaction with another invalid output script",(()=>f(void 0,void 0,void 0,(function*(){const{inputs:n,inRevs:r,outRevs:o,opReturns:s,outData:i,txId:a}=yield t.fromTxHex("0100000001cbf75e37f8f57f338dd435d564c7302a02d9c6d03e26c8f0f24fa46052c0c0d1010000008b48304502210095cf913f96c52242b3a88dc59a9aed2a568dc80446541348c89c5430727d548402206adbe00b00db7d71458b990ab69090a038244a6b94faca98652656fd0b9be4e4014104dac5c4da1fd483b8655ab6a5d8e5dd2226ef20d1023d7ff38df29bfa8fcfdf73fb99a07efa0c66112c1fa438a8ed8571364bc04f21eaadf54c4918d43aba8ed3ffffffff02804f1200000000001976a914d40f073684cfac11be0366dc6a56a8d3cc87ece488ac1027000000000000044e6f6e6500000000");e(n).to.deep.eq(["d1c0c05260a44ff2f0c8263ed0c6d9022a30c764d535d48d337ff5f8375ef7cb/1"]),e(r).to.deep.eq([]),e(o).to.deep.eq([]),e(i).to.deep.eq([]),e(s).to.deep.eq(""),e(a).to.deep.eq("ad0a426817666f56d5b4fba97177f455bbfba3b80faca32a58ae9f947896ec68")})))),it("should work for a coinbase transactions",(()=>f(void 0,void 0,void 0,(function*(){const n=yield Promise.all(["01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff0b03c58c01062f503253482fffffffff0386600f27010000001976a914dde4906f870df11cf316b15adb628a3c3cc9883988ac8ab8f60200000000434104ffd03de44a6e11b9917f3a29f9443283d9871c9d743ef30d5eddcd37094b64d1b3d8090496b53256786bf5c82932ec23c3b74d9f05a6f95a8b5529352656664bac00000000000000002a6a28e73cd21eb4ac1eb1ba3767f4bf12be98935656451df3d6dee34c125662bcd599000000000000010000000000","020000000001010000000000000000000000000000000000000000000000000000000000000000ffffffff03530101ffffffff0200f2052a010000001976a9141eb941d36faa46404c7fbf6e22364e39cb66641f88ac0000000000000000266a24aa21a9ede2f61c3f71d1defd3fa999dfa36953755c690689799962b48bebd836974e8cf90120000000000000000000000000000000000000000000000000000000000000000000000000","020000000001010000000000000000000000000000000000000000000000000000000000000000ffffffff04016b0101ffffffff0200f2052a010000001976a9147c012a0d8fefc443441b169d9a82edc3221e647a88ac0000000000000000266a24aa21a9ede2f61c3f71d1defd3fa999dfa36953755c690689799962b48bebd836974e8cf90120000000000000000000000000000000000000000000000000000000000000000000000000"].map((e=>t.fromTxHex(e))));for(let t=0;t<n.length;t+=1){const{inputs:r,inRevs:o,outRevs:s,opReturns:i,outData:a,txId:c}=n[t];e(r).to.be.an("array").that.has.length(1),e(o).to.deep.eq([]),e(s).to.deep.eq([]),e(a).to.deep.eq([]),e(i).to.be.string,e(c).to.be.string}}))))}))}));
