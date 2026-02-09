package com.projet.cabinet.Service;

import java.util.List;

import com.projet.cabinet.DTO.MedecinDTO;
import com.projet.cabinet.DTO.PatientDTO;

public interface MedcinService {

    MedecinDTO getMedcin(Long id);

    List<MedecinDTO> getAllMedcins();

    MedecinDTO updateMedcin(Long id, MedecinDTO dto);

    void deleteMedcin(Long id);
}
