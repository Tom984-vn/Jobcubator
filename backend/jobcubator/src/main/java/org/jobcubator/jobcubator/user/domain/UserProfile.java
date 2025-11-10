package org.jobcubator.jobcubator.user.domain;

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
@Table(name = "user_profile")
public class UserProfile {

    @Id
    @Column(name = "user_id", insertable = false, unique = true, nullable = false)
    private UUID userId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId // This is the magic!
    @JoinColumn(name = "user_id") // This is the FK column
    private User user;

    @Column(name = "field_of_study", length = 100)
    private String fieldOfStudy;

    @Column(name = "birth_date")
    private String birthDate;

    @Column(name = "years_of_experience")
    private int yearsOfExperience;

    @Column(name = "organization", length = 100)
    private String organization;

    @Column(name = "position", length = 100)
    private String position;

    @Column(name = "preferred_location", length = 100)
    private String preferredLocation;

    @Column(name = "avatar_path", length = 300)
    private String avatarPath;

    @Column(name = "cv_path", length = 300)
    private String cvPath;

    @Column(name = "min_salary")
    private int minSalary;

    @Column(name = "max_salary")
    private int maxSalary;

}
