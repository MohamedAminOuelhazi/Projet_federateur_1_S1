package com.projet.cabinet.DTO;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatbotRequestDTO {
    private Long patientId;
    private String question;
    private String rdvDate; // Format: dd/MM/yyyy (optionnel)
    private String authToken; // Token JWT pour authentification (optionnel)
}
