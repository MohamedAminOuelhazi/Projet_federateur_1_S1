package com.projet.cabinet.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.projet.cabinet.DTO.RendezVousDTO;
import com.projet.cabinet.DTO.RendezVousSimpleDTO;
import com.projet.cabinet.DTO.TimeSlotDTO;
import com.projet.cabinet.Service.RendezVousService;

// Removed unused import

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/rendezvous")
@RequiredArgsConstructor
public class RendezVousController {

    @Autowired
    RendezVousService rdvService;

    @PostMapping("/assistants/{assistantId}/patients/{patientId}/rdv")
    public ResponseEntity<RendezVousDTO> createRDV(
            @PathVariable Long assistantId,
            @PathVariable Long patientId,
            @RequestBody RendezVousDTO dto) {

        return ResponseEntity.ok(rdvService.createRdv(assistantId, patientId, dto));
    }

    @PatchMapping("/assistants/rdv/{id}")
    public ResponseEntity<RendezVousDTO> updateRDV(
            @PathVariable Long id,
            @RequestBody RendezVousDTO dto) {

        return ResponseEntity.ok(rdvService.updateRdv(id, dto));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<RendezVousDTO>> forPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(rdvService.getRdvsByPatient(patientId));
    }

    @GetMapping("/patient/{patientId}/simple")
    @PreAuthorize("hasAnyRole('MEDECIN', 'ASSISTANT')")
    public ResponseEntity<List<RendezVousSimpleDTO>> getRendezVousSimpleByPatient(@PathVariable Long patientId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean isAssistant = authentication.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ASSISTANT"));

        if (isAssistant) {
            // L'assistant ne voit que ses rendez-vous
            String username = authentication.getName();
            return ResponseEntity.ok(rdvService.getRendezVousSimpleByPatientAndAssistant(patientId, username));
        } else {
            // Le médecin voit tous les rendez-vous du patient
            return ResponseEntity.ok(rdvService.getRendezVousSimpleByPatient(patientId));
        }
    }

    @GetMapping("/assistants/{assistantId}")
    public ResponseEntity<List<RendezVousDTO>> getByAssistant(@PathVariable Long assistantId) {
        return ResponseEntity.ok(rdvService.getRdvsByAssistant(assistantId));
    }

    @GetMapping("/medecin/{medecinId}")
    public ResponseEntity<List<RendezVousDTO>> getForMedecin(
            @PathVariable Long medecinId,
            @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) LocalDate to) {

        // if no range provided, return all
        if (from == null)
            from = LocalDate.MIN;
        if (to == null)
            to = LocalDate.MAX;

        return ResponseEntity.ok(rdvService.getRdvsForMedecin(medecinId, from, to));
    }

    @GetMapping("/me")
    public ResponseEntity<List<RendezVousDTO>> getMyRdvs(Authentication auth) {
        return ResponseEntity.ok(rdvService.getMyRdvs(auth));
    }

    @GetMapping("/me/upcoming")
    public ResponseEntity<List<RendezVousDTO>> getMyUpcomingRdvs(Authentication auth,
            @RequestParam(defaultValue = "30") int daysAhead) {
        return ResponseEntity.ok(rdvService.getUpcomingRdvsForUser(auth, daysAhead));
    }

    @GetMapping("/medecin/{medecinId}/slots-disponibles")
    public ResponseEntity<List<TimeSlotDTO>> getAvailableSlots(
            @PathVariable Long medecinId,
            @RequestParam @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(rdvService.getAvailableSlots(medecinId, date));
    }

    @DeleteMapping("/assistants/rdv/{id}")
    public ResponseEntity<Void> cancelRDV(@PathVariable Long id) {
        rdvService.cancelRdv(id);
        return ResponseEntity.noContent().build();
    }

}
