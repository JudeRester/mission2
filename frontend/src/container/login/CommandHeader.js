import React, {useEffect, useState} from 'react';
import { Link, useHistory } from 'react-router-dom';

const CommonHeader = () => {
    let history = useHistory();

    const logout = () => {
      sessionStorage.removeItem("sessionUser");
      history.push("/");
    }
    
    return (
      <div className="container">
        <div className="row">
   
          <div className="col-lg-2">
            <div id="common-header-logo">
              <p>Malgn</p>
            </div>
          </div>
   
   
          <div className="col-lg-2">
   
            {/* {!loginedAccount &&
              <div id="common-header-links">
                <Link to="/account/login">
                  <span className="btn-link btn-sm">로그인</span>
                </Link>
                <Link to="/account/term-n-condition">
                  <span className="btn-link btn-sm">회원가입</span>
                </Link>
              </div>
            } */}
            {/* {loginedAccount && */}
              <div id="common-header-links">
   
                  <span onClick={logout} className="btn-link btn-sm">로그아웃</span>
        
              </div>
            {/* } */}
   
          </div>
   
        </div>
      </div >
    );
  }
   
  export default CommonHeader;
  