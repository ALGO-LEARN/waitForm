package me.ramos.WaitForm.repository;

import me.ramos.WaitForm.TestConfig;
import me.ramos.WaitForm.domain.board.dto.BoardResponseDto;
import me.ramos.WaitForm.domain.board.entity.Board;
import me.ramos.WaitForm.domain.board.repository.BoardCustomRepositoryImpl;
import me.ramos.WaitForm.domain.board.repository.BoardRepository;
import me.ramos.WaitForm.domain.member.entity.Authority;
import me.ramos.WaitForm.domain.member.entity.Member;
import me.ramos.WaitForm.domain.member.repository.MemberRepository;
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
                .content("test content1")
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
    public void boardUploadTest() throws Exception {
        //when
        Board test = boardRepository.findById(1L).orElseThrow();

        //then
        assertThat("Board test").isEqualTo(test.getTitle());
        assertThat("test content1").isEqualTo(test.getContent());
        assertThat("test@test.com").isEqualTo(test.getMember().getEmail());

    }

    @Test
    @DisplayName("Member Id로 회원이 쓴 글 목록 조회 with QueryDSL")
    public void findAllByMemberIdTest_QueryDSL() {
        //when
        List<BoardResponseDto> list = boardRepository.findAllByMemberId(1L);

        //then
        assertThat(list.size()).isEqualTo(2);
        assertThat("test").isEqualTo(list.get(1).getWriterNickname());
    }



    @Test
    @DisplayName("삭제")
    public void deleteBoardTest() throws Exception {
        //when
        boardRepository.deleteAll();
        List<Board> list = boardRepository.findAll();

        //then
        assertThat(list.size()).isEqualTo(0);
    }
}
