package com.application.app.auth;


import com.application.app.dto.users.AuthResponseDTO;
import com.application.app.dto.users.LoginRequestDTO;
import com.application.app.security.JwtUtil;
import com.application.app.user.User;
import com.application.app.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;


    // Login the user
    public AuthResponseDTO loginUser(LoginRequestDTO request) {

        // Authenticate user using the authentication manager
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // If authentication is successful, generate JWT token
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String token = jwtUtil.generateToken(userDetails);
        String role = userDetails.getAuthorities().stream().findFirst().get().getAuthority();

        var userOptional = userRepository.findByEmail(request.getEmail());
        User user = userOptional.orElseThrow(()->new UsernameNotFoundException("User not found"));

        if(!passwordEncoder.matches(request.getPassword(),user.getPassword())){
            throw new BadCredentialsException("Incorrect password");
        }

        return new AuthResponseDTO(role, token);

    }







}
