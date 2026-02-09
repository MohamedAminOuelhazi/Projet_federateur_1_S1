package com.projet.cabinet.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.projet.cabinet.Entity.Facture;

public interface FactureRepository extends JpaRepository<Facture, Long> {
    boolean existsByNumero(String numero);
}
