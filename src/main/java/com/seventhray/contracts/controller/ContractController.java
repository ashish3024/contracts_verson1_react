package com.seventhray.contracts.controller;

import com.seventhray.contracts.dto.ContractDto;
import com.seventhray.contracts.dto.WorkflowHistoryDto;
import com.seventhray.contracts.model.ContractStatus;
import com.seventhray.contracts.service.ContractService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/contracts")
@RequiredArgsConstructor
public class ContractController {

    private final ContractService contractService;

    /**
     * GET /api/contracts
     * Query params: search, status, page (0-based), size
     */
    @GetMapping
    public ResponseEntity<Page<ContractDto>> listContracts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) ContractStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<ContractDto> result = contractService.listContracts(search, status, page, size);
        return ResponseEntity.ok(result);
    }

    /**
     * GET /api/contracts/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ContractDto> getContract(@PathVariable UUID id) {
        return ResponseEntity.ok(contractService.getContract(id));
    }

    /**
     * GET /api/contracts/{id}/history
     */
    @GetMapping("/{id}/history")
    public ResponseEntity<List<WorkflowHistoryDto>> getHistory(@PathVariable UUID id) {
        return ResponseEntity.ok(contractService.getHistory(id));
    }
}
