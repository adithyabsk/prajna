import React from 'react'
import {Navbar, Nav, Container} from 'react-bootstrap';
import Link from 'next/link'

export default function MainNavbar() {
    return (
        <Navbar>
            <Container>
                <Link href="/" passHref>
                    <Navbar.Brand href>Prajna</Navbar.Brand>
                </Link>
                <Nav className="me-auto">
                    <Link href="#" passHref><Nav.Link>Home</Nav.Link></Link>
                    <Link href="#" passHref><Nav.Link>Features</Nav.Link></Link>
                    <Link href="#" passHref><Nav.Link>Pricing</Nav.Link></Link>
                </Nav>
            </Container>
        </Navbar>
    )
}
