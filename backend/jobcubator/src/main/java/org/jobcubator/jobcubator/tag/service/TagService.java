package org.jobcubator.jobcubator.tag.service;

import org.jobcubator.jobcubator.tag.domain.Tag;

import java.util.List;

public interface TagService {
    Tag createTag(String tagName);
    List<Tag> getAllTags();
    public List<Tag> searchTags(String keyword);
    public List<Tag> getMostUsedJobTags();
    public List<Tag> getMostUsedCourseTags();
}
