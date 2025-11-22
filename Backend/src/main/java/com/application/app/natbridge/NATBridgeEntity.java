package com.application.app.natbridge;


import com.application.app.vm.VmEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.util.concurrent.atomic.AtomicInteger;

@Setter
@Getter
@RequiredArgsConstructor
@Entity
public class NATBridgeEntity {
    private static final AtomicInteger COUNTER = new AtomicInteger(0);

    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Id
    private int id;

    private int natBit;

    @OneToOne(cascade = CascadeType.ALL)
    private VmEntity vm;

    private String natIp ;

    @PrePersist
    public void generateValue(){
        var v = COUNTER.getAndUpdate(i -> (i+1) % 256);
        this.natBit = v;
        this.natIp = "171.1." + this.natBit + ".1";
    }



}
