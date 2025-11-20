package com.application.app.vm;



import com.application.app.dto.users.ApiResponseDTO;
import com.application.app.dto.users.SessionBridgeDTO;
import com.application.app.dto.users.VmDetailsDTO;
import com.application.app.exception.SessionBridgeNotFoundException;
import com.application.app.exception.VmNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/vms")
public class VmController {
    private final VmService vmService;

    @PostMapping("/vm")
    public ResponseEntity<?> createVm(@RequestBody SessionBridgeDTO sb) {
        try{
            VmDetailsDTO vmDetailsDTO =  vmService.createVm(sb.getIdSb());
            return ResponseEntity.status(HttpStatus.CREATED).body(vmDetailsDTO);
        }catch(SessionBridgeNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponseDTO("session bridge doesn't exist",false));
        }
    }

    @DeleteMapping("/vm/{idVm}")
    public ResponseEntity<?> deleteVM(@PathVariable int idVm){
        try{
            vmService.deleteVm(idVm);
            return ResponseEntity.status(HttpStatus.OK).body(new ApiResponseDTO("vm deleted ",true));
        }catch(VmNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponseDTO("vm not found",false));
        }
    }

    @DeleteMapping("/vm")
    public ResponseEntity<?> deleteAllVms(){
        try {
            vmService.prune();
            return ResponseEntity.status(HttpStatus.OK).body(new ApiResponseDTO("vms deleted",true));
        }catch (SessionBridgeNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponseDTO("session bridge not found",false));
        }
    }

    @GetMapping("/vms")
    public ResponseEntity<?> getAllVms(){
        try {
            List<VmDetailsDTO> vms = vmService.getListVms();
            return ResponseEntity.status(HttpStatus.OK).body(vms);
        }catch (VmNotFoundException | SessionBridgeNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponseDTO("vms not found",false));
        }
    }




}
