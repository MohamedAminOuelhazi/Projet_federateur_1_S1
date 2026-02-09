package com.projet.cabinet.Service;

import com.projet.cabinet.DTO.NotificationDTO;
import com.projet.cabinet.Entity.Notification;
import com.projet.cabinet.Entity.user;
import com.projet.cabinet.Repository.NotificationRepository;
import com.projet.cabinet.Repository.userRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final userRepo userRepository;

    @Override
    public NotificationDTO createNotification(NotificationDTO dto) {
        Notification notification = new Notification();
        notification.setTitre(dto.getTitre());
        notification.setMessage(dto.getMessage());
        notification.setType(dto.getType() != null ? dto.getType() : "INFO");
        notification.setCanal("INTERNE"); // Notification interne par défaut
        notification.setLu(false);
        notification.setDateEnvoi(LocalDateTime.now());
        notification.setRendezVousId(dto.getRendezVousId());
        notification.setDossierId(dto.getDossierId());
        notification.setPatientId(dto.getPatientId());

        if (dto.getUserId() != null) {
            user destinataire = userRepository.findById(dto.getUserId())
                    .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
            notification.setUser(destinataire);
        }

        Notification saved = notificationRepository.save(notification);
        return mapToDTO(saved);
    }

    @Override
    public List<NotificationDTO> getMyNotifications(Long userId) {
        return notificationRepository.findByUserIdAndCanalOrderByDateEnvoiDesc(userId, "INTERNE")
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<NotificationDTO> getUnreadNotifications(Long userId) {
        return notificationRepository.findByUserIdAndCanalAndLuOrderByDateEnvoiDesc(userId, "INTERNE", false)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public long countUnreadNotifications(Long userId) {
        return notificationRepository.countByUserIdAndCanalAndLu(userId, "INTERNE", false);
    }

    @Override
    public NotificationDTO markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification introuvable"));
        notification.setLu(true);
        Notification updated = notificationRepository.save(notification);
        return mapToDTO(updated);
    }

    @Override
    public void markAllAsRead(Long userId) {
        List<Notification> notifications = notificationRepository
                .findByUserIdAndCanalAndLuOrderByDateEnvoiDesc(userId, "INTERNE", false);
        notifications.forEach(n -> n.setLu(true));
        notificationRepository.saveAll(notifications);
    }

    @Override
    public void deleteNotification(Long notificationId) {
        notificationRepository.deleteById(notificationId);
    }

    private NotificationDTO mapToDTO(Notification notification) {
        return NotificationDTO.builder()
                .id(notification.getId())
                .titre(notification.getTitre())
                .message(notification.getMessage())
                .type(notification.getType())
                .lu(notification.isLu())
                .dateEnvoi(notification.getDateEnvoi())
                .rendezVousId(notification.getRendezVousId())
                .dossierId(notification.getDossierId())
                .patientId(notification.getPatientId())
                .userId(notification.getUser() != null ? notification.getUser().getId() : null)
                .build();
    }
}
