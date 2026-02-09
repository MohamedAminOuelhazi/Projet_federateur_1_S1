package com.projet.cabinet.DTO;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TraitementSimpleDTO {
    private String medicament;
    private String dosage;
    private String duree;
    private String instructions;
}
