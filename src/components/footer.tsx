"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { textVar } from "@/utils/variant";

export default function Footer() {
  return (
    <div className="flex flex-col justify-center items-center leading-none mt-20 w-screen bg-[#C6C19E] py-20">
      <motion.h1
        variants={textVar}
        initial="initial"
        animate="animate"
        className="relative font-bold font-serif text-[200px] flex items-center gap-4 max-md:text-[120px] max-sm:text-[70px]"
      >
        SOCRATES
        <Image
          className="max-md:hidden"
          src="/assets/vector1.svg"
          alt="Vector"
          height={150}
          width={150}
        />
      </motion.h1>
      <u><a href="https://shivacodes.vercel.app"><motion.p className="credit font-bold  font-serif">@Shiva Bajpai</motion.p></a></u> 
    </div>
  );
}
