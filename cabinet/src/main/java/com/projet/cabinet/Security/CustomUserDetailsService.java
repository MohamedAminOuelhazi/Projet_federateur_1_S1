package com.projet.cabinet.Security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.projet.cabinet.Repository.userRepo;
import com.projet.cabinet.Entity.user;
import com.projet.cabinet.Entity.Assistant;

import java.util.Collection;
import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private userRepo userRepo;

    @Autowired
    public CustomUserDetailsService(userRepo userRepo) {
        this.userRepo = userRepo;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        user user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Username not found"));

        // Vérifier si c'est un assistant désactivé
        if (user instanceof Assistant) {
            Assistant assistant = (Assistant) user;
            if (!assistant.isActive()) {
                throw new UsernameNotFoundException("Compte désactivé. Contactez votre médecin.");
            }
        }

        return new User(user.getUsername(), user.getMotDePasse(), mapRolesToAuthorities(user));
    }

    private Collection<GrantedAuthority> mapRolesToAuthorities(user user) {
        String userType = user.getUsertype();
        System.out.println("Mapping roles for userType: " + userType);

        Collection<GrantedAuthority> authorities;
        if ("MEDECIN".equals(userType)) {
            authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_MEDECIN"));
        } else if ("ASSISTANT".equals(userType)) {
            authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_ASSISTANT"));
        } else if ("PATIENT".equals(userType)) {
            authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_PATIENT"));
        } else {
            System.out.println("WARNING: Unknown user type: " + userType);
            authorities = Collections.emptyList();
        }

        System.out.println("Granted authorities: " + authorities);
        return authorities;
    }

}
