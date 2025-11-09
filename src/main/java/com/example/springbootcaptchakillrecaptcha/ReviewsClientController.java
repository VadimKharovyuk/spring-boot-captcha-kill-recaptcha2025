package com.example.springbootcaptchakillrecaptcha;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.awt.print.Pageable;

@Controller
@RequiredArgsConstructor
@RequestMapping("/reviews")
public class ReviewsClientController {
    private static final Logger logger = LoggerFactory.getLogger(ReviewsClientController.class);

    private final ReviewsService reviewsService;

    @GetMapping
    public String reviews(Model model, Pageable pageable) {

        PageResponse<ReviewsResponseDto> allReviews = reviewsService.getAll(pageable);


        if (!model.containsAttribute("createDto")) {
            model.addAttribute("createDto", new ReviewsCreateDto());
        }

        return "reviews/list";
    }

    @PostMapping("/create")
    public String create(
            @ModelAttribute ReviewsCreateDto createDto,
            RedirectAttributes redirectAttributes,
            @RequestParam(value = "honeypot_website", required = false, defaultValue = "") String honeypotWebsite,
            @RequestParam(value = "honeypot_phone", required = false, defaultValue = "") String honeypotPhone,
            @RequestParam(value = "captcha_answer", required = false, defaultValue = "") String captchaAnswer) {

        logger.info("Начало создания отзыва");

        // Honeypot проверка
        if (!honeypotWebsite.isEmpty() || !honeypotPhone.isEmpty()) {
            logger.warn("⚠️ Honeypot срабатывает!");
            redirectAttributes.addFlashAttribute("successMessage", "Спасибо за отзыв!");
            return "redirect:/reviews";
        }
        // Math CAPTCHA проверка (базовая)
        if (captchaAnswer == null || captchaAnswer.isEmpty()) {
            redirectAttributes.addFlashAttribute("errorMessage", "Пожалуйста, решите задачу");
            redirectAttributes.addFlashAttribute("createDto", createDto);
            return "redirect:/reviews";
        }
        try {
            reviewsService.create(createDto);
            redirectAttributes.addFlashAttribute("successMessage",
                    "Дякуємо за ваш відгук! Він був успішно доданий.");
            logger.info("✅ Отзыв успешно создан для: {}", createDto.getClientName());
        } catch (Exception e) {
            logger.error("❌ Ошибка при сохранении отзыва", e);
            redirectAttributes.addFlashAttribute("errorMessage", "Сталася помилка. Спробуйте ще раз.");
            redirectAttributes.addFlashAttribute("createDto", createDto);
        }
        return "redirect:/reviews";
    }
}