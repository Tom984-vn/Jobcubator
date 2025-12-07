package org.jobcubator.jobcubator.course.service;

import org.jobcubator.jobcubator.course.domain.Course;
import org.jobcubator.jobcubator.course.domain.CourseRepository;
import org.jobcubator.jobcubator.course.dto.CourseDTO;
import org.jobcubator.jobcubator.course.dto.CourseRequestDTO;
import org.jobcubator.jobcubator.course.dto.CourseFilterDTO;
import org.jobcubator.jobcubator.tag.domain.Tag;
import org.jobcubator.jobcubator.tag.domain.TagRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@Transactional
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;
    private final TagRepository tagRepository;

    public CourseServiceImpl(CourseRepository courseRepository, TagRepository tagRepository) {
        this.courseRepository = courseRepository;
        this.tagRepository = tagRepository;
    }


    private CourseDTO mapToDTO(Course course) {
        // Lấy list ID của tags
        List<Integer> tagIds = course.getTags().stream()
            .map(Tag::getId)
            .toList();

        return new CourseDTO(
            course.getId(),
            course.getTitle(),
            course.getLevel(),
            course.getProvider(),
            course.getUrl(),
            course.getCreatedAt(),
            tagIds
        );
    }

    
    @Override
    @Transactional
    public CourseDTO createCourse(CourseRequestDTO createDTO) {
        if (courseRepository.existsByUrl(createDTO.url())) {
            throw new IllegalArgumentException("Course with URL already exists.");
        }

        Course newCourse = Course.builder()
                .title(createDTO.title())
                .level(createDTO.level())
                .provider(createDTO.provider())
                .url(createDTO.url())
                .build();

        Set<Tag> tags = new HashSet<>(tagRepository.findAllById(createDTO.tagIds()));
        newCourse.setTags(tags);
        
        newCourse = courseRepository.save(newCourse);
        return mapToDTO(newCourse);
    }

    
    @Override
    @Transactional(readOnly = true)
    public CourseDTO getCourseById(Integer id) {
        Course course = courseRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));
        
        return mapToDTO(course);
    }

    
    @Override
    @Transactional
    public CourseDTO updateCourse(Integer id, CourseRequestDTO updateDTO) {
        Course course = courseRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));

        course.setTitle(updateDTO.title());
        course.setProvider(updateDTO.provider());
        course.setLevel(updateDTO.level());
        course.setUrl(updateDTO.url());
        
        Set<Tag> newTags = new HashSet<>(tagRepository.findAllById(updateDTO.tagIds()));
        course.setTags(newTags); 

        course = courseRepository.save(course);
        return mapToDTO(course);
    }

    
    @Override
    @Transactional
    public void deleteCourse(Integer id) {
        if (!courseRepository.existsById(id)) {
            throw new ResourceNotFoundException("Course not found with id: " + id);
        }
        courseRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CourseDTO> filterCourses(CourseFilterDTO filterDTO, Pageable pageable) {
        Specification<Course> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (filterDTO != null) {
                
                if (filterDTO.title() != null && !filterDTO.title().isBlank()) {
                    predicates.add(cb.like(cb.lower(root.get("title")), 
                                        "%" + filterDTO.title().toLowerCase() + "%"));
                }
                
                if (filterDTO.level() != null && !filterDTO.level().isBlank()) {
                    predicates.add(cb.equal(root.get("level"), filterDTO.level()));
                }
                
                if (filterDTO.tagId() != null) {
                    Join<Course, Tag> tagsJoin = root.join("tags", JoinType.INNER);
                    predicates.add(cb.equal(tagsJoin.get("id"), filterDTO.tagId()));
                    query.distinct(true); 
                }

                if (filterDTO.dateFrom() != null) {
                    predicates.add(cb.greaterThanOrEqualTo(root.get("createdAt"), filterDTO.dateFrom()));
                }
                if (filterDTO.dateTo() != null) {
                    predicates.add(cb.lessThanOrEqualTo(root.get("createdAt"), filterDTO.dateTo()));
                }
            }
            
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Course> coursePage = courseRepository.findAll(spec, pageable);
        
        // Chuyển đổi Page<Entity> thành Page<DTO>
        return coursePage.map(this::mapToDTO);
    }
}