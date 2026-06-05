package com.seventhray.contracts.repository;

import com.seventhray.contracts.model.WorkflowHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface WorkflowHistoryRepository extends JpaRepository<WorkflowHistory, UUID> {

    List<WorkflowHistory> findByContractIdOrderByChangedAtDesc(UUID contractId);
}
