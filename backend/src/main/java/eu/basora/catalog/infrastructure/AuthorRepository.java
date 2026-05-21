package eu.basora.catalog.infrastructure;

import eu.basora.catalog.domain.Author;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface AuthorRepository extends JpaRepository<Author, UUID> {
    Optional<Author> findByOpenlibraryAuthorId(String openlibraryAuthorId);
}
