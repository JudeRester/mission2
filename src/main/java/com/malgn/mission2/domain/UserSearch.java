package com.malgn.mission2.domain;

import com.malgn.mission2.domain.common.Criteria;

public class UserSearch {
    private String condition;
    private String keyword;
    private String orderBy;
    private String order;
    private Criteria crt;

    public String getOrderBy() {
        return this.orderBy;
    }

    public void setOrderBy(String orderBy) {
        this.orderBy = orderBy;
    }

    public String getOrder() {
        return this.order;
    }

    public void setOrder(String order) {
        this.order = order;
    }

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
        return "{" + " condition='" + getCondition() + "'" + ", keyword='" + getKeyword() + "'" + ", orderBy='"
                + getOrderBy() + "'" + ", order='" + getOrder() + "'" + ", crt='" + getCrt() + "'" + "}";
    }

}
