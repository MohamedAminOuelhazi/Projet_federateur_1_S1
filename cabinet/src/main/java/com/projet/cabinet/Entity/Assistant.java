package com.projet.cabinet.Entity;

import lombok.*;
import jakarta.persistence.*;

@Entity
@DiscriminatorValue("ASSISTANT")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Assistant extends user {

    private boolean active = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "medecin_id")
    private Medecin medecin;

}
