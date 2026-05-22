package com.trainerapp.config;

import com.trainerapp.model.Product;
import com.trainerapp.model.Trainer;
import com.trainerapp.model.Client;
import com.trainerapp.repository.TrainerRepository;
import com.trainerapp.repository.ClientRepository;
import com.trainerapp.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.util.Arrays;
import java.util.List;

@Component
public class DatabaseLoader implements CommandLineRunner {

    @Autowired
    private ProductService productService;

    @Autowired
    private TrainerRepository trainerRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // 1. Seed Trainers
        Trainer zdzisiek = trainerRepository.findByUsername("zdzisiek").orElse(null);
        if (zdzisiek == null) {
            zdzisiek = Trainer.builder()
                    .username("zdzisiek")
                    .password(passwordEncoder.encode("123456"))
                    .name("Zdzisiu Biceps")
                    .build();
            zdzisiek = trainerRepository.save(zdzisiek);
            System.out.println(">>> Seeded trainer: Zdzisiu Biceps (zdzisiek)");
        }

        Trainer franek = trainerRepository.findByUsername("franek").orElse(null);
        if (franek == null) {
            franek = Trainer.builder()
                    .username("franek")
                    .password(passwordEncoder.encode("123456"))
                    .name("Franek Klatka")
                    .build();
            trainerRepository.save(franek);
            System.out.println(">>> Seeded trainer: Franek Klatka (franek)");
        }

        // 2. Assign current clients with null trainer to Zdzisiu
        List<Client> orphanedClients = clientRepository.findByTrainerIsNull();
        if (!orphanedClients.isEmpty()) {
            for (Client client : orphanedClients) {
                client.setTrainer(zdzisiek);
            }
            clientRepository.saveAll(orphanedClients);
            System.out.println(">>> Assigned " + orphanedClients.size() + " orphaned clients to trainer Zdzisiu Biceps!");
        }
        if (productService.getProductCount() == 0) {
            List<Product> defaultProducts = Arrays.asList(
                Product.builder().name("Pierś z kurczaka (surowa)").calories(120.0).protein(21.5).fat(1.3).carbohydrates(0.0).unit("g").build(),
                Product.builder().name("Ryż jaśminowy").calories(350.0).protein(7.0).fat(0.4).carbohydrates(79.0).unit("g").build(),
                Product.builder().name("Ryż brązowy").calories(354.0).protein(7.8).fat(2.2).carbohydrates(74.0).unit("g").build(),
                Product.builder().name("Jajko kurze (całe, M)").calories(143.0).protein(12.5).fat(9.5).carbohydrates(0.7).unit("g").build(),
                Product.builder().name("Białko jaja kurzego").calories(52.0).protein(10.9).fat(0.2).carbohydrates(0.7).unit("g").build(),
                Product.builder().name("Oliwa z oliwek").calories(884.0).protein(0.0).fat(100.0).carbohydrates(0.0).unit("g").build(),
                Product.builder().name("Masło orzechowe 100%").calories(588.0).protein(25.0).fat(50.0).carbohydrates(20.0).unit("g").build(),
                Product.builder().name("Płatki owsiane górskie").calories(389.0).protein(16.9).fat(6.9).carbohydrates(66.0).unit("g").build(),
                Product.builder().name("Banan (obrany)").calories(89.0).protein(1.1).fat(0.3).carbohydrates(22.8).unit("g").build(),
                Product.builder().name("Twaróg chudy").calories(86.0).protein(18.0).fat(0.5).carbohydrates(3.5).unit("g").build(),
                Product.builder().name("Twaróg półtłusty").calories(133.0).protein(16.0).fat(4.0).carbohydrates(3.7).unit("g").build(),
                Product.builder().name("Łosoś świeży (filet)").calories(208.0).protein(20.0).fat(13.0).carbohydrates(0.0).unit("g").build(),
                Product.builder().name("Awokado").calories(160.0).protein(2.0).fat(15.0).carbohydrates(9.0).unit("g").build(),
                Product.builder().name("Brokuły").calories(34.0).protein(2.8).fat(0.4).carbohydrates(7.0).unit("g").build(),
                Product.builder().name("Szpinak świeży").calories(23.0).protein(2.9).fat(0.4).carbohydrates(3.6).unit("g").build(),
                Product.builder().name("Skyr naturalny").calories(65.0).protein(12.0).fat(0.0).carbohydrates(4.0).unit("g").build(),
                Product.builder().name("Migdały").calories(579.0).protein(21.0).fat(49.0).carbohydrates(22.0).unit("g").build(),
                Product.builder().name("Kajzerka").calories(272.0).protein(8.0).fat(1.5).carbohydrates(55.0).unit("g").build(),
                Product.builder().name("Mleko 1.5%").calories(47.0).protein(3.4).fat(1.5).carbohydrates(4.8).unit("g").build(),
                Product.builder().name("Odżywka białkowa (WPC)").calories(390.0).protein(75.0).fat(6.0).carbohydrates(8.0).unit("g").build()
            );
            productService.saveAll(defaultProducts);
            System.out.println(">>> Database initialized with " + defaultProducts.size() + " default healthy products!");
        }
    }
}
