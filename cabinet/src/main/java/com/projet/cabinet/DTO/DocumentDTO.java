package com.projet.cabinet.DTO;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentDTO {
    private Long id;
    private String filename;
    private String contentType;
    private Long size;
    private String path;
    private LocalDateTime uploadedAt;
}
