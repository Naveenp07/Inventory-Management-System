package com.inventory.config;

import com.inventory.entity.User;
import com.inventory.enums.UserRole;
import com.inventory.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AppConfig {

    @Bean
    public CommandLineRunner dataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (!userRepository.existsByUsername("admin")) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("admin@123"));
                admin.setFullName("System Administrator");
                admin.setEmail("admin@inventory.com");
                admin.setRole(UserRole.ADMIN);
                admin.setActive(true);
                userRepository.save(admin);
                System.out.println("✅ Default admin user created → username: admin | password: admin@123");
            }
            if (!userRepository.existsByUsername("manager")) {
                User manager = new User();
                manager.setUsername("manager");
                manager.setPassword(passwordEncoder.encode("manager@123"));
                manager.setFullName("Inventory Manager");
                manager.setEmail("manager@inventory.com");
                manager.setRole(UserRole.MANAGER);
                manager.setActive(true);
                userRepository.save(manager);
                System.out.println("✅ Default manager user created → username: manager | password: manager@123");
            }
            if (!userRepository.existsByUsername("viewer")) {
                User viewer = new User();
                viewer.setUsername("viewer");
                viewer.setPassword(passwordEncoder.encode("viewer@123"));
                viewer.setFullName("Inventory Viewer");
                viewer.setEmail("viewer@inventory.com");
                viewer.setRole(UserRole.VIEWER);
                viewer.setActive(true);
                userRepository.save(viewer);
                System.out.println("✅ Default viewer user created → username: viewer | password: viewer@123");
            }
        };
    }
}
