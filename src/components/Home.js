// This is the Home componnent.
import Carousel from 'react-bootstrap/Carousel';
import React, { useState } from 'react';
import NavScroll from './NavScroll';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../styles/Home.css";


function Home() {
    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex) => {
        setIndex(selectedIndex);
    };

    return (
        <div>
            <NavScroll />
            <Carousel activeIndex={index} onSelect={handleSelect}>
                <Carousel.Item>
                    <img
                        className="d-block w-100 carousel-image"
                        src="/resources/pragser-Italy.jpg"
                        alt="First slide"
                    />
                    <Carousel.Caption>
                    <h3>Pragser Wildsee, Italy</h3>
                    </Carousel.Caption>
                </Carousel.Item>

                <Carousel.Item>
                    <img
                        className="d-block w-100 carousel-image"
                        src="resources/annapurna.jpg"
                        alt="Second slide"
                    />
                    <Carousel.Caption>
                    <h3>Annapurna Sanctuary, Ghandruk, Nepal</h3>
                    </Carousel.Caption>
                </Carousel.Item>

                <Carousel.Item>
                    <img
                        className="d-block w-100 carousel-image"
                        src="resources/bali-indonesia.jpg"
                        alt="Third slide"
                    />
                    <Carousel.Caption>
                    <h3>Klingking beach, bali, indonesia</h3>
                    </Carousel.Caption>
                </Carousel.Item>
                
                <Carousel.Item>
                    <img
                        className="d-block w-100 carousel-image"
                        src="resources/grandCanyon.jpg"
                        alt="Fourth slide"
                    />
                    <Carousel.Caption>
                    <h3>Horseshoe Bend, Page, United States</h3>
                    </Carousel.Caption>
                </Carousel.Item>

                <Carousel.Item>
                    <img
                        className="d-block w-100 carousel-image"
                        src="resources/sanfrancisco.jpg"
                        alt="Fifth slide"
                    />
                    <Carousel.Caption>
                    <h3>Golden Gate Bridge, San Francisco, United States</h3>
                    </Carousel.Caption>
                </Carousel.Item>

                <Carousel.Item>
                    <img
                        className="d-block w-100 carousel-image"
                        src="resources/newyork.jpg"
                        alt="Sixth slide"
                    />
                    <Carousel.Caption>
                    <h3>New York, USA</h3>
                    </Carousel.Caption>
                </Carousel.Item>

            </Carousel>
        </div>
    );
}

export default Home;