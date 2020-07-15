package com.example.cheongsihaengbeach.service;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.cheongsihaengbeach.mapper.UserMapper;

@Service
public class SecurityService {
	@Autowired
	UserMapper userMapper;
	
	public void findUserForId(Map<String,Object> params, Map<String,Object> result) {
		Map<String, Object> user = userMapper.findUserForId(params);
		if(user == null) {
			result.put("data","idFail");
		}else {
			if(user.get("user_pw").equals((String)params.get("password"))) {
				result.put("data","success");
			}else {
				result.put("data","pwFail");
			}
		}
	}
}
