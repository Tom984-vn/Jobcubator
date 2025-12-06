package org.jobcubator.jobcubator.config;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.server.HandshakeInterceptor;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.socket.WebSocketHandler;

import java.util.Map;

@Component
public class AuthHandshakeInterceptor implements HandshakeInterceptor {

    @Override
    public boolean beforeHandshake(ServerHttpRequest request,
                                ServerHttpResponse response,
                                WebSocketHandler wsHandler,
                                Map<String, Object> attributes) {

        // Header-based token (if browser supports it)
        String auth = request.getHeaders().getFirst("Authorization");
        if (auth != null && auth.startsWith("Bearer ")) {
            attributes.put("token", auth.substring(7));
            return true;
        }

        // *** SockJS fallback ***
        String query = request.getURI().getQuery(); // e.g. "token=xxx"
        if (query != null && query.contains("token=")) {
            String token = query.substring(query.indexOf("token=") + 6);
            attributes.put("token", token);
        }

        return true;
    }

    @Override
    public void afterHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Exception exception) {}
}
