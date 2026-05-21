package eu.basora.catalog.api.dto;

import java.util.List;
import java.util.UUID;

public record WorkDetailDto(
    UUID workId,
    String title,
    String originalLanguage,
    String description,
    List<AuthorDto> authors,
    String coverUrl,
    Double avgRating,
    int ratingCount,
    long totalCopies,
    long availableCopies,
    List<String> subjects,
    List<EditionDto> editions
) {}
