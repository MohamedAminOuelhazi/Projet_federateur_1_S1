package com.projet.cabinet.Service;

import java.time.LocalDate;
import java.util.List;

import com.projet.cabinet.DTO.FactureDTO;
import com.projet.cabinet.DTO.CreateFactureDTO;
import com.projet.cabinet.DTO.RapportFinancierDTO;
import com.projet.cabinet.DTO.PaiementDTO;

public interface FactureService {

    FactureDTO createFacture(CreateFactureDTO dto);

    FactureDTO getFacture(Long id);

    List<FactureDTO> getAllFactures();

    List<FactureDTO> getFacturesByPatient(Long patientId);

    FactureDTO markFacturePaid(Long factureId, PaiementDTO paiementDTO);

    void deleteFacture(Long id);

    RapportFinancierDTO getRapportFinancier(LocalDate debut, LocalDate fin);

    // Retourne le montant total d'une facture (utilisé par le service de paiement)
    Double getFactureAmount(Long factureId);

    // Récupérer les factures par liste d'IDs de patients (pour les assistants)
    List<FactureDTO> getFacturesByPatientIds(List<Long> patientIds);

    // Récupérer les factures pour l'assistant connecté (filtrées par rendez-vous
    // créés)
    List<FactureDTO> getFacturesForCurrentAssistant();
}
