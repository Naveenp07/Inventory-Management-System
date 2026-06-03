package com.inventory.service.impl;

import com.inventory.dto.AssignmentDTO;
import com.inventory.entity.Assignment;
import com.inventory.entity.Device;
import com.inventory.entity.User;
import com.inventory.enums.DeviceStatus;
import com.inventory.exception.BadRequestException;
import com.inventory.exception.ResourceNotFoundException;
import com.inventory.repository.AssignmentRepository;
import com.inventory.repository.DeviceRepository;
import com.inventory.repository.UserRepository;
import com.inventory.service.AssignmentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AssignmentServiceImpl implements AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final DeviceRepository deviceRepository;
    private final UserRepository userRepository;

    public AssignmentServiceImpl(AssignmentRepository assignmentRepository,
                                  DeviceRepository deviceRepository,
                                  UserRepository userRepository) {
        this.assignmentRepository = assignmentRepository;
        this.deviceRepository = deviceRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<AssignmentDTO> getAllAssignments() {
        return assignmentRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public AssignmentDTO getAssignmentById(Long id) {
        Assignment assignment = assignmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found: " + id));
        return toDTO(assignment);
    }

    @Override
    public AssignmentDTO createAssignment(AssignmentDTO dto, String username) {
        Device device = deviceRepository.findById(dto.getDeviceId())
                .orElseThrow(() -> new ResourceNotFoundException("Device not found"));

        if (device.getStatus() != DeviceStatus.AVAILABLE) {
            throw new BadRequestException("Device is not available for assignment. Current status: " + device.getStatus());
        }

        Assignment assignment = new Assignment();
        assignment.setDevice(device);
        assignment.setAssignedTo(dto.getAssignedTo());
        assignment.setEmployeeId(dto.getEmployeeId());
        assignment.setDepartment(dto.getDepartment());
        assignment.setAssignedDate(dto.getAssignedDate());
        assignment.setPurpose(dto.getPurpose());
        assignment.setActive(true);

        userRepository.findByUsername(username).ifPresent(assignment::setAssignedBy);

        device.setStatus(DeviceStatus.ASSIGNED);
        deviceRepository.save(device);

        return toDTO(assignmentRepository.save(assignment));
    }

    @Override
    public AssignmentDTO returnDevice(Long id) {
        Assignment assignment = assignmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found: " + id));

        assignment.setActive(false);
        assignment.setReturnDate(LocalDate.now());

        Device device = assignment.getDevice();
        device.setStatus(DeviceStatus.AVAILABLE);
        deviceRepository.save(device);

        return toDTO(assignmentRepository.save(assignment));
    }

    @Override
    public List<AssignmentDTO> getAssignmentsByDevice(Long deviceId) {
        return assignmentRepository.findByDeviceId(deviceId).stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<AssignmentDTO> getActiveAssignments() {
        return assignmentRepository.findByActive(true).stream().map(this::toDTO).collect(Collectors.toList());
    }

    private AssignmentDTO toDTO(Assignment a) {
        AssignmentDTO dto = new AssignmentDTO();
        dto.setId(a.getId());
        dto.setDeviceId(a.getDevice().getId());
        dto.setDeviceName(a.getDevice().getName());
        dto.setAssetTag(a.getDevice().getAssetTag());
        dto.setAssignedTo(a.getAssignedTo());
        dto.setEmployeeId(a.getEmployeeId());
        dto.setDepartment(a.getDepartment());
        dto.setAssignedDate(a.getAssignedDate());
        dto.setReturnDate(a.getReturnDate());
        dto.setPurpose(a.getPurpose());
        dto.setActive(a.isActive());
        dto.setCreatedAt(a.getCreatedAt());
        if (a.getAssignedBy() != null) {
            dto.setAssignedByUsername(a.getAssignedBy().getUsername());
        }
        return dto;
    }
}
