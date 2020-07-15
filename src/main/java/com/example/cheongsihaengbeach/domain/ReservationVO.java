package com.example.cheongsihaengbeach.domain;

import lombok.Data;

@Data
public class ReservationVO extends PageVO{
	private String res_id;
	private String res_no;
	private String res_date;
	private String category_id;
	private String res_name;
	private String res_phone;
	private String res_quantity;
	private String res_payment;
	private String res_pay_method;
	private String reg_date;
	private String res_checkin_yn;
	private String remark;
	
	private String option_id;
	private String option_name;
	private String option_quantity;
	private String option_payment;
	private String option_pay_method;
	private String option_pay_method_text;
	private String option_hope_time;
	private String option_use_yn;
}
 