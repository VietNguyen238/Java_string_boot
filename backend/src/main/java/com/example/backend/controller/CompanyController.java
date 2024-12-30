package com.example.backend.controller;

import com.example.backend.dto.CompanyRequest;
import com.example.backend.models.Company;
import com.example.backend.response.CompanyResponse;
import com.example.backend.services.CompanyService;
import com.example.backend.utils.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/companies")
public class CompanyController {
    @Autowired
    private CompanyService companyService;

    // Lấy danh sách tất cả Company
    @GetMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ApiResponse<List<CompanyResponse>> getAllCompanies() {
        List<Company> companies = companyService.getAllCompany();

        List<CompanyResponse> companyResponses = companies.stream().map(company ->
                new CompanyResponse(
                        company.getId(),
                        company.getName(),
                        company.getUsers().stream().map(user -> user.getId()).collect(Collectors.toList())
                )
        ).collect(Collectors.toList());

        return new ApiResponse<>("Success", 200, companyResponses);
    }

    // Lấy thông tin chi tiết của 1 Company theo ID
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<CompanyResponse> getCompanyById(@PathVariable Long id) {
        Company company = companyService.getCompanyById(id);

        if (company == null) {
            return new ApiResponse("Company not found", 404);
        }

        CompanyResponse companyResponse = new CompanyResponse(
                company.getId(),
                company.getName(),
                company.getUsers().stream().map(user -> user.getId()).collect(Collectors.toList())
        );

        return new ApiResponse<>("Success", 200, companyResponse);
    }

    @PostMapping("/create")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<CompanyResponse> createCompany(@RequestBody CompanyRequest companyRequest) {
        Company createdCompany = companyService.createCompany(companyRequest);

        // Prepare the response
        CompanyResponse companyResponse = new CompanyResponse(
                createdCompany.getId(),
                createdCompany.getName(),
                createdCompany.getUsers().stream().map(user -> user.getId()).collect(Collectors.toList())
        );

        return new ApiResponse<>("Company created successfully", 201, companyResponse);
    }


    // Cập nhật Company theo ID
    @PutMapping("/update/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<CompanyResponse> updateCompany(@PathVariable Long id, @RequestBody CompanyRequest companyRequest) {
        Company updatedCompany = companyService.updateCompany(id, companyRequest);

        CompanyResponse companyResponse = new CompanyResponse(
                updatedCompany.getId(),
                updatedCompany.getName(),
                updatedCompany.getUsers().stream().map(user -> user.getId()).collect(Collectors.toList())
        );

        return new ApiResponse<>("Company updated successfully", 200, companyResponse);
    }


    // Xóa Company theo ID
    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> deleteCompany(@PathVariable Long id) {
        companyService.deleteCompany(id);
        return new ApiResponse<>("Company deleted successfully", 200);
    }
}
