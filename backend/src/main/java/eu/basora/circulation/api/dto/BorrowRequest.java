package eu.basora.circulation.api.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record BorrowRequest(
    @NotNull UUID copyId,
    UUID lenderId,
    @Min(1) @Max(30) int durationDays
) {}
