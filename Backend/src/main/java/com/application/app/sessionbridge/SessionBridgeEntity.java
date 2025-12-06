package com.application.app.sessionbridge;


import com.application.app.user.User;
import com.application.app.vm.VmEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;


@Getter
@Setter
@NoArgsConstructor
@Entity
public class SessionBridgeEntity {

    @GeneratedValue(strategy = GenerationType.AUTO)
    @Id
    private int id;

    private static final AtomicInteger COUNTER = new AtomicInteger(0);

    private int bridgeBit;

    private String bridgeIp;

    @OneToMany(mappedBy = "sb",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    private List<VmEntity> vms;

    @OneToOne
    private User user;


    public void generateValue(){
        var v = COUNTER.getAndUpdate(i -> (i+1) % 256);
        this.bridgeBit = v;
        this.bridgeIp = "170.19." + this.bridgeBit + ".1";
    }

    public String toString(){
        return this.bridgeIp + id;
    }


}
