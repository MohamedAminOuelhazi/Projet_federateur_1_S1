package com.projet.cabinet.controller;

import com.projet.cabinet.DTO.FactureDTO;
import com.projet.cabinet.DTO.CreateFactureDTO;
import com.projet.cabinet.DTO.RapportFinancierDTO;
import com.projet.cabinet.DTO.PaiementDTO;
import com.projet.cabinet.Service.FactureService;
import com.projet.cabinet.Service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/factures")
@CrossOrigin("*")
public class FactureController {

    @Autowired
    private FactureService factureService;

    @Autowired
    private PatientService patientService;

    /**
     * Créer une facture (Assistant ou Médecin)
     * Si l'utilisateur est un assistant, on vérifie qu'il a une relation avec le
     * patient
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('ASSISTANT', 'MEDECIN')")
    public ResponseEntity<?> createFacture(@RequestBody CreateFactureDTO dto) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            boolean isAssistant = authentication.getAuthorities().stream()
                    .anyMatch(auth -> auth.getAuthority().equals("ROLE_ASSISTANT"));

            // Si c'est un assistant, vérifier qu'il peut créer une facture pour ce patient
            if (isAssistant) {
                List<Long> patientIds = patientService.getPatientsForCurrentAssistant()
                        .stream()
                        .map(p -> p.getId())
                        .toList();

                if (!patientIds.contains(dto.getPatientId())) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body("Vous ne pouvez créer des factures que pour vos patients liés");
                }
            }

            FactureDTO facture = factureService.createFacture(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(facture);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    /**
     * Récupérer toutes les factures (Médecin ou Assistant)
     * Si l'utilisateur est un assistant, il ne voit que les factures de ses
     * patients
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('MEDECIN', 'ASSISTANT')")
    public ResponseEntity<List<FactureDTO>> getAllFactures() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        boolean isAssistant = authentication.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ASSISTANT"));

        System.out.println("========== DEBUG FACTURES ==========");
        System.out.println("Username: " + username);
        System.out.println("Is Assistant: " + isAssistant);
        System.out.println("Authorities: " + authentication.getAuthorities());

        List<FactureDTO> factures;
        if (isAssistant) {
            // L'assistant ne voit que les factures liées aux rendez-vous qu'il a créés
            factures = factureService.getFacturesForCurrentAssistant();
            System.out.println("Factures count for assistant: " + factures.size());
        } else {
            // Le médecin voit toutes les factures
            factures = factureService.getAllFactures();
            System.out.println("Factures count for médecin: " + factures.size());
        }
        System.out.println("====================================");

        return ResponseEntity.ok(factures);
    }

    /**
     * Récupérer une facture par ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<FactureDTO> getFactureById(@PathVariable Long id) {
        try {
            FactureDTO facture = factureService.getFacture(id);
            return ResponseEntity.ok(facture);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Récupérer les factures d'un patient
     */
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<FactureDTO>> getFacturesByPatient(@PathVariable Long patientId) {
        List<FactureDTO> factures = factureService.getFacturesByPatient(patientId);
        return ResponseEntity.ok(factures);
    }

    /**
     * Marquer une facture comme payée (Assistant ou Médecin)
     */
    @PatchMapping("/{id}/payer")
    @PreAuthorize("hasAnyRole('ASSISTANT', 'MEDECIN')")
    public ResponseEntity<FactureDTO> marquerCommePaye(
            @PathVariable Long id,
            @RequestBody PaiementDTO paiementDTO) {
        try {
            FactureDTO facture = factureService.markFacturePaid(id, paiementDTO);
            return ResponseEntity.ok(facture);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * Supprimer une facture (Médecin uniquement)
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('MEDECIN')")
    public ResponseEntity<Void> deleteFacture(@PathVariable Long id) {
        try {
            factureService.deleteFacture(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Obtenir le rapport financier (Médecin uniquement)
     */
    @GetMapping("/rapports")
    @PreAuthorize("hasRole('MEDECIN')")
    public ResponseEntity<RapportFinancierDTO> getRapportFinancier(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate debut,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fin) {

        // Par défaut: 30 derniers jours si pas de dates
        if (debut == null && fin == null) {
            fin = LocalDate.now();
            debut = fin.minusDays(30);
        }

        RapportFinancierDTO rapport = factureService.getRapportFinancier(debut, fin);
        return ResponseEntity.ok(rapport);
    }
}
