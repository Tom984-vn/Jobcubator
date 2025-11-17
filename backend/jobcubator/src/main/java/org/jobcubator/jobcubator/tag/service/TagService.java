package org.jobcubator.jobcubator.tag.service;

import org.jobcubator.jobcubator.tag.domain.Tag;

import java.util.List;

public interface TagService {
    Tag createTag(String tagName);
    List<Tag> getAllTags();
}
