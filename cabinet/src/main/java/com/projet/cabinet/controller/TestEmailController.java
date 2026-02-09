package com.projet.cabinet.controller;

import com.projet.cabinet.Service.NotificationEmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller temporaire pour tester l'envoi de rappels manuellement
 * À SUPPRIMER en production
 */
@RestController
@RequestMapping("/api/test")
@RequiredArgsConstructor
public class TestEmailController {

    private final NotificationEmailService notificationEmailService;

    @PostMapping("/send-reminders")
    public ResponseEntity<String> testSendReminders() {
        notificationEmailService.sendScheduledReminders();
        return ResponseEntity.ok("✅ Rappels envoyés ! Vérifiez les logs et vos emails.");
    }
}
