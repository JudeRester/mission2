import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import styled from '@emotion/styled'
import member, { login } from '../../modules/member';
import { RootState } from '../../modules';
import { useHistory } from 'react-router';
import { Switch } from '@material-ui/core';
import api from "../../util/api";


let DivWrapper = styled.div`
width:100%;
margin: 0 auto;
padding: 0px;
box-sizing: border-box;
`;

let DivLoginContainer = styled.div`
width: 100%;
  min-height: 100vh;
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  padding: 15px;
  background: #ebeeef;
`;

let DivLoginBox = styled.div`
width: 670px;
background: #fff;
border-radius: 10px;
overflow: hidden;
position: relative;
box-shadow: 0 30px 60px 0 rgba(0, 0, 0, 0.3);
`;
let DivLoginTitle = styled.div`
&:first-child{width: 100%;
position: relative;
z-index: 1;
display: -webkit-box;
display: -webkit-flex;
display: -moz-box;
display: -ms-flexbox;
display: flex;
flex-wrap: wrap;
flex-direction: column;
align-items: center;

background-repeat: no-repeat;
background-size: cover;
background-position: center;

padding: 70px 15px 74px 15px;

&:before{
    content: "";
    display: block;
    position: absolute;
    z-index: -1;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgba(54,84,99,0.7);
}    
}
`;

let SpanLoginTitle = styled.span`
font-family: Poppins-Bold;
font-size: 30px;
color: #fff;
text-transform: uppercase;
line-height: 1.2;
text-align: center;
`;

const FormLogin = styled.form`
width: 100%;
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 43px 88px 93px 190px;
  box-sizing:border-box;
`;

const DivLoginGroup = styled.div`
width: 100%;
  position: relative;
  border-bottom: 1px solid #b2b2b2;
  margin-bottom: 26px;
`;

const SpanLoginLabel = styled.span`
font-family: Poppins-Regular;
  font-size: 15px;
  color: #808080;
  line-height: 1.2;
  text-align: right;
  position: absolute;
  top: 14px;
  left: -105px;
  width: 80px;
`;
const InputLogin = styled.input`
font-family: Poppins-Regular;
  font-size: 15px;
  color: #555555;
  line-height: 1.2;
  height: 45px;
  display: block;
  width: 100%;
  background: transparent;
  padding: 0 5px;
  outline:none;
  border:none;
`;

const SpanLoginFocus = styled.span`
&:first-child{position: absolute;
  display: block;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  &:before{
    content: "";
    display: block;
    position: absolute;
    bottom: -1px;
    left: 0;
    width:0;
    height: 2px;
    transition: all 0.6s;
    background: #57b846;
  }
  ${InputLogin}:focus + &:before{
    width: 100%;
  }
}
`;

const DivButtonWrapper = styled.div`
width: 100%;
display: -webkit-box;
display: -webkit-flex;
display: -moz-box;
display: -ms-flexbox;
display: flex;
flex-wrap: wrap;
`;

const ButtonLogin = styled.button`
display: flex;
justify-content: center;
align-items: center;
padding: 0 20px;
min-width: 160px;
height: 50px;
background-color: #57b846;
border-radius: 25px;

font-family: Poppins-Regular;
font-size: 16px;
color: #fff;
// line-height: 1.2;

transition: all 0.4s;
&:hover{
    background-color: #555555;
    cursor:pointer;
}&:active{
    background-color: #222222;
}
`;


//style end
function parseJwt(token: string) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
};
function Login() {
  const history = useHistory();
  let [username, setUsername] = useState("");
  let [password, setPassword] = useState("");
  let [isLoginSuccess, setIsLoginSuccess] = useState(true);
  const dispatch = useDispatch();
  async function handleLoginButton(e: any) {
    e.preventDefault();
    try {
      const response = await api.post(`/authenticate`,
        { username: username, password: password },
        {
          headers: {
            'Content-type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      dispatch(login({ userId: parseJwt(response.data.token).sub ,userRole: parseJwt(response.data.token).userRole,token:response.data.token, isLogined: true }))
      sessionStorage.setItem("current_user_token", response.data.token);
      history.push("/");
    } catch (err) {
      setIsLoginSuccess(false)
    }
  }
  
  return (
    <div>
      <DivWrapper>
        <DivLoginContainer>
          <DivLoginBox>
            <DivLoginTitle>
              <SpanLoginTitle>로그인</SpanLoginTitle>
            </DivLoginTitle>
            <FormLogin onSubmit={handleLoginButton}>
              <DivLoginGroup>
                <SpanLoginLabel>아이디</SpanLoginLabel>
                <InputLogin type="text" className="logininput" value={username} onChange={e => setUsername(e.target.value)} />
                {/* <SpanLoginFocus></SpanLoginFocus>  */}
              </DivLoginGroup>
              <DivLoginGroup>
                <SpanLoginLabel>비밀번호</SpanLoginLabel>
                <InputLogin type="password" className="logininput" value={password} onChange={e => setPassword(e.target.value)} />
                {/* <SpanLoginFocus></SpanLoginFocus>  */}
              </DivLoginGroup>
              {!isLoginSuccess ?
                <div style={{ color: 'red' }}>
                  로그인에 실패했습니다.
                  </div> :
                null
              }
              <DivButtonWrapper>
                <ButtonLogin onClick={handleLoginButton}>로그인</ButtonLogin>
              </DivButtonWrapper>
            </FormLogin>
          </DivLoginBox>
        </DivLoginContainer>
      </DivWrapper>
    </div>
  );
}

export default Login;