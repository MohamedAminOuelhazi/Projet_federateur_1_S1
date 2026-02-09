package com.projet.cabinet.Service;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.projet.cabinet.DTO.DossierPatientDTO;
import com.projet.cabinet.DTO.DocumentDTO;
import com.projet.cabinet.Entity.DossierPatient;
import com.projet.cabinet.Entity.Document;
import com.projet.cabinet.Entity.Patient;
import com.projet.cabinet.Repository.DossierPatientRepository;
import com.projet.cabinet.Repository.DocumentRepository;
import com.projet.cabinet.Repository.PatientRepository;

@Service
@Transactional
public class DossierPatientServiceImpl implements DossierPatientService {

    private final Path rootStorage = Path.of("uploads");

    @Autowired
    DossierPatientRepository dossierRepo;

    @Autowired
    PatientRepository patientRepo;

    @Autowired
    DocumentRepository documentRepo;

    @Override
    public DossierPatientDTO createDossier(DossierPatientDTO dto) {
        Patient p = patientRepo.findById(dto.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient introuvable"));

        DossierPatient d = new DossierPatient();
        d.setDateCreation(dto.getDateCreation() != null ? dto.getDateCreation() : LocalDate.now());
        d.setDescription(dto.getDescription());
        d.setPatient(p);

        DossierPatient saved = dossierRepo.save(d);
        return toDTO(saved);
    }

    @Override
    public DossierPatientDTO getDossier(Long id) {
        return dossierRepo.findById(id).map(this::toDTO).orElseThrow(() -> new RuntimeException("Dossier introuvable"));
    }

    @Override
    public List<DossierPatientDTO> getByPatient(Long patientId) {
        return dossierRepo.findByPatientId(patientId).stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public DossierPatientDTO getByRdv(Long rdvId) {
        DossierPatient d = dossierRepo.findByRendezVousId(rdvId);
        if (d == null)
            return null;
        return toDTO(d);
    }

    @Override
    public DossierPatientDTO updateDossier(Long id, DossierPatientDTO dto) {
        DossierPatient d = dossierRepo.findById(id).orElseThrow(() -> new RuntimeException("Dossier introuvable"));
        if (dto.getDescription() != null)
            d.setDescription(dto.getDescription());
        if (dto.getMotifConsultation() != null)
            d.setMotifConsultation(dto.getMotifConsultation());
        if (dto.getSymptomes() != null)
            d.setSymptomes(dto.getSymptomes());
        if (dto.getDiagnostic() != null)
            d.setDiagnostic(dto.getDiagnostic());
        if (dto.getTraitement() != null)
            d.setTraitement(dto.getTraitement());
        if (dto.getObservations() != null)
            d.setObservations(dto.getObservations());
        if (dto.getRecommandations() != null)
            d.setRecommandations(dto.getRecommandations());
        DossierPatient saved = dossierRepo.save(d);
        return toDTO(saved);
    }

    @Override
    public DocumentDTO addDocument(Long dossierId, MultipartFile file) throws Exception {
        DossierPatient d = dossierRepo.findById(dossierId)
                .orElseThrow(() -> new RuntimeException("Dossier introuvable"));

        if (!Files.exists(rootStorage))
            Files.createDirectories(rootStorage);

        Path dossierDir = rootStorage.resolve("dossier-" + dossierId);
        if (!Files.exists(dossierDir))
            Files.createDirectories(dossierDir);

        String storedName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path target = dossierDir.resolve(storedName);

        try (var in = file.getInputStream()) {
            Files.copy(in, target, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException ex) {
            throw new RuntimeException("Erreur sauvegarde fichier", ex);
        }

        Document doc = new Document();
        doc.setFilename(file.getOriginalFilename());
        doc.setContentType(file.getContentType());
        doc.setSize(file.getSize());
        doc.setPath(target.toString());
        doc.setUploadedAt(LocalDateTime.now());
        doc.setDossier(d);

        Document saved = documentRepo.save(doc);
        return toDTO(saved);
    }

    @Override
    public byte[] downloadDocument(Long documentId) throws Exception {
        Document doc = documentRepo.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document introuvable"));
        Path p = Path.of(doc.getPath());
        return Files.readAllBytes(p);
    }

    @Override
    public List<DocumentDTO> listDocuments(Long dossierId) {
        return documentRepo.findByDossierId(dossierId).stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<DossierPatientDTO> getDossiersForCurrentUser() {
        // Récupérer l'utilisateur connecté
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!(principal instanceof UserDetails)) {
            throw new IllegalStateException("Utilisateur non authentifié");
        }

        String username = ((UserDetails) principal).getUsername();
        System.out.println("========== DEBUG getDossiersForCurrentUser ==========");
        System.out.println("Patient username: " + username);

        // Trouver le patient par username
        Patient patient = patientRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Patient introuvable"));

        System.out.println("Patient ID: " + patient.getId());

        // Récupérer tous les dossiers de ce patient
        List<DossierPatientDTO> dossiers = dossierRepo.findByPatientId(patient.getId()).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());

        System.out.println("Dossiers trouvés: " + dossiers.size());
        System.out.println("======================================================");

        return dossiers;
    }

    private DossierPatientDTO toDTO(DossierPatient d) {
        DossierPatientDTO dto = new DossierPatientDTO();
        dto.setId(d.getId());
        dto.setDateCreation(d.getDateCreation());
        dto.setDescription(d.getDescription());
        dto.setMotifConsultation(d.getMotifConsultation());
        dto.setSymptomes(d.getSymptomes());
        dto.setDiagnostic(d.getDiagnostic());
        dto.setTraitement(d.getTraitement());
        dto.setObservations(d.getObservations());
        dto.setRecommandations(d.getRecommandations());
        dto.setPatientId(d.getPatient() != null ? d.getPatient().getId() : null);
        dto.setRendezVousId(d.getRendezVous() != null ? d.getRendezVous().getId() : null);
        dto.setDocuments(
                documentRepo.findByDossierId(d.getId()).stream().map(this::toDTO).collect(Collectors.toList()));
        return dto;
    }

    private DocumentDTO toDTO(Document doc) {
        DocumentDTO dto = new DocumentDTO();
        dto.setId(doc.getId());
        dto.setFilename(doc.getFilename());
        dto.setContentType(doc.getContentType());
        dto.setSize(doc.getSize());
        dto.setPath(doc.getPath());
        dto.setUploadedAt(doc.getUploadedAt());
        return dto;
    }
}
