package com.projet.cabinet.controller;

import com.projet.cabinet.DTO.AssistantDTO;
import com.projet.cabinet.DTO.RegisterDto;
import com.projet.cabinet.Entity.user;
import com.projet.cabinet.Entity.Assistant;
import com.projet.cabinet.Repository.userRepo;
import com.projet.cabinet.Service.AssistantService;
import com.projet.cabinet.Service.UserService;
import com.projet.cabinet.Service.NotificationEmailService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/assistants")
@CrossOrigin("*")
public class AssistantController {

    @Autowired
    AssistantService assistantService;

    @Autowired
    UserService userService;

    @Autowired
    NotificationEmailService notificationEmailService;

    @Autowired
    userRepo userRepo;

    @GetMapping("/get/{id}")
    public ResponseEntity<AssistantDTO> getAssistant(@PathVariable Long id) {
        return ResponseEntity.ok(assistantService.getAssistant(id));
    }

    @GetMapping("/allAssistants")
    public ResponseEntity<List<AssistantDTO>> list() {
        return ResponseEntity.ok(assistantService.getAllAssistants());
    }

    @PutMapping("/modifier/{id}")
    public AssistantDTO modifierAssistant(@PathVariable Long id, @RequestBody AssistantDTO assistant) {
        return assistantService.modifierAssistant(id, assistant);
    }

    // modifier le statut actif/inactif d'un assistant c'est une modification
    // partielle c'est pourquoi on utilise @PatchMapping
    // pour indiquer qu'on modifie seulement une partie de la ressource
    @PatchMapping("/activer/{id}")
    public void activerAssistant(@PathVariable Long id, @RequestParam boolean active) {
        assistantService.activerDesactiverAssistant(id, active);
    }

    @DeleteMapping("/supprimer/{id}")
    public ResponseEntity<?> supprimerAssistant(@PathVariable Long id) {
        assistantService.supprimerAssistant(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Assistant supprimé avec succès");
        return ResponseEntity.ok(response);
    }

    /**
     * Créer un nouvel assistant (Médecin uniquement)
     */
    @PostMapping
    public ResponseEntity<?> createAssistant(@RequestBody RegisterDto dto) {
        // Vérifier que l'utilisateur connecté est un médecin
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Non authentifié");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        String username = authentication.getName();
        user currentUser = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        if (!"MEDECIN".equals(currentUser.getUsertype())) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Seuls les médecins peuvent créer des assistants");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
        }

        // Créer l'assistant
        user assistant = userService.createUser(dto, "ASSISTANT");
        return ResponseEntity.ok(assistant);
    }

    /**
     * Basculer l'activation d'un assistant (Médecin uniquement)
     */
    @PatchMapping("/{id}/toggle-activation")
    public ResponseEntity<Map<String, Object>> toggleActivation(@PathVariable Long id) {
        // Vérifier que l'utilisateur connecté est un médecin
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Non authentifié");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        String username = authentication.getName();
        user currentUser = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        if (!"MEDECIN".equals(currentUser.getUsertype())) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Seuls les médecins peuvent gérer les assistants");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
        }

        // Récupérer l'assistant avant le toggle pour avoir ses infos
        user assistantUser = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Assistant non trouvé"));

        if (!(assistantUser instanceof Assistant)) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "L'utilisateur n'est pas un assistant");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        Assistant assistant = (Assistant) assistantUser;
        String assistantName = assistant.getPrenom() + " " + assistant.getNom();
        String assistantEmail = assistant.getEmail();
        boolean wasActive = assistant.isActive();

        // Basculer l'activation
        boolean isActive = userService.toggleUserActivation(id);

        // Envoyer l'email de notification
        if (isActive && !wasActive) {
            // Le compte vient d'être activé
            notificationEmailService.sendAccountActivationEmail(assistantEmail, assistantName);
        } else if (!isActive && wasActive) {
            // Le compte vient d'être désactivé
            notificationEmailService.sendAccountDeactivationEmail(assistantEmail, assistantName);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("active", isActive);
        response.put("message", isActive ? "Compte activé" : "Compte désactivé");
        return ResponseEntity.ok(response);
    }
}
