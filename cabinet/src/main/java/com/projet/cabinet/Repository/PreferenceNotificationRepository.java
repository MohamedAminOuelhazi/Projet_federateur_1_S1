package com.projet.cabinet.Repository;

import com.projet.cabinet.Entity.PreferenceNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PreferenceNotificationRepository extends JpaRepository<PreferenceNotification, Long> {

    Optional<PreferenceNotification> findByUserId(Long userId);

    boolean existsByUserId(Long userId);
}
