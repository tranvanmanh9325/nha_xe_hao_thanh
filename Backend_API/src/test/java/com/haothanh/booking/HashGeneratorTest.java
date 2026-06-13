package com.haothanh.booking;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class HashGeneratorTest {
    @Test
    public void generateHash() {
        System.out.println("HASH_OUTPUT_START");
        System.out.println(new BCryptPasswordEncoder().encode("1234567890@123"));
        System.out.println("HASH_OUTPUT_END");
    }
}
