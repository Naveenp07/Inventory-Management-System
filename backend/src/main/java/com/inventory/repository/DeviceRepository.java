package com.inventory.repository;

import com.inventory.entity.Device;
import com.inventory.enums.DeviceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface DeviceRepository extends JpaRepository<Device, Long> {
    Optional<Device> findByAssetTag(String assetTag);
    Optional<Device> findBySerialNumber(String serialNumber);
    boolean existsByAssetTag(String assetTag);
    boolean existsBySerialNumber(String serialNumber);
    List<Device> findByStatus(DeviceStatus status);
    List<Device> findByCategory(String category);
    List<Device> findByVendorId(Long vendorId);
    List<Device> findByLocationId(Long locationId);

    @Query("SELECT d FROM Device d WHERE d.name LIKE %:keyword% OR d.assetTag LIKE %:keyword% OR d.serialNumber LIKE %:keyword% OR d.brand LIKE %:keyword%")
    List<Device> searchDevices(String keyword);

    @Query("SELECT COUNT(d) FROM Device d WHERE d.status = :status")
    Long countByStatus(DeviceStatus status);

    @Query("SELECT d.category, COUNT(d) FROM Device d GROUP BY d.category")
    List<Object[]> countByCategory();
}
