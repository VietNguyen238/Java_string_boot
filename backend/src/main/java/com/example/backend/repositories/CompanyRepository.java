package com.example.backend.repositories;

import com.example.backend.models.Company;
import org.springframework.data.repository.CrudRepository;
import java.util.List;

public interface CompanyRepository extends CrudRepository<Company, Integer>  {

    List<Company> findAll();
}