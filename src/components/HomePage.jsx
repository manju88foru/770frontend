import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import emailjs from '@emailjs/browser';

// Add keyframe animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const imageSlideIn = keyframes`
  from { 
    opacity: 0;
    transform: translateX(100%) scale(0.8);
  }
  to { 
    opacity: 1;
    transform: translateX(0) scale(1);
  }
`;

const imageSlideOut = keyframes`
  from {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateX(-100%) scale(0.8);
  }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const gradientMove = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const fadeInModal = keyframes`
  from { opacity: 0; transform: translate(-50%, -40%); }
  to { opacity: 1; transform: translate(-50%, -50%); }
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const slideNext = keyframes`
  from {
    transform: translateX(100%) scale(0.85);
    opacity: 0.6;
  }
  to {
    transform: translateX(20%) scale(0.85);
    opacity: 0.6;
  }
`;

const slidePrev = keyframes`
  from {
    transform: translateX(-100%) scale(0.85);
    opacity: 0.6;
  }
  to {
    transform: translateX(-20%) scale(0.85);
    opacity: 0.6;
  }
`;

const slideActive = keyframes`
  from {
    transform: translateX(20%) scale(0.85);
    opacity: 0.6;
  }
  to {
    transform: translateX(0) scale(1);
    opacity: 1;
  }
`;

// Add new keyframe animations
const slideInNext = keyframes`
  from {
    transform: translateX(100%) scale(0.8) rotate(5deg);
    opacity: 0;
  }
  to {
    transform: translateX(20%) scale(0.85) rotate(0deg);
    opacity: 0.6;
  }
`;

const slideInPrev = keyframes`
  from {
    transform: translateX(-100%) scale(0.8) rotate(-5deg);
    opacity: 0;
  }
  to {
    transform: translateX(-20%) scale(0.85) rotate(0deg);
    opacity: 0.6;
  }
`;

const slideInActive = keyframes`
  from {
    transform: scale(0.85) rotate(5deg);
    opacity: 0.6;
  }
  to {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
`;

// Add the glowing animation keyframe at the top with other animations
const glowPulse = keyframes`
  0% {
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.2),
      0 0 0 1px rgba(255, 255, 255, 0.1),
      inset 0 0 32px rgba(9, 185, 185, 0.1);
  }
  50% {
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.2),
      0 0 0 1px rgba(255, 255, 255, 0.1),
      inset 0 0 32px rgba(9, 185, 185, 0.2);
  }
  100% {
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.2),
      0 0 0 1px rgba(255, 255, 255, 0.1),
      inset 0 0 32px rgba(9, 185, 185, 0.1);
  }
