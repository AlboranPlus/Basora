package eu.basora.circulation.api;

import eu.basora.circulation.api.dto.RateBorrowerRequest;
import eu.basora.circulation.api.dto.RateWorkRequest;
import eu.basora.circulation.application.RatingService;
import eu.basora.member.domain.Member;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/circulation/ratings")
@RequiredArgsConstructor
@Tag(name = "Ratings")
public class RatingController {

    private final RatingService ratingService;

    @PostMapping("/work")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Rate a book after returning it")
    public void rateWork(@AuthenticationPrincipal Member member, @Valid @RequestBody RateWorkRequest req) {
        ratingService.rateWork(member.getMemberId(), req);
    }

    @PostMapping("/borrower")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Rate a borrower after they return your book")
    public void rateBorrower(@AuthenticationPrincipal Member member, @Valid @RequestBody RateBorrowerRequest req) {
        ratingService.rateBorrower(member.getMemberId(), req);
    }
}
