package com.projet.cabinet.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PreferenceNotificationDTO {

    private Long id;
    private Long userId;
    private Integer delaiRappelHeures; // 24, 48, 168 (1 semaine), etc.
    private Boolean emailActif;
    private Boolean notificationInterneActive;
    private String emailPersonnalise;
}