`;

const EMAILJS_SERVICE_ID = "YOUR_EMAILJS_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_EMAILJS_TEMPLATE_ID";
const EMAILJS_PUBLIC_KEY = "YOUR_EMAILJS_PUBLIC_KEY";

const sliderImages = [
  "/images/6137.jpg",
  "/images/18778.jpg",
  "/images/9526.jpg",

];

const scrollToSection = (e, sectionId) => {
  if (e) {
    e.preventDefault();
  }
  const element = document.getElementById(sectionId);
  if (element) {
    const navbarHeight = document.querySelector('nav').offsetHeight;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState({ type: '', message: '' });
  const [showBookingsDrawer, setShowBookingsDrawer] = useState(false);
  const [pastBookings, setPastBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideInterval = useRef(null);
  const touchStart = useRef(null);
  const touchEnd = useRef(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isDriverLoggedIn, setIsDriverLoggedIn] = useState(() => {
    return localStorage.getItem('isDriverLoggedIn') === 'true';
  });
  const [loginError, setLoginError] = useState('');

  const servicesRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      {
        threshold: 0.2,
      }
    );

    const cards = document.querySelectorAll('.service-card');
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  const startSlideShow = () => {
    slideInterval.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % sliderImages.length);
    }, 5000);
  };

  const stopSlideShow = () => {
    if (slideInterval.current) {
      clearInterval(slideInterval.current);
    }
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    stopSlideShow();
    startSlideShow();
  };

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % sliderImages.length);
    stopSlideShow();
    startSlideShow();
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + sliderImages.length) % sliderImages.length);
    stopSlideShow();
    startSlideShow();
  };

  useEffect(() => {
    startSlideShow();
    return () => stopSlideShow();
  }, []);

  const handleTouchStart = (e) => {
    touchStart.current = e.touches[0].clientX;
    touchEnd.current = touchStart.current;
  };

  const handleTouchMove = (e) => {
    touchEnd.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return;
    
    const distance = touchStart.current - touchEnd.current;
    const minSwipeDistance = 50;

    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }

    touchStart.current = null;
    touchEnd.current = null;
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.target);
    
    try {
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.get('name'),
          phone: formData.get('phone'),
          email: formData.get('email'),
          message: formData.get('message'),
          status: 'Pending'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit booking');
      }
      
      // Clear form
      e.target.reset();
      
      // Show success modal
      setModalMessage({
        type: 'success',
        message: '🎉 Booking request submitted successfully! We will contact you shortly.'
      });
      setShowModal(true);
      
      // Auto hide modal after 5 seconds
      setTimeout(() => setShowModal(false), 5000);
    } catch (error) {
      console.error('Failed to submit booking:', error);
      setModalMessage({
        type: 'error',
        message: 'Sorry, there was an error submitting your booking. Please try again.'
      });
      setShowModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewPastBookings = async () => {
    setShowBookingsDrawer(true);
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/bookings');
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      
      const bookings = await response.json();
      setPastBookings(bookings.map(booking => ({
        id: booking.id,
        name: booking.name,
        phone: booking.phone,
        email: booking.email,
        message: booking.message,
        date: new Date(booking.date).toLocaleDateString()
      })));
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      setPastBookings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDriverLogin = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (email === 'driver@gmail.com' && password === '770driver') {
      setIsDriverLoggedIn(true);
      localStorage.setItem('isDriverLoggedIn', 'true');
      setShowLoginModal(false);
      setLoginError('');
    } else {
      setLoginError('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setIsDriverLoggedIn(false);
    localStorage.removeItem('isDriverLoggedIn');
  };

  useEffect(() => {
    const loginState = localStorage.getItem('isDriverLoggedIn') === 'true';
    setIsDriverLoggedIn(loginState);
  }, []);

  return (
    <Container>
      <Navbar>
        <NavLogo>770 Driver</NavLogo>
        <MobileMenuButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <MenuBar isOpen={isMenuOpen} />
          <MenuBar isOpen={isMenuOpen} />
          <MenuBar isOpen={isMenuOpen} />
        </MobileMenuButton>
        <NavLinks isOpen={isMenuOpen}>
          <NavLink 
            href="#home" 
            onClick={(e) => {
              scrollToSection(e, 'home');
              setIsMenuOpen(false);
            }}
          >
            Home
          </NavLink>
          <NavLink 
            href="#services" 
            onClick={(e) => {
              scrollToSection(e, 'services');
              setIsMenuOpen(false);
            }}
          >
            Services
          </NavLink>
          {isDriverLoggedIn ? (
            <>
              <NavLink 
                href="#" 
                onClick={() => {
                  handleViewPastBookings();
                  setIsMenuOpen(false);
                }}
              >
                View Bookings
              </NavLink>
              <LogoutButton onClick={handleLogout}>
                Logout
              </LogoutButton>
            </>
          ) : (
            <LoginButton onClick={() => setShowLoginModal(true)}>
              Driver Login
            </LoginButton>
          )}
          <BookNowButton>
            <NavLink 
              href="#booking" 
              onClick={(e) => {
                scrollToSection(e, 'booking');
                setIsMenuOpen(false);
              }}
            >
              Book Now
            </NavLink>
          </BookNowButton>
        </NavLinks>
      </Navbar>

      <HeroSection id="home">
        <ContentWrapper>
          <LeftContentSection>
          <LeftContent>
            
            <Title>
              770 Private <span>Luxury Driver</span>
            </Title>
            <ExperienceText>
              Experienced Drivers 
              Ensuring Your Safety
              on Every Trip
            </ExperienceText>
            <CallButton href="tel:(213) 335 8774">
              Call
              (213) 335 8774<PhoneIcon>📞</PhoneIcon>
            </CallButton>
            
          </LeftContent>
          </LeftContentSection>
          <RightContent>
            <SliderContainer
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {sliderImages.map((img, index) => {
                const isActive = index === currentSlide;
                const isPrev = index === (currentSlide - 1 + sliderImages.length) % sliderImages.length;
                const isNext = index === (currentSlide + 1) % sliderImages.length;
                
                return (
                  <SlideImage
                    key={index}
                    src={img}
                    alt={`Professional Driver ${index + 1}`}
                    active={isActive}
                    prev={isPrev}
                    next={isNext}
                    style={{
                      zIndex: isActive ? 3 : 1
                    }}
                  />
                );
              })}
            </SliderContainer>
          </RightContent>
        </ContentWrapper>
      </HeroSection>

      <ServicesSection id="services" ref={servicesRef}>
        <SectionTitle>Our Premium Services</SectionTitle>
        <ServiceCards>
          <ServiceCard className="service-card">
            <ServiceCardIcon>⏰</ServiceCardIcon>
            <ServiceCardTitle>On-Time Service</ServiceCardTitle>
            <ServiceCardDescription>
              Professional drivers ensuring punctual pickups and drop-offs for all your journeys
            </ServiceCardDescription>
          </ServiceCard>

          <ServiceCard className="service-card">
            <ServiceCardIcon>📅</ServiceCardIcon>
            <ServiceCardTitle>Flexible Scheduling</ServiceCardTitle>
            <ServiceCardDescription>
              Book your rides anytime with our 24/7 flexible scheduling system
            </ServiceCardDescription>
          </ServiceCard>

          <ServiceCard className="service-card">
            <ServiceCardIcon>🛡️</ServiceCardIcon>
            <ServiceCardTitle>Safety First</ServiceCardTitle>
            <ServiceCardDescription>
              Experienced drivers prioritizing your safety on every trip
            </ServiceCardDescription>
          </ServiceCard>

          <ServiceCard className="service-card">
            <ServiceCardIcon>🔒</ServiceCardIcon>
            <ServiceCardTitle>Privacy</ServiceCardTitle>
            <ServiceCardDescription>
              Discreet and professional service ensuring your privacy and comfort
            </ServiceCardDescription>
          </ServiceCard>
        </ServiceCards>
      </ServicesSection>

      <BookingSection id="booking">
        <SectionTitle>Book Your Ride</SectionTitle>
        <BookingForm onSubmit={handleBookingSubmit}>
          <FormGrid>
            <FormGroup>
              <FormLabel>Name</FormLabel>
              <FormInput 
                type="text" 
                name="name"
                placeholder="Enter your name" 
                required 
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>Phone Number</FormLabel>
              <FormInput 
                type="tel" 
                name="phone"
                placeholder="Enter your phone number" 
                required 
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>Email</FormLabel>
              <FormInput 
                type="email" 
                name="email"
                placeholder="Enter your email" 
                required 
              />
            </FormGroup>
            <FormGroup style={{ gridColumn: '1 / -1' }}>
              <FormLabel>Message</FormLabel>
              <MessageTextArea 
                name="message"
                placeholder="Enter your message including pickup/drop locations and preferred date/time" 
                required 
              />
            </FormGroup>
          </FormGrid>
          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? <LoadingSpinner /> : 'Book Now'}
          </SubmitButton>
        </BookingForm>
      </BookingSection>

      <BookingsDrawer show={showBookingsDrawer}>
        <DrawerHeader>
          <DrawerTitle>Past Bookings</DrawerTitle>
          <CloseButton onClick={() => setShowBookingsDrawer(false)}>×</CloseButton>
        </DrawerHeader>
        <DrawerContent>
          {isLoading ? (
            <LoadingMessage>Loading bookings...</LoadingMessage>
          ) : pastBookings.length === 0 ? (
            <NoDataMessage>
              <NoDataIcon>📅</NoDataIcon>
              No booking history found
            </NoDataMessage>
          ) : (
            <BookingsList>
              {pastBookings.map(booking => (
                <BookingCard key={booking.id}>
                  <BookingDetails>
                    <BookingInfo>
                      <BookingInfoLabel>Name:</BookingInfoLabel>
                      {booking.name}
                    </BookingInfo>
                    <BookingInfo>
                      <BookingInfoLabel>Phone:</BookingInfoLabel>
                      {booking.phone}
                    </BookingInfo>
                    <BookingInfo>
                      <BookingInfoLabel>Email:</BookingInfoLabel>
                      {booking.email}
                    </BookingInfo>
                    <BookingInfo>
                      <BookingInfoLabel>Message:</BookingInfoLabel>
                      {booking.message}
                    </BookingInfo>
                    <BookingInfo>
                      <BookingInfoLabel>Date:</BookingInfoLabel>
                      {booking.date}
                    </BookingInfo>
                  </BookingDetails>
                </BookingCard>
              ))}
            </BookingsList>
          )}
        </DrawerContent>
      </BookingsDrawer>

      <Footer id="social-links">
        <FooterContent>
          <FooterSection>
            <FooterTitle>Contact Us</FooterTitle>
              <ContactItem>
              <ContactIcon>📞</ContactIcon>
              (213) 335 8774
              </ContactItem>
              <ContactItem>
              <ContactIcon>✉️</ContactIcon>
                info@770driver.com
              </ContactItem>
          </FooterSection>

          <FooterSection>
            <FooterTitle>Quick Links</FooterTitle>
            <FooterLink href="#home">Home</FooterLink>
            <FooterLink href="#services">Services</FooterLink>
            <FooterLink href="#booking">Booking</FooterLink>
          </FooterSection>

          <FooterSection>
            <FooterTitle>Follow Us</FooterTitle>
            <SocialLinks>
              <SocialLink href="#">Facebook</SocialLink>
              <SocialLink href="#">Instagram</SocialLink>
              <SocialLink href="#">Twitter</SocialLink>
            </SocialLinks>
          </FooterSection>
        </FooterContent>
        <FooterBottom>
          <Copyright>© 2024 770 Driver. All rights reserved.</Copyright>
        </FooterBottom>
      </Footer>

      {showModal && (
        <Modal onClick={() => setShowModal(false)}>
          <ModalContent 
            onClick={e => e.stopPropagation()} 
            type={modalMessage.type}
          >
            <ModalCloseButton onClick={() => setShowModal(false)}>×</ModalCloseButton>
            {modalMessage.message}
          </ModalContent>
        </Modal>
      )}

      {showLoginModal && (
        <Modal onClick={() => setShowLoginModal(false)}>
          <LoginModalContent onClick={e => e.stopPropagation()}>
            <ModalCloseButton onClick={() => setShowLoginModal(false)}>×</ModalCloseButton>
            <LoginTitle>Driver Login</LoginTitle>
            <LoginForm onSubmit={handleDriverLogin}>
              {loginError && <LoginError>{loginError}</LoginError>}
              <FormGroup>
                <FormLabel>Email</FormLabel>
                <FormInput 
                  type="email" 
                  name="email"
                  placeholder="Enter your email"
                  required 
                />
              </FormGroup>
              <FormGroup>
                <FormLabel>Password</FormLabel>
                <FormInput 
                  type="password" 
                  name="password"
                  placeholder="Enter your password"
                  required 
                />
              </FormGroup>
              <LoginSubmitButton type="submit">
                Login
              </LoginSubmitButton>
            </LoginForm>
          </LoginModalContent>
        </Modal>
      )}
    </Container>
  );
};

const Container = styled.div`
  min-height: 100vh;
  background: #1A2837;
  color: #ffffff;
  position: relative;
  overflow: hidden;
  padding-top: 80px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    width: 100%;
    height: 50vh;
    background: 
      linear-gradient(
        45deg,
        transparent 0%,
        #09B9B9 35%,
        #09B9B9 45%,
        #CD9848 45%,
        #CD9848 55%,
        #FEBD59 55%,
        #FEBD59 65%,
        transparent 65%
      );
    opacity: 0.15;
    pointer-events: none;
    z-index: 1;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 30%, rgba(9, 185, 185, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(254, 189, 89, 0.05) 0%, transparent 50%);
    pointer-events: none;
    z-index: 1;
  }
