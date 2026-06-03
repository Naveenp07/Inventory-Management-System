package com.inventory.service.impl;

import com.inventory.dto.DeviceDTO;
import com.inventory.entity.Device;
import com.inventory.entity.Location;
import com.inventory.entity.Vendor;
import com.inventory.enums.DeviceStatus;
import com.inventory.exception.BadRequestException;
import com.inventory.exception.ResourceNotFoundException;
import com.inventory.repository.DeviceRepository;
import com.inventory.repository.LocationRepository;
import com.inventory.repository.VendorRepository;
import com.inventory.service.DeviceService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class DeviceServiceImpl implements DeviceService {

    private final DeviceRepository deviceRepository;
    private final VendorRepository vendorRepository;
    private final LocationRepository locationRepository;

    public DeviceServiceImpl(DeviceRepository deviceRepository,
                             VendorRepository vendorRepository,
                             LocationRepository locationRepository) {
        this.deviceRepository = deviceRepository;
        this.vendorRepository = vendorRepository;
        this.locationRepository = locationRepository;
    }

    @Override
    public List<DeviceDTO> getAllDevices() {
        return deviceRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public DeviceDTO getDeviceById(Long id) {
        Device device = deviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Device not found with id: " + id));
        return toDTO(device);
    }

    @Override
    public DeviceDTO getDeviceByAssetTag(String assetTag) {
        Device device = deviceRepository.findByAssetTag(assetTag)
                .orElseThrow(() -> new ResourceNotFoundException("Device not found with asset tag: " + assetTag));
        return toDTO(device);
    }

    @Override
    public DeviceDTO createDevice(DeviceDTO dto) {
        if (deviceRepository.existsByAssetTag(dto.getAssetTag())) {
            throw new BadRequestException("Asset tag already exists: " + dto.getAssetTag());
        }
        if (dto.getSerialNumber() != null && deviceRepository.existsBySerialNumber(dto.getSerialNumber())) {
            throw new BadRequestException("Serial number already exists: " + dto.getSerialNumber());
        }
        Device device = toEntity(dto);
        return toDTO(deviceRepository.save(device));
    }

    @Override
    public DeviceDTO updateDevice(Long id, DeviceDTO dto) {
        Device device = deviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Device not found with id: " + id));

        device.setName(dto.getName());
        device.setCategory(dto.getCategory());
        device.setBrand(dto.getBrand());
        device.setModel(dto.getModel());
        device.setSerialNumber(dto.getSerialNumber());
        device.setProcessor(dto.getProcessor());
        device.setRam(dto.getRam());
        device.setStorage(dto.getStorage());
        device.setOperatingSystem(dto.getOperatingSystem());
        device.setMacAddress(dto.getMacAddress());
        device.setIpAddress(dto.getIpAddress());
        device.setStatus(dto.getStatus());
        device.setCondition(dto.getCondition());
        device.setPurchaseDate(dto.getPurchaseDate());
        device.setPurchasePrice(dto.getPurchasePrice());
        device.setWarrantyExpiry(dto.getWarrantyExpiry());
        device.setNotes(dto.getNotes());

        if (dto.getVendorId() != null) {
            Vendor vendor = vendorRepository.findById(dto.getVendorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Vendor not found"));
            device.setVendor(vendor);
        } else {
            device.setVendor(null);
        }

        if (dto.getLocationId() != null) {
            Location location = locationRepository.findById(dto.getLocationId())
                    .orElseThrow(() -> new ResourceNotFoundException("Location not found"));
            device.setLocation(location);
        } else {
            device.setLocation(null);
        }

        return toDTO(deviceRepository.save(device));
    }

    @Override
    public void deleteDevice(Long id) {
        if (!deviceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Device not found with id: " + id);
        }
        deviceRepository.deleteById(id);
    }

    @Override
    public List<DeviceDTO> searchDevices(String keyword) {
        return deviceRepository.searchDevices(keyword).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<DeviceDTO> getDevicesByCategory(String category) {
        return deviceRepository.findByCategory(category).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<DeviceDTO> getDevicesByStatus(String status) {
        DeviceStatus deviceStatus = DeviceStatus.valueOf(status.toUpperCase());
        return deviceRepository.findByStatus(deviceStatus).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private DeviceDTO toDTO(Device device) {
        DeviceDTO dto = new DeviceDTO();
        dto.setId(device.getId());
        dto.setAssetTag(device.getAssetTag());
        dto.setName(device.getName());
        dto.setCategory(device.getCategory());
        dto.setBrand(device.getBrand());
        dto.setModel(device.getModel());
        dto.setSerialNumber(device.getSerialNumber());
        dto.setProcessor(device.getProcessor());
        dto.setRam(device.getRam());
        dto.setStorage(device.getStorage());
        dto.setOperatingSystem(device.getOperatingSystem());
        dto.setMacAddress(device.getMacAddress());
        dto.setIpAddress(device.getIpAddress());
        dto.setStatus(device.getStatus());
        dto.setCondition(device.getCondition());
        dto.setPurchaseDate(device.getPurchaseDate());
        dto.setPurchasePrice(device.getPurchasePrice());
        dto.setWarrantyExpiry(device.getWarrantyExpiry());
        dto.setNotes(device.getNotes());
        dto.setCreatedAt(device.getCreatedAt());
        dto.setUpdatedAt(device.getUpdatedAt());
        if (device.getVendor() != null) {
            dto.setVendorId(device.getVendor().getId());
            dto.setVendorName(device.getVendor().getName());
        }
        if (device.getLocation() != null) {
            dto.setLocationId(device.getLocation().getId());
            dto.setLocationName(device.getLocation().getBuilding() + " - " + device.getLocation().getRoom());
        }
        return dto;
    }

    private Device toEntity(DeviceDTO dto) {
        Device device = new Device();
        device.setAssetTag(dto.getAssetTag());
        device.setName(dto.getName());
        device.setCategory(dto.getCategory());
        device.setBrand(dto.getBrand());
        device.setModel(dto.getModel());
        device.setSerialNumber(dto.getSerialNumber());
        device.setProcessor(dto.getProcessor());
        device.setRam(dto.getRam());
        device.setStorage(dto.getStorage());
        device.setOperatingSystem(dto.getOperatingSystem());
        device.setMacAddress(dto.getMacAddress());
        device.setIpAddress(dto.getIpAddress());
        device.setStatus(dto.getStatus() != null ? dto.getStatus() : DeviceStatus.AVAILABLE);
        device.setCondition(dto.getCondition());
        device.setPurchaseDate(dto.getPurchaseDate());
        device.setPurchasePrice(dto.getPurchasePrice());
        device.setWarrantyExpiry(dto.getWarrantyExpiry());
        device.setNotes(dto.getNotes());

        if (dto.getVendorId() != null) {
            vendorRepository.findById(dto.getVendorId()).ifPresent(device::setVendor);
        }
        if (dto.getLocationId() != null) {
            locationRepository.findById(dto.getLocationId()).ifPresent(device::setLocation);
        }
        return device;
    }
}
