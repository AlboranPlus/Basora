package eu.basora.catalog.api;

import eu.basora.catalog.api.dto.WorkDetailDto;
import eu.basora.catalog.api.dto.WorkSummaryDto;
import eu.basora.catalog.application.WorkService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/works")
@RequiredArgsConstructor
@Tag(name = "Catalog", description = "Works and editions")
public class WorkController {

    private final WorkService workService;

    @GetMapping
    @Operation(summary = "Search works by title, author or subject")
    public Page<WorkSummaryDto> search(
        @RequestParam(required = false) String q,
        @RequestParam(required = false) String subject,
        @PageableDefault(size = 20) Pageable pageable
    ) {
        return workService.search(q, subject, pageable);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get full work details including editions and ratings")
    public WorkDetailDto getById(@PathVariable UUID id) {
        return workService.getById(id);
    }
}
