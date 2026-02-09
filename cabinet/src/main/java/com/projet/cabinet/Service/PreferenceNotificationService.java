package com.projet.cabinet.Service;

import com.projet.cabinet.DTO.PreferenceNotificationDTO;
import com.projet.cabinet.Entity.PreferenceNotification;
import com.projet.cabinet.Entity.user;
import com.projet.cabinet.Repository.PreferenceNotificationRepository;
import com.projet.cabinet.Repository.userRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PreferenceNotificationService {

    private final PreferenceNotificationRepository preferenceRepository;
    private final userRepo userRepository;

    /**
     * Récupérer les préférences d'un utilisateur (créer par défaut si n'existe pas)
     */
    @Transactional
    public PreferenceNotificationDTO getPreferences(Long userId) {
        PreferenceNotification preference = preferenceRepository.findByUserId(userId)
                .orElseGet(() -> {
                    user usr = userRepository.findById(userId)
                            .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

                    PreferenceNotification newPref = PreferenceNotification.builder()
                            .user(usr)
                            .delaiRappelHeures(24) // Par défaut: 1 jour
                            .emailActif(true)
                            .notificationInterneActive(true)
                            .build();

                    return preferenceRepository.save(newPref);
                });

        return toDTO(preference);
    }

    /**
     * Mettre à jour les préférences
     */
    @Transactional
    public PreferenceNotificationDTO updatePreferences(Long userId, PreferenceNotificationDTO dto) {
        PreferenceNotification preference = preferenceRepository.findByUserId(userId)
                .orElseGet(() -> {
                    user usr = userRepository.findById(userId)
                            .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

                    return PreferenceNotification.builder()
                            .user(usr)
                            .build();
                });

        // Mettre à jour les champs
        if (dto.getDelaiRappelHeures() != null) {
            preference.setDelaiRappelHeures(dto.getDelaiRappelHeures());
        }
        if (dto.getEmailActif() != null) {
            preference.setEmailActif(dto.getEmailActif());
        }
        if (dto.getNotificationInterneActive() != null) {
            preference.setNotificationInterneActive(dto.getNotificationInterneActive());
        }
        if (dto.getEmailPersonnalise() != null) {
            preference.setEmailPersonnalise(dto.getEmailPersonnalise());
        }

        PreferenceNotification saved = preferenceRepository.save(preference);
        return toDTO(saved);
    }

    /**
     * Convertir entité vers DTO
     */
    private PreferenceNotificationDTO toDTO(PreferenceNotification entity) {
        return PreferenceNotificationDTO.builder()
                .id(entity.getId())
                .userId(entity.getUser().getId())
                .delaiRappelHeures(entity.getDelaiRappelHeures())
                .emailActif(entity.getEmailActif())
                .notificationInterneActive(entity.getNotificationInterneActive())
                .emailPersonnalise(entity.getEmailPersonnalise())
                .build();
    }
}
