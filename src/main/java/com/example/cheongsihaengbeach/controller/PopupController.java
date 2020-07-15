package com.example.cheongsihaengbeach.controller;

import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class PopupController {
	
	//예약팝업
	@RequestMapping("/popup/resv-pop")
	public String main(@RequestParam HashMap<String,Object> params, HttpServletRequest req, HttpServletResponse res, HttpSession sess,ModelMap model) {
		
		model.addAttribute("jsFileName","resv-pop");
		return "popup/resv-pop";
	}
}
