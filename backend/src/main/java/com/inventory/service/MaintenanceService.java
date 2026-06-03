package com.inventory.service;

import com.inventory.dto.MaintenanceDTO;
import java.util.List;

public interface MaintenanceService {
    List<MaintenanceDTO> getAllLogs();
    MaintenanceDTO getLogById(Long id);
    MaintenanceDTO createLog(MaintenanceDTO dto, String username);
    MaintenanceDTO updateLog(Long id, MaintenanceDTO dto);
    void deleteLog(Long id);
    List<MaintenanceDTO> getLogsByDevice(Long deviceId);
}
