package com.inventory.repository;

import com.inventory.entity.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    List<Assignment> findByDeviceId(Long deviceId);
    List<Assignment> findByActive(boolean active);
    Optional<Assignment> findByDeviceIdAndActiveTrue(Long deviceId);
    List<Assignment> findByAssignedToContainingIgnoreCase(String assignedTo);
}
