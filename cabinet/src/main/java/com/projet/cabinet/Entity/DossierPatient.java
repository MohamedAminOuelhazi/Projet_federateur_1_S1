package com.projet.cabinet.Entity;

import lombok.*;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DossierPatient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate dateCreation;

    @Lob
    private String description;

    @Lob
    private String motifConsultation;

    @Lob
    private String symptomes;

    @Lob
    private String diagnostic;

    @Lob
    private String traitement; // JSON array of medications

    @Lob
    private String observations;

    @Lob
    private String recommandations;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "medecin_id")
    private Medecin medecin;

    @OneToOne
    @JoinColumn(name = "rendezvous_id")
    private RendezVous rendezVous;
}
