package me.ramos.WaitForm.domain.board.controller;

import lombok.RequiredArgsConstructor;
import me.ramos.WaitForm.domain.board.dto.BoardLikeResponseDto;
import me.ramos.WaitForm.domain.board.service.BoardService;
import me.ramos.WaitForm.global.result.ResultResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static me.ramos.WaitForm.global.result.ResultCode.FIND_BOARD_LIKE_SUCCESS;

@RestController
@RequiredArgsConstructor
@RequestMapping("/like")
public class BoardLikeController {

    private final BoardService boardService;

    // 게시글에 좋아요 눌린 목록 리스트 조회
    @GetMapping("/{boardId}")
    public ResponseEntity<ResultResponse> getLikes(@PathVariable Long boardId) {
        List<BoardLikeResponseDto> response = boardService.findLikesByBoard(boardId);

        ResultResponse result = ResultResponse.of(FIND_BOARD_LIKE_SUCCESS, response);
        return new ResponseEntity<>(result, HttpStatus.valueOf(result.getStatus()));
    }
}
