"use client"

// TypeScript React
import SubscribeBox from "./SubscribeBox"

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <footer className="flex flex-col items-center my-16">
      <SubscribeBox />
      <button onClick={scrollToTop} className="mt-10 text-sm underline text-gray-500 cursor-pointer">
      &#8593;Scroll to top
      </button>
    </footer>
  )
}

export default Footer