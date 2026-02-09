package com.projet.cabinet.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.projet.cabinet.Entity.RendezVous;

import java.time.LocalDateTime;
import java.util.List;

public interface RendezVousRepository extends JpaRepository<RendezVous, Long> {

    List<RendezVous> findByMedecinIdAndDateHeureBetween(Long medecinId, LocalDateTime from, LocalDateTime to);

    List<RendezVous> findByAssistantCreeId(Long assistantId);

    List<RendezVous> findByPatientId(Long patientId);

    List<RendezVous> findByMedecinId(Long medecinId);

    // Recherche entre deux dates pour médecin (utiliser LocalDateTime)
    // (there is already findByMedecinIdAndDateHeureBetween above)

    // Futurs rendez-vous (après une dateHeure)
    List<RendezVous> findByDateHeureAfter(LocalDateTime from);

    List<RendezVous> findByPatientIdAndDateHeureAfter(Long patientId, LocalDateTime from);

    List<RendezVous> findByMedecinIdAndDateHeureAfter(Long medecinId, LocalDateTime from);

    List<RendezVous> findByAssistantCreeIdAndDateHeureAfter(Long assistantId, LocalDateTime from);
}
