package eu.basora.member.infrastructure;

import eu.basora.member.domain.Member;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface MemberRepository extends JpaRepository<Member, UUID> {
    Optional<Member> findByEmail(String email);
    boolean existsByEmail(String email);

    @Query("""
        SELECT m FROM Member m
        WHERE LOWER(m.firstName) LIKE LOWER(CONCAT('%', :q, '%'))
           OR LOWER(m.lastName)  LIKE LOWER(CONCAT('%', :q, '%'))
           OR LOWER(m.email)     LIKE LOWER(CONCAT('%', :q, '%'))
        """)
    Page<Member> search(@Param("q") String q, Pageable pageable);
}
