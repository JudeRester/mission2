package com.malgn.mission2.domain.asset;

import java.util.List;

import com.malgn.mission2.domain.common.Criteria;

public class Search {
    private List<String> tag;
    private List<String> category;
    private String keyword;
    private Criteria crt;

    public List<String> getTag() {
        return this.tag;
    }

    public void setTag(List<String> tag) {
        this.tag = tag;
    }

    public List<String> getCategory() {
        return this.category;
    }

    public void setCategory(List<String> category) {
        this.category = category;
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
        return "{" + " tag='" + getTag() + "'" + ", category='" + getCategory() + "'" + ", keyword='" + getKeyword()
                + "'" + ", crt='" + getCrt() + "'" + "}";
    }

}
