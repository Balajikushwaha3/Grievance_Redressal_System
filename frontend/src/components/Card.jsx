import * as React from "react"

const cn = (...classes) => classes.filter(Boolean).join(" ");

export const Card = ({ className, ...props }) => (
  <div className={cn("rounded-lg border bg-white shadow-sm", className)} {...props} />
)

export const CardHeader = ({ className, ...props }) => (
  <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
)

export const CardTitle = ({ className, ...props }) => (
  <h3 className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
)

export const CardContent = ({ className, ...props }) => (
  <div className={cn("p-6 pt-0", className)} {...props} />
)