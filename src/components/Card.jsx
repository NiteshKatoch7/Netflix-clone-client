import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import video from "../assets/video.mp4";
import {IoPlayCircleSharp} from 'react-icons/io5';
import {RiThumbDownFill, RiThumbUpFill} from 'react-icons/ri';
import {BsCheck} from 'react-icons/bs';
import {AiOutlinePlus} from 'react-icons/ai';
import {BiChevronDown} from 'react-icons/bi';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../utils/firebase-authentication';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { removeFromLikedMovies } from '../redux/reducer/movieReducer';

export default React.memo( 
  function Card({movieData,isLiked = false}) {
    const navigate = useNavigate();
    const [email, setEmail] = useState(undefined);
    const[isHovered,setIsHovered] = useState(false);
    const dispatch = useDispatch();

    onAuthStateChanged(auth, (user) =>{
      if(user){
        setEmail(user.email);
      }else{
        navigate('/signin')
      }
    })

    const addToList = async()=>{
      try{
        await axios.post("http://localhost:5000/api/user/add", {email, data:movieData})
      }catch(error){
        console.log('Error in posting the Movies: ', error);
      }
    }

    return (
        <Container onMouseEnter={()=> setIsHovered(true)} onMouseLeave={()=>  setIsHovered(false)}>
          <img 
            src={`https://image.tmdb.org/t/p/w500${movieData.image}`} 
            alt="movieBackgroundImage" 
          />
          {
            isHovered && (
              <div className="hover">
                <div className="image-video-container">
                  <img 
                    src={`https://image.tmdb.org/t/p/w500${movieData.image}`} 
                    alt="movieSmallBgImage" 
                    onClick={()=>navigate('/player')}
                  />
                  <video 
                    src={video} 
                    autoPlay 
                    loop 
                    muted
                    onClick={() => navigate('/player')}
                  ></video>
                </div>
                <div className="info-container">
                  <h3 className="name" onClick={()=> navigate('/player')}>
                    {movieData.name}
                  </h3>
                  <div className="icons">
                    <div className="controls">
                      <IoPlayCircleSharp 
                        title="play" 
                        onClick={()=> navigate('/player')}
                      />
                      <RiThumbUpFill title='Like' />
                      <RiThumbDownFill title='Dislike' />
                      {
                        isLiked ? (
                          <BsCheck title="Remove From List" onClick={()=>dispatch(removeFromLikedMovies({email, movieId: movieData.id}))}/>
                        ) : (
                          <AiOutlinePlus title="Add to my List" onClick={addToList}/>
                        )
                      }
                    </div>
                    <div className="info">
                      <BiChevronDown title="More Info" />
                    </div>
                  </div>
                  <div className="genres">
                    <ul>
                      {movieData.genres.map((genre) => {
                        return <li key={genre}>{genre}</li>
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            )
          }
        </Container>
    )
  }
)
const Container = styled.div`
  max-width: 270px;
  width: 270px;
  height: 100%;
  cursor: pointer;
  position: relative;
  img{
    border-radius: 0.2rem;
    width: 100%;
    height: 100%;
    z-index: 10;
  }
  .hover{
    z-index: 90;
    height: max-content;
    width: 20rem;
    position: absolute;
    bottom: 0;
    left: 0;
    transform: translateX(-25px);
    border-radius: 0.3rem;
    box-shadow: rgba(0,0,0,0.75) 0px 3px 10px;
    background-color: #181818;
    transition: all 0.6s ease-in-out;
  }
  .image-video-container{
    position: relative;
    height: 140px;
    img{
      width: 100%
      height: 140px;
      object-fit: cover;
      border-radius: 0.3rem;
      top: 0;
      z-index: 4;
      position: absolute;
    }
    video{
      width: 100%;
      height: 140px;
      object-fit: cover;
      border-radius: 0.3rem;
      top: 0;
      z-index: 5;
      position: absolute; 
    }
  }
  .info-container{
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .icons{
    display: flex;
    justify-content: space-between;
    .controls{
      display: flex;
      gap: 1rem;
    }
    svg{
      font-size: 2rem;
      cursor: pointer;
      transition: 0.3s ease-in-out;
      &:hover{
        color: #b8b8b8;
      }
    }
  }
  .genres{
    display: flex;
    ul{
      display: flex;
      gap: 1rem;
      li{
        padding-right: 0.7rem;
        &:first-of-type{
          list-style-type: none;
        }
      }
    }
  }
`;