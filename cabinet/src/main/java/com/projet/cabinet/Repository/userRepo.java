package com.projet.cabinet.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.projet.cabinet.Entity.user;

@Repository
public interface userRepo extends JpaRepository<user, Long> {

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    Optional<user> findByEmail(String email);

    Optional<user> findByUsername(String username);

    List<user> findByUsertype(String usertype);

}
