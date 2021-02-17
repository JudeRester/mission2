package com.malgn.mission2.config;

import org.springframework.boot.web.server.ErrorPage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;
import org.springframework.boot.web.servlet.server.ConfigurableServletWebServerFactory;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    private String uploadImagesPath;

    public WebConfig(@Value("${property.image.location}") String uploadImagesPath) {
        this.uploadImagesPath = uploadImagesPath;
    }

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/notFound").setViewName("forward:/index.html");
    }

    @Bean
    public WebServerFactoryCustomizer<ConfigurableServletWebServerFactory> containerCustomizer() {
        return container -> {
            container.addErrorPages(new ErrorPage(HttpStatus.NOT_FOUND, "/notFound"));
        };
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String os = System.getProperty("os.name").toLowerCase();
        if (os.contains("win"))
            uploadImagesPath = "c:" + uploadImagesPath;
        else if (os.contains("mac"))
            uploadImagesPath = System.getProperty("user.home") + uploadImagesPath;
        registry.addResourceHandler("/uploadedImages/**").addResourceLocations("file:///" + uploadImagesPath)
                .setCachePeriod(3600).resourceChain(true).addResolver(new PathResourceResolver());
    }

}
