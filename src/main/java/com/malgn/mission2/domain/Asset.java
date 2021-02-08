package com.malgn.mission2.domain;

import java.time.LocalDateTime;
import java.util.ArrayList;

public class Asset {
    private int assetSeq;
    private String assetTitle;
    private String assetOwner;
    private String assetOwnerName;
    private LocalDateTime assetCreateDate;
    private LocalDateTime assetUpdateDate;
    private int assetCategory;
    private String assetChanger;
    private String assetChangerName;
    private String tags;
    private String assetCategoryName;
    private int assetIsComplete;
    private ArrayList<Asset> assetFiles;

    public String getAssetOwner() {
        return this.assetOwner;
    }

    public void setAssetOwner(String assetOwner) {
        this.assetOwner = assetOwner;
    }

    public String getAssetOwnerName() {
        return this.assetOwnerName;
    }

    public void setAssetOwnerName(String assetOwnerName) {
        this.assetOwnerName = assetOwnerName;
    }

    public int getAssetIsComplete() {
        return this.assetIsComplete;
    }

    public void setAssetIsComplete(int assetIsComplete) {
        this.assetIsComplete = assetIsComplete;
    }

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
        return this.assetOwner;
    }

    public void setAssetOwn(String assetOwn) {
        this.assetOwner = assetOwn;
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


    public ArrayList<Asset> getAssetFiles() {
        return this.assetFiles;
    }

    public void setAssetFiles(ArrayList<Asset> assetFiles) {
        this.assetFiles = assetFiles;
    }
  

    @Override
    public String toString() {
        return "{" +
            " assetSeq='" + getAssetSeq() + "'" +
            ", assetTitle='" + getAssetTitle() + "'" +
            ", assetOwner='" + getAssetOwner() + "'" +
            ", assetOwnerName='" + getAssetOwnerName() + "'" +
            ", assetCreateDate='" + getAssetCreateDate() + "'" +
            ", assetUpdateDate='" + getAssetUpdateDate() + "'" +
            ", assetCategory='" + getAssetCategory() + "'" +
            ", assetChanger='" + getAssetChanger() + "'" +
            ", assetChangerName='" + getAssetChangerName() + "'" +
            ", tags='" + getTags() + "'" +
            ", assetCategoryName='" + getAssetCategoryName() + "'" +
            ", assetIsComplete='" + getAssetIsComplete() + "'" +
            ", assetFiles='" + getAssetFiles() + "'" +
            "}";
    }


}
