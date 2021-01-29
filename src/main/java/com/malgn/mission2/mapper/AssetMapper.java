package com.malgn.mission2.mapper;

import com.malgn.mission2.domain.Asset;
import com.malgn.mission2.domain.AssetFile;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface AssetMapper {

    public void createAsset(Asset asset);

    public void upload(AssetFile dto);

    public void insertTags(Asset asset);

    public void completeAsset(Asset asset);

}
