package com.inventory.controller;

import com.inventory.dto.WarrantyDTO;
import com.inventory.service.WarrantyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/warranties")
public class WarrantyController {

    private final WarrantyService warrantyService;

    public WarrantyController(WarrantyService warrantyService) {
        this.warrantyService = warrantyService;
    }

    @GetMapping
    public ResponseEntity<List<WarrantyDTO>> getAllWarranties() {
        return ResponseEntity.ok(warrantyService.getAllWarranties());
    }

    @GetMapping("/device/{deviceId}")
    public ResponseEntity<WarrantyDTO> getByDevice(@PathVariable Long deviceId) {
        return ResponseEntity.ok(warrantyService.getByDevice(deviceId));
    }

    @PostMapping
    public ResponseEntity<WarrantyDTO> create(@RequestBody WarrantyDTO dto) {
        return ResponseEntity.ok(warrantyService.createWarranty(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<WarrantyDTO> update(@PathVariable Long id, @RequestBody WarrantyDTO dto) {
        return ResponseEntity.ok(warrantyService.updateWarranty(id, dto));
    }
}
