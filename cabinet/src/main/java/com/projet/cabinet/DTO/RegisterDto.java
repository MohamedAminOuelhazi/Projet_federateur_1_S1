package com.projet.cabinet.DTO;

import java.sql.Date;
import java.time.LocalDate;

import lombok.Data;

@Data
public class RegisterDto {

    private String firstname;
    private String lastname;
    private String username;
    private String email;
    private String password;

    private Boolean active;
    private String specialite;
    private Date dateNaissance;
}
