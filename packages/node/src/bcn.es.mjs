import t from"body-parser";import e from"cors";import s from"express";import r from"http";import*as n from"zeromq";import o from"express-rate-limit";import a from"dotenv";import i from"is-primitive";import c from"is-plain-object";import l from"fs";import d from"os";import u,{dirname as p}from"path";import{fileURLToPath as y}from"url";import{createLogger as h,format as f,transports as m}from"winston";import g from"@bitcoin-computer/bitcore-lib-ltc";import w from"pg-promise";import b from"pg-monitor";import{backOff as v}from"exponential-backoff";import{Computer as $}from"@bitcoin-computer/lib";import S from"bitcoind-rpc";import E from"util";import T from"elliptic";import O from"hash.js";const{deleteProperty:R}=Reflect;const x=i;const N=c;const I=t=>"object"==typeof t&&null!==t||"function"==typeof t;const j=t=>{if(!x(t))throw new TypeError("Object keys must be strings or symbols");if((t=>"__proto__"===t||"constructor"===t||"prototype"===t)(t))throw new Error(`Cannot set unsafe key: "${t}"`)};const A=(t,e)=>e&&"function"==typeof e.split?e.split(t):"symbol"==typeof t?[t]:Array.isArray(t)?t:((t,e,s)=>{const r=(t=>Array.isArray(t)?t.flat().map(String).join(","):t)(e?((t,e)=>{if("string"!=typeof t||!e)return t;let s=t+";";return void 0!==e.arrays&&(s+=`arrays=${e.arrays};`),void 0!==e.separator&&(s+=`separator=${e.separator};`),void 0!==e.split&&(s+=`split=${e.split};`),void 0!==e.merge&&(s+=`merge=${e.merge};`),void 0!==e.preservePaths&&(s+=`preservePaths=${e.preservePaths};`),s})(t,e):t);j(r);const n=C.cache.get(r)||s();return C.cache.set(r,n),n})(t,e,(()=>((t,e={})=>{const s=e.separator||".";const r="/"!==s&&e.preservePaths;if("string"==typeof t&&!1!==r&&/\//.test(t))return[t];const n=[];let o="";const a=t=>{let e;""!==t.trim()&&Number.isInteger(e=Number(t))?n.push(e):n.push(t)};for(let e=0;e<t.length;e++){const r=t[e];"\\"!==r?r!==s?o+=r:(a(o),o=""):o+=t[++e]}return o&&a(o),n})(t,e)));const P=(t,e,s,r)=>{if(j(e),void 0===s)R(t,e);else if(r&&r.merge){const n="function"===r.merge?r.merge:Object.assign;n&&N(t[e])&&N(s)?t[e]=n(t[e],s):t[e]=s}else t[e]=s;return t};const C=(t,e,s,r)=>{if(!e||!I(t))return t;const n=A(e,r);let o=t;for(let t=0;t<n.length;t++){const e=n[t];const a=n[t+1];if(j(e),void 0===a){P(o,e,s,r);break}"number"!=typeof a||Array.isArray(o[e])?(I(o[e])||(o[e]={}),o=o[e]):o=o[e]=[]}return t};C.split=A,C.cache=new Map,C.clear=()=>{C.cache=new Map};var H=C;var _=l;var M="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};var k="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};var B=function(){function t(t,e){for(var s=0;s<e.length;s++){var r=e[s];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,s,r){return s&&t(e.prototype,s),r&&t(e,r),e}}();var F=function t(e,s){var r=s.indexOf(".");if(!~r){if(null==e)return;return e[s]}var n=s.substring(0,r),o=s.substring(r+1);if(null!=e)return e=e[n],o?t(e,o):e},L=H,U=function(t,e){if("function"!=typeof e)return JSON.parse(_.readFileSync(t));_.readFile(t,"utf-8",(function(t,s){try{s=JSON.parse(s)}catch(e){t=t||e}e(t,s)}))},W=l,D=d;var K=function(){function t(e,s){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.options=s=s||{},s.stringify_width=s.stringify_width||2,s.stringify_fn=s.stringify_fn||null,s.stringify_eol=s.stringify_eol||!1,s.ignore_dots=s.ignore_dots||!1,this.path=e,this.data=this.read()}return B(t,[{key:"set",value:function(t,e,s){var r=this;return"object"===(void 0===t?"undefined":k(t))?function(t,e){var s=0,r=[];if(Array.isArray(t))for(;s<t.length&&!1!==e(t[s],s);++s);else if("object"===(void 0===t?"undefined":M(t))&&null!==t)for(r=Object.keys(t);s<r.length&&!1!==e(t[r[s]],r[s]);++s);}(t,(function(t,e){L(r.data,e,t,s)})):this.options.ignore_dots?this.data[t]=e:L(this.data,t,e,s),this.options.autosave&&this.save(),this}},{key:"get",value:function(t){return t?this.options.ignore_dots?this.data[t]:F(this.data,t):this.toObject()}},{key:"unset",value:function(t){return this.set(t,void 0)}},{key:"append",value:function(t,e){var s=this.get(t);if(s=void 0===s?[]:s,!Array.isArray(s))throw new Error("The data is not an array!");return s.push(e),this.set(t,s),this}},{key:"pop",value:function(t){var e=this.get(t);if(!Array.isArray(e))throw new Error("The data is not an array!");return e.pop(),this.set(t,e),this}},{key:"read",value:function(t){if(!t)try{return U(this.path)}catch(t){return{}}U(this.path,(function(e,s){t(null,s=e?{}:s)}))}},{key:"write",value:function(t,e){return e?W.writeFile(this.path,t,e):W.writeFileSync(this.path,t),this}},{key:"empty",value:function(t){return this.write("{}",t)}},{key:"save",value:function(t){var e=JSON.stringify(this.data,this.options.stringify_fn,this.options.stringify_width,this.options.stringify_eol);return this.write(this.options.stringify_eol?e+D.EOL:e,t),this}},{key:"toObject",value:function(){return this.data}}]),t}();a.config();const G=function(t,e){return new K(t,{stringify_eol:!0})}(`${p(y(import.meta.url))}/../../package.json`);const{PORT:q,ZMQ_URL:z,CHAIN:J,NETWORK:Y,BCN_ENV:V,BCN_URL:Z,DEBUG_MODE:Q,POSTGRES_USER:X,POSTGRES_PASSWORD:tt,POSTGRES_DB:et,POSTGRES_HOST:st,POSTGRES_PORT:rt,RPC_PROTOCOL:nt,RPC_USER:ot,RPC_PASSWORD:at,RPC_HOST:it,RPC_PORT:ct,SERVER_VERSION:lt,DEFAULT_WALLET:dt,SYNC_HEIGHT:ut,SYNC_INTERVAL_CHECK:pt,POSTGRES_MAX_PARAM_NUM:yt,DB_CONNECTION_RETRY_TIME:ht,SIGNATURE_FRESHNESS_MINUTES:ft,ALLOWED_RPC_METHODS:mt,MWEB_HEIGHT:gt}=process.env;const wt=parseInt(q,10)||"3000";const bt=z||"tcp://node:28332";const vt=J||"LTC";const $t=Y||"regtest";const St=V||"dev";const Et=Z||"http://127.0.0.1:3000";const Tt=parseInt(Q,10)||1;const Ot=X||"bcn";const Rt=tt||"bcn";const xt=et||"bcn";const Nt=st||"127.0.0.1";const It=parseInt(rt,10)||"5432";const jt=nt||"http";const At=ot||"bcn-admin";const Pt=at||"kH4nU5Okm6-uyC0_mA5ztVNacJqZbYd_KGLl6mx722A=";const Ct=it||"node";const Ht=parseInt(ct,10)||19332;const _t=lt||G.get("version");const Mt=dt||"defaultwallet";const kt=parseInt(pt,10)||3e3;const Bt=parseInt(yt,10)||1e4;const Ft=parseInt(ht,10)||500;const Lt=parseInt(ft,10)||3;const Ut=mt?mt.split(",").map((t=>new RegExp(t))):[];const Wt=parseInt(gt||"",10)||432;const Dt=h({level:["error","warn","info","http","verbose","debug","silly"][Tt],format:f.json(),transports:[new m.Console({format:f.combine(f.colorize(),f.timestamp({format:"MM-DD-YYYY HH:mm:ss"}),f.printf((t=>`[2m${t.timestamp}[0m ${t.level} ${t.message}`)))})],exceptionHandlers:[new m.File({filename:"logs/exceptions.log"})],rejectionHandlers:[new m.File({filename:"logs/rejections.log"})]});const Kt={maxFiles:1,maxSize:1e5};Tt>=0&&Dt.add(new m.File({filename:"error.log",level:"error"})),Tt>=1&&Dt.add(new m.File({filename:"logs/warn.log",level:"warn",...Kt})),Tt>=2&&Dt.add(new m.File({filename:"logs/info.log",level:"info",...Kt})),Tt>=3&&Dt.add(new m.File({filename:"logs/http.log",level:"http",...Kt})),Tt>=4&&Dt.add(new m.File({filename:"logs/verbose.log",level:"verbose",...Kt})),Tt>=5&&Dt.add(new m.File({filename:"logs/debug.log",level:"debug",...Kt}));const Gt=()=>"dev"===St;const qt=()=>Tt>=6;const zt=(t,e)=>{if(t.length!==e.length)return!1;for(let s=0;s<t.length;s++){const r=t[s];const n=Object.keys(r);let o=!1;for(let t=0;t<e.length;t++){const s=e[t];const a=Object.keys(s);if(n.length===a.length&&n.every((t=>a.includes(t)))&&n.every((t=>r[t]===s[t]))){o=!0;break}}if(!o)return!1}return!0};const Jt=t=>new Promise((e=>{setTimeout(e,t)}));const Yt=(t,e)=>Object.assign(new Array(e).fill(null),t);const Vt={error:(t,e)=>{if(e.cn){const{host:s,port:r,database:n,user:o,password:a}=e.cn;Dt.debug(`Waiting for db to start { message:${t.message} host:${s}, port:${r}, database:${n}, user:${o}, password: ${a}`)}},noWarnings:!0};Gt()&&Tt>0&&(b.isAttached()?b.detach():(b.attach(Vt),b.setTheme("matrix")));const Zt=w(Vt)({host:Nt,port:It,database:xt,user:Ot,password:Rt,allowExitOnIdle:!0,idleTimeoutMillis:100});const{PreparedStatement:Qt}=w;class Xt{static async select(t){const e=new Qt({name:`OffChain.select.${Math.random()}`,text:'SELECT "data" FROM "OffChain" WHERE "id" = $1',values:[t]});return Zt.oneOrNone(e)}static async insert({id:t,data:e}){const s=new Qt({name:`OffChain.insert.${Math.random()}`,text:'INSERT INTO "OffChain" ("id", "data") VALUES ($1, $2) ON CONFLICT DO NOTHING',values:[t,e]});return Zt.none(s)}static async delete(t){const e=new Qt({name:`OffChain.delete.${Math.random()}`,text:'WITH deleted AS (DELETE FROM "OffChain" WHERE "id" = $1 RETURNING *) SELECT count(*) FROM deleted;',values:[t]});return(await Zt.any(e))[0].count>0}}class te{static async select(t){return(await Xt.select(t))?.data||null}static async insert(t){return Xt.insert(t)}static async delete(t){return Xt.delete(t)}}const{crypto:ee}=g;const se=s.Router();se.get("/:id",(async({params:{id:t},url:e,method:s},r)=>{void 0===r.locals.authToken&&(Dt.error(`Authorization failed at ${s} ${e}.`),r.status(403).json({error:`Authorization failed at ${s} ${e}.`}));try{const e=await te.select(t);e?r.status(200).json(e):r.status(403).json({error:"No entry found."})}catch(t){Dt.error(`GET ${e} failed with error '${t.message}'`),r.status(500).json({error:t.message})}})),se.post("/",(async(t,e)=>{const{body:{data:s},url:r}=t;try{const r=ee.Hash.sha256(Buffer.from(s)).toString("hex");await te.insert({id:r,data:s});const n=`${t.protocol}://${t.get("host")}/store/${r}`;e.status(201).json({_url:n})}catch(t){Dt.error(`POST ${r} failed with error '${t.message}'`),e.status(500).json({error:t.message})}})),se.delete("/:id",(async({params:{id:t},url:e,method:s},r)=>{Gt()||(Dt.error(`Authorization failed at ${s} ${e}.`),r.status(403).json({error:`Authorization failed at ${s} ${e}.`}));try{await te.delete(t)?r.status(204).send():r.status(403).json({error:"No entry found."})}catch(t){Dt.error(`DELETE ${e} failed with error '${t.message}'`),r.status(500).json({error:t.message})}}));const re=new S({protocol:jt,user:At,pass:Pt,host:Ct,port:Ht});const ne=E.promisify(S.prototype.createwallet.bind(re));const oe=E.promisify(S.prototype.generateToAddress.bind(re));const ae=E.promisify(S.prototype.getaddressinfo.bind(re));const ie=E.promisify(S.prototype.getBlock.bind(re));const ce=E.promisify(S.prototype.getBlockchainInfo.bind(re));const le=E.promisify(S.prototype.getBlockHash.bind(re));const de=E.promisify(S.prototype.getRawTransaction.bind(re));const ue=E.promisify(S.prototype.getTransaction.bind(re));const pe=E.promisify(S.prototype.getNewAddress.bind(re));const ye={createwallet:ne,generateToAddress:oe,getaddressinfo:ae,getBlock:ie,getBlockchainInfo:ce,getBlockHash:le,getRawTransaction:de,getTransaction:ue,importaddress:E.promisify(S.prototype.importaddress.bind(re)),listunspent:E.promisify(S.prototype.listunspent.bind(re)),sendRawTransaction:E.promisify(S.prototype.sendRawTransaction.bind(re)),getNewAddress:pe,sendToAddress:E.promisify(S.prototype.sendToAddress.bind(re))};const{PreparedStatement:he}=w;class fe{static async select(t){const e=new he({name:`Input.select.${Math.random()}`,text:'SELECT "rev" FROM "Input" WHERE "rev" = $1',values:[t]});return Zt.any(e)}static async insert(t){const e=t.flatMap((t=>[t.rev]));for(;e.length;){const t=e.splice(0,Bt);const s=[];for(let e=1;e<=t.length;e+=1)s.push(`($${e})`);const r=s.join(",");const n=new he({name:`Input.insert.${Math.random()}`,text:`INSERT INTO "Input"("rev") VALUES ${r}  ON CONFLICT DO NOTHING`,values:t});await Zt.none(n)}}static async count(t){const e=t.map((t=>t.rev));const s=new he({name:`Input.belong.${Math.random()}`,text:'SELECT count(*) FROM "Input" WHERE "rev" LIKE ANY ($1)',values:[[e]]});const r=await Zt.oneOrNone(s);return parseInt(r?.count,10)||0}}const{Transaction:me}=g;const{Input:ge}=me;class we{static getNonCoinbaseRevs=t=>t.map((t=>ge.fromObject({...t,script:t._scriptBuffer}))).filter((t=>!t.isNull())).map((({prevTxId:t,outputIndex:e})=>({rev:`${t.toString("hex")}/${e}`})));static insert=async t=>class{static async select(t){return fe.select(t)}static async insert(t){return fe.insert(t)}}.insert(this.getNonCoinbaseRevs(t))}const{PreparedStatement:be}=w;class ve{static async select(t){const e=new be({name:`Output.select.${Math.random()}`,text:'SELECT "address", "satoshis", "scriptPubKey", "rev" FROM "Output" WHERE "address" = $1',values:[t]});return Zt.any(e)}static async insert(t){const e=t.flatMap((t=>[t.rev,t.address,t.satoshis,t.scriptPubKey]));for(;e.length;){const t=e.splice(0,Bt);const s=[];for(let e=1;e<=t.length;e+=4)s.push(`($${e}, $${e+1}, $${e+2}, $${e+3})`);const r=s.join(",");const n=new be({name:`Output.insert.${Math.random()}`,text:`INSERT INTO "Output"("rev", "address", "satoshis", "scriptPubKey") VALUES ${r}  ON CONFLICT DO NOTHING`,values:t});await Zt.none(n)}}}const{Script:$e}=g;const{PreparedStatement:Se}=w;class Ee{static async query(t){const{publicKey:e,classHash:s}=t;if(void 0===e&&void 0===s)return[];let r='SELECT "rev"\n      FROM "NonStandard"\n      WHERE true ';const n=[];e&&(n.push(e),r+=' AND $1 = ANY ("publicKeys")'),s&&(n.push(s),r+=` AND "classHash" = $${n.length}`);const o=new Se({name:`NonStandard.query.${Math.random()}`,text:r,values:n});return(await Zt.any(o)).map((t=>t.rev))}static async insert({id:t,rev:e,publicKeys:s,classHash:r}){const n=new Se({name:`NonStandard.insert.${Math.random()}`,text:'INSERT INTO "NonStandard"("id", "rev", "publicKeys", "classHash") VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',values:[t,e,s,r]});await Zt.none(n)}static async update({id:t,rev:e,publicKeys:s}){const r=new Se({name:`NonStandard.update.${Math.random()}`,text:'UPDATE "NonStandard" SET "rev"=$2, "publicKeys"=$3 WHERE "id" = $1',values:[t,e,s]});return Zt.none(r)}static async getRevsByIds(t){const e=new Se({name:`NonStandard.getRevsByIds.${Math.random()}`,text:'SELECT "rev" FROM "NonStandard" WHERE "id" LIKE ANY($1)',values:[[t]]});return Zt.any(e)}static async select(t){const e=new Se({name:`NonStandard.select.${Math.random()}`,text:'SELECT "id", "classHash" FROM "NonStandard" WHERE "rev" = $1',values:[t]});return Zt.oneOrNone(e)}}class Te{static async select(t){return Ee.select(t)}static async query(t){return Ee.query(t)}static async getRevsByIds(t){return Ee.getRevsByIds(t)}static async insert(t){return Ee.insert(t)}static async update(t){return Ee.update(t)}}const{crypto:Oe}=g;class Re{static add=async(t,e,s)=>{const r=Math.max(t.length,e.length);const n=Yt(t,r);const o=Yt(e,r);const a=(i=o,n.map(((t,e)=>[t,i[e]])));var i;await Promise.all(a.map((async([t,e],r)=>{const{__cls:n="",_owners:o=[]}=s[r]||{};if(null===t&&e)return/^[0-9A-Fa-f]{64}\/\d+$/.test(e),void await Te.insert({id:e,rev:e,publicKeys:o,classHash:Oe.Hash.sha256(Buffer.from(n)).toString("hex")});if(e&&t){const{id:s,classHash:r}=await Te.select(t)||{};await Te.update({id:s,rev:e,publicKeys:o,classHash:r})}})))};static query=async t=>Te.query(t);static getRevsByIds=async t=>(await Te.getRevsByIds(t)).map((t=>t.rev))}const{PreparedStatement:xe}=w;class Ne{static async select(){return Zt.one('SELECT "syncedHeight", "bitcoindSyncedHeight", "bitcoindSyncedProgress" FROM "SyncStatus"')}static async update({syncedHeight:t,bitcoindSyncedHeight:e,bitcoindSyncedProgress:s}){const r=new xe({name:`Sync.update.${Math.random()}`,text:'UPDATE "SyncStatus" SET "syncedHeight" = $1, "bitcoindSyncedHeight" = $2, "bitcoindSyncedProgress" = $3',values:[t,e,s]});await Zt.any(r)}}class Ie{static async select(){return Ne.select()}static async update(t){await Ne.update(t)}}class je{static updateSync=async t=>Ie.update(t);static selectSync=async()=>Ie.select()}const Ae=new $({chain:vt,network:$t,url:Et});class Pe{static syncTx=async t=>{await class{static insert=async(t,e)=>{const s=t.map(((t,s)=>{const r=$e.fromBuffer(t._scriptBuffer);let n=r.toAddress($t).toString("legacy");"false"===n&&(n=null);const o=r.toHex();const a=Math.round(t.satoshis);return{address:n,rev:`${e}/${s}`,scriptPubKey:o,satoshis:a}}));return class{static async select(t){return ve.select(t)}static async insert(t){return ve.insert(t)}}.insert(s)}}.insert(t.tx.outputs,t.txId),await we.insert(t.tx.inputs);const{inRevs:e=[],outRevs:s=[],outData:r=[]}=t;await Re.add(e,s,r)};static rawTxSubscriber=async t=>{try{const e=t.toString("hex");Dt.info(`ZMQ message { rawTx:${e} }`),"dev"===St&&l.appendFileSync("zmqlog.log",`${e} \r\n`);const s=await Ae.db.fromTxHex(e);try{await this.syncTx(s)}catch(t){Dt.error(`Error parsing transaction ${t.message} ${t.stack}`)}}catch(t){Dt.error(`RawTxSubscriber failed with error '${t.message} ${t.stack}'`)}};static checkSyncEnd=async()=>{let t=-1;let e=-1;let s=0;Dt.info("Checking sync progress...syncedHeight: -1 from -1");do{({syncedHeight:t,bitcoindSyncedHeight:e,bitcoindSyncedProgress:s}=await je.selectSync()),t>0?Dt.info(`Sync progress ${t}/${e} blocks [${(t/e*100).toFixed(4)}% (bitcoind progress: ${(100*s).toFixed(4)}%)]`):Dt.info(`Sync progress initializing... ${t}/${e} blocks `),await Jt(kt)}while(t<e||s<.999);Dt.info(`BCN reaches sync end...currentBlockHeight: ${t} from ${e} (chain progress: ${(100*s).toFixed(4)})`)};static createWallet=async()=>{try{await ye.createwallet(Mt)}catch(t){Dt.debug(`Wallet creation failed with error '${t.message}'`)}};static sub=async t=>{try{await this.createWallet(),"regtest"!==$t&&await this.checkSyncEnd(),await(async()=>{if("LTC"===vt&&"regtest"===$t){Dt.info(`Node is starting for chain ${vt} and network ${$t}, Starting MWEB setup.`);const{result:t}=await ye.getBlockchainInfo();const e=t.blocks;if(e<Wt){const{result:t}=await ye.getNewAddress("","legacy");const s=Wt-e-1;s&&await ye.generateToAddress(s,t);const{result:r}=await ye.getNewAddress("mweb","mweb");await ye.sendToAddress(r,1),await ye.generateToAddress(1,t)}Dt.info("MWEB setup is complete")}})(),Dt.info(`Bitcoin Computer Node is ready ${_t}`);for await(const[,e]of t)await this.rawTxSubscriber(e)}catch(t){Dt.error(`ZMQ subscription failed with error '${t.message}'`)}}}const{PreparedStatement:Ce}=w;class He{static async getBalance(t){const e=new Ce({name:`Utxos.getBalance.${Math.random()}`,text:'SELECT sum("satoshis") as "satoshis" FROM "Utxos" WHERE "address" = $1',values:[t]});const s=await Zt.oneOrNone(e);return parseInt(s?.satoshis,10)||0}static async select(t){const e=new Ce({name:`Utxos.select.${Math.random()}`,text:'SELECT "address", "satoshis", "scriptPubKey", "rev" FROM "Utxos" WHERE "address" = $1',values:[t]});return(await Zt.any(e)).map((t=>({...t,satoshis:parseInt(t.satoshis,10)||0})))}}class _e{static async getBalance(t){return He.getBalance(t)}static async select(t){return He.select(t)}}class Me{static getBalance=async t=>_e.getBalance(t);static select=async t=>_e.select(t)}class ke{static async getTransaction(t){const{result:e}=await ye.getTransaction(t);return e}static async getBulkTransactions(t){return(await Promise.all(t.map((t=>ye.getRawTransaction(t))))).map((t=>t.result))}static async sendRawTransaction(t){const{result:e,error:s}=await ye.sendRawTransaction(t);if(s)throw Dt.error(s),new Error("Error sending transaction");return e}static getUtxos=async t=>(void 0===(await ye.getaddressinfo(t)).result.timestamp&&(Dt.info(`Importing address: ${t}`),await ye.importaddress(t,!1)),(await ye.listunspent(0,999999,[t])).result)}class Be{static get=async t=>ke.getTransaction(t);static getRaw=async t=>ke.getBulkTransactions(t);static sendRaw=async t=>ke.sendRawTransaction(t);static getUtxos=async t=>ke.getUtxos(t)}const Fe=new S({protocol:jt,user:At,pass:Pt,host:Ct,port:Ht});const Le={};const Ue=JSON.parse(JSON.stringify(S.callspec));Object.keys(Ue).forEach((t=>{Ue[t.toLowerCase()]=Ue[t]}));const We={str:t=>t.toString(),string:t=>t.toString(),int:t=>parseFloat(t),float:t=>parseFloat(t),bool:t=>!0===t||"1"===t||1===t||"true"===t||"true"===t.toString().toLowerCase(),obj:t=>"string"==typeof t?JSON.parse(t):t};try{Object.keys(S.prototype).forEach((t=>{if(t&&"function"==typeof S.prototype[t]){const e=t.toLowerCase();Le[t]=E.promisify(S.prototype[t].bind(Fe)),Le[e]=E.promisify(S.prototype[e].bind(Fe))}}))}catch(t){Dt.error(`Error occurred while binding RPC methods: ${t.message}`)}const{ec:De}=T;const Ke=new De("secp256k1");const Ge=s();let qe;try{qe=r.createServer(Ge)}catch(t){throw Dt.error(`Starting server failed with error '${t.message}'`),t}if(Dt.info(`Server listening on port ${wt}`),Ge.use(e()),"dev"!==St){const t=o({windowMs:9e5,max:300,standardHeaders:!0,legacyHeaders:!1});Ge.use(t)}Ge.use(t.json({limit:"100mb"})),Ge.use(t.urlencoded({limit:"100mb",extended:!0})),Ge.use((async(t,e,s)=>{try{const r=t.get("Authentication");if(!r)return void s();const n=(t=>{const e=t.split(" ");if(2!==e.length||"Bearer"!==e[0])throw new Error("Authentication header is invalid.");const s=Buffer.from(e[1],"base64").toString().split(":");if(3!==s.length)throw new Error;return{signature:s[0],publicKey:s[1],timestamp:parseInt(s[2],10)}})(r);const{signature:o,publicKey:a,timestamp:i}=n;if(Date.now()-i>1e3*Lt*60)return void e.status(401).json({error:"Signature is too old."});const c=O.sha256().update(Et+i).digest("hex");if(!Ke.keyFromPublic(a,"hex").verify(c,o))return void e.status(401).json({error:"The origin and public key pair doesn't match the signature."});e.locals.authToken=n,s()}catch(t){Dt.error(`Auth failed with error '${t.message}'`),e.status(401).json({error:t.message})}})),Ge.use((({url:t},e,s)=>{if(void 0!==e.locals.authToken)try{let t;try{const e=Gt()?"bcn.test.config.json":"bcn.config.json";const s=p(y(import.meta.url));t=l.readFileSync(u.join(s,"..","..",e))}catch(t){if(t.message.includes("ENOENT: no such file or directory"))return void s();throw Dt.error(`Access-list failed with error '${t.message}'`),t}const{blacklist:r,whitelist:n}=JSON.parse(t.toString());if(r&&n)return void e.status(403).json({error:"Cannot enforce blacklist and whitelist at the same time."});const{publicKey:o}=e.locals.authToken;if(n&&!n.includes(o)||r&&r.includes(o))return void e.status(403).json({error:`Public key ${o} is not allowed.`});s()}catch(s){Dt.error(`Authorization failed at ${t} with error: '${s.message}'`),e.status(403).json({error:s.message})}else s()}));const ze=(()=>{const t=s.Router();return t.get("/wallet/:address/utxos",(async({params:t,url:e},s)=>{try{const{address:e}=t;const r=await Me.select(e);const n=r.map((({satoshis:t,rev:e})=>{const[s,r]=e.split("/");return{amount:t/1e8,txid:s,vout:parseInt(r,10)}}));if(qt()){let t=[];let s=!1;let r=10;do{try{t=await Be.getUtxos(e)||[],s=!0}catch(t){Dt.debug(`Retrying to get utxos '${t.message}'`),await Jt(1e3),r-=1}}while(!s&&r>0);const o=t.map((({amount:t,txid:e,vout:s})=>({amount:t,txid:e,vout:s})));zt(n,o)||(Dt.error(`Inconsistency on UTXO set calculation for address ${e}.`),Dt.error(`db utxos ${JSON.stringify(n,null,2)} rpc utxos ${JSON.stringify(o,null,2)}`),Dt.error(`db utxos length ${n.length} rpc utxos length: ${o.length}`))}s.status(200).json(r)}catch(t){Dt.error(`GET ${e} failed with error '${t.message}'`),s.status(404).json({error:t.message})}})),t.get("/non-standard-utxos",(async({query:t,url:e},s)=>{try{const e=await Re.query(t);s.status(200).json(e)}catch(t){Dt.error(`GET ${e} failed with error '${t.messages}'`),s.status(404).json({error:t.message})}})),t.get("/address/:address/balance",(async({params:t,url:e},s)=>{try{const{address:r}=t;const n=await Me.select(r);const o=await Me.getBalance(r);const a=n.map((({satoshis:t,rev:e})=>{const[s,r]=e.split("/");return{amount:t/1e8,txid:s,vout:parseInt(r,10)}}));if(qt()){let t=[];let s=!1;let n=10;do{try{t=await Be.getUtxos(r)||[],s=!0}catch(t){Dt.debug(`Retrying ${e} getStandardUtxosAction: ${t.message}`),await Jt(1e3),n-=1}}while(!s&&n>0);const i=1e8*t.reduce(((t,e)=>t+e.amount),0);const c=t.map((({amount:t,txid:e,vout:s})=>({amount:t,txid:e,vout:s})));o===Math.round(i)&&zt(a,c)||(Dt.error(`Inconsistency on balance calculation for address ${r}: dbBalance ${o} rpcBalance: ${i}`),Dt.error(`db utxos ${a}`),Dt.error(`rpc utxos: ${JSON.stringify(a)}`))}s.status(200).json(o)}catch(t){Dt.error(`GET ${e} failed with error '${t.message}'`),s.status(404).json({error:t.message})}})),t.post("/tx/bulk",(async({body:{txIds:t},url:e},s)=>{try{if(void 0===t||0===t.length)return void s.status(500).json({error:"Missing input txIds."});const e=await Be.getRaw(t);e?s.status(200).json(e):s.status(404).json({error:"Not found"})}catch(t){Dt.error(`POST ${e} failed with error '${t.message}'`),s.status(500).json({error:t.message})}})),t.post("/tx/send",(async({body:{rawTx:t},url:e},s)=>{try{const e=await Be.sendRaw(t);await Pe.rawTxSubscriber(t),s.status(200).json(e)}catch(t){Dt.error(`POST ${e} failed with error '${t.message}'`),s.status(500).json({error:t.message})}})),t.post("/revs",(async({body:{ids:t},url:e},s)=>{try{if(void 0===t||0===t.length)return void s.status(404).json({error:"Missing input object ids."});const e=await Re.getRevsByIds(t);s.status(200).json(e)}catch(t){Dt.error(`POST ${e} failed with error '${t.message}'`),s.status(404).json({error:t.message})}})),t.post("/rpc",(async({body:t,url:e},s)=>{try{if(!t||!t.method)throw new Error("Please provide appropriate RPC method name");if(!Ut.some((e=>e.test(t.method))))throw new Error("Method is not allowed");const e=function(t,e){if(void 0===Ue[t]||null===Ue[t])throw new Error("This RPC method does not exist, or not supported");const s=e.trim().split(" ");const r=Ue[t].trim().split(" ");if(0===e.trim().length&&0!==Ue[t].trim().length)throw new Error(`Too few params provided. Expected ${r.length} Provided 0`);if(0!==e.trim().length&&0===Ue[t].trim().length)throw new Error(`Too many params provided. Expected 0 Provided ${s.length}`);if(s.length<r.length)throw new Error(`Too few params provided. Expected ${r.length} Provided ${s.length}`);if(s.length>r.length)throw new Error(`Too many params provided. Expected ${r.length} Provided ${s.length}`);return 0===e.length?[]:s.map(((t,e)=>We[r[e]](t)))}(t.method,t.params);const r=e.length?await Le[t.method](...e):await Le[t.method]();return void s.status(200).json({result:r})}catch(t){Dt.error(`POST ${e} failed with error '${t.message}'`),s.status(404).json({error:t.message})}})),t.post("/non-standard-utxo",(async(t,e)=>{e.status(500).json({error:"Please upgrade to @bitcoin-computer/lib to the latest version."})})),t.get("/tx/:txId",(async({params:t},e)=>{const{txId:s}=t;const[r]=await Be.getRaw([s]);r?e.status(200).json(r):e.status(404).json({error:"Not found"})})),t})();Ge.use(`/v1/${vt}/${$t}`,ze),Ge.use("/v1/store",se),Ge.get("/",((t,e)=>e.status(200).send("OK"))),Ge.get("/health",((t,e)=>e.status(200).send("healthy"))),Ge.get("/version",((t,e)=>e.status(200).send(_t))),qe.listen(wt,(()=>{Dt.info(`Rev ${_t} Started web server on port ${wt}`)}));const Je=new n.Subscriber;Je.connect(bt),Je.subscribe("rawtx"),Dt.info(`ZMQ Subscriber connected to ${bt}`),(async()=>{await(async()=>{await v((()=>Zt.connect()),{startingDelay:Ft})})(),await Pe.sub(Je)})();
