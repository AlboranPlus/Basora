package eu.basora.isbn.application;

import eu.basora.catalog.api.dto.WorkDetailDto;

public record IsbnLookupResult(String resultType, WorkDetailDto work) {
    public static IsbnLookupResult found(WorkDetailDto w) { return new IsbnLookupResult("found", w); }
    public static IsbnLookupResult notFound()             { return new IsbnLookupResult("not_found", null); }
}
