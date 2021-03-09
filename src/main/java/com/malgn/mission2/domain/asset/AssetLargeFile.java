package com.malgn.mission2.domain.asset;

public class AssetLargeFile extends AssetFile {
    private int assetSeq;
    private String assetOriginName;
    private String assetUuidName;
    private long assetSize;
    private String assetLocation;
    private String assetType;
    private int isUploadComplete;
    private int currentChunk;
    private int totalChunk;
    private long uploadedSize;

    public long getUploadedSize() {
        return this.uploadedSize;
    }

    public void setUploadedSize(long uploadedSize) {
        this.uploadedSize = uploadedSize;
    }

    @Override
    public String getAssetLocation() {
        return this.assetLocation;
    }

    @Override
    public void setAssetLocation(String assetLocation) {
        this.assetLocation = assetLocation;
    }

    @Override
    public int getIsUploadComplete() {
        return this.isUploadComplete;
    }

    @Override
    public void setIsUploadComplete(int isUploadComplete) {
        this.isUploadComplete = isUploadComplete;
    }

    @Override
    public int getCurrentChunk() {
        return this.currentChunk;
    }

    @Override
    public void setCurrentChunk(int currentChunk) {
        this.currentChunk = currentChunk;
    }

    @Override
    public int getTotalChunk() {
        return this.totalChunk;
    }

    @Override
    public void setTotalChunk(int totalChunk) {
        this.totalChunk = totalChunk;
    }

    @Override
    public int getAssetSeq() {
        return this.assetSeq;
    }

    @Override
    public void setAssetSeq(int assetSeq) {
        this.assetSeq = assetSeq;
    }

    @Override
    public String getAssetOriginName() {
        return this.assetOriginName;
    }

    @Override
    public void setAssetOriginName(String assetOriginName) {
        this.assetOriginName = assetOriginName;
    }

    public String getAssetUuidName() {
        return this.assetUuidName;
    }

    public void setAssetUuidName(String assetUuidName) {
        this.assetUuidName = assetUuidName;
    }

    @Override
    public long getAssetSize() {
        return this.assetSize;
    }

    @Override
    public void setAssetSize(long assetSize) {
        this.assetSize = assetSize;
    }

    @Override
    public String getAssetType() {
        return this.assetType;
    }

    @Override
    public void setAssetType(String assetType) {
        this.assetType = assetType;
    }

    @Override
    public String toString() {
        return "{" + " assetSeq='" + getAssetSeq() + "'" + ", assetOriginName='" + getAssetOriginName() + "'"
                + ", assetUuidName='" + getAssetUuidName() + "'" + ", assetSize='" + getAssetSize() + "'"
                + ", assetLocation='" + getAssetLocation() + "'" + ", assetType='" + getAssetType() + "'"
                + ", isUploadComplete='" + getIsUploadComplete() + "'" + ", currentChunk='" + getCurrentChunk() + "'"
                + ", totalChunk='" + getTotalChunk() + "'" + ", uploadedSize='" + getUploadedSize() + "'" + "}";
    }

}
