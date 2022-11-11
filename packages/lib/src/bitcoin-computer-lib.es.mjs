import t from "@bitcoin-computer/bitcore-mnemonic-ltc";
import e from "axios";
import n from "crypto";
import r from "crypto-js";
import * as s from "eciesjs";
import { StaticModuleRecord as o } from "@endo/static-module-record";
import "ses";
function i(t, e) {
  var n = {};
  for (var r in t)
    Object.prototype.hasOwnProperty.call(t, r) &&
      e.indexOf(r) < 0 &&
      (n[r] = t[r]);
  if (null != t && "function" == typeof Object.getOwnPropertySymbols) {
    var s = 0;
    for (r = Object.getOwnPropertySymbols(t); s < r.length; s++)
      e.indexOf(r[s]) < 0 &&
        Object.prototype.propertyIsEnumerable.call(t, r[s]) &&
        (n[r[s]] = t[r[s]]);
  }
  return n;
}
function c(t, e, n, r) {
  return new (n || (n = Promise))(function (s, o) {
    function i(t) {
      try {
        a(r.next(t));
      } catch (t) {
        o(t);
      }
    }
    function c(t) {
      try {
        a(r.throw(t));
      } catch (t) {
        o(t);
      }
    }
    function a(t) {
      var e;
      t.done
        ? s(t.value)
        : ((e = t.value),
          e instanceof n
            ? e
            : new n(function (t) {
                t(e);
              })).then(i, c);
    }
    a((r = r.apply(t, e || [])).next());
  });
}
const {
  CHAIN: a,
  NETWORK: u,
  BCN_URL: d,
  RPC_USER: h,
  RPC_PASSWORD: l,
  TEST_MNEMONICS: p,
} = process.env;
const f = a || "LTC";
const g = u || "testnet";
const v = d || "https://node.bitcoincomputer.io";
const m =
  parseInt(process.env.BC_DUST_LIMIT || "", 10) || ("LTC" === f ? 15460 : 1546);
const { crypto: w } = t.bitcore;
const b = (t, e) => {
  const n = Date.now();
  const r = w.Hash.sha256(Buffer.from(e + n));
  const s = [
    w.ECDSA.sign(r, t, "big").toString("hex"),
    t.publicKey.toString(),
    n,
  ];
  return `Bearer ${Buffer.from(s.join(":")).toString("base64")}`;
};
class y {
  constructor(e = v, n = new t.bitcore.PrivateKey(), r = {}) {
    (this.baseUrl = e), (this.headers = r), (this.privateKey = n);
  }
  get(t) {
    return c(this, void 0, void 0, function* () {
      const n = this.privateKey
        ? { Authentication: b(this.privateKey, this.baseUrl) }
        : {};
      return (yield e.get(`${this.baseUrl}${t}`, {
        headers: Object.assign(Object.assign({}, this.headers), n),
      })).data;
    });
  }
  post(t, n) {
    return c(this, void 0, void 0, function* () {
      const r = this.privateKey
        ? { Authentication: b(this.privateKey, this.baseUrl) }
        : {};
      return (yield e.post(`${this.baseUrl}${t}`, n, {
        headers: Object.assign(Object.assign({}, this.headers), r),
      })).data;
    });
  }
  delete(t) {
    return c(this, void 0, void 0, function* () {
      const n = this.privateKey
        ? { Authentication: b(this.privateKey, this.baseUrl) }
        : {};
      return (yield e.delete(`${this.baseUrl}${t}`, {
        headers: Object.assign(Object.assign({}, this.headers), n),
      })).data;
    });
  }
}
parseInt(process.env.BC_DEFAULT_FEE || "", 10),
  parseInt(process.env.BC_SCRIPT_CHUNK_SIZE || "", 10),
  parseInt(process.env.MWEB_HEIGHT || "", 10);
