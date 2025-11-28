package org.jobcubator.jobcubator.tag.service;

import lombok.RequiredArgsConstructor;
import org.jobcubator.jobcubator.tag.domain.Tag;
import org.jobcubator.jobcubator.tag.domain.TagRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

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
    public Set<Tag> findOrCreateTags(Set<String> tagNames) {
        Set<Tag> tags = new HashSet<>();
        if(tagNames == null || tagNames.isEmpty()) {
            return tags;
        }
        for(String tagName : tagNames) {
            String normalizedName = tagName.trim().toLowerCase();
            Optional<Tag> existingTag = tagRepository.findByName(normalizedName);

            if(existingTag.isPresent()) {
                tags.add(existingTag.get());
            } else {
                Tag newTag =  Tag.builder().name(normalizedName).build();
                tags.add(tagRepository.save(newTag));
            }
        }
        return tags;
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
