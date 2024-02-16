import chai, { expect } from 'chai'
// @ts-ignore
import { Computer, Contract } from '@bitcoin-computer/lib'
import chaiMatchPattern from 'chai-match-pattern'
import { Transaction as BTransaction } from '@bitcoin-computer/nakamotojs'

chai.use(chaiMatchPattern)
const _ = chaiMatchPattern.getLodashModule()

const randomPublicKey = '023e21361b53bb2e625cc1f41d18b35ae882e88d8d107df1c3711fa8bc54db8fed'
const randomRev = '0000000000000000000000000000000000000000000000000000000000000000:0'
const mockedRev = `mock:${randomRev}`

const isLocation = (string: string): boolean => {
  const [txId, num] = string.split(':')
  const float = parseFloat(num)
  return [64, 65].includes(txId.length) && !Number.isNaN(float) && Number.isFinite(float)
}

const RLTC: {
  network: 'regtest',
  chain: 'LTC',
  url: string
} = {
  network: 'regtest',
  chain: 'LTC',
  url: 'http://localhost:1031',
}

const meta = {
  _id: _.isString,
  _rev: _.isString,
  _root: _.isString,
  _owners: _.isArray,
  _amount: _.isNumber,
}

class NFT extends Contract {
  img: string
  _id: string
  _rev: string
  _root: string
  _owners: string[]

  constructor(publicKey: string, img: string) {
    super({ _owners: [publicKey], img })
  }

  transfer(to: string) {
    this._owners = [to]
  }
}

class Token extends Contract {
  _id: string
  _rev: string
  _root: string
  supply: number
  totalSupply: number
  _owners: string[]

  constructor(to: string, supply: number, totalSupply: number) {
    super({ supply, totalSupply,  _owners: [to] })
  }

  transfer(amount: number, to: string) {
    if (this.supply < amount) throw new Error()
    this.supply -= amount
    return new Token(to, amount, this.totalSupply)
  }
}

class Swap extends Contract {
  static exec(nftA: NFT, nftB: NFT) {
    const ownerA = nftA._owners[0]
    const ownerB = nftB._owners[0]
    nftA.transfer(ownerB)
    nftB.transfer(ownerA)
    return [nftB, nftA]
  }
}

class PaymentMock {
  _id: string
  _rev: string
  _root: string
  _amount: number
  _owners: string[]

  constructor() {
    this._id = mockedRev
    this._rev = mockedRev
    this._root = mockedRev
    this._owners = [randomPublicKey]
    this._amount = 7860
  }

  transfer(to: string) {
    this._owners = [to]
  }
}

class Payment extends Contract {
  _id: string
  _rev: string
  _root: string
  _owners: string[]

  constructor(owner: string) {
    super({ _owners: [owner] })
  }

  transfer(to: string) {
    this._owners = [to]
  }
}

describe('Computer', () => {
  it('Should default to LTC testnet', async () => {
    const computer = new Computer()
    expect(computer.getChain()).eq('LTC')
    expect(computer.getNetwork()).eq('testnet')
    expect(computer.getUrl()).eq('https://node.bitcoincomputer.io')
  })

  it('Should instantiate a computer object', async () => {
    const computer = new Computer(RLTC)
    expect(computer.getChain()).eq(RLTC.chain)
    expect(computer.getNetwork()).eq(RLTC.network)
    expect(computer.getUrl()).eq(RLTC.url)
  })
})

describe.only('Non-Fungible Token (NFT)', () => {
  let nft: NFT
  let initialId: string
  let initialRev: string
  let initialRoot: string
  let sender = new Computer(RLTC)
  let receiver = new Computer(RLTC)
  
  before("Fund sender's wallet", async () => {
    await sender.faucet(0.001e8)
  })

  describe('Minting an NFT', () => {
    it('Sender mints an NFT', async () => {
      nft = await sender.new(NFT, [sender.getPublicKey(), 'Test'])
      // @ts-ignore
      expect(nft).matchPattern({ img: 'Test', ...meta })
    })

    it('Property _owners is a singleton array with minters public key', () => {
      expect(nft._owners).deep.eq([sender.getPublicKey()])
    })

    it('Properties _id, _rev, and _root have the same value', () => {
      expect(nft._id).eq(nft._rev).eq(nft._root)

      initialId = nft._id
      initialRev = nft._rev
      initialRoot = nft._root
    })

    it("The nft is returned when syncing against it's revision", async () => {
      expect(await sender.sync(nft._rev)).deep.eq(nft)
    })
  })


  describe('Transferring an NFT', async () => {
    it('Sender transfers the NFT to receiver', async () => {
      await nft.transfer(receiver.getPublicKey())
      // @ts-ignore
      expect(nft).to.matchPattern({ img: 'Test', ...meta })
    })

    it('The id does not change', () => {
      expect(initialId).eq(nft._id)
    })

    it('The revision is updated', () => {
      expect(initialRev).not.eq(nft._rev)
    })

    it('The root does not change', () => {
      expect(initialRoot).eq(nft._root)
    })

    it("The _owners are updated to receiver's public key", () => {
      expect(nft._owners).deep.eq([receiver.getPublicKey()])
    })

    it("Syncing to the NFT's revision returns an object that is equal to the NFT", async () => {
      expect(await receiver.sync(nft._rev)).deep.eq(nft)
    })
  })
})

