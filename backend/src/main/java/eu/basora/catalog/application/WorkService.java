package eu.basora.catalog.application;

import eu.basora.catalog.api.dto.*;
import eu.basora.catalog.domain.Work;
import eu.basora.catalog.infrastructure.*;
import eu.basora.circulation.infrastructure.RatingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class WorkService {

    private final WorkRepository workRepository;
    private final CopyRepository copyRepository;
    private final RatingRepository ratingRepository;

    public Page<WorkSummaryDto> search(String query, String subject, Pageable pageable) {
        return workRepository.search(query, subject, pageable).map(this::toSummary);
    }

    public WorkDetailDto getById(UUID id) {
        Work work = workRepository.findById(id)
            .orElseThrow(() -> new WorkNotFoundException(id));
        return toDetail(work);
    }

    private WorkSummaryDto toSummary(Work w) {
        String cover = w.getEditions().stream()
            .map(e -> e.getCoverUrl())
            .filter(url -> url != null)
            .findFirst()
            .orElse(null);

        return new WorkSummaryDto(
            w.getWorkId(),
            w.getTitle(),
            w.getAuthors().stream().map(a -> a.fullName()).toList(),
            cover,
            ratingRepository.findAverageScoreByWorkId(w.getWorkId()),
            copyRepository.countByWorkId(w.getWorkId()),
            copyRepository.countAvailableByWorkId(w.getWorkId()),
            w.getSubjects().stream().map(s -> s.getName()).toList()
        );
    }

    private WorkDetailDto toDetail(Work w) {
        String cover = w.getEditions().stream()
            .map(e -> e.getCoverUrl())
            .filter(url -> url != null)
            .findFirst()
            .orElse(null);

        return new WorkDetailDto(
            w.getWorkId(),
            w.getTitle(),
            w.getOriginalLanguage(),
            w.getDescription(),
            w.getAuthors().stream().map(a -> new AuthorDto(a.getAuthorId(), a.getFirstName(), a.getLastName(), a.getBirthYear())).toList(),
            cover,
            ratingRepository.findAverageScoreByWorkId(w.getWorkId()),
            (int) ratingRepository.countByWorkId(w.getWorkId()),
            copyRepository.countByWorkId(w.getWorkId()),
            copyRepository.countAvailableByWorkId(w.getWorkId()),
            w.getSubjects().stream().map(s -> s.getName()).toList(),
            w.getEditions().stream().map(e -> new EditionDto(e.getEditionId(), e.getIsbn13(), e.getLanguage(), e.getPublisher(), e.getPubYear(), e.getFormat())).toList()
        );
    }
}
