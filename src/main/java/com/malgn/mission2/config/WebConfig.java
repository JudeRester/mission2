package com.malgn.mission2.config;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    private String uploadImagesPath;

    public WebConfig(@Value("${property.image.location}") String uploadImagesPath) {
        this.uploadImagesPath = uploadImagesPath;
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String os = System.getProperty("os.name").toLowerCase();
        if (os.contains("win"))
            uploadImagesPath = "d:" + uploadImagesPath;
        else if (os.contains("mac"))
            uploadImagesPath = System.getProperty("user.home") + uploadImagesPath;
        registry.addResourceHandler("/uploadedImages/**").addResourceLocations("file:///" + uploadImagesPath)
                .setCachePeriod(3600).resourceChain(true).addResolver(new PathResourceResolver());
    }

}
