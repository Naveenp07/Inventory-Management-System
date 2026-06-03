package com.inventory.service;

import com.inventory.dto.AssignmentDTO;
import java.util.List;

public interface AssignmentService {
    List<AssignmentDTO> getAllAssignments();
    AssignmentDTO getAssignmentById(Long id);
    AssignmentDTO createAssignment(AssignmentDTO dto, String username);
    AssignmentDTO returnDevice(Long id);
    List<AssignmentDTO> getAssignmentsByDevice(Long deviceId);
    List<AssignmentDTO> getActiveAssignments();
}
