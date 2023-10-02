import React, {useEffect, useRef, useState} from "react";

const ImageModal = (props) => {
  const modalRef = useRef();

  useEffect( () => {

    const handler = (e) => {
      // mousedown 이벤트가 발생한 영역이 모달창이 아닐 때, 모달창 제거 처리
      if (modalRef.current && (!modalRef.current.contains(e.target))) {
        props.setImageModal(false);
      }
    };

    document.addEventListener('mousedown', handler);

    return () => {
      document.removeEventListener('mousedown', handler);
    };
  })

  return (
      <div ref={modalRef} className="imageModal-view">

          <img src={props.imageUrl} />

      </div>
  )
}

export default ImageModal;