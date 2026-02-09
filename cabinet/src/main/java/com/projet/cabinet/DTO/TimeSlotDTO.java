package com.projet.cabinet.DTO;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TimeSlotDTO {

    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private boolean available;
    private String label; // ex: "09:00 - 09:30"
}
