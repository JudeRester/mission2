import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { isLogin } from '../../App';

const Header = () => {
    const history = useHistory();
    const isLoginContext = useContext(isLogin);
    const logout = () => {
        sessionStorage.removeItem("sessionUser");
        history.push("/");
        isLoginContext((prev) => !prev);
    }
    if (true) {
        return (
            <Navbar className="shadow" bg="light" expand="lg">
                <Navbar.Brand href="#home">Mission2</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href="/main">Home</Nav.Link>
                        <Nav.Link href="/upload">파일 업로드</Nav.Link>
                        <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                        </NavDropdown>
                        <div id="common-header-links">

                            <span onClick={logout} className="btn-link btn-sm">로그아웃</span>

                        </div>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        )
    } else {
        return (
            <div></div>
        )
    }

}

export default Header;