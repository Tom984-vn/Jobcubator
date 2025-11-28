package org.jobcubator.jobcubator.course.domain;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

// TODO: Add tags system to this.

// Khóa chính của Course là Integer
public interface CourseRepository extends JpaRepository<Course, Integer>, JpaSpecificationExecutor<Course> {

    /*
     * @param title Tên course cần tìm.
     * @return Optional chứa Course hoặc Optional rỗng.
     */
    Optional<Course> findByTitle(String title);

    /**
     * @param url URL của course.
     * @return True nếu course với URL đó tồn tại, ngược lại là False.
     */
    boolean existsByUrl(String url);

    /**
     * * @param level Cấp độ của course (ví dụ: Beginner).
     * @param title Tên course (một phần của tên)
     * @param pageable Thông tin phân trang.
     * @return Page chứa các Course phù hợp.
     */
    Page<Course> findByLevelAndTitleContainingIgnoreCase(String level, String title, Pageable pageable);
}