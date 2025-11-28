package org.jobcubator.jobcubator.company.dto;

import lombok.Builder;
import org.jobcubator.jobcubator.company.domain.CompanyRole;

import java.util.Set;
import java.util.UUID;


//'record' tự động tạo:
//1. Constructor (hàm khởi tạo)
//2. Getter (ví dụ: .id(), .name())
//3. equals(), hashCode(), và toString()
@Builder
public record CompanyDTO(
    UUID id,
    String name,
    String website,
    String size,
    CompanyRole role
) {
}
