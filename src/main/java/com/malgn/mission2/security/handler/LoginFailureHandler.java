package com.malgn.mission2.security.handler;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;

public class LoginFailureHandler implements AuthenticationFailureHandler {

    private String errormsg;
    private String defaultFailureUrl = "/login";
    private ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void onAuthenticationFailure(HttpServletRequest req, HttpServletResponse res,
            AuthenticationException exception) throws IOException, ServletException {
        String userid = req.getParameter("userId");

        if (exception instanceof UsernameNotFoundException) {
            errormsg = "일치하는 아이디가 없습니다.";
        } else if (exception instanceof BadCredentialsException) {
            errormsg = "비밀번호가 일치하지 않습니다.";
        }

        HttpSession session = req.getSession();

        session.setAttribute("errormsg", errormsg);
        session.setAttribute("inputId", userid);
        System.out.println(errormsg);
        res.getOutputStream().println(objectMapper.writeValueAsString(errormsg));
        // req.getRequestDispatcher(defaultFailureUrl).forward(req, res);
    }
}