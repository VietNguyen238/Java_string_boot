package com.example.backend.services;

import com.example.backend.dto.CompanyRequest;
import com.example.backend.models.Company;
import com.example.backend.models.User;
import com.example.backend.repositories.CompanyRepository;
import com.example.backend.repositories.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CompanyService {
    @Autowired
    CompanyRepository companyRepository;
    @Autowired
    private UserRepository userRepository;

    public void saveOrUpdate(Company company) {
        companyRepository.save(company);
    }

    public List<Company> getAllCompany() {
        return companyRepository.findAll();
    }

    public Company getCompanyById(Long id) {
        return companyRepository.findById(Math.toIntExact(id))
                .orElseThrow(() -> new HttpClientErrorException(HttpStatusCode.valueOf(404), "Company not found with id: " + id));
    }

    public Company createCompany(CompanyRequest companyRequest) {
        Company newCompany = new Company();
        newCompany.setName(companyRequest.getName());

        if (companyRequest.getUsers() != null) {
            List<User> usersToAssociate = companyRequest.getUsers().stream()
                    .map(userId -> {
                        User user = userRepository.findById(userId)
                                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));
                        user.setCompany(newCompany);
                        return user;
                    })
                    .collect(Collectors.toList());

            newCompany.setUsers(usersToAssociate);
        }

        companyRepository.save(newCompany);
        return newCompany;
    }


    public Company updateCompany(Long id, CompanyRequest companyRequest) {
        Company existingCompany = getCompanyById(id);
        existingCompany.setName(companyRequest.getName());

        // Retrieve current users of the company
        List<User> currentUsers = existingCompany.getUsers();
        List<Long> currentUserIds = currentUsers.stream()
                .map(User::getId)
                .collect(Collectors.toList());

        // Get the new user IDs from the request
        List<Long> newUserIds = companyRequest.getUsers();

        // Add new users (users in the request but not in the current list)
        List<User> usersToAdd = newUserIds.stream()
                .filter(userId -> !currentUserIds.contains(userId))
                .map(userId -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));
                    user.setCompany(existingCompany); // Associate user with the company
                    return user;
                })
                .collect(Collectors.toList());

        // Remove old users (users who are currently associated with the company but not in the request)
        List<User> usersToRemove = currentUsers.stream()
                .filter(user -> !newUserIds.contains(user.getId()))
                .peek(user -> user.setCompany(null))  // Disassociate user from the company
                .collect(Collectors.toList());

        // Update the company's users
        existingCompany.setUsers(currentUsers.stream()
                .filter(user -> newUserIds.contains(user.getId())) // Keep existing users that are in the new list
                .collect(Collectors.toList()));
        existingCompany.getUsers().addAll(usersToAdd); // Add the new users

        // Save the changes
        companyRepository.save(existingCompany);

        // Update users that were removed (setting company to null)
        userRepository.saveAll(usersToRemove);

        return existingCompany;
    }



    public void deleteCompany(Long id) {
        Company existingCompany = getCompanyById(id);
        for (User user : existingCompany.getUsers()) {
            user.setCompany(null);
            userRepository.save(user);
        }
        companyRepository.delete(existingCompany);
    }
}