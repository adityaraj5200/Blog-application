package com.codewithaditya.blog.controller;

import com.codewithaditya.blog.dto.BlogPostDTO;
import com.codewithaditya.blog.model.BlogPost;
import com.codewithaditya.blog.service.BlogPostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class BlogPostController {
    private final BlogPostService blogPostService;

    @GetMapping
    public ResponseEntity<List<BlogPostDTO>> getAllPosts() {
        List<BlogPostDTO> posts = blogPostService.getAllPosts().stream()
                .map(BlogPostDTO::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BlogPostDTO> getPostById(@PathVariable Long id) {
        BlogPost post = blogPostService.getPostById(id);
        if (post == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(BlogPostDTO.fromEntity(post));
    }

    @PostMapping
    public ResponseEntity<BlogPostDTO> createPost(@RequestBody BlogPost blogPost) {
        String username = getCurrentUsername();
        BlogPost createdPost = blogPostService.createPost(blogPost, username);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(BlogPostDTO.fromEntity(createdPost));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BlogPostDTO> updatePost(@PathVariable Long id, @RequestBody BlogPost blogPost) {
        String username = getCurrentUsername();
        try {
            BlogPost updatedPost = blogPostService.updatePost(id, blogPost, username);
            return ResponseEntity.ok(BlogPostDTO.fromEntity(updatedPost));
        } catch (Exception e) {
            if (e instanceof org.springframework.security.access.AccessDeniedException) {
                return ResponseEntity
                        .status(HttpStatus.FORBIDDEN)
                        .build();
            }
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable Long id) {
        String username = getCurrentUsername();
        try {
            blogPostService.deletePost(id, username);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            if (e instanceof org.springframework.security.access.AccessDeniedException) {
                return ResponseEntity
                        .status(HttpStatus.FORBIDDEN)
                        .body(e.getMessage());
            }
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Post not found with id: " + id);
        }
    }

    private String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }
        return authentication.getName();
    }
}