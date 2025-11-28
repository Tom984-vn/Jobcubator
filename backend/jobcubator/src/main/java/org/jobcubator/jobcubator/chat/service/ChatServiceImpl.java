package org.jobcubator.jobcubator.chat.service;

import lombok.RequiredArgsConstructor;
import org.jobcubator.jobcubator.application.domain.Application;
import org.jobcubator.jobcubator.application.domain.ApplicationRepository;
import org.jobcubator.jobcubator.chat.domain.ChatMessage;
import org.jobcubator.jobcubator.chat.domain.ChatMessageRepository;
import org.jobcubator.jobcubator.chat.dto.ChatMessageResponse;
import org.jobcubator.jobcubator.company.domain.Company;
import org.jobcubator.jobcubator.company.domain.CompanyMemberRepository;
import org.jobcubator.jobcubator.user.domain.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final ApplicationRepository applicationRepository;
    private final CompanyMemberRepository companyMemberRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ChatMessageResponse> getChatHistory(User viewer, Long applicationId, Pageable pageable) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
        validateViewer(viewer, application);
        return chatMessageRepository.findByApplicationIdOrderBySentAtAsc(applicationId, pageable).stream()
                .map(this::mapToDTO)
                .toList();
    }

    @Override
    @Transactional
    public ChatMessageResponse saveMessage(Long applicationId, User sender, String content) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
        validateSender(sender, application);

        ChatMessage chatmessage = ChatMessage.builder()
                .application(application)
                .content(content)
                .sender(sender)
                .build();
        chatMessageRepository.save(chatmessage);
        return mapToDTO(chatmessage);
    }

    private ChatMessageResponse mapToDTO(ChatMessage msg){
        return ChatMessageResponse.builder()
                .id(msg.getId())
                .applicationId(msg.getApplication().getId())
                .senderId(msg.getSender().getId())
                .senderName(msg.getSender().getFullName())
                .content(msg.getContent())
                .sentAt(msg.getSentAt())
                .build();
        }

    private void validateSender(User sender, Application application) throws AccessDeniedException {
        // 1. Check if the sender is the candidate who applied
        if (application.getCandidate().getId().equals(sender.getId())) {
            return; // Authorized as Candidate
        }

        // 2. Check if the sender is a member of the company that owns the job post
        Company jobCompany = application.getJobPost().getCompany();
        boolean isCompanyMember = companyMemberRepository.existsByCompanyIdAndUserId(jobCompany.getId(), sender.getId());

        if (isCompanyMember) {
            return; // Authorized as Company Member
        }

        throw new AccessDeniedException("You are not authorized to participate in this chat.");
    }

    private void validateViewer(User sender, Application application) throws AccessDeniedException {
        // 1. Check if the sender is the candidate who applied
        if (application.getCandidate().getId().equals(sender.getId())) {
            return; // Authorized as Candidate
        }

        // 2. Check if the sender is a member of the company that owns the job post
        Company jobCompany = application.getJobPost().getCompany();
        boolean isCompanyMember = companyMemberRepository.existsByCompanyIdAndUserId(jobCompany.getId(), sender.getId());

        if (isCompanyMember) {
            return; // Authorized as Company Member
        }

        throw new AccessDeniedException("You are not authorized to view this chat.");
    }
}