`;

const Navbar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  background: linear-gradient(to right, #1a2c4e, #2a9d8f,#1a2c4e);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-bottom: 2px solid;
  border-image: linear-gradient(90deg, #09B9B9, #CD9848, #FEBD59) 1;
  backdrop-filter: blur(10px);

  @media (max-width: 768px) {
    padding: 15px 20px;
  }
`;

const NavLogo = styled.div`
  font-size: 26px;
  font-weight: bold;
  font-family: 'Poppins', sans-serif;
  letter-spacing: 1px;
  color: #ffffff;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, #09B9B9, #FEBD59);
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }

  &:hover::after {
    transform: scaleX(1);
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  flex-direction: column;
  justify-content: space-around;
  width: 30px;
  height: 25px;
  background: transparent;
  border: none;
  cursor: pointer;
  z-index: 1001;
  padding: 0;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const MenuBar = styled.div`
  width: 30px;
  height: 3px;
  background: #ffffff;
  border-radius: 3px;
  transition: all 0.3s ease;
  position: relative;
  transform-origin: 1px;

  &:first-child {
    transform: ${({ isOpen }) => isOpen ? 'rotate(45deg)' : 'rotate(0)'};
  }

  &:nth-child(2) {
    opacity: ${({ isOpen }) => isOpen ? '0' : '1'};
    transform: ${({ isOpen }) => isOpen ? 'translateX(-20px)' : 'translateX(0)'};
  }

  &:nth-child(3) {
    transform: ${({ isOpen }) => isOpen ? 'rotate(-45deg)' : 'rotate(0)'};
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    width: 70%;
    max-width: 300px;
    flex-direction: column;
    background: #1A2837;
    padding: 80px 40px;
    transform: ${({ isOpen }) => isOpen ? 'translateX(0)' : 'translateX(100%)'};
    transition: transform 0.3s ease-in-out;
    box-shadow: ${({ isOpen }) => isOpen ? '-5px 0 15px rgba(0,0,0,0.2)' : 'none'};
  }
