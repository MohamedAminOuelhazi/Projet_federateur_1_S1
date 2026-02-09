package com.projet.cabinet.DTO;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatbotResponseDTO {
    private Boolean success;
    private String response;
    private String timestamp;
}
