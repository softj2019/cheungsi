package com.example.cheongsihaengbeach.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.example.cheongsihaengbeach.mapper.CategoryMapper;

@Controller
public class MainController {
	@Autowired
	CategoryMapper categoryMapper;

	//로그인페이지
	@RequestMapping("/")
	public String main(@RequestParam HashMap<String,Object> params, HttpServletRequest req, HttpServletResponse res, HttpSession sess,ModelMap model) {
		
		model.addAttribute("jsFileName","login");
		return "redirect:/login";
	}
	
	//로그인페이지
	@RequestMapping("/login")
	public String login(@RequestParam HashMap<String,Object> params, HttpServletRequest req, HttpServletResponse res, HttpSession sess,ModelMap model) {
		
		model.addAttribute("jsFileName","login");
		return "login";
	}
	
	//서핑예약탭
	@RequestMapping("/dashboard")
	public String dashboard(@RequestParam HashMap<String,Object> params, HttpServletRequest req, HttpServletResponse res, HttpSession sess,ModelMap model) {
		if(sess.getAttribute("loginId") == null) {
			return "redirect:/login";
		}
		model.addAttribute("categorys", categoryMapper.getDefaultCategorys());
		model.addAttribute("navNo","1");
		model.addAttribute("jsFileName","dashboard");
		return "dashboard/dashboard";
	}
	
	//예약자검색탭
	@RequestMapping("/index")
	public String index(@RequestParam HashMap<String,Object> params, HttpServletRequest req, HttpServletResponse res, HttpSession sess,ModelMap model) {
		if(sess.getAttribute("loginId") == null) {
			return "redirect:/login";
		}
		
		model.addAttribute("navNo","2");
		model.addAttribute("jsFileName","index");
		return "dashboard/index";
	}
	
	//분류관리탭
	@RequestMapping("/reservation")
	public String reservation(@RequestParam HashMap<String,Object> params, HttpServletRequest req, HttpServletResponse res, HttpSession sess, ModelMap model) {
		if(sess.getAttribute("loginId") == null) {
			return "redirect:/login";
		}
		
		params.put("category_upper_id",'0');
		List<Map<String,Object>> category1List = categoryMapper.getCategorys(params);
        params.put("category_upper_id",null);
        List<Map<String,Object>> category2List = categoryMapper.getCategorys(params);
		
		model.addAttribute("category1List",category1List);
		model.addAttribute("category2List",category2List);
		
		model.addAttribute("navNo","3");
		model.addAttribute("jsFileName","reservation");
		return "dashboard/reservation";
	}
}
