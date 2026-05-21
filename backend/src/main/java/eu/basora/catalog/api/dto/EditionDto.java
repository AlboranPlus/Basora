package eu.basora.catalog.api.dto;

import java.util.UUID;

public record EditionDto(UUID editionId, String isbn13, String language, String publisher, Short pubYear, String format) {}
