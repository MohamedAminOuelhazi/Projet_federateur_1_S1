package com.projet.cabinet.Service;

import com.projet.cabinet.Entity.Patient;
import com.projet.cabinet.Entity.PreferenceNotification;
import com.projet.cabinet.Entity.RendezVous;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.projet.cabinet.Repository.RendezVousRepository;
import com.projet.cabinet.Repository.PreferenceNotificationRepository;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationEmailService {

    private final JavaMailSender mailSender;
    private final RendezVousRepository rendezVousRepository;
    private final PreferenceNotificationRepository preferenceRepository;
    private final NotificationService notificationService;

    @Value("${spring.mail.username:noreply@cabinet-medical.com}")
    private String fromEmail;

    @Value("${app.name:Cabinet Médical}")
    private String appName;

    /**
     * Tâche planifiée : Envoie des rappels tous les jours à 9h
     */
    @Scheduled(cron = "0 0 9 * * ?") // Tous les jours à 9h00
    public void sendScheduledReminders() {
        log.info("🔔 Démarrage de l'envoi des rappels automatiques...");

        // Récupérer tous les rendez-vous futurs
        List<RendezVous> rdvsFuturs = rendezVousRepository.findByDateHeureAfter(LocalDateTime.now());

        int emailsEnvoyes = 0;
        int notificationsInternes = 0;

        for (RendezVous rdv : rdvsFuturs) {
            if (rdv.getPatient() == null)
                continue;

            Patient patient = rdv.getPatient();

            // Récupérer les préférences du patient
            PreferenceNotification preference = preferenceRepository
                    .findByUserId(patient.getId())
                    .orElse(PreferenceNotification.builder()
                            .delaiRappelHeures(24)
                            .emailActif(true)
                            .notificationInterneActive(true)
                            .build());

            // Calculer le délai avant le RDV
            LocalDateTime maintenant = LocalDateTime.now();
            long heuresAvantRdv = java.time.Duration.between(maintenant, rdv.getDateHeure()).toHours();

            // Vérifier si c'est le moment d'envoyer le rappel
            // Tolérance de ±2 heures pour éviter les doublons
            int delai = preference.getDelaiRappelHeures();
            if (heuresAvantRdv >= (delai - 2) && heuresAvantRdv <= (delai + 2)) {

                // Envoyer email si activé
                if (Boolean.TRUE.equals(preference.getEmailActif())) {
                    try {
                        sendReminderEmail(rdv, patient, preference);
                        emailsEnvoyes++;
                        log.info("✅ Email envoyé à {} pour RDV #{}", patient.getEmail(), rdv.getId());
                    } catch (Exception e) {
                        log.error("❌ Erreur envoi email pour RDV #{}: {}", rdv.getId(), e.getMessage());
                    }
                }

                // Envoyer notification interne si activée
                if (Boolean.TRUE.equals(preference.getNotificationInterneActive())) {
                    try {
                        com.projet.cabinet.DTO.NotificationDTO notifDTO = com.projet.cabinet.DTO.NotificationDTO
                                .builder()
                                .titre("Rappel de rendez-vous")
                                .message(String.format("Votre rendez-vous avec Dr. %s %s est prévu le %s",
                                        rdv.getMedecin().getPrenom(),
                                        rdv.getMedecin().getNom(),
                                        rdv.getDateHeure().format(DateTimeFormatter.ofPattern("dd/MM/yyyy à HH:mm"))))
                                .type("RAPPEL")
                                .userId(patient.getId())
                                .rendezVousId(rdv.getId())
                                .patientId(patient.getId())
                                .build();
                        notificationService.createNotification(notifDTO);
                        notificationsInternes++;
                        log.info("✅ Notification interne créée pour patient #{}", patient.getId());
                    } catch (Exception e) {
                        log.error("❌ Erreur création notification interne: {}", e.getMessage());
                    }
                }
            }
        }

        log.info("✨ Rappels envoyés: {} emails, {} notifications internes", emailsEnvoyes, notificationsInternes);
    }

    /**
     * Envoyer un email de rappel pour un rendez-vous
     */
    @Async
    public void sendReminderEmail(RendezVous rdv, Patient patient, PreferenceNotification preference)
            throws MessagingException {

        String destinataire = preference.getEmailPersonnalise() != null
                ? preference.getEmailPersonnalise()
                : patient.getEmail();

        String sujet = "🔔 Rappel de rendez-vous - " + appName;
        String contenu = buildReminderEmailTemplate(rdv, patient);

        sendHtmlEmail(destinataire, sujet, contenu);
    }

    /**
     * Template HTML pour l'email de rappel
     */
    private String buildReminderEmailTemplate(RendezVous rdv, Patient patient) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("EEEE dd MMMM yyyy 'à' HH'h'mm");
        String dateFormattee = rdv.getDateHeure().format(formatter);

        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #1E40AF 0%%, #3B82F6 100%%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
                        .info-box { background: white; border-left: 4px solid #3B82F6; padding: 15px; margin: 20px 0; border-radius: 5px; }
                        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px; }
                        .button { display: inline-block; background: #1E40AF; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🏥 %s</h1>
                            <p>Rappel de rendez-vous</p>
                        </div>
                        <div class="content">
                            <p>Bonjour <strong>%s %s</strong>,</p>

                            <p>Nous vous rappelons votre rendez-vous médical :</p>

                            <div class="info-box">
                                <p><strong>📅 Date et heure :</strong> %s</p>
                                <p><strong>👨‍⚕️ Médecin :</strong> Dr. %s %s</p>
                                <p><strong>📋 Motif :</strong> %s</p>
                            </div>

                            <p><strong>⚠️ Important :</strong></p>
                            <ul>
                                <li>Merci d'arriver 10 minutes en avance</li>
                                <li>N'oubliez pas votre carte vitale et votre mutuelle</li>
                                <li>En cas d'empêchement, merci de nous prévenir au moins 24h à l'avance</li>
                            </ul>

                            <p>À très bientôt !</p>

                            <div class="footer">
                                <p>Cet email a été envoyé automatiquement. Merci de ne pas y répondre.</p>
                                <p>© 2026 %s - Tous droits réservés</p>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
                """
                .formatted(
                        appName,
                        patient.getPrenom(),
                        patient.getNom(),
                        dateFormattee,
                        rdv.getMedecin().getPrenom(),
                        rdv.getMedecin().getNom(),
                        rdv.getMotif() != null ? rdv.getMotif() : "Consultation",
                        appName);
    }

    /**
     * Envoyer un email de confirmation lors de la création d'un RDV
     */
    @Async
    public void sendConfirmationEmail(RendezVous rdv) throws MessagingException {
        Patient patient = rdv.getPatient();
        if (patient == null || patient.getEmail() == null)
            return;

        String sujet = "✅ Confirmation de rendez-vous - " + appName;
        String contenu = buildConfirmationEmailTemplate(rdv);

        sendHtmlEmail(patient.getEmail(), sujet, contenu);
        log.info("📧 Email de confirmation envoyé à {}", patient.getEmail());
    }

    /**
     * Template HTML pour l'email de confirmation
     */
    private String buildConfirmationEmailTemplate(RendezVous rdv) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("EEEE dd MMMM yyyy 'à' HH'h'mm");
        String dateFormattee = rdv.getDateHeure().format(formatter);
        Patient patient = rdv.getPatient();

        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #10b981 0%%, #059669 100%%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
                        .info-box { background: white; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 5px; }
                        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>✅ Rendez-vous confirmé</h1>
                        </div>
                        <div class="content">
                            <p>Bonjour <strong>%s %s</strong>,</p>

                            <p>Votre rendez-vous a été confirmé avec succès :</p>

                            <div class="info-box">
                                <p><strong>📅 Date et heure :</strong> %s</p>
                                <p><strong>👨‍⚕️ Médecin :</strong> Dr. %s %s</p>
                                <p><strong>📋 Motif :</strong> %s</p>
                            </div>

                            <p>Vous recevrez un rappel avant votre rendez-vous.</p>

                            <p>Cordialement,<br>L'équipe %s</p>

                            <div class="footer">
                                <p>© 2026 %s - Tous droits réservés</p>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
                """
                .formatted(
                        patient.getPrenom(),
                        patient.getNom(),
                        dateFormattee,
                        rdv.getMedecin().getPrenom(),
                        rdv.getMedecin().getNom(),
                        rdv.getMotif() != null ? rdv.getMotif() : "Consultation",
                        appName,
                        appName);
    }

    /**
     * * Envoyer un email pour activation du compte assistant
     */
    @Async
    public void sendAccountActivationEmail(String toEmail, String assistantName) {
        try {
            String subject = "✅ Compte activé - " + appName;
            String htmlContent = buildAccountStatusEmail(assistantName, true);
            sendHtmlEmail(toEmail, subject, htmlContent);
            log.info("✅ Email d'activation envoyé à {}", toEmail);
        } catch (Exception e) {
            log.error("❌ Erreur envoi email activation: {}", e.getMessage());
        }
    }

    /**
     * Envoyer un email pour désactivation du compte assistant
     */
    @Async
    public void sendAccountDeactivationEmail(String toEmail, String assistantName) {
        try {
            String subject = "⚠️ Compte désactivé - " + appName;
            String htmlContent = buildAccountStatusEmail(assistantName, false);
            sendHtmlEmail(toEmail, subject, htmlContent);
            log.info("✅ Email de désactivation envoyé à {}", toEmail);
        } catch (Exception e) {
            log.error("❌ Erreur envoi email désactivation: {}", e.getMessage());
        }
    }

    /**
     * Construire le HTML pour l'email de changement de statut du compte
     */
    private String buildAccountStatusEmail(String assistantName, boolean isActivation) {
        String status = isActivation ? "activé" : "désactivé";
        String emoji = isActivation ? "✅" : "⚠️";
        String color = isActivation ? "#10b981" : "#ef4444";
        String message = isActivation
                ? "Votre compte a été activé par le médecin. Vous pouvez maintenant vous connecter au système."
                : "Votre compte a été désactivé par le médecin. Vous ne pouvez plus accéder au système. Contactez votre médecin pour plus d'informations.";

        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "    <meta charset='UTF-8'>" +
                "    <style>" +
                "        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }"
                +
                "        .container { max-width: 600px; margin: 0 auto; background: #ffffff; }" +
                "        .header { background: linear-gradient(135deg, " + color + " 0%, " + color
                + "dd 100%); color: white; padding: 40px 20px; text-align: center; }" +
                "        .content { padding: 30px 20px; }" +
                "        .status-box { background: #f8f9fa; border-left: 4px solid " + color
                + "; padding: 20px; margin: 20px 0; border-radius: 4px; }" +
                "        .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }"
                +
                "        .btn { display: inline-block; padding: 12px 30px; background: " + color
                + "; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }" +
                "        h1 { margin: 0; font-size: 28px; }" +
                "        .emoji { font-size: 48px; margin-bottom: 10px; }" +
                "    </style>" +
                "</head>" +
                "<body>" +
                "    <div class='container'>" +
                "        <div class='header'>" +
                "            <div class='emoji'>" + emoji + "</div>" +
                "            <h1>Compte " + status + "</h1>" +
                "        </div>" +
                "        <div class='content'>" +
                "            <p>Bonjour <strong>" + assistantName + "</strong>,</p>" +
                "            <div class='status-box'>" +
                "                <p><strong>Statut du compte :</strong> " + status.toUpperCase() + "</p>" +
                "                <p>" + message + "</p>" +
                "            </div>" +
                "            <p>Si vous avez des questions, n'hésitez pas à contacter votre médecin.</p>" +
                "        </div>" +
                "        <div class='footer'>" +
                "            <p>&copy; 2025 " + appName + ". Tous droits réservés.</p>" +
                "            <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>" +
                "        </div>" +
                "    </div>" +
                "</body>" +
                "</html>";
    }

    /**
     * * Méthode utilitaire pour envoyer un email HTML
     */
    private void sendHtmlEmail(String to, String subject, String htmlContent) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true);

        mailSender.send(message);
    }
}
