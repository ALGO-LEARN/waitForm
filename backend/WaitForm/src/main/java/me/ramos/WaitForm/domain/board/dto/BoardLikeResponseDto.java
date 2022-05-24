package me.ramos.WaitForm.domain.board.dto;

import com.querydsl.core.annotations.QueryProjection;
import lombok.*;
import me.ramos.WaitForm.domain.board.entity.Board;
import me.ramos.WaitForm.domain.board.entity.BoardLike;
import me.ramos.WaitForm.domain.member.entity.Member;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class BoardLikeResponseDto {

    private Long boardLikeId;
    private Long boardId;
    private String nickname;

    public static BoardLikeResponseDto of(BoardLike boardLike, Board board, Member member) {
        return new BoardLikeResponseDto(boardLike.getId(), board.getId(), member.getNickname());
    }

    @QueryProjection
    public BoardLikeResponseDto(Long boardLikeId, Long boardId, String nickname) {
        this.boardLikeId = boardLikeId;
        this.boardId = boardId;
        this.nickname = nickname;
    }
}
