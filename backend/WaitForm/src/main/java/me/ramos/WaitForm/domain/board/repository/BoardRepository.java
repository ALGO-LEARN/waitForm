package me.ramos.WaitForm.domain.board.repository;

import me.ramos.WaitForm.domain.board.entity.Board;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BoardRepository extends JpaRepository<Board, Long> {

}
