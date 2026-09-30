// Single source of truth for quote pricing. Package prices mirror the ranges on
// the homepage (HomePricing); page allowances and add-on rates are quote-only.
// All amounts are whole US dollars.

export type QuotePackage = 'launch' | 'grow'

// 'business' quotes come from Chasing a Chance. 'inKind' records work donated personally
// (e.g. to a political campaign) and must carry no company branding. On in-kind records,
// labor is uncompensated volunteer service, which W. Va. Code §3-8-1a excludes from
// "contribution", so it carries no value. Only purchased goods ('item' add-ons) are
// in-kind contributions, reported at fair market value.
export type QuoteKind = 'business' | 'inKind'
export type InKindType = 'volunteer' | 'item'
export type InKindProject = 'website' | 'printDesign' | 'photography' | 'other'

// Main line item for each kind of in-kind work. Website work also lists pages and features.
const inKindProjects: Record<InKindProject, { option: string; line: string }> = {
  website: { option: 'Website', line: 'Website design & development' },
  printDesign: { option: 'Print or graphic design', line: 'Graphic design' },
  photography: { option: 'Photo session', line: 'Photography session' },
  other: { option: 'Other', line: 'Volunteer services' },
}

export const inKindProjectOptions = Object.entries(inKindProjects).map(([value, { option }]) => ({
  label: option,
  value,
}))

export type QuoteTier = {
  name: string
  basePrice: number
  priceRange: [number, number]
  includedPages: number
  photographyIncluded: boolean
  carePlanMonthly: number
  includes: string[]
}

export const quoteTiers: Record<QuotePackage, QuoteTier> = {
  launch: {
    name: 'Launch',
    basePrice: 2000,
    priceRange: [2000, 2500],
    includedPages: 5,
    photographyIncluded: false,
    carePlanMonthly: 150,
    includes: [
      'Custom design',
      'Mobile optimization',
      'Contact or lead forms',
      'Basic search setup',
      'Analytics',
      'Launch support',
    ],
  },
  grow: {
    name: 'Grow',
    basePrice: 4000,
    priceRange: [4000, 5000],
    includedPages: 10,
    photographyIncluded: true,
    carePlanMonthly: 200,
    includes: [
      'Everything included with Launch',
      'Content management platform',
      'Blog, news, or resource publishing',
      'Newsletter integration',
      'Enhanced lead capture',
      'Expanded analytics',
      'Professional photography',
    ],
  },
}

export const quoteRates = {
  additionalPage: 150,
  photography: 400,
}

export const quoteValidDays = 30

export type QuoteInput = {
  kind?: QuoteKind | null
  projectType?: InKindProject | null
  workDescription?: string | null
  showEstimatedValue?: boolean | null
  estimatedValue?: number | null
  package?: QuotePackage | null
  packagePrice?: number | null
  pages?: number | null
  photography?: boolean | null
  addOns?:
    | {
        label?: string | null
        description?: string | null
        price?: number | null
        inKindType?: InKindType | null
      }[]
    | null
  discount?: number | null
  discountLabel?: string | null
  includeCarePlan?: boolean | null
  carePlanPrice?: number | null
}

export type QuoteLine = {
  label: string
  detail?: string
  amount: number
  included?: boolean
  volunteer?: boolean
  // Reference value for a volunteer line; never part of the total.
  estimate?: number
}

export type QuoteSummary = {
  tier: QuoteTier
  lines: QuoteLine[]
  total: number
  monthly: number | null
  hasVolunteer: boolean
  // Sum of volunteer estimates when showEstimatedValue is on, otherwise null.
  estimatedVolunteerValue: number | null
}

const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export function formatMoney(amount: number): string {
  return money.format(amount)
}

