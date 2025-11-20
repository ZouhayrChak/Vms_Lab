package com.application.app.natbridge;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NATBridgeRepository extends JpaRepository<NATBridgeEntity, Integer> {
}
