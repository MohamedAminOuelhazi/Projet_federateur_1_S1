package com.projet.cabinet.Service;

import com.projet.cabinet.DTO.UserDTO;
import com.projet.cabinet.Entity.user;
import com.projet.cabinet.DTO.RegisterDto;

import java.util.List;

public interface UserService {

    user createUser(RegisterDto registerDto, String usertype);

    UserDTO getUserById(Long id);

    List<UserDTO> getAllUsers();

    UserDTO updateUser(Long id, UserDTO dto);

    void deleteUser(Long id);

    boolean changePassword(String username, String oldPassword, String newPassword);

    boolean toggleUserActivation(Long userId);
}
