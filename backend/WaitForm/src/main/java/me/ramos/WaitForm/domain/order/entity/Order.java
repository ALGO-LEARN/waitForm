package me.ramos.WaitForm.domain.order.entity;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import me.ramos.WaitForm.domain.member.entity.Member;
import org.springframework.data.annotation.CreatedDate;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Order {

    @Id
    @Column(name = "order_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_title", nullable = false)
    private String title;

    @Column(name = "order_content", nullable = false, length = 4000)
    private String content;

    @CreatedDate
    @Column(name = "order_upload_date")
    private LocalDateTime uploadDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @Builder
    public Order(Member member, String title, String content) {
        this.member = member;
        this.title = title;
        this.content = content;
    }
}
