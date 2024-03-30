import './home.scss'
import ycheck from '../../assets/images/y2.png'
import avatar from '../../assets/images/avatar.jpeg'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { useToast } from "@chakra-ui/react";
import { BASE_API_URI } from '../../utils/constants';
import useAxios from '../../app/hooks/useAxios';


const Home = () => {
    const { trigger: getWebConfigurations, data: responseData, error, isLoading } = useAxios({ mainUrl: `${BASE_API_URI}/get-apk`, useAuthorisation: false });
    const [webConfigurations, setWebConfigurations] = useState(null);
    const toast = useToast();

    useEffect(() => {
        getWebConfigurations();
    }, []);

    useEffect(() => {
        if (responseData?.configurations) {
            setWebConfigurations(responseData.configurations);
        }
    }, [responseData]);

    useEffect(() => {
        if (error) {
            toast({
                title: "Error",
                position: "top-center",
                description: error,
                status: "error",
                duration: 3000,
                isClosable: true,
            })
        }
    }, [error]);

    return (
        <div className="body-wrap">
            <section className="hero">
                <div className="container">
                    <div className="hero-inner">
                        <div className="hero-copy">
                            <h1 className="hero-title mt-0">Welcome to <br /> Y-Check Ghana</h1>
                            <p className="hero-paragraph">
                                Click on download app to get the latest version of the app,
                                the app can only be used by the Y-Check Ghana team.
                                Click on dashboard to login into your dashboard.
                            </p>
                            <div className="hero-cta">
                                {webConfigurations?.android_apk_url &&
                                    <a className="button button-shadow" href={webConfigurations.android_apk_url} style={{ background: "rgb(235,126,48)" }} >
                                        <i className="bi bi-google-play mx-2"></i>Download App
                                    </a>
                                }
                                <Link to={'/dashboard'} className="button button-primary">
                                    <i className="bi bi-box-arrow-in-right mx-2"></i> Login
                                </Link>
                            </div>
                        </div>
                        <div className="hero-app">
                            <div className="hero-app-illustration">
                                <svg width="999" height="931" xmlns="http://www.w3.org/2000/svg">
                                    <defs>
                                        <linearGradient x1="92.827%" y1="0%" x2="53.422%" y2="80.087%" id="hero-shape-a">
                                            <stop stop-color="#ffbf0d" offset="0%" />
                                            <stop stop-color="#ffbf0d" stop-opacity="0" offset="100%" />
                                        </linearGradient>
                                        <linearGradient x1="92.827%" y1="0%" x2="53.406%" y2="80.12%" id="hero-shape-b">
                                            <stop stop-color="#b79a64" offset="0%" />
                                            <stop stop-color="#ffbf0d" stop-opacity="0" offset="80.532%" />
                                            <stop stop-color="#b79a64" stop-opacity="0" offset="100%" />
                                        </linearGradient>
                                        <linearGradient x1="8.685%" y1="23.733%" x2="85.808%" y2="82.837%" id="hero-shape-c">
                                            <stop stop-color="#235347" stop-opacity=".48" offset="0%" />
                                            <stop stop-color="#235347" stop-opacity="0" offset="100%" />
                                        </linearGradient>
                                        <linearGradient x1="79.483%" y1="15.903%" x2="38.42%" y2="70.124%" id="hero-shape-d">
                                            <stop stop-color="#ffbf0d" offset="0%" />
                                            <stop stop-color="#ffbf0d" stop-opacity="0" offset="100%" />
                                        </linearGradient>
                                        <linearGradient x1="99.037%" y1="26.963%" x2="24.582%" y2="78.557%" id="hero-shape-e">
                                            <stop stop-color="#FDFFDA" stop-opacity=".64" offset="0%" />
                                            <stop stop-color="#F97C58" stop-opacity=".24" offset="42.952%" />
                                            <stop stop-color="#F9425F" stop-opacity="0" offset="100%" />
                                        </linearGradient>
                                    </defs>
                                    <g fill="none" fill-rule="evenodd">
                                        <g className="hero-shape-top">
                                            <g className="is-moving-object is-translating" data-translating-factor="280">
                                                <path d="M680.188 0c-23.36 69.79-58.473 98.3-105.34 85.531-70.301-19.152-189.723-21.734-252.399 91.442-62.676 113.175-144.097 167.832-215.195 118.57C59.855 262.702 24.104 287.85 0 370.988L306.184 566.41c207.164-4.242 305.67-51.612 295.52-142.11-10.152-90.497 34.533-163.55 134.054-219.16l4.512-119.609L680.188 0z" fill="url(#hero-shape-a)" transform="translate(1)" />
                                            </g>
                                            <g className="is-moving-object is-translating" data-translating-factor="100">
                                                <path d="M817.188 222c-23.36 69.79-58.473 98.3-105.34 85.531-70.301-19.152-189.723-21.734-252.399 91.442-62.676 113.175-144.097 167.832-215.195 118.57-47.399-32.841-83.15-7.693-107.254 75.445L443.184 788.41c207.164-4.242 305.67-51.612 295.52-142.11-10.152-90.497 34.533-163.55 134.054-219.16l4.512-119.609L817.188 222z" fill="url(#hero-shape-b)" transform="rotate(-53 507.635 504.202)" />
                                            </g>
                                        </g>
                                        <g transform="translate(191 416)">
                                            <g className="is-moving-object is-translating" data-translating-factor="50">
                                                <circle fill="url(#hero-shape-c)" cx="336" cy="190" r="190" />
                                            </g>
                                            <g className="is-moving-object is-translating" data-translating-factor="80">
                                                <path d="M683.766 133.043c-112.048-90.805-184.688-76.302-217.92 43.508-33.23 119.81-125.471 124.8-276.722 14.972-3.156 120.356 53.893 200.09 171.149 239.203 175.882 58.67 346.695-130.398 423.777-239.203 51.388-72.536 17.96-92.03-100.284-58.48z" fill="url(#hero-shape-d)" />
                                            </g>
                                            <g className="is-moving-object is-translating" data-translating-factor="100">
                                                <path d="M448.206 223.247c-97.52-122.943-154.274-117.426-170.26 16.55C261.958 373.775 169.717 378.766 1.222 254.77c-9.255 95.477 47.794 175.211 171.148 239.203 185.032 95.989 424.986-180.108 424.986-239.203 0-39.396-49.717-49.904-149.15-31.523z" fill="url(#hero-shape-e)" transform="matrix(-1 0 0 1 597.61 0)" />
                                            </g>
                                        </g>
                                    </g>
                                </svg>
                            </div>
                            <img className="device-mockup" src={ycheck} alt="App preview" />
                            <div className="hero-app-dots hero-app-dots-1">
                                <svg width="124" height="75" xmlns="http://www.w3.org/2000/svg">
                                    <g fill="none" fill-rule="evenodd">
                                        <path fill="#FFF" d="M33.392 0l3.624 1.667.984 3.53-1.158 3.36L33.392 10l-3.249-1.639L28 5.196l1.62-3.674z" />
                                        <path fill="#7487A3" d="M74.696 3l1.812.833L77 5.598l-.579 1.68L74.696 8l-1.624-.82L72 5.599l.81-1.837z" />
                                        <path fill="#556B8B" d="M40.696 70l1.812.833.492 1.765-.579 1.68-1.725.722-1.624-.82L38 72.599l.81-1.837z" />
                                        <path fill="#7487A3" d="M4.314 37l2.899 1.334L8 41.157l-.926 2.688L4.314 45l-2.6-1.31L0 41.156l1.295-2.94zM49.314 32l2.899 1.334.787 2.823-.926 2.688L49.314 40l-2.6-1.31L45 36.156l1.295-2.94z" />
                                        <path fill="#556B8B" d="M99.696 56l1.812.833.492 1.765-.579 1.68-1.725.722-1.624-.82L97 58.599l.81-1.837zM112.696 37l1.812.833.492 1.765-.579 1.68-1.725.722-1.624-.82L110 39.599l.81-1.837zM82.696 37l1.812.833.492 1.765-.579 1.68-1.725.722-1.624-.82L80 39.599l.81-1.837zM122.618 57l1.087.5.295 1.059-.347 1.008-1.035.433-.975-.492-.643-.95.486-1.101z" />
                                    </g>
                                </svg>
                            </div>
                            <div className="hero-app-dots hero-app-dots-2">
                                <svg width="124" height="75" xmlns="http://www.w3.org/2000/svg">
                                    <g fill="none" fill-rule="evenodd">
                                        <path fill="#556B8B" d="M33.392 0l3.624 1.667.984 3.53-1.158 3.36L33.392 10l-3.249-1.639L28 5.196l1.62-3.674zM74.696 3l1.812.833L77 5.598l-.579 1.68L74.696 8l-1.624-.82L72 5.599l.81-1.837zM40.696 70l1.812.833.492 1.765-.579 1.68-1.725.722-1.624-.82L38 72.599l.81-1.837zM4.314 37l2.899 1.334L8 41.157l-.926 2.688L4.314 45l-2.6-1.31L0 41.156l1.295-2.94zM49.314 32l2.899 1.334.787 2.823-.926 2.688L49.314 40l-2.6-1.31L45 36.156l1.295-2.94z" />
                                        <path fill="#FFF" d="M99.696 56l1.812.833.492 1.765-.579 1.68-1.725.722-1.624-.82L97 58.599l.81-1.837z" />
                                        <path fill="#556B8B" d="M112.696 37l1.812.833.492 1.765-.579 1.68-1.725.722-1.624-.82L110 39.599l.81-1.837z" />
                                        <path fill="#FFF" d="M82.696 37l1.812.833.492 1.765-.579 1.68-1.725.722-1.624-.82L80 39.599l.81-1.837z" />
                                        <path fill="#556B8B" d="M122.618 57l1.087.5.295 1.059-.347 1.008-1.035.433-.975-.492-.643-.95.486-1.101z" />
                                    </g>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="features section" style={{ backgroundColor: '#06101F' }}>
                <div class="container">
                    <div class="features-inner section-inner ">
                        <h2 class="section-title mt-0">About Y-Check Ghana</h2>
                        <div class="features-wrap">
                            <div class="feature is-revealing">
                                <div class="feature-inner">
                                    <div className="row-icon">
                                        <div class="feature-icon">
                                            <svg width="64" height="64" xmlns="http://www.w3.org/2000/svg">
                                                <defs>
                                                    <linearGradient x1="0%" y1="100%" x2="50%" y2="0%" id="feature-1-a">
                                                        <stop stop-color="rgb(41, 110, 229)" stop-opacity=".8" offset="0%" />
                                                        <stop stop-color="rgb(41, 110, 229)" stop-opacity=".16" offset="100%" />
                                                    </linearGradient>
                                                    <linearGradient x1="50%" y1="100%" x2="50%" y2="0%" id="feature-1-b">
                                                        <stop stop-color="#b79a64" offset="0%" />
                                                        <stop stop-color="#ffbf0d" stop-opacity=".798" offset="49.935%" />
                                                        <stop stop-color="#b79a64" stop-opacity="0" offset="100%" />
                                                    </linearGradient>
                                                </defs>
                                                <g fill="none" fill-rule="evenodd">
                                                    <path d="M24 48H0V24C0 10.745 10.745 0 24 0h24v24c0 13.255-10.745 24-24 24" fill="url(#feature-1-a)" />
                                                    <path d="M40 64H16V40c0-13.255 10.745-24 24-24h24v24c0 13.255-10.745 24-24 24" fill="url(#feature-1-b)" />
                                                </g>
                                            </svg>
                                        </div>
                                        <h3 class="feature-title mt-24">What is Y-Check</h3>
                                    </div>
                                    <p class="text-sm mb-0">
                                        Y-Check is a routine health check-ups programme developed as part of the WHO-coordinated Y-Check Research Programme.
                                        It aims to provide systematic health check-ups for adolescents in Ghana, Tanzania, and Zimbabwe.
                                        The Y-Check intervention involves tailored check-ups for younger (10-14 years) and older (15-19 years) adolescents,
                                        delivered in school and community settings by trained staff.
                                        The programme includes multiple steps such as registration, screening, physical examination, laboratory tests,
                                        clinical assessment, and a referral system for further evaluation or treatment if needed.
                                    </p>
                                </div>
                            </div>
                            <div class="feature is-revealing">
                                <div class="feature-inner">
                                    <div className="row-icon">
                                        <div class="feature-icon">
                                            <svg width="68" height="64" xmlns="http://www.w3.org/2000/svg">
                                                <defs>
                                                    <linearGradient x1="0%" y1="100%" x2="50%" y2="0%" id="feature-2-a">
                                                        <stop stop-color="rgb(41, 110, 229)" stop-opacity=".8" offset="0%" />
                                                        <stop stop-color="rgb(41, 110, 229)" stop-opacity=".16" offset="100%" />
                                                    </linearGradient>
                                                    <linearGradient x1="50%" y1="100%" x2="50%" y2="0%" id="feature-2-b">
                                                        <stop stop-color="#b79a64" offset="0%" />
                                                        <stop stop-color="#ffbf0d" stop-opacity=".798" offset="49.935%" />
                                                        <stop stop-color="#b79a64" stop-opacity="0" offset="100%" />
                                                    </linearGradient>
                                                </defs>
                                                <g fill="none" fill-rule="evenodd">
                                                    <path d="M9.941 63.941v-24c0-13.255 10.745-24 24-24h24v24c0 13.255-10.745 24-24 24h-24z" fill="url(#feature-2-a)" transform="rotate(45 33.941 39.941)" />
                                                    <path d="M16 0v24c0 13.255 10.745 24 24 24h24V24C64 10.745 53.255 0 40 0H16z" fill="url(#feature-2-b)" />
                                                </g>
                                            </svg>
                                        </div>
                                        <h3 class="feature-title mt-24">Goal</h3>
                                    </div>
                                    <p class="text-sm mb-0" >
                                        The goal is to identify key contextual information on adolescent health,
                                        determine specific components of the health and well-being check-up intervention
                                        that are feasible and acceptable to adolescents, parents, and other stakeholders,
                                        and evaluate the feasibility, acceptability, coverage and yield of previously
                                        undiagnosed conditions and costs of adolescent health and well-being check-ups.
                                    </p>
                                </div>
                            </div>
                            <div class="feature is-revealing">
                                <div class="feature-inner">
                                    <div className="row-icon">
                                        <div class="feature-icon">
                                            <svg width="64" height="64" xmlns="http://www.w3.org/2000/svg">
                                                <defs>
                                                    <linearGradient x1="50%" y1="100%" x2="50%" y2="43.901%" id="feature-3-a">
                                                        <stop stop-color="rgb(41, 110, 229)" stop-opacity=".798" offset="0%" />
                                                        <stop stop-color="rgb(41, 110, 229)" stop-opacity="0" offset="100%" />
                                                    </linearGradient>
                                                    <linearGradient x1="58.893%" y1="100%" x2="58.893%" y2="18.531%" id="feature-3-b">
                                                        <stop stop-color="rgb(41, 110, 229)" stop-opacity=".8" offset="0%" />
                                                        <stop stop-color="rgb(41, 110, 229)" stop-opacity="0" offset="100%" />
                                                    </linearGradient>
                                                    <linearGradient x1="50%" y1="100%" x2="50%" y2="0%" id="feature-3-c">
                                                        <stop stop-color="#b79a64" offset="0%" />
                                                        <stop stop-color="#ffbf0d" stop-opacity=".798" offset="49.935%" />
                                                        <stop stop-color="#b79a64" stop-opacity="0" offset="100%" />
                                                    </linearGradient>
                                                </defs>
                                                <g fill="none" fill-rule="evenodd">
                                                    <path fill="url(#feature-3-a)" opacity=".32" d="M0 24h64v40H0z" />
                                                    <path fill="url(#feature-3-b)" d="M40 24H24L0 64h64z" />
                                                    <path d="M10 10v22c0 12.15 9.85 22 22 22h22V32c0-12.15-9.85-22-22-22H10z" fill="url(#feature-3-c)" transform="rotate(45 32 32)" />
                                                </g>
                                            </svg>
                                        </div>
                                        <h3 class="feature-title mt-24">Objective</h3>
                                    </div>
                                    <p class="text-sm mb-0">
                                        The ultimate objective is
                                        to improve adolescent health outcomes by providing
                                        accessible and effective health check-ups tailored
                                        to the needs of adolescents in Ghana.
                                    </p>
                                </div>
                            </div>
                            {/*
                            <div class="feature is-revealing">
                            <div class="feature-inner">
                                <div class="feature-icon">
                                    <svg width="64" height="64" xmlns="http://www.w3.org/2000/svg">
                                        <defs>
                                            <linearGradient x1="0%" y1="100%" x2="50%" y2="0%" id="feature-4-a">
                                                <stop stop-color="rgb(41, 110, 229)" stop-opacity=".8" offset="0%"/>
                                                <stop stop-color="rgb(41, 110, 229)" stop-opacity=".16" offset="100%"/>
                                            </linearGradient>
                                            <linearGradient x1="50%" y1="100%" x2="50%" y2="0%" id="feature-4-b">
                                                <stop stop-color="b79a64" offset="0%"/>
                                                <stop stop-color="#ffbf0d" stop-opacity=".798" offset="49.935%"/>
                                                <stop stop-color="b79a64" stop-opacity="0" offset="100%"/>
                                            </linearGradient>
                                        </defs>
                                        <g fill="none" fill-rule="evenodd">
                                            <path d="M24 64H0V40c0-13.255 10.745-24 24-24h24v24c0 13.255-10.745 24-24 24" fill="url(#feature-4-a)" transform="matrix(-1 0 0 1 48 0)"/>
                                            <path d="M40 48H16V24C16 10.745 26.745 0 40 0h24v24c0 13.255-10.745 24-24 24" fill="url(#feature-4-b)"/>
                                        </g>
                                    </svg>
                                </div>
                                <h3 class="feature-title mt-24">Discover</h3>
                                <p class="text-sm mb-0">A pseudo-Latin text used in web design, layout, and printing in place of things to emphasise design.</p>
                            </div>
                        </div>
                        <div class="feature is-revealing">
                            <div class="feature-inner">
                                <div class="feature-icon">
                                    <svg width="64" height="64" xmlns="http://www.w3.org/2000/svg">
                                        <defs>
                                            <linearGradient x1="0%" y1="100%" x2="50%" y2="0%" id="feature-5-a">
                                                <stop stop-color="rgb(41, 110, 229)" stop-opacity=".8" offset="0%"/>
                                                <stop stop-color="rgb(41, 110, 229)" stop-opacity=".16" offset="100%"/>
                                            </linearGradient>
                                            <linearGradient x1="50%" y1="100%" x2="50%" y2="0%" id="feature-5-b">
                                                <stop stop-color="#b79a64" offset="0%"/>
                                                <stop stop-color="#ffbf0d" stop-opacity=".798" offset="49.935%"/>
                                                <stop stop-color="#b79a64" stop-opacity="0" offset="100%"/>
                                            </linearGradient>
                                        </defs>
                                        <g fill="none" fill-rule="evenodd">
                                            <path d="M24 63H0V39c0-13.255 10.745-24 24-24h24v24c0 13.255-10.745 24-24 24" fill="url(#feature-5-a)" transform="matrix(-1 0 0 1 48 0)"/>
                                            <path d="M40 48H16V24C16 10.745 26.745 0 40 0h24v24c0 13.255-10.745 24-24 24" fill-opacity=".24" fill="url(#feature-5-a)" transform="matrix(-1 0 0 1 80 0)"/>
                                            <path d="M10.113 10.113v22c0 12.15 9.85 22 22 22h22v-22c0-12.15-9.85-22-22-22h-22z" fill="url(#feature-5-b)" transform="rotate(45 32.113 32.113)"/>
                                        </g>
                                    </svg>
                                </div>
                                <h3 class="feature-title mt-24">Discover</h3>
                                <p class="text-sm mb-0">A pseudo-Latin text used in web design, layout, and printing in place of things to emphasise design.</p>
                            </div>
                        </div>
                        <div class="feature is-revealing">
                            <div class="feature-inner">
                                <div class="feature-icon">
                                    <svg width="64" height="64" xmlns="http://www.w3.org/2000/svg">
                                        <defs>
                                            <linearGradient x1="50%" y1="100%" x2="50%" y2="0%" id="feature-6-a">
                                                <stop stop-color="#b79a64" offset="0%"/>
                                                <stop stop-color="#ffbf0d" stop-opacity=".798" offset="49.935%"/>
                                                <stop stop-color="#b79a64" stop-opacity="0" offset="100%"/>
                                            </linearGradient>
                                            <linearGradient x1="58.893%" y1="100%" x2="58.893%" y2="18.531%" id="feature-6-b">
                                                <stop stop-color="rgb(41, 110, 229)" stop-opacity=".8" offset="0%"/>
                                                <stop stop-color="rgb(41, 110, 229)" stop-opacity="0" offset="100%"/>
                                            </linearGradient>
                                        </defs>
                                        <g fill="none" fill-rule="evenodd">
                                            <path d="M24 48H0V24C0 10.745 10.745 0 24 0h24v24c0 13.255-10.745 24-24 24" fill="url(#feature-6-a)"/>
                                            <path fill-opacity=".64" fill="url(#feature-6-b)" d="M24 29.229h40V64H0z"/>
                                        </g>
                                    </svg>
                                </div>
                                <h3 class="feature-title mt-24">Discover</h3>
                                <p class="text-sm mb-0">A pseudo-Latin text used in web design, layout, and printing in place of things to emphasise design.</p>
                            </div>
                        </div>
                        */}
                        </div>
                    </div>
                </div>
            </section>
            <section className="features section" style={{ backgroundColor: '#06101F' }}>
                <div className="container">
                    <div class="features-inner section-inner ">
                        <h2 class="section-title mt-0">Y-Check Ghana Team</h2>
                    </div>
                </div>
                <div class="container2">
                    <div class="box">
                        <div class="top-bar"></div>

                        <div class="details">
                            <img src={avatar} alt="" />
                            <strong>Team Member</strong>
                            <p>user@gmail.com</p>
                        </div>
                    </div>
                    <div class="box">
                        <div class="top-bar"></div>


                        <div class="details">
                            <img src={avatar} alt="" />
                            <strong>Team Member</strong>
                            <p>user@gmail.com</p>
                        </div>

                    </div>
                    <div class="box">
                        <div class="top-bar"></div>


                        <div class="details">
                            <img src={avatar} alt="" />
                            <strong>Team Member</strong>
                            <p>user@gmail.com</p>
                        </div>

                    </div>
                    <div class="box">
                        <div class="top-bar"></div>

                        <div class="details">
                            <img src={avatar} alt="" />
                            <strong>Team Member</strong>
                            <p>user@gmail.com</p>
                        </div>


                    </div>
                </div>
            </section>
            <footer class="site-footer">
                <div class="container">
                    <div class="site-footer-inner has-top-divider">
                        <div class="footer-copyright">&copy; 2024 Y-Check Ghana, all rights reserved.</div>
                    </div>
                </div>
            </footer>

        </div>
    )
}

export default Home
