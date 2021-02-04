import React, {  } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { logout } from '../../modules/member';

const Header = () => {
    const dispatch = useDispatch()
    const logoutHandler = () =>{
        dispatch(logout());
        sessionStorage.setItem("sessionUser", '');
        console.log('logout');
    }
    
    return (
        <Navbar className="shadow" bg="light" expand="lg">
            <Navbar.Brand>Mission2</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link href="/">Home</Nav.Link>
                    <Nav.Link href="/upload">파일 업로드</Nav.Link>
                    {/* <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                        <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                    </NavDropdown> */}
                    <Nav.Link onClick={logoutHandler}>
                       로그아웃
                    </Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )

}

export default Header;