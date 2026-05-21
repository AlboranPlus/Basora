package eu.basora.circulation.application;

import eu.basora.circulation.api.dto.RateBorrowerRequest;
import eu.basora.circulation.api.dto.RateWorkRequest;
import eu.basora.circulation.domain.BorrowerReview;
import eu.basora.circulation.domain.Rating;
import eu.basora.circulation.infrastructure.BorrowingRepository;
import eu.basora.circulation.infrastructure.BorrowerReviewRepository;
import eu.basora.circulation.infrastructure.RatingRepository;
import eu.basora.member.infrastructure.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class RatingService {

    private final RatingRepository ratingRepository;
    private final BorrowerReviewRepository borrowerReviewRepository;
    private final BorrowingRepository borrowingRepository;
    private final MemberRepository memberRepository;

    public void rateWork(UUID memberId, RateWorkRequest req) {
        var borrowing = borrowingRepository.findById(req.borrowingId()).orElseThrow();
        if (!borrowing.getMember().getMemberId().equals(memberId)) {
            throw new IllegalArgumentException("Not your borrowing");
        }
        if (ratingRepository.existsByWorkIdAndMember_MemberId(borrowing.getCopy().getEdition().getWork().getWorkId(), memberId)) {
            throw new IllegalStateException("You already rated this book");
        }

        Rating rating = new Rating();
        rating.setWorkId(borrowing.getCopy().getEdition().getWork().getWorkId());
        rating.setMember(borrowing.getMember());
        rating.setBorrowing(borrowing);
        rating.setScore((short) req.score());
        rating.setReview(req.review());
        ratingRepository.save(rating);
    }

    public void rateBorrower(UUID reviewerId, RateBorrowerRequest req) {
        var borrowing = borrowingRepository.findById(req.borrowingId()).orElseThrow();
        var reviewer = memberRepository.findById(reviewerId).orElseThrow();

        BorrowerReview review = new BorrowerReview();
        review.setBorrowing(borrowing);
        review.setReviewer(reviewer);
        review.setBorrower(borrowing.getMember());
        review.setScore((short) req.score());
        review.setComment(req.comment());
        borrowerReviewRepository.save(review);

        recalculateBorrowerRating(borrowing.getMember().getMemberId());
    }

    private void recalculateBorrowerRating(UUID borrowerId) {
        double avg = borrowerReviewRepository.findAverageScoreByBorrowerId(borrowerId);
        var member = memberRepository.findById(borrowerId).orElseThrow();
        member.setBorrowerRating(java.math.BigDecimal.valueOf(avg).setScale(2, java.math.RoundingMode.HALF_UP));
        memberRepository.save(member);
    }
}
