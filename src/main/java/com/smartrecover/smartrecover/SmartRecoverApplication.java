package com.smartrecover.smartrecover;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication(exclude = { DataSourceAutoConfiguration.class })
@ComponentScan(basePackages = { "com.smartrecover" })
public class SmartRecoverApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartRecoverApplication.class, args);
    }
}
