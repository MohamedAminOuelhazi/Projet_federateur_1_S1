package com.projet.cabinet.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.projet.cabinet.DTO.MedecinDTO;
import com.projet.cabinet.DTO.RegisterDto;
import com.projet.cabinet.Entity.user;
import com.projet.cabinet.Service.MedcinService;
import com.projet.cabinet.Service.UserService;

import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/medcins")
@CrossOrigin("*")
public class MedcinController {

    @Autowired
    MedcinService medcinService;

    @Autowired
    UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<MedecinDTO> get(@PathVariable Long id) {
        return ResponseEntity.ok(medcinService.getMedcin(id));
    }

    @GetMapping("/allMedcins")
    public ResponseEntity<List<MedecinDTO>> list() {
        return ResponseEntity.ok(medcinService.getAllMedcins());
    }

    @PutMapping("/{id}")
    public ResponseEntity<MedecinDTO> update(@PathVariable Long id, @Valid @RequestBody MedecinDTO dto) {
        return ResponseEntity.ok(medcinService.updateMedcin(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        medcinService.deleteMedcin(id);
        return ResponseEntity.noContent().build();
    }

}
