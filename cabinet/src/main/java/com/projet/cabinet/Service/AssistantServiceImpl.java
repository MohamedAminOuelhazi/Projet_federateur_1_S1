package com.projet.cabinet.Service;

import com.fasterxml.jackson.annotation.JsonTypeInfo.As;
import com.projet.cabinet.DTO.AssistantDTO;
import com.projet.cabinet.DTO.MedecinDTO;
import com.projet.cabinet.Entity.*;
import com.projet.cabinet.Repository.*;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AssistantServiceImpl implements AssistantService {

    @Autowired
    private AssistantRepository assistantRepository;

    @Override
    public AssistantDTO modifierAssistant(Long id, AssistantDTO dto) {
        Assistant a = assistantRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Assistant not found"));
        a.setNom(dto.getNom());
        a.setPrenom(dto.getPrenom());
        a.setTelephone(dto.getTelephone());
        a.setEmail(dto.getEmail());
        return toDTO(assistantRepository.save(a));
    }

    @Override
    public void activerDesactiverAssistant(Long id, boolean active) {
        Assistant assistant = assistantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Assistant introuvable"));
        assistant.setActive(active);
        assistantRepository.save(assistant);
    }

    @Override
    public void supprimerAssistant(Long id) {
        assistantRepository.deleteById(id);
    }

    @Override
    public AssistantDTO getAssistant(Long id) {
        Assistant a = assistantRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Assistant not found"));
        return toDTO(a);
    }

    @Override
    public List<AssistantDTO> getAllAssistants() {
        return assistantRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    private AssistantDTO toDTO(Assistant m) {
        return AssistantDTO.builder()
                .id(m.getId())
                .username(m.getUsername())
                .nom(m.getNom())
                .prenom(m.getPrenom())
                .email(m.getEmail())
                .telephone(m.getTelephone())
                .active(m.isActive())
                .build();
    }
}
