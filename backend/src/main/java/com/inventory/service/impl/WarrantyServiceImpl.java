package com.inventory.service.impl;

import com.inventory.dto.WarrantyDTO;
import com.inventory.entity.Device;
import com.inventory.entity.Warranty;
import com.inventory.exception.ResourceNotFoundException;
import com.inventory.repository.DeviceRepository;
import com.inventory.repository.WarrantyRepository;
import com.inventory.service.WarrantyService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class WarrantyServiceImpl implements WarrantyService {

    private final WarrantyRepository warrantyRepository;
    private final DeviceRepository deviceRepository;

    public WarrantyServiceImpl(WarrantyRepository warrantyRepository, DeviceRepository deviceRepository) {
        this.warrantyRepository = warrantyRepository;
        this.deviceRepository = deviceRepository;
    }

    @Override
    public List<WarrantyDTO> getAllWarranties() {
        return warrantyRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public WarrantyDTO getByDevice(Long deviceId) {
        return toDTO(warrantyRepository.findByDeviceId(deviceId)
                .orElseThrow(() -> new ResourceNotFoundException("No warranty found for device: " + deviceId)));
    }

    @Override
    public WarrantyDTO createWarranty(WarrantyDTO dto) {
        Device device = deviceRepository.findById(dto.getDeviceId())
                .orElseThrow(() -> new ResourceNotFoundException("Device not found"));
        Warranty w = new Warranty();
        w.setDevice(device);
        w.setWarrantyProvider(dto.getWarrantyProvider());
        w.setWarrantyType(dto.getWarrantyType());
        w.setStartDate(dto.getStartDate());
        w.setEndDate(dto.getEndDate());
        w.setContractNumber(dto.getContractNumber());
        w.setContactPhone(dto.getContactPhone());
        w.setContactEmail(dto.getContactEmail());
        w.setNotes(dto.getNotes());
        return toDTO(warrantyRepository.save(w));
    }

    @Override
    public WarrantyDTO updateWarranty(Long id, WarrantyDTO dto) {
        Warranty w = warrantyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Warranty not found: " + id));
        w.setWarrantyProvider(dto.getWarrantyProvider());
        w.setWarrantyType(dto.getWarrantyType());
        w.setStartDate(dto.getStartDate());
        w.setEndDate(dto.getEndDate());
        w.setContractNumber(dto.getContractNumber());
        w.setContactPhone(dto.getContactPhone());
        w.setContactEmail(dto.getContactEmail());
        w.setNotes(dto.getNotes());
        return toDTO(warrantyRepository.save(w));
    }

    private WarrantyDTO toDTO(Warranty w) {
        WarrantyDTO dto = new WarrantyDTO();
        dto.setId(w.getId());
        dto.setDeviceId(w.getDevice().getId());
        dto.setDeviceName(w.getDevice().getName());
        dto.setAssetTag(w.getDevice().getAssetTag());
        dto.setWarrantyProvider(w.getWarrantyProvider());
        dto.setWarrantyType(w.getWarrantyType());
        dto.setStartDate(w.getStartDate());
        dto.setEndDate(w.getEndDate());
        dto.setContractNumber(w.getContractNumber());
        dto.setContactPhone(w.getContactPhone());
        dto.setContactEmail(w.getContactEmail());
        dto.setNotes(w.getNotes());
        dto.setExpired(w.getEndDate() != null && w.getEndDate().isBefore(LocalDate.now()));
        return dto;
    }
}
