package eu.basora.catalog.infrastructure;

import eu.basora.catalog.domain.Work;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface WorkRepository extends JpaRepository<Work, UUID> {

    @Query("""
        SELECT DISTINCT w FROM Work w
        LEFT JOIN w.authors a
        LEFT JOIN w.subjects s
        WHERE (:query IS NULL OR
               LOWER(w.title) LIKE LOWER(CONCAT('%', CAST(:query AS string), '%')) OR
               LOWER(a.firstName) LIKE LOWER(CONCAT('%', CAST(:query AS string), '%')) OR
               LOWER(a.lastName)  LIKE LOWER(CONCAT('%', CAST(:query AS string), '%')) OR
               LOWER(s.name)      LIKE LOWER(CONCAT('%', CAST(:query AS string), '%')))
          AND (:subject IS NULL OR LOWER(s.name) = LOWER(CAST(:subject AS string)))
        """)
    Page<Work> search(@Param("query") String query, @Param("subject") String subject, Pageable pageable);
}