package com.react.prac.springboot.util;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.react.prac.springboot.jpa.domain.board.BoardImage;
import com.react.prac.springboot.jpa.domain.board.BoardImageRepository;
import com.react.prac.springboot.jpa.domain.board.MainBoard;
import com.react.prac.springboot.jpa.domain.board.MainBoardRepository;
import com.react.prac.springboot.web.dto.board.BoardImageRequestDto;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.List;

@RequiredArgsConstructor
@Service
@Data
public class UploadUtil {

    private final BoardImageRepository boardImageRepository;
    private final MainBoardRepository mainBoardRepository;
    private final AmazonS3 s3Client;

    @Value("${application.bucket.name}")
    private String bucketName;

    public void boardImageInsert(Long boardId, List<BoardImageRequestDto> requestDto) {

        MainBoard mainBoard = mainBoardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("해당 게시글이 없습니다. boardId : " + boardId));

        for(int i=0; i<requestDto.size(); i++) {

            String boardImageName = requestDto.get(i).getImgName();
            String boardImageUrl = requestDto.get(i).getImgUrl();
            Long boardImageSize = requestDto.get(i).getImgSize();
            String originName = boardImageName.substring(boardImageName.lastIndexOf("_")+1);
            String customName = boardImageName.substring(boardImageName.lastIndexOf("/")+1);
            String urlName = boardImageUrl;
            String extension = boardImageName.substring(boardImageName.lastIndexOf(".")+1);

            BoardImage boardImage = BoardImage.builder()
                    .mainBoard(mainBoard)
                    .boardImageOriginName(originName)
                    .boardImageCustomName(customName)
                    .boardImageUrlName(urlName)
                    .boardImageSize(boardImageSize)
                    .boardImageExtension(extension)
                    .build();

            boardImageRepository.save(boardImage);
        }
    }

    public File convertMultiPartFileToFile(MultipartFile multipartFile) {
        File convertedFile = new File(multipartFile.getOriginalFilename());

        try (FileOutputStream fos = new FileOutputStream(convertedFile)) {
            fos.write(multipartFile.getBytes());
        } catch (IOException e) {
            e.printStackTrace();
        }

        return convertedFile;
    }

    public void createFolder(String folderName) {
        s3Client.putObject(bucketName, folderName + "/", new ByteArrayInputStream(new byte[0]), new ObjectMetadata());
    }

    public void deleteFolder(String folderName) {
        s3Client.putObject(bucketName, folderName + "/", new ByteArrayInputStream(new byte[0]), new ObjectMetadata());
    }
}
