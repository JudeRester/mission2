package com.malgn.mission2.domain.asset;

public class Tags {
    private Integer assetSeq;
    private String assetTag;
    private int count;

    public Tags() {

    }

    public Tags(Integer tagImg, String tagName) {
        this.assetSeq = tagImg;
        this.assetTag = tagName;
    }

    public Integer getAssetSeq() {
        return this.assetSeq;
    }

    public void setAssetSeq(Integer assetSeq) {
        this.assetSeq = assetSeq;
    }

    public String getAssetTag() {
        return this.assetTag;
    }

    public void setAssetTag(String assetTag) {
        this.assetTag = assetTag;
    }

    public int getCount() {
        return this.count;
    }

    public void setCount(int count) {
        this.count = count;
    }

    @Override
    public String toString() {
        return "{" + " assetSeq='" + getAssetSeq() + "'" + ", assetTag='" + getAssetTag() + "'" + ", count='"
                + getCount() + "'" + "}";
    }

}
