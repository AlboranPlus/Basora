package eu.basora.isbn.domain;

import eu.basora.catalog.domain.Edition;
import eu.basora.member.domain.Member;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "isbn_scans")
@Getter @Setter @NoArgsConstructor
public class IsbnScan {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false)
    private UUID scanId;

    @Column(nullable = false)
    private String isbn;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scanned_by")
    private Member scannedBy;

    @Column(nullable = false, updatable = false)
    private Instant scannedAt = Instant.now();

    private String apiSource;

    @Column(nullable = false)
    private String resultType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "result_edition_id")
    private Edition resultEdition;

    @Column(columnDefinition = "text")
    private String rawApiResponse;
}
