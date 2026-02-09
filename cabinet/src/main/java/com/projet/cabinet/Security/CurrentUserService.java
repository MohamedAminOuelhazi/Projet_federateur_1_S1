package com.projet.cabinet.Security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import com.projet.cabinet.Entity.user;
import com.projet.cabinet.Repository.userRepo;

@Service
public class CurrentUserService {
    @Autowired
    private userRepo userRepo;

    public user getCurrentUser(UserDetails userDetails) {
        return userRepo.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
    }
}