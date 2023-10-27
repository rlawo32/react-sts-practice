package com.react.prac.springboot.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketTransportRegistration;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

//    private final StompHandler stompHandler;

    // STOMP 엔드포인트 등록
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws-stomp")  // STOMP 엔드포인트 설정
                .setAllowedOrigins("*")           // 모든 Origin 허용 -> 배포시에는 보안을 위해 Origin을 정확히 지정
//                .setAllowedOrigins("http://localhost:8080")
                .withSockJS();                    // SockJS 사용가능 설정
    }

    // 메시지 브로커를 구성
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/sub"); // /subscribe/{chatNo}로 주제 구독 가능
        registry.setApplicationDestinationPrefixes("/pub");  // /publish/message 로 메시지 전송 컨트롤러 라우팅 가능
    }

    // 클라이언트 인바운드 채널을 구성
    @Override
    public void configureClientInboundChannel(ChannelRegistration registry) {
        // stompHandler를 인터셉터로 등록하여 STOMP 메시지 핸들링을 수행
        registry.interceptors();
//        registration.interceptors(stompHandler);
    }

    // STOMP 에서 64KB 이상의 데이터 전송을 못하는 문제 해결
    @Override
    public void configureWebSocketTransport(WebSocketTransportRegistration registry) {
        registry.setMessageSizeLimit(160 * 64 * 1024);
        registry.setSendTimeLimit(100 * 10000);
        registry.setSendBufferSizeLimit(3 * 512 * 1024);
    }
}
