package com.malgn.mission2.controller;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.util.Calendar;
import java.util.UUID;

import com.malgn.mission2.domain.Asset;
import com.malgn.mission2.domain.AssetFile;
import com.malgn.mission2.domain.AssetLargeFile;
import com.malgn.mission2.domain.Response;
import com.malgn.mission2.domain.UserInfo;
import com.malgn.mission2.service.AssetService;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

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

    @PostMapping("/api/file")
    public Response<Object, Object> uploadSmallFile(@RequestParam("file") MultipartFile mf,
            @RequestParam("assetSeq") int assetSeq, @Value("${property.image.location}") String path) {
        log.debug("post...upload small file");
        Calendar c = Calendar.getInstance();
        // 운영체제 별 경로
        String os = System.getProperty("os.name").toLowerCase();
        if (os.contains("win"))
            path = "d:" + path;
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

            // service.makeThumbnail(path, fileName, fileExt);

        } catch (Exception e) {
            log.error("{}", e.getMessage(), e);
        }
        return null;
    }

    @PostMapping("/api/prelargefile")
    public Response<AssetLargeFile, Object> preLargeFile(@RequestBody AssetLargeFile assetLargeFile,
            @Value("${property.image.location}") String path) {
        Calendar c = Calendar.getInstance();
        // 운영체제 별 경로
        String os = System.getProperty("os.name").toLowerCase();
        if (os.contains("win"))
            path = "d:" + path;
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

    @PostMapping("/api/largefile")
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
            service.upload(dto);
        }

        return new Response<AssetLargeFile, Object>().success(assetLargeFile, null);
    }

    @PostMapping("/api/complete")
    public Response<Object, Object> completeAsset(@RequestBody Asset asset) {
        service.completeAsset(asset);
        return null;
    }
}
