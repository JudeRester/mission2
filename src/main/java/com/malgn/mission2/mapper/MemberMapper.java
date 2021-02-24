package com.malgn.mission2.mapper;

import java.util.List;

import com.malgn.mission2.domain.User;
import com.malgn.mission2.domain.UserInfo;
import com.malgn.mission2.domain.UserSearch;
import com.malgn.mission2.domain.common.Criteria;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface MemberMapper {
    UserInfo getUser(String userId);

    List<User> getList(Criteria crt);

    int total();

    int addUser(User dto);

    int updateUser(User dto);

    int updateUserNoPass(User dto);

    Integer getHowManyAssetUserHave(String userId);

    int deleteUser(String userId);

    List<User> search(UserSearch src);

    int searchTotal(UserSearch src);
}
