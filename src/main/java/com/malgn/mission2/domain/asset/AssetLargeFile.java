package com.malgn.mission2.domain.asset;

public class AssetLargeFile {
    private int assetSeq;
    private String assetOriginName;
    private String assetUuidName;
    private long assetSize;
    private String assetLocation;
    private String assetType;
    private int isUploadComplete;
    private int currentChunk;
    private int totalChunk;

    public String getAssetLocation() {
        return this.assetLocation;
    }

    public void setAssetLocation(String assetLocation) {
        this.assetLocation = assetLocation;
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
                + ", assetLocation='" + getAssetLocation() + "'" + ", assetType='" + getAssetType() + "'"
                + ", isUploadComplete='" + getIsUploadComplete() + "'" + ", currentChunk='" + getCurrentChunk() + "'"
                + ", totalChunk='" + getTotalChunk() + "'" + "}";
    }

}
