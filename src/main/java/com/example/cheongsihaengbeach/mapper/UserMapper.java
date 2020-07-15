package com.example.cheongsihaengbeach.mapper;

import java.util.HashMap;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper {
	Map<String,Object> findUserForId(Map<String,Object> params);
}
