package com.projet.cabinet.DTO;

import lombok.*;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {
    private Long id;

    @NotBlank
    private String username;

    private String nom;
    private String prenom;

    @Email
    @NotBlank
    private String email;

    private String telephone;
    private String usertype;
    private String dateNaissance;
    private String dateCreation;

    // Champs spécifiques au médecin
    private String specialite;
    private String description;
    private String photoUrl;
}