export function calculateQuote(input: QuoteInput): QuoteSummary {
  const pkg = input.package ?? 'launch'
  const tier = quoteTiers[pkg]
  const inKind = input.kind === 'inKind'
  const lines: QuoteLine[] = []

  if (inKind) {
    // Described without the studio's package names; every labor line is volunteer.
    const project = input.projectType ?? 'website'
    const website = project === 'website'
    const estimate = (value: number | null | undefined) =>
      input.showEstimatedValue && value ? value : undefined
    if (website) {
      const includes =
        pkg === 'grow' ? [...quoteTiers.launch.includes, ...tier.includes.slice(1)] : tier.includes
      const pages = Math.max(input.pages ?? tier.includedPages, 0)
      const extraPages = Math.max(pages - tier.includedPages, 0)
      lines.push({
        label: inKindProjects.website.line,
        detail: [`${pages} ${pages === 1 ? 'page' : 'pages'}`, ...includes].join(' · '),
        amount: 0,
        volunteer: true,
        estimate: estimate(
          (input.packagePrice ?? tier.basePrice) + extraPages * quoteRates.additionalPage,
        ),
      })
    } else {
      lines.push({
        label: inKindProjects[project].line,
        detail: input.workDescription || undefined,
        amount: 0,
        volunteer: true,
        estimate: estimate(input.estimatedValue),
      })
    }
    if (website && (tier.photographyIncluded || input.photography)) {
      lines.push({
        label: 'Photography',
        detail: 'On-site photography for the website',
        amount: 0,
        volunteer: true,
        // Grow's package price already covers photography.
        estimate: tier.photographyIncluded ? undefined : estimate(quoteRates.photography),
      })
    }
    for (const addOn of input.addOns ?? []) {
      if (!addOn.label) continue
      const item = addOn.inKindType === 'item'
      lines.push({
        label: addOn.label,
        detail: addOn.description ?? undefined,
        amount: item ? (addOn.price ?? 0) : 0,
        volunteer: !item,
        estimate: item ? undefined : estimate(addOn.price),
      })
    }
    const total = lines.reduce((sum, line) => sum + line.amount, 0)
    const estimatedVolunteerValue = input.showEstimatedValue
      ? lines.reduce((sum, line) => sum + (line.estimate ?? 0), 0)
      : null
    return { tier, lines, total, monthly: null, hasVolunteer: true, estimatedVolunteerValue }
  }

  lines.push({
    label: `${tier.name} package`,
    detail: tier.includes.join(' · '),
    amount: input.packagePrice ?? tier.basePrice,
  })

  const pages = Math.max(input.pages ?? tier.includedPages, 0)
  const extraPages = Math.max(pages - tier.includedPages, 0)
  lines.push({
    label: `Pages (up to ${tier.includedPages})`,
    detail: `${Math.min(pages, tier.includedPages)} included with ${tier.name}`,
    amount: 0,
    included: true,
  })
  if (extraPages > 0) {
    lines.push({
      label: 'Additional pages',
      detail: `${extraPages} × ${formatMoney(quoteRates.additionalPage)}`,
      amount: extraPages * quoteRates.additionalPage,
    })
  }

  if (tier.photographyIncluded) {
    lines.push({
      label: 'Photography',
      detail: `Included with ${tier.name}`,
      amount: 0,
      included: true,
    })
  } else if (input.photography) {
    lines.push({
      label: 'Photography',
      detail: 'On-site photography for your website',
      amount: quoteRates.photography,
    })
  }

  for (const addOn of input.addOns ?? []) {
    if (!addOn.label) continue
    lines.push({
      label: addOn.label,
      detail: addOn.description ?? undefined,
      amount: addOn.price ?? 0,
    })
  }

  if (input.discount) {
    lines.push({ label: input.discountLabel || 'Discount', amount: -Math.abs(input.discount) })
  }

  const total = Math.max(
    lines.reduce((sum, line) => sum + line.amount, 0),
    0,
  )
  const monthly = input.includeCarePlan ? (input.carePlanPrice ?? tier.carePlanMonthly) : null

  return { tier, lines, total, monthly, hasVolunteer: false, estimatedVolunteerValue: null }
}
