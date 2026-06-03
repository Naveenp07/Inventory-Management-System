package com.inventory.dto;

import jakarta.validation.constraints.NotBlank;

public class VendorDTO {

    private Long id;

    @NotBlank(message = "Vendor name is required")
    private String name;

    private String contactPerson;
    private String phone;
    private String email;
    private String address;
    private String website;

    public VendorDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getContactPerson() { return contactPerson; }
    public void setContactPerson(String contactPerson) { this.contactPerson = contactPerson; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }
}
