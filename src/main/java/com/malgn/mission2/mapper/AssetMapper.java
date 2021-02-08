package com.malgn.mission2.mapper;

import java.util.ArrayList;

import com.malgn.mission2.domain.Asset;
import com.malgn.mission2.domain.AssetFile;
import com.malgn.mission2.domain.AssetLargeFile;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface AssetMapper {

    public void createAsset(Asset asset);

    public void upload(AssetFile dto);

    public void upload(AssetLargeFile dto);

    public void insertTags(Asset asset);

    public void completeAsset(Asset asset);

	public Asset getAsset(int assetSeq);

	public ArrayList<Asset> getFiles(int assetSeq);

}
