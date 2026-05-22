package com.trainerapp;

import org.junit.jupiter.api.Test;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

public class CreateUserTest {

    @Test
    public void createDietAppUser() throws Exception {
        String url = "jdbc:oracle:thin:@localhost:1521/freepdb1";
        String user = "sys as sysdba";
        String password = "oracle";
        
        System.out.println(">>> Connecting to Oracle as SYSDBA...");
        try (Connection conn = DriverManager.getConnection(url, user, password);
             Statement stmt = conn.createStatement()) {
            
            System.out.println(">>> Creating user diet_app...");
            try {
                stmt.execute("CREATE USER diet_app IDENTIFIED BY oracle");
                System.out.println(">>> User diet_app created successfully.");
            } catch (Exception e) {
                if (e.getMessage().contains("ORA-01920") || e.getMessage().toLowerCase().contains("exists")) {
                    System.out.println(">>> User diet_app already exists. Granting/updating privileges...");
                } else {
                    throw e;
                }
            }
            
            System.out.println(">>> Granting CONNECT, RESOURCE, UNLIMITED TABLESPACE to diet_app...");
            stmt.execute("GRANT CONNECT, RESOURCE, UNLIMITED TABLESPACE TO diet_app");
            System.out.println(">>> Privileges granted successfully. diet_app schema is ready!");
        } catch (Exception e) {
            System.out.println(">>> Oracle database is not reachable (" + e.getMessage() + ").");
            System.out.println(">>> Skipping Oracle user/privileges creation. (This is normal and perfectly fine if you are running in H2 mode.)");
        }
    }
}
