package eu.basora.circulation.api.dto;

import jakarta.validation.constraints.*;

import java.util.UUID;

public record RateWorkRequest(
    @NotNull UUID borrowingId,
    @Min(1) @Max(5) int score,
    String review
) {}
