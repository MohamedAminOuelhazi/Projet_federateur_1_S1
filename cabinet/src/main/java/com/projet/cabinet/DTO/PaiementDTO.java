package com.projet.cabinet.DTO;

import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaiementDTO {
    private Long id;
    private LocalDate datePaiement;
    private Double montant;
    private String methode;
    private Long factureId;
}
