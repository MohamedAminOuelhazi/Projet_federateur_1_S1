package com.projet.cabinet.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.projet.cabinet.DTO.FactureDTO;
import com.projet.cabinet.DTO.CreateFactureDTO;
import com.projet.cabinet.DTO.RapportFinancierDTO;
import com.projet.cabinet.DTO.PaiementDTO;
import com.projet.cabinet.Entity.Facture;
import com.projet.cabinet.Entity.Paiement;
import com.projet.cabinet.Entity.Patient;
import com.projet.cabinet.Entity.RendezVous;
import com.projet.cabinet.Repository.FactureRepository;
import com.projet.cabinet.Repository.PaiementRepository;
import com.projet.cabinet.Repository.PatientRepository;
import com.projet.cabinet.Repository.RendezVousRepository;

@Service
@Transactional
public class FactureServiceImpl implements FactureService {

    @Autowired
    FactureRepository factureRepository;

    @Autowired
    PatientRepository patientRepository;

    @Autowired
    PaiementRepository paiementRepository;

    @Autowired
    RendezVousRepository rendezVousRepository;

    @Autowired
    PatientService patientService;

    @Override
    public FactureDTO createFacture(CreateFactureDTO dto) {
        Patient patient = patientRepository.findById(dto.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient introuvable"));

        Facture f = new Facture();
        f.setNumero(generateNumero());
        f.setDateEmission(LocalDate.now());
        f.setMontantTotal(dto.getMontantTotal());
        f.setStatut("EN_ATTENTE");
        f.setPatient(patient);

        // Associer le rendez-vous si fourni
        if (dto.getRendezVousId() != null) {
            RendezVous rdv = rendezVousRepository.findById(dto.getRendezVousId())
                    .orElseThrow(() -> new RuntimeException("Rendez-vous introuvable"));
            f.setRendezVous(rdv);
        }

        Facture saved = factureRepository.save(f);

        return toDTO(saved);
    }

    @Override
    public FactureDTO getFacture(Long id) {
        return factureRepository.findById(id).map(this::toDTO)
                .orElseThrow(() -> new RuntimeException("Facture introuvable"));
    }

    @Override
    public List<FactureDTO> getAllFactures() {
        return factureRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Double getFactureAmount(Long factureId) {
        return factureRepository.findById(factureId)
                .map(Facture::getMontantTotal)
                .orElse(0.0);
    }

    @Override
    public List<FactureDTO> getFacturesByPatient(Long patientId) {
        return factureRepository.findAll().stream()
                .filter(f -> f.getPatient() != null && f.getPatient().getId().equals(patientId))
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<FactureDTO> getFacturesByPatientIds(List<Long> patientIds) {
        if (patientIds == null || patientIds.isEmpty()) {
            System.out.println("getFacturesByPatientIds: patientIds is null or empty, returning empty list");
            return List.of();
        }

        System.out.println("========== DEBUG getFacturesByPatientIds ==========");
        System.out.println("Looking for factures with patient IDs: " + patientIds);

        List<Facture> allFactures = factureRepository.findAll();
        System.out.println("Total factures in DB: " + allFactures.size());

        allFactures.forEach(f -> {
            Long patientId = f.getPatient() != null ? f.getPatient().getId() : null;
            System.out.println("Facture ID: " + f.getId() + " -> Patient ID: " + patientId);
        });

        List<FactureDTO> filtered = factureRepository.findAll().stream()
                .filter(f -> {
                    boolean hasPatient = f.getPatient() != null;
                    boolean isInList = hasPatient && patientIds.contains(f.getPatient().getId());
                    System.out
                            .println("Facture " + f.getId() + ": hasPatient=" + hasPatient + ", isInList=" + isInList);
                    return isInList;
                })
                .map(this::toDTO)
                .collect(Collectors.toList());

        System.out.println("Filtered factures count: " + filtered.size());
        System.out.println("===================================================");

        return filtered;
    }

    @Override
    public List<FactureDTO> getFacturesForCurrentAssistant() {
        System.out.println("========== DEBUG getFacturesForCurrentAssistant ==========");

        // Récupérer l'utilisateur connecté
        Object principal = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication().getPrincipal();
        if (!(principal instanceof org.springframework.security.core.userdetails.UserDetails)) {
            throw new IllegalStateException("Utilisateur non authentifié");
        }

        String username = ((org.springframework.security.core.userdetails.UserDetails) principal).getUsername();
        System.out.println("Assistant username: " + username);

        // Récupérer tous les rendez-vous créés par cet assistant
        List<RendezVous> rdvsAssistant = rendezVousRepository.findAll().stream()
                .filter(rdv -> rdv.getAssistantCree() != null &&
                        rdv.getAssistantCree().getUsername().equals(username))
                .collect(Collectors.toList());

        System.out.println("RDVs créés par l'assistant: " + rdvsAssistant.size());

        List<Long> rdvIds = rdvsAssistant.stream()
                .map(RendezVous::getId)
                .collect(Collectors.toList());
        System.out.println("RDV IDs: " + rdvIds);

        // Récupérer les patients de ces rendez-vous
        List<Long> patientIds = rdvsAssistant.stream()
                .map(rdv -> rdv.getPatient().getId())
                .distinct()
                .collect(Collectors.toList());
        System.out.println("Patient IDs des RDVs: " + patientIds);

        // Récupérer toutes les factures
        List<FactureDTO> factures = factureRepository.findAll().stream()
                .filter(f -> {
                    // Cas 1: Facture liée à un rendez-vous créé par cet assistant
                    if (f.getRendezVous() != null) {
                        boolean isRdvOfAssistant = rdvIds.contains(f.getRendezVous().getId());
                        System.out.println("Facture " + f.getId() + " a RDV " + f.getRendezVous().getId() +
                                ": isRdvOfAssistant=" + isRdvOfAssistant);
                        return isRdvOfAssistant;
                    }
                    // Cas 2: Facture sans rendez-vous mais pour un patient lié à l'assistant
                    else if (f.getPatient() != null) {
                        boolean isPatientOfAssistant = patientIds.contains(f.getPatient().getId());
                        System.out.println("Facture " + f.getId() + " sans RDV, patient " + f.getPatient().getId() +
                                ": isPatientOfAssistant=" + isPatientOfAssistant);
                        return isPatientOfAssistant;
                    }
                    return false;
                })
                .map(this::toDTO)
                .collect(Collectors.toList());

        System.out.println("Factures filtrées pour l'assistant: " + factures.size());
        System.out.println("==========================================================");

        return factures;
    }

    @Override
    public FactureDTO markFacturePaid(Long factureId, PaiementDTO paiementDTO) {
        Facture f = factureRepository.findById(factureId)
                .orElseThrow(() -> new RuntimeException("Facture introuvable"));

        Paiement p = new Paiement();
        p.setDatePaiement(LocalDate.now());
        p.setMontant(paiementDTO.getMontant());
        p.setMethode(paiementDTO.getMethode());
        p.setFacture(f);

        paiementRepository.save(p);

        f.getPaiements().add(p);
        f.setStatut("PAYEE");

        // Si la facture est liée à un rendez-vous, mettre son statut à TERMINE
        if (f.getRendezVous() != null) {
            RendezVous rdv = f.getRendezVous();
            rdv.setStatut(com.projet.cabinet.Entity.StatutRDV.TERMINE);
            rendezVousRepository.save(rdv);
        }

        factureRepository.save(f);

        return toDTO(f);
    }

    @Override
    public void deleteFacture(Long id) {
        Facture facture = factureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Facture introuvable"));
        factureRepository.delete(facture);
    }

    @Override
    public RapportFinancierDTO getRapportFinancier(LocalDate debut, LocalDate fin) {
        List<Facture> factures = factureRepository.findAll().stream()
                .filter(f -> {
                    if (debut != null && f.getDateEmission().isBefore(debut))
                        return false;
                    if (fin != null && f.getDateEmission().isAfter(fin))
                        return false;
                    return true;
                })
                .collect(Collectors.toList());

        Double totalFactures = factures.stream()
                .mapToDouble(f -> f.getMontantTotal() != null ? f.getMontantTotal() : 0.0)
                .sum();

        Double totalPaye = factures.stream()
                .filter(f -> "PAYEE".equals(f.getStatut()))
                .mapToDouble(f -> f.getMontantTotal() != null ? f.getMontantTotal() : 0.0)
                .sum();

        Double totalEnAttente = factures.stream()
                .filter(f -> "EN_ATTENTE".equals(f.getStatut()))
                .mapToDouble(f -> f.getMontantTotal() != null ? f.getMontantTotal() : 0.0)
                .sum();

        long nombreFactures = factures.size();
        long nombreFacturesPayees = factures.stream().filter(f -> "PAYEE".equals(f.getStatut())).count();
        long nombreFacturesEnAttente = factures.stream().filter(f -> "EN_ATTENTE".equals(f.getStatut())).count();

        return RapportFinancierDTO.builder()
                .totalFactures(totalFactures)
                .totalPaye(totalPaye)
                .totalEnAttente(totalEnAttente)
                .nombreFactures(nombreFactures)
                .nombreFacturesPayees(nombreFacturesPayees)
                .nombreFacturesEnAttente(nombreFacturesEnAttente)
                .periodeDebut(debut)
                .periodeFin(fin)
                .build();
    }

    private String generateNumero() {
        String prefix = "FAC-" + LocalDate.now().getYear() + "-";
        String n = prefix + String.format("%06d", (int) (Math.random() * 999999));
        if (factureRepository.existsByNumero(n))
            return generateNumero();
        return n;
    }

    private FactureDTO toDTO(Facture f) {
        FactureDTO dto = new FactureDTO();
        dto.setId(f.getId());
        dto.setNumero(f.getNumero());
        dto.setDateEmission(f.getDateEmission());
        dto.setMontantTotal(f.getMontantTotal());
        dto.setStatut(f.getStatut());

        if (f.getPatient() != null) {
            dto.setPatientId(f.getPatient().getId());
            dto.setPatientNom(f.getPatient().getNom());
            dto.setPatientPrenom(f.getPatient().getPrenom());
            dto.setPatientEmail(f.getPatient().getEmail());
        }

        if (f.getRendezVous() != null) {
            dto.setRendezVousId(f.getRendezVous().getId());
            dto.setRendezVousMotif(f.getRendezVous().getMotif());
            if (f.getRendezVous().getDateHeure() != null) {
                dto.setRendezVousDate(f.getRendezVous().getDateHeure().toString());
            }
        }

        if (f.getPaiements() != null && !f.getPaiements().isEmpty()) {
            dto.setPaiements(f.getPaiements().stream()
                    .map(p -> PaiementDTO.builder()
                            .id(p.getId())
                            .datePaiement(p.getDatePaiement())
                            .montant(p.getMontant())
                            .methode(p.getMethode())
                            .factureId(f.getId())
                            .build())
                    .collect(Collectors.toList()));
        }

        return dto;
    }
}
