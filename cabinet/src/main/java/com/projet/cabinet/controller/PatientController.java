package com.projet.cabinet.controller;

import com.projet.cabinet.DTO.PatientDTO;
import com.projet.cabinet.DTO.RegisterDto;
import com.projet.cabinet.Entity.Patient;
import com.projet.cabinet.Entity.user;
import com.projet.cabinet.Service.PatientService;
import com.projet.cabinet.Service.UserService;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
public class PatientController {

    @Autowired
    PatientService patientService;

    @Autowired
    UserService userService;

    @GetMapping("/get/{id}")
    public ResponseEntity<PatientDTO> get(@PathVariable Long id) {
        return ResponseEntity.ok(patientService.getPatient(id));
    }

    @GetMapping("/allPatients")
    public ResponseEntity<List<PatientDTO>> list() {
        return ResponseEntity.ok(patientService.getAllPatients());
    }

    /**
     * Récupérer liste simplifiée des patients (id, nom, prenom)
     * Pour les sélecteurs frontend
     */
    @GetMapping("/liste")
    public ResponseEntity<List<PatientDTO>> getListePatients() {
        return ResponseEntity.ok(patientService.getAllPatients());
    }

    /**
     * Récupérer les patients liés à un assistant (via rendez-vous créés)
     * Pour les assistants qui doivent créer des factures
     */
    @GetMapping("/mes-patients")
    public ResponseEntity<List<PatientDTO>> getMesPatientsAssistant() {
        return ResponseEntity.ok(patientService.getPatientsForCurrentAssistant());
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<PatientDTO> update(@PathVariable Long id, @Valid @RequestBody PatientDTO dto) {
        return ResponseEntity.ok(patientService.updatePatient(id, dto));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        patientService.deletePatient(id);
        return ResponseEntity.noContent().build();
    }
}
