package com.inventory.repository;

import com.inventory.entity.Warranty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface WarrantyRepository extends JpaRepository<Warranty, Long> {
    Optional<Warranty> findByDeviceId(Long deviceId);

    @Query("SELECT w FROM Warranty w WHERE w.endDate BETWEEN :today AND :futureDate")
    List<Warranty> findExpiringWarranties(LocalDate today, LocalDate futureDate);

    @Query("SELECT w FROM Warranty w WHERE w.endDate < :today")
    List<Warranty> findExpiredWarranties(LocalDate today);
}
