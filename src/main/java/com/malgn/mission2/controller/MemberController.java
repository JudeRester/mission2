package com.malgn.mission2.controller;

import org.slf4j.LoggerFactory;

import java.util.List;

import com.malgn.mission2.domain.User;
import com.malgn.mission2.domain.UserInfo;
import com.malgn.mission2.domain.UserSearch;
import com.malgn.mission2.domain.common.Criteria;
import com.malgn.mission2.domain.common.Page;
import com.malgn.mission2.domain.common.Response;
import com.malgn.mission2.service.MemberService;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/member")
public class MemberController {
    private final Logger log = LoggerFactory.getLogger(getClass());

    @Autowired
    private MemberService service;

    @GetMapping(path = "list/{pageNum}")
    public Response<List<User>, Object> listUser(@PathVariable("pageNum") int pageNum) {
        log.debug("get...listUser...");
        Criteria crt = new Criteria();
        crt.setPageNum(pageNum);
        Response<List<User>, Object> res = new Response<>();
        res = res.success(service.getList(crt), new Page(crt, service.total()));
        return res;
    }

    @GetMapping(path = "user")
    public Response<UserInfo, Object> getUser(String userId) {
        Response<UserInfo, Object> res = new Response<>();
        res = res.success(service.getUser(userId), null);
        return res;
    }

    @PostMapping(path = "user")
    public Response<Object, Object> addUser(Authentication auth, @RequestBody User dto) {
        log.debug("post...addUser" + dto.toString());
        UserInfo user = (UserInfo) auth.getPrincipal();
        Response<Object, Object> res = new Response<>();
        res = res.success(service.addUser(dto) + "개 레코드 삽입", null);
        return res;
    }

    @PutMapping(path = "user")
    public Response<String, Object> updateUser(Authentication auth, @RequestBody User dto) {
        log.debug("post...updateUser");
        Response<String, Object> res = new Response<>();
        UserInfo user = (UserInfo) auth.getPrincipal();
        if (dto.getUserPass().equals("")) {
            res = res.success(service.updateUserNoPass(dto) + "개 레코드 변경", null);
        } else {
            res = res.success(service.updateUser(dto) + "개 레코드 변경", null);
        }
        return res;
    }

    @DeleteMapping(path = "user/{userId}")
    public Response<Object, Object> deleteUser(@PathVariable("userId") String userId) {
        log.debug("delete...deleteUser");
        Response<Object, Object> res = new Response<>();
        res = res.success(service.deleteUser(userId) + "개 레코드 삭제", null);
        return res;
    }

    @GetMapping(path = "user/assetcount/{userId}")
    public Response<Integer, Object> getHowManyAssetUserHave(@PathVariable("userId") String userId) {
        log.debug("get...get how many asset user have");
        Response<Integer, Object> res = new Response<>();
        res = res.success(service.getHowManyAssetUserHave(userId), null);
        return res;
    }

    @GetMapping(path = "search")
    public Response<List<User>, Object> searchUser(UserSearch src, Criteria crt) {
        src.setCrt(crt);
        Response<List<User>, Object> res = new Response<>();
        res = res.success(service.search(src), new Page(crt, service.searchTotal(src)));
        return res;
    }
}
