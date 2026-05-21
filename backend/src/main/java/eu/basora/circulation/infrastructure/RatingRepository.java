package eu.basora.circulation.infrastructure;

import eu.basora.circulation.domain.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface RatingRepository extends JpaRepository<Rating, UUID> {

    List<Rating> findByWorkIdOrderByCreatedAtDesc(UUID workId);

    List<Rating> findByMember_MemberIdOrderByCreatedAtDesc(UUID memberId);

    boolean existsByWorkIdAndMember_MemberId(UUID workId, UUID memberId);

    @Query("SELECT AVG(r.score) FROM Rating r WHERE r.workId = :workId")
    Double findAverageScoreByWorkId(@Param("workId") UUID workId);

    @Query("SELECT COUNT(r) FROM Rating r WHERE r.workId = :workId")
    long countByWorkId(@Param("workId") UUID workId);
}
