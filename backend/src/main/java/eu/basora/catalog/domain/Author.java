package eu.basora.catalog.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "authors")
@Getter @Setter @NoArgsConstructor
public class Author {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false)
    private UUID authorId;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    private Short birthYear;

    @Column(columnDefinition = "text")
    private String bio;

    private String photoUrl;

    @Column(unique = true)
    private String openlibraryAuthorId;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public String fullName() {
        return firstName + " " + lastName;
    }
}
