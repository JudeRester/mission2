package com.malgn.mission2.mapper;

import java.util.List;

import com.malgn.mission2.domain.asset.Category;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CategoryMapper {
    public List<Category> getCategoryList();

    public Category getCategoryInfo(int categoryId);

    public int addCategory(Category dto);

    public int deleteCategory(int c_id);

}
