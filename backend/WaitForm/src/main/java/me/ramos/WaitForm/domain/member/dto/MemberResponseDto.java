package me.ramos.WaitForm.domain.member.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import me.ramos.WaitForm.domain.member.entity.Member;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class MemberResponseDto {
    private String email;

    /**
     * 정적 팩토리 메서드 패턴
     * @param member
     * @return
     */
    public static MemberResponseDto of(Member member) {
        return new MemberResponseDto(member.getEmail());
    }
}
