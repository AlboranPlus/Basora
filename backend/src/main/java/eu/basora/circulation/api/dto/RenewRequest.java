package eu.basora.circulation.api.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public record RenewRequest(@Min(1) @Max(14) int extraDays) {}
