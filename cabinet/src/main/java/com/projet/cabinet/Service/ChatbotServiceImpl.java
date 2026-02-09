package com.projet.cabinet.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.projet.cabinet.DTO.*;
import com.projet.cabinet.Entity.DossierPatient;
import com.projet.cabinet.Repository.DossierPatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ChatbotServiceImpl implements ChatbotService {

    @Autowired
    private DossierPatientRepository dossierRepo;

    @Value("${openrouter.api.key}")
    private String openRouterApiKey;

    @Value("${openrouter.api.url}")
    private String openRouterApiUrl;

    @Value("${openrouter.model}")
    private String openRouterModel;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    @Override
    public List<ConsultationDataDTO> getConsultationsData(Long patientId, String rdvDate) {
        List<DossierPatient> dossiers;

        if (rdvDate != null && !rdvDate.isEmpty()) {
            // Récupérer le dossier pour une date spécifique
            LocalDate date = LocalDate.parse(rdvDate, formatter);
            dossiers = dossierRepo.findByPatientId(patientId).stream()
                    .filter(d -> d.getDateCreation() != null && d.getDateCreation().equals(date))
                    .collect(Collectors.toList());
        } else {
            // Récupérer tous les dossiers du patient
            dossiers = dossierRepo.findByPatientId(patientId);
        }

        return dossiers.stream()
                .map(this::toConsultationData)
                .collect(Collectors.toList());
    }

    @Override
    public ChatbotResponseDTO askChatbot(ChatbotRequestDTO request) {
        try {
            // Récupérer les consultations du patient
            List<ConsultationDataDTO> consultations = getConsultationsData(
                    request.getPatientId(),
                    request.getRdvDate());

            if (consultations.isEmpty()) {
                return ChatbotResponseDTO.builder()
                        .success(false)
                        .response("Aucune consultation trouvée pour ce patient.")
                        .timestamp(LocalDateTime.now().toString())
                        .build();
            }

            // Construire le contexte médical
            String contexteMedical = buildMedicalContext(consultations);

            // Construire le prompt système
            String systemPrompt = "Tu es un assistant médical bienveillant qui aide les patients à comprendre leurs consultations médicales.\n"
                    +
                    "Ton rôle est d'expliquer les informations médicales en langage simple, non technique, accessible à tous.\n\n"
                    +
                    "RÈGLES IMPORTANTES:\n" +
                    "- Utilise un langage simple et clair\n" +
                    "- Évite le jargon médical ou explique-le si nécessaire\n" +
                    "- Sois rassurant et bienveillant\n" +
                    "- Ne donne JAMAIS de nouveaux diagnostics ou traitements\n" +
                    "- Explique uniquement ce qui est dans les consultations fournies\n" +
                    "- Si la question n'a pas de réponse dans les données, dis-le clairement\n" +
                    "- Reste factuel et base-toi uniquement sur les informations médicales fournies";

            // Construire le prompt utilisateur
            String userPrompt = "INFORMATIONS MÉDICALES DU PATIENT:\n" +
                    contexteMedical + "\n\n" +
                    "QUESTION DU PATIENT:\n" + request.getQuestion() + "\n\n" +
                    "RÉPONDS à la question du patient en langage simple et clair, en te basant UNIQUEMENT sur les informations médicales ci-dessus.";

            // Appeler l'API OpenRouter
            String aiResponse = callOpenRouterApi(systemPrompt, userPrompt);

            return ChatbotResponseDTO.builder()
                    .success(true)
                    .response(aiResponse)
                    .timestamp(LocalDateTime.now().toString())
                    .build();

        } catch (Exception e) {
            e.printStackTrace(); // Afficher l'erreur dans les logs
            return ChatbotResponseDTO.builder()
                    .success(false)
                    .response("Erreur: " + e.getMessage())
                    .timestamp(LocalDateTime.now().toString())
                    .build();
        }
    }

    private String buildMedicalContext(List<ConsultationDataDTO> consultations) {
        StringBuilder contexteMedical = new StringBuilder();

        for (int i = 0; i < consultations.size(); i++) {
            ConsultationDataDTO consultation = consultations.get(i);
            contexteMedical.append("\n\n=== CONSULTATION ").append(i + 1)
                    .append(" - ").append(consultation.getDate()).append(" ===\n");

            if (consultation.getMotifConsultation() != null) {
                contexteMedical.append("Motif: ").append(consultation.getMotifConsultation()).append("\n");
            }

            if (consultation.getSymptomes() != null) {
                contexteMedical.append("Symptômes: ").append(consultation.getSymptomes()).append("\n");
            }

            if (consultation.getDiagnostic() != null) {
                contexteMedical.append("Diagnostic: ").append(consultation.getDiagnostic()).append("\n");
            }

            if (consultation.getTraitements() != null && !consultation.getTraitements().isEmpty()) {
                contexteMedical.append("Traitement:\n");
                for (int j = 0; j < consultation.getTraitements().size(); j++) {
                    TraitementSimpleDTO t = consultation.getTraitements().get(j);
                    contexteMedical.append("  ").append(j + 1).append(". ")
                            .append(t.getMedicament()).append(" - ").append(t.getDosage()).append("\n");
                    contexteMedical.append("     Durée: ").append(t.getDuree()).append("\n");
                    contexteMedical.append("     Instructions: ").append(t.getInstructions()).append("\n");
                }
            }

            if (consultation.getRecommandations() != null) {
                contexteMedical.append("Recommandations: ").append(consultation.getRecommandations()).append("\n");
            }
        }

        return contexteMedical.toString();
    }

    private String callOpenRouterApi(String systemPrompt, String userPrompt) {
        try {
            // Construire le corps de la requête OpenRouter (format OpenAI)
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", openRouterModel);

            // Messages
            List<Map<String, String>> messages = new ArrayList<>();
            messages.add(Map.of("role", "system", "content", systemPrompt));
            messages.add(Map.of("role", "user", "content", userPrompt));
            requestBody.put("messages", messages);

            // Configuration
            requestBody.put("temperature", 0.7);
            requestBody.put("max_tokens", 500);

            // Headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + openRouterApiKey);
            headers.set("HTTP-Referer", "http://localhost:3000"); // Optional
            headers.set("X-Title", "Cabinet Medical Chatbot"); // Optional

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            // Appeler l'API OpenRouter
            ResponseEntity<Map> response = restTemplate.exchange(
                    openRouterApiUrl,
                    HttpMethod.POST,
                    entity,
                    Map.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> responseBody = response.getBody();

                // Extraire la réponse: choices[0].message.content
                List<Map<String, Object>> choices = (List<Map<String, Object>>) responseBody.get("choices");
                if (choices != null && !choices.isEmpty()) {
                    Map<String, Object> choice = choices.get(0);
                    Map<String, String> message = (Map<String, String>) choice.get("message");
                    if (message != null && message.containsKey("content")) {
                        return message.get("content");
                    }
                }
            }

            throw new RuntimeException("Réponse OpenRouter invalide");

        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de l'appel à l'API OpenRouter: " + e.getMessage(), e);
        }
    }

    private ConsultationDataDTO toConsultationData(DossierPatient dossier) {
        List<TraitementSimpleDTO> traitements = new ArrayList<>();

        // Parser le JSON des traitements
        if (dossier.getTraitement() != null && !dossier.getTraitement().isEmpty()) {
            try {
                List<Map<String, String>> traitementsJson = objectMapper.readValue(
                        dossier.getTraitement(),
                        new TypeReference<List<Map<String, String>>>() {
                        });

                traitements = traitementsJson.stream()
                        .map(t -> TraitementSimpleDTO.builder()
                                .medicament(t.get("medicament"))
                                .dosage(t.get("dosage"))
                                .duree(t.get("duree"))
                                .instructions(t.get("instructions"))
                                .build())
                        .collect(Collectors.toList());
            } catch (Exception e) {
                // Ignorer les erreurs de parsing
            }
        }

        return ConsultationDataDTO.builder()
                .date(dossier.getDateCreation() != null ? dossier.getDateCreation().format(formatter) : "")
                .motifConsultation(dossier.getMotifConsultation())
                .symptomes(dossier.getSymptomes())
                .diagnostic(dossier.getDiagnostic())
                .traitements(traitements)
                .recommandations(dossier.getRecommandations())
                .build();
    }
}
