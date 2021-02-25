package com.malgn.mission2.controller;

import java.util.List;

import com.malgn.mission2.domain.asset.Category;
import com.malgn.mission2.domain.common.Response;
import com.malgn.mission2.service.CategoryService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "api/category")
public class CategocyController {
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
}
