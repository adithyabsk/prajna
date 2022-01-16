import { createContext, useContext, useState } from 'react'

const Web3 = createContext(undefined)

export const initWeb3State = {
    modal: null,
    account: null,
    // avatar: null,
    connected: false,
    variant: "primary",
    btnText: "Connect Wallet",
    provider: null,
    signer: null,
}

export function Web3Provider({ children }) {
  const [web3State, setWeb3State] = useState(initWeb3State)
  return (
    <Web3.Provider
      value={{
        web3State,
        setWeb3State,
      }}
    >
      {children}
    </Web3.Provider>
  )
}

export function useWeb3() {
  const context = useContext(Web3)

  if (!context)
    throw new Error('useWeb3 must be used inside a `Web3Provider`')

  return context
}