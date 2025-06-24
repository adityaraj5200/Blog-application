package com.codewithaditya.blog.service;

import com.codewithaditya.blog.model.BlogPost;
import com.codewithaditya.blog.model.User;
import com.codewithaditya.blog.repository.BlogPostRepository;
import com.codewithaditya.blog.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BlogPostService {
    private final BlogPostRepository blogPostRepository;
    private final UserRepository userRepository;
    private static final Logger logger = LoggerFactory.getLogger(BlogPostService.class);

    public List<BlogPost> getAllPosts() {
        return blogPostRepository.findAll();
    }

    public BlogPost getPostById(Long id) {
        return blogPostRepository.findById(id).orElse(null);
    }

    @Transactional
    public BlogPost createPost(BlogPost blogPost, String username) {
        logger.info("=== SERVICE CREATE POST ===");
        logger.info("Creating post for user: {}", username);
        
        User author = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        blogPost.setAuthor(author);
        
        logger.info("About to save new post with author: {}", author.getUsername());
        BlogPost savedPost = blogPostRepository.save(blogPost);
        logger.info("New post created successfully - id: {}, title: {}", savedPost.getId(), savedPost.getTitle());
        logger.info("=============================");
        
        return savedPost;
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

    @Transactional
    public BlogPost updatePost(Long id, BlogPost updatedPost, String username) {
        logger.info("=== SERVICE UPDATE POST DEBUG ===");
        logger.info("Looking for post with id: {}", id);
        
        BlogPost existingPost = blogPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        logger.info("Found existing post - id: {}, title: {}, author: {}", 
                   existingPost.getId(), existingPost.getTitle(), 
                   existingPost.getAuthor() != null ? existingPost.getAuthor().getUsername() : "null");
        
        if (!existingPost.getAuthor().getUsername().equals(username)) {
            logger.error("Access denied: post author {} != current user {}", 
                        existingPost.getAuthor().getUsername(), username);
            throw new AccessDeniedException("You can only update your own posts");
        }
        
        logger.info("Updating post fields - old title: '{}', new title: '{}'", 
                   existingPost.getTitle(), updatedPost.getTitle());
        logger.info("Updating post fields - old content length: {}, new content length: {}", 
                   existingPost.getContent() != null ? existingPost.getContent().length() : 0,
                   updatedPost.getContent() != null ? updatedPost.getContent().length() : 0);
        
        existingPost.setTitle(updatedPost.getTitle());
        existingPost.setContent(updatedPost.getContent());
        
        logger.info("About to save existing post with id: {}", existingPost.getId());
        BlogPost savedPost = blogPostRepository.save(existingPost);
        logger.info("Post saved successfully - id: {}, title: {}", savedPost.getId(), savedPost.getTitle());
        logger.info("=====================================");
        
        return savedPost;
    }

    public boolean isPostAuthor(Long postId, String username) {
        return blogPostRepository.findById(postId)
                .map(post -> post.getAuthor().getUsername().equals(username))
                .orElse(false);
    }
}