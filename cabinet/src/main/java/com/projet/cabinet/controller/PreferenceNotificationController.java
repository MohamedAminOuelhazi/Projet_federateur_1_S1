package com.projet.cabinet.controller;

import com.projet.cabinet.DTO.PreferenceNotificationDTO;
import com.projet.cabinet.Service.PreferenceNotificationService;
import com.projet.cabinet.Repository.userRepo;
import com.projet.cabinet.Entity.user;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/preferences")
@RequiredArgsConstructor
public class PreferenceNotificationController {

    private final PreferenceNotificationService preferenceService;
    private final userRepo userRepository;

    /**
     * Récupérer mes préférences de notification
     */
    @GetMapping("/me")
    public ResponseEntity<PreferenceNotificationDTO> getMyPreferences(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String username = authentication.getName();
        user currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        PreferenceNotificationDTO preferences = preferenceService.getPreferences(currentUser.getId());
        return ResponseEntity.ok(preferences);
    }

    /**
     * Mettre à jour mes préférences
     */
    @PutMapping("/me")
    public ResponseEntity<PreferenceNotificationDTO> updateMyPreferences(
            @RequestBody PreferenceNotificationDTO dto,
            Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String username = authentication.getName();
        user currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        PreferenceNotificationDTO updated = preferenceService.updatePreferences(currentUser.getId(), dto);
        return ResponseEntity.ok(updated);
    }
}
