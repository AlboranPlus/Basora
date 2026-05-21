CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─────────────────────────────────────────────
-- CATALOG
-- ─────────────────────────────────────────────

CREATE TABLE works (
    work_id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    title                VARCHAR     NOT NULL,
    original_language    VARCHAR(10),
    description          TEXT,
    openlibrary_work_id  VARCHAR     UNIQUE,
    created_at           TIMESTAMP   NOT NULL DEFAULT now(),
    updated_at           TIMESTAMP   NOT NULL DEFAULT now()
);

CREATE INDEX idx_works_title        ON works (title);
CREATE UNIQUE INDEX idx_works_openlibrary ON works (openlibrary_work_id) WHERE openlibrary_work_id IS NOT NULL;

CREATE TABLE authors (
    author_id             UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name            VARCHAR   NOT NULL,
    last_name             VARCHAR   NOT NULL,
    birth_year            SMALLINT,
    bio                   TEXT,
    photo_url             VARCHAR,
    openlibrary_author_id VARCHAR   UNIQUE,
    created_at            TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_authors_name        ON authors (last_name, first_name);
CREATE UNIQUE INDEX idx_authors_openlibrary ON authors (openlibrary_author_id) WHERE openlibrary_author_id IS NOT NULL;

CREATE TABLE work_authors (
    work_id   UUID    NOT NULL REFERENCES works   (work_id) ON DELETE CASCADE,
    author_id UUID    NOT NULL REFERENCES authors (author_id) ON DELETE CASCADE,
    role      VARCHAR NOT NULL DEFAULT 'author',
    PRIMARY KEY (work_id, author_id)
);

CREATE INDEX idx_work_authors_author ON work_authors (author_id);

CREATE TABLE subjects (
    subject_id UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
    name       VARCHAR NOT NULL UNIQUE,
    parent_id  UUID    REFERENCES subjects (subject_id)
);

CREATE UNIQUE INDEX idx_subjects_name   ON subjects (name);
CREATE        INDEX idx_subjects_parent ON subjects (parent_id);

CREATE TABLE work_subjects (
    work_id    UUID NOT NULL REFERENCES works    (work_id)    ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects (subject_id) ON DELETE CASCADE,
    PRIMARY KEY (work_id, subject_id)
);

CREATE INDEX idx_work_subjects_subject ON work_subjects (subject_id);

CREATE TABLE editions (
    edition_id             UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
    work_id                UUID      NOT NULL REFERENCES works (work_id) ON DELETE CASCADE,
    isbn_10                VARCHAR(10),
    isbn_13                VARCHAR(13) UNIQUE,
    language               VARCHAR(10),
    publisher              VARCHAR,
    pub_year               SMALLINT,
    cover_url              VARCHAR,
    format                 VARCHAR,
    pages                  SMALLINT,
    openlibrary_edition_id VARCHAR   UNIQUE,
    created_at             TIMESTAMP NOT NULL DEFAULT now(),
    updated_at             TIMESTAMP NOT NULL DEFAULT now()
);

CREATE        INDEX idx_editions_work        ON editions (work_id);
CREATE        INDEX idx_editions_isbn10      ON editions (isbn_10);
CREATE UNIQUE INDEX idx_editions_isbn13      ON editions (isbn_13) WHERE isbn_13 IS NOT NULL;
CREATE UNIQUE INDEX idx_editions_openlibrary ON editions (openlibrary_edition_id) WHERE openlibrary_edition_id IS NOT NULL;

CREATE TABLE copies (
    copy_id    UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
    edition_id UUID    NOT NULL REFERENCES editions (edition_id) ON DELETE CASCADE,
    status     VARCHAR NOT NULL DEFAULT 'available',
    condition  VARCHAR          DEFAULT 'good',
    added_at   TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_copies_edition ON copies (edition_id);
CREATE INDEX idx_copies_status  ON copies (status);

-- ─────────────────────────────────────────────
-- MEMBERSHIP
-- ─────────────────────────────────────────────

CREATE TABLE members (
    member_id          UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name         VARCHAR   NOT NULL,
    last_name          VARCHAR   NOT NULL,
    email              VARCHAR   NOT NULL UNIQUE,
    password_hash      VARCHAR   NOT NULL,
    phone              VARCHAR,
    membership_status  VARCHAR   NOT NULL DEFAULT 'active',
    membership_expires DATE,
    level              SMALLINT  NOT NULL DEFAULT 1,
    total_borrows      INT       NOT NULL DEFAULT 0,
    on_time_returns    INT       NOT NULL DEFAULT 0,
    borrower_rating    NUMERIC(3,2),
    created_at         TIMESTAMP NOT NULL DEFAULT now(),
    updated_at         TIMESTAMP NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_members_email    ON members (email);
CREATE        INDEX idx_members_lastname ON members (last_name);
CREATE        INDEX idx_members_status   ON members (membership_status);

-- ─────────────────────────────────────────────
-- CIRCULATION
-- ─────────────────────────────────────────────

CREATE TABLE borrowings (
    borrowing_id   UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
    copy_id        UUID      NOT NULL REFERENCES copies  (copy_id),
    member_id      UUID      NOT NULL REFERENCES members (member_id),
    lender_id      UUID               REFERENCES members (member_id),
    borrowed_at    TIMESTAMP NOT NULL DEFAULT now(),
    due_date       DATE      NOT NULL,
    returned_at    TIMESTAMP,
    status         VARCHAR   NOT NULL DEFAULT 'active',
    renewals_count SMALLINT  NOT NULL DEFAULT 0
);

CREATE INDEX idx_borrowings_copy          ON borrowings (copy_id);
CREATE INDEX idx_borrowings_member        ON borrowings (member_id);
CREATE INDEX idx_borrowings_lender        ON borrowings (lender_id);
CREATE INDEX idx_borrowings_status        ON borrowings (status);
CREATE INDEX idx_borrowings_member_status ON borrowings (member_id, status);
CREATE INDEX idx_borrowings_due_date      ON borrowings (due_date);

CREATE TABLE reservations (
    reservation_id UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
    work_id        UUID      NOT NULL REFERENCES works   (work_id),
    member_id      UUID      NOT NULL REFERENCES members (member_id),
    reserved_at    TIMESTAMP NOT NULL DEFAULT now(),
    expires_at     TIMESTAMP,
    status         VARCHAR   NOT NULL DEFAULT 'pending'
);

CREATE INDEX idx_reservations_queue   ON reservations (work_id, status);
CREATE INDEX idx_reservations_member  ON reservations (member_id);
CREATE INDEX idx_reservations_expires ON reservations (expires_at);

CREATE TABLE ratings (
    rating_id    UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
    work_id      UUID      NOT NULL REFERENCES works     (work_id),
    member_id    UUID      NOT NULL REFERENCES members   (member_id),
    borrowing_id UUID      NOT NULL REFERENCES borrowings(borrowing_id),
    score        SMALLINT  NOT NULL CHECK (score BETWEEN 1 AND 5),
    review       TEXT,
    created_at   TIMESTAMP NOT NULL DEFAULT now(),
    UNIQUE (work_id, member_id)
);

CREATE INDEX idx_ratings_work ON ratings (work_id);

CREATE TABLE borrower_reviews (
    review_id     UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
    borrowing_id  UUID      NOT NULL REFERENCES borrowings (borrowing_id),
    reviewer_id   UUID      NOT NULL REFERENCES members    (member_id),
    borrower_id   UUID      NOT NULL REFERENCES members    (member_id),
    score         SMALLINT  NOT NULL CHECK (score BETWEEN 1 AND 5),
    comment       TEXT,
    created_at    TIMESTAMP NOT NULL DEFAULT now(),
    UNIQUE (borrowing_id, reviewer_id)
);

CREATE INDEX idx_borrower_reviews_borrower ON borrower_reviews (borrower_id);

-- ─────────────────────────────────────────────
-- ISBN INTEGRATION
-- ─────────────────────────────────────────────

CREATE TABLE isbn_scans (
    scan_id           UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
    isbn              VARCHAR   NOT NULL,
    scanned_by        UUID      REFERENCES members  (member_id),
    scanned_at        TIMESTAMP NOT NULL DEFAULT now(),
    api_source        VARCHAR,
    result_type       VARCHAR   NOT NULL,
    result_edition_id UUID      REFERENCES editions (edition_id),
    raw_api_response  TEXT
);

CREATE INDEX idx_isbn_scans_isbn   ON isbn_scans (isbn);
CREATE INDEX idx_isbn_scans_member ON isbn_scans (scanned_by);
CREATE INDEX idx_isbn_scans_time   ON isbn_scans (scanned_at);
