package com.projet.cabinet.DTO;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RendezVousSimpleDTO {
    private Long id;
    private LocalDateTime dateHeure;
    private String motif;
    private String statut;
    private Long patientId;
    private String patientNom;
    private String patientPrenom;
}
