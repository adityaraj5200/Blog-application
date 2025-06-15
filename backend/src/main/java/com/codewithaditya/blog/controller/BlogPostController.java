package com.codewithaditya.blog.controller;

import com.codewithaditya.blog.model.BlogPost;
import com.codewithaditya.blog.service.BlogPostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class BlogPostController {
    private final BlogPostService blogPostService;

    @GetMapping
    public ResponseEntity<List<BlogPost>> getAllPosts() {
        System.out.println("Testing by Aditya : BlogPostController.java : getAllPosts() : 1");
        return ResponseEntity.ok(blogPostService.getAllPosts());
    }

    @PostMapping
    public ResponseEntity<BlogPost> createPost(@RequestBody BlogPost blogPost) {
        System.out.println("Testing by Aditya : BlogPostController.java : createPost() : 1");
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(blogPostService.createPost(blogPost));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable Long id) {
        System.out.println("Testing by Aditya : BlogPostController.java : deletePost() : 1");
        try {
            blogPostService.deletePost(id);
            System.out.println("Testing by Aditya : BlogPostController.java : deletePost() : 2");
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            System.out.println("Testing by Aditya : BlogPostController.java : deletePost() : 3");
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Post not found with id: " + id);
        }
    }
}