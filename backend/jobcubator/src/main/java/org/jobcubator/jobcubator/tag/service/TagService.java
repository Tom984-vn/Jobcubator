package org.jobcubator.jobcubator.tag.service;

import org.jobcubator.jobcubator.tag.domain.Tag;

import java.util.List;
import java.util.Set;

public interface TagService {
    Tag createTag(String tagName);
    Set<Tag> findOrCreateTags(Set<String> tagNames);
    List<Tag> getAllTags();
    public List<Tag> searchTags(String keyword);
    public List<Tag> getMostUsedJobTags();
    public List<Tag> getMostUsedCourseTags();
}
