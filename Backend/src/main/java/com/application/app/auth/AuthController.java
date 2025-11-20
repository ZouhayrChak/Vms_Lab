package com.application.app.auth;


import com.application.app.dto.users.ApiResponseDTO;
import com.application.app.dto.users.AuthResponseDTO;
import com.application.app.dto.users.LoginRequestDTO;
import com.application.app.exception.UserAlreadyExistsException;
import com.application.app.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO request) {
        try {
            // Call login service
            AuthResponseDTO response = authService.loginUser(request);
            return ResponseEntity.ok(response);
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiResponseDTO("Invalid username or password", false));
        }
    }

    @PostMapping("/user")
    public ResponseEntity<?> createUser(@RequestBody LoginRequestDTO request) {
        try {
            userService.createUser(request.getEmail(), request.getPassword());
            return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponseDTO("User created successfully", true));
        }catch (UserAlreadyExistsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new ApiResponseDTO("User already exists", false));
        }
    }

}
