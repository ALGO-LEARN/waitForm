package me.ramos.WaitForm.domain.member.repository;

import me.ramos.WaitForm.domain.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {

    Optional<Member> findByEmail(String email);
    boolean existsByEmail(String email);

    Optional<Member> findByNickname(String nickname);

    boolean existsByNickname(String nickname);
}
