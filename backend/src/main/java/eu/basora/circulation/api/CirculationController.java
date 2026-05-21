package eu.basora.circulation.api;

import eu.basora.circulation.api.dto.*;
import eu.basora.circulation.application.CirculationService;
import eu.basora.member.domain.Member;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/circulation")
@RequiredArgsConstructor
@Tag(name = "Circulation", description = "Borrow, return, renew and rate")
public class CirculationController {

    private final CirculationService circulationService;

    @PostMapping("/borrow")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Borrow a copy (peer-to-peer or from community stock)")
    public BorrowingDto borrow(@AuthenticationPrincipal Member member, @Valid @RequestBody BorrowRequest req) {
        return circulationService.borrow(member.getMemberId(), req);
    }

    @PostMapping("/borrowings/{id}/return")
    @Operation(summary = "Return a borrowed copy")
    public BorrowingDto returnCopy(@AuthenticationPrincipal Member member, @PathVariable UUID id) {
        return circulationService.returnCopy(member.getMemberId(), id);
    }

    @PostMapping("/borrowings/{id}/renew")
    @Operation(summary = "Renew a borrowing (max 2 renewals)")
    public BorrowingDto renew(
        @AuthenticationPrincipal Member member,
        @PathVariable UUID id,
        @Valid @RequestBody RenewRequest req
    ) {
        return circulationService.renew(member.getMemberId(), id, req);
    }

    @GetMapping("/borrowings")
    @Operation(summary = "List my active borrowings")
    public List<BorrowingDto> myBorrowings(@AuthenticationPrincipal Member member) {
        return circulationService.getActiveBorrowings(member.getMemberId());
    }

    @GetMapping("/lent")
    @Operation(summary = "List books I have lent out")
    public List<BorrowingDto> lentOut(@AuthenticationPrincipal Member member) {
        return circulationService.getLentOut(member.getMemberId());
    }

    @GetMapping("/history")
    @Operation(summary = "My borrowing history")
    public List<BorrowingDto> history(@AuthenticationPrincipal Member member) {
        return circulationService.getHistory(member.getMemberId());
    }
}
