import Head from 'next/head'
import { useEffect, useState } from "react";
import { useWeb3 } from "../context/web3";

export default function Wallet() {
    const {web3State} = useWeb3();
    const [network, setNetwork] = useState("");

    useEffect(() => {
        (async () => {
            if(web3State.provider) {
                setNetwork(await web3State.provider.getNetwork());
            }
        })();
    }, [web3State.provider]);

    return (
        <>
            <Head>
                <title>Prajna | Wallet</title>
            </Head>
            <div className="row">
                <div className="col-md-12">
                    <h1>Submit a Puzzle Solution</h1>
                    <p>No wallet connected. Connect wallet to show accounts and their ETH balances.</p>
                    {
                        web3State.signer &&
                        <>
                        <hr/>
                        <p>
                            <strong>Connected blockchain:</strong> <span>{network && network.name}</span>
                        </p>
                        </>
                    }
                </div>
            </div>
        </>
    )
}