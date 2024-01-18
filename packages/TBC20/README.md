<div align="center">
  <h1>TBC20</h1>
  <p>
    An implementation of Ethereum's ERC20 standard on Bitcoin
    <br />
    <a href="http://bitcoincomputer.io/">website</a> &#183; <a href="http://docs.bitcoincomputer.io/">docs</a>
  </p>
</div>

<font size=1>

```typescript
interface ITBC20 {
  mint(publicKey: string, amount: number): Promise<string>
  totalSupply(): Promise<number>
  balanceOf(publicKey: string): Promise<number>
  transfer(to: string, amount: number): Promise<void>
}
```

</font>

## Prerequisites

You need to have a [Bitcoin Computer Node](https://github.com/bitcoin-computer/monorepo/tree/main/packages/node#readme) installed and running.

## Installation

<font size=1>

```sh
# Download the code
git clone https://github.com/bitcoin-computer/monorepo.git

# Move to the package
cd monorepo/packages/TBC20

# Create a .env file
cp .env.example .env

# Install the dependencies
yarn install
```

</font>

## Usage

### Run the Tests

<font size=1>

```bash
yarn test
```

</font>

### Check the Types

<font size=1>

```bash
yarn types
```

</font>

### Run the Linter

<font size=1>

```bash
yarn lint
```

</font>

### Fund the Wallet

See [here](https://github.com/bitcoin-computer/monorepo/tree/main/packages/node#fund-the-wallet).

## Documentation

Have a look at the [docs](https://docs.bitcoincomputer.io/) of the Bitcoin Computer.

## Getting Help

If you have any questions, please let us know in our <a href="https://t.me/thebitcoincomputer" target="_blank">Telegram group</a>, on <a href="https://twitter.com/TheBitcoinToken" target="_blank">Twitter</a>, or by email clemens@bitcoincomputer.io.

## Price

See [here](https://www.npmjs.com/package/@bitcoin-computer/lib#price).

## Contributing

This project is intended as a starting point for new development so we want to keep it simple. If you have found a bug please create an [issue](https://github.com/bitcoin-computer/monorepo/issues). If you have a bug fix or a UX improvement please create a pull request [here](https://github.com/bitcoin-computer/monorepo/pulls).

If you want to add a feature we recommend to create a fork. Let us know if you have built something cool and we can link to your project.

## MIT License

Copyright (c) 2022 BCDB Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[node]: https://github.com/bitcoin-computer/monorepo/tree/main/packages/node