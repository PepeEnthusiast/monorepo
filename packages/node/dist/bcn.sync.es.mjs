import{backOff as t}from"exponential-backoff";import{Computer as e}from"@bitcoin-computer/lib";import s from"dotenv";import n from"fs";import a,{Transaction as r}from"@bitcoin-computer/nakamotojs-lib";import o from"winston";import i from"winston-daily-rotate-file";import c from"bitcoind-rpc";import d from"util";import l from"pg-promise";import p from"pg-monitor";s.config();const m=JSON.parse(n.readFileSync("package.json","utf8"));function y(t,e){switch(t){case"BTC":return"mainnet"===e?a.networks.bitcoin:a.networks.testnet;case"LTC":return"mainnet"===e?a.networks.litecoin:a.networks.litecoinregtest;default:throw new Error("We currently only support BTC and LTC, support for other currencies will be added soon.")}}const{PORT:u,ZMQ_URL:h,CHAIN:f,NETWORK:g,BCN_ENV:w,BCN_URL:S,DEBUG_MODE:E,POSTGRES_USER:$,POSTGRES_PASSWORD:R,POSTGRES_DB:T,POSTGRES_HOST:N,POSTGRES_PORT:I,RPC_PROTOCOL:O,RPC_USER:v,RPC_PASSWORD:b,RPC_HOST:M,RPC_PORT:C,SERVER_VERSION:_,DEFAULT_WALLET:A,SYNC_INTERVAL_CHECK:H,POSTGRES_MAX_PARAM_NUM:D,DB_CONNECTION_RETRY_TIME:k,SIGNATURE_FRESHNESS_MINUTES:x,ALLOWED_RPC_METHODS:P,NODE_MAX_PROGRESS:Y,SYNC_MAX_PROGRESS:B,MAX_BLOCKCHAIN_HEIGHT:L,MWEB_HEIGHT:F,BC_START_HEIGHT:W,WORKER_ID:K,NUM_WORKERS:U,SYNC_NON_STANDARD:G,ZMQ_WAIT_PERCENTAGE:j,QUERY_LIMIT:V,LOG_MAX_FILE_SIZE:z,LOG_MAX_FILE_NUM:q,LOG_ZIP:X,RPC_URL:Z,RPC_BATCHSIZE:J,RPC_CONCURRENT:Q,INDEXDB:tt,KEYDB:et}=process.env;const st=f||"LTC";const nt=g||"regtest";const at=w||"dev";const rt=S||"http://127.0.0.1:3000";const ot=parseInt(E,10)||1;const it=$||"bcn";const ct=R||"bcn";const dt=T||"bcn";const lt=N||"127.0.0.1";const pt=parseInt(I,10)||"5432";const mt=O||"http";const yt=v||"bcn-admin";const ut=b||"kH4nU5Okm6-uyC0_mA5ztVNacJqZbYd_KGLl6mx722A=";const ht=M||"node";const ft=parseInt(C,10)||19332;m.version;const gt=parseInt(D,10)||1e4;const wt=parseInt(k,10)||500;!P||P.split(",").map((t=>new RegExp(t)));const St=parseInt(W||"",10)||25e5;const Et=parseInt(K,10)||1;const $t=parseInt(U||"",10)||1;const Rt="true"===G||!1;const Tt=parseInt(V||"",10)||100;const Nt=z||"20m";const It=q||"14d";const Ot=!!X;o.addColors({error:"red",warn:"yellow",info:"green",http:"magenta",debug:"white"});const vt=o.format.combine(o.format.colorize(),o.format.timestamp({format:"YYYY-MM-DD HH:mm:ss:ms"}),o.format.json(),o.format.printf((t=>`${t.timestamp} [${t.level.slice(5).slice(0,-5)}] ${t.message}`)));const bt={zippedArchive:Ot,maxSize:Nt,maxFiles:It,dirname:"logs"};const Mt=[];"dev"===at&&Mt.push(new o.transports.Console({format:o.format.combine(o.format.colorize(),o.format.timestamp({format:"MM-DD-YYYY HH:mm:ss"}),o.format.printf((t=>`${t.timestamp} ${t.level} ${t.message}`)))})),ot>=0&&Mt.push(new i({filename:"error-%DATE%.log",datePattern:"YYYY-MM-DD",level:"error",...bt})),ot>=1&&Mt.push(new i({filename:"warn-%DATE%.log",datePattern:"YYYY-MM-DD",level:"warn",...bt})),ot>=2&&Mt.push(new i({filename:"info-%DATE%.log",datePattern:"YYYY-MM-DD",level:"info",...bt})),ot>=3&&Mt.push(new i({filename:"http-%DATE%.log",datePattern:"YYYY-MM-DD",level:"http",...bt})),ot>=4&&Mt.push(new i({filename:"debug-%DATE%.log",datePattern:"YYYY-MM-DD",level:"debug",...bt})),Mt.push(new i({filename:"logs-%DATE%.log",datePattern:"YYYY-MM-DD"}));const Ct=o.createLogger({levels:{error:0,warn:1,info:2,http:3,debug:4},format:vt,transports:Mt,exceptionHandlers:[new o.transports.File({filename:"logs/exceptions.log"})],rejectionHandlers:[new o.transports.File({filename:"logs/rejections.log"})]});const _t=new c({protocol:mt,user:yt,pass:ut,host:ht,port:ft});const At=d.promisify(c.prototype.createwallet.bind(_t));const Ht=d.promisify(c.prototype.generateToAddress.bind(_t));const Dt=d.promisify(c.prototype.getaddressinfo.bind(_t));const kt=d.promisify(c.prototype.getBlock.bind(_t));const xt=d.promisify(c.prototype.getBlockchainInfo.bind(_t));const Pt=d.promisify(c.prototype.getBlockHash.bind(_t));const Yt=d.promisify(c.prototype.getRawTransaction.bind(_t));const Bt=d.promisify(c.prototype.getRawTransaction.bind(_t));const Lt=d.promisify(c.prototype.getTransaction.bind(_t));const Ft=d.promisify(c.prototype.getNewAddress.bind(_t));const Wt={createwallet:At,generateToAddress:Ht,getaddressinfo:Dt,getBlock:kt,getBlockchainInfo:xt,getBlockHash:Pt,getRawTransaction:Yt,getTransaction:Lt,importaddress:d.promisify(c.prototype.importaddress.bind(_t)),listunspent:d.promisify(c.prototype.listunspent.bind(_t)),sendRawTransaction:d.promisify(c.prototype.sendRawTransaction.bind(_t)),getNewAddress:Ft,sendToAddress:d.promisify(c.prototype.sendToAddress.bind(_t)),getRawTransactionJSON:Bt};const Kt={error:(t,e)=>{if(e.cn){const{host:s,port:n,database:a,user:r,password:o}=e.cn;Ct.debug(`Waiting for db to start { message:${t.message} host:${s}, port:${n}, database:${a}, user:${r}, password: ${o}`)}},noWarnings:!0};"dev"===at&&ot>0&&(p.isAttached()?p.detach():(p.attach(Kt),p.setTheme("matrix")));const Ut=l(Kt)({host:lt,port:pt,database:dt,user:it,password:ct,allowExitOnIdle:!0,idleTimeoutMillis:100});const{PreparedStatement:Gt}=l;class jt{static async select(t){const e=new Gt({name:`SyncStatus.select.${Math.random()}`,text:'SELECT "syncedHeight" FROM "SyncStatus" WHERE "workerId" = $1',values:[t]});return Ut.one(e)}static async update({syncedHeight:t,workerId:e}){const s=new Gt({name:`SyncStatus.update.${Math.random()}`,text:'UPDATE "SyncStatus" SET "syncedHeight" = $1 WHERE "workerId" = $2',values:[t,e]});await Ut.any(s)}static async insert({syncedHeight:t,workerId:e}){const s=new Gt({name:`SyncStatus.insert.${Math.random()}`,text:'INSERT INTO  "SyncStatus"("syncedHeight","workerId") VALUES ($1, $2) ON CONFLICT DO NOTHING',values:[t,e]});await Ut.any(s)}}class Vt{static async select(t){return jt.select(t)}static async update(t){await jt.update(t)}static async insert(t){await jt.insert(t)}}class zt{static updateSync=async t=>Vt.update(t);static selectSync=async t=>Vt.select(t);static insertSync=async t=>Vt.insert(t)}function qt(t){if(!/^[0-9A-Fa-f]{64}:\d+$/.test(t))throw new Error("Invalid rev")}const{PreparedStatement:Xt}=l;class Zt{static async query(t){const{publicKey:e,hash:s,limit:n,offset:a,order:r,ids:o,mod:i}=t;if(n&&parseInt(n||"",10)>Tt||o&&o.length>Tt)throw new Error(`Can't fetch more than ${Tt} revs.`);if(r&&"ASC"!==r&&"DESC"!==r)throw new Error("Invalid order");let c='SELECT "rev"\n      FROM "NonStandard"\n      WHERE true ';const d=[];e&&(d.push(e),c+=` AND $${d.length} = ANY ("publicKeys")`),s&&(d.push(s),c+=` AND "hash" = $${d.length}`),i&&(d.push(i),c+=` AND "mod" = $${d.length}`),o&&o.length&&(o.map(qt),d.push(o),c+=` AND "id" = ANY ($${d.length})`),r&&(c+=` order by "lastUpdated" ${r}`),d.push(n||Tt),c+=` limit $${d.length}`,a&&(d.push(a),c+=` offset $${d.length}`);const l=new Xt({name:`NonStandard.query.${Math.random()}`,text:c,values:d});return(await Ut.any(l)).map((t=>t.rev))}static async insert({id:t,rev:e,publicKeys:s,hash:n,mod:a}){const r=new Xt({name:`NonStandard.insert.${Math.random()}`,text:'INSERT INTO "NonStandard"("id", "rev", "publicKeys", "hash", "mod") VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING',values:[t,e,s,n,a]});await Ut.none(r)}static async update({id:t,rev:e,publicKeys:s}){const n=new Xt({name:`NonStandard.update.${Math.random()}`,text:'UPDATE "NonStandard" SET "rev"=$2, "publicKeys"=$3 WHERE "id" = $1',values:[t,e,s]});return Ut.none(n)}static async delete({rev:t}){const e=new Xt({name:`NonStandard.delete.${Math.random()}`,text:'DELETE FROM "NonStandard" WHERE "rev" = $1',values:[t]});await Ut.none(e)}static async getRevsByIds(t){if(t&&t.length>Tt)throw new Error(`Can't fetch more than ${Tt} revs.`);const e=new Xt({name:`NonStandard.getRevsByIds.${Math.random()}`,text:'SELECT "rev" FROM "NonStandard" WHERE "id" LIKE ANY($1)',values:[[t]]});return Ut.any(e)}static async select(t){const e=new Xt({name:`NonStandard.select.${Math.random()}`,text:'SELECT "id", "hash", "mod" FROM "NonStandard" WHERE "rev" = $1',values:[t]});return Ut.oneOrNone(e)}}class Jt{static async select(t){return Zt.select(t)}static async query(t){return Zt.query(t)}static async getRevsByIds(t){return Zt.getRevsByIds(t)}static async insert(t){return Zt.insert(t)}static async update(t){return Zt.update(t)}static async delete(t){return Zt.delete({rev:t})}}class Qt{static add=async t=>{const{zip:e,outData:s}=t;e.sort((([t],[e])=>!t&&e?-1:t&&e?0:t&&!e?1:0));for(let t=0;t<e.length;t+=1){const[n,r]=e[t];const{exp:o="",_owners:i=[],mod:c=""}=s[t]||{};if(!n&&r)qt(r),await Jt.insert({id:r,rev:r,publicKeys:i,hash:a.crypto.sha256(Buffer.from(o)).toString("hex"),mod:c});else if(n&&r){const{id:t,hash:e,mod:s}=await Jt.select(n)||{};await Jt.update({id:t,rev:r,publicKeys:i,hash:e,mod:s})}else n&&!r&&await Jt.delete(n)}};static query=async t=>Jt.query(t);static getRevsByIds=async t=>(await Jt.getRevsByIds(t)).map((t=>t.rev))}const{PreparedStatement:te}=l;class ee{static async select(t){const e=new te({name:`Input.select.${Math.random()}`,text:'SELECT "rev" FROM "Input" WHERE "rev" = $1',values:[t]});return Ut.any(e)}static async insert(t){const e=t.flatMap((t=>[t.rev]));for(;e.length;){const t=e.splice(0,gt);const s=[];for(let e=1;e<=t.length;e+=1)s.push(`($${e})`);const n=s.join(",");const a=new te({name:`Input.insert.${Math.random()}`,text:`INSERT INTO "Input"("rev") VALUES ${n} ON CONFLICT DO NOTHING`,values:t});await Ut.none(a)}}static async count(t){const e=t.map((t=>t.rev));const s=new te({name:`Input.belong.${Math.random()}`,text:'SELECT count(*) FROM "Input" WHERE "rev" LIKE ANY ($1)',values:[[e]]});const n=await Ut.oneOrNone(s);return parseInt(n?.count,10)||0}}class se{static async select(t){return ee.select(t)}static async insert(t){return ee.insert(t)}}class ne{static getNonCoinbaseRevs=t=>t.filter((t=>!r.isCoinbaseHash(t.hash))).map((({hash:t,index:e})=>({rev:`${a.bufferUtils.reverseBuffer(Buffer.from(t)).toString("hex")}:${e}`})));static insert=async t=>se.insert(this.getNonCoinbaseRevs(t))}const{PreparedStatement:ae}=l;class re{static async select(t){const e=new ae({name:`Output.select.${Math.random()}`,text:'SELECT "address", "satoshis", "scriptPubKey", "rev" FROM "Output" WHERE "address" = $1',values:[t]});return Ut.any(e)}static async insert(t){const e=t.flatMap((t=>[t.rev,t.address,t.satoshis,t.scriptPubKey,t.publicKeys]));for(;e.length;){const t=e.splice(0,gt);const s=[];for(let e=1;e<=t.length;e+=5)s.push(`($${e}, $${e+1}, $${e+2}, $${e+3}, $${e+4})`);const n=s.join(",");const a=new ae({name:`Output.insert.${Math.random()}`,text:`INSERT INTO "Output"("rev", "address", "satoshis", "scriptPubKey", "publicKeys") VALUES ${n}  ON CONFLICT DO NOTHING`,values:t});await Ut.none(a)}}}class oe{static async select(t){return re.select(t)}static async insert(t){return re.insert(t)}}class ie{static insert=async t=>{const e=t.flatMap((t=>t.tx.outs.map(((e,s)=>{const{script:n}=e;let r;let o;try{r=a.address.fromOutputScript(n,y(st,nt))}catch(t){r=null}try{o=a.payments.p2ms({output:n,network:y(st,nt)}).pubkeys.map((t=>t.toString("hex")))}catch(t){o=null}const i=n.toString("hex");const c=Math.round(e.value);return{address:r,rev:`${t.txId}:${s}`,scriptPubKey:i,satoshis:c,publicKeys:o}}))));return oe.insert(e)}}const ce=new e({chain:st,network:nt,url:rt});class de{static waitForBlock=async e=>{await t((async()=>{Ct.info(`Sync workerId ${Et}: waiting for block ${e} ...`),await Wt.getBlockHash(e)}),{startingDelay:3e4,timeMultiple:1,numOfAttempts:720}),Ct.info(`Node is ready. Starting Sync actions for worker ${Et}`)};static syncBlock=async t=>{const{result:e}=await Wt.getBlockHash(t);const{result:s}=await Wt.getBlock(e,2);const{tx:n}=s;Ct.info(`Backfilling progress ${t} Backfilling ${n.length} transactions...`);const a=await Promise.allSettled(n.map((t=>ce.txFromHex({hex:t.hex}))));const r=a.filter((t=>"fulfilled"===t.status)).map((t=>t.value));const o=a.filter((t=>"rejected"===t.status)).map((t=>t.reason));var i,c;o.length&&Ct.error(`Failed to parse ${o.length} transactions of block num ${t}: ${o.map((t=>t)).join(", ")}\n        Failed txs: ${i=n.map((t=>t.id)),c=r.map((t=>t.tx.getId())),i.filter((t=>-1===c.indexOf(t)))}`),await this.syncTxs(r,t)};static sync=async(t,e,s,n)=>{try{let a=e;const r=await zt.selectSync(t);for(r.syncedHeight>e&&(a=r.syncedHeight+s),Ct.info(`Starting sync process { initialBlock: ${e} increment: ${s} nonStandard: ${n} syncedHeight:${r.syncedHeight}, currentBlockHeight:${a} }`);n||a<St;)try{await this.syncBlock(a),await zt.updateSync({syncedHeight:a,workerId:t}),a+=s}catch(t){t.message.includes("out of range")||Ct.error(`Syncing block num ${a} failed with error '${t.message}'`)}}catch(t){Ct.error(`Sync action failed with error '${t.message}'`)}};static syncTxs=async(t,e)=>{try{await ie.insert(t),await ne.insert(t.flatMap((t=>t.tx.ins))),e>=St&&t.map((async t=>{try{t.isBcTx(st,nt)&&await Qt.add(t)}catch(e){Ct.error(`Failed to add non-standard tx ${t.tx.getId()} ${e.message}`)}}))}catch(t){Ct.error(`Processing block ${e} failed with error '${t.message}'`)}};static register=async t=>{try{await zt.insertSync({syncedHeight:-1,workerId:t}),Ct.info(`Register workerId: '${t}'`)}catch(t){Ct.error(`Register action failed with error '${t.message}'`)}}}!function(){try{const e=`Synchronizing { nonStandard:${Rt} url: ${rt}, chain:${st} network:${nt} numWorkers: ${$t} workerId: ${Et} }`;Ct.info(e),"regtest"!==nt&&(async()=>{if(await(async()=>{await t((()=>Ut.connect()),{startingDelay:wt})})(),await de.register(Et),Rt)await de.waitForBlock(St),await de.sync(Et,St,1,Rt);else{const t=await zt.selectSync(Et);const e=t.syncedHeight>0?t.syncedHeight+1:Et;Ct.info(`Worker ${Et} waiting for block ${e}...`),await de.waitForBlock(e),Ct.info(`Worker ${Et} starting sync on block ${e}...`),await de.sync(Et,e,$t,!1)}})()}catch(t){Ct.error(`Synchronizing failed with error '${t.message}'`)}}();
