import t from"body-parser";import e from"cors";import s from"express";import r from"http";import*as a from"zeromq";import n from"express-rate-limit";import o from"dotenv";import i from"fs";import{networks as c,crypto as d,payments as l,Psbt as u,Transaction as p,bufferUtils as m,address as h}from"@bitcoin-computer/nakamotojs-lib";import y from"winston";import g from"winston-daily-rotate-file";import w from"pg-promise";import f from"pg-monitor";import{backOff as E}from"exponential-backoff";import{ECPairFactory as T}from"ecpair";import*as $ from"@bitcoin-computer/tiny-secp256k1";import v from"bitcoind-rpc";import S from"util";import{Computer as b}from"@bitcoin-computer/lib";import R from"elliptic";import I from"hash.js";import x,{dirname as O}from"path";import{fileURLToPath as N}from"url";o.config();const M=JSON.parse(i.readFileSync("package.json","utf8"));function C(t,e){switch(t){case"BTC":return"mainnet"===e?c.bitcoin:c.testnet;case"LTC":return"mainnet"===e?c.litecoin:c.litecoinregtest;default:throw new Error("We currently only support BTC and LTC, support for other currencies will be added soon.")}}const{PORT:P,ZMQ_URL:A,CHAIN:_,NETWORK:j,BCN_ENV:H,BCN_URL:B,DEBUG_MODE:L,POSTGRES_USER:k,POSTGRES_PASSWORD:D,POSTGRES_DB:K,POSTGRES_HOST:F,POSTGRES_PORT:U,RPC_PROTOCOL:Y,RPC_USER:W,RPC_PASSWORD:G,RPC_HOST:q,RPC_PORT:J,SERVER_VERSION:V,DEFAULT_WALLET:z,SYNC_INTERVAL_CHECK:Z,POSTGRES_MAX_PARAM_NUM:X,DB_CONNECTION_RETRY_TIME:Q,SIGNATURE_FRESHNESS_MINUTES:tt,ALLOWED_RPC_METHODS:et,NODE_MAX_PROGRESS:st,SYNC_MAX_PROGRESS:rt,MAX_BLOCKCHAIN_HEIGHT:at,MWEB_HEIGHT:nt,BC_START_HEIGHT:ot,WORKER_ID:it,NUM_WORKERS:ct,SYNC_NON_STANDARD:dt,ZMQ_WAIT_PERCENTAGE:lt,QUERY_LIMIT:ut,LOG_MAX_FILE_SIZE:pt,LOG_MAX_FILE_NUM:mt,LOG_ZIP:ht,RPC_URL:yt,RPC_BATCHSIZE:gt,RPC_CONCURRENT:wt,INDEXDB:ft,KEYDB:Et}=process.env;const Tt=parseInt(P,10)||"1031";const $t=A||"tcp://node:28332";const vt=_||"LTC";const St=j||"regtest";const bt=H||"dev";const Rt=B||`http://127.0.0.1:${Tt}`;const It=parseInt(L,10)||1;const xt=k||"bcn";const Ot=D||"bcn";const Nt=K||"bcn";const Mt=F||"127.0.0.1";const Ct=parseInt(U,10)||"5432";const Pt=Y||"http";const At=W||"bcn-admin";const _t=G||"kH4nU5Okm6-uyC0_mA5ztVNacJqZbYd_KGLl6mx722A=";const jt=q||"node";const Ht=parseInt(J,10)||19332;const Bt=M.version||V;const Lt=z||"defaultwallet";const kt=parseInt(X,10)||1e4;const Dt=parseInt(Q,10)||500;const Kt=parseInt(tt,10)||3;const Ft=et?et.split(",").map((t=>new RegExp(t))):[];const Ut=parseInt(at||"",10)||2538171;const Yt=parseInt(nt||"",10)||432;const Wt=parseInt(ot||"",10)||25e5;const Gt=parseInt(lt||"",10)||.7;const qt=parseInt(ut||"",10)||100;const Jt=pt||"20m";const Vt=mt||"14d";const zt=!!ht;y.addColors({error:"red",warn:"yellow",info:"green",http:"magenta",debug:"white"});const Zt=y.format.combine(y.format.colorize(),y.format.timestamp({format:"YYYY-MM-DD HH:mm:ss:ms"}),y.format.json(),y.format.printf((t=>`${t.timestamp} [${t.level.slice(5).slice(0,-5)}] ${t.message}`)));const Xt={zippedArchive:zt,maxSize:Jt,maxFiles:Vt,dirname:"logs"};const Qt=[];"dev"===bt&&Qt.push(new y.transports.Console({format:y.format.combine(y.format.colorize(),y.format.timestamp({format:"MM-DD-YYYY HH:mm:ss"}),y.format.printf((t=>`${t.timestamp} ${t.level} ${t.message}`)))})),It>=0&&Qt.push(new g({filename:"error-%DATE%.log",datePattern:"YYYY-MM-DD",level:"error",...Xt})),It>=1&&Qt.push(new g({filename:"warn-%DATE%.log",datePattern:"YYYY-MM-DD",level:"warn",...Xt})),It>=2&&Qt.push(new g({filename:"info-%DATE%.log",datePattern:"YYYY-MM-DD",level:"info",...Xt})),It>=3&&Qt.push(new g({filename:"http-%DATE%.log",datePattern:"YYYY-MM-DD",level:"http",...Xt})),It>=4&&Qt.push(new g({filename:"debug-%DATE%.log",datePattern:"YYYY-MM-DD",level:"debug",...Xt})),Qt.push(new g({filename:"logs-%DATE%.log",datePattern:"YYYY-MM-DD"}));const te=y.createLogger({levels:{error:0,warn:1,info:2,http:3,debug:4},format:Zt,transports:Qt,exceptionHandlers:[new y.transports.File({filename:"logs/exceptions.log"})],rejectionHandlers:[new y.transports.File({filename:"logs/rejections.log"})]});const ee=()=>"dev"===bt;const se={error:(t,e)=>{if(e.cn){const{host:s,port:r,database:a,user:n,password:o}=e.cn;te.debug(`Waiting for db to start { message:${t.message} host:${s}, port:${r}, database:${a}, user:${n}, password: ${o}`)}},noWarnings:!0};ee()&&It>0&&(f.isAttached()?f.detach():(f.attach(se),f.setTheme("matrix")));const re=w(se)({host:Mt,port:Ct,database:Nt,user:xt,password:Ot,allowExitOnIdle:!0,idleTimeoutMillis:100});const{PreparedStatement:ae}=w;class ne{static async select(t){const e=new ae({name:`OffChain.select.${Math.random()}`,text:'SELECT "data" FROM "OffChain" WHERE "id" = $1',values:[t]});return re.oneOrNone(e)}static async insert({id:t,data:e}){const s=new ae({name:`OffChain.insert.${Math.random()}`,text:'INSERT INTO "OffChain" ("id", "data") VALUES ($1, $2) ON CONFLICT DO NOTHING',values:[t,e]});return re.none(s)}static async delete(t){const e=new ae({name:`OffChain.delete.${Math.random()}`,text:'WITH deleted AS (DELETE FROM "OffChain" WHERE "id" = $1 RETURNING *) SELECT count(*) FROM deleted;',values:[t]});return(await re.any(e))[0].count>0}}class oe{static async select(t){const e=await ne.select(t);return e?.data||null}static async insert(t){return ne.insert(t)}static async delete(t){return ne.delete(t)}}const ie=s.Router();ie.get("/:id",(async({params:{id:t},url:e},s)=>{try{const e=await oe.select(t);e?s.status(200).json(e):s.status(403).json({error:"No entry found."})}catch(t){te.error(`GET ${e} failed with error '${t.message}'`),s.status(500).json({error:t.message})}})),ie.post("/",(async(t,e)=>{const{body:{data:s},url:r}=t;try{const a=d.sha256(Buffer.from(s)).toString("hex");await oe.insert({id:a,data:s});const n=`${["localhost","127.0.0.1"].includes(t.host)?"http":"https"}://${t.get("host")}/store/${a}`;te.info(`Off-chain POST ${r} succeeded with url '${n}'`),e.status(201).json({_url:n})}catch(t){te.error(`POST ${r} failed with error '${t.message}'`),e.status(500).json({error:t.message})}})),ie.delete("/:id",(async(t,e)=>{e.status(500).json({error:"Deletions are not supported yet."})}));const{PreparedStatement:ce}=w;class de{static async getBalance(t){const e=new ce({name:`Utxos.getBalance.${Math.random()}`,text:'SELECT sum("satoshis") as "satoshis" FROM "Utxos" WHERE "address" = $1',values:[t]});const s=await re.oneOrNone(e);return parseInt(s?.satoshis,10)||0}static async select(t){const e=new ce({name:`Utxos.select.${Math.random()}`,text:'SELECT "address", "satoshis", "scriptPubKey", "rev", split_part(rev, \':\', 1) AS "txId", cast(split_part(rev, \':\', 2) as INTEGER) AS "vout" FROM "Utxos" WHERE "address" = $1',values:[t]});return(await re.any(e)).map((t=>({...t,satoshis:parseInt(t.satoshis,10)||0})))}static async selectByScriptHex(t){const e=new ce({name:`Utxos.select.${Math.random()}`,text:'SELECT "address", "satoshis", "scriptPubKey", "rev", split_part(rev, \':\', 1) AS "txId", cast(split_part(rev, \':\', 2) as INTEGER) AS "vout" FROM "Utxos" WHERE "scriptPubKey" = $1',values:[t]});return(await re.any(e)).map((t=>({...t,satoshis:parseInt(t.satoshis,10)||0})))}static async selectByPk(t){const e=new ce({name:`Utxos.selectByPk.${Math.random()}`,text:'SELECT "address", "satoshis", "scriptPubKey", "rev", split_part(rev, \':\', 1) AS "txId", cast(split_part(rev, \':\', 2) as INTEGER) AS "vout", "publicKeys" FROM "Utxos" WHERE $1 = ANY ("publicKeys")',values:[t]});return(await re.any(e)).map((t=>({...t,satoshis:parseInt(t.satoshis,10)})))}}class le{static async getBalance(t){return de.getBalance(t)}static async select(t){return de.select(t)}static async selectByScriptHex(t){return de.selectByScriptHex(t)}static async selectByPk(t){return de.selectByPk(t)}}class ue{static getBalance=async t=>le.getBalance(t);static select=async t=>le.select(t);static selectByScriptHex=async t=>le.selectByScriptHex(t);static selectByPk=async t=>le.selectByPk(t)}function pe(t){return/^[0-9A-Fa-f]{64}:\d+$/.test(t)}function me(t){if(!pe(t))throw new Error("Invalid rev")}const{PreparedStatement:he}=w;class ye{static async query(t){const{publicKey:e,hash:s,limit:r,offset:a,order:n,ids:o,mod:i}=t;if(r&&parseInt(r||"",10)>qt||o&&o.length>qt)throw new Error(`Can't fetch more than ${qt} revs.`);if(n&&"ASC"!==n&&"DESC"!==n)throw new Error("Invalid order");let c;c=o?.length?'SELECT "rev", "id", array_position($1, "id") as ord\n        FROM "NonStandard" \n        WHERE true ':'SELECT "rev"\n        FROM "NonStandard"\n        WHERE true ';const d=[];s&&(d.push(s),c+=` AND "hash" = $${d.length}`),i&&(d.push(i),c+=` AND "mod" = $${d.length}`),o&&(o.map(me),d.push(o),c+=` AND "id" = ANY ($${d.length})`),e&&(d.push(e),c+=` AND $${d.length} = ANY ("publicKeys")`),n?(c+=` order by "lastUpdated" ${n}`,o?.length&&(c+=", ord")):o?.length&&(c+=" order by ord"),d.push(r||qt),c+=` limit $${d.length}`,a&&(d.push(a),c+=` offset $${d.length}`);const l=new he({name:`NonStandard.query.${Math.random()}`,text:c,values:d});return(await re.any(l)).map((t=>t.rev))}static async insert({id:t,rev:e,publicKeys:s,hash:r,mod:a}){const n=new he({name:`NonStandard.insert.${Math.random()}`,text:'INSERT INTO "NonStandard"("id", "rev", "publicKeys", "hash", "mod") VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING',values:[t,e,s,r,a]});await re.none(n)}static async update({id:t,rev:e,publicKeys:s}){const r=new he({name:`NonStandard.update.${Math.random()}`,text:'UPDATE "NonStandard" SET "rev"=$2, "publicKeys"=$3 WHERE "id" = $1',values:[t,e,s]});return re.none(r)}static async delete({rev:t}){const e=new he({name:`NonStandard.delete.${Math.random()}`,text:'DELETE FROM "NonStandard" WHERE "rev" = $1',values:[t]});await re.none(e)}static async getRevsByIds(t){if(t&&t.length>qt)throw new Error(`Can't fetch more than ${qt} revs.`);const e=new he({name:`NonStandard.getRevsByIds.${Math.random()}`,text:'SELECT "rev" FROM "NonStandard" WHERE "id" LIKE ANY($1)',values:[[t]]});return re.any(e)}static async select(t){const e=new he({name:`NonStandard.select.${Math.random()}`,text:'SELECT "id", "hash", "mod" FROM "NonStandard" WHERE "rev" = $1',values:[t]});return re.oneOrNone(e)}}class ge{static async select(t){return ye.select(t)}static async query(t){return ye.query(t)}static async getRevsByIds(t){return ye.getRevsByIds(t)}static async insert(t){return ye.insert(t)}static async update(t){return ye.update(t)}static async delete(t){return ye.delete({rev:t})}}const{PreparedStatement:we}=w;class fe{static async getId(t){const e=new we({name:`RevToId.select.${Math.random()}`,text:'SELECT "id" FROM "RevToId" WHERE "rev" = $1',values:[t]});const s=await re.oneOrNone(e);return s?.id}static async insert(t){const e=new we({name:`RevToId.insert.${Math.random()}`,text:'INSERT INTO "RevToId"("rev", "id") VALUES ($1, $2)  ON CONFLICT DO NOTHING',values:[t.rev,t.id]});await re.none(e)}}class Ee{static async getId(t){return fe.getId(t)}static async insert(t){return fe.insert(t)}}class Te{static add=async t=>{const{zip:e,outData:s}=t;for(let t=0;t<e.length;t+=1){const[r,a]=e[t];const{exp:n="",_owners:o=[],mod:i=""}=s[t]||{};if(!r&&a)me(a),await ge.insert({id:a,rev:a,publicKeys:o,hash:d.sha256(Buffer.from(n)).toString("hex"),mod:i}),await Ee.insert({rev:a,id:a});else if(r&&a){const{id:t,hash:e,mod:s}=await ge.select(r)||{};await ge.update({id:t,rev:a,publicKeys:o,hash:e,mod:s}),await Ee.insert({rev:a,id:t})}else r&&!a&&await ge.delete(r)}};static query=async t=>ge.query(t);static getRevsByIds=async t=>(await ge.getRevsByIds(t)).map((t=>t.rev))}const $e=new v({protocol:Pt,user:At,pass:_t,host:jt,port:Ht});const ve=S.promisify(v.prototype.createwallet.bind($e));const Se=S.promisify(v.prototype.generateToAddress.bind($e));const be=S.promisify(v.prototype.getaddressinfo.bind($e));const Re=S.promisify(v.prototype.getBlock.bind($e));const Ie=S.promisify(v.prototype.getBlockchainInfo.bind($e));const xe=S.promisify(v.prototype.getBlockHash.bind($e));const Oe=S.promisify(v.prototype.getRawTransaction.bind($e));const Ne=S.promisify(v.prototype.getRawTransaction.bind($e));const Me=S.promisify(v.prototype.getTransaction.bind($e));const Ce=S.promisify(v.prototype.getNewAddress.bind($e));const Pe={createwallet:ve,generateToAddress:Se,getaddressinfo:be,getBlock:Re,getBlockchainInfo:Ie,getBlockHash:xe,getRawTransaction:Oe,getTransaction:Me,importaddress:S.promisify(v.prototype.importaddress.bind($e)),listunspent:S.promisify(v.prototype.listunspent.bind($e)),sendRawTransaction:S.promisify(v.prototype.sendRawTransaction.bind($e)),getNewAddress:Ce,sendToAddress:S.promisify(v.prototype.sendToAddress.bind($e)),getRawTransactionJSON:Ne};class Ae{static async getTransaction(t){const{result:e}=await Pe.getTransaction(t);return e}static async getBulkTransactions(t){return(await Promise.all(t.map((t=>Pe.getRawTransaction(t))))).map((t=>t.result))}static async getRawTransactionsJSON(t){return{txId:(e=(await Pe.getRawTransactionJSON(t,1)).result).txid,txHex:e.hex,vsize:e.vsize,version:e.version,locktime:e.locktime,ins:e.vin.map((t=>t.coinbase?{coinbase:t.coinbase,sequence:t.sequence}:{txId:t.txid,vout:t.vout,script:t.scriptSig.hex,sequence:t.sequence})),outs:e.vout.map((t=>{let e;return t.scriptPubKey.addresses?[e]=t.scriptPubKey.addresses:e=t.scriptPubKey.address?t.scriptPubKey.address:void 0,{address:e,script:t.scriptPubKey.hex,value:Math.round(1e8*t.value)}}))};var e}static async sendRawTransaction(t){const{result:e,error:s}=await Pe.sendRawTransaction(t);if(s)throw te.error(s),new Error("Error sending transaction");return e}static getUtxos=async t=>(void 0===(await Pe.getaddressinfo(t)).result.timestamp&&(te.info(`Importing address: ${t}`),await Pe.importaddress(t,!1)),(await Pe.listunspent(0,999999,[t])).result)}class _e{static get=async t=>Ae.getTransaction(t);static getRaw=async t=>Ae.getBulkTransactions(t);static getRawJSON=async t=>Ae.getRawTransactionsJSON(t);static sendRaw=async t=>Ae.sendRawTransaction(t);static getUtxos=async t=>Ae.getUtxos(t)}const je=new v({protocol:Pt,user:At,pass:_t,host:jt,port:Ht});const He={};const Be=JSON.parse(JSON.stringify(v.callspec));Object.keys(Be).forEach((t=>{Be[t.toLowerCase()]=Be[t]}));const Le={str:t=>t.toString(),string:t=>t.toString(),int:t=>parseFloat(t),float:t=>parseFloat(t),bool:t=>!0===t||"1"===t||1===t||"true"===t||"true"===t.toString().toLowerCase(),obj:t=>"string"==typeof t?JSON.parse(t):t};try{Object.keys(v.prototype).forEach((t=>{if(t&&"function"==typeof v.prototype[t]){const e=t.toLowerCase();He[t]=S.promisify(v.prototype[t].bind(je)),He[e]=S.promisify(v.prototype[e].bind(je))}}))}catch(t){te.error(`Error occurred while binding RPC methods: ${t.message}`)}const ke=t=>new Promise((e=>setTimeout(e,t)));const De=T($);const Ke=c.regtest;const{PreparedStatement:Fe}=w;class Ue{static async select(t){const e=new Fe({name:`Input.select.${Math.random()}`,text:'SELECT "rev" FROM "Input" WHERE "rev" = $1',values:[t]});return re.any(e)}static async insert(t){const e=t.flatMap((t=>[t.rev]));for(;e.length;){const t=e.splice(0,kt);const s=[];for(let e=1;e<=t.length;e+=1)s.push(`($${e})`);const r=s.join(",");const a=new Fe({name:`Input.insert.${Math.random()}`,text:`INSERT INTO "Input"("rev") VALUES ${r} ON CONFLICT DO NOTHING`,values:t});await re.none(a)}}static async count(t){const e=t.map((t=>t.rev));const s=new Fe({name:`Input.belong.${Math.random()}`,text:'SELECT count(*) FROM "Input" WHERE "rev" LIKE ANY ($1)',values:[[e]]});const r=await re.oneOrNone(s);return parseInt(r?.count,10)||0}}class Ye{static async select(t){return Ue.select(t)}static async insert(t){return Ue.insert(t)}}class We{static getNonCoinbaseRevs=t=>{const e=t.filter((t=>!p.isCoinbaseHash(t.hash))).map((({hash:t,index:e})=>({rev:`${m.reverseBuffer(Buffer.from(t)).toString("hex")}:${e}`})));return e};static insert=async t=>Ye.insert(this.getNonCoinbaseRevs(t))}const{PreparedStatement:Ge}=w;class qe{static async select(t){const e=new Ge({name:`Output.select.${Math.random()}`,text:'SELECT "address", "satoshis", "scriptPubKey", "rev" FROM "Output" WHERE "address" = $1',values:[t]});return re.any(e)}static async insert(t){const e=t.flatMap((t=>[t.rev,t.address,t.satoshis,t.scriptPubKey,t.publicKeys]));for(;e.length;){const t=e.splice(0,kt);const s=[];for(let e=1;e<=t.length;e+=5)s.push(`($${e}, $${e+1}, $${e+2}, $${e+3}, $${e+4})`);const r=s.join(",");const a=new Ge({name:`Output.insert.${Math.random()}`,text:`INSERT INTO "Output"("rev", "address", "satoshis", "scriptPubKey", "publicKeys") VALUES ${r}  ON CONFLICT DO NOTHING`,values:t});await re.none(a)}}}class Je{static async select(t){return qe.select(t)}static async insert(t){return qe.insert(t)}}class Ve{static insert=async t=>{const e=t.flatMap((t=>t.tx.outs.map(((e,s)=>{const{script:r}=e;let a;let n;try{a=h.fromOutputScript(r,C(vt,St))}catch(t){a=null}try{n=l.p2ms({output:r,network:C(vt,St)}).pubkeys.map((t=>t.toString("hex")))}catch(t){n=null}const o=r.toString("hex");const i=Math.round(e.value);return{address:a,rev:`${t.txId}:${s}`,scriptPubKey:o,satoshis:i,publicKeys:n}}))));return Je.insert(e)}}let ze;try{ze=new b({chain:vt,network:St,url:Rt})}catch(t){te.error(`Error creating computer, ${t.message}`),process.exit(1)}class Ze{static syncTx=async t=>{await Ve.insert([t]),await We.insert(t.tx.ins),t.isBcTx(vt,St)&&await Te.add(t)};static rawTxSubscriber=async t=>{const e=t.toString("hex");if(te.info(`ZMQ message { rawTx:${e} }`),"08"!==e.slice(10,12)){let t;try{t=await ze.txFromHex({hex:e})}catch(t){te.error(`RawTxSubscriber failed with error '${t.message} ${t.stack}'`)}try{await this.syncTx(t)}catch(t){te.error(`Error parsing transaction ${t.message} ${t.stack}`)}}};static checkSyncStatus=async()=>{const t=await E((async()=>{const t=await Pe.getBlockchainInfo();const e=(100*parseFloat(t.result.verificationprogress)).toFixed(4);const{blocks:s}=t.result;if(te.info(`Zmq. Bitcoind { percentage:${e}%, blocks:${s} }`),parseFloat(t.result.verificationprogress)<=Gt)throw new Error("Node not ready yet");return t}),{startingDelay:6e4,timeMultiple:1,numOfAttempts:8760});const e=(100*parseFloat(t.result.verificationprogress)).toFixed(4);const s=t.result.blocks;te.info(`BCN reaches sync end...at { bitcoind.progress:${e}%, bitcoindSyncedHeight:${s} }`)};static createWallet=async()=>{try{await Pe.createwallet(Lt,!1,!1,"",!1,!1)}catch(t){te.error(`Wallet creation failed with error '${t.message}'`)}};static sub=async t=>{try{await this.createWallet(),"regtest"!==St&&await this.checkSyncStatus(),await(async()=>{if("regtest"===St){if(te.info(`Node is starting for chain ${vt} and network ${St}, \n\n. Starting Wallet setup.`),"LTC"===vt){const{result:t}=await Pe.getBlockchainInfo();const e=t.blocks;if(e<Yt){const{result:t}=await Pe.getNewAddress("","legacy");const s=Yt-e-1;s&&await Pe.generateToAddress(s,t);const{result:r}=await Pe.getNewAddress("mweb","mweb");await Pe.sendToAddress(r,1),await Pe.generateToAddress(1,t),te.info("MWEB setup is complete")}}if("BTC"===vt){const{result:t}=await Pe.getNewAddress("","legacy");await Pe.generateToAddress(200,t),te.info("Wallet setup is complete")}}})(),te.info(`Bitcoin Computer Node ${Bt} is ready. MAX_BLOCKCHAIN_HEIGHT: ${Ut}`);for await(const[,e]of t)await this.rawTxSubscriber(e)}catch(t){te.error(`ZMQ subscription failed with error '${t.message}'`)}}}const{PreparedStatement:Xe}=w;class Qe{static async select(t){const e=new Xe({name:`User.select.${Math.random()}`,text:'SELECT "publicKey", "clientTimestamp" FROM "User" WHERE "publicKey" = $1',values:[t]});const s=await re.oneOrNone(e);return s?{publicKey:s.publicKey,clientTimestamp:parseInt(s.clientTimestamp,10)||0}:null}static async insert({publicKey:t,clientTimestamp:e}){const s=new Xe({name:`User.insert.${Math.random()}`,text:'INSERT INTO "User"("publicKey", "clientTimestamp") VALUES ($1, $2)',values:[t,e]});await re.none(s)}static async update({publicKey:t,clientTimestamp:e}){const s=new Xe({name:`User.update.${Math.random()}`,text:'UPDATE "User" SET "clientTimestamp"=$1 WHERE "publicKey"=$2',values:[e,t]});await re.none(s)}}class ts{static async select(t){return Qe.select(t)}static async insert(t){return Qe.insert(t)}static async update(t){return Qe.update(t)}}const{ec:es}=R;const ss=new es("secp256k1");const rs=s();const as=new class{configFile;loaded=!1;load=()=>{try{const t=ee()?"bcn.test.config.json":"bcn.config.json";const e=O(N(import.meta.url));this.configFile=i.readFileSync(x.join(e,"..","..",t)),this.loaded=!0}catch(t){if(t.message.includes("ENOENT: no such file or directory"))return void(this.loaded=!0);throw te.error(`Access-list failed with error '${t.message}'`),t}};middleware=({url:t},e,s)=>{if(void 0!==e.locals.authToken)if(this.loaded||(te.warn("Access-list failed with error 'AccessList not loaded.'. Loading now."),this.load()),void 0!==this.configFile)try{const{blacklist:t,whitelist:r}=JSON.parse(this.configFile.toString());if(t&&r)return void e.status(403).json({error:"Cannot enforce blacklist and whitelist at the same time."});const{publicKey:a}=e.locals.authToken;if(r&&!r.includes(a)||t&&t.includes(a))return void e.status(403).json({error:`Public key ${a} is not allowed.`});s()}catch(s){te.error(`Authorization failed at ${t} with error: '${s.message}'`),e.status(403).json({error:s.message})}else s();else s()}};let ns;try{ns=r.createServer(rs)}catch(t){throw te.error(`Starting server failed with error '${t.message}'`),t}if(te.info(`Server listening on port ${Tt}`),rs.use(e()),"dev"!==bt){const t=n({windowMs:9e5,max:300,standardHeaders:!0,legacyHeaders:!1});rs.use(t)}rs.use(t.json({limit:"100mb"})),rs.use(t.urlencoded({limit:"100mb",extended:!0})),rs.get("/",((t,e)=>e.status(200).send(`<h2>Bitcoin Computer Node</h2> <b>Status</b> healthy <br /><b>Version</b> ${Bt}`))),as.loaded&&(rs.use((async(t,e,s)=>{try{const r=t.get("Authentication");if(!r){const{method:s,url:r}=t;const a=`Auth failed with error 'no Authentication key provided' ${s} ${t.get("Host")} ${r}`;return te.error(a),void e.status(401).json({error:a})}const a=(t=>{const e=t.split(" ");if(2!==e.length||"Bearer"!==e[0])throw new Error("Authentication header is invalid.");const s=Buffer.from(e[1],"base64").toString().split(":");if(3!==s.length)throw new Error;return{signature:s[0],publicKey:s[1],timestamp:parseInt(s[2],10)}})(r);const{signature:n,publicKey:o,timestamp:i}=a;if(Date.now()-i>1e3*Kt*60)return void e.status(401).json({error:"Signature is too old."});const c=I.sha256().update(Rt+i).digest("hex");if(!ss.keyFromPublic(o,"hex").verify(c,n)){const t="The origin and public key pair doesn't match the signature.";return void e.status(401).json({error:t})}const d=await ts.select(o);if(d){if(d.clientTimestamp>=i)return void e.status(401).json({error:"Please use a fresh authentication token."});await ts.update({publicKey:o,clientTimestamp:i})}else await ts.insert({publicKey:o,clientTimestamp:i});e.locals.authToken=a,s()}catch(t){te.error(`Auth failed with error '${t.message}'`),e.status(401).json({error:t.message})}})),rs.use(as.middleware));const os=(()=>{const t=s.Router();return t.get("/wallet/:address/utxos",(async({params:t,url:e},s)=>{try{const{address:e}=t;s.status(200).json(await ue.select(e))}catch(t){te.error(`GET ${e} failed with error '${t.message}'`),s.status(404).json({error:t.message})}})),t.get("/non-standard-utxos",(async(t,e)=>{try{const s=new URLSearchParams(t.url.split("?")[1]);const r={mod:s.get("mod"),publicKey:s.get("publicKey"),hash:s.get("hash"),limit:s.get("limit"),order:s.get("order"),offset:s.get("offset"),ids:JSON.parse(s.get("ids"))};const a=await Te.query(r);e.status(200).json(a)}catch(s){te.error(`GET ${t.url} failed with error '${s.messages}'`),e.status(404).json({error:s.message})}})),t.get("/address/:address/balance",(async({params:t,url:e},s)=>{try{const{address:e}=t;s.status(200).json(await ue.getBalance(e))}catch(t){te.error(`GET ${e} failed with error '${t.message}'`),s.status(404).json({error:t.message})}})),t.post("/tx/bulk",(async({body:{txIds:t},url:e},s)=>{try{if(void 0===t||0===t.length)return void s.status(500).json({error:"Missing input txIds."});const e=await _e.getRaw(t);e?s.status(200).json(e):s.status(404).json({error:"Not found"})}catch(t){te.error(`POST ${e} failed with error '${t.message}'`),s.status(500).json({error:t.message})}})),t.post("/tx/post",(async({body:{hex:t},url:e},s)=>{try{if(!t)return void s.status(500).json({error:"Missing input hex."});const e=await _e.sendRaw(t);e?s.status(200).json(e):s.status(404).json({error:"Error Occured"})}catch(r){te.error(`POST ${e} failed with error '${r.message}\ntxHex: ${t}`),s.status(500).json({error:r.message})}})),t.get("/mine",(async({query:{count:t},url:e},s)=>{try{const{result:e}=await He.getnewaddress();if("string"!=typeof t)throw new Error("Please provide appropriate count");return await He.generatetoaddress(parseInt(t,10)||1,e),s.status(200).json({success:!0})}catch(t){return te.error(`POST ${e} failed with error '${t.message}'`),s.status(500).json({error:t.message})}})),t.get("/:id/height",(async({params:{id:t},url:e},s)=>{try{let e=t;if("best"===t){const{result:t}=await He.getbestblockhash();e=t}const{result:r}=await He.getblockheader(e,!0);return s.status(200).json({height:r.height})}catch(t){return te.error(`POST ${e} failed with error '${t.message}'`),s.status(500).json({error:t.message})}})),t.post("/faucet",(async({body:{address:t,value:e},url:s},r)=>{try{const s=(await He.sendtoaddress(t,parseInt(e,10)/1e8,"","")).result;const a=(await He.getrawtransaction(s,1)).result.vout.findIndex((t=>1e8*t.value===parseInt(e,10)));return r.status(200).json({txId:s,vout:a,height:-1,satoshis:e})}catch(t){return te.error(`POST ${s} failed with error '${t.message}'`),r.status(500).json({error:t.message})}})),t.post("/faucetScript",(async({body:{script:t,value:e},url:s},r)=>{try{const s=De.makeRandom({network:Ke});const a=l.p2pkh({pubkey:s.publicKey,network:Ke});const{address:n}=a;const o=(await He.sendtoaddress(n,2*parseInt(e,10)/1e8,"","")).result;let i;let c=10;for(;!i;)if(i=(await ue.select(n)).filter((t=>t.txId===o))[0],!i){if(c-=1,c<=0)throw new Error("No outputs");await ke(10)}const d=(await He.getrawtransaction(i.txId,1)).result;const p=new u({network:Ke});p.addInput({hash:i.txId,index:i.vout,nonWitnessUtxo:Buffer.from(d.hex,"hex")}),p.addOutput({script:Buffer.from(t,"hex"),value:parseInt(e,10)}),p.signInput(0,s),p.finalizeAllInputs();const m=p.extractTransaction();let h;for(await He.sendrawtransaction(m.toHex()),c=5;!h;)if(h=(await ue.selectByScriptHex(t)).filter((t=>t.txId===m.getId()))[0],!h){if(c-=1,c<=0)throw new Error("No outputs");await ke(10)}return r.status(200).json({txId:m.getId(),vout:h.vout,height:-1,satoshis:h.satoshis})}catch(t){return te.error(`POST ${s} failed with error '${t.message}'`),r.status(500).json({error:t.message})}})),t.get("/tx/:txId/json",(async({params:{txId:t},url:e},s)=>{try{if(!t)return void s.status(500).json({error:"Missing input txId."});const e=await _e.getRawJSON(t);e?s.status(200).json(e):s.status(404).json({error:"Not found"})}catch(t){te.error(`GET ${e} failed with error '${t.message}'`),s.status(500).json({error:t.message})}})),t.post("/revs",(async({body:{ids:t},url:e},s)=>{try{if(void 0===t||0===t.length)return void s.status(404).json({error:"Missing input object ids."});const e=await Te.getRevsByIds(t);s.status(200).json(e)}catch(t){te.error(`POST ${e} failed with error '${t.message}'`),s.status(404).json({error:t.message})}})),t.post("/revToId",(async({body:{rev:t},url:e},s)=>{try{if(!pe(t))return void s.status(400).json({error:"Invalid rev id"});const e=await Ee.getId(t);e&&s.status(200).json(e),s.status(404).json()}catch(t){te.error(`POST ${e} failed with error '${t.message}'`),s.status(404).json({error:t.message})}})),t.post("/rpc",(async({body:t,url:e},s)=>{try{if(!t||!t.method)throw new Error("Please provide appropriate RPC method name");if(!Ft.some((e=>e.test(t.method))))throw new Error("Method is not allowed");const e=function(t,e){if(void 0===Be[t]||null===Be[t])throw new Error("This RPC method does not exist, or not supported");const s=e.trim().split(" ");const r=Be[t].trim().split(" ");if(0===e.trim().length&&0!==Be[t].trim().length)throw new Error(`Too few params provided. Expected ${r.length} Provided 0`);if(0!==e.trim().length&&0===Be[t].trim().length)throw new Error(`Too many params provided. Expected 0 Provided ${s.length}`);if(s.length<r.length)throw new Error(`Too few params provided. Expected ${r.length} Provided ${s.length}`);if(s.length>r.length)throw new Error(`Too many params provided. Expected ${r.length} Provided ${s.length}`);return 0===e.length?[]:s.map(((t,e)=>Le[r[e]](t)))}(t.method,t.params);const r=e.length?await He[t.method](...e):await He[t.method]();s.status(200).json({result:r})}catch(t){te.error(`POST ${e} failed with error '${t.message}'`),s.status(404).json({error:t.message})}})),t.post("/non-standard-utxo",(async(t,e)=>{e.status(500).json({error:"Please upgrade to @bitcoin-computer/lib to the latest version."})})),t})();rs.use(`/v1/${vt}/${St}`,os),rs.use("/v1/store",ie),ns.listen(Tt,(()=>{te.info(`Rev ${Bt} Started web server on port ${Tt} BC_START_HEIGHT ${Wt}`)})).on("error",(t=>{te.error(t.message),process.exit(1)}));const is=new a.Subscriber;is.connect($t),is.subscribe("rawtx"),te.info(`ZMQ Subscriber connected to ${$t}`),(async()=>{await(async()=>{await E((()=>re.connect()),{startingDelay:Dt})})(),await Ze.sub(is)})();
