package com.projet.cabinet.Service;

import com.projet.cabinet.DTO.NotificationDTO;
import java.util.List;

public interface NotificationService {
    NotificationDTO createNotification(NotificationDTO dto);

    List<NotificationDTO> getMyNotifications(Long userId);

    List<NotificationDTO> getUnreadNotifications(Long userId);

    long countUnreadNotifications(Long userId);

    NotificationDTO markAsRead(Long notificationId);

    void markAllAsRead(Long userId);

    void deleteNotification(Long notificationId);
}
