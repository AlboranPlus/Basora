package eu.basora.catalog.api.dto;

import java.util.List;
import java.util.UUID;

public record WorkSummaryDto(
    UUID workId,
    String title,
    List<String> authors,
    String coverUrl,
    Double avgRating,
    long totalCopies,
    long availableCopies,
    List<String> subjects
) {}
