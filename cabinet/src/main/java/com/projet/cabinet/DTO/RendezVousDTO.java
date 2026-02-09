package com.projet.cabinet.DTO;

import lombok.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RendezVousDTO {
    private Long id;

    @NotNull
    private LocalDateTime dateHeure;

    private String statut;
    private String motif;
    private LocalDateTime dateCreation;

    @NotNull
    private Long assistantId;
    private Long patientId;
    private Long medecinId;

    // Noms pour l'affichage
    private String nomPatient;
    private String prenomPatient;
    private String nomMedecin;
    private String prenomMedecin;
    private String nomAssistant;
    private String prenomAssistant;
}
