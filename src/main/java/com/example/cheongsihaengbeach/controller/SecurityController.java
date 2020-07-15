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

import com.example.cheongsihaengbeach.service.SecurityService;

@RestController
@RequestMapping("/security")
public class SecurityController {
	@Autowired
	SecurityService securityService;
	
	@RequestMapping("/loginCheck")
	public Map<String,Object> loginCheck(@RequestParam HashMap<String,Object> params, HttpServletRequest req, HttpServletResponse res, HttpSession sess,ModelMap model) {
		Map<String,Object> result = new HashMap<>();
		
		securityService.findUserForId(params, result);
		if(result.get("data").equals("success")) {
			sess.setAttribute("loginId", params.get("user_id"));
		}
		return result;
	}
}
