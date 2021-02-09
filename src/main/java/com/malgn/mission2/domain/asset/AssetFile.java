package com.malgn.mission2.domain.asset;

public class AssetFile {
    private int assetSeq;
    private String assetOriginName;
    private String assetLocation;
    private long assetSize;
    private String assetType;

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

    public String getAssetType() {
        return this.assetType;
    }

    public void setAssetType(String assetType) {
        this.assetType = assetType;
    }

    @Override
    public String toString() {
        return "{" + " assetSeq='" + getAssetSeq() + "'" + ", assetOriginName='" + getAssetOriginName() + "'"
                + ", assetLocation='" + getAssetLocation() + "'" + ", assetSize='" + getAssetSize() + "'"
                + ", assetType='" + getAssetType() + "'" + "}";
    }

}
