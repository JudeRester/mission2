package com.malgn.mission2.controller;

import com.malgn.mission2.domain.Response;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AssetController {
    @PostMapping("/api/asset")
    public Response<> createAsset() {

        return null;
    }
}
