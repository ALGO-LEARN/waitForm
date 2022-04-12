package me.ramos.WaitForm.domain.board.service;

import lombok.RequiredArgsConstructor;
import me.ramos.WaitForm.domain.board.dto.BoardEnrollRequestDto;
import me.ramos.WaitForm.domain.board.dto.BoardResponseDto;
import me.ramos.WaitForm.domain.board.entity.Board;
import me.ramos.WaitForm.domain.board.exception.BoardNotFoundException;
import me.ramos.WaitForm.domain.board.repository.BoardRepository;
import me.ramos.WaitForm.domain.member.entity.Member;
import me.ramos.WaitForm.domain.member.exception.MemberNotFoundException;
import me.ramos.WaitForm.domain.member.repository.MemberRepository;
import me.ramos.WaitForm.global.config.util.SecurityUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BoardService {

    private final BoardRepository boardRepository;
    private final MemberRepository memberRepository;

    // 등록
    @Transactional
    public BoardResponseDto upload(BoardEnrollRequestDto request) {
        final Long memberId = SecurityUtil.getCurrentMemberId();
        Member member = memberRepository.findById(memberId).orElseThrow(MemberNotFoundException::new);
        Board board = Board.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .member(member)
                .build();

        boardRepository.save(board);

        return BoardResponseDto.of(board, member);
    }

    // 삭제

    // 본인이 쓴 글 목록 조회
    public List<BoardResponseDto> getMyBoardList() {
        final Long memberId = SecurityUtil.getCurrentMemberId();

        return boardRepository.findAllByMemberId(memberId);
    }

    // 단일 조회(상세)
    public BoardResponseDto findDetailInfo(Long boardId) {
        Board board = boardRepository.findById(boardId).orElseThrow(BoardNotFoundException::new);

        return BoardResponseDto.of(board);
    }

}
