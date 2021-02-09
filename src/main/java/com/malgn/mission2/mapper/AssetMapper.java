package com.malgn.mission2.mapper;

import java.util.ArrayList;
import java.util.List;

import com.malgn.mission2.domain.asset.Asset;
import com.malgn.mission2.domain.asset.AssetFile;
import com.malgn.mission2.domain.asset.AssetLargeFile;
import com.malgn.mission2.domain.asset.Category;
import com.malgn.mission2.domain.asset.Tags;
import com.malgn.mission2.domain.common.Criteria;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface AssetMapper {

    public void createAsset(Asset asset);

    public void upload(AssetFile dto);

    public void upload(AssetLargeFile dto);

    public void insertTags(List<Tags> tagDTOlist);

    public void completeAsset(Asset asset);

    public Asset getAsset(int assetSeq);

    public ArrayList<Asset> getFiles(int assetSeq);

    public List<Asset> getAssetList(Criteria crt);

    public int total();

    public List<Category> getCategoryList();

}
