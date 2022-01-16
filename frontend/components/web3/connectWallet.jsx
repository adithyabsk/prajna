import { Button } from 'react-bootstrap';

import { ethers } from "ethers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import {initWeb3State, useWeb3} from "../../context/web3";

const shortenAddress = (address) => {
    return [address.slice(0, 5), "...", address.slice(-3)].join('')
}
const validChainIds = process.env.NEXT_PUBLIC_CHAINS.split(',').map(Number);;

export default function ConnectWalletButton() {
    const { web3State, setWeb3State } = useWeb3();
    const providerOptions = {
        walletconnect: {
            package: WalletConnectProvider,
            options: {
                infuraId: process.env.INFURA_ID,
            }
        },
    };

    const updateWallet = async (e) => {

        // TODO: handle closed modal case with bootstrap alerts
        if(web3State.connected) {
            // disconnect
            await web3State.modal.clearCachedProvider();
            web3State.provider.provider.removeAllListeners();
            setWeb3State(initWeb3State);
        } else {
            // connect
            const web3Modal = new Web3Modal({
              network: "mainnet", // optional
              cacheProvider: true, // optional
              providerOptions // required
            });

            const instance = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(instance);
            const signer = provider.getSigner();
            const account = await signer.getAddress();
            const accountName = await provider.lookupAddress(account) || shortenAddress(account);
            // let avatar = null;
            // if(accountName) {
            //     avatar = await provider.getAvatar(accountName);
            //     console.log(avatar);
            // }
            const chainId = (await provider.getNetwork()).chainId;

            let variant = "danger";
            let btnText = "Invalid Network";
            if(validChainIds.includes(chainId)) {
                variant = "warning";
                btnText = `Disconnect Wallet (${accountName})`;
            }

            provider.provider.on("accountsChanged", async (accounts) => {
                const account = accounts[0];
                const accountName = await provider.lookupAddress(account) || shortenAddress(account);
                setWeb3State(prevState => ({
                    ...prevState,
                    account: accounts[0],
                    btnText: `Disconnect Wallet (${accountName})`,
                }));
            });

            provider.provider.on("chainChanged", async (chainIdStr) => {
                // const chainId = parseInt(chainIdStr, 16);
                // let variant = "danger";
                // let btnText = "Invalid Network";
                // if(validChainIds.includes(chainId)) {
                //     variant = "warning";
                //     btnText = `Disconnect Wallet (${accountName})`;
                // }
                // setWeb3State(prevState => ({
                //     ...prevState,
                //     variant: variant,
                //     btnText: btnText,
                // }));
                // Metamask recommends re-loading the page
                // https://docs.metamask.io/guide/ethereum-provider.html#events
                window.location.reload()
            })

            setWeb3State({
                modal: web3Modal,
                account: account,
                // avatar: avatar,
                connected: true,
                variant: variant,
                btnText: btnText,
                provider: provider,
                signer: signer,
            });
        }
    }

    return (
        <Button variant={web3State.variant} onClick={updateWallet}>
            {web3State.btnText}
            {/*{*/}
            {/*    web3State.avatar &&*/}
            {/*    <div style="width:30%;" className="bg-info rounded-circle">*/}
            {/*        {web3State.avatar}*/}
            {/*    </div>*/}
            {/*}*/}
        </Button>
    )
}
