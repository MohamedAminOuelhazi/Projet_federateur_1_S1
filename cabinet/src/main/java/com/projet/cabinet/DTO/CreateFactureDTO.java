package com.projet.cabinet.DTO;

import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateFactureDTO {
    private Long patientId;
    private Long rendezVousId;
    private Double montantTotal;
    private String description;
}
