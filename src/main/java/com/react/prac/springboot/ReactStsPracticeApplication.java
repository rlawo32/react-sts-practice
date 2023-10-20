package com.react.prac.springboot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing // 객체
@SpringBootApplication
public class ReactStsPracticeApplication {

    public static void main(String[] args) {
        SpringApplication.run(ReactStsPracticeApplication.class, args);
    }

}
