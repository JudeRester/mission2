package com.malgn.mission2.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.servlet.http.HttpServletResponse;

import com.malgn.mission2.domain.asset.Asset;
import com.malgn.mission2.domain.asset.AssetFile;
import com.malgn.mission2.domain.asset.AssetLargeFile;
import com.malgn.mission2.domain.asset.Category;
import com.malgn.mission2.domain.asset.Search;
import com.malgn.mission2.domain.asset.Tags;
import com.malgn.mission2.domain.common.Criteria;
import com.malgn.mission2.domain.common.Page;
import com.malgn.mission2.domain.common.Response;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.malgn.mission2.domain.UserInfo;
import com.malgn.mission2.service.AssetService;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.OutputStream;
import java.sql.Blob;
import java.sql.Date;

@RestController
@RequestMapping("/api")
public class AssetController {
    private final Logger log = LoggerFactory.getLogger(getClass());

    @Autowired
    private AssetService service;

    @PostMapping("/asset")
    public Response<Asset, Object> createAsset(@RequestBody Asset asset, Authentication auth) {
        log.debug("post...createAsset");
        UserInfo user = (UserInfo) auth.getPrincipal();
        asset.setAssetOwner(user.getUserId());
        service.createAsset(asset);
        Response<Asset, Object> res = new Response<>();
        res = res.success(asset, null);
        return res;
    }

    @DeleteMapping("/file")
    public Response<Object, Object> deleteFile(@RequestParam("assetLocation") String assetLocation) {
        Response<Object, Object> res = new Response<>();
        AssetFile assetFile = new AssetFile();
        assetFile.setAssetLocation(assetLocation);
        service.deleteFile(assetFile);
        res = res.success(null, null);
        return res;
    }

    @GetMapping("/createLocation/{assetSeq}")
    public Response<String, Object> createLocation(@PathVariable("assetSeq") int assetSeq,
            @Value("${property.image.location}") String path) {
        Calendar c = Calendar.getInstance();
        // 운영체제 별 경로
        String os = System.getProperty("os.name").toLowerCase();
        if (os.contains("win"))
            path = "c:" + path;
        else if (os.contains("mac"))
            path = System.getProperty("user.home") + path;
        // 운영체제 별 경로 end

        // 경로 생성
        String month = Integer.toString(c.get(c.MONTH) + 1);
        String date = Integer.toString(c.get(c.DATE));

        if (month.length() == 1)
            month = "0" + month;
        if (date.length() == 1)
            date = "0" + date;
        path = path + c.get(c.YEAR) + "/" + month + "/" + date + "/" + assetSeq + "/";
        // 경로 생성 end
        return new Response<String, Object>().success(path, null);
    }

