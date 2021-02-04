package com.malgn.mission2.domain;

import java.sql.Blob;

public class AssetLargeFile {
    private int assetSeq;
    private String assetOriginName;
    private String assetUuidName;
    private int assetSize;
    private boolean isLastChunk;
    private String location;

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

    public int getAssetSize() {
        return this.assetSize;
    }

    public void setAssetSize(int assetSize) {
        this.assetSize = assetSize;
    }

    public boolean isIsLastChunk() {
        return this.isLastChunk;
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

    @Override
    public String toString() {
        return "{" + " assetSeq='" + getAssetSeq() + "'" + ", assetOriginName='" + getAssetOriginName() + "'"
                + ", assetUuidName='" + getAssetUuidName() + "'" + ", assetSize='" + getAssetSize() + "'"
                + ", isLastChunk='" + isIsLastChunk() + "'" + ", location='" + getLocation() + "'" + ", chunkData='"
                + "}";
    }

}
