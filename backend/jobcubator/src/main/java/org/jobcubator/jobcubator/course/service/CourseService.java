package org.jobcubator.jobcubator.course.service;

import org.jobcubator.jobcubator.course.dto.CourseDTO;
import org.jobcubator.jobcubator.course.dto.CourseRequestDTO;
import org.jobcubator.jobcubator.course.dto.CourseFilterDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.rest.webmvc.ResourceNotFoundException; // Thêm exception

import java.util.UUID; // Giữ lại nếu các entity khác sử dụng UUID

public interface CourseService {

    /**
     * @param requestDTO Dữ liệu (Title, URL, Level,...) để tạo khóa học mới.
     * @return CourseDTO của khóa học vừa được tạo.
     */
    CourseDTO createCourse(CourseRequestDTO requestDTO);

    /**
     * @param id ID (Integer) của khóa học.
     * @return CourseDTO của khóa học.
     * @throws ResourceNotFoundException nếu không tìm thấy khóa học.
     */
    CourseDTO getCourseById(Integer id);

    /**
     * @param id ID (Integer) của khóa học cần cập nhật.
     * @param requestDTO Dữ liệu mới để cập nhật (ví dụ: URL, Level mới).
     * @return CourseDTO của khóa học sau khi đã cập nhật.
     * @throws ResourceNotFoundException nếu không tìm thấy khóa học.
     */
    CourseDTO updateCourse(Integer id, CourseRequestDTO requestDTO);

    /**
     * @param id ID (Integer) của khóa học cần xóa.
     * @throws ResourceNotFoundException nếu không tìm thấy khóa học.
     */
    void deleteCourse(Integer id);

  
    /**
     * @param filterDTO Đối tượng DTO chứa các tiêu chí lọc (có thể null).
     * @param pageable Thông tin phân trang (trang nào, bao nhiêu mục).
     * @return Một trang (Page) chứa CourseDTO đã được lọc.
     */
    Page<CourseDTO> filterCourses(CourseFilterDTO filterDTO, Pageable pageable);
}