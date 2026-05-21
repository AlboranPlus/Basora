package eu.basora.member.api;

import eu.basora.member.api.dto.*;
import eu.basora.member.application.MemberService;
import eu.basora.member.domain.Member;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Tag(name = "Members")
public class MemberController {

    private final MemberService memberService;

    @PostMapping("/auth/register")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Register a new member")
    public AuthResponseDto register(@Valid @RequestBody RegisterRequest req) {
        return memberService.register(req);
    }

    @PostMapping("/auth/login")
    @Operation(summary = "Login and receive a JWT")
    public AuthResponseDto login(@Valid @RequestBody LoginRequest req) {
        return memberService.login(req);
    }

    @GetMapping("/members/me")
    @Operation(summary = "Get the authenticated member's profile")
    public MemberProfileDto me(@AuthenticationPrincipal Member member) {
        return memberService.getProfile(member.getMemberId());
    }
}
