package com.projet.cabinet.DTO;

import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FactureDTO {
    private Long id;
    private String numero;
    private LocalDate dateEmission;
    private Double montantTotal;
    private String statut;
    private Long patientId;
    private String patientNom;
    private String patientPrenom;
    private String patientEmail;
    private Long rendezVousId;
    private String rendezVousMotif;
    private String rendezVousDate;
    private List<PaiementDTO> paiements;
}
