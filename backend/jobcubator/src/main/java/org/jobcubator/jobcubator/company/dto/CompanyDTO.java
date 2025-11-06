package org.jobcubator.jobcubator.company.dto;

import java.util.UUID;


//'record' tự động tạo:
//1. Constructor (hàm khởi tạo)
//2. Getter (ví dụ: .id(), .name())
//3. equals(), hashCode(), và toString()
public record CompanyDTO(
    UUID id,
    String name,
    String website,
    Integer size) {
}
