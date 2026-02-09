package com.projet.cabinet.Service;

import com.projet.cabinet.DTO.DossierPatientDTO;
import com.projet.cabinet.DTO.DocumentDTO;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public interface DossierPatientService {
    DossierPatientDTO createDossier(DossierPatientDTO dto);

    DossierPatientDTO getDossier(Long id);

    List<DossierPatientDTO> getByPatient(Long patientId);

    DossierPatientDTO getByRdv(Long rdvId);

    DossierPatientDTO updateDossier(Long id, DossierPatientDTO dto);

    DocumentDTO addDocument(Long dossierId, MultipartFile file) throws Exception;

    byte[] downloadDocument(Long documentId) throws Exception;

    List<DocumentDTO> listDocuments(Long dossierId);

    // Récupérer les dossiers de l'utilisateur connecté (pour les patients)
    List<DossierPatientDTO> getDossiersForCurrentUser();
}
