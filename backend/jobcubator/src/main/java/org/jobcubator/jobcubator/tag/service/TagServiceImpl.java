package org.jobcubator.jobcubator.tag.service;

import lombok.RequiredArgsConstructor;
import org.jobcubator.jobcubator.tag.domain.Tag;
import org.jobcubator.jobcubator.tag.domain.TagRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TagServiceImpl implements TagService {

    private final TagRepository tagRepository;

    @Override
    @Transactional
    public Tag createTag(String tagName) {
        return tagRepository.findByName(tagName)
                .orElseGet(() -> tagRepository.save(Tag.builder().name(tagName).build()));
    }

    @Override
    @Transactional
    public List<Tag> getAllTags() {
        return tagRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Tag> searchTags(String keyword) {
        return tagRepository.searchByKeyword(keyword);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Tag> getMostUsedJobTags() {
        return tagRepository.findMostUsedTagsInJobPosts();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Tag> getMostUsedCourseTags() {
        return tagRepository.findMostUsedTagsInCourses();
    }
}
