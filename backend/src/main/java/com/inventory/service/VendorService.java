package com.inventory.service;

import com.inventory.dto.VendorDTO;
import java.util.List;

public interface VendorService {
    List<VendorDTO> getAllVendors();
    VendorDTO getVendorById(Long id);
    VendorDTO createVendor(VendorDTO dto);
    VendorDTO updateVendor(Long id, VendorDTO dto);
    void deleteVendor(Long id);
}
