package com.malgn.mission2.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Calendar;
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
import com.malgn.mission2.domain.UserInfo;
import com.malgn.mission2.service.AssetService;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
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

    @PostMapping("/file")
    public Response<Object, Object> uploadSmallFile(@RequestParam("file") MultipartFile mf,
            @RequestParam("assetSeq") int assetSeq, @RequestParam("assetType") String type,
            @Value("${property.image.location}") String path) {
        log.debug("post...upload small file");
        Calendar c = Calendar.getInstance();
        // 운영체제 별 경로
        String os = System.getProperty("os.name").toLowerCase();
        if (os.contains("win"))
            path = "c:" + path;
        else if (os.contains("mac"))
            path = System.getProperty("user.home") + path;
        // 운영체제 별 경로 end
        String month = Integer.toString(c.get(c.MONTH) + 1);
        String date = Integer.toString(c.get(c.DATE));

        if (month.length() == 1)
            month = "0" + month;
        if (date.length() == 1)
            date = "0" + date;

        path = path + c.get(c.YEAR) + "/" + month + "/" + date + "/" + assetSeq + "/";
        String fileExt = FilenameUtils.getExtension(mf.getOriginalFilename());
        String fileName = UUID.randomUUID() + "." + fileExt;
        File file = new File(path + fileName);
        File folder = new File(path);
        // UserInfo user = (UserInfo)auth.getPrincipal();
        AssetFile dto = new AssetFile();
        dto.setAssetOriginName(mf.getOriginalFilename());
        dto.setAssetLocation(path + fileName);
        dto.setAssetSize(mf.getSize());
        dto.setAssetSeq(assetSeq);
        dto.setAssetType(type);

        // List<Tags> tagDTOlist = new ArrayList<Tags>();
        // StringTokenizer tkn = new StringTokenizer(tags, ",");
        try {
            if (!folder.exists()) {
                folder.mkdirs();
                log.debug("mkdir");
            }

            InputStream is = mf.getInputStream();
            FileUtils.copyInputStreamToFile(is, file);
            log.debug("image uploaded");

            service.upload(dto);
            if (type.contains("image"))
                service.makeThumbnail(path, fileName, fileExt);

        } catch (Exception e) {
            log.error("{}", e.getMessage(), e);
        }
        return null;
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

    @PostMapping("/prelargefile")
    public Response<AssetLargeFile, Object> preLargeFile(@RequestBody AssetLargeFile assetLargeFile,
            @Value("${property.image.location}") String path) {
        Calendar c = Calendar.getInstance();
        // 운영체제 별 경로
        String os = System.getProperty("os.name").toLowerCase();
        if (os.contains("win"))
            path = "c:" + path;
        else if (os.contains("mac"))
            path = System.getProperty("user.home") + path;
        // 운영체제 별 경로 end
        String month = Integer.toString(c.get(c.MONTH) + 1);
        String date = Integer.toString(c.get(c.DATE));

        if (month.length() == 1)
            month = "0" + month;
        if (date.length() == 1)
            date = "0" + date;
        String fileOriginName = assetLargeFile.getAssetOriginName();
        path = path + c.get(c.YEAR) + "/" + month + "/" + date + "/" + assetLargeFile.getAssetSeq() + "/";
        String fileExt = fileOriginName.substring(fileOriginName.lastIndexOf("."));
        String fileName = UUID.randomUUID() + fileExt;
        assetLargeFile.setLocation(path);
        assetLargeFile.setAssetUuidName(fileName);
        return new Response<AssetLargeFile, Object>().success(assetLargeFile, null);
    }

    @PostMapping("/largefile")
    public Response<AssetLargeFile, Object> uploadLargeFile(@RequestBody byte[] chunkData,
            AssetLargeFile assetLargeFile) {
        log.debug("post...upload large file");

        File file = new File(assetLargeFile.getLocation() + assetLargeFile.getAssetUuidName());
        File folder = new File(assetLargeFile.getLocation());

        try {
            if (!folder.exists()) {
                folder.mkdirs();
            }
            FileOutputStream lFileOutputStream = new FileOutputStream(file, true);
            lFileOutputStream.write(chunkData);
            lFileOutputStream.close();

        } catch (Exception e) {
            log.error("{}", e.getMessage(), e);
        }

        if (assetLargeFile.getIsLastChunk()) {
            AssetFile dto = new AssetFile();
            dto.setAssetLocation(assetLargeFile.getLocation() + assetLargeFile.getAssetUuidName());
            dto.setAssetOriginName(assetLargeFile.getAssetOriginName());
            dto.setAssetSeq(assetLargeFile.getAssetSeq());
            dto.setAssetSize(assetLargeFile.getAssetSize());
            dto.setAssetType(assetLargeFile.getAssetType());
            service.upload(dto);

            try {
                if (assetLargeFile.getAssetType().contains("image")) {
                    String fileOriginName = assetLargeFile.getAssetOriginName();
                    service.makeThumbnail(assetLargeFile.getLocation(), assetLargeFile.getAssetUuidName(),
                            fileOriginName.substring(fileOriginName.lastIndexOf(".")));
                }

            } catch (Exception e) {
                log.error("{}", e.getMessage(), e);
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

    @PutMapping("/asset")
    public Response<Object, Object> updateAsset(@RequestBody Asset dto, Authentication auth) {
        UserInfo user = (UserInfo) auth.getPrincipal();
        dto.setAssetChanger(user.getUserId());
        service.assetUpdate(dto);
        return null;
    }

    @DeleteMapping("/asset/{assetSeq}")
    public Response<Object, Object> deleteAsset(@PathVariable("assetSeq") int assetSeq, @RequestParam String assetOwner,
            Authentication auth) {
        UserInfo user = (UserInfo) auth.getPrincipal();
        Response<Object, Object> res = new Response<>();
        if (user.getUserId().equals(assetOwner)) {
            service.deleteAsset(assetSeq);
            res = res.success("삭제 성공", null);
        } else {
            res.failed("권한이 없습니다", null);
        }
        return res;
    }

    @GetMapping("/list/{pageNum}")
    public Response<List<Asset>, Object> getAssetList(@PathVariable("pageNum") int pageNum) {
        Criteria crt = new Criteria();
        crt.setPageNum(pageNum);
        List<Asset> list = service.getAssetList(crt);
        for (Asset a : list) {
            a.setLocationArray(a.getLocations().trim().split("\\s*,\\s*"));
        }
        Response<List<Asset>, Object> res = new Response<>();
        res = res.success(list, new Page(crt, service.total()));
        return res;
    }

    @GetMapping("/category/list")
    public Response<List<Category>, Object> categoryList() {
        log.debug("get...categoryList");
        List<Category> list = service.getCategoryList();
        Response<List<Category>, Object> res = new Response<>();
        res = res.success(list, null);
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
        src.setCrt(crt);
        List<Asset> list = service.search(src);
        for (Asset a : list) {
            a.setLocationArray(a.getLocations().trim().split("\\s*,\\s*"));
        }
        Response<List<Asset>, Object> res = new Response<>();
        res = res.success(list, new Page(crt, service.searchTotal(src)));
        return res;
    }

    @GetMapping(path = "/download")
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
}
