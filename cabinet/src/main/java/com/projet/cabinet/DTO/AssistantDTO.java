package com.projet.cabinet.DTO;

import com.projet.cabinet.Entity.Medecin;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssistantDTO {

    private Long id;
    private String username;
    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private Boolean active;

}
