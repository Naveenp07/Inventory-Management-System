package com.inventory.service;

import com.inventory.dto.DeviceDTO;
import java.util.List;

public interface DeviceService {
    List<DeviceDTO> getAllDevices();
    DeviceDTO getDeviceById(Long id);
    DeviceDTO getDeviceByAssetTag(String assetTag);
    DeviceDTO createDevice(DeviceDTO deviceDTO);
    DeviceDTO updateDevice(Long id, DeviceDTO deviceDTO);
    void deleteDevice(Long id);
    List<DeviceDTO> searchDevices(String keyword);
    List<DeviceDTO> getDevicesByCategory(String category);
    List<DeviceDTO> getDevicesByStatus(String status);
}
