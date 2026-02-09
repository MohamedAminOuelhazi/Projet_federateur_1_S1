package com.projet.cabinet.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.projet.cabinet.DTO.RendezVousDTO;
import com.projet.cabinet.DTO.RendezVousSimpleDTO;
import com.projet.cabinet.DTO.TimeSlotDTO;
import com.projet.cabinet.Entity.Assistant;
import com.projet.cabinet.Entity.Medecin;
import com.projet.cabinet.Entity.Patient;
import com.projet.cabinet.Entity.RendezVous;
import com.projet.cabinet.Entity.StatutRDV;
import com.projet.cabinet.Entity.user;
import com.projet.cabinet.Repository.AssistantRepository;
import com.projet.cabinet.Repository.MedecinRepository;
import com.projet.cabinet.Repository.PatientRepository;
import com.projet.cabinet.Repository.RendezVousRepository;
import com.projet.cabinet.Repository.userRepo;

import org.springframework.security.core.Authentication;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class RendezVousServiceImpl implements RendezVousService {

    @Autowired
    RendezVousRepository rendezVousRepository;
    @Autowired
    PatientRepository patientRepository;
    @Autowired
    MedecinRepository medecinRepository;

    @Autowired
    userRepo userRepo;

    @Autowired
    AssistantRepository assistantRepository;

    @Autowired
    NotificationService notificationService;

    @Autowired
    NotificationEmailService notificationEmailService;

    @Autowired
    com.projet.cabinet.Service.DossierPatientService dossierPatientService;

    // --- helpers ---
    private user getCurrentUser(Authentication auth) {
        if (auth == null || !auth.isAuthenticated())
            return null;
        String username = auth.getName();
        return userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    private boolean isRole(Authentication auth, String role) {
        return auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals(role));
    }

    @Override
    public RendezVousDTO createRdv(Long assistantId, Long patientId, RendezVousDTO dto) {

        // Récupérer l'utilisateur créateur (peut être Assistant, Medecin ou Patient)
        user createur = userRepo.findById(assistantId)
                .orElseThrow(() -> new RuntimeException("Utilisateur créateur introuvable"));

        // Convertir en Assistant si c'est un Assistant, sinon null
        Assistant assistant = null;
        if (createur instanceof Assistant) {
            assistant = (Assistant) createur;
        } else {
            // Si ce n'est pas un assistant, on essaie de trouver un assistant pour
            // compatibilité
            // ou on laisse null (optionnel selon votre besoin)
            assistant = assistantRepository.findAll().stream().findFirst().orElse(null);
        }

        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient introuvable"));

        // Récupérer le médecin depuis le DTO
        Medecin medecin = null;
        if (dto.getMedecinId() != null) {
            medecin = medecinRepository.findById(dto.getMedecinId())
                    .orElseThrow(() -> new RuntimeException("Médecin introuvable"));
        } else {
            // Fallback: essayer de récupérer depuis l'assistant si disponible
            if (assistant != null && assistant.getMedecin() != null) {
                medecin = assistant.getMedecin();
            } else {
                throw new RuntimeException("Aucun médecin spécifié pour ce rendez-vous");
            }
        }

        RendezVous rdv = new RendezVous();
        rdv.setDateHeure(dto.getDateHeure());
        rdv.setMotif(dto.getMotif());
        rdv.setAssistantCree(assistant); // Peut être null si créé par Medecin/Patient
        rdv.setPatient(patient);
        rdv.setMedecin(medecin);

        RendezVous saved = rendezVousRepository.save(rdv);

        // Auto-create dossier patient lié au RDV
        try {
            com.projet.cabinet.DTO.DossierPatientDTO dossierDto = new com.projet.cabinet.DTO.DossierPatientDTO();
            dossierDto.setDateCreation(java.time.LocalDate.now());

            // Description professionnelle avec la date du rendez-vous
            String dateRdv = saved.getDateHeure().format(DateTimeFormatter.ofPattern("dd/MM/yyyy à HH:mm"));
            String motif = saved.getMotif() != null ? saved.getMotif() : "Consultation";
            dossierDto.setDescription(String.format("Dossier médical - %s - %s", motif, dateRdv));

            dossierDto.setPatientId(patient.getId());
            dossierDto.setRendezVousId(saved.getId());
            dossierPatientService.createDossier(dossierDto);
        } catch (Exception ex) {
            // log but don't fail RDV creation
            ex.printStackTrace();
        }

        // Créer des notifications pour les participants
        try {
            String dateRdv = saved.getDateHeure().format(DateTimeFormatter.ofPattern("dd/MM/yyyy à HH:mm"));
            String motif = saved.getMotif() != null ? saved.getMotif() : "Consultation";

            // Notification pour le patient
            com.projet.cabinet.DTO.NotificationDTO notifPatient = com.projet.cabinet.DTO.NotificationDTO.builder()
                    .titre("Nouveau rendez-vous")
                    .message(String.format("Votre rendez-vous pour %s a été programmé le %s", motif, dateRdv))
                    .type("RENDEZ_VOUS")
                    .userId(patient.getId())
                    .rendezVousId(saved.getId())
                    .build();
            notificationService.createNotification(notifPatient);

            // Notification pour le médecin
            if (medecin != null) {
                com.projet.cabinet.DTO.NotificationDTO notifMedecin = com.projet.cabinet.DTO.NotificationDTO.builder()
                        .titre("Nouveau rendez-vous")
                        .message(String.format("Rendez-vous avec %s %s le %s pour %s",
                                patient.getPrenom(), patient.getNom(), dateRdv, motif))
                        .type("RENDEZ_VOUS")
                        .userId(medecin.getId())
                        .rendezVousId(saved.getId())
                        .build();
                notificationService.createNotification(notifMedecin);
            }
        } catch (Exception ex) {
            // log but don't fail RDV creation
            ex.printStackTrace();
        }

        // Envoyer email de confirmation au patient
        try {
            notificationEmailService.sendConfirmationEmail(saved);
        } catch (Exception ex) {
            ex.printStackTrace();
        }

        return mapToDTO(saved);
    }

    @Override
    public RendezVousDTO updateRdv(Long rdvId, RendezVousDTO dto) {

        RendezVous rdv = rendezVousRepository.findById(rdvId)
                .orElseThrow(() -> new RuntimeException("RDV introuvable"));

        if (dto.getDateHeure() != null)
            rdv.setDateHeure(dto.getDateHeure());
        if (dto.getStatut() != null)
            rdv.setStatut(StatutRDV.valueOf(dto.getStatut()));

        RendezVous updated = rendezVousRepository.save(rdv);

        return mapToDTO(updated);
    }

    @Override
    public void cancelRdv(Long rdvId) {
        RendezVous rdv = rendezVousRepository.findById(rdvId)
                .orElseThrow(() -> new RuntimeException("RDV introuvable"));

        rdv.setStatut(StatutRDV.ANNULE);
        rendezVousRepository.save(rdv);
    }

    @Override
    public List<RendezVousDTO> getRdvsByPatient(Long patientId) {
        return rendezVousRepository.findByPatientId(patientId).stream()
                .map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public List<RendezVousSimpleDTO> getRendezVousSimpleByPatient(Long patientId) {
        return rendezVousRepository.findByPatientId(patientId).stream()
                .map(rdv -> RendezVousSimpleDTO.builder()
                        .id(rdv.getId())
                        .dateHeure(rdv.getDateHeure())
                        .motif(rdv.getMotif())
                        .statut(rdv.getStatut() != null ? rdv.getStatut().name() : null)
                        .patientId(rdv.getPatient() != null ? rdv.getPatient().getId() : null)
                        .patientNom(rdv.getPatient() != null ? rdv.getPatient().getNom() : null)
                        .patientPrenom(rdv.getPatient() != null ? rdv.getPatient().getPrenom() : null)
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public List<RendezVousSimpleDTO> getRendezVousSimpleByPatientAndAssistant(Long patientId,
            String assistantUsername) {
        System.out.println("========== DEBUG getRendezVousSimpleByPatientAndAssistant ==========");
        System.out.println("Patient ID: " + patientId);
        System.out.println("Assistant username: " + assistantUsername);

        List<RendezVousSimpleDTO> rdvs = rendezVousRepository.findByPatientId(patientId).stream()
                .filter(rdv -> {
                    boolean createdByAssistant = rdv.getAssistantCree() != null &&
                            rdv.getAssistantCree().getUsername().equals(assistantUsername);
                    System.out.println("RDV " + rdv.getId() + ": createdByAssistant=" + createdByAssistant +
                            " (assistant: "
                            + (rdv.getAssistantCree() != null ? rdv.getAssistantCree().getUsername() : "null") + ")");
                    return createdByAssistant;
                })
                .map(rdv -> RendezVousSimpleDTO.builder()
                        .id(rdv.getId())
                        .dateHeure(rdv.getDateHeure())
                        .motif(rdv.getMotif())
                        .statut(rdv.getStatut() != null ? rdv.getStatut().name() : null)
                        .patientId(rdv.getPatient() != null ? rdv.getPatient().getId() : null)
                        .patientNom(rdv.getPatient() != null ? rdv.getPatient().getNom() : null)
                        .patientPrenom(rdv.getPatient() != null ? rdv.getPatient().getPrenom() : null)
                        .build())
                .collect(Collectors.toList());

        System.out.println("RDVs filtrés: " + rdvs.size());
        System.out.println("====================================================================");

        return rdvs;
    }

    @Override
    public List<RendezVousDTO> getRdvsForMedecin(Long medecinId, LocalDate from, LocalDate to) {
        LocalDateTime fromDT = from.atStartOfDay();
        LocalDateTime toDT = to.atTime(23, 59, 59, 999_999_999);
        return rendezVousRepository.findByMedecinIdAndDateHeureBetween(medecinId, fromDT, toDT)
                .stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public List<RendezVousDTO> getMyRdvs(Authentication auth) {
        user me = getCurrentUser(auth);
        if (me instanceof Patient) {
            return getRdvsByPatient(me.getId());
        } else if (me instanceof Assistant) {
            // Chaque assistant voit uniquement les rendez-vous qu'il a créés
            return getRdvsByAssistant(me.getId());
        } else if (me instanceof Medecin) {
            // Le médecin voit tous ses rendez-vous
            return rendezVousRepository.findByMedecinId(me.getId()).stream()
                    .map(this::mapToDTO).collect(Collectors.toList());
        } else {
            return Collections.emptyList();
        }
    }

    @Override
    public List<RendezVousDTO> getUpcomingRdvsForUser(Authentication auth, int daysAhead) {
        user me = getCurrentUser(auth);
        LocalDate today = LocalDate.now();
        LocalDate end = today.plusDays(daysAhead);
        if (me instanceof Patient) {
            LocalDateTime fromDT = today.atStartOfDay();
            return rendezVousRepository.findByPatientIdAndDateHeureAfter(me.getId(), fromDT)
                    .stream().filter(r -> !r.getDateHeure().toLocalDate().isAfter(end)).map(this::mapToDTO)
                    .collect(Collectors.toList());
        } else if (me instanceof Assistant) {
            // Chaque assistant voit uniquement ses rendez-vous à venir
            LocalDateTime fromDT = today.atStartOfDay();
            return rendezVousRepository.findByAssistantCreeIdAndDateHeureAfter(me.getId(), fromDT)
                    .stream().filter(r -> !r.getDateHeure().toLocalDate().isAfter(end)).map(this::mapToDTO)
                    .collect(Collectors.toList());
        } else if (me instanceof Medecin) {
            LocalDateTime fromDT = today.atStartOfDay();
            return rendezVousRepository.findByMedecinIdAndDateHeureAfter(me.getId(), fromDT)
                    .stream().filter(r -> !r.getDateHeure().toLocalDate().isAfter(end)).map(this::mapToDTO)
                    .collect(Collectors.toList());
        } else {
            return Collections.emptyList();
        }
    }

    private RendezVousDTO mapToDTO(RendezVous rdv) {
        RendezVousDTO dto = new RendezVousDTO();

        dto.setId(rdv.getId());
        dto.setDateHeure(rdv.getDateHeure());
        dto.setStatut(rdv.getStatut().name());
        dto.setMotif(rdv.getMotif());
        dto.setDateCreation(rdv.getDateCreation());
        dto.setAssistantId(rdv.getAssistantCree() != null ? rdv.getAssistantCree().getId() : null);
        dto.setPatientId(rdv.getPatient() != null ? rdv.getPatient().getId() : null);
        dto.setMedecinId(rdv.getMedecin() != null ? rdv.getMedecin().getId() : null);

        // Ajouter les noms complets pour l'affichage
        if (rdv.getPatient() != null) {
            dto.setNomPatient(rdv.getPatient().getNom());
            dto.setPrenomPatient(rdv.getPatient().getPrenom());
        }

        if (rdv.getMedecin() != null) {
            dto.setNomMedecin(rdv.getMedecin().getNom());
            dto.setPrenomMedecin(rdv.getMedecin().getPrenom());
        }

        if (rdv.getAssistantCree() != null) {
            dto.setNomAssistant(rdv.getAssistantCree().getNom());
            dto.setPrenomAssistant(rdv.getAssistantCree().getPrenom());
        }

        return dto;
    }

    @Override
    public List<RendezVousDTO> getRdvsByAssistant(Long assistantId) {
        return rendezVousRepository.findByAssistantCreeId(assistantId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<TimeSlotDTO> getAvailableSlots(Long medecinId, LocalDate date) {
        // Vérifier que le médecin existe
        Medecin medecin = medecinRepository.findById(medecinId)
                .orElseThrow(() -> new RuntimeException("Médecin introuvable"));

        // Configuration des heures de travail (9h-17h)
        LocalTime startWork = LocalTime.of(9, 0);
        LocalTime endWork = LocalTime.of(17, 0);
        int slotDurationMinutes = 30;

        // Récupérer tous les RDV du médecin pour cette date
        LocalDateTime dayStart = date.atStartOfDay();
        LocalDateTime dayEnd = date.atTime(23, 59, 59);
        List<RendezVous> existingRdvs = rendezVousRepository
                .findByMedecinIdAndDateHeureBetween(medecinId, dayStart, dayEnd)
                .stream()
                .filter(rdv -> !rdv.getStatut().equals(StatutRDV.ANNULE))
                .collect(Collectors.toList());

        // Générer tous les créneaux possibles
        List<TimeSlotDTO> slots = new java.util.ArrayList<>();
        LocalTime current = startWork;
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");

        while (current.plusMinutes(slotDurationMinutes).isBefore(endWork)
                || current.plusMinutes(slotDurationMinutes).equals(endWork)) {

            LocalDateTime slotStart = LocalDateTime.of(date, current);
            LocalDateTime slotEnd = slotStart.plusMinutes(slotDurationMinutes);

            // Vérifier si le créneau est déjà pris
            boolean isAvailable = existingRdvs.stream().noneMatch(rdv -> {
                LocalDateTime rdvStart = rdv.getDateHeure();
                LocalDateTime rdvEnd = rdvStart.plusMinutes(slotDurationMinutes);

                // Vérifier si les créneaux se chevauchent
                return (slotStart.isBefore(rdvEnd) && slotEnd.isAfter(rdvStart));
            });

            // Ne pas proposer de créneaux dans le passé
            if (slotStart.isBefore(LocalDateTime.now())) {
                isAvailable = false;
            }

            TimeSlotDTO slot = TimeSlotDTO.builder()
                    .startTime(slotStart)
                    .endTime(slotEnd)
                    .available(isAvailable)
                    .label(current.format(timeFormatter) + " - " + slotEnd.toLocalTime().format(timeFormatter))
                    .build();

            slots.add(slot);
            current = current.plusMinutes(slotDurationMinutes);
        }

        return slots;
    }

}
