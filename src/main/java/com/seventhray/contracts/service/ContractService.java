package com.seventhray.contracts.service;

import com.seventhray.contracts.dto.ContractDto;
import com.seventhray.contracts.dto.WorkflowHistoryDto;
import com.seventhray.contracts.exception.ContractNotFoundException;
import com.seventhray.contracts.model.Contract;
import com.seventhray.contracts.model.ContractStatus;
import com.seventhray.contracts.repository.ContractRepository;
import com.seventhray.contracts.repository.WorkflowHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ContractService {

    private final ContractRepository contractRepository;
    private final WorkflowHistoryRepository workflowHistoryRepository;

    /**
     * Returns a paginated, filtered list of contracts.
     *
     * @param search  optional free-text (matches title or owner)
     * @param status  optional status filter
     * @param page    zero-based page number
     * @param size    page size (1–100)
     */
    public Page<ContractDto> listContracts(String search, ContractStatus status, int page, int size) {
        if (size < 1 || size > 100) {
            throw new IllegalArgumentException("Page size must be between 1 and 100");
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        // Normalise empty search string to null so the JPQL IS NULL check works
        String normalised = StringUtils.hasText(search) ? search.trim() : null;

        return contractRepository.searchContracts(normalised, status, pageable)
                .map(ContractDto::from);
    }

    /**
     * Returns a single contract by ID.
     */
    public ContractDto getContract(UUID id) {
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new ContractNotFoundException(id));
        return ContractDto.from(contract);
    }

    /**
     * Returns the workflow history for a contract, most recent first.
     */
    public List<WorkflowHistoryDto> getHistory(UUID id) {
        // Verify contract exists before fetching history
        if (!contractRepository.existsById(id)) {
            throw new ContractNotFoundException(id);
        }
        return workflowHistoryRepository.findByContractIdOrderByChangedAtDesc(id)
                .stream()
                .map(WorkflowHistoryDto::from)
                .toList();
    }
}
