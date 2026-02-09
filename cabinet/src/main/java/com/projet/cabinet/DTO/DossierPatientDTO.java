package com.projet.cabinet.DTO;

import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DossierPatientDTO {
    private Long id;
    private LocalDate dateCreation;
    private String description;
    private String motifConsultation;
    private String symptomes;
    private String diagnostic;
    private String traitement; // JSON array of medications
    private String observations;
    private String recommandations;
    private Long patientId;
    private String patientNom;
    private String patientPrenom;
    private Long medecinId;
    private String medecinNom;
    private String medecinPrenom;
    private Long rendezVousId;
    private List<DocumentDTO> documents;
}
