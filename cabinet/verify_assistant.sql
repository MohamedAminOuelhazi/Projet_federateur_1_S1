-- Vérifier les assistants et leurs médecins associés
SELECT 
    u.id AS assistant_id,
    u.username AS assistant_username,
    u.nom AS assistant_nom,
    u.prenom AS assistant_prenom,
    a.medecin_id AS medecin_id,
    m.nom AS medecin_nom,
    m.prenom AS medecin_prenom
FROM user u
LEFT JOIN assistant a ON u.id = a.id
LEFT JOIN user m ON a.medecin_id = m.id
WHERE u.dtype = 'ASSISTANT';

-- Vérifier les rendez-vous
SELECT 
    r.id AS rdv_id,
    r.date_heure,
    r.statut,
    r.medecin_id,
    r.assistant_id,
    r.patient_id,
    m.nom AS medecin_nom,
    p.nom AS patient_nom
FROM rendez_vous r
LEFT JOIN user m ON r.medecin_id = m.id
LEFT JOIN user p ON r.patient_id = p.id
ORDER BY r.date_heure;
