package com.projet.cabinet.Service;

import com.projet.cabinet.DTO.UserDTO;
import com.projet.cabinet.DTO.CreateUserRequest;
import com.projet.cabinet.DTO.RegisterDto;
import com.projet.cabinet.Entity.Assistant;
import com.projet.cabinet.Entity.Medecin;
import com.projet.cabinet.Entity.Patient;
import com.projet.cabinet.Entity.user;
import com.projet.cabinet.Repository.userRepo;
import com.projet.cabinet.Service.UserService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final userRepo userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public user createUser(RegisterDto registerDto, String usertype) {
        if (userRepository.findByUsername(registerDto.getUsername()).isPresent())
            throw new IllegalArgumentException("Username already exists");
        if (userRepository.findByEmail(registerDto.getEmail()).isPresent())
            throw new IllegalArgumentException("Email already exists");

        user newUser;

        if ("PATIENT".equalsIgnoreCase(usertype)) {
            newUser = new Patient();
            if (registerDto.getDateNaissance() != null) {
                ((Patient) newUser).setDateNaissance(registerDto.getDateNaissance().toString());
            }
        } else if ("ASSISTANT".equalsIgnoreCase(usertype)) {
            newUser = new Assistant();
            ((Assistant) newUser).setActive(true);
        } else {
            // Par défaut, créer un utilisateur de base
            newUser = new Medecin();
            ((Medecin) newUser).setSpecialite(registerDto.getSpecialite());
        }

        newUser.setPrenom(registerDto.getFirstname());
        newUser.setNom(registerDto.getLastname());
        newUser.setUsername(registerDto.getUsername());
        newUser.setEmail(registerDto.getEmail());
        newUser.setMotDePasse(passwordEncoder.encode(registerDto.getPassword()));
        newUser.setUsertype(usertype);
        return userRepository.save(newUser);
    }

    @Override
    public UserDTO getUserById(Long id) {
        user u = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return toDTO(u);
    }

    @Override
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public UserDTO updateUser(Long id, UserDTO dto) {
        user u = userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("User not found"));
        u.setNom(dto.getNom());
        u.setPrenom(dto.getPrenom());
        u.setTelephone(dto.getTelephone());
        // email / username updates require checks
        if (dto.getEmail() != null && !dto.getEmail().equals(u.getEmail())) {
            if (userRepository.findByEmail(dto.getEmail()).isPresent())
                throw new IllegalArgumentException("Email used");
            u.setEmail(dto.getEmail());
        }
        return toDTO(userRepository.save(u));
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public boolean changePassword(String username, String oldPassword, String newPassword) {
        user u = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Vérifier l'ancien mot de passe
        if (!passwordEncoder.matches(oldPassword, u.getMotDePasse())) {
            return false;
        }

        // Changer le mot de passe
        u.setMotDePasse(passwordEncoder.encode(newPassword));
        userRepository.save(u);
        return true;
    }

    @Override
    public boolean toggleUserActivation(Long userId) {
        user u = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Vérifier que c'est un Assistant
        if (!(u instanceof Assistant)) {
            throw new RuntimeException("Seuls les assistants peuvent être activés/désactivés");
        }

        Assistant assistant = (Assistant) u;
        assistant.setActive(!assistant.isActive());
        userRepository.save(assistant);
        return assistant.isActive();
    }

    private UserDTO toDTO(user user) {
        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .nom(user.getNom())
                .prenom(user.getPrenom())
                .email(user.getEmail())
                .telephone(user.getTelephone())
                .build();
    }
}
