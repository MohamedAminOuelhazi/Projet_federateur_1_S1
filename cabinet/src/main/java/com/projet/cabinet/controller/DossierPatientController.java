package com.projet.cabinet.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.projet.cabinet.DTO.DossierPatientDTO;
import com.projet.cabinet.DTO.DocumentDTO;
import com.projet.cabinet.Service.DossierPatientService;

@RestController
@RequestMapping("/api/dossiers")
public class DossierPatientController {

    @Autowired
    DossierPatientService dossierService;

    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('PATIENT', 'MEDECIN', 'ASSISTANT')")
    public ResponseEntity<List<DossierPatientDTO>> getMyDossiers() {
        return ResponseEntity.ok(dossierService.getDossiersForCurrentUser());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DossierPatientDTO> get(@PathVariable Long id) {
        return ResponseEntity.ok(dossierService.getDossier(id));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<DossierPatientDTO>> listByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(dossierService.getByPatient(patientId));
    }

    @GetMapping("/rdv/{rdvId}")
    public ResponseEntity<DossierPatientDTO> byRdv(@PathVariable Long rdvId) {
        DossierPatientDTO d = dossierService.getByRdv(rdvId);
        if (d == null)
            return ResponseEntity.noContent().build();
        return ResponseEntity.ok(d);
    }

    @PostMapping
    public ResponseEntity<DossierPatientDTO> create(@RequestBody DossierPatientDTO dto) {
        return ResponseEntity.ok(dossierService.createDossier(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DossierPatientDTO> update(@PathVariable Long id, @RequestBody DossierPatientDTO dto) {
        return ResponseEntity.ok(dossierService.updateDossier(id, dto));
    }

    @PostMapping(path = "/{id}/files", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<DocumentDTO> upload(@PathVariable Long id, @RequestPart MultipartFile file) throws Exception {
        DocumentDTO doc = dossierService.addDocument(id, file);
        return ResponseEntity.ok(doc);
    }

    @GetMapping("/{dossierId}/files/{docId}")
    public ResponseEntity<byte[]> download(@PathVariable Long dossierId, @PathVariable Long docId) throws Exception {
        byte[] data = dossierService.downloadDocument(docId);
        DocumentDTO meta = dossierService.listDocuments(dossierId).stream().filter(d -> d.getId().equals(docId))
                .findFirst().orElse(null);
        if (meta == null)
            return ResponseEntity.notFound().build();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + meta.getFilename() + "\"")
                .contentType(MediaType.parseMediaType(meta.getContentType() != null ? meta.getContentType()
                        : MediaType.APPLICATION_OCTET_STREAM_VALUE))
                .body(data);
    }

    @GetMapping("/{dossierId}/files")
    public ResponseEntity<List<DocumentDTO>> listFiles(@PathVariable Long dossierId) {
        return ResponseEntity.ok(dossierService.listDocuments(dossierId));
    }
}
