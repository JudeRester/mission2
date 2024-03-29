package com.malgn.mission2.domain;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public class UserInfo implements UserDetails {

    private String userId;
    private String userPass;
    private String userName;
    private String userRole;
    private String userEmail;
    private String userPhone;
    private LocalDateTime userCreateDate;

    public UserInfo(String userId, String useraName, String userPass, String userRole) {
        this.userId = userId;
        this.userPass = userPass;
        this.userName = useraName;
        this.userRole = userRole;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Set<GrantedAuthority> role = new HashSet<>();
        role.add(new SimpleGrantedAuthority(userRole));
        return role;
    }

    @Override
    public String getPassword() {
        return userPass;
    }

    @Override
    public String getUsername() {
        return userId;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUserPass() {
        return userPass;
    }

    public void setUserPass(String userPass) {
        this.userPass = userPass;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserRole() {
        return userRole;
    }

    public void setUserRole(String userRole) {
        this.userRole = userRole;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getUserPhone() {
        return userPhone;
    }

    public void setUserPhone(String userPhone) {
        this.userPhone = userPhone;
    }

    public LocalDateTime getUsercreatedate() {
        return userCreateDate;
    }

    public void setUsercreatedate(LocalDateTime usercreatedate) {
        this.userCreateDate = usercreatedate;
    }

    @Override
    public String toString() {
        return "{" + " userId='" + getUserId() + "'" + ", userPass='" + getUserPass() + "'" + ", userName='"
                + getUserName() + "'" + ", userRole='" + getUserRole() + "'" + ", userEmail='" + getUserEmail() + "'"
                + ", userPhone='" + getUserPhone() + "'" + ", usercreatedate='" + getUsercreatedate() + "'" + "'" + "}";
    }

}
