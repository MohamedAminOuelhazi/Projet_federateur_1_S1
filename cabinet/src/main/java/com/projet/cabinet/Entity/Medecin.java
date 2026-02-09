package com.projet.cabinet.Entity;

import lombok.*;
import jakarta.persistence.*;
import java.util.List;

@Entity
@DiscriminatorValue("MEDECIN")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Medecin extends user {

    private String specialite;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 500)
    private String photoUrl;

    @OneToMany(mappedBy = "medecin", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Assistant> assistants;

    @OneToMany(mappedBy = "medecin", cascade = CascadeType.ALL)
    private List<RendezVous> rendezVous;
}
