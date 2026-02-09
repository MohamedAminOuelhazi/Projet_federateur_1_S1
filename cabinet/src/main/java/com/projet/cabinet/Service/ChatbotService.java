package com.projet.cabinet.Service;

import com.projet.cabinet.DTO.*;

import java.util.List;

public interface ChatbotService {
    List<ConsultationDataDTO> getConsultationsData(Long patientId, String rdvDate);

    ChatbotResponseDTO askChatbot(ChatbotRequestDTO request);
}
