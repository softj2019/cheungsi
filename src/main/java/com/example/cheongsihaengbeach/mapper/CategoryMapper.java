package com.example.cheongsihaengbeach.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CategoryMapper {
	List<Map<String,Object>> getCategorys(Map<String,Object> params);
	List<Map<String,Object>> getDefaultCategorys();
	int insertCategory(Map<String,Object> params);
	int updateCategory(Map<String,Object> params);
	int deleteCategory(Map<String,Object> params);
}
