package com.inventory.controller;

import com.inventory.dto.AssignmentDTO;
import com.inventory.service.AssignmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assignments")
public class AssignmentController {

    private final AssignmentService assignmentService;

    public AssignmentController(AssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }

    @GetMapping
    public ResponseEntity<List<AssignmentDTO>> getAllAssignments() {
        return ResponseEntity.ok(assignmentService.getAllAssignments());
    }

    @GetMapping("/active")
    public ResponseEntity<List<AssignmentDTO>> getActiveAssignments() {
        return ResponseEntity.ok(assignmentService.getActiveAssignments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AssignmentDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(assignmentService.getAssignmentById(id));
    }

    @GetMapping("/device/{deviceId}")
    public ResponseEntity<List<AssignmentDTO>> getByDevice(@PathVariable Long deviceId) {
        return ResponseEntity.ok(assignmentService.getAssignmentsByDevice(deviceId));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<AssignmentDTO> createAssignment(@Valid @RequestBody AssignmentDTO dto,
                                                           Authentication authentication) {
        return new ResponseEntity<>(assignmentService.createAssignment(dto, authentication.getName()), HttpStatus.CREATED);
    }

    @PutMapping("/{id}/return")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<AssignmentDTO> returnDevice(@PathVariable Long id) {
        return ResponseEntity.ok(assignmentService.returnDevice(id));
    }
}