describe.only('Fungible Token', () => {
  let token: Token = null
  let sentToken: Token = null
  let initialId: string
  let initialRev: string
  let initialRoot: string
  let sender = new Computer(RLTC)
  let receiver = new Computer(RLTC)

  before('Fund senders wallet', async () => {
    await sender.faucet(0.01e8)
  })

  describe('Minting a fungible token', () => {
    it('Sender mints a fungible token with supply 10', async () => {
      token = await sender.new(Token, [sender.getPublicKey(), 10, 10])
    })

    it('This creates a smart object', () => {
      // @ts-ignore
      expect(token).to.matchPattern({ ...meta, supply: 10, totalSupply: 10 })
    })

    it('Property _owners is a singleton array with minters public key', () => {
      expect(token._owners).deep.eq([sender.getPublicKey()])
    })

    it('Properties _id, _rev, and _root have the same value', () => {
      expect(token._id).eq(token._rev).eq(token._root)

      initialId = token._id
      initialRev = token._rev
      initialRoot = token._root
    })

    it("Syncing to the token's revision returns an object equal to the token", async () => {
      expect(await sender.sync(token._rev)).deep.eq(token)
    })
  })

  describe('Transferring a fungible token', async () => {
    it('Sender transfers 2 tokens to receiver', async () => {
      sentToken = await token.transfer(2, receiver.getPublicKey())
    })

    it('This creates a second smart object with supply 2', () => {
      // @ts-ignore
      expect(sentToken).to.matchPattern({ supply: 2, totalSupply: 10, ...meta })
    })

    it('The second smart object is owned by recipient', () => {
      expect(sentToken._owners).deep.eq([receiver.getPublicKey()])
    })

    it('The first smart object now has a supply of 8', () => {
      // @ts-ignore
      expect(token).to.matchPattern({ supply: 8, totalSupply: 10, ...meta })
    })

    it('The first smart object is still owned by sender', () => {
      expect(token._owners).deep.eq([sender.getPublicKey()])
    })

    it('Both smart objects have the same _root', () => {
      expect(sentToken._root).eq(token._root)
    })

    it('If Sender mints another token it will have a different root', async () => {
      const fakeToken = await sender.new(Token, [sender.getPublicKey(), 10, 10])
      expect(fakeToken._root).not.eq(token._root)
      expect(fakeToken._root).not.eq(sentToken._root)
    })

    it("Syncing to any smart objects's revision returns an object equal to that smart object", async () => {
      expect(await sender.sync(token._rev)).deep.eq(token)
      expect(await sender.sync(sentToken._rev)).deep.eq(sentToken)
    })
  })
})