`;

const NavLink = styled.a`
  color: #ffffff;
  text-decoration: none;
  font-size: 16px;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  transition: all 0.3s ease;
  position: relative;
  padding: 5px 0;
  cursor: pointer;
  user-select: none;

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 2px;
    background: #09B9B9;
    transform: scaleX(0);
    transition: transform 0.3s ease;
    transform-origin: right;
  }

  &:hover {
    color: #FEBD59;
    &::after {
      transform: scaleX(1);
      transform-origin: left;
    }
  }

  &.active {
    color: #FEBD59;
    &::after {
      transform: scaleX(1);
    }
  }
`;

const BookNowButton = styled.button`
  background: linear-gradient(135deg, #CD9848, #FEBD59);
  background-size: 200% 200%;
  animation: ${gradientMove} 3s ease infinite;
  color: #1A2837;
  padding: 12px 25px;
  border-radius: 25px;
  border: none;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 15px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(205, 152, 72, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(205, 152, 72, 0.4);
    background-position: right center;
  }

  &:active {
    transform: translateY(1px);
  }
`;

const ServicesSection = styled.section`
  padding: 80px 40px;
  background: #1A2837;
  position: relative;
  overflow: hidden;
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 36px;
  color: #ffffff;
  margin-bottom: 60px;
  position: relative;
  z-index: 2;

  &:after {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 3px;
    background: linear-gradient(135deg, #CD9848, #FEBD59);
  }
`;

const ServiceCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
`;

const ServiceCard = styled.div`
   background: linear-gradient(135deg, rgba(4, 51, 100, 0.95), rgba(9, 185, 185, 0.15));
  padding: 30px;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.4s ease;
  border: 1px solid rgba(9, 185, 185, 0.1);
  opacity: 0;
  transform: translateY(30px);
  backdrop-filter: blur(10px);

  &.visible {
    animation: ${fadeInUp} 0.6s ease forwards;
  }

  &:hover {
    transform: translateY(-10px);
    border-color: #FEBD59;
    box-shadow: 0 15px 40px rgba(254, 189, 89, 0.2);
  }
`;

const ServiceCardIcon = styled.div`
  width: 70px;
  height: 70px;
  background: #FEBD59;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 32px;
  color: #1A2837;
  transition: all 0.3s ease;

  ${ServiceCard}:hover & {
    transform: scale(1.1) rotate(10deg);
    background:rgb(1, 105, 124);
  }
`;

const ServiceCardTitle = styled.h3`
  color: #FEBD59;
  font-size: 24px;
  margin-bottom: 15px;
  font-weight: 600;
`;

const ServiceCardDescription = styled.p`
  color: #ffffff;
  font-size: 16px;
  line-height: 1.6;
  opacity: 0.9;
`;

const Footer = styled.footer`
  background: #1A2837;
  padding: 60px 40px 20px;
  color: #ffffff;
  position: relative;
  border-top: 0.5px solid;
  border-image: linear-gradient(90deg, #09B9B9, #CD9848, #FEBD59) 1;

  &::before {
    content: none;
  }
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  margin-bottom: 40px;
  position: relative;
  z-index: 2;
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const FooterTitle = styled.h3`
  font-size: 20px;
  margin-bottom: 20px;
  color: #FEBD59;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
`;

const ContactIcon = styled.span`
  color: #09B9B9;
`;

const FooterLink = styled.a`
  color: #ffffff;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: #FEBD59;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 15px;
`;

const SocialLink = styled.a`
  color: #ffffff;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: #FEBD59;
  }
`;

const FooterBottom = styled.div`
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const Copyright = styled.p`
  color: #888888;
  font-size: 14px;
`;

const HeroSection = styled.section`
  min-height: 90vh;
  padding: 40px;
  position: relative;
  background: #1A2837;
  overflow: hidden;
  z-index: 2;

  @media (max-width: 1000px) {
    padding: 20px;
    min-height: auto;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 50%;
    height: 100%;
    background: linear-gradient(
      135deg,
      transparent 0%,
      transparent 35%,
      #09B9B9 35%,
      #09B9B9 45%,
      #CD9848 45%,
      #CD9848 55%,
      #FEBD59 55%,
      #FEBD59 65%,
      transparent 65%
    );
    opacity: 0.8;
    z-index: 1;
  }

  @media (max-width: 1000px) {
    &::before {
      width: 100%;
      opacity: 0.3;
    }
  }
`;

const ContentWrapper = styled.div`
  max-width: 1250px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 2;
  gap: 40px;

  @media (max-width: 1000px) {
    flex-direction: column;
    align-items: stretch;
    padding: 20px 10px;
    
  }
`;

const LeftContent = styled.div`
  flex: 2;
  max-width: 100%;
  position: relative;
  padding: 40px;
  border-radius: 20px;
  background: rgba(26, 40, 55, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(9, 185, 185, 0.3);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.2),
    0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 0 0 32px rgba(9, 185, 185, 0.2);
  z-index: 2;
  
  &::before {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 22px;
    background: linear-gradient(
      145deg,
      rgba(9, 185, 185, 0.5),
      rgba(254, 189, 89, 0.5)
    );
    z-index: -1;
    filter: blur(8px);
    opacity: 0.5;
  }
 
  @media (max-width: 1000px) {
    flex: none;
    text-align: center;
    padding: 30px;
    order: 1;
  }
`;

const LeftContentSection=styled.div`
max-width: 600px;
@media (max-width: 1000px) {
  max-width: 100%;
}
`;

const Title = styled.h1`
  font-size: 54px;
  color: #ffffff;
  margin-bottom: 40px;
  line-height: 1.2;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  letter-spacing: -0.5px;
  position: relative;
  
  span {
    background: linear-gradient(90deg, #FEBD59, #FEBD59);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 0;
      width: 100%;
      height: 2px;
      background: linear-gradient(90deg, #FEBD59, transparent);
    }
  }

  @media (max-width: 768px) {
    font-size: 36px;
    margin-bottom: 30px;
  }
`;

const ExperienceText = styled.p`
  color: #ffffff;
  font-size: 26px;
  line-height: 1.6;
  margin: 40px 0;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  letter-spacing: 0.2px;
  position: relative;
  z-index: 2;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  &::before {
    content: '';
    position: absolute;
    left: -20px;
    top: 50%;
    width: 3px;
    height: 40%;
    background: linear-gradient(to bottom, #09B9B9, transparent);
    transform: translateY(-50%);
  }

  @media (max-width: 768px) {
    font-size: 20px;
    margin: 30px 0;
    
    &::before {
      left: 0;
      top: -10px;
      width: 30%;
      height: 2px;
      transform: none;
    }
  }
`;

const CallButton = styled.a`
  display: flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, rgb(3, 172, 172), rgb(0, 142, 142));
  color: #ffffff;
  padding: 12px 25px;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Poppins', sans-serif;
  width: fit-content;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: 0.5s;
  }

  &:hover::before {
    left: 100%;
  }

  @media (max-width: 768px) {
    margin: 0 auto;
    font-size: 16px;
    padding: 10px 20px;
  }
    @media (max-width: 1000px) {
      margin: 0 auto;
    }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(3, 172, 172, 0.3);
  }

  &:active {
    transform: translateY(1px);
  }
`;

const PhoneIcon = styled.span`
  font-size: 20px;
`;

const RightContent = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 600px;
  z-index: 2;
  overflow: visible;

  @media (max-width: 1000px) {
    flex: none;
    height: 500px;
    width: 100%;
    order: 2;
    margin-bottom: 30px;
  }

  @media (max-width: 768px) {
    height: 400px;
  }
`;

const SliderContainer = styled.div`
  position: relative;
  width: 75%;
  height: 95%;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 2000px;
  transform-style: preserve-3d;
  overflow: visible;
`;

const SlideImage = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 20px;
  opacity: ${props => {
    if (props.active) return 1;
    if (props.prev || props.next) return 0.6;
    return 0;
  }};
  transform: ${props => {
    if (props.active) return 'scale(1) rotate(0deg)';
    if (props.next) return 'translateX(20%) scale(0.85) rotate(0deg)';
    if (props.prev) return 'translateX(-20%) scale(0.85) rotate(0deg)';
    return 'scale(0.8)';
  }};
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  animation: ${props => {
    if (props.active) return css`${slideInActive} 0.6s cubic-bezier(0.23, 1, 0.32, 1)`;
    if (props.next) return css`${slideInNext} 0.6s cubic-bezier(0.23, 1, 0.32, 1)`;
    if (props.prev) return css`${slideInPrev} 0.6s cubic-bezier(0.23, 1, 0.32, 1)`;
    return 'none';
  }};
  box-shadow: ${props => 
    props.active ? 
    '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)' :
    '0 15px 30px -5px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05)'
  };
  filter: ${props => 
    props.active ? 'brightness(1.1) contrast(1.1)' :
    'brightness(0.7) contrast(0.9) blur(1px)'
  };
  user-select: none;
  -webkit-user-drag: none;
  will-change: transform, opacity;
  z-index: ${props => props.active ? 3 : 1};
  transform-origin: center center;
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 20px;
    background: linear-gradient(
      165deg,
      rgba(255, 255, 255, 0.15) 0%,
      rgba(255, 255, 255, 0.05) 50%,
      transparent 100%
    );
    opacity: ${props => props.active ? 1 : 0.3};
    transition: opacity 0.6s ease;
  }
`;

const BookingSection = styled.section`
  padding: 80px 40px;
  background: #1A2837;
  position: relative;
  z-index: 2;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      -45deg,
      transparent 0%,
      transparent 40%,
      rgba(9, 185, 185, 0.1) 40%,
      rgba(9, 185, 185, 0.1) 50%,
      rgba(205, 152, 72, 0.1) 50%,
      rgba(205, 152, 72, 0.1) 60%,
      rgba(254, 189, 89, 0.1) 60%,
      rgba(254, 189, 89, 0.1) 70%,
      transparent 70%
    );
    opacity: 0.15;
    z-index: 1;
    transform: skewY(-12deg);
    transform-origin: bottom right;
  }
`;

const BookingForm = styled.form`
  max-width: 800px;
  margin: 0 auto;
  background: linear-gradient(135deg, rgba(4, 51, 100, 0.95), rgba(9, 185, 185, 0.15));
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(9, 185, 185, 0.3);
  position: relative;
  z-index: 2;
  backdrop-filter: blur(10px);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(9, 185, 185, 0.1), rgba(254, 189, 89, 0.1));
    border-radius: 20px;
    z-index: -1;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FormLabel = styled.label`
  color: #ffffff;
  font-size: 16px;
  font-weight: 500;
`;

const FormInput = styled.input`
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(9, 185, 185, 0.2);
  border-radius: 8px;
  font-size: 16px;
  color: #ffffff;
  transition: all 0.3s ease;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    border-color: #09B9B9;
    outline: none;
    background: rgba(9, 185, 185, 0.1);
  }
