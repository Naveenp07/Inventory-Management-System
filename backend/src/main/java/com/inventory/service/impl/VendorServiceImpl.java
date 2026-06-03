package com.inventory.service.impl;

import com.inventory.dto.VendorDTO;
import com.inventory.entity.Vendor;
import com.inventory.exception.BadRequestException;
import com.inventory.exception.ResourceNotFoundException;
import com.inventory.repository.VendorRepository;
import com.inventory.service.VendorService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class VendorServiceImpl implements VendorService {

    private final VendorRepository vendorRepository;

    public VendorServiceImpl(VendorRepository vendorRepository) {
        this.vendorRepository = vendorRepository;
    }

    @Override
    public List<VendorDTO> getAllVendors() {
        return vendorRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public VendorDTO getVendorById(Long id) {
        return toDTO(vendorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found: " + id)));
    }

    @Override
    public VendorDTO createVendor(VendorDTO dto) {
        if (vendorRepository.existsByName(dto.getName())) {
            throw new BadRequestException("Vendor already exists: " + dto.getName());
        }
        Vendor vendor = toEntity(dto);
        return toDTO(vendorRepository.save(vendor));
    }

    @Override
    public VendorDTO updateVendor(Long id, VendorDTO dto) {
        Vendor vendor = vendorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found: " + id));
        vendor.setName(dto.getName());
        vendor.setContactPerson(dto.getContactPerson());
        vendor.setPhone(dto.getPhone());
        vendor.setEmail(dto.getEmail());
        vendor.setAddress(dto.getAddress());
        vendor.setWebsite(dto.getWebsite());
        return toDTO(vendorRepository.save(vendor));
    }

    @Override
    public void deleteVendor(Long id) {
        if (!vendorRepository.existsById(id)) {
            throw new ResourceNotFoundException("Vendor not found: " + id);
        }
        vendorRepository.deleteById(id);
    }

    private VendorDTO toDTO(Vendor vendor) {
        VendorDTO dto = new VendorDTO();
        dto.setId(vendor.getId());
        dto.setName(vendor.getName());
        dto.setContactPerson(vendor.getContactPerson());
        dto.setPhone(vendor.getPhone());
        dto.setEmail(vendor.getEmail());
        dto.setAddress(vendor.getAddress());
        dto.setWebsite(vendor.getWebsite());
        return dto;
    }

    private Vendor toEntity(VendorDTO dto) {
        Vendor vendor = new Vendor();
        vendor.setName(dto.getName());
        vendor.setContactPerson(dto.getContactPerson());
        vendor.setPhone(dto.getPhone());
        vendor.setEmail(dto.getEmail());
        vendor.setAddress(dto.getAddress());
        vendor.setWebsite(dto.getWebsite());
        return vendor;
    }
}
