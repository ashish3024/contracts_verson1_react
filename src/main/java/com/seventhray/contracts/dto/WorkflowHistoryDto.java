package com.seventhray.contracts.dto;

import com.seventhray.contracts.model.ContractStatus;
import com.seventhray.contracts.model.WorkflowHistory;

import java.time.Instant;
import java.util.UUID;

public record WorkflowHistoryDto(
        UUID id,
        UUID contract_id,
        ContractStatus previous_status,
        ContractStatus new_status,
        String changed_by,
        Instant changed_at
) {
    public static WorkflowHistoryDto from(WorkflowHistory h) {
        return new WorkflowHistoryDto(
                h.getId(),
                h.getContract().getId(),
                h.getPreviousStatus(),
                h.getNewStatus(),
                h.getChangedBy(),
                h.getChangedAt()
        );
    }
}
