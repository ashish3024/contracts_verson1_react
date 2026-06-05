package com.seventhray.contracts.dto;

import com.seventhray.contracts.model.Contract;
import com.seventhray.contracts.model.ContractStatus;

import java.time.Instant;
import java.util.UUID;

public record ContractDto(
        UUID id,
        String title,
        String description,
        ContractStatus status,
        String owner_name,
        Instant created_at,
        Instant updated_at
) {
    public static ContractDto from(Contract c) {
        return new ContractDto(
                c.getId(),
                c.getTitle(),
                c.getDescription(),
                c.getStatus(),
                c.getOwnerName(),
                c.getCreatedAt(),
                c.getUpdatedAt()
        );
    }
}
