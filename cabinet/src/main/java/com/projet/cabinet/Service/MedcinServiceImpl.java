package com.projet.cabinet.Service;

import com.projet.cabinet.DTO.MedecinDTO;
import com.projet.cabinet.Entity.Medecin;
import com.projet.cabinet.Repository.MedecinRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class MedcinServiceImpl implements MedcinService {

    @Autowired
    MedecinRepository medecinRepository;

    @Override
    public MedecinDTO getMedcin(Long id) {
        Medecin m = medecinRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Medecin not found"));
        return toDTO(m);
    }

    @Override
    public List<MedecinDTO> getAllMedcins() {
        return medecinRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public MedecinDTO updateMedcin(Long id, MedecinDTO dto) {
        Medecin m = medecinRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Medecin not found"));
        m.setNom(dto.getNom());
        m.setPrenom(dto.getPrenom());
        m.setTelephone(dto.getTelephone());
        m.setSpecialite(dto.getSpecialite());
        m.setEmail(dto.getEmail());
        return toDTO(medecinRepository.save(m));
    }

    @Override
    public void deleteMedcin(Long id) {
        medecinRepository.deleteById(id);
    }

    private MedecinDTO toDTO(Medecin m) {
        return MedecinDTO.builder()
                .id(m.getId())
                .username(m.getUsername())
                .nom(m.getNom())
                .prenom(m.getPrenom())
                .email(m.getEmail())
                .telephone(m.getTelephone())
                .specialite(m.getSpecialite())
                .build();
    }
}
