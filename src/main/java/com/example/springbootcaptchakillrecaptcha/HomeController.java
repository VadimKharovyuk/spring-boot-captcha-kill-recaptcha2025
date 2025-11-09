package com.example.springbootcaptchakillrecaptcha;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.Map;

@Controller
public class HomeController {

    @GetMapping
    public String home(Model model) {
        return "home";

    }
}
