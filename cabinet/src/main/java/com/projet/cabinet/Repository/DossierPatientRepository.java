package com.projet.cabinet.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.projet.cabinet.Entity.DossierPatient;
import java.util.List;

public interface DossierPatientRepository extends JpaRepository<DossierPatient, Long> {
    List<DossierPatient> findByPatientId(Long patientId);

    DossierPatient findByRendezVousId(Long rdvId);
}
