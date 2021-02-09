package com.malgn.mission2.domain.asset;

public class AssetLargeFile {
    private int assetSeq;
    private String assetOriginName;
    private String assetUuidName;
    private long assetSize;
    private boolean isLastChunk;
    private String location;
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

    public String getAssetUuidName() {
        return this.assetUuidName;
    }

    public void setAssetUuidName(String assetUuidName) {
        this.assetUuidName = assetUuidName;
    }

    public long getAssetSize() {
        return this.assetSize;
    }

    public void setAssetSize(long assetSize) {
        this.assetSize = assetSize;
    }

    public boolean getIsLastChunk() {
        return this.isLastChunk;
    }

    public void setIsLastChunk(boolean isLastChunk) {
        this.isLastChunk = isLastChunk;
    }

    public String getLocation() {
        return this.location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public boolean isIsLastChunk() {
        return this.isLastChunk;
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
                + ", assetUuidName='" + getAssetUuidName() + "'" + ", assetSize='" + getAssetSize() + "'"
                + ", isLastChunk='" + isIsLastChunk() + "'" + ", location='" + getLocation() + "'" + ", assetType='"
                + getAssetType() + "'" + "}";
    }

}
