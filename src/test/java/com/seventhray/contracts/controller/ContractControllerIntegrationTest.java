package com.seventhray.contracts.controller;

import com.seventhray.contracts.model.Contract;
import com.seventhray.contracts.model.ContractStatus;
import com.seventhray.contracts.model.WorkflowHistory;
import com.seventhray.contracts.repository.ContractRepository;
import com.seventhray.contracts.repository.WorkflowHistoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.UUID;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ContractControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ContractRepository contractRepository;

    @Autowired
    private WorkflowHistoryRepository workflowHistoryRepository;

    private Contract savedContract;

    @BeforeEach
    void setUp() {
        workflowHistoryRepository.deleteAll();
        contractRepository.deleteAll();

        savedContract = contractRepository.save(Contract.builder()
                .title("Vendor Supply Agreement")
                .description("Annual supply contract")
                .status(ContractStatus.APPROVED)
                .ownerName("Alice Johnson")
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build());

        contractRepository.save(Contract.builder()
                .title("Software License")
                .description("Enterprise license")
                .status(ContractStatus.DRAFT)
                .ownerName("Bob Martinez")
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build());

        workflowHistoryRepository.save(WorkflowHistory.builder()
                .contract(savedContract)
                .previousStatus(null)
                .newStatus(ContractStatus.DRAFT)
                .changedBy("Alice Johnson")
                .changedAt(Instant.now())
                .build());
    }

    // ── GET /api/contracts ────────────────────────────────────────────────

    @Test
    void listContracts_returnsPagedResults() throws Exception {
        mockMvc.perform(get("/api/contracts").param("size", "10").param("page", "0"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.content", hasSize(2)))
                .andExpect(jsonPath("$.totalElements").value(2));
    }

    @Test
    void listContracts_filterByStatus_returnsMatchingOnly() throws Exception {
        mockMvc.perform(get("/api/contracts").param("status", "APPROVED"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].status").value("APPROVED"));
    }

    @Test
    void listContracts_searchByTitle_returnsMatchingOnly() throws Exception {
        mockMvc.perform(get("/api/contracts").param("search", "vendor"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].title", containsStringIgnoringCase("vendor")));
    }

    @Test
    void listContracts_searchByOwner_returnsMatchingOnly() throws Exception {
        mockMvc.perform(get("/api/contracts").param("search", "bob"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].owner_name").value("Bob Martinez"));
    }

    @Test
    void listContracts_invalidStatus_returns400() throws Exception {
        mockMvc.perform(get("/api/contracts").param("status", "INVALID_STATUS"))
                .andExpect(status().isBadRequest());
    }

    // ── GET /api/contracts/{id} ───────────────────────────────────────────

    @Test
    void getContract_existingId_returnsContract() throws Exception {
        mockMvc.perform(get("/api/contracts/" + savedContract.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(savedContract.getId().toString()))
                .andExpect(jsonPath("$.title").value("Vendor Supply Agreement"))
                .andExpect(jsonPath("$.owner_name").value("Alice Johnson"));
    }

    @Test
    void getContract_unknownId_returns404() throws Exception {
        mockMvc.perform(get("/api/contracts/" + UUID.randomUUID()))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").exists());
    }

    // ── GET /api/contracts/{id}/history ───────────────────────────────────

    @Test
    void getHistory_existingContract_returnsHistory() throws Exception {
        mockMvc.perform(get("/api/contracts/" + savedContract.getId() + "/history"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].new_status").value("DRAFT"))
                .andExpect(jsonPath("$[0].changed_by").value("Alice Johnson"));
    }

    @Test
    void getHistory_unknownContract_returns404() throws Exception {
        mockMvc.perform(get("/api/contracts/" + UUID.randomUUID() + "/history"))
                .andExpect(status().isNotFound());
    }
}