const { PublicKey: _, crypto: x } = t.bitcore;
const { Point: O } = x;
function j(t) {
  return Buffer.from(t, "hex").toString().replace(/\0/g, "");
}
function S(t, e) {
  return t.slice(e) + t.slice(0, e);
}
function $(t, e, n) {
  if (t.length * Math.log2(e) > 53)
    throw new Error(`Input too large ${t.length} ${Math.log2(e)}`);
  if (![2, 10, 16].includes(e) || ![2, 10, 16].includes(n))
    throw new Error("ToBase or FromBase invalid in covertNumber.");
  if (2 === e && t.length % 8 != 0)
    throw new Error("Binary strings must be byte aligned.");
  if (16 === e && t.length % 2 != 0)
    throw new Error("Hex strings must be of even length.");
  const r = parseInt(t, e).toString(n);
  return 2 === n
    ? r.padStart(8 * Math.ceil(r.length / 8), "0")
    : 16 === n
    ? r.padStart(2 * Math.ceil(r.length / 2), "0")
    : r;
}
function C(t, e) {
  const n = new RegExp(`.{1,${e}}`, "g");
  return t.match(n) || [];
}
function E(t) {
  return C(t, 2)
    .map((t) => $(t, 16, 2))
    .join("");
}
function I(t) {
  return C(t, 8)
    .map((t) => $(t, 2, 16))
    .join("");
}
function T(t) {
  return t.toString(16).padStart(3, "0");
}
function K(t) {
  return parseInt(t, 16);
}
function k(t) {
  if (62 !== t.length)
    throw new Error("Input to hexToPublicKey must be of length 62");
  let e = !1;
  let n = 0;
  let r;
  for (; !e; ) {
    if (n >= 256) throw new Error("Something went wrong storing data");
    const s = n.toString(16).padStart(2, "0") + I(S(E(t).padStart(64, "0"), n));
    try {
      (r = O.fromX(!1, s)), (e = !0);
    } catch (t) {
      n += 1;
    }
  }
  if (!r) throw new Error("Something went wrong storing data");
  return new _(r);
}
function A(t) {
  const e = t.point.getX().toString("hex").padStart(64, "0");
  const n = $(e.slice(0, 2), 16, 10);
  return I(
    ((s = parseInt(n, 10)), (r = E(e.slice(2))).slice(-s) + r.slice(0, -s))
  );
  var r, s;
}
function B(t, e) {
  const n = {
    "any-testnet": "uTKUDCkpo12vstJBsMWmrTPz9wFE6DuzGH",
    "BTC-mainnet": "igpnnoLziUyxtQuWYCP13gHYVhUru6iLaY",
    "LTC-mainnet": "t77o829ngHnuUorwDkf129fL6ERLFNqKG8",
    "DOGE-mainnet": "XfNRUdvrv6uCDbCF5xJ18UYwVkkefkXvEd",
    "BCH-mainnet": "CSAkkS8Mro9mYRqhksS1FyYrsnSE5MVQ5m",
  };
  return S(
    "testnet" === e || "regtest" === e ? n["any-testnet"] : n[`${t}-${e}`],
    19
  );
}
function R(t = f, e = g) {
  if ("testnet" === e || "regtest" === e) return 1;
  if ("BTC" === t) return 0;
  if ("LTC" === t) return 2;
  if ("DOGE" === t) return 3;
  if ("BCH" === t) return 145;
  if ("BSV" === t) return 236;
  throw new Error(`Unsupported chain ${t}`);
}
function P({ chain: t = f, network: e = g } = {}) {
  return (function ({ purpose: t = 44, coinType: e = 2, account: n = 0 } = {}) {
    return `m/${t.toString()}'/${e.toString()}'/${n.toString()}'`;
  })({ coinType: R(t, e) });
}
function U(e, n) {
  const r = (function (e, n) {
    return ((t, e, n = {}) => {
      const { path: r = "m/44'/0'/0'/0", passphrase: s = "" } = n;
      let o = t.toHDPrivateKey(s, e);
      return r && (o = o.deriveChild(r)), o.privateKey;
    })(new t("replace this seed"), n, {
      path: P({ chain: e, network: n }),
      passphrase: "",
    });
  })(e, n);
  return _.fromPrivateKey(r);
}
function D({
  mnemonic: e = new t(),
  path: n = P(),
  passphrase: r = "",
  network: s = g,
}) {
  return e.toHDPrivateKey(r, s).deriveChild(n);
}
function H(t) {
  return {
    smartArgs: t.filter((t) => t._rev),
    dumbArgs: t.map((t) => (t._rev ? "__" : t)),
  };
}
function N(t) {
  return /^[0-9A-Fa-f]{64}\/\d+$/.test(t);
}
function F(t) {
  if (!/^[0-9A-Fa-f]{64}$/.test(t)) throw new Error(`Invalid txId: ${t}`);
}
function M(t) {
  if (!/^[0-9A-Fa-f]{64}\/\d+$/.test(t)) throw new Error(`Invalid outId: ${t}`);
}
function L(t) {
  M(t);
  const [e, n] = t.split("/");
  return { txId: e, outputIndex: parseInt(n, 10) };
}
const { Transaction: q } = t.bitcore;
const { UnspentOutput: W } = q;
class J {
  constructor({
    chain: e,
    network: n,
    mnemonic: r,
    path: s,
    passphrase: o,
    url: i,
  } = {}) {
    if (
      ((this.chain = e ? e.toUpperCase() : f),
      (this.network = n ? n.toLowerCase() : g),
      (this.mnemonic = new t(r ? r.toString() : void 0)),
      (this.path = s || P({ chain: this.chain, network: this.network })),
      (this.passphrase = o || ""),
      (this.bcn = new y(i, this.privateKey)),
      !["LTC", "BTC"].includes(this.chain))
    )
      throw new Error(
        "We currently only support LTC, support for other currencies will be added soon."
      );
    if (!["mainnet", "testnet", "regtest"].includes(this.network))
      throw new Error(
        "Please set 'network' to 'regtest', 'testnet', or 'mainnet'"
      );
  }
  get privateKey() {
    return D(this).privateKey;
  }
  getBalance(t) {
    return c(this, void 0, void 0, function* () {
      const { chain: e, network: n } = this;
      return yield this.bcn.get(`/v1/${e}/${n}/address/${t}/balance`);
    });
  }
  getTransactions(t) {
    return c(this, void 0, void 0, function* () {
      return (yield this.getRawTxs(t)).map((t) => new q(t));
    });
  }
  getRawTxs(t) {
    return c(this, void 0, void 0, function* () {
      t.map(F);
      const { chain: e, network: n } = this;
      return this.bcn.post(`/v1/${e}/${n}/tx/bulk/`, { txIds: t });
    });
  }
  sendTransaction(t) {
    return c(this, void 0, void 0, function* () {
      return this.bcn.post(`/v1/${this.chain}/${this.network}/tx/send`, {
        rawTx: t,
      });
    });
  }
  getUtxosByAddress(t) {
    return c(this, void 0, void 0, function* () {
      const { chain: e, network: n } = this;
      return (yield this.bcn.get(
        `/v1/${e}/${n}/wallet/${t.toString()}/utxos`
      )).map(({ rev: t, scriptPubKey: e, satoshis: n }) => {
        const [r, s] = t.split("/");
        return new W({
          txId: r,
          outputIndex: parseInt(s, 10),
          satoshis: n,
          script: e,
        });
      });
    });
  }
  query(t) {
    return c(this, void 0, void 0, function* () {
      const { publicKey: e, classHash: n, limit: r, offset: s, order: o } = t;
      if (void 0 === e && void 0 === n)
        throw new Error("Query parameters cannot be empty.");
      let i = "";
      e && (i += `?publicKey=${e}`),
        n && ((i += 0 === i.length ? "?" : "&"), (i += `classHash=${n}`)),
        void 0 !== r && (i += `&limit=${r}`),
        void 0 !== s && (i += `&offset=${s}`),
        o && (i += `&order=${o}`);
      const { chain: c, network: a } = this;
      return this.bcn.get(`/v1/${c}/${a}/non-standard-utxos${i}`);
    });
  }
  idsToRevs(t) {
    return c(this, void 0, void 0, function* () {
      t.map(M);
      const { chain: e, network: n } = this;
      return this.bcn.post(`/v1/${e}/${n}/revs`, { ids: t });
    });
  }
  rpc(t, e) {
    return c(this, void 0, void 0, function* () {
      return this.bcn.post(`/v1/${this.chain}/${this.network}/rpc`, {
        method: t,
        params: e,
      });
    });
  }
  static getSecretOutput({ _url: t, privateKey: e }) {
    return c(this, void 0, void 0, function* () {
      const n = t.split("/");
      const r = n[n.length - 1];
      const s = n.slice(0, -2).join("/");
      const o = new y(s, e);
      return { host: s, data: yield o.get(`/v1/store/${r}`) };
    });
  }
  static setSecretOutput({ secretOutput: t, host: e, privateKey: n }) {
    return c(this, void 0, void 0, function* () {
      return new y(e, n).post("/v1/store/", t);
    });
  }
  static deleteSecretOutput({ _url: t, privateKey: e }) {
    return c(this, void 0, void 0, function* () {
      const n = t.split("/");
      const r = n[n.length - 1];
      const s = n.slice(0, -2).join("/");
      const o = new y(s, e);
      yield o.delete(`/v1/store/${r}`);
    });
  }
  get url() {
    return this.bcn.baseUrl;
  }
}
const { PublicKey: z, Script: G } = t.bitcore;
function Y(t, e, n, r) {
  if (t.length > 3) throw new Error("Too many owners");
  return (function (t, e, n, r) {
    const s = r ? [...t, U(e, n).toBuffer()] : t;
    const o = new G();
    return (
      o.add("OP_1"),
      s.forEach((t) => {
        o.add(t);
      }),
      o.add(`OP_${s.length}`),
      o.add("OP_CHECKMULTISIG"),
      o
    );
  })(
    t.map((t) => t.toBuffer()),
    e,
    n,
    r
  );
}
function V(t, e) {
  return (function (t, e) {
    const n = t.chunks.filter((t) => t.buf);
    return (e ? n.slice(0, -1) : n).map((t) => t.buf);
  })(t, e).map((t) => z.fromBuffer(t));
}
function X(t) {
  return Buffer.from(r.SHA256(t).toString(), "hex")
    .toString("hex")
    .substr(0, 4);
}
function Q(t) {
  return `${X(t)};${t}`;
}
function Z(t) {
  const e = t.substr(0, 4);
  const n = t.substr(5);
  if (
    !(function (t, e) {
      return X(t) === e;
    })(n, e)
  )
    throw new Error("Decryption failure");
  return n;
}
function tt(t) {
  if (void 0 !== t._readers) {
    const { _readers: e, _url: o, _owners: c, _amount: a } = t,
      u = i(t, ["_readers", "_url", "_owners", "_amount"]);
    const d = (function (t, e) {
      const o = n.randomBytes(32).toString("hex");
      const i = (function (t, e) {
        if (!/^[0-9a-f]{64}$/.test(e)) throw new Error("Invalid secret");
        const n = Buffer.from(e, "hex").toString("binary");
        const s = Q(t);
        return r.AES.encrypt(s, n).toString();
      })(t, o);
      const c = e.map((t) =>
        (function (t, e) {
          if (!/^0[2-3][0-9a-f]{64}|04[0-9a-f]{128}$/.test(e))
            throw new Error("Invalid publicKey");
          const n = Q(t);
          return s.encrypt(e, Buffer.from(n, "utf8")).toString("base64");
        })(o, t)
      );
      return { __cypher: i, __secrets: c };
    })(JSON.stringify(u), e);
    return (
      void 0 !== o && (d._url = o),
      void 0 !== c && (d._owners = c),
      void 0 !== a && (d._amount = a),
      d
    );
  }
  return t;
}
const { Transaction: et } = t.bitcore;
const { Output: nt, UnspentOutput: rt } = et;
class st {
  constructor({ restClient: t = new J() } = {}) {
    (this.tx = new et()),
      this.tx.feePerKb(2e4),
      (this.outData = []),
      (this.restClient = t);
  }
  get txId() {
    return this.tx.id;
  }
  get chain() {
    return this.restClient.chain;
  }
  get network() {
    return this.restClient.network;
  }
  get inputs() {
    return this.tx.inputs.map(
      (t) => `${t.prevTxId.toString("hex")}/${t.outputIndex}`
    );
  }
  get inRevs() {
    const { enc: t } = this;
    let [e] = t;
    return (
      (e = Number.isFinite(e) ? e : 0),
      this.tx.inputs
        .slice(0, e)
        .map(({ prevTxId: t, outputIndex: e }) => `${t.toString("hex")}/${e}`)
    );
  }
  get outRevs() {
    const { enc: t } = this;
    let [, e] = t;
    return (
      (e = Number.isFinite(e) ? e : 0),
      Array.from(Array(e).keys()).map((t) => `${this.tx.id}/${t}`)
    );
  }
  get opReturns() {
    try {
      const { outputs: t } = this.tx;
      return t
        .filter(({ script: t }) => t.isDataOut())
        .map(({ script: t }) => t.getData())
        .map((t) => t.toString())
        .join();
    } catch (t) {
      return "";
    }
  }
  get enc() {
    return C(this.opReturns.slice(0, 9), 3).map(K);
  }
  get dataPrefix() {
    return this.opReturns.slice(9);
  }
  isBcdbTx() {
    return this.tx.outputs.some(
      (t) =>
        t.script.toAddress(this.network).toString() ===
        B(this.chain, this.network)
    );
  }
  isFullyFunded() {
    return (
      this.tx._getInputAmount() - this.tx._getOutputAmount() >= this.tx.getFee()
    );
  }
  getOwnerOutputs() {
    const { enc: t } = this;
    const [, e = 0] = t;
    return this.tx.outputs.slice(0, e);
  }
  getDataOutputs() {
    const { enc: t } = this;
    const [, e, n] = t;
    return this.tx.outputs.slice(e, n);
  }
  getOutData() {
    return c(this, void 0, void 0, function* () {
      try {
        const t = this.getDataOutputs()
          .map((t) => t.script)
          .map((t) => V(t, !0))
          .flat()
          .map(A)
          .map(j)
          .join("");
        const { dataPrefix: e } = this;
        const n = JSON.parse(e + t);
        const o = this.restClient.privateKey.toBuffer().toString("hex");
        const a = this.getOwnerOutputs();
        if (a.length !== n.length) throw new Error("Inconsistent state");
        const u = a.map((t, e) =>
          Object.assign(Object.assign({}, n[e]), {
            _owners: V(t.script, !1).map((t) => t.toString()),
            _amount: t.satoshis,
          })
        );
        return Promise.all(
          u.map((t) =>
            c(this, void 0, void 0, function* () {
              try {
                const e = yield (function (t) {
                  return (e) =>
                    c(this, void 0, void 0, function* () {
                      if (
                        (function (t) {
                          return void 0 !== t._url;
                        })(e)
                      ) {
                        const { _url: n } = e,
                          r = i(e, ["_url"]);
                        const { host: s, data: o } = yield J.getSecretOutput({
                          _url: n,
                          privateKey: t,
                        });
                        return Object.assign(
                          Object.assign(Object.assign({}, r), JSON.parse(o)),
                          { _url: s }
                        );
                      }
                      return e;
                    });
                })(this.restClient.privateKey)(t);
                return (function (t, e) {
                  if (
                    (function (t) {
                      return void 0 !== t.__cypher && void 0 !== t.__secrets;
                    })(t)
                  ) {
                    const { __cypher: n, __secrets: o } = t,
                      c = i(t, ["__cypher", "__secrets"]);
                    return Object.assign(
                      Object.assign(
                        Object.assign({}, c),
                        JSON.parse(
                          (function ({ __cypher: t, __secrets: e }, n) {
                            let o = "";
                            if (
                              (n.forEach((n) => {
                                e.forEach((e) => {
                                  try {
                                    const i = (function (t, e) {
                                      if (!/^[0-9a-f]{64}$/.test(e))
                                        throw new Error("Invalid privateKey");
                                      return Z(
                                        s
                                          .decrypt(e, Buffer.from(t, "base64"))
                                          .toString("utf8")
                                      );
                                    })(e, n);
                                    o = (function (t, e) {
                                      if (!/^[0-9a-f]{64}$/.test(e))
                                        throw new Error("Invalid secret");
                                      const n = Buffer.from(e, "hex").toString(
                                        "binary"
                                      );
                                      return Z(
                                        r.AES.decrypt(t, n).toString(r.enc.Utf8)
                                      );
                                    })(t, i);
                                  } catch (t) {
                                    const e = [
                                      "Decryption failure",
                                      "Unsupported state or unable to authenticate data",
                                    ];
                                    if (
                                      t instanceof Error &&
                                      !e.includes(t.message)
                                    )
                                      throw t;
                                  }
                                });
                              }),
                              o)
                            )
                              return o;
                            throw new Error("Decryption failure");
                          })({ __cypher: n, __secrets: o }, e)
                        )
                      ),
                      { _readers: [] }
                    );
                  }
                  return t;
                })(e, [o]);
              } catch (t) {
                return null;
              }
            })
          )
        );
      } catch (t) {
        return [];
      }
    });
  }
  getOwners() {
    return this.getOwnerOutputs().map((t) =>
      V(t.script, !1).map((t) => t.toString())
    );
  }
  getAmounts() {
    return this.getOwnerOutputs().map((t) => t.satoshis);
  }
  spendFromData(e) {
    return c(this, void 0, void 0, function* () {
      if (!e.length) return;
      const n = e.map(L);
      const r = n.map((t) => t.txId);
      const s = yield this.restClient.getTransactions(r);
      for (let e = 0; e < n.length; e += 1) {
        const { txId: r, outputIndex: o } = n[e];
        const { outputs: i } = s[e];
        const c = i[o];
        const a = Math.round(c.satoshis);
        const u = new t.bitcore.Script(c.script);
        const d = new rt({ txId: r, outputIndex: o, satoshis: a, script: u });
        const h = V(u, !1).map((t) => t.toString());
        this.tx.from([d], h, 1, { noSorting: !0 });
      }
    });
  }
  createDataOuts(e) {
    e.forEach(({ _amount: e, _owners: n = [] }) => {
      if (Array.isArray(n) && n.length > 3) throw new Error("Too many owners.");
      const r = n.map((e) => t.bitcore.PublicKey.fromString(e));
      const s = e || m;
      const o = Y(r, this.chain, this.network, !1);
      this.tx.addOutput(new nt({ script: o, satoshis: s }));
    });
    const n = e.map((t) => i(t, ["_amount", "_owners"]));
    const r = m;
    const s = JSON.stringify(n);
    const o = s.slice(0, 71);
    const c = (function (t, e, n, r) {
      var s;
      return (function (t, e) {
        const n = [];
        for (let e = 0; e < t.length; e += 2) n.push(t.slice(e, e + 2));
        return n;
      })(
        C(((s = t), Buffer.from(s).toString("hex")), 62)
          .map((t) => t.padStart(62, "0"))
          .map(k)
      ).map((t) => Y(t, e, n, !0));
    })(s.slice(71), this.chain, this.network);
    const a =
      T(this.tx.inputs.length) +
      T(this.tx.outputs.length) +
      T(this.tx.outputs.length + c.length);
    c.forEach((t) => {
      this.tx.addOutput(new nt({ script: t, satoshis: r }));
    }),
      this.tx.addData(a + o);
  }
  static getBcTx({ hex: t = "", restClient: e = new J() }) {
    const n = new this({ restClient: e });
    return n.tx.fromString(t), (n.outData = []), n;
  }
  static fromTxHex({ hex: t = "", restClient: e = new J() }) {
    return c(this, void 0, void 0, function* () {
      let n = [];
      let r = [];
      let s = [];
      const o = new this({ restClient: e });
      o.tx.fromString(t);
      try {
        n = yield o.getOutData();
      } catch (t) {}
      try {
        r = o.getOwners();
      } catch (t) {}
      try {
        s = o.getAmounts();
      } catch (t) {}
      return (
        (o.outData = n.map((t, e) =>
          Object.assign(Object.assign({}, t), { _owners: r[e], _amount: s[e] })
        )),
        o
      );
    });
  }
  static fromTxId({ txId: t = "", restClient: e = new J() }) {
    return c(this, void 0, void 0, function* () {
      const [n] = yield e.getRawTxs([t]);
      return this.fromTxHex({ hex: n, restClient: e });
    });
  }
}
class ot {
  constructor(t = {}) {
    this.restClient = new J(t);
  }
  derive(t = "0") {
    const e = `${this.path}${this.path.length > 0 ? "/" : ""}${t}`;
    const {
      chain: n,
      network: r,
      url: s,
      mnemonic: o,
      passphrase: i,
    } = this.restClient;
    return new ot({
      chain: n,
      network: r,
      url: s,
      mnemonic: o.toString(),
      path: e,
      passphrase: i,
    });
  }
  getBalance() {
    return c(this, void 0, void 0, function* () {
      return this.restClient.getBalance(this.address);
    });
  }
  getUtxosByAmount(t) {
    return c(this, void 0, void 0, function* () {
      const e = yield this.restClient.getUtxosByAddress(this.address);
      let n = 0;
      const r = [];
      !(function (t) {
        const e = t;
        for (let t = e.length - 1; t > 0; t -= 1) {
          const n = Math.floor(Math.random() * (t + 1));
          [e[t], e[n]] = [e[n], e[t]];
        }
      })(e);
      for (const s of e) if (((n += s.satoshis), r.push(s), n >= t)) return r;
      const { network: s, chain: o } = this.restClient;
      const i = this.address.toString();
      throw new Error(
        `Insufficient balance in address ${i} on ${s} ${o}. Found ${n}, required ${t}.`
      );
    });
  }
  fundAndSendTx(e) {
    return c(this, void 0, void 0, function* () {
      e.tx.feePerKb(4e4);
      const n = e.tx.outputs.length;
      const { chain: r, network: s } = this.restClient;
      e.tx.to(B(r, s), 0);
      const o = yield this.restClient.getUtxosByAddress(this.address);
      if ((e.tx.change(this.address), 0 === o.length))
        throw new Error(`Insufficient balance in address ${this.address}.`);
      let i = 0;
      let c = 0;
      let a = 0;
      do {
        const [n] = o.splice(0, 1);
        e.tx.from([new t.bitcore.Transaction.UnspentOutput(n)]),
          e.tx.sign(this.privateKey, 1),
          (c = e.tx.toString().length),
          e.tx.fee(2e4 * c * 2),
          e.tx._updateChangeOutput(),
          (a = e.tx._getInputAmount() - e.tx._getOutputAmount()),
          (i = (a / c) * 1e3);
      } while (0 !== o.length && i < 4e4);
      if (i < 4e4 && 0 === o.length)
        throw new Error(
          `Insufficient balance in address ${
            this.address
          } to fund transaction. Found ${e.tx._getInputAmount()}\n        but required ${
            e.tx._getOutputAmount() + a
          }.`
        );
      if (
        ((c = e.tx.toString().length),
        (a = Math.max(Math.ceil((c / 1e3) * 2e4), m)),
        e.tx.fee(a),
        (e.tx.outputs[n].satoshis = a),
        (e.tx._outputAmount = void 0),
        e.tx.feePerKb(2e4),
        (e.tx._outputAmount = void 0),
        e.tx._updateChangeOutput(),
        !1 === e.isFullyFunded() || !1 === e.tx.verify())
      )
        throw new Error(
          `Something went wrong. Address ${
            this.address
          }. Transaction: ${JSON.stringify(e.tx, null, 2)}`
        );
      try {
        e.tx.sign(this.privateKey, 1);
      } catch (t) {
        throw new Error(
          `error occurred while signing ${t.message} ${e.txId} ${e.tx}`
        );
      }
      return this.restClient.sendTransaction(e.tx.toString());
    });
  }
  send(t, e) {
    return c(this, void 0, void 0, function* () {
      const { restClient: n } = this;
      const r = new st({ restClient: n });
      return r.tx.to(e, t), this.fundAndSendTx(r);
    });
  }
  get hdPrivateKey() {
    return D(this.restClient);
  }
  get privateKey() {
    return this.hdPrivateKey.privateKey;
  }
  get publicKey() {
    return this.hdPrivateKey.publicKey;
  }
  get passphrase() {
    return this.restClient.passphrase;
  }
  get path() {
    return this.restClient.path;
  }
  get chain() {
    return this.restClient.chain;
  }
  get network() {
    return this.restClient.network;
  }
  get url() {
    return this.restClient.url;
  }
  get mnemonic() {
    return this.restClient.mnemonic;
  }
  get address() {
    return this.publicKey.toAddress(this.restClient.network);
  }
}
class it {
  constructor(t = {}) {
    this.wallet = new ot(t);
  }
  fromTxHex(t) {
    return c(this, void 0, void 0, function* () {
      const { restClient: e } = this.wallet;
      return st.fromTxHex({ hex: t, restClient: e });
    });
  }
  fromTxId(t) {
    return c(this, void 0, void 0, function* () {
      const [e] = yield this.wallet.restClient.getRawTxs([t]);
      return this.fromTxHex(e);
    });
  }
  get(t) {
    return c(this, void 0, void 0, function* () {
      const e = t.map(L);
      return Promise.all(
        e.map(({ txId: t, outputIndex: e }) =>
          c(this, void 0, void 0, function* () {
            const { outData: n } = yield this.fromTxId(t);
            if (e > n.length) throw new Error("Index out of bounds");
            return n[e];
          })
        )
      );
    });
  }
  put(t) {
    return this.update([], t);
  }
  getBcTx(t) {
    const { restClient: e } = this.wallet;
    return st.getBcTx({ hex: t, restClient: e });
  }
  createTx(t, e) {
    return c(this, void 0, void 0, function* () {
      const { wallet: n } = this;
      const { restClient: r } = n;
      const s = new st({ restClient: r });
      const { privateKey: o, publicKey: a } = n;
      const u = e
        .map((t) => {
          var { _owners: e } = t,
            n = i(t, ["_owners"]);
          return Object.assign({ _owners: e || [a.toString()] }, n);
        })
        .map(tt);
      const d = yield Promise.all(
        u.map(
          (function (t) {
            return (e) =>
              c(this, void 0, void 0, function* () {
                if (void 0 !== e._url) {
                  const { _url: n, _owners: r, _amount: s } = e,
                    o = i(e, ["_url", "_owners", "_amount"]);
                  const c = yield J.setSecretOutput({
                    host: n,
                    secretOutput: { data: JSON.stringify(o) },
                    privateKey: t,
                  });
                  return (
                    void 0 !== r && (c._owners = r),
                    void 0 !== s && (c._amount = s),
                    c
                  );
                }
                return e;
              });
          })(o)
        )
      );
      return yield s.spendFromData(t), yield s.createDataOuts(d), s;
    });
  }
  update(t, e) {
    return c(this, void 0, void 0, function* () {
      const n = yield this.createTx(t, e);
      return yield this.wallet.fundAndSendTx(n), n.outRevs;
    });
  }
}
const ct = [
  "_id",
  "_rev",
  "_owners",
  "_amount",
  "_readers",
  "_url",
  "__vouts",
  "__func",
  "__index",
  "__args",
];
const at = (t) =>
  (Object.prototype.toString.call(t).match(/\s([a-zA-Z]+)/) || [])[1];
