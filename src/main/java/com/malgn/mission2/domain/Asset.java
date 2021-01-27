package com.malgn.mission2.domain;

import java.time.LocalDateTime;

public class Asset {
    private int assetSeq;
    private String assetTitle;
    private String assetOwn;
    private String assetOwnName;
    private LocalDateTime assetCreateDate;
    private LocalDateTime assetUpdateDate;
    private int assetCategory;
    private String assetChanger;
    private String assetChangerName;
    private String tags;
    private String assetCategoryName;

    public int getAssetSeq() {
        return this.assetSeq;
    }

    public void setAssetSeq(int assetSeq) {
        this.assetSeq = assetSeq;
    }

    public String getAssetTitle() {
        return this.assetTitle;
    }

    public void setAssetTitle(String assetTitle) {
        this.assetTitle = assetTitle;
    }

    public String getAssetOwn() {
        return this.assetOwn;
    }

    public void setAssetOwn(String assetOwn) {
        this.assetOwn = assetOwn;
    }

    public String getAssetOwnName() {
        return this.assetOwnName;
    }

    public void setAssetOwnName(String assetOwnName) {
        this.assetOwnName = assetOwnName;
    }

    public LocalDateTime getAssetCreateDate() {
        return this.assetCreateDate;
    }

    public void setAssetCreateDate(LocalDateTime assetCreateDate) {
        this.assetCreateDate = assetCreateDate;
    }

    public LocalDateTime getAssetUpdateDate() {
        return this.assetUpdateDate;
    }

    public void setAssetUpdateDate(LocalDateTime assetUpdateDate) {
        this.assetUpdateDate = assetUpdateDate;
    }

    public int getAssetCategory() {
        return this.assetCategory;
    }

    public void setAssetCategory(int assetCategory) {
        this.assetCategory = assetCategory;
    }

    public String getAssetChanger() {
        return this.assetChanger;
    }

    public void setAssetChanger(String assetChanger) {
        this.assetChanger = assetChanger;
    }

    public String getAssetChangerName() {
        return this.assetChangerName;
    }

    public void setAssetChangerName(String assetChangerName) {
        this.assetChangerName = assetChangerName;
    }

    public String getTags() {
        return this.tags;
    }

    public void setTags(String tags) {
        this.tags = tags;
    }

    public String getAssetCategoryName() {
        return this.assetCategoryName;
    }

    public void setAssetCategoryName(String assetCategoryName) {
        this.assetCategoryName = assetCategoryName;
    }

    @Override
    public String toString() {
        return "{" + " assetSeq='" + getAssetSeq() + "'" + ", assetTitle='" + getAssetTitle() + "'" + ", assetOwn='"
                + getAssetOwn() + "'" + ", assetOwnName='" + getAssetOwnName() + "'" + ", assetCreateDate='"
                + getAssetCreateDate() + "'" + ", assetUpdateDate='" + getAssetUpdateDate() + "'" + ", assetCategory='"
                + getAssetCategory() + "'" + ", assetChanger='" + getAssetChanger() + "'" + ", assetChangerName='"
                + getAssetChangerName() + "'" + ", tags='" + getTags() + "'" + ", assetCategoryName='"
                + getAssetCategoryName() + "'" + "}";
    }

}
