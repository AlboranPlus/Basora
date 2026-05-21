package eu.basora.circulation.api.dto;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record BorrowingDto(
    UUID borrowingId,
    UUID copyId,
    UUID workId,
    String workTitle,
    String coverUrl,
    String status,
    Instant borrowedAt,
    LocalDate dueDate,
    Instant returnedAt,
    int renewalsCount,
    boolean overdue,
    UUID lenderId,
    String lenderName
) {}
