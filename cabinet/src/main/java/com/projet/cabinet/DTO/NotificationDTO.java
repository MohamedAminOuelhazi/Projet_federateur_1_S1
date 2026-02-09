package com.projet.cabinet.DTO;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationDTO {
    private Long id;
    private String titre;
    private String message;
    private String type;
    private String canal;
    private String destinataire;
    private boolean lu;
    private LocalDateTime dateEnvoi;
    private Long rendezVousId;
    private Long dossierId;
    private Long patientId;
    private Long userId;
}
