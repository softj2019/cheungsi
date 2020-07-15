package com.example.cheongsihaengbeach.controller;

import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.example.cheongsihaengbeach.mapper.ReservationMapper;

@Controller
public class PopupController {
	@Autowired
	private ReservationMapper reservationMapper;
	
	//예약팝업
	@RequestMapping("/popup/resv-pop")
	public String main(@RequestParam HashMap<String,Object> params, HttpServletRequest req, HttpServletResponse res, HttpSession sess,ModelMap model) {
		if(sess.getAttribute("loginId") == null) {
			return "redirect:/login";
		}
		
		model.addAttribute("jsFileName","resv-pop");
		return "popup/resv-pop";
	}
}
