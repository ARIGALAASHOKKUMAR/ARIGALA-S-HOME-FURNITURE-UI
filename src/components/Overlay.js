import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function Overlay() {
  const state = useSelector((state) => state.LoadingReducer);
  const { loadingText, loading } = state;
  const [userLoading, setUserLoading] = useState("Loading, Please Wait...");
  const [randomFact, setRandomFact] = useState("");

  const facts = [
    "India is the world's largest democracy.",
    "India has the third-largest startup ecosystem in the world.",
    "The first successful Indian satellite was launched in 1980.",
    "Aadhaar, India's biometric identification system, is the largest of its kind globally, providing a unique identity to over a billion people.",
    "ISRO's Mars Orbiter Mission (Mangalyaan) made India the first Asian nation to reach Martian orbit.",
    "India has a growing presence in AI research, contributing to advancements in machine learning, natural language processing, and other AI-related fields.",
    "Kuchipudi, a classical dance form of India, originated in the village of Kuchipudi in Andhra Pradesh. It is known for its unique blend of dance, acting, and singing.",
    "Sriharikota, located in Andhra Pradesh, is home to the Satish Dhawan Space Centre (SDSC), the primary launch center for the Indian Space Research Organisation (ISRO).",
    "Andhra Pradesh's forests are home to a wide range of animals, including tigers, elephants, deer, and birds.",
    "The Andhra Pradesh Forest Department actively plants trees to increase green cover and combat deforestation.",
    "Forest guards patrol the forests to prevent illegal activities like poaching and logging.",
    "The Andhra Pradesh Forest Department works to prevent and manage forest fires, which can harm wildlife and destroy habitats.",
    "The Andhra Pradesh Forest Department promotes eco-tourism, allowing people to visit forests responsibly and learn about conservation.",
    "The Andhra Pradesh Forest Department involves local communities in activities like tree planting and wildlife conservation to raise awareness and support.",
    "The Andhra Pradesh Forest Department enforces laws and regulations to ensure that forests and wildlife are protected, including laws against hunting and deforestation.",
    "The Andhra Pradesh Forest Department works hard every day to make sure forests are happy, healthy places for plants, animals, and people.",
    "The Andhra Pradesh Forest Department runs wildlife sanctuaries to protect endangered species like tigers and leopards.",
    "The department uses modern technology like drones to monitor and safeguard forests from illegal activities.",
    "Eco-tourism projects run by the department offer trekking, bird watching, and forest exploration activities.",
    "The department collaborates with educational institutions to raise awareness about environmental conservation.",
    "The Andhra Pradesh Forest Department enforces laws and regulations to ensure that forests and wildlife are protected, including laws against hunting and deforestation.",
    "The Andhra Pradesh Forest Department runs wildlife sanctuaries to protect endangered species like tigers and leopards.",
    "The department uses modern technology like drones to monitor and safeguard forests from illegal activities.",
    "Eco-tourism projects run by the department offer trekking, bird watching, and forest exploration activities.",
    "The department collaborates with educational institutions to raise awareness about environmental conservation.",
    "The Andhra Pradesh Forest Department enforces laws and regulations to ensure that forests and wildlife are protected, including laws against hunting and deforestation.",
    "The Andhra Pradesh Forest Department runs wildlife sanctuaries to protect endangered species like tigers and leopards.",
    "The department uses modern technology like drones to monitor and safeguard forests from illegal activities.",
  ];

  useEffect(() => {
    if (loadingText && loadingText.trim() !== "") {
      setUserLoading(loadingText);
    }

    const randomArray = new Uint32Array(1);
    window.crypto.getRandomValues(randomArray);
    const randomIndex = randomArray[0] % facts.length;

    setRandomFact(facts[randomIndex]);
  }, [loadingText, loading]);

  const isTeluguFact = /[\u0C00-\u0C7F]/.test(randomFact);

  if (!loading) return null;

  return (
    <div className="react-loader-containerr" style={{width:'100%',position:'fixed',left:0,top:0,right:0,bottom:0,display:'flex',justifyContent:'center',alignItems:'center',zIndex:9999,background:'rgba(0,0,0,0.35)'}}>
      <div className="react-loaderr" style={{ textAlign: 'center', background:'#fff', padding:24, borderRadius:8 }}>
        <i className="fa fa-refresh fa-spin" style={{ fontSize: 24 }} />
        &nbsp; {userLoading}
        <p style={isTeluguFact ? { fontFamily: "Sree Krushnadevaraya, serif", fontWeight: 300, fontSize: "18px", fontStyle: "normal", lineHeight: "1.2" } : {fontSize: "16px"}}>{randomFact}</p>

       </div>  
    </div>
  );
}

export default Overlay;
