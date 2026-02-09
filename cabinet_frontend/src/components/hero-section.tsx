'use client'
import React from 'react'
import { Button } from '@/components/ui/button'
import { HeroHeader } from './header'
import { AuroraBackground } from "@/components/ui/aurora-background"
import { motion } from "framer-motion"
import { TypewriterEffect } from "@/components/ui/text-generate-effect";

export function TypewriterEffectDemo() {
  const words = [
    {
      text: "MyConsultia",
      className: "text-[#163362] dark:text-[#163362]",
    },
    {
      text: "vous",
      className: "text-[#163362] dark:text-[#163362]",
    },
    {
      text: "aide",
      className: "text-[#163362] dark:text-[#163362]",
    },
    {
      text: "à",
      className: "text-[#163362] dark:text-[#163362]",
    },
    {
      text: "gérer",
      className: "text-[#163362] dark:text-[#163362]",
    },
    {
      text: "vos",
      className: "text-[#163362] dark:text-[#163362]",
    },
    {
      text: "audiences",
      className: "text-blue-500 dark:text-[#163362]",
    },
    {
      text: "et",
      className: "text-[#163362] dark:text-[#163362]",
    },
    {
      text: "à",
      className: "text-[#163362] dark:text-[#163362]",
    },
    {
      text: "archiver",
      className: "text-blue-500 dark:text-[#163362]",
    },
    {
      text: "vos",
      className: "text-[#163362] dark:text-[#163362]",
    },
    {
      text: "documents",
      className: "text-[#163362] dark:text-[#163362]",
    },
    {
      text: "en",
      className: "text-[#163362] dark:text-[#163362]",
    },
    {
      text: "toute",
      className: "text-[#163362] dark:text-[#163362]",
    },
    {
      text: "sécurité.",
      className: "text-blue-500 dark:text-white",
    },
  ];
  return (
    <div className="flex flex-col items-center justify-center h-[40rem] ">
      <p className="text-[#163362]-600 dark:text-neutral-200 text-base  mb-10">
        Ne ratez plus jamais une Audience.
      </p>
      <TypewriterEffect words={words} className='text-3xl md:text-7xl font-bold text-[#163362] dark:text-white text-center' />
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4 mt-10">
        <button className="w-fit px-4 py-2 rounded-xl border bg-[#163362] dark:bg-white text-white text-sm">
          Rejoindre la version bêta
        </button>
      </div>
    </div>
  );
}
export default function HeroSection() {
  return (
    <>
      <HeroHeader />
      <section className="overflow-x-hidden">
        <AuroraBackground>
          <motion.div
            initial={{ opacity: 0.0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              ease: "easeInOut",
            }}
            className="relative flex flex-col gap-4 items-center justify-center px-4"
          >
            <div className="text-3xl md:text-7xl font-bold text-[#163362] dark:text-white text-center">
              <TypewriterEffectDemo />
            </div>

          </motion.div>
        </AuroraBackground>

      </section>

      <section className="relative mx-auto mt-20 mb-10 max-w-3xl px-6 text-center">


      </section >
    </>
  )
}
