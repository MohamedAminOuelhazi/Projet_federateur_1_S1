package com.projet.cabinet.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.projet.cabinet.Entity.Assistant;

import java.util.List;
import java.util.Optional;

public interface AssistantRepository extends JpaRepository<Assistant, Long> {
    List<Assistant> findByMedecinId(Long medecinId);

    @Query("SELECT a FROM Assistant a LEFT JOIN FETCH a.medecin WHERE a.id = :id")
    Optional<Assistant> findByIdWithMedecin(@Param("id") Long id);
}
