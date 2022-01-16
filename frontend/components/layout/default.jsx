import Head from 'next/head'
import MainNavbar from "../navbar";
import {Container} from "react-bootstrap";
import {Web3Provider} from "../../context/web3";

export default function DefaultLayout({ children }) {
    return (
        // All providers are nested here
        <Web3Provider>
            <Head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="author" content="Adithya Balaji" />
                <meta name="theme-color" content="#7952b3" />
                <title>Prajna</title>
                {/* TODO: Add the favicon tags here */}
            </Head>
            <header>
                <MainNavbar/>
            </header>
            <main role="main">
                <Container className="py-5">
                    {children}
                </Container>
            </main>
        </Web3Provider>
    )
}
