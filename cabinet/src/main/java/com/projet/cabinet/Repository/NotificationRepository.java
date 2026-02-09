package com.projet.cabinet.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.projet.cabinet.Entity.Notification;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserIdAndCanalOrderByDateEnvoiDesc(Long userId, String canal);

    List<Notification> findByUserIdAndCanalAndLuOrderByDateEnvoiDesc(Long userId, String canal, boolean lu);

    long countByUserIdAndCanalAndLu(Long userId, String canal, boolean lu);
}
