package com.malgn.mission2.domain;

public class AssetFile {
    private int assetSeq;
    private String assetOriginName;
    private String assetLocation;
    private long assetSize;
    private String type;

    public int getAssetSeq() {
        return this.assetSeq;
    }

    public void setAssetSeq(int assetSeq) {
        this.assetSeq = assetSeq;
    }

    public String getAssetOriginName() {
        return this.assetOriginName;
    }

    public void setAssetOriginName(String assetOriginName) {
        this.assetOriginName = assetOriginName;
    }

    public String getAssetLocation() {
        return this.assetLocation;
    }

    public void setAssetLocation(String assetLocation) {
        this.assetLocation = assetLocation;
    }

    public long getAssetSize() {
        return this.assetSize;
    }

    public void setAssetSize(long assetSize) {
        this.assetSize = assetSize;
    }

    public String getType() {
        return this.type;
    }

    public void setType(String type) {
        this.type = type;
    }

    @Override
    public String toString() {
        return "{" + " assetSeq='" + getAssetSeq() + "'" + ", assetOriginName='" + getAssetOriginName() + "'"
                + ", assetLocation='" + getAssetLocation() + "'" + ", assetSize='" + getAssetSize() + "'" + ", type='"
                + getType() + "'" + "}";
    }

}
