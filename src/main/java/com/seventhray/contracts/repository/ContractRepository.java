package com.seventhray.contracts.repository;

import com.seventhray.contracts.model.Contract;
import com.seventhray.contracts.model.ContractStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ContractRepository extends JpaRepository<Contract, UUID> {

    @Query("""
            SELECT c FROM Contract c
            WHERE (:search IS NULL OR
                   LOWER(c.title) LIKE LOWER(CONCAT('%', :search, '%')) OR
                   LOWER(c.ownerName) LIKE LOWER(CONCAT('%', :search, '%')))
              AND (:status IS NULL OR c.status = :status)
            """)
    Page<Contract> searchContracts(
            @Param("search") String search,
            @Param("status") ContractStatus status,
            Pageable pageable
    );
}
