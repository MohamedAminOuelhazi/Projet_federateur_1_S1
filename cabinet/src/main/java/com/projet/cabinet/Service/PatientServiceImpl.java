package com.projet.cabinet.Service;

import com.projet.cabinet.DTO.PatientDTO;
import com.projet.cabinet.Entity.Patient;
import com.projet.cabinet.Entity.RendezVous;
import com.projet.cabinet.Entity.Assistant;
import com.projet.cabinet.Entity.user;
import com.projet.cabinet.Repository.PatientRepository;
import com.projet.cabinet.Repository.RendezVousRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PatientServiceImpl implements PatientService {

    private final PatientRepository patientRepository;
    private final RendezVousRepository rendezVousRepository;

    @Override
    public PatientDTO getPatient(Long id) {
        Patient p = patientRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Patient not found"));
        return toDTO(p);
    }

    @Override
    public List<PatientDTO> getAllPatients() {
        return patientRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public PatientDTO updatePatient(Long id, PatientDTO dto) {
        Patient p = patientRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Patient not found"));
        p.setNom(dto.getNom());
        p.setPrenom(dto.getPrenom());
        p.setTelephone(dto.getTelephone());
        p.setDateNaissance(dto.getDateNaissance());
        // email changes with checks omitted for brevity
        return toDTO(patientRepository.save(p));
    }

    @Override
    public void deletePatient(Long id) {
        patientRepository.deleteById(id);
    }

    @Override
    public List<PatientDTO> getPatientsForCurrentAssistant() {
        // Récupérer l'utilisateur connecté
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!(principal instanceof UserDetails)) {
            throw new IllegalStateException("Utilisateur non authentifié");
        }

        String username = ((UserDetails) principal).getUsername();

        System.out.println("========== DEBUG PATIENTS FOR ASSISTANT ==========");
        System.out.println("Assistant username: " + username);

        // Récupérer l'assistant (via UserService ou directement depuis le contexte)
        // Pour simplifier, on suppose que l'username nous permet de trouver l'assistant
        // On récupère tous les rendez-vous créés par cet assistant
        List<RendezVous> rdvs = rendezVousRepository.findAll().stream()
                .filter(rdv -> rdv.getAssistantCree() != null &&
                        rdv.getAssistantCree().getUsername().equals(username))
                .collect(Collectors.toList());

        System.out.println("RDVs created by assistant: " + rdvs.size());

        // Extraire les patients uniques
        List<PatientDTO> patients = rdvs.stream()
                .map(RendezVous::getPatient)
                .distinct()
                .map(this::toDTO)
                .collect(Collectors.toList());

        System.out.println("Unique patients for assistant: " + patients.size());
        System.out.println("Patient IDs: " + patients.stream().map(PatientDTO::getId).collect(Collectors.toList()));
        System.out.println("==================================================");

        return patients;
    }

    private PatientDTO toDTO(Patient p) {
        return PatientDTO.builder()
                .id(p.getId())
                .username(p.getUsername())
                .nom(p.getNom())
                .prenom(p.getPrenom())
                .email(p.getEmail())
                .telephone(p.getTelephone())
                .dateNaissance(p.getDateNaissance())
                .build();
    }
}