`;

const FormSelect = styled.select`
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(9, 185, 185, 0.2);
  border-radius: 8px;
  font-size: 16px;
  color: #ffffff;
  transition: all 0.3s ease;

  option {
    background: #1A2837;
    color: #ffffff;
  }

  &:focus {
    border-color: #09B9B9;
    outline: none;
    background: rgba(9, 185, 185, 0.1);
  }
`;

const SubmitButton = styled.button`
  background: ${props => props.disabled ? 'rgba(0, 192, 160, 0.7)' : 'rgb(0, 192, 160)'};
  color: #ffffff;
  padding: 15px 40px;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 700;
  border: none;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 52px;

  &:hover {
    background: ${props => props.disabled ? 'rgba(0, 192, 160, 0.7)' : '#08a5a5'};
    transform: ${props => props.disabled ? 'none' : 'translateY(-2px)'};
  }

  &:active {
    transform: ${props => props.disabled ? 'none' : 'translateY(1px)'};
  }
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #ffffff;
  animation: ${spin} 0.8s linear infinite;
  margin: 0 auto;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
`;

const ModalContent = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${props => props.type === 'success' ? '#1A2837' : '#1A2837'};
  padding: 25px 40px;
  border-radius: 15px;
  color: white;
  font-size: 18px;
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.2);
  animation: ${fadeInModal} 0.3s ease-out;
  border: 2px solid ${props => props.type === 'success' ? '#09B9B9' : '#ff6b6b'};
  max-width: 90%;
  width: auto;
  text-align: center;
  z-index: 1001;
`;

const ModalCloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: #ffffff;
  font-size: 24px;
  cursor: pointer;
  padding: 5px;
  line-height: 1;
  
  &:hover {
    color: ${props => props.type === 'success' ? '#09B9B9' : '#ff6b6b'};
  }
`;

const MessageTextArea = styled.textarea`
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(9, 185, 185, 0.2);
  border-radius: 8px;
  font-size: 16px;
  color: #ffffff;
  transition: all 0.3s ease;
  min-height: 120px;
  resize: vertical;
  font-family: inherit;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    border-color: #09B9B9;
    outline: none;
    background: rgba(9, 185, 185, 0.1);
  }
`;

const BookingsDrawer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #1A2837;
  border-top: 2px solid #09B9B9;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  transform: translateY(${props => props.show ? '0' : '100%'});
  transition: transform 0.3s ease-in-out;
  z-index: 1000;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 -5px 20px rgba(0, 0, 0, 0.2);
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
  }
  
  &::-webkit-scrollbar-thumb {
    background: #09B9B9;
    border-radius: 4px;
  }
`;

const DrawerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid rgba(9, 185, 185, 0.2);
  position: sticky;
  top: 0;
  background: #1A2837;
  z-index: 1;
`;

const DrawerTitle = styled.h3`
  color: #FEBD59;
  font-size: 24px;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #09B9B9;
  font-size: 28px;
  cursor: pointer;
  padding: 5px;
  line-height: 1;
  transition: all 0.3s ease;
  
  &:hover {
    color: #FEBD59;
    transform: scale(1.1);
  }
