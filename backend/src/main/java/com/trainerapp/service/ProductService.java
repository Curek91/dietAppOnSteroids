package com.trainerapp.service;

import com.trainerapp.model.Product;
import com.trainerapp.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public List<Product> searchProducts(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllProducts();
        }
        return productRepository.findByNameContainingIgnoreCase(query);
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, Product updatedProduct) {
        return productRepository.findById(id).map(product -> {
            product.setName(updatedProduct.getName());
            product.setCalories(updatedProduct.getCalories());
            product.setProtein(updatedProduct.getProtein());
            product.setFat(updatedProduct.getFat());
            product.setCarbohydrates(updatedProduct.getCarbohydrates());
            product.setUnit(updatedProduct.getUnit());
            return productRepository.save(product);
        }).orElseThrow(() -> new RuntimeException("Product not found with id " + id));
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    public long getProductCount() {
        return productRepository.count();
    }

    public void saveAll(List<Product> products) {
        productRepository.saveAll(products);
    }
}
