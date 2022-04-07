package me.ramos.WaitForm.domain.order.repository;

import me.ramos.WaitForm.domain.order.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {


}
