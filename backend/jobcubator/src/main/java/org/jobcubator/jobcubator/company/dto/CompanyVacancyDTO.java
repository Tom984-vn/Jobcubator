package org.jobcubator.jobcubator.company.dto;

import java.util.Set;

public record CompanyVacancyDTO(String name,
                                  String website,
                                  String size,
                                  Long totalVacancies,
                                  Set<String> tags) {

}
