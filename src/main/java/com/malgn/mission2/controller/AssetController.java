package com.malgn.mission2.controller;

import java.util.ArrayList;
import java.util.Map;

import com.malgn.mission2.domain.Asset;
import com.malgn.mission2.domain.Response;
import com.malgn.mission2.domain.UserInfo;
// import com.malgn.mission2.domain.asset.Asset;
import com.malgn.mission2.service.AssetService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AssetController {
    private final Logger log = LoggerFactory.getLogger(getClass());

    @Autowired
    private AssetService service;

    @PostMapping("/api/asset")
    public Response<Asset, Object> createAsset(@RequestBody Asset asset, Authentication auth) {
        log.debug("post...createAsset");
        UserInfo user = (UserInfo) auth.getPrincipal();
        asset.setAssetOwn(user.getUserId());
        service.createAsset(asset);
        Response<Asset, Object> res = new Response<>();
        res = res.success(asset, null);
        return res;
    }
}
