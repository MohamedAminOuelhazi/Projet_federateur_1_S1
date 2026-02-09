package com.projet.cabinet.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.core.Authentication;

import com.projet.cabinet.DTO.RendezVousDTO;
import com.projet.cabinet.DTO.RendezVousSimpleDTO;
import com.projet.cabinet.DTO.TimeSlotDTO;

public interface RendezVousService {

    RendezVousDTO createRdv(Long assistantId, Long patientId, RendezVousDTO dto);

    RendezVousDTO updateRdv(Long rdvId, RendezVousDTO dto);

    void cancelRdv(Long rdvId);

    // Lecture simple
    List<RendezVousDTO> getRdvsByAssistant(Long assistantId);

    // Lecture pour patient (tous)
    List<RendezVousDTO> getRdvsByPatient(Long patientId);

    // Récupérer les rendez-vous d'un patient (version simplifiée pour sélecteur)
    List<RendezVousSimpleDTO> getRendezVousSimpleByPatient(Long patientId);

    // Récupérer les rendez-vous simples d'un patient créés par un assistant
    // spécifique
    List<RendezVousSimpleDTO> getRendezVousSimpleByPatientAndAssistant(Long patientId, String assistantUsername);

    // Lecture pour médecin (entre dates)
    List<RendezVousDTO> getRdvsForMedecin(Long medecinId, LocalDate from, LocalDate to);

    // Lecture pour l'utilisateur connecté (me)
    List<RendezVousDTO> getMyRdvs(Authentication auth);

    // Récupérer RDV à venir (par ex. prochains 30 jours)
    List<RendezVousDTO> getUpcomingRdvsForUser(Authentication auth, int daysAhead);

    // Récupérer les créneaux disponibles pour un médecin à une date donnée
    List<TimeSlotDTO> getAvailableSlots(Long medecinId, LocalDate date);
}
