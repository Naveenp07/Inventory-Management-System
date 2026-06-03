package com.inventory.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "locations")
public class Location {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String building;

    @Column(length = 50)
    private String floor;

    @Column(length = 50)
    private String room;

    @Column(length = 255)
    private String description;

    @OneToMany(mappedBy = "location", fetch = FetchType.LAZY)
    private List<Device> devices;

    public Location() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getBuilding() { return building; }
    public void setBuilding(String building) { this.building = building; }

    public String getFloor() { return floor; }
    public void setFloor(String floor) { this.floor = floor; }

    public String getRoom() { return room; }
    public void setRoom(String room) { this.room = room; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<Device> getDevices() { return devices; }
    public void setDevices(List<Device> devices) { this.devices = devices; }
}
