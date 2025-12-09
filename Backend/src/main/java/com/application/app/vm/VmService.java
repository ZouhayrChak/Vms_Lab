package com.application.app.vm;


import com.application.app.dto.users.ApiResponseDTO;
import com.application.app.dto.users.SessionBridgeDTO;
import com.application.app.dto.users.VmDetailsDTO;
import com.application.app.exception.SessionBridgeNotFoundException;
import com.application.app.exception.VmNotFoundException;
import com.application.app.sessionbridge.SessionBridgeEntity;
import com.application.app.sessionbridge.SessionBridgeRepository;
import com.application.app.user.User;
import com.application.app.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Objects;


@Service
public class VmService {
    private final VmRepository vmRepository;
    private final SessionBridgeRepository sessionBridgeRepository;
    private final UserRepository userRepository;
    private final RestTemplate restTemplate;
    private final String flaskUrl;

    public VmService(VmRepository vmRepository, SessionBridgeRepository sessionBridgeRepository, UserRepository userRepository, RestTemplate restTemplate, @Value("${flask.url}") String flaskUrl){
        this.vmRepository = vmRepository;
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

    public VmDetailsDTO createVm(int idSb){
        SessionBridgeEntity sb = sessionBridgeRepository.findById(idSb).orElseThrow(() -> new SessionBridgeNotFoundException("session bridge not found"));
        VmEntity vm = new VmEntity();
        vm.setSb(sb);
        vm.onCreate();
        vmRepository.save(vm);
        VmDetailsDTO vmDto = new VmDetailsDTO(vm.getId(),sb.getId(), vm.getNameVm(), vm.getVmSIp());
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<VmDetailsDTO> httpEntity = new HttpEntity<>(vmDto,headers);
        ResponseEntity<ApiResponseDTO> response = restTemplate.postForEntity(flaskUrl + "/vm", httpEntity, ApiResponseDTO.class);
        if(response.getStatusCode().is2xxSuccessful()) {
            return vmDto;
        }
        System.out.println("after if is successful");
        throw new VmNotFoundException("enable to create vm");

    }

    public void deleteVm(int idVm){
        VmEntity vm = vmRepository.findById(idVm).orElseThrow(() -> new VmNotFoundException("vm doesn't exist"));
        if(vm.getSb().getUser().getId() != getCurrentUser().getId())
            throw new VmNotFoundException("vm doesn't exist or doesn't belong to user");
        VmDetailsDTO vmDto = new VmDetailsDTO(vm.getId(),vm.getSb().getId(), vm.getNameVm(), vm.getVmSIp());
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<VmDetailsDTO> httpEntity = new HttpEntity<>(vmDto,headers);
        ResponseEntity<ApiResponseDTO> response = restTemplate.exchange(flaskUrl + "/vm", HttpMethod.DELETE,httpEntity, ApiResponseDTO.class);

        if (response.getStatusCode().is2xxSuccessful()) {
            vmRepository.deleteById(idVm);	
	}else{
        throw new VmNotFoundException("something is wrong");
	}

    }

    public void prune() {
        User user = getCurrentUser();
        SessionBridgeEntity sb = user.getSb();

        if (sb == null)
            throw new SessionBridgeNotFoundException("session bridge not found");

        user.setSb(null);
        userRepository.save(user);
        SessionBridgeDTO sbDto = new SessionBridgeDTO(sb.getId(),sb.getBridgeIp());
	    HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<SessionBridgeDTO> httpEntity = new HttpEntity<>(sbDto,headers);
        ResponseEntity<ApiResponseDTO> response = restTemplate.exchange(flaskUrl + "/vm/all", HttpMethod.DELETE,httpEntity, ApiResponseDTO.class);

        if(response.getStatusCode().is2xxSuccessful()){sessionBridgeRepository.delete(sb);}
        else{throw new SessionBridgeNotFoundException("not successful delete of vms");}

    }


    public List<VmDetailsDTO> getListVms() {
        User user = getCurrentUser();
        SessionBridgeEntity sb = user.getSb();
        if (sb == null)
            throw new SessionBridgeNotFoundException("no session bridge for this user");

        List<VmDetailsDTO> vms = vmRepository.findAllBySbId(sb.getId())
                .stream()
                .map(vm -> new VmDetailsDTO(
                        vm.getId(),
                        vm.getSb().getId(),
                        vm.getNameVm(),
                        vm.getVmSIp()
                ))
                .toList();

        return vms;
    }



}
