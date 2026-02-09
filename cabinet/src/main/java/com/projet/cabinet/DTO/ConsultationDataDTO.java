package com.projet.cabinet.DTO;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConsultationDataDTO {
    private String date; // Format: dd/MM/yyyy
    private String motifConsultation;
    private String symptomes;
    private String diagnostic;
    private List<TraitementSimpleDTO> traitements;
    private String recommandations;
}
