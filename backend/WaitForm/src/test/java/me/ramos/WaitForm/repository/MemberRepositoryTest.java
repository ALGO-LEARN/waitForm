package me.ramos.WaitForm.repository;

import me.ramos.WaitForm.domain.member.entity.Authority;
import me.ramos.WaitForm.domain.member.entity.Member;
import me.ramos.WaitForm.domain.member.repository.MemberRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
class MemberRepositoryTest {

    @Autowired
    MemberRepository memberRepository;

    @BeforeEach
    void init() {
        Member member = new Member("test@test.com", "password1234", "Ramos", Authority.ROLE_USER);
        memberRepository.save(member);
    }

    @Test
    @DisplayName("회원 생성 테스트")
    public void test() throws Exception {
        //when
        Member member = memberRepository.findById(1L).orElseThrow();

        //then
        assertEquals("Ramos", member.getNickname());
        assertEquals("test@test.com", member.getEmail());
        assertEquals(Authority.ROLE_USER, member.getAuthority());

    }

    @Test
    @DisplayName("이메일을 기준으로 찾기 테스트")
    public void testFindByEmail() throws Exception {
        //when
        Member member = memberRepository.findByEmail("test@test.com").orElseThrow();

        //then
        assertEquals("test@test.com", member.getEmail());
    }

    @AfterEach
    void tearDown() {
        memberRepository.deleteAll();
    }
}