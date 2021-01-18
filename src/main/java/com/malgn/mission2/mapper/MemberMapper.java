package com.malgn.mission2.mapper;

import com.malgn.mission2.domain.UserInfo;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface MemberMapper {
    UserInfo getUser(String userId);
}
