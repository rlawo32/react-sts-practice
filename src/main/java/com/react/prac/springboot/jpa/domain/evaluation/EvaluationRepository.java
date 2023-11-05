package com.react.prac.springboot.jpa.domain.evaluation;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;


@Repository
public interface EvaluationRepository extends JpaRepository<Evaluation, Long> {

    Page<Evaluation> findAll(Pageable pageable);

    @Query("SELECT SUM(e.evaluationFunctionRating) FROM Evaluation e")
    Long findAllFunctionRating();

    @Query("SELECT SUM(e.evaluationDesignRating) FROM Evaluation e")
    Long findAllDesignRating();
}
