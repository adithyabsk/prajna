import Navbar from '../navbar/navbar'
import Head from 'next/head'
import MainNavbar from "../navbar/navbar";
import {Container} from "react-bootstrap";

export default function SimpleLayout(props) {
    const css = `
    .bd-placeholder-img {
        font-size: 1.125rem;
        text-anchor: middle;
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;
    }
    @media (min-width: 768px) {
        .bd-placeholder-img-lg {
            font-size: 3.5rem;
        }
    }
    `
    return (
        <>
            <Head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="author" content="Adithya Balaji" />
                <meta name="theme-color" content="#7952b3" />
                {/* TODO: Add the favicon tags here */}
                <style>{css}</style>
            </Head>
            <MainNavbar/>
            <main role="main">
                {props.preContainer && props.preContainer}
                <Container className="py-5">
                    {props.children}
                </Container>
            </main>
        </>
    )
}
