package com.projet.cabinet.Service;

import java.util.List;

import com.projet.cabinet.DTO.AssistantDTO;
import com.projet.cabinet.DTO.MedecinDTO;
import com.projet.cabinet.Entity.Assistant;

public interface AssistantService {

    AssistantDTO modifierAssistant(Long id, AssistantDTO assistant);

    void activerDesactiverAssistant(Long id, boolean active);

    void supprimerAssistant(Long id);

    AssistantDTO getAssistant(Long id);

    List<AssistantDTO> getAllAssistants();
}
