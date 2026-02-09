package com.projet.cabinet.controller;

import com.projet.cabinet.DTO.AuthResponseDTO;
import com.projet.cabinet.DTO.ChangePasswordDTO;
import com.projet.cabinet.DTO.CreateUserRequest;
import com.projet.cabinet.DTO.LoginDto;
import com.projet.cabinet.DTO.MedecinDTO;
import com.projet.cabinet.DTO.RegisterDto;
import com.projet.cabinet.DTO.UserDTO;
import com.projet.cabinet.DTO.VerifyEmailDTO;
import com.projet.cabinet.Entity.user;
import com.projet.cabinet.Repository.userRepo;
import com.projet.cabinet.Security.JWTGenerator;
import com.projet.cabinet.Service.EmailVerificationService;
import com.projet.cabinet.Service.UserService;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final AuthenticationManager authenticationManager;
    private final JWTGenerator jwtGenerator;

    @Autowired
    userRepo userRepo;

    @Autowired
    private UserService userService;

    @Autowired
    private EmailVerificationService emailVerificationService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDto loginDto) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginDto.getUsername(),
                            loginDto.getMot_de_passe()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String token = jwtGenerator.generateToken(authentication);
            Optional<user> user = userRepo.findByUsername(loginDto.getUsername());
            String role = user.get().getUsertype();

            return new ResponseEntity<>(new AuthResponseDTO(token, role), HttpStatus.OK);

        } catch (AuthenticationException e) {
            // Authentication failed, return an error message
            return new ResponseEntity<>("Invalid username or password", HttpStatus.UNAUTHORIZED);
        }
    }

    @PostMapping("/Assistant/register")
    public ResponseEntity<user> createAssistant(@Valid @RequestBody RegisterDto dto) {
        String usertype = "ASSISTANT";
        return ResponseEntity.ok(userService.createUser(dto, usertype));
    }

    @PostMapping("/Medecin/register")
    public ResponseEntity<user> createMedecin(@Valid @RequestBody RegisterDto dto) {
        String usertype = "MEDECIN";
        return ResponseEntity.ok(userService.createUser(dto, usertype));
    }

    @PostMapping("/Patient/register")
    public ResponseEntity<user> createPatient(@Valid @RequestBody RegisterDto dto) {
        String usertype = "PATIENT";
        return ResponseEntity.ok(userService.createUser(dto, usertype));
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String username = authentication.getName();
        Optional<user> userOpt = userRepo.findByUsername(username);

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        user currentUser = userOpt.get();
        UserDTO userDTO = new UserDTO();
        userDTO.setId(currentUser.getId());
        userDTO.setUsername(currentUser.getUsername());
        userDTO.setEmail(currentUser.getEmail());
        userDTO.setNom(currentUser.getNom());
        userDTO.setPrenom(currentUser.getPrenom());
        userDTO.setTelephone(currentUser.getTelephone());
        userDTO.setUsertype(currentUser.getUsertype());

        // Ajouter les champs spécifiques au médecin
        if ("MEDECIN".equals(currentUser.getUsertype()) && currentUser instanceof com.projet.cabinet.Entity.Medecin) {
            com.projet.cabinet.Entity.Medecin medecin = (com.projet.cabinet.Entity.Medecin) currentUser;
            userDTO.setSpecialite(medecin.getSpecialite());
            userDTO.setDescription(medecin.getDescription());
            userDTO.setPhotoUrl(medecin.getPhotoUrl());
        }

        return ResponseEntity.ok(userDTO);
    }

    /**
     * Récupérer la liste de tous les médecins (public, pour landing page)
     */
    @GetMapping("/medecins")
    public ResponseEntity<java.util.List<MedecinDTO>> getAllMedecins() {
        java.util.List<com.projet.cabinet.Entity.Medecin> medecins = userRepo.findAll().stream()
                .filter(u -> "MEDECIN".equals(u.getUsertype()))
                .filter(u -> u instanceof com.projet.cabinet.Entity.Medecin)
                .map(u -> (com.projet.cabinet.Entity.Medecin) u)
                .collect(java.util.stream.Collectors.toList());

        java.util.List<MedecinDTO> medecinDTOs = medecins.stream()
                .map(m -> {
                    MedecinDTO dto = new MedecinDTO();
                    dto.setId(m.getId());
                    dto.setNom(m.getNom());
                    dto.setPrenom(m.getPrenom());
                    dto.setEmail(m.getEmail());
                    dto.setTelephone(m.getTelephone());
                    dto.setSpecialite(m.getSpecialite());
                    dto.setDescription(m.getDescription());
                    dto.setPhotoUrl(m.getPhotoUrl());
                    return dto;
                })
                .collect(java.util.stream.Collectors.toList());

        return ResponseEntity.ok(medecinDTOs);
    }

    /**
     * Envoyer un code de vérification par email (pour inscription patient)
     */
    @PostMapping("/send-verification-code")
    public ResponseEntity<Map<String, String>> sendVerificationCode(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            emailVerificationService.sendVerificationCode(email);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Code de vérification envoyé à " + email);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Erreur lors de l'envoi du code: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Vérifier le code email avant création du compte patient
     */
    @PostMapping("/verify-email")
    public ResponseEntity<Map<String, Boolean>> verifyEmail(@RequestBody VerifyEmailDTO dto) {
        boolean verified = emailVerificationService.verifyCode(dto.getEmail(), dto.getCode());

        Map<String, Boolean> response = new HashMap<>();
        response.put("verified", verified);

        return verified
                ? ResponseEntity.ok(response)
                : ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    /**
     * Mettre à jour le profil de l'utilisateur connecté
     */
    @PutMapping("/me/profile")
    public ResponseEntity<Map<String, String>> updateProfile(@RequestBody UserDTO dto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Non authentifié");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        String username = authentication.getName();
        Optional<user> userOpt = userRepo.findByUsername(username);

        if (userOpt.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Utilisateur non trouvé");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        user currentUser = userOpt.get();

        // Mettre à jour les champs communs
        if (dto.getNom() != null)
            currentUser.setNom(dto.getNom());
        if (dto.getPrenom() != null)
            currentUser.setPrenom(dto.getPrenom());
        if (dto.getEmail() != null)
            currentUser.setEmail(dto.getEmail());
        if (dto.getTelephone() != null)
            currentUser.setTelephone(dto.getTelephone());
        if (dto.getDateNaissance() != null)
            currentUser.setDateNaissance(dto.getDateNaissance());

        // Mettre à jour les champs spécifiques au médecin
        if ("MEDECIN".equals(currentUser.getUsertype()) && currentUser instanceof com.projet.cabinet.Entity.Medecin) {
            com.projet.cabinet.Entity.Medecin medecin = (com.projet.cabinet.Entity.Medecin) currentUser;
            if (dto.getSpecialite() != null)
                medecin.setSpecialite(dto.getSpecialite());
            if (dto.getDescription() != null)
                medecin.setDescription(dto.getDescription());
            if (dto.getPhotoUrl() != null)
                medecin.setPhotoUrl(dto.getPhotoUrl());
        }

        userRepo.save(currentUser);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Profil mis à jour avec succès");
        return ResponseEntity.ok(response);
    }

    /**
     * Changer le mot de passe de l'utilisateur connecté
     */
    @PutMapping("/me/change-password")
    public ResponseEntity<Map<String, String>> changePassword(@RequestBody ChangePasswordDTO dto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Non authentifié");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        String username = authentication.getName();
        boolean success = userService.changePassword(username, dto.getOldPassword(), dto.getNewPassword());

        Map<String, String> response = new HashMap<>();
        if (success) {
            response.put("message", "Mot de passe modifié avec succès");
            return ResponseEntity.ok(response);
        } else {
            response.put("error", "Ancien mot de passe incorrect");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * Supprimer le compte de l'utilisateur connecté (Patient uniquement)
     */
    @DeleteMapping("/me")
    public ResponseEntity<Map<String, String>> deleteMyAccount() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Non authentifié");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        String username = authentication.getName();
        Optional<user> userOpt = userRepo.findByUsername(username);

        if (userOpt.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Utilisateur non trouvé");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        user currentUser = userOpt.get();

        // Vérifier que c'est un patient
        if (!"PATIENT".equals(currentUser.getUsertype())) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Seuls les patients peuvent supprimer leur compte");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
        }

        userService.deleteUser(currentUser.getId());

        Map<String, String> response = new HashMap<>();
        response.put("message", "Compte supprimé avec succès");
        return ResponseEntity.ok(response);
    }
}
