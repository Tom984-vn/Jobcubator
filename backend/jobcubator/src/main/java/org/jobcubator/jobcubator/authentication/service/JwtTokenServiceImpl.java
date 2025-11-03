package org.jobcubator.jobcubator.authentication.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Base64;
import java.util.Date;
import java.util.function.Function;

@Service
public class JwtTokenServiceImpl implements JwtTokenService {

//    private final Key SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS512); // !!! WARNING !!! THIS IS A VERY BAD PRACTICE, PLEASE USE @VALUE("$jwt.secret.key") IN PRODUCTION.

    private final Key SECRET_KEY;

    public static final long ACCESS_TOKEN_VALIDITY_MILLISECONDS = 1000 * 60 * 15; // 15 MINUTES
    public static final long REFRESH_TOKEN_VALIDITY_MILLISECONDS = 1000 * 60 * 60 * 7; // 7 DAYS

    public JwtTokenServiceImpl(@Value("${jwt.secret.key}") String secretKey) {
        // Decode the base64 encoded secret key
        byte[] keyBytes = Base64.getDecoder().decode(secretKey);
        this.SECRET_KEY = Keys.hmacShaKeyFor(keyBytes);
    }

    @Override
    public String generateAccessToken(String username)
    {
        return  Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + ACCESS_TOKEN_VALIDITY_MILLISECONDS))
                .signWith(this.SECRET_KEY, SignatureAlgorithm.HS512)
                .compact();
    }

    @Override
    public String generateRefreshToken(String username)
    {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + REFRESH_TOKEN_VALIDITY_MILLISECONDS))
                .signWith(this.SECRET_KEY, SignatureAlgorithm.HS512)
                .compact();
    }

    @Override
    public String getUsernameFromToken(String token)
    {
        return getClaimFromToken(token, Claims::getSubject);
    }

    @Override
    public boolean validateToken(String token, String username)
    {
        final String tokenUsername = getUsernameFromToken(token);
        return (tokenUsername.equals(username) && !isTokenExpired(token));
    }

    @Override
    public boolean isTokenExpired(String token)
    {
        Date  expiration = getClaimFromToken(token, Claims::getExpiration);
        return expiration.before(new Date());
    }

    @Override
    public Date getExpirationDateFromToken(String token) {
        return getClaimFromToken(token, Claims::getExpiration);
    }

    private <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = getAllClaimsFromToken(token);
        return claimsResolver.apply(claims);
    }

    private Claims getAllClaimsFromToken(String token) {
        // Jwts.parserBuilder() will also validate the signature
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
