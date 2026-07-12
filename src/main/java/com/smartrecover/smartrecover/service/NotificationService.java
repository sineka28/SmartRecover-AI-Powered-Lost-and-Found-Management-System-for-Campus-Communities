package com.smartrecover.smartrecover.service;

import com.smartrecover.smartrecover.entity.Notification;
import com.smartrecover.smartrecover.entity.User;
import com.smartrecover.smartrecover.repository.NotificationRepository;
import com.smartrecover.smartrecover.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    @Autowired private NotificationRepository notificationRepository;
    @Autowired private UserRepository userRepository;

    public List<Notification> getUserNotifications(String userEmail) {
        User user = resolveUser(userEmail);
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    public long getUnreadCount(String userEmail) {
        User user = resolveUser(userEmail);
        return notificationRepository.countByUserIdAndIsRead(user.getId(), false);
    }

    /**
     * Mark a notification as read. Verifies it belongs to the authenticated user.
     */
    public Notification markAsRead(Long id, String userEmail) {
        User user = resolveUser(userEmail);
        Notification notif = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found: " + id));
        // Ownership check — prevent IDOR
        if (!notif.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied: this notification does not belong to you");
        }
        notif.setIsRead(true);
        return notificationRepository.save(notif);
    }

    public void markAllAsRead(String userEmail) {
        User user = resolveUser(userEmail);
        List<Notification> notifs =
                notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        notifs.forEach(n -> n.setIsRead(true));
        notificationRepository.saveAll(notifs);
    }

    // ── Helper ─────────────────────────────────────────────────────────────────

    private User resolveUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
