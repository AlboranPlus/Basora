package eu.basora.circulation.domain;

import eu.basora.member.domain.Member;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "ratings")
@Getter @Setter @NoArgsConstructor
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false)
    private UUID ratingId;

    @Column(name = "work_id", nullable = false)
    private UUID workId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "borrowing_id", nullable = false)
    private Borrowing borrowing;

    @Column(nullable = false)
    private short score;

    @Column(columnDefinition = "text")
    private String review;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();
}
