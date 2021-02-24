package com.malgn.mission2.service;

import java.util.List;

import com.malgn.mission2.mapper.MemberMapper;
import com.malgn.mission2.domain.User;
import com.malgn.mission2.domain.UserInfo;
import com.malgn.mission2.domain.UserSearch;
import com.malgn.mission2.domain.common.Criteria;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class MemberService {
    @Autowired
    private MemberMapper mapper;

    @Autowired
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    public List<User> getList(Criteria crt) {
        return mapper.getList(crt);
    }

    public int total() {
        return mapper.total();
    }

    public UserInfo getUser(String userId) {
        return mapper.getUser(userId);
    }

    public int addUser(User dto) {
        dto.setUserPass(passwordEncoder().encode(dto.getUserPass()));
        return mapper.addUser(dto);
    }

    public int updateUser(User dto) {
        dto.setUserPass(passwordEncoder().encode(dto.getUserPass()));
        return mapper.updateUser(dto);
    }

    public int updateUserNoPass(User dto) {
        return mapper.updateUserNoPass(dto);
    }

    public Integer getHowManyAssetUserHave(String userId) {
        return mapper.getHowManyAssetUserHave(userId);
    }

    public int deleteUser(String userId) {
        return mapper.deleteUser(userId);
    }

    public List<User> search(UserSearch src) {
        return mapper.search(src);
    }

    public int searchTotal(UserSearch src) {
        return mapper.searchTotal(src);
    }
}
