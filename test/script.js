import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";


gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    const lenis = new lenis();
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    const CONFIG = {
        cardCount : 16,
        cardWidth: 250,
        cardHeight: 300,
        animationDuration: 0.75,
        animationOverlap: 0.5,
        headingFadeDuration: 0.5,
        headings: [
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor repellat laudantium magni!",
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor repellat laudantium magni!",
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor repellat laudantium magni!",
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor repellat laudantium magni!",
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor repellat laudantium magni!",
        ],
    };

    const gallery = document.querySelector(".gallery");
    const galleryHeading = document.querySelector(".gallery h1");

    let viewport = {
        centerX : window.innerWidth / 2,
        centerY : window.innerHeight / 2 ,
        rangeMin : Math.min(window, innerWidth, window,innerHeight) * 0.35,
        rangeMax : Math.max(window , innerWidth , window.innerHeight) * 0.7,
    };

    let state = {
        activeCards: [],
        currentSection: 0,
        isAnimating : false,
    };

    function updateViewport(){
        viewport.centerX = window.innerWidth / 2;
        viewport.centerY = window.innerHeight / 2;
        viewport.rangeMin = Math.min(window, innerWidth, window,innerHeight) * 0.35;
        viewport.rangeMax = Math.max(window , innerWidth , window.innerHeight) * 0.7;
    };
    
    function getEdgePosition(centerX, centerY){
        const distances ={
            left: centerX,
            right: window.innerWidth - centerX ,
            top: centerY,
            bottom: window.innerHeight - centerY,
        };
        const minDistance = Math.min(...Object.values(distances));
        const cardCenterOffsetX = CONFIG.cardWidth / 2;
        const cardCenterOffsetY = CONFIG.cardHeight / 2;
        const offsetVariation = () => (Math.floor(Math.random() -0.5) * 400);

        if (minDistance === distances.left){
            return {
                x : -300 - Math.random() *200 ,
                y : centerY - cardCenterOffsetY + offsetVariation,
            };
        }
        if ( minDistance === distances.right){
            return{
                x : window.innerWidth + 50 + Math.random() * 200,
                y : centerY - cardCenterOffsetY + offsetVariation(), 
            };
        }
        if ( minDistance === distances.top){
            return{
                x : centerX - cardCenterOffsetX + offsetVariation() ,
                y : -400 - Math.random() * 200, 
            };
        }
        return{
            x : centerX - cardCenterOffsetX + offsetVariation(),
            y : window.innerHeight + 50 + Math.random() * 200,
        };
    }

    function createCards (setNumber) {
        const cards = [];

        for (let i = 0 ; i < CONFIG.cardCount; i++){
            const card = document.createElement("div");
            card.classList.add("card");

            const img = document.createElement("img");
            img.src = `set${setNumber}/img${i+1}.jpg`;
            card.appendChild(img);
            const angle = Math.random() * Math.PI() * 2 ;
            const radius = viewport.rangeMin + Math.random() * (viewport.rangeMax - viewport.rangeMin);
            const centerX = viewport.centerX + Math.cos(angle) * radius ;
            const centerY = viewport.centerY + Math.sin(angle) * radius ;
            gsap.set(card, {
                left : centerX - CONFIG.cardWidth / 2,
                top : centerY - CONFIG.cardHeight / 2,
                roatation : Math.random() * 50 - 25 ,
            })
            gallery.appendChild(card);
            cards.push({element:card, centerX, centerY});
        }
        return cards;
    };

    function animateHeading(newText){
        return gsap.timeline().to(galleryHeading, {
            opacity: 0, duration: CONFIG.headingFadeDuration, ease: "power2.inOut",
        }).call(() => {
            gallery.Heading.textContent = newText;
        }).to(galleryHeading, {
            opacity: 1, duration: CONFIG.headingFadeDuration, ease: "power2.inOut",
        })
    }

    function animateCards(exitingCards , enteringCards){
        const tl = gsap.timeline();

        exitingCards.forEach(({element, centerX , centerY}) => {
            const targetEdge = getEdgePosition(centerX, centerY);
            tl.to(element, {
                left: targetEdge.x,
                top: targetEdge.y,
                roatation: Math.random() *180 - 90 ,
                ease: "power2.in",
                onComplete: () => element.remove(),
                duration: CONFIG.animationDuration,
            }, 0,);
        });

        enteringCards.forEach(({element, centerX, centerY}) => {
            const targetEdge = getEdgePosition(centerX, centerY);
            gsap.set(element, {
                left: targetEdge.x,
                top: targetEdge.y,
                roatation: Math.random() *180 - 90 ,
            });
            tl.to(element ,{ 
                left:centerX - CONFIG.cardWidth / 2,
                top: centerY - CONFIG.cardHeight /2,
                roatation: Math.random() *50 -25,
                ease: "power2.out",
            }, CONFIG.animationOverlap,
        );
        });
        return tl;
    }

    function getSectionIndex (progress){
        if ( progress < 0.25 ) return 0;
        if ( progress < 0.5 ) return 1;
        if ( progress < 0.75 ) return 2;
        return 3;
    }

    function reintialize(){
        state.activeCards.forEach(({element}) => element.remove());
        updateViewport();
        state.activeCards = createCards(state.currentSection +1) ;
    }

    state.activeCards = createCards(1);
    galleryHeading.textContent = CONFIG.headings[0];
    gsap.set(galleryHeading, {opacity: 1}); 

    ScrollTrigger.create({
        trigger: ".gallery",
        start: "top top",
        end: () => `+=${window.innerHeight * 6}`,
        pin: true,
        pinSpacing: true,
    });
})