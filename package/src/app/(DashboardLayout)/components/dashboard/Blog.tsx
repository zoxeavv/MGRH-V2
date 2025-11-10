
import Image from "next/image"
import Link from "next/link"
import { IconBasket, IconStar, IconStarFilled } from "@tabler/icons-react"

import BlankCard from "@/app/(DashboardLayout)/components/shared/BlankCard"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const products = [
  {
    title: "Boat Headphone",
    subheader: "September 14, 2023",
    photo: "/images/products/s4.jpg",
    salePrice: 285,
    fullPrice: 375,
    rating: 4,
  },
  {
    title: "MacBook Air Pro",
    subheader: "September 14, 2023",
    photo: "/images/products/s5.jpg",
    salePrice: 900,
    fullPrice: 650,
    rating: 5,
  },
  {
    title: "Red Velvet Dress",
    subheader: "September 14, 2023",
    photo: "/images/products/s7.jpg",
    salePrice: 200,
    fullPrice: 150,
    rating: 3,
  },
  {
    title: "Cute Soft Teddybear",
    subheader: "September 14, 2023",
    photo: "/images/products/s11.jpg",
    salePrice: 345,
    fullPrice: 285,
    rating: 2,
  },
] as const

const renderRating = (rating: number) => {
  return (
    <div className="flex items-center gap-1" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, index) =>
        index < rating ? (
          <IconStarFilled key={index} className="h-4 w-4 text-amber-500" aria-hidden="true" />
        ) : (
          <IconStar key={index} className="h-4 w-4 text-amber-200" aria-hidden="true" />
        )
      )}
    </div>
  )
}

const Blog = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {products.map((product) => (
        <BlankCard key={product.title} className="group overflow-hidden">
          <div className="relative">
            <Link href="/" className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2">
              <Image
                src={product.photo}
                alt={product.title}
                width={320}
                height={220}
                className="h-52 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                priority={false}
              />
            </Link>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="default"
                    size="icon"
                    className="absolute bottom-4 right-4 h-11 w-11 rounded-full bg-brand text-brand-foreground shadow-lg hover:bg-brand/90"
                    aria-label={`Add ${product.title} to cart`}
                  >
                    <IconBasket className="h-5 w-5" aria-hidden="true" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Add to cart</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="absolute left-4 top-4 inline-flex items-center rounded-full bg-background/80 px-3 py-1 text-xs font-semibold text-muted-foreground backdrop-blur">
              {product.subheader}
            </div>
          </div>

          <div className="space-y-3 p-5">
            <h3 className="text-base font-semibold text-foreground">
              <Link href="/" className="hover:text-primary">
                {product.title}
              </Link>
            </h3>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-semibold text-foreground">${product.salePrice}</span>
                <span className="text-xs text-muted-foreground line-through">${product.fullPrice}</span>
              </div>
              {renderRating(product.rating)}
            </div>
          </div>
        </BlankCard>
      ))}
    </div>
  )
}

export default Blog
