package com.malgn.mission2.controller;

import java.util.List;

import com.malgn.mission2.domain.asset.Category;
import com.malgn.mission2.domain.common.Response;
import com.malgn.mission2.service.CategoryService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "api/category")
public class CategoryController {
    private final Logger log = LoggerFactory.getLogger(getClass());

    @Autowired
    private CategoryService service;

    @GetMapping(path = "list")
    public Response<List<Category>, Object> categoryList() {
        log.debug("get...categoryList");
        List<Category> list = service.getCategoryList();
        Response<List<Category>, Object> res = new Response<>();
        res = res.success(list, null);
        return res;
    }

    @GetMapping(path = "{categoryId}")
    public Response<Category, Object> getCategoryInfo(@PathVariable("categoryId") int categoryId) {
        log.debug("get category info");
        Response<Category, Object> res = new Response<>();
        Category category = service.getCategoryInfo(categoryId);
        res = res.success(category, null);
        return res;
    }

    @PostMapping(path = "")
    public Response<String, Object> addCategory(@RequestBody Category dto) {
        log.debug("post...addCategory" + dto.toString());
        Response<String, Object> res = new Response<>();
        int record = service.addCategory(dto);
        res = res.success(record + "개 레코드 삽입", null);
        return res;
    }

    @DeleteMapping(path = "{categoryId}")
    public Response<String, Object> deleteCategory(@PathVariable("categoryId") int categoryId) {
        Response<String, Object> res = new Response<>();
        res = res.success(service.deleteCategory(categoryId) + "개 레코드 삭제", null);
        return res;
    }

    @PutMapping(path = "")
    public Response<String, Object> updateCategory(@RequestBody Category dto) {
        Response<String, Object> res = new Response<>();
        res = res.success(service.updateCategoryName(dto) + "개 레코드 수정", null);
        return res;
    }

    @PutMapping(value = "order")
    public Response<String, Object> updateCategoryOrder(@RequestBody Category dto) {
        Response<String, Object> res = new Response<>();

        res = res.success(service.updateCategoryOrder(dto)+"", null);
        return null;
    }
}
