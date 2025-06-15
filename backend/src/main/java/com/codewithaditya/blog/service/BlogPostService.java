package com.codewithaditya.blog.service;

import com.codewithaditya.blog.model.BlogPost;
import com.codewithaditya.blog.model.User;
import com.codewithaditya.blog.repository.BlogPostRepository;
import com.codewithaditya.blog.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BlogPostService {
    private final BlogPostRepository blogPostRepository;
    private final UserRepository userRepository;

    public List<BlogPost> getAllPosts() {
        return blogPostRepository.findAll();
    }

    public BlogPost getPostById(Long id) {
        return blogPostRepository.findById(id).orElse(null);
    }

    @Transactional
    public BlogPost createPost(BlogPost blogPost, String username) {
        User author = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        blogPost.setAuthor(author);
        return blogPostRepository.save(blogPost);
    }

    @Transactional
    public void deletePost(Long id, String username) {
        BlogPost post = blogPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        if (!post.getAuthor().getUsername().equals(username)) {
            throw new AccessDeniedException("You can only delete your own posts");
        }
        
        blogPostRepository.deleteById(id);
    }

    public boolean isPostAuthor(Long postId, String username) {
        return blogPostRepository.findById(postId)
                .map(post -> post.getAuthor().getUsername().equals(username))
                .orElse(false);
    }
}