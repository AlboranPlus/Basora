package eu.basora.circulation.application;

import eu.basora.catalog.domain.Copy;
import eu.basora.catalog.infrastructure.CopyRepository;
import eu.basora.circulation.api.dto.*;
import eu.basora.circulation.domain.*;
import eu.basora.circulation.infrastructure.*;
import eu.basora.member.domain.Member;
import eu.basora.member.infrastructure.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class CirculationService {

    private final BorrowingRepository borrowingRepository;
    private final RatingRepository ratingRepository;
    private final CopyRepository copyRepository;
    private final MemberRepository memberRepository;

    public BorrowingDto borrow(UUID memberId, BorrowRequest req) {
        Member member = memberRepository.findById(memberId).orElseThrow();
        Copy copy = copyRepository.findById(req.copyId()).orElseThrow();

        if (!"available".equals(copy.getStatus())) {
            throw new CopyNotAvailableException(req.copyId());
        }

        long active = borrowingRepository.countActiveByMemberId(memberId);
        int maxActive = member.getLevel() >= 4 ? Integer.MAX_VALUE : member.getLevel() >= 3 ? 5 : member.getLevel() >= 2 ? 3 : 2;
        if (active >= maxActive) {
            throw new BorrowLimitExceededException();
        }

        Borrowing borrowing = new Borrowing();
        borrowing.setCopy(copy);
        borrowing.setMember(member);
        borrowing.setDueDate(LocalDate.now().plusDays(req.durationDays()));

        if (req.lenderId() != null) {
            Member lender = memberRepository.findById(req.lenderId()).orElseThrow();
            if (!lender.canLend()) throw new InsufficientLevelException("Lender must be level 2 or higher");
            borrowing.setLender(lender);
        }

        copy.setStatus("borrowed");
        borrowing = borrowingRepository.save(borrowing);
        return toDto(borrowing);
    }

    public BorrowingDto returnCopy(UUID memberId, UUID borrowingId) {
        Borrowing borrowing = borrowingRepository.findById(borrowingId).orElseThrow();
        if (!borrowing.getMember().getMemberId().equals(memberId)) {
            throw new IllegalArgumentException("Not your borrowing");
        }
        boolean onTime = !borrowing.isOverdue();
        borrowing.markReturned();
        borrowing.getMember().recordReturn(onTime);
        return toDto(borrowingRepository.save(borrowing));
    }

    public BorrowingDto renew(UUID memberId, UUID borrowingId, RenewRequest req) {
        Borrowing borrowing = borrowingRepository.findById(borrowingId).orElseThrow();
        if (!borrowing.getMember().getMemberId().equals(memberId)) {
            throw new IllegalArgumentException("Not your borrowing");
        }
        borrowing.renew(req.extraDays());
        return toDto(borrowingRepository.save(borrowing));
    }

    @Transactional(readOnly = true)
    public List<BorrowingDto> getActiveBorrowings(UUID memberId) {
        return borrowingRepository.findByMember_MemberIdAndStatus(memberId, "active")
            .stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public List<BorrowingDto> getLentOut(UUID lenderId) {
        return borrowingRepository.findByLender_MemberIdAndStatus(lenderId, "active")
            .stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public List<BorrowingDto> getHistory(UUID memberId) {
        return borrowingRepository.findByMember_MemberIdAndStatus(memberId, "returned")
            .stream().map(this::toDto).toList();
    }

    private BorrowingDto toDto(Borrowing b) {
        var edition = b.getCopy().getEdition();
        var work = edition.getWork();
        String cover = edition.getCoverUrl();
        return new BorrowingDto(
            b.getBorrowingId(),
            b.getCopy().getCopyId(),
            work.getWorkId(),
            work.getTitle(),
            cover,
            b.getStatus(),
            b.getBorrowedAt(),
            b.getDueDate(),
            b.getReturnedAt(),
            b.getRenewalsCount(),
            b.isOverdue(),
            b.getLender() != null ? b.getLender().getMemberId() : null,
            b.getLender() != null ? b.getLender().getFirstName() + " " + b.getLender().getLastName() : null
        );
    }
}
