package com.inventory.service;

import com.inventory.dto.WarrantyDTO;
import java.util.List;

public interface WarrantyService {
    List<WarrantyDTO> getAllWarranties();
    WarrantyDTO getByDevice(Long deviceId);
    WarrantyDTO createWarranty(WarrantyDTO dto);
    WarrantyDTO updateWarranty(Long id, WarrantyDTO dto);
}
