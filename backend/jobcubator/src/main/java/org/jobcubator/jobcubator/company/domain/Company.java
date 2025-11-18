package org.jobcubator.jobcubator.company.domain;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "company")
public class Company {
    @Id
    @Column(name = "id", updatable = false, nullable = false, unique = true, insertable = false)
    private UUID id;

    @Column(name = "name",length = 100, updatable = true, nullable = false, unique = true)
    private String name;



    @Column(name = "description_path",length = 150, updatable = true, nullable = false)
    private String description_path;

    @Column(name = "website",length = 150, updatable = true, nullable = false, unique= true)
    private String website;

    @Column(name = "size",length = 50, updatable = true, nullable = false)
    private String size;

    // @PrePersist
    // public void generateId(){
    //     if (this.id == null){
    //         this.id = UUID.randomUUID();
    //     }
    // }

}
