import React from 'react'
import type { Page } from '@/payload-types'
import { Reveal } from '@/components/Reveal'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { NewsletterBlock } from '@/blocks/Newsletter/Component'
import { SocialMediaBlock } from '@/blocks/SocialMedia/Component'
import { PageHeroBlock } from '@/blocks/PageHero/Component'

type LayoutBlock = Page['layout'][number]

export function Blocks({ blocks }: { blocks: LayoutBlock[] }) {
  if (!blocks?.length) return null

  return (
    <>
      {blocks.map((block, i) => {
        const el = (() => {
          switch (block.blockType) {
            case 'pageHero':   return <PageHeroBlock {...(block as any)} />
            case 'cta':        return <CallToActionBlock {...block} />
            case 'content':    return <ContentBlock {...block} />
            case 'mediaBlock': return <MediaBlock {...block} />
            case 'archive':    return <ArchiveBlock {...block} />
            case 'formBlock':  return <FormBlock {...block} />
            case 'newsletter': return <NewsletterBlock {...block} />
            case 'socialMedia': return <SocialMediaBlock {...block} />
            default:           return null
          }
        })()

        if (!el) return null

        return (
          <Reveal key={i} delay={0.05}>
            {el}
          </Reveal>
        )
      })}
    </>
  )
}
