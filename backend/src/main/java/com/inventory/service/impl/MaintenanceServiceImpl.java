package com.inventory.service.impl;

import com.inventory.dto.MaintenanceDTO;
import com.inventory.entity.Device;
import com.inventory.entity.MaintenanceLog;
import com.inventory.enums.DeviceStatus;
import com.inventory.exception.ResourceNotFoundException;
import com.inventory.repository.DeviceRepository;
import com.inventory.repository.MaintenanceRepository;
import com.inventory.repository.UserRepository;
import com.inventory.service.MaintenanceService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class MaintenanceServiceImpl implements MaintenanceService {

    private final MaintenanceRepository maintenanceRepository;
    private final DeviceRepository deviceRepository;
    private final UserRepository userRepository;

    public MaintenanceServiceImpl(MaintenanceRepository maintenanceRepository,
                                   DeviceRepository deviceRepository,
                                   UserRepository userRepository) {
        this.maintenanceRepository = maintenanceRepository;
        this.deviceRepository = deviceRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<MaintenanceDTO> getAllLogs() {
        return maintenanceRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public MaintenanceDTO getLogById(Long id) {
        return toDTO(maintenanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Maintenance log not found: " + id)));
    }

    @Override
    public MaintenanceDTO createLog(MaintenanceDTO dto, String username) {
        Device device = deviceRepository.findById(dto.getDeviceId())
                .orElseThrow(() -> new ResourceNotFoundException("Device not found"));

        MaintenanceLog log = new MaintenanceLog();
        log.setDevice(device);
        log.setMaintenanceType(dto.getMaintenanceType());
        log.setMaintenanceDate(dto.getMaintenanceDate());
        log.setCompletionDate(dto.getCompletionDate());
        log.setTechnician(dto.getTechnician());
        log.setDescription(dto.getDescription());
        log.setCost(dto.getCost());
        log.setStatus(dto.getStatus() != null ? dto.getStatus() : "Pending");
        log.setResolution(dto.getResolution());
        userRepository.findByUsername(username).ifPresent(log::setLoggedBy);

        // Update device status to In Maintenance if status is pending/in-progress
        if ("Pending".equals(log.getStatus()) || "In Progress".equals(log.getStatus())) {
            device.setStatus(DeviceStatus.IN_MAINTENANCE);
            deviceRepository.save(device);
        }

        return toDTO(maintenanceRepository.save(log));
    }

    @Override
    public MaintenanceDTO updateLog(Long id, MaintenanceDTO dto) {
        MaintenanceLog log = maintenanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Maintenance log not found: " + id));

        log.setMaintenanceType(dto.getMaintenanceType());
        log.setMaintenanceDate(dto.getMaintenanceDate());
        log.setCompletionDate(dto.getCompletionDate());
        log.setTechnician(dto.getTechnician());
        log.setDescription(dto.getDescription());
        log.setCost(dto.getCost());
        log.setStatus(dto.getStatus());
        log.setResolution(dto.getResolution());

        // If completed, set device back to available
        if ("Completed".equals(dto.getStatus())) {
            Device device = log.getDevice();
            device.setStatus(DeviceStatus.AVAILABLE);
            deviceRepository.save(device);
        }

        return toDTO(maintenanceRepository.save(log));
    }

    @Override
    public void deleteLog(Long id) {
        if (!maintenanceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Maintenance log not found: " + id);
        }
        maintenanceRepository.deleteById(id);
    }

    @Override
    public List<MaintenanceDTO> getLogsByDevice(Long deviceId) {
        return maintenanceRepository.findByDeviceId(deviceId).stream().map(this::toDTO).collect(Collectors.toList());
    }

    private MaintenanceDTO toDTO(MaintenanceLog log) {
        MaintenanceDTO dto = new MaintenanceDTO();
        dto.setId(log.getId());
        dto.setDeviceId(log.getDevice().getId());
        dto.setDeviceName(log.getDevice().getName());
        dto.setAssetTag(log.getDevice().getAssetTag());
        dto.setMaintenanceType(log.getMaintenanceType());
        dto.setMaintenanceDate(log.getMaintenanceDate());
        dto.setCompletionDate(log.getCompletionDate());
        dto.setTechnician(log.getTechnician());
        dto.setDescription(log.getDescription());
        dto.setCost(log.getCost());
        dto.setStatus(log.getStatus());
        dto.setResolution(log.getResolution());
        dto.setCreatedAt(log.getCreatedAt());
        if (log.getLoggedBy() != null) {
            dto.setLoggedByUsername(log.getLoggedBy().getUsername());
        }
        return dto;
    }
}
