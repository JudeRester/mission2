package com.malgn.mission2.domain;

import com.malgn.mission2.domain.common.Criteria;

public class UserSearch {
    private String condition;
    private String keyword;
    private Criteria crt;

    public String getCondition() {
        return this.condition;
    }

    public void setCondition(String condition) {
        this.condition = condition;
    }

    public String getKeyword() {
        return this.keyword;
    }

    public void setKeyword(String keyword) {
        this.keyword = keyword;
    }

    public Criteria getCrt() {
        return this.crt;
    }

    public void setCrt(Criteria crt) {
        this.crt = crt;
    }

    @Override
    public String toString() {
        return "{" + " condition='" + getCondition() + "'" + ", keyword='" + getKeyword() + "'" + ", crt='" + getCrt()
                + "'" + "}";
    }

}
