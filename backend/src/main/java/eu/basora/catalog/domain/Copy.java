package eu.basora.catalog.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "copies")
@Getter @Setter @NoArgsConstructor
public class Copy {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false)
    private UUID copyId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "edition_id", nullable = false)
    private Edition edition;

    @Column(nullable = false)
    private String status = "available";

    private String condition = "good";

    @Column(nullable = false, updatable = false)
    private Instant addedAt = Instant.now();
}
