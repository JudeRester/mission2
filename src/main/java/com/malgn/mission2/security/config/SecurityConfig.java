package com.malgn.mission2.security.config;

import com.malgn.mission2.security.handler.LoginFailureHandler;
import com.malgn.mission2.security.handler.LoginSuccessHandler;
import com.malgn.mission2.security.filter.CustomUsernamePasswordAuthenticationFilter;
import com.malgn.mission2.service.MemberService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private MemberService service;
    @Autowired
    public PasswordEncoder passwordEncoder;

    // @Override
    // public void configure(WebSecurity web) throws Exception {
    // web.ignoring().antMatchers("/frontend/**");
    // }

    @Override
    protected void configure(HttpSecurity http) throws Exception {

        http.cors().configurationSource(request -> new CorsConfiguration().applyPermitDefaultValues());

        http.authorizeRequests().antMatchers("/api/login").permitAll()
                // .antMatchers("/**").authenticated()
                .and().csrf().disable();
        http.addFilterAt(getAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
        http.formLogin().disable();

        http.logout().logoutRequestMatcher(new AntPathRequestMatcher("/api/logout")).clearAuthentication(true)
                .invalidateHttpSession(true);

    }

    public DaoAuthenticationProvider daoAuthenticationProvider() {
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
        authenticationProvider.setUserDetailsService(service);
        authenticationProvider.setPasswordEncoder(passwordEncoder);
        authenticationProvider.setHideUserNotFoundExceptions(false);
        return authenticationProvider;
    }

    @Override
    public void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.authenticationProvider(daoAuthenticationProvider());
    }

    @Bean
    public AuthenticationFailureHandler loginFailHandler() {
        return new LoginFailureHandler();
    }

    @Bean
    public LoginSuccessHandler loginSuccessHandler() {
        return new LoginSuccessHandler();
    }

    protected CustomUsernamePasswordAuthenticationFilter getAuthenticationFilter() {
        CustomUsernamePasswordAuthenticationFilter authFilter = new CustomUsernamePasswordAuthenticationFilter();

        try {
            authFilter.setFilterProcessesUrl("/api/login");
            authFilter.setAuthenticationManager(this.authenticationManagerBean());
            authFilter.setUsernameParameter("userId");
            authFilter.setPasswordParameter("userPass");
            authFilter.setAuthenticationSuccessHandler(loginSuccessHandler());
            authFilter.setAuthenticationFailureHandler(loginFailHandler());
        } catch (

        Exception e) {
            e.printStackTrace();
        }
        return authFilter;
    }
}
