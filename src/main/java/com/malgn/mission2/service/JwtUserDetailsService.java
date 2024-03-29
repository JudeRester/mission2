package com.malgn.mission2.service;

import com.malgn.mission2.domain.UserInfo;
import com.malgn.mission2.mapper.MemberMapper;

import org.springframework.context.annotation.Bean;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class JwtUserDetailsService implements UserDetailsService {
	private MemberMapper mapper;

	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	public JwtUserDetailsService(MemberMapper mapper) {
		this.mapper = mapper;
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		UserInfo user = mapper.getUser(username);

		if (user == null)
			throw new UsernameNotFoundException(username);

		return user;
	}

}
