package com.react.prac.springboot.web.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@RequiredArgsConstructor
@Controller
public class WebController implements ErrorController {

    @RequestMapping(value = "/error")
    public String handleNoHandlerFoundException() {
//        int status = response.getStatus();
//
//        System.out.println(status);  //오류 상태
//        System.out.println(request.getRequestURI());  //요청 주소

//        if (Objects.equals(request.getContentType(), MediaType.APPLICATION_JSON_VALUE)) {
//            Map<String, Object> body = Map.of("error", "Not Found", "timestamp", System.currentTimeMillis());
//
//            System.out.println(body.get(0));
//
//            return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
//        }

//        return new ResponseEntity<>("Not Found", HttpStatus.NOT_FOUND);
        return "/index.html";
    }

}
