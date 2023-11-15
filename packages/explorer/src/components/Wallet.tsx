import { Computer } from "@bitcoin-computer/lib"
import { useCallback, useEffect, useState } from "react"
import { HiRefresh } from "react-icons/hi"
import { chunk } from "../utils"

function Card({ content }: { content: string }) {
  return (<div className="mt-2 mb-2 block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
    <pre className="font-normal text-gray-700 dark:text-gray-400 text-xs">
      {content}
    </pre>
  </div>)
}

export default function Wallet2({ computer }: { computer: Computer }) {
  const [balance, setBalance] = useState(0)
  const [showMnemonic, setShowMnemonic] = useState(false)

  const refreshBalance = useCallback(async () => {
    try {
      if (computer) setBalance(await computer.getBalance())
    } catch (err) {
      console.log("Error fetching wallet details", err)
    }
  }, [computer])

  useEffect(() => {
    ;(async () => {
      await refreshBalance()
    })()
  }, [refreshBalance])

  const logout = () => {
    localStorage.removeItem("BIP_39_KEY")
    localStorage.removeItem("CHAIN")
    window.location.href = "/"
  }

  const mnemonicWell = () => {
    const mnemonicChunks = chunk(computer.getMnemonic().split(' '))
    const mnemonicChunksString = (mnemonicChunks.map((chunk) => chunk.join(' ') + '\n')).join(' ')
    return (<>
      <Card content={' ' + mnemonicChunksString} />
      <button onClick={() => setShowMnemonic(false)} className="mb-4 font-medium text-blue-600 dark:text-blue-500 hover:underline">
        Hide Mnemonic
      </button>
    </>)
    }

  const showMnemonicLink = () => (<>
      <button onClick={() => setShowMnemonic(true)} className="mb-4 font-medium text-blue-600 dark:text-blue-500 hover:underline">
        Show Mnemonic
      </button>
      <br />
    </>)

  return (<>
    <input type="checkbox" data-menu id="wallet-opener" hidden />
    <aside className="WalletDrawer" role="menu" id="menu" aria-labelledby="openmenu">
      <nav className="Menu bg-white w-80 dark:bg-gray-800 text-left">
          {/* 
          <button type="button" data-drawer-hide="drawer-right-example" aria-controls="drawer-right-example" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 right-2.5 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white" >
            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" stroke-linejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
            <span className="sr-only">Close menu</span>
          </button>
          */}
          <div className="mt-8 p-4 text-sm text-gray-900 dark:text-gray-400 break-words">
            <h2 className="text-4xl mb-2 font-bold dark:text-white">Wallet</h2>
            <h6 className="text-lg font-bold dark:text-white">Balance</h6>
            <HiRefresh onClick={refreshBalance} className="ml-2 inline hover:text-slate-500 cursor-pointer"></HiRefresh>
            {balance / 1e8} LTC

            <h6 className="mt-2 text-lg font-bold dark:text-white">Address</h6>
            {computer.getAddress()}

            <h6 className="mt-2 text-lg font-bold dark:text-white break-all">Public Key</h6>
            {computer.getPublicKey()}

            <h6 className="mt-2 text-lg font-bold dark:text-white break-all">Mnemonic</h6>
            {showMnemonic ? (mnemonicWell()) : (showMnemonicLink())}

            <h6 className="text-lg font-bold dark:text-white">Log out</h6>
            <p className="mb-2">Logging out will delete your mnemonic, make sure to write it down before logging out.</p>

            <button onClick={logout} type="button" className="mt-2 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
              Log Out
            </button>
          </div>
      </nav>
      <label htmlFor="wallet-opener" className="MenuOverlay bg-gray-900 bg-opacity-50 dark:bg-opacity-80"></label>
    </aside>
  </>)
}
