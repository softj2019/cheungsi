package com.example.cheongsihaengbeach.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.stereotype.Service;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.DefaultTransactionDefinition;

import com.example.cheongsihaengbeach.mapper.CategoryMapper;
import com.example.cheongsihaengbeach.mapper.ReservationMapper;
import com.example.cheongsihaengbeach.util.NumberGender;

@Service
public class RestApiService {
	@Autowired
	private CategoryMapper categoryMapper;
	@Autowired
	private ReservationMapper reservationMapper;
	@Autowired
    private DataSourceTransactionManager txManager;
	
	public void getCategorys(Map<String,Object> params, Map<String,Object> result) {
		List<Map<String, Object>> categorys = categoryMapper.getCategorys(params);
		
		result.put("categorys",categorys);
	}
	
	public void insertReservation(Map<String,Object> params, Map<String,Object> result) {
		DefaultTransactionDefinition def = new DefaultTransactionDefinition();
        def.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRED);
        TransactionStatus status = txManager.getTransaction(def);
        
		try {
			String res_no = "RES-"+NumberGender.numberGen(10, 1);
			params.put("res_no",res_no);
			if(params.get("res_pay_method").equals("custom")) {
				params.put("res_pay_method",params.get("res_pay_method_text"));
			}
			params.put("category_id", params.get("category2") != null && !params.get("category2").equals("") ? params.get("category2") : params.get("category1"));
			reservationMapper.insertReservation(params);
			
			if(params.get("option_names") != null && !params.get("option_names").equals("")) {
				String[] option_names = ((String)params.get("option_names")).split(",",-1);
				String[] option_quantitys = ((String)params.get("option_quantitys")).split(",",-1);
				String[] option_payments = ((String)params.get("option_payments")).split(",",-1);
				String[] option_pay_methods = ((String)params.get("option_pay_methods")).split(",",-1);
				String[] option_pay_method_texts = ((String)params.get("option_pay_method_texts")).split(",",-1);
				String[] option_hope_times = ((String)params.get("option_hope_times")).split(",",-1);
				String[] option_use_yns = ((String)params.get("option_use_yns")).split(",",-1);
				
				for(int i=0; i<option_names.length; i++){
					Map<String,Object> paramsMap = new HashMap<>();
					paramsMap.put("res_no",res_no);
					paramsMap.put("option_name",option_names[i]);
					paramsMap.put("option_quantity",option_quantitys[i]);
					paramsMap.put("option_payment",option_payments[i]);
					paramsMap.put("option_pay_method",option_pay_methods[i]);
					paramsMap.put("option_hope_time",option_hope_times[i]);
					paramsMap.put("option_use_yn",option_use_yns[i]);
					if(paramsMap.get("option_pay_method").equals("custom")) {
						paramsMap.put("option_pay_method",option_pay_method_texts[i]);
					}
					
					reservationMapper.insertReservationOption(paramsMap);
				}
			}
			
			result.put("msg", "success");
			txManager.commit(status);
		}catch (Exception e) {
			result.put("msg", "fail");
			e.printStackTrace();
			txManager.rollback(status);
		}
	}
	
	public void insertCategory(Map<String,Object> params, Map<String,Object> result) {
		categoryMapper.insertCategory(params);
		
		result.put("msg", "success");
	}
	
	public void deleteCategory(Map<String,Object> params, Map<String,Object> result) {
		categoryMapper.deleteCategory(params);
		
		result.put("msg", "success");
	}

	public void getReservations(HashMap<String, Object> params, Map<String, Object> result) {
		List<Map<String, Object>> getReservations = reservationMapper.getReservations(params);
		 
		result.put("reservations",getReservations);
	}
	
	public int getReservationCount(HashMap<String, Object> params) {
		return reservationMapper.getReservationCount(params);
	}
	
	public void updateReservationStats(Map<String,Object> params, Map<String,Object> result) {
		reservationMapper.updateReservationStats(params);
		
		result.put("msg", "success");
	}
	
	public void updateOptionStats(Map<String,Object> params, Map<String,Object> result) {
		reservationMapper.updateOptionStats(params);
		
		result.put("msg", "success");
	}
}
