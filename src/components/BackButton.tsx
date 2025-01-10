"use client";

import { useRouter } from "next/navigation";
import { ButtonHTMLAttributes } from "react";

import { Button } from "@/components/ui/button";

type Props = {
  title: string;
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | null
    | undefined;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function BackButton({
  title,
  className,
  variant,
  ...props
}: Props) {
  const router = useRouter();
  return (
    <Button
      title={title}
      variant={variant}
      className={className}
      onClick={() => router.back()}
      {...props}
    >
      {title}
    </Button>
  );
}
