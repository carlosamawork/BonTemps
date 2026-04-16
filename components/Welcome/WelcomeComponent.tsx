'use client';
import { PortableText } from 'next-sanity';
import s from './WelcomeComponent.module.scss'
import { portableBlockComponentsCredits } from '@/utils/portableText/portableTextCredits';

export default function WelcomeComponent() {

  return (
    <div className={s.welcome}>
      <h1>MGTZM STUDIO</h1>
      {/* <PortableText
        value={project.credits}
        components={portableBlockComponentsCredits()}
      /> */}
    </div>
  )
}