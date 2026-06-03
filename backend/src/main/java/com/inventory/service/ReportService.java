package com.inventory.service;

import java.io.ByteArrayOutputStream;
import java.util.Map;

public interface ReportService {
    Map<String, Object> getDashboardStats();
    ByteArrayOutputStream exportDevicesToExcel();
    ByteArrayOutputStream exportDevicesToPdf();
}
