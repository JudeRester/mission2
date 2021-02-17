package com.malgn.mission2.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/")
public class ViewController {
    private final String index = "/index.html";

    @RequestMapping("/")
    public String home() {
        return index;
    }
}
