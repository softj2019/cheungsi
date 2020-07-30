package com.example.cheongsihaengbeach.service;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
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
			if(params.get("res_id") != null && !params.get("res_id").equals("")) {
				reservationMapper.deleteReservation(params);
				reservationMapper.deleteReservationOption(params);
			}
			
			String res_no = "RES-"+NumberGender.numberGen(10, 1);
			params.put("res_no",res_no);
			if(params.get("res_pay_method").equals("custom")) {
				params.put("res_pay_method",params.get("res_pay_method_text"));
			}
			params.put("category_id", params.get("category2") != null && !params.get("category2").equals("") ? params.get("category2") : params.get("category1"));
			int quantity_total = reservationMapper.getDateCategoryQuantityTotal(params);
			int max_quantity = Integer.parseInt(params.get("max_quantity")+"");
			int input_quantity = Integer.parseInt(params.get("res_quantity")+"");
			
			if(max_quantity < quantity_total + input_quantity) {
				result.put("msg", "excess");
				txManager.rollback(status);
				return;
			}
			
			reservationMapper.insertReservation(params);
			
			if(params.get("option_names") != null && !params.get("option_names").equals("")) {
				String[] option_names = ((String)params.get("option_names")).split(",",-1);
				String[] option_quantitys = ((String)params.get("option_quantitys")).split(",",-1);
				String[] option_payments = ((String)params.get("option_payments")).split(",",-1);
				String[] option_hope_times = ((String)params.get("option_hope_times")).split(",",-1);
				String[] option_use_yns = ((String)params.get("option_use_yns")).split(",",-1);
				
				for(int i=0; i<option_names.length; i++){
					Map<String,Object> paramsMap = new HashMap<>();
					paramsMap.put("res_no",res_no);
					paramsMap.put("option_name",option_names[i]);
					paramsMap.put("option_quantity",option_quantitys[i]);
					paramsMap.put("option_pay_method",params.get("res_pay_method"));
					
					SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
					Calendar cal = Calendar.getInstance();
	            	cal.setTime(df.parse((String)params.get("res_date")));
	            	
					String hopeTime = null;
					if(option_hope_times[i].equals("today10")) {
						hopeTime = df.format(cal.getTime()) + " 10:00:00";
					}else if(option_hope_times[i].equals("today11")) {
						hopeTime = df.format(cal.getTime()) + " 11:00:00";
					}else if(option_hope_times[i].equals("today12")) {
						hopeTime = df.format(cal.getTime()) + " 12:00:00";
					}else if(option_hope_times[i].equals("today13")) {
						hopeTime = df.format(cal.getTime()) + " 13:00:00";
					}else if(option_hope_times[i].equals("today14")) {
						hopeTime = df.format(cal.getTime()) + " 14:00:00";
					}else if(option_hope_times[i].equals("today15")) {
						hopeTime = df.format(cal.getTime()) + " 15:00:00";
					}else if(option_hope_times[i].equals("today16")) {
						hopeTime = df.format(cal.getTime()) + " 16:00:00";
					}else if(option_hope_times[i].equals("tomorrow10")) {
						cal.add(Calendar.DATE, 1);
						hopeTime = df.format(cal.getTime()) + " 10:00:00";
					}else if(option_hope_times[i].equals("tomorrow11")) {
						cal.add(Calendar.DATE, 1);
						hopeTime = df.format(cal.getTime()) + " 11:00:00";
					}else if(option_hope_times[i].equals("tomorrow12")) {
						cal.add(Calendar.DATE, 1);
						hopeTime = df.format(cal.getTime()) + " 12:00:00";
					}else if(option_hope_times[i].equals("tomorrow13")) {
						cal.add(Calendar.DATE, 1);
						hopeTime = df.format(cal.getTime()) + " 13:00:00";
					}else if(option_hope_times[i].equals("tomorrow14")) {
						cal.add(Calendar.DATE, 1);
						hopeTime = df.format(cal.getTime()) + " 14:00:00";
					}else if(option_hope_times[i].equals("tomorrow15")) {
						cal.add(Calendar.DATE, 1);
						hopeTime = df.format(cal.getTime()) + " 15:00:00";
					}else if(option_hope_times[i].equals("tomorrow16")) {
						cal.add(Calendar.DATE, 1);
						hopeTime = df.format(cal.getTime()) + " 16:00:00";
					}
					paramsMap.put("option_hope_time",hopeTime);
					if(hopeTime == null) {
						paramsMap.put("option_additional",option_hope_times[i]);
					}
					paramsMap.put("option_use_yn",option_use_yns[i]);
					
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
	
	public void deleteReservation(Map<String,Object> params, Map<String,Object> result) {
		reservationMapper.deleteReservation(params);
		
		result.put("msg", "success");
	}
	
	public void insertCategory(Map<String,Object> params, Map<String,Object> result) {
		categoryMapper.insertCategory(params);
		
		result.put("msg", "success");
	}
	
	public void updateCategory(Map<String,Object> params, Map<String,Object> result) {
		categoryMapper.updateCategory(params);
		
		result.put("msg", "success");
	}
	
	public void deleteCategory(Map<String,Object> params, Map<String,Object> result) {
		categoryMapper.deleteCategory(params);
		
		result.put("msg", "success");
	}

	public void getReservations(HashMap<String, Object> params, Map<String, Object> result) throws Exception{
		List<Map<String, Object>> getReservations = reservationMapper.getReservations(params);
		result.put("reservations",getReservations);
		
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
		Calendar cal = Calendar.getInstance();
    	cal.setTime((String)params.get("res_date") == null || ((String)params.get("res_date")).equals("") ? new Date() : df.parse((String)params.get("res_date")));
    	cal.add(Calendar.DATE, -1);
    	params.put("res_date",df.format(cal.getTime()));
    	List<Map<String, Object>> getReservationsYesterday = reservationMapper.getReservations(params);
		result.put("reservationsYesterday",getReservationsYesterday);
    	
		List<Map<String, Object>> getDefaultCategorys = categoryMapper.getDefaultCategorys();
		result.put("categorys",getDefaultCategorys);
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
