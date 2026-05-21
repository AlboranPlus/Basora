INSERT INTO members (first_name, last_name, email, password_hash, level, total_borrows, on_time_returns)
VALUES
    ('Anna',  'Kowalska',    'anna@basora.local',  '$2a$12$placeholder', 3, 18, 17),
    ('Mark',  'Kowalski',    'mark@basora.local',  '$2a$12$placeholder', 2,  8,  7),
    ('Julia', 'Nowak',       'julia@basora.local', '$2a$12$placeholder', 2, 12, 11),
    ('Piotr', 'Wiśniewski',  'piotr@basora.local', '$2a$12$placeholder', 1,  2,  2);

INSERT INTO subjects (name) VALUES
    ('Science Fiction'), ('Fantasy'), ('Classic'), ('Dystopia'),
    ('Mystery'), ('Adventure'), ('Philosophy'), ('Historical');

WITH w AS (
    INSERT INTO works (title, original_language, description, openlibrary_work_id) VALUES
        ('Solaris',              'pl', 'A haunting masterpiece of philosophical science fiction.',        'OL27482W'),
        ('Dune',                 'en', 'The seminal epic of desert planets and ancient prophecy.',        'OL102749W'),
        ('Blood of Elves',       'pl', 'Geralt of Rivia must protect Ciri, the child of destiny.',       'OL4384563W'),
        ('Nineteen Eighty-Four', 'en', 'The definitive vision of a totalitarian future.',                'OL1168007W'),
        ('The Name of the Rose', 'it', 'A medieval murder mystery and philosophical puzzle.',             'OL14982460W'),
        ('Neuromancer',          'en', 'The novel that defined cyberpunk.',                              'OL27688W'),
        ('Foundation',           'en', 'The fall of the Galactic Empire and the plan to preserve it.',   'OL52163W'),
        ('The Hobbit',           'en', 'Bilbo Baggins and an unexpected adventure.',                     'OL262758W')
    RETURNING work_id, title
)
SELECT work_id FROM w;

WITH a AS (
    INSERT INTO authors (first_name, last_name, birth_year, openlibrary_author_id) VALUES
        ('Stanisław', 'Lem',         1921, 'OL56988A'),
        ('Frank',     'Herbert',     1920, 'OL26320A'),
        ('Andrzej',   'Sapkowski',   1948, 'OL1392452A'),
        ('George',    'Orwell',      1903, 'OL1392A'),
        ('Umberto',   'Eco',         1932, 'OL111067A'),
        ('William',   'Gibson',      1948, 'OL25375A'),
        ('Isaac',     'Asimov',      1920, 'OL34221A'),
        ('J.R.R.',    'Tolkien',     1892, 'OL26320A')
    RETURNING author_id, last_name
)
SELECT author_id FROM a;
