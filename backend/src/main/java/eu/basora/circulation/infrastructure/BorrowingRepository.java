package eu.basora.circulation.infrastructure;

import eu.basora.circulation.domain.Borrowing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface BorrowingRepository extends JpaRepository<Borrowing, UUID> {

    List<Borrowing> findByMember_MemberIdAndStatus(UUID memberId, String status);

    List<Borrowing> findByLender_MemberIdAndStatus(UUID lenderId, String status);

    @Query("SELECT COUNT(b) FROM Borrowing b WHERE b.member.memberId = :memberId AND b.status = 'active'")
    long countActiveByMemberId(@Param("memberId") UUID memberId);

    @Query("SELECT b FROM Borrowing b WHERE b.status = 'active' AND b.dueDate < CURRENT_DATE")
    List<Borrowing> findAllOverdue();
}