describe.only('Swap', () => {
  let nftA: NFT
  let nftB: NFT
  const alice = new Computer(RLTC)
  const bob = new Computer(RLTC)

  before('Before', async () => {
    await alice.faucet(0.01e8)
    await bob.faucet(0.001e8)
  })
  
  describe('Creating two NFTs to be swapped', () => {
    it("Alice creates an NFT called nftA", async () => {
      nftA = await alice.new(NFT, [alice.getPublicKey(), 'nftA'])
      // @ts-ignore
      expect(nftA).to.matchPattern({ img: 'nftA', ...meta })
      expect(nftA._owners).deep.eq([alice.getPublicKey()])
    })

    it("Bob creates an NFT called nftB", async () => {
      nftB = await bob.new(NFT, [bob.getPublicKey(), 'nftB'])
      // @ts-ignore
      expect(nftB).to.matchPattern({ img: 'nftB', ...meta })
      expect(nftB._owners).deep.eq([bob.getPublicKey()])
    })
  })

  describe('Executing a swap', async () => {
    let tx: any
    let txId: string

    it('Alice builds and signs a swap transaction', async () => {
      ;({ tx } = await alice.encode({
        exp: `${Swap} Swap.exec(nftA, nftB)`,
        env: { nftA: nftA._rev, nftB: nftB._rev },
      }))
    })

    it('Bob signs the swap transaction', async () => {
      await bob.sign(tx)
    })

    it('Bob broadcasts the swap transaction', async () => {
      txId = await bob.broadcast(tx)
      expect(txId).not.undefined
    })

    it('nftA is now owned by Bob', async () => {
      const { env } = await bob.sync(txId) as { env: { nftA: NFT, nftB: NFT } }
      const nftASwapped = env.nftA
      // @ts-ignore
      expect(nftASwapped).to.matchPattern({ img: 'nftA', ...meta })
      expect(nftASwapped._owners).deep.eq([bob.getPublicKey()])
    })

    it('nftB is now owned by Alice', async () => {
      const { env } = await alice.sync(txId) as { env: { nftA: NFT, nftB: NFT } }
      const nftBSwapped = env.nftB
      // @ts-ignore
      expect(nftBSwapped).to.matchPattern({ img: 'nftB', ...meta })
      expect(nftBSwapped._owners).deep.eq([alice.getPublicKey()])
    })
  })
})

describe('Sell', () => {
  let tx: any
  let sellerPublicKey: string
  
  describe('Seller should create an NFT and a partially signed Swap transaction', () => {
    let nft: NFT
    const seller = new Computer(RLTC)
    sellerPublicKey = seller.getPublicKey()
    
    before('Creating smart object for a swap', async () => {
      await seller.faucet(1e7)
      nft = await seller.new(NFT, [seller.getPublicKey(), 'NFT'])
    })

    it('Seller should create an NFT', () => {
      // @ts-ignore
      expect(nft).to.matchPattern({ img: 'NFT', ...meta })
    })

    it('Seller should create a swap transaction', async () => {
      const mock = new PaymentMock()
      const { SIGHASH_SINGLE, SIGHASH_ANYONECANPAY } = BTransaction

      ;({ tx } = await seller.encode({
        exp: `${Swap} Swap.exec(nft, payment)`,
        env: { nft: nft._rev, payment: mock._rev },
        mocks: { payment: mock },
        sighashType: SIGHASH_SINGLE | SIGHASH_ANYONECANPAY,
        inputIndex: 0,
        fund: false,
      }))

      // @ts-ignore
      expect(tx).matchPattern({
        version: 1,
        locktime: 0,
        ins: _.isArray,
        outs: _.isArray
      })

      expect(tx.ins).to.have.lengthOf(2)
      expect(tx.ins[0].script).to.have.lengthOf.above(0)
      expect(tx.ins[1].script).to.have.lengthOf(0)
    })
  })

  describe('Buyer should create a payment and execute the swap', () => {
    const buyer = new Computer(RLTC)
    let payment: Payment
    let txId: string

    before('Creating payment object', async () => {
      await buyer.faucet(1e7)
      payment = await buyer.new(Payment, [buyer.getPublicKey()])
    })

    it('Buyer should create a payment object', () => {
      // @ts-ignore
      expect(payment).matchPattern({
        _id: _.isString,
        _rev: _.isString,
        _root: _.isString,
        _owners: [buyer.getPublicKey()],
        _amount: 7860,
      })
    })

    it('Buyer should update the swap transaction with their address', () => {
      const [paymentTxId, paymentIndex] = payment._rev.split(':')
      tx.updateInput(1, { txId: paymentTxId, index: parseInt(paymentIndex, 10) })
      tx.updateOutput(1, { scriptPubKey: buyer.toScriptPubKey([buyer.getPublicKey()])})
    })

    it('Buyer should fund', async () => {
      await buyer.fund(tx)
    })

    it('Buyer should sign', async () => {
      await buyer.sign(tx)
    })

    it('Buyer should broadcast the transaction', async () => {
      txId = await buyer.broadcast(tx)
      expect(txId).not.undefined
    })

    it('Seller should get the payment and buyer should get the nft', async () => {
      const computer = new Computer(RLTC)
      const { res, env } = await computer.sync(txId) as any
      expect(env.payment == res[0]).eq(true)
      expect(env.nft == res[1]).eq(true)
      const { payment, nft } = env
      expect(payment._owners).deep.eq([sellerPublicKey])
      expect(nft._owners).deep.eq([buyer.getPublicKey()])
    })
  })
})
