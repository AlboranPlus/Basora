package eu.basora.member.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "members")
@Getter @Setter @NoArgsConstructor
public class Member implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false)
    private UUID memberId;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    private String phone;

    @Column(nullable = false)
    private String membershipStatus = "active";

    private LocalDate membershipExpires;

    @Column(nullable = false)
    private int level = 1;

    @Column(nullable = false)
    private int totalBorrows = 0;

    @Column(nullable = false)
    private int onTimeReturns = 0;

    private java.math.BigDecimal borrowerRating;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @UpdateTimestamp
    private Instant updatedAt;

    public void recordReturn(boolean onTime) {
        this.totalBorrows++;
        if (onTime) this.onTimeReturns++;
        recalculateLevel();
    }

    private void recalculateLevel() {
        if (totalBorrows >= 30)      this.level = 4;
        else if (totalBorrows >= 15) this.level = 3;
        else if (totalBorrows >= 5)  this.level = 2;
        else                         this.level = 1;
    }

    public boolean canLend() {
        return this.level >= 2;
    }

    public int maxLoanDays() {
        return switch (this.level) {
            case 4 -> 30;
            case 3 -> 21;
            case 2 -> 14;
            default -> 7;
        };
    }

    @Override public Collection<? extends GrantedAuthority> getAuthorities() { return List.of(); }
    @Override public String getPassword()   { return passwordHash; }
    @Override public String getUsername()   { return email; }
    @Override public boolean isEnabled()    { return "active".equals(membershipStatus); }
}
