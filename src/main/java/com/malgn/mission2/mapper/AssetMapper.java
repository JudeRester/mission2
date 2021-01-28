package com.malgn.mission2.mapper;

import com.malgn.mission2.domain.Asset;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface AssetMapper {

    public void createAsset(Asset asset);

}
