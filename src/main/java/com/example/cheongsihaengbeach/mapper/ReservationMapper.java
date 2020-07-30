package com.example.cheongsihaengbeach.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ReservationMapper {
	int insertReservation(Map<String,Object> params);
	int insertReservationOption(Map<String, Object> params);
	int updateReservationStats(Map<String, Object> params);
	int updateOptionStats(Map<String, Object> params);
	int deleteReservation(Map<String, Object> params);
	int deleteReservationOption(Map<String, Object> params);
	
	int getDateCategoryQuantityTotal(Map<String, Object> params);
	int getReservationCount(Map<String, Object> params);
	List<Map<String,Object>> getReservations(Map<String, Object> params);
	Map<String,Object> getReservationDetail(Map<String, Object> params);
}
