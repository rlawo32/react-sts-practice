package com.react.prac.springboot.util;

import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;

import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

public class EmailUtil {

    public static String authRandomCode() {
        StringBuilder sb = new StringBuilder();

        for(int i = 0; i < 6; i++) {
            if(Math.random() < 0.5) {
                sb.append( (char)((int)(Math.random() * 10) + '0') );
            } else {
                sb.append( (char)((int)(Math.random() * 26) + 'A') );
            }
        }

        return sb.toString();
    }

    public static Map<String, Object> sendAuthCode(String memberEmail) {

        String authCode = authRandomCode();

        Properties props = new Properties();
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.port", "587");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");

        final String USERNAME = "gandi779@gmail.com";
        final String PASSWORD = "duzrritrcoextdko";

        Session session = Session.getInstance(props, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(USERNAME, PASSWORD);
            }
        });

        try {

            Message message = new MimeMessage(session);

            message.setHeader("Content-Type", "text/plain; charset=UTF-8");
            message.setFrom(new InternetAddress(USERNAME, "인증코드관리자"));
            message.setRecipient(Message.RecipientType.TO, new InternetAddress(memberEmail));
            message.setSubject("인증 요청 메일입니다.");
            message.setText("인증번호는 " + authCode + "입니다.");

            Transport.send(message);

        } catch (Exception e) {
            e.printStackTrace();
        }

        Map<String, Object> map = new HashMap<>();
        map.put("authCode", authCode);

        return map;
    }
}
