package com.projet.cabinet.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "preferences_notification")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PreferenceNotification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    private user user;

    // Délai de rappel en heures avant le rendez-vous (24 = 1 jour, 168 = 1 semaine)
    @Column(name = "delai_rappel_heures")
    @Builder.Default
    private Integer delaiRappelHeures = 24; // Par défaut: 1 jour avant

    // Activer/désactiver les rappels email
    @Column(name = "email_actif")
    @Builder.Default
    private Boolean emailActif = true;

    // Activer/désactiver les notifications internes
    @Column(name = "notification_interne_active")
    @Builder.Default
    private Boolean notificationInterneActive = true;

    // Email personnalisé (si différent de user.email)
    @Column(name = "email_personnalise")
    private String emailPersonnalise;
}
