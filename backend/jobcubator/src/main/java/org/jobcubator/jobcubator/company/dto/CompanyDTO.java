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
<<<<<<< HEAD
    Integer size
=======
    String size,
    CompanyRole role
>>>>>>> b5acf33 (Add GET /api/company/my-company endpoint)
) {
}
