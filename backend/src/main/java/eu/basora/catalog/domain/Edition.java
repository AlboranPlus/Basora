package eu.basora.catalog.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "editions")
@Getter @Setter @NoArgsConstructor
public class Edition {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false)
    private UUID editionId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "work_id", nullable = false)
    private Work work;

    @Column(length = 10)
    private String isbn10;

    @Column(length = 13, unique = true)
    private String isbn13;

    @Column(length = 10)
    private String language;

    private String publisher;
    private Short pubYear;
    private String coverUrl;
    private String format;
    private Short pages;

    @Column(unique = true)
    private String openlibraryEditionId;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    private Instant updatedAt;
}
