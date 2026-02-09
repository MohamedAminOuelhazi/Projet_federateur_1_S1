@echo off
echo ====================================================
echo Script de Commentaire des Images Manquantes
echo ====================================================
echo.

REM Sauvegarde des fichiers originaux
echo [1/3] Sauvegarde des fichiers originaux...
for %%f in (chapter\*-NOUVEAU.tex) do (
    copy "%%f" "%%f.backup" >nul
)
echo Sauvegarde terminee.
echo.

REM Commentaire des images manquantes avec PowerShell
echo [2/3] Commentaire des images manquantes...
powershell -Command "$files = Get-ChildItem -Path 'chapter\*-NOUVEAU.tex'; foreach ($file in $files) { $content = Get-Content $file.FullName -Raw; $missing = @('nextjs-logo.png', 'tailwind-logo.png', 'java-logo.png', 'openai-logo.png', 'git-logo.png', 'maven-logo.png', 'sprint3-patient-usecase.png', 'sequence-inscription-patient.png', 'sequence-chatbot-openai.png', 'architecture-chatbot.png', 'class-diagram-sprint3.png', 'inscription-patient.png', 'email-verification.png', 'verification-succes.png', 'dashboard-patient.png', 'liste-dossiers-patient.png', 'detail-dossier-patient.png', 'telechargement-document.png', 'chatbot-interface.png', 'chatbot-conversation.png', 'chatbot-alerte.png', 'sprint2-assistant-usecase.png', 'sequence-rbac-assistant.png', 'class-diagram-sprint2.png', 'login-assistant.png', 'dashboard-assistant.png', 'liste-patients-assistant.png', 'creer-patient-assistant.png', 'calendrier-assistant.png', 'creer-rendezvous-assistant.png', 'conflit-rendezvous.png', 'liste-factures-assistant.png', 'creer-facture-assistant.png', 'acces-interdit-assistant.png', 'sprint1-medecin-usecase.png', 'sequence-authentification.png', 'sequence-creer-assistant.png', 'sequence-creer-rendezvous.png', 'sequence-modifier-dossier.png', 'sequence-upload-documents.png', 'sequence-creer-facture.png', 'sequence-paiement-facture.png', 'class-diagram-sprint1.png', 'login-medecin.png', 'dashboard-medecin.png', 'liste-patients-medecin.png', 'profil-patient-medecin.png', 'calendrier-medecin.png', 'creer-rendezvous-medecin.png', 'liste-rendezvous-medecin.png', 'liste-assistants.png', 'creer-assistant.png', 'modifier-dossier-medical.png', 'historique-dossiers.png', 'upload-documents.png', 'liste-factures.png', 'creer-facture.png', 'enregistrer-paiement.png', 'rapports-financiers.png', 'filtres-rapports.png', 'profil-medecin.png', 'parametres-cabinet.png', 'use-case-cabinet-medical.png', 'class-diagram-cabinet-medical.png', 'gantt-cabinet-medical.png', 'architecture-3-tiers-cabinet.png', 'mvc-cabinet-medical.png'); foreach ($img in $missing) { $content = $content -replace \"(\\\\includegraphics\[.*?\]\{images/$img\})\", '% IMAGE COMMENTEE: $1'; $content = $content -replace \"(\\\\begin\{figure\}\[H\]\s*\\\\centering\s*% IMAGE COMMENTEE:.*?$img.*?\\\\caption\{.*?\}.*?\\\\label\{.*?\}.*?\\\\end\{figure\})\", '%$1' -replace \"`r`n\", \"`n\"; }; Set-Content -Path $file.FullName -Value $content -NoNewline; }"

echo Commentaire termine.
echo.

REM Compilation LaTeX
echo [3/3] Compilation LaTeX...
pdflatex -interaction=nonstopmode main.tex
pdflatex -interaction=nonstopmode main.tex
pdflatex -interaction=nonstopmode main.tex
echo.

echo ====================================================
echo TERMINE !
echo ====================================================
echo Les fichiers de sauvegarde se trouvent dans chapter\*-NOUVEAU.tex.backup
echo Le PDF genere : main.pdf
echo.
pause
