document.addEventListener("scroll", () => {
    let scrollPosition = window.scrollY;
    
    document.getElementById("layer1").style.transform = `translateY(${scrollPosition * 0.3}px)`;
    document.getElementById("layer2").style.transform = `translateY(${scrollPosition * 0.5}px)`;
    document.getElementById("layer3").style.transform = `translateY(${scrollPosition * 0.7}px)`;
});
