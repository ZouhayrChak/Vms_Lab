package com.application.app.sessionbridge;


import com.application.app.dto.users.ApiResponseDTO;
import com.application.app.dto.users.SessionBridgeDTO;
import com.application.app.exception.SessionBridgeAlreadyCreatedException;
import com.application.app.exception.SessionBridgeNotFoundException;
import com.application.app.user.User;
import com.application.app.user.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;



@Service
public class SessionBridgeService {
    private final SessionBridgeRepository sessionBridgeRepository;
    private final UserRepository userRepository;
    private final RestTemplate restTemplate;
    private final String flaskUrl;

    public SessionBridgeService(SessionBridgeRepository sessionBridgeRepository, UserRepository userRepository, RestTemplate restTemplate,@Value("${flask.url}") String flaskUrl) {
        this.sessionBridgeRepository = sessionBridgeRepository;
        this.userRepository = userRepository;
        this.restTemplate = restTemplate;
        this.flaskUrl = flaskUrl;
    }


    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User is not authenticated");
        }

        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public SessionBridgeDTO createSessionBridge() {
        User user = getCurrentUser();
        
        if (user.getSb() == null) {
            SessionBridgeEntity sb = new SessionBridgeEntity();
            sb.setUser(user);
            user.setSb(sb);
            sb.generateValue();
	    System.out.println(sb.getId());
            sessionBridgeRepository.saveAndFlush(sb);
	    System.out.println(sb.getId());
            SessionBridgeDTO sbDto = new SessionBridgeDTO(sb.getId(), sb.getBridgeIp());
            System.out.println(sb.getId());
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<SessionBridgeDTO> httpEntity = new HttpEntity<>(sbDto,headers);
            ResponseEntity<ApiResponseDTO> response = restTemplate.postForEntity(flaskUrl + "/sb", httpEntity, ApiResponseDTO.class);
            if(response.getStatusCode().is2xxSuccessful()) {
                return sbDto;
            }
            throw new SessionBridgeAlreadyCreatedException("session bridge already created");

        } else {
            throw new SessionBridgeAlreadyCreatedException("Session bridge already created");
        }
    }

    @Transactional
    public void deleteSessionBridge(int idSb) {
        SessionBridgeEntity sb = sessionBridgeRepository.findById(idSb)
                .orElseThrow(() -> new SessionBridgeNotFoundException("session bridge not found"));
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity httpEntity = new HttpEntity(headers);
        ResponseEntity<ApiResponseDTO> response = restTemplate.exchange(flaskUrl + "/sb/{idSb}", HttpMethod.DELETE,httpEntity, ApiResponseDTO.class,idSb);
        if(response.getStatusCode().is2xxSuccessful()) {
            sessionBridgeRepository.deleteById(sb.getId());
        }

    }




}