const ut = (t) => ("object" == typeof t ? at(t) : at(t).toLowerCase());
const dt = (t) =>
  ["number", "string", "boolean", "undefined", "Null"].includes(ut(t));
const ht = (t) => "Array" === ut(t);
const lt = (t) => "Object" === ut(t);
const pt = (t) => dt(t) || ["Array", "Object"].includes(ut(t));
const ft = (t, e) => {
  if (!pt(t) || !pt(e))
    throw new Error(
      `Unsupported data types for deep equals: ${ut(t)} & ${ut(e)}`
    );
  if (ut(t) !== ut(e)) return !1;
  if (dt(t) && dt(e)) return t === e;
  const n = (t, e) => Object.entries(t).every(([t, n]) => ft(e[t], n));
  return t && e && n(t, e) && n(e, t);
};
const gt = (t) => {
  if (dt(t)) return t;
  if (ht(t)) return t.map(gt);
  if (lt(t)) {
    const e = Object.keys(t).reduce((e, n) => ((e[n] = gt(t[n])), e), {});
    const n = Object.create(Object.getPrototypeOf(t));
    return Object.assign(n, e);
  }
  throw new Error(`Unsupported data type for clone: ${ut(t)}`);
};
const vt = (t, e) => Object.fromEntries(Object.entries(t).map((t) => e(t)));
const mt = (t, e) => vt(t, ([t, n]) => [t, e(n)]);
const wt = (t, e) => Object.fromEntries(Object.entries(t).filter((t) => e(t)));
const bt = (t, e, n, r) => {
  if (dt(t)) return t;
  if (ht(t)) return t.map((t) => bt(t, e, n, r));
  if (lt(t)) {
    t._rev = `${r}/${n}`;
    const s = e[n];
    return (
      Object.entries(t).forEach(([n, o]) => {
        "object" == typeof s &&
          Object.keys(s).includes(n) &&
          (t[n] = bt(o, e, s[n], r));
      }),
      t
    );
  }
  throw new Error(`Unsupported type ${ut(t)} in deep.updateRev`);
};
const yt = (t, e) => {
  if (dt(t)) return t;
  if (ht(t)) return t.map((t) => yt(t, e));
  if (lt(t))
    return (
      (t._id = !t._id || t._id.startsWith("__temp__") ? t._rev : t._id),
      (t._root = t._root || e),
      Object.entries(t).forEach(([n, r]) => {
        t[n] = yt(r, e);
      }),
      t
    );
  throw new Error(`Unsupported type ${ut(t)} in deep.addId`);
};
const _t = (t) => {
  if (dt(t)) return t;
  if (ht(t)) return t.map((t) => _t(t));
  if (lt(t)) {
    const e = `__temp__/${Math.random()}`;
    return (
      (t._id = t._id || e),
      (t._rev = t._rev || e),
      Object.values(t).map((t) => _t(t)),
      t
    );
  }
  throw new Error(`Unsupported type ${ut(t)} in addRandomId`);
};
const xt = (t) => {
  if (dt(t)) return t;
  if (ht(t)) return t.map((t) => xt(t));
  if (lt(t))
    return vt(t, ([t, e]) =>
      ["_owners", "_readers"].includes(t)
        ? [t, JSON.stringify(e)]
        : dt(e)
        ? [t, e]
        : [t, xt(e)]
    );
  throw new Error(`Unexpected type ${ut(t)} in stringifyOwners`);
};
const Ot = (t) => (
  t._owners && (t._owners = JSON.parse(t._owners)),
  t._readers && (t._readers = JSON.parse(t._readers)),
  t
);
const jt = (t) => {
  if (dt(t)) return t;
  if (ht(t) || lt(t))
    return Object.entries(t).reduce((t, [e, n]) => {
      const r = jt(n);
      return (
        ((t) =>
          "Object" === ut(t) &&
          Object.keys(t).every((t) => !Number.isNaN(parseInt(t, 10))))(r)
          ? Object.entries(r).forEach(([n, r]) => {
              t[`${e}_${n}`] = r;
            })
          : (t[e] = r),
        t
      );
    }, {});
  throw new Error(`Unsupported type ${ut(t)} in encodeArraysAsObjects`);
};
const St = (t) => {
  const e = {
    [t._id]: Object.entries(t).reduce(
      (t, [e, n]) =>
        ct.includes(e)
          ? Object.assign(Object.assign({}, t), { [e]: n })
          : dt(n)
          ? Object.assign(Object.assign({}, t), { [`__basic__${e}`]: n })
          : Object.assign(Object.assign({}, t), { [e]: n._id }),
      {}
    ),
  };
  return Object.values(t)
    .filter((t) => !dt(t))
    .reduce((t, e) => Object.assign(Object.assign({}, t), St(e)), e);
};
const $t = (t) => wt(t, ([t]) => !t.startsWith("__basic__"));
const Ct = (t, e) => {
  const n = t[e];
  return (
    (n.__contains = Object.entries(n).reduce(
      (e, [n, r]) =>
        ["__contains", ...ct].includes(n)
          ? e
          : "__change" === n
          ? "new" === r || "diff" === r || e
          : Ct(t, r)[r].__contains || e,
      !1
    )),
    t
  );
};
const Et = (t, e) =>
  t.map((t) =>
    Object.entries(t).reduce((t, [n, r]) => {
      const s = "string" == typeof r && "undefined" !== ut(e[r]) ? e[r] : r;
      return Object.assign(Object.assign({}, t), { [n]: s });
    }, {})
  );
