package me.ramos.WaitForm.domain.member.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import me.ramos.WaitForm.domain.member.entity.Member;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MemberRegisterRequestDto {

    @NotBlank(message = "이메일을 입력해주세요")
    @Email(message = "이메일의 형식이 맞지 않습니다.")
    private String email;

    @NotBlank(message = "비밀번호를 입력해주세요")
    private String password;

    @NotBlank(message = "닉네임을 입력해주세요")
    private String nickname;

    public Member toEntity() {
        return Member.builder()
                .email(getEmail())
                .password(getPassword()) // AuthService에서 BCryptPasswordEncoder로 인코딩 후 save 해야 함.
                .nickname(getNickname())
                .build();
    }
}
