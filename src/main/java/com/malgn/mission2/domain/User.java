package com.malgn.mission2.domain;

public class User {
    private String userId;
    private String userPass;
    private String userName;
    private String userEmail;
    private String userPhone;

    public String getUserId() {
        return this.userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUserPass() {
        return this.userPass;
    }

    public void setUserPass(String userPass) {
        this.userPass = userPass;
    }

    public String getUserName() {
        return this.userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserEmail() {
        return this.userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getUserPhone() {
        return this.userPhone;
    }

    public void setUserPhone(String userPhone) {
        this.userPhone = userPhone;
    }

    @Override
    public String toString() {
        return "{" + " userId='" + getUserId() + "'" + ", userPass='" + getUserPass() + "'" + ", userName='"
                + getUserName() + "'" + ", userEmail='" + getUserEmail() + "'" + ", userPhone='" + getUserPhone() + "'"
                + "}";
    }
}