    @PostMapping("/file")
    public Response<AssetLargeFile, Object> uploadLargeFile(@RequestBody byte[] chunkData,
            @RequestParam("assetLargeFile") Object assetLargeFileObject) {
        log.debug("post...upload large file");
        ObjectMapper objectMapper = new ObjectMapper();
        String parseHelper = assetLargeFileObject.toString();
        AssetLargeFile assetLargeFile = new AssetLargeFile();
        try {
            assetLargeFile = objectMapper.readValue(parseHelper, AssetLargeFile.class);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        File file = new File(assetLargeFile.getAssetLocation() + assetLargeFile.getAssetUuidName());
        File folder = new File(assetLargeFile.getAssetLocation());

        try {
            if (!folder.exists()) {
                folder.mkdirs();
            }
            FileOutputStream lFileOutputStream = new FileOutputStream(file, true);
            lFileOutputStream.write(chunkData);
            lFileOutputStream.close();

        } catch (Exception e) {
            log.error("{}", e.getMessage(), e);
        } finally {
            if (assetLargeFile.getCurrentChunk() == 0) {
                AssetFile dto = new AssetFile();
                dto = assetLargeFile;
                if (assetLargeFile.getCurrentChunk() == assetLargeFile.getTotalChunk() - 1) {
                    dto.setIsUploadComplete(1);
                    try {
                        if (assetLargeFile.getAssetType().contains("image")) {
                            String fileOriginName = assetLargeFile.getAssetOriginName();
                            service.makeThumbnail(assetLargeFile.getAssetLocation(), assetLargeFile.getAssetUuidName(),
                                    fileOriginName.substring(fileOriginName.lastIndexOf(".") + 1));
                        }
                    } catch (Exception e) {
                        log.error("{}", e.getMessage(), e);
                    }
                }
                dto.setAssetLocation(assetLargeFile.getAssetLocation() + assetLargeFile.getAssetUuidName());
                service.upload(dto);
            } else {
                AssetFile dto = new AssetFile();
                dto = assetLargeFile;
                if (assetLargeFile.getCurrentChunk() == assetLargeFile.getTotalChunk() - 1) {
                    dto.setIsUploadComplete(1);
                    try {
                        if (assetLargeFile.getAssetType().contains("image")) {
                            String fileOriginName = assetLargeFile.getAssetOriginName();
                            service.makeThumbnail(assetLargeFile.getAssetLocation(), assetLargeFile.getAssetUuidName(),
                                    fileOriginName.substring(fileOriginName.lastIndexOf(".") + 1));
                        }
                    } catch (Exception e) {
                        log.error("{}", e.getMessage(), e);
                    }
                }
                dto.setAssetLocation(assetLargeFile.getAssetLocation() + assetLargeFile.getAssetUuidName());
                service.fileUploadUpdate(dto);
            }
        }
        return new Response<AssetLargeFile, Object>().success(assetLargeFile, null);
    }

    @PostMapping("/complete")
    public Response<Object, Object> completeAsset(@RequestBody Asset asset) {
        service.completeAsset(asset);
        return null;
    }

    @GetMapping("/asset/{assetSeq}")
    public Response<Asset, Object> getAsset(@PathVariable("assetSeq") int assetSeq) {
        Asset dto = service.getAsset(assetSeq);
        dto.setAssetFiles(service.getFiles(assetSeq));
        Response<Asset, Object> res = new Response<Asset, Object>().success(dto, null);
        return res;
    }

    @CrossOrigin(origins = "*")
    @PutMapping("/asset")
    public Response<String, Object> updateAsset(@RequestBody Asset dto, Authentication auth) {
        UserInfo user = (UserInfo) auth.getPrincipal();
        dto.setAssetChanger(user.getUserId());
        service.assetUpdate(dto);
        Response<String, Object> res = new Response<>();
        res = res.success("Modified", null);
        return res;
    }

    @PutMapping("/asset/{assetSeq}")
    public Response<String, Object> updateAssetBeforeComplete(@RequestBody Asset dto) {
        service.assetUpdateBeforeComplete(dto);
        Response<String, Object> res = new Response<>();
        return res;
    }

    @DeleteMapping("/asset/{assetSeq}")
    public Response<Object, Object> deleteAsset(@PathVariable("assetSeq") int assetSeq, @RequestParam String assetOwner,
            Authentication auth) {
        UserInfo user = (UserInfo) auth.getPrincipal();
        Response<Object, Object> res = new Response<>();
        if (user.getUserId().equals(assetOwner) || user.getUserRole().equals("ROLE_ADMIN")) {
            service.deleteAsset(assetSeq);
            res = res.success("삭제 성공", null);
        } else {
            res = res.failed("권한이 없습니다", null);
        }
        return res;
    }

    @GetMapping("/list/{pageNum}")
    public Response<List<Asset>, Object> getAssetList(@PathVariable("pageNum") int pageNum) {
        Criteria crt = new Criteria();
        crt.setPageNum(pageNum);
        crt.setAmount(20);
        List<Asset> list = service.getAssetList(crt);
        for (Asset a : list) {
            a.setLocationArray(a.getLocations().trim().split("\\s*,\\s*"));
        }
        Response<List<Asset>, Object> res = new Response<>();
        res = res.success(list, new Page(crt, service.total()));
        return res;
    }

    @DeleteMapping("/tag")
    public Response<String, Object> deleteTag(@RequestParam("assetTag") String assetTag,
            @RequestParam("assetSeq") int assetSeq) {
        Response<String, Object> res = new Response<>();
        Tags dto = new Tags();
        dto.setAssetSeq(assetSeq);
        dto.setAssetTag(assetTag);
        service.deleteTag(dto);
        String list = service.getAssetTagList(dto.getAssetSeq());
        res = res.success(list, null);
        return res;
    }

    @PostMapping("/tag")
    public Response<String, Object> insertTag(@RequestParam("assetTag") String assetTag,
            @RequestParam("assetSeq") int assetSeq) {
        Response<String, Object> res = new Response<>();
        Tags dto = new Tags();
        dto.setAssetSeq(assetSeq);
        dto.setAssetTag(assetTag);
        service.insertTag(dto);
        String list = service.getAssetTagList(dto.getAssetSeq());
        res = res.success(list, null);
        return res;
    }

    @GetMapping("/tag/list")
    public Response<List<Tags>, Object> getTagList() {
        Response<List<Tags>, Object> res = new Response<>();
        res = res.success(service.getTagList(), null);
        return res;
    }

    @GetMapping("/search")
    public Response<List<Asset>, Object> search(Criteria crt, Search src) {
        crt.setAmount(20);
        src.setCrt(crt);
        log.info(src.toString());
        List<Asset> list = service.search(src);
        for (Asset a : list) {
            a.setLocationArray(a.getLocations().trim().split("\\s*,\\s*"));
        }
        Response<List<Asset>, Object> res = new Response<>();
        res = res.success(list, new Page(crt, service.searchTotal(src)));
        return res;
    }

    @GetMapping(path = "download")
    public void downloadFile(@RequestParam("fileLocation") String fileLocation, HttpServletResponse response)
            throws IOException {
        response.setHeader("Content-Transfer-Encoding", "binary");
        response.setHeader("Content-Type", "application/octet-stream");
        // response.setHeader("Content-Length", fileLength);
        response.setHeader("Pragma", "no-cache;");
        response.setHeader("Expires", "-1;");

        OutputStream os = response.getOutputStream();
        FileInputStream fis = new FileInputStream(fileLocation);

        int readCount = 0;
        byte[] buffer = new byte[1024];

        while ((readCount = fis.read(buffer)) != -1) {
            os.write(buffer, 0, readCount);
        }

        fis.close();
        os.close();

    }

    @GetMapping(path = "uploaded/{assetSeq}")
    public Response<List<AssetLargeFile>, Object> getUploadedFilesInfo(@PathVariable("assetSeq") int assetSeq) {
        Response<List<AssetLargeFile>, Object> res = new Response<>();
        res = res.success(service.getUploadedFilesInfo(assetSeq), null);
        return res;
    }
}
