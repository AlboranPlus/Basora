package eu.basora.member.api.dto;

public record AuthResponseDto(String token, MemberProfileDto member) {}
