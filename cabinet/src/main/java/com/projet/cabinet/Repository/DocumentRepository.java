package com.projet.cabinet.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.projet.cabinet.Entity.Document;
import java.util.List;

public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByDossierId(Long dossierId);
}
