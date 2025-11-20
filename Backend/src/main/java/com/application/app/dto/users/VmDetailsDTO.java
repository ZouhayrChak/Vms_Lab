package com.application.app.dto.users;


import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class VmDetailsDTO {
    private int idVm;
    private int idSb;
    private int idNb;
    private String nameVm;
    private String ipVm;
    private String natIp;
}
