'use client'

import Image from "next/image";
import { textVar } from "@/utils/variant";
import {motion} from 'framer-motion'

interface props {
  heading: string;
  content: string;
  img: string;
}

export default function TextCard({
  heading,
  content,
  img,
}: props) {
  return (
    <div
      className={`group uppercase relative text-primary`}
    >
      <div className="absolute bottom-0 left-0 p-5 z-[2]">
        <motion.h1 variants={textVar} initial="initial" whileInView="animate" viewport={{ once: true }} className="relative text-5xl max-md:text-4xl font-bold leading-none flex items-center gap-4 mb-4">
          {heading}
        </motion.h1>
        <motion.p variants={textVar} initial="initial" whileInView="animate" viewport={{ once: true }} className="relative text-sm max-sm:text-[13px]">{content}</motion.p>
      </div>
      <Image
        src={img}
        height={1080}
        width={1080}
        className="grayscale max-md:grayscale-0 h-full w-auto object-cover group-hover:grayscale-0 transition-all"
        alt=""
      />
      <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-t from-[#000] to-[transparent] z-[1]"></div>
    </div>
  );
}
