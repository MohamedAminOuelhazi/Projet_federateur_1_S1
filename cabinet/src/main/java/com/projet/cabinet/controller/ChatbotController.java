package com.projet.cabinet.controller;

import com.projet.cabinet.DTO.ChatbotRequestDTO;
import com.projet.cabinet.DTO.ChatbotResponseDTO;
import com.projet.cabinet.Service.ChatbotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chatbot")
@CrossOrigin(origins = "*")
public class ChatbotController {

    @Autowired
    private ChatbotService chatbotService;

    /**
     * Endpoint appelé par le frontend pour poser une question au chatbot
     */
    @PostMapping("/ask")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<ChatbotResponseDTO> askChatbot(@RequestBody ChatbotRequestDTO request) {
        try {
            ChatbotResponseDTO response = chatbotService.askChatbot(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    ChatbotResponseDTO.builder()
                            .success(false)
                            .response("Erreur: " + e.getMessage())
                            .timestamp(null)
                            .build());
        }
    }
}
