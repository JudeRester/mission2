package com.malgn.mission2.domain.asset;

public class AssetLargeFile {
    private int assetSeq;
    private byte[] chunk;
    private String assetOriginName;
    private String assetUuidName;
    private long assetSize;
    private boolean isLastChunk;
    private String location;
    private String assetType;
    private int assetCategory;
    private int isUploadComplete;
    private int currentChunk;
    private int totalChunk;

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

    public int getAssetCategory() {
        return this.assetCategory;
    }

    public void setAssetCategory(int assetCategory) {
        this.assetCategory = assetCategory;
    }

    @Override
    public String toString() {
        return "{" + " assetSeq='" + getAssetSeq() + "'" + ", assetOriginName='" + getAssetOriginName() + "'"
                + ", assetUuidName='" + getAssetUuidName() + "'" + ", assetSize='" + getAssetSize() + "'"
                + ", isLastChunk='" + isIsLastChunk() + "'" + ", location='" + getLocation() + "'" + ", assetType='"
                + getAssetType() + "'" + ", assetCategory='" + getAssetCategory() + "'" + ", isUploadComplete='"
                + getIsUploadComplete() + "'" + ", currentChunk='" + getCurrentChunk() + "'" + ", totalChunk='"
                + getTotalChunk() + "'" + "}";
    }

}
