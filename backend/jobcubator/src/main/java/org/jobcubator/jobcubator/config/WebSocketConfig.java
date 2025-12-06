package org.jobcubator.jobcubator.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jobcubator.jobcubator.application.domain.Application;
import org.jobcubator.jobcubator.application.domain.ApplicationRepository;
import org.jobcubator.jobcubator.authentication.service.JwtTokenServiceImpl;
import org.jobcubator.jobcubator.company.domain.CompanyMemberRepository;
import org.jobcubator.jobcubator.config.ratelimit.RateLimitingService;
import org.jobcubator.jobcubator.user.domain.User;
import org.jobcubator.jobcubator.user.service.UserServiceImpl;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.lang.NonNull;
import org.springframework.core.annotation.Order;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.jobcubator.jobcubator.config.AuthHandshakeInterceptor;
@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
@Order(Ordered.HIGHEST_PRECEDENCE + 99) // Ensure this runs before Spring Security's own filters
@Slf4j
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final JwtTokenServiceImpl  jwtTokenService;
    private final UserServiceImpl userDetailsService;
    private final ApplicationRepository applicationRepository;
    private final CompanyMemberRepository companyMemberRepository;
    private final RateLimitingService rateLimitingService;

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(@NonNull Message<?> message, @NonNull MessageChannel channel) {
                StompHeaderAccessor accessor =
                        MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

                assert accessor != null;

                // 1. Logic cũ: Xử lý CONNECT (Giữ nguyên)
                if (StompCommand.CONNECT.equals(accessor.getCommand())) {
                    String authHeader = accessor.getFirstNativeHeader("Authorization");
                    if (authHeader != null && authHeader.startsWith("Bearer ")) {
                        try {
                            String token = authHeader.substring(7);
                            String username = jwtTokenService.getUsernameFromToken(token);
                            if (username != null) {
                                User userDetails = (User) userDetailsService.loadUserByUsername(username);
                                if (jwtTokenService.validateToken(token, userDetails.getUsername())) {
                                    UsernamePasswordAuthenticationToken authToken =
                                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                                    accessor.setUser(authToken);
                                }
                            }
                        } catch (Exception e) {
                            log.error("WebSocket authentication failed: {}", e.getMessage());
                        }
                    }
                } else if (StompCommand.SUBSCRIBE.equals(accessor.getCommand())) {
                String destination = accessor.getDestination();

                if (destination != null && destination.startsWith("/topic/application/")) {

                    Authentication auth = (Authentication) accessor.getUser();
                    if (auth == null || !(auth.getPrincipal() instanceof User)) {
                        throw new AccessDeniedException("User not authenticated");
                    }
                    User user = (User) auth.getPrincipal();

                    String[] parts = destination.split("/");
                    Long applicationId = null;
                    try {
                        // Check độ dài để tránh lỗi ArrayOutOfBounds
                        if (parts.length >= 4) {
                            applicationId = Long.parseLong(parts[3]);
                        }
                    } catch (NumberFormatException e) {
                        // Log warning nếu cần thiết, hoặc ignore
                    }

                    if (applicationId != null) {
                        Application application = applicationRepository.findByIdWithDetails(applicationId)
                                .orElseThrow(() -> new AccessDeniedException("Application not found"));

                        boolean isCandidate = application.getCandidate().getId().equals(user.getId());

                        boolean isCompanyMember = false;
                        if (!isCandidate) {
                            if (application.getJobPost() != null && application.getJobPost().getCompany() != null) {
                                isCompanyMember = companyMemberRepository.existsByCompanyIdAndUserId(
                                        application.getJobPost().getCompany().getId(),
                                        user.getId()
                                );
                            }
                        }

                        if (!isCandidate && !isCompanyMember) {
                            log.warn("User {} (ID: {}) tried to subscribe to restricted topic {}", user.getUsername(), user.getId(), destination);
                            throw new AccessDeniedException("You are not authorized to subscribe to this chat.");
                        }
                    }
                }
            } else if(StompCommand.SEND.equals(accessor.getCommand())) {
                    Authentication auth = (Authentication) accessor.getUser();
                    if(auth == null){
                        throw new AccessDeniedException("Unauthorized");
                    }
                    User user = (User) auth.getPrincipal();

                    if(!rateLimitingService.resolveChatBucket(user.getUsername()).tryConsume(1)){
                        throw new AccessDeniedException("Slow down! You are sending messages too fast.");
                    }
                }
                return message;
            }
        });
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic"); // Client subscribe here
        config.setApplicationDestinationPrefixes("/app"); // Client send message here
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws-chat")
                .setAllowedOrigins("http://localhost:5173")
                .addInterceptors(new AuthHandshakeInterceptor())
                .withSockJS();
    }
}
