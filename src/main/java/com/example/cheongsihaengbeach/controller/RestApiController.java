package com.example.cheongsihaengbeach.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.cheongsihaengbeach.domain.ReservationVO;
import com.example.cheongsihaengbeach.mapper.ReservationMapper;
import com.example.cheongsihaengbeach.service.RestApiService;

@RestController
@RequestMapping("/api")
public class RestApiController {
	@Autowired
	private RestApiService restApiService;
	@Autowired
	private ReservationMapper reservationMapper;

	//카테고리
	@RequestMapping("/getCategorys")
	public Map<String, Object> getCategorys(@RequestParam HashMap<String,Object> params, HttpServletRequest req, HttpServletResponse res, HttpSession sess,ModelMap model) {
		Map<String,Object> result = new HashMap<>();
		
		restApiService.getCategorys(params, result);
		
		return result;
	}
	
	//예약저장
	@RequestMapping("/insertReservation")
	public Map<String, Object> insertReservation(@RequestParam HashMap<String,Object> params, HttpServletRequest req, HttpServletResponse res, HttpSession sess,ModelMap model,ReservationVO reservationVO) {
		Map<String,Object> result = new HashMap<>();
		
		if(reservationVO.getOption_name() != null) {
			params.put("option_names",reservationVO.getOption_name());
			params.put("option_quantitys",reservationVO.getOption_quantity());
			params.put("option_payments",reservationVO.getOption_payment());
			params.put("option_hope_times",reservationVO.getOption_hope_time());
			params.put("option_use_yns",reservationVO.getOption_use_yn());
		}
		restApiService.insertReservation(params, result);
		
		return result;
	}
	
	//예약삭제
	@RequestMapping("/deleteReservation")
	public Map<String, Object> deleteReservation(@RequestParam HashMap<String,Object> params, HttpServletRequest req, HttpServletResponse res, HttpSession sess,ModelMap model) {
		Map<String,Object> result = new HashMap<>();
		
		restApiService.deleteReservation(params, result);
		
		return result;
	}
	
	//카테고리추가
	@RequestMapping("/insertCategory")
	public Map<String, Object> insertCategory(@RequestParam HashMap<String,Object> params, HttpServletRequest req, HttpServletResponse res, HttpSession sess,ModelMap model) {
		Map<String,Object> result = new HashMap<>();
		
		restApiService.insertCategory(params, result);
		
		return result;
	}
	
	//카테고리추가
		@RequestMapping("/updateCategory")
		public Map<String, Object> updateCategory(@RequestParam HashMap<String,Object> params, HttpServletRequest req, HttpServletResponse res, HttpSession sess,ModelMap model) {
			Map<String,Object> result = new HashMap<>();
			
			restApiService.updateCategory(params, result);
			
			return result;
		}
	
	//카테고리삭제
	@RequestMapping("/deleteCategory")
	public Map<String, Object> deleteCategory(@RequestParam HashMap<String,Object> params, HttpServletRequest req, HttpServletResponse res, HttpSession sess,ModelMap model,ReservationVO reservationVO) {
		Map<String,Object> result = new HashMap<>();
		
		restApiService.deleteCategory(params, result);
		
		return result;
	}
	
	//예약목록
	@RequestMapping("/getReservations")
	public Map<String, Object> getReservations(@RequestParam HashMap<String,Object> params, HttpServletRequest req, HttpServletResponse res, HttpSession sess,ModelMap model, ReservationVO reservationVO) throws Exception{
		Map<String,Object> result = new HashMap<>();
		reservationVO.setDisplayRowCount(9999999);
		reservationVO.pageCalculate(restApiService.getReservationCount(params));
		
		params.put("rowStart", reservationVO.getRowStart());
		params.put("displayRowCount", reservationVO.getDisplayRowCount());
		restApiService.getReservations(params, result);
		
		result.put("searchVO",reservationVO);
		return result;
	}
	
	//입실여부수정
	@RequestMapping("/updateReservationStats")
	public Map<String, Object> updateReservationStats(@RequestParam HashMap<String,Object> params, HttpServletRequest req, HttpServletResponse res, HttpSession sess,ModelMap model,ReservationVO reservationVO) {
		Map<String,Object> result = new HashMap<>();
		
		restApiService.updateReservationStats(params, result);
		
		return result;
	}
	
	//옵션여부수정
	@RequestMapping("/updateOptionStats")
	public Map<String, Object> updateOptionStats(@RequestParam HashMap<String,Object> params, HttpServletRequest req, HttpServletResponse res, HttpSession sess,ModelMap model,ReservationVO reservationVO) {
		Map<String,Object> result = new HashMap<>();
		
		restApiService.updateOptionStats(params, result);
		
		return result;
	}
	
	//예약선택
	@RequestMapping("/getReservationDetail")
	public Map<String, Object> getReservationDetail(@RequestParam HashMap<String,Object> params, HttpServletRequest req, HttpServletResponse res, HttpSession sess,ModelMap model,ReservationVO reservationVO) {
		Map<String,Object> result = new HashMap<>();

		result.put("detail",reservationMapper.getReservationDetail(params));
		
		return result;
	}
}
