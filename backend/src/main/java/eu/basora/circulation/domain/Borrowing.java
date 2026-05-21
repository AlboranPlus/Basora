package eu.basora.circulation.domain;

import eu.basora.catalog.domain.Copy;
import eu.basora.member.domain.Member;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "borrowings")
@Getter @Setter @NoArgsConstructor
public class Borrowing {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false)
    private UUID borrowingId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "copy_id", nullable = false)
    private Copy copy;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lender_id")
    private Member lender;

    @Column(nullable = false, updatable = false)
    private Instant borrowedAt = Instant.now();

    @Column(nullable = false)
    private LocalDate dueDate;

    private Instant returnedAt;

    @Column(nullable = false)
    private String status = "active";

    @Column(nullable = false)
    private short renewalsCount = 0;

    public void renew(int days) {
        if (renewalsCount >= 2) throw new IllegalStateException("Max renewals reached");
        this.dueDate = this.dueDate.plusDays(days);
        this.renewalsCount++;
    }

    public void markReturned() {
        this.returnedAt = Instant.now();
        this.status = "returned";
        this.copy.setStatus("available");
    }

    public boolean isOverdue() {
        return "active".equals(status) && LocalDate.now().isAfter(dueDate);
    }
}
