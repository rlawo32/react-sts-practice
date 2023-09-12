package com.react.prac.springboot.config.auth;

import com.react.prac.springboot.config.security.JwtAccessDeniedHandler;
import com.react.prac.springboot.config.security.JwtAuthenticationEntryPoint;
import com.react.prac.springboot.config.security.JwtSecurityConfig;
import com.react.prac.springboot.config.security.TokenProvider;
import lombok.RequiredArgsConstructor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.MessageDigestPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;


@RequiredArgsConstructor
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // private final CustomOAuth2UserService customOAuth2UserService;

    private final CustomOAuth2UserService customOAuth2UserService;
    private final CorsConfig corsConfig;
    private final TokenProvider tokenProvider;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private final JwtAccessDeniedHandler jwtAccessDeniedHandler;
//    private final TokenService tokenService;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                .csrf().disable() // rest api 사용시 disable / token을 사용하는 방식일 경우 disable


                .exceptionHandling()
                .authenticationEntryPoint(jwtAuthenticationEntryPoint)
                .accessDeniedHandler(jwtAccessDeniedHandler)

                .and()
                .cors()
                .configurationSource(corsConfig.corsConfigurationSource())

                .and()
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)

                .and()
                .authorizeHttpRequests()// HttpServletRequest를 사용하는 요청들에 대한 접근제한을 설정하겠다.
                .requestMatchers("/member/**").permitAll()
                .requestMatchers("/auth/**").permitAll()
                .requestMatchers("/favicon.ico").permitAll()
                .anyRequest().authenticated()

                .and()
                .apply(new JwtSecurityConfig(tokenProvider));
                //.anyRequest().permitAll()
                //.requestMatchers("/api/v1/**").hasRole(Role.USER.name())

//                .and()
//                .logout()
//                .logoutSuccessUrl("/")
//
//                .and()
//                .oauth2Login()
//                .successHandler(new MyAuthenticationSuccessHandler())
//                //.defaultSuccessUrl("/oauth/loginInfo", true)
//                .userInfoEndpoint().userService(customOAuth2UserService);

        return httpSecurity.build();
    }

    /*@Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.httpBasic().disable()
                .csrf().disable()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authorizeRequests()
                .requestMatchers("/token/**").permitAll()
                .anyRequest().authenticated()
                .and()
                .addFilterBefore(new JwtAuthFilter(tokenService),
                        UsernamePasswordAuthenticationFilter.class)
                .oauth2Login().loginPage("/token/expired")
                .successHandler(successHandler)
                .userInfoEndpoint().userService(oAuth2UserService);

        http.addFilterBefore(new JwtAuthFilter(tokenService), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }*/
}
