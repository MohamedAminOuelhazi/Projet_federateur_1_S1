package com.projet.cabinet.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.projet.cabinet.Entity.Medecin;

public interface MedecinRepository extends JpaRepository<Medecin, Long> {
}
