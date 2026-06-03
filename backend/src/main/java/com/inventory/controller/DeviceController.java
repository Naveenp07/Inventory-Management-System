package com.inventory.controller;

import com.inventory.dto.DeviceDTO;
import com.inventory.service.DeviceService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/devices")
public class DeviceController {

    private final DeviceService deviceService;

    public DeviceController(DeviceService deviceService) {
        this.deviceService = deviceService;
    }

    @GetMapping
    public ResponseEntity<List<DeviceDTO>> getAllDevices() {
        return ResponseEntity.ok(deviceService.getAllDevices());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DeviceDTO> getDeviceById(@PathVariable Long id) {
        return ResponseEntity.ok(deviceService.getDeviceById(id));
    }

    @GetMapping("/asset/{assetTag}")
    public ResponseEntity<DeviceDTO> getByAssetTag(@PathVariable String assetTag) {
        return ResponseEntity.ok(deviceService.getDeviceByAssetTag(assetTag));
    }

    @GetMapping("/search")
    public ResponseEntity<List<DeviceDTO>> searchDevices(@RequestParam String keyword) {
        return ResponseEntity.ok(deviceService.searchDevices(keyword));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<DeviceDTO>> getByCategory(@PathVariable String category) {
        return ResponseEntity.ok(deviceService.getDevicesByCategory(category));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<DeviceDTO>> getByStatus(@PathVariable String status) {
        return ResponseEntity.ok(deviceService.getDevicesByStatus(status));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<DeviceDTO> createDevice(@Valid @RequestBody DeviceDTO deviceDTO) {
        return new ResponseEntity<>(deviceService.createDevice(deviceDTO), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<DeviceDTO> updateDevice(@PathVariable Long id, @Valid @RequestBody DeviceDTO deviceDTO) {
        return ResponseEntity.ok(deviceService.updateDevice(id, deviceDTO));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteDevice(@PathVariable Long id) {
        deviceService.deleteDevice(id);
        return ResponseEntity.noContent().build();
    }
}
