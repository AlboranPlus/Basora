package eu.basora.member.api.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record MemberProfileDto(
    UUID memberId,
    String firstName,
    String lastName,
    String email,
    int level,
    int totalBorrows,
    int onTimeReturns,
    BigDecimal borrowerRating,
    String membershipStatus
) {}
