package me.ramos.WaitForm.domain.member.service;

import lombok.RequiredArgsConstructor;
import me.ramos.WaitForm.domain.member.dto.MemberResponseDto;
import me.ramos.WaitForm.domain.member.exception.MemberNotFoundException;
import me.ramos.WaitForm.domain.member.repository.MemberRepository;
import me.ramos.WaitForm.global.config.util.SecurityUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;

    @Transactional(readOnly = true)
    public MemberResponseDto getMyInfo() {
        Long currentMemberId = SecurityUtil.getCurrentMemberId();

        return memberRepository.findById(currentMemberId)
                .map(MemberResponseDto::of)
                .orElseThrow(MemberNotFoundException::new);
    }
}
