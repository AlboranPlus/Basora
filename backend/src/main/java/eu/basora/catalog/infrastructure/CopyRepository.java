package eu.basora.catalog.infrastructure;

import eu.basora.catalog.domain.Copy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CopyRepository extends JpaRepository<Copy, UUID> {

    @Query("""
        SELECT c FROM Copy c
        JOIN c.edition e
        WHERE e.work.workId = :workId AND c.status = 'available'
        ORDER BY c.addedAt
        """)
    List<Copy> findAvailableCopiesByWorkId(@Param("workId") UUID workId);

    @Query("SELECT COUNT(c) FROM Copy c JOIN c.edition e WHERE e.work.workId = :workId")
    long countByWorkId(@Param("workId") UUID workId);

    @Query("SELECT COUNT(c) FROM Copy c JOIN c.edition e WHERE e.work.workId = :workId AND c.status = 'available'")
    long countAvailableByWorkId(@Param("workId") UUID workId);
}
