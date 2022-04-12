package me.ramos.WaitForm.repository;

import me.ramos.WaitForm.TestConfig;
import me.ramos.WaitForm.domain.board.dto.BoardResponseDto;
import me.ramos.WaitForm.domain.board.entity.Board;
import me.ramos.WaitForm.domain.board.repository.BoardCustomRepositoryImpl;
import me.ramos.WaitForm.domain.board.repository.BoardRepository;
import me.ramos.WaitForm.domain.member.entity.Authority;
import me.ramos.WaitForm.domain.member.entity.Member;
import me.ramos.WaitForm.domain.member.repository.MemberRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@Import(TestConfig.class)
public class BoardRepositoryTest {

    @Autowired
    BoardRepository boardRepository;
    @Autowired
    MemberRepository memberRepository;
    @Autowired
    BoardCustomRepositoryImpl boardCustomRepository;

    @BeforeEach
    void init() {
        Member member = Member.builder()
                .email("test@test.com")
                .password("test1234")
                .nickname("test")
                .authority(Authority.ROLE_USER)
                .build();

        memberRepository.save(member);

        Board board = Board.builder()
                .title("Board test")
                .content("생성합니다. 2022년 4월 7일 오늘의 날씨는 매우 맑음... 벛꽃이 만연한 봄날.")
                .member(member)
                .build();

        boardRepository.save(board);

        Board board2 = Board.builder()
                .title("Board test2")
                .content("test2")
                .member(member)
                .build();

        boardRepository.save(board2);
    }

    @Test
    @DisplayName("Board 생성 테스트")
    public void test() throws Exception {
        //when
        Board test = boardRepository.findById(1L).orElseThrow();

        //then
        assertThat("Board test").isEqualTo(test.getTitle());
        assertThat("생성합니다. 2022년 4월 7일 오늘의 날씨는 매우 맑음... 벛꽃이 만연한 봄날.").isEqualTo(test.getContent());
        assertThat("test@test.com").isEqualTo(test.getMember().getEmail());
    }

    @Test
    @DisplayName("QueryDSL SELECT test")
    public void querydslTest() {
        List<BoardResponseDto> list = boardRepository.findAllByMemberId(1L);

//        for (BoardResponseDto dto : list) {
//            System.out.println(dto.getContent());
//            System.out.println(dto.getCreatedDate());
//        }

//        assertThat("test").isEqualTo(list.get(1).getWriterNickname());
    }

    @AfterEach
    void tearDown() {
        memberRepository.deleteAll();
        boardRepository.deleteAll();
    }
}
