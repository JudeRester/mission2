package com.malgn.mission2.domain.asset;

public class AssetFile {
    private int assetSeq;
    private String assetOriginName;
    private String assetLocation;
    private long assetSize;
    private String assetType;
    private int isUploadComplete;
    private int currentChunk;
    private int totalChunk;

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

    public int getIsUploadComplete() {
        return this.isUploadComplete;
    }

    public void setIsUploadComplete(int isUploadComplete) {
        this.isUploadComplete = isUploadComplete;
    }

    public int getCurrentChunk() {
        return this.currentChunk;
    }

    public void setCurrentChunk(int currentChunk) {
        this.currentChunk = currentChunk;
    }

    public int getTotalChunk() {
        return this.totalChunk;
    }

    public void setTotalChunk(int totalChunk) {
        this.totalChunk = totalChunk;
    }

    @Override
    public String toString() {
        return "{" + " assetSeq='" + getAssetSeq() + "'" + ", assetOriginName='" + getAssetOriginName() + "'"
                + ", assetLocation='" + getAssetLocation() + "'" + ", assetSize='" + getAssetSize() + "'"
                + ", assetType='" + getAssetType() + "'" + ", isUploadComplete='" + getIsUploadComplete() + "'"
                + ", currentChunk='" + getCurrentChunk() + "'" + ", totalChunk='" + getTotalChunk() + "'" + "}";
    }

}
