package eu.basora.catalog.api.dto;

import java.util.UUID;

public record AuthorDto(UUID authorId, String firstName, String lastName, Short birthYear) {}
