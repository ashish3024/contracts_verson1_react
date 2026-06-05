package com.seventhray.contracts.service;

import com.seventhray.contracts.dto.ContractDto;
import com.seventhray.contracts.dto.WorkflowHistoryDto;
import com.seventhray.contracts.exception.ContractNotFoundException;
import com.seventhray.contracts.model.Contract;
import com.seventhray.contracts.model.ContractStatus;
import com.seventhray.contracts.model.WorkflowHistory;
import com.seventhray.contracts.repository.ContractRepository;
import com.seventhray.contracts.repository.WorkflowHistoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ContractServiceTest {

    @Mock
    private ContractRepository contractRepository;

    @Mock
    private WorkflowHistoryRepository workflowHistoryRepository;

    @InjectMocks
    private ContractService contractService;

    private Contract sampleContract;
    private UUID contractId;

    @BeforeEach
    void setUp() {
        contractId = UUID.randomUUID();
        sampleContract = Contract.builder()
                .id(contractId)
                .title("Test Contract")
                .description("A test contract")
                .status(ContractStatus.DRAFT)
                .ownerName("John Doe")
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
    }

    // ── listContracts ─────────────────────────────────────────────────────

    @Test
    void listContracts_returnsPageOfDtos() {
        Page<Contract> page = new PageImpl<>(List.of(sampleContract));
        when(contractRepository.searchContracts(any(), any(), any())).thenReturn(page);

        Page<ContractDto> result = contractService.listContracts(null, null, 0, 10);

        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).title()).isEqualTo("Test Contract");
    }

    @Test
    void listContracts_withSearchTerm_passesNormalisedSearch() {
        Page<Contract> empty = Page.empty();
        when(contractRepository.searchContracts(eq("vendor"), any(), any())).thenReturn(empty);

        contractService.listContracts("vendor", null, 0, 10);

        verify(contractRepository).searchContracts(eq("vendor"), isNull(), any(Pageable.class));
    }

    @Test
    void listContracts_withBlankSearch_passesNull() {
        Page<Contract> empty = Page.empty();
        when(contractRepository.searchContracts(isNull(), any(), any())).thenReturn(empty);

        contractService.listContracts("   ", null, 0, 10);

        verify(contractRepository).searchContracts(isNull(), isNull(), any(Pageable.class));
    }

    @Test
    void listContracts_invalidPageSize_throwsIllegalArgument() {
        assertThatThrownBy(() -> contractService.listContracts(null, null, 0, 0))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Page size must be between 1 and 100");

        assertThatThrownBy(() -> contractService.listContracts(null, null, 0, 101))
                .isInstanceOf(IllegalArgumentException.class);
    }

    // ── getContract ───────────────────────────────────────────────────────

    @Test
    void getContract_existingId_returnsDto() {
        when(contractRepository.findById(contractId)).thenReturn(Optional.of(sampleContract));

        ContractDto dto = contractService.getContract(contractId);

        assertThat(dto.id()).isEqualTo(contractId);
        assertThat(dto.owner_name()).isEqualTo("John Doe");
    }

    @Test
    void getContract_unknownId_throwsNotFound() {
        UUID unknown = UUID.randomUUID();
        when(contractRepository.findById(unknown)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> contractService.getContract(unknown))
                .isInstanceOf(ContractNotFoundException.class)
                .hasMessageContaining(unknown.toString());
    }

    // ── getHistory ────────────────────────────────────────────────────────

    @Test
    void getHistory_existingContract_returnsHistory() {
        WorkflowHistory h = WorkflowHistory.builder()
                .id(UUID.randomUUID())
                .contract(sampleContract)
                .previousStatus(null)
                .newStatus(ContractStatus.DRAFT)
                .changedBy("Alice")
                .changedAt(Instant.now())
                .build();

        when(contractRepository.existsById(contractId)).thenReturn(true);
        when(workflowHistoryRepository.findByContractIdOrderByChangedAtDesc(contractId))
                .thenReturn(List.of(h));

        List<WorkflowHistoryDto> history = contractService.getHistory(contractId);

        assertThat(history).hasSize(1);
        assertThat(history.get(0).changed_by()).isEqualTo("Alice");
        assertThat(history.get(0).previous_status()).isNull();
    }

    @Test
    void getHistory_unknownContract_throwsNotFound() {
        UUID unknown = UUID.randomUUID();
        when(contractRepository.existsById(unknown)).thenReturn(false);

        assertThatThrownBy(() -> contractService.getHistory(unknown))
                .isInstanceOf(ContractNotFoundException.class);
    }
}
