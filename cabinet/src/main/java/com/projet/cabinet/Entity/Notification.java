package com.projet.cabinet.Entity;

import lombok.*;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type; // ex: "RAPPEL", "INFO", "SUCCESS", "WARNING", "ERROR", "RENDEZ_VOUS", "DOSSIER"

    private String canal; // ex: "EMAIL", "SMS", "INTERNE" (pour notifications dans l'app)

    private String destinataire; // email ou numéro pour EMAIL/SMS

    @Lob
    private String message;

    private String titre; // Titre de la notification (pour notifications internes)

    @Builder.Default
    @Column(nullable = false)
    private boolean lu = false; // Pour marquer comme lue (notifications internes)

    private LocalDateTime dateEnvoi;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rendezvous_id")
    private RendezVous rendezVous;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private user user; // Utilisateur destinataire (pour notifications internes)

    // Liens optionnels vers d'autres entités (IDs stockés directement)
    private Long rendezVousId;
    private Long dossierId;
    private Long patientId;
}
