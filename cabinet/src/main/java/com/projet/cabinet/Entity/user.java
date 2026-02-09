package com.projet.cabinet.Entity;

import lombok.*;

import jakarta.persistence.*;
import java.io.Serializable;
import java.time.OffsetDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "user_type")
@NoArgsConstructor
@AllArgsConstructor
public abstract class user implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 100)
    private String username;

    private String nom;
    private String prenom;

    @Column(unique = true, nullable = false, length = 255)
    private String email;

    @Column(name = "mot_de_passe", nullable = false)
    private String motDePasse; // stocker hashed (BCrypt) en service

    private String telephone;

    @Column(name = "user_type", insertable = false, updatable = false)
    private String usertype; // valeur automatique par Discriminator

    private String dateNaissance; // Date de naissance (format String pour flexibilité)

    private OffsetDateTime dateCreation;
}
