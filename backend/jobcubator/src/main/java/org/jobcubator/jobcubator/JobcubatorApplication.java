package org.jobcubator.jobcubator;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class JobcubatorApplication {

    public static void main(String[] args) {
        SpringApplication.run(JobcubatorApplication.class, args);
    }

}
