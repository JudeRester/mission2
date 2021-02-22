import React, { useEffect } from 'react';
import Login from './login/Login';
import { connect, Provider, useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';
import { RootState } from '../modules';
import { login } from '../modules/member';
import Upload from './upload/Upload';
import Header from './commons/Header';
import Main from './main';
import Detail from './detail';
import Modify from './modify';
import Drawer from './commons/SideHeader';
import SideHeader from './commons/SideHeader';
import MemberManager from './admin/MemberManager';

const Pages = (props: any) => {
    const user = useSelector((state: RootState) => state.member)
    const dispatch = useDispatch();
    useEffect(() => {
        const token = sessionStorage.getItem('sessionUser');
        if (token && !user.isLogined) {
            dispatch(login({ userId: '', isLogined: true }));
        }
    }, [user])
    return !user.isLogined ? (
        <Login />
    ) : (

            <BrowserRouter>
                {/* <Header /> */}
                <SideHeader>
                    <Route exact path="/" component={Main} />
                    <Route path="/upload" component={Upload} />
                    <Route path="/detail/:assetSeq" component={Detail} />
                    <Route path="/modify/:assetSeq" component={Modify} />
                    {sessionStorage.getItem('userInfo') ? JSON.parse(sessionStorage.getItem('userInfo')).userRole === "ROLE_ADMIN" && <>
                        <Route path="/admin/member" component={MemberManager} />
                        <Route path="/admin/category"/>
                    </> : null}
                </SideHeader>
            </BrowserRouter>
        )
}

const member = (state: any) => ({
    user: state.member
})

export default connect(member)(Pages);