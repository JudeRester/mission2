package com.malgn.mission2.service;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.StringTokenizer;
import java.awt.image.BufferedImage;
import javax.imageio.ImageIO;

import com.malgn.mission2.domain.asset.Asset;
import com.malgn.mission2.domain.asset.AssetFile;
import com.malgn.mission2.domain.asset.AssetLargeFile;
import com.malgn.mission2.domain.asset.Category;
import com.malgn.mission2.domain.asset.Search;
import com.malgn.mission2.domain.asset.Tags;
import com.malgn.mission2.domain.common.Criteria;
import com.malgn.mission2.mapper.AssetMapper;

import org.imgscalr.Scalr;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AssetService {
    private final Logger log = LoggerFactory.getLogger(getClass());

    @Autowired
    private AssetMapper mapper;

    public void createAsset(Asset asset) {
        mapper.createAsset(asset);
    }

    public void upload(AssetFile dto) {
        mapper.upload(dto);
    }

    public void completeAsset(Asset asset) {
        mapper.completeAsset(asset);
        List<Tags> tagDTOlist = new ArrayList<Tags>();
        String tags = asset.getTags();
        StringTokenizer tkn = new StringTokenizer(tags, ",");
        if (!"".equals(tags) && !",".equals(tags)) {
            while (tkn.hasMoreTokens()) {
                tagDTOlist.add(new Tags(asset.getAssetSeq(), tkn.nextToken().trim()));
            }
            mapper.insertTags(tagDTOlist);
        }
    }

    public void upload(AssetLargeFile assetLargeFile) {
        mapper.upload(assetLargeFile);
    }

    public void makeThumbnail(String path, String fileName, String fileExt) throws Exception {
        // 저장된 원본파일로부터 BufferedImage 객체를 생성합니다.
        BufferedImage srcImg = ImageIO.read(new File(path + fileName));
        // 썸네일의 너비와 높이 입니다.
        int dw = 500, dh = 500;
        // 원본 이미지의 너비와 높이 입니다.
        int ow = srcImg.getWidth();
        int oh = srcImg.getHeight();
        // 원본 너비를 기준으로 하여 썸네일의 비율로 높이를 계산합니다.
        int nw = ow;
        int nh = (ow * dh) / dw;
        // 계산된 높이가 원본보다 높다면 crop이 안되므로
        // 원본 높이를 기준으로 썸네일의 비율로 너비를 계산합니다.
        if (nh > oh) {
            nw = (oh * dw) / dh;
            nh = oh;
        }
        // 계산된 크기로 원본이미지를 가운데에서 crop 합니다.
        BufferedImage cropImg = Scalr.crop(srcImg, (ow - nw) / 2, (oh - nh) / 2, nw, nh);
        // crop된 이미지로 썸네일을 생성합니다.
        BufferedImage destImg = Scalr.resize(cropImg, dw, dh);

        int index = path.lastIndexOf("/uploadedImages") + "/uploadedImages".length();

        String thumbPath = path.substring(0, index) + "/thumb" + path.substring(index);
        File folder = new File(thumbPath);
        if (!folder.exists()) {
            folder.mkdirs();
        }
        String thumbName = thumbPath + fileName;
        File thumbFile = new File(thumbName);
        ImageIO.write(destImg, fileExt.toUpperCase(), thumbFile);
    }

    public Asset getAsset(int assetSeq) {
        return mapper.getAsset(assetSeq);
    }

    public ArrayList<AssetFile> getFiles(int assetSeq) {
        return mapper.getFiles(assetSeq);
    }

    public List<Asset> getAssetList(Criteria crt) {
        List<Asset> list = mapper.getAssetList(crt);
        List<Integer> seqList = new ArrayList<>();
        for (Asset a : list) {
            seqList.add(a.getAssetSeq());
        }
        List<AssetFile> afiles = mapper.getFileList(seqList);
        for (int i = 0; i < list.size(); i++) {
            ArrayList<AssetFile> assetFiles = new ArrayList<>();
            for (int j = 0; j < afiles.size(); j++) {
                if (list.get(i).getAssetSeq() == afiles.get(j).getAssetSeq()) {
                    assetFiles.add(afiles.get(j));
                }
            }
            list.get(i).setAssetFiles(assetFiles);
        }
        return list;
    }

    public int total() {
        return mapper.total();
    }

    public void deleteTag(Tags dto) {
        mapper.deleteTag(dto);
    }

    public String getAssetTagList(int assetSeq) {
        return mapper.getAssetTagList(assetSeq);
    }

    public void insertTag(Tags dto) {
        mapper.insertTag(dto);
    }

    public void assetUpdate(Asset dto) {
        mapper.assetUpdate(dto);
    }

    public void deleteFile(AssetFile assetFile) {
        try {
            File file = new File(assetFile.getAssetLocation());
            if (file.exists())
                file.delete();
        } catch (Exception e) {
            log.error("{}", e.getMessage(), e);
        } finally {
            mapper.deleteFile(assetFile);
        }
    }

    public void deleteAsset(int assetSeq) {

        ArrayList<AssetFile> list = mapper.getFiles(assetSeq);
        try {
            for (AssetFile assetFile : list) {
                File file = new File(assetFile.getAssetLocation());
                if (file.exists()) {
                    if (file.delete()) {
                        // 파일 삭제
                    } else {
                        // 삭제 실패
                    }
                } else {
                    // 파일이 존재하지 않음
                }
            }
        } catch (Exception e) {
            // TODO: handle exception
        } finally {
            mapper.deleteAssetFiles(assetSeq);
            mapper.deleteAsset(assetSeq);
        }

    }

    public List<Tags> getTagList() {
        return mapper.getTagList();
    }

    public List<Asset> search(Search src) {
        List<Asset> list = mapper.search(src);
        List<Integer> seqList = new ArrayList<>();
        for (Asset a : list) {
            seqList.add(a.getAssetSeq());
        }
        if (seqList.size() > 0) {
            List<AssetFile> afiles = mapper.getFileList(seqList);
            for (int i = 0; i < list.size(); i++) {
                ArrayList<AssetFile> assetFiles = new ArrayList<>();
                for (int j = 0; j < afiles.size(); j++) {
                    if (list.get(i).getAssetSeq() == afiles.get(j).getAssetSeq()) {
                        assetFiles.add(afiles.get(j));
                    }
                }
                list.get(i).setAssetFiles(assetFiles);
            }
        }
        return list;
    }

    public int searchTotal(Search src) {
        return mapper.searchTotal(src);
    }

}
