import React from 'react'
import type { Page } from '@/payload-types'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MeetTheCandidateBlock } from '@/blocks/MeetTheCandidate/Component'
import { FightingForBlock } from '@/blocks/FightingFor/Component'
import { NewsletterBlock } from '@/blocks/Newsletter/Component'
import { SocialMediaBlock } from '@/blocks/SocialMedia/Component'

type LayoutBlock = Page['layout'][number]

export function Blocks({ blocks }: { blocks: LayoutBlock[] }) {
  if (!blocks?.length) return null

  return (
    <>
      {blocks.map((block, i) => {
        switch (block.blockType) {
          case 'cta':
            return <CallToActionBlock key={i} {...block} />
          case 'content':
            return <ContentBlock key={i} {...block} />
          case 'mediaBlock':
            return <MediaBlock key={i} {...block} />
          case 'archive':
            return <ArchiveBlock key={i} {...block} />
          case 'formBlock':
            return <FormBlock key={i} {...block} />
          case 'meetTheCandidate':
            return <MeetTheCandidateBlock key={i} {...block} />
          case 'fightingFor':
            return <FightingForBlock key={i} {...block} />
          case 'newsletter':
            return <NewsletterBlock key={i} {...block} />
          case 'socialMedia':
            return <SocialMediaBlock key={i} {...block} />
          default:
            return null
        }
      })}
    </>
  )
}
