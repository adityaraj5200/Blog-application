package com.codewithaditya.blog.service;

import com.codewithaditya.blog.model.BlogPost;
import com.codewithaditya.blog.repository.BlogPostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BlogPostService {
    private final BlogPostRepository blogPostRepository;

    public List<BlogPost> getAllPosts() {
        return blogPostRepository.findAll();
    }

    public BlogPost createPost(BlogPost blogPost) {
        return blogPostRepository.save(blogPost);
    }

    public void deletePost(Long id) {
        blogPostRepository.deleteById(id);
    }
}