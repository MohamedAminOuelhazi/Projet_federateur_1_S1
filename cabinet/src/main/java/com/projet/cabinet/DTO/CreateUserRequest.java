package com.projet.cabinet.DTO;

import lombok.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateUserRequest {
    @NotBlank
    private String username;
    @NotBlank
    private String motDePasse;
    @Email
    @NotBlank
    private String email;
    private String nom;
    private String prenom;
    private String telephone;
    private String role;
}
