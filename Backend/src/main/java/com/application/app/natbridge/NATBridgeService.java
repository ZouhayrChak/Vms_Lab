package com.application.app.natbridge;


import com.application.app.vm.VmEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class NATBridgeService {
    private final NATBridgeRepository natBridgeRepository;

    public void createNatBridge(VmEntity vmEntity) {
        NATBridgeEntity nbridgeEntity = new NATBridgeEntity();
        nbridgeEntity.setVm(vmEntity);
        vmEntity.setNb(nbridgeEntity);
        natBridgeRepository.save(nbridgeEntity);
    }

    public void deleteNatBridge(int idNb){
        natBridgeRepository.deleteById(idNb);
    }



}
