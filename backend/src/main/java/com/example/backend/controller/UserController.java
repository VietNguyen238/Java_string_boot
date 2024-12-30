package com.example.backend.controller;

import com.example.backend.dto.UserRequest;
import com.example.backend.models.Company;
import com.example.backend.models.Role;
import com.example.backend.models.User;
import com.example.backend.response.UserResponse;
import com.example.backend.services.UserService;
import com.example.backend.utils.ApiResponse;
import com.fasterxml.jackson.annotation.JsonInclude;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserController {
    @Autowired
    private UserService userService;

    // Lấy danh sách tất cả User
    @GetMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ApiResponse<List<UserResponse>> getUsers() {
        List<User> users = userService.getAllUsers();

        List<UserResponse> userResponses = users.stream().map(user -> {
            String company = (user.getCompany() != null) ? user.getCompany().getName() : null;
            return new UserResponse(
                    user.getId(),
                    user.getFirstname(),
                    user.getLastname(),
                    user.getEmail(),
                    company,
                    user.getRoles().stream().map(role -> role.getName()).collect(Collectors.toList())
            );
        }).collect(Collectors.toList());

        return new ApiResponse<>("Success", 200, userResponses);
    }


    // Lấy thông tin chi tiết của 1 User theo ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ApiResponse<UserResponse> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);

        if (user == null) {
            return new ApiResponse("Not found", 404);
        }
        String company = (user.getCompany() != null) ? user.getCompany().getName() : null;
        UserResponse userResponse = new UserResponse(
                user.getId(),
                user.getFirstname(),
                user.getLastname(),
                user.getEmail(),
                company,
                user.getRoles().stream().map(role -> role.getName()).collect(Collectors.toList())
        );

        return new ApiResponse<>("Success", 200, userResponse);
    }

    // Tạo mới User
    @PostMapping("/create")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ApiResponse<UserResponse> createUser(@RequestBody UserRequest userRequest) {
        User createdUser = userService.createUser(userRequest);

        String company = (createdUser.getCompany() != null) ? createdUser.getCompany().getName() : null;
        UserResponse userResponse = new UserResponse(
                createdUser.getId(),
                createdUser.getFirstname(),
                createdUser.getLastname(),
                createdUser.getEmail(),
                company,
                createdUser.getRoles().stream().map(Role::getName).collect(Collectors.toList()) // Chuyển từ Set sang List
        );

        return new ApiResponse<>("User created successfully", 201, userResponse);
    }


    // Cập nhật User theo ID
    @PutMapping("/update/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ApiResponse<UserResponse> updateUser(@PathVariable Long id, @RequestBody UserRequest userRequest) {
        // Tạo đối tượng User từ UserRequest
        User userToUpdate = new User();
        userToUpdate.setFirstname(userRequest.getFirstname());
        userToUpdate.setLastname(userRequest.getLastname());
        userToUpdate.setEmail(userRequest.getEmail());

        // Gắn công ty nếu có
        if (userRequest.getCompanyId() != null) {
            Company company = new Company();
            company.setId(userRequest.getCompanyId());
            userToUpdate.setCompany(company);
        }

        // Gắn danh sách roles nếu có
        if (userRequest.getRoleIds() != null) {
            Set<Role> roles = userRequest.getRoleIds().stream().map(roleId -> {
                Role role = new Role();
                role.setId(roleId);
                return role;
            }).collect(Collectors.toSet());
            userToUpdate.setRoles(roles);
        }

        // Gọi service để cập nhật user
        User updatedUser = userService.updateUser(id, userToUpdate);

        // Tạo UserResponse để trả về
        String company = (updatedUser.getCompany() != null) ? updatedUser.getCompany().getName()     : null;
        UserResponse userResponse = new UserResponse(
                updatedUser.getId(),
                updatedUser.getFirstname(),
                updatedUser.getLastname(),
                updatedUser.getEmail(),
                company,
                updatedUser.getRoles().stream().map(role -> role.getName()).collect(Collectors.toList())
        );

        return new ApiResponse<>("User updated successfully", 200, userResponse);
    }


    // Xóa User theo ID
    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ApiResponse<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return new ApiResponse<>("User deleted successfully", 200);
    }
}

