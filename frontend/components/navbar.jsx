import {Navbar, Nav, Container} from 'react-bootstrap';
import Link from 'next/link'
import ConnectWalletButton from "./web3/connectWallet";

export default function MainNavbar() {
    return (
        <Container>
            <Navbar collapseOnSelect expand="lg">
                <Link href="/" passHref>
                    <Navbar.Brand href>Prajna</Navbar.Brand>
                </Link>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto">
                    <Link href="/wallet" passHref><Nav.Link>Wallet</Nav.Link></Link>
                    <Link href="#" passHref><Nav.Link>Features</Nav.Link></Link>
                    <Link href="#" passHref><Nav.Link>Pricing</Nav.Link></Link>
                </Nav>
                <br />
                <Nav>
                    <ConnectWalletButton/>
                </Nav>
                </Navbar.Collapse>
            </Navbar>
        </Container>
    )
}
