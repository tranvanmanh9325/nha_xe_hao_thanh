package com.haothanh.booking.service;

import com.haothanh.booking.entity.Faq;
import com.haothanh.booking.repository.FaqRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FaqService {

    private final FaqRepository faqRepository;

    public List<Faq> getAllActiveFaqs() {
        return faqRepository.findByIsActiveTrueOrderByOrderIndexAsc();
    }
}