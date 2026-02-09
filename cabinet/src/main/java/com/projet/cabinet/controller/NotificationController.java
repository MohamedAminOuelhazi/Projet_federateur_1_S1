package com.projet.cabinet.controller;

import com.projet.cabinet.DTO.NotificationDTO;
import com.projet.cabinet.Service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.projet.cabinet.Entity.user;
import com.projet.cabinet.Repository.userRepo;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final userRepo userRepository;

    private user getCurrentUser(Authentication auth) {
        if (auth == null || !auth.isAuthenticated())
            return null;
        String username = auth.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    @GetMapping("/me")
    public ResponseEntity<List<NotificationDTO>> getMyNotifications(Authentication auth) {
        user currentUser = getCurrentUser(auth);
        List<NotificationDTO> notifications = notificationService.getMyNotifications(currentUser.getId());
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/me/unread")
    public ResponseEntity<List<NotificationDTO>> getUnreadNotifications(Authentication auth) {
        user currentUser = getCurrentUser(auth);
        List<NotificationDTO> notifications = notificationService.getUnreadNotifications(currentUser.getId());
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/me/unread/count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(Authentication auth) {
        user currentUser = getCurrentUser(auth);
        long count = notificationService.countUnreadNotifications(currentUser.getId());
        return ResponseEntity.ok(Map.of("count", count));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<NotificationDTO> markAsRead(@PathVariable Long id) {
        NotificationDTO notification = notificationService.markAsRead(id);
        return ResponseEntity.ok(notification);
    }

    @PostMapping("/me/read-all")
    public ResponseEntity<Void> markAllAsRead(Authentication auth) {
        user currentUser = getCurrentUser(auth);
        notificationService.markAllAsRead(currentUser.getId());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public ResponseEntity<NotificationDTO> createNotification(@RequestBody NotificationDTO dto, Authentication auth) {
        user currentUser = getCurrentUser(auth);
        // Par défaut, créer une notification pour l'utilisateur courant
        if (dto.getUserId() == null) {
            dto.setUserId(currentUser.getId());
        }
        NotificationDTO created = notificationService.createNotification(dto);
        return ResponseEntity.ok(created);
    }
}
