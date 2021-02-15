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
        <div>
            <Navbar className="shadow" bg="light" expand="lg" style={{zIndex:1201}}>
            <Navbar.Brand>Mission2</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link href="/">Home</Nav.Link>
                    <Nav.Link href="/upload">파일 업로드</Nav.Link>
                    <Nav.Link onClick={logoutHandler}>
                       로그아웃
                    </Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
        </div>
    )

}

export default Header;