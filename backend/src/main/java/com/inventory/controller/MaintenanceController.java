package com.inventory.controller;

import com.inventory.dto.MaintenanceDTO;
import com.inventory.service.MaintenanceService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maintenance")
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    public MaintenanceController(MaintenanceService maintenanceService) {
        this.maintenanceService = maintenanceService;
    }

    @GetMapping
    public ResponseEntity<List<MaintenanceDTO>> getAllLogs() {
        return ResponseEntity.ok(maintenanceService.getAllLogs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MaintenanceDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(maintenanceService.getLogById(id));
    }

    @GetMapping("/device/{deviceId}")
    public ResponseEntity<List<MaintenanceDTO>> getByDevice(@PathVariable Long deviceId) {
        return ResponseEntity.ok(maintenanceService.getLogsByDevice(deviceId));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<MaintenanceDTO> createLog(@Valid @RequestBody MaintenanceDTO dto, Authentication auth) {
        return new ResponseEntity<>(maintenanceService.createLog(dto, auth.getName()), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<MaintenanceDTO> updateLog(@PathVariable Long id, @Valid @RequestBody MaintenanceDTO dto) {
        return ResponseEntity.ok(maintenanceService.updateLog(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteLog(@PathVariable Long id) {
        maintenanceService.deleteLog(id);
        return ResponseEntity.noContent().build();
    }
}
