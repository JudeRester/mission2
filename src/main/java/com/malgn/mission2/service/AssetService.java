package com.malgn.mission2.service;

import com.malgn.mission2.domain.Asset;
import com.malgn.mission2.domain.AssetFile;
import com.malgn.mission2.domain.AssetLargeFile;
import com.malgn.mission2.mapper.AssetMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AssetService {

    @Autowired
    private AssetMapper mapper;

    public void createAsset(Asset asset) {
        mapper.createAsset(asset);
    }

    public void upload(AssetFile dto) {
        mapper.upload(dto);
    }

    public void completeAsset(Asset asset) {
        mapper.completeAsset(asset);
        mapper.insertTags(asset);
    }

    public void upload(AssetLargeFile assetLargeFile) {
        mapper.upload(assetLargeFile);
    }

}
