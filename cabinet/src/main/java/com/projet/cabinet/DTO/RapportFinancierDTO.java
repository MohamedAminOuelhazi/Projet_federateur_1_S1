package com.projet.cabinet.DTO;

import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RapportFinancierDTO {
    private Double totalFactures;
    private Double totalPaye;
    private Double totalEnAttente;
    private Long nombreFactures;
    private Long nombreFacturesPayees;
    private Long nombreFacturesEnAttente;
    private LocalDate periodeDebut;
    private LocalDate periodeFin;
}
