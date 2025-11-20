package org.jobcubator.jobcubator.tag.domain;

import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface TagRepository extends JpaRepository<Tag, Integer> {
    Optional<Tag> findByName(String tagName);
    Optional<Tag> findByNameIgnoreCase(String tagName);

    List<Tag> findByNameIn(Set<String> names);

    @Query("SELECT t FROM Tag t WHERE LOWER(t.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Tag> searchByKeyword(@Param("keyword") String keyword);

    @Query("SELECT t FROM Tag t JOIN t.jobPosts jp GROUP BY t.id ORDER BY COUNT(jp) DESC")
    List<Tag> findMostUsedTagsInJobPosts();

    @Query("SELECT t FROM Tag t JOIN t.courses c GROUP BY t.id ORDER BY COUNT(c) DESC")
    List<Tag> findMostUsedTagsInCourses();

    boolean existsByNameIgnoreCase(String tagName);
}
