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

    public String getTagName() {
        return assetTag;
    }

    public void setTagName(String tagName) {
        this.assetTag = tagName;
    }

    @Override
    public String toString() {
        return "Tags [tagImg=" + assetSeq + ", tagName=" + assetTag + ", count=" + count + "]";
    }

    public int getTagImg() {
        return assetSeq;
    }

    public void setTagImg(Integer tagImg) {
        this.assetSeq = tagImg;
    }

    public int getCount() {
        return count;
    }

    public void setCount(Integer count) {
        this.count = count;
    }
}
