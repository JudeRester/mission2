package com.malgn.mission2.service;

import java.util.List;

import com.malgn.mission2.domain.asset.Category;
import com.malgn.mission2.mapper.CategoryMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CategoryService {

    @Autowired
    CategoryMapper mapper;

    public List<Category> getCategoryList() {
        return mapper.getCategoryList();
    }

    public Category getCategoryInfo(int categoryId) {
        return mapper.getCategoryInfo(categoryId);
    }

    public int addCategory(Category dto) {
        return mapper.addCategory(dto);
    }

    public int deleteCategory(int c_id) {
        return mapper.deleteCategory(c_id);
    }

    public int updateCategoryName(Category dto) {
        return mapper.updateCategoryName(dto);
    }

}
