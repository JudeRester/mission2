package com.malgn.mission2.service;

import com.malgn.mission2.domain.Asset;
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

}
