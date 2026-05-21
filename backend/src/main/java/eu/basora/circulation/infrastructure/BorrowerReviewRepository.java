package eu.basora.circulation.infrastructure;

import eu.basora.circulation.domain.BorrowerReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface BorrowerReviewRepository extends JpaRepository<BorrowerReview, UUID> {

    @Query("SELECT AVG(r.score) FROM BorrowerReview r WHERE r.borrower.memberId = :borrowerId")
    double findAverageScoreByBorrowerId(@Param("borrowerId") UUID borrowerId);
}
