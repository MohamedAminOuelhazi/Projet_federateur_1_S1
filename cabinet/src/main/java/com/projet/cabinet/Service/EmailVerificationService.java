package com.projet.cabinet.Service;

import com.projet.cabinet.Entity.VerificationCode;
import com.projet.cabinet.Repository.VerificationCodeRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailVerificationService {

    private final VerificationCodeRepository verificationCodeRepository;
    private final JavaMailSender mailSender;
    private final SecureRandom random = new SecureRandom();

    @Value("${spring.mail.username:noreply@cabinet-medical.com}")
    private String fromEmail;

    @Value("${app.name:Cabinet Médical}")
    private String appName;

    /**
     * Générer et envoyer un code de vérification à 4 chiffres
     */
    @Transactional
    public String sendVerificationCode(String email) throws MessagingException {
        // Supprimer les anciens codes pour cet email
        verificationCodeRepository.deleteByEmail(email);

        // Générer un code à 4 chiffres
        String code = String.format("%04d", random.nextInt(10000));

        // Créer l'entité de vérification (expire dans 15 minutes)
        VerificationCode verificationCode = VerificationCode.builder()
                .email(email)
                .code(code)
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusMinutes(15))
                .verified(false)
                .build();

        verificationCodeRepository.save(verificationCode);

        // Envoyer l'email
        sendVerificationEmail(email, code);

        log.info("📧 Code de vérification envoyé à {}", email);
        return code;
    }

    /**
     * Vérifier un code de vérification
     */
    @Transactional
    public boolean verifyCode(String email, String code) {
        Optional<VerificationCode> verificationOpt = verificationCodeRepository
                .findByEmailAndCodeAndVerifiedFalse(email, code);

        if (verificationOpt.isEmpty()) {
            log.warn("❌ Code invalide pour {}", email);
            return false;
        }

        VerificationCode verification = verificationOpt.get();

        if (verification.isExpired()) {
            log.warn("❌ Code expiré pour {}", email);
            return false;
        }

        // Marquer comme vérifié
        verification.setVerified(true);
        verificationCodeRepository.save(verification);

        log.info("✅ Email vérifié: {}", email);
        return true;
    }

    /**
     * Envoyer l'email avec le code de vérification
     */
    @Async
    private void sendVerificationEmail(String to, String code) throws MessagingException {
        String subject = "✅ Code de vérification - " + appName;
        String content = buildVerificationEmailTemplate(code);

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(content, true);

        mailSender.send(message);
    }

    /**
     * Template HTML pour l'email de vérification
     */
    private String buildVerificationEmailTemplate(String code) {
        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f5f5f5; }
                        .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                        .header { background: linear-gradient(135deg, #1E40AF 0%%, #3B82F6 100%%); color: white; padding: 40px; text-align: center; }
                        .content { padding: 40px; }
                        .code-box { background: #f0f9ff; border: 2px dashed #3B82F6; border-radius: 10px; padding: 30px; text-align: center; margin: 30px 0; }
                        .code { font-size: 48px; font-weight: bold; color: #1E40AF; letter-spacing: 10px; font-family: 'Courier New', monospace; }
                        .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 12px; }
                        .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 5px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🏥 %s</h1>
                            <p>Vérification de votre adresse email</p>
                        </div>
                        <div class="content">
                            <p>Bonjour,</p>

                            <p>Merci de vous être inscrit sur <strong>%s</strong> !</p>

                            <p>Pour finaliser votre inscription, veuillez utiliser le code de vérification suivant :</p>

                            <div class="code-box">
                                <div class="code">%s</div>
                            </div>

                            <div class="warning">
                                <p><strong>⚠️ Important :</strong></p>
                                <ul style="margin: 10px 0; padding-left: 20px;">
                                    <li>Ce code est valide pendant <strong>15 minutes</strong></li>
                                    <li>Ne partagez ce code avec personne</li>
                                    <li>Si vous n'avez pas demandé ce code, ignorez cet email</li>
                                </ul>
                            </div>

                            <p>Si vous rencontrez des difficultés, n'hésitez pas à nous contacter.</p>

                            <p>Cordialement,<br>L'équipe %s</p>
                        </div>
                        <div class="footer">
                            <p>Cet email a été envoyé automatiquement. Merci de ne pas y répondre.</p>
                            <p>© 2026 %s - Tous droits réservés</p>
                        </div>
                    </div>
                </body>
                </html>
                """
                .formatted(appName, appName, code, appName, appName);
    }

    /**
     * Nettoyer les codes expirés (à appeler périodiquement)
     */
    @Transactional
    public void cleanupExpiredCodes() {
        verificationCodeRepository.deleteByExpiresAtBefore(LocalDateTime.now());
        log.info("🧹 Codes expirés nettoyés");
    }
}
