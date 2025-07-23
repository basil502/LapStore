package com.example.backend.Controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.backend.Entity.CompanyEntity;
import com.example.backend.Entity.LaptopEntity;
import com.example.backend.Entity.UserEntity;
import com.example.backend.Service.LaptopService;

@RestController
@CrossOrigin(origins = "*")
public class LaptopController {
    

    @Autowired
    private LaptopService laptopService;

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody UserEntity user) {
        return laptopService.SaveUser(user);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginUser(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        try {
            Map<String, Object> result = laptopService.loginUser(username, password);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/add")
    public ResponseEntity<String> addLaptop(@RequestBody LaptopEntity laptop) {
        return laptopService.saveLaptop(laptop);
    }

    @PostMapping("/update/{id}")
    public LaptopEntity updateLaptop(@PathVariable int id, @RequestBody LaptopEntity updateLaptop) {
        return laptopService.updateLaptop(id, updateLaptop);
    }

    @GetMapping("/laptop/{id}")
    public ResponseEntity<LaptopEntity> getLaptopById(@PathVariable int id) {
        LaptopEntity laptop = laptopService.getLaptopById(id);
        return ResponseEntity.ok(laptop);
    }

    @GetMapping("/getAll")
    public List<LaptopEntity> getAllLaptops() {
        return laptopService.getAllLaptops();
    }

    @GetMapping("/companies")
    public List<CompanyEntity> getAllCompanies() {
        return laptopService.getAllCompanies();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteLaptop(@PathVariable int id) {
        laptopService.deleteLaptopById(id);
        return ResponseEntity.ok("Laptop deleted successfully");
    }

    @GetMapping("/checkLapcode")
    public ResponseEntity<?> checkLapCode(@RequestParam String code) {
        LaptopEntity existingLaptop = laptopService.getLaptopByLapCode(code);

        if (existingLaptop != null) {
            Map<String, Object> response = new HashMap<>();
            response.put("lap_id", existingLaptop.getLap_id());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.noContent().build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchLaptop(
            @RequestParam(required = false) String model_name,
            @RequestParam(required = false) Integer c_id,
            @RequestParam(required = false) String lapCode,
            @RequestParam(required = false) String processor,
            @RequestParam(required = false) String memory,
            @RequestParam(required = false) String graphicsCard,
            @RequestParam(required = false) Boolean status,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortOrder) {

        List<LaptopEntity> laptops = laptopService.searchLaptop(model_name, c_id, lapCode, processor,
                memory, graphicsCard, minPrice, maxPrice, status, sortBy, sortOrder);

        if (laptops == null || laptops.isEmpty()) {

            return ResponseEntity.ok("No data found");

        }
        return ResponseEntity.ok(laptops);
    }

}