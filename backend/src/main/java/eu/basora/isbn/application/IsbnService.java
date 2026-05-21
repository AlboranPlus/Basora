package eu.basora.isbn.application;

import eu.basora.catalog.api.dto.WorkDetailDto;
import eu.basora.catalog.application.WorkService;
import eu.basora.catalog.infrastructure.EditionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class IsbnService {

    private final EditionRepository editionRepository;
    private final WorkService workService;

    public IsbnLookupResult lookup(String isbn) {
        String normalized = isbn.replaceAll("[\\s-]", "");

        var edition = normalized.length() == 13
            ? editionRepository.findByIsbn13(normalized)
            : editionRepository.findByIsbn10(normalized);

        return edition
            .map(e -> IsbnLookupResult.found(workService.getById(e.getWork().getWorkId())))
            .orElse(IsbnLookupResult.notFound());
    }
}
