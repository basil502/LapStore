package com.example.backend.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.Entity.CompanyEntity;

public interface CompanyReository extends JpaRepository<CompanyEntity , Integer> {
    

}