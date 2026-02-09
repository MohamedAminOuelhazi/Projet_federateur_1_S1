package com.projet.cabinet.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.projet.cabinet.Entity.Paiement;

public interface PaiementRepository extends JpaRepository<Paiement, Long> {
}
