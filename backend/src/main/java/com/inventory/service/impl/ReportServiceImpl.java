package com.inventory.service.impl;

import com.inventory.entity.Device;
import com.inventory.enums.DeviceStatus;
import com.inventory.repository.AssignmentRepository;
import com.inventory.repository.DeviceRepository;
import com.inventory.repository.MaintenanceRepository;
import com.inventory.service.ReportService;

// iText PDF - use fully qualified Font to avoid conflict with POI Font
import com.itextpdf.text.BaseColor;
import com.itextpdf.text.Document;
import com.itextpdf.text.Element;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;

// Apache POI Excel - use fully qualified Font to avoid conflict with iText Font
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReportServiceImpl implements ReportService {

    private final DeviceRepository deviceRepository;
    private final AssignmentRepository assignmentRepository;
    private final MaintenanceRepository maintenanceRepository;

    public ReportServiceImpl(DeviceRepository deviceRepository,
                              AssignmentRepository assignmentRepository,
                              MaintenanceRepository maintenanceRepository) {
        this.deviceRepository = deviceRepository;
        this.assignmentRepository = assignmentRepository;
        this.maintenanceRepository = maintenanceRepository;
    }

    @Override
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalDevices", deviceRepository.count());
        stats.put("availableDevices", deviceRepository.countByStatus(DeviceStatus.AVAILABLE));
        stats.put("assignedDevices", deviceRepository.countByStatus(DeviceStatus.ASSIGNED));
        stats.put("inMaintenanceDevices", deviceRepository.countByStatus(DeviceStatus.IN_MAINTENANCE));
        stats.put("retiredDevices", deviceRepository.countByStatus(DeviceStatus.RETIRED));
        stats.put("totalAssignments", assignmentRepository.count());
        stats.put("activeAssignments", assignmentRepository.findByActive(true).size());
        stats.put("totalMaintenanceLogs", maintenanceRepository.count());

        List<Object[]> categoryBreakdown = deviceRepository.countByCategory();
        Map<String, Long> categoryMap = new HashMap<>();
        for (Object[] row : categoryBreakdown) {
            categoryMap.put((String) row[0], (Long) row[1]);
        }
        stats.put("devicesByCategory", categoryMap);
        return stats;
    }

    @Override
    public ByteArrayOutputStream exportDevicesToExcel() {
        try (XSSFWorkbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            Sheet sheet = workbook.createSheet("Devices");

            // Use fully qualified org.apache.poi.ss.usermodel.Font — avoids conflict with iText Font
            CellStyle headerStyle = workbook.createCellStyle();
            org.apache.poi.ss.usermodel.Font poiFont = workbook.createFont();
            poiFont.setBold(true);
            poiFont.setColor(IndexedColors.WHITE.getIndex());
            headerStyle.setFont(poiFont);
            headerStyle.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            String[] headers = {
                "Asset Tag", "Name", "Category", "Brand", "Model", "Serial Number",
                "Status", "Condition", "Processor", "RAM", "Storage", "OS",
                "Purchase Date", "Purchase Price", "Warranty Expiry", "Vendor", "Location"
            };

            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
                sheet.setColumnWidth(i, 5000);
            }

            List<Device> devices = deviceRepository.findAll();
            int rowNum = 1;
            for (Device device : devices) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(device.getAssetTag());
                row.createCell(1).setCellValue(device.getName());
                row.createCell(2).setCellValue(device.getCategory());
                row.createCell(3).setCellValue(nullSafe(device.getBrand()));
                row.createCell(4).setCellValue(nullSafe(device.getModel()));
                row.createCell(5).setCellValue(nullSafe(device.getSerialNumber()));
                row.createCell(6).setCellValue(device.getStatus().name());
                row.createCell(7).setCellValue(device.getCondition().name());
                row.createCell(8).setCellValue(nullSafe(device.getProcessor()));
                row.createCell(9).setCellValue(nullSafe(device.getRam()));
                row.createCell(10).setCellValue(nullSafe(device.getStorage()));
                row.createCell(11).setCellValue(nullSafe(device.getOperatingSystem()));
                row.createCell(12).setCellValue(device.getPurchaseDate() != null ? device.getPurchaseDate().toString() : "");
                row.createCell(13).setCellValue(device.getPurchasePrice() != null ? device.getPurchasePrice().toString() : "");
                row.createCell(14).setCellValue(device.getWarrantyExpiry() != null ? device.getWarrantyExpiry().toString() : "");
                row.createCell(15).setCellValue(device.getVendor() != null ? device.getVendor().getName() : "");
                row.createCell(16).setCellValue(device.getLocation() != null
                        ? device.getLocation().getBuilding() + " - " + device.getLocation().getRoom() : "");
            }

            workbook.write(out);
            return out;

        } catch (Exception e) {
            throw new RuntimeException("Error generating Excel report: " + e.getMessage());
        }
    }

    @Override
    public ByteArrayOutputStream exportDevicesToPdf() {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try {
            Document document = new Document(PageSize.A4.rotate());
            PdfWriter.getInstance(document, out);
            document.open();

            // Use fully qualified com.itextpdf.text.Font — avoids conflict with POI Font
            com.itextpdf.text.Font titleFont = new com.itextpdf.text.Font(
                    com.itextpdf.text.Font.FontFamily.HELVETICA, 18,
                    com.itextpdf.text.Font.BOLD, BaseColor.DARK_GRAY);
            Paragraph title = new Paragraph("Hardware Inventory Report", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(20);
            document.add(title);

            PdfPTable table = new PdfPTable(8);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{2f, 3f, 2f, 2f, 2f, 2f, 2f, 2f});

            String[] headers = {"Asset Tag", "Name", "Category", "Brand", "Status", "Condition", "Purchase Date", "Vendor"};
            com.itextpdf.text.Font headerFont = new com.itextpdf.text.Font(
                    com.itextpdf.text.Font.FontFamily.HELVETICA, 10,
                    com.itextpdf.text.Font.BOLD, BaseColor.WHITE);

            for (String header : headers) {
                PdfPCell cell = new PdfPCell(new Phrase(header, headerFont));
                cell.setBackgroundColor(new BaseColor(30, 58, 138));
                cell.setPadding(8);
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                table.addCell(cell);
            }

            com.itextpdf.text.Font dataFont = new com.itextpdf.text.Font(
                    com.itextpdf.text.Font.FontFamily.HELVETICA, 9);

            List<Device> devices = deviceRepository.findAll();
            boolean alternate = false;
            for (Device device : devices) {
                BaseColor rowColor = alternate ? new BaseColor(240, 245, 255) : BaseColor.WHITE;
                String[] values = {
                    device.getAssetTag(),
                    device.getName(),
                    device.getCategory(),
                    nullSafe(device.getBrand()),
                    device.getStatus().name(),
                    device.getCondition().name(),
                    device.getPurchaseDate() != null ? device.getPurchaseDate().toString() : "-",
                    device.getVendor() != null ? device.getVendor().getName() : "-"
                };
                for (String value : values) {
                    PdfPCell cell = new PdfPCell(new Phrase(value, dataFont));
                    cell.setBackgroundColor(rowColor);
                    cell.setPadding(6);
                    table.addCell(cell);
                }
                alternate = !alternate;
            }

            document.add(table);
            document.close();

        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF report: " + e.getMessage());
        }
        return out;
    }

    private String nullSafe(String value) {
        return value != null ? value : "";
    }
}
