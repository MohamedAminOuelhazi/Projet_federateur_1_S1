package com.projet.cabinet.DTO;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedecinDTO {
    private Long id;
    private String username;
    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private String specialite;
    private String description;
    private String photoUrl;
}
