package com.projet.cabinet.Service;

import com.projet.cabinet.DTO.PatientDTO;
import java.util.List;

public interface PatientService {

    PatientDTO getPatient(Long id);

    List<PatientDTO> getAllPatients();

    PatientDTO updatePatient(Long id, PatientDTO dto);

    void deletePatient(Long id);

    List<PatientDTO> getPatientsForCurrentAssistant();
}
