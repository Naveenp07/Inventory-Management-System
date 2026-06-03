package com.inventory.repository;

import com.inventory.entity.MaintenanceLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MaintenanceRepository extends JpaRepository<MaintenanceLog, Long> {
    List<MaintenanceLog> findByDeviceId(Long deviceId);
    List<MaintenanceLog> findByStatus(String status);

    @Query("SELECT SUM(m.cost) FROM MaintenanceLog m WHERE m.device.id = :deviceId")
    Double getTotalCostByDevice(Long deviceId);
}
