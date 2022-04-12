package me.ramos.WaitForm.domain.board.repository;

import me.ramos.WaitForm.domain.board.dto.BoardResponseDto;

import java.util.List;

public interface BoardCustomRepository {
    List<BoardResponseDto> findAllByMemberId(Long memberId);

}
