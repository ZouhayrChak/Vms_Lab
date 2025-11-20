package com.application.app.vm;

import com.application.app.sessionbridge.SessionBridgeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Arrays;
import java.util.List;

@Repository
public interface VmRepository extends JpaRepository<VmEntity, Integer> {
    List<VmEntity> findAllBySbId(int id);



}
