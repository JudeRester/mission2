import React, { useEffect } from 'react';
import Login from './login/Login';
import { connect,  useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';
import { RootState } from '../modules';
import { login } from '../modules/member';
import Upload from './upload/Upload';
import Header from './commons/Header';
import Main from './main';
import Detail from './detail';
import Modify from './modify';
import SideHeader from './commons/SideHeader';
import MemberManager from './admin/MemberManager';
import CategoryManager from './admin/CategoryManager';

function parseJwt(token: string) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  };
const Pages = (props: any) => {
    const user = useSelector((state: RootState) => state.member)
    const dispatch = useDispatch();
    let token = sessionStorage.getItem('current_user_token')
    useEffect(() => {
        if (token && !user.isLogined) {
            token = sessionStorage.getItem('current_user_token')
            dispatch(login({ userId: '',userRole: parseJwt(token).userRole,token:token , isLogined: true }));
        }
    }, [user])
    return !user.isLogined ? (
        <Login />
    ) : (

            <BrowserRouter>
                <SideHeader>
                    <Route exact path="/" component={Main} />
                    <Route path="/upload" component={Upload} />
                    <Route path="/detail/:assetSeq" component={Detail} />
                    <Route path="/modify/:assetSeq" component={Modify} />
                    { user.userRole === "ROLE_ADMIN" && <>
                        <Route path="/admin/member" component={MemberManager} />
                        <Route path="/admin/category" component={CategoryManager}/>
                    </>}
                </SideHeader>
            </BrowserRouter>
        )
}

const member = (state: any) => ({
    user: state.member
})

export default connect(member)(Pages);