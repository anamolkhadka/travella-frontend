// This is the Home componnent.
import Carousel from 'react-bootstrap/Carousel';
import React, { useState } from 'react';
import NavScroll from './NavScroll';
import "../styles/Home.css";
import { aboutSection, featuresSection } from '../data/data.js';


function Home({ user, setUser, setIsAuthenticated, setToken }) {
    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex) => {
        setIndex(selectedIndex);
    };

    return (
        <div>
            <NavScroll user={user} setUser={setUser} setIsAuthenticated={setIsAuthenticated} setToken={setToken}/>
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
            {/* About Section */}
            <div className="about-section" id="about">
                <h1>About Us</h1>
                <p>{aboutSection.heading}</p>
                <p>{aboutSection.text}</p>
            </div>
            
            {/* Features Section */}
            <div className="features-section container py-5">
                <h2 className="text-center mb-4">Our Features</h2>
                <div className="row justify-content-center">
                    {featuresSection.map((feature) => (
                    <div key={feature.id} className="col-sm-6 col-md-4 col-lg-4 mb-4 d-flex justify-content-center">
                        <div className="card compact-feature-card text-center shadow-sm p-3">
                        <img
                            src={feature.image}
                            className="feature-icon mb-3"
                            alt={feature.title}
                        />
                        <h6 className="feature-title">{feature.title}</h6>
                        <p className="feature-text small">{feature.description}</p>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Home;