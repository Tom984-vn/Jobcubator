package org.jobcubator.jobcubator.tag.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "tag")
@Builder
public class Tag {

    @Id
    @Column(name = "id", updatable = false, nullable = false, unique = true, insertable = false)
    private Integer id;

    @Column(name = "name", updatable = false, nullable = false, insertable = false, length = 50)
    private String name;
}