class It {
  constructor({ db: t = new it() } = {}) {
    this.db = t;
  }
  deploy(t) {
    return c(this, void 0, void 0, function* () {
      const [e] = yield this.db.put([{ __mdl: t }]);
      return e;
    });
  }
  static bitcoinResolveHook(t) {
    return t;
  }
  static bitcoinImportHook(t) {
    return c(this, void 0, void 0, function* () {
      const [e] = yield new it().get([t]);
      return new o(e.__mdl, t);
    });
  }
  static nodeResolveHook(t = "", e = "") {
    if (t.startsWith("/"))
      throw TypeError(`Module specifier ${t} must not begin with "/"`);
    if (!e.startsWith("./"))
      throw TypeError(`Module referrer ${e} must begin with "./"`);
    const n = [];
    const r = [];
    ((t) =>
      t.startsWith("./") || t.startsWith("../") || "." === t || ".." === t)(
      t
    ) && (r.push(...e.split("/")), r.pop(), n.push(".")),
      r.push(...t.split("/"));
    for (const s of r)
      if ("." === s || "" === s);
      else if (".." === s) {
        if (0 === r.length)
          throw TypeError(
            `Module specifier ${t} via referrer ${e} must not traverse behind an empty path`
          );
        n.pop();
      } else n.push(s);
    return n.join("/");
  }
  static resolveHook(t, e) {
    if (N(e) && !N(t))
      throw new Error(
        "Requiring a local file from a module on the blockchain is not supported."
      );
    return N(t) ? It.bitcoinResolveHook(t) : It.nodeResolveHook(t, e);
  }
  static makeImportHook() {
    return (t) => {
      if (N(t)) return It.bitcoinImportHook(t);
      throw new Error("Not a valid import");
    };
  }
  static getBitcoinCompartment() {
    const { resolveHook: t, makeImportHook: e } = It;
    return new Compartment({}, {}, { resolveHook: t, importHook: e() });
  }
  static import(t) {
    return c(this, void 0, void 0, function* () {
      const e = It.getBitcoinCompartment();
      const { namespace: n } = yield e.import(t);
      return n;
    });
  }
}
class Tt {
  constructor({ db: t = new it() } = {}) {
    this.db = t;
  }
  get(t) {
    return c(this, void 0, void 0, function* () {
      const { txId: e, outputIndex: n } = L(t);
      const { inRevs: r, outData: s } = yield this.db.fromTxId(e);
      if (!Array.isArray(r) || !Array.isArray(s) || 0 === s.length) return;
      const o = s[0].__index || {};
      const i = yield Promise.all(
        Object.values(o).map((t) => {
          const e = r[t];
          return e ? this.get(e) : Promise.resolve({});
        })
      );
      const c = Object.keys(o).map((t, e) => [t, i[e]]);
      const a = Object.fromEntries(c);
      let u = a.obj;
      delete a.obj;
      const d = Object.entries(a).reduce((t, [e, n]) => {
        const r = parseInt(e, 10);
        return Number.isNaN(r) || (t[r] = n), t;
      }, []);
      const {
        __cls: h,
        __func: l,
        __expt: p,
        __mdl: f,
        __args: g,
      } = s[o.obj] || {};
      const v = (function (t, e) {
        let n = 0;
        return e.map((e) => ("__" === e ? t[n++] : e));
      })(d, g || []);
      let m;
      if (void 0 !== p && void 0 !== f) {
        const t = It.getBitcoinCompartment();
        const { namespace: e } = yield t.import(f);
        u = new Compartment(
          Object.assign(Object.assign({}, e), { args: v })
        ).evaluate(`Reflect.construct(${p}, args)`);
      } else if (void 0 !== h) {
        const t = new Compartment().evaluate(`(${h})`);
        u = new Compartment({ ClsFunc: t, args: v }).evaluate(
          "Reflect.construct(ClsFunc, args)"
        );
      } else {
        if (void 0 === u || void 0 === l)
          throw new Error("Unrecognized transaction.");
        {
          const t = u[l];
          m = new Compartment({ func: t, target: u, args: v }).evaluate(
            "Reflect.apply(func, target, args)"
          );
        }
      }
      Object.entries(o).forEach(([t, n]) => {
        const r = parseInt(t, 10);
        let o = d[r];
        "obj" === t ? (o = u) : "res" === t && (o = m), bt(o, s, n, e);
      });
      const w = (null == u ? void 0 : u._root) || `${e}/${o.obj}`;
      return yt([m, u, ...d], w), [...d, u, m][n];
    });
  }
}
class Kt {
  constructor({ db: t = new it() } = {}) {
    (this.db = t),
      (this.modules = new It({ db: t })),
      (Kt.proxyDepth = Kt.proxyDepth || 0);
  }
  write(t) {
    return c(this, void 0, void 0, function* () {
      let e;
      let n;
      let r;
      let s;
      const {
        moduleSpecifier: o,
        target: c,
        property: a,
        constructorFunction: u,
        exportName: d,
        args: h = [],
      } = t;
      const l = gt(c);
      const p = gt(h);
      if (void 0 !== d && void 0 !== h && void 0 !== o) {
        const t = It.getBitcoinCompartment();
        const { namespace: i } = yield t.import(o);
        (e = new Compartment(
          Object.assign(Object.assign({}, i), { args: h })
        ).evaluate(`Reflect.construct(${d}, args)`)),
          (n = h),
          (s = { __expt: d, __mdl: o }),
          (r = void 0);
      } else if (void 0 !== u && void 0 !== h)
        (e = new Compartment({ constructorFunction: u, args: h }).evaluate(
          "Reflect.construct(constructorFunction, args)"
        )),
          (n = h),
          (s = { __cls: u.toString() }),
          (r = void 0);
      else {
        if (void 0 === c || void 0 === a)
          throw new Error(
            "Unrecognized constructor or function call parameters."
          );
        (e = c),
          (n = h),
          (s = { __func: String(a) }),
          (Kt.proxyDepth += 1),
          (r = new Compartment({ func: c[a], target: c, args: h }).evaluate(
            "Reflect.apply(func, target, args)"
          )),
          (Kt.proxyDepth -= 1);
      }
      const { smartArgs: f, dumbArgs: g } = H(p);
      const { smartArgs: v } = H(n);
      const m = Object.assign(Object.assign(Object.assign({}, f), { obj: l }), {
        _id: "index",
      });
      const w = Object.assign(Object.assign(Object.assign({}, v), { obj: e }), {
        _id: "index",
      });
      ["Object", "Array"].includes(ut(r)) && (w.res = r);
      const [b, y, _] = ((t, e) => {
        const n = _t(e);
        const r = n._id;
        const s = gt(t);
        const o = gt(n);
        const c = xt(s);
        const a = xt(o);
        const u = jt(c);
        const d = jt(a);
        const h = ((t, e) =>
          vt(e, ([e, n]) => {
            const r = t[e];
            var s;
            return (
              (n.__change = (s = r) ? (ft(s, n) ? "same" : "diff") : "new"),
              [e, n]
            );
          }))(St(u), St(d));
        const l = mt(h, $t);
        const p = Ct(l, r);
        const f = p[r];
        delete p[r];
        const g = mt(p, (t) => t._rev);
        const v =
          ((m = (t) => t.__contains || Object.values(f).includes(t._id)),
          wt(p, ([, t]) => m(t)));
        var m;
        const w = Object.values(v);
        const [b, y] =
          ((_ = (t) => "new" === t.__change),
          w.reduce(
            ([t, e], n, r) => (_(n) ? [[...t, n], e] : [t, [...e, n]]),
            [[], []]
          ));
        var _;
        const x = [...y, ...b];
        const O = ((t) =>
          t.reduce(
            (t, e, n) => Object.assign(Object.assign({}, t), { [e._id]: n }),
            {}
          ))(x);
        const j = Et(x, O);
        const [S] = Et([f], O);
        const $ = y.map((t) => t._rev);
        const [C, ...E] = ((t, e) =>
          [e, ...t].map((t) => {
            const e = i(t, ["_id", "_rev", "__change", "__contains"]);
            return wt(e, ([t, e]) => ct.includes(t) || "number" == typeof e);
          }))(j, S);
        return [
          $,
          E.map(Ot).map((t) =>
            Object.entries(t).reduce(
              (t, [e, n]) =>
                Object.assign(Object.assign({}, t), { [e]: g[n] || n }),
              {}
            )
          ),
          C,
        ];
      })(m, w);
      void 0 !== y[0] && (y[0].__index = _);
      const x = _.obj;
      void 0 !== y[x] &&
        ((s.__args = g), (y[x] = Object.assign(Object.assign({}, y[x]), s)));
      const O = _.res;
      void 0 !== y[O] &&
        "function Object() { [native code] }" !== r.constructor.toString() &&
        (y[O].__cls = r.constructor.toString());
      const [j] = yield this.db.update(b, y);
      const { txId: S } = L(j);
      Object.entries(_).forEach(([t, n]) => {
        let s;
        (s = "obj" === t ? e : t.startsWith("res") ? r : v[parseInt(t, 10)]),
          bt(s, y, n, S);
      });
      const $ = (null == c ? void 0 : c._root) || `${S}/${_.obj}`;
      return yt([r, e, ...v], $), void 0 !== r ? r : e;
    });
  }
  get(t, e) {
    return Kt.proxyDepth > 0 || "function" != typeof t[e]
      ? Reflect.get(t, e)
      : (...n) => this.write({ target: t, property: e, args: n });
  }
}
const { bitcore: kt } = t;
const { crypto: At } = kt;
class Bt {
  constructor(t = {}) {
    if (void 0 !== t.seed)
      throw new Error(
        'The constructor parameter "seed" has been renamed to "mnemonic".'
      );
    this.db = new it(t);
  }
  new(t, e, n) {
    return c(this, void 0, void 0, function* () {
      const r = "function" == typeof t ? t : void 0;
      const s = "string" == typeof t ? t : void 0;
      const o = new Kt({ db: this.db });
      const i = yield o.write({
        args: e,
        moduleSpecifier: n,
        constructorFunction: r,
        exportName: s,
      });
      return new Proxy(i, o);
    });
  }
  sync(t) {
    return c(this, void 0, void 0, function* () {
      M(t);
      const { db: e } = this;
      const n = new Tt({ db: e });
      const r = new Kt({ db: e });
      const s = yield n.get(t);
      return new Proxy(s, r);
    });
  }
  query(t) {
    return c(this, void 0, void 0, function* () {
      const { publicKey: e, contract: n, limit: r, offset: s, order: o } = t;
      let i = {};
      if (
        (e &&
          (i = Object.assign(Object.assign({}, i), {
            publicKey: new kt.PublicKey(e).toString(),
          })),
        n)
      ) {
        const t = "string" == typeof n ? n : n.toString();
        i = Object.assign(Object.assign({}, i), {
          classHash: At.Hash.sha256(Buffer.from(t)).toString("hex"),
        });
      }
      if ("number" == typeof r || "number" == typeof s) {
        if ("number" == typeof r && r < 0)
          throw new Error("LIMIT must not be negative.");
        if ("number" == typeof s && s < 0)
          throw new Error("OFFSET must not be negative.");
        void 0 !== r &&
          (i = Object.assign(Object.assign({}, i), { limit: r.toString() })),
          void 0 !== s &&
            (i = Object.assign(Object.assign({}, i), { offset: s.toString() })),
          (i = Object.assign(Object.assign({}, i), { order: o || "ASC" }));
      }
      return this.db.wallet.restClient.query(i);
    });
  }
  idsToRevs(t) {
    return c(this, void 0, void 0, function* () {
      return this.db.wallet.restClient.idsToRevs(t);
    });
  }
  deploy(t) {
    return c(this, void 0, void 0, function* () {
      return new It(this).deploy(t);
    });
  }
  import(t, e) {
    return c(this, void 0, void 0, function* () {
      return (yield It.import(e))[t];
    });
  }
  getChain() {
    return this.db.wallet.restClient.chain;
  }
  getNetwork() {
    return this.db.wallet.restClient.network;
  }
  getMnemonic() {
    return this.db.wallet.restClient.mnemonic.toString();
  }
  getPrivateKey() {
    return this.db.wallet.privateKey.toString();
  }
  getPublicKey() {
    return this.db.wallet.publicKey.toString();
  }
  getAddress() {
    return this.db.wallet.address.toString();
  }
  getBalance() {
    return c(this, void 0, void 0, function* () {
      return this.db.wallet.getBalance();
    });
  }
  getUtxos() {
    return c(this, void 0, void 0, function* () {
      const t = new kt.Address(this.getAddress());
      return this.db.wallet.restClient.getUtxosByAddress(t);
    });
  }
  broadcast(t) {
    return c(this, void 0, void 0, function* () {
      return this.db.wallet.restClient.sendTransaction(t);
    });
  }
  queryRevs(t) {
    return c(this, void 0, void 0, function* () {
      return this.query(t);
    });
  }
  getOwnedRevs(t = this.db.wallet.publicKey) {
    return this.query({ publicKey: t.toString() });
  }
  getRevs(t = this.db.wallet.publicKey) {
    return c(this, void 0, void 0, function* () {
      return this.query({ publicKey: t.toString() });
    });
  }
  getLatestRevs(t) {
    return c(this, void 0, void 0, function* () {
      return this.idsToRevs(t);
    });
  }
  getLatestRev(t) {
    return c(this, void 0, void 0, function* () {
      const [e] = yield this.idsToRevs([t]);
      return e;
    });
  }
  rpcCall(t, e) {
    return c(this, void 0, void 0, function* () {
      const n = yield this.db.wallet.restClient.rpc(t, e);
      return n.result ? n.result : {};
    });
  }
}
export { Bt as Computer };
