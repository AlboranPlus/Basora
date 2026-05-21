package eu.basora.member.application;

import eu.basora.member.api.dto.*;
import eu.basora.member.domain.Member;
import eu.basora.member.infrastructure.JwtService;
import eu.basora.member.infrastructure.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MemberService implements UserDetailsService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return memberRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException(email));
    }

    @Transactional
    public AuthResponseDto register(RegisterRequest req) {

        if (memberRepository.existsByEmail(req.email())) {
            throw new EmailAlreadyUsedException(req.email());
        }

        Member member = new Member();
        member.setFirstName(req.firstName());
        member.setLastName(req.lastName());
        member.setEmail(req.email());
        member.setPasswordHash(passwordEncoder.encode(req.password()));

        member = memberRepository.save(member);

        return new AuthResponseDto(
                jwtService.generate(member.getMemberId(), member.getEmail()),
                toProfile(member)
        );
    }

    public AuthResponseDto login(LoginRequest req) {

        Member member = memberRepository.findByEmail(req.email())
                .orElseThrow(() -> new UsernameNotFoundException(req.email()));

        if (!passwordEncoder.matches(req.password(), member.getPasswordHash())) {
            throw new UsernameNotFoundException("Invalid credentials");
        }

        return new AuthResponseDto(
                jwtService.generate(member.getMemberId(), member.getEmail()),
                toProfile(member)
        );
    }

    @Transactional(readOnly = true)
    public MemberProfileDto getProfile(UUID id) {
        return memberRepository.findById(id)
                .map(this::toProfile)
                .orElseThrow(() -> new MemberNotFoundException(id));
    }

    private MemberProfileDto toProfile(Member m) {
        return new MemberProfileDto(
                m.getMemberId(),
                m.getFirstName(),
                m.getLastName(),
                m.getEmail(),
                m.getLevel(),
                m.getTotalBorrows(),
                m.getOnTimeReturns(),
                m.getBorrowerRating(),
                m.getMembershipStatus()
        );
    }
}