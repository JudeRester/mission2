import React, { useEffect } from 'react';
import Login from './login/Login';
import { connect, Provider, useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';
import { RootState } from '../modules';
import { login } from '../modules/member';
import Upload from './upload/Upload';
import Header from './commons/Header';


const Main: any = () => {
    return (
        <div>
            <p>hi</p>
        </div>
    )
}
const Pages = (props: any) => {
    const user = useSelector((state: RootState) => state.member)
    const dispatch = useDispatch();
    useEffect(() => {
        const token = sessionStorage.getItem('sessionUser');
        if (token && !user.isLogined) {
            dispatch(login({ userId: '', isLogined: true }));
        }
    }, [user])
    

    console.log(user.isLogined)

    return !user.isLogined ? (
        <Login />
    ) : (

            <BrowserRouter>
                <Header />
                <Route exact path="/" component={Main} />
                <Route path="/upload" component={Upload}/>
            </BrowserRouter>
        )
}

const member = (state: any) => ({
    user: state.member
})

export default connect(member)(Pages);