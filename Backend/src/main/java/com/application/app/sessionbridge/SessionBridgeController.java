package com.application.app.sessionbridge;


import com.application.app.dto.users.ApiResponseDTO;
import com.application.app.dto.users.SessionBridgeDTO;
import com.application.app.exception.SessionBridgeAlreadyCreatedException;
import com.application.app.exception.SessionBridgeNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClientException;


@RequiredArgsConstructor
@RestController
@RequestMapping("/api/bridges")
public class SessionBridgeController {
    private final SessionBridgeService sessionBridgeService;


    @PostMapping("/sb")
    public ResponseEntity<?> createSb(){
        try {
            SessionBridgeDTO sbDto = sessionBridgeService.createSessionBridge();
            return ResponseEntity.status(HttpStatus.CREATED).body(sbDto);
        }catch (SessionBridgeAlreadyCreatedException e){
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new ApiResponseDTO("user already has a session bridge",false));
        }catch(RestClientException e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponseDTO("rest client exception",false));

        }
        catch(Exception e){
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponseDTO("Something is wrong",false));

        }

    }

}
