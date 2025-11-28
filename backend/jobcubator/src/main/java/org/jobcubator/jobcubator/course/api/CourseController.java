package org.jobcubator.jobcubator.course.api;

import org.jobcubator.jobcubator.course.dto.CourseDTO;
import org.jobcubator.jobcubator.course.dto.CourseRequestDTO;
import org.jobcubator.jobcubator.course.dto.CourseFilterDTO;
import org.jobcubator.jobcubator.course.service.CourseService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;


@RestController
@RequestMapping("/api/courses/")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }


    @PostMapping
    public ResponseEntity<CourseDTO> createCourse(@Valid @RequestBody CourseRequestDTO request) {
        CourseDTO createdCourse = courseService.createCourse(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCourse); 
    }

   
    @GetMapping("/{id}")
    public ResponseEntity<CourseDTO> getCourseById(@PathVariable Integer id) {
        CourseDTO course = courseService.getCourseById(id);
        return ResponseEntity.ok(course); // HTTP 200
    }

   
    @PutMapping("/{id}")
    public ResponseEntity<CourseDTO> updateCourse(
            @PathVariable Integer id,
            @Valid @RequestBody CourseRequestDTO request) {
        
        CourseDTO updatedCourse = courseService.updateCourse(id, request);
        return ResponseEntity.ok(updatedCourse); 
    }

    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable Integer id) {
        courseService.deleteCourse(id);
        return ResponseEntity.noContent().build(); 
    }

    @PostMapping("/filter")
    public ResponseEntity<Page<CourseDTO>> filterCourses(
            @RequestBody(required = false) CourseFilterDTO filterDTO, 
            Pageable pageable) {
        
        Page<CourseDTO> filteredPage = courseService.filterCourses(filterDTO, pageable);
        return ResponseEntity.ok(filteredPage); 
    }
}