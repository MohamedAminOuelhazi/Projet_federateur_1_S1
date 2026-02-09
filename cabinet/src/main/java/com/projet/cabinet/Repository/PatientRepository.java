package com.projet.cabinet.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.projet.cabinet.Entity.Patient;

public interface PatientRepository extends JpaRepository<Patient, Long> {
    Optional<Patient> findByUsername(String username);
}
