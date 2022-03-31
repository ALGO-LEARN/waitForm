package me.ramos.WaitForm.domain.member.dto;

import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class MemberLogoutRequestDto {

    @ApiModelProperty(value = "refreshToken", required = true)
    private String refreshToken;
}
