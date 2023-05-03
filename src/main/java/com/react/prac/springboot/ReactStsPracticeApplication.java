package com.react.prac.springboot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication
public class ReactStsPracticeApplication {

    public static void main(String[] args) {
        SpringApplication.run(ReactStsPracticeApplication.class, args);
    }

}
