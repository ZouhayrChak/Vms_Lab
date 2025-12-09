package com.application.app.vm;

import com.application.app.sessionbridge.SessionBridgeEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Cascade;

import java.util.concurrent.atomic.AtomicInteger;


@Setter
@Getter
@RequiredArgsConstructor
@Entity
@AllArgsConstructor
public class VmEntity {

    @GeneratedValue(strategy = GenerationType.AUTO)
    @Id
    private int id;

    private static AtomicInteger COUNTER = new AtomicInteger(2);
    private int ipBit;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_bridge_id")
    private SessionBridgeEntity sb;



    private String vmSIp;

    private String nameVm;


    public void onCreate(){
        int v = COUNTER.getAndUpdate(i -> (i+1) % 256);
        this.ipBit = v;
        if(sb != null) {
            this.vmSIp = "170.19." + sb.getBridgeBit() + "." + ipBit;
            this.nameVm = "node" + this.vmSIp;
        }
    }
}
