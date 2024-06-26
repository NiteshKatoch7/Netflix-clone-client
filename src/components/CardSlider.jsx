import React, { useRef, useState } from 'react'
import Card from '../components/Card'
import styled from 'styled-components'
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';

export default React.memo(
  function CardSlider({data, title}) {
    const [showControls, setShowControls] = useState(false);
    const [sliderPosition, setSliderPosition] = useState(0);
    const listRef = useRef();
  
    const handleDirection = (direction) => {
      let distance = listRef.current.getBoundingClientRect().x - 70;
      console.log(distance, direction, listRef, sliderPosition)
      if(direction === "left" && sliderPosition > 0) {
        listRef.current.style.transform = `translateX(${280 + distance}px)`;
        setSliderPosition(sliderPosition - 1);
      }
      if(direction === "right" && sliderPosition < 5) {
        listRef.current.style.transform = `translateX(${-280 + distance}px)`;
        setSliderPosition(sliderPosition + 1);
      }
    }
  
    return (
      <Container
        onMouseEnter={()=>setShowControls(true)}
        onMouseLeave={()=> setShowControls(false)}
      >
        <h1>{title}</h1>
        <div className="wrapper">
          <div className={ `slider-action left ${!showControls ? "none" : ""}` }>
            <AiOutlineLeft onClick={()=> handleDirection("left")} />
          </div>
          <div className="cardSliderWrapper slider" ref={listRef}>
            {
              data.map((movie,index) => {
                return <Card movieData={movie} index={index} key={movie.id} />
              })
            }
          </div>
          <div className={ `slider-action right ${!showControls ? "none" : ""}` }>
            <AiOutlineRight onClick={()=> handleDirection("right")} />
          </div>
        </div>
      </Container>
    )
  }
)

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
  padding: 2rem 0;
  h1{
    margin-left: 50px
  }
  .wrapper{
    position: relative;
    .slider{
      width: max-content;
      gap: 1rem;
      transform: translateX(0px);
      transition: 0.3s ease-in-out;
      margin-left: 50px;
    }
    .slider-action{
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      z-index: 99;
      height: 100%;
      top: 0;
      bottom: 0;
      width: 50px;
      transition: 0.3s ease-in-out;
      svg{
        font-size: 2rem;
      }
      &.none{
        display: none;
      }
      &.left{
        left: 0;
        cursor: pointer;
      }
      &.right{
        right: 0;
        cursor: pointer;
      }
    }
  }
  .cardSliderWrapper{
    display: flex;
  }
`;