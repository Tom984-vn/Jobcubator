package org.jobcubator.jobcubator.authentication.service;

import java.util.Date;

public interface JwtTokenService {
    public String generateAccessToken(String username);
    public String  generateRefreshToken(String username);
    public String  getUsernameFromToken(String token);
    public boolean validateToken(String token, String username);
    public boolean isTokenExpired(String token);
    public Date getExpirationDateFromToken(String token);
}