`;

const DrawerContent = styled.div`
  padding: 20px;
`;

const LoadingMessage = styled.div`
  text-align: center;
  color: #ffffff;
  padding: 40px;
  font-size: 18px;
`;

const NoDataMessage = styled.div`
  text-align: center;
  color: #ffffff;
  padding: 40px;
  font-size: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
`;

const NoDataIcon = styled.div`
  font-size: 48px;
  margin-bottom: 10px;
`;

const BookingsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const BookingCard = styled.div`
  background: rgba(4, 51, 100, 0.3);
  padding: 20px;
  border-radius: 12px;
  border: 1px solid rgba(9, 185, 185, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #FEBD59;
    transform: translateY(-2px);
  }
`;

const BookingDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const BookingInfo = styled.div`
  color: #ffffff;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  opacity: 0.9;
`;

const BookingInfoLabel = styled.span`
  color: #09B9B9;
  font-weight: 500;
  min-width: 60px;
`;

const LoginButton = styled.button`
  background: linear-gradient(135deg, #09B9B9, #077e7e);
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(9, 185, 185, 0.3);
  }

  &:active {
    transform: translateY(1px);
  }
`;

const LoginModalContent = styled.div`
  background: #1A2837;
  padding: 30px;
  border-radius: 15px;
  width: 90%;
  max-width: 400px;
  position: relative;
  border: 2px solid #09B9B9;
  animation: ${fadeInModal} 0.3s ease-out;
`;

const LoginTitle = styled.h2`
  color: #FEBD59;
  text-align: center;
  margin-bottom: 25px;
  font-size: 24px;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const LoginSubmitButton = styled(SubmitButton)`
  margin-top: 10px;
`;

const LoginError = styled.div`
  color: #ff6b6b;
  text-align: center;
  font-size: 14px;
  margin-bottom: 10px;
`;

const LogoutButton = styled(LoginButton)`
  background: linear-gradient(135deg, #ff6b6b, #ee5253);
  
  &:hover {
    box-shadow: 0 4px 12px rgba(238, 82, 83, 0.3);
  }
`;

export default HomePage; 