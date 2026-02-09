package com.projet.cabinet.Repository;

import com.projet.cabinet.Entity.VerificationCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface VerificationCodeRepository extends JpaRepository<VerificationCode, Long> {

    Optional<VerificationCode> findByEmailAndCodeAndVerifiedFalse(String email, String code);

    Optional<VerificationCode> findTopByEmailAndVerifiedFalseOrderByCreatedAtDesc(String email);

    void deleteByExpiresAtBefore(LocalDateTime dateTime);

    void deleteByEmail(String email);
}
