package eu.basora.catalog.infrastructure;

import eu.basora.catalog.domain.Edition;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface EditionRepository extends JpaRepository<Edition, UUID> {
    Optional<Edition> findByIsbn13(String isbn13);
    Optional<Edition> findByIsbn10(String isbn10);
}
