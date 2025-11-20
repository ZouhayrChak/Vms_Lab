package com.application.app.sessionbridge;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface SessionBridgeRepository extends JpaRepository<SessionBridgeEntity, Integer> {
        public void deleteById(int idSb);
}
