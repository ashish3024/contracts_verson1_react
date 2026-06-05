package com.seventhray.contracts.config;

import com.seventhray.contracts.model.Contract;
import com.seventhray.contracts.model.ContractStatus;
import com.seventhray.contracts.model.WorkflowHistory;
import com.seventhray.contracts.repository.ContractRepository;
import com.seventhray.contracts.repository.WorkflowHistoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Slf4j
@Component
@Profile("dev")
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final ContractRepository contractRepository;
    private final WorkflowHistoryRepository workflowHistoryRepository;

    @Override
    public void run(String... args) {
        if (contractRepository.count() > 0) {
            log.info("Database already has data – skipping seed.");
            return;
        }

        log.info("Seeding sample data...");

        Contract c1 = save("Vendor Supply Agreement – Acme Corp",
                "Annual supply contract for raw materials.",
                ContractStatus.APPROVED, "Alice Johnson", 90);

        Contract c2 = save("Software Licensing Agreement – TechSoft",
                "Enterprise license for TechSoft suite covering 500 seats.",
                ContractStatus.REVIEW, "Bob Martinez", 30);

        Contract c3 = save("Office Lease – Downtown HQ",
                "Five-year lease for the downtown headquarters building.",
                ContractStatus.DRAFT, "Carol Singh", 7);

        Contract c4 = save("Consulting Services – DataInsights Ltd",
                "Six-month data analytics consulting engagement.",
                ContractStatus.REJECTED, "David Lee", 60);

        Contract c5 = save("Marketing Partnership – BrandBoost",
                "Co-marketing agreement for Q3 campaign.",
                ContractStatus.EXPIRED, "Eve Patel", 365);

        Contract c6 = save("Cloud Infrastructure – NimbusTech",
                "Managed cloud hosting with SLA guarantees.",
                ContractStatus.APPROVED, "Frank Nguyen", 120);

        Contract c7 = save("HR Outsourcing – PeopleFirst",
                "Payroll and HR management outsourcing agreement.",
                ContractStatus.REVIEW, "Grace Kim", 14);

        Contract c8 = save("Security Audit – ShieldSec",
                "Annual penetration testing and security audit contract.",
                ContractStatus.DRAFT, "Henry Brown", 3);

        Contract c9 = save("Logistics Partner – FastShip Inc",
                "Logistics and last-mile delivery services agreement.",
                ContractStatus.APPROVED, "Isla White", 200);

        Contract c10 = save("R&D Collaboration – InnovateLab",
                "Joint research and development agreement for AI tooling.",
                ContractStatus.REVIEW, "Jack Wilson", 20);

        // Workflow histories
        addHistory(c1, null,                   ContractStatus.DRAFT,    "Alice Johnson", 90);
        addHistory(c1, ContractStatus.DRAFT,   ContractStatus.REVIEW,   "Alice Johnson", 80);
        addHistory(c1, ContractStatus.REVIEW,  ContractStatus.APPROVED, "Admin User",    10);

        addHistory(c2, null,                   ContractStatus.DRAFT,    "Bob Martinez",  30);
        addHistory(c2, ContractStatus.DRAFT,   ContractStatus.REVIEW,   "Bob Martinez",   2);

        addHistory(c3, null,                   ContractStatus.DRAFT,    "Carol Singh",    7);

        addHistory(c4, null,                   ContractStatus.DRAFT,    "David Lee",     60);
        addHistory(c4, ContractStatus.DRAFT,   ContractStatus.REVIEW,   "David Lee",     55);
        addHistory(c4, ContractStatus.REVIEW,  ContractStatus.REJECTED, "Admin User",    45);

        addHistory(c5, null,                   ContractStatus.DRAFT,    "Eve Patel",    365);
        addHistory(c5, ContractStatus.DRAFT,   ContractStatus.REVIEW,   "Eve Patel",    350);
        addHistory(c5, ContractStatus.REVIEW,  ContractStatus.APPROVED, "Admin User",   340);
        addHistory(c5, ContractStatus.APPROVED,ContractStatus.EXPIRED,  "System",       180);

        addHistory(c6, null,                   ContractStatus.DRAFT,    "Frank Nguyen", 120);
        addHistory(c6, ContractStatus.DRAFT,   ContractStatus.REVIEW,   "Frank Nguyen", 100);
        addHistory(c6, ContractStatus.REVIEW,  ContractStatus.APPROVED, "Admin User",     5);

        addHistory(c7, null,                   ContractStatus.DRAFT,    "Grace Kim",     14);
        addHistory(c7, ContractStatus.DRAFT,   ContractStatus.REVIEW,   "Grace Kim",      1);

        addHistory(c8, null,                   ContractStatus.DRAFT,    "Henry Brown",    3);

        addHistory(c9, null,                   ContractStatus.DRAFT,    "Isla White",   200);
        addHistory(c9, ContractStatus.DRAFT,   ContractStatus.REVIEW,   "Isla White",   190);
        addHistory(c9, ContractStatus.REVIEW,  ContractStatus.APPROVED, "Admin User",    30);

        addHistory(c10, null,                  ContractStatus.DRAFT,    "Jack Wilson",   20);
        addHistory(c10, ContractStatus.DRAFT,  ContractStatus.REVIEW,   "Jack Wilson",    2);

        log.info("Seeded {} contracts and {} workflow history records.",
                contractRepository.count(), workflowHistoryRepository.count());
    }

    private Contract save(String title, String description,
                          ContractStatus status, String owner, int daysAgo) {
        Instant ts = Instant.now().minus(daysAgo, ChronoUnit.DAYS);
        return contractRepository.save(Contract.builder()
                .title(title)
                .description(description)
                .status(status)
                .ownerName(owner)
                .createdAt(ts)
                .updatedAt(ts)
                .build());
    }

    private void addHistory(Contract contract,
                            ContractStatus previous, ContractStatus next,
                            String changedBy, int daysAgo) {
        workflowHistoryRepository.save(WorkflowHistory.builder()
                .contract(contract)
                .previousStatus(previous)
                .newStatus(next)
                .changedBy(changedBy)
                .changedAt(Instant.now().minus(daysAgo, ChronoUnit.DAYS))
                .build());
    }
}
